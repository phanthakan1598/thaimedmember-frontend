<template>
  <v-container>
    <v-row class="py-5">
      <v-col
        class="col-MainContant"
        cols="12"
        md="12"
      >
        <div class="mb-4">
          <v-col
            class="pa-0"
            cols="12"
            md="12"
          >
            <div class="d-flex align-center">
              <v-icon
                size="32"
                style="color: #327531;  margin-top: 6px; cursor: pointer;"
                @click="cancelRegister()"
              >
                mdi-chevron-left
              </v-icon>

              <h1
                style="color: #327531; margin: 0;"
              >
                การลงทะเบียนสมัครสมาชิกสภาการแพทย์แผนไทย
              </h1>
            </div>

            <v-divider
              class="my-2"
              color="#327531"
            />

            <div>
              หมายเหตุ :
              ช่องที่มีเครื่องหมาย
              <span style="color: red !important;">*</span>
              คือส่วนที่จำเป็นต้องกรอก
            </div>
          </v-col>
        </div>

        <StepperHeader
          :step="step"
          @update:step="step = $event"
        />

        <Step1Personal
          v-if="step === 1"
          v-model="form"
          @click="step = 1"
          @next="step++"
        />

        <Step2Member
          v-if="step === 2"
          v-model="form"
          @click="step = 2"
          @back="step--"
          @next="step++"
        />

        <Step4View
          v-if="step === 3"
          v-model="form"
          @click="step = 3"
          @back="step--"
          @submit="submit"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
// import StepperHeader from '@/components/StepperHeader.vue'
// import Step1Personal from '@/components/Step1Personal.vue'

