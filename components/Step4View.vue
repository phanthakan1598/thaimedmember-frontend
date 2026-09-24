<template>
  <v-card class="pa-4" :class="{ 'readonly-view': readonly }">
    <div class="d-flex align-center mt-3" style="justify-content: flex-start !important;">
      <v-img
        :src="require('@/assets/images/data2.jpg')"
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

    <!-- รูปโปรไฟล์ -->
    <v-row>
      <v-col cols="12">
        <span class="font-weight-bold">รูปโปรไฟล์</span>
      </v-col>
      <v-col cols="12" align="center">
        <v-avatar size="150" color="#f2f2f2">
          <v-img v-if="localForm.profileImageUrl" :src="localForm.profileImageUrl" />
          <v-icon v-else size="80" color="#bdbdbd">
            mdi-account
          </v-icon>
        </v-avatar>
      </v-col>
    </v-row>

    <v-divider class="my-6" />

    <v-row>
      <v-col cols="12" md="12">
        <span style="font-size: 24px; font-weight: bold;">
          ชื่อ-นามสกุล (ภาษาไทย)
        </span>
      </v-col>
      <v-col cols="6" md="3" class="py-0">
        <span class="text-field-label">คำนำหน้า</span>
        <span class="text--secondary text-caption">(ภาษาไทย)</span>
      </v-col>
      <v-col cols="6" md="3" class="py-0">
        <span class="text-field-value"> {{ localForm.name1Th || '-' }} </span>
      </v-col>
      <v-col cols="6" md="3" class="py-0">
        <span class="text-field-label">ยศ</span>
        <span class="text--secondary text-caption">(ภาษาไทย)</span>
      </v-col>
      <v-col cols="6" md="3" class="py-0">
        <span class="text-field-value"> {{ localForm.nameRankTh || '-' }} </span>
      </v-col>
      <v-col cols="6" md="3" class="py-0">
        <span class="text-field-label">ชื่อ</span>
        <span class="text--secondary text-caption">(ภาษาไทย)</span>
      </v-col>
      <v-col cols="6" md="3" class="py-0">
        <span class="text-field-value"> {{ localForm.name2Th || '-' }} </span>
      </v-col>
      <v-col cols="6" md="3" class="py-0">
        <span class="text-field-label">นามสกุล</span>
        <span class="text--secondary text-caption">(ภาษาไทย)</span>
      </v-col>
      <v-col cols="6" md="3" class="py-0">
        <span class="text-field-value"> {{ localForm.name3Th || '-' }} </span>
      </v-col>
      <v-col cols="6" md="3" class="py-0">
        <span class="text-field-label">ชื่อเดิม</span>
        <span class="text--secondary text-caption">(ภาษาไทย)</span>
      </v-col>
      <v-col cols="6" md="3" class="py-0">
        <span class="text-field-value"> {{ localForm.name2OldTh || '-' }} </span>
      </v-col>
      <v-col cols="6" md="3" class="py-0">
        <span class="text-field-label">นามสกุลเดิม</span>
        <span class="text--secondary text-caption">(ภาษาไทย)</span>
      </v-col>
      <v-col cols="6" md="3" class="py-0">
        <span class="text-field-value"> {{ localForm.name3OldTh || '-' }} </span>
      </v-col>
    </v-row>

    <v-divider class="my-6" />

    <v-row>
      <v-col cols="12" md="12">
        <span style="font-size: 24px; font-weight: bold;">
          ชื่อ-นามสกุล (ภาษาอังกฤษ)
        </span>
      </v-col>
      <v-col cols="6" md="3" class="py-0">
        <span class="text-field-label">คำนำหน้า</span>
        <span class="text--secondary text-caption">(ภาษาอังกฤษ)</span>
      </v-col>
      <v-col cols="6" md="3" class="py-0">
        <span class="text-field-value"> {{ localForm.name1En || '-' }} </span>
      </v-col>
      <v-col cols="6" md="3" class="py-0">
        <span class="text-field-label">ยศ</span>
        <span class="text--secondary text-caption">(ภาษาอังกฤษ)</span>
      </v-col>
      <v-col cols="6" md="3" class="py-0">
        <span class="text-field-value"> {{ localForm.nameRankEn || '-' }} </span>
      </v-col>
      <v-col cols="6" md="3" class="py-0">
        <span class="text-field-label">ชื่อ</span>
        <span class="text--secondary text-caption">(ภาษาอังกฤษ)</span>
      </v-col>
      <v-col cols="6" md="3" class="py-0">
        <span class="text-field-value"> {{ localForm.name2En || '-' }} </span>
      </v-col>
      <v-col cols="6" md="3" class="py-0">
        <span class="text-field-label">นามสกุล</span>
        <span class="text--secondary text-caption">(ภาษาอังกฤษ)</span>
      </v-col>
      <v-col cols="6" md="3" class="py-0">
        <span class="text-field-value"> {{ localForm.name3En || '-' }} </span>
      </v-col>
      <v-col cols="6" md="3" class="py-0">
        <span class="text-field-label">ชื่อเดิม</span>
        <span class="text--secondary text-caption">(ภาษาอังกฤษ)</span>
      </v-col>
      <v-col cols="6" md="3" class="py-0">
        <span class="text-field-value"> {{ localForm.name2OldEn || '-' }} </span>
      </v-col>
      <v-col cols="6" md="3" class="py-0">
        <span class="text-field-label">นามสกุลเดิม</span>
        <span class="text--secondary text-caption">(ภาษาอังกฤษ)</span>
      </v-col>
      <v-col cols="6" md="3" class="py-0">
        <span class="text-field-value"> {{ localForm.name3OldEn || '-' }} </span>
      </v-col>
    </v-row>

    <v-divider class="my-6" />

    <v-row>
      <v-col cols="12" md="12">
        <span style="font-size: 24px; font-weight: bold;">
          ข้อมูลทั่วไป
        </span>
      </v-col>
      <v-col cols="6" md="3" class="py-0">
        <span class="text-field-label">เลขบัตรประชาชน</span>
      </v-col>
      <v-col cols="6" md="3" class="py-0">
        <span class="text-field-value"> {{ localForm.idCard || '-' }} </span>
      </v-col>
      <v-col cols="6" md="3" class="py-0">
        <span class="text-field-label">เพศ</span>
      </v-col>
      <v-col cols="6" md="3" class="py-0">
        <span class="text-field-value"> {{ localForm.gender || '-' }} </span>
      </v-col>
      <v-col cols="6" md="3" class="py-0">
        <span class="text-field-label">วัน เดือน ปีเกิด</span>
      </v-col>
      <v-col cols="6" md="3" class="py-0">
        <span class="text-field-value"> {{ birthDateThaiDisplay || '-' }} </span>
      </v-col>
      <v-col cols="6" md="3" class="py-0">
        <span class="text-field-label">สัญชาติ</span>
      </v-col>
      <v-col cols="6" md="3" class="py-0">
        <span class="text-field-value"> {{ localForm.nationality || '-' }} </span>
      </v-col>
      <v-col cols="6" md="3" class="py-0">
        <span class="text-field-label">เชื้อชาติ</span>
      </v-col>
      <v-col cols="6" md="3" class="py-0">
        <span class="text-field-value"> {{ localForm.ethnicity || '-' }} </span>
      </v-col>
      <v-col cols="6" md="3" class="py-0">
        <span class="text-field-label">ศาสนา</span>
      </v-col>
      <v-col cols="6" md="3" class="py-0">
        <span class="text-field-value"> {{ localForm.religion || '-' }} </span>
      </v-col>
      <v-col cols="6" md="3" class="py-0">
        <span class="text-field-label">เบอร์โทรศัพท์มือถือ</span>
      </v-col>
      <v-col cols="6" md="3" class="py-0">
        <span class="text-field-value"> {{ localForm.mobile || '-' }} </span>
      </v-col>
      <v-col cols="6" md="3" class="py-0">
        <span class="text-field-label">เบอร์โทรฉุกเฉิน</span>
      </v-col>
      <v-col cols="6" md="3" class="py-0">
        <span class="text-field-value"> {{ localForm.emergencyPhone || '-' }} </span>
      </v-col>
      <v-col cols="6" md="3" class="py-0">
        <span class="text-field-label">อีเมล</span>
      </v-col>
      <v-col cols="6" md="3" class="py-0">
        <span class="text-field-value"> {{ localForm.email || '-' }} </span>
      </v-col>
      <v-col cols="6" md="3" class="py-0">
        <span class="text-field-label">Line ID</span>
      </v-col>
      <v-col cols="6" md="3" class="py-0">
        <span class="text-field-value"> {{ localForm.idLine || '-' }} </span>
      </v-col>
    </v-row>

    <v-divider class="my-6" />

    <v-row>
      <v-col cols="12" md="12">
        <span style="font-size: 24px; font-weight: bold;">
          ที่อยู่ตามทะเบียนบ้าน
        </span>
      </v-col>
      <v-col cols="6" md="3" class="py-0">
        <span class="text-field-label">เลขที่</span>
      </v-col>
      <v-col cols="6" md="3" class="py-0">
        <span class="text-field-value"> {{ localForm.address || '-' }} </span>
      </v-col>
      <v-col cols="6" md="3" class="py-0">
        <span class="text-field-label">หมู่ที่</span>
      </v-col>
      <v-col cols="6" md="3" class="py-0">
        <span class="text-field-value"> {{ localForm.moo || '-' }} </span>
      </v-col>
      <v-col cols="6" md="3" class="py-0">
        <span class="text-field-label">หมู่บ้าน / อาคาร</span>
      </v-col>
      <v-col cols="6" md="3" class="py-0">
        <span class="text-field-value"> {{ localForm.building || '-' }} </span>
      </v-col>
      <v-col cols="6" md="3" class="py-0">
        <span class="text-field-label">ซอย</span>
      </v-col>
      <v-col cols="6" md="3" class="py-0">
        <span class="text-field-value"> {{ localForm.soi || '-' }} </span>
      </v-col>
      <v-col cols="6" md="3" class="py-0">
        <span class="text-field-label">ถนน</span>
      </v-col>
      <v-col cols="6" md="3" class="py-0">
        <span class="text-field-value"> {{ localForm.road || '-' }} </span>
      </v-col>
      <v-col cols="6" md="3" class="py-0">
        <span class="text-field-label">แขวง / ตำบล</span>
      </v-col>
      <v-col cols="6" md="3" class="py-0">
        <span class="text-field-value"> {{ localForm.subdistrict || '-' }} </span>
      </v-col>
      <v-col cols="6" md="3" class="py-0">
        <span class="text-field-label">เขต / อำเภอ</span>
      </v-col>
      <v-col cols="6" md="3" class="py-0">
        <span class="text-field-value"> {{ localForm.district || '-' }} </span>
      </v-col>
      <v-col cols="6" md="3" class="py-0">
        <span class="text-field-label">จังหวัด</span>
      </v-col>
      <v-col cols="6" md="3" class="py-0">
        <span class="text-field-value"> {{ localForm.province || '-' }} </span>
      </v-col>
      <v-col cols="6" md="3" class="py-0">
        <span class="text-field-label">รหัสไปรษณีย์</span>
      </v-col>
      <v-col cols="6" md="3" class="py-0">
        <span class="text-field-value"> {{ localForm.zipcode || '-' }} </span>
      </v-col>
      <v-col cols="6" md="3" class="py-0">
        <span class="text-field-label">เบอร์โทรศัพท์บ้าน </span>
      </v-col>
      <v-col cols="6" md="3" class="py-0">
        <span class="text-field-value"> {{ localForm.phone || '-' }} </span>
      </v-col>
    </v-row>

    <v-divider class="my-6" />

    <v-row>
      <v-col cols="12" md="12">
        <span style="font-size: 24px; font-weight: bold;">
          ที่อยู่ตามที่สามารถติดต่อได้
        </span>
      </v-col>
      <v-col cols="6" md="3" class="py-0">
        <span class="text-field-label">เลขที่</span>
      </v-col>
      <v-col cols="6" md="3" class="py-0">
        <span class="text-field-value"> {{ localForm.addressContact || '-' }} </span>
      </v-col>
      <v-col cols="6" md="3" class="py-0">
        <span class="text-field-label">หมู่ที่</span>
      </v-col>
      <v-col cols="6" md="3" class="py-0">
        <span class="text-field-value"> {{ localForm.mooContact || '-' }} </span>
      </v-col>
      <v-col cols="6" md="3" class="py-0">
        <span class="text-field-label">หมู่บ้าน / อาคาร</span>
      </v-col>
      <v-col cols="6" md="3" class="py-0">
        <span class="text-field-value"> {{ localForm.buildingContact || '-' }} </span>
      </v-col>
      <v-col cols="6" md="3" class="py-0">
        <span class="text-field-label">ซอย</span>
      </v-col>
      <v-col cols="6" md="3" class="py-0">
        <span class="text-field-value"> {{ localForm.soiContact || '-' }} </span>
      </v-col>
      <v-col cols="6" md="3" class="py-0">
        <span class="text-field-label">ถนน</span>
      </v-col>
      <v-col cols="6" md="3" class="py-0">
        <span class="text-field-value"> {{ localForm.roadContact || '-' }} </span>
      </v-col>
      <v-col cols="6" md="3" class="py-0">
        <span class="text-field-label">แขวง / ตำบล</span>
      </v-col>
      <v-col cols="6" md="3" class="py-0">
        <span class="text-field-value"> {{ localForm.subdistrictContact || '-' }} </span>
      </v-col>
      <v-col cols="6" md="3" class="py-0">
        <span class="text-field-label">เขต / อำเภอ</span>
      </v-col>
      <v-col cols="6" md="3" class="py-0">
        <span class="text-field-value"> {{ localForm.districtContact || '-' }} </span>
      </v-col>
      <v-col cols="6" md="3" class="py-0">
        <span class="text-field-label">จังหวัด</span>
      </v-col>
      <v-col cols="6" md="3" class="py-0">
        <span class="text-field-value"> {{ localForm.provinceContact || '-' }} </span>
      </v-col>
      <v-col cols="6" md="3" class="py-0">
        <span class="text-field-label">รหัสไปรษณีย์</span>
      </v-col>
      <v-col cols="6" md="3" class="py-0">
        <span class="text-field-value"> {{ localForm.zipcodeContact || '-' }} </span>
      </v-col>
      <v-col cols="6" md="3" class="py-0">
        <span class="text-field-label">เบอร์โทรศัพท์บ้าน </span>
      </v-col>
      <v-col cols="6" md="3" class="py-0">
        <span class="text-field-value"> {{ localForm.phoneContact || '-' }} </span>
      </v-col>
    </v-row>

    <v-divider class="my-6" />

    <v-row>
      <v-col cols="12" md="12">
        <span style="font-size: 24px; font-weight: bold;">
          สถานที่อยู่สำหรับส่งเอกสาร
        </span>
      </v-col>
      <v-col cols="6" md="3" class="py-0">
        <span class="text-field-label">เลขที่</span>
      </v-col>
      <v-col cols="6" md="3" class="py-0">
        <span class="text-field-value"> {{ localForm.addressDocument || '-' }} </span>
      </v-col>
      <v-col cols="6" md="3" class="py-0">
        <span class="text-field-label">หมู่ที่</span>
      </v-col>
      <v-col cols="6" md="3" class="py-0">
        <span class="text-field-value"> {{ localForm.mooDocument || '-' }} </span>
      </v-col>
      <v-col cols="6" md="3" class="py-0">
        <span class="text-field-label">หมู่บ้าน / อาคาร</span>
      </v-col>
      <v-col cols="6" md="3" class="py-0">
        <span class="text-field-value"> {{ localForm.buildingDocument || '-' }} </span>
      </v-col>
      <v-col cols="6" md="3" class="py-0">
        <span class="text-field-label">ซอย</span>
      </v-col>
      <v-col cols="6" md="3" class="py-0">
        <span class="text-field-value"> {{ localForm.soiDocument || '-' }} </span>
      </v-col>
      <v-col cols="6" md="3" class="py-0">
        <span class="text-field-label">ถนน</span>
      </v-col>
      <v-col cols="6" md="3" class="py-0">
        <span class="text-field-value"> {{ localForm.roadDocument || '-' }} </span>
      </v-col>
      <v-col cols="6" md="3" class="py-0">
        <span class="text-field-label">แขวง / ตำบล</span>
      </v-col>
      <v-col cols="6" md="3" class="py-0">
        <span class="text-field-value"> {{ localForm.subdistrictDocument || '-' }} </span>
      </v-col>
      <v-col cols="6" md="3" class="py-0">
        <span class="text-field-label">เขต / อำเภอ</span>
      </v-col>
      <v-col cols="6" md="3" class="py-0">
        <span class="text-field-value"> {{ localForm.districtDocument || '-' }} </span>
      </v-col>
      <v-col cols="6" md="3" class="py-0">
        <span class="text-field-label">จังหวัด</span>
      </v-col>
      <v-col cols="6" md="3" class="py-0">
        <span class="text-field-value"> {{ localForm.provinceDocument || '-' }} </span>
      </v-col>
      <v-col cols="6" md="3" class="py-0">
        <span class="text-field-label">รหัสไปรษณีย์</span>
      </v-col>
      <v-col cols="6" md="3" class="py-0">
        <span class="text-field-value"> {{ localForm.zipcodeDocument || '-' }} </span>
      </v-col>
      <v-col cols="6" md="3" class="py-0">
        <span class="text-field-label">เบอร์โทรศัพท์บ้าน </span>
      </v-col>
      <v-col cols="6" md="3" class="py-0">
        <span class="text-field-value"> {{ localForm.phoneDocument || '-' }} </span>
      </v-col>
    </v-row>

    <v-divider class="my-6" />

    <!-- ขอเป็นสมาชิกสภาฯ -->
    <div
      class="d-flex align-center mt-3"
      style="justify-content: flex-start !important;"
    >
      <v-img
        :src="require('@/assets/images/data2.jpg')"
        width="32"
        height="32"
        max-width="32"
        class="mr-2"
        contain
      />

      <h2 class="text-h6 font-weight-bold mb-0" style="color: #327531;">
        ขอเป็นสมาชิกสภาฯ
      </h2>
    </div>

    <v-divider class="my-6" />

    <v-row>
      <v-col cols="12">
        <span style="font-size: 24px; font-weight: bold;">
          ข้าพเจ้าขอรับรองว่าข้าพเจ้ามีคุณสมบัติและไม่มีลักษณะต้องห้ามดังต่อไปนี้
          <span class="red--text">*</span>
        </span>
      </v-col>
    </v-row>

    <v-row>
      <v-col
        v-for="(item, index) in qualificationList"
        :key="'qual-' + index"
        cols="12"
        class="py-1"
      >
        <v-checkbox
          v-model="localForm.qualifications[item.value]"
          style="font-weight: bold;"
          :label="item.label"
          class="py-0"
          readonly
          dense
        />
      </v-col>
    </v-row>

    <v-divider class="my-6" />

    <v-row>
      <v-col cols="12" md="12">
        <span style="font-size: 24px; font-weight: bold;">
          มาตรา 12(2)
        </span>
      </v-col>
    </v-row>

    <v-row v-if="!isTrainedsValid" class="mb-6">
      <v-col
        cols="12"
        class="py-1"
      >
        <v-card outlined class="pa-4">
          <v-row>
            <v-col cols="12">
              <span style="font-size: 24px; font-weight: bold;">
                ไม่มีข้อมูล
              </span>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col
        v-for="(item, index) in trainedList"
        :key="'train-' + index"
        cols="12"
        class="py-0"
      >
        <v-card v-if="localForm.traineds[item.value].status" outlined class="pa-4 my-1">
          <v-row>
            <v-col cols="12">
              <span class="text-field-value">
                {{ item.label }}
              </span>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="6" md="3" class="py-0">
              <span class="text-field-label">ชื่อสถานที่</span>
            </v-col>
            <v-col cols="6" md="3" class="py-0">
              <span class="text-field-value"> {{ localForm.traineds[item.value].loacation }} </span>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6" md="3" class="py-0">
              <span class="text-field-label">เมื่อปี พ.ศ.</span>
            </v-col>
            <v-col cols="6" md="3" class="py-0">
              <span class="text-field-value"> {{ localForm.traineds[item.value].date }} </span>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <v-divider class="my-6" />

    <v-row>
      <v-col cols="12" md="12">
        <span style="font-size: 24px; font-weight: bold;">
          ข้าพเจ้าสอบผ่านความรู้ตามที่กำหนดไว้ในข้อบังคับสภาการแพทย์แผนไทย
        </span>
      </v-col>
    </v-row>

    <v-row v-if="localForm.qualification_declarations.thai_medicine.status">
      <v-col cols="12" md="12">
        <span class="text-field-value">
          - มีความรู้ในวิชาชีพการแพทย์แผนไทย เพื่อการประกอบวิชาชีพการแพทย์แผนไทย
        </span>
      </v-col>

      <v-col
        v-for="(item, index) in qualificationDeclarationList"
        :key="'qd-' + index"
        cols="12"
        class="py-0"
      >
        <v-card v-if="qMedData(item.value).status" outlined class="pa-4 my-1">
          <v-row>
            <v-col cols="12">
              <span class="text-field-value">
                {{ item.label }}
              </span>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="6" md="3" class="py-0">
              <span class="text-field-label">สอบทฤษฎีผ่าน เมื่อวันที่</span>
            </v-col>
            <v-col cols="6" md="3" class="py-0">
              <span class="text-field-value"> {{ qMedData(item.value).theoryExamDate }} </span>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6" md="3" class="py-0">
              <span class="text-field-label">สอบปฎิบัติผ่าน เมื่อวันที่</span>
            </v-col>
            <v-col cols="6" md="3" class="py-0">
              <span class="text-field-value"> {{ qMedData(item.value).practicalExamDate }} </span>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-if="localForm.qualification_declarations.thai_applied.status">
      <v-col cols="12" md="12">
        <span class="text-field-value">
          - มีความรู้ในวิชาชีพการแพทย์แผนไทย เพื่อการประกอบวิชาชีพการแพทย์แผนไทยประยุกต์
        </span>
      </v-col>
      <v-col
        v-for="(item, index) in stepList"
        :key="'st-' + index"
        cols="12"
        class="py-0"
      >
        <v-card outlined class="pa-4 my-1">
          <v-row>
            <v-col cols="12">
              <span class="text-field-value">
                {{ item.label }}
              </span>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="6" md="3" class="py-0">
              <span class="text-field-label">ผลการสอบ ผ่าน เมื่อวันที่</span>
            </v-col>
            <v-col cols="6" md="3" class="py-0">
              <span class="text-field-value"> {{ localForm.qualification_declarations.thai_applied[item.value] }} </span>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <v-divider class="my-6" />

    <v-row>
      <v-col cols="12">
        <span style="font-size: 24px; font-weight: bold;">
          ข้าพเจ้าได้แนบหลักฐานประกอบการพิจารณาดังต่อไปนี้
        </span>
      </v-col>
    </v-row>

    <!-- เอกสารแนบ -->
    <template v-for="(item, i) in attachmentList">
      <div v-if="attachmentsStatus(item.value)" :key="'at-' + i" class="mb-2">
        <v-icon color="#4fb24d" size="20" class="mr-1">
          mdi-check-circle
        </v-icon>
        <span style="white-space: pre-line;">{{ item.label }}</span>
        <v-btn
          v-if="readonly && attachmentFileUrl('attachments', item.value)"
          :href="attachmentFileUrl('attachments', item.value)"
          target="_blank"
          rel="noopener noreferrer"
          text
          color="#327531"
          class="ml-2"
        >
          ดูเอกสาร
        </v-btn>
      </div>
    </template>

    <v-divider class="my-6" />

    <!-- ใบอนุญาต -->
    <div class="d-flex align-center mt-3">
      <v-icon color="#327531" class="mr-2">
        mdi-card-account-details
      </v-icon>
      <h2 class="text-h6 font-weight-bold mb-0" style="color: #327531;">
        ใบอนุญาต
      </h2>
    </div>

    <v-divider class="my-6" />

    <v-row>
      <v-col cols="12">
        <span style="font-size: 24px; font-weight: bold;">
          ข้าพเจ้ามีความประสงค์ขอเป็นสมาชิกสภาการแพทย์แผนไทย
        </span>
      </v-col>
    </v-row>

    <v-divider class="my-6" />

    <v-row>
      <v-col cols="12">
        <span style="font-size: 24px; font-weight: bold;">
          ข้าพเจ้ามีความประสงค์ขอขึ้นทะเบียนและรับใบอนุญาต
        </span>
      </v-col>
    </v-row>

    <v-row>
      <v-col
        v-for="(item, index) in professionList"
        :key="'pf-' + index"
        cols="12"
        class="py-0"
      >
        <v-card v-if="localForm.professions[item.value]" outlined class="pa-4 my-1">
          <v-row>
            <v-col cols="12">
              <span class="text-field-value">
                {{ item.label }}
              </span>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <!-- <span class="font-weight-bold">เป็นสมาชิกสภาการแพทย์แผนไทย</span>
    <v-text-field :value="localForm.memberNumber || 'XXXXXXXX'" outlined dense readonly class="mt-2" />

    <span class="font-weight-bold">ขึ้นทะเบียนและรับใบอนุญาต</span>
    <template v-for="(item, i) in professionList">
      <v-card
        v-if="localForm.professions[item.value]"
        :key="'pf-' + i"
        outlined
        class="pa-4 my-2"
      >
        <div class="font-weight-bold">
          {{ item.label }}
        </div>
        <div class="text--secondary">
          เลขที่ใบอนุญาต
        </div>
        <div class="font-weight-bold" style="color: #4fb24d;">
          {{ localForm.licenseNumber || 'XXXXXXXX' }}
        </div>
      </v-card>
    </template> -->

    <v-divider class="my-6" />

    <v-row>
      <v-col cols="12">
        <span style="font-size: 24px; font-weight: bold;">
          ข้าพเจ้าได้แนบหลักฐานประกอบการพิจารณาดังต่อไปนี้
        </span>
      </v-col>
    </v-row>

    <!-- เอกสารแนบ -->
    <template v-for="(item, i) in evidenceList">
      <div v-if="evidenceStatus(item.value)" :key="'ev-' + i" class="mb-2">
        <v-icon color="#4fb24d" size="20" class="mr-1">
          mdi-check-circle
        </v-icon>
        <span style="white-space: pre-line;">{{ item.label }}</span>
        <v-btn
          v-if="readonly && attachmentFileUrl('evidences', item.value)"
          :href="attachmentFileUrl('evidences', item.value)"
          target="_blank"
          rel="noopener noreferrer"
          text
          color="#327531"
          class="ml-2"
        >
          ดูเอกสาร
        </v-btn>
      </div>
    </template>

    <v-divider class="my-6" />

    <div class="mb-4">
      <span style="font-size: 24px; font-weight: bold;">วิธีการรับหนังสือสำคัญและใบอนุญาต</span>
      <div class="text-field-value mt-1">
        {{ documentDeliveryMethodLabel }}
      </div>
    </div>

    <v-divider class="my-6" />

    <div class="mb-4">
      <span style="font-size: 24px; font-weight: bold;">สรุปค่าธรรมเนียม</span>
      <template v-if="feeSummary.total > 0">
        <div class="d-flex justify-space-between mt-2">
          <span>ค่าจดทะเบียนสมาชิก</span><span>{{ feeSummary.registrationFee.toLocaleString() }} บาท</span>
        </div>
        <div class="d-flex justify-space-between mt-2">
          <span>ค่าหนังสือสำคัญการเป็นสมาชิก</span><span>{{ feeSummary.certificateFee.toLocaleString() }} บาท</span>
        </div>
        <div class="d-flex justify-space-between mt-2">
          <span>ค่าขึ้นทะเบียนและรับใบอนุญาต ({{ feeSummary.licenseQuantity }} ด้าน)</span>
          <span>{{ feeSummary.licenseFee.toLocaleString() }} บาท</span>
        </div>
        <div class="d-flex justify-space-between mt-2">
          <span>ค่าบัตรสมาชิก</span><span>{{ feeSummary.cardFee.toLocaleString() }} บาท</span>
        </div>
        <div class="d-flex justify-space-between mt-2">
          <span>ค่าจัดส่ง</span><span>{{ feeSummary.deliveryFee.toLocaleString() }} บาท</span>
        </div>
        <div class="d-flex justify-space-between mt-2">
          <span>ค่าระบบ</span><span>{{ feeSummary.systemFee.toLocaleString() }} บาท</span>
        </div>
        <div class="d-flex justify-space-between font-weight-bold mt-3 text-field-value">
          <span>รวม</span><span>{{ feeSummary.total.toLocaleString() }} บาท</span>
        </div>
      </template>
      <div v-else class="text-field-value mt-2">
        ไม่มีค่าธรรมเนียม
      </div>
    </div>

    <v-divider class="my-6" />

    <!-- คำยินยอม -->
    <div class="font-weight-bold mb-2">
      คำยินยอม
    </div>
    <v-checkbox v-model="localForm.consents.agreeApply" label="ข้าพเจ้ายินยอมการสมัคร" :readonly="readonly" dense />
    <v-checkbox v-model="localForm.consents.agreeTrue" label="ข้าพเจ้ายินยอมว่าข้อมูลเป็นความจริง" :readonly="readonly" dense />

    <div v-if="!readonly" class="d-flex flex-wrap" :class="$vuetify.breakpoint.smAndDown ? 'flex-column-reverse' : 'justify-end'" style="gap: 12px;">
      <v-btn color="#4fb24d" outlined large :block="$vuetify.breakpoint.smAndDown" @click="$emit('back')">
        <v-icon left>
          mdi-chevron-left
        </v-icon>ย้อนกลับ
      </v-btn>
      <v-btn
        :disabled="!localForm.consents.agreeApply || !localForm.consents.agreeTrue"
        style="color: #e6f4e6; background-color: #4fb24d;"
        large
        :block="$vuetify.breakpoint.smAndDown"
        @click="$emit('submit')"
      >
        บันทึกข้อมูล
      </v-btn>
    </div>
  </v-card>
