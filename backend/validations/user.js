const { body, param, query } = require('express-validator');

/**
 * User validation schemas
 */
const userValidation = {
  /**
   * Get users validation
   */
  getUsers: [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page harus angka positif')
      .toInt(),

    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit harus 1-100')
      .toInt(),

    query('search')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Search maksimal 100 karakter'),

    query('role_id')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Role ID tidak valid')
      .toInt(),

    query('is_verified')
      .optional()
      .isBoolean()
      .withMessage('is_verified harus boolean')
      .toBoolean(),
  ],

  /**
   * Get user by ID validation
   */
  getUserById: [
    param('id').isInt({ min: 1 }).withMessage('User ID tidak valid').toInt(),
  ],

  /**
   * Update user validation
   */
  updateUser: [
    param('id').isInt({ min: 1 }).withMessage('User ID tidak valid').toInt(),

    body('nama_lengkap')
      .optional()
      .trim()
      .isLength({ min: 3, max: 100 })
      .withMessage('Nama harus 3-100 karakter'),

    body('email')
      .optional()
      .trim()
      .isEmail()
      .withMessage('Email tidak valid')
      .normalizeEmail(),

    body('telepon')
      .optional()
      .trim()
      .matches(/^[0-9+\-\s()]+$/)
      .withMessage('Nomor telepon tidak valid'),

    body('jenis_kelamin')
      .optional()
      .isIn(['L', 'P'])
      .withMessage('Jenis kelamin harus L atau P'),

    body('tempat_lahir')
      .optional()
      .trim()
      .isLength({ max: 50 })
      .withMessage('Tempat lahir maksimal 50 karakter'),

    body('tanggal_lahir')
      .optional()
      .isDate()
      .withMessage('Tanggal lahir tidak valid'),

    body('agama')
      .optional()
      .trim()
      .isIn([
        'ISLAM',
        'KRISTEN',
        'KATOLIK',
        'HINDU',
        'BUDDHA',
        'KONGHUCU',
        'LAINNYA',
      ])
      .withMessage('Agama tidak valid'),

    body('pekerjaan')
      .optional()
      .trim()
      .isLength({ max: 50 })
      .withMessage('Pekerjaan maksimal 50 karakter'),

    body('status_perkawinan')
      .optional()
      .isIn(['BELUM_KAWIN', 'KAWIN', 'CERAI_HIDUP', 'CERAI_MATI'])
      .withMessage('Status perkawinan tidak valid'),

    body('foto_profil')
      .optional()
      .trim()
      .isURL()
      .withMessage('Foto profil harus URL valid'),
  ],

  /**
   * Update user role validation
   */
  updateUserRole: [
    param('id').isInt({ min: 1 }).withMessage('User ID tidak valid').toInt(),

    body('role_id')
      .isInt({ min: 1 })
      .withMessage('Role ID tidak valid')
      .toInt(),
  ],

  /**
   * Update verification status
   */
  updateVerification: [
    param('id').isInt({ min: 1 }).withMessage('User ID tidak valid').toInt(),

    body('is_verified')
      .isBoolean()
      .withMessage('is_verified harus boolean')
      .toBoolean(),
  ],

  /**
   * Delete user validation
   */
  deleteUser: [
    param('id').isInt({ min: 1 }).withMessage('User ID tidak valid').toInt(),
  ],
};

module.exports = userValidation;
