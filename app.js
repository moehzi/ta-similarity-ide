var express = require('express');
var debug = require('debug')('backend:server');
var http = require('http');
const db = require('./db');

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

/**
 * Get port from environment and store in Express.
 */

var port = process.env.PORT || '8080';
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

db.on('error', (err) => {
  console.log('Connection error: tidak bisa tersambung ke mongo db');
});

db.on('open', () => {
  console.log(`Berhasil tersambung ke database ${port}`);
  server.listen(port);
});
