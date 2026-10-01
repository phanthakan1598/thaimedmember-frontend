<template>
  <v-container>
    <v-row class="py-5">
      <v-col cols="12" class="col-MainContant">
        <!-- ส่วนหัวข้อหน้า -->
        <div class="mb-4">
          <div class="d-flex align-center">
            <v-icon
              size="32"
              style="color: #327531; margin-top: 4px; cursor: pointer;"
              @click="$router.push('/')"
            >
              mdi-chevron-left
            </v-icon>

            <h1 style="color: #327531; margin: 0; font-size: 28px; font-weight: bold;">
              การแก้ไขข้อมูลส่วนตัว
            </h1>
          </div>

          <v-divider
            class="my-2"
            color="#327531"
          />

          <div class="d-flex flex-wrap align-center justify-space-between">
            <div class="note-text">
              หมายเหตุ : ช่องที่มีเครื่องหมาย
              <span style="color: red !important;">*</span>
              คือส่วนที่จำเป็นต้องกรอก
            </div>

            <div v-if="!isLoading && changedFieldsCount > 0" class="d-flex align-center mt-1">
              <v-chip color="#2e7d32" dark small class="font-weight-bold">
                <v-icon left small>
                  mdi-pencil
                </v-icon>
                มีการแก้ไข {{ changedFieldsCount }} รายการ
              </v-chip>
            </div>
          </div>
        </div>

        <!-- แถบแจ้งเตือนกรณีมีคำขอแก้ไขรอตรวจสอบ -->
        <v-alert
          v-if="!isLoading && hasPendingApproval"
          type="warning"
          dense
          outlined
          prominent
          icon="mdi-clock-alert-outline"
          class="mb-4"
        >
          <div class="font-weight-bold">
            {{ pendingMessage || 'มีคำขอแก้ไขรอตรวจสอบอยู่' }}
          </div>
          <div class="text-caption mt-1">
            ท่านได้ส่งคำขอแก้ไขข้อมูลไว้แล้วและอยู่ระหว่างรอเจ้าหน้าที่ตรวจสอบ หากส่งข้อมูลใหม่อีกครั้ง ระบบจะอัปเดตคำขอเดิมที่รอตรวจสอบ
          </div>
        </v-alert>

        <!-- การ์ดฟอร์มแก้ไขข้อมูลส่วนตัว -->
        <v-card class="pa-4 pa-md-6 form-card" elevation="1">
          <!-- Loading Overlay ขณะดึงข้อมูล -->
          <v-overlay :value="isLoading" absolute color="#fff" opacity="0.8">
            <div class="text-center">
              <v-progress-circular indeterminate color="#327531" size="50" width="4" />
              <div class="mt-3 font-weight-bold" style="color: #327531; font-size: 18px;">
                กำลังโหลดข้อมูลส่วนตัว...
              </div>
            </div>
          </v-overlay>

          <validation-observer ref="observer" v-slot="{ handleSubmit }">
            <v-form ref="form" @submit.prevent="handleSubmit(submitForm)">
              <!-- แสดงฟอร์มเฉพาะเมื่อโหลดข้อมูลและ Master Data พร้อมสมบูรณ์ -->
              <template v-if="!isLoading">
                <!-- ส่วนที่ 1: ข้อมูลส่วนตัวและข้อมูลทั่วไป -->
                <EditProfilePersonal
                  v-model="form"
                  :initial-form="initialForm"
                />

                <v-divider class="my-6" />

                <!-- ส่วนที่ 2: ข้อมูลที่อยู่ทั้ง 3 ส่วน -->
                <EditProfileAddress
                  v-model="form"
                  :initial-form="initialForm"
                  :geo-provinces="geoProvinces"
                  :geo-districts="geoDistricts"
                  :geo-subdistricts="geoSubdistricts"
                  :is-loading-geo="isLoadingGeo"
                />

                <v-divider class="my-6" />

                <!-- แถบปุ่มบันทึกและยกเลิกด้านล่าง -->
                <div
                  class="d-flex flex-wrap justify-end align-center mt-4"
                  style="gap: 16px;"
                >
                  <v-btn
                    outlined
                    color="#327531"
                    large
                    min-width="120"
                    @click="cancelEdit"
                  >
                    ยกเลิก
                  </v-btn>
                  <v-btn
                    dark
                    color="#4fb24d"
                    large
                    min-width="140"
                    :loading="isSaving"
                    @click="submitForm"
                  >
                    <v-icon left>
                      mdi-content-save
                    </v-icon>
                    บันทึกข้อมูล
                  </v-btn>
                </div>
              </template>
            </v-form>
          </validation-observer>
        </v-card>

        <!-- ป็อปอัพแสดงรายการข้อมูลที่ถูกแก้ไขเพื่อตรวจสอบก่อนยืนยันบันทึก -->
        <v-dialog
          v-model="isConfirmDialogOpen"
          max-width="850"
          persistent
          scrollable
        >
          <v-card class="confirm-dialog-card">
            <v-card-title class="confirm-dialog-title white--text">
              <v-icon left color="white">
                mdi-clipboard-check-outline
              </v-icon>
              <span>ตรวจสอบและยืนยันการแก้ไขข้อมูลส่วนตัว</span>
              <v-spacer />
              <v-btn icon dark @click="isConfirmDialogOpen = false">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-card-title>

            <v-card-text class="pa-4 pa-md-6">
              <v-alert
                type="info"
                dense
                text
                prominent
                icon="mdi-information-outline"
                class="mb-4 info-dialog-alert"
              >
                พบข้อมูลที่มีการแก้ไขทั้งหมด <strong>{{ pendingChangedFields.length }}</strong> รายการ กรุณาตรวจสอบความถูกต้องก่อนกดยืนยันบันทึก
              </v-alert>

              <v-alert
                v-if="hasMobileChanged"
                type="warning"
                dense
                text
                prominent
                icon="mdi-alert-circle"
                class="mb-4 phone-dialog-alert"
              >
                <div class="font-weight-bold" style="font-size: 18px; color: #b75300;">
                  แจ้งเตือนสำคัญเกี่ยวกับการเปลี่ยนเบอร์โทรศัพท์มือถือ
                </div>
                <div class="mt-1" style="color: #424242; font-size: 18px;">
                  เนื่องจากเบอร์โทรศัพท์มือถือใช้สำหรับเข้าสู่ระบบ (Login) หากบันทึกข้อมูลแล้ว ในการเข้าสู่ระบบครั้งถัดไปจะต้องใช้เบอร์โทรศัพท์ใหม่
                  (<strong style="color: #b75300;">{{ changedMobileNumber }}</strong>) ร่วมกับเลขบัตรประชาชนในการเข้าสู่ระบบ
                </div>
              </v-alert>

              <v-simple-table class="changes-table elevation-1">
                <template #default>
                  <thead>
                    <tr>
                      <th class="text-center" style="width: 60px;">
                        ลำดับ
                      </th>
                      <th class="text-left" style="width: 220px;">
                        รายการข้อมูล
                      </th>
                      <th class="text-left">
                        ข้อมูลเดิม
                      </th>
                      <th class="text-left">
                        ข้อมูลใหม่ที่แก้ไข
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(item, index) in pendingChangedFields"
                      :key="item.key"
                    >
                      <td class="text-center font-weight-medium">
                        {{ index + 1 }}
                      </td>
                      <td class="font-weight-bold text-no-wrap">
                        {{ item.label }}
                      </td>
                      <td class="old-value-cell">
                        <span class="old-badge mr-1">เดิม</span>
                        <span>{{ item.oldValue || '-' }}</span>
                      </td>
                      <td class="new-value-cell">
                        <span class="new-badge mr-1">ใหม่</span>
                        <strong>{{ item.newValue || '-' }}</strong>
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-card-text>

            <v-divider />

            <v-card-actions class="pa-4 justify-end">
              <v-btn
                outlined
                color="#666"
                large
                min-width="120"
                class="confirm-dialog-btn"
                @click="isConfirmDialogOpen = false"
              >
                กลับไปแก้ไข
              </v-btn>
              <v-btn
                dark
                color="#4fb24d"
                large
                min-width="150"
                class="confirm-dialog-btn"
                :loading="isSaving"
                @click="confirmSave"
              >
                <v-icon left>
                  mdi-check
                </v-icon>
                ยืนยันบันทึกข้อมูล
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import EditProfilePersonal from '~/components/profile/EditProfilePersonal.vue'
import EditProfileAddress from '~/components/profile/EditProfileAddress.vue'

