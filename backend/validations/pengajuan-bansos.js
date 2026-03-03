const { body, param, query } = require('express-validator');

const pengajuanBansosValidation = {
  // Get pengajuan validation
  getPengajuan: [
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

    query('bansos_id')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Bansos ID tidak valid')
      .toInt(),

    query('kepala_keluarga_id')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Kepala keluarga ID tidak valid')
      .toInt(),

    query('status')
      .optional()
      .isIn(['MENUNGGU', 'DIPROSES', 'DITERIMA', 'DITOLAK'])
      .withMessage('Status tidak valid'),

    query('dusun_id')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Dusun ID tidak valid')
      .toInt(),

    query('rw_id')
      .optional()
      .isInt({ min: 1 })
      .withMessage('RW ID tidak valid')
      .toInt(),

    query('rt_id')
      .optional()
      .isInt({ min: 1 })
      .withMessage('RT ID tidak valid')
      .toInt(),

    query('tanggal_mulai')
      .optional()
      .isDate()
      .withMessage('Tanggal mulai tidak valid'),

    query('tanggal_selesai')
      .optional()
      .isDate()
      .withMessage('Tanggal selesai tidak valid'),
  ],

  // Create pengajuan
  createPengajuan: [
    body('bansos_id')
      .isInt({ min: 1 })
      .withMessage('Bansos ID diperlukan')
      .toInt(),

    body('alasan_pengajuan')
      .trim()
      .notEmpty()
      .withMessage('Alasan pengajuan diperlukan')
      .isLength({ min: 10, max: 1000 })
      .withMessage('Alasan pengajuan 10-1000 karakter'),

    body('dokumen_ktp').optional().trim(),

    body('dokumen_kk').optional().trim(),

    body('dokumen_surat_permohonan').optional().trim(),

    body('dokumen_lainnya').optional().trim(),
  ],

  // Update status
  updatePengajuanStatus: [
    param('id')
      .isInt({ min: 1 })
      .withMessage('ID pengajuan tidak valid')
      .toInt(),

    body('status')
      .notEmpty()
      .withMessage('Status diperlukan')
      .isIn(['MENUNGGU', 'DIPROSES', 'DITERIMA', 'DITOLAK'])
      .withMessage('Status tidak valid'),

    body('keterangan')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Keterangan maksimal 500 karakter'),

    body('catatan_admin')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Catatan admin maksimal 1000 karakter'),
  ],

  // Add rating
  addRating: [
    param('id')
      .isInt({ min: 1 })
      .withMessage('ID pengajuan tidak valid')
      .toInt(),

    body('rating')
      .isInt({ min: 1, max: 5 })
      .withMessage('Rating harus 1-5')
      .toInt(),

    body('testimoni')
      .trim()
      .notEmpty()
      .withMessage('Testimoni diperlukan')
      .isLength({ min: 10, max: 500 })
      .withMessage('Testimoni 10-500 karakter'),
  ],

  // File upload validation (for express-validator)
  validateFileUpload: (fieldName, isRequired = false) => {
    const validations = [];

    if (isRequired) {
      validations.push(
        body(fieldName).custom((value, { req }) => {
          if (!req.file && !req.files?.[fieldName]) {
            throw new Error(`${fieldName} diperlukan`);
          }
          return true;
        })
      );
    }

    validations.push(
      body(fieldName)
        .optional()
        .custom((value, { req }) => {
          const file = req.file || req.files?.[fieldName]?.[0];
          if (file) {
            const allowedTypes = [
              'image/jpeg',
              'image/jpg',
              'image/png',
              'image/gif',
              'application/pdf',
              'application/msword',
              'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            ];

            if (!allowedTypes.includes(file.mimetype)) {
              throw new Error(`Tipe file ${fieldName} tidak didukung`);
            }

            if (file.size > 5 * 1024 * 1024) {
              // 5MB
              throw new Error(`File ${fieldName} terlalu besar (maksimal 5MB)`);
            }
          }
          return true;
        })
    );

    return validations;
  },
};

module.exports = pengajuanBansosValidation;
