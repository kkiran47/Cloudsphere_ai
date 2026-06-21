const Embedding = require('../models/Embedding');
const { getGenerativeModel } = require('./gemini');

// Computes cosine similarity between two vectors
const cosineSimilarity = (vecA, vecB) => {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
};

exports.semanticSearch = async (query, userId) => {
  try {
    const embeddingModel = getGenerativeModel('gemini-embedding-2');
    const queryResult = await embeddingModel.embedContent(query);
    const queryVector = queryResult.embedding.values;

    // Fetch all embeddings for user (in production with large data, use MongoDB Atlas Vector Search pipeline)
    const allEmbeddings = await Embedding.find({ user: userId }).populate('file');
    
    const scoredResults = allEmbeddings.map(emb => ({
      file: emb.file,
      textChunk: emb.textChunk,
      score: cosineSimilarity(queryVector, emb.embedding)
    }));

    // Sort by descending score
    scoredResults.sort((a, b) => b.score - a.score);
    
    // Return top 10 relevant chunks
    return scoredResults.slice(0, 10).filter(res => res.score > 0.5); // Arbitrary threshold
  } catch (error) {
    console.error('Semantic Search Error:', error);
    return [];
  }
};
