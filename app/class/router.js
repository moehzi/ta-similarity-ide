var express = require('express');
const isAuth = require('../../middlewares/isAuth');
const isRole = require('../../middlewares/isRole');
const {
  createClass,
  getClassByCourseId,
  getListWorkOfClass,
  getListClass,
  joinClass,
} = require('./controller');
var router = express.Router();

router.post('/class/:courseId', isAuth, isRole(['teacher']), createClass);
router.get(
  '/class/:courseId',
  isAuth,
  isRole(['teacher', 'student']),
  getClassByCourseId
);
router.get(
  '/class/:id/works',
  isAuth,
  isRole(['teacher', 'student']),
  getListWorkOfClass
);

router.get('/class', getListClass);
router.post('/join-class/:id', isAuth, isRole(['student']), joinClass);
module.exports = router;
