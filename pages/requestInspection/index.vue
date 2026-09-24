<template>
  <v-container>
    <v-row class="pt-5">
      <v-col cols="12">
        <v-card>
          <v-card-title class="page-title">
            <strong>หนังสือรับรองการตรวจสอบใบอนุญาต</strong>
          </v-card-title><v-card-text class="py-8 px-md-10 px-4">
            <validation-observer ref="observer">
              <v-row align="start">
                <v-col cols="12" md="5">
                  <validation-provider v-slot="{ errors }" name="เลขบัตรประชาชน" rules="required|thaiID">
                    <v-text-field v-model="identity.CustomerID" label="เลขบัตรประชาชน" outlined maxlength="13" :error-messages="errors" />
                  </validation-provider>
                </v-col><v-col cols="12" md="5">
                  <validation-provider v-slot="{ errors }" name="เบอร์โทรศัพท์" rules="required|numeric|digits:10|noSpace">
                    <v-text-field v-model="identity.mobile" label="เบอร์โทรศัพท์" outlined maxlength="10" :error-messages="errors" />
                  </validation-provider>
                </v-col><v-col cols="12" md="2" class="d-flex align-start">
                  <v-btn block color="#4fb24d" dark class="check-button" @click="checkRequests">
                    ค้นหาคำร้อง
                  </v-btn>
                </v-col>
              </v-row>
            </validation-observer>

            <template v-if="checked && !applicant">
              <v-alert type="info" outlined class="mt-6">
                ยังไม่พบข้อมูลผู้ยื่น กรุณากรอกชื่อสำหรับยื่นคำร้องครั้งแรก
              </v-alert>
              <v-row>
                <v-col cols="12" sm="4">
                  <v-select v-model="newApplicant.prefixTh" :items="prefixesTh" label="คำนำหน้าภาษาไทย" outlined @change="syncPrefixTh" />
                </v-col><v-col cols="12" sm="4">
                  <v-text-field v-model="newApplicant.firstNameTh" label="ชื่อภาษาไทย" outlined />
                </v-col><v-col cols="12" sm="4">
                  <v-text-field v-model="newApplicant.lastNameTh" label="นามสกุลภาษาไทย" outlined />
                </v-col><v-col cols="12" sm="4">
                  <v-select v-model="newApplicant.prefixEn" :items="prefixesEn" label="คำนำหน้าภาษาอังกฤษ" outlined @change="syncPrefixEn" />
                </v-col><v-col cols="12" sm="4">
                  <v-text-field v-model="newApplicant.firstNameEn" label="ชื่อภาษาอังกฤษ" outlined />
                </v-col><v-col cols="12" sm="4">
                  <v-text-field v-model="newApplicant.lastNameEn" label="นามสกุลภาษาอังกฤษ" outlined />
                </v-col>
              </v-row>
              <div class="text-right">
                <v-btn color="#4fb24d" dark large @click="continueFirstRequest">
                  ยื่นคำร้อง
                </v-btn>
              </div>
            </template>

            <template v-if="checked && applicant">
              <div class="d-flex justify-space-between align-center flex-wrap mt-6 mb-4">
                <div class="applicant-name">
                  {{ fullName }}
                </div><div class="result-actions">
                  <v-btn outlined color="red darken-1" @click="confirmClearApplicant">
                    ออกจากรายการคำร้อง
                  </v-btn>
                  <v-btn color="#4fb24d" dark @click="openForm">
                    ยื่นคำร้องใหม่
                  </v-btn>
                </div>
              </div>
              <v-data-table :headers="headers" :items="requests" :items-per-page="itemsPerPage" :server-items-length="totalItems" hide-default-footer>
                <template #no-data>
                  <span>-- ไม่พบข้อมูล --</span>
                </template><template #[`item.index`]="{ index }">
                  {{ (currentPage - 1) * itemsPerPage + index + 1 }}
                </template><template #[`item.completedAt`]="{ item: row }">
                  {{ row.review && row.review.reviewedAt || '-' }}
                </template><template #[`item.status`]="{ item: row }">
                  <v-btn
                    v-if="displayStatus(row) === 'waiting_payment'"
                    small
                    rounded
                    color="red darken-1"
                    dark
                    @click="openPayment(row)"
                  >
                    รอชำระเงิน
                  </v-btn><v-chip v-else small :color="statusColor(row)" dark>
                    {{ statusText(row) }}
                  </v-chip>
                </template><template #[`item.delivery`]="{ item: row }">
                  {{ row.delivery && row.delivery.method === 'ems' ? 'จัดส่งทางไปรษณีย์' : 'รับด้วยตนเอง' }}
                </template><template #[`item.actions`]="{ item: row }">
                  <v-btn color="blue darken-1" icon title="ดูรายละเอียด" @click="openDetail(row)">
                    <v-icon>mdi-file-document-multiple-outline</v-icon>
                  </v-btn>
                </template>
              </v-data-table><v-pagination v-if="totalPages > 1" v-model="currentPage" :length="totalPages" color="#3d8f6a" @input="checkRequests(false)" />
            </template>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  name: 'RequestInspectionLookupPage',
  data () { return { identity: { CustomerID: '', mobile: '' }, newApplicant: { prefixTh: '', firstNameTh: '', lastNameTh: '', prefixEn: '', firstNameEn: '', lastNameEn: '' }, applicant: null, requests: [], checked: false, currentPage: 1, itemsPerPage: 10, totalItems: 0, totalPages: 0, prefixesTh: ['นาย', 'นาง', 'นางสาว'], prefixesEn: ['Mr.', 'Mrs.', 'Miss'], headers: [{ text: 'ลำดับ', value: 'index', sortable: false }, { text: 'เลขที่คำร้อง', value: 'RefNo1', sortable: false }, { text: 'ประเภทคำร้อง', value: 'typeName', sortable: false }, { text: 'วันที่ยื่นขอ', value: 'createAt', sortable: false }, { text: 'วันที่สำเร็จ', value: 'completedAt', sortable: false }, { text: 'สถานะ', value: 'status', sortable: false }, { text: 'วิธีรับเอกสาร', value: 'delivery', sortable: false }, { text: 'จัดการ', value: 'actions', sortable: false }] } },
  computed: { fullName () { return [this.applicant?.prefixTh, this.applicant?.firstNameTh, this.applicant?.lastNameTh].filter(Boolean).join(' ') } },
  mounted () {
    if (localStorage.getItem('accessTokenUser')) { this.$router.replace('/requestInspection/form'); return }
    const stored = sessionStorage.getItem('inspectionApplicant')
    if (stored) {
      try { const data = JSON.parse(stored); this.identity = { CustomerID: data.CustomerID || '', mobile: data.mobile || '' }; this.$nextTick(() => this.checkRequests()) } catch {}
    }
  },
  methods: {
    async checkRequests (resetPage = true) { if (!(await this.$refs.observer.validate())) { return } if (resetPage) { this.currentPage = 1 } this.$Notiflix.loading(); try { const response = await this.$axios.$post('/inspection/check', { ...this.identity, page: this.currentPage, limit: this.itemsPerPage }); const result = response.result || {}; this.requests = result.items || []; this.totalItems = result.totalItems || 0; this.totalPages = result.totalPages || 0; this.applicant = result.applicant || null; this.checked = true; if (this.applicant) { this.storeApplicant() } if (this.applicant && !this.totalItems) { this.openForm() } } catch (error) { this.$Notiflix.remove(); await this.showError(error); return } this.$Notiflix.remove() },
    continueFirstRequest () { if (Object.values(this.newApplicant).some(value => !String(value || '').trim())) { this.$swal({ icon: 'warning', title: 'กรุณากรอกชื่อภาษาไทยและภาษาอังกฤษให้ครบถ้วน', confirmButtonColor: '#327531' }); return } this.applicant = { ...this.newApplicant }; this.openForm() },
    storeApplicant () { sessionStorage.setItem('inspectionApplicant', JSON.stringify({ ...this.identity, applicant: this.applicant })) },
    openForm () { this.storeApplicant(); this.$router.push('/requestInspection/form') },
    openDetail (item) { this.storeApplicant(); this.$router.push(`/requestInspection/${item._id}`) },
    openPayment (item) { this.storeApplicant(); this.$router.push(`/payment/${item._id}`) },
    async confirmClearApplicant () {
      const confirm = await this.$swal({ icon: 'question', title: 'ออกจากรายการคำร้อง', text: 'ท่านต้องกรอกเลขบัตรประชาชนและเบอร์โทรศัพท์ใหม่เพื่อดูรายการอีกครั้ง', showCancelButton: true, confirmButtonText: 'ยืนยัน', cancelButtonText: 'ยกเลิก', confirmButtonColor: '#d32f2f' })
      if (!confirm.isConfirmed) { return }
      sessionStorage.removeItem('inspectionApplicant')
      this.identity = { CustomerID: '', mobile: '' }
      this.newApplicant = { prefixTh: '', firstNameTh: '', lastNameTh: '', prefixEn: '', firstNameEn: '', lastNameEn: '' }
      this.applicant = null
      this.requests = []
      this.checked = false
      this.currentPage = 1
      this.totalItems = 0
      this.totalPages = 0
      this.$nextTick(() => this.$refs.observer?.reset())
    },
    syncPrefixTh (value) { this.newApplicant.prefixEn = { นาย: 'Mr.', นาง: 'Mrs.', นางสาว: 'Miss' }[value] || '' },
    syncPrefixEn (value) { this.newApplicant.prefixTh = { 'Mr.': 'นาย', 'Mrs.': 'นาง', Miss: 'นางสาว' }[value] || '' },
    displayStatus (item) { if (item.paymentRequired && item.PayStatus === '*') { return 'waiting_payment' } if (item.status === 'pending') { return 'waiting_document' } return item.status },
    statusText (item) { return { waiting_payment: 'รอชำระเงิน', waiting_document: 'รอรับเอกสาร', reviewing: 'กำลังตรวจสอบ', approved: 'อนุมัติแล้ว', rejected: 'ไม่อนุมัติ', cancelled: 'ยกเลิก' }[this.displayStatus(item)] || '-' },
    statusColor (item) { return { waiting_payment: 'red darken-1', waiting_document: 'orange darken-1', reviewing: 'blue darken-1', approved: 'green darken-1', rejected: 'red darken-1', cancelled: 'grey darken-1' }[this.displayStatus(item)] || 'grey' },
    showError (error) { return this.$swal({ icon: 'error', title: 'ไม่สามารถตรวจสอบข้อมูลได้', text: error.response?.data?.message || 'กรุณาลองใหม่อีกครั้ง', confirmButtonText: 'ปิด', confirmButtonColor: '#327531' }) }
  }
}
</script>
<style scoped>.page-title { background-color: #3d8f6a; color: #fff; font-size: 26px; }.applicant-name { color: #327531; font-size: 22px; font-weight: bold; }.check-button { height: 56px !important; }.result-actions { display: flex; flex-wrap: wrap; gap: 10px; } @media screen and (max-width: 600px) { .result-actions { width: 100%; margin-top: 12px; } .result-actions .v-btn { flex: 1 1 100%; margin: 0; } }</style>
