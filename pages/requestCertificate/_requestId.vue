<template>
  <v-container>
    <v-row class="pt-5">
      <v-col cols="12">
        <v-card v-if="request">
          <v-card-title class="request-header">
            <v-btn icon dark class="mr-2" @click="$router.push('/request')">
              <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
            <strong>รายละเอียดคำร้องขอหนังสือรับรองการขึ้นทะเบียน</strong>
          </v-card-title>

          <div class="pa-md-6 pa-3">
            <v-row class="mb-2">
              <v-col v-for="item in summaries" :key="item.label" cols="12" sm="6" md="3">
                <div class="summary-label">
                  {{ item.label }}
                </div>
                <v-chip v-if="item.chip" small :color="statusColor" dark>
                  {{ item.value }}
                </v-chip>
                <div v-else class="summary-value">
                  {{ item.value }}
                </div>
              </v-col>
            </v-row>

            <v-divider class="my-5" />
            <section>
              <h2>ด้านวิชาชีพที่ขอหนังสือรับรอง</h2>
              <v-card outlined class="pa-4 mt-3">
                <div v-for="item in licenseItems" :key="item.professionType" class="detail-row">
                  <v-icon color="#4fb24d" class="mr-2">
                    mdi-check-circle
                  </v-icon>
                  <div>
                    <strong>{{ professionLabel(item.professionType) }}</strong>
                    <div>เลขใบอนุญาต {{ item.licenseNumber || '-' }}</div>
                  </div>
                </div>
                <div v-if="!licenseItems.length" class="grey--text">
                  ไม่พบข้อมูลใบอนุญาต
                </div>
              </v-card>
            </section>

            <v-divider class="my-5" />
            <section>
              <h2>รายละเอียดการขอหนังสือรับรอง</h2>
              <v-card outlined class="pa-4 mt-3 detail-text">
                <div><strong>จำนวน:</strong> {{ request.details && request.details.quantity || 0 }} ฉบับ</div>
                <div class="mt-2">
                  <strong>ใช้เพื่อ:</strong> {{ purposeText }}
                </div>
              </v-card>
            </section>

            <v-divider class="my-5" />
            <section>
              <h2>หลักฐานประกอบการพิจารณา</h2>
              <v-card outlined class="pa-4 mt-3">
                <div v-for="item in evidenceItems" :key="item.key" class="detail-row justify-space-between">
                  <span><v-icon color="#4fb24d" class="mr-2">mdi-file-document-check</v-icon>{{ item.label }}</span>
                  <v-btn
                    v-if="item.url"
                    :href="item.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    text
                    color="#327531"
                  >
                    เปิดไฟล์
                  </v-btn>
                </div>
                <div v-if="!evidenceItems.length" class="grey--text">
                  ไม่พบเอกสารแนบ
                </div>
              </v-card>
            </section>

            <v-divider class="my-5" />
            <section>
              <h2>วิธีการรับเอกสาร</h2>
              <v-card outlined class="pa-4 mt-3 detail-text">
                <div>{{ deliveryText }}</div>
                <div v-if="request.delivery && request.delivery.method === 'ems'" class="mt-2">
                  {{ documentAddressText }}
                </div>
              </v-card>
            </section>

            <v-divider class="my-5" />
            <section>
              <h2>สรุปค่าธรรมเนียม</h2>
              <v-card outlined class="pa-4 mt-3 fee-summary">
                <div v-for="item in feeItems" :key="item.code" class="d-flex justify-space-between fee-row">
                  <span>{{ item.name }}<span v-if="item.quantity > 1"> ({{ item.quantity }} ฉบับ)</span></span>
                  <span>{{ formatPrice(item.amount) }} บาท</span>
                </div>
                <v-divider class="my-3" />
                <div class="d-flex justify-space-between total-price">
                  <strong>รวม</strong><strong>{{ formatPrice(request.feeDetails && request.feeDetails.total) }} บาท</strong>
                </div>
              </v-card>
            </section>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

const professionLabels = {
  thai_medicine: 'วิชาชีพการแพทย์แผนไทย ด้านเวชกรรมไทย',
  thai_pharmacy: 'วิชาชีพการแพทย์แผนไทย ด้านเภสัชกรรมไทย',
  thai_midwifery: 'วิชาชีพการแพทย์แผนไทย ด้านผดุงครรภ์ไทย',
  thai_massage: 'วิชาชีพการแพทย์แผนไทย ด้านนวดไทย',
  folk_medicine: 'วิชาชีพการแพทย์แผนไทย ด้านแพทย์พื้นบ้าน',
  thai_applied: 'วิชาชีพการแพทย์แผนไทยประยุกต์'
}
const evidenceLabels = {
  id_card: 'สำเนาบัตรประจำตัวประชาชนหรือเอกสารประจำตัว',
  residence: 'สำเนาทะเบียนบ้านหรือหลักฐานแสดงถิ่นที่อยู่',
  payment_receipt: 'สำเนาใบเสร็จรับเงินค่าธรรมเนียม',
  photo: 'ภาพถ่ายขนาด 1 นิ้ว'
}

