const environment = {
  development: {
    // api: 'http://localhost:8002/api/uat',
    // api: 'https://adminksp-score-2569-1.thaijobjob.com/api/uat',
    // api: 'https://adminksp2569-1.thaijobjob.com/uat/api/admin',
    // api: 'https://adminksp2568-2.thaijobjob.com/api/admin',
    // api: 'https://adminkspsubjects2568.thaijobjob.com/api/admin',
    api: 'http://localhost:8002/api/uat',
    // api: 'http://192.168.254.46:20002/api/admin',
    s3BaseR1: 'https://uat-ksp67-2.thaijobjob.com/api/s3',
    s3BaseR2: 'https://uat-ksp67-2.thaijobjob.com/api/s3'
    // api: 'https://adminksp662.thaijobjob.com/api/admin',
  },
  staging: {
    api: 'http://localhost:8002/api/uat',
    s3BaseR1: 'https:/uat-ksp67-2.thaijobjob.com/api/s3',
    s3BaseR2: 'https://uat-ksp67-2.thaijobjob.com/api/s3'
  },
  production: {
    // api: 'https://adminksp-score-2569-1.thaijobjob.com/api',
    api: 'https://uat-thaimed.thaijobjob.com/api'
    // api: 'https://adminksp2569-1.thaijobjob.com/uat/api/admin',
    // s3BaseR1: 'https:/uat-ksp67-2.thaijobjob.com/api/s3',
    // s3BaseR2: 'https://uat-ksp67-2.thaijobjob.com/api/s3'

    // api: 'https://adminksp67-2.thaijobjob.com/api/admin',
    // s3BaseR1: 'https://ksp67-2.thaijobjob.com/api/v2/s3',
    // s3BaseR2: 'https://ksp67-2.thaijobjob.com/api/v2/s3'
  }
}

export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: 'ระบบสมัครสมาชิก :: สภาการแพทย์แผนไทย',
    title: 'members_thaimed',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/logo_thaimed.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '~/assets/css/fonts.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/plugins/vee-validate.js' },
    { src: '~/plugins/pdf.js' },
    { src: '~/plugins/loading.js' },
    { src: '~/plugins/axios.js' },
    { src: '~/plugins/vue-mask.js' },
    { src: '~/plugins/loading.js' }
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    'vue-sweetalert2/nuxt',
    'vue2-editor/nuxt'
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: environment[process.env.NODE_ENV].api
  },
  env: {
    NODE_ENV: process.env.NODE_ENV,
    API_REGISTER_CHECKREGISTER: environment[process.env.NODE_ENV].api + '/register/checkregister',

    BASE_ROUND1: environment[process.env.NODE_ENV].s3BaseR1,
    BASE_ROUND2: environment[process.env.NODE_ENV].s3BaseR2
  },
  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    treeShake: true,
    theme: {
      themes: {
        light: {
          primary: '#4fb24d'
        }
      }
    },
    defaultAssets: {
      font: {
        family: 'IBM Plex Sans Thai'
      }
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: [
      'vee-validate/dist/rules'
    ]
  },
  router: {
    base: '/'
    // base: '/uat'
  },
  server: {
    port: 3002
  }
}
