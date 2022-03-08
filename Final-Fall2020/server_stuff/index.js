// Variables / Includes
var express     = require('express')
var MongoClient = require('mongodb').MongoClient
var app         = express()
var dataBaseFunctions = require('./dataBaseFunctions.js');

// Constants
const url        = "mongodb://ukko.d.umn.edu:15000/mydb"
const database   = "mydb"
const PORTNUMBER = 15001
var mydb         = null //This will cause an error if connection fails, good to know for troubleshooting

// Connect to database
MongoClient.connect(url, function(err, client) {
    console.log("Connected successfully to server");
    mydb = client.db(database);
});

// Listen on port
app.listen(PORTNUMBER, ()=>{console.log("listening on " + PORTNUMBER)})
app.use(express.json());

/**
 * Get all names
 */
app.get('/get', function (req, res) {
    dataBaseFunctions.get("names", function (docs) {
	res.send(docs);
    });
});

/**
 * Get name
 */
app.get('/getName/:name/:minYear/:maxYear', function (req, res) {
    var babyName = req.params.name;
    var min = parseInt(req.params.minYear, 10);
    var max = parseInt(req.params.maxYear, 10);
    dataBaseFunctions.getName("names", babyName, min, max, function (docs) {
	res.send(docs);
    });
});
