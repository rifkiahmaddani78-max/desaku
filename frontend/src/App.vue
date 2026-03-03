<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

onMounted(() => {
  // Initialize auth store
  authStore.initialize()
})
</script>

<style>
/* Global styles */
body {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Focus styles */
*:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

*:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}
</style>
