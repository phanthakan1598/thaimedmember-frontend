<template>
  <div class="edit-profile-address">
    <!-- ที่อยู่ตามทะเบียนบ้าน -->
    <v-row>
      <v-col cols="12">
        <span class="section-heading">
          ที่อยู่ตามทะเบียนบ้าน
        </span>
      </v-col>

      <v-col cols="12" md="4" class="py-0">
        <div class="d-flex align-center mb-1">
          <span>บ้านเลขที่<small class="ml-1" style="color: red">*</small></span>
          <span v-if="isModified('address')" class="modified-badge">มีการแก้ไข</span>
        </div>
        <validation-provider v-slot="{ errors }" rules="required">
          <v-text-field
            v-model="localForm.address"
            placeholder="กรุณาระบุบ้านเลขที่"
            outlined
            dense
            :error-messages="errors"
            :class="{ 'field-modified': isModified('address') }"
          />
        </validation-provider>
      </v-col>

      <v-col cols="12" md="4" class="py-0">
        <div class="d-flex align-center mb-1">
          <span>หมู่ที่</span>
          <span v-if="isModified('moo')" class="modified-badge">มีการแก้ไข</span>
        </div>
        <v-text-field
          v-model="localForm.moo"
          placeholder="กรุณาระบุหมู่ที่"
          outlined
          dense
          :class="{ 'field-modified': isModified('moo') }"
        />
      </v-col>

      <v-col cols="12" md="4" class="py-0">
        <div class="d-flex align-center mb-1">
          <span>หมู่บ้าน / อาคาร</span>
          <span v-if="isModified('building')" class="modified-badge">มีการแก้ไข</span>
        </div>
        <v-text-field
          v-model="localForm.building"
          placeholder="กรุณาระบุหมู่บ้าน / อาคาร"
          outlined
          dense
          :class="{ 'field-modified': isModified('building') }"
        />
      </v-col>

      <v-col cols="12" md="4" class="py-0">
        <div class="d-flex align-center mb-1">
          <span>ซอย</span>
          <span v-if="isModified('soi')" class="modified-badge">มีการแก้ไข</span>
        </div>
        <v-text-field
          v-model="localForm.soi"
          placeholder="กรุณาระบุซอย"
          outlined
          dense
          :class="{ 'field-modified': isModified('soi') }"
        />
      </v-col>

      <v-col cols="12" md="4" class="py-0">
        <div class="d-flex align-center mb-1">
          <span>ถนน</span>
          <span v-if="isModified('road')" class="modified-badge">มีการแก้ไข</span>
        </div>
        <v-text-field
          v-model="localForm.road"
          placeholder="กรุณาระบุถนน"
          outlined
          dense
          :class="{ 'field-modified': isModified('road') }"
        />
      </v-col>

      <v-col cols="12" md="4" class="py-0">
        <div class="d-flex align-center mb-1">
          <span>จังหวัด<small class="ml-1" style="color: red">*</small></span>
          <span v-if="isModified('province')" class="modified-badge">มีการแก้ไข</span>
        </div>
        <validation-provider v-slot="{ errors }" rules="required">
          <v-autocomplete
            v-model="localForm.province"
            :items="provinceOptions"
            :loading="activeIsLoadingGeo"
            placeholder="กรุณาระบุจังหวัด"
            outlined
            dense
            :error-messages="errors"
            :class="{ 'field-modified': isModified('province') }"
            @change="onProvinceChange"
          />
        </validation-provider>
      </v-col>

      <v-col cols="12" md="4" class="py-0">
        <div class="d-flex align-center mb-1">
          <span>เขต / อำเภอ<small class="ml-1" style="color: red">*</small></span>
          <span v-if="isModified('district')" class="modified-badge">มีการแก้ไข</span>
        </div>
        <validation-provider v-slot="{ errors }" rules="required">
          <v-autocomplete
            v-model="localForm.district"
            :items="districtOptions"
            :disabled="!localForm.province"
            placeholder="กรุณาระบุเขต / อำเภอ"
            outlined
            dense
            :error-messages="errors"
            :class="{ 'field-modified': isModified('district') }"
            @change="onDistrictChange"
          />
        </validation-provider>
      </v-col>

      <v-col cols="12" md="4" class="py-0">
        <div class="d-flex align-center mb-1">
          <span>แขวง / ตำบล<small class="ml-1" style="color: red">*</small></span>
          <span v-if="isModified('subdistrict')" class="modified-badge">มีการแก้ไข</span>
        </div>
        <validation-provider v-slot="{ errors }" rules="required">
          <v-autocomplete
            v-model="localForm.subdistrict"
            :items="subdistrictOptions"
            :disabled="!localForm.district"
            placeholder="กรุณาระบุแขวง / ตำบล"
            outlined
            dense
            :error-messages="errors"
            :class="{ 'field-modified': isModified('subdistrict') }"
            @change="onSubdistrictChange"
          />
        </validation-provider>
      </v-col>

      <v-col cols="12" md="4" class="py-0">
        <div class="d-flex align-center mb-1">
          <span>รหัสไปรษณีย์<small class="ml-1" style="color: red">*</small></span>
          <span v-if="isModified('zipcode')" class="modified-badge">มีการแก้ไข</span>
        </div>
        <validation-provider v-slot="{ errors }" rules="required">
          <v-autocomplete
            v-model="localForm.zipcode"
            :items="zipcodeOptions"
            :disabled="!localForm.district"
            placeholder="กรุณาระบุรหัสไปรษณีย์"
            outlined
            dense
            :error-messages="errors"
            :class="{ 'field-modified': isModified('zipcode') }"
          />
        </validation-provider>
      </v-col>

      <v-col cols="12" md="4" class="py-0">
        <div class="d-flex align-center mb-1">
          <span>เบอร์โทรศัพท์บ้าน</span>
          <span v-if="isModified('phone')" class="modified-badge">มีการแก้ไข</span>
        </div>
        <validation-provider v-slot="{ errors }" rules="numeric|noSpace|min:9|max:10">
          <v-text-field
            v-model="localForm.phone"
            placeholder="กรุณาระบุเบอร์โทรศัพท์บ้าน"
            outlined
            dense
            :error-messages="errors"
            :class="{ 'field-modified': isModified('phone') }"
          />
        </validation-provider>
      </v-col>
    </v-row>

    <v-divider class="my-6" />

    <!-- ที่อยู่ตามที่สามารถติดต่อได้ -->
    <v-row>
      <v-col cols="12" class="d-flex align-center flex-wrap">
        <span class="section-heading mr-3">
          ที่อยู่ตามที่สามารถติดต่อได้
        </span>
        <v-checkbox
          v-model="localForm.checkboxAddressContact"
          class="ma-0 pa-0 mr-2"
          hide-details
          label="ใช้ตามที่อยู่ทะเบียนบ้าน"
          @change="toggleAddressContact"
        />
        <span v-if="isModified('checkboxAddressContact')" class="modified-badge">มีการแก้ไข</span>
      </v-col>

      <v-col cols="12" md="4" class="py-0">
        <div class="d-flex align-center mb-1">
          <span>บ้านเลขที่<small class="ml-1" style="color: red">*</small></span>
          <span v-if="isModified('addressContact')" class="modified-badge">มีการแก้ไข</span>
        </div>
        <validation-provider v-slot="{ errors }" rules="required">
          <v-text-field
            v-model="localForm.addressContact"
            placeholder="กรุณาระบุบ้านเลขที่"
            outlined
            :disabled="localForm.checkboxAddressContact"
            dense
            :error-messages="errors"
            :class="{ 'field-modified': isModified('addressContact') }"
          />
        </validation-provider>
      </v-col>

      <v-col cols="12" md="4" class="py-0">
        <div class="d-flex align-center mb-1">
          <span>หมู่ที่</span>
          <span v-if="isModified('mooContact')" class="modified-badge">มีการแก้ไข</span>
        </div>
        <v-text-field
          v-model="localForm.mooContact"
          placeholder="กรุณาระบุหมู่ที่"
          outlined
          :disabled="localForm.checkboxAddressContact"
          dense
          :class="{ 'field-modified': isModified('mooContact') }"
        />
      </v-col>

      <v-col cols="12" md="4" class="py-0">
        <div class="d-flex align-center mb-1">
          <span>หมู่บ้าน / อาคาร</span>
          <span v-if="isModified('buildingContact')" class="modified-badge">มีการแก้ไข</span>
        </div>
        <v-text-field
          v-model="localForm.buildingContact"
          placeholder="กรุณาระบุหมู่บ้าน / อาคาร"
          outlined
          :disabled="localForm.checkboxAddressContact"
          dense
          :class="{ 'field-modified': isModified('buildingContact') }"
        />
      </v-col>

      <v-col cols="12" md="4" class="py-0">
        <div class="d-flex align-center mb-1">
          <span>ซอย</span>
          <span v-if="isModified('soiContact')" class="modified-badge">มีการแก้ไข</span>
        </div>
        <v-text-field
          v-model="localForm.soiContact"
          placeholder="กรุณาระบุซอย"
          outlined
          :disabled="localForm.checkboxAddressContact"
          dense
          :class="{ 'field-modified': isModified('soiContact') }"
        />
      </v-col>

      <v-col cols="12" md="4" class="py-0">
        <div class="d-flex align-center mb-1">
          <span>ถนน</span>
          <span v-if="isModified('roadContact')" class="modified-badge">มีการแก้ไข</span>
        </div>
        <v-text-field
          v-model="localForm.roadContact"
          placeholder="กรุณาระบุถนน"
          outlined
          :disabled="localForm.checkboxAddressContact"
          dense
          :class="{ 'field-modified': isModified('roadContact') }"
        />
      </v-col>

      <v-col cols="12" md="4" class="py-0">
        <div class="d-flex align-center mb-1">
          <span>จังหวัด<small class="ml-1" style="color: red">*</small></span>
          <span v-if="isModified('provinceContact')" class="modified-badge">มีการแก้ไข</span>
        </div>
        <validation-provider v-slot="{ errors }" rules="required">
          <v-autocomplete
            v-model="localForm.provinceContact"
            :items="provinceOptions"
            :loading="activeIsLoadingGeo"
            placeholder="กรุณาระบุจังหวัด"
            outlined
            :disabled="localForm.checkboxAddressContact"
            dense
            :error-messages="errors"
            :class="{ 'field-modified': isModified('provinceContact') }"
            @change="onProvinceContactChange"
          />
        </validation-provider>
      </v-col>

      <v-col cols="12" md="4" class="py-0">
        <div class="d-flex align-center mb-1">
          <span>เขต / อำเภอ<small class="ml-1" style="color: red">*</small></span>
          <span v-if="isModified('districtContact')" class="modified-badge">มีการแก้ไข</span>
        </div>
        <validation-provider v-slot="{ errors }" rules="required">
          <v-autocomplete
            v-model="localForm.districtContact"
            :items="districtContactOptions"
            placeholder="กรุณาระบุเขต / อำเภอ"
            outlined
            :disabled="localForm.checkboxAddressContact || !localForm.provinceContact"
            dense
            :error-messages="errors"
            :class="{ 'field-modified': isModified('districtContact') }"
            @change="onDistrictContactChange"
          />
        </validation-provider>
      </v-col>

      <v-col cols="12" md="4" class="py-0">
        <div class="d-flex align-center mb-1">
          <span>แขวง / ตำบล<small class="ml-1" style="color: red">*</small></span>
          <span v-if="isModified('subdistrictContact')" class="modified-badge">มีการแก้ไข</span>
        </div>
        <validation-provider v-slot="{ errors }" rules="required">
          <v-autocomplete
            v-model="localForm.subdistrictContact"
            :items="subdistrictContactOptions"
            placeholder="กรุณาระบุแขวง / ตำบล"
            outlined
            :disabled="localForm.checkboxAddressContact || !localForm.districtContact"
            dense
            :error-messages="errors"
            :class="{ 'field-modified': isModified('subdistrictContact') }"
            @change="onSubdistrictContactChange"
          />
        </validation-provider>
      </v-col>

      <v-col cols="12" md="4" class="py-0">
        <div class="d-flex align-center mb-1">
          <span>รหัสไปรษณีย์<small class="ml-1" style="color: red">*</small></span>
          <span v-if="isModified('zipcodeContact')" class="modified-badge">มีการแก้ไข</span>
        </div>
        <validation-provider v-slot="{ errors }" rules="required">
          <v-autocomplete
            v-model="localForm.zipcodeContact"
            :items="zipcodeContactOptions"
            placeholder="กรุณาระบุรหัสไปรษณีย์"
            outlined
            :disabled="localForm.checkboxAddressContact || !localForm.districtContact"
            dense
            :error-messages="errors"
            :class="{ 'field-modified': isModified('zipcodeContact') }"
          />
        </validation-provider>
      </v-col>

      <v-col cols="12" md="4" class="py-0">
        <div class="d-flex align-center mb-1">
          <span>เบอร์โทรศัพท์บ้าน</span>
          <span v-if="isModified('phoneContact')" class="modified-badge">มีการแก้ไข</span>
        </div>
        <validation-provider v-slot="{ errors }" rules="numeric|noSpace|min:9|max:10">
          <v-text-field
            v-model="localForm.phoneContact"
            placeholder="กรุณาระบุเบอร์โทรศัพท์บ้าน"
            outlined
            :disabled="localForm.checkboxAddressContact"
            dense
            :error-messages="errors"
            :class="{ 'field-modified': isModified('phoneContact') }"
          />
        </validation-provider>
      </v-col>
    </v-row>

    <v-divider class="my-6" />

    <!-- สถานที่อยู่สำหรับส่งเอกสาร -->
    <v-row>
      <v-col cols="12" class="d-flex align-center flex-wrap">
        <span class="section-heading mr-3">
          สถานที่อยู่สำหรับส่งเอกสาร
        </span>
        <v-checkbox
          v-model="localForm.checkboxAddressDocument"
          class="ma-0 pa-0 mr-2"
          hide-details
          label="ใช้ตามที่อยู่ทะเบียนบ้าน"
          @change="toggleAddressDocument"
        />
        <span v-if="isModified('checkboxAddressDocument')" class="modified-badge">มีการแก้ไข</span>
      </v-col>

      <v-col cols="12" md="4" class="py-0">
        <div class="d-flex align-center mb-1">
          <span>บ้านเลขที่<small class="ml-1" style="color: red">*</small></span>
          <span v-if="isModified('addressDocument')" class="modified-badge">มีการแก้ไข</span>
        </div>
        <validation-provider v-slot="{ errors }" rules="required">
          <v-text-field
            v-model="localForm.addressDocument"
            placeholder="กรุณาระบุบ้านเลขที่"
            outlined
            :disabled="localForm.checkboxAddressDocument"
            dense
            :error-messages="errors"
            :class="{ 'field-modified': isModified('addressDocument') }"
          />
        </validation-provider>
      </v-col>

      <v-col cols="12" md="4" class="py-0">
        <div class="d-flex align-center mb-1">
          <span>หมู่ที่</span>
          <span v-if="isModified('mooDocument')" class="modified-badge">มีการแก้ไข</span>
        </div>
        <v-text-field
          v-model="localForm.mooDocument"
          placeholder="กรุณาระบุหมู่ที่"
          outlined
          :disabled="localForm.checkboxAddressDocument"
          dense
          :class="{ 'field-modified': isModified('mooDocument') }"
        />
      </v-col>

      <v-col cols="12" md="4" class="py-0">
        <div class="d-flex align-center mb-1">
          <span>หมู่บ้าน / อาคาร</span>
          <span v-if="isModified('buildingDocument')" class="modified-badge">มีการแก้ไข</span>
        </div>
        <v-text-field
          v-model="localForm.buildingDocument"
          placeholder="กรุณาระบุหมู่บ้าน / อาคาร"
          outlined
          :disabled="localForm.checkboxAddressDocument"
          dense
          :class="{ 'field-modified': isModified('buildingDocument') }"
        />
      </v-col>

      <v-col cols="12" md="4" class="py-0">
        <div class="d-flex align-center mb-1">
          <span>ซอย</span>
          <span v-if="isModified('soiDocument')" class="modified-badge">มีการแก้ไข</span>
        </div>
        <v-text-field
          v-model="localForm.soiDocument"
          placeholder="กรุณาระบุซอย"
          outlined
          :disabled="localForm.checkboxAddressDocument"
          dense
          :class="{ 'field-modified': isModified('soiDocument') }"
        />
      </v-col>

      <v-col cols="12" md="4" class="py-0">
        <div class="d-flex align-center mb-1">
          <span>ถนน</span>
          <span v-if="isModified('roadDocument')" class="modified-badge">มีการแก้ไข</span>
        </div>
        <v-text-field
          v-model="localForm.roadDocument"
          placeholder="กรุณาระบุถนน"
          outlined
          :disabled="localForm.checkboxAddressDocument"
          dense
          :class="{ 'field-modified': isModified('roadDocument') }"
        />
      </v-col>

      <v-col cols="12" md="4" class="py-0">
        <div class="d-flex align-center mb-1">
          <span>จังหวัด<small class="ml-1" style="color: red">*</small></span>
          <span v-if="isModified('provinceDocument')" class="modified-badge">มีการแก้ไข</span>
        </div>
        <validation-provider v-slot="{ errors }" rules="required">
          <v-autocomplete
            v-model="localForm.provinceDocument"
            :items="provinceOptions"
            :loading="activeIsLoadingGeo"
            placeholder="กรุณาระบุจังหวัด"
            outlined
            :disabled="localForm.checkboxAddressDocument"
            dense
            :error-messages="errors"
            :class="{ 'field-modified': isModified('provinceDocument') }"
            @change="onProvinceDocumentChange"
          />
        </validation-provider>
      </v-col>

      <v-col cols="12" md="4" class="py-0">
        <div class="d-flex align-center mb-1">
          <span>เขต / อำเภอ<small class="ml-1" style="color: red">*</small></span>
          <span v-if="isModified('districtDocument')" class="modified-badge">มีการแก้ไข</span>
        </div>
        <validation-provider v-slot="{ errors }" rules="required">
          <v-autocomplete
            v-model="localForm.districtDocument"
            :items="districtDocumentOptions"
            placeholder="กรุณาระบุเขต / อำเภอ"
            outlined
            :disabled="localForm.checkboxAddressDocument || !localForm.provinceDocument"
            dense
            :error-messages="errors"
            :class="{ 'field-modified': isModified('districtDocument') }"
            @change="onDistrictDocumentChange"
          />
        </validation-provider>
      </v-col>

      <v-col cols="12" md="4" class="py-0">
        <div class="d-flex align-center mb-1">
          <span>แขวง / ตำบล<small class="ml-1" style="color: red">*</small></span>
          <span v-if="isModified('subdistrictDocument')" class="modified-badge">มีการแก้ไข</span>
        </div>
        <validation-provider v-slot="{ errors }" rules="required">
          <v-autocomplete
            v-model="localForm.subdistrictDocument"
            :items="subdistrictDocumentOptions"
            placeholder="กรุณาระบุแขวง / ตำบล"
            outlined
            :disabled="localForm.checkboxAddressDocument || !localForm.districtDocument"
            dense
            :error-messages="errors"
            :class="{ 'field-modified': isModified('subdistrictDocument') }"
            @change="onSubdistrictDocumentChange"
          />
        </validation-provider>
      </v-col>

      <v-col cols="12" md="4" class="py-0">
        <div class="d-flex align-center mb-1">
          <span>รหัสไปรษณีย์<small class="ml-1" style="color: red">*</small></span>
          <span v-if="isModified('zipcodeDocument')" class="modified-badge">มีการแก้ไข</span>
        </div>
        <validation-provider v-slot="{ errors }" rules="required">
          <v-autocomplete
            v-model="localForm.zipcodeDocument"
            :items="zipcodeDocumentOptions"
            placeholder="กรุณาระบุรหัสไปรษณีย์"
            outlined
            :disabled="localForm.checkboxAddressDocument || !localForm.districtDocument"
            dense
            :error-messages="errors"
            :class="{ 'field-modified': isModified('zipcodeDocument') }"
          />
        </validation-provider>
      </v-col>

      <v-col cols="12" md="4" class="py-0">
        <div class="d-flex align-center mb-1">
          <span>เบอร์โทรศัพท์บ้าน</span>
          <span v-if="isModified('phoneDocument')" class="modified-badge">มีการแก้ไข</span>
        </div>
        <validation-provider v-slot="{ errors }" rules="numeric|noSpace|min:9|max:10">
          <v-text-field
            v-model="localForm.phoneDocument"
            placeholder="กรุณาระบุเบอร์โทรศัพท์บ้าน"
            outlined
            :disabled="localForm.checkboxAddressDocument"
            dense
            :error-messages="errors"
            :class="{ 'field-modified': isModified('phoneDocument') }"
          />
        </validation-provider>
      </v-col>
    </v-row>
  </div>
