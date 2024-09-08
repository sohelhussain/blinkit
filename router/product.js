const express = require('express');
const router = express.Router();
const {productModel,validateProduct} = require('../models/product');
const {categoryModel} = require('../models/category');
const upload = require('../config/multer_config');
const validateAdmin = require('../middlewares/admin')

router.get('/', async (req, res) => {
    let product = await productModel.find();
    // res.render('');
    res.send(product);
});

router.get('/delete/:id',validateAdmin, async(req, res) => {
    if(req.user.admin){
        let product = await productModel.findOneAndDelete({_id: req.params.id});
        return res.redirect('/admin/products')
    }
    res.send('this is a delete route')
});
router.post('/delete',validateAdmin, async(req, res) => {
    if(req.user.admin){
        let product = await productModel.findOneAndDelete({_id: req.body.product_id});
        return res.redirect('back')
    }
    res.send('this is a delete route')
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