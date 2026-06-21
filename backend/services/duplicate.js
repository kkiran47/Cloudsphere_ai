const crypto = require('crypto');

exports.calculateHash = (buffer) => {
  return crypto.createHash('sha256').update(buffer).digest('hex');
};
