<template>
  <div>
    <v-row>
      <v-col cols="12">
        <span style="font-size: 24px; font-weight: bold;">
          ข้าพเจ้าสอบผ่านความรู้ตามที่กำหนดไว้ในข้อบังคับสภาการแพทย์แผนไทย
          <span class="red--text">*</span>
        </span>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" class="py-1">
        <v-card outlined class="pa-4 mb-2">
          <v-checkbox
            v-model="localForm.qualification_declarations.thai_medicine.status"
            label="มีความรู้ในวิชาชีพการแพทย์แผนไทย เพื่อการประกอบวิชาชีพการแพทย์แผนไทย ดังนี้"
            :disabled="hasOriginalThaiMedicineKnowledge"
            dense
            class="py-0"
            hide-details
            @change="onThaiMedicineParentChange"
          />
          <v-row v-if="localForm.qualification_declarations.thai_medicine.status" class="my-3 mx-3">
            <v-col
              v-for="(item, index) in thaiMedicineItems"
              :key="'qual-decl-' + index"
              cols="12"
              class="py-1"
              :class="{ 'disabled-knowledge': isExistingKnowledge(item.value) }"
            >
              <v-checkbox
                v-model="localForm.qualification_declarations.thai_medicine.data[item.value].status"
                :label="item.label"
                :disabled="!isAvailable(item.value)"
                dense
                @change="onKnowledgeChange(item.value, $event)"
              />
              <v-row
                v-if="localForm.qualification_declarations.thai_medicine.data[item.value].status"
                class="px-md-6"
              >
                <v-col cols="12" md="6" class="exam-field-heading">
                  <span class="exam-label">สอบทฤษฎีผ่าน เมื่อวันที่</span>
                  <span class="text--secondary text-caption">(พ.ศ.)</span>
                  <span class="red--text">*</span>
                  <validation-provider
                    v-slot="{ errors: theoryErrors }"
                    :name="'theoryExamDate' + index"
                    rules="required|digits:4"
                  >
                    <v-text-field
                      v-model="localForm.qualification_declarations.thai_medicine.data[item.value].theoryExamDate"
                      placeholder="ระบุปี พ.ศ. (ปปปป)"
                      outlined
                      dense
                      maxlength="4"
                      :disabled="isExistingKnowledge(item.value)"
                      :error-messages="fieldErrors(item.value, 'theoryExamDate', theoryErrors)"
                    />
                  </validation-provider>
                </v-col>
                <v-col cols="12" md="6" class="exam-field-heading">
                  <span class="exam-label">สอบปฏิบัติผ่าน เมื่อวันที่</span>
                  <span class="text--secondary text-caption">(พ.ศ.)</span>
                  <span class="red--text">*</span>
                  <validation-provider
                    v-slot="{ errors: practicalErrors }"
                    :name="'practicalExamDate' + index"
                    rules="required|digits:4"
                  >
                    <v-text-field
                      v-model="localForm.qualification_declarations.thai_medicine.data[item.value].practicalExamDate"
                      placeholder="ระบุปี พ.ศ. (ปปปป)"
                      outlined
                      dense
                      maxlength="4"
                      :disabled="isExistingKnowledge(item.value)"
                      :error-messages="fieldErrors(item.value, 'practicalExamDate', practicalErrors)"
                    />
                  </validation-provider>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card>

        <v-card
          outlined
          class="pa-4 mb-2"
          :class="{ 'disabled-knowledge': isExistingKnowledge('thai_applied') }"
        >
          <v-checkbox
            v-model="localForm.qualification_declarations.thai_applied.status"
            label="มีความรู้ในวิชาชีพการแพทย์แผนไทย เพื่อการประกอบวิชาชีพการแพทย์แผนไทยประยุกต์"
            :disabled="hasOriginalKnowledgeStatus('thai_applied') || !isAvailable('thai_applied')"
            dense
            class="py-0"
            hide-details
            @change="onKnowledgeChange('thai_applied', $event)"
          />
          <v-row v-if="localForm.qualification_declarations.thai_applied.status" class="my-3 mx-3">
            <v-col cols="12" class="py-0 my-0">
              <span style="font-size: 24px;">ผลการสอบ ผ่าน เมื่อวันที่</span>
            </v-col>
            <v-col
              v-for="(item, index) in appliedSteps"
              :key="'step-row-' + index"
              cols="12"
              class="py-1 my-1"
            >
              <v-row>
                <v-col cols="12" md="6" class="py-0 my-0 exam-field-heading">
                  <span class="exam-label">{{ item.label }}</span>
                  <span class="text--secondary text-caption">(พ.ศ.)</span>
                  <span class="red--text">*</span>
                  <validation-provider v-slot="{ errors: stepErrors }" :name="item.value" rules="required|digits:4">
                    <v-text-field
                      v-model="localForm.qualification_declarations.thai_applied[item.value]"
                      placeholder="ระบุปี พ.ศ. (ปปปป)"
                      outlined
                      dense
                      maxlength="4"
                      :disabled="isExistingKnowledge('thai_applied')"
                      :error-messages="fieldErrors('thai_applied', item.value, stepErrors)"
                    />
                  </validation-provider>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <div v-if="errors.knowledge" class="red--text error-text">
      {{ errors.knowledge }}
    </div>
    <v-divider class="my-6" />

    <v-row>
      <v-col cols="12">
        <span class="section-heading">
          ข้าพเจ้ามีความประสงค์ขอขึ้นทะเบียนและรับใบอนุญาต
          <span class="red--text">*</span>
        </span>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-card outlined class="pa-4 mb-1">
          <div
            v-if="!availableProfessionList.length"
            class="grey--text text--darken-1"
            style="font-size: 22px;"
          >
            กรุณาเลือกด้านวิชาชีพและกรอกข้อมูลผลสอบด้านบนให้ครบก่อน
          </div>
          <v-row
            v-for="(item, index) in availableProfessionList"
            :key="'profession-' + index"
          >
            <v-col cols="12" class="py-1 mb-1">
              <v-checkbox
                v-model="form.professions[item.value]"
                :label="item.label"
                dense
                hide-details
                @change="validateProfessionSelection"
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
        <span class="section-heading">
          ข้าพเจ้าได้แนบหลักฐานประกอบการพิจารณาดังต่อไปนี้
          <span class="red--text">*</span>
        </span>
      </v-col>
      <v-col cols="12" class="py-1">
        <v-card outlined class="pa-4 mb-3">
          <v-col
            v-for="(item, index) in evidenceItems"
            :key="'evidence-' + index"
            cols="12"
            class="py-1"
          >
            <validation-provider
              v-slot="{ errors: statusErrors }"
              :name="item.label"
              :rules="item.required ? 'mustBeTrue' : ''"
            >
              <v-checkbox
                v-model="form.evidences[item.value].status"
                dense
                hide-details
                :error-messages="errors[item.value + 'Status'] || statusErrors"
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

            <v-row v-if="form.evidences[item.value].status" class="pl-md-8 pr-2 pt-2">
              <v-col cols="12">
                <validation-provider
                  v-slot="{ errors: fileErrors }"
                  :name="item.value"
                  :rules="item.required ? 'required' : ''"
                >
                  <v-file-input
                    v-model="form.evidences[item.value].file"
                    placeholder="แนบไฟล์เอกสาร"
                    :accept="acceptAttr(item.accept)"
                    prepend-icon=""
                    prepend-inner-icon="mdi-paperclip"
                    outlined
                    dense
                    show-size
                    :error-messages="errors[item.value] || fileErrors"
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
        <span class="section-heading">
          วิธีการรับหนังสือสำคัญการเป็นสมาชิกสภาการแพทย์แผนไทยและใบอนุญาต
          <span class="red--text">*</span>
        </span>
        <v-radio-group v-model="form.documentDeliveryMethod" :error-messages="errors.delivery">
          <v-radio label="จัดส่งทางไปรษณีย์ (ค่าธรรมเนียม 100 บาท)" value="postal" />
          <v-radio label="รับด้วยตนเองที่สภาการแพทย์แผนไทย" value="self_pickup" />
        </v-radio-group>
      </v-col>
    </v-row>
    <v-card v-if="form.documentDeliveryMethod === 'postal'" outlined class="pa-4 mb-6 delivery-address">
      <strong>ที่อยู่สำหรับจัดส่งเอกสาร</strong>
      <div>{{ documentAddressText }}</div>
      <div>โทรศัพท์: {{ value.documentAddress.phone || '-' }}</div>
    </v-card>
    <v-divider class="my-6" />

    <v-card outlined class="pa-4 fee-summary mb-6">
      <strong>สรุปค่าธรรมเนียม</strong>
      <div class="d-flex justify-space-between mt-2">
        <span>ค่าขึ้นทะเบียนและรับใบอนุญาต ({{ selectedCount }} ด้าน)</span>
        <span>{{ formatPrice(selectedCount * 1000) }} บาท</span>
      </div>
      <div class="d-flex justify-space-between mt-2">
        <span>ค่าจัดส่งทางไปรษณีย์</span><span>{{ formatPrice(deliveryFee) }} บาท</span>
      </div>
      <div class="d-flex justify-space-between mt-2">
        <span>ค่าระบบ</span><span>45.00 บาท</span>
      </div>
      <v-divider class="my-3" />
      <div class="d-flex justify-space-between total-price">
        <span>รวม</span><span>{{ formatPrice(totalPrice) }} บาท</span>
      </div>
    </v-card>

    <div
      class="d-flex flex-wrap form-actions"
      :class="$vuetify.breakpoint.smAndDown ? 'flex-column-reverse' : 'justify-end'"
    >
      <v-btn
        outlined
        color="#4fb24d"
        large
        :block="$vuetify.breakpoint.smAndDown"
        class="form-button"
        @click="$emit('cancel')"
      >
        ยกเลิก
      </v-btn>
      <v-btn
        color="#4fb24d"
        dark
        large
        :block="$vuetify.breakpoint.smAndDown"
        class="form-button"
        @click="submit"
      >
        บันทึกคำร้อง
      </v-btn>
    </div>
  </div>
