<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
    <!-- Hero Section dengan gradient yang sama dengan sidebar -->
    <div class="bg-gradient-to-br from-primary-600 to-primary-700 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div class="text-center max-w-3xl mx-auto">
          <!-- Icon dengan efek glow -->
          <div class="relative inline-block mb-6">
            <div class="absolute inset-0 bg-white rounded-full blur-xl opacity-30"></div>
            <div
              class="relative w-20 h-20 bg-white/20 backdrop-blur rounded-full flex items-center justify-center mx-auto"
            >
              <QuestionMarkCircleIcon class="w-10 h-10 text-white" />
            </div>
          </div>

          <h1 class="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">Pusat Bantuan</h1>
          <p class="text-lg text-white/90 max-w-2xl mx-auto">
            Temukan panduan, jawaban, dan dukungan untuk menggunakan aplikasi DesaKu dengan optimal
          </p>
        </div>

        <!-- Search Bar dengan desain glassmorphism -->
        <div class="max-w-2xl mx-auto mt-8">
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg
                class="h-5 w-5 text-white/60"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="search"
              v-model="searchQuery"
              placeholder="Cari pertanyaan atau panduan..."
              class="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
            />
          </div>
        </div>
      </div>

      <!-- Wave Divider -->
      <div class="relative h-8">
        <svg
          class="absolute bottom-0 w-full h-8 text-gray-50 fill-current"
          viewBox="0 0 1440 48"
          preserveAspectRatio="none"
        >
          <path
            d="M0 48h1440V0c-211.8 32-422.3 48-640 48C582.3 48 371.8 32 160 0 107.3 0 53.7 2.1 0 6.4V48z"
          />
        </svg>
      </div>
    </div>

    <!-- Quick Links Cards -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <router-link
          to="/bantuan/panduan"
          class="bg-white/80 backdrop-blur p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group"
        >
          <div
            class="w-12 h-12 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"
          >
            <BookOpenIcon class="w-6 h-6 text-primary-600" />
          </div>
          <h3 class="font-semibold text-gray-900">Panduan</h3>
          <p class="text-xs text-gray-500 mt-1">Cara menggunakan aplikasi</p>
        </router-link>

        <router-link
          to="/bantuan/faq"
          class="bg-white/80 backdrop-blur p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group"
        >
          <div
            class="w-12 h-12 bg-gradient-to-br from-green-50 to-green-100 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"
          >
            <ChatBubbleLeftIcon class="w-6 h-6 text-green-600" />
          </div>
          <h3 class="font-semibold text-gray-900">FAQ</h3>
          <p class="text-xs text-gray-500 mt-1">Pertanyaan umum</p>
        </router-link>

        <router-link
          to="/bantuan/kontak"
          class="bg-white/80 backdrop-blur p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group"
        >
          <div
            class="w-12 h-12 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"
          >
            <EnvelopeIcon class="w-6 h-6 text-purple-600" />
          </div>
          <h3 class="font-semibold text-gray-900">Kontak</h3>
          <p class="text-xs text-gray-500 mt-1">Hubungi support</p>
        </router-link>

        <router-link
          to="/bantuan/video"
          class="bg-white/80 backdrop-blur p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group"
        >
          <div
            class="w-12 h-12 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"
          >
            <PlayCircleIcon class="w-6 h-6 text-yellow-600" />
          </div>
          <h3 class="font-semibold text-gray-900">Video</h3>
          <p class="text-xs text-gray-500 mt-1">Tutorial video</p>
        </router-link>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Column - FAQ -->
        <div class="lg:col-span-2 space-y-6">
          <!-- FAQ Section dengan desain modern -->
          <div class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              <h2 class="text-lg font-semibold text-gray-900">Pertanyaan yang Sering Diajukan</h2>
            </div>
            <div class="divide-y divide-gray-100">
              <div
                v-for="(faq, index) in filteredFaqs"
                :key="index"
                class="p-6 hover:bg-gray-50 transition-colors"
              >
                <button
                  @click="toggleFaq(index)"
                  class="flex justify-between items-start w-full text-left"
                >
                  <span class="text-base font-medium text-gray-900">{{ faq.question }}</span>
                  <span class="ml-6 flex-shrink-0">
                    <div class="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                      <svg
                        class="w-4 h-4 text-gray-500 transform transition-transform duration-300"
                        :class="{ 'rotate-180': openFaqs.includes(index) }"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </span>
                </button>
                <div
                  v-show="openFaqs.includes(index)"
                  class="mt-4 text-gray-600 text-sm leading-relaxed animate-fadeIn"
                >
                  {{ faq.answer }}
                </div>
              </div>
            </div>
          </div>

          <!-- Video Tutorials -->
          <div class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              <h2 class="text-lg font-semibold text-gray-900">Video Tutorial</h2>
            </div>
            <div class="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                v-for="video in videoTutorials"
                :key="video.id"
                class="group cursor-pointer rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div class="relative aspect-video bg-gradient-to-br from-gray-700 to-gray-900">
                  <div class="absolute inset-0 flex items-center justify-center">
                    <div
                      class="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center group-hover:scale-110 transition-transform"
                    >
                      <PlayCircleIcon class="w-8 h-8 text-white" />
                    </div>
                  </div>
                </div>
                <div class="p-3 bg-white">
                  <h3 class="text-sm font-medium text-gray-900">{{ video.title }}</h3>
                  <p class="text-xs text-gray-500 mt-1">{{ video.duration }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column - Contact & Support -->
        <div class="space-y-6">
          <!-- Kontak Support dengan desain glassmorphism -->
          <div class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              <h2 class="text-lg font-semibold text-gray-900">Kontak Support</h2>
            </div>
            <div class="p-6 space-y-4">
              <div
                class="flex items-start space-x-4 group hover:bg-gray-50 p-3 rounded-xl transition-colors"
              >
                <div
                  class="w-10 h-10 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"
                >
                  <PhoneIcon class="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900">Telepon</p>
                  <p class="text-sm text-gray-600">(021) 1234-5678</p>
                  <p class="text-xs text-gray-500">Senin-Jumat, 08:00-16:00</p>
                </div>
              </div>

              <div
                class="flex items-start space-x-4 group hover:bg-gray-50 p-3 rounded-xl transition-colors"
              >
                <div
                  class="w-10 h-10 bg-gradient-to-br from-green-50 to-green-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"
                >
                  <EnvelopeIcon class="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900">Email</p>
                  <p class="text-sm text-gray-600">support@desaku.id</p>
                  <p class="text-xs text-gray-500">Respon 1x24 jam</p>
                </div>
              </div>

              <div
                class="flex items-start space-x-4 group hover:bg-gray-50 p-3 rounded-xl transition-colors"
              >
                <div
                  class="w-10 h-10 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"
                >
                  <ChatBubbleLeftIcon class="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900">WhatsApp</p>
                  <p class="text-sm text-gray-600">+62 812-3456-7890</p>
                  <p class="text-xs text-gray-500">Chat only</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Kantor Desa -->
          <div
            class="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-2xl shadow-lg overflow-hidden"
          >
            <div class="p-6">
              <div class="flex items-center space-x-3 mb-4">
                <div
                  class="w-10 h-10 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center"
                >
                  <MapPinIcon class="w-5 h-5 text-white" />
                </div>
                <h3 class="text-lg font-semibold">Kantor Desa</h3>
              </div>

              <p class="text-sm text-gray-300 mb-4">
                Jl. Raya Desa No. 123<br />
                Kecamatan, Kabupaten<br />
                Provinsi 12345
              </p>

              <div class="bg-white/10 backdrop-blur rounded-xl p-4">
                <p class="text-sm font-medium mb-3">Jam Pelayanan</p>
                <div class="space-y-2 text-sm text-gray-300">
                  <div class="flex justify-between">
                    <span>Senin - Kamis</span>
                    <span>08:00 - 15:00</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Jumat</span>
                    <span>08:00 - 11:30</span>
                  </div>
                  <div class="flex justify-between text-gray-500">
                    <span>Sabtu - Minggu</span>
                    <span>Libur</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Download Card dengan efek glassmorphism -->
          <div
            class="bg-gradient-to-br from-primary-600 to-primary-700 text-white rounded-2xl shadow-lg overflow-hidden"
          >
            <div class="p-6">
              <div class="flex items-center space-x-3 mb-4">
                <div
                  class="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center"
                >
                  <DocumentArrowDownIcon class="w-5 h-5 text-white" />
                </div>
                <h3 class="text-lg font-semibold">Panduan Lengkap</h3>
              </div>

              <p class="text-sm text-white/80 mb-4">
                Download panduan penggunaan aplikasi dalam format PDF
              </p>

              <button
                class="w-full bg-white text-primary-600 py-3 px-4 rounded-xl font-medium hover:bg-gray-100 transition-all duration-300 flex items-center justify-center group"
              >
                <DocumentArrowDownIcon
                  class="w-5 h-5 mr-2 group-hover:scale-110 transition-transform"
                />
                Download PDF (2.5 MB)
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Hubungi Kami Section -->
      <div
        class="mt-12 bg-gradient-to-r from-primary-50 to-primary-100 rounded-2xl p-8 text-center border border-primary-200"
      >
        <h2 class="text-xl font-semibold text-gray-900 mb-2">Masih Ada Pertanyaan?</h2>
        <p class="text-gray-600 mb-6 max-w-2xl mx-auto">
          Tim support kami siap membantu Anda. Hubungi kami melalui kontak di atas atau kirim pesan
          langsung.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            class="bg-primary-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center"
          >
            <EnvelopeIcon class="w-5 h-5 mr-2" />
            Kirim Pesan
          </button>
          <button
            class="bg-white text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-50 transition-all duration-300 border border-gray-200 flex items-center justify-center"
          >
            <ChatBubbleLeftIcon class="w-5 h-5 mr-2" />
            Live Chat
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  QuestionMarkCircleIcon,
  BookOpenIcon,
  ChatBubbleLeftIcon,
  EnvelopeIcon,
  PlayCircleIcon,
  PhoneIcon,
  MapPinIcon,
  DocumentArrowDownIcon,
} from '@heroicons/vue/24/outline'

