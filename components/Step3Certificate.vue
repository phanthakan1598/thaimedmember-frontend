<template>
  <v-card class="pa-4">
    <div
      class="d-flex align-center mt-3"
      style="justify-content: flex-start !important;"
    >
      <v-icon color="#327531" class="mr-2">
        mdi-card-account-details
      </v-icon>

      <h2 class="text-h6 font-weight-bold mb-0" style="color: #327531;">
        ใบอนุญาต
      </h2>
    </div>

    <validation-observer ref="step3">
      <v-form ref="step3">
        <v-divider class="my-6" />
        <v-row>
          <v-col cols="12">
            <span style="font-size: 24px; font-weight: bold;">
              ข้าพเจ้ามีความประสงค์ขอเป็นสมาชิกสภาการแพทย์แผนไทย
            </span>
          </v-col>
        </v-row>

        <v-divider class="my-6" />

        <v-row>
          <v-col cols="12">
            <span style="font-size: 24px; font-weight: bold;">
              ข้าพเจ้ามีความประสงค์ขอขึ้นทะเบียนและรับใบอนุญาต
            </span>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-card outlined class="pa-4">
              <v-row
                v-for="(item, index) in availableProfessionList"
                :key="'profession-' + index"
              >
                <v-col cols="12" class="py-1 mb-1">
                  <v-checkbox
                    v-model="localForm.professions[item.value]"
                    :label="item.label"
                    dense
                    hide-details
                  />
                </v-col>
              </v-row>
            </v-card>

            <span
              v-if="showProfessionError"
              style="font-size: 22px;"
              class="red--text mt-2"
            >
              กรุณาเลือกอย่างน้อย 1 ด้าน
            </span>
          </v-col>
        </v-row>

        <v-divider class="my-6" />

        <v-row>
          <v-col cols="12">
            <span style="font-size: 24px; font-weight: bold;">
              ข้าพเจ้าได้แนบหลักฐานประกอบการพิจารณาดังต่อไปนี้
              <span class="red--text">*</span>
            </span>
          </v-col>
        </v-row>

        <v-row>
          <v-col
            cols="12"
            class="py-1"
          >
            <v-card outlined class="pa-4 mb-3">
              <v-col
                v-for="(item, index) in evidenceList"
                :key="'evidence-' + index"
                cols="12"
                class="py-1"
              >
                <validation-provider
                  v-slot="{ errors }"
                  :name="item.label"
                  :rules="item.required ? 'mustBeTrue' : ''"
                >
                  <v-checkbox
                    v-model="localForm.evidences[item.value].status"
                    dense
                    hide-details
                    :error-messages="errors"
                    class="py-0"
                    @change="onAttachmentStatusChange(item.value, $event)"
                  >
                    <template #label>
                      <span>
                        {{ item.label }}
                        <span v-if="item.required" class="red--text">*</span>
                      </span>
                    </template>
                  </v-checkbox>
                </validation-provider>

                <v-row v-if="localForm.evidences[item.value].status" class="pl-8 pr-2 pt-2">
                  <v-col cols="12">
                    <validation-provider
                      v-slot="{ errors }"
                      :name="item.value"
                      :rules="item.required ? 'required' : ''"
                    >
                      <v-file-input
                        v-model="localForm.evidences[item.value].file"
                        placeholder="แนบไฟล์เอกสาร"
                        :accept="acceptAttr(item.accept)"
                        prepend-icon=""
                        prepend-inner-icon="mdi-paperclip"
                        outlined
                        dense
                        show-size
                        :error-messages="errors"
                        :hint="'รองรับไฟล์ ' + item.accept"
                        persistent-hint
                        @change="onFileChange(item.value, $event, item.accept)"
                      />
                    </validation-provider>
                  </v-col>
                </v-row>
              </v-col>
            </v-card>
          </v-col>
        </v-row>

        <v-divider class="my-6" />

        <v-row>
          <v-col cols="12">
            <div class="font-weight-bold mb-2">
              วิธีการรับหนังสือสำคัญการเป็นสมาชิกสภาการแพทย์แผนไทยและใบอนุญาต
              <span class="red--text">*</span>
            </div>

            <validation-provider
              v-slot="{ errors }"
              name="วิธีการรับหนังสือสำคัญ"
              rules="required"
            >
              <v-radio-group
                v-model="localForm.documentDeliveryMethod"
                :error-messages="errors"
              >
                <v-radio
                  label="จัดส่งทางไปรษณีย์ (ค่าธรรมเนียม 100 บาท)"
                  value="postal"
                />
                <v-radio
                  label="รับด้วยตนเองที่สภาการแพทย์แผนไทย"
                  value="self_pickup"
                />
              </v-radio-group>
            </validation-provider>
          </v-col>
        </v-row>

        <v-divider class="my-6" />

        <div
          class="d-flex flex-wrap"
          :class="$vuetify.breakpoint.smAndDown ? 'flex-column-reverse' : 'justify-end'"
          style="gap: 12px;"
        >
          <v-btn
            color="#4fb24d"
            style="font-size: 16px; font-weight: bold;"
            large
            outlined
            :block="$vuetify.breakpoint.smAndDown"
            @click="backStep"
          >
            <v-icon left>
              mdi-chevron-left
            </v-icon>
            ย้อนกลับ
          </v-btn>

          <v-btn
            style="color: #e6f4e6; font-size: 16px; font-weight: bold; background-color: #4fb24d;"
            large
            :block="$vuetify.breakpoint.smAndDown"
            @click="nextStep"
          >
            ถัดไป
            <v-icon right>
              mdi-chevron-right
            </v-icon>
          </v-btn>
        </div>
      </v-form>
    </validation-observer>
  </v-card>
