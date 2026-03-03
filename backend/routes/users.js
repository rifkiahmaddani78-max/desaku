const express = require('express');
const router = express.Router();
const { userController } = require('../controllers');
const authMiddleware = require('../middlewares/auth');
const roleMiddleware = require('../middlewares/role');
const userValidation = require('../validations/user');
const errorHandler = require('../middlewares/errorHandler');

// Admin only routes
router.get(
  '/',
  authMiddleware.authenticate,
  roleMiddleware.requireAdmin,
  userValidation.getUsers,
  errorHandler.handleValidationErrors,
  errorHandler.asyncHandler(userController.getAllUsers)
);

router.post(
  '/',
  authMiddleware.authenticate,
  roleMiddleware.requireAdmin,
  errorHandler.asyncHandler(userController.createUser)
);

router.get(
  '/statistics',
  authMiddleware.authenticate,
  roleMiddleware.requireAdmin,
  errorHandler.asyncHandler(userController.getUserStatistics)
);

// User-specific routes (admin or own profile)
router.get(
  '/:id',
  authMiddleware.authenticate,
  userValidation.getUserById,
  errorHandler.handleValidationErrors,
  errorHandler.asyncHandler(userController.getUserById)
);

router.put(
  '/:id',
  authMiddleware.authenticate,
  roleMiddleware.requireAdmin,
  userValidation.updateUser,
  errorHandler.handleValidationErrors,
  errorHandler.asyncHandler(userController.updateUser)
);

router.delete(
  '/:id',
  authMiddleware.authenticate,
  roleMiddleware.requireAdmin,
  userValidation.deleteUser,
  errorHandler.handleValidationErrors,
  errorHandler.asyncHandler(userController.deleteUser)
);

router.put(
  '/:id/address',
  authMiddleware.authenticate,
  errorHandler.asyncHandler(userController.updateUserAddress)
);

module.exports = router;
