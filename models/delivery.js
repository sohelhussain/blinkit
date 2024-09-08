const mongoose = require('mongoose');
const Joi = require('joi');

// Delivery Schema with Mongoose Validations
const deliverySchema = mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'order',
        required: true
    },
    deliveryBoy: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
        trim: true
    },
    status: {
        type: String,
        enum: ['pending', 'in-transit', 'delivered', 'cancelled'], // Example statuses
        default: 'pending',
        required: true
    },
    trackingURL: {
        type: String,
    },
    estimatedDeliveryTime: {
        type: Number,
        required: true,
        min: 0 // Estimated delivery time should not be negative
    }
}, { timestamps: true });

// Joi Validation Function for Delivery
const validateDelivery = (delivery) => {
    const schema = Joi.object({
        order: Joi.string().required(), // ObjectId should be a string
        deliveryBoy: Joi.string().min(3).max(50).required(),
        status: Joi.string().valid('pending', 'in-transit', 'delivered', 'cancelled').required(),
        trackingURL: Joi.string().uri(),
        estimatedDeliveryTime: Joi.number().min(0).required() // Should be a non-negative number
    });

    return schema.validate(delivery);
};

module.exports = {
    deliveryModel: mongoose.model('delivery', deliverySchema),
    validateDelivery
};