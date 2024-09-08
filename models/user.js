const mongoose = require('mongoose');
const Joi = require('joi');

// Address Sub-schema
const AddressSchema = mongoose.Schema({
    state: { type: String, required: true },
    zip: { type: Number, required: true, min: 10000, max: 999999 }, // Assuming a 5-digit zip code
    city: { type: String, required: true },
    address: { type: String, required: true }
});

// User Schema
const userSchema = mongoose.Schema({
    name: { type: String, required: true, minlength: 3, maxlength: 50 },
    email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ }, // Basic email regex
    password: { type: String, minlength: 6 }, // Password minimum length
    phone: { type: Number, minlength: 10, maxlength: 15 },
    addresses: { type: [AddressSchema]}
}, { timestamps: true });

// Joi Validation Function
const validateUser = (user) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6),
        phone: Joi.number().min(1000000000).max(999999999999999), // Assuming phone number length between 10 to 15 digits
        addresses: Joi.array().items(Joi.object({
            state: Joi.string().required(),
            zip: Joi.number().integer().min(10000).max(99999).required(),
            city: Joi.string().required(),
            address: Joi.string().required()
        }))
    });

    return schema.validate(user);
};

module.exports = {
    userModel: mongoose.model('user', userSchema),
    validateUser,
};