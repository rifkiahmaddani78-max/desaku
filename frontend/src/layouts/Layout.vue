<template>
  <div class="min-h-screen bg-gray-100 flex">
    <!-- Sidebar Desktop -->
    <div class="hidden lg:block fixed inset-y-0 left-0 z-40 w-64">
      <AdminSidebar />
    </div>

    <!-- Overlay Mobile -->
    <div
      v-if="isMobileSidebarOpen"
      class="lg:hidden fixed inset-0 z-40 bg-black/50"
      @click="closeMobileSidebar"
    />

    <!-- Sidebar Mobile -->
    <div
      v-if="isMobileSidebarOpen"
      class="lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg"
    >
      <AdminSidebar @close="closeMobileSidebar" />
    </div>

    <!-- Main Content -->
    <div class="flex flex-1 flex-col lg:pl-64">
      <!-- Header -->
      <div class="sticky top-0 z-30">
        <AdminHeader :is-sidebar-open="isMobileSidebarOpen" @toggle-sidebar="toggleMobileSidebar" />
      </div>

      <!-- Content -->
      <main class="flex-1 overflow-y-auto p-6">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AdminSidebar from '@/components/layout/Sidebar.vue'
import AdminHeader from '@/components/layout/Header.vue'

const isMobileSidebarOpen = ref(false)

const toggleMobileSidebar = () => {
  isMobileSidebarOpen.value = !isMobileSidebarOpen.value
}

const closeMobileSidebar = () => {
  isMobileSidebarOpen.value = false
}
</script>