let cachedGeoData = null

const FIELD_LABELS = {
  profileImageFile: 'รูปโปรไฟล์ใหม่',
  profileImageUrl: 'รูปโปรไฟล์',
  name1Th: 'คำนำหน้า (ไทย)',
  nameRankTh: 'ยศ (ไทย)',
  name2Th: 'ชื่อ (ไทย)',
  name3Th: 'นามสกุล (ไทย)',
  name2OldTh: 'ชื่อเดิม (ไทย)',
  name3OldTh: 'นามสกุลเดิม (ไทย)',
  name1En: 'คำนำหน้า (อังกฤษ)',
  nameRankEn: 'ยศ (อังกฤษ)',
  name2En: 'ชื่อ (อังกฤษ)',
  name3En: 'นามสกุล (อังกฤษ)',
  name2OldEn: 'ชื่อเดิม (อังกฤษ)',
  name3OldEn: 'นามสกุลเดิม (อังกฤษ)',
  mobile: 'เบอร์โทรศัพท์มือถือ',
  email: 'อีเมลหลัก',
  idLine: 'Line ID',
  nationality: 'สัญชาติ',
  ethnicity: 'เชื้อชาติ',
  religion: 'ศาสนา',
  gender: 'เพศ',
  birthDate: 'วัน เดือน ปีเกิด',
  address: 'บ้านเลขที่ (ทะเบียนบ้าน)',
  moo: 'หมู่ที่ (ทะเบียนบ้าน)',
  building: 'หมู่บ้าน/อาคาร (ทะเบียนบ้าน)',
  soi: 'ซอย (ทะเบียนบ้าน)',
  road: 'ถนน (ทะเบียนบ้าน)',
  province: 'จังหวัด (ทะเบียนบ้าน)',
  district: 'เขต/อำเภอ (ทะเบียนบ้าน)',
  subdistrict: 'แขวง/ตำบล (ทะเบียนบ้าน)',
  zipcode: 'รหัสไปรษณีย์ (ทะเบียนบ้าน)',
  phone: 'เบอร์โทรศัพท์บ้าน (ทะเบียนบ้าน)',
  checkboxAddressContact: 'ใช้ที่อยู่ติดต่อตามทะเบียนบ้าน',
  addressContact: 'บ้านเลขที่ (ที่อยู่ติดต่อ)',
  mooContact: 'หมู่ที่ (ที่อยู่ติดต่อ)',
  buildingContact: 'หมู่บ้าน/อาคาร (ที่อยู่ติดต่อ)',
  soiContact: 'ซอย (ที่อยู่ติดต่อ)',
  roadContact: 'ถนน (ที่อยู่ติดต่อ)',
  provinceContact: 'จังหวัด (ที่อยู่ติดต่อ)',
  districtContact: 'เขต/อำเภอ (ที่อยู่ติดต่อ)',
  subdistrictContact: 'แขวง/ตำบล (ที่อยู่ติดต่อ)',
  zipcodeContact: 'รหัสไปรษณีย์ (ที่อยู่ติดต่อ)',
  phoneContact: 'เบอร์โทรศัพท์บ้าน (ที่อยู่ติดต่อ)',
  checkboxAddressDocument: 'ใช้ที่อยู่ส่งเอกสารตามทะเบียนบ้าน',
  addressDocument: 'บ้านเลขที่ (ที่อยู่ส่งเอกสาร)',
  mooDocument: 'หมู่ที่ (ที่อยู่ส่งเอกสาร)',
  buildingDocument: 'หมู่บ้าน/อาคาร (ที่อยู่ส่งเอกสาร)',
  soiDocument: 'ซอย (ที่อยู่ส่งเอกสาร)',
  roadDocument: 'ถนน (ที่อยู่ส่งเอกสาร)',
  provinceDocument: 'จังหวัด (ที่อยู่ส่งเอกสาร)',
  districtDocument: 'เขต/อำเภอ (ที่อยู่ส่งเอกสาร)',
  subdistrictDocument: 'แขวง/ตำบล (ที่อยู่ส่งเอกสาร)',
  zipcodeDocument: 'รหัสไปรษณีย์ (ที่อยู่ส่งเอกสาร)',
  phoneDocument: 'เบอร์โทรศัพท์บ้าน (ที่อยู่ส่งเอกสาร)'
}

