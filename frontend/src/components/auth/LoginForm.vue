<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Username/Email Field -->
    <div>
      <label for="username" class="block text-sm font-medium text-gray-700">
        Username atau Email
      </label>
      <div class="mt-1">
        <input
          id="username"
          v-model="form.username"
          type="text"
          required
          :disabled="loading"
          class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          :class="{ 'border-red-300': errors.username }"
        />
        <p v-if="errors.username" class="mt-1 text-sm text-red-600">
          {{ errors.username }}
        </p>
      </div>
    </div>

    <!-- Password Field -->
    <div>
      <div class="flex items-center justify-between">
        <label for="password" class="block text-sm font-medium text-gray-700">
          Password
        </label>
        <div class="text-sm">
          <router-link
            to="/forgot-password"
            class="font-medium text-primary-600 hover:text-primary-500"
          >
            Lupa password?
          </router-link>
        </div>
      </div>
      <div class="mt-1">
        <input
          id="password"
          v-model="form.password"
          :type="showPassword ? 'text' : 'password'"
          required
          :disabled="loading"
          class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          :class="{ 'border-red-300': errors.password }"
        />
        <p v-if="errors.password" class="mt-1 text-sm text-red-600">
          {{ errors.password }}
        </p>
      </div>
      <div class="mt-2 flex items-center">
        <input
          id="show-password"
          v-model="showPassword"
          type="checkbox"
          class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
        />
        <label for="show-password" class="ml-2 block text-sm text-gray-700">
          Tampilkan password
        </label>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="authError" class="rounded-md bg-red-50 p-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">
            Login gagal
          </h3>
          <div class="mt-2 text-sm text-red-700">
            <p>{{ authError }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Submit Button -->
    <div>
      <button
        type="submit"
        :disabled="loading"
        class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span v-if="loading" class="flex items-center">
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Memproses...
        </span>
        <span v-else>
          Masuk
        </span>
      </button>
    </div>

    <!-- Register Link -->
    <div class="text-center text-sm">
      <span class="text-gray-600">Belum punya akun?</span>
      {{ ' ' }}
      <router-link
        to="/register"
        class="font-medium text-primary-600 hover:text-primary-500"
      >
        Daftar sekarang
      </router-link>
    </div>
  </form>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// Form state
const form = reactive({
  username: '',
  password: ''
})

// UI state
const showPassword = ref(false)
const loading = computed(() => authStore.loading)
const authError = computed(() => authStore.error)

// Validation errors
const errors = reactive({
  username: '',
  password: ''
})

// Handle form submission
const handleSubmit = async () => {
  // Reset errors
  clearErrors()

  // Validate form
  if (!validateForm()) {
    return
  }

  // Call login action
  const result = await authStore.login(form)

  if (result.success) {
    // Redirect based on role
    const user = result.data.user
    if (user.role_name === 'admin') {
      router.push('/dashboard') // Nanti akan diarahkan ke admin dashboard
    } else {
      router.push('/dashboard')
    }
  }
}

// Validate form
const validateForm = () => {
  let isValid = true

  // Validate username
  if (!form.username.trim()) {
    errors.username = 'Username atau email diperlukan'
    isValid = false
  }

  // Validate password
  if (!form.password) {
    errors.password = 'Password diperlukan'
    isValid = false
  } else if (form.password.length < 6) {
    errors.password = 'Password minimal 6 karakter'
    isValid = false
  }

  return isValid
}

// Clear errors
const clearErrors = () => {
  errors.username = ''
  errors.password = ''
  authStore.clearError()
}
</script>
