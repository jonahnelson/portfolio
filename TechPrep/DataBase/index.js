var express = require('express')
var mongojs = require('mongojs')
var app = express()
var db = require('./myDB.js')

app.use(express.json())
app.get('/', (req, res) => {console.log("HELLO");})

app.get('/getAll', (req, res) => {
  db.printAllInCollection('Restaurants', function(docs){
    console.log("Cities: ", docs);
    res.send(docs)
  });
});


app.listen(3000, ()=>console.log("listening"));