const PERSONAL_FIELD_MAPPINGS = [
  { target: 'name1Th', keys: ['name1Th', 'Name1', 'prefixTh'] },
  { target: 'nameRankTh', keys: ['nameRankTh', 'nameRank'] },
  { target: 'name2Th', keys: ['name2Th', 'Name2', 'firstNameTh'] },
  { target: 'name3Th', keys: ['name3Th', 'Name3', 'lastNameTh'] },
  { target: 'name2OldTh', keys: ['name2OldTh'] },
  { target: 'name3OldTh', keys: ['name3OldTh'] },
  { target: 'name1En', keys: ['name1En', 'prefixEn'] },
  { target: 'nameRankEn', keys: ['nameRankEn'] },
  { target: 'name2En', keys: ['name2En', 'firstNameEn'] },
  { target: 'name3En', keys: ['name3En', 'lastNameEn'] },
  { target: 'name2OldEn', keys: ['name2OldEn'] },
  { target: 'name3OldEn', keys: ['name3OldEn'] },
  { target: 'mobile', keys: ['mobile', 'TelMobile', 'telephoneMobile'], transform: v => String(v).replace(/\D/g, '') },
  { target: 'email', keys: ['email', 'Email'] },
  { target: 'idLine', keys: ['idLine', 'lineId'] },
  { target: 'nationality', keys: ['nationality', 'National'] },
  { target: 'ethnicity', keys: ['ethnicity'] },
  { target: 'religion', keys: ['religion'] },
  { target: 'gender', keys: ['gender'] },
  { target: 'birthDate', keys: ['birthDate', 'BirthDMY'], transform: 'birthDate' },
  { target: 'profileImageUrl', keys: ['profileImageUrl'] }
]

const ADDRESS_FIELD_SPECS = [
  { key: 'address', aliases: ['Address'] },
  { key: 'moo', aliases: ['Moo'], transform: v => String(v) },
  { key: 'building', aliases: [] },
  { key: 'soi', aliases: ['Soi'] },
  { key: 'road', aliases: ['Road'] },
  { key: 'province', aliases: ['Province'], transform: 'province' },
  { key: 'district', aliases: ['Amphur'] },
  { key: 'subdistrict', aliases: ['District'] },
  { key: 'zipcode', aliases: ['Zipcode'], transform: v => String(v) },
  { key: 'phone', aliases: ['Telephone'], transform: v => (String(v) === '-' ? '' : String(v)) }
]

