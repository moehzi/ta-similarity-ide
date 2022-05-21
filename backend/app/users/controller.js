const User = require('./model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
  JWT_SIGNATURE_KEY = '$2b$10$o/Um9jZOMZxohkDcSpmd7.2DPVB1GLYOo04rQdC3tc81WT2jzYTem',
} = process.env;

function isPasswordValid(password, encryptedPassword) {
  return bcrypt.compareSync(password, encryptedPassword);
}

function createToken(payload) {
  return jwt.sign(payload, JWT_SIGNATURE_KEY, {
    expiresIn: '1h',
  });
}

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

  actionLogin: async (req, res) => {
    try {
      const { username, password } = req.body;

      const user = await User.findOne({ NIM: username });

      if (!user) {
        return res.status(401).json({
          status: 'FAIL',
          data: {
            name: 'UNAUTHORIZED',
            message: 'Username does not exist',
          },
        });
      }

      if (!isPasswordValid(password, user.encryptedPassword)) {
        return res.status(401).json({
          status: 'FAIL',
          data: {
            name: 'UNAUTHORIZED',
            message: 'Wrong password',
          },
        });
      }

      return res.status(201).json({
        status: 'OK',
        data: {
          token: createToken({
            id: user.id,
            username: user.NIM,
            role: user.role,
          }),
        },
      });
    } catch (error) {
      res.send({ message: err.message || 'Internal Server Errror' });
    }
  },
};
