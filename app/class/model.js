const mongoose = require('mongoose');
const classSchema = mongoose.Schema({
  name: { type: String },
  author: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  works: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Work' }],
});

module.exports = mongoose.model('Class', classSchema);
