const { body, param, query } = require('express-validator');

const bansosValidation = {
  // Get bansos validation
  getBansos: [
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

    query('status')
      .optional()
      .isIn(['DRAFT', 'AKTIF', 'SELESAI', 'DIBATALKAN'])
      .withMessage('Status tidak valid'),

    query('kategori')
      .optional()
      .isIn(['SEMBAKO', 'TUNAI', 'PENDIDIKAN', 'KESEHATAN', 'UMKM', 'LAINNYA'])
      .withMessage('Kategori tidak valid'),

    query('jenis_bansos')
      .optional()
      .isIn(['TUNAI', 'BARANG', 'JASA'])
      .withMessage('Jenis bansos tidak valid'),

    query('prioritas')
      .optional()
      .isIn(['RENDAH', 'SEDANG', 'TINGGI', 'DARURAT'])
      .withMessage('Prioritas tidak valid'),

    query('search')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Search maksimal 100 karakter'),
  ],

  // Get bansos by ID
  getBansosById: [
    param('id').isInt({ min: 1 }).withMessage('ID bansos tidak valid').toInt(),
  ],

  // Create bansos
  createBansos: [
    body('kode_bansos')
      .trim()
      .notEmpty()
      .withMessage('Kode bansos diperlukan')
      .isLength({ min: 3, max: 20 })
      .withMessage('Kode bansos 3-20 karakter')
      .matches(/^[A-Z0-9\-_]+$/)
      .withMessage('Kode bansos hanya boleh huruf kapital, angka, dan strip'),

    body('nama_bansos')
      .trim()
      .notEmpty()
      .withMessage('Nama bansos diperlukan')
      .isLength({ min: 3, max: 100 })
      .withMessage('Nama bansos 3-100 karakter'),

    body('jenis_bansos')
      .notEmpty()
      .withMessage('Jenis bansos diperlukan')
      .isIn(['TUNAI', 'BARANG', 'JASA'])
      .withMessage('Jenis bansos tidak valid'),

    body('kategori')
      .optional()
      .isIn(['SEMBAKO', 'TUNAI', 'PENDIDIKAN', 'KESEHATAN', 'UMKM', 'LAINNYA'])
      .withMessage('Kategori tidak valid'),

    body('deskripsi')
      .trim()
      .notEmpty()
      .withMessage('Deskripsi diperlukan')
      .isLength({ min: 10, max: 1000 })
      .withMessage('Deskripsi 10-1000 karakter'),

    body('penerima_manfaat')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Penerima manfaat maksimal 500 karakter'),

    body('jumlah_nominal')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Jumlah nominal tidak valid')
      .toFloat(),

    body('satuan_barang')
      .optional()
      .trim()
      .isLength({ max: 50 })
      .withMessage('Satuan barang maksimal 50 karakter'),

    body('kuota')
      .isInt({ min: 1 })
      .withMessage('Kuota harus angka positif')
      .toInt(),

    body('tanggal_mulai')
      .notEmpty()
      .withMessage('Tanggal mulai diperlukan')
      .isDate()
      .withMessage('Tanggal mulai tidak valid'),

    body('tanggal_selesai')
      .notEmpty()
      .withMessage('Tanggal selesai diperlukan')
      .isDate()
      .withMessage('Tanggal selesai tidak valid')
      .custom((value, { req }) => {
        if (new Date(value) < new Date(req.body.tanggal_mulai)) {
          throw new Error('Tanggal selesai harus setelah tanggal mulai');
        }
        return true;
      }),

    body('status')
      .optional()
      .isIn(['DRAFT', 'AKTIF', 'SELESAI', 'DIBATALKAN'])
      .withMessage('Status tidak valid'),

    body('prioritas')
      .optional()
      .isIn(['RENDAH', 'SEDANG', 'TINGGI', 'DARURAT'])
      .withMessage('Prioritas tidak valid'),

    body('kuota_wilayah')
      .optional()
      .isArray()
      .withMessage('Kuota wilayah harus array'),

    body('kuota_wilayah.*.dusun_id')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Dusun ID tidak valid')
      .toInt(),

    body('kuota_wilayah.*.rw_id')
      .optional()
      .isInt({ min: 1 })
      .withMessage('RW ID tidak valid')
      .toInt(),

    body('kuota_wilayah.*.rt_id')
      .optional()
      .isInt({ min: 1 })
      .withMessage('RT ID tidak valid')
      .toInt(),

    body('kuota_wilayah.*.kuota')
      .isInt({ min: 1 })
      .withMessage('Kuota wilayah harus angka positif')
      .toInt(),
  ],

  // Update bansos
  updateBansos: [
    param('id').isInt({ min: 1 }).withMessage('ID bansos tidak valid').toInt(),

    body('kode_bansos')
      .optional()
      .trim()
      .isLength({ min: 3, max: 20 })
      .withMessage('Kode bansos 3-20 karakter'),

    body('nama_bansos')
      .optional()
      .trim()
      .isLength({ min: 3, max: 100 })
      .withMessage('Nama bansos 3-100 karakter'),

    body('status')
      .optional()
      .isIn(['DRAFT', 'AKTIF', 'SELESAI', 'DIBATALKAN'])
      .withMessage('Status tidak valid'),

    body('tanggal_mulai')
      .optional()
      .isDate()
      .withMessage('Tanggal mulai tidak valid'),

    body('tanggal_selesai')
      .optional()
      .isDate()
      .withMessage('Tanggal selesai tidak valid')
      .custom((value, { req }) => {
        if (
          req.body.tanggal_mulai &&
          new Date(value) < new Date(req.body.tanggal_mulai)
        ) {
          throw new Error('Tanggal selesai harus setelah tanggal mulai');
        }
        return true;
      }),
  ],

  // Update status
  updateBansosStatus: [
    param('id').isInt({ min: 1 }).withMessage('ID bansos tidak valid').toInt(),

    body('status')
      .notEmpty()
      .withMessage('Status diperlukan')
      .isIn(['DRAFT', 'AKTIF', 'SELESAI', 'DIBATALKAN'])
      .withMessage('Status tidak valid'),
  ],

  // Check eligibility
  checkEligibility: [
    param('id').isInt({ min: 1 }).withMessage('ID bansos tidak valid').toInt(),
  ],
};

module.exports = bansosValidation;
