const express = require('express');
const router = express.Router();
const { authController } = require('../controllers');
const authMiddleware = require('../middlewares/auth');
const roleMiddleware = require('../middlewares/role');
const authValidation = require('../validations/auth');
const errorHandler = require('../middlewares/errorHandler');
const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    message: 'Terlalu banyak percobaan login, coba lagi nanti.',
  },
});

// Public routes
router.post(
  '/login',
  authValidation.login,
  errorHandler.handleValidationErrors,
  authLimiter,
  errorHandler.asyncHandler(authController.login)
);

router.post(
  '/register',
  authValidation.register,
  errorHandler.handleValidationErrors,
  authLimiter,
  errorHandler.asyncHandler(authController.register)
);

router.post(
  '/refresh',
  authValidation.refreshToken,
  errorHandler.handleValidationErrors,
  errorHandler.asyncHandler(authController.refreshToken)
);

// Protected routes
router.post(
  '/logout',
  authMiddleware.authenticate,
  errorHandler.asyncHandler(authController.logout)
);

router.post(
  '/change-password',
  authMiddleware.authenticate,
  authValidation.changePassword,
  errorHandler.handleValidationErrors,
  authLimiter,
  errorHandler.asyncHandler(authController.changePassword)
);

router.get(
  '/profile',
  authMiddleware.authenticate,
  errorHandler.asyncHandler(authController.getProfile)
);

router.put(
  '/profile',
  authMiddleware.authenticate,
  errorHandler.asyncHandler(authController.updateProfile)
);

// Admin only routes
router.post(
  '/verify/:id',
  authMiddleware.authenticate,
  roleMiddleware.requireAdmin,
  errorHandler.asyncHandler(authController.verifyUser)
);

module.exports = router;
