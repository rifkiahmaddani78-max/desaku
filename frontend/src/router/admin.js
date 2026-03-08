import AdminLayout from '@/layouts/Layout.vue'
import DashboardAdmin from '@/views/admin/Dashboard.vue'
import DaftarKepalaKeluarga from '@/views/admin/KepalaKeluargaDaftar.vue'
import TambahKepalaKeluarga from '@/views/admin/KepalaKeluargaTambah.vue'
import DetailKepalaKeluarga from '@/views/admin/KepalaKeluargaDetail.vue'
import EditKepalaKeluarga from '@/views/admin/KepalaKeluargaEdit.vue'
import BansosDaftar from '@/views/admin/BansosDaftar.vue'
import BansosTambah from '@/views/admin/BansosTambah.vue'
import BansosDetail from '@/views/admin/BansosDetail.vue'
import BansosEdit from '@/views/admin/BansosEdit.vue'
import BansosPengajuan from '@/views/admin/BansosPengajuan.vue'
import BansosPengajuanDetail from '@/views/admin/BansosPengajuanDetail.vue'
import DusunDaftar from '@/views/admin/DusunDaftar.vue'
import DusunForm from '@/views/admin/DusunForm.vue'
import DusunDetail from '@/views/admin/DusunDetail.vue'
import Profil from '@/views/auth/Profil.vue'

export default [
  {
    path: '/admin',
    redirect: '/admin/dashboard',
    component: AdminLayout,
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
    },
    children: [
      // Dashboard
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: DashboardAdmin,
        meta: {
          title: 'Dashboard Admin - Desa Ku',
        },
      },
      // Kepala Keluarga - Daftar
      {
        path: 'kepala-keluarga',
        name: 'PendudukAdmin',
        component: DaftarKepalaKeluarga,
        mate: {
          title: 'Penduduk Admin - Desa Ku',
        },
      },
      // Kepala Keluarga - Tambah
      {
        path: 'kepala-keluarga/tambah-kepala-keluarga',
        name: 'TambahKepalaKeluarga',
        component: TambahKepalaKeluarga,
        mate: {
          title: 'Tambah Kepala Keluarga - Desa Ku',
        },
      },
      // Kepala Keluarga - Detail
      {
        path: 'kepala-keluarga/:id',
        name: 'DetailKepalaKeluarga',
        component: DetailKepalaKeluarga,
        mate: {
          title: 'Detail Kepala Keluarga - Desa Ku',
        },
      },
      // Kepala Keluarga - Edit
      {
        path: '/admin/kepala-keluarga/:id/edit',
        name: 'EditKepalaKeluarga',
        component: EditKepalaKeluarga,
        mate: {
          title: 'Edit Alamat Kepala Keluarga - Desa Ku',
        },
      },
      // Bansos - Daftar
      {
        path: '/admin/daftar-bansos',
        name: 'DaftarBansos',
        component: BansosDaftar,
        mate: {
          title: 'Daftar Bansos - Desa Ku',
        },
      },
      // Bansos - Tambah
      {
        path: '/admin/daftar-bansos/tambah',
        name: 'TambahBansos',
        component: BansosTambah,
        mate: {
          title: 'Tambah Bansos - Desa Ku',
        },
      },
      // Bansos - Detail
      {
        path: '/admin/daftar-bansos/:id',
        name: 'DetailBansos',
        component: BansosDetail,
        mate: {
          title: 'Detail Bansos - Desa Ku',
        },
      },
      // Bansos - Edit
      {
        path: '/admin/daftar-bansos/:id/edit',
        name: 'EditBansos',
        component: BansosEdit,
        mate: {
          title: 'Edit Bansos - Desa Ku',
        },
      },
      // Bansos - Pengajuan
      {
        path: '/admin/pengajuan-bansos',
        name: 'PengajuanBansos',
        component: BansosPengajuan,
        mate: {
          title: 'Pengajuan Bansos - Desa Ku',
        },
      },
      // Bansos - Pengajuan Detail
      {
        path: '/admin/pengajuan-bansos/:id',
        name: 'PengajuanBansosDetail',
        component: BansosPengajuanDetail,
        mate: {
          title: 'Pengajuan Bansos Detail - Desa Ku',
        },
      },
      // Wilayah - Dusun Daftar
      {
        path: '/admin/dusun',
        name: 'DusunDaftar',
        component: DusunDaftar,
        mate: {
          title: 'Dusun Daftar - Desa Ku',
        },
      },
      // Wilayah - Dusun Tambah
      {
        path: '/admin/dusun/tambah',
        name: 'DusunTambah',
        component: DusunForm,
        mate: {
          title: 'Dusun Tambah - Desa Ku',
        },
      },
      // Wilayah - Dusun Edit
      {
        path: '/admin/dusun/:id/edit',
        name: 'DusunEdit',
        component: DusunForm,
        mate: {
          title: 'Dusun Edit - Desa Ku',
        },
      },
      // Wilayah - Dudun Detail
      {
        path: '/admin/dusun/:id',
        name: 'DusunDetail',
        component: DusunDetail,
        mate: {
          title: 'Dusun Detail - Desa Ku',
        },
      },
      // Profile
      {
        path: '/admin/profile',
        name: 'ProfileAdmin',
        component: Profil,
        mate: {
          title: 'Profile - Desa Ku',
        },
      },
    ],
  },
]
