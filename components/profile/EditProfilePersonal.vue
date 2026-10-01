<template>
  <div class="edit-profile-personal">
    <!-- รูปโปรไฟล์ -->
    <v-row>
      <v-col cols="12" class="d-flex align-center">
        <span class="section-heading">
          รูปโปรไฟล์
        </span>
        <span v-if="isModified('profileImageUrl') || isModified('profileImageFile')" class="modified-badge">
          มีการแก้ไข
        </span>
      </v-col>
      <v-col cols="12" align="center">
        <div :class="{ 'image-upload-modified': isModified('profileImageUrl') || isModified('profileImageFile') }">
          <ProfileImageUpload
            v-model="localForm.profileImageUrl"
            @change="handleImageChange"
          />
        </div>
      </v-col>
    </v-row>

    <v-divider class="my-6" />

    <!-- ชื่อ-นามสกุล (ภาษาไทย) -->
    <v-row>
      <v-col cols="12">
        <span class="section-heading">
          ชื่อ-นามสกุล (ภาษาไทย)
        </span>
      </v-col>

      <v-col cols="12" md="6" class="py-0">
        <div class="d-flex align-center mb-1">
          <span>คำนำหน้า<small class="ml-1" style="color: red">*</small></span>
          <span class="text--secondary text-caption ml-1">(ภาษาไทย)</span>
          <span v-if="isModified('name1Th')" class="modified-badge">มีการแก้ไข</span>
        </div>
        <validation-provider v-slot="{ errors }" rules="required">
          <v-select
            v-model="localForm.name1Th"
            :items="prefixListTh"
            placeholder="กรุณาระบุคำนำหน้า"
            outlined
            dense
            :error-messages="errors"
            :class="{ 'field-modified': isModified('name1Th') }"
          />
        </validation-provider>
      </v-col>

      <v-col cols="12" md="6" class="py-0">
        <div class="d-flex align-center mb-1">
          <span>ยศ</span>
          <span class="text--secondary text-caption ml-1">(ภาษาไทย)</span>
          <span v-if="isModified('nameRankTh')" class="modified-badge">มีการแก้ไข</span>
        </div>
        <validation-provider v-slot="{ errors }" rules="thaiOnly|noSpace">
          <v-text-field
            v-model="localForm.nameRankTh"
            placeholder="กรุณาระบุยศ"
            outlined
            dense
            :error-messages="errors"
            :class="{ 'field-modified': isModified('nameRankTh') }"
          />
        </validation-provider>
      </v-col>

      <v-col cols="12" md="6" class="py-0">
        <div class="d-flex align-center mb-1">
          <span>ชื่อ<small class="ml-1" style="color: red">*</small></span>
          <span class="text--secondary text-caption ml-1">(ภาษาไทย)</span>
          <span v-if="isModified('name2Th')" class="modified-badge">มีการแก้ไข</span>
        </div>
        <validation-provider v-slot="{ errors }" rules="required|thaiOnly|noSpace">
          <v-text-field
            v-model="localForm.name2Th"
            placeholder="กรุณาระบุชื่อ"
            outlined
            dense
            :error-messages="errors"
            :class="{ 'field-modified': isModified('name2Th') }"
          />
        </validation-provider>
      </v-col>

      <v-col cols="12" md="6" class="py-0">
        <div class="d-flex align-center mb-1">
          <span>นามสกุล<small class="ml-1" style="color: red">*</small></span>
          <span class="text--secondary text-caption ml-1">(ภาษาไทย)</span>
          <span v-if="isModified('name3Th')" class="modified-badge">มีการแก้ไข</span>
        </div>
        <validation-provider v-slot="{ errors }" rules="required|thaiOnly|noSpace">
          <v-text-field
            v-model="localForm.name3Th"
            placeholder="กรุณาระบุนามสกุล"
            outlined
            dense
            :error-messages="errors"
            :class="{ 'field-modified': isModified('name3Th') }"
          />
        </validation-provider>
      </v-col>

      <v-col cols="12" md="6" class="py-0">
        <div class="d-flex align-center mb-1">
          <span>ชื่อเดิม</span>
          <span class="text--secondary text-caption ml-1">(ภาษาไทย)</span>
          <span v-if="isModified('name2OldTh')" class="modified-badge">มีการแก้ไข</span>
        </div>
        <validation-provider v-slot="{ errors }" rules="thaiOnly|noSpace">
          <v-text-field
            v-model="localForm.name2OldTh"
            placeholder="กรุณาระบุชื่อเดิม"
            outlined
            dense
            :error-messages="errors"
            :class="{ 'field-modified': isModified('name2OldTh') }"
          />
        </validation-provider>
      </v-col>

      <v-col cols="12" md="6" class="py-0">
        <div class="d-flex align-center mb-1">
          <span>นามสกุลเดิม</span>
          <span class="text--secondary text-caption ml-1">(ภาษาไทย)</span>
          <span v-if="isModified('name3OldTh')" class="modified-badge">มีการแก้ไข</span>
        </div>
        <validation-provider v-slot="{ errors }" rules="thaiOnly|noSpace">
          <v-text-field
            v-model="localForm.name3OldTh"
            placeholder="กรุณาระบุนามสกุลเดิม"
            outlined
            dense
            :error-messages="errors"
            :class="{ 'field-modified': isModified('name3OldTh') }"
          />
        </validation-provider>
      </v-col>
    </v-row>

    <v-divider class="my-6" />

    <!-- ชื่อ-นามสกุล (ภาษาอังกฤษ) -->
    <v-row>
      <v-col cols="12">
        <span class="section-heading">
          ชื่อ-นามสกุล (ภาษาอังกฤษ)
        </span>
      </v-col>

      <v-col cols="12" md="6" class="py-0">
        <div class="d-flex align-center mb-1">
          <span>คำนำหน้า<small class="ml-1" style="color: red">*</small></span>
          <span class="text--secondary text-caption ml-1">(ภาษาอังกฤษ)</span>
          <span v-if="isModified('name1En')" class="modified-badge">มีการแก้ไข</span>
        </div>
        <validation-provider v-slot="{ errors }" rules="required">
          <v-select
            v-model="localForm.name1En"
            :items="prefixListEn"
            placeholder="กรุณาระบุคำนำหน้า"
            outlined
            dense
            :error-messages="errors"
            :class="{ 'field-modified': isModified('name1En') }"
          />
        </validation-provider>
      </v-col>

      <v-col cols="12" md="6" class="py-0">
        <div class="d-flex align-center mb-1">
          <span>ยศ</span>
          <span class="text--secondary text-caption ml-1">(ภาษาอังกฤษ)</span>
          <span v-if="isModified('nameRankEn')" class="modified-badge">มีการแก้ไข</span>
        </div>
        <validation-provider v-slot="{ errors }" rules="engOnly|noSpace">
          <v-text-field
            v-model="localForm.nameRankEn"
            placeholder="กรุณาระบุยศ"
            outlined
            dense
            :error-messages="errors"
            :class="{ 'field-modified': isModified('nameRankEn') }"
          />
        </validation-provider>
      </v-col>

      <v-col cols="12" md="6" class="py-0">
        <div class="d-flex align-center mb-1">
          <span>ชื่อ<small class="ml-1" style="color: red">*</small></span>
          <span class="text--secondary text-caption ml-1">(ภาษาอังกฤษ)</span>
          <span v-if="isModified('name2En')" class="modified-badge">มีการแก้ไข</span>
        </div>
        <validation-provider v-slot="{ errors }" rules="required|engOnly|noSpace">
          <v-text-field
            v-model="localForm.name2En"
            placeholder="กรุณาระบุชื่อ"
            outlined
            dense
            :error-messages="errors"
            :class="{ 'field-modified': isModified('name2En') }"
          />
        </validation-provider>
      </v-col>

      <v-col cols="12" md="6" class="py-0">
        <div class="d-flex align-center mb-1">
          <span>นามสกุล<small class="ml-1" style="color: red">*</small></span>
          <span class="text--secondary text-caption ml-1">(ภาษาอังกฤษ)</span>
          <span v-if="isModified('name3En')" class="modified-badge">มีการแก้ไข</span>
        </div>
        <validation-provider v-slot="{ errors }" rules="required|engOnly|noSpace">
          <v-text-field
            v-model="localForm.name3En"
            placeholder="กรุณาระบุนามสกุล"
            outlined
            dense
            :error-messages="errors"
            :class="{ 'field-modified': isModified('name3En') }"
          />
        </validation-provider>
      </v-col>

      <v-col cols="12" md="6" class="py-0">
        <div class="d-flex align-center mb-1">
          <span>ชื่อเดิม</span>
          <span class="text--secondary text-caption ml-1">(ภาษาอังกฤษ)</span>
          <span v-if="isModified('name2OldEn')" class="modified-badge">มีการแก้ไข</span>
        </div>
        <validation-provider v-slot="{ errors }" rules="engOnly|noSpace">
          <v-text-field
            v-model="localForm.name2OldEn"
            placeholder="กรุณาระบุชื่อเดิม"
            outlined
            dense
            :error-messages="errors"
            :class="{ 'field-modified': isModified('name2OldEn') }"
          />
        </validation-provider>
      </v-col>

      <v-col cols="12" md="6" class="py-0">
        <div class="d-flex align-center mb-1">
          <span>นามสกุลเดิม</span>
          <span class="text--secondary text-caption ml-1">(ภาษาอังกฤษ)</span>
          <span v-if="isModified('name3OldEn')" class="modified-badge">มีการแก้ไข</span>
        </div>
        <validation-provider v-slot="{ errors }" rules="engOnly|noSpace">
          <v-text-field
            v-model="localForm.name3OldEn"
            placeholder="กรุณาระบุนามสกุลเดิม"
            outlined
            dense
            :error-messages="errors"
            :class="{ 'field-modified': isModified('name3OldEn') }"
          />
        </validation-provider>
      </v-col>
    </v-row>

    <v-divider class="my-6" />

    <!-- ข้อมูลทั่วไป -->
    <v-row>
      <v-col cols="12">
        <span class="section-heading">
          ข้อมูลทั่วไป
        </span>
      </v-col>

      <!-- เลขบัตรประชาชน: ดึงข้อมูลมาแสดง แต่ล็อกไม่ให้แก้ไข -->
      <v-col cols="12" md="3" class="py-0">
        <div class="d-flex align-center mb-1">
          <span>เลขบัตรประชาชน</span>
          <span class="text--secondary text-caption ml-1">(ไม่สามารถแก้ไขได้)</span>
        </div>
        <v-text-field
          v-model="localForm.idCard"
          placeholder="เลขบัตรประชาชน"
          outlined
          dense
          disabled
          filled
          prepend-inner-icon="mdi-lock"
        />
      </v-col>

      <v-col cols="12" md="3" class="py-0">
        <div class="d-flex align-center mb-1 flex-wrap">
          <span>เบอร์โทรศัพท์มือถือ<small class="ml-1" style="color: red">*</small></span>
          <span class="text--secondary text-caption ml-1">(ใช้สำหรับเข้าสู่ระบบ)</span>
          <span v-if="isModified('mobile')" class="modified-badge">มีการแก้ไข</span>
        </div>
        <validation-provider v-slot="{ errors }" rules="required|numeric|digits:10|noSpace">
          <v-text-field
            v-model="localForm.mobile"
            placeholder="กรุณาระบุเบอร์โทรศัพท์มือถือ"
            maxlength="10"
            outlined
            dense
            :error-messages="errors"
            :class="{ 'field-modified': isModified('mobile') }"
          />
        </validation-provider>
        <transition name="fade">
          <div
            v-if="isModified('mobile')"
            class="phone-change-warning mt-n2 mb-3 pa-2"
          >
            <div class="d-flex align-start">
              <v-icon color="#e65100" class="mr-1 mt-0.5" style="font-size: 22px;">
                mdi-alert
              </v-icon>
              <span class="phone-warning-text">
                <strong>แจ้งเตือน:</strong> หากเปลี่ยนเบอร์โทรศัพท์ ในการเข้าสู่ระบบ (Login) ครั้งถัดไป จะต้องใช้เบอร์ใหม่นี้ในการเข้าสู่ระบบ
              </span>
            </div>
          </div>
        </transition>
      </v-col>

      <v-col cols="12" md="3" class="py-0">
        <div class="d-flex align-center mb-1">
          <span>อีเมลหลัก<small class="ml-1" style="color: red">*</small></span>
          <span v-if="isModified('email')" class="modified-badge">มีการแก้ไข</span>
        </div>
        <validation-provider v-slot="{ errors }" rules="required|email|noSpace">
          <v-text-field
            v-model="localForm.email"
            placeholder="กรุณาระบุอีเมลหลัก"
            outlined
            dense
            :error-messages="errors"
            :class="{ 'field-modified': isModified('email') }"
          />
        </validation-provider>
      </v-col>

      <v-col cols="12" md="3" class="py-0">
        <div class="d-flex align-center mb-1">
          <span>Line ID</span>
          <span v-if="isModified('idLine')" class="modified-badge">มีการแก้ไข</span>
        </div>
        <validation-provider v-slot="{ errors }" rules="lineID|noSpace">
          <v-text-field
            v-model="localForm.idLine"
            placeholder="กรุณาระบุ Line ID"
            outlined
            dense
            :error-messages="errors"
            :class="{ 'field-modified': isModified('idLine') }"
          />
        </validation-provider>
      </v-col>

      <v-col cols="12" md="3" class="py-0">
        <div class="d-flex align-center mb-1">
          <span>สัญชาติ<small class="ml-1" style="color: red">*</small></span>
          <span v-if="isModified('nationality')" class="modified-badge">มีการแก้ไข</span>
        </div>
        <validation-provider v-slot="{ errors }" rules="required|thaiOnly|noSpace">
          <v-text-field
            v-model="localForm.nationality"
            placeholder="กรุณาระบุสัญชาติ"
            outlined
            dense
            :error-messages="errors"
            :class="{ 'field-modified': isModified('nationality') }"
          />
        </validation-provider>
      </v-col>

      <v-col cols="12" md="3" class="py-0">
        <div class="d-flex align-center mb-1">
          <span>เชื้อชาติ<small class="ml-1" style="color: red">*</small></span>
          <span v-if="isModified('ethnicity')" class="modified-badge">มีการแก้ไข</span>
        </div>
        <validation-provider v-slot="{ errors }" rules="required|thaiOnly|noSpace">
          <v-text-field
            v-model="localForm.ethnicity"
            placeholder="กรุณาระบุเชื้อชาติ"
            outlined
            dense
            :error-messages="errors"
            :class="{ 'field-modified': isModified('ethnicity') }"
          />
        </validation-provider>
      </v-col>

      <v-col cols="12" md="3" class="py-0">
        <div class="d-flex align-center mb-1">
          <span>ศาสนา<small class="ml-1" style="color: red">*</small></span>
          <span v-if="isModified('religion')" class="modified-badge">มีการแก้ไข</span>
        </div>
        <validation-provider v-slot="{ errors }" rules="required|thaiOnly|noSpace">
          <v-text-field
            v-model="localForm.religion"
            placeholder="กรุณาระบุศาสนา"
            outlined
            dense
            :error-messages="errors"
            :class="{ 'field-modified': isModified('religion') }"
          />
        </validation-provider>
      </v-col>

      <v-col cols="12" md="3" class="py-0">
        <div class="d-flex align-center mb-1">
          <span>เพศ<small class="ml-1" style="color: red">*</small></span>
          <span v-if="isModified('gender')" class="modified-badge">มีการแก้ไข</span>
        </div>
        <validation-provider v-slot="{ errors }" rules="required">
          <v-select
            v-model="localForm.gender"
            :items="genderList"
            placeholder="กรุณาระบุเพศ"
            outlined
            dense
            :error-messages="errors"
            :class="{ 'field-modified': isModified('gender') }"
          />
        </validation-provider>
      </v-col>

      <v-col cols="12" md="3" class="py-0">
        <div class="d-flex align-center mb-1">
          <span>วัน เดือน ปีเกิด<small class="ml-1" style="color: red">*</small></span>
          <span v-if="isModified('birthDate')" class="modified-badge">มีการแก้ไข</span>
        </div>
        <v-menu
          v-model="birthMenu"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template #activator="{ on, attrs }">
            <validation-provider v-slot="{ errors }" rules="required">
              <v-text-field
                :value="birthDateThaiDisplay"
                placeholder="กรุณาระบุวัน เดือน ปีเกิด"
                readonly
                append-icon="mdi-calendar"
                outlined
                dense
                v-bind="attrs"
                :error-messages="errors"
                :class="{ 'field-modified': isModified('birthDate') }"
                v-on="on"
              />
            </validation-provider>
          </template>
          <v-date-picker
            v-model="localForm.birthDate"
            locale="th"
            @input="birthMenu = false"
          />
        </v-menu>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import ProfileImageUpload from '@/components/ProfileImageUpload.vue'

