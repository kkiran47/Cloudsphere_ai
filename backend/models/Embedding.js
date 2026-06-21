const mongoose = require('mongoose');

const embeddingSchema = new mongoose.Schema({
  file: { type: mongoose.Schema.Types.ObjectId, ref: 'File', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  textChunk: { type: String, required: true },
  embedding: { type: [Number], required: true } // Array of floats for Vector Search
}, { timestamps: true });

module.exports = mongoose.model('Embedding', embeddingSchema);
