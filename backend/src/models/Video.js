const mongoose = require('mongoose');

const VideoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    originalName: String,
    filePath: String,
    mimeType: String,
    size: Number,

    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    // tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    tenantId: { type: String, required: true },


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

    
    analysisDetails: {
      weapons: { type: Number, default: 0 },
      blood: { type: Number, default: 0 }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Video', VideoSchema);
