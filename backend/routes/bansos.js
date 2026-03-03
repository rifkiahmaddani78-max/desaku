const express = require('express');
const router = express.Router();
const { bansosController } = require('../controllers');
const authMiddleware = require('../middlewares/auth');
const roleMiddleware = require('../middlewares/role');
const bansosValidation = require('../validations/bansos');
const errorHandler = require('../middlewares/errorHandler');
const uploadUtils = require('../config/upload');

// Public routes
router.get(
  '/active',
  errorHandler.asyncHandler(bansosController.getActiveBansos)
);

// Protected routes (admin only)
router.get(
  '/',
  authMiddleware.authenticate,
  roleMiddleware.requireAdmin,
  bansosValidation.getBansos,
  errorHandler.handleValidationErrors,
  errorHandler.asyncHandler(bansosController.getAllBansos)
);

router.get(
  '/statistics',
  authMiddleware.authenticate,
  roleMiddleware.requireAdmin,
  errorHandler.asyncHandler(bansosController.getBansosStatistics)
);

router.get(
  '/timeline',
  authMiddleware.authenticate,
  roleMiddleware.requireAdmin,
  errorHandler.asyncHandler(bansosController.getBansosTimeline)
);

router.post(
  '/',
  authMiddleware.authenticate,
  roleMiddleware.requireAdmin,
  bansosValidation.createBansos,
  errorHandler.handleValidationErrors,
  errorHandler.asyncHandler(bansosController.createBansos)
);

// Bansos-specific routes
router.get(
  '/:id',
  authMiddleware.optionalAuthenticate,
  bansosValidation.getBansosById,
  errorHandler.handleValidationErrors,
  errorHandler.asyncHandler(bansosController.getBansosById)
);

router.put(
  '/:id',
  authMiddleware.authenticate,
  roleMiddleware.requireAdmin,
  bansosValidation.updateBansos,
  errorHandler.handleValidationErrors,
  errorHandler.asyncHandler(bansosController.updateBansos)
);

router.delete(
  '/:id',
  authMiddleware.authenticate,
  roleMiddleware.requireAdmin,
  bansosValidation.getBansosById,
  errorHandler.handleValidationErrors,
  errorHandler.asyncHandler(bansosController.deleteBansos)
);

router.post(
  '/:id/restore',
  authMiddleware.authenticate,
  roleMiddleware.requireAdmin,
  bansosValidation.getBansosById,
  errorHandler.handleValidationErrors,
  errorHandler.asyncHandler(bansosController.restoreBansos)
);

router.put(
  '/:id/status',
  authMiddleware.authenticate,
  roleMiddleware.requireAdmin,
  bansosValidation.updateBansosStatus,
  errorHandler.handleValidationErrors,
  errorHandler.asyncHandler(bansosController.updateBansosStatus)
);

router.get(
  '/:id/eligibility',
  authMiddleware.authenticate,
  roleMiddleware.requireKepalaKeluarga,
  bansosValidation.checkEligibility,
  errorHandler.handleValidationErrors,
  errorHandler.asyncHandler(bansosController.checkEligibility)
);

router.post(
  '/:id/upload-panduan',
  authMiddleware.authenticate,
  roleMiddleware.requireAdmin,
  uploadUtils.single('dokumen_panduan'),
  bansosValidation.getBansosById,
  errorHandler.handleValidationErrors,
  errorHandler.asyncHandler(bansosController.uploadDokumenPanduan)
);

module.exports = router;
