var express = require('express');
const isAuth = require('../../middlewares/isAuth');
const isRole = require('../../middlewares/isRole');
const { createWorks } = require('./controller');
var router = express.Router();

/* GET home page. */
router.post('/courses/:id/works', isAuth, isRole(['teacher']), createWorks);
module.exports = router;
