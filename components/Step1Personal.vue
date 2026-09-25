<template>
  <v-card class="pa-4">
    <!-- หัวข้อ: ข้อมูลส่วนตัว -->
    <div
      class="d-flex align-center mt-3"
      style="justify-content: flex-start !important;"
    >
      <v-img
        :src="require('@/assets/images/data1.png')"
        width="32"
        height="32"
        max-width="32"
        class="mr-2"
        contain
      />

      <h2 class="text-h6 font-weight-bold mb-0" style="color: #327531;">
        ข้อมูลส่วนตัว
      </h2>
    </div>

    <v-divider class="my-6" />
    <!-- form -->
    <validation-observer ref="step1" v-slot="{ handleSubmit }">
      <v-form ref="form" @submit.prevent="handleSubmit(nextStep)">
        <!-- รูปโปรไฟล์ -->
        <v-row>
          <v-col cols="12" md="12">
            <span style="font-size: 24px; font-weight: bold;">
              รูปโปรไฟล์
            </span>
          </v-col>
          <v-col cols="12" md="12" align="center">
            <validation-provider v-slot="{ errors }" rules="required">
              <ProfileImageUpload
                v-model="localForm.profileImageUrl"
                :error-messages="errors"
                @change="handleImageChange"
              />
            </validation-provider>
          </v-col>
        </v-row>

        <v-divider class="my-6" />
        <!-- ชื่อ-นามสกุล (ภาษาไทย) -->
        <v-row>
          <v-col cols="12" md="12">
            <span style="font-size: 24px; font-weight: bold;">
              ชื่อ-นามสกุล (ภาษาไทย)
            </span>
          </v-col>

          <v-col cols="12" md="6" class="py-0">
            คำนำหน้า<small class="ml-1" style="color: red">*</small>
            <span class="text--secondary text-caption">(ภาษาไทย)</span>
            <validation-provider v-slot="{ errors }" rules="required">
              <v-select
                v-model="localForm.name1Th"
                :items="prefixListTh"
                placeholder="กรุณาระบุคำนำหน้า"
                outlined
                color="primary"
                dense
                :error-messages="errors"
              />
            </validation-provider>
          </v-col>

          <v-col cols="12" md="6" class="py-0">
            ยศ
            <span class="text--secondary text-caption">(ภาษาไทย)</span>
            <validation-provider v-slot="{ errors }" rules="thaiOnly|noSpace">
              <v-text-field
                v-model="localForm.nameRankTh"
                placeholder="กรุณาระบุยศ"
                outlined
                dense
                :error-messages="errors"
              />
            </validation-provider>
          </v-col>

          <v-col cols="12" md="6" class="py-0">
            ชื่อ<small class="ml-1" style="color: red">*</small>
            <span class="text--secondary text-caption">(ภาษาไทย)</span>
            <validation-provider v-slot="{ errors }" rules="required|thaiOnly|noSpace">
              <v-text-field
                v-model="localForm.name2Th"
                placeholder="กรุณาระบุชื่อ"
                outlined
                dense
                :error-messages="errors"
              />
            </validation-provider>
          </v-col>

          <v-col cols="12" md="6" class="py-0">
            นามสกุล<small class="ml-1" style="color: red">*</small>
            <span class="text--secondary text-caption">(ภาษาไทย)</span>
            <validation-provider v-slot="{ errors }" rules="required|thaiOnly|noSpace">
              <v-text-field
                v-model="localForm.name3Th"
                placeholder="กรุณาระบุนามสกุล"
                outlined
                dense
                :error-messages="errors"
              />
            </validation-provider>
          </v-col>

          <v-col cols="12" md="6" class="py-0">
            ชื่อเดิม
            <span class="text--secondary text-caption">(ภาษาไทย)</span>
            <validation-provider v-slot="{ errors }" rules="thaiOnly|noSpace">
              <v-text-field
                v-model="localForm.name2OldTh"
                placeholder="กรุณาระบุชื่อเดิม"
                outlined
                dense
                :error-messages="errors"
              />
            </validation-provider>
          </v-col>

          <v-col cols="12" md="6" class="py-0">
            นามสกุลเดิม
            <span class="text--secondary text-caption">(ภาษาไทย)</span>
            <validation-provider v-slot="{ errors }" rules="thaiOnly|noSpace">
              <v-text-field
                v-model="localForm.name3OldTh"
                placeholder="กรุณาระบุนามสกุลเดิม"
                outlined
                dense
                :error-messages="errors"
              />
            </validation-provider>
          </v-col>
        </v-row>

        <v-divider class="my-6" />
        <!-- ชื่อ-นามสกุล (ภาษาอังกฤษ) -->
        <v-row>
          <v-col cols="12" md="12">
            <span style="font-size: 24px; font-weight: bold;">
              ชื่อ-นามสกุล (ภาษาอังกฤษ)
            </span>
          </v-col>

          <v-col cols="12" md="6" class="py-0">
            คำนำหน้า<small class="ml-1" style="color: red">*</small>
            <span class="text--secondary text-caption">(ภาษาอังกฤษ)</span>
            <validation-provider v-slot="{ errors }" rules="required">
              <v-select
                v-model="localForm.name1En"
                :items="prefixListEn"
                placeholder="กรุณาระบุคำนำหน้า"
                outlined
                dense
                :error-messages="errors"
              />
            </validation-provider>
          </v-col>

          <v-col cols="12" md="6" class="py-0">
            ยศ
            <span class="text--secondary text-caption">(ภาษาอังกฤษ)</span>
            <validation-provider v-slot="{ errors }" rules="engOnly|noSpace">
              <v-text-field
                v-model="localForm.nameRankEn"
                placeholder="กรุณาระบุยศ"
                outlined
                dense
                :error-messages="errors"
              />
            </validation-provider>
          </v-col>

          <v-col cols="12" md="6" class="py-0">
            ชื่อ<small class="ml-1" style="color: red">*</small>
            <span class="text--secondary text-caption">(ภาษาอังกฤษ)</span>
            <validation-provider v-slot="{ errors }" rules="required|engOnly|noSpace">
              <v-text-field
                v-model="localForm.name2En"
                placeholder="กรุณาระบุชื่อ"
                outlined
                dense
                :error-messages="errors"
              />
            </validation-provider>
          </v-col>

          <v-col cols="12" md="6" class="py-0">
            นามสกุล<small class="ml-1" style="color: red">*</small>
            <span class="text--secondary text-caption">(ภาษาอังกฤษ)</span>
            <validation-provider v-slot="{ errors }" rules="required|engOnly|noSpace">
              <v-text-field
                v-model="localForm.name3En"
                placeholder="กรุณาระบุนามสกุล"
                outlined
                dense
                :error-messages="errors"
              />
            </validation-provider>
          </v-col>

          <v-col cols="12" md="6" class="py-0">
            ชื่อเดิม
            <span class="text--secondary text-caption">(ภาษาอังกฤษ)</span>
            <validation-provider v-slot="{ errors }" rules="engOnly|noSpace">
              <v-text-field
                v-model="localForm.name2OldEn"
                placeholder="กรุณาระบุชื่อเดิม"
                outlined
                dense
                :error-messages="errors"
              />
            </validation-provider>
          </v-col>

          <v-col cols="12" md="6" class="py-0">
            นามสกุลเดิม
            <span class="text--secondary text-caption">(ภาษาอังกฤษ)</span>
            <validation-provider v-slot="{ errors }" rules="engOnly|noSpace">
              <v-text-field
                v-model="localForm.name3OldEn"
                placeholder="กรุณาระบุนามสกุลเดิม"
                outlined
                dense
                :error-messages="errors"
              />
            </validation-provider>
          </v-col>
        </v-row>

        <v-divider class="my-6" />
        <!-- ข้อมูลทั่วไป -->
        <v-row>
          <v-col cols="12" md="12">
            <span style="font-size: 24px; font-weight: bold;">
              ข้อมูลทั่วไป
            </span>
          </v-col>

          <v-col cols="12" md="3" class="py-0">
            เลขบัตรประชาชน<small class="ml-1" style="color: red">*</small>
            <span class="text--secondary text-caption">(ใช้เข้าสู่ระบบ)</span>
            <validation-provider v-slot="{ errors }" rules="required|thaiID">
              <v-text-field
                v-model="localForm.idCard"
                placeholder="กรุณาระบุเลขบัตรประชาชน"
                outlined
                dense
                :disabled="isCustomerIDLocked"
                :error-messages="errors"
              />
            </validation-provider>
          </v-col>
          <v-col cols="12" md="3" class="py-0">
            เบอร์โทรศัพท์มือถือ<small class="ml-1" style="color: red">*</small>
            <span class="text--secondary text-caption">(ใช้แทนรหัสผ่าน)</span>
            <validation-provider v-slot="{ errors }" rules="required|numeric|digits:10|noSpace">
              <v-text-field
                v-model="localForm.mobile"
                placeholder="กรุณาระบุเลขเบอร์โทรศัพท์มือถือ"
                outlined
                dense
                :disabled="isMobileLocked"
                :error-messages="errors"
              />
            </validation-provider>
          </v-col>
          <v-col cols="12" md="3" class="py-0">
            อีเมลหลัก<small class="ml-1" style="color: red">*</small>
            <validation-provider v-slot="{ errors }" rules="required|email|noSpace">
              <v-text-field
                v-model="localForm.email"
                placeholder="กรุณาระบุอีเมลหลัก"
                outlined
                dense
                :error-messages="errors"
              />
            </validation-provider>
          </v-col>
          <v-col cols="12" md="3" class="py-0">
            Line ID
            <validation-provider v-slot="{ errors }" rules="lineID|noSpace">
              <v-text-field
                v-model="localForm.idLine"
                placeholder="กรุณาระบุ Line ID"
                outlined
                dense
                :error-messages="errors"
              />
            </validation-provider>
          </v-col>

          <v-col cols="12" md="3" class="py-0">
            สัญชาติ<small class="ml-1" style="color: red">*</small>
            <validation-provider v-slot="{ errors }" rules="required|thaiOnly|noSpace">
              <v-text-field
                v-model="localForm.nationality"
                placeholder="กรุณาระบุสัญชาติ"
                outlined
                dense
                :error-messages="errors"
              />
            </validation-provider>
          </v-col>

          <v-col cols="12" md="3" class="py-0">
            เชื้อชาติ<small class="ml-1" style="color: red">*</small>
            <validation-provider v-slot="{ errors }" rules="required|thaiOnly|noSpace">
              <v-text-field
                v-model="localForm.ethnicity"
                placeholder="กรุณาระบุเชื้อชาติ"
                outlined
                dense
                :error-messages="errors"
              />
            </validation-provider>
          </v-col>

          <v-col cols="12" md="3" class="py-0">
            ศาสนา<small class="ml-1" style="color: red">*</small>
            <validation-provider v-slot="{ errors }" rules="required|thaiOnly|noSpace">
              <v-text-field
                v-model="localForm.religion"
                placeholder="กรุณาระบุศาสนา"
                outlined
                dense
                :error-messages="errors"
              />
            </validation-provider>
          </v-col>

          <v-col cols="12" md="3" class="py-0">
            เพศ<small class="ml-1" style="color: red">*</small>
            <validation-provider v-slot="{ errors }" rules="required">
              <v-select
                v-model="localForm.gender"
                :items="genderList"
                placeholder="กรุณาระบุเพศ"
                outlined
                dense
                :error-messages="errors"
              />
            </validation-provider>
          </v-col>

          <v-col cols="12" md="3" class="py-0">
            วัน เดือน ปีเกิด<small class="ml-1" style="color: red">*</small>
            <v-menu
              v-model="birthMenu"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template #activator="{ on, attrs }">
                <validation-provider v-slot="{ errors }" rules="required|age18">
                  <v-text-field
                    :value="birthDateThaiDisplay"
                    placeholder="กรุณาระบุวัน เดือน ปีเกิด"
                    readonly
                    append-icon="mdi-calendar"
                    outlined
                    dense
                    v-bind="attrs"
                    :error-messages="errors"
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

        <v-divider class="my-6" />
        <!-- ที่อยู่ตามทะเบียนบ้าน -->
        <v-row>
          <v-col cols="12" md="12">
            <span style="font-size: 24px; font-weight: bold;">
              ที่อยู่ตามทะเบียนบ้าน
            </span>
          </v-col>

          <v-col cols="12" md="4" class="py-0">
            บ้านเลขที่<small class="ml-1" style="color: red">*</small>
            <validation-provider v-slot="{ errors }" rules="required">
              <v-text-field
                v-model="localForm.address"
                placeholder="กรุณาระบุบ้านเลขที่"
                outlined
                dense
                :error-messages="errors"
              />
            </validation-provider>
          </v-col>

          <v-col cols="12" md="4" class="py-0">
            หมู่ที่
            <v-text-field
              v-model="localForm.moo"
              placeholder="กรุณาระบุหมู่ที่"
              outlined
              dense
            />
          </v-col>

          <v-col cols="12" md="4" class="py-0">
            หมู่บ้าน / อาคาร
            <v-text-field
              v-model="localForm.building"
              placeholder="กรุณาระบุหมู่บ้าน / อาคาร"
              outlined
              dense
            />
          </v-col>

          <v-col cols="12" md="4" class="py-0">
            ซอย
            <v-text-field
              v-model="localForm.soi"
              placeholder="กรุณาระบุซอย"
              outlined
              dense
            />
          </v-col>

          <v-col cols="12" md="4" class="py-0">
            ถนน
            <v-text-field
              v-model="localForm.road"
              placeholder="กรุณาระบุถนน"
              outlined
              dense
            />
          </v-col>

          <v-col cols="12" md="4" class="py-0">
            จังหวัด<small class="ml-1" style="color: red">*</small>
            <validation-provider v-slot="{ errors }" rules="required">
              <v-autocomplete
                v-model="localForm.province"
                :items="provinceOptions"
                :loading="isLoadingGeo"
                placeholder="กรุณาระบุจังหวัด"
                outlined
                dense
                :error-messages="errors"
                @change="onProvinceChange"
              />
            </validation-provider>
          </v-col>

          <v-col cols="12" md="4" class="py-0">
            เขต / อำเภอ<small class="ml-1" style="color: red">*</small>
            <validation-provider v-slot="{ errors }" rules="required">
              <v-autocomplete
                v-model="localForm.district"
                :items="districtOptions"
                :disabled="!localForm.province"
                placeholder="กรุณาระบุเขต / อำเภอ"
                outlined
                dense
                :error-messages="errors"
                @change="onDistrictChange"
              />
            </validation-provider>
          </v-col>

          <v-col cols="12" md="4" class="py-0">
            แขวง / ตำบล<small class="ml-1" style="color: red">*</small>
            <validation-provider v-slot="{ errors }" rules="required">
              <v-autocomplete
                v-model="localForm.subdistrict"
                :items="subdistrictOptions"
                :disabled="!localForm.district"
                placeholder="กรุณาระบุแขวง / ตำบล"
                outlined
                dense
                :error-messages="errors"
                @change="onSubdistrictChange"
              />
            </validation-provider>
          </v-col>

          <v-col cols="12" md="4" class="py-0">
            รหัสไปรษณีย์<small class="ml-1" style="color: red">*</small>
            <validation-provider v-slot="{ errors }" rules="required">
              <v-autocomplete
                v-model="localForm.zipcode"
                :items="zipcodeOptions"
                :disabled="!localForm.district"
                placeholder="กรุณาระบุรหัสไปรษณีย์"
                outlined
                dense
                :error-messages="errors"
              />
            </validation-provider>
          </v-col>

          <v-col cols="12" md="4" class="py-0">
            เบอร์โทรศัพท์บ้าน
            <validation-provider v-slot="{ errors }" rules="numeric|noSpace|min:9|max:10">
              <v-text-field
                v-model="localForm.phone"
                placeholder="กรุณาระบุเบอร์โทรศัพท์บ้าน"
                outlined
                dense
                :error-messages="errors"
              />
            </validation-provider>
          </v-col>
        </v-row>

        <v-divider class="my-6" />
        <!-- ที่อยู่ตามที่สามารถติดต่อได้ -->
        <v-row>
          <v-col cols="12" md="12" class="d-flex align-center">
            <span style="font-size: 24px; font-weight: bold;">
              ที่อยู่ตามที่สามารถติดต่อได้
            </span>
            <v-checkbox
              v-model="localForm.checkboxAddressContact"
              class="ml-2 ma-0 pa-0"
              hide-details
              label="ใช้ตามที่อยู่ทะเบียนบ้าน"
              :disabled="!localForm.checkboxAddressContact && !isRegisteredAddressValid"
              @change="toggleAddressContact"
            />
          </v-col>

          <v-col cols="12" md="4" class="py-0">
            บ้านเลขที่<small class="ml-1" style="color: red">*</small>
            <validation-provider v-slot="{ errors }" rules="required">
              <v-text-field
                v-model="localForm.addressContact"
                placeholder="กรุณาระบุบ้านเลขที่"
                outlined
                :disabled="localForm.checkboxAddressContact"
                dense
                :error-messages="errors"
              />
            </validation-provider>
          </v-col>

          <v-col cols="12" md="4" class="py-0">
            หมู่ที่
            <v-text-field
              v-model="localForm.mooContact"
              placeholder="กรุณาระบุหมู่ที่"
              outlined
              :disabled="localForm.checkboxAddressContact"
              dense
            />
          </v-col>

          <v-col cols="12" md="4" class="py-0">
            หมู่บ้าน / อาคาร
            <v-text-field
              v-model="localForm.buildingContact"
              placeholder="กรุณาระบุหมู่บ้าน / อาคาร"
              outlined
              :disabled="localForm.checkboxAddressContact"
              dense
            />
          </v-col>

          <v-col cols="12" md="4" class="py-0">
            ซอย
            <v-text-field
              v-model="localForm.soiContact"
              placeholder="กรุณาระบุซอย"
              outlined
              :disabled="localForm.checkboxAddressContact"
              dense
            />
          </v-col>

          <v-col cols="12" md="4" class="py-0">
            ถนน
            <v-text-field
              v-model="localForm.roadContact"
              placeholder="กรุณาระบุถนน"
              outlined
              :disabled="localForm.checkboxAddressContact"
              dense
            />
          </v-col>

          <v-col cols="12" md="4" class="py-0">
            จังหวัด<small class="ml-1" style="color: red">*</small>
            <validation-provider v-slot="{ errors }" rules="required">
              <v-autocomplete
                v-model="localForm.provinceContact"
                :items="provinceOptions"
                :loading="isLoadingGeo"
                placeholder="กรุณาระบุจังหวัด"
                outlined
                :disabled="localForm.checkboxAddressContact"
                dense
                :error-messages="errors"
                @change="onProvinceContactChange"
              />
            </validation-provider>
          </v-col>

          <v-col cols="12" md="4" class="py-0">
            เขต / อำเภอ<small class="ml-1" style="color: red">*</small>
            <validation-provider v-slot="{ errors }" rules="required">
              <v-autocomplete
                v-model="localForm.districtContact"
                :items="districtContactOptions"
                placeholder="กรุณาระบุเขต / อำเภอ"
                outlined
                :disabled="localForm.checkboxAddressContact || !localForm.provinceContact"
                dense
                :error-messages="errors"
                @change="onDistrictContactChange"
              />
            </validation-provider>
          </v-col>

          <v-col cols="12" md="4" class="py-0">
            แขวง / ตำบล<small class="ml-1" style="color: red">*</small>
            <validation-provider v-slot="{ errors }" rules="required">
              <v-autocomplete
                v-model="localForm.subdistrictContact"
                :items="subdistrictContactOptions"
                placeholder="กรุณาระบุแขวง / ตำบล"
                outlined
                :disabled="localForm.checkboxAddressContact || !localForm.districtContact"
                dense
                :error-messages="errors"
                @change="onSubdistrictContactChange"
              />
            </validation-provider>
          </v-col>

          <v-col cols="12" md="4" class="py-0">
            รหัสไปรษณีย์<small class="ml-1" style="color: red">*</small>
            <validation-provider v-slot="{ errors }" rules="required">
              <v-autocomplete
                v-model="localForm.zipcodeContact"
                :items="zipcodeContactOptions"
                placeholder="กรุณาระบุรหัสไปรษณีย์"
                outlined
                :disabled="localForm.checkboxAddressContact || !localForm.districtContact"
                dense
                :error-messages="errors"
              />
            </validation-provider>
          </v-col>

          <v-col cols="12" md="4" class="py-0">
            เบอร์โทรศัพท์บ้าน
            <validation-provider v-slot="{ errors }" rules="numeric|noSpace|min:9|max:10">
              <v-text-field
                v-model="localForm.phoneContact"
                placeholder="กรุณาระบุเบอร์โทรศัพท์บ้าน"
                outlined
                :disabled="localForm.checkboxAddressContact"
                dense
                :error-messages="errors"
              />
            </validation-provider>
          </v-col>
        </v-row>
        <!-- สถานที่อยู่สำหรับส่งเอกสาร -->
        <v-row>
          <v-col cols="12" md="12" class="d-flex align-center">
            <span style="font-size: 24px; font-weight: bold;">
              สถานที่อยู่สำหรับส่งเอกสาร
            </span>
            <v-checkbox
              v-model="localForm.checkboxAddressDocument"
              class="ml-2 ma-0 pa-0"
              hide-details
              label="ใช้ตามที่อยู่ทะเบียนบ้าน"
              :disabled="!localForm.checkboxAddressDocument && !isRegisteredAddressValid"
              @change="toggleAddressDocument"
            />
          </v-col>

          <v-col cols="12" md="4" class="py-0">
            บ้านเลขที่<small class="ml-1" style="color: red">*</small>
            <validation-provider v-slot="{ errors }" rules="required">
              <v-text-field
                v-model="localForm.addressDocument"
                placeholder="กรุณาระบุบ้านเลขที่"
                outlined
                :disabled="localForm.checkboxAddressDocument"
                dense
                :error-messages="errors"
              />
            </validation-provider>
          </v-col>

          <v-col cols="12" md="4" class="py-0">
            หมู่ที่
            <v-text-field
              v-model="localForm.mooDocument"
              placeholder="กรุณาระบุหมู่ที่"
              outlined
              :disabled="localForm.checkboxAddressDocument"
              dense
            />
          </v-col>

          <v-col cols="12" md="4" class="py-0">
            หมู่บ้าน / อาคาร
            <v-text-field
              v-model="localForm.buildingDocument"
              placeholder="กรุณาระบุหมู่บ้าน / อาคาร"
              outlined
              :disabled="localForm.checkboxAddressDocument"
              dense
            />
          </v-col>

          <v-col cols="12" md="4" class="py-0">
            ซอย
            <v-text-field
              v-model="localForm.soiDocument"
              placeholder="กรุณาระบุซอย"
              outlined
              :disabled="localForm.checkboxAddressDocument"
              dense
            />
          </v-col>

          <v-col cols="12" md="4" class="py-0">
            ถนน
            <v-text-field
              v-model="localForm.roadDocument"
              placeholder="กรุณาระบุถนน"
              outlined
              :disabled="localForm.checkboxAddressDocument"
              dense
            />
          </v-col>

          <v-col cols="12" md="4" class="py-0">
            จังหวัด<small class="ml-1" style="color: red">*</small>
            <validation-provider v-slot="{ errors }" rules="required">
              <v-autocomplete
                v-model="localForm.provinceDocument"
                :items="provinceOptions"
                :loading="isLoadingGeo"
                placeholder="กรุณาระบุจังหวัด"
                outlined
                :disabled="localForm.checkboxAddressDocument"
                dense
                :error-messages="errors"
                @change="onProvinceDocumentChange"
              />
            </validation-provider>
          </v-col>

          <v-col cols="12" md="4" class="py-0">
            เขต / อำเภอ<small class="ml-1" style="color: red">*</small>
            <validation-provider v-slot="{ errors }" rules="required">
              <v-autocomplete
                v-model="localForm.districtDocument"
                :items="districtDocumentOptions"
                placeholder="กรุณาระบุเขต / อำเภอ"
                outlined
                :disabled="localForm.checkboxAddressDocument || !localForm.provinceDocument"
                dense
                :error-messages="errors"
                @change="onDistrictDocumentChange"
              />
            </validation-provider>
          </v-col>

          <v-col cols="12" md="4" class="py-0">
            แขวง / ตำบล<small class="ml-1" style="color: red">*</small>
            <validation-provider v-slot="{ errors }" rules="required">
              <v-autocomplete
                v-model="localForm.subdistrictDocument"
                :items="subdistrictDocumentOptions"
                placeholder="กรุณาระบุแขวง / ตำบล"
                outlined
                :disabled="localForm.checkboxAddressDocument || !localForm.districtDocument"
                dense
                :error-messages="errors"
                @change="onSubdistrictDocumentChange"
              />
            </validation-provider>
          </v-col>

          <v-col cols="12" md="4" class="py-0">
            รหัสไปรษณีย์<small class="ml-1" style="color: red">*</small>
            <validation-provider v-slot="{ errors }" rules="required">
              <v-autocomplete
                v-model="localForm.zipcodeDocument"
                :items="zipcodeDocumentOptions"
                placeholder="กรุณาระบุรหัสไปรษณีย์"
                outlined
                :disabled="localForm.checkboxAddressDocument || !localForm.districtDocument"
                dense
                :error-messages="errors"
              />
            </validation-provider>
          </v-col>

          <v-col cols="12" md="4" class="py-0">
            เบอร์โทรศัพท์บ้าน
            <validation-provider v-slot="{ errors }" rules="numeric|noSpace|min:9|max:10">
              <v-text-field
                v-model="localForm.phoneDocument"
                placeholder="กรุณาระบุเบอร์โทรศัพท์บ้าน"
                outlined
                :disabled="localForm.checkboxAddressDocument"
                dense
                :error-messages="errors"
              />
            </validation-provider>
          </v-col>
        </v-row>

        <v-divider class="my-6" />

        <div
          class="d-flex flex-wrap"
          :class="$vuetify.breakpoint.smAndDown ? 'flex-column-reverse' : 'justify-end'"
          style="gap: 12px;"
        >
          <v-spacer />
          <!-- <v-btn
            style="color: #e6f4e6; font-size: 16px; font-weight: bold; background-color: #4fb24d;"
            large
            :block="$vuetify.breakpoint.smAndDown"

          >
            ถัดไป
          </v-btn> -->
          <v-btn
            style="color: #e6f4e6; font-size: 16px; font-weight: bold; background-color: #4fb24d;"
            large
            :block="$vuetify.breakpoint.smAndDown"
            type="submit"
          >
            ถัดไป
            <v-icon right>
              mdi-chevron-right
            </v-icon>
          </v-btn>
          <!-- <v-btn
            style="color: #e6f4e6; font-size: 16px; font-weight: bold; background-color: #4fb24d;"
            large
            :block="$vuetify.breakpoint.smAndDown"
            @click="nextStep"
          >
            ถัดไป
          </v-btn> -->
        </div>
      </v-form>
    </validation-observer>
  </v-card>
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

