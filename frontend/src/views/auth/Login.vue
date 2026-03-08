<!-- src/views/auth/Login.vue -->
<template>
  <div
    class="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 flex flex-col justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8"
  >
    <!-- Background Pattern -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        class="absolute -top-40 -right-40 w-80 h-80 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"
      ></div>
      <div
        class="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"
      ></div>
      <div
        class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"
      ></div>
    </div>

    <div class="relative z-10 sm:mx-auto sm:w-full sm:max-w-md">
      <!-- Logo dengan efek modern -->
      <div class="flex justify-center mb-6 sm:mb-8">
        <div class="relative group">
          <div
            class="absolute -inset-1 bg-gradient-to-r from-primary-600 to-primary-400 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300"
          ></div>
          <div
            class="relative w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center shadow-xl transform group-hover:scale-105 transition-all duration-300"
          >
            <svg
              class="h-10 w-10 sm:h-12 sm:w-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          </div>
        </div>
      </div>

      <!-- Judul -->
      <div class="text-center mb-8">
        <h2 class="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
          Selamat Datang Kembali
        </h2>
        <p class="text-sm sm:text-base text-gray-600">
          Silakan masuk ke akun Anda untuk melanjutkan
        </p>
      </div>

      <!-- Success Message -->
      <Transition name="slide-down">
        <div
          v-if="registeredSuccess"
          class="mb-6 rounded-xl bg-green-50 p-4 border border-green-200"
        >
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-green-800">Registrasi Berhasil!</h3>
              <p class="text-sm text-green-700 mt-1">
                Akun Anda telah terdaftar. Silakan login menggunakan username dan password Anda.
              </p>
            </div>
          </div>
        </div>
      </Transition>

      <!-- Card Login -->
      <div
        class="bg-white/80 backdrop-blur-lg py-8 px-4 sm:px-8 shadow-2xl rounded-2xl border border-gray-100"
      >
        <LoginForm />
      </div>

      <!-- Footer -->
      <div class="mt-8 text-center">
        <p class="text-xs sm:text-sm text-gray-500">
          © {{ currentYear }} Desa Ku. All rights reserved.
        </p>
        <div class="flex justify-center space-x-4 mt-2">
          <router-link
            to="/help"
            class="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            Bantuan
          </router-link>
        </div>
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

// Fungsi untuk mengisi demo credentials
const fillDemoCredentials = (role) => {
  const event = new CustomEvent('fill-demo-credentials', {
    detail:
      role === 'admin'
        ? { username: 'admin', password: 'Admin123!' }
        : { username: 'budisantoso', password: 'Password123!' },
  })
  window.dispatchEvent(event)
}

onMounted(() => {
  if (route.query.registered === 'true') {
    registeredSuccess.value = true
    const url = new URL(window.location.href)
    url.searchParams.delete('registered')
    window.history.replaceState({}, '', url)

    // Auto hide after 5 seconds
    setTimeout(() => {
      registeredSuccess.value = false
    }, 5000)
  }
})
</script>

<style scoped>
@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .animate-blob {
    animation: blob 10s infinite;
  }
}
</style>
