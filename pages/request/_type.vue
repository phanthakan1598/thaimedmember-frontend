<template>
  <v-container>
    <v-row class="pt-5">
      <v-col cols="12">
        <v-card>
          <v-card-title class="request-title">
            {{ pageTitle }}
          </v-card-title>
          <v-card-text class="request-message pa-md-6 pa-4">
            {{ pageMessage }}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

const requestPages = {
  license: 'ขอขึ้นทะเบียนใบอนุญาต',
  certificate: 'หนังสือรับรองการขึ้นทะเบียนรับใบอนุญาตเป็นผู้ประกอบวิชาชีพการแพทย์แผนไทย หรือการแพทย์แผนไทยประยุกต์',
  replacement: 'ขอใบแทนใบอนุญาต (กรณีชำรุด, สูญหาย)',
  translation: 'ขอใบแปลใบอนุญาต',
  renew: 'ต่ออายุบัตรสมาชิก / ขอบัตรสมาชิก',
  license55: 'ขอรับใบอนุญาต ก่อนปี 2556',
  'member-card': 'ขอหนังสือสำคัญการเป็นสมาชิกและบัตรสมาชิกฯ'
}

export default {
  computed: {
    pageTitle () {
      return requestPages[this.$route.params.type] || 'คำร้องขอ'
    },
    pageMessage () {
      return this.$route.params.type === 'member-card'
        ? 'คำร้องนี้ไม่มีค่าบริการ และอยู่ระหว่างพัฒนาหน้าฟอร์ม'
        : 'หน้าฟอร์มคำร้องอยู่ระหว่างพัฒนา'
    }
  }
}
</script>

<style scoped>
.request-title {
  color: #fff;
  background-color: #3d8f6a;
  font-size: 26px;
  font-weight: bold;
  word-break: break-word;
}

.request-message {
  font-size: 24px;
}
</style>
