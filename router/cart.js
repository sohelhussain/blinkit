const express = require('express');
const router = express.Router();
const { categoryModel } = require('../models/category');
const { validateAdmin, userIsLoggedIn } = require('../middlewares/admin');
const { productModel } = require('../models/product');
const { cartModel } = require('../models/cart');

// Get the cart for the logged-in user
router.get('/', userIsLoggedIn, async (req, res) => {
    try {
        let cart = await cartModel.findOne({ user: req.session.passport.user });
        if (!cart) {
            return res.send('No cart found for this user');
        }
        res.send(cart);
    } catch (error) {
        res.send(error.message);
    }
});

// Add a product to the cart
router.get('/add/:id', userIsLoggedIn, async (req, res) => {
    try {
        // Fetch the cart for the user
        let cart = await cartModel.findOne({ user: req.session.passport.user });

        // Fetch the product by ID
        let product = await productModel.findById(req.params.id);
        if (!product) {
            return res.send('Product not found');
        }

        // If no cart exists, create one
        if (!cart) {
            cart = await cartModel.create({
                user: req.session.passport.user,
                products: [req.params.id],
                totalPrice: Number(product.price),
            });
        } else {
            // Add the product to the cart if it exists
            cart.products.push(req.params.id);
            cart.totalPrice = Number(cart.totalPrice) + Number(product.price);
            await cart.save();
        }

        res.send(cart);
    } catch (error) {
        res.send(error.message);
    }
});

// Remove a product from the cart
router.get('/remove/:id', userIsLoggedIn, async (req, res) => {
    try {
        // Fetch the cart for the user
        let cart = await cartModel.findOne({ user: req.session.passport.user });
        if (!cart) {
            return res.send('Cart not found');
        }

        // Find the product index in the cart and remove it
        let index = cart.products.indexOf(req.params.id);
        if (index !== -1) {
            cart.products.splice(index, 1);
            await cart.save();
            res.send('Product removed from cart');
        } else {
            res.send('Product not found in the cart');
        }
    } catch (error) {
        res.send(error.message);
    }
});

module.exports = router;