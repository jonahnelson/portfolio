//Express-Session, Mongoose, and body-parser declarations
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var session = require('express-session');
var bp = require('body-parser');


//Load routing data to launch local copy of server from routing.json
const fs = require('fs');
var route = fs.readFileSync('test/routing.json');
var jsonRoute = JSON.parse(route);

//connecting mongoose to RestAPI, target URL stored in route
mongoose.connect('mongodb://ukko.d.umn.edu:13611/AppNull');
var db = mongoose.connection

//handles mongo connection error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("Connection established to" + "mongodb://ukko.d.umn.edu:9158/AppNull");
});

// Mongoose schema declartion
var technical = require('./models/Technical.js');
var flash = require('./models/flash.js')
var User = require('./models/User.js')

// set up for pug enginer
app.set('views', './views'); //folder where views are stored
app.set('view engine', 'pug');

//use session for tracking login
app.use(session({
    secret: 'hardly technical',
    resave: true,
    saveUninitialized: false
}));

app.use(bp.json());
app.use(bp.urlencoded({
    extended: false
}));

console.log("\n Starting Server, set-up complete \n");

/**
 * Basic .get that sends a simple hello message on connection
 * @param req 	the request sent to the server
 * @param res 	the response sent to the client
 * @return	sends a "hello" message to the server console
 */
app.get('/', (req, res) => {
    console.log("HELLO");
    res.render('home');
});

/**
 * Register command to create a new user from question-website homepage
 * @param req   the request sent to the server
 * @param next   used to handle error responses
 * @param res   the response sent to the client; must contain email, username, password, and passwordConf fields, fields must not be empty
 * @return  redirects user to profile on succesful creation, spits out error on error
 */
app.post('/register', function(req, res, next) {
    // confirm that user typed same password twice
    if (req.body.password !== req.body.passwordConf) {
        console.log('passwords dont match');
        var err = new Error('Passwords do not match.');
        err.status = 400;
        res.send("passwords dont match");
        return next(err);
    }

    if (req.body.email &&
        req.body.username &&
        req.body.password &&
        req.body.passwordConf && (req.body.verificationCode == "Questioneers")) {

        console.log('creating new user');
        var userData = {
            email: req.body.email,
            username: req.body.username,
            password: req.body.password,
            passwordConf: req.body.passwordConf,
            accessLevel: "admin",
        }

        User.create(userData, function(error, user) {
            if (error) {
                return next(error);
            } else {
                req.session.userId = user._id;
                return res.redirect('/profile');
            }
        });

    } else {
        var err = new Error('All fields required.');
        err.status = 400;
        return next(err);
    }
});

/**
 * profile call, redirects to profile page
 * @param req   the request sent to the server
 * @param res   the response sent to the client
 * @param next   used to handle error responses
 * @return  renders the profile page with the username, email, and access level of user
 */
app.get('/profile', function(req, res, next) {
    User.findById(req.session.userId)
        .exec(function(error, user) {
            if (error) {
                return next(error);
            } else {
                if (user === null) {
                    var err = new Error('Not authorized! Go back!');
                    err.status = 400;
                    return next(err);
                } else {
                    return res.render('profile', {
                        user: user.username,
                        email: user.email,
                        access: user.accessLevel
                    })
                }
            }
        });
});

/**
 * redirects to create a flashcard question page
 * @param req   the request sent to the server
 * @param res   the response sent to the client
 * @param next   used to handle error responses
 * @return  renders flashcard question page
 */
app.get('/makeFlash', function(req, res, next) {
    User.findById(req.session.userId)
        .exec(function(error, user) {
            if (error) {
                return next(error);
            } else {
                if (user === null) {
                    var err = new Error('Not authorized! Go back!');
                    err.status = 401;
                    return next(err);
                } else {
                    return res.render('addFlash', {
                        user: user.username,
                        email: user.email,
                        access: user.accessLevel
                    })
                }
            }
        });
});

