const express = require('express');
const router = express.Router();
const { categoryModel } = require('../models/category');
const { validateAdmin, userIsLoggedIn } = require('../middlewares/admin');
const { productModel } = require('../models/product');
const { cartModel } = require('../models/cart');

// Get the cart for the logged-in user
router.get('/', userIsLoggedIn, async (req, res) => {
    try {
        let cart = await cartModel.findOne({ user: req.session.passport.user }).populate('products');
        if (!cart) {
            return res.send('No cart found for this user');
        }

        let cartDataStructure = {};
        cart.products.forEach(product => {
            let key = product._id.toString();
            if (cartDataStructure[key]) {
                cartDataStructure[key].quantity += 1;
            } else {
                cartDataStructure[key] = {
                    ...product.toObject(),
                    quantity: 1
                };
            }
        });

        let finalArray = Object.values(cartDataStructure);
        let finalprice = cart.totalPrice + 34;
        res.render('cart', { cart: finalArray, finalprice});
    } catch (error) {
        res.send(error.message);
    }
});

// Add a product to the cart
router.get('/add/:id', userIsLoggedIn, async (req, res) => {
    try {
        let cart = await cartModel.findOne({ user: req.session.passport.user });

        let product = await productModel.findById(req.params.id);
        if (!product) {
            return res.send('Product not found');
        }

        if (!cart) {
            cart = await cartModel.create({
                user: req.session.passport.user,
                products: [req.params.id],
                totalPrice: Number(product.price),
            });
        } else {
            cart.products.push(req.params.id);
            cart.totalPrice = Number(cart.totalPrice) + Number(product.price);
            await cart.save();
        }

        res.redirect('/products');
    } catch (error) {
        res.send(error.message);
    }
});
router.get('/remove/:id', userIsLoggedIn, async (req, res) => {
    try {
        let cart = await cartModel.findOne({ user: req.session.passport.user });
        let product = await productModel.findById(req.params.id);
        if (!product) {
            return res.send('Product not found');
        }

        if (!cart) {
            return res.send('Cart not found');
        } else {
            let prodId = cart.products.indexOf(req.params.id);
            cart.products.splice(prodId, 1);
            cart.totalPrice = Number(cart.totalPrice) - Number(product.price);
            await cart.save();
        }

        res.redirect('/products');
    } catch (error) {
        res.send(error.message);
    }
});

// Remove a product from the cart
router.get('/remove/:id', userIsLoggedIn, async (req, res) => {
    try {
        let cart = await cartModel.findOne({ user: req.session.passport.user });
        if (!cart) {
            return res.send('Cart not found');
        }

        let index = cart.products.indexOf(req.params.id);
        if (index !== -1) {
            cart.products.splice(index, 1);
            await cart.save();
            res.redirect('/products');
        } else {
            res.send('Product not found in the cart');
        }
    } catch (error) {
        res.send(error.message);
    }
});

module.exports = router;