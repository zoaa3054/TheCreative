const express = require('express');
const cors = require('cors');
const fs = require("fs");
const https = require("https");
const { connectToDb, getDb } = require('./db.js');
const { ObjectId } = require('mongodb');
const { getTerm } = require('./utils.js');
const { hash, compare } = require('./bcryptHash.js');
const { createUserJWT, checkUserJWT, createAdminJWT, checkAdminJWT } = require('./jsonWebToken.js');
const cookieParser = require('cookie-parser');

// init server and middleware
const server = express();
server.use(express.json());
server.use(cookieParser());

// Enable CORS to allow frontend requests with credentials
server.use(cors({
    origin: true,  // Change this to your frontend URL
    credentials: true
}));

// Load SSL certificate and private key
const options = {
    // key: fs.readFileSync("localhost-key.pem"),
    // cert: fs.readFileSync("localhost.pem"),
    key: fs.readFileSync("192.168.1.17-key.pem"),
    cert: fs.readFileSync("192.168.1.17.pem"),
};

// connect to db
let db;
connectToDb((error)=>{
    if (!error){
        https.createServer(options, server).listen(8081, "0.0.0.0",() => {
            console.log("backend is running on port 8081!");
        });
        db = getDb();
    }
    else console.log(error);
});

// routes

// GET all users via admin
server.get('/all/users', checkAdminJWT, (req, res)=>{
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
server.post('/login', (req, res)=>{
    let body = req.body;
    if (Object.keys(body).length != 0 && body.username && body.password){
        // looking for user
        db.collection('users')
        .findOne({username: body.username}, {projection: {password: 1}})
        .then(async (userResult)=>{
            if (userResult && await compare(body.password, userResult.password)){
                // creating json web token
                const token = createUserJWT(body.username);

                // Set HTTP-Only Cookie
                res.cookie('theCreativeAuthToken', token, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'Strict',
                });

                res.status(200).json({person: "user"});
            }
            else{
                // looking for admin
                db.collection('admins')
                .findOne({username: body.username}, {projection: {password: 1}})
                .then(async (adminResult)=>{
                    if (adminResult && await compare(body.password, adminResult.password)){
                        
                        // creating json web token
                        const token = createAdminJWT(body.username);

                        // Set HTTP-Only Cookie
                        res.cookie('theCreativeAuthToken', token, {
                            httpOnly: true,
                            secure: true,
                            sameSite: 'Strict',
                        });

                        res.status(200).json({person: "admin"});
                    }
                    else{
                        res.status(404).json({error: "User not Found"});
                    }
                })
                .catch((error)=>{
                    console.error(error);
                    res.status(500).json({error: "Could not get user"})
                })
            }
        })
        .catch((error)=>{
            console.error(error);
            res.status(500).json({error: "Could not get user"})
        })
    }
    else res.status(422).json({error: "Sent data is unprocessable"});
})

// GET user info after login
server.get('/user/info', checkUserJWT, (req, res)=>{

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
server.post('/signup', (req, res)=>{
    let body = req.body;
    console.log(body);
    if (Object.keys(body).length != 0 && body.username && body.password){
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
                .then(()=>{
                    // creating json web token
                    const token = createUserJWT(body.username);

                    // Set HTTP-Only Cookie
                    res.cookie('theCreativeAuthToken', token, {
                        httpOnly: true,
                        secure: true,
                        sameSite: 'Strict',
                    });
                    res.status(201).json({mssg: "User added Successfuly"});
                })
                .catch((error)=>{
                    console.error(error);
                    res.status(500).json({error: "Couldn't add the user"});
                })
            }
            else res.status(409).json({error: "User already exists"})
        });
    }
    else res.status(422).json({error: "Sent data is unprocessable"});
});

server.post('/add/admin', checkAdminJWT, (req, res)=>{
    const body = req.body;

    // check if the admin exists
    db.collection('admins')
    .findOne({username: body.username}, {projection: {password: 0}})
    .then(async (result)=>{
        if (result) res.status(409).json({error: "Admin already exists"});
        else{
            // add admin if doesn't already exist
            const hashedPassword = await hash(body.password);
            db.collection('admins')
            .insertOne({username: body.username, password: hashedPassword})
            .then(()=>{
                res.status(201).json({mssg: "Admin added Successfuly"});
            })
            .catch(()=>{
                res.status(500).json({error: "Couldn't add the admin"});
            });
        }
    })
    .catch(()=>{
        res.status(500).json({error: "Couldn't add the admin"});
    });
});

// logout
server.post('/user/logout', (req, res) => {
    res.clearCookie('theCreativeAuthToken', { httpOnly: true, secure: true, sameSite: 'None' }); 
    return res.status(200).json({ mssg: "Logged out successfuly" });
});