/**
 * redirects to create a technical question page
 * @param req   the request sent to the server
 * @param res   the response sent to the client
 * @param next   used to handle error responses
 * @return  renders technical question page
 */
app.get('/makeTechnical', function(req, res, next) {
    User.findById(req.session.userId)
        .exec(function(error, user) {
            if (error) {
                return next(error);
            } else {
                if (user === null) {
                    var err = new Error('Not authorized! Go back!');
                    err.status = 400;
                    return next(err);
                } else {
                    return res.render('addTechnical', {
                        user: user.username,
                        email: user.email,
                        access: user.accessLevel
                    })
                }
            }
        });
});

/**
 * redirects to creat flashcard question page
 * @param req   the request sent to the server
 * @param res   the response sent to the client
 * @param next   used to handle error responses
 * @return  renders flashcard question page
 */
app.get('/logout', function(req, res, next) {
    if (req.session) {
        // delete session object
        req.session.destroy(function(err) {
            if (err) {
                return next(err);
            } else {
                return res.redirect('/');
            }
        });
    }
});

/** used to retrieve a random technical question from the technical question database
 * @param req 	the request sent to the server
 * @param res 	the response sent to the client
 * @return 	sends a random technical question as a string back to the client
 */
app.get('/getTechnical', (req, res) => {
    console.log("getTech called...");
    technical.findOneRandom(function(err, doc) {
        if (err) console.log(err);
        else {
            console.log("Question", doc.question)
            res.send(doc);
        }
    });

});

/** used to retrieve a random flashcard question from the flashcard question database
 * @param req   the request sent to the server
 * @param res   the response sent to the client
 * @return  sends a random flashcard question as a string back to the client
 */
app.get('/getFlash', (req, res) => {
    console.log("getFlash called...");
    flash.findOneRandom(function(err, doc) {
        if (err) console.log(err);
        else {
            console.log(doc.question);
            console.log(doc.answer);
            res.send(doc);
        }
    });
});

/** login call
 * @param req   the request sent to the server
 * @param res   the response sent to the client
 * @param next   used to handle error responses
 * @return  succesful login redirects the user to the profile page
 */
app.post('/login', function(req, res, next) {
    if (req.body.loguser && req.body.logpassword) {
        User.authenticate(req.body.loguser, req.body.logpassword, function(error, user) {
            if (error || !user) {
                var err = new Error('Wrong email or password.');
                err.status = 401;
                return next(err);
            } else {
                req.session.userId = user._id;
                console.log("\n Sucessfull login \n");
                return res.redirect('/profile');
            }
        });
    } else {
        var err = new Error('All fields required.');
        console.log(req.body)
        err.status = 400;
        return next(err);
    }
});

/** sends a newly created flashcard question to the database from the website
 * @param req   the request sent to the server
 * @param res   the response sent to the client
 * @param next   used to handle error responses
 * @return  after sending the question, it redirects to the profile page
 */
app.post('/createFlash', function(req, res, next) {
    User.findById(req.session.userId)
        .exec(function(error, user) {
            if (error) {
                return next(error);
            } else {
                if (user === null) {
                    var err = new Error('Not authorized! Go back!');
                    err.status = 400;
                    return next(err);
                } else if (req.body.question === "" || req.body.answer === "") {
                    var err = new Error('Field blank');
                    err.status = 400;
                    return next(err);
                } else {
                    var question = {
                        question: req.body.question,
                        answer: req.body.answer,
                        author: req.session.userId,
                        authorName: req.body.authorName,
                        __v: flash.count() + 1
                    }
                    flash.create(question, function(error, user) {
                        if (error) {
                            return next(error);
                        }
                    });
                    return res.render('profile', {
                        user: user.username,
                        email: user.email,
                        access: user.accessLevel
                    })
                }
            }
        });
});

