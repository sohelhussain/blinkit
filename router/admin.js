const express = require('express');
const router = express.Router();
require('dotenv').config();
const {adminModel} = require('../models/admin');
const {productModel} = require('../models/product');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validateAdmin = require('../middlewares/admin');


if(typeof process.env.NODE_ENV !== undefined && process.env.NODE_ENV === 'development'){
    router.get('/create', async (req, res) => {

       try {
        const salt = await bcrypt.genSalt(10); 
        const hash = await bcrypt.hash("123", salt);

        let admin = new adminModel({
            name:'nav',
            email: 'nav@nav.com',
            password:hash,
            role: 'admin',
        });
        await admin.save();

        console.log(admin);

        const token = jwt.sign({email: 'nav@nav.com'}, process.env.JWT_KEY)
        res.cookie('token', token)
        res.send('admin created')
       } catch (error) {
        res.send(error.message)
       }




    });
}


router.get('/login',(req, res) => {
    res.render('admin_login')
});

router.post('/login', async (req, res) => {
    let {email, password} = req.body;

    let admin = await adminModel.findOne({email})

    if(!admin) return res.send('admin not found')

        const result = await bcrypt.compare(password, admin.password);
        console.log(result);
        if(result){
            const token = jwt.sign({email: admin.email},process.env.JWT_KEY)
        res.cookie('token', token)
        res.redirect('/admin/dashboard')
        }else{
            res.redirect('/admin/login');
        }

});

router.get('/dashboard',validateAdmin,(req, res) => {
    const {prodcount,categcount} = {prodcount:'120',categcount:'5'}
    res.render('admin_dashboard',{prodcount,categcount})
});


router.get('/dashboard',validateAdmin, async(req, res) => {
    const product = await productModel.find()
    res.render('admin_products',{product})
});


router.get('/logout',(req, res) => {
    res.cookie('token','');
    res.redirect('/admin/login');
});

module.exports = router;