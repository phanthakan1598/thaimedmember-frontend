<template>
  <div>
    <v-row>
      <v-col cols="12">
        <span class="section-heading">ข้าพเจ้ามีความประสงค์ให้สภาการแพทย์แผนไทยดำเนินการเปลี่ยนข้อมูล ดังต่อไปนี้ <span class="red--text">*</span></span>
      </v-col>
      <v-col cols="12">
        <v-card outlined class="pa-4">
          <v-checkbox
            v-for="item in changeTypeItems"
            :key="item.value"
            v-model="form.changeTypes[item.value]"
            :label="item.label"
            dense
            hide-details
            class="py-1"
            @change="onChangeTypeChange"
          />
        </v-card>
        <div v-if="errors.changeTypes" class="red--text error-text mt-2">
          {{ errors.changeTypes }}
        </div>
      </v-col>
    </v-row>

    <v-divider class="my-6" />

    <v-row>
      <v-col cols="12">
        <span class="section-heading">ข้าพเจ้าได้แนบหลักฐานประกอบการพิจารณาดังต่อไปนี้ <span class="red--text">*</span></span>
      </v-col>
      <v-col cols="12">
        <v-card outlined class="pa-4">
          <div v-for="item in visibleEvidenceItems" :key="item.value" class="mb-3">
            <validation-provider v-slot="{ errors: statusErrors }" :name="item.label" rules="mustBeTrue">
              <v-checkbox
                v-model="form.evidences[item.value].status"
                dense
                hide-details
                :error-messages="errors[item.value + 'Status'] || statusErrors"
                @change="onEvidenceStatusChange(item.value, $event)"
              >
                <template #label>
                  <span>{{ item.label }} <span class="red--text">*</span></span>
                </template>
              </v-checkbox>
            </validation-provider>
            <validation-provider v-if="form.evidences[item.value].status" v-slot="{ errors: fileErrors }" :name="item.label" rules="required">
              <v-file-input
                v-model="form.evidences[item.value].file"
                class="pl-md-8 pt-2"
                placeholder="แนบไฟล์เอกสาร"
                :accept="acceptAttr(item.accept)"
                prepend-icon=""
                prepend-inner-icon="mdi-paperclip"
                outlined
                dense
                show-size
                :error-messages="errors[item.value] || fileErrors"
                :hint="`รองรับ ${item.accept.toUpperCase()} ขนาดไม่เกิน 2 MB`"
                persistent-hint
                @change="onFileChange(item.value, $event, item.accept)"
              />
            </validation-provider>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-divider class="my-6" />

    <v-card outlined class="pa-4 fee-summary mb-6">
      <strong>สรุปค่าธรรมเนียม</strong>
      <div class="d-flex justify-space-between mt-2">
        <span>ค่าธรรมเนียมขอเปลี่ยนข้อมูล ({{ selectedCount }} รายการ)</span><span>{{ formatPrice(editFee) }} บาท</span>
      </div>
      <div class="d-flex justify-space-between mt-2">
        <span>ค่าระบบ</span><span>{{ formatPrice(45) }} บาท</span>
      </div>
      <v-divider class="my-3" />
      <div class="d-flex justify-space-between total-price">
        <span>รวม</span><span>{{ formatPrice(totalPrice) }} บาท</span>
      </div>
    </v-card>

    <div class="d-flex justify-end mt-6 form-actions">
      <v-btn large outlined color="#327531" @click="$emit('cancel')">
        ยกเลิก
      </v-btn>
      <v-btn large dark color="#4fb24d" @click="submit">
        บันทึกคำร้อง
      </v-btn>
    </div>
  </div>
</template>

