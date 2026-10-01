<template>
  <header class="top-header">
    <v-container fluid class="header-container">
      <div class="header-content">
        <v-btn
          icon
          dark
          class="mobile-menu-button"
          aria-label="เปิดหรือปิดเมนู"
          @click="$emit('toggle-menu')"
        >
          <v-icon>mdi-menu</v-icon>
        </v-btn>
        <nuxt-link to="/" class="brand-link">
          <img :src="require('~/assets/images/logo_thaimed_v1.png')" class="logo-img" alt="สภาการแพทย์แผนไทย">
          <div class="brand-copy">
            <strong>สภาการแพทย์แผนไทย</strong>
            <small>THAI TRADITIONAL MEDICAL COUNCIL</small>
          </div>
        </nuxt-link>
        <div
          v-if="isLoggedIn"
          class="user-area"
        >
          <v-menu
            v-model="userMenu"
            offset-y
            transition="slide-y-transition"
            min-width="190"
          >
            <template #activator="{ on, attrs }">
              <div
                class="user-name user-dropdown-activator"
                v-bind="attrs"
                v-on="on"
              >
                <v-icon color="white" class="mr-1">
                  mdi-account-circle
                </v-icon>
                <span>{{ displayName }}</span>
                <v-icon color="white" small class="ml-1 dropdown-arrow" :class="{ 'rotate-180': userMenu }">
                  mdi-chevron-down
                </v-icon>
              </div>
            </template>

            <v-list dense class="py-1">
              <v-list-item @click="openEditProfile">
                <v-list-item-icon class="mr-2">
                  <v-icon color="#327531">
                    mdi-account-edit
                  </v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title class="user-menu-item-text">
                    แก้ไขข้อมูลส่วนตัว
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-menu>

          <v-btn
            text
            dark
            class="logout-button"
            @click="logout"
          >
            <v-icon left>
              mdi-logout
            </v-icon>
            ออกจากระบบ
          </v-btn>
        </div>
      </div>
    </v-container>
  </header>
</template>

<script>
export default {
  name: 'HeaderPage',

  data () {
    return {
      userMenu: false
    }
  },

  computed: {
    user () {
      return this.$store.state.user
    },
    isLoggedIn () {
      return Boolean(this.user)
    },
    displayName () {
      return this.user?.fullname || this.user?.username || ''
    }
  },

  methods: {
    openEditProfile () {
      this.userMenu = false
      if (this.$route.path !== '/profile') {
        this.$router.push('/profile')
      }
    },
    logout () {
      localStorage.removeItem('accessTokenUser')
      this.$axios.setToken(false)
      this.$store.commit('logout')
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
.top-header {
  width: 100%;
  min-height: 68px;
  color: #fff;
  background: #327531;
  box-shadow: 0 2px 7px rgba(0, 0, 0, .2);
}
.header-container { min-height: 68px; padding: 0 32px; }
.header-content { position: relative; display: flex; min-height: 68px; align-items: center; }
.brand-link {
  display: flex;
  align-items: center;
  flex: 1 1 auto;
  height: 68px;
  text-decoration: none;
}
.logo-img {
  width: 48px;
  height: 56px;
  object-fit: contain;
  object-position: left center;
  display: block;
}
.brand-copy { display: flex; min-width: 0; flex-direction: column; margin-left: 11px; color: #fff; line-height: 1.05; }
.brand-copy strong { font-size: 21px; }
.brand-copy small { margin-top: 4px; font-size: 11px; font-weight: bold; letter-spacing: .25px; }
.user-area {
  display: flex;
  align-items: center;
  flex: 0 1 auto;
  min-width: 0;
  font-size: 17px;
}
.user-name {
  display: flex;
  align-items: center;
  max-width: 240px;
  min-width: 0;
  padding: 6px 10px;
  white-space: nowrap;
}
.user-dropdown-activator {
  cursor: pointer;
  user-select: none;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}
.user-dropdown-activator:hover {
  background-color: rgba(255, 255, 255, 0.15);
}
.dropdown-arrow {
  transition: transform 0.2s ease;
}
.rotate-180 {
  transform: rotate(180deg);
}
.user-menu-item-text {
  color: #333;
  font-size: 15px;
  font-weight: 500;
}
.user-name span { overflow: hidden; text-overflow: ellipsis; }
.logout-button {
  border-left: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: 0;
  padding: 6px 10px !important;
  font-size: 16px;
  letter-spacing: 0;
}
@media screen and (max-width: 960px) {
  .header-container { padding: 0 16px; }
  .header-content { flex-wrap: wrap; padding: 6px 0; }
  .brand-link { width: auto; height: 54px; }
  .logo-img { width: 43px; height: 50px; }
  .brand-copy strong { font-size: 19px; }
  .brand-copy small { font-size: 9px; }
  .user-area { width: 100%; justify-content: flex-end; border-top: 1px solid rgba(255, 255, 255, .2); }
  .user-name { max-width: calc(100vw - 135px); padding-left: 0; font-size: 16px; }
  .logout-button { font-size: 15px; }
}
.mobile-menu-button { display: none; }
@media screen and (max-width: 960px) {
  .mobile-menu-button { display: inline-flex; flex: 0 0 auto; margin-right: 6px; }
}
</style>
