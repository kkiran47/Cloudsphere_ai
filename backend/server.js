require('dotenv').config();
const http = require('http');
const mongoose = require('mongoose');
const app = require('./app');
const initSocket = require('./sockets/socket');

const server = http.createServer(app);
initSocket(server);

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  });