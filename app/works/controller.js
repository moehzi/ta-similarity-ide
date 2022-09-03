const Course = require('../courses/model');
const Work = require('./model');
const Code = require('../code/model.js');

module.exports = {
  createWork: async (req, res) => {
    try {
      const { name, description, codeTest } = req.body;

      const course = await Course.findOne({ _id: req.params.id }).populate(
        'author works students'
      );

      const isAuthor = course?.author.some(
        (element) => element.id === req.user.id
      );

      if (!isAuthor)
        return res.status(403).json({
          status: 'FORBIDDEN',
          message: 'You are not the author of this course',
        });

      const work = await Work({
        name,
        description,
        courseId: course._id,
        codeTest,
      });

      if (course.students.length > 0) {
        course.students.map(async (v) => {
          const codes = await Code({
            htmlCode: '',
            cssCode: '',
            jsCode: '',
            author: v._id,
            status: 'Not Completed',
            workId: work._id,
            courseId: course._id,
          });
          work.code.push(codes);
          await codes.save();
        });
      }

      course.works.push(work);
      await work.save();
      await course.save();

      return res.status(200).json({
        status: 'OK',
        message: 'Successfully created work',
        data: work,
      });
    } catch (error) {
      console.log(error.message);
    }
  },

  getWorkById: async (req, res) => {
    try {
      const work = await Work.findById({ _id: req.params.id }).populate({
        path: 'code',
      });

      return res.status(200).json({
        status: 'OK',
        data: work,
      });
    } catch (error) {
      console.log(error.message);
    }
  },
};
