<template>
  <div>
    <v-row>
      <v-col cols="12">
        <span class="section-heading">ข้าพเจ้ามีความประสงค์ขอหนังสือรับรองการขึ้นทะเบียนเป็นผู้ประกอบวิชาชีพการแพทย์แผนไทย/แพทย์แผนไทยประยุกต์ <span class="red--text">*</span></span>
      </v-col>
      <v-col cols="12">
        <v-alert v-if="!hasLicenses" type="warning" outlined prominent>
          ไม่พบข้อมูลใบอนุญาต ท่านยังไม่สามารถยื่นคำร้องขอหนังสือรับรองได้
        </v-alert>
        <v-card v-else outlined class="pa-4">
          <v-checkbox
            v-for="item in availableProfessionList"
            :key="item.value"
            v-model="form.professions[item.value]"
            :label="`${item.label} (เลขใบอนุญาต ${item.licenseNumber})`"
            :disabled="Boolean(item.licenseNumber)"
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

    <v-row class="mt-2">
      <v-col class="py-0" cols="12" sm="4" md="3">
        <validation-provider v-slot="{ errors: quantityErrors }" name="จำนวนฉบับ" rules="required|numeric|min_value:1">
          <v-text-field
            v-model.number="form.quantity"
            type="number"
            min="1"
            label="จำนวนฉบับ"
            suffix="ฉบับ"
            outlined
            dense
            :error-messages="errors.quantity || quantityErrors"
          />
        </validation-provider>
      </v-col>
      <v-col cols="12" class="py-0">
        <v-card outlined class="pa-4 mb-3">
          <span class="field-heading">ใช้เพื่อ</span>
          <validation-provider v-slot="{ errors: purposeErrors }" name="วัตถุประสงค์" rules="required">
            <v-radio-group
              v-model="form.purpose.type"
              :error-messages="errors.purpose || purposeErrors"
              class="mt-1"
              @change="onPurposeChange"
            >
              <v-radio label="ศึกษาต่อ" value="education" />
              <v-radio label="ปฏิบัติงาน" value="work" />
              <v-radio label="อื่น ๆ (ระบุ)" value="other" />
            </v-radio-group>
          </validation-provider>
          <validation-provider
            v-if="form.purpose.type === 'other'"
            v-slot="{ errors: purposeOtherErrors }"
            name="วัตถุประสงค์อื่น ๆ"
            rules="required"
          >
            <v-text-field
              v-model="form.purpose.other"
              label="โปรดระบุวัตถุประสงค์"
              outlined
              dense
              :error-messages="errors.purposeOther || purposeOtherErrors"
              @input="errors.purposeOther = ''"
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
      <v-col cols="12" class="py-1">
        <v-card outlined class="pa-4 mb-3">
          <v-col v-for="item in evidenceItems" :key="item.value" cols="12" class="py-1">
            <validation-provider v-slot="{ errors: statusErrors }" :name="item.label" rules="mustBeTrue">
              <v-checkbox
                v-model="form.evidences[item.value].status"
                dense
                hide-details
                :error-messages="errors[item.value + 'Status'] || statusErrors"
                class="py-0"
                @change="onAttachmentStatusChange(item.value, $event)"
              >
                <template #label>
                  <span>{{ item.label }} <span class="red--text">*</span></span>
                </template>
              </v-checkbox>
            </validation-provider>
            <v-row v-if="form.evidences[item.value].status" class="pl-md-8 pr-2 pt-2">
              <v-col cols="12">
                <validation-provider v-slot="{ errors: fileErrors }" :name="item.value" rules="required">
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
        <span class="section-heading">วิธีการรับหนังสือรับรอง <span class="red--text">*</span></span><v-radio-group v-model="form.documentDeliveryMethod" :error-messages="errors.delivery">
          <v-radio label="จัดส่งทางไปรษณีย์ (ค่าธรรมเนียม 100 บาท)" value="postal" /><v-radio label="จัดส่งเป็นไฟล์ทาง E-mail" value="self_pickup" />
        </v-radio-group>
      </v-col>
    </v-row>
    <v-card v-if="form.documentDeliveryMethod === 'postal'" outlined class="pa-4 mb-6 delivery-address">
      <strong>ที่อยู่สำหรับจัดส่งเอกสาร</strong><div>{{ documentAddressText }}</div><div>โทรศัพท์: {{ value.documentAddress.phone || '-' }}</div>
    </v-card>
    <v-divider class="my-6" />

    <v-card outlined class="pa-4 fee-summary mb-6">
      <strong>สรุปค่าธรรมเนียม</strong>
      <div class="d-flex justify-space-between mt-2">
        <span>ค่าหนังสือรับรอง ({{ validQuantity }} ฉบับ)</span><span>{{ formatPrice(certificateFee) }} บาท</span>
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

    <div class="d-flex flex-wrap form-actions" :class="$vuetify.breakpoint.smAndDown ? 'flex-column-reverse' : 'justify-end'">
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
        :disabled="!hasLicenses"
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
const professionLabels = {
  thai_medicine: 'วิชาชีพการแพทย์แผนไทย ด้านเวชกรรมไทย',
  thai_pharmacy: 'วิชาชีพการแพทย์แผนไทย ด้านเภสัชกรรมไทย',
  thai_midwifery: 'วิชาชีพการแพทย์แผนไทย ด้านผดุงครรภ์ไทย',
  thai_massage: 'วิชาชีพการแพทย์แผนไทย ด้านนวดไทย',
  folk_medicine: 'วิชาชีพการแพทย์แผนไทย ด้านแพทย์พื้นบ้าน',
  thai_applied: 'วิชาชีพการแพทย์แผนไทย ด้านประยุกต์'
}

