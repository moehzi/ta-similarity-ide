const mongoose = require('mongoose');
const codeSchema = mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Code tidak boleh kosong'],
  },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  workId: { type: mongoose.Schema.Types.ObjectId, ref: 'Work' },
  status: {
    type: String,
    default: 'Not Completed',
  },
});

module.exports = mongoose.model('Code', codeSchema);
