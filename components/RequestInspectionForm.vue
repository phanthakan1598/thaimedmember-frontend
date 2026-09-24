<template>
  <div>
    <v-row v-if="isPublic" class="mb-2">
      <v-col cols="12">
        <span class="section-heading">ข้อมูลผู้ยื่นคำร้อง</span>
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field :value="applicantNameTh" label="ชื่อ-นามสกุล (ภาษาไทย)" outlined disabled />
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field :value="applicantNameEn" label="ชื่อ-นามสกุล (ภาษาอังกฤษ)" outlined disabled />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <span class="section-heading">กรอกข้อมูลผู้ที่ต้องการยื่นตรวจสอบใบอนุญาตประกอบวิชาชีพ <span class="red--text">*</span></span>
      </v-col>
      <v-col cols="12">
        <v-card outlined class="pa-4">
          <validation-provider v-slot="{ errors: workplaceErrors }" name="สถานที่ทำงาน" rules="required">
            <v-radio-group v-model="form.workplaceType" :error-messages="errors.workplaceType || workplaceErrors" @change="onWorkplaceChange">
              <v-radio label="หน่วยงานส่วนราชการ" value="government" />
              <v-radio label="หน่วยงานภาคเอกชน" value="private" />
              <v-radio label="อื่น ๆ" value="other" />
            </v-radio-group>
          </validation-provider>
          <validation-provider v-slot="{ errors: workplaceNameErrors }" name="ชื่อสถานที่ทำงาน" rules="required">
            <v-text-field
              v-model="form.workplaceName"
              :label="workplaceLabel"
              outlined
              dense
              :error-messages="errors.workplaceName || workplaceNameErrors"
              @input="clearError('workplaceName')"
            />
          </validation-provider>
          <validation-provider v-slot="{ errors: fileErrors }" name="หนังสือรับรองจากหน่วยงาน" rules="required">
            <v-file-input
              v-model="form.evidences.workplace_certificate.file"
              label="แนบหนังสือรับรองขอตรวจสอบใบอนุญาตจากหน่วยงาน"
              accept=".pdf,.jpg,.jpeg"
              outlined
              dense
              show-size
              :error-messages="errors.workplace_certificate || fileErrors"
              @change="onFileChange('workplace_certificate', $event)"
            />
          </validation-provider>
        </v-card>
      </v-col>
    </v-row>
    <v-divider class="my-6" />
    <v-row>
      <v-col cols="12">
        <span class="section-heading">ข้าพเจ้ามีความประสงค์ขอตรวจสอบใบอนุญาตประกอบวิชาชีพ ในด้าน <span class="red--text">*</span></span>
      </v-col>
      <v-col cols="12">
        <v-card outlined class="pa-4">
          <v-checkbox
            v-for="item in professionList"
            :key="item.value"
            v-model="form.professions[item.value]"
            :label="item.labelWithLicense"
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
        <span class="section-heading">ข้าพเจ้าได้แนบหลักฐานประกอบการพิจารณาดังต่อไปนี้ <span class="red--text">*</span></span>
      </v-col>
      <v-col cols="12">
        <v-card outlined class="pa-4">
          <div v-for="item in evidenceItems" :key="item.value" class="mb-3">
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
                accept=".pdf,.jpg,.jpeg"
                prepend-icon=""
                prepend-inner-icon="mdi-paperclip"
                outlined
                dense
                show-size
                :error-messages="errors[item.value] || fileErrors"
                hint="รองรับ PDF, JPG, JPEG ขนาดไม่เกิน 2 MB"
                persistent-hint
                @change="onFileChange(item.value, $event)"
              />
            </validation-provider>
          </div>
        </v-card>
      </v-col>
    </v-row>
    <v-divider class="my-6" />
    <v-row>
      <v-col cols="12">
        <span class="section-heading">วิธีการรับเอกสาร <span class="red--text">*</span></span><v-radio-group v-model="form.documentDeliveryMethod" :error-messages="errors.delivery" @change="clearError('delivery')">
          <v-radio label="จัดส่งทางไปรษณีย์ (ค่าธรรมเนียม 100 บาท)" value="postal" /><v-radio label="รับด้วยตนเองที่สภาการแพทย์แผนไทย" value="self_pickup" />
        </v-radio-group>
      </v-col>
    </v-row>
    <v-card v-if="form.documentDeliveryMethod === 'postal'" outlined class="pa-4 mb-6 delivery-address">
      <strong>ที่อยู่สำหรับจัดส่งเอกสาร</strong>
      <template v-if="isPublic">
        <v-row class="mt-2">
          <v-col cols="12" sm="6">
            <v-text-field v-model="form.documentAddress.address" label="บ้านเลขที่/ที่อยู่" outlined dense />
          </v-col><v-col cols="12" sm="6">
            <v-text-field v-model="form.documentAddress.subdistrict" label="แขวง/ตำบล" outlined dense />
          </v-col><v-col cols="12" sm="6">
            <v-text-field v-model="form.documentAddress.district" label="เขต/อำเภอ" outlined dense />
          </v-col><v-col cols="12" sm="6">
            <v-text-field v-model="form.documentAddress.province" label="จังหวัด" outlined dense />
          </v-col><v-col cols="12" sm="6">
            <v-text-field v-model="form.documentAddress.zipcode" label="รหัสไปรษณีย์" outlined dense />
          </v-col>
        </v-row>
      </template>
      <template v-else>
        <div>{{ documentAddressText }}</div><div>โทรศัพท์: {{ value.documentAddress.phone || value.mobile || '-' }}</div>
      </template>
    </v-card>
    <v-divider class="my-6" />
    <v-card outlined class="pa-4 fee-summary mb-6">
      <strong>สรุปค่าธรรมเนียม</strong><div class="d-flex justify-space-between mt-2">
        <span>ค่าตรวจสอบใบอนุญาต</span><span>{{ formatPrice(inspectionFee) }} บาท</span>
      </div><div class="d-flex justify-space-between mt-2">
        <span>ค่าจัดส่งทางไปรษณีย์</span><span>{{ formatPrice(deliveryFee) }} บาท</span>
      </div><div class="d-flex justify-space-between mt-2">
        <span>ค่าระบบ</span><span>45.00 บาท</span>
      </div><v-divider class="my-3" /><div class="d-flex justify-space-between total-price">
        <span>รวม</span><span>{{ formatPrice(totalPrice) }} บาท</span>
      </div>
    </v-card>
    <div class="d-flex flex-wrap form-actions" :class="$vuetify.breakpoint.smAndDown ? 'flex-column-reverse' : 'justify-end'">
      <v-btn outlined color="#4fb24d" large :block="$vuetify.breakpoint.smAndDown" @click="$emit('cancel')">
        ยกเลิก
      </v-btn><v-btn color="#4fb24d" dark large :block="$vuetify.breakpoint.smAndDown" @click="submit">
        บันทึกคำร้อง
      </v-btn>
    </div>
  </div>
