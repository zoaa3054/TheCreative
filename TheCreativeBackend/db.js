const { MongoClient } = require('mongodb');

let dbConnection;

module.exports = {
    connectToDb : (cb)=>{
        const uri = "mongodb+srv://atlas-sample-dataset-load-67fabeda3322325ac06915ec:n3qS2MC6FA6Ep4lG@cluster0.5plqdk3.mongodb.net/?appName=Cluster0";
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