const mongoose = require('mongoose');
const codeSchema = mongoose.Schema({
  jsCode: {
    type: String,
    default: '',
  },
  htmlCode: {
    type: String,
    default: '',
  },
  cssCode: {
    type: String,
    default: '',
  },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  workId: { type: mongoose.Schema.Types.ObjectId, ref: 'Work' },
  status: {
    type: String,
    required: [true, 'Status tidak boleh kosong'],
    default: 'Not Completed',
  },
  result: {
    type: String,
    default: '',
  },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
});

module.exports = mongoose.model('Code', codeSchema);
