import { redisClient } from "../utils/db.js"
import { nanoid } from "nanoid";


const searchProducts = async (req, res) => {
  const { category, condition, searchTerm, limit, startIndex, sort, order } = req.query;

  try {
    // 1. Get all product keys:
    const keys = await redisClient.keys('product:*');

    // 2. Pre-fetch product data with pipeline:
    const pipeline = redisClient.multi();
    keys.forEach(key => pipeline.hGetAll(key));
    const preFetchedProducts = await pipeline.exec();

    // 3. Filter products based on criteria:
    let filteredProducts = preFetchedProducts.map(result => ({ id: result[1].id, ...result[1] }));

    filteredProducts = filteredProducts.filter(product => {
      const matchesCategory = !category || product.category === category;
      const matchesCondition = !condition || product.condition === condition;
      const matchesSearch = !searchTerm || 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesCategory && matchesCondition && matchesSearch;
    });

    // 4. Sort products:
    const sortField = sort || 'createdAt';
    const sortOrder = order === 'asc' ? 1 : -1;

    filteredProducts.sort((a, b) => {
      const valueA = a[sortField];
      const valueB = b[sortField];
      
      if (valueA < valueB) return -1 * sortOrder;
      if (valueA > valueB) return 1 * sortOrder;
      return 0;
    });

    // 5. Apply pagination:
    const start = parseInt(startIndex) || 0;
    const end = start + (parseInt(limit) || 9);
    const paginatedProducts = filteredProducts.slice(start, end);

    // 6. Format and return results:
    const formattedProducts = paginatedProducts.map(product => ({
      ...product,
      price: parseFloat(product.price),
      createdAt: new Date(product.createdAt),
      updatedAt: new Date(product.updatedAt)
    }));

    res.json(formattedProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// Get an e-waste product
const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await redisClient.hGetAll(`product:${id}`);
    if (Object.keys(product).length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const reviewIds = await redisClient.sMembers(`product:${id}:reviews`);

    const pipeline = redisClient.multi();
    for (const reviewId of reviewIds) {
      pipeline.hGetAll(`review:${reviewId}`);
    }
    const reviews = await pipeline.exec();

    // reviews is an array of arrays, where each inner array contains the Hash fields and values for a single review
    product.reviews = reviews.length > 0 ? reviews.map(reviewData => reviewData[1]) : [];

    res.json({
      id,
      ...product,
      price: parseFloat(product.price),
      averageRating: product.reviews.length > 0
        ? product.reviews.reduce((acc, review) => {
          try {
            return acc + parseInt(review.rating);
          } catch (error) {
            console.error('Error parsing review rating:', review.rating, error);
            return acc; // Or return a default value like 0
          }   
        }, 0) / product.reviews.length
      : 0,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
// create an e-waste product listing
const createProduct = async (req, res) => {
  const { name, category, condition, price, sellerId, images = [], notes, year } = req.body;

  // Generate random ID using nanoid
  const id = nanoid(10);

  try {
    // Prepare product data with images (if provided)
    const productData = {
      name,
      category,
      condition,
      price: price.toString(),
      sellerId: req.user.userId,
      createdAt: new Date().toISOString(),
      reviews: [],
    
      // Include notes and year if provided (assuming they are available)
      notes: notes || "", // Set notes to empty string if not provided
      year: year ? parseInt(year) : null, // Convert year to integer if provided, otherwise set to null
    };    
    if (images.length > 0) {
      productData.images = images; // Add images key if images provided
    }

    // Store product data in Redis Hash
    await redisClient.hSet(`product:${id}`, productData);

    // Add the product ID to the seller's product Set
    await redisClient.sAdd(`user:${sellerId}:products`, id);

    res.status(201).json({ id, ...productData }); // Include images and reviews in response
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update an e-waste product
const updateProduct = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.userId;  // Assuming you have user info in req.user after authentication
  const updates = req.body;

  try {
      // Check if the product exists
      const productExists = await redisClient.exists(`product:${id}`);
      if (!productExists) {
        return res.status(404).json({ error: 'Product not found' });
      }

      // Get the current product details
      const currentProduct = await redisClient.hGetAll(`product:${id}`);

      // Check if the user is the owner of the product
      if (userId !== currentProduct.sellerId) {
          return res.status(401).json({ error: 'You can only update your own products!' });
      }

      // Prepare the updates
      const updatedFields = {
          ...currentProduct,
          ...updates,
          updatedAt: new Date().toISOString()
      };

      // Update the product
      await redisClient.hSet(`product:${id}`, updatedFields);

      // If you're using any search indexing, you might want to update the product there as well
      // For example, if using Redis Search:
      // await redisClient.ft.add('idx:products', `product:${id}`, updatedFields);

      // Fetch the updated product to return in the response
      const updatedProduct = await redisClient.hGetAll(`product:${id}`);

      res.status(200).json({
          id,
          ...updatedProduct,
          price: parseFloat(updatedProduct.price)
      });
  } catch (error) {
      next(error);
  }
};

// Delete an e-waste product
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  try {
      // Check if the product exists
      const productExists = await redisClient.exists(`product:${id}`);
      if (!productExists) {
          return next(errorHandler(404, 'Product not found!'));
      }

      // Get the product details
      const product = await redisClient.hGetAll(`product:${id}`);

      // Check if the user is the owner of the product
      if (userId !== product.sellerId) {
          return next(errorHandler(401, 'You can only delete your own products!'));
      }

      // Delete the product
      await redisClient.del(`product:${id}`);

      // Remove the product ID from the seller's product set
      await redisClient.sRem(`seller:${product.sellerId}:products`, id);

      // If you're using any search indexing, you might want to remove the product from there as well
      // For example, if using Redis Search:
      // await redisClient.ft.del('idx:products', `product:${id}`);

      res.status(200).json('Product has been deleted!');
  } catch (error) {
      next(error);
  }
};

export {
    searchProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    // getProductReviews,
    // getProductsByCategory,
    // getUserProductsByUser,
};
