<template>
  <div>
    <v-row>
      <v-col cols="12">
        <span class="section-heading">ข้าพเจ้ามีความประสงค์ขอใบแทนใบอนุญาตในด้าน <span class="red--text">*</span></span>
      </v-col>
      <v-col cols="12">
        <v-alert v-if="!hasLicenses" type="warning" outlined prominent>
          ไม่พบข้อมูลใบอนุญาต ท่านยังไม่สามารถยื่นคำร้องขอใบแทนได้
        </v-alert>
        <v-card v-else outlined class="pa-4">
          <v-checkbox
            v-for="item in availableProfessionList"
            :key="item.value"
            v-model="form.professions[item.value]"
            :label="`${item.label} (เลขใบอนุญาต ${item.licenseNumber})`"
            dense
            hide-details
            class="py-1"
            @change="validateProfessionSelection"
          />
        </v-card>
        <div v-if="errors.professions" class="red--text error-text mt-2">
          {{ errors.professions }}
        </div>
      </v-col>
    </v-row>

    <v-divider class="my-6" />
    <v-row>
      <v-col cols="12">
        <span class="section-heading">ข้าพเจ้ามีความประสงค์ให้ดำเนินการด้านทะเบียนสมาชิกและใบอนุญาต ดังต่อไปนี้ <span class="red--text">*</span></span>
      </v-col>
      <v-col cols="12">
        <v-card outlined class="pa-4">
          <v-checkbox :input-value="true" disabled label="ขอใบแทนหนังสือสำคัญการเป็นสมาชิก/ใบแทนใบอนุญาต เนื่องจาก" dense hide-details />
          <validation-provider v-slot="{ errors: reasonErrors }" name="สาเหตุการขอใบแทน" rules="required">
            <v-radio-group v-model="form.reason" class="ml-md-4" :error-messages="errors.reason || reasonErrors" @change="clearReasonError">
              <v-radio label="ชำรุด" value="damaged" />
              <v-radio label="สูญหาย" value="lost" />
            </v-radio-group>
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
          <div v-for="item in evidenceItems" :key="item.value" class="mb-3">
            <validation-provider v-slot="{ errors: statusErrors }" :name="item.label" rules="mustBeTrue">
              <v-checkbox
                v-model="form.evidences[item.value].status"
                dense
                hide-details
                :error-messages="errors[item.value + 'Status'] || statusErrors"
                @change="onEvidenceStatusChange(item.value, $event)"
              >
                <template #label>
                  <span>{{ evidenceLabel(item) }} <span class="red--text">*</span></span>
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
                hint="รองรับ PDF, JPG, JPEG ขนาดไม่เกิน 2 MB"
                persistent-hint
                @change="onFileChange(item.value, $event, item.accept)"
              />
            </validation-provider>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-divider class="my-6" />
    <v-row>
      <v-col cols="12">
        <span class="section-heading">วิธีการรับเอกสาร <span class="red--text">*</span></span>
        <v-radio-group v-model="form.documentDeliveryMethod" :error-messages="errors.delivery" @change="clearDeliveryError">
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
        <span>ค่าธรรมเนียมใบแทน ({{ selectedCount }} ด้าน)</span><span>{{ formatPrice(replacementFee) }} บาท</span>
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
      <v-btn large dark color="#4fb24d" :disabled="!hasLicenses" @click="submit">
        บันทึกคำร้อง
      </v-btn>
    </div>
  </div>
</template>

<script>
const professionLabels = {
  thai_medicine: 'วิชาชีพการแพทย์แผนไทย ด้านเวชกรรมไทย',
  thai_pharmacy: 'วิชาชีพการแพทย์แผนไทย ด้านเภสัชกรรมไทย',
  thai_midwifery: 'วิชาชีพการแพทย์แผนไทย ด้านผดุงครรภ์ไทย',
  thai_massage: 'วิชาชีพการแพทย์แผนไทย ด้านนวดไทย',
  folk_medicine: 'วิชาชีพการแพทย์แผนไทย ด้านแพทย์พื้นบ้าน',
  thai_applied: 'วิชาชีพการแพทย์แผนไทยประยุกต์'
}

