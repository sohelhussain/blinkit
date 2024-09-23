const mongoose = require('mongoose');
const Joi = require('joi');

// Payment Schema with Mongoose Validations
const paymentSchema = new mongoose.Schema({
    orderId: {
      type: String,
      required: true,
    },
    paymentId: {
      type: String,
    },
    signature: {
      type: String,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: 'pending',
    },
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