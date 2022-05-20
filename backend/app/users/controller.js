const User = require('./model');

module.exports = {
  index: async (req, res) => {
    try {
      const users = await User.find();

      res.send({ data: users });
    } catch (err) {
      res.send({ message: err.message || 'Internal Server Errror' });
    }
  },

  actionCreate: async (req, res) => {
    try {
      const { name } = req.body;
      const user = await User.create({
        name,
      });

      res.send({ data: user, message: 'Berhasil' });
    } catch (err) {
      res.send({ message: err.message || 'Internal Server Errror' });
    }
  },
};