/** sends a newly created technical question to the database from the website
 * @param req   the request sent to the server
 * @param res   the response sent to the client
 * @param next   used to handle error responses
 * @return  after sending the question, it redirects to the profile page
 */
app.post('/createTechnical', function(req, res, next) {
    User.findById(req.session.userId)
        .exec(function(error, user) {
            if (error) {
                return next(error);
            } else {
                if (user === null) {
                    var err = new Error('Not authorized! Go back!');
                    err.status = 400;
                    return next(err);
                } else if (req.body.question === "") {
                    var err = new Error('Field blank');
                    err.status = 400;
                    return next(err);
                } else {
                    var question = {
                        question: req.body.question,
                        author: req.session.userId,
                        authorName: req.body.authorName,
                        __v: technical.count() + 1
                    }
                    technical.create(question, function(error, user) {
                        if (error) {
                            return next(error);
                        }
                    });
                    return res.render('profile', {
                        user: user.username,
                        email: user.email,
                        access: user.accessLevel
                    })
                }
            }
        });
});


/** Create Flash API Call
 * @param req   the request sent to the server
 * @param res   the response sent to the client
 * @param next   used to handle error responses
 * @return  successful post request with templatted JSOn resposne
 */
app.post('/createFlashAPI', function(req, res, next) {
    if (req.body.loguser && req.body.logpassword) {
        User.authenticate(req.body.loguser, req.body.logpassword, function(error, user, docs) {
            if (error || !user) {
                var err = new Error('Wrong email or password.');
                err.status = 401;
                return next(err);
            } else {
                req.session.userId = user._id;
                console.log("Login Sucessful:", 201);
                User.findById(req.session.userId)
                    .exec(function(error, user) {
                        if (error) {
                            return next(error);
                        } else {
                            if (user === null) {
                                var err = new Error('Not authorized! Go back!');
                                err.status = 400;
                                return next(err);
                            } else if (req.body.question === "" || req.body.answer === "") {
                                var err = new Error('Field blank');
                                err.status = 400;
                                return next(err);
                            } else {
                                flash.count({}, function(err, count) {
                                    const amount_documents = count;
                                    var question = {
                                        question: req.body.question,
                                        answer: req.body.answer,
                                        author: req.session.userId,
                                        authorName: req.body.authorName,
                                        q_number: amount_documents + 1
                                    }
                                    flash.create(question, function(error, user) {
                                        if (error) {
                                            return next(error);
                                        }
                                    });
                                    console.log("Post Sucessful:", 201);
                                });
                            }
                        }
                    });
                res.send({
                    success: 'true'
                });
            }
        });
    } else {
        var err = new Error('All fields required.');
        err.status = 400;
        return next(err);
    }
});


/** Create Tech API Call
 * @param req   the request sent to the server
 * @param res   the response sent to the client
 * @param next   used to handle error responses
 * @return  successful post request with templatted JSOn resposne
 */
app.post('/createTechAPI', function(req, res, next) {
    if (req.body.loguser && req.body.logpassword) {
        User.authenticate(req.body.loguser, req.body.logpassword, function(error, user, docs) {
            if (error || !user) {
                var err = new Error('Wrong email or password.');
                err.status = 401;
                return next(err);
            } else {
                req.session.userId = user._id;
                console.log("Login Sucessful:", 201);
                User.findById(req.session.userId)
                    .exec(function(error, user) {
                        if (error) {
                            return next(error);
                        } else {
                            if (user === null) {
                                var err = new Error('Not authorized! Go back!');
                                err.status = 400;
                                return next(err);
                            } else if (req.body.question === "" || req.body.answer === "") {
                                var err = new Error('Field blank');
                                err.status = 400;
                                return next(err);
                            } else {
                                technical.count({}, function(err, count) {
                                    const amount_documents = count;
                                var question = {
                                    question: req.body.question,
                                    author: req.session.userId,
                                    authorName: req.body.authorName,
                                    q_number: amount_documents + 1
                                }
                                technical.create(question, function(error, user) {
                                    if (error) {
                                        return next(error);
                                    }
                                });
                                console.log("Post Sucessful:", 201);
                            });
                            }
                        }
                    });
                res.send({
                    success: 'true'
                });
            }
        });
    } else {
        var err = new Error('All fields required.');
        err.status = 400;
        return next(err);
    }
});

