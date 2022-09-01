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
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Code' }],
});

module.exports = mongoose.model('Work', workSchema);
