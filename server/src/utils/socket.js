let ioInstance = null;

const initSocket = (io) => {
  ioInstance = io;

  io.on('connection', (socket) => {
    console.log(`[Socket.IO] Client connected: ${socket.id}`);

    // Join user room for targeted notifications
    socket.on('join_user', (userId) => {
      if (userId) {
        socket.join(`user_${userId}`);
        console.log(`[Socket.IO] Socket ${socket.id} joined room user_${userId}`);
      }
    });

    // Join role room (e.g. 'admin')
    socket.on('join_role', (role) => {
      if (role) {
        socket.join(`role_${role}`);
        console.log(`[Socket.IO] Socket ${socket.id} joined room role_${role}`);
      }
    });

    // Join specific complaint room for live timeline updates
    socket.on('join_complaint', (complaintId) => {
      if (complaintId) {
        socket.join(`complaint_${complaintId}`);
        console.log(`[Socket.IO] Socket ${socket.id} joined room complaint_${complaintId}`);
      }
    });

    socket.on('disconnect', () => {
      console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
    });
  });

  return ioInstance;
};

const getIO = () => ioInstance;

const emitToUser = (userId, event, data) => {
  if (ioInstance && userId) {
    ioInstance.to(`user_${userId}`).emit(event, data);
  }
};

const emitToRole = (role, event, data) => {
  if (ioInstance && role) {
    ioInstance.to(`role_${role}`).emit(event, data);
  }
};

const emitToComplaint = (complaintId, event, data) => {
  if (ioInstance && complaintId) {
    ioInstance.to(`complaint_${complaintId}`).emit(event, data);
  }
};

const emitGlobal = (event, data) => {
  if (ioInstance) {
    ioInstance.emit(event, data);
  }
};

module.exports = {
  initSocket,
  getIO,
  emitToUser,
  emitToRole,
  emitToComplaint,
  emitGlobal,
};
