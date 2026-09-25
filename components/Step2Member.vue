<template>
  <v-card class="pa-4">
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
        ขอเป็นสมาชิกสภาฯ และใบอนุญาต
      </h2>
    </div>

    <v-divider class="my-6" />

    <validation-observer ref="step2">
      <v-form ref="step2">
        <!-- หัวข้อคำรับรองคุณสมบัติ -->
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
            <validation-provider
              v-slot="{ errors }"
              :name="item.label"
              rules="mustBeTrue"
            >
              <v-checkbox
                v-model="localForm.qualifications[item.value]"
                :label="item.label"
                class="py-0"
                :error-messages="errors"
                dense
              />
            </validation-provider>
          </v-col>
        </v-row>

        <v-divider class="my-6" />

        <v-row>
          <v-col cols="12" md="12">
            <span style="font-size: 24px; font-weight: bold;">
              ตามมาตรา 12 (2)
            </span>
          </v-col>
        </v-row>

        <v-row class="mb-6">
          <v-col
            v-for="(item, index) in trainedList"
            :key="'train-' + index"
            cols="12"
            class="py-1"
          >
            <v-card outlined class="pa-4">
              <v-checkbox
                v-model="localForm.traineds[item.value].status"
                :label="item.label"
                class="py-0"
                hide-details
                dense
                @change="onTrainedStatusChange(item.value, $event)"
              />
              <v-row v-if="localForm.traineds[item.value].status" class="px-6">
                <v-col cols="12" md="6">
                  <span>
                    ชื่อสถานที่ <span class="red--text">*</span>
                  </span>
                  <validation-provider
                    v-slot="{ errors }"
                    :name="'trainedsLocation'+index"
                    rules="required"
                  >
                    <v-autocomplete
                      v-model="localForm.traineds[item.value].loacation"
                      :items="placeList"
                      placeholder="ระบุชื่อสถานที่"
                      outlined
                      dense
                      :error-messages="errors"
                    />
                  </validation-provider>
                </v-col>

                <v-col cols="12" md="6">
                  <span>
                    เมื่อปี พ.ศ. <span class="red--text">*</span>
                  </span>
                  <validation-provider
                    v-slot="{ errors }"
                    :name="'trainedsDate'+index"
                    rules="required|digits:4"
                  >
                    <v-autocomplete
                      v-model="localForm.traineds[item.value].date"
                      :items="yearList"
                      placeholder="ระบุปี พ.ศ. (ปปปป)"
                      outlined
                      dense
                      :error-messages="errors"
                    />
                  </validation-provider>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>

        <v-divider class="my-6" />

        <v-row>
          <v-col cols="12">
            <span style="font-size: 24px; font-weight: bold;">
              ข้าพเจ้าสอบผ่านความรู้ตามที่กำหนดไว้ในข้อบังคับสภาการแพทย์แผนไทย
              <span class="red--text">*</span>
            </span>
          </v-col>
        </v-row>

        <v-row>
          <v-col
            cols="12"
            class="py-1"
          >
            <v-card outlined class="pa-4 mb-2">
              <v-checkbox
                v-model="localForm.qualification_declarations.thai_medicine.status"
                label="มีความรู้ในวิชาชีพการแพทย์แผนไทย เพื่อการประกอบวิชาชีพการแพทย์แผนไทย ดังนี้"
                dense
                class="py-0"
                hide-details
                @change="onQualDeclMedParentChange"
              />
              <v-row v-if="localForm.qualification_declarations.thai_medicine.status" class="my-3 mx-3">
                <v-row class="pa-0 ma-0">
                  <v-col
                    v-for="(item, index) in qualificationDeclarationList"
                    :key="'qual-Decl' + index"
                    cols="12"
                    class="py-1"
                  >
                    <v-checkbox
                      v-model="localForm.qualification_declarations.thai_medicine.data[item.value].status"
                      :label="item.label"
                      dense
                      @change="onQualDeclMedStatusChange(item.value, $event)"
                    />

                    <v-row v-if="localForm.qualification_declarations.thai_medicine.data[item.value].status" class="px-6">
                      <v-col cols="12" md="6">
                        <span>สอบทฤษฎีผ่าน เมื่อวันที่</span>
                        <span class="text--secondary text-caption">(พ.ศ.)</span>
                        <span class="red--text">*</span>
                        <validation-provider
                          v-slot="{ errors: theoryErrors }"
                          :name="'theoryExamDate'+ index"
                          rules="required|digits:4"
                        >
                          <v-autocomplete
                            v-model="localForm.qualification_declarations.thai_medicine.data[item.value].theoryExamDate"
                            :items="yearList"
                            placeholder="ระบุปี พ.ศ. (ปปปป)"
                            outlined
                            dense
                            :error-messages="theoryErrors"
                          />
                        </validation-provider>
                      </v-col>

                      <v-col cols="12" md="6">
                        <span>สอบปฏิบัติผ่าน เมื่อวันที่</span>
                        <span class="text--secondary text-caption">(พ.ศ.)</span>
                        <span class="red--text">*</span>
                        <validation-provider
                          v-slot="{ errors: practicalErrors }"
                          :name="'practicalExamDate' + index"
                          rules="required|digits:4"
                        >
                          <v-autocomplete
                            v-model="localForm.qualification_declarations.thai_medicine.data[item.value].practicalExamDate"
                            :items="yearList"
                            placeholder="ระบุปี พ.ศ. (ปปปป)"
                            outlined
                            dense
                            :error-messages="practicalErrors"
                          />
                        </validation-provider>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
                <span v-if="showQualDeclMedError" class="red--text" style="font-size: 22px;">
                  กรุณาเพิ่มข้อมูลอย่างน้อย 1 อย่าง
                </span>
              </v-row>
            </v-card>

            <v-card outlined class="pa-4 mb-2">
              <v-checkbox
                v-model="localForm.qualification_declarations.thai_applied.status"
                label="มีความรู้ในวิชาชีพการแพทย์แผนไทย เพื่อการประกอบวิชาชีพการแพทย์แผนไทยประยุกต์"
                dense
                class="py-0"
                hide-details
                @change="onQualDeclAappliedParentChange"
              />
              <v-row v-if="localForm.qualification_declarations.thai_applied.status" class="my-3 mx-3">
                <v-col cols="12" class="py-0 my-0">
                  <span style="font-size: 24px;">
                    ผลการสอบ ผ่าน เมื่อวันที่
                  </span>
                </v-col>

                <v-col
                  v-for="(item, index) in stepList"
                  :key="'step-row-' + index"
                  cols="12"
                  class="py-1 my-1"
                >
                  <v-row>
                    <v-col cols="12" md="6" class="py-0 my-0">
                      <span>{{ item.label }}</span>
                      <span class="text--secondary text-caption">(พ.ศ.)</span>
                      <span class="red--text">*</span>
                      <validation-provider
                        v-slot="{ errors }"
                        :name="item.value"
                        rules="required|digits:4"
                      >
                        <v-autocomplete
                          v-model="localForm.qualification_declarations.thai_applied[item.value]"
                          :items="yearList"
                          placeholder="ระบุปี พ.ศ. (ปปปป)"
                          outlined
                          dense
                          :error-messages="errors"
                        />
                      </validation-provider>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>

        <span v-if="showQualDeclError" class="red--text" style="font-size: 22px;">
          กรุณาเพิ่มข้อมูลอย่างน้อย 1 อย่าง
        </span>

        <v-divider class="my-6" />

        <v-row>
          <v-col cols="12">
            <span style="font-size: 24px; font-weight: bold;">
              ข้าพเจ้ามีความประสงค์ขอขึ้นทะเบียนและรับใบอนุญาต
            </span>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-card outlined class="pa-4">
              <v-row
                v-for="(item, index) in availableProfessionList"
                :key="'profession-' + index"
              >
                <v-col cols="12" class="py-1 mb-1">
                  <v-checkbox
                    v-model="localForm.professions[item.value]"
                    :label="item.label"
                    dense
                    hide-details
                  />
                </v-col>
              </v-row>
            </v-card>

            <span
              v-if="showProfessionError"
              style="font-size: 22px;"
              class="red--text mt-2"
            >
              กรุณาเลือกอย่างน้อย 1 ด้าน
            </span>
          </v-col>
        </v-row>

        <v-divider class="my-6" />

        <v-row>
          <v-col cols="12" md="12">
            <span style="font-size: 24px; font-weight: bold;">
              ข้าพเจ้าได้แนบหลักฐานประกอบการพิจารณาดังต่อไปนี้
              <span class="red--text">*</span>
            </span>
          </v-col>
        </v-row>

        <v-row>
          <v-col
            cols="12"
            class="py-1"
          >
            <v-card outlined class="pa-4 mb-3">
              <v-row
                v-for="(item, index) in attachmentList"
                :key="'attach-' + index"
                class="py-0"
              >
                <v-col cols="12" class="py-3">
                  <validation-provider
                    v-slot="{ errors }"
                    :name="'checkbox'+item.value"
                    :rules="item.required ? 'mustBeTrue' : ''"
                  >
                    <v-checkbox
                      v-model="localForm.attachments[item.value].status"
                      dense
                      hide-details
                      :error-messages="errors"
                      class="py-0"
                      @change="onAttachmentStatusChange(item.value, $event)"
                    >
                      <template #label>
                        <span>
                          {{ item.label }}
                          <span v-if="item.required" class="red--text">*</span>
                        </span>
                      </template>
                    </v-checkbox>
                  </validation-provider>

                  <v-row v-if="localForm.attachments[item.value].status" class="pl-8 pr-2 pt-2">
                    <v-col cols="12">
                      <validation-provider
                        v-slot="{ errors }"
                        :name="item.value"
                        :rules="item.required ? 'required' : ''"
                      >
                        <v-file-input
                          v-model="localForm.attachments[item.value].file"
                          placeholder="แนบไฟล์เอกสาร"
                          :accept="acceptAttr(item.accept)"
                          prepend-icon=""
                          prepend-inner-icon="mdi-paperclip"
                          outlined
                          dense
                          show-size
                          :error-messages="errors"
                          :hint="'รองรับไฟล์ ' + item.accept"
                          persistent-hint
                          @change="onFileChange(item.value, $event, item.accept)"
                        />
                      </validation-provider>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>

        <v-divider class="my-6" />

        <v-row>
          <v-col cols="12">
            <v-card outlined class="pa-4 physical-docs-note">
              <div class="physical-docs-note__title">
                <v-icon color="#327531" class="mr-2">
                  mdi-information-outline
                </v-icon>
                เอกสารที่ต้องจัดส่งตัวจริงมายังสภาการแพทย์แผนไทย
              </div>
              <ul class="physical-docs-note__list">
                <li>ชุดใบคำร้อง พร้อมติดรูปถ่าย 1 นิ้ว 1 รูป</li>
                <li>สำเนาบัตรประชาชน 1 ฉบับ พร้อมรับรองสำเนา</li>
                <li>รูปถ่าย ขนาด 1 นิ้ว ด้านละ 2 รูป</li>
                <li>หลักฐานอื่นๆถ้ามี</li>
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
            <div class="font-weight-bold mb-2">
              วิธีการรับหนังสือสำคัญการเป็นสมาชิกสภาการแพทย์แผนไทยและใบอนุญาต
              <span class="red--text">*</span>
            </div>

            <validation-provider
              v-slot="{ errors }"
              name="วิธีการรับหนังสือสำคัญ"
              rules="required"
            >
              <v-radio-group
                v-model="localForm.documentDeliveryMethod"
                :error-messages="errors"
              >
                <v-radio
                  label="จัดส่งทางไปรษณีย์ (ค่าธรรมเนียม 100 บาท)"
                  value="postal"
                />
                <v-radio
                  label="รับด้วยตนเองที่สภาการแพทย์แผนไทย (รอทางสภาฯประกาศแจ้ง)"
                  value="self_pickup"
                />
              </v-radio-group>
            </validation-provider>
          </v-col>
        </v-row>

        <v-divider class="my-6" />

        <div
          class="d-flex flex-wrap"
          :class="$vuetify.breakpoint.smAndDown ? 'flex-column-reverse' : 'justify-end'"
          style="gap: 12px;"
        >
          <v-btn
            color="#4fb24d"
            style="font-size: 16px; font-weight: bold;"
            large
            outlined
            :block="$vuetify.breakpoint.smAndDown"
            @click="backStep"
          >
            <v-icon left>
              mdi-chevron-left
            </v-icon>
            ย้อนกลับ
          </v-btn>

          <v-btn
            style="color: #e6f4e6; font-size: 16px; font-weight: bold; background-color: #4fb24d;"
            large
            :block="$vuetify.breakpoint.smAndDown"
            @click="nextStep"
          >
            ถัดไป
            <v-icon right>
              mdi-chevron-right
            </v-icon>
          </v-btn>
        </div>
      </v-form>
    </validation-observer>
  </v-card>
