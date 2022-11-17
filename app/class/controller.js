const Class = require('./model');
const User = require('../users/model');
const Work = require('../works/model');
const Code = require('../code/model');
const Course = require('../courses/model');
const mongoose = require('mongoose');
const fs = require('fs');

module.exports = {
  createClass: async (req, res) => {
    try {
      const { name, author } = req.body;

      const course = await Course.findById({ _id: req.params.courseId });
      // const work = await Work.find({ classId: course.classes[0] });
      //   const authorArr = author.map((v) => mongoose.Types.ObjectId(v));

      // console.log(authorArr, 'ini author Arr');

      const classCourse = await Class.create({
        name,
        author: author,
        courseId: req.params.courseId,
      });

      await classCourse.save();

      classCourse.author.forEach(async (v) => {
        const user = await User.findOne({ _id: v._id });
        user.classes.push(classCourse);
        await user.save();
      });

      course.classes.push(classCourse);

      const filteredAuthor = author.filter((v) => v !== req.user.id);

      // check if Author is not user logged in.
      if (filteredAuthor.length > 0) {
        course.author.push(...filteredAuthor);
      }
      await course.save();

      return res.status(200).json({
        status: 'OK',
        message: 'Successfully created class',
        data: classCourse,
      });
    } catch (error) {
      console.log(error);
    }
  },

  editClass: async (req, res) => {
    const { name, author } = req.body;

    const classCourse = await Class.findOneAndUpdate(
      { _id: req.params.id },
      { name, author }
    );

    const user = await User.findOne({ _id: req.user.id }).select({
      encryptedPassword: 0,
      courses: 0,
    });

    // const isAuthor = await Course.findOne({ author: { _id: req.user.id } });

    // if (!isAuthor)
    //   return res.status(403).json({
    //     status: 'FORBIDDEN',
    //     message: 'You are not the author of this course',
    //   });

    if (!classCourse)
      return res.status(404).json({ status: 'Fail', message: 'Not found' });

    return res.status(200).json({
      status: 'OK',
      message: 'Your updated sucessfully',
      data: { name: name, author: author },
    });
  },

  deleteClass: async (req, res) => {
    const getClass = await Class.findOne({ _id: req.params.id }).populate(
      'author'
    );

    const classCourse = await Class.findOneAndDelete({ _id: req.params.id });

    const isAuthor = getClass.author.some(
      (e) => e._id.toString() === req.user.id
    );

    if (!isAuthor)
      return res.status(403).json({
        status: 'FORBIDDEN',
        message: 'You are not the author of this class',
      });

    if (!classCourse)
      return res.status(404).json({ status: 'Fail', message: 'Not found' });

    return res.status(200).json({
      status: 'OK',
      message: 'Delete sucessfully',
    });
  },

  getClassByCourseId: async (req, res) => {
    const classCourse = await Class.find({
      courseId: req.params.courseId,
      author: req.user.id,
    }).populate('author works');

    return res.status(200).json({
      status: 'OK',
      data: classCourse,
    });
  },

  getListWorkOfClass: async (req, res) => {
    try {
      const classCourse = await Class.findOne({
        _id: req.params.id,
      }).populate('author works');

      const code = await Code.find({
        author: req.user.id,
        classId: req.params.id,
      }).populate('workId');
      //   const statusCode = code.map((v) => v.status);

      const codeTeacher = await Code.find({
        classId: req.params.id,
      }).populate({ path: 'workId', populate: { path: 'code' } });

      classCourse.works.forEach(async (v) => {
        const todayTimestamp = parseInt(
          (new Date().getTime() / 1000).toFixed(0)
        );

        if (v.deadline < todayTimestamp && v.status !== 'Finished') {
          await Work.findOneAndUpdate(
            {
              _id: v._id,
            },
            { status: 'Ready to review' }
          );

          fs.rm(
            `/Programs/Work/${req.params.id}`,
            {
              recursive: true,
              force: true,
            },
            (err) => {
              if (err) {
                console.log(err.message);
              }
            }
          );
        }
      });

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
      console.log(error);
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
        classId: req.params.id,
        courseId: classCourse.courseId,
      });
      v.code.push(codes);
      await codes.save();
    });

    classCourse.students.push(user);
    user.classes.push(classCourse);

    await user.save();
    await classCourse.save();

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

  getMyClass: async (req, res) => {
    // const user = await User.findOne({ _id: req.user.id })
    //   .populate({
    //     path: 'classes',
    //     select: {
    //       name: 1,
    //     },
    //     populate: [
    //       {
    //         path: 'author',
    //         model: 'User',
    //         select: {
    //           name: 1,
    //         },
    //       },
    //       {
    //         path: 'works',
    //         model: 'Work',
    //         select: {
    //           name: 1,
    //         },
    //       },
    //     ],
    //   })
    //   .select({
    //     encryptedPassword: 0,
    //     __v: 0,
    //   });

    try {
      const user = await User.findOne({ _id: req.user.id })
        .populate({
          path: 'classes',
          populate: [
            {
              path: 'author',
              model: 'User',
              select: {
                name: 1,
              },
            },
            {
              path: 'works',
              model: 'Work',
              select: {
                name: 1,
              },
            },
          ],
        })
        .select({
          encryptedPassword: 0,
        });

      return res.status(200).json({
        status: 'OK',
        data: user,
      });
    } catch (error) {
      console.log(error);
    }
  },
};
