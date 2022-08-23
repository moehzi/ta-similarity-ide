const mongoose = require('mongoose');

const workSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nama tidak boleh kosong'],
  },
  description: {
    type: String,
    required: [true, 'Deskripsi tidak boleh kosong'],
  },
  codeTest: {
    type: String,
    required: [true, 'Code Test tidak boleh kosong'],
  },
  expectedOutput: {
    type: String,
    required: [true, 'Expected Output tidak boleh kosong'],
  },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
});

module.exports = mongoose.model('Work', workSchema);
