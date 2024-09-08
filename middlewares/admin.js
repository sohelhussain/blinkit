const jwt = require('jsonwebtoken');
require('dotenv').config();


function validateAdmin(req,res,next){
    try {
        let token = req.cookies.token;
        if(!token) return res.send('you need to login first');
    
        let data = jwt.verify(token, process.env.JWT_KEY)
        req.user = data;
        next();
    } catch (error) {
        res.send(error.message);
    }
}

module.exports = validateAdmin;