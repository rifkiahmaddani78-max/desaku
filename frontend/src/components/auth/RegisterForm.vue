<!-- src/components/auth/RegisterForm.vue -->
<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Step 1: Data Pribadi -->
    <div v-show="currentStep === 1" class="space-y-5 transition-opacity duration-300">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Data Pribadi</h3>

      <!-- NIK Field -->
      <div>
        <label for="nik" class="block text-sm font-medium text-gray-700 mb-1.5">
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
                d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0"
              />
            </svg>
            NIK (Nomor Induk Kependudukan)
          </span>
        </label>
        <div class="relative">
          <input
            id="nik"
            v-model="form.nik"
            type="text"
            required
            maxlength="16"
            placeholder="16 digit NIK"
            class="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
            :class="{ 'border-red-300 ring-2 ring-red-200': errors.nik }"
            @input="clearFieldError('nik')"
          />
          <div
            v-if="errors.nik"
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
        <p v-if="errors.nik" class="mt-1.5 text-xs text-red-600 flex items-center">
          <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {{ errors.nik }}
        </p>
      </div>

      <!-- Nama Lengkap -->
      <div>
        <label for="nama_lengkap" class="block text-sm font-medium text-gray-700 mb-1.5">
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
            Nama Lengkap
          </span>
        </label>
        <input
          id="nama_lengkap"
          v-model="form.nama_lengkap"
          type="text"
          required
          placeholder="Nama lengkap sesuai KTP"
          class="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
          :class="{ 'border-red-300 ring-2 ring-red-200': errors.nama_lengkap }"
          @input="clearFieldError('nama_lengkap')"
        />
        <p v-if="errors.nama_lengkap" class="mt-1.5 text-xs text-red-600">
          {{ errors.nama_lengkap }}
        </p>
      </div>

      <!-- Jenis Kelamin -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
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
            Jenis Kelamin
          </span>
        </label>
        <div class="grid grid-cols-2 gap-3">
          <label
            class="relative flex items-center justify-center p-3 border rounded-xl cursor-pointer transition-all"
            :class="
              form.jenis_kelamin === 'L'
                ? 'border-primary-600 bg-primary-50'
                : 'border-gray-300 hover:border-gray-400'
            "
          >
            <input type="radio" v-model="form.jenis_kelamin" value="L" class="sr-only" />
            <span class="flex items-center">
              <span
                class="w-6 h-6 rounded-full flex items-center justify-center mr-2"
                :class="
                  form.jenis_kelamin === 'L'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-500'
                "
              >
                L
              </span>
              <span :class="form.jenis_kelamin === 'L' ? 'text-primary-700' : 'text-gray-700'"
                >Laki-laki</span
              >
            </span>
          </label>
          <label
            class="relative flex items-center justify-center p-3 border rounded-xl cursor-pointer transition-all"
            :class="
              form.jenis_kelamin === 'P'
                ? 'border-primary-600 bg-primary-50'
                : 'border-gray-300 hover:border-gray-400'
            "
          >
            <input type="radio" v-model="form.jenis_kelamin" value="P" class="sr-only" />
            <span class="flex items-center">
              <span
                class="w-6 h-6 rounded-full flex items-center justify-center mr-2"
                :class="
                  form.jenis_kelamin === 'P'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-500'
                "
              >
                P
              </span>
              <span :class="form.jenis_kelamin === 'P' ? 'text-primary-700' : 'text-gray-700'"
                >Perempuan</span
              >
            </span>
          </label>
        </div>
        <p v-if="errors.jenis_kelamin" class="mt-1.5 text-xs text-red-600">
          {{ errors.jenis_kelamin }}
        </p>
      </div>

      <!-- Tempat & Tanggal Lahir -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label for="tempat_lahir" class="block text-sm font-medium text-gray-700 mb-1.5"
            >Tempat Lahir</label
          >
          <input
            id="tempat_lahir"
            v-model="form.tempat_lahir"
            type="text"
            placeholder="Kota/Kabupaten"
            class="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-sm"
          />
        </div>
        <div>
          <label for="tanggal_lahir" class="block text-sm font-medium text-gray-700 mb-1.5"
            >Tanggal Lahir</label
          >
          <input
            id="tanggal_lahir"
            v-model="form.tanggal_lahir"
            type="date"
            :max="today"
            class="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-sm"
          />
          <p v-if="errors.tanggal_lahir" class="mt-1.5 text-xs text-red-600">
            {{ errors.tanggal_lahir }}
          </p>
        </div>
      </div>
    </div>

    <!-- Step 2: Akun & Kontak -->
    <div v-show="currentStep === 2" class="space-y-5 transition-opacity duration-300">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Akun & Kontak</h3>

      <!-- Username -->
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
            Username
          </span>
        </label>
        <div class="relative">
          <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 text-sm"
            >@</span
          >
          <input
            id="username"
            v-model="form.username"
            type="text"
            required
            placeholder="username123"
            class="block w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
            :class="{ 'border-red-300 ring-2 ring-red-200': errors.username }"
            @input="clearFieldError('username')"
          />
        </div>
        <p v-if="errors.username" class="mt-1.5 text-xs text-red-600">{{ errors.username }}</p>
        <p class="mt-1 text-xs text-gray-400">Minimal 3 karakter, tanpa spasi</p>
      </div>

      <!-- Email -->
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700 mb-1.5"
          >Email (opsional)</label
        >
        <input
          id="email"
          v-model="form.email"
          type="email"
          placeholder="nama@email.com"
          class="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-sm"
          :class="{ 'border-red-300 ring-2 ring-red-200': errors.email }"
          @input="clearFieldError('email')"
        />
        <p v-if="errors.email" class="mt-1.5 text-xs text-red-600">{{ errors.email }}</p>
      </div>

      <!-- Telepon -->
      <div>
        <label for="telepon" class="block text-sm font-medium text-gray-700 mb-1.5"
          >Nomor Telepon (opsional)</label
        >
        <input
          id="telepon"
          v-model="form.telepon"
          type="tel"
          placeholder="0812 3456 7890"
          class="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-sm"
        />
      </div>
    </div>

    <!-- Step 3: Detail Tambahan & Password -->
    <div v-show="currentStep === 3" class="space-y-5 transition-opacity duration-300">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Keamanan & Detail Tambahan</h3>

      <!-- Password -->
      <div>
        <label for="password" class="block text-sm font-medium text-gray-700 mb-1.5">
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
        <div class="relative">
          <input
            id="password"
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            required
            placeholder="Minimal 8 karakter"
            class="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base pr-12"
            :class="{ 'border-red-300 ring-2 ring-red-200': errors.password }"
            @input="clearFieldError('password')"
          />
          <button
            type="button"
            @click="showPassword = !showPassword"
            class="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <svg
              v-if="showPassword"
              class="h-5 w-5 text-gray-400 hover:text-gray-600"
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
            <svg
              v-else
              class="h-5 w-5 text-gray-400 hover:text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
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
        </div>
        <p v-if="errors.password" class="mt-1.5 text-xs text-red-600">{{ errors.password }}</p>

        <!-- Password Strength Indicator -->
        <div v-if="form.password" class="mt-3 space-y-2">
          <div class="flex items-center space-x-2">
            <div class="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                class="h-full transition-all duration-300"
                :class="[
                  passwordStrength.score >= 4
                    ? 'bg-green-500'
                    : passwordStrength.score >= 3
                      ? 'bg-yellow-500'
                      : passwordStrength.score >= 2
                        ? 'bg-orange-500'
                        : 'bg-red-500',
                ]"
                :style="{ width: `${(passwordStrength.score / 4) * 100}%` }"
              ></div>
            </div>
            <span
              class="text-xs font-medium"
              :class="[
                passwordStrength.score >= 4
                  ? 'text-green-600'
                  : passwordStrength.score >= 3
                    ? 'text-yellow-600'
                    : passwordStrength.score >= 2
                      ? 'text-orange-600'
                      : 'text-red-600',
              ]"
              >{{ passwordStrength.label }}</span
            >
          </div>
          <div class="grid grid-cols-2 gap-2">
            <div
              v-for="(rule, index) in passwordRules"
              :key="index"
              class="flex items-center text-xs"
              :class="rule.valid ? 'text-green-600' : 'text-gray-400'"
            >
              <svg
                class="w-3 h-3 mr-1"
                :class="rule.valid ? 'text-green-500' : 'text-gray-300'"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  v-if="rule.valid"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />
                <path
                  v-else
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              {{ rule.text }}
            </div>
          </div>
        </div>
      </div>

      <!-- Confirm Password -->
      <div>
        <label for="confirm_password" class="block text-sm font-medium text-gray-700 mb-1.5"
          >Konfirmasi Password</label
        >
        <input
          id="confirm_password"
          v-model="form.confirm_password"
          :type="showPassword ? 'text' : 'password'"
          required
          placeholder="Ulangi password"
          class="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-sm"
          :class="{ 'border-red-300 ring-2 ring-red-200': errors.confirm_password }"
          @input="clearFieldError('confirm_password')"
        />
        <p v-if="errors.confirm_password" class="mt-1.5 text-xs text-red-600">
          {{ errors.confirm_password }}
        </p>
      </div>

      <!-- Agama -->
      <div>
        <label for="agama" class="block text-sm font-medium text-gray-700 mb-1.5"
          >Agama (opsional)</label
        >
        <select
          id="agama"
          v-model="form.agama"
          class="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-sm"
        >
          <option value="">Pilih Agama</option>
          <option value="ISLAM">Islam</option>
          <option value="KRISTEN">Kristen</option>
          <option value="KATOLIK">Katolik</option>
          <option value="HINDU">Hindu</option>
          <option value="BUDDHA">Buddha</option>
          <option value="KONGHUCU">Konghucu</option>
        </select>
      </div>

      <!-- Pekerjaan (opsional) -->
      <div>
        <label for="pekerjaan" class="block text-sm font-medium text-gray-700 mb-1.5"
          >Pekerjaan (opsional)</label
        >
        <input
          id="pekerjaan"
          v-model="form.pekerjaan"
          type="text"
          placeholder="Contoh: Petani, Pedagang"
          class="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-sm"
        />
      </div>
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
            <h3 class="text-sm font-medium text-red-800">Registrasi Gagal</h3>
            <p class="text-sm text-red-700 mt-1">{{ authError }}</p>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Navigation Buttons -->
    <div class="flex justify-between space-x-3 pt-6">
      <button
        v-if="currentStep > 1"
        type="button"
        @click="$emit('prev')"
        class="px-6 py-3 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200"
      >
        Sebelumnya
      </button>
      <div v-else></div>

      <button
        v-if="currentStep < 3"
        type="button"
        @click="validateAndNext"
        class="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl text-sm font-medium hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 transform hover:scale-[1.02]"
      >
        Selanjutnya
      </button>

      <button
        v-else
        type="submit"
        :disabled="loading || !isFormValid"
        class="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl text-sm font-medium hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
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
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Daftar Sekarang
        </span>
      </button>
    </div>

    <!-- Login Link -->
    <div class="text-center text-sm pt-4 border-t border-gray-200">
      <p class="text-gray-600">
        Sudah punya akun?
        <router-link
          to="/login"
          class="font-medium text-primary-600 hover:text-primary-700 transition-colors"
        >
          Masuk di sini
        </router-link>
      </p>
    </div>
  </form>
