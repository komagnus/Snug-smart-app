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
    Mongoclient.connect(CONNECTION_STRING, (error, client) => {
        database = client.db(DATABASENAME);
        console.log("Mongo DB Connection Succesfull");
    })
})
app.get("/db/snugeusmartapp/getDeviceInfo",(request, response) => {
    database.collection('devicedatacollection').find({}).toArray((error, result)=> {
        response.send(result);
    })
})
app.get("/db/snugeusmartapp/getUser",(request, response) => {
    database.collection('userdatacollection').find({}).toArray((error, result)=> {
        response.send(result);
    })
})
app.post("/db/snugeusmartapp/addUser",multer().none(),(request, response) => {
    database.collection('devicedatacollection').count({}, function(error, numOfDocs){
        database.collection('devicedatacollection').insertOne({
            userid:(numOfDocs+1).toString(),
            username: request.body.username,
            userpw: request.body.pw
        })
    })
    response.json("Added Succesfully");
})
app.post("/db/snugeusmartapp/addDevice",multer().none(),(request, response) => {
        database.collection('devicedatacollection').insertOne({
            clientid:request.body.clientid,
            clientsecret:request.body.clientsecret
        })
        response.json("Added Succesfully");
})
app.delete("/db/snugeusmartapp/removeDevice",(request, response) => {
    database.collection('devicedatacollection').deleteOne({
        clientid:request.query.clientid,
        clientsecret: request.query.clientsecret
    })
    response.json("Deleted Succesfully");
})