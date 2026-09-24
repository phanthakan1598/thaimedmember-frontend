<template>
  <v-container>
    <v-row class="pt-5">
      <v-col class="col-MainContant" cols="12">
        <v-card>
          <v-card-title><strong>รายการคำร้องขอ</strong></v-card-title>
          <v-card-text class="py-8 px-md-10 px-4">
            <v-row class="mb-3" align="center">
              <v-col class="d-flex" cols="12" md="7">
                <v-text-field
                  v-model="search"
                  placeholder="ค้นหาเลขที่หรือประเภทคำร้อง"
                  single-line
                  hide-details
                  dense
                  outlined
                  clearable
                  @keyup.enter="searchRequests"
                />
                <v-btn color="#4fb24d" dark class="ml-2 search-button" @click="searchRequests">
                  ค้นหา
                </v-btn>
              </v-col>
              <v-col cols="12" md="5" class="d-flex align-center justify-md-end">
                <span class="mr-2">แสดง</span>
                <v-select
                  v-model="itemsPerPage"
                  :items="itemsPerPageOptions"
                  dense
                  outlined
                  hide-details
                  class="items-per-page"
                  @change="changeItemsPerPage"
                />
                <span class="ml-2">รายการ</span>
              </v-col>
            </v-row>

            <v-data-table
              :items="requests"
              :headers="headers"
              :items-per-page="itemsPerPage"
              :server-items-length="totalItems"
              hide-default-footer
            >
              <template #no-data>
                <span class="no-data">-- ไม่พบข้อมูล --</span>
              </template>
              <template #[`item.index`]="{ index }">
                {{ (currentPage - 1) * itemsPerPage + index + 1 }}
              </template>
              <template #[`item.createAt`]="{ item }">
                {{ formatDateTime(item.createAt) }}
              </template>
              <template #[`item.completedAt`]="{ item }">
                {{ formatDateTime(item.review && item.review.reviewedAt) }}
              </template>
              <template #[`item.status`]="{ item }">
                <v-btn
                  v-if="displayStatus(item) === 'waiting_payment'"
                  small
                  rounded
                  color="red darken-1"
                  dark
                  @click="openPayment(item)"
                >
                  รอชำระเงิน
                </v-btn>
                <v-chip v-else small :color="statusColor(item)" dark>
                  {{ statusText(item) }}
                </v-chip>
              </template>
              <template #[`item.delivery`]="{ item }">
                {{ deliveryText(item.delivery && item.delivery.method) }}
              </template>
              <template #[`item.actions`]="{ item }">
                <v-btn
                  color="blue darken-1"
                  icon
                  :disabled="!['01', '02', '03', '04', '05', '06', '07', '09'].includes(item.type)"
                  :title="['01', '02', '03', '04', '05', '06', '07', '09'].includes(item.type) ? 'ดูรายละเอียด' : 'อยู่ระหว่างพัฒนา'"
                  @click="showRequestDetail(item)"
                >
                  <v-icon>mdi-file-document-multiple-outline</v-icon>
                </v-btn>
              </template>
            </v-data-table>

            <v-row justify="center" class="mt-4">
              <v-pagination
                v-model="currentPage"
                :length="totalPages"
                :total-visible="7"
                color="#3d8f6a"
                @input="fetchRequests"
              />
            </v-row>

            <v-divider class="my-6" />

            <v-col cols="12" class="delivery-address">
              <div class="delivery-address__title">
                ที่อยู่สำหรับจัดส่งเอกสาร
              </div>
              <div class="delivery-address__line">
                <v-icon class="delivery-address__icon">
                  mdi-office-building
                </v-icon>
                <span>
                  สำนักงานสภาการแพทย์แผนไทย : 000/00 หมู่ 0 ถนน - ตำบล - อำเภอเมือง จังหวัด - 00000
                </span>
              </div>
              <div class="delivery-address__line">
                <v-icon class="delivery-address__icon">
                  mdi-phone
                </v-icon>
                <span>
                  โทรศัพท์: 0-0000-0000-0, โทรสาร: 0-0000-0000
                </span>
              </div>
            </v-col>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

