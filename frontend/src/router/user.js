import Layout from '@/layouts/Layout.vue'
import BansosDaftar from '@/views/kepalakeluarga/BansosDaftar.vue'
import AnggotaKeluargaDaftar from '@/views/kepalakeluarga/AnggotaKeluargaDaftar.vue'
import AnggotaKeluargaEdit from '@/views/kepalakeluarga/AnggotaKeluargaEdit.vue'
import AnggotaKeluargaTambah from '@/views/kepalakeluarga/AnggotaKeluargaTambah.vue'
import Dashboard from '@/views/kepalakeluarga/Dashboard.vue'
import BansosPegajuan from '@/views/kepalakeluarga/BansosPegajuan.vue'
import BansosDetail from '@/views/kepalakeluarga/BansosDetail.vue'
import BansosPengajuanDetail from '@/views/kepalakeluarga/BansosPengajuanDetail.vue'
import Profil from '@/views/auth/Profil.vue'

export default [
  {
    path: '/',
    redirect: '/dashboard',
    component: Layout,
    meta: {
      requiresAuth: true,
      requiresUser: true,
    },
    children: [
      // Dashboard
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: Dashboard,
        meta: {
          title: 'Dashboard Kepala Keluarga - Desa Ku',
        },
      },
      // Anggota Keluarga - Daftar
      {
        path: 'anggota-keluarga',
        name: 'AnggotaKeluargaDaftar',
        component: AnggotaKeluargaDaftar,
        mate: {
          title: 'Anggota Keluarga - Desa Ku',
        },
      },
      // Anggota Keluarga - Tambah
      {
        path: 'anggota-keluarga/tambah',
        name: 'AnggotaKeluargaTambah',
        component: AnggotaKeluargaTambah,
        mate: {
          title: 'Anggota Keluarga Tambah - Desa Ku',
        },
      },
      // Anggota Keluarga - Edit
      {
        path: 'anggota-keluarga/:id',
        name: 'AnggotaKeluargaEdit',
        component: AnggotaKeluargaEdit,
        mate: {
          title: 'Anggota Keluarga Edit - Desa Ku',
        },
      },
      // Bansos - Daftar
      {
        path: '/daftar-bansos',
        name: 'BansosDaftar',
        component: BansosDaftar,
        mate: {
          title: 'Bansos Daftar - Desa Ku',
        },
      },
      // Bansos - Daftar Detail
      {
        path: '/daftar-bansos/:id',
        name: 'BansosDetail',
        component: BansosDetail,
        mate: {
          title: 'Bansos Detail - Desa Ku',
        },
      },
      // Bansos - Pengajuan
      {
        path: '/pengajuan-bansos-saya',
        name: 'BansosPengajuan',
        component: BansosPegajuan,
        mate: {
          title: 'Bansos Pengajuan - Desa Ku',
        },
      },
      // Bansos - Pengajuan Detail
      {
        path: '/pengajuan-bansos-saya/:id',
        name: 'BansosPengajuanDetail',
        component: BansosPengajuanDetail,
        mate: {
          title: 'Bansos Pengajuan Detail - Desa Ku',
        },
      },
      // Profile
      {
        path: '/profile',
        name: 'ProfileKepalaKeluarga',
        component: Profil,
        mate: {
          title: 'Profile - Desa Ku',
        },
      },
    ],
  },
]
