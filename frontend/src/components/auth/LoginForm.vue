<!-- src/components/auth/LoginForm.vue -->
<template>
  <form @submit.prevent="handleSubmit" class="space-y-5 sm:space-y-6">
    <!-- Username/Email Field -->
    <div>
      <label for="username" class="block text-sm font-medium text-gray-700 mb-1.5">
        <span class="flex items-center">
          <svg
            class="w-4 h-4 mr-1.5 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          Username atau Email
        </span>
      </label>
      <div class="relative">
        <input
          id="username"
          v-model="form.username"
          type="text"
          required
          :disabled="loading"
          placeholder="Masukkan username atau email"
          class="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
          :class="{ 'border-red-300 ring-2 ring-red-200': errors.username }"
          @input="clearFieldError('username')"
        />
        <div
          v-if="errors.username"
          class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
        >
          <svg class="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      </div>
      <p v-if="errors.username" class="mt-1.5 text-xs text-red-600 flex items-center">
        <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        {{ errors.username }}
      </p>
    </div>

    <!-- Password Field -->
    <div>
      <div class="flex items-center justify-between mb-1.5">
        <label for="password" class="block text-sm font-medium text-gray-700">
          <span class="flex items-center">
            <svg
              class="w-4 h-4 mr-1.5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            Password
          </span>
        </label>
        <router-link
          to="/forgot-password"
          class="text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors"
        >
          Lupa password?
        </router-link>
      </div>
      <div class="relative">
        <input
          id="password"
          v-model="form.password"
          :type="showPassword ? 'text' : 'password'"
          required
          :disabled="loading"
          placeholder="Masukkan password"
          class="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base pr-12"
          :class="{ 'border-red-300 ring-2 ring-red-200': errors.password }"
          @input="clearFieldError('password')"
        />
        <div class="absolute inset-y-0 right-0 flex items-center pr-3 space-x-1">
          <button
            type="button"
            @click="showPassword = !showPassword"
            class="text-gray-400 hover:text-gray-600 focus:outline-none transition-colors p-1"
            tabindex="-1"
          >
            <svg
              v-if="showPassword"
              class="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
              />
            </svg>
            <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </button>
          <div v-if="errors.password" class="pointer-events-none">
            <svg class="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
      </div>
      <p v-if="errors.password" class="mt-1.5 text-xs text-red-600 flex items-center">
        <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        {{ errors.password }}
      </p>
    </div>

    <!-- Remember Me -->
    <div class="flex items-center justify-between">
      <label class="flex items-center">
        <input
          type="checkbox"
          v-model="rememberMe"
          class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded transition-colors"
        />
        <span class="ml-2 text-sm text-gray-600">Ingat saya</span>
      </label>
      <span class="text-xs text-gray-400">*untuk perangkat pribadi</span>
    </div>

    <!-- Error Message -->
    <Transition name="shake">
      <div v-if="authError" class="rounded-xl bg-red-50 p-4 border border-red-200">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">Login Gagal</h3>
            <p class="text-sm text-red-700 mt-1">{{ authError }}</p>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Submit Button -->
    <div>
      <button
        type="submit"
        :disabled="loading"
        class="relative w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm sm:text-base font-medium text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] transition-all duration-200"
      >
        <span v-if="loading" class="flex items-center">
          <svg
            class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Memproses...
        </span>
        <span v-else class="flex items-center">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
            />
          </svg>
          Masuk
        </span>
      </button>
    </div>

    <!-- Register Link -->
    <div class="text-center">
      <p class="text-sm text-gray-600">
        Belum punya akun?
        <router-link
          to="/register"
          class="font-medium text-primary-600 hover:text-primary-700 transition-colors"
        >
          Daftar sekarang
        </router-link>
      </p>
    </div>
  </form>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// Form state
const form = reactive({
  username: '',
  password: '',
})

// UI state
const showPassword = ref(false)
const rememberMe = ref(false)
const loading = computed(() => authStore.loading)
const authError = computed(() => authStore.error)

// Validation errors
const errors = reactive({
  username: '',
  password: '',
})

// Clear field error on input
const clearFieldError = (field) => {
  errors[field] = ''
}

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
      router.push('/admin/dashboard')
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
  } else if (form.username.length < 3) {
    errors.username = 'Username minimal 3 karakter'
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

// Handle demo credentials
const handleDemoCredentials = (event) => {
  const { username, password } = event.detail
  form.username = username
  form.password = password
  clearErrors()
}

onMounted(() => {
  window.addEventListener('fill-demo-credentials', handleDemoCredentials)
})

onUnmounted(() => {
  window.removeEventListener('fill-demo-credentials', handleDemoCredentials)
})
</script>

<style scoped>
.shake-enter-active {
  animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}

@keyframes shake {
  10%,
  90% {
    transform: translateX(-1px);
  }
  20%,
  80% {
    transform: translateX(2px);
  }
  30%,
  50%,
  70% {
    transform: translateX(-4px);
  }
  40%,
  60% {
    transform: translateX(4px);
  }
}

/* Smooth transitions for error states */
input,
button {
  transition: all 0.2s ease;
}

/* Focus styles */
input:focus {
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .rounded-xl {
    border-radius: 1rem;
  }

  input,
  button {
    font-size: 16px !important; /* Prevent zoom on mobile */
  }
}
</style>
