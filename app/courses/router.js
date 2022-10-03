var express = require('express');
const isAuth = require('../../middlewares/isAuth');
const isRole = require('../../middlewares/isRole');
var router = express.Router();
const {
  createCourse,
  joinCourse,
  getCourseswithStudents,
  deleteCourse,
  editCourse,
  getMyCourse,
  getListWorkOfCourse,
  getCourseById,
} = require('./controller');

/* GET home page. */
router.post('/courses', isAuth, isRole(['teacher']), createCourse);
router.post('/join-course/:id', isAuth, isRole(['student']), joinCourse);
router.get('/courses', getCourseswithStudents);
router.get('/courses/:id', getCourseById);
router.delete('/courses/:id', isAuth, isRole(['teacher']), deleteCourse);
router.put('/courses/:id', isAuth, isRole(['teacher']), editCourse);
router.get('/my-course', isAuth, isRole(['teacher', 'student']), getMyCourse);
router.get(
  '/courses/:id/works',
  isAuth,
  isRole(['teacher', 'student']),
  getListWorkOfCourse
);
module.exports = router;
