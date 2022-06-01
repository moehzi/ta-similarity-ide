const mongoose = require('mongoose');
const User = require('./model');

const coursesSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nama tidak boleh kosong'],
  },
  author: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

module.exports = mongoose.model('Course', coursesSchema);
