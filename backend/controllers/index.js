const AuthController = require('./AuthController');
const UserController = require('./UserController');
const WilayahController = require('./WilayahController');
const AnggotaKeluargaController = require('./AnggotaKeluargaController');
const BansosController = require('./BansosController');
const PengajuanBansosController = require('./PengajuanBansosController');

// Nanti akan ditambahkan controllers lainnya
// const BeritaController = require('./BeritaController');
// const JadwalController = require('./JadwalController');

module.exports = {
  authController: AuthController,
  userController: UserController,
  wilayahController: WilayahController,
  anggotaKeluargaController: AnggotaKeluargaController,
  bansosController: BansosController,
  pengajuanBansosController: PengajuanBansosController,
};
