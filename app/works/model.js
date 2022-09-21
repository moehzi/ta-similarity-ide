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
  code: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Code' }],
  status: {
    type: String,
    default: 'Not ready to review',
  },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
});

module.exports = mongoose.model('Work', workSchema);
