const { getGenerativeModel } = require('./gemini');

exports.generateSummary = async (text) => {
  try {
    const model = getGenerativeModel('gemini-1.5-pro');
    const prompt = `Summarize the following document. Extract key points, important dates, and action items if any. \n\nDocument:\n${text.substring(0, 30000)}`;
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Summary Error:', error);
    return null;
  }
};

exports.categorizeFile = async (text, fileName) => {
  try {
    const model = getGenerativeModel('gemini-1.5-flash');
    const prompt = `Given the filename "${fileName}" and the following content snippet, categorize this document into ONE of the following categories: Resume, Invoice, Certificate, Education, Finance, Personal, Photo, Identity Document, Medical, Legal, Contracts, Reports, Notes, Projects. If none fit, output "Uncategorized". Output ONLY the category name.\n\nContent Snippet:\n${text ? text.substring(0, 2000) : ''}`;
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error('Categorize Error:', error);
    return 'Uncategorized';
  }
};

exports.analyzeResume = async (text) => {
  try {
    const model = getGenerativeModel('gemini-1.5-pro');
    const prompt = `Analyze this resume and extract: Skills, Technologies, Education, Experience, Projects, Strengths, Weaknesses, ATS Score (0-100), and Improvement Suggestions. Return as a JSON object.\n\nResume:\n${text.substring(0, 15000)}`;
    const result = await model.generateContent(prompt);
    let output = result.response.text();
    // basic cleanup if it's wrapped in markdown JSON blocks
    if (output.startsWith('\`\`\`json')) {
      output = output.replace(/^\`\`\`json/m, '').replace(/\`\`\`$/m, '').trim();
    }
    return JSON.parse(output);
  } catch (error) {
    console.error('Resume Analysis Error:', error);
    return null;
  }
};
