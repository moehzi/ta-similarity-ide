var express = require('express');
var router = express.Router();
const { index, actionRegister, actionLogin } = require('./controller');

/* GET home page. */
router.get('/', index);
router.post('/register', actionRegister);
router.post('/login', actionLogin);
module.exports = router;
