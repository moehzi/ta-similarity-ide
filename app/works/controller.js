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

      const courseClass = await Class.find({ courseId: classCourse.courseId });

      //   const isAuthor = classCourse?.author.some(
      //     (element) => element.id === req.user.id
      //   );

      //   if (!isAuthor)
      //     return res.status(403).json({
      //       status: 'FORBIDDEN',
      //       message: 'You are not the author of this course',
      //     });
      courseClass.map(async (singleClass) => {
        const work = await Work({
          name,
          description,
          classId: singleClass._id,
          codeTest,
          courseId: classCourse.courseId,
        });

        if (singleClass.students.length > 0) {
          singleClass.students.map(async (student) => {
            const codes = await Code({
              htmlCode: '',
              cssCode: '',
              jsCode: '',
              author: student._id,
              status: 'Not Completed',
              workId: work._id,
              classId: singleClass._id,
            });
            work.code.push(codes);
            await codes.save();
          });
        }

        singleClass.works.push(work);
        await singleClass.save();
        await work.save();
      });

      //   if (classCourse.students.length > 0) {
      //     classCourse.students.map(async (v) => {
      //       const codes = await Code({
      //         htmlCode: '',
      //         cssCode: '',
      //         jsCode: '',
      //         author: v._id,
      //         status: 'Not Completed',
      //         workId: work._id,
      //         classId: classCourse._id,
      //       });
      //       work.code.push(codes);
      //       await codes.save();
      //     });
      //   }

      //   classCourse.works.push(work);
      //   await work.save();
      //   await classCourse.save();

      return res.status(200).json({
        status: 'OK',
        message: 'Successfully created work',
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
