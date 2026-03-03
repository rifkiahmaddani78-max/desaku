<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      <div class="text-center mb-8">
        <div class="flex justify-center mb-4">
          <div class="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center">
            <svg class="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
        </div>

        <h1 class="text-3xl font-extrabold text-gray-900">
          Registrasi Kepala Keluarga
        </h1>
        <p class="mt-2 text-sm text-gray-600">
          Daftarkan diri Anda sebagai kepala keluarga untuk mengakses layanan desa
        </p>
      </div>

      <div class="bg-white shadow overflow-hidden sm:rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <div class="mb-6">
            <h2 class="text-lg font-medium text-gray-900">
              Informasi Pribadi
            </h2>
            <p class="mt-1 text-sm text-gray-500">
              Isi data diri Anda dengan benar sesuai KTP
            </p>
          </div>

          <RegisterForm />
        </div>
      </div>

      <div class="mt-6 text-center text-sm text-gray-600">
        <router-link to="/login" class="font-medium text-primary-600 hover:text-primary-500">
          &larr; Kembali ke Login
        </router-link>
        <p class="mt-2">© {{ currentYear }} Desa Ku. All rights reserved.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import RegisterForm from '@/components/auth/RegisterForm.vue'

const currentYear = ref(new Date().getFullYear())
</script>
