<!-- src/views/auth/Register.vue -->
<template>
  <div
    class="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 flex flex-col justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8"
  >
    <!-- Background Pattern (sama dengan login) -->
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

    <div class="relative z-10 max-w-4xl mx-auto w-full">
      <!-- Logo dengan efek modern (sama dengan login) -->
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
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
          </div>
        </div>
      </div>

      <!-- Judul -->
      <div class="text-center mb-8">
        <h1 class="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
          Daftar sebagai Kepala Keluarga
        </h1>
        <p class="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
          Isi data diri Anda dengan benar sesuai KTP untuk mengakses layanan desa
        </p>
      </div>

      <!-- Card Registrasi -->
      <div
        class="bg-white/80 backdrop-blur-lg py-6 sm:py-8 px-4 sm:px-8 shadow-2xl rounded-2xl border border-gray-100"
      >
        <!-- Progress Steps -->
        <div class="mb-8">
          <div class="flex items-center justify-between">
            <div v-for="(step, index) in steps" :key="index" class="flex-1 text-center">
              <div class="relative">
                <div
                  class="w-8 h-8 mx-auto rounded-full flex items-center justify-center text-sm font-semibold"
                  :class="[
                    currentStep > index + 1
                      ? 'bg-primary-600 text-white'
                      : currentStep === index + 1
                        ? 'bg-primary-100 text-primary-700 border-2 border-primary-600'
                        : 'bg-gray-100 text-gray-400',
                  ]"
                >
                  <svg
                    v-if="currentStep > index + 1"
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span v-else>{{ index + 1 }}</span>
                </div>
                <p
                  class="text-xs mt-2 font-medium"
                  :class="currentStep === index + 1 ? 'text-primary-700' : 'text-gray-500'"
                >
                  {{ step }}
                </p>
              </div>
            </div>
          </div>
          <div class="relative mt-2">
            <div class="absolute top-0 left-0 h-1 bg-gray-200 rounded-full w-full"></div>
            <div
              class="absolute top-0 left-0 h-1 bg-primary-600 rounded-full transition-all duration-300"
              :style="{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }"
            ></div>
          </div>
        </div>

        <RegisterForm
          :current-step="currentStep"
          @next="currentStep++"
          @prev="currentStep--"
          @complete="handleComplete"
        />
      </div>

      <!-- Footer Links -->
      <div class="mt-8 text-center">
        <router-link
          to="/login"
          class="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors group"
        >
          <svg
            class="w-4 h-4 mr-1 transform group-hover:-translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Kembali ke Login
        </router-link>
        <p class="mt-4 text-xs text-gray-400">© {{ currentYear }} Desa Ku. All rights reserved.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import RegisterForm from '@/components/auth/RegisterForm.vue'

const router = useRouter()
const currentYear = ref(new Date().getFullYear())
const currentStep = ref(1)

const steps = ['Data Pribadi', 'Akun & Kontak', 'Detail Tambahan']

const handleComplete = () => {
  router.push('/login?registered=true')
}
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

@media (max-width: 640px) {
  .animate-blob {
    animation: blob 10s infinite;
  }
}
</style>
