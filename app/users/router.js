var express = require('express');
const isAuth = require('../../middlewares/isAuth');
const isRole = require('../../middlewares/isRole');
var router = express.Router();
const { getUsers, myProfile, getTeacher } = require('./controller');

/* GET home page. */
router.get('/users', isAuth, isRole(['teacher']), getUsers);
router.get('/profile', isAuth, isRole(['teacher', 'student']), myProfile);
router.get('/user/teacher', isAuth, isRole(['teacher', 'student']), getTeacher);
module.exports = router;