</template>

<script setup>
import { ref, reactive, computed, watch, defineEmits, defineProps } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { validatePasswordStrength, isValidEmail, isValidNIK } from '@/utils/helpers'

const props = defineProps({
  currentStep: {
    type: Number,
    default: 1,
  },
})

const emit = defineEmits(['next', 'prev', 'complete'])

const authStore = useAuthStore()

// Form state
const form = reactive({
  nik: '',
  nama_lengkap: '',
  username: '',
  email: '',
  password: '',
  confirm_password: '',
  jenis_kelamin: 'L',
  tempat_lahir: '',
  tanggal_lahir: '',
  telepon: '',
  agama: '',
  pekerjaan: '',
})

// UI state
const showPassword = ref(false)
const loading = computed(() => authStore.loading)
const authError = computed(() => authStore.error)
const today = ref(new Date().toISOString().split('T')[0])

// Validation errors
const errors = reactive({
  nik: '',
  nama_lengkap: '',
  username: '',
  email: '',
  password: '',
  confirm_password: '',
  jenis_kelamin: '',
  tanggal_lahir: '',
})

// Password strength calculation
const passwordStrength = computed(() => {
  if (!form.password) return { score: 0, label: 'Kosong' }

  let score = 0
  if (form.password.length >= 8) score++
  if (/[A-Z]/.test(form.password)) score++
  if (/[a-z]/.test(form.password)) score++
  if (/[0-9]/.test(form.password)) score++
  if (/[!@#$%^&*(),.?":{}|<>]/.test(form.password)) score++

  const labels = ['Sangat Lemah', 'Lemah', 'Sedang', 'Kuat', 'Sangat Kuat']
  return { score, label: labels[score] }
})

// Password rules
const passwordRules = computed(() => [
  { text: 'Minimal 8 karakter', valid: form.password?.length >= 8 },
  { text: 'Huruf besar (A-Z)', valid: /[A-Z]/.test(form.password) },
  { text: 'Huruf kecil (a-z)', valid: /[a-z]/.test(form.password) },
  { text: 'Angka (0-9)', valid: /[0-9]/.test(form.password) },
  { text: 'Karakter spesial', valid: /[!@#$%^&*(),.?":{}|<>]/.test(form.password) },
])

// Form validation
const isFormValid = computed(() => {
  return (
    form.nik &&
    form.nama_lengkap &&
    form.username &&
    form.password &&
    form.confirm_password &&
    form.jenis_kelamin &&
    passwordStrength.value.score >= 3 && // Minimal "Kuat"
    form.password === form.confirm_password
  )
})

// Watch for password confirmation
watch(
  () => form.confirm_password,
  () => {
    if (form.confirm_password && form.password !== form.confirm_password) {
      errors.confirm_password = 'Password tidak cocok'
    } else {
      errors.confirm_password = ''
    }
  },
)

// Clear field error
const clearFieldError = (field) => {
  errors[field] = ''
}

// Validate current step before next
const validateAndNext = () => {
  let isValid = true

  if (props.currentStep === 1) {
    // Validate NIK
    if (!form.nik.trim()) {
      errors.nik = 'NIK diperlukan'
      isValid = false
    } else if (!isValidNIK(form.nik)) {
      errors.nik = 'NIK harus 16 digit angka'
      isValid = false
    }

    // Validate nama lengkap
    if (!form.nama_lengkap.trim()) {
      errors.nama_lengkap = 'Nama lengkap diperlukan'
      isValid = false
    } else if (form.nama_lengkap.trim().length < 3) {
      errors.nama_lengkap = 'Nama minimal 3 karakter'
      isValid = false
    }

    // Validate jenis kelamin
    if (!form.jenis_kelamin) {
      errors.jenis_kelamin = 'Jenis kelamin diperlukan'
      isValid = false
    }

    // Validate tanggal lahir if provided
    if (form.tanggal_lahir) {
      const birthDate = new Date(form.tanggal_lahir)
      const today = new Date()
      const age = today.getFullYear() - birthDate.getFullYear()
      if (age < 17) {
        errors.tanggal_lahir = 'Usia minimal 17 tahun'
        isValid = false
      }
    }
  }

  if (props.currentStep === 2) {
    // Validate username
    if (!form.username.trim()) {
      errors.username = 'Username diperlukan'
      isValid = false
    } else if (form.username.trim().length < 3) {
      errors.username = 'Username minimal 3 karakter'
      isValid = false
    } else if (/\s/.test(form.username)) {
      errors.username = 'Username tidak boleh mengandung spasi'
      isValid = false
    }

    // Validate email if provided
    if (form.email && !isValidEmail(form.email)) {
      errors.email = 'Format email tidak valid'
      isValid = false
    }
  }

  if (isValid) {
    emit('next')
  }
}

// Handle final submission
const handleSubmit = async () => {
  // Validate all fields
  let isValid = true

  // NIK
  if (!form.nik.trim()) {
    errors.nik = 'NIK diperlukan'
    isValid = false
  } else if (!isValidNIK(form.nik)) {
    errors.nik = 'NIK harus 16 digit angka'
    isValid = false
  }

  // Nama lengkap
  if (!form.nama_lengkap.trim()) {
    errors.nama_lengkap = 'Nama lengkap diperlukan'
    isValid = false
  } else if (form.nama_lengkap.trim().length < 3) {
    errors.nama_lengkap = 'Nama minimal 3 karakter'
    isValid = false
  }

  // Username
  if (!form.username.trim()) {
    errors.username = 'Username diperlukan'
    isValid = false
  } else if (form.username.trim().length < 3) {
    errors.username = 'Username minimal 3 karakter'
    isValid = false
  } else if (/\s/.test(form.username)) {
    errors.username = 'Username tidak boleh mengandung spasi'
    isValid = false
  }

  // Email if provided
  if (form.email && !isValidEmail(form.email)) {
    errors.email = 'Format email tidak valid'
    isValid = false
  }

  // Password
  if (!form.password) {
    errors.password = 'Password diperlukan'
    isValid = false
  } else if (passwordStrength.value.score < 3) {
    errors.password = 'Password terlalu lemah'
    isValid = false
  }

  // Confirm password
  if (!form.confirm_password) {
    errors.confirm_password = 'Konfirmasi password diperlukan'
    isValid = false
  } else if (form.password !== form.confirm_password) {
    errors.confirm_password = 'Password tidak cocok'
    isValid = false
  }

  // Jenis kelamin
  if (!form.jenis_kelamin) {
    errors.jenis_kelamin = 'Jenis kelamin diperlukan'
    isValid = false
  }

  // Date of birth age validation
  if (form.tanggal_lahir) {
    const birthDate = new Date(form.tanggal_lahir)
    const today = new Date()
    const age = today.getFullYear() - birthDate.getFullYear()
    if (age < 17) {
      errors.tanggal_lahir = 'Usia minimal 17 tahun'
      isValid = false
    }
  }

  if (!isValid) return

  // Prepare data for API
  const userData = {
    nik: form.nik,
    nama_lengkap: form.nama_lengkap,
    username: form.username,
    password: form.password,
    jenis_kelamin: form.jenis_kelamin,
    tempat_lahir: form.tempat_lahir || undefined,
    tanggal_lahir: form.tanggal_lahir || undefined,
    telepon: form.telepon || undefined,
    agama: form.agama || undefined,
    pekerjaan: form.pekerjaan || undefined,
    status_perkawinan: 'BELUM_KAWIN',
  }

  // Add email if provided and valid
  if (form.email && isValidEmail(form.email)) {
    userData.email = form.email
  }

  // Call register action
  const result = await authStore.register(userData)

  if (result.success) {
    emit('complete')
  }
}
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

/* Smooth transitions */
input,
button,
select {
  transition: all 0.2s ease;
}

input:focus {
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

@media (max-width: 640px) {
  input,
  button,
  select {
    font-size: 16px !important;
  }
}
</style>
