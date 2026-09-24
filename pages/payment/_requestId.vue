<template>
  <v-container>
    <v-row class="py-5" justify="center">
      <v-col class="col-MainContant" cols="12" lg="10">
        <v-card v-if="request" class="payment-card">
          <v-card-title class="payment-header">
            <v-btn icon dark class="mr-2" @click="$router.push(backPath)">
              <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
            <strong>ชำระค่าธรรมเนียม</strong>
          </v-card-title>

          <v-card-text class="pa-md-8 pa-4">
            <v-row>
              <v-col cols="12" sm="6">
                <div class="detail-label">
                  เลขที่คำร้อง
                </div>
                <div class="detail-value">
                  {{ request.RefNo1 || '-' }}
                </div>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="detail-label">
                  ประเภทคำร้อง
                </div>
                <div class="detail-value">
                  {{ request.typeName || '-' }}
                </div>
              </v-col>
            </v-row>

            <v-divider class="my-5" />

            <h2 class="section-title mb-4">
              รายละเอียดค่าธรรมเนียม
            </h2>
            <v-simple-table class="fee-table">
              <template #default>
                <thead>
                  <tr>
                    <th>รายการ</th>
                    <th class="text-right">
                      ราคาต่อหน่วย
                    </th>
                    <th class="text-center">
                      จำนวน
                    </th>
                    <th class="text-right">
                      รวม
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in feeItems" :key="item.code">
                    <td>{{ item.name }}</td>
                    <td class="text-right">
                      {{ formatPrice(item.unitPrice) }}
                    </td>
                    <td class="text-center">
                      {{ item.quantity }}
                    </td>
                    <td class="text-right">
                      {{ formatPrice(item.amount) }}
                    </td>
                  </tr>
                  <tr v-if="!feeItems.length">
                    <td colspan="4" class="text-center">
                      ไม่มีรายการค่าธรรมเนียม
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>

            <div class="total-row mt-5">
              <span>ยอดชำระทั้งหมด</span>
              <span>{{ formatPrice(totalPrice) }} บาท</span>
            </div>

            <v-divider class="my-6" />

            <div class="qr-section text-center">
              <h2 class="section-title">
                สแกน QR Code เพื่อชำระเงิน
              </h2>
              <div class="mock-qr mx-auto my-4">
                <v-icon size="210" color="black">
                  mdi-qrcode
                </v-icon>
                <div class="mock-label">
                  DEMO
                </div>
              </div>
              <v-alert type="warning" outlined class="mock-warning mx-auto">
                QR Code ตัวอย่าง ยังไม่สามารถใช้ชำระเงินจริงได้
              </v-alert>
              <div class="qr-total">
                ยอดชำระ {{ formatPrice(totalPrice) }} บาท
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

export default {
  name: 'PaymentPage',
  data () {
    return {
      request: null
    }
  },
  computed: {
    backPath () {
      return localStorage.getItem('accessTokenUser') ? '/request' : '/requestInspection'
    },
    feeItems () {
      return this.request?.feeDetails?.items || []
    },
    totalPrice () {
      return this.request?.feeDetails?.total ?? this.request?.price ?? 0
    }
  },
  mounted () {
    this.fetchPaymentDetails()
  },
  methods: {
    async fetchPaymentDetails () {
      const token = localStorage.getItem('accessTokenUser')
      let requestCall
      if (token) {
        this.$axios.setToken(token, 'Bearer')
        requestCall = () => this.$axios.$get(`/requests/${this.$route.params.requestId}/payment`)
      } else {
        this.$axios.setToken(false)
        const identity = this.getPublicIdentity()
        if (!identity) {
          await this.$router.replace('/requestInspection')
          return
        }
        requestCall = () => this.$axios.$post(`/inspection/${this.$route.params.requestId}/payment`, identity)
      }

      this.$Notiflix.loading()
      try {
        const response = await requestCall()
        this.request = response.result
      } catch (error) {
        this.$Notiflix.remove()
        await this.$swal({
          icon: 'error',
          title: 'ไม่สามารถดึงข้อมูลชำระเงินได้',
          text: error.response?.data?.message || 'ไม่พบคำร้องหรือท่านไม่มีสิทธิ์ดูข้อมูลนี้',
          confirmButtonText: 'ปิด',
          confirmButtonColor: '#327531'
        })
        await this.$router.replace(this.backPath)
        return
      }
      this.$Notiflix.remove()
    },
    getPublicIdentity () {
      try {
        const data = JSON.parse(sessionStorage.getItem('inspectionApplicant') || '{}')
        return data.CustomerID && data.mobile
          ? { CustomerID: data.CustomerID, mobile: data.mobile }
          : null
      } catch {
        return null
      }
    },
    formatPrice (value) {
      return Number(value || 0).toLocaleString('th-TH', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    }
  }
}
</script>

<style scoped>
.payment-header { background-color: #3d8f6a; color: #fff; font-size: 26px; font-weight: bold; }
.detail-label { color: #424242; font-size: 20px; font-weight: bold; }
.detail-value { color: #327531; font-size: 22px; font-weight: bold; }
.section-title { color: #327531; font-size: 24px; font-weight: bold; }
.fee-table { border: 1px solid #e0e0e0; }
.fee-table th { font-size: 20px !important; font-weight: bold !important; }
.fee-table td { font-size: 20px !important; }
.total-row { display: flex; justify-content: space-between; color: #327531; font-size: 26px; font-weight: bold; }
.mock-qr { position: relative; width: 240px; height: 240px; display: flex; align-items: center; justify-content: center; border: 8px solid #fff; box-shadow: 0 0 0 1px #bdbdbd; background: #fff; }
.mock-label { position: absolute; padding: 4px 10px; color: #fff; background: #d32f2f; font-size: 18px; font-weight: bold; }
.mock-warning { max-width: 520px; font-size: 18px; }
.qr-total { color: #327531; font-size: 24px; font-weight: bold; }
@media screen and (max-width: 600px) {
  .payment-header { font-size: 22px; }
  .total-row { font-size: 21px; }
  .mock-qr { width: 210px; height: 210px; }
  .mock-qr .v-icon { font-size: 185px !important; }
}
</style>
