const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./auth');
const userRoutes = require('./users');
const wilayahRoutes = require('./wilayah');
const anggotaKeluargaRoutes = require('./anggota-keluarga');
const bansosRoutes = require('./bansos');
const pengajuanBansosRoutes = require('./pengajuan-bansos');

// Define API routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/wilayah', wilayahRoutes);
router.use('/anggota-keluarga', anggotaKeluargaRoutes);
router.use('/bansos', bansosRoutes);
router.use('/pengajuan-bansos', pengajuanBansosRoutes);

// Health check route
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// API documentation route
router.get('/docs', (req, res) => {
  res.json({
    success: true,
    message: 'API Documentation',
    endpoints: {
      auth: {
        'POST /api/auth/login': 'Login user',
        'POST /api/auth/register': 'Register new kepala keluarga',
        'POST /api/auth/refresh': 'Refresh access token',
        'POST /api/auth/logout': 'Logout user',
        'GET /api/auth/profile': 'Get current user profile',
        'PUT /api/auth/profile': 'Update profile',
        'POST /api/auth/change-password': 'Change password',
        'POST /api/auth/verify/:id': 'Verify user account (admin only)',
      },
      users: {
        'GET /api/users': 'Get all users (admin only)',
        'GET /api/users/:id': 'Get user by ID',
        'POST /api/users': 'Create new user (admin only)',
        'PUT /api/users/:id': 'Update user (admin only)',
        'DELETE /api/users/:id': 'Delete user (admin only)',
        'PUT /api/users/:id/address': 'Update user address',
        'GET /api/users/statistics': 'Get user statistics (admin only)',
      },
      wilayah: {
        'GET /api/wilayah/dusun': 'Get all dusun (admin only)',
        'GET /api/wilayah/dusun/:id': 'Get dusun by ID (admin only)',
        'POST /api/wilayah/dusun': 'Create new dusun (admin only)',
        'PUT /api/wilayah/dusun/:id': 'Update dusun (admin only)',
        'DELETE /api/wilayah/dusun/:id': 'Delete dusun (admin only)',
        'GET /api/wilayah/dusun/:dusunId/rw': 'Get RW by dusun (admin only)',
        'POST /api/wilayah/rw': 'Create new RW (admin only)',
        'PUT /api/wilayah/rw/:id': 'Update RW (admin only)',
        'DELETE /api/wilayah/rw/:id': 'Delete RW (admin only)',
        'GET /api/wilayah/rw/:rwId/rt': 'Get RT by RW (admin only)',
        'POST /api/wilayah/rt': 'Create new RT (admin only)',
        'PUT /api/wilayah/rt/:id': 'Update RT (admin only)',
        'DELETE /api/wilayah/rt/:id': 'Delete RT (admin only)',
        'GET /api/wilayah/hierarchy':
          'Get complete wilayah hierarchy (admin only)',
        'GET /api/wilayah/kk': 'Get KK by wilayah (admin only)',
        'GET /api/wilayah/statistics': 'Get wilayah statistics (admin only)',
      },
      anggota_keluarga: {
        'GET /api/anggota-keluarga':
          'Get anggota keluarga by kepala keluarga ID',
        'GET /api/anggota-keluarga/:id': 'Get anggota keluarga by ID',
        'POST /api/anggota-keluarga': 'Create new anggota keluarga',
        'PUT /api/anggota-keluarga/:id': 'Update anggota keluarga',
        'DELETE /api/anggota-keluarga/:id': 'Delete anggota keluarga',
        'GET /api/anggota-keluarga/stats/:kepalaKeluargaId?':
          'Get keluarga statistics',
        'GET /api/anggota-keluarga/search': 'Search anggota keluarga',
      },
      bansos: {
        'GET /api/bansos': 'Get all bansos (admin)',
        'GET /api/bansos/active': 'Get active bansos (public)',
        'GET /api/bansos/:id': 'Get bansos by ID',
        'POST /api/bansos': 'Create bansos (admin)',
        'PUT /api/bansos/:id': 'Update bansos (admin)',
        'DELETE /api/bansos/:id': 'Delete bansos (admin)',
        'POST /api/bansos/:id/restore': 'Restore deleted bansos (admin)',
        'PUT /api/bansos/:id/status': 'Update bansos status (admin)',
        'GET /api/bansos/:id/eligibility':
          'Check eligibility (kepala keluarga)',
        'GET /api/bansos/statistics': 'Get bansos statistics (admin)',
        'POST /api/bansos/:id/upload-panduan': 'Upload dokumen panduan (admin)',
      },
      pengajuan_bansos: {
        'GET /api/pengajuan-bansos': 'Get all pengajuan (admin)',
        'GET /api/pengajuan-bansos/my': 'Get my pengajuan (kepala keluarga)',
        'GET /api/pengajuan-bansos/:id': 'Get pengajuan by ID',
        'POST /api/pengajuan-bansos': 'Create pengajuan (kepala keluarga)',
        'PUT /api/pengajuan-bansos/:id/status': 'Update status (admin)',
        'POST /api/pengajuan-bansos/:id/rating': 'Add rating (kepala keluarga)',
        'GET /api/pengajuan-bansos/statistics': 'Get statistics (admin)',
        'GET /api/pengajuan-bansos/notifications': 'Get notifications',
        'PUT /api/pengajuan-bansos/notifications/:id/read':
          'Mark notification as read',
        'POST /api/pengajuan-bansos/export': 'Export data (admin)',
        'POST /api/pengajuan-bansos/:id/upload-dokumen':
          'Upload document (kepala keluarga)',
      },
    },
  });
});

module.exports = router;
