const mongoose = require('mongoose');
const Joi = require('joi');

// Order Schema with Mongoose Validations
const orderSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
        required: true
    }],
    totalPrice: {
        type: Number,
        required: true,
        min: 0 // Total price should not be negative
    },
    address: {
        type: String,
        required: true,
        minlength: 10, // Minimum length for the address
        maxlength: 255, // Maximum length for the address
        trim: true
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], // Example statuses
        default: 'pending',
        required: true
    },
    payment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'payment',
        required: true
    },
    delivery: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'delivery',
        required: false // Optional: Delivery may not be assigned at the time of order creation
    }
}, { timestamps: true });

// Joi Validation Function for Order
const validateOrder = (order) => {
    const schema = Joi.object({
        user: Joi.string().required(), // ObjectId should be a string
        products: Joi.array().items(Joi.string()).required(), // Array of ObjectIds as strings
        totalPrice: Joi.number().min(0).required(), // Should be a non-negative number
        address: Joi.string().min(10).max(255).required(), // Address must be between 10 and 255 characters
        status: Joi.string().valid('pending', 'processing', 'shipped', 'delivered', 'cancelled').required(), // Must match one of the allowed statuses
        payment: Joi.string().required(), // ObjectId should be a string
        delivery: Joi.string().optional() // Optional delivery ObjectId
    });

    return schema.validate(order);
};

module.exports = {
    orderModel: mongoose.model('order', orderSchema),
    validateOrder
};