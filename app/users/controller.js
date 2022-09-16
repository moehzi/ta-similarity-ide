const User = require('./model');
const Course = require('../courses/model');

module.exports = {
  getUsers: async (req, res) => {
    const user = await User.find();

    return res.status(200).json({
      status: 'OK',
      data: user,
    });
  },

  getTeacher: async (req, res) => {
    const user = await User.find({ role: 'teacher' }).select({
      encryptedPassword: 0,
      __v: 0,
      courses: 0,
    });

    const teacher = user.filter((v) => v._id.toString() !== req.user.id);

    return res.status(200).json({
      status: 'OK',
      data: teacher,
    });
  },

  myProfile: async (req, res) => {
    const user = await User.findOne({ _id: req.user.id }).select({
      encryptedPassword: 0,
      __v: 0,
      courses: 0,
    });

    if (!user)
      return res.status(404).json({
        status: 'Fail',
        message: 'Not Found',
      });

    return res.status(200).json({
      status: 'OK',
      data: user,
    });
  },
};
