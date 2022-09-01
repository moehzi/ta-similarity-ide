// const Course = require('../courses/model');
const fs = require('fs');

const Work = require('../works/model');
const User = require('../users/model');
const Code = require('./model');

module.exports = {
  submitWork: async (req, res) => {
    try {
      const work = await Work.findOne({ _id: req.params.id });
      const user = await User.findOne({ _id: req.user.id });

      const { htmlCode, cssCode, jsCode } = req.body;

      const codeBody = await Code({
        cssCode,
        htmlCode,
        jsCode,
        status: 'Completed',
        author: req.user.id,
        workId: req.params.id,
      });

      work.students.push(codeBody);
      await codeBody.save();
      await work.save();

      return res.status(200).json({
        status: 'OK',
        message: 'Successfully created work',
        data: codeBody,
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
        jsTest += doc.codeTest;
        jsTest += js;

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
                sol: false,
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
};
