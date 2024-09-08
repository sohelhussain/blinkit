const express = require('express');
const router = express.Router();
const {productModel,validateProduct} = require('../models/product');
const {categoryModel} = require('../models/category');
const upload = require('../config/multer_config');

router.get('/', async (req, res) => {
    let product = await productModel.find();
    // res.render('');
    res.send(product);
});



router.post('/', upload.single('image'), async (req, res) => {
    let { name, price, category, stock, description, image } = req.body;
    console.log(req.body);
    
    let {error} = validateProduct({ 
        name, price, category, stock, description, image 
    });

    if(error) return res.send(error.message); 

    let isCategory = await categoryModel.findOne({name: category})

    if(!isCategory){
        await categoryModel.create({name: category})
    }




    await productModel.create({name, price, category, stock, description, image: req.file.buffer})
    res.redirect('/admin/dashboard');
});
module.exports = router;