export default {
  name: 'RequestReplacementForm',
  props: { value: { type: Object, required: true } },
  data () {
    const licensed = (this.value.licenseNumbers || []).filter(item => String(item.licenseNumber || '').trim())
    return {
      form: {
        professions: licensed.reduce((result, item) => { result[item.professionType] = false; return result }, {}),
        reason: '',
        evidences: {
          id_card: { status: false, file: null },
          residence: { status: false, file: null },
          license_evidence: { status: false, file: null },
          photo: { status: false, file: null }
        },
        documentDeliveryMethod: this.value.documentDeliveryMethod || ''
      },
      evidenceItems: [
        { value: 'id_card', label: 'สำเนาบัตรประจำตัวประชาชน หรือสำเนาบัตรประจำตัวเจ้าหน้าที่ของรัฐ หรือสำเนาบัตรพนักงานของรัฐ หรือหนังสือเดินทาง หรือเอกสารคนต่างด้าว (พร้อมรับรองสำเนาถูกต้อง)', accept: 'pdf,jpg,jpeg' },
        { value: 'residence', label: 'สำเนาทะเบียนบ้าน หรือหลักฐานแสดงถิ่นที่อยู่ (พร้อมรับรองสำเนาถูกต้อง)', accept: 'pdf,jpg,jpeg' },
        { value: 'license_evidence', label: 'สำเนาหนังสือสำคัญการเป็นสมาชิก/สำเนาใบอนุญาตที่ถูกทำลาย หรือหนังสือแจ้งความต่อพนักงานสอบสวนกรณีสูญหาย', accept: 'pdf,jpg,jpeg' },
        { value: 'photo', label: 'ภาพถ่าย 1 นิ้ว หน้าตรง ครึ่งตัว ท่าปกติ ไม่สวมแว่นตา ไม่สวมหมวก ถ่ายไม่เกิน 6 เดือน จำนวน 2 ภาพ (ไม่เป็นภาพถ่ายโพลาลอยด์)', accept: 'jpg,jpeg' }
      ],
      errors: {}
    }
  },
  computed: {
    availableProfessionList () {
      const unique = new Map()
      ;(this.value.licenseNumbers || []).forEach((item) => {
        if (item.professionType && String(item.licenseNumber || '').trim() && !unique.has(item.professionType)) {
          unique.set(item.professionType, { value: item.professionType, label: professionLabels[item.professionType] || item.professionType, licenseNumber: item.licenseNumber })
        }
      })
      return [...unique.values()]
    },
    hasLicenses () { return this.availableProfessionList.length > 0 },
    selectedCount () { return Object.values(this.form.professions).filter(Boolean).length },
    replacementFee () { return this.selectedCount * 500 },
    deliveryFee () { return this.form.documentDeliveryMethod === 'postal' ? 100 : 0 },
    totalPrice () { return this.replacementFee + this.deliveryFee + 45 },
    documentAddressText () {
      const a = this.value.documentAddress || {}
      return [a.address, a.moo && `หมู่ ${a.moo}`, a.building, a.soi && `ซอย ${a.soi}`, a.road && `ถนน ${a.road}`, a.subdistrict, a.district, a.province, a.zipcode].filter(Boolean).join(' ') || '-'
    }
  },
  methods: {
    evidenceLabel (item) {
      if (item.value === 'license_evidence' && this.form.reason === 'damaged') {
        return 'สำเนาบัตรสมาชิกที่ถูกทำลาย หรือหนังสือแจ้งความกรณีสูญหาย'
      }
      if (item.value === 'license_evidence' && this.form.reason === 'lost') {
        return 'สำเนาหนังสือสำคัญการเป็นสมาชิก/สำเนาใบอนุญาตที่ถูกทำลาย หรือหนังสือแจ้งความกรณีสูญหาย'
      }
      return item.label
    },
    validateProfessionSelection () { this.errors = { ...this.errors, professions: this.selectedCount ? '' : 'กรุณาเลือกอย่างน้อย 1 ด้าน' } },
    clearReasonError () { this.errors = { ...this.errors, reason: '' } },
    clearDeliveryError () { this.errors = { ...this.errors, delivery: '' } },
    onEvidenceStatusChange (key, selected) { if (!selected) { this.form.evidences[key].file = null } this.errors = { ...this.errors, [key + 'Status']: '', [key]: '' } },
    acceptAttr (accept) { return accept.split(',').map(type => '.' + type.trim().replaceAll('.', '')).join(',') },
    onFileChange (key, file, accept) {
      if (!file) { return }
      const allowed = accept.split(',').map(type => type.trim().replaceAll('.', '').toLowerCase())
      const extension = file.name.split('.').pop().toLowerCase()
      if (!allowed.includes(extension) || file.size > 2 * 1024 * 1024) { this.form.evidences[key].file = null; this.errors = { ...this.errors, [key]: 'ชนิดไฟล์ไม่ถูกต้องหรือไฟล์มีขนาดเกิน 2 MB' } } else { this.errors = { ...this.errors, [key]: '' } }
    },
    validate () {
      const errors = {}
      if (!this.hasLicenses) { errors.professions = 'ไม่พบข้อมูลใบอนุญาต' } else if (!this.selectedCount) { errors.professions = 'กรุณาเลือกอย่างน้อย 1 ด้าน' }
      if (!this.form.reason) { errors.reason = 'กรุณาเลือกสาเหตุการขอใบแทน' }
      this.evidenceItems.forEach((item) => { const evidence = this.form.evidences[item.value]; if (!evidence.status) { errors[item.value + 'Status'] = 'กรุณาเลือกเอกสารรายการนี้' } if (evidence.status && !evidence.file) { errors[item.value] = 'กรุณาแนบไฟล์เอกสาร' } })
      if (!this.form.documentDeliveryMethod) { errors.delivery = 'กรุณาเลือกวิธีรับเอกสาร' }
      this.errors = errors
      return !Object.keys(errors).length
    },
    submit () { if (this.validate()) { this.$emit('submit', this.form) } },
    formatPrice (value) { return Number(value || 0).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }
  }
}
</script>

<style scoped>
.section-heading { font-size: 24px; font-weight: bold; }
.error-text { font-size: 22px; }
.delivery-address { color: #424242; font-size: 19px; }
.fee-summary { font-size: 20px; }
.total-price { color: #327531; font-size: 24px; font-weight: bold; }
.form-actions { gap: 12px; }
@media screen and (max-width: 600px) { .section-heading { font-size: 21px; } }
</style>