export default {
  name: 'Step1PersonalComponent',

  props: {
    value: {
      type: Object,
      required: true
    }
  },

  data () {
    return {
      birthMenu: false,

      profileImage: null,

      geoProvinces: cachedGeoData ? cachedGeoData.provinces : [],
      geoDistricts: cachedGeoData ? cachedGeoData.districts : [],
      geoSubdistricts: cachedGeoData ? cachedGeoData.subdistricts : [],
      isLoadingGeo: false,

      prefixListTh: [
        'นาย',
        'นาง',
        'นางสาว'
      ],
      prefixListEn: [
        'Mr.',
        'Mrs.',
        'Miss'
      ],
      genderList: [
        'ชาย',
        'หญิง'
      ],
      provinceList: [
        'กรุงเทพมหานคร',
        'กระบี่',
        'กาญจนบุรี',
        'กาฬสินธุ์',
        'กำแพงเพชร',
        'ขอนแก่น',
        'จันทบุรี',
        'ฉะเชิงเทรา',
        'ชลบุรี',
        'ชัยนาท',
        'ชัยภูมิ',
        'ชุมพร',
        'ตรัง',
        'ตราด',
        'ตาก',
        'นครนายก',
        'นครปฐม',
        'นครพนม',
        'นครราชสีมา',
        'นครศรีธรรมราช',
        'นครสวรรค์',
        'นนทบุรี',
        'นราธิวาส',
        'น่าน',
        'บึงกาฬ',
        'บุรีรัมย์',
        'ปทุมธานี',
        'ประจวบคีรีขันธ์',
        'ปราจีนบุรี',
        'ปัตตานี',
        'พะเยา',
        'พังงา',
        'พัทลุง',
        'พิจิตร',
        'พิษณุโลก',
        'ภูเก็ต',
        'มหาสารคาม',
        'มุกดาหาร',
        'ยะลา',
        'ยโสธร',
        'ร้อยเอ็ด',
        'ระนอง',
        'ระยอง',
        'ราชบุรี',
        'ลพบุรี',
        'ลำปาง',
        'ลำพูน',
        'ศรีสะเกษ',
        'สกลนคร',
        'สงขลา',
        'สตูล',
        'สมุทรปราการ',
        'สมุทรสงคราม',
        'สมุทรสาคร',
        'สระบุรี',
        'สระแก้ว',
        'สิงห์บุรี',
        'สุพรรณบุรี',
        'สุราษฎร์ธานี',
        'สุรินทร์',
        'สุโขทัย',
        'สุรินทร์',
        'หนองคาย',
        'หนองบัวลำภู',
        'อำนาจเจริญ',
        'อุดรธานี',
        'อุตรดิตถ์',
        'อุทัยธานี',
        'อุบลราชธานี',
        'อ่างทอง',
        'เชียงราย',
        'เชียงใหม่',
        'เพชรบุรี',
        'เพชรบูรณ์',
        'เลย',
        'แพร่',
        'แม่ฮ่องสอน'
      ],

      localForm: {
        profileImage: null,
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
        phoneDocument: '',
        ...this.value
      }
    }
  },

  computed: {
    isCustomerIDLocked () {
      return Boolean(this.$store.state.customerData && this.$store.state.customerData.CustomerID)
    },
    isMobileLocked () {
      return this.$store.state.customerData?.mobileLocked === true
    },
    isRegisteredAddressValid () {
      const requiredFields = ['address', 'province', 'district', 'subdistrict', 'zipcode']
      const hasRequiredFields = requiredFields.every(field => String(this.localForm[field] || '').trim())
      const zipcodeValid = /^\d{5}$/.test(String(this.localForm.zipcode || ''))
      const phone = String(this.localForm.phone || '').trim()
      const phoneValid = !phone || /^\d{9,10}$/.test(phone)
      return hasRequiredFields && zipcodeValid && phoneValid
    },
    birthDateThaiDisplay () {
      if (!this.localForm.birthDate) { return '' }

      const [year, month, day] = this.localForm.birthDate.split('-')
      const buddhistYear = parseInt(year, 10) + 543

      // เติม 0 ข้างหน้าให้ครบ 2 หลัก (กรณี day/month เป็นเลขตัวเดียว)
      const dd = day.padStart(2, '0')
      const mm = month.padStart(2, '0')

      return `${dd}-${mm}-${buddhistYear}`
    },
    provinceOptions () {
      if (this.geoProvinces && this.geoProvinces.length > 0) {
        return this.geoProvinces.map(p => p.nameTh)
      }
      return this.provinceList
    },
    districtOptions () {
      const provCode = this.getProvCode(this.localForm.province)
      if (!provCode) {
        return this.localForm.district ? [this.localForm.district] : []
      }
      const list = this.geoDistricts
        .filter(d => Math.floor(d.id / 100) === provCode)
        .map(d => d.nameTh)
      if (this.localForm.district && !list.includes(this.localForm.district)) {
        return [this.localForm.district, ...list]
      }
      return list
    },
    subdistrictOptions () {
      const provCode = this.getProvCode(this.localForm.province)
      if (!provCode) {
        return this.localForm.subdistrict ? [this.localForm.subdistrict] : []
      }
      const dist = this.findDistrict(provCode, this.localForm.district)
      if (!dist) {
        return this.localForm.subdistrict ? [this.localForm.subdistrict] : []
      }
      const list = this.geoSubdistricts
        .filter(s => Math.floor(s.id / 100) === dist.id)
        .map(s => s.nameTh)
      if (this.localForm.subdistrict && !list.includes(this.localForm.subdistrict)) {
        return [this.localForm.subdistrict, ...list]
      }
      return list
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
      const provCode = this.getProvCode(this.localForm.provinceContact)
      if (!provCode) {
        return this.localForm.districtContact ? [this.localForm.districtContact] : []
      }
      const list = this.geoDistricts
        .filter(d => Math.floor(d.id / 100) === provCode)
        .map(d => d.nameTh)
      if (this.localForm.districtContact && !list.includes(this.localForm.districtContact)) {
        return [this.localForm.districtContact, ...list]
      }
      return list
    },
    subdistrictContactOptions () {
      const provCode = this.getProvCode(this.localForm.provinceContact)
      if (!provCode) {
        return this.localForm.subdistrictContact ? [this.localForm.subdistrictContact] : []
      }
      const dist = this.findDistrict(provCode, this.localForm.districtContact)
      if (!dist) {
        return this.localForm.subdistrictContact ? [this.localForm.subdistrictContact] : []
      }
      const list = this.geoSubdistricts
        .filter(s => Math.floor(s.id / 100) === dist.id)
        .map(s => s.nameTh)
      if (this.localForm.subdistrictContact && !list.includes(this.localForm.subdistrictContact)) {
        return [this.localForm.subdistrictContact, ...list]
      }
      return list
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
      const provCode = this.getProvCode(this.localForm.provinceDocument)
      if (!provCode) {
        return this.localForm.districtDocument ? [this.localForm.districtDocument] : []
      }
      const list = this.geoDistricts
        .filter(d => Math.floor(d.id / 100) === provCode)
        .map(d => d.nameTh)
      if (this.localForm.districtDocument && !list.includes(this.localForm.districtDocument)) {
        return [this.localForm.districtDocument, ...list]
      }
      return list
    },
    subdistrictDocumentOptions () {
      const provCode = this.getProvCode(this.localForm.provinceDocument)
      if (!provCode) {
        return this.localForm.subdistrictDocument ? [this.localForm.subdistrictDocument] : []
      }
      const dist = this.findDistrict(provCode, this.localForm.districtDocument)
      if (!dist) {
        return this.localForm.subdistrictDocument ? [this.localForm.subdistrictDocument] : []
      }
      const list = this.geoSubdistricts
        .filter(s => Math.floor(s.id / 100) === dist.id)
        .map(s => s.nameTh)
      if (this.localForm.subdistrictDocument && !list.includes(this.localForm.subdistrictDocument)) {
        return [this.localForm.subdistrictDocument, ...list]
      }
      return list
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
    localForm: {
      handler (val) {
        this.$emit('input', val)
      },
      deep: true,
      immediate: true
    }
  },

  mounted () {
    this.loadGeoData()
    if (this.localForm.name1Th && !this.localForm.name1En) {
      const prefixMap = { นาย: 'Mr.', นาง: 'Mrs.', นางสาว: 'Miss' }
      this.localForm.name1En = prefixMap[this.localForm.name1Th] || ''
    } else if (this.localForm.name1En && !this.localForm.name1Th) {
      const prefixMap = { 'Mr.': 'นาย', 'Mrs.': 'นาง', Miss: 'นางสาว' }
      this.localForm.name1Th = prefixMap[this.localForm.name1En] || ''
    }
    if (this.localForm.profileImageFile instanceof File) {
      this.localForm.profileImageUrl = URL.createObjectURL(
        this.localForm.profileImageFile
      )
    }
  },

  methods: {
    handleImageChange ({ file, previewUrl }) {
      this.localForm.profileImageFile = file
      this.localForm.profileImageUrl = previewUrl
    },
    nextStep () {
      this.$emit('next')
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
      } else {
        // Clear the contact address fields if checkbox is unchecked
        this.localForm.addressContact = ''
        this.localForm.mooContact = ''
        this.localForm.buildingContact = ''
        this.localForm.soiContact = ''
        this.localForm.roadContact = ''
        this.localForm.provinceContact = ''
        this.localForm.districtContact = ''
        this.localForm.subdistrictContact = ''
        this.localForm.zipcodeContact = ''
        this.localForm.phoneContact = ''
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
      } else {
        // Clear the document address fields if checkbox is unchecked
        this.localForm.addressDocument = ''
        this.localForm.mooDocument = ''
        this.localForm.buildingDocument = ''
        this.localForm.soiDocument = ''
        this.localForm.roadDocument = ''
        this.localForm.provinceDocument = ''
        this.localForm.districtDocument = ''
        this.localForm.subdistrictDocument = ''
        this.localForm.zipcodeDocument = ''
        this.localForm.phoneDocument = ''
      }
    },
    cleanName (name, type) {
      if (!name) { return '' }
      let str = String(name).trim()
      if (type === 'province') {
        str = str.replace(/^จังหวัด/, '')
      } else if (type === 'district') {
        str = str.replace(/^(อำเภอ|เขต)/, '')
      } else if (type === 'subdistrict') {
        str = str.replace(/^(ตำบล|แขวง)/, '')
      }
      return str.trim()
    },
    getProvCode (name) {
      if (!name) { return null }
      const clean = this.cleanName(name, 'province')
      return PROV_CODE_MAP[name] || PROV_CODE_MAP[clean] || null
    },
    findProvince (name) {
      if (!name) { return null }
      const target = String(name).trim()
      const cleanTarget = this.cleanName(target, 'province')
      return this.geoProvinces.find(p => p.nameTh === target || this.cleanName(p.nameTh, 'province') === cleanTarget) || null
    },
    findDistrict (provCode, name) {
      if (!provCode || !name) { return null }
      const target = String(name).trim()
      const cleanTarget = this.cleanName(target, 'district')
      return this.geoDistricts.find((d) => {
        if (Math.floor(d.id / 100) !== provCode) { return false }
        return d.nameTh === target || this.cleanName(d.nameTh, 'district') === cleanTarget
      }) || null
    },
    findSubdistrict (distId, name) {
      if (!distId || !name) { return null }
      const target = String(name).trim()
      const cleanTarget = this.cleanName(target, 'subdistrict')
      return this.geoSubdistricts.find((s) => {
        if (Math.floor(s.id / 100) !== distId) { return false }
        return s.nameTh === target || this.cleanName(s.nameTh, 'subdistrict') === cleanTarget
      }) || null
    },
    getZipcodeOptions (provName, distName, subName, currentZip) {
      const provCode = this.getProvCode(provName)
      if (!provCode) {
        return currentZip ? [currentZip] : []
      }
      const dist = this.findDistrict(provCode, distName)
      if (!dist) {
        return currentZip ? [currentZip] : []
      }
      if (subName) {
        const sub = this.findSubdistrict(dist.id, subName)
        if (sub && sub.zipCode) {
          const z = String(sub.zipCode)
          return currentZip && currentZip !== z ? [z, currentZip] : [z]
        }
      }
      const zips = this.geoSubdistricts
        .filter(s => Math.floor(s.id / 100) === dist.id && s.zipCode)
        .map(s => String(s.zipCode))
      const set = new Set(zips)
      if (currentZip) {
        set.add(currentZip)
      }
      return Array.from(set)
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

        cachedGeoData = {
          provinces,
          districts,
          subdistricts
        }

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
    onProvinceChange () {
      const provCode = this.getProvCode(this.localForm.province)
      const dist = provCode ? this.findDistrict(provCode, this.localForm.district) : null
      if (!dist) {
        this.localForm.district = ''
        this.localForm.subdistrict = ''
        this.localForm.zipcode = ''
      }
    },
    onDistrictChange () {
      const provCode = this.getProvCode(this.localForm.province)
      const dist = provCode ? this.findDistrict(provCode, this.localForm.district) : null
      const sub = dist ? this.findSubdistrict(dist.id, this.localForm.subdistrict) : null
      if (!sub) {
        this.localForm.subdistrict = ''
        this.localForm.zipcode = ''
      }
    },
    onSubdistrictChange (subName) {
      if (!subName) {
        this.localForm.zipcode = ''
        return
      }
      const provCode = this.getProvCode(this.localForm.province)
      if (!provCode) { return }
      const dist = this.findDistrict(provCode, this.localForm.district)
      if (!dist) { return }
      const sub = this.findSubdistrict(dist.id, subName)
      if (sub && sub.zipCode) {
        this.localForm.zipcode = String(sub.zipCode)
      }
    },
    onProvinceContactChange () {
      const provCode = this.getProvCode(this.localForm.provinceContact)
      const dist = provCode ? this.findDistrict(provCode, this.localForm.districtContact) : null
      if (!dist) {
        this.localForm.districtContact = ''
        this.localForm.subdistrictContact = ''
        this.localForm.zipcodeContact = ''
      }
    },
    onDistrictContactChange () {
      const provCode = this.getProvCode(this.localForm.provinceContact)
      const dist = provCode ? this.findDistrict(provCode, this.localForm.districtContact) : null
      const sub = dist ? this.findSubdistrict(dist.id, this.localForm.subdistrictContact) : null
      if (!sub) {
        this.localForm.subdistrictContact = ''
        this.localForm.zipcodeContact = ''
      }
    },
    onSubdistrictContactChange (subName) {
      if (!subName) {
        this.localForm.zipcodeContact = ''
        return
      }
      const provCode = this.getProvCode(this.localForm.provinceContact)
      if (!provCode) { return }
      const dist = this.findDistrict(provCode, this.localForm.districtContact)
      if (!dist) { return }
      const sub = this.findSubdistrict(dist.id, subName)
      if (sub && sub.zipCode) {
        this.localForm.zipcodeContact = String(sub.zipCode)
      }
    },
    onProvinceDocumentChange () {
      const provCode = this.getProvCode(this.localForm.provinceDocument)
      const dist = provCode ? this.findDistrict(provCode, this.localForm.districtDocument) : null
      if (!dist) {
        this.localForm.districtDocument = ''
        this.localForm.subdistrictDocument = ''
        this.localForm.zipcodeDocument = ''
      }
    },
    onDistrictDocumentChange () {
      const provCode = this.getProvCode(this.localForm.provinceDocument)
      const dist = provCode ? this.findDistrict(provCode, this.localForm.districtDocument) : null
      const sub = dist ? this.findSubdistrict(dist.id, this.localForm.subdistrictDocument) : null
      if (!sub) {
        this.localForm.subdistrictDocument = ''
        this.localForm.zipcodeDocument = ''
      }
    },
    onSubdistrictDocumentChange (subName) {
      if (!subName) {
        this.localForm.zipcodeDocument = ''
        return
      }
      const provCode = this.getProvCode(this.localForm.provinceDocument)
      if (!provCode) { return }
      const dist = this.findDistrict(provCode, this.localForm.districtDocument)
      if (!dist) { return }
      const sub = this.findSubdistrict(dist.id, subName)
      if (sub && sub.zipCode) {
        this.localForm.zipcodeDocument = String(sub.zipCode)
      }
    }
  }
}
</script>

<style scoped>
</style>
