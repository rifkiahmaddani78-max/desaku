<template>
  <header class="bg-white shadow-sm z-10">
    <div class="px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center py-4">
        <!-- Left section: Mobile menu button and breadcrumb -->
        <div class="flex items-center">
          <!-- Mobile menu button -->
          <button
            type="button"
            class="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            @click="$emit('toggle-sidebar')"
          >
            <span class="sr-only">Buka menu</span>
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                :d="isSidebarOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'"
              />
            </svg>
          </button>

          <!-- Breadcrumb -->
          <nav class="hidden lg:flex items-center space-x-4" aria-label="Breadcrumb">
            <div class="flex items-center">
              <router-link to="/admin/dashboard" class="text-gray-400 hover:text-gray-500">
                <HomeIcon class="h-5 w-5 flex-shrink-0" />
                <span class="sr-only">Dashboard</span>
              </router-link>
            </div>

            <template v-for="(crumb, index) in breadcrumbs" :key="crumb.name">
              <svg class="h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clip-rule="evenodd"
                />
              </svg>

              <router-link
                :to="crumb.href"
                :class="[
                  'text-sm font-medium',
                  index === breadcrumbs.length - 1
                    ? 'text-gray-500 cursor-default'
                    : 'text-gray-700 hover:text-gray-900',
                ]"
                :aria-current="index === breadcrumbs.length - 1 ? 'page' : undefined"
              >
                {{ crumb.name }}
              </router-link>
            </template>
          </nav>
        </div>

        <!-- Right section: Search and user menu -->
        <div class="flex items-center space-x-4">
          <!-- Notifications -->
          <button
            type="button"
            class="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 relative"
            @click="toggleNotifications"
          >
            <span class="sr-only">Lihat notifikasi</span>
            <BellIcon class="h-6 w-6" />
            <span
              v-if="notificationCount > 0"
              class="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"
            ></span>
          </button>

          <!-- User menu -->
          <UserMenu />
        </div>
      </div>
    </div>

    <!-- Notifications panel -->
    <div
      v-if="showNotifications"
      class="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-20 ring-1 ring-black ring-opacity-5"
      v-click-outside="closeNotifications"
    >
      <div class="px-4 py-3 border-b border-gray-200">
        <h3 class="text-sm font-medium text-gray-900">Notifikasi</h3>
        <p class="text-xs text-gray-500">{{ notificationCount }} notifikasi belum dibaca</p>
      </div>

      <div class="max-h-96 overflow-y-auto">
        <div v-if="notifications.length === 0" class="px-4 py-8 text-center">
          <BellIcon class="mx-auto h-12 w-12 text-gray-400" />
          <h3 class="mt-2 text-sm font-medium text-gray-900">Tidak ada notifikasi</h3>
          <p class="mt-1 text-sm text-gray-500">Semua notifikasi sudah dibaca</p>
        </div>

        <div v-else>
          <div
            v-for="notification in notifications"
            :key="notification.id"
            class="px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
          >
            <div class="flex items-start">
              <div
                :class="[
                  'flex-shrink-0 rounded-full p-1',
                  notification.type === 'success'
                    ? 'bg-green-100 text-green-600'
                    : notification.type === 'warning'
                      ? 'bg-yellow-100 text-yellow-600'
                      : notification.type === 'error'
                        ? 'bg-red-100 text-red-600'
                        : 'bg-blue-100 text-blue-600',
                ]"
              >
                <component :is="notification.icon" class="h-4 w-4" />
              </div>
              <div class="ml-3 flex-1">
                <p class="text-sm text-gray-900">{{ notification.title }}</p>
                <p class="mt-1 text-xs text-gray-500">{{ notification.message }}</p>
                <p class="mt-1 text-xs text-gray-400">{{ notification.time }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="px-4 py-2 border-t border-gray-200">
        <router-link
          to="/notifikasi"
          class="text-sm font-medium text-primary-600 hover:text-primary-500"
          @click="closeNotifications"
        >
          Lihat semua notifikasi
        </router-link>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { HomeIcon, BellIcon } from '@heroicons/vue/24/outline'
import UserMenu from './UserMenu.vue'

defineProps({
  isSidebarOpen: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['toggle-sidebar'])

const route = useRoute()
const searchQuery = ref('')
const showNotifications = ref(false)
const notifications = ref([])

// Mock notifications data
const mockNotifications = [
  {
    id: 1,
    title: 'Bansos Disetujui',
    message: 'Pengajuan bansos bulan Januari telah disetujui',
    type: 'success',
    icon: 'CheckCircleIcon',
    time: '10 menit lalu',
    read: false,
  },
  {
    id: 2,
    title: 'Pengaduan Diterima',
    message: 'Pengaduan Anda sedang diproses',
    type: 'info',
    icon: 'InformationCircleIcon',
    time: '1 jam lalu',
    read: false,
  },
  {
    id: 3,
    title: 'Data Keluarga',
    message: 'Perbarui data anggota keluarga Anda',
    type: 'warning',
    icon: 'ExclamationTriangleIcon',
    time: '2 hari lalu',
    read: true,
  },
]

const notificationCount = computed(() => notifications.value.filter((n) => !n.read).length)

const breadcrumbs = computed(() => {
  const pathArray = route.path.split('/').filter((path) => path)
  const crumbs = []

  let currentPath = ''
  pathArray.forEach((path, index) => {
    currentPath += `/${path}`
    crumbs.push({
      name: formatBreadcrumbName(path),
      href: currentPath,
    })
  })

  return crumbs
})

const formatBreadcrumbName = (path) => {
  return path
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

const performSearch = () => {
  if (searchQuery.value.trim()) {
    // Implement search logic here
    console.log('Searching for:', searchQuery.value)
  }
}

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
}

const closeNotifications = () => {
  showNotifications.value = false
}

const markAllAsRead = () => {
  notifications.value.forEach((notification) => {
    notification.read = true
  })
}

onMounted(() => {
  // In production, fetch notifications from API
  notifications.value = mockNotifications
})

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
