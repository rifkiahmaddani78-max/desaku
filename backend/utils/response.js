/**
 * Standard API Response Formatter
 */
const response = {
  success: (res, data = null, message = 'Success', statusCode = 200) => {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
    });
  },

  error: (
    res,
    message = 'Internal Server Error',
    statusCode = 500,
    errors = null
  ) => {
    return res.status(statusCode).json({
      success: false,
      message,
      errors,
      timestamp: new Date().toISOString(),
    });
  },

  validationError: (res, errors) => {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: Array.isArray(errors) ? errors : [errors],
      timestamp: new Date().toISOString(),
    });
  },

  unauthorized: (res, message = 'Unauthorized') => {
    return res.status(401).json({
      success: false,
      message,
      timestamp: new Date().toISOString(),
    });
  },

  forbidden: (res, message = 'Forbidden') => {
    return res.status(403).json({
      success: false,
      message,
      timestamp: new Date().toISOString(),
    });
  },

  notFound: (res, message = 'Resource Not Found') => {
    return res.status(404).json({
      success: false,
      message,
      timestamp: new Date().toISOString(),
    });
  },
};

module.exports = response;
