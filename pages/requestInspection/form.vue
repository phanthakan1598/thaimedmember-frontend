<template>
  <v-container>
    <v-row class="pt-5">
      <v-col cols="12">
        <v-card>
          <v-card-title class="page-title">
            <strong>หนังสือรับรองการตรวจสอบใบอนุญาต</strong>
          </v-card-title><div class="pa-md-6 pa-3">
            <RequestInspectionForm v-if="initialData" :value="initialData" :is-public="isPublic" @cancel="$router.push(isPublic ? '/requestInspection' : '/request')" @submit="confirmSubmit" />
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import RequestInspectionForm from '~/components/RequestInspectionForm.vue'
export default {
  name: 'RequestInspectionFormPage',
  components: { RequestInspectionForm },
  data () { return { initialData: null, isPublic: true, identity: null } },
  mounted () { this.loadForm() },
  methods: {
    async loadForm () { const token = localStorage.getItem('accessTokenUser'); if (token) { this.isPublic = false; this.$axios.setToken(token, 'Bearer'); this.$Notiflix.loading(); try { const response = await this.$axios.$get('/requests/inspection/form'); this.initialData = response.result } catch (error) { this.$Notiflix.remove(); await this.showError(error, 'ไม่สามารถดึงข้อมูลสำหรับยื่นคำร้องได้'); await this.$router.replace('/request'); return } this.$Notiflix.remove(); return } const stored = sessionStorage.getItem('inspectionApplicant'); if (!stored) { await this.$router.replace('/requestInspection'); return } try { this.identity = JSON.parse(stored); this.initialData = { CustomerID: this.identity.CustomerID, mobile: this.identity.mobile, applicant: this.identity.applicant || {}, documentAddress: {} } } catch { await this.$router.replace('/requestInspection') } },
    async confirmSubmit (form) { const confirm = await this.$swal({ icon: 'question', title: 'ยืนยันการบันทึกคำร้อง', text: 'กรุณาตรวจสอบข้อมูลก่อนยืนยัน', showCancelButton: true, confirmButtonText: 'ยืนยัน', cancelButtonText: 'ยกเลิก', confirmButtonColor: '#4fb24d' }); if (!confirm.isConfirmed) { return } this.$Notiflix.loading(); try { const data = new FormData(); const base = { workplaceType: form.workplaceType, workplaceName: form.workplaceName, professions: form.professions, documentDeliveryMethod: form.documentDeliveryMethod, documentAddress: form.documentAddress }; if (this.isPublic) { Object.assign(base, { CustomerID: this.identity.CustomerID, mobile: this.identity.mobile, ...(this.identity.applicant || {}) }) } data.append('data', JSON.stringify(base)); Object.entries(form.evidences).forEach(([key, evidence]) => { if (evidence.status && evidence.file) { data.append(`evidences[${key}]`, evidence.file) } }); await this.$axios.$post(this.isPublic ? '/inspection/submit' : '/requests/inspection', data); this.$Notiflix.remove(); await this.$swal({ icon: 'success', title: 'บันทึกคำร้องเรียบร้อยแล้ว', confirmButtonText: 'ตกลง', confirmButtonColor: '#4fb24d' }); await this.$router.push(this.isPublic ? '/requestInspection' : '/request') } catch (error) { this.$Notiflix.remove(); await this.showError(error, 'ไม่สามารถบันทึกคำร้องได้') } },
    showError (error, title) { return this.$swal({ icon: 'error', title, text: error.response?.data?.message || 'กรุณาลองใหม่อีกครั้ง', confirmButtonText: 'ปิด', confirmButtonColor: '#327531' }) }
  }
}
</script>
<style scoped>.page-title { background-color: #3d8f6a; color: #fff; font-size: 26px; font-weight: bold; }</style>