export default {
  name: 'RequestPage',
  data () {
    return {
      requests: [],
      search: '',
      currentPage: 1,
      itemsPerPage: 10,
      totalItems: 0,
      totalPages: 0,
      itemsPerPageOptions: [10, 20, 50],
      headers: [
        { text: 'ลำดับ', value: 'index', sortable: false, width: '7%' },
        { text: 'เลขที่คำร้อง', value: 'RefNo1', sortable: false, width: '13%' },
        { text: 'ประเภทคำร้อง', value: 'typeName', sortable: false, width: '18%' },
        { text: 'วันที่ยื่นขอ', value: 'createAt', sortable: false, width: '14%' },
        { text: 'วันที่สำเร็จ', value: 'completedAt', sortable: false, width: '14%' },
        { text: 'สถานะ', value: 'status', sortable: false, width: '12%' },
        { text: 'วิธีรับเอกสาร', value: 'delivery', sortable: false, width: '14%' },
        { text: 'จัดการ', value: 'actions', sortable: false, width: '8%' }
      ]
    }
  },
  mounted () {
    this.fetchRequests()
  },
  methods: {
    async fetchRequests () {
      const token = localStorage.getItem('accessTokenUser')
      if (!token) {
        await this.$router.push('/login')
        return
      }

      this.$axios.setToken(token, 'Bearer')
      this.$Notiflix.loading()
      try {
        const response = await this.$axios.$get('/requests', {
          params: {
            page: this.currentPage,
            limit: this.itemsPerPage,
            search: this.search || undefined
          }
        })
        const result = response.result || {}
        this.requests = result.items || []
        this.totalItems = result.totalItems || 0
        this.totalPages = result.totalPages || 0
        this.currentPage = result.currentPage || 1
      } catch (error) {
        this.requests = []
        this.totalItems = 0
        this.totalPages = 0
        this.$Notiflix.remove()
        await this.$swal({
          icon: 'error',
          title: 'ไม่สามารถดึงข้อมูลคำร้องได้',
          text: error.response?.data?.message || 'กรุณาลองใหม่อีกครั้ง',
          confirmButtonText: 'ปิด',
          confirmButtonColor: '#327531'
        })
        return
      }
      this.$Notiflix.remove()
    },
    searchRequests () {
      this.currentPage = 1
      this.fetchRequests()
    },
    changeItemsPerPage () {
      this.currentPage = 1
      this.fetchRequests()
    },
    showRequestDetail (item) {
      if (item.type === '01') {
        this.$router.push(`/requestRegister/${item._id}`)
      } else if (item.type === '02') {
        this.$router.push(`/requestLicense/${item._id}`)
      } else if (item.type === '03') {
        this.$router.push(`/requestCertificate/${item._id}`)
      } else if (item.type === '04') {
        this.$router.push(`/requestReplacement/${item._id}`)
      } else if (item.type === '05') {
        this.$router.push(`/requestTranslation/${item._id}`)
      } else if (item.type === '06') {
        this.$router.push(`/requestEdit/${item._id}`)
      } else if (item.type === '07') {
        this.$router.push(`/requestRenew/${item._id}`)
      } else if (item.type === '09') {
        this.$router.push(`/requestInspection/${item._id}`)
      }
    },
    openPayment (item) {
      this.$router.push(`/payment/${item._id}`)
    },
    formatDateTime (value) {
      return value || '-'
    },
    displayStatus (item) {
      if (item.paymentRequired && item.PayStatus === '*') {
        return 'waiting_payment'
      }
      if (item.status === 'pending') {
        return 'waiting_document'
      }
      return item.status
    },
    statusText (item) {
      const status = this.displayStatus(item)
      return {
        waiting_payment: 'รอชำระเงิน',
        waiting_document: 'รอรับเอกสาร',
        reviewing: 'กำลังตรวจสอบ',
        approved: 'อนุมัติแล้ว',
        rejected: 'ไม่อนุมัติ',
        cancelled: 'ยกเลิก'
      }[status] || status || '-'
    },
    statusColor (item) {
      const status = this.displayStatus(item)
      return {
        waiting_payment: 'red darken-1',
        waiting_document: 'orange darken-1',
        reviewing: 'blue darken-1',
        approved: 'green darken-1',
        rejected: 'red darken-1',
        cancelled: 'grey darken-1'
      }[status] || 'grey'
    },
    deliveryText (method) {
      return {
        pickup: 'รับด้วยตนเอง',
        ems: 'จัดส่งทางไปรษณีย์'
      }[method] || '-'
    }
  }
}
</script>

<style scoped>
.v-card__title {
  background-color: #3d8f6a !important;
  color: white !important;
  font-size: 26px !important;
}
.search-button { font-size: 16px; font-weight: bold; }
.items-per-page { max-width: 90px; }
.no-data { font-size: 18px; font-weight: bold; }
.delivery-address { color: #333; }
.delivery-address__title { margin-bottom: 14px; font-size: 24px; font-weight: bold; }
.delivery-address__line { display: flex; align-items: flex-start; margin-bottom: 12px; font-size: 20px; line-height: 1.5; }
.delivery-address__icon { flex: 0 0 28px; margin-top: 2px; margin-right: 10px; color: #9e9e9e !important; }
::v-deep .v-data-table-header { background-color: #49a97d; }
::v-deep th { color: #fff !important; font-size: 20px !important; font-weight: bold !important; }
::v-deep td { font-size: 20px !important; }
@media screen and (max-width: 600px) {
  ::v-deep .v-data-table__wrapper { overflow-x: auto; }
  .delivery-address__title { font-size: 22px; }
  .delivery-address__line { font-size: 18px; }
}
</style>
