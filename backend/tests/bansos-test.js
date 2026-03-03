const request = require('supertest');
const app = require('../server');
const fs = require('fs');
const path = require('path');

let adminToken = '';
let kkToken = '';
let testBansosId = null;
let testPengajuanId = null;

describe('Bansos Module API Tests', () => {
  beforeAll(async () => {
    // Login as admin
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'Admin123!' });

    adminToken = loginRes.body.data.access_token;

    // Login as kepala keluarga
    const kkRes = await request(app)
      .post('/api/auth/login')
      .send({ username: 'budisantoso', password: 'Password123!' });

    kkToken = kkRes.body.data.access_token;
  });

  describe('Bansos Management', () => {
    test('POST /api/bansos - Should create new bansos (admin only)', async () => {
      const res = await request(app)
        .post('/api/bansos')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          kode_bansos: 'TEST-' + Date.now(),
          nama_bansos: 'Bansos Test',
          jenis_bansos: 'TUNAI',
          kategori: 'PENDIDIKAN',
          deskripsi: 'Bansos untuk testing purposes',
          penerima_manfaat: 'Keluarga dengan anak sekolah',
          jumlah_nominal: 500000,
          kuota: 50,
          tanggal_mulai: '2024-01-01',
          tanggal_selesai: '2024-12-31',
          status: 'AKTIF',
          prioritas: 'TINGGI',
          kuota_wilayah: [
            { dusun_id: 1, kuota: 30 },
            { dusun_id: 2, kuota: 20 },
          ],
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.bansos).toBeDefined();
      testBansosId = res.body.data.bansos.id;
    });

    test('GET /api/bansos - Should get all bansos (admin only)', async () => {
      const res = await request(app)
        .get('/api/bansos')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.data).toBeInstanceOf(Array);
    });

    test('GET /api/bansos/active - Should get active bansos (public)', async () => {
      const res = await request(app).get('/api/bansos/active');

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeInstanceOf(Array);
    });

    test('GET /api/bansos/:id/eligibility - Should check eligibility', async () => {
      const res = await request(app)
        .get(`/api/bansos/${testBansosId}/eligibility`)
        .set('Authorization', `Bearer ${kkToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.is_eligible).toBeDefined();
    });
  });

  describe('Pengajuan Bansos', () => {
    // Create a test file for upload
    const testFilePath = path.join(__dirname, 'test-file.pdf');
    beforeAll(() => {
      // Create a dummy file
      fs.writeFileSync(testFilePath, 'test content');
    });

    afterAll(() => {
      // Clean up test file
      if (fs.existsSync(testFilePath)) {
        fs.unlinkSync(testFilePath);
      }
    });

    test('POST /api/pengajuan-bansos - Should create pengajuan with files', async () => {
      const res = await request(app)
        .post('/api/pengajuan-bansos')
        .set('Authorization', `Bearer ${kkToken}`)
        .field('bansos_id', testBansosId)
        .field(
          'alasan_pengajuan',
          'Membutuhkan bantuan untuk biaya pendidikan anak'
        )
        .attach('dokumen_ktp', testFilePath)
        .attach('dokumen_kk', testFilePath)
        .attach('dokumen_surat_permohonan', testFilePath);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.pengajuan).toBeDefined();
      testPengajuanId = res.body.data.pengajuan.id;
    });

    test('GET /api/pengajuan-bansos/my - Should get my pengajuan', async () => {
      const res = await request(app)
        .get('/api/pengajuan-bansos/my')
        .set('Authorization', `Bearer ${kkToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeInstanceOf(Array);
    });

    test('PUT /api/pengajuan-bansos/:id/status - Should update status (admin only)', async () => {
      const res = await request(app)
        .put(`/api/pengajuan-bansos/${testPengajuanId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          status: 'DITERIMA',
          keterangan: 'Pengajuan memenuhi syarat',
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });

    test('POST /api/pengajuan-bansos/:id/rating - Should add rating', async () => {
      const res = await request(app)
        .post(`/api/pengajuan-bansos/${testPengajuanId}/rating`)
        .set('Authorization', `Bearer ${kkToken}`)
        .send({
          rating: 5,
          testimoni: 'Sangat membantu, proses cepat dan transparan',
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });

    test('GET /api/pengajuan-bansos/notifications - Should get notifications', async () => {
      const res = await request(app)
        .get('/api/pengajuan-bansos/notifications')
        .set('Authorization', `Bearer ${kkToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeInstanceOf(Array);
    });
  });

  describe('Statistics and Reports', () => {
    test('GET /api/bansos/statistics - Should get bansos statistics', async () => {
      const res = await request(app)
        .get('/api/bansos/statistics')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeDefined();
    });

    test('GET /api/pengajuan-bansos/statistics - Should get pengajuan statistics', async () => {
      const res = await request(app)
        .get('/api/pengajuan-bansos/statistics')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeDefined();
    });
  });
});
