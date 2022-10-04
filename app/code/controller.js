// const Course = require('../courses/model');
const fs = require('fs');

const Work = require('../works/model');
const User = require('../users/model');
const Code = require('./model');
const RabinKarpJs = require('../../helper/RabinKarp');

module.exports = {
  submitWork: async (req, res) => {
    const { htmlCode, cssCode, jsCode } = req.body;
    try {
      const user = await User.findOne({ _id: req.user.id });

      const work = await Work.findOne({ _id: req.params.id });

      const todayTimestamp = parseInt((new Date().getTime() / 1000).toFixed(0));

      if (todayTimestamp > work.deadline) {
        await Work.findOneAndUpdate(
          { _id: req.params.id },
          { status: 'Ready to review' }
        );

        return res.status(401).json({
          status: 'Fail',
          message:
            "Deadline is already end. You can't submit this work anymore.",
        });
      }

      if (todayTimestamp < work.deadline) {
        await Code.findOneAndUpdate(
          { author: req.user.id, workId: req.params.id },
          {
            cssCode: cssCode,
            htmlCode: htmlCode,
            jsCode: jsCode,
            status: 'Completed',
          }
        );
      }

      const codeTeacher = await Code.find({
        workId: req.params.id,
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
      });
    } catch (error) {
      return res.status(500).json({
        error: error,
      });
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

  checkSimilarity: async (req, res) => {
    const code = await Code.find({ workId: req.params.id }).populate('author');
    code.forEach(async (v, index) => {
      const similarityPercentage = [];
      const similarityResult = [];
      let esprimaCodeStudentA = '';
      code.forEach((y) => {
        if (v.author.name !== y.author.name) {
          const { resultSimilarity, esprimaCodeB, esprimaCodeA } = RabinKarpJs(
            v.jsCode,
            y.jsCode
          );
          esprimaCodeStudentA = esprimaCodeA;
          similarityPercentage.push(resultSimilarity);
          similarityResult.push({
            name: y.author.name,
            percentage: resultSimilarity,
            esprimaCode: esprimaCodeB,
            jsCode: y.jsCode,
          });
        }
      });
      await Work.findOneAndUpdate(
        { _id: req.params.id },
        { status: 'Finished' }
      );
      await Code.findOneAndUpdate(
        { author: v.author._id, workId: req.params.id },
        {
          esprimaCode: esprimaCodeStudentA,
          highestPercentage: `${Math.max(...similarityPercentage)}`,
          similarityResult: similarityResult,
        }
      );
    });
    return await res.status(200).json({
      status: 'OK',
      message: `Sucessfully check the similarity of this assignment`,
    });
  },

  detailStudentCode: async (req, res) => {
    const code = await Code.find({
      author: req.params.studentId,
      workId: req.params.workId,
    }).populate('author', 'name');

    return res.status(200).json({
      status: 'OK',
      data: code,
    });
  },
};
