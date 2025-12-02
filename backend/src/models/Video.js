const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: String,
  originalName: String,
  filePath: String,
  mimeType: String,
  size: Number,

  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  tenantId: String,

  status: {
    type: String,
    enum: ['uploaded', 'processing', 'processed', 'failed'],
    default: 'uploaded'
  },
  sensitivityStatus: {
    type: String,
    enum: ['safe', 'flagged', 'unknown'],
    default: 'unknown'
  },
  processingProgress: { type: Number, default: 0 },
  duration: Number
}, { timestamps: true });

module.exports = mongoose.model('Video', videoSchema);