export default {
  name: 'RequestCertificateForm',
  props: { value: { type: Object, required: true } },
  data () {
    return {
      evidenceItems: [
        { value: 'id_card', label: 'สำเนาบัตรประจำตัวประชาชน หรือสำเนาบัตรประจำตัวเจ้าหน้าที่ของรัฐ หรือสำเนาบัตรพนักงานของรัฐ หรือหนังสือเดินทาง หรือเอกสารคนต่างด้าว (พร้อมรับรองสำเนาถูกต้อง)', accept: 'pdf.' },
        { value: 'residence', label: 'สำเนาทะเบียนบ้าน หรือหลักฐานแสดงถิ่นที่อยู่ (พร้อมรับรองสำเนาถูกต้อง)', accept: 'pdf.' },
        { value: 'payment_receipt', label: 'สำเนาใบเสร็จรับเงินค่าธรรมเนียมขึ้นทะเบียนและรับใบอนุญาต', accept: 'pdf.' },
        { value: 'photo', label: 'ภาพถ่าย 1 นิ้ว หน้าตรง ครึ่งตัว ท่าปกติ ไม่สวมแว่นตา ไม่สวมหมวก ถ่ายไม่เกิน 6 เดือน จำนวน 2 ภาพ', accept: 'jpg., jpeg.' }
      ],
      form: {
        professions: (this.value.licenseNumbers || []).reduce((result, item) => { result[item.professionType] = Boolean(item.licenseNumber); return result }, {}),
        quantity: 1,
        purpose: { type: '', other: '' },
        evidences: {
          id_card: { status: false, file: null },
          residence: { status: false, file: null },
          payment_receipt: { status: false, file: null },
          photo: { status: false, file: null }
        },
        documentDeliveryMethod: this.value.documentDeliveryMethod || ''
      },
      errors: {}
    }
  },
  computed: {
    availableProfessionList () {
      const unique = new Map()
      ;(this.value.licenseNumbers || []).forEach((item) => {
        if (item.professionType && !unique.has(item.professionType)) {
          unique.set(item.professionType, { value: item.professionType, label: professionLabels[item.professionType] || item.professionType, licenseNumber: item.licenseNumber || '' })
        }
      })
      return [...unique.values()]
    },
    hasLicenses () { return this.availableProfessionList.length > 0 },
    selectedCount () { return Object.values(this.form.professions).filter(Boolean).length },
    validQuantity () { const quantity = Number(this.form.quantity); return Number.isInteger(quantity) && quantity > 0 ? quantity : 0 },
    certificateFee () { return this.validQuantity * 200 },
    deliveryFee () { return this.form.documentDeliveryMethod === 'postal' ? 100 : 0 },
    totalPrice () { return this.certificateFee + this.deliveryFee + 45 },
    documentAddressText () {
      const a = this.value.documentAddress || {}
      return [a.address, a.moo && `หมู่ ${a.moo}`, a.building, a.soi && `ซอย ${a.soi}`, a.road && `ถนน ${a.road}`, a.subdistrict && `ตำบล/แขวง ${a.subdistrict}`, a.district && `อำเภอ/เขต ${a.district}`, a.province && `จังหวัด ${a.province}`, a.zipcode].filter(Boolean).join(' ') || '-'
    }
  },
  methods: {
    validateProfessionSelection () { this.errors = { ...this.errors, professions: this.selectedCount ? '' : 'กรุณาเลือกอย่างน้อย 1 ด้าน' } },
    onPurposeChange (purpose) {
      if (purpose !== 'other') { this.form.purpose.other = '' }
      this.errors = { ...this.errors, purpose: '', purposeOther: '' }
    },
    onAttachmentStatusChange (key, selected) { if (!selected) { this.form.evidences[key].file = null } this.errors = { ...this.errors, [key + 'Status']: '', [key]: '' } },
    acceptAttr (accept) { return accept.split(',').map(type => '.' + type.trim().replaceAll('.', '')).join(',') },
    onFileChange (key, file, accept) {
      if (!file) { return }
      const extension = file.name.split('.').pop().toLowerCase()
      const allowed = accept.split(',').map(type => type.trim().replaceAll('.', '').toLowerCase())
      if (!allowed.includes(extension) || file.size > 2 * 1024 * 1024) { this.form.evidences[key].file = null; this.errors = { ...this.errors, [key]: 'ชนิดไฟล์ไม่ถูกต้องหรือไฟล์มีขนาดเกิน 2 MB' } } else { this.errors = { ...this.errors, [key]: '' } }
    },
    validate () {
      const errors = {}
      if (!this.hasLicenses) { errors.professions = 'ไม่พบข้อมูลใบอนุญาต' } else if (!this.selectedCount) { errors.professions = 'กรุณาเลือกอย่างน้อย 1 ด้าน' }
      if (!this.validQuantity) { errors.quantity = 'กรุณาระบุจำนวนฉบับตั้งแต่ 1 ฉบับ' }
      if (!this.form.purpose.type) { errors.purpose = 'กรุณาเลือกวัตถุประสงค์' }
      if (this.form.purpose.type === 'other' && !this.form.purpose.other.trim()) { errors.purposeOther = 'กรุณาระบุวัตถุประสงค์' }
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
.section-heading, .field-heading { font-size: 24px; font-weight: bold; }
.error-text { font-size: 22px; }
.delivery-address { color: #424242; font-size: 19px; }
.fee-summary { font-size: 20px; }
.total-price { color: #327531; font-size: 24px; font-weight: bold; }
.form-actions { gap: 12px; }
.form-button { font-size: 16px; font-weight: bold; }
@media screen and (max-width: 600px) { .section-heading, .field-heading { font-size: 22px; } }
</style>
