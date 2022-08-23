// const Course = require('../courses/model');
const Work = require('../works/model');
const User = require('../users/model');
const Code = require('./model');

module.exports = {
  submitWork: async (req, res) => {
    try {
      const work = await Work.findOne({ _id: req.params.id });
      const user = await User.findOne({ _id: req.user.id });

      const { code } = req.body;

      const codeBody = await Code({
        code,
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
};
