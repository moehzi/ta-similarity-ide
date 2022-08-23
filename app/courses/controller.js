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

  deleteCourse: async (req, res) => {
    const course = await Course.findOneAndRemove({ _id: req.params.id });

    const isAuthor = await Course.findOne({ author: { _id: req.user.id } });

    if (!isAuthor)
      return res.status(403).json({
        status: 'FORBIDDEN',
        message: 'You are not the author of this course',
      });

    if (!course)
      return res.status(404).json({ status: 'Fail', message: 'Not found' });

    return res.status(200).json({
      status: 'OK',
      message: 'Delete sucessfully',
    });
  },

  editCourse: async (req, res) => {
    const { name } = req.body;

    const course = await Course.findOneAndUpdate(
      { _id: req.params.id },
      { name }
    );

    const user = await User.findOne({ _id: req.user.id }).select({
      encryptedPassword: 0,
      courses: 0,
    });

    const isAuthor = await Course.findOne({ author: { _id: req.user.id } });

    if (!isAuthor)
      return res.status(403).json({
        status: 'FORBIDDEN',
        message: 'You are not the author of this course',
      });

    if (!course)
      return res.status(404).json({ status: 'Fail', message: 'Not found' });

    return res.status(200).json({
      status: 'OK',
      message: 'Your updated sucessfully',
      data: { name: name, author: user },
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

  getMyCourse: async (req, res) => {
    const course = await Course.find({ author: { _id: req.user.id } }).populate(
      'students author',
      '-courses -encryptedPassword'
    );

    const user = await User.findOne({ _id: req.user.id })
      .populate({
        path: 'courses',
        select: {
          name: 1,
        },
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
        __v: 0,
      });

    if (user.role === 'teacher')
      return res.status(200).json({
        status: 'OK',
        data: course,
      });

    return res.status(200).json({
      status: 'OK',
      data: user,
    });
  },

  getCourseswithStudents: async (req, res) => {
    const course = await Course.find().populate(
      'students author works',
      '-__v -encryptedPassword'
    );

    return res.status(200).json({
      status: 'OK',
      data: course,
    });
  },

  getListWorkOfCourse: async (req, res) => {
    try {
      const course = await Course.findById({ _id: req.params.id }).populate({
        path: 'author works',
        select: { name: 1 },
      });

      return res.status(200).json({
        status: 'OK',
        data: course,
      });
    } catch (error) {
      console.log(error.message);
    }
  },
};
