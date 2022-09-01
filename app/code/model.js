const mongoose = require('mongoose');
const codeSchema = mongoose.Schema({
  jsCode: {
    type: String,
    required: [true, 'Code tidak boleh kosong'],
  },
  htmlCode: {
    type: String,
  },
  cssCode: {
    type: String,
  },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  workId: { type: mongoose.Schema.Types.ObjectId, ref: 'Work' },
  status: {
    type: String,
    required: [true, 'Status tidak boleh kosong'],
  },
  result: {
    type: String,
  },
});

module.exports = mongoose.model('Code', codeSchema);
