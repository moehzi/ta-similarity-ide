var express = require('express');

const userRouter = require('./app/users/router');

var app = express();

// view engine setup
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/user', userRouter);

module.exports = app;