const searchQuery = ref('')
const openFaqs = ref([])

// Data FAQ
const faqs = [
  {
    question: 'Bagaimana cara mendaftar sebagai kepala keluarga?',
    answer:
      'Untuk mendaftar sebagai kepala keluarga, kunjungi halaman Registrasi dan isi formulir dengan data yang diperlukan seperti NIK, nama lengkap, dan data pendukung lainnya. Setelah submit, akun akan diverifikasi oleh admin desa dalam 1-2 hari kerja.',
  },
  {
    question: 'Bagaimana cara mengajukan bansos?',
    answer:
      'Login ke aplikasi, buka menu "Bantuan Sosial", pilih program bansos yang tersedia, dan klik tombol "Ajukan". Isi alasan pengajuan dan upload dokumen pendukung jika diperlukan. Pengajuan akan diproses oleh admin.',
  },
  {
    question: 'Berapa lama proses verifikasi akun?',
    answer:
      'Proses verifikasi akun biasanya memakan waktu 1-2 hari kerja. Admin desa akan memeriksa kelengkapan data Anda. Notifikasi akan dikirim setelah akun terverifikasi.',
  },
  {
    question: 'Apa yang harus dilakukan jika lupa password?',
    answer:
      'Klik link "Lupa Password" pada halaman login. Masukkan email atau username Anda, dan ikuti petunjuk untuk mereset password melalui email yang terdaftar.',
  },
  {
    question: 'Bagaimana cara mengecek status pengajuan bansos?',
    answer:
      'Status pengajuan bansos dapat dicek di menu "Pengajuan Saya". Status akan diperbarui secara berkala: Menunggu → Diproses → Diterima/Ditolak.',
  },
  {
    question: 'Dokumen apa saja yang diperlukan untuk mengajukan bansos?',
    answer:
      'Dokumen yang diperlukan umumnya adalah KTP, Kartu Keluarga, dan surat keterangan tidak mampu dari RT/RW setempat. Untuk program tertentu mungkin memerlukan dokumen tambahan.',
  },
]

// Data video tutorial
const videoTutorials = [
  {
    id: 1,
    title: 'Cara Registrasi Akun',
    duration: '3:45 menit',
  },
  {
    id: 2,
    title: 'Mengajukan Bansos Online',
    duration: '5:20 menit',
  },
  {
    id: 3,
    title: 'Mengelola Profil Keluarga',
    duration: '4:15 menit',
  },
  {
    id: 4,
    title: 'Tips Verifikasi Cepat',
    duration: '2:50 menit',
  },
]

// Filter FAQ berdasarkan pencarian
const filteredFaqs = computed(() => {
  if (!searchQuery.value) return faqs
  const query = searchQuery.value.toLowerCase()
  return faqs.filter(
    (faq) => faq.question.toLowerCase().includes(query) || faq.answer.toLowerCase().includes(query),
  )
})

// Toggle FAQ
const toggleFaq = (index) => {
  if (openFaqs.value.includes(index)) {
    openFaqs.value = openFaqs.value.filter((i) => i !== index)
  } else {
    openFaqs.value.push(index)
  }
}
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}

.rotate-180 {
  transform: rotate(180deg);
}

/* Glassmorphism effect */
.backdrop-blur {
  backdrop-filter: blur(8px);
}

/* Smooth transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
