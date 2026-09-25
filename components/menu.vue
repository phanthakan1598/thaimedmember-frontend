<template>
  <div class="divmenu">
    <v-list
      class="menu-list pa-0"
      dense
    >
      <v-list-item nuxt exact to="/">
        <v-list-item-icon><v-icon>mdi-home-outline</v-icon></v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>
            หน้าแรก
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item v-if="!isLoggedIn" nuxt to="/login">
        <v-list-item-icon><v-icon>mdi-login</v-icon></v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>
            เข้าสู่ระบบ
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item v-if="!isLoggedIn" nuxt to="/regis/login">
        <v-list-item-icon><v-icon>mdi-account-box-edit-outline</v-icon></v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>
            สมัครสมากชิก
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <template v-if="isLoggedIn">
        <v-list-item
          v-for="item in requestMenus"
          :key="item.path"
          nuxt
          :to="item.path"
          :exact="item.path === '/request'"
        >
          <v-list-item-icon><v-icon>{{ item.icon }}</v-icon></v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>
              {{ item.title }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>

      <!-- <v-list-item nuxt to="/register" style="height:60px;">
        <v-list-item-content>
          <v-list-item-title style="font-size: 18px; font-weight: bold;">
            สมัครสมาชิก
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item> -->

      <v-list-item nuxt to="/requestInspection">
        <v-list-item-icon><v-icon>mdi-file-search-outline</v-icon></v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>
            หนังสือรับรองการตรวจสอบ ใบอนุญาต
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item nuxt to="#">
        <v-list-item-icon><v-icon>mdi-help-circle-outline</v-icon></v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>
            สารพันปัญหา
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item nuxt to="#">
        <v-list-item-icon><v-icon>mdi-book-open-page-variant-outline</v-icon></v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>
            คู่มือการใช้งานระบบ
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <!-- หน้าแรก -->
      <!-- <nuxt-link
        to="/"
        class="menu-link"
      >
        <v-list-item
          dense
          :class="{ 'menu-active': $route.path === '/' }"
        >
          <v-list-item-content>
            <v-list-item-title>
              หน้าแรก
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </nuxt-link> -->

      <!-- ตรวจสถานะการสมัครสอบ -->
      <!-- <nuxt-link
        v-if="button.checkStatusRegister === 1"
        to="/search/status"
        class="menu-link"
      >
        <v-list-item link>
          <v-list-item-content>
            <v-list-item-title>
              ตรวจสถานะการสมัครสอบ
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </nuxt-link> -->

      <!-- <v-list-item
        v-else
        disabled
        class="menu-disabled"
      >
        <v-list-item-content>
          <v-list-item-title>
            ตรวจสถานะการสมัครสอบ
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item> -->

      <!-- ตรวจสอบเลขประจำตัวสอบ -->
      <!-- <nuxt-link
        v-if="button.checkApp === 1"
        to="/search/app"
        class="menu-link"
      >
        <v-list-item link>
          <v-list-item-content>
            <v-list-item-title>
              ตรวจสอบรายชื่อผู้มีสิทธิเข้าสอบภาค ก ภาค ข
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </nuxt-link> -->

      <!-- พิมพ์บัตรประจำตัวสอบ -->
      <!-- <nuxt-link
        v-if="button.examLocation === 1"
        to="/search/location"
        class="menu-link"
      >
        <v-list-item link>
          <v-list-item-content>
            <v-list-item-title>
              พิมพ์บัตรประจำตัวสอบ
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </nuxt-link> -->

      <!-- พิมพ์ใบสมัครสอบ -->
      <!-- <nuxt-link
        v-if="button.appForm === 1"
        to="/search/searchA"
        class="menu-link"
      >
        <v-list-item link>
          <v-list-item-content>
            <v-list-item-title>
              พิมพ์ใบสมัครสอบ
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </nuxt-link> -->

      <!-- ดูผลคะแนนการสอบ -->
      <!-- <nuxt-link
        v-if="button.score === 1"
        to="/search/score"
        class="menu-link"
      >
        <v-list-item link>
          <v-list-item-content>
            <v-list-item-title>
              ดูผลคะแนนการสอบ
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </nuxt-link> -->

      <!-- สารพันปัญหา -->
      <!-- <a
        href="https://drive.google.com/file/d/1ycYiL-OVzKSIvzaBoD5i-UUupCD2t1CG/view?usp=sharing*"
        target="_blank"
        rel="noopener noreferrer"
        class="menu-link"
      >
        <v-list-item link>
          <v-list-item-content>
            <v-list-item-title>
              สารพันปัญหา
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </a> -->

      <!-- คู่มือการใช้งานระบบ -->
      <!-- <a
        v-if="button.howTo === 1"
        href="https://drive.google.com/file/d/1BpzSEtI2-rDYtOnCHlMNCXyam2cjVoRR/view?usp=sharing"
        target="_blank"
        rel="noopener noreferrer"
        class="menu-link"
      >
        <v-list-item link>
          <v-list-item-content>
            <v-list-item-title>
              คู่มือการใช้งานระบบ
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </a> -->

      <!-- <v-list-item
        v-else
        disabled
        class="menu-disabled"
      >
        <v-list-item-content>
          <v-list-item-title>
            คู่มือการใช้งานระบบ
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item> -->

      <!-- ตรวจสอบวุฒิที่ ก.ค.ศ. รับรอง -->
      <!-- <a
        href="https://qualification.otepc.go.th/"
        target="_blank"
        rel="noopener noreferrer"
        class="menu-link"
      >
        <v-list-item link>
          <v-list-item-content>
            <v-list-item-title>
              ตรวจสอบวุฒิที่ ก.ค.ศ. รับรอง
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </a> -->

      <!-- ตรวจสอบวุฒิตามที่ ก.พ. รับรอง -->
      <!-- <a
        href="https://accreditation.ocsc.go.th/accreditation/search/curriculum"
        target="_blank"
        rel="noopener noreferrer"
        class="menu-link"
      >
        <v-list-item link>
          <v-list-item-content>
            <v-list-item-title>
              ตรวจสอบวุฒิตามที่ ก.พ. รับรอง
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </a> -->
    </v-list>
  </div>
</template>

<script>
export default {
  name: 'MenuPage',

  data () {
    return {
      button: {
        register: 0,
        checkStatusRegister: 1,
        docCheck: 0,
        checkApp: 1,
        appForm: 0,
        exam: 0,
        examLocation: 0,
        score: 0,
        request: 0,
        examPoint: 0,
        statusDoc: 0,
        howTo: 1
      },

      date: {
        app: this.$store.state.date.app,
        location: this.$store.state.date.location,
        doc: this.$store.state.date.doc
      },

      time: {
        register: {
          on: this.$store.state.time.register.on,
          off: this.$store.state.time.register.off
        },

        pay: {
          on: this.$store.state.time.pay.on,
          off: this.$store.state.time.pay.off
        },

        editDoc: {
          on: this.$store.state.time.editDoc.on,
          off: this.$store.state.time.editDoc.off
        },

        howto: {
          on: this.$store.state.time.howto.on,
          off: this.$store.state.time.howto.off
        },

        statusDoc: {
          on: this.$store.state.time.statusDoc.on,
          off: this.$store.state.time.statusDoc.off
        },

        examLocation: {
          on: this.$store.state.time.examLocation.on,
          off: this.$store.state.time.examLocation.off
        },

        score: {
          on: this.$store.state.time.score.on,
          off: this.$store.state.time.score.off
        },

        request: {
          on: this.$store.state.time.request.on,
          off: this.$store.state.time.request.off
        },

        exam: {
          on: this.$store.state.time.exam.on,
          off: this.$store.state.time.exam.off
        },

        checkStatusRegister: {
          on: this.$store.state.time.checkStatusRegister.on,
          off: this.$store.state.time.checkStatusRegister.off
        },

        appForm: {
          on: this.$store.state.time.appForm.on,
          off: this.$store.state.time.appForm.off
        }
      }
    }
  },

  computed: {
    user () {
      return this.$store.state.user
    },
    isLoggedIn () {
      return Boolean(this.user)
    },
    requestMenus () {
      if (Number(this.user?.role) === 55) {
        return [
          { title: 'ขอรับใบอนุญาต ก่อนปี 2556', path: '/request/license55', icon: 'mdi-license' },
          { title: 'ขอหนังสือสำคัญการเป็นสมาชิกและบัตรสมาชิกฯ', path: '/request/member-card', icon: 'mdi-card-account-details-outline' }
        ]
      }

      return [
        { title: 'คำร้องขอ', path: '/request', icon: 'mdi-format-list-bulleted' },
        { title: 'ขอขึ้นทะเบียนใบอนุญาต', path: '/request/license', icon: 'mdi-license' },
        { title: 'หนังสือรับรองการขึ้นทะเบียนรับใบอนุญาตเป็นผู้ประกอบวิชาชีพการแพทย์แผนไทย หรือการแพทย์แผนไทยประยุกต์', path: '/request/certificate', icon: 'mdi-certificate-outline' },
        { title: 'ขอใบแทนใบอนุญาต (กรณีชำรุด, สูญหาย)', path: '/request/replacement', icon: 'mdi-file-replace-outline' },
        { title: 'ขอแปลใบอนุญาต', path: '/request/translation', icon: 'mdi-translate' },
        { title: 'ขอเปลี่ยนข้อมูล', path: '/request/edit', icon: 'mdi-account-edit-outline' },
        { title: 'ต่ออายุบัตรสมาชิก / ขอบัตรสมาชิก', path: '/request/renew', icon: 'mdi-card-account-details-star-outline' }
      ]
    }
  },

  mounted () {
    const dateTime = new Date()

    if (
      dateTime >= new Date(
        this.$store.state.time.examLocation.on.replace(' ', 'T')
      )
    ) {
      this.button.examLocation = 1
    }

    if (
      dateTime >= new Date(
        this.$store.state.time.score.on.replace(' ', 'T')
      )
    ) {
      this.button.score = 1
    }

    if (
      dateTime >= new Date(
        this.$store.state.time.appForm.on.replace(' ', 'T')
      )
    ) {
      this.button.appForm = 1
    }
  }
}
</script>

<style scoped>

.divmenu { height: 100%; }
.menu-list { height: 100%; min-height: 100%; overflow: hidden; background: #fff; border: 0; border-right: 1px solid #e2e2e2; border-radius: 0; box-shadow: none; }
.v-list-item {
  min-height: 48px !important;
  margin: 4px 9px;
  padding: 0 10px;
  border: 0;
  border-radius: 8px;
  transition: background-color .2s ease, color .2s ease;
  /* min-height: 60px !important;
  max-height: 120px !important; */
}

.v-list-item__title {
  font-size: 17px !important;
  white-space: normal !important;
  overflow: visible !important;

  /* text-overflow: unset !important; */
   word-break: break-word;
   line-height: 1.2 !important;

  /* overflow: visible !important;
  text-overflow: unset !important;
   word-break: break-word; */
}

.v-list-item--active {
 background-color: #eef7f0 !important;
}
.v-list-item:hover { background-color: #edf5ed; }
.v-list-item--active .v-list-item__title,
.v-list-item--active .v-icon {
  color: #327531 !important;
  font-weight: bold;
}
.v-list-item__icon { align-self: flex-start; min-width: 24px; margin: 14px 8px 0 0 !important; }
.v-list-item__icon .v-icon { color: #666; font-size: 19px; }
@media screen and (max-width: 960px) {
  .menu-list { min-height: 100%; border: 0; border-radius: 0; }
  .v-list-item { min-height: 52px !important; }
  .v-list-item__title { font-size: 19px !important; }
}
/* #divmenu {
  width: 100%;
} */
/* .menu-link {
  display: block;
  color: #000000 !important;
  text-decoration: none !important;
} */

/* .menu-link .v-list-item {
  background-color: #ffffff;
  margin-bottom: 2px;
}
.menu-link .v-list-item .v-list-item__title {
  font-size: 28px;
  text-wrap-mode: wrap;
  color: #000000 !important;
} */
  /*

.menu-link .v-list-item:hover {
  background-color: #86bd8c;
}

.menu-active {
  color: #ffffff !important;
  background-color: #3d8f6a !important;
}

.menu-disabled {
  background-color: #cac8c2 !important;
  color: #ffffff !important;
  margin-bottom: 2px;
  min-height: 50px;
  font-size: 70px;
}

.menu-disabled .v-list-item__title {
  color: #ffffff !important;
}

.v-list-item__title {
  white-space: normal;
  line-height: 1.4;
} */
</style>