</template>

<script>
let cachedGeoData = null

const PROV_CODE_MAP = {
  กรุงเทพมหานคร: 10,
  สมุทรปราการ: 11,
  นนทบุรี: 12,
  ปทุมธานี: 13,
  พระนครศรีอยุธยา: 14,
  อ่างทอง: 15,
  ลพบุรี: 16,
  สิงห์บุรี: 17,
  ชัยนาท: 18,
  สระบุรี: 19,
  ชลบุรี: 20,
  ระยอง: 21,
  จันทบุรี: 22,
  ตราด: 23,
  ฉะเชิงเทรา: 24,
  ปราจีนบุรี: 25,
  นครนายก: 26,
  สระแก้ว: 27,
  นครราชสีมา: 30,
  บุรีรัมย์: 31,
  สุรินทร์: 32,
  ศรีสะเกษ: 33,
  อุบลราชธานี: 34,
  ยโสธร: 35,
  ชัยภูมิ: 36,
  อำนาจเจริญ: 37,
  บึงกาฬ: 38,
  หนองบัวลำภู: 39,
  ขอนแก่น: 40,
  อุดรธานี: 41,
  เลย: 42,
  หนองคาย: 43,
  มหาสารคาม: 44,
  ร้อยเอ็ด: 45,
  กาฬสินธุ์: 46,
  สกลนคร: 47,
  นครพนม: 48,
  มุกดาหาร: 49,
  เชียงใหม่: 50,
  ลำพูน: 51,
  ลำปาง: 52,
  อุตรดิตถ์: 53,
  แพร่: 54,
  น่าน: 55,
  พะเยา: 56,
  เชียงราย: 57,
  แม่ฮ่องสอน: 58,
  นครสวรรค์: 60,
  อุทัยธานี: 61,
  กำแพงเพชร: 62,
  ตาก: 63,
  สุโขทัย: 64,
  พิษณุโลก: 65,
  พิจิตร: 66,
  เพชรบูรณ์: 67,
  ราชบุรี: 70,
  กาญจนบุรี: 71,
  สุพรรณบุรี: 72,
  นครปฐม: 73,
  สมุทรสาคร: 74,
  สมุทรสงคราม: 75,
  เพชรบุรี: 76,
  ประจวบคีรีขันธ์: 77,
  นครศรีธรรมราช: 80,
  กระบี่: 81,
  พังงา: 82,
  ภูเก็ต: 83,
  สุราษฎร์ธานี: 84,
  ระนอง: 85,
  ชุมพร: 86,
  สงขลา: 90,
  สตูล: 91,
  ตรัง: 92,
  พัทลุง: 93,
  ปัตตานี: 94,
  ยะลา: 95,
  นราธิวาส: 96
}

