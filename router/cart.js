const express = require('express');
const router = express.Router();
const {categoryModel} = require('../models/category');
const {validateAdmin, userIsLoggedIn} = require('../middlewares/admin');
const { productModel } = require('../models/product');


router.get('/', userIsLoggedIn, async (req, res) => {
    let cart = await categoryModel.find({user: req.session.passport.user})
    res.send(cart)
});
router.post('/add/:id', userIsLoggedIn, async (req, res) => {
    let cart = await categoryModel.findOne({user: req.session.passport.user})
    let product = await productModel.findOne({id: req.params.id})
    if(!cart){
        cart = await categoryModel.create({
            user: req.session.passport.user,
            product:[req.params.id],
            totalPrice: Number(product.price)
        })
    }else{
        cart.product.push(req.params.id)
        cart.totalPrice = Number(cart.totalPrice) + Number(product.price);
        await cart.save();
    }
    res.send(cart)
});

module.exports = router;