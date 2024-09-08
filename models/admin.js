const mongoose = require('mongoose');
const Joi = require('joi');

// Admin Schema with Mongoose Validations
const adminSchema = mongoose.Schema({
    name: { type: String, required: true, minlength: 3, maxlength: 50 },
    email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ }, // Basic email validation with regex
    password: { type: String, required: true, minlength: 6 }, // Minimum length for password
    role: { type: String, required: true, enum: ['admin', 'superadmin', 'moderator'] }, // Example roles
}, { timestamps: true });

// Joi Validation Function for Admin
const validateAdmin = (admin) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        role: Joi.string().valid('admin', 'superadmin', 'moderator').required(), // Must match one of the specified roles
    });

    return schema.validate(admin);
};

module.exports = {
    adminModel: mongoose.model('admin', adminSchema),
    validateAdmin
};