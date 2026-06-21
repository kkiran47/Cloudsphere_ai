const { semanticSearch } = require('../services/search');
const { getGenerativeModel } = require('../services/gemini');
const File = require('../models/File');
const Embedding = require('../models/Embedding');

exports.searchFiles = async (req, res, next) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ success: false, error: 'Query is required' });
    }

    const results = await semanticSearch(query, req.user.id);
    
    // De-duplicate files in results
    const uniqueFiles = [];
    const fileIds = new Set();
    
    for (const resItem of results) {
      if (!fileIds.has(resItem.file._id.toString())) {
        fileIds.add(resItem.file._id.toString());
        uniqueFiles.push(resItem.file);
      }
    }

    res.status(200).json({ success: true, data: uniqueFiles });
  } catch (error) {
    next(error);
  }
};

exports.chatWithFiles = async (req, res, next) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ success: false, error: 'Message is required' });
    }

    // 1. Semantic search to find context
    const searchResults = await semanticSearch(message, req.user.id);
    
    // 2. Build context string
    let context = searchResults.map(r => r.textChunk).join('\n\n---\n\n');
    
    if (!context) {
      context = "No specific relevant information found in the user's files for this query.";
    }

    // 3. Prompt Gemini
    const prompt = `You are a helpful AI assistant for a cloud storage platform (CloudSphere AI).
Answer the user's question based ONLY on the provided context from their files. 
If the answer is not contained in the context, say so. Do not invent answers.

Context:
${context}

User Question:
${message}
`;

    const model = getGenerativeModel('gemini-2.5-flash');
    const result = await model.generateContent(prompt);
    const answer = result.response.text();

    res.status(200).json({ success: true, answer, contextUsed: searchResults.length > 0 });
  } catch (error) {
    next(error);
  }
};

exports.getFileInsights = async (req, res, next) => {
  try {
    const { id } = req.params;
    const file = await File.findOne({ _id: id, user: req.user.id });
    
    if (!file) {
      return res.status(404).json({ success: false, error: 'File not found' });
    }
    
    res.status(200).json({
      success: true,
      data: {
        summary: file.summary,
        category: file.category,
        extractedText: file.extractedText,
        metadata: file.metadata
      }
    });
  } catch (error) {
    next(error);
  }
};
