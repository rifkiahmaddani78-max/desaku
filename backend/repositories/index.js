const AuthRepository = require('./AuthRepository');
const UserRepository = require('./UserRepository');
const RoleRepository = require('./RoleRepository');
const WilayahRepository = require('./WilayahRepository');
const AlamatRepository = require('./AlamatRepository');
const AnggotaKeluargaRepository = require('./AnggotaKeluargaRepository');
const BansosRepository = require('./BansosRepository');
const PengajuanBansosRepository = require('./PengajuanBansosRepository');

// Nanti akan ditambahkan repositories lainnya
// const BeritaRepository = require('./BeritaRepository');
// const JadwalRepository = require('./JadwalRepository');

module.exports = {
  authRepository: AuthRepository,
  userRepository: UserRepository,
  roleRepository: RoleRepository,
  wilayahRepository: WilayahRepository,
  alamatRepository: AlamatRepository,
  anggotaKeluargaRepository: AnggotaKeluargaRepository,
  bansosRepository: BansosRepository,
  pengajuanBansosRepository: PengajuanBansosRepository,
};
