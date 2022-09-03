// const Course = require('../courses/model');
const fs = require('fs');

const Work = require('../works/model');
const User = require('../users/model');
const Code = require('./model');

module.exports = {
  submitWork: async (req, res) => {
    const { htmlCode, cssCode, jsCode } = req.body;
    try {
      const code = await Code.findOneAndUpdate(
        { author: req.user.id, workId: req.params.id },
        {
          cssCode: cssCode,
          htmlCode: htmlCode,
          jsCode: jsCode,
          status: 'Completed',
        }
      );

      const user = await User.findOne({ _id: req.user.id });

      const codeTeacher = await Code.find({
        author: req.user.id,
        courseId: req.params.id,
      }).populate({ path: 'workId', populate: { path: 'code' } });

      const getStatus = codeTeacher.map((v) => v.status);
      if (!getStatus.includes('Not Completed')) {
        await Work.findOneAndUpdate(
          { _id: req.params.id },
          { status: 'Ready to review' }
        );
      }

      return res.status(200).json({
        status: 'OK',
        message: 'Successfully submit work',
        data: code,
        teacherCode: codeTeacher,
      });
    } catch (error) {
      console.log(error.message);
    }
  },

  testWork: async (req, res) => {
    try {
      let jsTest = `
	const chai = require("chai");
	const resnap = require("resnap")();
	`;

      const clearCache = require('resnap')();
      // -------- requirements for js testing ---------
      const MochaTester = require('../../helper/MochaTester');

      await Work.findOne({ _id: req.params.id }, (err, doc) => {
        const js = req.body.jsCode;
        jsTest += js;
        jsTest += doc.codeTest;

        fs.writeFileSync('program_test.js', jsTest);
        fs.writeFile('./program.js', js, () => {
          MochaTester('./program_test.js')
            .then((pass) => {
              console.log(pass, 'ini pass');
              let testedJsCode = pass.results.every((test) => test);
              clearCache();
              return res.status(200).json({
                status: 'OK',
                data: pass,
                solution: testedJsCode,
              });
            })
            .catch((err) => {
              clearCache();
              return res.status(200).json({
                solution: false,
                data: {
                  error_msg: [err.message],
                },
              });
            });
        });
      })
        .clone()
        .catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
    }
  },

  getCode: async (req, res) => {
    const code = await Code.find();

    return res.status(200).json({ code });
  },
};
