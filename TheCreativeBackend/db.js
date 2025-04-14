const { MongoClient } = require('mongodb');

let dbConnection;

module.exports = {
    connectToDb : (cb)=>{
        const uri = `mongodb+srv://thecreativeinmath:${process.env.DB_PASSWORD}@cluster0.5plqdk3.mongodb.net/TheCreative?retryWrites=true&w=majority&appName=Cluster0`;
        MongoClient.connect(uri)
        .then((client)=>{
            dbConnection = client.db();
            return cb();
        })
        .catch((error)=>{
            console.log(error);
            return cb(error);
        });
    },
    getDb: () => dbConnection
}