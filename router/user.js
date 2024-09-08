const express = require('express');
const router = express.Router();
const {userModel} = require('../models/user');

router.get('/login', async (req, res) => {
    res.render('user_login');
});
router.get('/profile', async (req, res) => {
    console.log(req.body.displayName);
    res.send('Welcome')
});
router.get('/logout',(req, res, next) => {
    req.logout(function(err) {
        if (err) {
             return next(err); 
        }
        req.session.destroy((err) => {
            if(err) return next(err);
            res.clearCookie('connect.sid')
            res.redirect('/users/login');
        });
      });
})
module.exports = router;