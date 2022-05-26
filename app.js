var express = require('express');

const userRouter = require('./app/users/router');
const authRouter = require('./app/auth/router');

var app = express();

app.get('/', (req, res) => {
  res.send('<h1>Hello World</h1>');
});
// view engine setup
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(authRouter);
app.use(userRouter);

module.exports = app;
