const mongoose = require('mongoose');
const Joi = require('joi');

// Payment Schema with Mongoose Validations
const paymentSchema = mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'order',
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0 // Amount should not be negative
    },
    method: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    transactionId: {
        type: String,
        required: true,
        unique: true, // Ensures that each transaction ID is unique
    }
}, { timestamps: true });

// Joi Validation Function for Payment
const validatePayment = (payment) => {
    const schema = Joi.object({
        order: Joi.string().required(), // ObjectId should be a string
        amount: Joi.number().min(0).required(), // Should be a non-negative number
        method: Joi.string().required(),
        status: Joi.string().required(),
        transactionId: Joi.string().required()
    });

    return schema.validate(payment);
};

module.exports = {
    paymentModel: mongoose.model('payment', paymentSchema),
    validatePayment
};