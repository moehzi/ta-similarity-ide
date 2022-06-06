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

  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
});

module.exports = mongoose.model('Work', workSchema);
