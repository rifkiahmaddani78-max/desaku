<template>
  <div class="relative" v-click-outside="closeMenu">
    <button
      @click="toggleMenu"
      class="flex items-center space-x-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-full"
    >
      <div class="flex flex-col items-end">
        <span class="text-sm font-medium text-gray-700">
          {{ user?.nama_lengkap || 'User' }}
        </span>
        <span class="text-xs text-gray-500 capitalize">
          {{ roleText }}
        </span>
      </div>

      <div class="relative">
        <div
          class="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-semibold"
        >
          {{ userInitials }}
        </div>
        <div v-if="hasNotifications" class="absolute -top-1 -right-1">
          <span class="flex h-3 w-3">
            <span
              class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"
            ></span>
            <span class="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        </div>
      </div>
    </button>

    <!-- Dropdown Menu -->
    <div
      v-if="isOpen"
      class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 ring-1 ring-black ring-opacity-5"
    >
      <!-- User Info -->
      <div class="px-4 py-2 border-b border-gray-100">
        <p class="text-sm font-medium text-gray-900 truncate">
          {{ user?.nama_lengkap || 'User' }}
        </p>
        <p class="text-xs text-gray-500 truncate">
          {{ user?.email || user?.username || '' }}
        </p>
      </div>

      <!-- Menu Items - Profile dengan routing dinamis -->
      <router-link
        :to="profileRoute"
        class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        @click="closeMenu"
      >
        <svg
          class="mr-3 h-5 w-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
        Profil Saya
      </router-link>

      <div class="border-t border-gray-100"></div>

      <button
        @click="handleLogout"
        class="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
      >
        <svg
          class="mr-3 h-5 w-5 text-red-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>
        Keluar
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { getInitials } from '@/utils/helpers'

const router = useRouter()
const authStore = useAuthStore()

const isOpen = ref(false)
const hasNotifications = ref(false)

const user = computed(() => authStore.user)
const userInitials = computed(() => getInitials(user.value?.nama_lengkap))

// Determinan role user
const isAdmin = computed(() => {
  const role = user.value?.role_name?.toLowerCase()
  return role === 'admin' || role === 'administrator'
})

// Role text yang ditampilkan
const roleText = computed(() => {
  const role = user.value?.role_name
  if (!role) return ''
  return role === 'admin' ? 'Administrator' : 'Kepala Keluarga'
})

// Route untuk profile berdasarkan role
const profileRoute = computed(() => {
  return isAdmin.value ? '/admin/profile' : '/profile'
})

// Route untuk settings berdasarkan role
const settingsRoute = computed(() => {
  return isAdmin.value ? '/admin/settings' : '/settings'
})

const toggleMenu = () => {
  isOpen.value = !isOpen.value
}

const closeMenu = () => {
  isOpen.value = false
}

const handleLogout = async () => {
  try {
    await authStore.logout()
    closeMenu()
    router.push('/login')
  } catch (error) {
    console.error('Logout error:', error)
    // Fallback: langsung redirect ke login
    router.push('/login')
  }
}

// Directives
const vClickOutside = {
  mounted(el, binding) {
    el.clickOutsideEvent = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value()
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el) {
    document.removeEventListener('click', el.clickOutsideEvent)
  },
}
</script>

<style scoped>
/* Animasi untuk dropdown */
.router-link-active {
  @apply bg-gray-50;
}

/* Transisi smooth untuk hover */
button,
.router-link {
  transition: all 0.2s ease;
}
</style>
