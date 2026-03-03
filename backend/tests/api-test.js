const request = require('supertest');
const app = require('../server');
const pool = require('../config/database');
const authUtils = require('../utils/auth');

let adminToken = '';
let kkToken = '';
let refreshToken = '';
let testUserId = null;
let testDusunId = null;
let testRwId = null;
let testRtId = null;
let testAnggotaId = null;

describe('Desa Ku API Tests', () => {
  beforeAll(async () => {
    // Ensure database is connected
    const connection = await pool.getConnection();
    connection.release();
  });

  describe('Authentication API', () => {
    test('GET /api/health - Should return server health', async () => {
      const res = await request(app).get('/api/health');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('API is healthy');
    });

    test('GET /api/docs - Should return API documentation', async () => {
      const res = await request(app).get('/api/docs');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.endpoints).toBeDefined();
    });

    test('POST /api/auth/login - Should login admin with correct credentials', async () => {
      const res = await request(app).post('/api/auth/login').send({
        username: 'admin',
        password: 'Admin123!',
      });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user).toBeDefined();
      expect(res.body.data.access_token).toBeDefined();

      adminToken = res.body.data.access_token;
      refreshToken = res.headers['set-cookie'][0].match(
        /refresh_token=([^;]+)/
      )[1];
    });

    test('POST /api/auth/login - Should fail with wrong credentials', async () => {
      const res = await request(app).post('/api/auth/login').send({
        username: 'admin',
        password: 'wrongpassword',
      });

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });

    test('POST /api/auth/register - Should register new kepala keluarga', async () => {
      const res = await request(app).post('/api/auth/register').send({
        nik: '1234567890123456',
        nama_lengkap: 'John Doe',
        username: 'johndoe',
        password: 'Password123!',
        jenis_kelamin: 'L',
        tempat_lahir: 'Jakarta',
        tanggal_lahir: '1990-01-01',
        agama: 'ISLAM',
        pekerjaan: 'Wiraswasta',
        status_perkawinan: 'KAWIN',
      });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user).toBeDefined();
      expect(res.body.data.user.username).toBe('johndoe');
    });

    test('POST /api/auth/refresh - Should refresh access token', async () => {
      const res = await request(app)
        .post('/api/auth/refresh')
        .send({ refresh_token: refreshToken });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.access_token).toBeDefined();
    });
  });

  describe('User Management API (Admin)', () => {
    test('GET /api/users - Should get all users (admin only)', async () => {
      const res = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.data).toBeInstanceOf(Array);
      testUserId = res.body.data.data[0].id;
    });

    test('GET /api/users/:id - Should get user by ID', async () => {
      const res = await request(app)
        .get(`/api/users/${testUserId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(testUserId);
    });

    test('POST /api/users - Should create new user (admin only)', async () => {
      const res = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          nik: '9876543210987654',
          nama_lengkap: 'Test User',
          username: 'testuser',
          email: 'test@example.com',
          password: 'Password123!',
          role_id: 2,
          jenis_kelamin: 'P',
          tempat_lahir: 'Bandung',
          tanggal_lahir: '1995-05-05',
          agama: 'KRISTEN',
          pekerjaan: 'PNS',
          status_perkawinan: 'BELUM_KAWIN',
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
    });

    test('GET /api/users/statistics - Should get user statistics', async () => {
      const res = await request(app)
        .get('/api/users/statistics')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.statistics).toBeDefined();
    });
  });

  describe('Wilayah Management API (Admin)', () => {
    test('POST /api/wilayah/dusun - Should create new dusun', async () => {
      const res = await request(app)
        .post('/api/wilayah/dusun')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          kode_dusun: 'TEST001',
          nama_dusun: 'Dusun Test',
          alamat: 'Jl. Test No. 1',
          kepala_dusun: 'Bapak Test',
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.kode_dusun).toBe('TEST001');
      testDusunId = res.body.data.id;
    });

    test('GET /api/wilayah/dusun - Should get all dusun', async () => {
      const res = await request(app)
        .get('/api/wilayah/dusun')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeInstanceOf(Array);
    });

    test('POST /api/wilayah/rw - Should create new RW', async () => {
      const res = await request(app)
        .post('/api/wilayah/rw')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          dusun_id: testDusunId,
          nomor_rw: '99',
          ketua_rw: 'Ketua RW Test',
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.nomor_rw).toBe('99');
      testRwId = res.body.data.id;
    });

    test('POST /api/wilayah/rt - Should create new RT', async () => {
      const res = await request(app)
        .post('/api/wilayah/rt')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          rw_id: testRwId,
          nomor_rt: '99',
          ketua_rt: 'Ketua RT Test',
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.nomor_rt).toBe('99');
      testRtId = res.body.data.id;
    });

    test('GET /api/wilayah/hierarchy - Should get wilayah hierarchy', async () => {
      const res = await request(app)
        .get('/api/wilayah/hierarchy')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeInstanceOf(Array);
    });
  });

  describe('Anggota Keluarga API', () => {
    beforeAll(async () => {
      // Login as kepala keluarga for these tests
      const res = await request(app).post('/api/auth/login').send({
        username: 'johndoe',
        password: 'Password123!',
      });

      kkToken = res.body.data.access_token;
    });

    test('POST /api/anggota-keluarga - Should create new anggota keluarga', async () => {
      const res = await request(app)
        .post('/api/anggota-keluarga')
        .set('Authorization', `Bearer ${kkToken}`)
        .send({
          nik: '1111222233334444',
          nama_lengkap: 'Jane Doe',
          hubungan: 'ISTRI',
          jenis_kelamin: 'P',
          tempat_lahir: 'Surabaya',
          tanggal_lahir: '1992-02-02',
          agama: 'ISLAM',
          pendidikan_terakhir: 'S1',
          pekerjaan: 'Guru',
          status_perkawinan: 'KAWIN',
          status_tinggal: 'TINGGAL',
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.anggota.nama_lengkap).toBe('Jane Doe');
      testAnggotaId = res.body.data.anggota.id;
    });

    test('GET /api/anggota-keluarga - Should get anggota keluarga', async () => {
      const res = await request(app)
        .get('/api/anggota-keluarga')
        .set('Authorization', `Bearer ${kkToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeInstanceOf(Array);
    });

    test('GET /api/anggota-keluarga/stats - Should get keluarga statistics', async () => {
      const res = await request(app)
        .get('/api/anggota-keluarga/stats')
        .set('Authorization', `Bearer ${kkToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.total_anggota).toBeDefined();
    });
  });

  describe('Cleanup', () => {
    test('DELETE /api/wilayah/rt/:id - Should delete test RT', async () => {
      const res = await request(app)
        .delete(`/api/wilayah/rt/${testRtId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
    });

    test('DELETE /api/wilayah/rw/:id - Should delete test RW', async () => {
      const res = await request(app)
        .delete(`/api/wilayah/rw/${testRwId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
    });

    test('DELETE /api/wilayah/dusun/:id - Should delete test dusun', async () => {
      const res = await request(app)
        .delete(`/api/wilayah/dusun/${testDusunId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
    });

    test('POST /api/auth/logout - Should logout user', async () => {
      const res = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
