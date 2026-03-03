const { body } = require('express-validator');
const authUtils = require('../utils/auth');

/**
 * Auth validation schemas
 */
const authValidation = {
  /**
   * Login validation
   */
  login: [
    body('username')
      .trim()
      .notEmpty()
      .withMessage('Username atau email diperlukan')
      .isLength({ min: 3, max: 50 })
      .withMessage('Username/Email harus 3-50 karakter'),

    body('password')
      .trim()
      .notEmpty()
      .withMessage('Password diperlukan')
      .isLength({ min: 6 })
      .withMessage('Password minimal 6 karakter'),
  ],

  /**
   * Register validation
   */
  register: [
    body('nik')
      .trim()
      .notEmpty()
      .withMessage('NIK diperlukan')
      .isLength({ min: 16, max: 16 })
      .withMessage('NIK harus 16 digit')
      .isNumeric()
      .withMessage('NIK harus angka'),

    body('nama_lengkap')
      .trim()
      .notEmpty()
      .withMessage('Nama lengkap diperlukan')
      .isLength({ min: 3, max: 100 })
      .withMessage('Nama harus 3-100 karakter')
      .matches(/^[a-zA-Z\s.']+$/)
      .withMessage('Nama hanya boleh mengandung huruf dan spasi'),

    body('email')
      .optional()
      .trim()
      .isEmail()
      .withMessage('Email tidak valid')
      .normalizeEmail(),

    body('username')
      .trim()
      .notEmpty()
      .withMessage('Username diperlukan')
      .isLength({ min: 3, max: 50 })
      .withMessage('Username harus 3-50 karakter')
      .matches(/^[a-zA-Z0-9._]+$/)
      .withMessage(
        'Username hanya boleh mengandung huruf, angka, titik dan underscore'
      ),

    body('password')
      .trim()
      .notEmpty()
      .withMessage('Password diperlukan')
      .custom((value) => {
        const validation = authUtils.validatePasswordStrength(value);
        if (!validation.isValid) {
          throw new Error(validation.errors.join(', '));
        }
        return true;
      }),

    body('telepon')
      .optional()
      .trim()
      .matches(/^[0-9+\-\s()]+$/)
      .withMessage('Nomor telepon tidak valid'),

    body('jenis_kelamin')
      .trim()
      .notEmpty()
      .withMessage('Jenis kelamin diperlukan')
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
      .withMessage('Tanggal lahir tidak valid')
      .custom((value) => {
        const birthDate = new Date(value);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();

        if (age < 17) {
          throw new Error('Usia minimal 17 tahun');
        }
        return true;
      }),

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
  ],

  /**
   * Refresh token validation
   */
  refreshToken: [
    body('refresh_token')
      .trim()
      .notEmpty()
      .withMessage('Refresh token diperlukan')
      .isJWT()
      .withMessage('Refresh token tidak valid'),
  ],

  /**
   * Change password validation
   */
  changePassword: [
    body('current_password')
      .trim()
      .notEmpty()
      .withMessage('Password saat ini diperlukan'),

    body('new_password')
      .trim()
      .notEmpty()
      .withMessage('Password baru diperlukan')
      .custom((value, { req }) => {
        if (value === req.body.current_password) {
          throw new Error('Password baru harus berbeda dengan password lama');
        }

        const validation = authUtils.validatePasswordStrength(value);
        if (!validation.isValid) {
          throw new Error(validation.errors.join(', '));
        }
        return true;
      }),

    body('confirm_password')
      .trim()
      .notEmpty()
      .withMessage('Konfirmasi password diperlukan')
      .custom((value, { req }) => {
        if (value !== req.body.new_password) {
          throw new Error('Konfirmasi password tidak cocok');
        }
        return true;
      }),
  ],

  /**
   * Forgot password validation
   */
  forgotPassword: [
    body('email').optional().trim().isEmail().withMessage('Email tidak valid'),

    body('nik')
      .optional()
      .trim()
      .isLength({ min: 16, max: 16 })
      .withMessage('NIK harus 16 digit'),

    body().custom((value, { req }) => {
      if (!req.body.email && !req.body.nik) {
        throw new Error('Email atau NIK diperlukan');
      }
      return true;
    }),
  ],

  /**
   * Reset password validation
   */
  resetPassword: [
    body('token')
      .trim()
      .notEmpty()
      .withMessage('Token reset password diperlukan'),

    body('new_password')
      .trim()
      .notEmpty()
      .withMessage('Password baru diperlukan')
      .custom((value) => {
        const validation = authUtils.validatePasswordStrength(value);
        if (!validation.isValid) {
          throw new Error(validation.errors.join(', '));
        }
        return true;
      }),

    body('confirm_password')
      .trim()
      .notEmpty()
      .withMessage('Konfirmasi password diperlukan')
      .custom((value, { req }) => {
        if (value !== req.body.new_password) {
          throw new Error('Konfirmasi password tidak cocok');
        }
        return true;
      }),
  ],
};

module.exports = authValidation;
