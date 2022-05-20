var express = require('express');
var router = express.Router();
const { index, actionCreate } = require('./controller');

/* GET home page. */
router.get('/', index);
router.post('/', actionCreate);
module.exports = router;
