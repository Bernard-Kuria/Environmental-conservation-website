import { redisClient } from "../utils/db.js";
import { nanoid } from "nanoid";

// Create a new review
export const createReview = async (req, res) => {
  try {
    const { rating, reviewText } = req.body;
    const userId = req.user.userId;
    const productId = req.params.productId;
    const reviewId = nanoid();
    const timestamp = Date.now();

    // Store the review
    await redisClient.hSet(`review:${reviewId}`, {
      userId,
      productId,
      rating,
      reviewText,
      timestamp
    });

    // Associate the review with the product
    await redisClient.sAdd(`product:${productId}:reviews`, `review:${reviewId}`);

    // Optionally, associate the review with the user
    await redisClient.sAdd(`user:${userId}:reviews`, `review:${reviewId}`);

    res.status(201).json({ message: "Review created successfully", reviewId });
  } catch (error) {
    res.status(500).json({ message: "Error creating review", error: error.message });
  }
};

// Get a specific review
export const getReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const review = await redisClient.hGetAll(`review:${reviewId}`);

    if (Object.keys(review).length === 0) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.json(review);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving review", error: error.message });
  }
};

// Update a review
export const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, reviewText } = req.body;
    const userId = req.user.userId;

    // Check if the review exists and belongs to the user
    const existingReview = await redisClient.hGetAll(`review:${reviewId}`);
    if (Object.keys(existingReview).length === 0) {
      return res.status(404).json({ message: "Review not found" });
    }
    if (existingReview.userId !== userId) {
      return res.status(403).json({ message: "Not authorized to update this review" });
    }

    // Update the review
    await redisClient.hSet(`review:${reviewId}`, {
      rating,
      reviewText,
      timestamp: Date.now()
    });

    res.json({ message: "Review updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating review", error: error.message });
  }
};

// Delete a review
export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.userId;

    // Check if the review exists and belongs to the user
    const existingReview = await redisClient.hGetAll(`review:${reviewId}`);
    if (Object.keys(existingReview).length === 0) {
      return res.status(404).json({ message: "Review not found" });
    }
    if (existingReview.userId !== userId) {
      return res.status(403).json({ message: "Not authorized to delete this review" });
    }

    // Delete the review
    await redisClient.del(`review:${reviewId}`);

    // Remove the association with the product
    await redisClient.sRem(`product:${existingReview.productId}:reviews`, `review:${reviewId}`);

    // Remove the association with the user
    await redisClient.sRem(`user:${userId}:reviews`, `review:${reviewId}`);

    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting review", error: error.message });
  }
};

// Get all reviews for a product
export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviewIds = await redisClient.sMembers(`product:${productId}:reviews`);
    
    const reviews = await Promise.all(
      reviewIds.map(reviewId => redisClient.hGetAll(reviewId))
    );

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving product reviews", error: error.message });
  }
};
