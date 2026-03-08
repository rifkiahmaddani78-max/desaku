<template>
  <nav class="space-y-1">
    <!-- Menu items selain Bansos -->
    <template v-for="item in mainNavigation" :key="item.name">
      <router-link
        v-if="!item.hasSubmenu"
        :to="item.href"
        :class="[
          isActive(item.href)
            ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-500'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent',
          'group flex items-center px-3 py-2.5 text-sm font-medium rounded-r-lg transition-all duration-200',
        ]"
        @click="handleItemClick"
      >
        <component
          :is="item.icon"
          :class="[
            isActive(item.href) ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500',
            'mr-3 h-5 w-5 flex-shrink-0 transition-colors duration-200',
          ]"
          aria-hidden="true"
        />
        <span class="flex-1">{{ item.name }}</span>
        <span
          v-if="item.badge"
          class="ml-auto inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
          :class="badgeClasses(item.badge.variant)"
        >
          {{ item.badge.text }}
        </span>
      </router-link>

      <!-- Menu dengan submenu (Bansos) -->
      <div v-else class="space-y-1">
        <button
          @click="toggleSubmenu(item.name)"
          :class="[
            isSubmenuActive
              ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-500'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent',
            'group flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-r-lg transition-all duration-200',
          ]"
        >
          <component
            :is="item.icon"
            :class="[
              isSubmenuActive ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500',
              'mr-3 h-5 w-5 flex-shrink-0 transition-colors duration-200',
            ]"
          />
          <span class="flex-1 text-left">{{ item.name }}</span>

          <!-- Badge count jika ada -->
          <span
            v-if="item.badge"
            class="mr-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
            :class="badgeClasses(item.badge.variant)"
          >
            {{ item.badge.text }}
          </span>

          <!-- Icon panah untuk submenu -->
          <svg
            class="w-4 h-4 transition-transform duration-200"
            :class="{ 'rotate-180': openSubmenus[item.name] }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        <!-- Submenu items -->
        <transition
          enter-active-class="transition-all duration-200 ease-out"
          enter-from-class="opacity-0 -translate-y-2"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition-all duration-150 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-2"
        >
          <div v-if="openSubmenus[item.name]" class="pl-11 space-y-1">
            <router-link
              v-for="subItem in item.submenu"
              :key="subItem.name"
              :to="subItem.href"
              :class="[
                isActive(subItem.href)
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50',
                'group flex items-center px-3 py-2 text-xs font-medium rounded-lg transition-all duration-200 relative',
              ]"
              @click="handleSubItemClick"
            >
              <span class="w-1 h-1 rounded-full bg-gray-300 mr-2"></span>
              {{ subItem.name }}
              <span
                v-if="subItem.badge"
                class="ml-auto inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium"
                :class="badgeClasses(subItem.badge.variant, true)"
              >
                {{ subItem.badge.text }}
              </span>
            </router-link>
          </div>
        </transition>
      </div>
    </template>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ROLES } from '@/utils/constants'
import Badge from '@/components/ui/Badge.vue'

// Icons
import {
  HomeIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  MapIcon,
  BellIcon,
  DocumentTextIcon,
  ClipboardDocumentListIcon,
  PaperAirplaneIcon,
  UserCircleIcon,
  
} from '@heroicons/vue/24/outline'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// State untuk submenu yang terbuka
const openSubmenus = ref({})

// Cek apakah user adalah admin
const isAdmin = computed(() => authStore.isAdmin)
const userRole = computed(() => authStore.user?.role_name)

