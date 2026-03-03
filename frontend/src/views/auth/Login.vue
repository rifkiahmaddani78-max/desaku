<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="flex justify-center">
        <div class="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center">
          <svg class="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </div>
      </div>

      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Desa Ku
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Sistem Informasi Desa Modern
      </p>

      <!-- Success message after registration -->
      <div v-if="registeredSuccess" class="mt-4 rounded-md bg-green-50 p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-green-800">
              Registrasi berhasil!
            </h3>
            <div class="mt-2 text-sm text-green-700">
              <p>Akun Anda telah terdaftar. Silakan login menggunakan username dan password Anda.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <LoginForm />

        <!-- Demo Credentials -->
        <div class="mt-8 pt-6 border-t border-gray-200">
          <h3 class="text-sm font-medium text-gray-700 mb-2">Demo Credentials:</h3>
          <div class="space-y-2 text-sm text-gray-600">
            <div class="flex items-center space-x-2">
              <span class="font-medium">Admin:</span>
              <code class="bg-gray-100 px-2 py-1 rounded">admin</code>
              <code class="bg-gray-100 px-2 py-1 rounded">Admin123!</code>
            </div>
            <div class="flex items-center space-x-2">
              <span class="font-medium">Kepala Keluarga:</span>
              <code class="bg-gray-100 px-2 py-1 rounded">budisantoso</code>
              <code class="bg-gray-100 px-2 py-1 rounded">Password123!</code>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-6 text-center text-sm text-gray-600">
        <p>© {{ currentYear }} Desa Ku. All rights reserved.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import LoginForm from '@/components/auth/LoginForm.vue'

const route = useRoute()
const currentYear = ref(new Date().getFullYear())
const registeredSuccess = ref(false)

onMounted(() => {
  // Check if user just registered
  if (route.query.registered === 'true') {
    registeredSuccess.value = true

    // Clear query after showing message
    const url = new URL(window.location.href)
    url.searchParams.delete('registered')
    window.history.replaceState({}, '', url)
  }
})
</script>
