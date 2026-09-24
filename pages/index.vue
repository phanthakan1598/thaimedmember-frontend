<template>
  <v-container>
    <v-row class="pt-5">
      <!-- Main Content -->
      <v-col
        class="col-MainContant"
        cols="12"
      >
        <!-- Carousel -->
        <v-carousel
          v-model="slide"
          :interval="4000"
          cycle
          show-arrows
          hide-delimiter-background
          :height="carouselHeight"
        >
          <v-carousel-item>
            <v-img
              :src="require('~/assets/images/slide-one.png')"
              width="100%"
              :height="carouselHeight"
              contain
            />
          </v-carousel-item>
        </v-carousel>

        <br>

        <!-- News -->
        <v-card>
          <v-card-title>
            <img
              :src="require('~/assets/images/l1.png')"
              width="30"
              height="30"
              class="mr-2"
            >
            <strong>ประชาสัมพันธ์</strong>
          </v-card-title>

          <v-card-text>
            <v-expansion-panels accordion>
              <template v-for="(item, index) in news">
                <v-expansion-panel
                  v-if="item.IsActive == '1'"
                  :key="index"
                  :class="item.Status === 1
                    ? 'news-danger'
                    : 'news-primary'"
                >
                  <v-expansion-panel-header>
                    <div class="d-flex align-center">
                      <img
                        src="@/assets/images/document.png"
                        width="35"
                        class="mr-2"
                      >

                      <strong>{{ item.Subject }}</strong>

                      <img
                        v-if="item.Status === 1"
                        src="@/assets/images/news.gif"
                        width="35"
                        class="ml-2"
                      >
                    </div>
                  </v-expansion-panel-header>

                  <v-expansion-panel-content>
                    <div v-html="item.Detail" />
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </template>
            </v-expansion-panels>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <br>

    <!-- Popup -->
    <v-dialog
      v-for="(item, index) in popup"
      :key="index"
      :value="item.status"
      max-width="1200"
      scrollable
      persistent
      @input="onPopupInput(index, $event)"
    >
      <v-card>
        <!-- Dialog Header -->
        <v-card-title>
          <img
            src="@/assets/images/l1.png"
            width="30"
            height="30"
            class="mr-2"
          >

          <strong class="popup-title">
            ผู้สมัครโปรดทราบ
          </strong>

          <v-spacer />

          <v-btn
            icon
            @click="hidePopUp(index)"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-divider />

        <!-- Dialog Content -->
        <v-card-text class="popup-content">
          <div v-html="item.data" />
        </v-card-text>

        <v-divider />

        <!-- Dialog Footer -->
        <v-card-actions>
          <v-spacer />

          <v-btn
            large
            color="primary"
            @click="hidePopUp(index)"
          >
            รับทราบ
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>

export default {
  name: 'IndexPage',

  data () {
    return {
      slide: 0,
      news: [],
      locations: [],
      popup: [],
      showImage: 0
    }
  },
  computed: {
    carouselHeight () {
      const name = this.$vuetify.breakpoint.name
      // ปรับตัวเลขได้ตามต้องการ
      const heights = {
        xs: 180, // มือถือแนวตั้ง
        sm: 250, // มือถือแนวนอน / แท็บเล็ตเล็ก
        md: 300,
        lg: 350,
        xl: 350
      }
      return heights[name] || 350
    }
  },

  mounted () {
    // await this.fetchData()

    // this.$nextTick(() => {
    //   this.showPopUp()
    // })
  },

  methods: {
    async fetchData () {
      try {
        const res = await this.$axios.$get(
          process.env.API_NEWS_GETNEWS
        )

        this.news = res.result.news

        this.popup = res.result.popup.sort(
          (a, b) => a.Priority - b.Priority
        )
      } catch (error) {
        await this.$swal({
          title: 'ผู้สมัครโปรดทราบ',
          text: 'พบข้อผิดพลาด กรุณาลองใหม่',
          icon: 'error',
          showCloseButton: true
        })
      }
    },

    hidePopUp (index) {
      this.popup[index].status = false
    },

    onPopupInput (index, value) {
      this.popup[index].status = value
    }
  }
}
</script>

<style scoped>
.news-primary {
  margin-bottom: 15px;
  border-left: 5px solid #428bca !important;
  background: #c8e8c2;
  font-size: 23px;
}

.news-danger {
  margin-bottom: 15px;
  border-left: 5px solid #d9534f !important;
  background: #ffc1c1;
  font-size: 23px;
}

.popup-title {
  font-size: 30px;
}

.popup-content {
  font-size: 20px;
}

.v-expansion-panel-header {
  font-size: 23px;
}

.v-expansion-panel-content {
  font-size: 20px;
}

/* .col-MainContant {
    padding-top: 0;
  } */

@media screen and (max-width: 600px) {
  .col-MainContant {
    padding-top: 1px;
  }
}
</style>
