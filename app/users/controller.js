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

  myProfile: async (req, res) => {
    const user = await User.findOne({ _id: req.user.id })
      .populate('courses', '-students')
      .select({
        encryptedPassword: 0,
        __v: 0,
      });

    const course = await Course.find({ author: { _id: req.user.id } });

    if (user.role === 'teacher')
      return res.status(200).json({
        status: 'OK',
        data: course,
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
