var express = require('express');
var router = express.Router();
const { actionRegister, actionLogin } = require('./controller');
const isRole = require('../../middlewares/isRole');
const isAuth = require('../../middlewares/isAuth');
/* GET home page. */
router.post('/register', actionRegister);
router.post('/login', actionLogin);
module.exports = router;