app.get('/getUser', function(req, res, next) {
    if (req.query.email) {
        User.findOne({
            'email': req.query.email
        }, function(err, doc) {
            if (err) {
                console.log("error");
                return next(err);
            } else {
                if (doc != null) {
                    console.log("Getting User");
                    return res.send(doc);
                } else
                    return res.send({
                        "accessLevel": "notAdmin"
                    })
            }
        });

    } else {
        var err = new Error('email required.');
        err.status = 400;
        return next(err);
    }
});


app.post('/RankFlashAdmin', function(req, res, next) {
    console.log(req.body);
    if (req.body.question && req.body.user && req.body.rank && req.body.comment) {
        var ranking = {
            user: req.body.user,
            rank: req.body.rank,
            comment: req.body.comment
        }
        flash.findOneAndUpdate({
                'question': req.body.question
            }, {
                $push: {
                    admin_rankings: ranking
                }
            },
            function(error, success) {
                if (error) {
                    res.send(error);
                    console.log(error);
                } else {
                    console.log("Updated admin rank on question.");
                    res.send(success);
                }
            });
    } else {
        var err = new Error('question, user, rank, and comment requited. ');
        err.status = 400;
        return next(err);
    }
});

app.post('/RankFlashUser', function(req, res, next) {
    if (req.body.question && req.body.user && req.body.rank && req.body.comment) {
        var ranking = {
            user: req.body.user,
            rank: req.body.rank,
            comment: req.body.comment
        }
        flash.findOneAndUpdate({
                'question': req.body.question
            }, {
                $push: {
                    user_rankings: ranking
                }
            },
            function(error, success) {
                if (error) {
                    res.send(error);
                    console.log(error);
                } else {
                    console.log("Updated user rank on question.");
                    res.send(success);
                }
            });
    } else {
        var err = new Error('question, user, rank, and comment requited. ');
        err.status = 400;
        return next(err);
    }
});

app.post('/GetRankFlash', function(req, res, next) {
    if (req.body.question) {
        flash.findOne({
                'question': req.body.question
            },
            function(error, doc) {
                if (error) {
                    res.send(error);
                    console.log("Error on get Flash Rank.");
                } else {
                    var object = doc.toObject({
                        getters: true
                    })
                    //console.log(object.question);
                    console.log("Get Rank Flash on " + object.q_number);
                    var admin_comment_array = [];
                    var user_comment_array = [];
                    var admin_rank = 0;
                    var user_rank = 0;
                    var admin_total = 0;
                    var user_total = 0;
                    for (rank in object.admin_rankings) {
                      admin_comment_array.push(object.admin_rankings[rank].comment);
                        admin_rank += 1;
                        admin_total += object.admin_rankings[rank].rank;
                    }
                    for (rank in object.user_rankings) {
                      user_comment_array.push(object.user_rankings[rank].comment);
                        user_rank += 1;
                        user_total += object.user_rankings[rank].rank;
                    }
                    if (user_rank != 0) {
                        user_total = user_total / user_rank;
                    } else {
                        user_total = "N/A"
                    }
                    if (admin_rank != 0) {
                        admin_total = admin_total / admin_rank;
                    } else {
                        admin_total = "N/A"
                    }
                    var ranking_response = {
                        admin_rank: admin_total,
                        user_rank: user_total,
                        admin_comments: admin_comment_array,
                        user_comments: user_comment_array
                    }
                    res.send(ranking_response);
                }
            });
    } else {
        var err = new Error('question required');
        err.status = 400;
        return next(err);
    }
});

