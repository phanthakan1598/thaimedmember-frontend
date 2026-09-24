<template>
  <section>
    <h2 class="section-title">
      {{ title }}
    </h2>
    <v-card outlined class="pa-4 mt-3">
      <slot />
    </v-card>
  </section>
</template>

<script>
export default {
  name: 'RequestDetailSection',
  props: {
    title: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>
.section-title {
  margin-bottom: 0;
  font-size: 24px;
  font-weight: bold;
}
</style>