</template>

<script>
export default {
  name: 'Step3Certificate',

  props: {
    value: {
      type: Object,
      required: true
    }
  },

  data () {
    return {
      professionTouched: false,

      professionList: [
        { value: 'thai_medicine', label: 'วิชาชีพการแพทย์แผนไทย ด้านเวชกรรมไทย' },
        { value: 'thai_pharmacy', label: 'วิชาชีพการแพทย์แผนไทย ด้านเภสัชกรรมไทย' },
        { value: 'thai_midwifery', label: 'วิชาชีพการแพทย์แผนไทย ด้านผดุงครรภ์ไทย' },
        { value: 'thai_massage', label: 'วิชาชีพการแพทย์แผนไทย ด้านนวดไทย' },
        { value: 'folk_medicine', label: 'วิชาชีพการแพทย์แผนไทย ด้านแพทย์พื้นบ้าน' },
        { value: 'thai_applied', label: 'วิชาชีพการแพทย์แผนไทยประยุกต์' }
      ],
      maxFileSizeMB: 2,
      evidenceList: [
        {
          value: 'id_card',
          label: 'สำเนาบัตรประจำตัวประชาชน หรือสำเนาบัตรประจำตัวเจ้าหน้าที่ของรัฐ หรือสำเนาบัตรพนักงานของรัฐ\nหรือหนังสือเดินทาง หรือเอกสารคนต่างด้าว (พร้อมรับรองสำเนาถูกต้อง)',
          required: true,
          accept: 'pdf.'
        },
        {
          value: 'photo',
          label: 'ภาพถ่ายขนาด 1 นิ้วแต่งกายสุภาพหน้าตรง ครึ่งตัวท่าปกติ ไม่สวมหมวก ไม่ใส่แว่นตา ซึ่งถ่ายไว้ไม่เกิน 6 เดือน จำนวน 2 ภาพ\n(ต้องไม่เป็นภาพถ่ายโพลาลอยด์) ต่อด้านที่ขึ้นทะเบียน ไม่รวมที่ติดชุดคำร้อง',
          required: true,
          accept: 'jpg., jpeg.'
        },
        {
          value: 'other_evidence',
          label: 'หลักฐานอื่นๆ (ถ้ามี)',
          required: false,
          accept: 'pdf.'
        }
      ],

      localForm: {
        ...this.value,
        wantMembership: this.value.wantMembership || false,
        documentDeliveryMethod: this.value.documentDeliveryMethod || '',
        professions: {
          thai_medicine: false,
          thai_pharmacy: false,
          thai_midwifery: false,
          thai_massage: false,
          folk_medicine: false,
          thai_applied: false,
          ...(this.value.professions || {})
        },
        evidences: {
          id_card: {
            status: false,
            file: null,
            ...(this.value.evidences?.id_card || {})
          },
          photo: {
            status: false,
            file: null,
            ...(this.value.evidences?.photo || {})
          },
          other_evidence: {
            status: false,
            file: null,
            ...(this.value.evidences?.other_evidence || {})
          }
        }
      }
    }
  },

  computed: {
    availableProfessionList () {
      const declarations = this.localForm.qualification_declarations || {}
      const thaiMedicine = declarations.thai_medicine || {}
      const thaiMedicineData = thaiMedicine.data || {}
      const thaiApplied = declarations.thai_applied || {}

      return this.professionList.filter((profession) => {
        if (profession.value === 'thai_applied') {
          return thaiApplied.status === true
        }

        return thaiMedicine.status === true &&
          thaiMedicineData[profession.value]?.status === true
      })
    },

    availableProfessionValues () {
      return this.availableProfessionList.map(profession => profession.value)
    },

    createObjectURL () {
      return URL.createObjectURL(this.localForm.profileImageFile)
    },

    isProfessionValid () {
      return this.availableProfessionValues.some((profession) => {
        return this.localForm.professions[profession] === true
      })
    },

    showProfessionError () {
      return this.professionTouched && !this.isProfessionValid
    }
  },

  watch: {
    availableProfessionValues: {
      handler (availableValues) {
        Object.keys(this.localForm.professions).forEach((profession) => {
          if (!availableValues.includes(profession)) {
            this.localForm.professions[profession] = false
          }
        })
      },
      immediate: true
    },

    localForm: {
      handler (val) {
        this.$emit('input', val)
      },
      deep: true,
      immediate: true
    }
  },

  methods: {
    async nextStep () {
      this.professionTouched = true

      const formValid = await this.$refs.step3.validate()

      if (!formValid || !this.isProfessionValid) { return }

      this.$emit('next')
    },

    backStep () {
      this.$emit('back')
    },
    acceptAttr (acceptStr) {
      return acceptStr
        .split(',')
        .map(ext => '.' + ext.trim().replace(/\.$/, ''))
        .join(',')
    },

    onAttachmentStatusChange (key, isChecked) {
      if (!isChecked) {
        this.localForm.evidences[key].file = null
      }
    },

    onFileChange (key, file, acceptStr) {
      if (!file) { return }

      const fileSizeMB = file.size / (1024 * 1024)
      if (fileSizeMB > this.maxFileSizeMB) {
        this.localForm.evidences[key].file = null
        return
      }

      const allowedExts = acceptStr
        .split(',')
        .map(ext => ext.trim().replace(/\.$/, '').toLowerCase())
      const fileExt = file.name.split('.').pop().toLowerCase()

      if (!allowedExts.includes(fileExt)) {
        this.localForm.evidences[key].file = null
        return
      }

      this.localForm.evidences[key].file = file
    }
  }
}
</script>

<style scoped>

.v-card{
    border-radius:12px;
}

</style>
