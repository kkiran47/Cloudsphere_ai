const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true }, // e.g., 'UPLOAD_FILE', 'DELETE_FILE', 'SHARE_FILE', 'LOGIN'
  details: { type: String }, // e.g., 'Uploaded resume.pdf'
  ipAddress: { type: String },
  userAgent: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Activity', activitySchema);
