const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nama tidak boleh kosong'],
  },
  NIM: {
    type: String,
    required: [true, 'NIM tidak boleh kosong'],
    unique: true,
  },
  encryptedPassword: {
    type: String,
    required: [true, 'Password tidak boleh kosong'],
  },
  role: {
    type: String,
    default: 'student',
    enum: ['student', 'teacher', 'admin'],
  },
});

module.exports = mongoose.model('User', userSchema);
