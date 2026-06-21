const mongoose = require('mongoose');

const folderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder', default: null },
  color: { type: String, default: '#6366f1' }, // Indigo default
  isSystem: { type: Boolean, default: false } // For auto-generated folders
}, { timestamps: true });

module.exports = mongoose.model('Folder', folderSchema);
