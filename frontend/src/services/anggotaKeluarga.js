import api from './api'

export const anggotaKeluargaService = {
  // Anggota Keluarga - Daftar
  async getAnggotaKeluargaList() {
    try {
      const res = await api.get('anggota-keluarga')
      return res.data.data
    } catch (error) {
      throw error.response?.data || { message: 'Gagal mengambil data anggota keluarga' }
    }
  },

  // Anggota Keluarga - Tambah
  async createAnggotaKeluarga(payload) {
    try {
      const res = await api.post('anggota-keluarga', payload)
      return res.data
    } catch (error) {
      throw error.response?.data || { message: 'Gagal menambahkan anggota keluarga' }
    }
  },

  // Anggota Keluarga - Edit
  async updateAnggotaKeluarga(id, payload) {
    try {
      const res = await api.put(`/anggota-keluarga/${id}`, payload)
      return res.data
    } catch (error) {
      throw error.response?.data || { message: 'Gagal mengupdate data' }
    }
  },

  // Anggota Keluarga - Detail
  async getDetailAnggotaKeluarga(id) {
    const res = await api.get(`/anggota-keluarga/${id}`)
    return res.data.data
  },

  // Anggota Keluarga - Hapus
  async deleteAnggotaKeluarga(id) {
    try {
      const res = await api.delete(`/anggota-keluarga/${id}`)
      return res.data
    } catch (error) {
      throw error.response?.data || { message: 'Gagal menghapus data' }
    }
  },

  // Anggota Keluarga - Bedasarkan Kepala
  async getByKepalaKeluargaId(kepalaKeluargaId) {
    try {
      const response = await api.get('/anggota-keluarga', {
        params: {
          kepala_keluarga_id: kepalaKeluargaId,
        },
      })

      return response.data.data || []
    } catch (error) {
      throw error.response?.data || error
    }
  },
}
