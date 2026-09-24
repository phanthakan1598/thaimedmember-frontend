<template>
  <v-container fluid class="pa-0">
    <v-app-bar
      absolute
      style="color: #fff; background: linear-gradient(296deg, #327531 0%, #2396A3 100%); z-index: 4;"
    >
      <v-img
        class="ml-2 ml-sm-6"
        max-width="40"
        :src="require('../assets/images/logo_thaimed_v1.png')"
      />
      <v-toolbar-title
        class="ml-2 ml-sm-5 text-truncate"
        style="color: #FFFFFF; font-size: clamp(14px, 2.5vw, 20px);"
      >
        สภาการแพทย์แผนไทย
      </v-toolbar-title>
    </v-app-bar>

    <v-row
      class="mt-2 content-padding"
      style="background-color: #FAFBFB; padding-top: 100px;"
      align="center"
      no-gutters
    >
      <v-btn ref="backBtn" icon :ripple="false" class="mr-2 mr-sm-3">
        <v-icon color="#4fb24d" size="28">
          mdi-chevron-left
        </v-icon>
      </v-btn>

      <h2
        class="page-title"
        style="color: #235223; font-size: clamp(16px, 3vw, 22px); line-height: 1.3;"
      >
        การลงทะเบียนสมัครสมาชิกสภาการแพทย์แผนไทย
      </h2>
    </v-row>

    <!-- Divider: extra left padding = button width + margin, to align with the text above -->
    <v-row
      class="content-padding content-padding-with-icon"
      align="center"
      no-gutters
    >
      <v-divider color="#235223" />
    </v-row>

    <!-- Note: same extra left padding -->
    <v-row
      class="content-padding content-padding-with-icon"
      style="background-color: #FAFBFB; padding-top: 7px; padding-bottom: 4px; font-size: 14px;"
      align="center"
      no-gutters
    >
      หมายเหตุ : ช่องที่มีเครื่องหมาย(<span style="color: red !important;">*</span>) คือส่วนที่จำเป็นต้องกรอก
    </v-row>

    <v-main style="background-color: #FAFBFB;">
      <div class="content-padding content-padding-with-icon">
        <Nuxt />
      </div>
    </v-main>

    <v-container
      fluid
      style="font-size: 16px; background: linear-gradient(296deg, #327531 0%, #2496A3 100%); color: #fff; width: 100%; padding: 20px; z-index: 4;"
    >
      <v-row align="center">
        <v-col cols="12" md="4" class="text-center text-md-left">
          หากมีปัญหาเกี่ยวกับระบบการสมัครสอบ สามารถติดต่อได้ที่
        </v-col>
        <v-col cols="12" md="2" />
        <v-col cols="12" md="6">
          <div class="d-flex flex-wrap align-center justify-center justify-md-start">
            <v-icon color="#FFFFFF">
              mdi-phone-in-talk
            </v-icon>
            <span class="mx-2">
              Call Center โทร. 0-2257-7159 (วันจันทร์ - วันศุกร์ เวลา 8.30-17.30 น.)
            </span>
            <img
              src="../assets/images/line.png"
              height="25"
              width="25"
              name="imageLine"
              class="mr-1"
            >
            <span>LineID : @Thaijobjob</span>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>
<script>
export default {
  name: 'AppBarComponent',

  props: {
    title: {
      type: String,
      default: ''
    }
  },

  data () {
    // return {
    //   title: ''
    // }
  },

  computed: {
    // currentStep () {
    //   return (
    //     this.steps.find(item => item.value === this.step) ||
    //     this.steps[0]
    //   )
    // }
  }
}
</script>

<style scoped>

.page-title {
  margin: 0;
  word-break: break-word;
}

.content-padding {
  padding-left: clamp(16px, 4vw, 150px);
  padding-right: clamp(16px, 4vw, 150px);
}

.content-padding-with-icon {
  padding-left: clamp(16px, 4vw, 150px);
  padding-right: clamp(16px, 4vw, 150px);
}
</style>
