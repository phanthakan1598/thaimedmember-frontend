<template>
  <v-app v-cloak>
    <div v-if="!appReady" class="app-bootstrap-loader">
      <img :src="require('~/assets/images/logo_thaimed_v1.png')" alt="สภาการแพทย์แผนไทย">
      <div class="app-bootstrap-loader__title">
        สภาการแพทย์แผนไทย
      </div>
      <v-progress-circular indeterminate color="#327531" :size="44" :width="4" />
      <div class="app-bootstrap-loader__text">
        กำลังโหลดข้อมูล กรุณารอสักครู่
      </div>
    </div>

    <template v-else>
      <headers @toggle-menu="mobileMenuOpen = !mobileMenuOpen" />

      <v-main>
        <div class="app-shell">
          <aside class="app-sidebar app-sidebar--desktop">
            <menus />
          </aside>

          <div class="app-page-content">
            <nuxt />
          </div>
        </div>
      </v-main>

      <v-navigation-drawer
        v-model="mobileMenuOpen"
        app
        temporary
        fixed
        width="280"
        class="app-mobile-drawer"
      >
        <menus />
      </v-navigation-drawer>

      <footers />
    </template>
  </v-app>
</template>

<script>
import headers from '~/components/header.vue'
import footers from '~/components/footer.vue'
import menus from '~/components/menu.vue'

export default {
  components: {
    headers,
    footers,
    menus
  },

  data () {
    return {
      appReady: false,
      mobileMenuOpen: false
    }
  },

  watch: {
    '$route.fullPath' () {
      this.mobileMenuOpen = false
    }
  },

  async mounted () {
    try {
      const userToken = localStorage.getItem('accessTokenUser')

      if (userToken) {
        this.$axios.setToken(userToken, 'Bearer')

        try {
          const response = await this.$axios.$get('/auth/profile')
          this.$store.commit('setUser', response.result)
          return
        } catch (error) {
          localStorage.removeItem('accessTokenUser')
          this.$store.commit('logout')
          this.$axios.setToken(false)
        }
      }

      // token สำหรับ API สาธารณะที่ไม่ต้องเข้าสู่ระบบ
      const token = process.env.API_TOKEN

      if (token) {
        try {
          this.$axios.setToken(token, 'Bearer')
        } catch (error) {
          await this.$swal({
            icon: 'error',
            title: 'เกิดข้อผิดพลาด',
            text: 'กรุณาติดต่อเจ้าหน้าที่',
            confirmButtonText: 'ปิด'
          })
        }
      }
    } finally {
      this.appReady = true
    }
  }
}
</script>

<style>
html {
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*::before,
*::after {
  box-sizing: inherit;
}

[v-cloak] {
  display: none;
}

.app-bootstrap-loader {
  display: flex;
  width: 100%;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: #327531;
  background: #f5f6f7;
}

.app-bootstrap-loader img {
  width: 78px;
  height: 96px;
  margin-bottom: 8px;
  object-fit: contain;
}

.app-bootstrap-loader__title {
  margin-bottom: 18px;
  font-size: 29px;
  font-weight: bold;
}

.app-bootstrap-loader__text {
  margin-top: 14px;
  color: #555;
  font-size: 19px;
}

.app-shell {
  display: flex;
  width: 100%;
  min-height: 100%;
  align-items: stretch;
}

.app-sidebar {
  flex: 0 0 230px;
  width: 230px;
  min-height: 100%;
  background: #fff;
}

.app-page-content {
  min-width: 0;
  flex: 1 1 auto;
}

.app-page-content > .container {
  width: 100%;
  max-width: none;
}

.app-mobile-drawer {
  z-index: 20 !important;
}

body {
  margin: 0;
  padding: 0;
  position: relative;
  font-family: 'thai_sans_literegular';
  background-color: #e9eaec;
  font-size: 24px;
  min-height: 100vh;
}

#main {
  font-size: 21px;
}

/*
 * Vuetify
 */
.v-application {
  font-family: 'thai_sans_literegular', sans-serif !important;
  font-size: 24px;
  background-color: #e9eaec !important;
}

@media screen and (max-width: 960px) {
  .app-sidebar--desktop { display: none; }
  .app-page-content > .container { padding: 12px; }
}

.v-application .v-label {
  font-size: 24px;
}

.v-input {
  font-size: 24px;
}

.v-messages__message {
  font-size: 16px !important;
}

.v-list-item__title {
  font-size: 24px !important;
}

.v-list-item__subtitle {
  font-size: 20px !important;
}

/* dropdown ของ v-select/v-autocomplete โดยเฉพาะ (เผื่อ scope เพิ่ม) */
.v-menu__content .v-list-item__title {
  font-size: 24px !important;
}

.v-input input,
.v-input textarea,
.v-select__selection {
  font-size: 24px;
}

/*
 * Form
 */
.form-group label {
  font-size: 24px;
  font-weight: bold;
}

.invalid-feedback,
.valid-feedback {
  font-size: 24px;
}

/*
 * Card
 */
.v-card{
    border-radius:12px;
}

.v-card-title {
  font-size: 25px;
}

.v-card-header {
  background-color: #49a97d;
  color: #ffffff;
  font-size: 25px;
}

/*
 * Warning
 */
#warning .v-card-title {
  background-color: #cc0000;
  color: #ffffff;
  font-size: 25px;
}

/*
 * Text alignment
 */
.ql-align-center {
  text-align: center;
}

.ql-align-right {
  text-align: right;
}

.center {
  text-align: center;
}

.left {
  text-align: left;
}

.right {
  text-align: right;
}

/*
 * Mobile
 */
@media screen and (max-width: 600px) {
  #Col-MainContant {
    padding-top: 1px;
  }
}
</style>
