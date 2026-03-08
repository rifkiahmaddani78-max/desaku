<template>
  <aside
    class="flex flex-col w-64 h-full bg-gradient-to-b from-white to-gray-50 border-r border-gray-100 shadow-sm relative transition-all duration-300"
    :class="{ 'lg:translate-x-0': isOpen }"
  >
    <!-- HEADER SECTION -->
    <div class="px-6 pt-6 mb-6">
      <div class="flex items-center justify-between">
        <!-- Logo dengan efek modern -->
        <div class="flex items-center group cursor-pointer" @click="navigateToDashboard">
          <div class="relative">
            <div
              class="w-11 h-11 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105"
            >
              <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </div>
            <div
              class="absolute -top-1 -right-1 w-3.5 h-3.5 bg-gradient-to-r from-green-400 to-blue-500 rounded-full border-2 border-white shadow-sm"
            ></div>
          </div>

          <div class="ml-3">
            <h1 class="text-lg font-bold text-gray-900 tracking-tight">DesaKu</h1>
            <p class="text-[10px] text-gray-500 font-medium">Sistem Informasi Desa</p>
          </div>
        </div>

        <!-- CLOSE BUTTON MOBILE -->
        <button
          class="lg:hidden text-gray-400 hover:text-gray-600 hover:bg-gray-100 w-7 h-7 rounded-lg flex items-center justify-center transition-colors duration-200"
          aria-label="Tutup sidebar"
          @click="$emit('close')"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- MAIN CONTENT - Navigation -->
    <div class="flex-grow flex flex-col px-3 overflow-y-auto">
      <div class="space-y-1">
        <Navigation @nav-click="$emit('close')" />
      </div>
    </div>

    <!-- BOTTOM SECTION -->
    <div class="mt-auto px-3 pb-4 pt-3 border-t border-gray-100">
      <!-- ACTION BUTTONS -->
      <div class="space-y-1.5">
        <button
          @click="openHelp"
          class="flex items-center w-full px-3 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg group transition-all duration-200"
        >
          <div
            class="w-8 h-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center mr-3 group-hover:from-blue-100 group-hover:to-blue-200 transition-all duration-200"
          >
            <QuestionMarkCircleIcon class="h-4 w-4 text-blue-600" />
          </div>
          <span>Bantuan & Dukungan</span>
        </button>

        <button
          @click="handleLogout"
          class="flex items-center w-full px-3 py-2.5 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg group transition-all duration-200"
        >
          <div
            class="w-8 h-8 bg-gradient-to-br from-red-50 to-red-100 rounded-lg flex items-center justify-center mr-3 group-hover:from-red-100 group-hover:to-red-200 transition-all duration-200"
          >
            <ArrowRightOnRectangleIcon class="h-4 w-4 text-red-600" />
          </div>
          <span>Keluar</span>
        </button>
      </div>

      <!-- Version Info -->
      <div class="mt-4 pt-3 border-t border-gray-100">
        <div class="flex items-center justify-between text-[10px] text-gray-400">
          <span>Versi 2.1.0</span>
          <span class="flex items-center">
            <div class="w-1.5 h-1.5 bg-green-400 rounded-full mr-1 animate-pulse"></div>
            Online
          </span>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Navigation from './Navigation.vue'
import { QuestionMarkCircleIcon, ArrowRightOnRectangleIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['close'])

const router = useRouter()
const authStore = useAuthStore()

const userName = computed(() => authStore.user?.name || 'User')
const userRole = computed(() => {
  const role = authStore.user?.role_name
  return role === 'ADMIN' ? 'Administrator' : 'Kepala Keluarga'
})
const userInitial = computed(() => {
  return userName.value.charAt(0).toUpperCase()
})

const navigateToDashboard = () => {
  const dashboardPath = authStore.isAdmin ? '/admin/dashboard' : '/dashboard'
  router.push(dashboardPath)
  emit('close')
}

const openHelp = () => {
  window.open('/help')
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.flex-grow::-webkit-scrollbar {
  width: 3px;
}

.flex-grow::-webkit-scrollbar-track {
  background: transparent;
}

.flex-grow::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}

.flex-grow::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

aside {
  backdrop-filter: blur(10px);
}

button {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
