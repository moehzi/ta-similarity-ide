const User = require('./model');
const bcrypt = require('bcrypt');

module.exports = {
  index: async (req, res) => {
    try {
      const users = await User.find();

      res.send({ data: users });
    } catch (err) {
      res.send({ message: err.message || 'Internal Server Errror' });
    }
  },

  actionRegister: async (req, res) => {
    try {
      const { name, password, role, NIM } = req.body;

      const encryptedPassword = bcrypt.hashSync(password, 10);

      const NIMExist = await User.findOne({ NIM: NIM });

      if (NIMExist) {
        return res.status(400).json({
          data: {
            status: 'FAIL',
            message: 'NIM is already registered',
          },
        });
      }

      const user = await User.create({
        name,
        encryptedPassword,
        role,
        NIM,
      });

      return res.status(201).json({
        status: 'OK',
        message: 'You are successfully registered',
        data: {
          id: user.id,
          name: user.name,
          NIM: user.NIM,
          role: user.role,
        },
      });
    } catch (err) {
      res.send({ message: err.message || 'Internal Server Errror' });
    }
  },
};
