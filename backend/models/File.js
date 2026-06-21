const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  originalName: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  folder: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder', default: null },
  size: { type: Number, required: true },
  mimetype: { type: String, required: true },
  cloudinaryUrl: { type: String, required: true },
  cloudinaryId: { type: String, required: true },
  hash: { type: String, required: true }, // SHA256 for duplicate detection
  isDuplicate: { type: Boolean, default: false },
  duplicateOf: { type: mongoose.Schema.Types.ObjectId, ref: 'File' },
  category: { type: String, default: 'Uncategorized' },
  extractedText: { type: String }, // From OCR or document parsing
  summary: { type: String }, // AI generated summary
  metadata: { type: mongoose.Schema.Types.Mixed }, // AI insights, entities, tags
  isProcessed: { type: Boolean, default: false } // Flag for async AI processing completion
}, { timestamps: true });

module.exports = mongoose.model('File', fileSchema);
