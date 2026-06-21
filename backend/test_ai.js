const fs = require('fs');
const { processDocument } = require('./services/aiProcessor');

async function test() {
  const dummyText = "Hello world, this is a test resume document. John Doe. Skills: JavaScript, Node.js.";
  const buffer = Buffer.from(dummyText);
  const mimetype = 'text/plain';
  
  console.log("Starting processDocument...");
  try {
    const result = await processDocument(buffer, mimetype, 'resume.txt');
    console.log("Result:", result);
  } catch(e) {
    console.log("Error:", e);
  }
}

test();
