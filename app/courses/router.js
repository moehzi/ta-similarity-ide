var express = require('express');
const isAuth = require('../../middlewares/isAuth');
const isRole = require('../../middlewares/isRole');
var router = express.Router();
const { createCourse } = require('./controller');

/* GET home page. */
router.post('/courses', isAuth, isRole(['teacher']), createCourse);
module.exports = router;
