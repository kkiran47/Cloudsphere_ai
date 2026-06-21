const fs = require('fs');
const path = require('path');
const { processDocument } = require('./backend/services/aiProcessor');
const mongoose = require('mongoose');

async function test() {
  const dummyText = "Hello world, this is a test resume document. John Doe. Skills: JavaScript, Node.js.";
  const buffer = Buffer.from(dummyText);
  const mimetype = 'text/plain';
  
  console.log("Starting processDocument...");
  const result = await processDocument(buffer, mimetype, 'resume.txt');
  console.log("Result:", result);
}

test().catch(console.error);
