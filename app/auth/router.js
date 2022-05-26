var express = require('express');
var router = express.Router();
const { actionRegister, actionLogin } = require('./controller');

/* GET home page. */
router.post('/register', actionRegister);
router.post('/login', actionLogin);
module.exports = router;
