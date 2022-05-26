var express = require('express');
const isAuth = require('../../middlewares/isAuth');
const isRole = require('../../middlewares/isRole');
var router = express.Router();
const { getUsers } = require('./controller');

/* GET home page. */
router.get('/users', isAuth, isRole(['teacher']), getUsers);
module.exports = router;
