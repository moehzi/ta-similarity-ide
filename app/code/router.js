var express = require('express');
const isAuth = require('../../middlewares/isAuth');
const isRole = require('../../middlewares/isRole');
const { submitWork } = require('./controller');
var router = express.Router();

router.post('/works/:id/submit-work', isAuth, isRole(['student']), submitWork);

module.exports = router;
