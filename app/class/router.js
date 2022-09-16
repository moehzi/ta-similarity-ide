var express = require('express');
const isAuth = require('../../middlewares/isAuth');
const isRole = require('../../middlewares/isRole');
const {
  createClass,
  getClassByCourseId,
  getListWorkOfClass,
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

module.exports = router;
