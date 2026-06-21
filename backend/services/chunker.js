const { RecursiveCharacterTextSplitter } = require('langchain/text_splitter');

exports.chunkText = async (text) => {
  if (!text) return [];
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  
  const output = await splitter.createDocuments([text]);
  return output.map(doc => doc.pageContent);
};