const PERSONAL_KEYS = [
  'profileImageFile',
  'profileImageUrl',
  'name1Th',
  'nameRankTh',
  'name2Th',
  'name3Th',
  'name2OldTh',
  'name3OldTh',
  'name1En',
  'nameRankEn',
  'name2En',
  'name3En',
  'name2OldEn',
  'name3OldEn',
  'idCard',
  'mobile',
  'email',
  'idLine',
  'nationality',
  'ethnicity',
  'religion',
  'gender',
  'birthDate'
]

export default {
  name: 'EditProfilePersonal',

  components: {
    ProfileImageUpload
  },

  props: {
    value: {
      type: Object,
      default: () => ({})
    },
    initialForm: {
      type: Object,
      default: () => ({})
    }
  },

  data () {
    const initial = {
      profileImageFile: null,
      profileImageUrl: null,
      name1Th: '',
      nameRankTh: '',
      name2Th: '',
      name3Th: '',
      name2OldTh: '',
      name3OldTh: '',
      name1En: '',
      nameRankEn: '',
      name2En: '',
      name3En: '',
      name2OldEn: '',
      name3OldEn: '',
      idCard: '',
      mobile: '',
      email: '',
      idLine: '',
      nationality: '',
      ethnicity: '',
      religion: '',
      gender: '',
      birthDate: ''
    }

    if (this.value) {
      for (const k of PERSONAL_KEYS) {
        if (this.value[k] !== undefined && this.value[k] !== null) {
          initial[k] = this.value[k]
        }
      }
    }

    return {
      birthMenu: false,
      prefixListTh: ['นาย', 'นาง', 'นางสาว'],
      prefixListEn: ['Mr.', 'Mrs.', 'Miss'],
      genderList: ['ชาย', 'หญิง'],
      localForm: initial
    }
  },

  computed: {
    birthDateThaiDisplay () {
      if (!this.localForm.birthDate) { return '' }
      const parts = this.localForm.birthDate.split('-')
      if (parts.length < 3) { return this.localForm.birthDate }
      const year = parts[0]
      const month = parts[1]
      const day = parts[2]
      const buddhistYear = parseInt(year, 10) + 543
      const dd = day.padStart(2, '0')
      const mm = month.padStart(2, '0')
      return `${dd}-${mm}-${buddhistYear}`
    }
  },

  watch: {
    'localForm.name1Th' (value) {
      const prefixMap = { นาย: 'Mr.', นาง: 'Mrs.', นางสาว: 'Miss' }
      if (prefixMap[value] && this.localForm.name1En !== prefixMap[value]) {
        this.localForm.name1En = prefixMap[value]
      }
    },
    'localForm.name1En' (value) {
      const prefixMap = { 'Mr.': 'นาย', 'Mrs.': 'นาง', Miss: 'นางสาว' }
      if (prefixMap[value] && this.localForm.name1Th !== prefixMap[value]) {
        this.localForm.name1Th = prefixMap[value]
      }
    },
    value: {
      handler (val) {
        if (!val) { return }
        for (const k of PERSONAL_KEYS) {
          if (val[k] !== undefined && val[k] !== this.localForm[k]) {
            this.localForm[k] = val[k]
          }
        }
      },
      deep: true
    },
    localForm: {
      handler (val) {
        const updated = { ...this.value }
        for (const k of PERSONAL_KEYS) {
          updated[k] = val[k]
        }
        this.$emit('input', updated)
      },
      deep: true
    }
  },

  mounted () {
    if (this.localForm.name1Th && !this.localForm.name1En) {
      const prefixMap = { นาย: 'Mr.', นาง: 'Mrs.', นางสาว: 'Miss' }
      this.localForm.name1En = prefixMap[this.localForm.name1Th] || ''
    } else if (this.localForm.name1En && !this.localForm.name1Th) {
      const prefixMap = { 'Mr.': 'นาย', 'Mrs.': 'นาง', Miss: 'นางสาว' }
      this.localForm.name1Th = prefixMap[this.localForm.name1En] || ''
    }
  },

  methods: {
    handleImageChange ({ file, previewUrl }) {
      this.localForm.profileImageFile = file
      this.localForm.profileImageUrl = previewUrl
    },

    isModified (key) {
      if (!this.initialForm || Object.keys(this.initialForm).length === 0) {
        return false
      }
      if (key === 'profileImageFile' || key === 'profileImageUrl') {
        return Boolean(this.localForm.profileImageFile) ||
          (this.localForm.profileImageUrl !== (this.initialForm.profileImageUrl || null))
      }
      const current = String(this.localForm[key] || '').trim()
      const original = String(this.initialForm[key] || '').trim()
      return current !== original
    }
  }
}
</script>

<style scoped>
.section-heading {
  font-size: 22px;
  font-weight: bold;
  color: #327531;
}

.modified-badge {
  font-size: 11px;
  background-color: #e8f5e9;
  color: #2e7d32;
  padding: 2px 7px;
  border-radius: 4px;
  font-weight: bold;
  margin-left: 8px;
  border: 1px solid #81c784;
  display: inline-block;
}

.field-modified >>> .v-input__control > .v-input__slot {
  border: 2px solid #2e7d32 !important;
  background-color: #f1f8e9 !important;
  transition: all 0.3s ease;
}

.image-upload-modified {
  padding: 8px;
  border-radius: 12px;
  display: inline-block;
  background-color: #f1f8e9;
  border: 2px dashed #2e7d32;
}

.phone-change-warning {
  background-color: #fff8e1;
  border: 1px solid #ffe082;
  border-left: 3px solid #ff8f00;
  border-radius: 4px;
  line-height: 1.4;
}

.phone-warning-text {
  font-size: 20px;
  color: #b75300;
}
</style>