<script>
const evidenceItems = [
  { value: 'id_card', label: 'สำเนาบัตรประจำตัวประชาชน หรือสำเนาบัตรประจำตัวเจ้าหน้าที่ของรัฐ หรือสำเนาบัตรพนักงานของรัฐ หรือหนังสือเดินทาง หรือเอกสารคนต่างด้าว (พร้อมรับรองสำเนา)', conditions: [], accept: 'pdf' },
  { value: 'residence', label: 'สำเนาทะเบียนบ้าน หรือหลักฐานแสดงถิ่นที่อยู่ (พร้อมรับรองสำเนาถูกต้อง)', conditions: ['full_name', 'contact_address', 'rank'], accept: 'pdf' },
  { value: 'registration_receipt', label: 'สำเนาใบเสร็จรับเงินค่าธรรมเนียมขึ้นทะเบียนและรับใบอนุญาต', conditions: ['full_name'], accept: 'pdf' },
  { value: 'professional_license', label: 'ใบอนุญาตเป็นผู้ประกอบวิชาชีพการแพทย์แผนไทย/แพทย์แผนไทยประยุกต์', conditions: ['contact_address', 'rank'], accept: 'pdf' },
  { value: 'license_or_report', label: 'สำเนาหนังสือสำคัญการเป็นสมาชิก/สำเนาใบอนุญาตที่ถูกทำลายหรือหนังสือแจ้งความต่อพนักงานสอบสวนกรณีสูญหาย', conditions: ['full_name'], accept: 'pdf' },
  { value: 'member_card_or_report', label: 'สำเนาบัตรสมาชิกที่ถูกทำลายสาระสำคัญหรือหนังสือแจ้งความต่อพนักงานสอบสวนกรณีสูญหาย', conditions: ['full_name'], accept: 'pdf' },
  { value: 'photo', label: 'ภาพถ่าย ๑ นิ้ว หน้าตรง ครึ่งตัว ท่าปกติ ไม่สวมแว่นตา ไม่สวมหมวก ถ่ายไม่เกิน ๖ เดือน ๒ ภาพ (ไม่เป็นภาพถ่ายโพลาลอยด์)', conditions: ['full_name', 'title_addition'], accept: 'jpg,jpeg' },
  { value: 'approval_document', label: 'สำเนาหนังสือสำคัญการได้รับอนุมัติให้เปลี่ยนชื่อตัว ชื่อสกุล ยศ คำนำหน้านาม การเพิ่มอื่นๆ', conditions: ['rank', 'title_addition'], accept: 'pdf' },
  { value: 'marriage_certificate', label: 'สำเนาทะเบียนสมรสกรณีขอเปลี่ยนชื่อตัว ชื่อสกุลจากการสมรส', conditions: ['rank', 'title_addition'], accept: 'pdf' }
]

export default {
  name: 'RequestEditForm',
  data () {
    return {
      changeTypeItems: [
        { value: 'full_name', label: 'ชื่อ-นามสกุล' },
        { value: 'contact_address', label: 'ที่อยู่ติดต่อ' },
        { value: 'rank', label: 'ยศ' },
        { value: 'title_addition', label: 'การเพิ่มอภิไธย' }
      ],
      form: {
        changeTypes: { full_name: false, contact_address: false, rank: false, title_addition: false },
        evidences: Object.fromEntries(evidenceItems.map(item => [item.value, { status: false, file: null }]))
      },
      errors: {}
    }
  },
  computed: {
    selectedTypes () { return Object.entries(this.form.changeTypes).filter(([, selected]) => selected).map(([key]) => key) },
    selectedCount () { return this.selectedTypes.length },
    visibleEvidenceItems () { return evidenceItems.filter(item => !item.conditions.length || item.conditions.some(key => this.form.changeTypes[key])) },
    editFee () { return this.selectedCount * 200 },
    totalPrice () { return this.editFee + 45 }
  },
  methods: {
    onChangeTypeChange () {
      this.errors = { ...this.errors, changeTypes: this.selectedCount ? '' : 'กรุณาเลือกอย่างน้อย 1 รายการ' }
      const visibleKeys = new Set(this.visibleEvidenceItems.map(item => item.value))
      evidenceItems.forEach((item) => { if (!visibleKeys.has(item.value)) { this.form.evidences[item.value] = { status: false, file: null } } })
    },
    onEvidenceStatusChange (key, selected) { if (!selected) { this.form.evidences[key].file = null } this.errors = { ...this.errors, [key + 'Status']: '', [key]: '' } },
    acceptAttr (accept) { return accept.split(',').map(type => `.${type.trim().replaceAll('.', '')}`).join(',') },
    onFileChange (key, file, accept) { if (!file) { return } const allowed = accept.split(',').map(type => type.trim().replaceAll('.', '').toLowerCase()); const extension = file.name.split('.').pop().toLowerCase(); if (!allowed.includes(extension) || file.size > 2 * 1024 * 1024) { this.form.evidences[key].file = null; this.errors = { ...this.errors, [key]: `รองรับเฉพาะไฟล์ ${accept.toUpperCase()} ขนาดไม่เกิน 2 MB` } } else { this.errors = { ...this.errors, [key]: '' } } },
    validate () { const errors = {}; if (!this.selectedCount) { errors.changeTypes = 'กรุณาเลือกอย่างน้อย 1 รายการ' } this.visibleEvidenceItems.forEach((item) => { const evidence = this.form.evidences[item.value]; if (!evidence.status) { errors[item.value + 'Status'] = 'กรุณาเลือกเอกสารรายการนี้' } if (evidence.status && !evidence.file) { errors[item.value] = 'กรุณาแนบไฟล์เอกสาร' } }); this.errors = errors; return !Object.keys(errors).length },
    submit () { if (this.validate()) { this.$emit('submit', this.form) } },
    formatPrice (value) { return Number(value || 0).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }
  }
}
</script>

<style scoped>
.section-heading { font-size: 24px; font-weight: bold; }
.error-text { font-size: 22px; }
.fee-summary { font-size: 20px; }
.total-price { color: #327531; font-size: 24px; font-weight: bold; }
.form-actions { gap: 12px; }
@media screen and (max-width: 600px) { .section-heading { font-size: 21px; } }
</style>
