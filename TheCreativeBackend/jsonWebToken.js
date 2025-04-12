const jwt = require('jsonwebtoken');
require('dotenv').config();

const USER_JWT_SECRET = process.env.USER_JWT_SECRET;
const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET;


module.exports = {
    createUserJWT: (username)=>{
        return jwt.sign({username}, USER_JWT_SECRET, {expiresIn: "5h"});
    },

    checkUserJWT: (req, res, next)=>{
        const authHeader = req.headers["authorization"];
        if (!authHeader || !authHeader.startsWith("Bearer "))
            return res.status(401).json({error: "Unauthorized"});
        const token = authHeader.split(" ")[1];

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
        const authHeader = req.headers["authorization"];

        if (!authHeader || !authHeader.startsWith("Bearer "))
            return res.status(401).json({error: "Unauthorized"});

        const token = authHeader.split(" ")[1];

        jwt.verify(token, ADMIN_JWT_SECRET, (error, supposedUsername)=>{
            if(error) return res.status(403).json({error: "Forbidden"});
            req.username = supposedUsername.username;
            
            next();
        });
    },

    checkBothJWTs: (req, res, next)=>{
        const authHeader = req.headers["authorization"];
        let isAdmin = true;
        if (!authHeader || !authHeader.startsWith("Bearer "))
            return res.status(401).json({error: "Unauthorized"});

        const token = authHeader.split(" ")[1];

        jwt.verify(token, ADMIN_JWT_SECRET, (error, supposedAdminUsername)=>{
            if(error){
                jwt.verify(token, USER_JWT_SECRET, (error, supposedStudentUsername)=>{
                    if(error) return res.status(403).json({error: "Forbidden"});
                    req.username = supposedStudentUsername.username;
                    console.log(req.username);
                    isAdmin = false;
                });
            } 
            if (isAdmin) req.username = supposedAdminUsername.username;
            
            next();
        });
    }
}