<template>
  <v-card
    class="mb-4"
  >
    <v-stepper flat :value="step">
      <v-stepper-header>
        <template v-for="(item, index) in steps">
          <v-stepper-step
            :key="'step-' + item.value"
            color="#4fb24d"
            style="font-size: 24px;"
            :complete="step > item.value"
            :step="item.value"
            @click="$emit('update:step', item.value)"
          >
            {{ item.title }}
          </v-stepper-step>
          <v-divider
            v-if="index < steps.length - 1"
            :key="'divider-' + item.value"
          />
        </template>
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
          title: 'ขอเป็นสมาชิกสภาฯ และใบอนุญาต'
        },
        {
          value: 3,
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
