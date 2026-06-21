const tesseract = require('tesseract.js');

exports.extractTextFromImage = async (imageBuffer) => {
  try {
    const result = await tesseract.recognize(imageBuffer, 'eng', {
      logger: m => console.log(m)
    });
    return result.data.text;
  } catch (error) {
    console.error('OCR Error:', error);
    return '';
  }
};
