export function validateProductInput(data) {
    const { title, description, price, condition, category, subcategory, images } = data;

    if (!title || typeof title !== 'string') {
        return 'invalid title';
    }
    if (title.length < 5 || title.length > 100) {
        return 'title must be between 5 and 100 characters';
    }
    if (!description || typeof description !== 'string') {
        return 'invalid description';
    }
    if (description.length < 10 || description.length > 500) {
        return 'description must be between 10 and 500 characters';
    }
    if (!price || isNaN(parseFloat(price))) {
        return 'invalid price';
    }
    if (!condition || typeof condition !== 'string') {
        return 'invalid condition';
    }
    if (![ 'NEW', 'USED', 'REFUBRISHED' ].includes(condition)) {
        return 'invalid condition';
    }
    if (!category || typeof category !== 'string') {
        return 'invalid category';
    }
    if (![
        'MOTHERBOARDS',
        'PROCESSORS',
        'MEMORY',
        'STORAGE',
        'GRAPHICS_CARDS',
        'POWER_SUPPLIES',
        'CASES',
        'COOLING',
        'PERIPHERALS',
        'NETWORKING',
        'OTHER'
    ]) {
        return 'invalid category';
    }
    if (!subcategory || typeof subcategory !== 'string') {
        return 'invalid subcategory';
    }
    if (!images) {
        return 'images are required';
    }
      
      // Convert single image string to an array
    const imageArray = typeof images === 'string' ? [images] : images;
      
    if (!Array.isArray(imageArray) || imageArray.length === 0) {
        return 'invalid images';
    }
    
      // Validate each image URL
    for (const url of imageArray) {
        if (typeof url !== 'string' || !url.trim()) {
          return 'invalid image URL';
        }
    }
    return null;
}
