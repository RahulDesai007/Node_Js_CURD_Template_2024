const express = require('express')
const bodyParser = require('body-parser')
const feedRoutes = require('./routes/feed')
const authRoutes = require('./routes/auth')
const app = express()
const mongoose = require('mongoose')

//application/json
app.use(bodyParser.json())

// setting up CORS //
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    // options is just an additional request sent by client 
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// app.use acts like a gatekeeper , sets up general things that will route all the requests to their
//specific paths (along with GET, POST, PUT, PATCH, DELETE)
app.use('/feed', feedRoutes)  
app.use('/auth', authRoutes)

mongoose
    .connect(
        'mongodb+srv://rahdesai7:njsbsLo1MORvfC4K@cluster0.zlewswc.mongodb.net/test?retryWrites=true'
    ).then(() => {
        console.log("Server running on port 8080....")
        app.listen(8080)
    }).catch((error) => {
        console.log(error)
    })

