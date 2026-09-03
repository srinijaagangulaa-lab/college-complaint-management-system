const { NODE_ENV } = require('../config/env');

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Internal Server Error';

  // Handle Mongoose CastError (Bad ObjectId)
  if (err.name === 'CastError') {
    message = `Resource not found with id: ${err.value}`;
    statusCode = 404;
  }

  // Handle Mongoose Duplicate Key Error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate field value entered for '${field}'. Please use another value.`;
    statusCode = 400;
  }

  // Handle Mongoose ValidationError
  if (err.name === 'ValidationError') {
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ');
    statusCode = 400;
  }

  // Handle Multer file upload errors
  if (err.name === 'MulterError') {
    message = `Upload error: ${err.message}`;
    statusCode = 400;
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    message = 'Invalid authentication token';
    statusCode = 401;
  }

  if (err.name === 'TokenExpiredError') {
    message = 'Authentication token has expired';
    statusCode = 401;
  }

  if (NODE_ENV === 'development') {
    console.error(`[Error] ${req.method} ${req.originalUrl}:`, err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: NODE_ENV === 'development' ? err.stack : undefined,
  });
};

module.exports = errorHandler;