export default {
  name: 'RequestCertificateDetailPage',
  data () {
    return { request: null }
  },
  computed: {
    displayStatus () {
      if (this.request.paymentRequired && this.request.PayStatus === '*') { return 'waiting_payment' }
      if (this.request.status === 'pending') { return 'waiting_document' }
      return this.request.status
    },
    statusText () {
      return { waiting_payment: 'รอชำระเงิน', waiting_document: 'รอรับเอกสาร', reviewing: 'กำลังตรวจสอบ', approved: 'อนุมัติแล้ว', rejected: 'ไม่อนุมัติ', cancelled: 'ยกเลิก' }[this.displayStatus] || '-'
    },
    statusColor () {
      return { waiting_payment: 'red darken-1', waiting_document: 'orange darken-1', reviewing: 'blue darken-1', approved: 'green darken-1', rejected: 'red darken-1', cancelled: 'grey darken-1' }[this.displayStatus] || 'grey'
    },
    summaries () {
      return [
        { label: 'เลขที่คำร้อง', value: this.request.RefNo1 || '-' },
        { label: 'วันที่ยื่นคำร้อง', value: this.request.createAt || '-' },
        { label: 'สถานะการชำระเงิน', value: this.request.PayStatus === '*' ? 'ยังไม่ชำระเงิน' : 'ชำระเงินแล้ว' },
        { label: 'สถานะคำร้อง', value: this.statusText, chip: true }
      ]
    },
    licenseItems () { return this.request.details?.licenseNumbers || [] },
    purposeText () {
      const purpose = this.request.details?.purpose || {}
      return { education: 'ศึกษาต่อ', work: 'ปฏิบัติงาน', other: purpose.other || 'อื่น ๆ' }[purpose.type] || '-'
    },
    evidenceItems () {
      return Object.entries(this.request.details?.evidences || {})
        .filter(([, value]) => value.status)
        .map(([key, value]) => ({ key, label: evidenceLabels[key] || key, url: value.file?.url || '' }))
    },
    deliveryText () { return this.request.delivery?.method === 'ems' ? 'จัดส่งทางไปรษณีย์' : 'จัดส่งเป็นไฟล์ทาง E-mail' },
    documentAddressText () {
      const address = this.request.details?.documentAddress || {}
      return [address.address, address.moo && `หมู่ ${address.moo}`, address.building, address.soi && `ซอย ${address.soi}`, address.road && `ถนน ${address.road}`, address.subdistrict, address.district, address.province, address.zipcode].filter(Boolean).join(' ') || '-'
    },
    feeItems () { return this.request.feeDetails?.items || [] }
  },
  mounted () { this.fetchRequest() },
  methods: {
    async fetchRequest () {
      const token = localStorage.getItem('accessTokenUser')
      if (!token) { await this.$router.replace('/login'); return }
      this.$axios.setToken(token, 'Bearer')
      this.$Notiflix.loading()
      try {
        const response = await this.$axios.$get(`/requests/certificate/${this.$route.params.requestId}`)
        this.request = response.result
      } catch (error) {
        this.$Notiflix.remove()
        await this.$swal({ icon: 'error', title: 'ไม่สามารถดึงรายละเอียดคำร้องได้', text: error.response?.data?.message || 'ไม่พบคำร้องหรือท่านไม่มีสิทธิ์ดูข้อมูลนี้', confirmButtonText: 'ปิด', confirmButtonColor: '#327531' })
        await this.$router.replace('/request')
        return
      }
      this.$Notiflix.remove()
    },
    professionLabel (type) { return professionLabels[type] || type },
    formatPrice (value) { return Number(value || 0).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }
  }
}
</script>

<style scoped>
.request-header { background-color: #3d8f6a; color: #fff; font-size: 26px; font-weight: bold; word-break: break-word; }
.summary-label { color: #424242; font-size: 20px; font-weight: bold; }
.summary-value { color: #327531; font-size: 20px; font-weight: bold; }
h2 { font-size: 24px; }
.detail-row { display: flex; align-items: flex-start; padding: 8px 0; font-size: 22px; }
.detail-text, .fee-row { font-size: 21px; }
.fee-row { padding: 5px 0; }
.total-price { color: #327531; font-size: 24px; }
@media screen and (max-width: 600px) {
  .request-header { font-size: 22px; }
  .detail-row, .detail-text, .fee-row { font-size: 19px; }
}
</style>
