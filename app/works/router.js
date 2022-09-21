var express = require('express');
const isAuth = require('../../middlewares/isAuth');
const isRole = require('../../middlewares/isRole');
const {
  createWork,
  getListWorkOfCourse,
  getWorkById,
  changeVisibleWork,
} = require('./controller');
var router = express.Router();

/* GET home page. */
router.post('/courses/:id/works', isAuth, isRole(['teacher']), createWork);
router.get('/works/:id', isAuth, isRole(['teacher', 'student']), getWorkById);
router.post(
  '/works/:id/visible',
  isAuth,
  isRole(['teacher']),
  changeVisibleWork
);

module.exports = router;
