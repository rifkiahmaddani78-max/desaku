const { validationResult } = require('express-validator');
const response = require('../utils/response');
const logger = require('../utils/logger');

/**
 * Centralized Error Handling Middleware
 */
const errorHandler = {
  /**
   * Handle validation errors
   */
  handleValidationErrors: (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((error) => ({
        field: error.path,
        message: error.msg,
        value: error.value,
      }));

      return response.validationError(res, errorMessages);
    }

    next();
  },

  /**
   * Handle async errors
   */
  asyncHandler: (fn) => {
    return (req, res, next) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  },

  /**
   * Global error handler
   */
  globalErrorHandler: (err, req, res, next) => {
    logger.error('Global error handler:', err);

    // Handle specific error types
    if (err.name === 'ValidationError') {
      return response.validationError(res, err.errors || err.message);
    }

    if (err.name === 'UnauthorizedError') {
      return response.unauthorized(res, err.message);
    }

    if (err.name === 'ForbiddenError') {
      return response.forbidden(res, err.message);
    }

    if (err.name === 'NotFoundError') {
      return response.notFound(res, err.message);
    }

    // Handle database errors
    if (err.code === 'ER_DUP_ENTRY') {
      const match = err.message.match(/Duplicate entry '(.+)' for key/);
      return response.error(
        res,
        `Data sudah ada: ${match ? match[1] : 'duplikat data'}`,
        409
      );
    }

    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
      return response.error(res, 'Data referensi tidak ditemukan', 400);
    }

    if (err.code === 'ER_DATA_TOO_LONG') {
      return response.error(res, 'Data terlalu panjang', 400);
    }

    // Default error
    const statusCode = err.statusCode || 500;
    const message =
      process.env.NODE_ENV === 'production'
        ? 'Terjadi kesalahan pada server'
        : err.message;

    return response.error(
      res,
      message,
      statusCode,
      process.env.NODE_ENV === 'development' ? err.stack : undefined
    );
  },

  /**
   * 404 Not Found handler
   */
  notFoundHandler: (req, res) => {
    response.notFound(
      res,
      `Route ${req.method} ${req.originalUrl} tidak ditemukan`
    );
  },

  /**
   * Create custom error
   */
  createError: (message, statusCode = 500, name = 'CustomError') => {
    const error = new Error(message);
    error.statusCode = statusCode;
    error.name = name;
    return error;
  },

  /**
   * Throw validation error
   */
  throwValidationError: (message, field = 'general') => {
    const error = new Error(message);
    error.name = 'ValidationError';
    error.statusCode = 400;
    error.errors = [{ field, message }];
    throw error;
  },

  /**
   * Throw unauthorized error
   */
  throwUnauthorizedError: (message = 'Unauthorized') => {
    const error = new Error(message);
    error.name = 'UnauthorizedError';
    error.statusCode = 401;
    throw error;
  },

  /**
   * Throw forbidden error
   */
  throwForbiddenError: (message = 'Forbidden') => {
    const error = new Error(message);
    error.name = 'ForbiddenError';
    error.statusCode = 403;
    throw error;
  },

  /**
   * Throw not found error
   */
  throwNotFoundError: (message = 'Not Found') => {
    const error = new Error(message);
    error.name = 'NotFoundError';
    error.statusCode = 404;
    throw error;
  },
};

module.exports = errorHandler;
