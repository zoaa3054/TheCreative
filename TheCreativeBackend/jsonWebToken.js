const jwt = require('jsonwebtoken');
require('dotenv').config();

const USER_JWT_SECRET = process.env.USER_JWT_SECRET;
const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET;


module.exports = {
    createUserJWT: (username)=>{
        return jwt.sign({username}, USER_JWT_SECRET, {expiresIn: "5h"});
    },

    checkUserJWT: (req, res, next)=>{
        const token = req.cookies.theCreativeAuthToken;

        if (!token) return res.status(401).json({error: "Unauthorized"});

        jwt.verify(token, USER_JWT_SECRET, (error, supposedUsername)=>{
            if(error) return res.status(403).json({error: "Forbidden"});
            req.username = supposedUsername.username;
            
            next();
        });
    },
    createAdminJWT: (username)=>{
        return jwt.sign({username}, ADMIN_JWT_SECRET, {expiresIn: "5h"});
    },

    checkAdminJWT: (req, res, next)=>{
        const token = req.cookies.theCreativeAuthToken;

        if (!token) return res.status(401).json({error: "Unauthorized"});

        jwt.verify(token, ADMIN_JWT_SECRET, (error, supposedUsername)=>{
            if(error) return res.status(403).json({error: "Forbidden"});
            req.username = supposedUsername.username;
            
            next();
        });
    }
}