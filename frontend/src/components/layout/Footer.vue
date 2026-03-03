<template>
  <footer class="bg-white border-t border-gray-200">
    <div class="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div class="flex flex-col md:flex-row justify-between items-center">
        <!-- Copyright and links -->
        <div class="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
          <div class="text-sm text-gray-500">
            &copy; {{ currentYear }} Desa Ku. All rights reserved.
          </div>

          <div class="flex items-center space-x-4">
            <router-link to="/privacy" class="text-sm text-gray-500 hover:text-gray-700">
              Kebijakan Privasi
            </router-link>
            <router-link to="/terms" class="text-sm text-gray-500 hover:text-gray-700">
              Syarat & Ketentuan
            </router-link>
            <router-link to="/help" class="text-sm text-gray-500 hover:text-gray-700">
              Bantuan
            </router-link>
          </div>
        </div>

        <!-- Contact and version -->
        <div class="mt-4 md:mt-0 flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
          <div class="flex items-center space-x-2">
            <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <a href="mailto:info@desaku.id" class="text-sm text-gray-500 hover:text-gray-700">
              info@desaku.id
            </a>
          </div>

          <div class="flex items-center space-x-2">
            <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <a href="tel:+622112345678" class="text-sm text-gray-500 hover:text-gray-700">
              (021) 1234-5678
            </a>
          </div>

          <div class="text-xs text-gray-400">
            v{{ appVersion }}
          </div>
        </div>
      </div>

      <!-- Desa info -->
      <div class="mt-6 pt-6 border-t border-gray-100 text-center">
        <p class="text-sm text-gray-500">
          Kantor Desa • Jl. Desa No. 123, Kecamatan, Kabupaten • Buka Senin-Jumat 08:00-16:00
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref } from 'vue'

const currentYear = ref(new Date().getFullYear())
const appVersion = ref('1.0.0')
</script>
