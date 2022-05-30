const mongoose = require('mongoose');

const coursesSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nama tidak boleh kosong'],
  },
  students: {
    name: String,
    NIM: String,
  },
});

module.exports = mongoose.model('Courses', coursesSchema);
