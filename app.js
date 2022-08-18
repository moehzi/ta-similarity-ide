const express = require('express');
const db = require('./db');
const cors = require('cors');

const userRouter = require('./app/users/router');
const authRouter = require('./app/auth/router');
const courseRouter = require('./app/courses/router');
const workRouter = require('./app/works/router');

const app = express();
app.use(cors());

// view engine setup
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(authRouter);
app.use(userRouter);
app.use(courseRouter);
app.use(workRouter);

const PORT = process.env.PORT || '8080';

db.on('error', (err) => {
  console.log('Connection error: tidak bisa tersambung ke mongo db');
});

db.on('open', () => {
  console.log(`Berhasil tersambung ke database ${PORT}`);
  app.listen(PORT);
});
