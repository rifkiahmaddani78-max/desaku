const AuthService = require('./AuthService');
const UserService = require('./UserService');
const WilayahService = require('./WilayahService');
const AnggotaKeluargaService = require('./AnggotaKeluargaService');
const BansosService = require('./BansosService');
const PengajuanBansosService = require('./PengajuanBansosService');

// Nanti akan ditambahkan services lainnya
// const BeritaService = require('./BeritaService');
// const JadwalService = require('./JadwalService');

module.exports = {
  authService: AuthService,
  userService: UserService,
  wilayahService: WilayahService,
  anggotaKeluargaService: AnggotaKeluargaService,
  bansosService: BansosService,
  pengajuanBansosService: PengajuanBansosService,
};
