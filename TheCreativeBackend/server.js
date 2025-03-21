const express = require('express');
const cors = require('cors');
const fs = require("fs");
const https = require("https");
const { connectToDb, getDb } = require('./db.js');
const { ObjectId } = require('mongodb');
const { getTerm } = require('./utils.js');
const { hash, compare } = require('./bcryptHash.js');
const { createJWT, checkJWT } = require('./jsonWebToken.js');
const cookieParser = require('cookie-parser');

// init server and middleware
const server = express();
server.use(express.json());
server.use(cookieParser());

// Enable CORS to allow frontend requests with credentials
server.use(cors({
    origin: "https://localhost:8080/",  // Change this to your frontend URL
    credentials: true
}));

// Load SSL certificate and private key
const options = {
    key: fs.readFileSync("key.pem"),
    cert: fs.readFileSync("cert.pem"),
};

// connect to db
let db;
connectToDb((error)=>{
    if (!error){
        https.createServer(options, server).listen(8081, () => {
            console.log("backend is running on port 8081!");
        });
        db = getDb();
    }
    else console.log(error);
});

// routes

// GET all users via admin
server.get('/all/users', checkJWT, (req, res)=>{
    let users = [];
    db.collection('users')
    .find({}, {projection: {password: 0}})
    .forEach((user)=>{
        users.push(user);
    })
    .then(()=>{
        res.status(200).json(users);
    })
    .catch((error)=>{
        console.error(error);
        res.status(500).json({error: "Could not fetch users data"})
    });
});


// GET some user with its username and password for login
server.get('/user/login', (req, res)=>{
    let body = req.body;

    db.collection('users')
    .findOne({username: body.username}, {projection: {password: 1}})
    .then(async (result)=>{
        if (result && await compare(body.password, result.password)){
            console.log("username: ", body.username)
            // creating json web token
            const token = createJWT(body.username);

            // Set HTTP-Only Cookie
            res.cookie('authToken', token, {
                httpOnly: true,
                secure: true,
                sameSite: 'Strict',
            });

            res.status(200).json({mssg: "Login Successfuly"});
        }
        else{
            res.status(404).json("User not Found")
        }
    })
    .catch((error)=>{
        console.error(error);
        res.status(500).json({error: "Could not get user"})
    })
})

// GET user info after login
server.get('/user/info', checkJWT, (req, res)=>{

    db.collection('users')
    .findOne({username: req.username}, {projection: {password: 0}})
    .then((result)=>{
        if (result) res.status(200).json(result)
        else res.status(404).json({error: "Could not find user data"})
    })
    .catch((error)=>{
        console.log(error);
        res.status(500).json({error: "Could not fetch user data"});
    })
});

// POST (add) some user in signup
server.post('/user/signup', (req, res)=>{
    let body = req.body;
    console.log(req.headers.origin);
    // check if exists first
    db.collection('users')
    .findOne({username: body.username}, {projection: {password: 0}})
    .then(async (result)=>{
        if (!result){
            Object.assign(body, {
                cash: 0,
                dashboard: [],
                term: getTerm(),
                password: await hash(body.password)
            });
        
            db.collection('users')
            .insertOne(body)
            .then((result)=>{
                res.status(201).json({mssg: "User added Successfuly"});
            })
            .catch((error)=>{
                console.error(error);
                res.status(500).json({error: "Couldn't add the user"});
            })
        }
        else res.status(409).json({error: "User already exists"})
    })
});

// logout

server.post('/user/logout', (req, res) => {
    res.clearCookie('authToken', { httpOnly: true, secure: true, sameSite: 'None' }); 
    return res.status(200).json({ mssg: "Logged out successfuly" });
});