import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import adminRoutes from './admin'
import userRoutes from './user'
import BantuanDukungan from '@/views/auth/BantuanDukungan.vue'

// Lazy load
const Login = () => import('@/views/auth/Login.vue')
const Register = () => import('@/views/auth/Register.vue')

const routes = [
  {
    path: '/',
    redirect: '/login',
  },

  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      requiresGuest: true,
      title: 'Login - Desa Ku',
    },
  },

  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: {
      requiresGuest: true,
      title: 'Registrasi - Desa Ku',
    },
  },

  ...userRoutes,
  ...adminRoutes,

  {
    path: '/help',
    name: 'Bantuan Dan Dukungan',
    component: BantuanDukungan,
    meta: {
      title: 'Bantuan & Dukungan - Desa Ku',
    },
  },

  // 404 fallback (lebih aman)
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

/* ===========================
   GLOBAL NAVIGATION GUARD
=========================== */
router.beforeEach((to, from, next) => {
  const auth = useAuthStore()

  // Init auth hanya sekali
  if (!auth.initialized) {
    auth.initialize()
  }

  // Set page title
  if (to.meta.title) {
    document.title = to.meta.title
  }

  /* ===========================
     1️⃣ Guest Only (Login/Register)
  =========================== */
  if (to.meta.requiresGuest && auth.isAuthenticated) {
    return auth.isAdmin ? next('/admin/dashboard') : next('/dashboard')
  }

  /* ===========================
     2️⃣ Auth Required
  =========================== */
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return next('/login')
  }

  /* ===========================
     3️⃣ Admin Only
  =========================== */
  if (to.meta.requiresAdmin && !auth.isAdmin) {
    return next('/dashboard')
  }

  /* ===========================
     4️⃣ Kepala Keluarga Only
  =========================== */
  if (to.meta.requiresUser && auth.isAdmin) {
    return next('/admin/dashboard')
  }

  next()
})

router.afterEach(() => {
  window.scrollTo(0, 0)
})

export default router
