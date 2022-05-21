var express = require('express');
var router = express.Router();
const { index, actionRegister } = require('./controller');

/* GET home page. */
router.get('/', index);
router.post('/register', actionRegister);
module.exports = router;
