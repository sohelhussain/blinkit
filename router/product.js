const express = require('express');
const router = express.Router();
const { productModel, validateProduct } = require('../models/product');
const { categoryModel } = require('../models/category');
const { cartModel } = require('../models/cart');
const upload = require('../config/multer_config');
const { validateAdmin, userIsLoggedIn } = require('../middlewares/admin');

// Display Products grouped by category, random products, and cart status
router.get('/', userIsLoggedIn, async (req, res) => {
    try {
        let somethingInCart = false;

        // Aggregation to get products grouped by category, limited to 10 products per category
        const results = await productModel.aggregate([
            {
                $group: {
                    _id: "$category",
                    products: { $push: "$$ROOT" }
                }
            },
            {
                $project: {
                    _id: 1,
                    products: { $slice: ["$products", 10] }
                }
            }
        ]);

        // Get cart for the current user
        let cart = await cartModel.findOne({ user: req.session.passport.user });
        if (cart && cart.products.length > 0) somethingInCart = true;

        // Get 3 random products
        let rnproducts = await productModel.aggregate([{ $sample: { size: 3 } }]);

        // Format the results to an object with category names as keys
        const formattedResult = results.reduce((acc, curr) => {
            acc[curr._id] = curr.products;
            return acc;
        }, {});

        // Calculate cart count
        let cartCount = (cart && cart.products && cart.products.length) ? cart.products.length : "0";

        res.render('index', { products: formattedResult, rnproducts, somethingInCart, cartCount });
    } catch (error) {
        res.send(error.message);
    }
});

// Delete a product by ID
router.get('/delete/:id', validateAdmin, async (req, res) => {
    try {
        if (req.user.admin) {
            await productModel.findOneAndDelete({ _id: req.params.id });
            return res.redirect('/admin/products');
        }
        res.send('Unauthorized access');
    } catch (error) {
        res.send(error.message);
    }
});

// Delete a product using POST method
router.post('/delete', validateAdmin, async (req, res) => {
    try {
        if (req.user.admin) {
            await productModel.findOneAndDelete({ _id: req.body.product_id });
            return res.redirect('back');
        }
        res.send('Unauthorized access');
    } catch (error) {
        res.send(error.message);
    }
});

// Create a new product
router.post('/', upload.single('image'), async (req, res) => {
    try {
        let { name, price, category, stock, description } = req.body;
        let image;

        // Handle file upload
        if (req.file) {
            image = req.file.buffer;
        } else {
            return res.send('Image is required');
        }

        // Validate product data
        const { error } = validateProduct({
            name, price, category, stock, description, image: req.file.buffer
        });

        if (error) return res.send(error.message);

        // Check if category exists, if not create it
        let isCategory = await categoryModel.findOne({ name: category });
        if (!isCategory) {
            await categoryModel.create({ name: category });
        }

        // Create a new product
        await productModel.create({ name, price, category, stock, description, image });
        res.redirect('/admin/dashboard');
    } catch (error) {
        res.send(error.message);
    }
});

module.exports = router;