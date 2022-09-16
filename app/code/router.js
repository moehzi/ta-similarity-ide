var express = require('express');
const isAuth = require('../../middlewares/isAuth');
const isRole = require('../../middlewares/isRole');
const {
  submitWork,
  testWork,
  getCode,
  checkSimilarity,
  detailStudentCode,
} = require('./controller');
var router = express.Router();

router.post('/works/:id/submit-work', isAuth, isRole(['student']), submitWork);
router.post('/works/:id/test-work', isAuth, isRole(['student']), testWork);
router.get('/code-aja', getCode);
router.post(
  '/check-similarity/:id',
  isAuth,
  isRole(['teacher']),
  checkSimilarity
);

router.get(
  '/detail-work/:workId/student/:studentId',
  isAuth,
  isRole(['teacher','student']),
  detailStudentCode
);

module.exports = router;
