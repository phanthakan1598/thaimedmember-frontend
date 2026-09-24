<template>
  <v-app>
    <AppBarComponents />
  </v-app>
</template>

<script>
import AppBarComponents from '@/components/AppBar.vue'
export default {
  name: 'RegisterLaout',
  components: {
    AppBarComponents
  }
}

</script>

<style scoped>
/* .app-bar-custom {
  height: 64px !important;
}

@media (min-width: 600px) {
  .app-bar-custom {
    height: 54px !important;
  }
}

@media (min-width: 960px) {
  .app-bar-custom .v-toolbar__content {
    min-height: 10px !important;
  }
} */

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

@media (max-width: 599px) {
  .content-padding-with-icon {
    padding-left: calc(clamp(16px, 4vw, 150px) + 36px + 8px);
  }
}

@media (min-width: 600px) {
  .content-padding-with-icon {
    padding-left: calc(clamp(16px, 4vw, 150px) + 36px + 12px);
  }
}
</style>
