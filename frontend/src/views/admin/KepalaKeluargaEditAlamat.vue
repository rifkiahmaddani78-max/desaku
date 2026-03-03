<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usersService } from '@/services/users'
import { wilayahService } from '@/services/wilayah'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'

const route = useRoute()
const router = useRouter()
const userId = route.params.id

const loading = ref(true)
const submitting = ref(false)
const dusunList = ref([])

const form = ref({
  dusun_id: '',
  rw_id: '',
  rt_id: '',
  alamat_lengkap: '',
})

/* ======================
   AUTO-LOAD ALAMAT LAMA
====================== */
function loadAlamatLama(detail) {
  form.value.alamat_lengkap = detail.alamat_lengkap || ''

  // 1️⃣ cari dusun yang cocok
  const dusun = dusunList.value.find((d) => d.nama_dusun === detail.nama_dusun)
  if (dusun) {
    form.value.dusun_id = dusun.id

    // 2️⃣ cari RW yang cocok
    const rw = dusun.rw_list.find((r) => r.nomor_rw === detail.nomor_rw)
    if (rw) {
      form.value.rw_id = rw.id

      // 3️⃣ cari RT yang cocok
      const rt = rw.rt_list.find((rt) => rt.nomor_rt === detail.nomor_rt)
      if (rt) {
        form.value.rt_id = rt.id
      }
    }
  }
}

/* ======================
   COMPUTED HIERARCHY
====================== */
const rwList = computed(() => {
  const dusun = dusunList.value.find((d) => d.id === form.value.dusun_id)
  return dusun ? dusun.rw_list : []
})

const rtList = computed(() => {
  const rw = rwList.value.find((r) => r.id === form.value.rw_id)
  return rw ? rw.rt_list : []
})

/* ======================
   LOAD DATA
====================== */
onMounted(async () => {
  loading.value = true
  try {
    // 1️⃣ Ambil dusun/rw/rt dari server
    const wilayahRes = await wilayahService.getHierarchy()
    dusunList.value = wilayahRes.data || []

    // 2️⃣ Ambil detail kepala keluarga
    const detailRes = await usersService.getDetailKepalaKeluarga(userId)
    const data = detailRes.data

    if (data) {
      loadAlamatLama(data)
    }

    if (!data) {
      console.warn('Data kepala keluarga kosong')
      return // Jangan throw, biarkan form kosong
    }

    // 3️⃣ Mapping alamat lama (jika ada)
    form.value.alamat_lengkap = data.alamat_lengkap || ''

    // Cari dusun
    const dusun = dusunList.value.find((d) => d.nama_dusun === data.nama_dusun)
    if (dusun) {
      form.value.dusun_id = dusun.id

      // Cari RW
      const rw = dusun.rw_list.find((r) => r.nomor_rw === data.nomor_rw)
      if (rw) {
        form.value.rw_id = rw.id

        // Cari RT
        const rt = rw.rt_list.find((rt) => rt.nomor_rt === data.nomor_rt)
        if (rt) form.value.rt_id = rt.id
      }
    }
  } catch (err) {
    console.error('Error loading alamat:', err)
    alert('Gagal memuat data alamat: ' + (err.message || 'Terjadi kesalahan'))
  } finally {
    loading.value = false
  }
})

/* ======================
   SUBMIT
====================== */
const handleSubmit = async () => {
  submitting.value = true
  try {
    const res = await usersService.updateAlamat(userId, form.value)
    if (res.success) {
      alert('Alamat berhasil diperbarui')
      router.push(`/admin/kepala-keluarga/${userId}`)
    } else {
      alert(res.message || 'Gagal memperbarui alamat')
    }
  } catch (err) {
    alert('Gagal memperbarui alamat: ' + (err.message || 'Terjadi kesalahan'))
  } finally {
    submitting.value = false
  }
}

/* ======================
   WATCHERS
====================== */
watch(
  () => form.value.dusun_id,
  () => {
    form.value.rw_id = ''
    form.value.rt_id = ''
  },
)

watch(
  () => form.value.rw_id,
  () => {
    form.value.rt_id = ''
  },
)
</script>

<template>
  <Card class="max-w-3xl mx-auto p-6">
    <h2 class="text-xl font-semibold mb-6">Edit Alamat</h2>

    <div v-if="loading" class="text-center py-10">Memuat data wilayah...</div>

    <form v-else @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Dusun -->
      <div>
        <label class="block text-sm font-medium mb-1">Dusun</label>
        <select v-model="form.dusun_id" class="input-field">
          <option value="">Pilih Dusun</option>
          <option v-for="d in dusunList" :key="d.id" :value="d.id">
            {{ d.nama_dusun }}
          </option>
        </select>
      </div>

      <!-- RW -->
      <div>
        <label class="block text-sm font-medium mb-1">RW</label>
        <select v-model="form.rw_id" class="input-field" :disabled="!form.dusun_id">
          <option value="">Pilih RW</option>
          <option v-for="rw in rwList" :key="rw.id" :value="rw.id">RW {{ rw.nomor_rw }}</option>
        </select>
      </div>

      <!-- RT -->
      <div>
        <label class="block text-sm font-medium mb-1">RT</label>
        <select v-model="form.rt_id" class="input-field" :disabled="!form.rw_id">
          <option value="">Pilih RT</option>
          <option v-for="rt in rtList" :key="rt.id" :value="rt.id">RT {{ rt.nomor_rt }}</option>
        </select>
      </div>

      <!-- Alamat Lengkap -->
      <div>
        <label class="block text-sm font-medium mb-1">Alamat Lengkap</label>
        <textarea
          v-model="form.alamat_lengkap"
          rows="3"
          class="input-field"
          placeholder="Contoh: Jl. Mawar No. 10"
        />
      </div>

      <div class="flex justify-end space-x-3">
        <Button type="button" variant="outline" @click="router.back()"> Batal </Button>
        <Button type="submit" :loading="submitting"> Simpan </Button>
      </div>
    </form>
  </Card>
</template>

<style scoped>
.input-field {
  @apply block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-colors duration-200;
}
</style>
