// routes/products.js
const express = require('express');
const router = express.Router();
const { productModel, validateProduct } = require('../models/product');
const { categoryModel } = require('../models/category');
const { cartModel } = require('../models/cart');
const upload = require('../config/multer_config');
const { validateAdmin, userIsLoggedIn } = require('../middlewares/admin');
const streamUpload = require('../utils/streamUpload'); // Utility function for Cloudinary upload
const redisClient = require('../config/redisClient'); // Import Redis client from config

// Create a new product
router.post('/', upload.single('image'), async (req, res) => {
  try {
    let { name, price, category, stock, description } = req.body;

    // Check if an image is provided
    if (!req.file) {
      return res.send('Image is required');
    }

    // Check Redis cache for existing upload result
    const cachedUpload = await redisClient.get(req.file.originalname);
    let imageUrl;

    if (cachedUpload) {
      // Use cached URL if available
      imageUrl = cachedUpload;
      console.log('Using cached Cloudinary URL:', imageUrl);
    } else {
      // Upload image to Cloudinary if not cached
      const result = await streamUpload(req);
      imageUrl = result.secure_url;

      // Cache the upload result in Redis
      await redisClient.set(req.file.originalname, imageUrl);
      console.log('Image uploaded to Cloudinary:', imageUrl);
    }

    // Validate product data
    const { error } = validateProduct({
      name,
      price,
      category,
      stock,
      description,
      image: imageUrl, // Use the Cloudinary URL
    });

    if (error) return res.send(error.message);

    // Check if category exists, if not create it
    let isCategory = await categoryModel.findOne({ name: category });
    if (!isCategory) {
      await categoryModel.create({ name: category });
    }

    // Create a new product with the Cloudinary image URL
    await productModel.create({
      name,
      price,
      category,
      stock,
      description,
      image: imageUrl,
    });

    res.redirect('/admin/dashboard');
  } catch (error) {
    res.send(error.message);
  }
});

module.exports = router;