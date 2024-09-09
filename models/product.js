const mongoose = require('mongoose');
const Joi = require('joi');

// Product Schema with Mongoose Validations
const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 100,
        trim: true // Remove extra spaces
    },
    price: {
        type: Number,
        required: true,
        min: 0 // Price should not be negative
    },
    category: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    stock: {
        type: Number,
        required: true,
        default: true // Default to true, meaning in stock
    },
    description: {
        type: String,
        trim: true
    },
    image: {
        type: String,
    }
}, { timestamps: true });

// Joi Validation Function for Product
const validateProduct = (product) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(100).required(),
        price: Joi.number().min(0).required(), // Should be a non-negative number
        category: Joi.string().min(3).max(50).required(),
        stock: Joi.number().required(),
        description: Joi.string().optional(),
        image: Joi.string().optional(),
    });

    return schema.validate(product);
};

module.exports = {
    productModel: mongoose.model('product', productSchema),
    validateProduct
};