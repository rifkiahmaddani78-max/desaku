const express = require('express');
const router = express.Router();
const { wilayahController } = require('../controllers');
const authMiddleware = require('../middlewares/auth');
const roleMiddleware = require('../middlewares/role');
const errorHandler = require('../middlewares/errorHandler');

// Admin only routes
router.get(
  '/dusun',
  authMiddleware.authenticate,
  // roleMiddleware.requireAdmin,
  errorHandler.asyncHandler(wilayahController.getAllDusun)
);

router.post(
  '/dusun',
  authMiddleware.authenticate,
  roleMiddleware.requireAdmin,
  errorHandler.asyncHandler(wilayahController.createDusun)
);

router.get(
  '/dusun/:id',
  authMiddleware.authenticate,
  roleMiddleware.requireAdmin,
  errorHandler.asyncHandler(wilayahController.getDusunById)
);

router.put(
  '/dusun/:id',
  authMiddleware.authenticate,
  roleMiddleware.requireAdmin,
  errorHandler.asyncHandler(wilayahController.updateDusun)
);

router.delete(
  '/dusun/:id',
  authMiddleware.authenticate,
  roleMiddleware.requireAdmin,
  errorHandler.asyncHandler(wilayahController.deleteDusun)
);

// RW routes
router.get(
  '/dusun/:dusunId/rw',
  authMiddleware.authenticate,
  // roleMiddleware.requireAdmin,
  errorHandler.asyncHandler(wilayahController.getRwByDusun)
);

router.post(
  '/rw',
  authMiddleware.authenticate,
  roleMiddleware.requireAdmin,
  errorHandler.asyncHandler(wilayahController.createRw)
);

router.put(
  '/rw/:id',
  authMiddleware.authenticate,
  roleMiddleware.requireAdmin,
  errorHandler.asyncHandler(wilayahController.updateRw)
);

router.delete(
  '/rw/:id',
  authMiddleware.authenticate,
  roleMiddleware.requireAdmin,
  errorHandler.asyncHandler(wilayahController.deleteRw)
);

// RT routes
router.get(
  '/rw/:rwId/rt',
  authMiddleware.authenticate,
  // roleMiddleware.requireAdmin,
  errorHandler.asyncHandler(wilayahController.getRtByRw)
);

router.post(
  '/rt',
  authMiddleware.authenticate,
  roleMiddleware.requireAdmin,
  errorHandler.asyncHandler(wilayahController.createRt)
);

router.put(
  '/rt/:id',
  authMiddleware.authenticate,
  roleMiddleware.requireAdmin,
  errorHandler.asyncHandler(wilayahController.updateRt)
);

router.delete(
  '/rt/:id',
  authMiddleware.authenticate,
  roleMiddleware.requireAdmin,
  errorHandler.asyncHandler(wilayahController.deleteRt)
);

// General wilayah routes
router.get(
  '/hierarchy',
  authMiddleware.authenticate,
  roleMiddleware.requireAdmin,
  errorHandler.asyncHandler(wilayahController.getWilayahHierarchy)
);

router.get(
  '/kk',
  authMiddleware.authenticate,
  roleMiddleware.requireAdmin,
  errorHandler.asyncHandler(wilayahController.getKkByWilayah)
);

router.get(
  '/statistics',
  authMiddleware.authenticate,
  roleMiddleware.requireAdmin,
  errorHandler.asyncHandler(wilayahController.getWilayahStatistics)
);

module.exports = router;