</template>

<script>
const labels = { thai_medicine: 'ด้านเวชกรรมไทย', thai_pharmacy: 'ด้านเภสัชกรรมไทย', thai_midwifery: 'ด้านการผดุงครรภ์ไทย', thai_massage: 'ด้านการนวดไทย', thai_applied: 'ด้านการแพทย์แผนไทยประยุกต์' }
export default {
  name: 'RequestInspectionForm',
  props: { value: { type: Object, required: true }, isPublic: { type: Boolean, default: false } },
  data () { const types = Object.keys(labels); return { form: { workplaceType: '', workplaceName: '', professions: types.reduce((o, key) => ({ ...o, [key]: false }), {}), evidences: { workplace_certificate: { status: true, file: null }, id_card: { status: false, file: null }, inspection_letter: { status: false, file: null }, payment_receipt: { status: false, file: null }, other_evidence: { status: false, file: null } }, documentDeliveryMethod: '', documentAddress: { ...(this.value.documentAddress || {}) } }, evidenceItems: [{ value: 'id_card', label: 'สำเนาบัตรประจำตัวประชาชน หรือสำเนาบัตรประจำตัวเจ้าหน้าที่ของรัฐ หรือสำเนาบัตรพนักงานของรัฐ หรือเอกสารอื่นที่ทางราชการออกให้ซึ่งมีรูปถ่าย', required: true }, { value: 'inspection_letter', label: 'หนังสือรับรองขอตรวจสอบใบอนุญาตจากหน่วยงานส่วนราชการหรือหน่วยงานภาคเอกชน', required: true }, { value: 'payment_receipt', label: 'สำเนาใบเสร็จรับเงินค่าธรรมเนียม', required: true }, { value: 'other_evidence', label: 'เอกสารหลักฐานอื่น ๆ เช่น หลักฐานการมอบอำนาจ (ถ้ามี)', required: false }], errors: {} } },
  computed: {
    applicantNameTh () { const a = this.value.applicant || {}; return [a.prefixTh, a.firstNameTh, a.lastNameTh].filter(Boolean).join(' ') },
    applicantNameEn () { const a = this.value.applicant || {}; return [a.prefixEn, a.firstNameEn, a.lastNameEn].filter(Boolean).join(' ') },
    professionList () { return Object.entries(labels).map(([value, label]) => ({ value, labelWithLicense: label })) },
    selectedCount () { return Object.values(this.form.professions).filter(Boolean).length },
    workplaceLabel () { return this.form.workplaceType === 'other' ? 'โปรดระบุสถานที่ทำงาน' : 'ชื่อหน่วยงาน/สถานที่ทำงาน' },
    inspectionFee () { return this.form.workplaceType && this.form.workplaceType !== 'government' ? 200 : 0 },
    deliveryFee () { return this.form.documentDeliveryMethod === 'postal' ? 100 : 0 },
    totalPrice () { return this.inspectionFee + this.deliveryFee + 45 },
    documentAddressText () { const a = this.value.documentAddress || {}; return [a.address, a.moo && `หมู่ ${a.moo}`, a.building, a.soi && `ซอย ${a.soi}`, a.road && `ถนน ${a.road}`, a.subdistrict, a.district, a.province, a.zipcode].filter(Boolean).join(' ') || '-' }
  },
  methods: {
    onWorkplaceChange () { this.errors = { ...this.errors, workplaceType: '', workplaceName: '' } },
    clearError (key) { this.errors = { ...this.errors, [key]: '' } },
    validateProfessionSelection () { this.errors = { ...this.errors, professions: this.selectedCount ? '' : 'กรุณาเลือกอย่างน้อย 1 ด้าน' } },
    onEvidenceStatusChange (key, status) { if (!status) { this.form.evidences[key].file = null } this.errors = { ...this.errors, [key + 'Status']: '', [key]: '' } },
    onFileChange (key, file) { if (!file) { return } const ext = file.name.split('.').pop().toLowerCase(); if (!['pdf', 'jpg', 'jpeg'].includes(ext) || file.size > 2 * 1024 * 1024) { this.form.evidences[key].file = null; this.errors = { ...this.errors, [key]: 'ชนิดไฟล์ไม่ถูกต้องหรือไฟล์มีขนาดเกิน 2 MB' } } else { this.errors = { ...this.errors, [key]: '' } } },
    validate () { const errors = {}; if (!this.form.workplaceType) { errors.workplaceType = 'กรุณาเลือกประเภทสถานที่ทำงาน' } if (!this.form.workplaceName) { errors.workplaceName = 'กรุณาระบุสถานที่ทำงาน' } if (!this.selectedCount) { errors.professions = 'กรุณาเลือกอย่างน้อย 1 ด้าน' } if (!this.form.evidences.workplace_certificate.file) { errors.workplace_certificate = 'กรุณาแนบหนังสือรับรองจากหน่วยงาน' } this.evidenceItems.forEach((item) => { const e = this.form.evidences[item.value]; if (item.required && !e.status) { errors[item.value + 'Status'] = 'กรุณาเลือกเอกสารรายการนี้' } if (item.required && e.status && !e.file) { errors[item.value] = 'กรุณาแนบไฟล์เอกสาร' } }); if (!this.form.documentDeliveryMethod) { errors.delivery = 'กรุณาเลือกวิธีรับเอกสาร' } if (this.isPublic && this.form.documentDeliveryMethod === 'postal' && (!this.form.documentAddress.address || !this.form.documentAddress.province || !this.form.documentAddress.zipcode)) { errors.delivery = 'กรุณากรอกที่อยู่จัดส่งให้ครบถ้วน' } this.errors = errors; return !Object.keys(errors).length },
    submit () { if (this.validate()) { this.$emit('submit', this.form) } },
    formatPrice (v) { return Number(v || 0).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }
  }
}
</script>
<style scoped>.section-heading { font-size: 24px; font-weight: bold; }.error-text { font-size: 22px; }.delivery-address { color: #424242; font-size: 19px; }.fee-summary { font-size: 20px; }.total-price { color: #327531; font-size: 24px; font-weight: bold; }.form-actions { gap: 12px; } @media screen and (max-width: 600px) { .section-heading { font-size: 22px; } }</style>