app.post('/RankTechAdmin', function(req, res, next) {
    if (req.body.question && req.body.user && req.body.rank && req.body.comment) {
        var ranking = {
            user: req.body.user,
            rank: req.body.rank,
            comment: req.body.comment
        }
        technical.findOneAndUpdate({
                'question': req.body.question
            }, {
                $push: {
                    admin_rankings: ranking
                }
            },
            function(error, success) {
                if (error) {
                    res.send(error);
                    console.log(error);
                } else {
                    console.log("Updated admin rank on question.");
                    res.send(success);
                }
            });
    } else {
        var err = new Error('question, user, rank, and comment requited. ');
        err.status = 400;
        return next(err);
    }
});

app.post('/RankTechUser', function(req, res, next) {
    if (req.body.question && req.body.user && req.body.rank && req.body.comment) {
        var ranking = {
            user: req.body.user,
            rank: req.body.rank,
            comment: req.body.comment
        }
        technical.findOneAndUpdate({
                'question': req.body.question
            }, {
                $push: {
                    user_rankings: ranking
                }
            },
            function(error, success) {
                if (error) {
                    res.send(error);
                    console.log(error);
                } else {
                    console.log("Updated user rank on question.");
                    res.send(success);
                }
            });
    } else {
        var err = new Error('question, user, rank, and comment requited. ');
        err.status = 400;
        return next(err);
    }
});

app.post('/GetRankTech', function(req, res, next) {
    if (req.body.question) {
        technical.findOne({
                'question': req.body.question
            },
            function(error, doc) {
                if (error) {
                    res.send(error);
                    console.log("Error on get Flash Rank.");
                } else {
                    var object = doc.toObject({
                        getters: true
                    })
                    //console.log(object.question);
                    console.log("Get Rank Flash on " + object.q_number);
                    var admin_comment_array = [];
                    var user_comment_array = [];
                    var admin_rank = 0;
                    var user_rank = 0;
                    var admin_total = 0;
                    var user_total = 0;
                    for (rank in object.admin_rankings) {
                      admin_comment_array.push(object.admin_rankings[rank].comment);
                        admin_rank += 1;
                        admin_total += object.admin_rankings[rank].rank;
                    }
                    for (rank in object.user_rankings) {
                      user_comment_array.push(object.user_rankings[rank].comment);
                        user_rank += 1;
                        user_total += object.user_rankings[rank].rank;
                    }
                    if (user_rank != 0) {
                        user_total = user_total / user_rank;
                    } else {
                        user_total = "N/A"
                    }
                    if (admin_rank != 0) {
                        admin_total = admin_total / admin_rank;
                    } else {
                        admin_total = "N/A"
                    }
                    var ranking_response = {
                        admin_rank: admin_total,
                        user_rank: user_total,
                        admin_comments: admin_comment_array,
                        user_comments: user_comment_array
                    }
                    res.send(ranking_response);
                }
            });
    } else {
        var err = new Error('question required');
        err.status = 400;
        return next(err);
    }
});

app.get('/getAllTechnical', (req, res) => {
    console.log("getTech called...");
    technical.find(function(err, doc) {
        if (err) console.log(err);
        else {
            res.send(doc);
        }
    });

});

app.get('/getAllFlash', (req, res) => {
    console.log("getFlash called...");
    flash.find(function(err, doc) {
        if (err) console.log(err);
        else {
            res.send(doc);
        }
    });
});

app.post('/ReportTech', function(req, res, next) {
    if (req.body.question && req.body.user && req.body.reason && req.body.comment) {
        var ranking = {
            user: req.body.user,
            reason: req.body.reason,
            comment: req.body.comment
        }
        technical.findOneAndUpdate({
                'question': req.body.question
            }, {
                $push: {
                    report: ranking
                }
            },
            function(error, success) {
                if (error) {
                    res.send(error);
                    console.log(error);
                } else {
                    console.log("Updated report on question.");
                    res.send(success);
                }
            });
    } else {
        var err = new Error('question, user, report, and comment requited. ');
        err.status = 400;
        return next(err);
    }
});

