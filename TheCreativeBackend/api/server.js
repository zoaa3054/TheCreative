const express = require('express');
const cors = require('cors');
const { connectToDb, getDb } = require('../db.js');
const { ObjectId } = require('mongodb');
const { hash, compare } = require('../bcryptHash.js');
const bodyParser = require('body-parser');
const {
  createUserJWT, checkUserJWT,
  createAdminJWT, checkAdminJWT, checkBothJWTs
} = require('../jsonWebToken.js');

let db;

// Wrap Express init in a function
const initializeServer = () => {
    const server = express();
  
    server.use(bodyParser.json());
    server.use(bodyParser.urlencoded({ extended: true }));
    server.use(cors({
      origin: true,  // Replace with your frontend URL
      exposedHeaders: ["Authorization"]
    }));
  
    server.use((req, res, next) => {
      console.log(req.url);
      next();
    });
  
    // welcoming message
    server.get('/', (req, res) => {
      res.send("Hello creative");
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

                    // Set Authorization header with the token
                    res.setHeader("Authorization", `Bearer ${token}`);

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

                            // Set Authorization header with the token
                            res.setHeader("Authorization", `Bearer ${token}`);

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

    // GET user info after login
    server.get('/admin/info', checkAdminJWT, (req, res)=>{

        db.collection('admins')
        .findOne({username: req.username}, {projection: {password: 0}})
        .then((result)=>{
            if (result) res.status(200).json(result)
            else res.status(404).json({error: "Could not find admin data"})
        })
        .catch((error)=>{
            console.log(error);
            res.status(500).json({error: "Could not fetch admin data"});
        })
    });

    // GET user grade
    server.get('/user/grade', checkUserJWT, (req, res)=>{
        db.collection('users')
        .findOne({username: req.username}, {projection: {grade: 1}})
        .then((result)=>{
            if (result) res.status(200).json(result);
            else res.status(404).json({error: "User grade not found"})
        })
        .catch((error)=>{
            console.log(error);
            res.status(500).json({error: "Could not fetch user grade"})
        })
    });

    // GET lectures 
    server.get('/lectures', checkBothJWTs, (req, res)=>{
        const { filterBy, sortBy, sortDirection } = req.query;
        const filterObject = JSON.parse(decodeURIComponent(filterBy));
        const sortObject = sortBy == 'date'?{date: sortDirection}:{size: sortDirection};

        db.collection('lectures')
        .find(filterObject)
        .sort(sortObject)
        .toArray()
        .then((result)=>{
            if(result) res.status(200).json(result);
            else res.status(404).json({error: "Lectures not found"})
        })
        .catch((error)=>{
            console.log(error);
            res.status(500).json({error: "Could not fetch lectures"})
        })
    });

    // GET students 
    server.get('/students', checkAdminJWT, (req, res)=>{
        const { filterBy, sortDirection } = req.query;
        const filterObject = JSON.parse(decodeURIComponent(filterBy));
        const sortObject = {date: sortDirection, username: 1};
        
        db.collection('users')
        .find(filterObject, {projection: {password: 0, dashboard: 0, boughtLectures: 0, backgroundImage: 0}})
        .sort(sortObject)
        .toArray()
        .then((result)=>{
            if(result) res.status(200).json(result);
            else res.status(404).json({error: "Students not found"})
        })
        .catch((error)=>{
            console.log(error);
            res.status(500).json({error: "Could not fetch students"})
        })
    });

    server.get('/lecture', checkBothJWTs, (req, res)=>{
        const { id } = req.query;
        
        db.collection('lectures')
        .findOne({_id: new ObjectId(id)})
        .then((result)=>{
            if(result) res.status(200).json(result);
            else res.status(404).json({error: "Lecture not found"})
        })
        .catch((error)=>{
            console.log(error);
            res.status(500).json({error: "Could not fetch lecture"})
        })
    })

    server.get('/student', checkAdminJWT, (req, res)=>{
        const { id } = req.query;
        
        db.collection('users')
        .findOne({_id: new ObjectId(id)}, {projection: {_id: 0, password: 0, backgroundImage: 0, boughtLectures: 0}})
        .then((result)=>{
            if(result) res.status(200).json(result);
            else res.status(404).json({error: "Studnet not found"})
        })
        .catch((error)=>{
            console.log(error);
            res.status(500).json({error: "Could not fetch Studnet"})
        })
    })

    server.get('/user/wallet', checkUserJWT, (req, res)=>{
        
        db.collection('users')
        .findOne({username: req.username}, {projection: {cash: 1}})
        .then((result)=>{
            if(result) res.status(200).json(result);
            else res.status(404).json({error: "Wallet not found"})
        })
        .catch((error)=>{
            console.log(error);
            res.status(500).json({error: "Could not fetch wallet"})
        })
    })

    server.get('/user/boughtLectures', checkUserJWT, (req, res)=>{
        
        db.collection('users')
        .findOne({username: req.username}, {projection: {boughtLectures: 1}})
        .then((result)=>{
            console.log(result)
            if(result) res.status(200).json(result);
            else res.status(404).json({error: "boughtLectures not found"})
        })
        .catch((error)=>{
            console.log(error);
            res.status(500).json({error: "Could not fetch boughtLectures"})
        })
    })

    server.get('/user/dashboard', checkUserJWT, (req, res)=>{
        
        db.collection('users')
        .findOne({username: req.username}, {projection: {dashboard: 1}})
        .then((result)=>{
            if(result) res.status(200).json(result);
            else res.status(404).json({error: "dashboard not found"})
        })
        .catch((error)=>{
            console.log(error);
            res.status(500).json({error: "Could not fetch user dashboard"})
        })
    })

    server.get('/user/backgroundImage', checkUserJWT, (req, res)=>{
        
        db.collection('users')
        .findOne({username: req.username}, {projection: {backgroundImage: 1}})
        .then((result)=>{
            if(result) res.status(200).json(result);
            else res.status(404).json({error: "backgroundImage not found"})
        })
        .catch((error)=>{
            console.log(error);
            res.status(500).json({error: "Could not fetch user backgroundImage"})
        })
    })


    // GET logs 
    server.get('/logs', checkAdminJWT, (req, res)=>{
        const { filterBy, sortDirection } = req.query;
        const filterObject = JSON.parse(decodeURIComponent(filterBy));
        const sortObject = {date: sortDirection};

        db.collection('logs')
        .find(filterObject)
        .sort(sortObject)
        .toArray()
        .then((result)=>{
            if(result) res.status(200).json(result);
            else res.status(404).json({error: "Logs not found"})
        })
        .catch((error)=>{
            console.log(error);
            res.status(500).json({error: "Could not fetch logs"})
        })
    });

    // GET admins 
    server.get('/admins', checkAdminJWT, (req, res)=>{
        const { sortDirection } = req.query;
        const sortObject = {date: sortDirection, username: 1};
        console.log(sortDirection)
        db.collection('admins')
        .find({})
        .sort(sortObject)
        .toArray()
        .then((result)=>{
            // labeling the current admin
            result.forEach((_, i)=>{
                if(result[i].username == req.username)
                    result[i].disabled = true;
            });

            if(result) res.status(200).json(result);
            else res.status(404).json({error: "Admins not found"})
        })
        .catch((error)=>{
            console.log(error);
            res.status(500).json({error: "Could not fetch admins"})
        })
    });

    server.get('/contacts', checkAdminJWT, (req, res)=>{
        db.collection('contacts')
        .findOne({})
        .then((result)=>{
            if(result) res.status(200).json(result);
            else res.status(404).json({error: "Contacts not found"})
        })
        .catch((error)=>{
            console.log(error);
            res.status(500).json({error: "Could not fetch contacts"})
        })
    });

    server.get('/paymentNumber', checkUserJWT, (req, res)=>{
        db.collection('contacts')
        .findOne({}, {projection: {paymentNumber: 1}})
        .then((result)=>{
            if(result) res.status(200).json(result);
            else res.status(404).json({error: "PaymentNumber not found"})
        })
        .catch((error)=>{
            console.log(error);
            res.status(500).json({error: "Could not fetch paymentNumber"})
        })
    });

    server.get('/problemsReportNumber', checkUserJWT, (req, res)=>{
        db.collection('contacts')
        .findOne({}, {projection: {problemsReportNumber: 1}})
        .then((result)=>{
            if(result) res.status(200).json(result);
            else res.status(404).json({error: "ProblemsReportNumber not found"})
        })
        .catch((error)=>{
            console.log(error);
            res.status(500).json({error: "Could not fetch problemsReportNumber"})
        })
    });


    server.get('/faqNumber', checkUserJWT, (req, res)=>{
        db.collection('contacts')
        .findOne({}, {projection: {faqNumber: 1}})
        .then((result)=>{
            if(result) res.status(200).json(result);
            else res.status(404).json({error: "FaqNumber not found"})
        })
        .catch((error)=>{
            console.log(error);
            res.status(500).json({error: "Could not fetch faqNumber"})
        })
    });


    server.get('/sendingMessagesNumber', checkUserJWT, (req, res)=>{
        db.collection('contacts')
        .findOne({}, {projection: {sendingMessagesNumber: 1}})
        .then((result)=>{
            if(result) res.status(200).json(result);
            else res.status(404).json({error: "SendingMessagesNumber not found"})
        })
        .catch((error)=>{
            console.log(error);
            res.status(500).json({error: "Could not fetch sendingMessagesNumber"})
        })
    });



    // POST (add) some user in signup
    server.post('/signup', (req, res)=>{
        let body = req.body;
        if (Object.keys(body).length != 0 && body.username && body.password){
            // check if exists first
            db.collection('users')
            .findOne({username: body.username}, {projection: {password: 0}})
            .then(async (result)=>{
                if (!result){
                    Object.assign(body, {
                        cash: 0,
                        dashboard: [],
                        boughtLectures: [],
                        password: await hash(body.password)
                    });
                
                    db.collection('users')
                    .insertOne(body)
                    .then(()=>{
                        // creating json web token
                        const token = createUserJWT(body.username);

                        // Set Authorization header with the token
                        res.setHeader("Authorization", `Bearer ${token}`);

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

    server.post('/add/admin',checkAdminJWT, async(req, res)=>{
        const body = req.body;

        // check if the admin exists
        await db.collection('admins')
        .findOne({username: body.username}, {projection: {password: 0}})
        .then(async (result)=>{
            if (result) res.status(409).json({error: "Admin already exists"});
            else{
                // add admin if doesn't already exist
                const hashedPassword = await hash(body.password);
                await db.collection('admins')
                .insertOne({
                    username: body.username, 
                    password: hashedPassword,
                    date: Date.now()
                })
                .then(async ()=>{
                    //logging the operation
                    await db.collection('logs')
                    .insertOne({
                        text: `An admin was added with username: ${body.username}`,
                        admin: req.username,
                        method: 'ADD',
                        date: Date.now()
                    })
                    .then((_)=>res.status(201).json({mssg: "Admin added Successfuly"}))
                        
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

    server.post('/user/buy/lecture', checkUserJWT, async(req, res)=>{
        let lecture;
        let wallet;
        // getting the cost of the lecture
        await db.collection('lectures')
        .findOne({_id: new ObjectId(req.body.lectureId)})
        .then((result)=>{
            lecture = result;
        })
        .catch((error)=>{
            console.error(error);
            res.status(500).json({error: "Couldn't get lecture cost"});
        });

        // getting the wallet of the user
        await db.collection('users')
        .findOne({username: req.username}, {projection: {cash: 1}})
        .then((result)=>{
            wallet = result.cash;
        })
        .catch((error)=>{
            console.error(error);
            res.status(500).json({error: "Couldn't get user wallet"});
        });

        // check if the money is enough
        if (wallet < lecture.cost) {
            res.status(402).json({error: "No enough money in the wallet"});
            return;
        }

        // buy lecture
        await db.collection('users')
        .updateOne({username: req.username}, {$push: {boughtLectures: req.body.lectureId}})
        .then(async ()=>{
            // minus the cost of the lecture from the wallet of the user
            await db.collection('users')
            .updateOne({username: req.username}, {$inc: {cash: -lecture.cost}})
            .then((_)=>{
                db.collection('users')
                .updateOne({username: req.username}, {$push:{ dashboard:{
                    number: lecture.number,
                    unit: lecture.unit,
                    field: lecture.field,
                    grade: lecture.grade,
                    term: lecture.term,
                    date: Date.now(),
                    mark: ''
                }}})
                .then((_)=>res.status(201).json({mssg: "Lecture bought Successfuly"}))
                .catch((error)=>{
                    console.error(error);
                    res.status(500).json({error: "Couldn't add lecture to the dashboard"});
                })
            })
            .catch((error)=>{
                console.error(error);
                res.status(500).json({error: "Couldn't update wallet after buying"});
            });
            
        })
        .catch((error)=>{
            console.error(error);
            res.status(500).json({error: "Couldn't buy lecture"});
        })
    })


    server.post('/edit/user/info', checkUserJWT, async(req, res)=>{
        let body = req.body;
        if (Object.keys(body).length != 0 && body.studentPhone && body.parentPhone && body.grade && body.city){

            if (body.password){
                Object.assign(body,{
                    password: await hash(body.password)
                })
            }
            // check if exists first
            db.collection('users')
            .updateOne({username: req.username}, {$set: body.password?
                {parentPhone: body.parentPhone, studentPhone: body.studentPhone, grade: body.grade, city: body.city, password: body.password}:
                {parentPhone: body.parentPhone, studentPhone: body.studentPhone, grade: body.grade, city: body.city}})
            .then((_)=>{
                res.status(200).json({mssg: "User info edited successfuly"})
            })
            .catch((error)=>{
                console.error(error);
                res.status(500).json({error: "Couldn't edit user info"});
            })
        }
        else res.status(422).json({error: "Sent data is unprocessable"});
    });

    server.post('/edit/admin/info', checkAdminJWT, async(req, res)=>{
        let body = req.body;
        if (Object.keys(body).length != 0 && body.username){

            if (body.password){
                Object.assign(body, {
                    password: await hash(body.password)
                })
            }

            // check if exists first
            db.collection('admins')
            .updateOne({username: req.username}, {$set: body.password?
                {parentPhone: body.parentPhone, studentPhone: body.studentPhone, grade: body.grade, city: body.city, password: body.password}:
                {parentPhone: body.parentPhone, studentPhone: body.studentPhone, grade: body.grade, city: body.city}})
            .then((_)=>{
                res.status(200).json({mssg: "Admin info edited successfuly"})
            })
            .catch((error)=>{
                console.error(error);
                res.status(500).json({error: "Couldn't edit admin info"});
            })
        }
        else res.status(422).json({error: "Sent data is unprocessable"});
    });


    server.post('/user/add/backgroundImage', checkUserJWT, (req, res)=>{
        const backgroundImage = req.body.backgroundImage;
        if (!backgroundImage){
            res.status(422).json({error: "Sent data is unprocessable"});
            return;
        }
        db.collection('users')
        .updateOne({username: req.username}, {$set: {backgroundImage: backgroundImage}})
        .then((_)=>res.status(201).json({mssg: 'Background Image uploaded successfuly'}))
        .catch((error)=>{
            console.log(error);
            res.status(500).json({error: "Could not fetch user backgroundImage"})
        })
    })

    server.post('/edit/wallet', checkAdminJWT, async(req, res)=>{
        if (req.body.username && req.body.amount){
            // check if exists first
            console.log(req.body)
            await db.collection('users')
            .updateOne({username: req.body.username}, {$inc: {cash: parseInt(req.body.amount, 10)}})
            .then(async (_)=>{
                //logging the operation
                await db.collection('logs')
                .insertOne({
                    text: `The wallet of ${req.body.username} was edited by ${req.body.amount}`,
                    admin: req.username,
                    method: 'UPDATE',
                    date: Date.now()
                })
                .then((_)=>res.status(200).json({mssg: "User wallet is edited successfuly"}))
            })
            .catch((error)=>{
                console.error(error);
                res.status(500).json({error: "Couldn't edit user wallet"});
            })
        }
        else res.status(422).json({error: "Sent data is unprocessable"});
    });

    server.post('/add/lecture', checkAdminJWT, async(req, res)=>{
        if (req.body){

            // check if exists first
            await db.collection('lectures')
            .findOne({grade: req.body.grade, term: req.body.term, field: req.body.field, unit: req.body.unit, number: req.body.number})
            .then(async (result)=>{
                console.log(result)
                if (result) res.status(409).json({error: "Lecture already exists"});
                else{
                    await db.collection('lectures')
                    .insertOne(req.body)
                    .then(async (_)=>{
                        //logging the operation
                        await db.collection('logs')
                        .insertOne({
                            text: `The lecture number ${req.body.number} in ${req.body.field} U${req.body.unit} was added`,
                            admin: req.username,
                            method: 'ADD',
                            date: Date.now()
                        })
                        .then((_)=>res.status(201).json({mssg: "Lecture added successfuly"}))
                    })
                    .catch((error)=>{
                        console.error(error);
                        res.status(500).json({error: "Couldn't add lecture"});
                    })
                }
            });

            
        }
        else res.status(422).json({error: "Sent data is unprocessable"});
    });

    server.post('/edit/contacts', checkAdminJWT, async(req, res)=>{
        try{
            await db.collection('contacts')
            .updateOne({}, {$set: req.body})
            Object.keys(req.body).forEach(async(key) => {
                await db.collection('logs')
                .insertOne({
                    text: `The ${key} is updated into ${req.body[key]}`,
                    admin: req.username,
                    method: 'UPDATE',
                    date: Date.now()
                })
            });
            
        }catch(error){
            console.log(error);
            res.status(500).json({error: "couldn't edit contacts"});
        }
        res.status(200).json({mssg: "contacts edited successfuly"});

    })

    server.post('/edit/lecture', checkAdminJWT, async(req, res)=>{
        if (req.body){
            const id = req.body._id;
            delete req.body._id;
            // check if exists first
            await db.collection('lectures')
            .updateOne({_id: new ObjectId(id)}, {$set: req.body})
            .then(async (_)=>{
                //logging the operation
                await db.collection('logs')
                .insertOne({
                    text: `The lecture number ${req.body.number} in ${req.body.field} U${req.body.unit} was edited`,
                    admin: req.username,
                    method: 'UPDATE',
                    date: Date.now()
                })
                .then((_)=>res.status(200).json({mssg: "Lecture edited successfuly"}))
            })
            .catch((error)=>{
                console.error(error);
                res.status(500).json({error: "Couldn't edit lecture"});
            })
            
        }
        else res.status(422).json({error: "Sent data is unprocessable"});

    })

    // deleting a user account
    server.delete('/delete/user/account', checkAdminJWT, async(req, res)=>{
        if (req.body.username){
            // check if exists first
            await db.collection('users')
            .deleteOne({username: req.body.username})
            .then(async (_)=>{
                //logging the operation
                await db.collection('logs')
                .insertOne({
                    text: `The account of the student: ${req.body.username} was deleted`,
                    admin: req.username,
                    method: 'DELETE',
                    date: Date.now()
                })
                .then((_)=>res.status(200).json({mssg: "User account is deleted successfuly"}))
            })
            .catch((error)=>{
                console.error(error);
                res.status(500).json({error: "Couldn't delete user account"});
            })
        }
        else res.status(422).json({error: "Sent data is unprocessable"});
    });

    // deleting an admin account

    server.delete('/delete/admin/account', checkAdminJWT, async(req, res)=>{
        if (req.body.username){
            // check if exists first
            await db.collection('admins')
            .deleteOne({username: req.body.username})
            .then(async (_)=>{
                //logging the operation
                await db.collection('logs')
                .insertOne({
                    text: `The account of the admin: ${req.body.username} was deleted`,
                    admin: req.username,
                    method: 'DELETE',
                    date: Date.now()
                })
                .then((_)=>res.status(200).json({mssg: "User account is deleted successfuly"}))
            })
            .catch((error)=>{
                console.error(error);
                res.status(500).json({error: "Couldn't delete user account"});
            })
        }
        else res.status(422).json({error: "Sent data is unprocessable"});
    });

    // deleting a lecture
    server.delete('/delete/lecture', checkAdminJWT, async(req, res)=>{
        if (req.body._id){
            await db.collection('lectures')
            .findOne({_id: new ObjectId(req.body._id)})
            .then(async (result)=>{
                if (!result) res.status(404).json({error: "Lecture is not found"});
                else{
                    await db.collection('lectures')
                    .deleteOne({_id: new ObjectId(req.body._id)})
                    .then(async (_)=>{
                        //logging the operation
                        await db.collection('logs')
                        .insertOne({
                            text: `The lecture number ${result.number} in ${result.field} U${result.unit} was deleted`,
                            admin: req.username,
                            method: 'DELETE',
                            date: Date.now()
                        })
                        .then((_)=>res.status(200).json({mssg: "Lecture is deleted successfuly"}))
                    })
                }
            })
            .catch((error)=>{
                console.error(error);
                res.status(500).json({error: "Couldn't delete lecture"});
            })
        }
        else res.status(422).json({error: "Sent data is unprocessable"});
    });

    return server;
};


// Initialize DB + server
let serverReady = (async () => {
    return new Promise((resolve, reject) => {
      connectToDb((err) => {
        if (err) {
          console.error("DB Connection Error:", err);
          return reject(err);
        }
        db = getDb();
        const server = initializeServer();
        console.log("Connected to DB and server ready.");
        resolve(server);
      });
    });
  })();
  
  // Export handler for Vercel
  module.exports = async (req, res) => {
    try {
      const server = await serverReady;
      return server(req, res);
    } catch (err) {
      return res.status(500).send("Server initialization failed.");
    }
  };
  