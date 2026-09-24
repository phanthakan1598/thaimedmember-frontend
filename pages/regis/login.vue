<template>
  <div class="login-page">
    <section class="login-brand-panel">
      <div class="brand-content">
        <img :src="require('~/assets/images/logo_thaimed_v1.png')" class="brand-logo" alt="สภาการแพทย์แผนไทย">
        <div class="brand-copy">
          <h1>สภาการแพทย์แผนไทย</h1>
          <p>THAI TRADITIONAL MEDICAL COUNCIL</p>
        </div>
      </div>
    </section>

    <section class="login-form-panel">
      <div class="login-form-wrapper">
        <div class="mobile-brand">
          <img :src="require('~/assets/images/logo_thaimed_v1.png')" alt="สภาการแพทย์แผนไทย">
          <span>สภาการแพทย์แผนไทย</span>
        </div>
        <h2>ตรวจสอบข้อมูลสมัครสมากชิก</h2>
        <p class="login-description">
          ระบบสมาชิกสภาการแพทย์แผนไทย
        </p>
        <validation-observer v-slot="{ handleSubmit }">
          <v-form @submit.prevent="handleSubmit(submitCheckRegister)">
            <label class="field-label">เลขบัตรประจำตัวประชาชน</label>
            <validation-provider v-slot="{ errors }" rules="required|thaiID">
              <v-text-field
                v-model="username"
                outlined
                placeholder="กรอกเลขบัตรประจำตัวประชาชน"
                maxlength="13"
                :error-messages="errors"
                prepend-inner-icon="mdi-card-account-details-outline"
                class="login-field"
              />
            </validation-provider>

            <label class="field-label">เบอร์โทรศัพท์</label>
            <validation-provider v-slot="{ errors }" rules="required|numeric|digits:10|noSpace">
              <v-text-field
                v-model="tel_mobile"
                outlined
                placeholder="กรอกเบอร์โทรศัพท์"
                maxlength="10"
                :error-messages="errors"
                prepend-inner-icon="mdi-cellphone"
                class="login-field"
              />
            </validation-provider>

            <v-btn
              type="submit"
              block
              x-large
              color="#327531"
              dark
              class="login-button"
            >
              ตรวจสอบข้อมูล
            </v-btn>
            <v-btn text block color="#327531" class="home-button" @click="$router.push('/')">
              กลับหน้าหลัก
            </v-btn>
          </v-form>
        </validation-observer>
      </div>
    </section>
  </div>
</template>
<script>
export default {
  name: 'LoginPage',
  layout: 'login',
  data () {
    return {
      username: '',
      tel_mobile: '',
      password: ''
    }
  },
  created () {
    this.username = this.$route.query.CustomerID || ''
  },
  methods: {
    async submitCheckRegister () {
      this.$Notiflix.loading()
      try {
        const checkResponse = await this.$axios.$post('/register/checkRegister', {
          CustomerID: this.username,
          mobile: this.tel_mobile
        })

        if (checkResponse.code === 4) {
          const loginResponse = await this.$axios.$post('/auth/login', {
            username: this.username,
            password: this.tel_mobile
          })

          this.$Notiflix.remove()
          await this.$swal({
            icon: 'success',
            title: 'เข้าสู่ระบบสำเร็จ',
            confirmButtonText: 'ตกลง',
            confirmButtonColor: '#4fb24d'
          })
          this.$axios.setToken(loginResponse.token, 'Bearer')
          localStorage.setItem('accessTokenUser', loginResponse.token)
          this.$store.commit('setUser', loginResponse.result)
          await this.$router.push('/')
          return
        }

        if (checkResponse.code === 1 || checkResponse.code === 2) {
          this.$store.commit('setStatusEligible', checkResponse.code)
          this.$store.commit('setCustomerData', {
            ...(checkResponse.result || {}),
            CustomerID: this.username,
            TelMobile: this.tel_mobile,
            mobileLocked: true
          })
          this.$Notiflix.remove()
          await this.$router.push('/regis/register')
          return
        }
        this.$Notiflix.remove()
        await this.$swal({
          icon: 'warning',
          title: 'ไม่พบสิทธิสมัครสมาชิก',
          text: checkResponse.message || 'กรุณาตรวจสอบข้อมูลอีกครั้ง',
          confirmButtonText: 'ปิด',
          confirmButtonColor: '#327531'
        })
      } catch (error) {
        this.$Notiflix.remove()
        await this.$swal({
          icon: 'error',
          title: 'ไม่สามารถดำเนินการได้',
          text: error.response?.data?.message || 'กรุณาตรวจสอบเลขบัตรประชาชนและเบอร์โทรศัพท์',
          confirmButtonText: 'ปิด',
          confirmButtonColor: '#327531'
        })
      }
    }
  }
}
</script>

<style scoped>
.login-page { display: flex; width: 100%; min-height: 100vh; background: #fff; }
.login-brand-panel { display: flex; width: 50%; min-height: 100vh; align-items: center; justify-content: center; padding: 48px; color: #fff; background: #327531; }
.brand-content { display: flex; align-items: center; max-width: 720px; }
.brand-logo { width: 120px; height: 150px; object-fit: contain; margin-right: 28px; }
.brand-copy h1 { margin: 0; font-size: 42px; line-height: 1.15; }
.brand-copy p { margin: 8px 0 0; font-size: 21px; font-weight: bold; letter-spacing: .6px; }
.login-form-panel { display: flex; width: 50%; min-height: 100vh; align-items: center; justify-content: center; padding: 40px; }
.login-form-wrapper { width: 100%; max-width: 500px; }
.login-form-wrapper h2 { margin: 0; color: #222; font-size: 42px; line-height: 1.2; }
.login-description { margin: 4px 0 28px; color: #666; font-size: 22px; }
.field-label { display: block; margin-bottom: 6px; color: #222; font-size: 21px; font-weight: bold; }
.login-field { margin-bottom: 4px; }
.login-button { margin-top: 12px; font-size: 21px; font-weight: bold; letter-spacing: 0; }
.home-button { margin-top: 8px; font-size: 18px; letter-spacing: 0; }
.mobile-brand { display: none; }
@media screen and (max-width: 960px) {
  .login-page { display: block; }
  .login-brand-panel { display: none; }
  .login-form-panel { width: 100%; min-height: 100vh; padding: 28px 20px; }
  .mobile-brand { display: flex; align-items: center; margin-bottom: 32px; color: #327531; font-size: 27px; font-weight: bold; }
  .mobile-brand img { width: 56px; height: 68px; object-fit: contain; margin-right: 14px; }
  .login-form-wrapper h2 { font-size: 34px; }
  .login-description { font-size: 20px; }
}
</style>
