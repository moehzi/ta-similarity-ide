const mongoose = require('mongoose');

const workSchema = mongoose.Schema(
  {
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
    htmlStarter: { type: String },
    cssStarter: { type: String },
    jsStarter: { type: String },
    code: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Code' }],
    status: {
      type: String,
      default: 'Not ready to review',
    },
    algorithmSimilarity: { type: String },
    deadline: { type: Number, required: [true, 'Deadline tidak boleh kosong'] },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
    exerciseId: { type: mongoose.Schema.Types.ObjectId },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Work', workSchema);
