const express = require('express');
const router = express.Router();
const { pengajuanBansosController } = require('../controllers');
const authMiddleware = require('../middlewares/auth');
const roleMiddleware = require('../middlewares/role');
const pengajuanValidation = require('../validations/pengajuan-bansos');
const errorHandler = require('../middlewares/errorHandler');
const uploadUtils = require('../config/upload');

// Admin only routes
router.get(
  '/',
  authMiddleware.authenticate,
  roleMiddleware.requireAdmin,
  pengajuanValidation.getPengajuan,
  errorHandler.handleValidationErrors,
  errorHandler.asyncHandler(pengajuanBansosController.getAllPengajuan)
);

router.get(
  '/statistics',
  authMiddleware.authenticate,
  roleMiddleware.requireAdmin,
  errorHandler.asyncHandler(pengajuanBansosController.getPengajuanStatistics)
);

router.post(
  '/export',
  authMiddleware.authenticate,
  roleMiddleware.requireAdmin,
  errorHandler.asyncHandler(pengajuanBansosController.exportPengajuan)
);

// Kepala keluarga routes
router.get(
  '/my',
  authMiddleware.authenticate,
  roleMiddleware.requireKepalaKeluarga,
  errorHandler.asyncHandler(pengajuanBansosController.getMyPengajuan)
);

router.post(
  '/',
  authMiddleware.authenticate,
  roleMiddleware.requireKepalaKeluarga,
  uploadUtils.fields([
    { name: 'dokumen_pendukung', maxCount: 1 },
    { name: 'dokumen_ktp', maxCount: 1 },
    { name: 'dokumen_kk', maxCount: 1 },
    { name: 'dokumen_surat_permohonan', maxCount: 1 },
    { name: 'dokumen_lainnya', maxCount: 3 },
  ]),
  pengajuanValidation.createPengajuan,
  errorHandler.handleValidationErrors,
  errorHandler.asyncHandler(pengajuanBansosController.createPengajuan)
);

// Common routes (admin or owner)
router.get(
  '/:id',
  authMiddleware.authenticate,
  errorHandler.asyncHandler(pengajuanBansosController.getPengajuanById)
);

// Notification routes
router.get(
  '/notifications',
  authMiddleware.authenticate,
  errorHandler.asyncHandler(pengajuanBansosController.getNotifications)
);

router.put(
  '/notifications/:id/read',
  authMiddleware.authenticate,
  errorHandler.asyncHandler(pengajuanBansosController.markNotificationAsRead)
);

router.put(
  '/notifications/read-all',
  authMiddleware.authenticate,
  errorHandler.asyncHandler(
    pengajuanBansosController.markAllNotificationsAsRead
  )
);

// Admin only operations
router.put(
  '/:id/status',
  authMiddleware.authenticate,
  roleMiddleware.requireAdmin,
  pengajuanValidation.updatePengajuanStatus,
  errorHandler.handleValidationErrors,
  errorHandler.asyncHandler(pengajuanBansosController.updatePengajuanStatus)
);

// Kepala keluarga only operations
router.post(
  '/:id/rating',
  authMiddleware.authenticate,
  roleMiddleware.requireKepalaKeluarga,
  pengajuanValidation.addRating,
  errorHandler.handleValidationErrors,
  errorHandler.asyncHandler(pengajuanBansosController.addRating)
);

router.post(
  '/:id/upload-dokumen',
  authMiddleware.authenticate,
  roleMiddleware.requireKepalaKeluarga,
  uploadUtils.single('file'),
  errorHandler.asyncHandler(pengajuanBansosController.uploadDokumen)
);

module.exports = router;
