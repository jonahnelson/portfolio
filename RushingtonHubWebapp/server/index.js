const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios')
require('dotenv').config({path: '../.env'})
const app = express();
const PORT = process.env.PORT || 5000 


app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cors());

// Database
const db = require('./config/database');
const { access } = require('fs');

// Test DB
db.authenticate()
  .then(() => console.log('Database connected...'))
  .catch(err => console.log('Error: ' + err))

// Index route
app.get('/api', (req, res) => res.send('INDEX'));


// routes

app.use('/api/audomain', require('./routes/audomain'));
app.use('/api/downtime', require('./routes/downtime'));
app.use('/api/lighthouse', require('./routes/lighthouse'));
app.use('/api/responsetime', require('./routes/responsetime'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/brokenlinksreport', require('./routes/brokenlinksreport'));
app.use('/api/subscription', require('./routes/subscription'));
app.use('/api/companyid', require('./routes/companyid'));
app.use('/api/authentication', require('./routes/authentication'));

app.listen(PORT, console.log(`Server started on port ${PORT}`));
