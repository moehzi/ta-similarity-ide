const Course = require('../courses/model');
const Work = require('./model');
const Code = require('../code/model.js');
const Class = require('../class/model.js');

module.exports = {
  createWork: async (req, res) => {
    try {
      const { name, description, codeTest } = req.body;

      const classCourse = await Class.findOne({ _id: req.params.id }).populate(
        'author works students'
      );

      console.log(classCourse);

      const isAuthor = classCourse?.author.some(
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
        classId: classCourse._id,
        codeTest,
      });

      if (classCourse.students.length > 0) {
        classCourse.students.map(async (v) => {
          const codes = await Code({
            htmlCode: '',
            cssCode: '',
            jsCode: '',
            author: v._id,
            status: 'Not Completed',
            workId: work._id,
            classId: classCourse._id,
          });
          work.code.push(codes);
          await codes.save();
        });
      }

      classCourse.works.push(work);
      await work.save();
      await classCourse.save();

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
        populate: {
          path: 'author',
          select: 'name',
        },
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
