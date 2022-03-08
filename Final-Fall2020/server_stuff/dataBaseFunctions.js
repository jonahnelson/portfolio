const mongojs = require("mongojs");
const assert  = require("assert");
const url     = "mongodb://ukko.d.umn.edu:15000/mydb";
const collection = ["names"];
mydb = mongojs(url, collection);

// export functions
module.exports = {
    /**
     * Get all names
     */
    get:function(collectionName, callback) {
	mydb.collection(collectionName)
	    .find({})
	    .limit(300, function (err, docs) {
		if (err || !docs) {
		    console.log("get error");
		} else {
		    callback(docs);
		}
	    });
    }, // get

    /**
     * Get name
     */
    getName:function(collectionName, babyName, minYear, maxYear, callback) {
	mydb.collection(collectionName)
	    .find({ "name" : {$regex : babyName },
		    "year" : {$gte:minYear, $lte:maxYear}})
	    .limit(500, function(err, docs) {
		if (err || !docs) {
		    console.log("get error");
		} else {
		    callback(docs);
		}
	    });
    } // getName
    
}
