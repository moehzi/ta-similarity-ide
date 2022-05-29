const User = require('./model');

module.exports = {
  getUsers: async (req, res) => {
    const user = await User.find();

    return res.status(200).json({
      status: 'OK',
      data: user,
    });
  },

  myProfile: async (req, res) => {
    const user = await User.findOne({ _id: req.user.id });

    if (!user)
      return res.status(404).json({
        status: 'Fail',
        message: 'Not Found',
      });

    return res.status(200).json({
      status: 'OK',
      data: {
        username: user.registrationNumber,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  },
};
