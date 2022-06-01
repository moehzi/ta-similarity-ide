const Course = require('./model');
const User = require('../users/model');

module.exports = {
  createCourse: async (req, res) => {
    const { name } = req.body;

    const user = await User.findOne({ _id: req.user.id }).select({
      encryptedPassword: 0,
      courses: 0,
    });

    const course = await Course({ name });
    course.author.push(user);
    await course.save();

    return res.status(200).json({
      status: 'OK',
      message: 'Successfully created course',
      data: { name: course.name, author: user },
    });
  },

  joinCourse: async (req, res) => {
    const course = await Course.findOne({ _id: req.params.id }).populate(
      'students'
    );

    const user = await User.findOne({ _id: req.user.id });

    const isExist = course?.students.some(
      (element) => element.registrationNumber === user.registrationNumber
    );

    if (isExist)
      return res.status(400).json({
        status: '400',
        message: 'You are already join this class',
      });

    course.students.push(user);
    user.courses.push(course);
    user.save();
    course.save();

    if (!course)
      return res
        .status(404)
        .json({ status: 'Fail', message: 'Your course is not available' });

    return res.status(200).json({
      status: 'OK',
      message: `Successfully join ${course.name} course`,
    });
  },

  getCourseswithStudents: async (req, res) => {
    const course = await Course.find().populate(
      'students',
      '-encryptedPassword'
    );

    return res.status(200).json({
      status: 'OK',
      data: course,
    });
  },
};