const ADDRESS_KEYS = [
  'address', 'moo', 'building', 'soi', 'road', 'province', 'district', 'subdistrict', 'zipcode', 'phone',
  'checkboxAddressContact', 'addressContact', 'mooContact', 'buildingContact', 'soiContact', 'roadContact', 'provinceContact', 'districtContact', 'subdistrictContact', 'zipcodeContact', 'phoneContact',
  'checkboxAddressDocument', 'addressDocument', 'mooDocument', 'buildingDocument', 'soiDocument', 'roadDocument', 'provinceDocument', 'districtDocument', 'subdistrictDocument', 'zipcodeDocument', 'phoneDocument'
]

export default {
  name: 'EditProfileAddress',

  props: {
    value: {
      type: Object,
      default: () => ({})
    },
    initialForm: {
      type: Object,
      default: () => ({})
    },
    geoProvinces: {
      type: Array,
      default: () => []
    },
    geoDistricts: {
      type: Array,
      default: () => []
    },
    geoSubdistricts: {
      type: Array,
      default: () => []
    },
    isLoadingGeo: {
      type: Boolean,
      default: false
    }
  },

  data () {
    const initial = {
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

    if (this.value) {
      for (const k of ADDRESS_KEYS) {
        if (this.value[k] !== undefined && this.value[k] !== null) {
          initial[k] = this.value[k]
        }
      }
    }

    return {
      internalGeoProvinces: cachedGeoData ? cachedGeoData.provinces : [],
      internalGeoDistricts: cachedGeoData ? cachedGeoData.districts : [],
      internalGeoSubdistricts: cachedGeoData ? cachedGeoData.subdistricts : [],
      internalIsLoadingGeo: false,

      localForm: initial
    }
  },

  computed: {
    activeGeoProvinces () {
      if (this.geoProvinces && this.geoProvinces.length > 0) {
        return this.geoProvinces
      }
      return this.internalGeoProvinces
    },

    activeGeoDistricts () {
      if (this.geoDistricts && this.geoDistricts.length > 0) {
        return this.geoDistricts
      }
      return this.internalGeoDistricts
    },

    activeGeoSubdistricts () {
      if (this.geoSubdistricts && this.geoSubdistricts.length > 0) {
        return this.geoSubdistricts
      }
      return this.internalGeoSubdistricts
    },

    activeIsLoadingGeo () {
      return this.isLoadingGeo || this.internalIsLoadingGeo
    },

    provinceOptions () {
      if (this.activeGeoProvinces && this.activeGeoProvinces.length > 0) {
        return this.activeGeoProvinces.map(p => p.nameTh)
      }
      return []
    },

    districtOptions () {
      return this.getDistrictList(this.localForm.province, this.localForm.district)
    },

    subdistrictOptions () {
      return this.getSubdistrictList(this.localForm.province, this.localForm.district, this.localForm.subdistrict)
    },

    zipcodeOptions () {
      return this.getZipcodeOptions(
        this.localForm.province,
        this.localForm.district,
        this.localForm.subdistrict,
        this.localForm.zipcode
      )
    },

    districtContactOptions () {
      return this.getDistrictList(this.localForm.provinceContact, this.localForm.districtContact)
    },

    subdistrictContactOptions () {
      return this.getSubdistrictList(this.localForm.provinceContact, this.localForm.districtContact, this.localForm.subdistrictContact)
    },

    zipcodeContactOptions () {
      return this.getZipcodeOptions(
        this.localForm.provinceContact,
        this.localForm.districtContact,
        this.localForm.subdistrictContact,
        this.localForm.zipcodeContact
      )
    },

    districtDocumentOptions () {
      return this.getDistrictList(this.localForm.provinceDocument, this.localForm.districtDocument)
    },

    subdistrictDocumentOptions () {
      return this.getSubdistrictList(this.localForm.provinceDocument, this.localForm.districtDocument, this.localForm.subdistrictDocument)
    },

    zipcodeDocumentOptions () {
      return this.getZipcodeOptions(
        this.localForm.provinceDocument,
        this.localForm.districtDocument,
        this.localForm.subdistrictDocument,
        this.localForm.zipcodeDocument
      )
    }
  },

  watch: {
    value: {
      handler (val) {
        if (!val) { return }
        for (const k of ADDRESS_KEYS) {
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
        for (const k of ADDRESS_KEYS) {
          updated[k] = val[k]
        }
        this.$emit('input', updated)
      },
      deep: true
    }
  },

  mounted () {
    if (!this.geoProvinces || this.geoProvinces.length === 0) {
      this.loadGeoData()
    }
  },

  methods: {
    isModified (key) {
      if (!this.initialForm || Object.keys(this.initialForm).length === 0) {
        return false
      }
      if (key.startsWith('checkboxAddress')) {
        return Boolean(this.localForm[key]) !== Boolean(this.initialForm[key])
      }
      const current = String(this.localForm[key] || '').trim()
      const original = String(this.initialForm[key] || '').trim()
      return current !== original
    },

    toggleAddressContact (checked) {
      if (checked) {
        this.localForm.addressContact = this.localForm.address
        this.localForm.mooContact = this.localForm.moo
        this.localForm.buildingContact = this.localForm.building
        this.localForm.soiContact = this.localForm.soi
        this.localForm.roadContact = this.localForm.road
        this.localForm.provinceContact = this.localForm.province
        this.localForm.districtContact = this.localForm.district
        this.localForm.subdistrictContact = this.localForm.subdistrict
        this.localForm.zipcodeContact = this.localForm.zipcode
        this.localForm.phoneContact = this.localForm.phone
      }
    },

    toggleAddressDocument (checked) {
      if (checked) {
        this.localForm.addressDocument = this.localForm.address
        this.localForm.mooDocument = this.localForm.moo
        this.localForm.buildingDocument = this.localForm.building
        this.localForm.soiDocument = this.localForm.soi
        this.localForm.roadDocument = this.localForm.road
        this.localForm.provinceDocument = this.localForm.province
        this.localForm.districtDocument = this.localForm.district
        this.localForm.subdistrictDocument = this.localForm.subdistrict
        this.localForm.zipcodeDocument = this.localForm.zipcode
        this.localForm.phoneDocument = this.localForm.phone
      }
    },

    async loadGeoData () {
      if (cachedGeoData) {
        this.internalGeoProvinces = cachedGeoData.provinces
        this.internalGeoDistricts = cachedGeoData.districts
        this.internalGeoSubdistricts = cachedGeoData.subdistricts
        return
      }

      this.internalIsLoadingGeo = true
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
        this.internalGeoProvinces = provinces
        this.internalGeoDistricts = districts
        this.internalGeoSubdistricts = subdistricts
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to load geo data', err)
      } finally {
        this.internalIsLoadingGeo = false
      }
    },

    getProvCode (provName) {
      if (!provName) { return null }
      if (PROV_CODE_MAP[provName]) { return PROV_CODE_MAP[provName] }
      const p = this.activeGeoProvinces.find(x => x.nameTh === provName)
      return p ? p.id : null
    },

    findDistrict (provCode, distName) {
      if (!provCode || !distName) { return null }
      return this.activeGeoDistricts.find(d => Math.floor(d.id / 100) === provCode && d.nameTh === distName)
    },

    getDistrictList (province, currentDistrict) {
      const provCode = this.getProvCode(province)
      if (!provCode) {
        return currentDistrict ? [currentDistrict] : []
      }
      const list = this.activeGeoDistricts
        .filter(d => Math.floor(d.id / 100) === provCode)
        .map(d => d.nameTh)
      if (currentDistrict && !list.includes(currentDistrict)) {
        return [currentDistrict, ...list]
      }
      return list
    },

    getSubdistrictList (province, district, currentSubdistrict) {
      const provCode = this.getProvCode(province)
      if (!provCode) {
        return currentSubdistrict ? [currentSubdistrict] : []
      }
      const dist = this.findDistrict(provCode, district)
      if (!dist) {
        return currentSubdistrict ? [currentSubdistrict] : []
      }
      const list = this.activeGeoSubdistricts
        .filter(s => Math.floor(s.id / 100) === dist.id)
        .map(s => s.nameTh)
      if (currentSubdistrict && !list.includes(currentSubdistrict)) {
        return [currentSubdistrict, ...list]
      }
      return list
    },

    getZipcodeOptions (province, district, subdistrict, currentZipcode) {
      const provCode = this.getProvCode(province)
      if (!provCode || !district) {
        return currentZipcode ? [currentZipcode] : []
      }
      const dist = this.findDistrict(provCode, district)
      if (!dist) {
        return currentZipcode ? [currentZipcode] : []
      }
      let subList = this.activeGeoSubdistricts.filter(s => Math.floor(s.id / 100) === dist.id)
      if (subdistrict) {
        const matched = subList.filter(s => s.nameTh === subdistrict)
        if (matched.length > 0) {
          subList = matched
        }
      }
      const raw = subList.map(s => String(s.zipCode)).filter(Boolean)
      const list = [...new Set(raw)]
      if (currentZipcode && !list.includes(currentZipcode)) {
        return [currentZipcode, ...list]
      }
      return list
    },

    onProvinceChange () {
      this.localForm.district = ''
      this.localForm.subdistrict = ''
      this.localForm.zipcode = ''
    },

    onDistrictChange () {
      this.localForm.subdistrict = ''
      this.localForm.zipcode = ''
    },

    onSubdistrictChange () {
      const provCode = this.getProvCode(this.localForm.province)
      const dist = this.findDistrict(provCode, this.localForm.district)
      if (dist && this.localForm.subdistrict) {
        const sub = this.activeGeoSubdistricts.find(s => Math.floor(s.id / 100) === dist.id && s.nameTh === this.localForm.subdistrict)
        if (sub && sub.zipCode) {
          this.localForm.zipcode = String(sub.zipCode)
        }
      }
    },

    onProvinceContactChange () {
      this.localForm.districtContact = ''
      this.localForm.subdistrictContact = ''
      this.localForm.zipcodeContact = ''
    },

    onDistrictContactChange () {
      this.localForm.subdistrictContact = ''
      this.localForm.zipcodeContact = ''
    },

    onSubdistrictContactChange () {
      const provCode = this.getProvCode(this.localForm.provinceContact)
      const dist = this.findDistrict(provCode, this.localForm.districtContact)
      if (dist && this.localForm.subdistrictContact) {
        const sub = this.activeGeoSubdistricts.find(s => Math.floor(s.id / 100) === dist.id && s.nameTh === this.localForm.subdistrictContact)
        if (sub && sub.zipCode) {
          this.localForm.zipcodeContact = String(sub.zipCode)
        }
      }
    },

    onProvinceDocumentChange () {
      this.localForm.districtDocument = ''
      this.localForm.subdistrictDocument = ''
      this.localForm.zipcodeDocument = ''
    },

    onDistrictDocumentChange () {
      this.localForm.subdistrictDocument = ''
      this.localForm.zipcodeDocument = ''
    },

    onSubdistrictDocumentChange () {
      const provCode = this.getProvCode(this.localForm.provinceDocument)
      const dist = this.findDistrict(provCode, this.localForm.districtDocument)
      if (dist && this.localForm.subdistrictDocument) {
        const sub = this.activeGeoSubdistricts.find(s => Math.floor(s.id / 100) === dist.id && s.nameTh === this.localForm.subdistrictDocument)
        if (sub && sub.zipCode) {
          this.localForm.zipcodeDocument = String(sub.zipCode)
        }
      }
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
</style>
