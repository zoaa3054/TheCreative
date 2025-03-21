const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET_KEY = process.env.JWT_SECRET;


module.exports = {
    createJWT: (username)=>{
        return jwt.sign({username}, SECRET_KEY, {expiresIn: "5h"});
    },

    checkJWT: (req, res, next)=>{
        const token = req.cookies.authToken;

        if (!token) return res.status(401).json({error: "Unauthorized"});

        jwt.verify(token, SECRET_KEY, (error, supposedUsername)=>{
            if(error) return res.status(403).json({error: "Forbidden"});
            req.username = supposedUsername.username;
            
            next();
        });
    }
}