app.post('/ReportFlash', function(req, res, next) {
    if (req.body.question && req.body.user && req.body.reason && req.body.comment) {
        var ranking = {
            user: req.body.user,
            reason: req.body.reason,
            comment: req.body.comment
        }
        flash.findOneAndUpdate({
                'question': req.body.question
            }, {
                $push: {
                    report: ranking
                }
            },
            function(error, success) {
                if (error) {
                    res.send(error);
                    console.log(error);
                } else {
                    console.log("Updated report on question.");
                    res.send(success);
                }
            });
    } else {
        var err = new Error('question, user, report, and comment required. Report Flash \n');
        err.status = 400;
        return next(err);
    }
});

app.post('/DeleteFlash', function(req, res, next) {
    if (req.body.question) {
        flash.remove({
                'question': req.body.question
            },
            function(error, success) {
                if (error) {
                    res.send(error);
                    console.log(error);
                } else {
                    console.log("Deleted Question.");
                    res.send(success);
                }
            });
    } else {
        var err = new Error('question required. ');
        err.status = 400;
        return next(err);
    }
});

app.post('/DeleteTech', function(req, res, next) {
    if (req.body.question) {
        technical.remove({
                'question': req.body.question
            },
            function(error, success) {
                if (error) {
                    res.send(error);
                    console.log(error);
                } else {
                    console.log("Deleted Question.");
                    res.send(success);
                }
            });
    } else {
        var err = new Error('question required. ');
        err.status = 400;
        return next(err);
    }
});

app.post('/FindFlash', function(req, res, next) {
    if (req.body.question) {
        flash.findOne({
                'question': req.body.question
            }, 
            function(error, success) {
                if (error) {
                    res.send(error);
                    console.log(error);
                } else {
                    console.log("Question Found.");
                    res.send(success);
                }
            });
    } else {
        var err = new Error('question required.');
        err.status = 400;
        return next(err);
    }
});

app.post('/FindTech', function(req, res, next) {
    if (req.body.question) {
        technical.findOne({
                'question': req.body.question
            }, 
            function(error, success) {
                if (error) {
                    res.send(error);
                    console.log(error);
                } else {
                    console.log("Question Found.");
                    res.send(success);
                }
            });
    } else {
        var err = new Error('question required.');
        err.status = 400;
        return next(err);
    }
});

app.post('/ClearReportFlash', function(req, res, next) {
    if (req.body.question && req.body.user && req.body.reason && req.body.comment) {
        var ranking = {
            user: req.body.user,
            reason: req.body.reason,
            comment: req.body.comment
        }
        flash.findOneAndUpdate({
                'question': req.body.question
            }, {
                $pull: {
                    report: ranking
                }
            },
            function(error, success) {
                if (error) {
                    res.send(error);
                    console.log(error);
                } else {
                    console.log("Cleared report on question.");
                    res.send(success);
                }
            });
    } else {
        var err = new Error('question, user, report, and comment requited. ');
        err.status = 400;
        return next(err);
    }
});

app.post('/EditFlash', function(req, res, next) {
    if (req.body.question && req.body.newQuestion && req.body.answer) {
        flash.findOneAndUpdate({
                'question': req.body.question
            }, {
                $set: {
                    question: req.body.newQuestion,
                    answer: req.body.answer
                }
            },
            function(error, success) {
                if (error) {
                    res.send(error);
                    console.log(error);
                } else {
                    console.log("Updated Flash question.");
                    res.send(success);
                }
            });
    } else {
        var err = new Error('question, newQuestion, answer required . ');
        err.status = 400;
        return next(err);
    }
});

app.listen(jsonRoute.port, () => console.log("NULL SERVERED LAUNCHED. LISTENING ON PORT: " + jsonRoute.port));