</template>

<script>
const professionItems = [
  { value: 'thai_medicine', label: 'ด้านเวชกรรมไทย' },
  { value: 'thai_pharmacy', label: 'ด้านเภสัชกรรมไทย' },
  { value: 'thai_midwifery', label: 'ด้านผดุงครรภ์ไทย' },
  { value: 'thai_massage', label: 'ด้านนวดไทย' },
  { value: 'folk_medicine', label: 'ด้านแพทย์พื้นบ้าน' },
  { value: 'thai_applied', label: 'วิชาชีพการแพทย์แผนไทยประยุกต์' }
]

export default {
  name: 'RequestLicenseForm',
  props: { value: { type: Object, required: true } },
  data () {
    const original = JSON.parse(JSON.stringify(this.value.qualificationDeclarations || {}))
    const editableDeclarations = JSON.parse(JSON.stringify(original))
    const thaiMedicine = editableDeclarations.thai_medicine || { status: false, data: {} }
    thaiMedicine.data = thaiMedicine.data || {}
    professionItems.filter(item => item.value !== 'thai_applied').forEach((item) => {
      thaiMedicine.data[item.value] = {
        status: false,
        theoryExamDate: '',
        practicalExamDate: '',
        ...(thaiMedicine.data[item.value] || {})
      }
    })
    return {
      professionItems,
      thaiMedicineItems: professionItems.filter(item => item.value !== 'thai_applied'),
      appliedSteps: [
        { value: 'step1Date', label: 'ขั้นตอนที่ 1' },
        { value: 'step2Date', label: 'ขั้นตอนที่ 2' },
        { value: 'step3Date', label: 'ขั้นตอนที่ 3' }
      ],
      evidenceItems: [
        { value: 'id_card', label: 'สำเนาบัตรประจำตัวประชาชน หรือสำเนาบัตรประจำตัวเจ้าหน้าที่ของรัฐ หรือสำเนาบัตรพนักงานของรัฐ หรือหนังสือเดินทาง หรือเอกสารคนต่างด้าว (พร้อมรับรองสำเนาถูกต้อง)', required: true, accept: 'pdf.' },
        { value: 'photo', label: 'ภาพถ่ายขนาด 1 นิ้วแต่งกายสุภาพหน้าตรง ครึ่งตัวท่าปกติ ไม่สวมหมวก ไม่ใส่แว่นตา ซึ่งถ่ายไว้ไม่เกิน 6 เดือน จำนวน 2 ภาพ (ต้องไม่เป็นภาพถ่ายโพลาลอยด์) ต่อด้านที่ขอขึ้นทะเบียน ไม่รวมที่ติดชุดคำร้อง', required: true, accept: 'jpg., jpeg.' },
        { value: 'other_evidence', label: 'หลักฐานอื่นๆ (ถ้ามี)', required: false, accept: 'pdf.' }
      ],
      originalDeclarations: original,
      localForm: {
        qualification_declarations: {
          thai_medicine: thaiMedicine,
          thai_applied: { status: false, step1Date: '', step2Date: '', step3Date: '', ...(editableDeclarations.thai_applied || {}) }
        }
      },
      form: {
        professions: professionItems.reduce((result, item) => {
          result[item.value] = false
          return result
        }, {}),
        evidences: {
          id_card: { status: false, file: null },
          photo: { status: false, file: null },
          other_evidence: { status: false, file: null }
        },
        documentDeliveryMethod: this.value.documentDeliveryMethod || ''
      },
      errors: {}
    }
  },
  computed: {
    hasOriginalThaiMedicineKnowledge () {
      const thaiMedicine = this.originalDeclarations.thai_medicine || {}
      return thaiMedicine.status === true || Object.values(thaiMedicine.data || {}).some(item => item.status === true)
    },
    availableProfessionList () {
      return this.professionItems.filter(item => this.isAvailable(item.value) && this.hasKnowledge(item.value))
    },
    showProfessionError () {
      return Boolean(this.errors.professions)
    },
    selectedCount () {
      return Object.values(this.form.professions).filter(Boolean).length
    },
    knowledgeCount () {
      const thaiMedicineCount = Object.values(
        this.localForm.qualification_declarations.thai_medicine.data
      ).filter(item => item.status).length
      const appliedCount = this.localForm.qualification_declarations.thai_applied.status ? 1 : 0
      return thaiMedicineCount + appliedCount
    },
    totalPrice () {
      return this.selectedCount * 1000 + this.deliveryFee + 45
    },
    deliveryFee () {
      return this.form.documentDeliveryMethod === 'postal' ? 100 : 0
    },
    documentAddressText () {
      const a = this.value.documentAddress || {}
      return [a.address, a.moo && `หมู่ ${a.moo}`, a.building, a.soi && `ซอย ${a.soi}`,
        a.road && `ถนน ${a.road}`, a.subdistrict && `ตำบล/แขวง ${a.subdistrict}`,
        a.district && `อำเภอ/เขต ${a.district}`, a.province && `จังหวัด ${a.province}`, a.zipcode]
        .filter(Boolean).join(' ') || '-'
    }
  },
  methods: {
    isAvailable (profession) {
      return (this.value.availableProfessions || []).includes(profession)
    },
    isExistingKnowledge (profession) {
      if (profession === 'thai_applied') {
        const knowledge = this.originalDeclarations.thai_applied || {}
        return knowledge.status === true &&
          this.validYear(knowledge.step1Date) &&
          this.validYear(knowledge.step2Date) &&
          this.validYear(knowledge.step3Date)
      }
      const knowledge = this.originalDeclarations.thai_medicine?.data?.[profession] || {}
      return knowledge.status === true &&
        this.validYear(knowledge.theoryExamDate) &&
        this.validYear(knowledge.practicalExamDate)
    },
    hasOriginalKnowledgeStatus (profession) {
      if (profession === 'thai_applied') { return this.originalDeclarations.thai_applied?.status === true }
      return this.originalDeclarations.thai_medicine?.data?.[profession]?.status === true
    },
    hasKnowledge (profession) {
      if (profession === 'thai_applied') {
        const knowledge = this.localForm.qualification_declarations.thai_applied
        return knowledge.status &&
          this.validYear(knowledge.step1Date) &&
          this.validYear(knowledge.step2Date) &&
          this.validYear(knowledge.step3Date)
      }
      const knowledge = this.localForm.qualification_declarations.thai_medicine.data[profession]
      return knowledge.status &&
        this.validYear(knowledge.theoryExamDate) &&
        this.validYear(knowledge.practicalExamDate)
    },
    onThaiMedicineParentChange (selected) {
      if (!selected) {
        this.thaiMedicineItems.forEach((item) => {
          if (!this.isExistingKnowledge(item.value)) {
            const knowledge = this.localForm.qualification_declarations.thai_medicine.data[item.value]
            knowledge.status = false
            knowledge.theoryExamDate = ''
            knowledge.practicalExamDate = ''
            this.form.professions[item.value] = false
          }
        })
      }
      this.validateKnowledgeSelection()
    },
    onKnowledgeChange (profession, selected) {
      if (!selected) { this.form.professions[profession] = false }
      this.validateKnowledgeSelection()
      this.validateProfessionSelection()
    },
    validateKnowledgeSelection () {
      this.$nextTick(() => {
        this.errors = {
          ...this.errors,
          knowledge: this.knowledgeCount < 1 ? 'กรุณาเพิ่มข้อมูลอย่างน้อย 1 อย่าง' : ''
        }
      })
    },
    validateProfessionSelection () {
      this.$nextTick(() => {
        this.errors = {
          ...this.errors,
          professions: this.selectedCount < 1 ? 'กรุณาเลือกอย่างน้อย 1 ด้าน' : ''
        }
      })
    },
    onAttachmentStatusChange (key, selected) {
      if (!selected) { this.form.evidences[key].file = null }
      this.errors = { ...this.errors, [key + 'Status']: '', [key]: '' }
    },
    acceptAttr (accept) {
      return accept.split(',').map(type => '.' + type.trim().replaceAll('.', '')).join(',')
    },
    onFileChange (key, file, accept) {
      if (!file) { return }
      const extension = file.name.split('.').pop().toLowerCase()
      const allowed = accept.split(',').map(type => type.trim().replaceAll('.', '').toLowerCase())
      if (!allowed.includes(extension) || file.size > 2 * 1024 * 1024) {
        this.form.evidences[key].file = null
        this.errors = { ...this.errors, [key]: 'ชนิดไฟล์ไม่ถูกต้องหรือไฟล์มีขนาดเกิน 2 MB' }
      } else {
        this.errors = { ...this.errors, [key]: '' }
      }
    },
    fieldErrors (profession, field, providerErrors) {
      return this.errors[`knowledge_${profession}_${field}`] || providerErrors
    },
    validYear (value) {
      return /^\d{4}$/.test(value || '')
    },
    validate () {
      const errors = {}
      if (this.knowledgeCount < 1) { errors.knowledge = 'กรุณาเพิ่มข้อมูลอย่างน้อย 1 อย่าง' }
      if (!this.selectedCount) { errors.professions = 'กรุณาเลือกอย่างน้อย 1 ด้าน' }
      Object.entries(this.form.professions).forEach(([profession, selected]) => {
        if (!selected || this.isExistingKnowledge(profession)) { return }
        const data = profession === 'thai_applied'
          ? this.localForm.qualification_declarations.thai_applied
          : this.localForm.qualification_declarations.thai_medicine.data[profession]
        const fields = profession === 'thai_applied'
          ? ['step1Date', 'step2Date', 'step3Date']
          : ['theoryExamDate', 'practicalExamDate']
        fields.forEach((field) => {
          if (!this.validYear(data[field])) { errors[`knowledge_${profession}_${field}`] = 'กรุณากรอกปี พ.ศ. 4 หลัก' }
        })
      })
      this.evidenceItems.filter(item => item.required).forEach((item) => {
        const evidence = this.form.evidences[item.value]
        if (!evidence.status) { errors[item.value + 'Status'] = 'กรุณาเลือกเอกสารรายการนี้' }
        if (evidence.status && !evidence.file) { errors[item.value] = 'กรุณาแนบไฟล์เอกสาร' }
      })
      if (!this.form.documentDeliveryMethod) { errors.delivery = 'กรุณาเลือกวิธีรับเอกสาร' }
      this.errors = errors
      return !Object.keys(errors).length
    },
    submit () {
      if (this.validate()) {
        this.$emit('submit', {
          ...this.form,
          qualificationDeclarations: this.localForm.qualification_declarations
        })
      }
    },
    formatPrice (value) {
      return Number(value || 0).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    }
  }
}
</script>

<style scoped>
.section-heading { font-size: 24px; font-weight: bold; }
.exam-label { font-size: 24px; }
.exam-field-heading > span { font-size: 24px !important; }
.error-text { font-size: 22px; }
.delivery-address { color: #424242; font-size: 19px; }
.fee-summary { font-size: 20px; }
.total-price { color: #327531; font-size: 24px; font-weight: bold; }
.form-actions { gap: 12px; }
.form-button { font-size: 16px; font-weight: bold; }
@media screen and (max-width: 600px) {
  .section-heading,
  .exam-label,
  .exam-field-heading > span { font-size: 22px !important; }
}
</style>
