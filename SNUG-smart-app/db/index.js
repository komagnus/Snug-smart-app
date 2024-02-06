var Express = require('express');
var Mongoclient = require("mongodb").MongoClient;
var cors = require("cors");
const multer = require("multer");

var app = Express();
app.use(cors());

var CONNECTION_STRING = "mongodb+srv://admin:qo4atxzj3i3AMQQU@snugsmartapp.z5sqali.mongodb.net/?retryWrites=true&w=majority";

var DATABASENAME="snugsmartappeudb"
var database;

app.listen(5038, () => {
    console.log('running')
    Mongoclient.connect(CONNECTION_STRING, (error, client) => {
        database = client.db(DATABASENAME);
        console.log("Mongo DB Connection Succesful");
    })
})
app.get('/api/snugeusmartapp/getDeviceInfo',(request, response) => {
    database.collection('devicedatacollection').find({}).toArray((error, result)=> {
        response.send(result);
    })
})
app.post('/api/snugeusmartapp/addDevice',(request, response) => {
    database.collection('devicedatacollection').find({}).toArray((error, result)=> {
        response.send(result);
    })
})