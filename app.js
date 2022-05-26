const express = require('express');
const db = require('./db');

const userRouter = require('./app/users/router');
const authRouter = require('./app/auth/router');

const app = express();

app.get('/', (req, res) => {
  res.send('<h1>Hello World</h1>');
});
// view engine setup
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(authRouter);
app.use(userRouter);

const port = process.env.PORT || '8080';

db.on('error', (err) => {
  console.log('Connection error: tidak bisa tersambung ke mongo db');
});

db.on('open', () => {
  console.log(`Berhasil tersambung ke database ${port}`);
  app.listen(port);
});
