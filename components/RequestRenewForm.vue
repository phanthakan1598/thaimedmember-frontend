<template>
  <div>
    <v-row>
      <v-col cols="12">
        <span class="section-heading">ข้อมูลสมาชิก</span>
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field :value="value.memberNumber" label="เลขสมาชิก" outlined disabled />
      </v-col>
    </v-row>
    <v-divider class="my-6" />
    <v-row>
      <v-col cols="12">
        <span class="section-heading">ขอทำบัตรสมาชิกสภาการแพทย์แผนไทย เนื่องจาก <span class="red--text">*</span></span>
      </v-col>
      <v-col cols="12">
        <v-card outlined class="pa-4">
          <v-radio-group v-model="form.reason" :error-messages="errors.reason" @change="onReasonChange">
            <v-radio v-for="item in reasonItems" :key="item.value" :label="item.label" :value="item.value" />
          </v-radio-group>
          <validation-provider v-if="form.reason === 'lost'" v-slot="{ errors: lostDateErrors }" name="วันที่บัตรสูญหาย" rules="required">
            <v-text-field
              v-model="form.lostDate"
              type="date"
              label="วันที่บัตรสูญหาย"
              outlined
              :error-messages="errors.lostDate || lostDateErrors"
              @input="errors = { ...errors, lostDate: '' }"
            />
          </validation-provider>
        </v-card>
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
            <validation-provider v-slot="{ errors: statusErrors }" :name="item.label" :rules="item.required ? 'mustBeTrue' : ''">
              <v-checkbox v-model="form.evidences[item.value].status" dense hide-details :error-messages="errors[item.value + 'Status'] || statusErrors" @change="onEvidenceStatusChange(item.value, $event)">
                <template #label>
                  <span>{{ item.label }} <span v-if="item.required" class="red--text">*</span></span>
                </template>
              </v-checkbox>
            </validation-provider>
            <validation-provider v-if="form.evidences[item.value].status" v-slot="{ errors: fileErrors }" :name="item.label" :rules="item.required ? 'required' : ''">
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

    <v-row>
      <v-col cols="12">
        <v-card outlined class="pa-4 physical-docs-note">
          <div class="physical-docs-note__title">
            <v-icon color="#327531" class="mr-2">mdi-information-outline</v-icon>
            เอกสารที่ต้องจัดส่งตัวจริงมายังสภาการแพทย์แผนไทย
          </div>
          <ul class="physical-docs-note__list">
            <li>ใบคำร้องขอต่ออายุบัตรสมาชิก/ขอบัตรสมาชิก จำนวน 1 ฉบับ</li>
            <li>สำเนาบัตรประชาชน (รับรองสำเนาถูกต้อง) จำนวน 1 ฉบับ</li>
            <li>สำเนาใบประกอบวิชาชีพ (รับรองสำเนาถูกต้อง) จำนวน 1 ฉบับ</li>
            <li>บัตรสมาชิกตัวจริง (กรณีบัตรสูญหาย ให้แนบใบแจ้งความมาเป็นหลักฐาน)</li>
            <li>รูปถ่าย ขนาด 1 นิ้ว จำนวน 2 รูป (ภาพสี แต่งกายชุดข้าราชการหรือชุดสุภาพ หน้าตรง ครึ่งตัว ท่าปกติ ไม่สวมหมวก ไม่สวมแว่นตาดำ และถ่ายไว้ไม่เกิน 6 เดือน)</li>
            <li>สำเนาหลักฐานการชำระค่าธรรมเนียม</li>
            <li>เอกสารอื่นๆ ตามกรณี (สำเนาทะเบียนบ้านหรือหลักฐานแสดงถิ่นที่อยู่ กรณีเปลี่ยนที่อยู่ติดต่อ / สำเนาหนังสือสำคัญการได้รับอนุมัติให้เปลี่ยนคำนำหน้า หรือยศ กรณีแก้ไขยศ)</li>
          </ul>
          <div class="physical-docs-note__contact">
            หากมีข้อสงสัย ติดต่อ 025-801-157 ต่อ 16
          </div>
        </v-card>
      </v-col>
    </v-row>
    <v-divider class="my-6" />
    <v-row>
      <v-col cols="12">
        <span class="section-heading">วิธีการรับเอกสาร <span class="red--text">*</span></span>
        <v-radio-group v-model="form.documentDeliveryMethod" :error-messages="errors.delivery" @change="errors = { ...errors, delivery: '' }">
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
        <span>ค่าบัตรสมาชิก</span><span>{{ formatPrice(100) }} บาท</span>
      </div>
      <div class="d-flex justify-space-between mt-2">
        <span>ค่าจัดส่งทางไปรษณีย์</span><span>{{ formatPrice(deliveryFee) }} บาท</span>
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
  { value: 'id_card', label: 'สำเนาบัตรประจำตัวประชาชน หรือสำเนาบัตรประจำตัวเจ้าหน้าที่ของรัฐ หรือเอกสารอื่นที่ทางราชการออกให้ซึ่งยังไม่หมดอายุ (พร้อมรับรองสำเนาถูกต้อง)', reasons: [], required: true, accept: 'pdf' },
  { value: 'residence', label: 'สำเนาทะเบียนบ้าน (พร้อมรับรองสำเนาถูกต้อง)', reasons: [], required: true, accept: 'pdf' },
  { value: 'professional_license', label: 'สำเนาใบอนุญาตผู้ประกอบวิชาชีพการแพทย์แผนไทย/การแพทย์แผนไทยประยุกต์ (พร้อมรับรองสำเนาถูกต้อง)', reasons: [], required: true, accept: 'pdf' },
  { value: 'photo', label: 'ภาพถ่าย 1 นิ้ว หน้าตรง ครึ่งตัว ท่าปกติ ไม่สวมแว่นดำ ไม่สวมหมวก ถ่ายไม่เกิน 6 เดือน จำนวน 2 ภาพ', reasons: [], required: true, accept: 'jpg,jpeg' },
  { value: 'member_card_original', label: 'บัตรสมาชิกสภาการแพทย์แผนไทยตัวจริง', reasons: ['expired', 'damaged'], required: true, accept: 'pdf' },
  { value: 'police_report', label: 'ใบแจ้งความกรณีบัตรสมาชิกสภาการแพทย์แผนไทยสูญหาย', reasons: ['lost'], required: true, accept: 'pdf' },
  { value: 'expired_member_card', label: 'กรณีบัตรสมาชิกหมดอายุยื่นต่อบัตร แนบบัตรสมาชิกสภาการแพทย์แผนไทยตัวจริง', reasons: ['expired'], required: true, accept: 'pdf' },
  { value: 'other_evidence', label: 'เอกสารหลักฐานอื่น ๆ เช่น การเปลี่ยนชื่อตัว ชื่อสกุล (ถ้ามี) พร้อมรับรองสำเนาถูกต้อง', reasons: [], required: false, accept: 'pdf' }
]
export default {
  name: 'RequestRenewForm',
  props: { value: { type: Object, required: true } },
  data () { return { form: { reason: '', lostDate: '', documentDeliveryMethod: this.value.documentDeliveryMethod || '', evidences: Object.fromEntries(evidenceItems.map(item => [item.value, { status: false, file: null }])) }, reasonItems: [{ value: 'new_card', label: 'ทำบัตรใหม่ (สำหรับสมาชิกที่เคยขึ้นทะเบียนแล้ว แต่ยังไม่ได้รับบัตรสมาชิก)' }, { value: 'expired', label: 'บัตรเดิมหมดอายุ' }, { value: 'damaged', label: 'ชำรุด' }, { value: 'lost', label: 'สูญหาย' }], errors: {} } },
  computed: {
    visibleEvidenceItems () { return evidenceItems.filter(item => !item.reasons.length || item.reasons.includes(this.form.reason)) },
    deliveryFee () { return this.form.documentDeliveryMethod === 'postal' ? 100 : 0 },
    totalPrice () { return 100 + 45 + this.deliveryFee },
    documentAddressText () { const a = this.value.documentAddress || {}; return [a.address, a.moo && `หมู่ ${a.moo}`, a.building, a.soi && `ซอย ${a.soi}`, a.road && `ถนน ${a.road}`, a.subdistrict, a.district, a.province, a.zipcode].filter(Boolean).join(' ') || '-' }
  },
  methods: {
    onReasonChange () { this.errors = { ...this.errors, reason: '', lostDate: '' }; if (this.form.reason !== 'lost') { this.form.lostDate = '' } const visible = new Set(this.visibleEvidenceItems.map(item => item.value)); evidenceItems.forEach((item) => { if (!visible.has(item.value)) { this.form.evidences[item.value] = { status: false, file: null } } }) },
    onEvidenceStatusChange (key, selected) { if (!selected) { this.form.evidences[key].file = null } this.errors = { ...this.errors, [key + 'Status']: '', [key]: '' } },
    acceptAttr (accept) { return accept.split(',').map(type => `.${type}`).join(',') },
    onFileChange (key, file, accept) {
      if (!file) { return }
      const allowed = accept.split(',')
      const extension = file.name.split('.').pop().toLowerCase()
      if (!allowed.includes(extension) || file.size > 2 * 1024 * 1024) {
        this.form.evidences[key].file = null
        this.errors = { ...this.errors, [key]: `รองรับเฉพาะไฟล์ ${accept.toUpperCase()} ขนาดไม่เกิน 2 MB` }
      } else {
        this.errors = { ...this.errors, [key]: '' }
      }
    },
    validate () { const errors = {}; if (!this.form.reason) { errors.reason = 'กรุณาเลือกเหตุผลการขอบัตรสมาชิก' } if (this.form.reason === 'lost' && !this.form.lostDate) { errors.lostDate = 'กรุณาระบุวันที่บัตรสูญหาย' } this.visibleEvidenceItems.forEach((item) => { const evidence = this.form.evidences[item.value]; if (item.required && !evidence.status) { errors[item.value + 'Status'] = 'กรุณาเลือกเอกสารรายการนี้' } if (evidence.status && !evidence.file) { errors[item.value] = 'กรุณาแนบไฟล์เอกสาร' } }); if (!this.form.documentDeliveryMethod) { errors.delivery = 'กรุณาเลือกวิธีรับเอกสาร' } this.errors = errors; return !Object.keys(errors).length },
    submit () { if (this.validate()) { this.$emit('submit', this.form) } },
    formatPrice (value) { return Number(value || 0).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }
  }
}
</script>

<style scoped>
.section-heading { font-size: 24px; font-weight: bold; }
.delivery-address { color: #424242; font-size: 19px; }
.fee-summary { font-size: 20px; }
.total-price { color: #327531; font-size: 24px; font-weight: bold; }
.form-actions { gap: 12px; }
.physical-docs-note { border-color: #327531 !important; }
.physical-docs-note__title { display: flex; align-items: center; margin-bottom: 10px; color: #327531; font-size: 22px; font-weight: bold; }
.physical-docs-note__list { margin: 0 0 10px; padding-left: 22px; color: #424242; font-size: 19px; line-height: 1.6; }
.physical-docs-note__contact { color: #424242; font-size: 19px; font-weight: bold; }
@media screen and (max-width: 600px) {
  .section-heading { font-size: 21px; }
  .physical-docs-note__title { font-size: 20px; }
  .physical-docs-note__list, .physical-docs-note__contact { font-size: 17px; }
}
</style>
