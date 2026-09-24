<template>
  <v-container>
    <v-row class="pt-5">
      <v-col class="col-MainContant" cols="12">
        <v-card v-if="request" class="request-card">
          <v-card-title class="request-header">
            <v-btn icon dark class="mr-2" @click="$router.push('/request')">
              <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
            <strong>รายละเอียดคำร้องสมัครสมาชิก</strong>
          </v-card-title>

          <v-card-text class="pa-md-6 pa-3">
            <v-row class="mb-2">
              <v-col cols="12" sm="6" md="3">
                <div class="summary-label">
                  เลขที่คำร้อง
                </div>
                <div class="summary-value">
                  {{ request.RefNo1 }}
                </div>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <div class="summary-label">
                  วันที่ยื่นคำร้อง
                </div>
                <div class="summary-value">
                  {{ request.createAt || '-' }}
                </div>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <div class="summary-label">
                  สถานะการชำระเงิน
                </div>
                <div class="summary-value">
                  {{ paymentStatus }}
                </div>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <div class="summary-label">
                  สถานะคำร้อง
                </div>
                <v-chip small :color="statusColor" dark>
                  {{ statusText }}
                </v-chip>
              </v-col>
            </v-row>

            <Step4View
              :value="form"
              :request-fee-details="request.feeDetails"
              :applicant-type="request.applicantType"
              readonly
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

export default {
  name: 'RequestRegisterDetailPage',
  data () {
    return {
      request: null,
      form: {}
    }
  },
  computed: {
    displayStatus () {
      if (this.request.paymentRequired && this.request.PayStatus === '*') {
        return 'waiting_payment'
      }
      if (this.request.status === 'pending') {
        return 'waiting_document'
      }
      return this.request.status
    },
    statusText () {
      return {
        waiting_payment: 'รอชำระเงิน',
        waiting_document: 'รอรับเอกสาร',
        reviewing: 'กำลังตรวจสอบ',
        approved: 'อนุมัติแล้ว',
        rejected: 'ไม่อนุมัติ',
        cancelled: 'ยกเลิก'
      }[this.displayStatus] || '-'
    },
    statusColor () {
      return {
        waiting_payment: 'red darken-1',
        waiting_document: 'orange darken-1',
        reviewing: 'blue darken-1',
        approved: 'green darken-1',
        rejected: 'red darken-1',
        cancelled: 'grey darken-1'
      }[this.displayStatus] || 'grey'
    },
    paymentStatus () {
      if (!this.request.paymentRequired) { return 'ไม่มีค่าธรรมเนียม' }
      return this.request.PayStatus === '*' ? 'ยังไม่ชำระเงิน' : 'ชำระเงินแล้ว'
    }
  },
  mounted () {
    this.fetchRequest()
  },
  methods: {
    async fetchRequest () {
      const token = localStorage.getItem('accessTokenUser')
      if (!token) {
        await this.$router.replace('/login')
        return
      }

      this.$axios.setToken(token, 'Bearer')
      this.$Notiflix.loading()
      try {
        const response = await this.$axios.$get(`/requests/${this.$route.params.requestId}`)
        this.request = response.result
        this.form = this.buildForm(response.result)
      } catch (error) {
        this.$Notiflix.remove()
        await this.$swal({
          icon: 'error',
          title: 'ไม่สามารถดึงรายละเอียดคำร้องได้',
          text: error.response?.data?.message || 'ไม่พบคำร้องหรือท่านไม่มีสิทธิ์ดูข้อมูลนี้',
          confirmButtonText: 'ปิด',
          confirmButtonColor: '#327531'
        })
        await this.$router.replace('/request')
        return
      }
      this.$Notiflix.remove()
    },
    buildForm (request) {
      const details = request.details || {}
      return {
        ...details,
        idCard: request.CustomerID || details.CustomerID || '',
        profileImageUrl: request.profileImageUrl || '',
        documentDeliveryMethod: request.delivery?.method === 'ems' ? 'postal' : 'self_pickup',
        qualifications: details.qualifications || {},
        traineds: details.traineds || {},
        professions: details.professions || {},
        attachments: details.attachments || {},
        evidences: details.evidences || {},
        consents: details.consents || {},
        qualification_declarations: {
          thai_medicine: {
            status: false,
            data: {},
            ...(details.qualification_declarations?.thai_medicine || {})
          },
          thai_applied: {
            status: false,
            ...(details.qualification_declarations?.thai_applied || {})
          }
        }
      }
    }
  }
}
</script>

<style scoped>
.request-header { background-color: #3d8f6a; color: #fff; font-size: 26px; font-weight: bold; }
.summary-label { color: #424242; font-size: 20px; font-weight: bold; }
.summary-value { color: #327531; font-size: 20px; font-weight: bold; }
@media screen and (max-width: 600px) {
  .request-header { font-size: 22px; }
}
</style>
