const mongoose = require('mongoose');
const Joi = require('joi');

// Category Schema with Mongoose Validations
const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
        trim: true // Remove extra spaces
    }
}, { timestamps: true });

// Joi Validation Function for Category
const validateCategory = (category) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required()
    });

    return schema.validate(category);
};

module.exports = {
    categoryModel: mongoose.model('category', categorySchema),
    validateCategory
};