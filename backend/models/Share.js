const mongoose = require('mongoose');

const shareSchema = new mongoose.Schema({
  file: { type: mongoose.Schema.Types.ObjectId, ref: 'File', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  linkId: { type: String, required: true, unique: true },
  isPublic: { type: Boolean, default: false },
  password: { type: String }, // Optional password protection
  expiresAt: { type: Date }, // Optional expiration
  views: { type: Number, default: 0 },
  downloads: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Share', shareSchema);
