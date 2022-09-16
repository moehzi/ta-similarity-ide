const Class = require('./model');
const User = require('../users/model');
const Work = require('../works/model');
const Code = require('../code/model');

module.exports = {
  createClass: async (req, res) => {
    const { name, author } = req.body;

    const user = await User.findOne({ _id: req.user.id }).select({
      encryptedPassword: 0,
    });

    const work = await Work.find({ courseId: req.params.courseId });

    const classCourse = await Class({
      name,
      author,
      courseId: req.params.courseId,
    });
    classCourse.author.push(user);

    work.forEach((v) => classCourse.works.push(v));
    await classCourse.save();

    return res.status(200).json({
      status: 'OK',
      message: 'Successfully created class',
      data: classCourse,
    });
  },

  getClassByCourseId: async (req, res) => {
    const classCourse = await Class.find({
      courseId: req.params.courseId,
    }).populate('author works');

    return res.status(200).json({
      status: 'OK',
      data: classCourse,
    });
  },

  getListWorkOfClass: async (req, res) => {
    try {
      const classCourse = await Class.findOne({ _id: req.params.id }).populate(
        'author works'
      );

      const code = await Code.find({
        author: req.user.id,
        courseId: req.params.id,
      }).populate('workId');
      //   const statusCode = code.map((v) => v.status);

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

      if (req.user.role === 'teacher') {
        return res.status(200).json({
          status: 'OK',
          data: classCourse,
        });
      }

      return res.status(200).json({
        status: 'OK',
        data: {
          name: classCourse.name,
          author: classCourse.author[0].name,
          works: code,
        },
      });
    } catch (error) {
      console.log(error.message);
    }
  },

  getListClass: async (req, res) => {
    const classCourse = await Class.find().populate(
      'students author works',
      '-__v -encryptedPassword'
    );

    return res.status(200).json({
      status: 'OK',
      data: classCourse,
    });
  },

  joinClass: async (req, res) => {
    const classCourse = await Class.findOne({ _id: req.params.id }).populate(
      'students works'
    );

    const user = await User.findOne({ _id: req.user.id });

    const isExist = classCourse?.students.some(
      (element) => element.registrationNumber === user.registrationNumber
    );

    if (isExist)
      return res.status(400).json({
        status: '400',
        message: 'You are already join this class',
      });

    classCourse.works.map(async (v) => {
      const codes = await Code({
        htmlCode: '',
        cssCode: '',
        jsCode: '',
        author: req.user.id,
        status: 'Not Completed',
        workId: v._id,
        courseId: classCourse.courseId,
      });
      v.code.push(codes);
      await codes.save();
    });

    classCourse.students.push(user);
    user.classes.push(classCourse);
    user.save();
    classCourse.save();

    if (!classCourse)
      return res
        .status(404)
        .json({ status: 'Fail', message: 'Your class is not available' });

    return res.status(200).json({
      status: 'OK',
      message: `Successfully join ${classCourse.name} class`,
      data: classCourse,
    });
  },
};
