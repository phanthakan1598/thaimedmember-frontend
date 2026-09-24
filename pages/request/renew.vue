<template>
  <v-container>
    <v-row class="pt-5">
      <v-col cols="12">
        <v-card>
          <v-card-title class="page-title">
            <strong>ต่ออายุบัตรสมาชิก / ขอบัตรสมาชิก</strong>
          </v-card-title><div class="pa-md-6 pa-3">
            <RequestRenewForm v-if="initialData" :value="initialData" @cancel="$router.push('/request')" @submit="confirmSubmit" />
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import RequestRenewForm from '~/components/RequestRenewForm.vue'
export default {
  name: 'RequestRenewPage',
  components: { RequestRenewForm },
  data () { return { initialData: null } },
  mounted () { this.fetchInitialData() },
  methods: {
    setUserToken () { const token = localStorage.getItem('accessTokenUser'); if (!token) { return false } this.$axios.setToken(token, 'Bearer'); return true },
    async fetchInitialData () { if (!this.setUserToken()) { await this.$router.replace('/login'); return } this.$Notiflix.loading(); try { const response = await this.$axios.$get('/requests/renew/form'); this.initialData = response.result } catch (error) { this.$Notiflix.remove(); await this.showError(error, 'ไม่สามารถดึงข้อมูลสำหรับยื่นคำร้องได้'); await this.$router.replace('/request'); return } this.$Notiflix.remove() },
    async confirmSubmit (form) { const confirm = await this.$swal({ icon: 'question', title: 'ยืนยันการบันทึกคำร้อง', text: 'กรุณาตรวจสอบข้อมูลก่อนยืนยัน', showCancelButton: true, confirmButtonText: 'ยืนยัน', cancelButtonText: 'ยกเลิก', confirmButtonColor: '#4fb24d' }); if (!confirm.isConfirmed) { return } this.$Notiflix.loading(); try { const data = new FormData(); data.append('data', JSON.stringify({ reason: form.reason, lostDate: form.lostDate, documentDeliveryMethod: form.documentDeliveryMethod })); Object.entries(form.evidences).forEach(([key, evidence]) => { if (evidence.status && evidence.file) { data.append(`evidences[${key}]`, evidence.file) } }); await this.$axios.$post('/requests/renew', data); this.$Notiflix.remove(); await this.$swal({ icon: 'success', title: 'บันทึกคำร้องเรียบร้อยแล้ว', confirmButtonText: 'ตกลง', confirmButtonColor: '#4fb24d' }); await this.$router.push('/request') } catch (error) { this.$Notiflix.remove(); await this.showError(error, 'ไม่สามารถบันทึกคำร้องได้') } },
    showError (error, title) { return this.$swal({ icon: 'error', title, text: error.response?.data?.message || 'กรุณาลองใหม่อีกครั้ง', confirmButtonText: 'ปิด', confirmButtonColor: '#327531' }) }
  }
}
</script>
<style scoped>.page-title { background-color: #3d8f6a; color: #fff; font-size: 26px; font-weight: bold; border-radius: 12px 12px 0 0; }</style>
