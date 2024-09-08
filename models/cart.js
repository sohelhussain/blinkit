const mongoose = require('mongoose');
const Joi = require('joi');

// Cart Schema with Mongoose Validations
const cartSchema = mongoose.Schema({
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
        min: 0 // Price should not be negative
    }
}, { timestamps: true });

// Joi Validation Function for Cart
const validateCart = (cart) => {
    const schema = Joi.object({
        user: Joi.string().required(), // ObjectId should be a string
        products: Joi.array().items(Joi.string()).required(), // Array of ObjectIds as strings
        totalPrice: Joi.number().min(0).required() // Price must be non-negative
    });

    return schema.validate(cart);
};

module.exports = {
    cartModel: mongoose.model('cart', cartSchema),
    validateCart
};