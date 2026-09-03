const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const { PORT, CLIENT_URL } = require('./config/env');
const { connectDB } = require('./config/db');
const { initSocket } = require('./utils/socket');

const server = http.createServer(app);

// Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

initSocket(io);

// Start server after connecting to database
const startServer = async () => {
  try {
    await connectDB();

    server.listen(PORT, () => {
      console.log(`===================================================`);
      console.log(` CCMS API Server running in port ${PORT}`);
      console.log(` Health Check: http://localhost:${PORT}/api/health`);
      console.log(` Socket.IO enabled`);
      console.log(`===================================================`);
    });
  } catch (error) {
    console.error('Fatal: Failed to start server:', error);
    process.exit(1);
  }
};

if (process.env.NODE_ENV !== 'test') {
  startServer();
}

module.exports = { server, app };
