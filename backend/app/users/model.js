const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nama tidak boleh kosong'],
  },
  registrationNumber: {
    type: String,
    required: [true, 'NIM/NIP tidak boleh kosong'],
    unique: true,
  },
  email: {
    type: String,
    required: [true, 'Email tidak boleh kosong'],
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