</template>

<script>

export default {
  name: 'Step4Review',

  props: {
    value: {
      type: Object,
      required: true
    },
    readonly: {
      type: Boolean,
      default: false
    },
    requestFeeDetails: {
      type: Object,
      default: null
    },
    applicantType: {
      type: String,
      default: ''
    }
  },

  data () {
    return {
      // labels/lists ต้องตรงกับที่ใช้ใน Step2Member.vue / Step3Certificate.vue
      qualificationList: [
        { value: 'age', label: 'มีอายุไม่ต่ำกว่าสิบปีบริบูรณ์' },
        { value: 'no_conduct_issue', label: 'ไม่เป็นผู้มีความประพฤติเสียหายที่จะนำซึ่งความเสื่อมเสียเกียรติศักดิ์แห่งวิชาชีพ' },
        { value: 'no_jail', label: 'ไม่เคยต้องโทษจำคุกโดยคำพิพากษาถึงที่สุดที่จะนำมาซึ่งความเสื่อมเสียเกียรติศักดิ์แห่งวิชาชีพ' },
        { value: 'no_mental_illness', label: 'ไม่เป็นผู้วิกลจริต จิตฟั่นเฟือนไม่สมประกอบ หรือไม่เป็นโรคที่กำหนดไว้ในข้อบังคับสภาการแพทย์แผนไทย' },
        { value: 'has_knowledge', label: 'มีความรู้ในวิชาชีพการแพทย์แผนไทย ตามพระราชบัญญัติวิชาชีพการแพทย์แผนไทย พ.ศ.2556' }
      ],
      trainedList: [
        { value: 'trained_institution', label: 'ได้รับการฝึกอบรมจากสถาบันหรือสถานพยาบาลที่สภาการแพทย์แผนไทยรับรอง\nโดยมีผู้ประกอบวิชาชีพการแพทย์แผนไทยซึ่งได้รับอนุญาตให้ถ่ายทอดความรู้เป็นผู้ให้การอบรม' },
        { value: 'degree_thai_medicine', label: 'ได้รับปริญญาหรือประกาศนียบัตรเทียบเท่าปริญญาสาขาการแพทย์แผนไทยจากสถาบันการศึกษาที่สภาการแพทย์แผนไทยรับรอง' },
        { value: 'degree_applied_thai_medicine', label: 'ได้รับปริญญาหรือประกาศนียบัตรเทียบเท่าปริญญาสาขาการแพทย์แผนไทยประยุกต์จากสถาบันการศึกษาที่สภาการแพทย์แผนไทยรับรอง' },
        { value: 'folk_medicine_certified', label: 'เป็นผู้ที่ส่วนราชการรับรองความรู้การแพทย์พื้นบ้านไทย' }
      ],
      qualificationDeclarationList: [
        { value: 'thai_medicine', label: 'ด้านเวชกรรมไทย' },
        { value: 'thai_pharmacy', label: 'ด้านเภสัชกรรมไทย' },
        { value: 'thai_midwifery', label: 'ด้านผดุงครรภ์ไทย' },
        { value: 'thai_massage', label: 'ด้านนวดไทย' },
        { value: 'folk_medicine', label: 'ด้านแพทย์พื้นบ้าน' }
      ],
      stepList: [
        { value: 'step1Date', label: 'ขั้นตอนที่ 1' },
        { value: 'step2Date', label: 'ขั้นตอนที่ 2' },
        { value: 'step3Date', label: 'ขั้นตอนที่ 3' }
      ],
      professionList: [
        { value: 'thai_medicine', label: 'วิชาชีพการแพทย์แผนไทย ด้านเวชกรรมไทย' },
        { value: 'thai_pharmacy', label: 'วิชาชีพการแพทย์แผนไทย ด้านเภสัชกรรมไทย' },
        { value: 'thai_midwifery', label: 'วิชาชีพการแพทย์แผนไทย ด้านผดุงครรภ์ไทย' },
        { value: 'thai_massage', label: 'วิชาชีพการแพทย์แผนไทย ด้านนวดไทย' },
        { value: 'folk_medicine', label: 'วิชาชีพการแพทย์แผนไทย ด้านแพทย์พื้นบ้าน' },
        { value: 'thai_applied', label: 'วิชาชีพการแพทย์แผนไทยประยุกต์' }
      ],
      attachmentList: [
        {
          value: 'id_card',
          label: 'สำเนาบัตรประจำตัวประชาชน หรือสำเนาบัตรประจำตัวเจ้าหน้าที่ของรัฐหรือสำเนาบัตรพนักงานของรัฐ หรือหนังสือเดินทาง หรือเอกสารคนต่างด้าว (พร้อมรับรองสำเนาถูกต้อง)'
        },
        {
          value: 'transcript',
          label: 'สำเนาใบรายงานผลการศึกษาหรือสำเนาใบปริญญาบัตรหรือประกาศนียบัตรเทียบเท่าปริญญา (พร้อมรับรองสำเนาถูกต้อง)'
        },
        {
          value: 'exam_result_letter',
          label: 'หนังสือแสดงผลการสอบผ่านความรู้จากสภาการแพทย์แผนไทย (ถ้ามี)'
        },
        {
          value: 'health_certificate',
          label: 'หนังสือรับรองการตรวจสุขภาพหรือใบรับรองแพทย์เพื่อขอขึ้นทะเบียนและรับใบอนุญาตเป็นผู้ประกอบวิชาชีพ'
        },
        {
          value: 'photo',
          label: 'ภาพถ่ายขนาด 1 นิ้วแต่งกายสุภาพหน้าตรง ครึ่งตัวท่าปกติ ไม่สวมหมวก ไม่ใส่แว่นตา ซึ่งถ่ายไว้ไม่เกิน 6 เดือน จำนวน 2 ภาพ (ต้องไม่เป็นภาพถ่ายโพลาลอยด์)'
        },
        {
          value: 'other_evidence',
          label: 'หลักฐานอื่นๆ (ถ้ามี)'
        }
      ],
      evidenceList: [
        { value: 'id_card', label: 'สำเนาบัตรประจำตัวประชาชน หรือสำเนาบัตรประจำตัวเจ้าหน้าที่ของรัฐ หรือสำเนาบัตรพนักงานของรัฐ\nหรือหนังสือเดินทาง หรือเอกสารคนต่างด้าว (พร้อมรับรองสำเนาถูกต้อง)' },
        { value: 'photo', label: 'ภาพถ่ายขนาด 1 นิ้วแต่งกายสุภาพหน้าตรง ครึ่งตัวท่าปกติ ไม่สวมหมวก ไม่ใส่แว่นตา\nซึ่งถ่ายไว้ไม่เกิน 6 เดือน จำนวน 2 ภาพ (ต้องไม่เป็นภาพถ่ายโพลาลอยด์)' },
        { value: 'other_evidence', label: 'หลักฐานอื่นๆ (ถ้ามี)' }
      ],

      localForm: {
        ...this.value,
        consents: {
          agreeApply: false,
          agreeTrue: false,
          ...(this.value.consents || {})
        }
      }
    }
  },

  computed: {
    feeSummary () {
      if (this.requestFeeDetails) {
        const items = this.requestFeeDetails.items || []
        const findItem = code => items.find(item => item.code === code) || {}
        const license = findItem('professional_license')
        return {
          registrationFee: findItem('member_registration').amount || 0,
          certificateFee: findItem('membership_certificate').amount || 0,
          cardFee: findItem('membership_card').amount || 0,
          systemFee: findItem('system_fee').amount || 0,
          licenseQuantity: license.quantity || 0,
          licenseFee: license.amount || 0,
          deliveryFee: this.requestFeeDetails.deliveryFee || 0,
          total: this.requestFeeDetails.total || 0
        }
      }

      const applicantType = this.applicantType || this.$store.state.customerData?.eligibility?.applicantType || 'new_member'
      if (['legacy_member', 'role55'].includes(applicantType)) {
        return { registrationFee: 0, certificateFee: 0, cardFee: 0, systemFee: 0, licenseQuantity: 0, licenseFee: 0, deliveryFee: 0, total: 0 }
      }

      const licenseQuantity = Object.values(this.localForm.professions || {})
        .filter(selected => selected === true).length
      const registrationFee = 1000
      const certificateFee = 1000
      const cardFee = 100
      const systemFee = 45
      const licenseFee = licenseQuantity * 1000
      const deliveryFee = this.localForm.documentDeliveryMethod === 'postal' ? 100 : 0
      return {
        registrationFee,
        certificateFee,
        cardFee,
        systemFee,
        licenseQuantity,
        licenseFee,
        deliveryFee,
        total: registrationFee + certificateFee + cardFee + systemFee + licenseFee + deliveryFee
      }
    },
    birthDateThaiDisplay () {
      if (!this.localForm.birthDate) { return '-' }
      const [year, month, day] = this.localForm.birthDate.split('-')
      return `${day}-${month}-${parseInt(year, 10) + 543}`
    },
    isTrainedsValid () {
      let validate = false
      for (const key in this.localForm.traineds) {
        if (this.localForm.traineds[key].status === true) {
          validate = true
        }
      }
      return validate
    },
    documentDeliveryMethodLabel () {
      const labels = {
        postal: 'จัดส่งทางไปรษณีย์ (ค่าธรรมเนียม 100 บาท)',
        self_pickup: 'รับด้วยตนเองที่สภาการแพทย์แผนไทย'
      }
      return labels[this.localForm.documentDeliveryMethod] || '-'
    }
  },
  watch: {
    localForm: {
      handler (val) {
        this.$emit('input', val)
      },
      deep: true,
      immediate: true
    }
  },
  beforeDestroy () {
    if (
      this.localForm.profileImageUrl &&
    this.localForm.profileImageUrl.startsWith('blob:')
    ) {
      URL.revokeObjectURL(this.localForm.profileImageUrl)
    }
  },

  mounted () {
    if (this.localForm.profileImageFile instanceof File) {
      this.localForm.profileImageUrl = URL.createObjectURL(
        this.localForm.profileImageFile
      )
    }
  },

  methods: {
    pickAddress (suffix) {
      const v = this.value
      return {
        no: v['address' + suffix] || v.address,
        moo: v['moo' + suffix] || v.moo,
        building: v['building' + suffix] || v.building,
        soi: v['soi' + suffix] || v.soi,
        road: v['road' + suffix] || v.road,
        subdistrict: v['subdistrict' + suffix] || v.subdistrict,
        district: v['district' + suffix] || v.district,
        province: v['province' + suffix] || v.province,
        zipcode: v['zipcode' + suffix] || v.zipcode,
        phone: v['phone' + suffix] || v.phone
      }
    },

    qMedData (key) {
      return this.localForm.qualification_declarations.thai_medicine.data[key]
    },

    attachmentsStatus (key) {
      const item = this.localForm.attachments[key]
      // evidences เก็บเป็น boolean ในบาง version หรือ { status, file } ในอีก version, เผื่อไว้ทั้งสองแบบ
      return typeof item === 'object' ? !!(item && item.status) : !!item
    },

    evidenceStatus (key) {
      const item = this.localForm.evidences[key]
      // evidences เก็บเป็น boolean ในบาง version หรือ { status, file } ในอีก version, เผื่อไว้ทั้งสองแบบ
      return typeof item === 'object' ? !!(item && item.status) : !!item
    },

    attachmentFileUrl (group, key) {
      return this.localForm[group]?.[key]?.file?.url || ''
    }
  }
}
</script>

<style scoped>
.text-field-label {
  font-size: 20px;
  font-weight: bold;
}
.text-field-value {
  font-size: 20px;
  font-weight: bold;
  color: #327531;
}
.readonly-view ::v-deep .v-input--is-disabled,
.readonly-view ::v-deep .v-input--is-disabled .v-label,
.readonly-view ::v-deep .v-input--is-disabled input {
  color: rgba(0, 0, 0, 0.87) !important;
  opacity: 1 !important;
}
/* AddressSection ใช้ FieldRow ซ้ำในรูปแบบเดียวกัน จึงประกาศ local component แบบ functional ผ่าน render ด้านล่าง */
</style>
