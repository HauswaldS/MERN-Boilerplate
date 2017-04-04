const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const morgan = require('morgan');
const mongoose = require('mongoose');

const router = require('./router');
const app = express();

//DB setup

mongoose.connect('mongodb://localhost:auth/auth');// If it doesn't exit, creates the db /auth

// App setup
// Applies middlewares to the App
app.use(morgan('combined')); // Logs any action done on the server
app.use(bodyParser.json({type: '*/*'})); // Parses any request made to the server into JSON
router(app); // Setup the routes for the application


// Server Setup

const PORT = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(PORT);

console.log('Server listening on port : ', PORT);