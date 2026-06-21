const Embedding = require('../models/Embedding');
const { getGenerativeModel } = require('./gemini');

exports.generateEmbeddings = async (textChunks, fileId, userId) => {
  try {
    const embeddingModel = getGenerativeModel('gemini-embedding-2');
    
    for (const chunk of textChunks) {
      if (!chunk.trim()) continue;
      
      const result = await embeddingModel.embedContent(chunk);
      const embeddingArray = result.embedding.values;
      
      await Embedding.create({
        file: fileId,
        user: userId,
        textChunk: chunk,
        embedding: embeddingArray
      });
    }
  } catch (error) {
    console.error('Error generating embeddings:', error);
  }
};
