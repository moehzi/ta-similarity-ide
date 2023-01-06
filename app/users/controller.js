const User = require('./model');

module.exports = {
  getUsers: async (req, res) => {
    const user = await User.find();

    return res.status(200).json({
      status: 'OK',
      data: user,
    });
  },

  getTeacher: async (req, res) => {
    const teacher = await User.find({ role: 'teacher' }).select({
      encryptedPassword: 0,
      __v: 0,
    });

    return res.status(200).json({
      status: 'OK',
      data: teacher,
    });
  },

  myProfile: async (req, res) => {
    const user = await User.findOne({ _id: req.user.id }).select({
      encryptedPassword: 0,
      __v: 0,
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
