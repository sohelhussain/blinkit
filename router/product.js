const express = require('express');
const router = express.Router();
const {productModel,validateProduct} = require('../models/product');
const {categoryModel} = require('../models/category');
const upload = require('../config/multer_config');
const {validateAdmin, userIsLoggedIn} = require('../middlewares/admin')

router.get('/', userIsLoggedIn,async (req, res) => {
    const results = await productModel.aggregate([
        {
            // Group by 'category' and push product details to an array
            $group: {
                _id: "$category",
                products: { $push: "$$ROOT" } // Add all product details
            }
        },
        {
            // Use $project to limit the number of products in each category to 10
            $project: {
                _id: 1,
                products: { $slice: ["$products", 10] } // Limit to first 10 products
            }
        }
    ]);


    let rnproducts = await productModel.aggregate([{$sample: {size:3}}]) // Get all random products

    // Format the results to an object with category names as keys
    const formattedResult = results.reduce((acc, curr) => {
        acc[curr._id] = curr.products; // Use category name as key
        return acc;
    }, {});
    res.render('index',{products: formattedResult, rnproducts, somethingInCart: true});
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