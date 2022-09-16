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
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  status: {
    type: String,
    default: 'Not ready to review',
  },
});

module.exports = mongoose.model('Work', workSchema);
