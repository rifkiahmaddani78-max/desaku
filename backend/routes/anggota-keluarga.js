const express = require('express');
const router = express.Router();
const { anggotaKeluargaController } = require('../controllers');
const authMiddleware = require('../middlewares/auth');
const errorHandler = require('../middlewares/errorHandler');

// Protected routes
router.get(
  '/',
  authMiddleware.authenticate,
  errorHandler.asyncHandler(
    anggotaKeluargaController.getAnggotaByKepalaKeluarga
  )
);

router.get(
  '/search',
  authMiddleware.authenticate,
  errorHandler.asyncHandler(anggotaKeluargaController.searchAnggota)
);

router.get(
  '/stats/:kepalaKeluargaId?',
  authMiddleware.authenticate,
  errorHandler.asyncHandler(anggotaKeluargaController.getKeluargaStats)
);

router.get(
  '/:id',
  authMiddleware.authenticate,
  errorHandler.asyncHandler(anggotaKeluargaController.getAnggotaById)
);

router.post(
  '/',
  authMiddleware.authenticate,
  errorHandler.asyncHandler(anggotaKeluargaController.createAnggota)
);

router.put(
  '/:id',
  authMiddleware.authenticate,
  errorHandler.asyncHandler(anggotaKeluargaController.updateAnggota)
);

router.delete(
  '/:id',
  authMiddleware.authenticate,
  errorHandler.asyncHandler(anggotaKeluargaController.deleteAnggota)
);

module.exports = router;