export default {
  name: 'ProfilePage',

  components: {
    EditProfilePersonal,
    EditProfileAddress
  },

  data () {
    return {
      isLoading: true,
      isSaving: false,
      isLoadingGeo: false,
      isConfirmDialogOpen: false,
      hasPendingApproval: false,
      pendingMessage: '',
      rawProfile: {},
      pendingChangedFields: [],

      geoProvinces: [],
      geoDistricts: [],
      geoSubdistricts: [],

      initialForm: {},

      form: {
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
        birthDate: '',

        address: '',
        moo: '',
        building: '',
        soi: '',
        road: '',
        province: '',
        district: '',
        subdistrict: '',
        zipcode: '',
        phone: '',

        checkboxAddressContact: false,
        addressContact: '',
        mooContact: '',
        buildingContact: '',
        soiContact: '',
        roadContact: '',
        provinceContact: '',
        districtContact: '',
        subdistrictContact: '',
        zipcodeContact: '',
        phoneContact: '',

        checkboxAddressDocument: false,
        addressDocument: '',
        mooDocument: '',
        buildingDocument: '',
        soiDocument: '',
        roadDocument: '',
        provinceDocument: '',
        districtDocument: '',
        subdistrictDocument: '',
        zipcodeDocument: '',
        phoneDocument: ''
      }
    }
  },

  computed: {
    changedFieldsCount () {
      return this.computeChangedFields().length
    },
    hasMobileChanged () {
      return this.pendingChangedFields.some(item => item.key === 'mobile')
    },
    changedMobileNumber () {
      const field = this.pendingChangedFields.find(item => item.key === 'mobile')
      return field ? field.newValue : this.form.mobile
    }
  },

  async mounted () {
    const token = localStorage.getItem('accessTokenUser')
    if (!token) {
      await this.$router.replace('/login')
      return
    }

    this.isLoading = true
    try {
      // 1. โหลดข้อมูลภูมิศาสตร์ให้พร้อม 100% ก่อนเสมอ
      await this.loadGeoData()

      // 2. ดึงข้อมูลส่วนตัวและที่อยู่ของผู้ใช้จากทุกแหล่ง
      await this.initFormData()

      // 3. บันทึก snapshot ข้อมูลเริ่มต้นสำหรับตรวจจับฟิลด์ที่แก้ไข
      this.initialForm = JSON.parse(JSON.stringify(this.form))
    } finally {
      this.isLoading = false
    }
  },

  methods: {
    formatBirthDateDisplay (dateStr) {
      if (!dateStr) { return '-' }
      const parts = String(dateStr).split('-')
      if (parts.length < 3) { return dateStr }
      const buddhistYear = parseInt(parts[0], 10) + 543
      return `${parts[2].padStart(2, '0')}-${parts[1].padStart(2, '0')}-${buddhistYear}`
    },

    computeChangedFields () {
      if (!this.initialForm || Object.keys(this.initialForm).length === 0) {
        return []
      }

      const changes = []
      const ignoreKeys = ['profileImageFile']

      // 1. ตรวจสอบรูปถ่าย
      if (this.form.profileImageFile ||
        (this.form.profileImageUrl && this.form.profileImageUrl !== this.initialForm.profileImageUrl)) {
        changes.push({
          key: 'profileImageUrl',
          label: 'รูปโปรไฟล์',
          oldValue: this.initialForm.profileImageUrl ? 'มีรูปโปรไฟล์เดิม' : 'ไม่มีรูปโปรไฟล์',
          newValue: 'เลือกรูปโปรไฟล์ใหม่'
        })
      }

      // 2. ตรวจสอบฟิลด์ข้อความและตัวเลือกทั้งหมด
      Object.keys(FIELD_LABELS).forEach((key) => {
        if (ignoreKeys.includes(key) || key === 'profileImageUrl') {
          return
        }

        const isBool = key.startsWith('checkboxAddress')
        if (isBool) {
          const currentVal = Boolean(this.form[key])
          const initialVal = Boolean(this.initialForm[key])
          if (currentVal !== initialVal) {
            changes.push({
              key,
              label: FIELD_LABELS[key] || key,
              oldValue: initialVal ? 'ใช้ตามทะเบียนบ้าน' : 'กรอกแยก',
              newValue: currentVal ? 'ใช้ตามทะเบียนบ้าน' : 'กรอกแยก'
            })
          }
          return
        }

        const currentVal = String(this.form[key] || '').trim()
        const initialVal = String(this.initialForm[key] || '').trim()

        if (currentVal !== initialVal) {
          let displayOld = initialVal
          let displayNew = currentVal

          if (key === 'birthDate') {
            displayOld = this.formatBirthDateDisplay(initialVal)
            displayNew = this.formatBirthDateDisplay(currentVal)
          }

          changes.push({
            key,
            label: FIELD_LABELS[key] || key,
            oldValue: displayOld || '-',
            newValue: displayNew || '-'
          })
        }
      })

      return changes
    },

    async loadGeoData () {
      if (cachedGeoData) {
        this.geoProvinces = cachedGeoData.provinces
        this.geoDistricts = cachedGeoData.districts
        this.geoSubdistricts = cachedGeoData.subdistricts
        return
      }

      this.isLoadingGeo = true
      try {
        const [resProv, resDist, resSub] = await Promise.all([
          import('~/assets/data/geography/provinces.json').then(m => m.default || m),
          import('~/assets/data/geography/districts.json').then(m => m.default || m),
          import('~/assets/data/geography/subdistricts.json').then(m => m.default || m)
        ])

        const provinces = Array.isArray(resProv) ? resProv : []
        const districts = Array.isArray(resDist) ? resDist : []
        const subdistricts = Array.isArray(resSub) ? resSub : []

        cachedGeoData = { provinces, districts, subdistricts }
        this.geoProvinces = provinces
        this.geoDistricts = districts
        this.geoSubdistricts = subdistricts
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to load geo data', err)
      } finally {
        this.isLoadingGeo = false
      }
    },

    cancelEdit () {
      this.$swal({
        icon: 'question',
        title: 'ยกเลิกการแก้ไขข้อมูล ?',
        text: 'ข้อมูลที่แก้ไขไว้จะยังไม่ถูกบันทึก',
        showCancelButton: true,
        confirmButtonText: 'ตกลง',
        cancelButtonText: 'อยู่หน้านี้ต่อ',
        confirmButtonColor: '#327531'
      }).then((result) => {
        if (result.isConfirmed) {
          this.$router.push('/')
        }
      })
    },

    normalizeProvince (value) {
      if (!value) { return '' }
      const val = String(value).trim()
      if (['กทม', 'กทม.', 'กรุงเทพ', 'กรุงเทพฯ'].includes(val)) {
        return 'กรุงเทพมหานคร'
      }
      return val
    },

    normalizeBirthDate (value) {
      if (!value) { return '' }
      const str = String(value).trim()
      if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
        return str
      }
      const parts = str.match(/^(\d{1,4})[/-](\d{1,2})[/-](\d{1,4})$/)
      if (!parts) { return str }
      const yearFirst = parts[1].length === 4
      let year = Number(yearFirst ? parts[1] : parts[3])
      const month = Number(parts[2])
      const day = Number(yearFirst ? parts[3] : parts[1])
      if (year > 2400) { year -= 543 }
      return `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    },

    parseFullname (fullname) {
      if (!fullname) { return { prefix: '', firstName: '', lastName: '' } }
      let raw = String(fullname).trim()
      let prefix = ''
      const prefixes = ['นางสาว', 'นาย', 'นาง', 'เด็กชาย', 'เด็กหญิง']
      for (const p of prefixes) {
        if (raw.startsWith(p)) {
          prefix = p
          raw = raw.substring(p.length).trim()
          break
        }
      }
      const parts = raw.split(/\s+/).filter(Boolean)
      const firstName = parts[0] || ''
      const lastName = parts.slice(1).join(' ') || ''
      return { prefix, firstName, lastName }
    },

    extractValue (sources, keys, transform) {
      for (const src of sources) {
        if (!src || typeof src !== 'object') { continue }
        for (const k of keys) {
          const val = src[k]
          if (val !== undefined && val !== null && val !== '') {
            if (transform === 'province') {
              return this.normalizeProvince(val)
            }
            if (transform === 'birthDate') {
              return this.normalizeBirthDate(val)
            }
            return typeof transform === 'function' ? transform(val) : val
          }
        }
      }
      return undefined
    },

    applyAddressGroup (data, nestedPropName, suffix) {
      const nestedObj = data[nestedPropName] && typeof data[nestedPropName] === 'object' ? data[nestedPropName] : null
      for (const spec of ADDRESS_FIELD_SPECS) {
        const targetKey = spec.key + suffix
        let val = this.extractValue([nestedObj], [spec.key, ...spec.aliases], spec.transform)
        if (val === undefined) {
          const flatKeys = suffix ? [spec.key + suffix] : [spec.key, ...spec.aliases]
          val = this.extractValue([data], flatKeys, spec.transform)
        }
        if (val !== undefined) {
          this.form[targetKey] = val
        }
      }
    },

    applyData (data) {
      if (!data || typeof data !== 'object') { return }

      // 1. Personal & General fields
      for (const spec of PERSONAL_FIELD_MAPPINGS) {
        const val = this.extractValue([data], spec.keys, spec.transform)
        if (val !== undefined) {
          this.form[spec.target] = val
        }
      }

      // 2. Address sections
      this.applyAddressGroup(data, 'address', '')
      this.applyAddressGroup(data, 'contactAddress', 'Contact')
      this.applyAddressGroup(data, 'documentAddress', 'Document')

      // 3. Checkbox flags
      if (data.checkboxAddressContact !== undefined) {
        this.form.checkboxAddressContact = Boolean(data.checkboxAddressContact)
      }
      if (data.checkboxAddressDocument !== undefined) {
        this.form.checkboxAddressDocument = Boolean(data.checkboxAddressDocument)
      }
    },

    async initFormData () {
      const currentUser = this.$store.state.user || {}
      const customerData = this.$store.state.customerData || {}

      // 1. ตั้งค่าพื้นฐานจาก Store ก่อน
      this.form.idCard = currentUser.CustomerID || currentUser.username || customerData.CustomerID || ''
      this.form.profileImageUrl = currentUser.profileImage || null
      this.form.mobile = currentUser.mobile || ''
      this.form.email = currentUser.email || ''

      // 2. แยกชื่อ-นามสกุลจาก fullname ของผู้ใช้งานอย่างถูกต้อง
      const parsed = this.parseFullname(currentUser.fullname)
      if (parsed.prefix) { this.form.name1Th = parsed.prefix }
      if (parsed.firstName) { this.form.name2Th = parsed.firstName }
      if (parsed.lastName) { this.form.name3Th = parsed.lastName }

      // 3. ดึงจาก Cache ใน LocalStorage ถ้าเคยมีการบันทึกไว้
      if (this.form.idCard) {
        try {
          const cached = localStorage.getItem('userProfileData_' + this.form.idCard)
          if (cached) {
            this.applyData(JSON.parse(cached))
          }
        } catch (e) {
          // ignore
        }
      }

      // 4. ดึงข้อมูลจาก customerData ใน Store ถ้ามี
      if (customerData && Object.keys(customerData).length > 0) {
        this.applyData(customerData)
      }

      // 5. ดึงข้อมูลจากเส้น API ใหม่ /applicant/getProfile
      const token = localStorage.getItem('accessTokenUser')
      let fetchedFromNewApi = false
      if (token) {
        this.$axios.setToken(token, 'Bearer')
        try {
          const res = await this.$axios.$get('/applicant/getProfile')
          if (res?.result && typeof res.result === 'object') {
            this.rawProfile = res.result
            this.applyData(res.result)
            if (res.result.profileImageUrl) {
              this.form.profileImageUrl = res.result.profileImageUrl
            }
            fetchedFromNewApi = true
          }
          if (res?.message === 'มีคำขอแก้ไขรอตรวจสอบอยู่') {
            this.hasPendingApproval = true
            this.pendingMessage = res.message
          }
        } catch (err) {
          // eslint-disable-next-line no-console
          console.warn('Cannot fetch applicant profile from /applicant/getProfile:', err)
        }

        // Fallback: หากยังไม่ได้ข้อมูลจากเส้นใหม่ ให้ดึงจากคำร้องเดิมตามปกติ
        if (!fetchedFromNewApi) {
          await this.fallbackFetchFromRequests()
        }
      }

      // 6. ซิงค์คำนำหน้าภาษาอังกฤษตามคำนำหน้าภาษาไทยอัตโนมัติ
      if (this.form.name1Th && !this.form.name1En) {
        const prefixMap = { นาย: 'Mr.', นาง: 'Mrs.', นางสาว: 'Miss' }
        this.form.name1En = prefixMap[this.form.name1Th] || ''
      }

      // ล็อกเลขบัตรประชาชนให้ตรงกับผู้ใช้งานเสมอ
      this.form.idCard = currentUser.CustomerID || currentUser.username || this.form.idCard
    },

    async fallbackFetchFromRequests () {
      try {
        const res = await this.$axios.$get('/requests', {
          params: { page: 1, limit: 100 }
        })
        const items = res?.result?.items || []

        // ก. ดึงข้อมูลจากคำร้องสมัครสมาชิกเดิม
        const regRequest = items.find(r => r.type === '01' || r.type === 1 || r.typeName === 'สมัครสมาชิก')
        const targetReq = regRequest || items[0]

        if (targetReq && targetReq._id) {
          const detailRes = await this.$axios.$get(`/requests/${targetReq._id}`)
          if (detailRes?.result) {
            this.applyData(detailRes.result.details)
            this.applyData(detailRes.result.applicant)
            if (detailRes.result.profileImageUrl) {
              this.form.profileImageUrl = detailRes.result.profileImageUrl
            }
          }
        }

        // ข. ดึงข้อมูลจากคำร้องขอแก้ไขข้อมูลล่าสุดถ้ามี
        const editRequests = items.filter(r => r.type === '02' || r.type === 2 || r.typeName === 'ขอเปลี่ยนข้อมูล')
        if (editRequests.length > 0) {
          const latestEdit = editRequests[0]
          try {
            const editDetail = await this.$axios.$get(`/requests/${latestEdit._id}`)
            if (editDetail?.result?.details) {
              this.applyData(editDetail.result.details)
            }
          } catch (e) {
            // ignore
          }
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn('Cannot fetch requests details fallback:', err)
      }

      if (!this.form.address || !this.form.name2Th) {
        const endpoints = [
          '/requests/edit/form',
          '/requests/renew/form',
          '/requests/license/form',
          '/requests/certificate/form',
          '/requests/inspection/form'
        ]
        for (const ep of endpoints) {
          try {
            const formRes = await this.$axios.$get(ep)
            const formResult = formRes?.result
            if (formResult) {
              if (formResult.applicant) { this.applyData(formResult.applicant) }
              if (formResult.details) { this.applyData(formResult.details) }
              if (formResult.documentAddress) { this.applyData(formResult.documentAddress) }
              if (formResult.contactAddress) { this.applyData(formResult.contactAddress) }
              if (formResult.member) { this.applyData(formResult.member) }
              if (this.form.address && this.form.name2Th) { break }
            }
          } catch (e) {
            // ignore
          }
        }
      }
    },

    async submitForm () {
      const isValid = await this.$refs.observer.validate()
      if (!isValid) {
        await this.$swal({
          icon: 'warning',
          title: 'ข้อมูลไม่ครบถ้วน',
          text: 'กรุณากรอกข้อมูลในช่องที่จำเป็น (*) ให้ถูกต้องครบถ้วน',
          confirmButtonText: 'ตกลง',
          confirmButtonColor: '#327531'
        })
        return
      }

      // ตรวจสอบว่ามีการแก้ไขข้อมูลใดๆ หรือไม่
      const changes = this.computeChangedFields()
      if (changes.length === 0) {
        await this.$swal({
          icon: 'info',
          title: 'ไม่มีข้อมูลที่เปลี่ยนแปลง',
          text: 'ท่านยังไม่ได้ทำการแก้ไขข้อมูลส่วนใด',
          confirmButtonText: 'ตกลง',
          confirmButtonColor: '#327531'
        })
        return
      }

      // เปิดป็อปอัพแสดงรายการฟิลด์ที่ถูกแก้ไขเพื่อให้ผู้ใช้ตรวจสอบก่อนยืนยัน
      this.pendingChangedFields = changes
      this.isConfirmDialogOpen = true
    },

    async confirmSave () {
      this.isConfirmDialogOpen = false
      await this.onSave()
    },

    async onSave () {
      this.isSaving = true
      try {
        const prefix = this.form.name1Th ? `${this.form.name1Th} ` : ''
        const updatedFullname = `${prefix}${this.form.name2Th || ''} ${this.form.name3Th || ''}`.trim()

        const currentUser = this.$store.state.user || {}
        const updatedUser = {
          ...currentUser,
          fullname: updatedFullname || currentUser.fullname,
          profileImage: this.form.profileImageUrl || currentUser.profileImage,
          mobile: this.form.mobile || currentUser.mobile,
          email: this.form.email || currentUser.email
        }

        // 1. เตรียม payload สำหรับส่งไปยังเส้นใหม่ POST /applicant/updateProfile
        // ใช้ rawProfile เป็นฐานเพื่อป้องกัน field mismatch ในการหา diff ของ backend
        const payload = {
          ...(this.rawProfile || {}),
          ...this.form,
          mobile: this.form.mobile
        }

        // หากผู้ใช้ติ๊กใช้ที่อยู่ตามทะเบียนบ้าน ให้ซิงค์ข้อมูลที่อยู่ให้สอดคล้องกัน
        if (this.form.checkboxAddressContact) {
          payload.addressContact = this.form.address
          payload.mooContact = this.form.moo
          payload.buildingContact = this.form.building
          payload.soiContact = this.form.soi
          payload.roadContact = this.form.road
          payload.provinceContact = this.form.province
          payload.districtContact = this.form.district
          payload.subdistrictContact = this.form.subdistrict
          payload.zipcodeContact = this.form.zipcode
          payload.phoneContact = this.form.phone
        }

        if (this.form.checkboxAddressDocument) {
          payload.addressDocument = this.form.address
          payload.mooDocument = this.form.moo
          payload.buildingDocument = this.form.building
          payload.soiDocument = this.form.soi
          payload.roadDocument = this.form.road
          payload.provinceDocument = this.form.province
          payload.districtDocument = this.form.district
          payload.subdistrictDocument = this.form.subdistrict
          payload.zipcodeDocument = this.form.zipcode
          payload.phoneDocument = this.form.phone
        }

        // สำหรับฟิลด์ที่ไม่ได้ถูกแก้ไข ให้คงค่าเดิมจาก rawProfile ไว้
        const changedKeys = this.pendingChangedFields.map(item => item.key)
        Object.keys(FIELD_LABELS).forEach((key) => {
          if (!changedKeys.includes(key) && this.rawProfile && this.rawProfile[key] !== undefined) {
            payload[key] = this.rawProfile[key]
          }
        })

        // ตัดฟิลด์ที่ไม่เกี่ยวข้องหรือไม่ใช่ฟิลด์ในแบบฟอร์มออก
        delete payload._id
        delete payload.userId
        delete payload.CustomerID
        delete payload.sourceRequestId
        delete payload.createAt
        delete payload.updateAt
        delete payload.profileImageFile
        delete payload.idCard
        delete payload.checkboxAddressContact
        delete payload.checkboxAddressDocument

        // 2. เรียกเส้น API ใหม่ POST /applicant/updateProfile
        const token = localStorage.getItem('accessTokenUser')
        if (token) {
          this.$axios.setToken(token, 'Bearer')
        }

        let updateRes
        if (this.form.profileImageFile) {
          const formData = new FormData()
          formData.append('profileImage', this.form.profileImageFile)
          formData.append('data', JSON.stringify(payload))
          updateRes = await this.$axios.$post('/applicant/updateProfile', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          })
        } else {
          updateRes = await this.$axios.$post('/applicant/updateProfile', payload)
        }

        // 3. อัปเดตข้อมูลใน Vuex store เพื่อให้ Header แสดงผลชื่อใหม่ทันที
        this.$store.commit('setUser', updatedUser)

        // 4. บันทึกลงใน LocalStorage เพื่อให้ข้อมูลคงอยู่ต่อเนื่อง
        if (this.form.idCard) {
          const cacheForm = { ...this.form }
          delete cacheForm.profileImageFile
          if (cacheForm.profileImageUrl && cacheForm.profileImageUrl.startsWith('blob:')) {
            cacheForm.profileImageUrl = this.initialForm.profileImageUrl || null
          }
          localStorage.setItem('userProfileData_' + this.form.idCard, JSON.stringify(cacheForm))
        }

        // 5. ส่งอัปเดตไปยัง /users/update ควบคู่กัน (เผื่อส่วนอื่นอ้างอิง user collection)
        try {
          const userUpdatePayload = {
            username: this.form.idCard,
            fullname: updatedFullname
          }
          if (this.form.profileImageUrl && !this.form.profileImageUrl.startsWith('blob:')) {
            userUpdatePayload.profileImage = this.form.profileImageUrl
          }
          await this.$axios.$post('/users/update', userUpdatePayload)
        } catch (apiErr) {
          // ignore api fallback
        }

        const isMobileChanged = this.pendingChangedFields.some(item => item.key === 'mobile')
        const newMobile = this.form.mobile
        const successMessage = updateRes?.message || 'แก้ไขข้อมูลส่วนตัวเรียบร้อยแล้ว'

        await this.$swal({
          icon: 'success',
          title: 'บันทึกสำเร็จ',
          html: isMobileChanged
            ? `${successMessage}<br><div style="margin-top: 10px; padding: 10px; background-color: #fff8e1; border-radius: 6px; font-size: 14px; color: #b75300; border-left: 4px solid #ff8f00; text-align: left;"><strong>หมายเหตุสำคัญ:</strong> ในการเข้าสู่ระบบ (Login) ครั้งถัดไป กรุณาใช้เบอร์โทรศัพท์ใหม่ <strong>${newMobile}</strong> ในการเข้าสู่ระบบ</div>`
            : successMessage,
          confirmButtonText: 'ตกลง',
          confirmButtonColor: '#4fb24d'
        })

        await this.$router.push('/')
      } catch (err) {
        await this.$swal({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: err.response?.data?.message || err.message || 'ไม่สามารถบันทึกข้อมูลส่วนตัวได้',
          confirmButtonText: 'ตกลง',
          confirmButtonColor: '#327531'
        })
      } finally {
        this.isSaving = false
      }
    }
  }
}
</script>

<style scoped>
.form-card {
  border-radius: 8px;
  background-color: #fff;
  position: relative;
}

.note-text {
  font-size: 16px;
  color: #333;
}

.confirm-dialog-card {
  border-radius: 12px;
  overflow: hidden;
}

.confirm-dialog-title {
  background-color: #327531;
  font-size: 22px;
  font-weight: bold;
}

.info-dialog-alert {
  font-size: 16px !important;
}

.changes-table {
  border-radius: 8px;
  overflow: hidden;
}

.changes-table th {
  background-color: #f5f5f5 !important;
  color: #333 !important;
  font-size: 17px !important;
  font-weight: bold !important;
}

.changes-table td {
  font-size: 16px;
  padding: 12px 16px !important;
}

.old-value-cell {
  color: #757575;
}

.old-badge {
  font-size: 13px;
  background-color: #eeeeee;
  color: #616161;
  padding: 2px 6px;
  border-radius: 4px;
}

.new-value-cell {
  color: #2e7d32;
}

.new-badge {
  font-size: 13px;
  background-color: #e8f5e9;
  color: #2e7d32;
  border: 1px solid #81c784;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: bold;
}

.phone-dialog-alert {
  background-color: #fff8e1 !important;
  border: 1px solid #ffe082 !important;
  border-left: 4px solid #ff8f00 !important;
  border-radius: 6px !important;
}

.confirm-dialog-btn {
  font-size: 17px !important;
}
</style>
