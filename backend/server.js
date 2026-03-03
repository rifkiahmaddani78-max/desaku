const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const logger = require('./utils/logger');
const errorHandler = require('./middlewares/errorHandler');

// Import database untuk test connection
require('./config/database');

// Import main router
const apiRoutes = require('./routes');

// Initialize Express app
const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin:
      process.env.NODE_ENV === 'development'
        ? ['http://localhost:3000', 'http://localhost:5173']
        : ['https://desaku.example.com'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000,
  max: process.env.RATE_LIMIT_MAX || 100,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
  },
});

// Apply rate limiting to API routes
app.use('/api/', limiter);

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Cookie parser
app.use(cookieParser());

// Apply validation error handler
app.use(errorHandler.handleValidationErrors);

// API Routes
app.use('/api', apiRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Desa Ku API Server is running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    documentation: '/api/docs',
    health_check: '/api/health',
  });
});

// 404 handler
app.use('*', errorHandler.notFoundHandler);

// Global error handler
app.use(errorHandler.globalErrorHandler);

// Start server
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  logger.info(`🚀 Server is running on port ${PORT}`);
  logger.info(`📁 NODE_ENV: ${process.env.NODE_ENV}`);
  logger.info(`🌐 API URL: http://localhost:${PORT}/api`);
  logger.info(`📚 Documentation: http://localhost:${PORT}/api/docs`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

module.exports = app;
