<template>
  <v-card
    class="mb-4"
  >
    <v-stepper flat :value="step">
      <v-stepper-header>
        <v-stepper-step
          color="#4fb24d"
          style="font-size: 24px;"
          :complete="step > steps[0].value"
          :step="steps[0].value"
          @click="$emit('update:step', steps[0].value)"
        >
          {{ steps[0].title }}
        </v-stepper-step>
        <v-divider />
        <v-stepper-step
          color="#4fb24d"
          style="font-size: 24px;"
          :complete="step > steps[1].value"
          :step="steps[1].value"
          @click="$emit('update:step', steps[1].value)"
        >
          {{ steps[1].title }}
        </v-stepper-step>
        <v-divider />
        <v-stepper-step
          color="#4fb24d"
          style="font-size: 24px;"
          :complete="step > steps[2].value"
          :step="steps[2].value"
          @click="$emit('update:step', steps[2].value)"
        >
          {{ steps[2].title }}
        </v-stepper-step>
        <v-divider />
        <v-stepper-step
          color="#4fb24d"
          style="font-size: 24px;"
          :complete="step > steps[3].value"
          :step="steps[3].value"
          @click="$emit('update:step', steps[3].value)"
        >
          {{ steps[3].title }}
        </v-stepper-step>
      </v-stepper-header>
    </v-stepper>
  </v-card>
</template>

<script>
export default {
  name: 'StepperHeader',

  props: {
    step: {
      type: Number,
      default: 1
    }
  },

  data () {
    return {
      e1: 1,
      steps: [
        {
          value: 1,
          title: 'ข้อมูลส่วนตัว'
        },
        {
          value: 2,
          title: 'ขอเป็นสมาชิกสภาฯ'
        },
        {
          value: 3,
          title: 'ใบอนุญาต'
        },
        {
          value: 4,
          title: 'ตรวจสอบข้อมูล'
        }
      ]
    }
  },

  computed: {
    currentStep () {
      return (
        this.steps.find(item => item.value === this.step) ||
        this.steps[0]
      )
    }
  }
}
</script>

<style scoped>

.v-card{
    border-radius:12px;
}

.v-stepper {
  background: transparent;
}

.v-stepper__header {
  box-shadow: none;
}

.text-h6 {
  color: #4fb24d;
}

.custom-stepper {
  --stepper-primary: #4fb24d !important;
}
</style>
