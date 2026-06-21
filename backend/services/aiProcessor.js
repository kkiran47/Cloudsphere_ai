const { getGenerativeModel } = require('./gemini');

/**
 * Processes a file using Gemini 2.5 Flash to extract text, summarize, categorize, and find entities.
 * @param {Buffer} buffer The file buffer
 * @param {String} mimetype The file mimetype
 * @param {String} originalName The original file name
 * @returns {Object} JSON containing extractedText, summary, category, metadata, isSuspicious
 */
exports.processDocument = async (buffer, mimetype, originalName) => {
  try {
    const model = getGenerativeModel('gemini-2.5-flash');

    const prompt = `
You are an advanced AI document and image analyzer for a cloud storage platform.
Analyze the attached file (Name: ${originalName}).

Return a RAW JSON object (no markdown formatting, no \`\`\`json blocks) with the following strictly defined keys:
{
  "extractedText": "The full extracted text from the document or image. If it's an image, extract any visible text. If there is absolutely no text, describe the image in detail here.",
  "summary": "A concise 1-3 sentence summary of what this file is about.",
  "category": "Categorize the file into exactly one of these: [Resume, Invoice, Contract, Receipt, Image, Video, Audio, Document, Other].",
  "metadata": {
    "tags": ["tag1", "tag2"],
    "entities": ["Any important names, companies, dates, skills, or technologies mentioned"]
  },
  "isSuspicious": false // Set to true ONLY if the file contains obvious malware scripts, extreme explicit content, or highly dangerous instructions. Otherwise false.
}
`;

    const filePart = {
      inlineData: {
        data: buffer.toString('base64'),
        mimeType: mimetype
      }
    };

    const result = await model.generateContent([prompt, filePart]);
    const responseText = result.response.text();
    
    try {
      // Find JSON block safely
      const match = responseText.match(/\{[\s\S]*\}/);
      if (match) {
        return JSON.parse(match[0]);
      } else {
        return JSON.parse(responseText.trim());
      }
    } catch (parseError) {
      console.error('Failed to parse Gemini response as JSON. Raw response:', responseText);
      return {
        extractedText: responseText.slice(0, 500) + "... (Could not parse full response)",
        summary: "Parsed response failed.",
        category: "Other",
        metadata: { tags: [], entities: [] },
        isSuspicious: false
      };
    }
  } catch (error) {
    console.error('Error in aiProcessor.processDocument:', error.message || error);
    // Return safe fallback so the upload doesn't completely fail
    return {
      extractedText: "Text extraction failed due to error: " + (error.message || "Unknown error"),
      summary: "Could not generate summary.",
      category: "Other",
      metadata: { tags: [], entities: [] },
      isSuspicious: false
    };
  }
};
