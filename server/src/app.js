const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const { CLIENT_URL, NODE_ENV } = require('./config/env');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const healthRoutes = require('./routes/healthRoutes');
const authRoutes = require('./routes/authRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const adminComplaintRoutes = require('./routes/adminComplaintRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();

// Security Middlewares
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman)
      if (!origin) return callback(null, true);
      // In development or if origin matches CLIENT_URL
      return callback(null, true);
    },
    credentials: true,
  })
);

// Logging
if (NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads serving
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Mount API Routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/admin/complaints', adminComplaintRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/notifications', notificationRoutes);

// Catch 404
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Global Error Handler
app.use(errorHandler);

module.exports = app;