export default {
  name: 'RegisterPage',
  // components: {
  //   StepperHeader,
  //   Step1Personal
  // },
  data () {
    return {
      step: 1,
      form: {
        // ...
      },

      checkboxRegis: false,
      checkboxWork1: false,
      checkboxWork2: false,

      province: [],
      selectGender: [],
      chooseWorkType: []
    }
  },
  watch: {
    step () {
      this.$nextTick(() => {
        if (typeof window !== 'undefined') {
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }
      })
    }
  },
  created () {
    this.prefillFromEligibility()
  },
  mounted () {
    if (!this.form.idCard) {
      this.$router.replace('/login')
    }
  },
  methods: {
    normalizeBirthDate (value) {
      if (!value) { return '' }
      const parts = String(value).trim().match(/^(\d{1,4})[/-](\d{1,2})[/-](\d{1,4})$/)
      if (!parts) { return '' }

      const yearFirst = parts[1].length === 4
      let year = Number(yearFirst ? parts[1] : parts[3])
      const month = Number(parts[2])
      const day = Number(yearFirst ? parts[3] : parts[1])
      if (year > 2400) { year -= 543 }

      const date = new Date(Date.UTC(year, month - 1, day))
      if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) {
        return ''
      }
      return `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    },

    prefillFromEligibility () {
      const customer = this.$store.state.customerData
      if (!customer) { return }

      const passedProfessions = customer.eligibility?.passedProfessions || []
      const professions = {}
      const thaiMedicineData = {}
      passedProfessions.forEach(({ professionType }) => {
        if (!professionType) { return }
        professions[professionType] = true
        if (professionType !== 'thai_applied') {
          thaiMedicineData[professionType] = { status: true }
        }
      })

      this.form = {
        ...this.form,
        idCard: customer.CustomerID || '',
        name1Th: customer.Name1 || '',
        name2Th: customer.Name2 || '',
        name3Th: customer.Name3 || '',
        birthDate: this.normalizeBirthDate(customer.BirthDMY),
        nationality: customer.National || '',
        mobile: customer.TelMobile || '',
        email: customer.Email || '',
        address: customer.Address || '',
        building: customer.building || '',
        moo: customer.Moo || '',
        soi: customer.Soi || '',
        road: customer.Road || '',
        subdistrict: customer.District || '',
        district: customer.Amphur || '',
        province: customer.Province || '',
        zipcode: customer.Zipcode || '',
        phone: customer.Telephone || '',
        professions,
        qualification_declarations: {
          thai_medicine: {
            status: Object.keys(thaiMedicineData).length > 0,
            data: thaiMedicineData
          },
          thai_applied: {
            status: professions.thai_applied === true
          }
        },
        evidences: {},
        attachments: {}
      }
    },

    getFeePreview () {
      const applicantType = this.$store.state.customerData?.eligibility?.applicantType || 'new_member'
      if (['legacy_member', 'role55'].includes(applicantType)) {
        return { registrationFee: 0, certificateFee: 0, cardFee: 0, systemFee: 0, licenseFee: 0, deliveryFee: 0, total: 0 }
      }

      const licenseQuantity = Object.values(this.form.professions || {})
        .filter(selected => selected === true).length
      const registrationFee = 1000
      const certificateFee = 1000
      const cardFee = 100
      const systemFee = 45
      const licenseFee = licenseQuantity * 1000
      const deliveryFee = this.form.documentDeliveryMethod === 'postal' ? 100 : 0
      return {
        registrationFee,
        certificateFee,
        cardFee,
        systemFee,
        licenseFee,
        deliveryFee,
        total: registrationFee + certificateFee + cardFee + systemFee + licenseFee + deliveryFee
      }
    },

    cancelRegister () {
      this.$swal({
        icon: 'warning',
        title: 'ต้องการยกเลิกการลงทะเบียนใช่หรือไม่ ?',
        text: 'หากยกเลิกข้อมูลที่กรอกจะไม่ถูกบันทึก',
        showCancelButton: true,
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#4fb24d',
        cancelButtonText: 'ปฏิเสธ',
        confirmButtonClass: 'btn btn-success'
      }).then((data) => {
        if (data.isConfirmed) {
          this.$router.push('/')
        }
      })
    },

    async submit () {
      const fees = this.getFeePreview()
      const confirmation = await this.$swal({
        icon: 'question',
        title: 'ยืนยันการบันทึกข้อมูล',
        html: fees.total > 0
          ? `ค่าจดทะเบียนสมาชิก ${fees.registrationFee.toLocaleString()} บาท<br>` +
            `ค่าหนังสือสำคัญการเป็นสมาชิก ${fees.certificateFee.toLocaleString()} บาท<br>` +
            `ค่าขึ้นทะเบียนและรับใบอนุญาต ${fees.licenseFee.toLocaleString()} บาท<br>` +
            `ค่าบัตรสมาชิก ${fees.cardFee.toLocaleString()} บาท<br>` +
            `ค่าจัดส่ง ${fees.deliveryFee.toLocaleString()} บาท<br><b>รวม ${fees.total.toLocaleString()} บาท</b>` +
            `ค่าระบบ ${fees.systemFee.toLocaleString()} บาท<br>`
          : 'คำร้องนี้ไม่มีค่าธรรมเนียม และจะส่งให้เจ้าหน้าที่ตรวจสอบข้อมูล',
        showCancelButton: true,
        confirmButtonText: 'ยืนยันบันทึก',
        confirmButtonColor: '#4fb24d',
        cancelButtonText: 'ยกเลิก'
      })
      if (!confirmation.isConfirmed) { return }

      this.$Notiflix.loading()

      try {
        const formData = new FormData()
        const payload = JSON.parse(JSON.stringify(this.form, (key, value) => {
          return value instanceof File ? undefined : value
        }))

        formData.append('data', JSON.stringify(payload))

        if (this.form.profileImageFile instanceof File) {
          formData.append('profileImage', this.form.profileImageFile)
        }

        this.appendFiles(formData, 'attachments', this.form.attachments)
        this.appendFiles(formData, 'evidences', this.form.evidences)

        const response = await this.$axios.$post('/register/submit', formData)
        let loginResponse

        try {
          loginResponse = await this.$axios.$post('/auth/login', {
            username: this.form.idCard,
            password: this.form.mobile
          })
        } catch (loginError) {
          this.$Notiflix.remove()
          await this.$swal({
            icon: 'warning',
            title: 'บันทึกข้อมูลสำเร็จ',
            text: 'บันทึกใบสมัครแล้ว แต่ไม่สามารถเข้าสู่ระบบอัตโนมัติได้ กรุณาเข้าสู่ระบบอีกครั้ง',
            confirmButtonText: 'ไปหน้าเข้าสู่ระบบ',
            confirmButtonColor: '#4fb24d'
          })
          await this.$router.push({
            path: '/login',
            query: { CustomerID: this.form.idCard }
          })
          return
        }

        this.$axios.setToken(loginResponse.token, 'Bearer')
        localStorage.setItem('accessTokenUser', loginResponse.token)
        this.$store.commit('setUser', loginResponse.result)

        this.$Notiflix.remove()
        await this.$swal({
          icon: 'success',
          title: 'บันทึกข้อมูลสำเร็จ',
          text: response.message,
          confirmButtonText: 'ตกลง',
          confirmButtonColor: '#4fb24d'
        })
        await this.$router.push('/request')
      } catch (error) {
        this.$Notiflix.remove()
        await this.$swal({
          icon: 'error',
          title: 'ไม่สามารถบันทึกข้อมูลได้',
          text: error.response?.data?.message || 'กรุณาลองใหม่อีกครั้ง',
          confirmButtonText: 'ปิด'
        })
      }
    },

    appendFiles (formData, groupName, items) {
      if (!items) { return }

      Object.entries(items).forEach(([key, item]) => {
        if (item && item.file instanceof File) {
          formData.append(`${groupName}[${key}]`, item.file)
        }
      })
    }
  }
}
</script>

<style scoped>

#fileBox {
  border: 1px solid #8e8e8e;
  border-radius: 10px;
  background-color: white;
  margin-bottom: 8px;
}

.icon-pic{
  height: 40px;
  left: 10px;
  right: 13px;
  top: 10px;
}

.card-divider{
  height: 2px;
  border-bottom: 2px dashed #9D9D9D;
  border-top: none;
  border-spacing: 50px;
}

.v-stepper__content {
    top: 0;
    padding: 0px;
    flex: 1 0 auto;
    width: 100%;
}

::v-deep .text-darkBlue input {
  color: #9B9B9B !important;
}

.button-container {
  display: flex;
  /* justify-content: flex-end; */
  margin-top: 20px;
}

.button-container-save {
  display: flex;
  /* justify-content: center; */
  margin-bottom: 10px;
}

.larger-checkbox {
  transform: scale(1.5);
  margin-left: 4px;
  color: #327531;
  background-color: #327531;
}

.custom-file-upload {
    border: 1px solid #327531;
    display: inline-block;
    padding: 6px 12px;
    border-radius: 8px;
    cursor: pointer;
}

</style>