// Definisi menu untuk admin
const adminNavigation = [
  {
    name: 'Dashboard',
    href: '/admin/dashboard',
    icon: HomeIcon,
    roles: [ROLES.ADMIN],
  },
  {
    name: 'Kepala Keluarga',
    href: '/admin/kepala-keluarga',
    icon: UserGroupIcon,
    roles: [ROLES.ADMIN],
  },
  {
    name: 'Bansos',
    icon: CurrencyDollarIcon,
    hasSubmenu: true,
    roles: [ROLES.ADMIN],
    submenu: [
      {
        name: 'Daftar Bansos',
        href: '/admin/daftar-bansos',
        icon: ClipboardDocumentListIcon,
      },
      {
        name: 'Daftar Pengajuan',
        href: '/admin/pengajuan-bansos',
        icon: PaperAirplaneIcon,
      },
    ],
  },
  {
    name: 'Wilayah',
    href: '/admin/dusun',
    icon: MapIcon,
    roles: [ROLES.ADMIN],
  },
  // {
  //   name: 'Laporan',
  //   href: '/admin/laporan',
  //   icon: ChartBarIcon,
  //   roles: [ROLES.ADMIN],
  // },
]

// Definisi menu untuk Kepala Keluarga
const kkNavigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: HomeIcon,
    roles: [ROLES.KEPALA_KELUARGA],
  },
  {
    name: 'Anggota Keluarga',
    href: '/anggota-keluarga',
    icon: UserGroupIcon,
    roles: [ROLES.KEPALA_KELUARGA],
  },
  {
    name: 'Bansos',
    icon: CurrencyDollarIcon,
    hasSubmenu: true,
    roles: [ROLES.KEPALA_KELUARGA],
    submenu: [
      {
        name: 'Daftar Bansos',
        href: '/daftar-bansos',
        icon: ClipboardDocumentListIcon,
      },
      {
        name: 'Pengajuan Saya',
        href: '/pengajuan-bansos-saya',
        icon: PaperAirplaneIcon,
      },
    ],
  },

  {
    name: 'Profile Saya',
    href: '/Profile',
    icon: UserCircleIcon,
    roles: [ROLES.KEPALA_KELUARGA],
  },
]

// Filter menu berdasarkan role
const mainNavigation = computed(() => {
  const navItems = isAdmin.value ? adminNavigation : kkNavigation
  return navItems.filter((item) => item.roles.includes(userRole.value))
})

// Cek apakah submenu bansos sedang aktif
const isSubmenuActive = computed(() => {
  return (
    route.path.includes('/daftar-bansos') ||
    route.path.includes('/pengajuan-bansos') ||
    route.path.includes('/admin/daftar-bansos/tambah')
  )
})

// Buka submenu bansos secara otomatis jika route sedang di bansos
onMounted(() => {
  if (route.path.includes('/daftar-bansos')) {
    openSubmenus.value['Bansos'] = true
  }
})

// Fungsi untuk toggle submenu
const toggleSubmenu = (menuName) => {
  openSubmenus.value[menuName] = !openSubmenus.value[menuName]
}

// Fungsi untuk mengecek apakah link sedang aktif
const isActive = (href) => {
  if (href === '/dashboard' || href === '/admin/dashboard') {
    return route.path === href
  }
  return route.path.startsWith(href)
}

// Handle klik item menu
const handleItemClick = () => {
  emit('nav-click')
}

// Handle klik submenu item
const handleSubItemClick = () => {
  // Tutup submenu setelah klik (opsional, bisa dihapus jika ingin tetap terbuka)
  // openSubmenus.value['Bansos'] = false
  emit('nav-click')
}

// Classes untuk badge berdasarkan variant
const badgeClasses = (variant, isSmall = false) => {
  const baseClasses = isSmall ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs'

  const variants = {
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    success: 'bg-green-100 text-green-800',
    info: 'bg-blue-100 text-blue-800',
    primary: 'bg-primary-100 text-primary-800',
  }

  return `${baseClasses} ${variants[variant] || variants.primary}`
}

defineEmits(['nav-click'])
</script>

<style scoped>
.router-link-active {
  @apply bg-primary-50 text-primary-700 border-l-4 border-primary-500;
}

.router-link-active svg {
  @apply text-primary-500;
}

/* Animasi untuk submenu */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.2s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.slide-enter-to,
.slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}

/* Hover effect untuk menu items */
button:hover svg,
a:hover svg {
  transform: scale(1.05);
}

/* Transisi untuk panah submenu */
.rotate-180 {
  transform: rotate(180deg);
}
</style>