</template>

<script>
export default {
  name: 'Step2Member',
  props: {
    value: {
      type: Object,
      required: true
    }
  },

  data () {
    return {
      qualificationList: [
        { value: 'age', label: 'มีอายุไม่ต่ำกว่าสิบปีบริบูรณ์' },
        { value: 'no_conduct_issue', label: 'ไม่เป็นผู้มีความประพฤติเสียหายที่จะนำซึ่งความเสื่อมเสียเกียรติศักดิ์แห่งวิชาชีพ' },
        { value: 'no_jail', label: 'ไม่เคยต้องโทษจำคุกโดยคำพิพากษาถึงที่สุดที่จะนำมาซึ่งความเสื่อมเสียเกียรติศักดิ์แห่งวิชาชีพ' },
        { value: 'no_mental_illness', label: 'ไม่เป็นผู้วิกลจริต จิตฟั่นเฟือนไม่สมประกอบ หรือไม่เป็นโรคที่กำหนดไว้ในข้อบังคับสภาการแพทย์แผนไทย' },
        { value: 'has_knowledge', label: 'มีความรู้ในวิชาชีพการแพทย์แผนไทย ตามพระราชบัญญัติวิชาชีพการแพทย์แผนไทย พ.ศ.2556' }
      ],

      trainedList: [
        {
          value: 'trained_institution',
          label: 'ได้รับการฝึกอบรมจากสถาบันหรือสถานพยาบาลที่สภาการแพทย์แผนไทยรับรอง โดยมีผู้ประกอบวิชาชีพการแพทย์แผนไทยซึ่งได้รับอนุญาตให้ถ่ายทอดความรู้เป็นผู้ให้การอบรม'
        },
        {
          value: 'degree_thai_medicine',
          label: 'ได้รับปริญญาหรือประกาศนียบัตรเทียบเท่าปริญญาสาขาการแพทย์แผนไทยจากสถาบันการศึกษาที่สภาการแพทย์แผนไทยรับรอง'
        },
        {
          value: 'degree_applied_thai_medicine',
          label: 'ได้รับปริญญาหรือประกาศนียบัตรเทียบเท่าปริญญาสาขาการแพทย์แผนไทยประยุกต์จากสถาบันการศึกษาที่สภาการแพทย์แผนไทยรับรอง'
        },
        {
          value: 'folk_medicine_certified',
          label: 'เป็นผู้ที่ส่วนราชการรับรองความรู้การแพทย์พื้นบ้านไทย'
        }
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
      birthMenu: false,

      prefixList: [
        'นาย',
        'นาง',
        'นางสาว'
      ],

      placeList: [
        'สถานที่ ตัวอย่าง',
        'สถานที่ ตัวอย่าง 2',
        'สถานที่ ตัวอย่าง 3'
      ],

      qualDeclMedTouched: false,
      qualDeclTouched: false,
      professionTouched: false,
      professionList: [
        { value: 'thai_medicine', label: 'วิชาชีพการแพทย์แผนไทย ด้านเวชกรรมไทย' },
        { value: 'thai_pharmacy', label: 'วิชาชีพการแพทย์แผนไทย ด้านเภสัชกรรมไทย' },
        { value: 'thai_midwifery', label: 'วิชาชีพการแพทย์แผนไทย ด้านผดุงครรภ์ไทย' },
        { value: 'thai_massage', label: 'วิชาชีพการแพทย์แผนไทย ด้านนวดไทย' },
        { value: 'folk_medicine', label: 'วิชาชีพการแพทย์แผนไทย ด้านแพทย์พื้นบ้าน' },
        { value: 'thai_applied', label: 'วิชาชีพการแพทย์แผนไทยประยุกต์' }
      ],
      maxFileSizeMB: 2,
      attachmentList: [
        {
          value: 'id_card',
          label: 'สำเนาบัตรประจำตัวประชาชน หรือสำเนาบัตรประจำตัวเจ้าหน้าที่ของรัฐหรือสำเนาบัตรพนักงานของรัฐ หรือหนังสือเดินทาง หรือเอกสารคนต่างด้าว (พร้อมรับรองสำเนาถูกต้อง)',
          required: true,
          accept: 'pdf.'
        },
        {
          value: 'transcript',
          label: 'สำเนาใบรายงานผลการศึกษาหรือสำเนาใบปริญญาบัตรหรือประกาศนียบัตรเทียบเท่าปริญญา (พร้อมรับรองสำเนาถูกต้อง)',
          required: true,
          accept: 'pdf.'
        },
        {
          value: 'exam_result_letter',
          label: 'หนังสือแสดงผลการสอบผ่านความรู้จากสภาการแพทย์แผนไทย (ถ้ามี)',
          required: false,
          accept: 'pdf.'
        },
        {
          value: 'health_certificate',
          label: 'หนังสือรับรองการตรวจสุขภาพหรือใบรับรองแพทย์เพื่อขอขึ้นทะเบียนและรับใบอนุญาตเป็นผู้ประกอบวิชาชีพ',
          required: true,
          accept: 'pdf.'
        },
        {
          value: 'photo',
          label: 'ภาพถ่ายขนาด 1 นิ้วแต่งกายสุภาพหน้าตรง ครึ่งตัวท่าปกติ ไม่สวมหมวก ไม่ใส่แว่นตา ซึ่งถ่ายไว้ไม่เกิน 6 เดือน จำนวน 2 ภาพ (ต้องไม่เป็นภาพถ่ายโพลาลอยด์)',
          required: true,
          accept: 'jpg., jpeg.'
        },
        {
          value: 'other_evidence',
          label: 'หลักฐานอื่นๆ (ถ้ามี)',
          required: false,
          accept: 'pdf.'
        }
      ],
      localForm: {
        ...this.value,
        qualifications: {
          age: false,
          no_conduct_issue: false,
          no_jail: false,
          no_mental_illness: false,
          has_knowledge: false,
          ...(this.value.qualifications || {}) // ถ้า parent ส่งค่ามา ใช้ค่านั้นทับ default
        },
        traineds: {
          trained_institution: {
            status: false,
            location: '',
            date: '',
            ...(this.value.traineds?.trained_institution || {})
          },
          degree_thai_medicine: {
            status: false,
            location: '',
            date: '',
            ...(this.value.traineds?.degree_thai_medicine || {})
          },
          degree_applied_thai_medicine: {
            status: false,
            location: '',
            date: '',
            ...(this.value.traineds?.degree_applied_thai_medicine || {})
          },
          folk_medicine_certified: {
            status: false,
            location: '',
            date: '',
            ...(this.value.traineds?.folk_medicine_certified || {})
          }
        },
        qualification_declarations: {
          thai_medicine: {
            status: this.value.qualification_declarations?.thai_medicine?.status || false,
            data: {
              thai_medicine: {
                status: false,
                theoryExamDate: '',
                practicalExamDate: '',
                ...(this.value.qualification_declarations?.thai_medicine?.data?.thai_medicine || {})
              },
              thai_pharmacy: {
                status: false,
                theoryExamDate: '',
                practicalExamDate: '',
                ...(this.value.qualification_declarations?.thai_medicine?.data?.thai_pharmacy || {})
              },
              thai_midwifery: {
                status: false,
                theoryExamDate: '',
                practicalExamDate: '',
                ...(this.value.qualification_declarations?.thai_medicine?.data?.thai_midwifery || {})
              },
              thai_massage: {
                status: false,
                theoryExamDate: '',
                practicalExamDate: '',
                ...(this.value.qualification_declarations?.thai_medicine?.data?.thai_massage || {})
              },
              folk_medicine: {
                status: false,
                theoryExamDate: '',
                practicalExamDate: '',
                ...(this.value.qualification_declarations?.thai_medicine?.data?.folk_medicine || {})
              }
            }
          },
          thai_applied: {
            status: false,
            step1Date: '',
            step2Date: '',
            step3Date: '',
            ...(this.value.qualification_declarations?.thai_applied || {})
          }
        },
        attachments: {
          id_card: {
            status: false,
            file: null,
            ...(this.value.attachments?.id_card || {})
          },
          transcript: {
            status: false,
            file: null,
            ...(this.value.attachments?.transcript || {})
          },
          exam_result_letter: {
            status: false,
            file: null,
            ...(this.value.attachments?.exam_result_letter || {})
          },
          health_certificate: {
            status: false,
            file: null,
            ...(this.value.attachments?.health_certificate || {})
          },
          photo: {
            status: false,
            file: null,
            ...(this.value.attachments?.photo || {})
          },
          other_evidence: {
            status: false,
            file: null,
            ...(this.value.attachments?.other_evidence || {})
          }
        },
        professions: {
          thai_medicine: false,
          thai_pharmacy: false,
          thai_midwifery: false,
          thai_massage: false,
          folk_medicine: false,
          thai_applied: false,
          ...(this.value.professions || {})
        },
        documentDeliveryMethod: this.value.documentDeliveryMethod || 'postal'
      }

    }
  },

  computed: {
    yearList () {
      const currentYearBE = new Date().getFullYear() + 543
      const years = []
      for (let y = currentYearBE; y >= currentYearBE - 120; y--) {
        years.push(String(y))
      }
      return years
    },
    isQualDeclValid () {
      return (
        this.localForm.qualification_declarations.thai_medicine.status ||
        this.localForm.qualification_declarations.thai_applied.status
      )
    },
    isQualDeclMedValid () {
      if (!this.localForm.qualification_declarations.thai_medicine.status) {
        return true
      }

      const data = this.localForm.qualification_declarations.thai_medicine.data
      return Object.values(data).some(item => item && item.status === true)
    },

    showQualDeclError () {
      return this.qualDeclTouched && !this.isQualDeclValid
    },

    showQualDeclMedError () {
      return this.qualDeclMedTouched && !this.isQualDeclMedValid
    },

    availableProfessionList () {
      const declarations = this.localForm.qualification_declarations || {}
      const thaiMedicine = declarations.thai_medicine || {}
      const thaiMedicineData = thaiMedicine.data || {}
      const thaiApplied = declarations.thai_applied || {}

      return this.professionList.filter((profession) => {
        if (profession.value === 'thai_applied') {
          return thaiApplied.status === true
        }

        return thaiMedicine.status === true &&
          thaiMedicineData[profession.value]?.status === true
      })
    },

    availableProfessionValues () {
      return this.availableProfessionList.map(profession => profession.value)
    },

    isProfessionValid () {
      return this.availableProfessionValues.some((profession) => {
        return this.localForm.professions[profession] === true
      })
    },

    showProfessionError () {
      return this.professionTouched && !this.isProfessionValid
    }
  },

  watch: {
    availableProfessionValues: {
      handler (availableValues) {
        Object.keys(this.localForm.professions).forEach((profession) => {
          if (!availableValues.includes(profession)) {
            this.localForm.professions[profession] = false
          }
        })
      },
      immediate: true
    },

    localForm: {
      handler (val) {
        this.$emit('input', val)
      },
      deep: true,
      immediate: true
    }
  },

  methods: {

    // nextStep () {
    //   console.log('🚀 ~ val:', this.localForm)
    //   this.$emit('next')
    // },
    async nextStep () {
      this.qualDeclMedTouched = true
      this.qualDeclTouched = true
      this.professionTouched = true
      const formValid = await this.$refs.step2.validate()
      if (
        !formValid ||
        !this.isQualDeclMedValid ||
        !this.isQualDeclValid ||
        !this.isProfessionValid
      ) {
        return
      }
      this.$emit('next')
    },
    backStep () {
      this.$emit('back')
    },
    onTrainedStatusChange (key, isChecked) {
      if (!isChecked) {
        this.localForm.traineds[key].loacation = ''
        this.localForm.traineds[key].date = ''
      }
    },
    onQualDeclMedParentChange (isChecked) {
      if (!isChecked) {
        const data = this.localForm.qualification_declarations.thai_medicine.data
        Object.keys(data).forEach((key) => {
          data[key].status = false
          data[key].theoryExamDate = ''
          data[key].practicalExamDate = ''
        })
      }
    },
    onQualDeclAappliedParentChange (isChecked) {
      if (!isChecked) {
        const data = this.localForm.qualification_declarations.thai_applied
        data.step1Date = ''
        data.step2Date = ''
        data.step3Date = ''
      }
    },
    onQualDeclMedStatusChange (key, isChecked) {
      this.qualDeclMedTouched = true
      if (!isChecked) {
        this.localForm.qualification_declarations.thai_medicine.data[key].theoryExamDate = ''
        this.localForm.qualification_declarations.thai_medicine.data[key].practicalExamDate = ''
      }
    },
    acceptAttr (acceptStr) {
      return acceptStr
        .split(',')
        .map(ext => '.' + ext.trim().replace(/\.$/, ''))
        .join(',')
    },

    onAttachmentStatusChange (key, isChecked) {
      if (!isChecked) {
        this.localForm.attachments[key].file = null
      }
    },

    onFileChange (key, file, acceptStr) {
      if (!file) { return }

      const fileSizeMB = file.size / (1024 * 1024)
      if (fileSizeMB > this.maxFileSizeMB) {
        this.localForm.attachments[key].file = null
        return
      }

      const allowedExts = acceptStr
        .split(',')
        .map(ext => ext.trim().replace(/\.$/, '').toLowerCase())
      const fileExt = file.name.split('.').pop().toLowerCase()

      if (!allowedExts.includes(fileExt)) {
        this.localForm.attachments[key].file = null
        return
      }

      this.localForm.attachments[key].file = file
    }
  }
}
</script>

<style scoped>
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
