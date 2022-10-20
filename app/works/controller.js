const Course = require('../courses/model');
const Work = require('./model');
const Code = require('../code/model.js');
const Class = require('../class/model.js');

module.exports = {
  createWork: async (req, res) => {
    try {
      const { name, description, codeTest, deadline } = req.body;

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
          deadline,
          courseId: classCourse.courseId,
        });

        console.log('mantul');

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
              courseId: classCourse.courseId,
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

  editWork: async (req, res) => {
    try {
      const { name, description, codeTest, deadline } = req.body;
      const work = await Work.findOneAndUpdate(
        { _id: req.params.id },
        { name, description, codeTest, deadline }
      );

      return res.status(200).json({
        status: 'OK',
        message: 'Succesfully update work',
        data: work,
      });
    } catch (error) {
      console.log(error);
    }
  },

  deleteWork: async (req, res) => {
    try {
      const work = await Work.findOneAndRemove({ _id: req.params.id });

      const isAuthor = await Work.findOne({ author: { _id: req.user.id } });

      if (!isAuthor)
        return res.status(403).json({
          status: 'FORBIDDEN',
          message: 'You are not the author of this course',
        });

      if (!work)
        return res.status(404).json({ status: 'Fail', message: 'Not found' });

      return res.status(200).json({
        status: 'OK',
        message: 'Delete sucessfully',
      });
    } catch (error) {
      console.log(error);
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

  changeVisibleWork: async (req, res) => {
    try {
      const work = await Work.findOne({ _id: req.params.id });

      await Work.findOneAndUpdate(
        { _id: req.params.id },
        { isVisible: !work.isVisible }
      );

      return res.status(200).json({
        status: 'OK',
        message: 'Succesfully change the visible of work',
      });
    } catch (error) {
      console.log(error);
    }
  },
};
