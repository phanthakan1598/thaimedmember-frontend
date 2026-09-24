import Vue from 'vue'
import {
  ValidationObserver,
  ValidationProvider,
  extend
} from 'vee-validate'

import { required, numeric, digits, email, min, max, min_value as minValue } from 'vee-validate/dist/rules'

extend('thaiID', {
  validate (value) {
    const id = value.replaceAll('-', '')
    if (id.length > 13) {
      return 'เลขบัตรประชาชนไม่ถูกต้อง'
    }
    let sum = 0
    for (let i = 0; i < 12; i++) {
      sum += parseFloat(id.charAt(i)) * (13 - i)
    }
    if ((11 - (sum % 11)) % 10 !== parseFloat(id.charAt(12))) {
      return 'เลขบัตรประชาชนไม่ถูกต้อง'
    }
    return true
  }
})

extend('mustBeTrue', {
  validate (value) {
    return value === true
  },
  message: 'กรุณายืนยัน'
})

extend('lineID', {
  validate (value) {
    const pattern = /^(?=.*[a-zA-Z])[a-zA-Z0-9._-]{4,20}$/
    if (!pattern.test(value)) {
      return 'LINE ID ต้องเป็นภาษาอังกฤษ ตัวเลข หรือ . _ - เท่านั้น (4-20 ตัวอักษร)'
    }
    return true
  }
})

extend('thaiOnly', {
  validate (value) {
    const pattern = /^[\u0E00-\u0E7F\s]+$/
    if (!pattern.test(value)) {
      return 'กรุณากรอกภาษาไทยเท่านั้น'
    }
    return true
  }
})

extend('engOnly', {
  validate (value) {
    const pattern = /^[A-Za-z\s]+$/
    if (!pattern.test(value)) {
      return 'กรุณากรอกภาษาอังกฤษเท่านั้น'
    }
    return true
  }
})

extend('noEnglish', {
  validate (value) {
    const pattern = /[a-zA-Z]/
    if (pattern.test(value)) {
      return 'ห้ามพิมพ์ตัวอักษรภาษาอังกฤษ'
    }
    return true
  }
})

extend('noSpace', {
  validate (value) {
    const pattern = /^\S+$/
    if (!pattern.test(value)) {
      return 'ห้ามเว้นวรรค'
    }
    return true
  }
})

extend('age18', {
  validate (value) {
    const pattern = /^\d{2}-\d{2}-\d{4}$/
    if (!pattern.test(value)) {
      return 'รูปแบบวันที่ไม่ถูกต้อง (xx-xx-xxxx)'
    }

    const [day, month, year] = value.split('-').map(Number)
    const birthDate = new Date((year - 543), month - 1, day)

    // เช็คว่าเป็นวันที่ที่มีอยู่จริง (เช่นกัน 2024-02-30)
    if (
      birthDate.getFullYear() !== (year - 543) ||
      birthDate.getMonth() !== month - 1 ||
      birthDate.getDate() !== day
    ) {
      return 'วันที่ไม่ถูกต้อง'
    }

    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    const dayDiff = today.getDate() - birthDate.getDate()

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--
    }

    if (age < 18) {
      return 'ต้องมีอายุ 18 ปีขึ้นไป'
    }

    return true
  }
})

extend('required', {
  ...required,
  message: 'กรุณาระบุ'
})

extend('min', {
  ...min,
  message: 'กรุณากรอกอย่างน้อย {length} ตัวอักษร'
})

extend('max', {
  ...max,
  message: 'กรุณากรอกไม่เกิน {length} ตัวอักษร'
})

extend('digits', {
  ...digits,
  message: 'กรุณากรอก {length} หลัก'
})

extend('numeric', {
  ...numeric,
  message: 'ระบุเป็นตัวเลข'
})

extend('min_value', {
  ...minValue,
  message: 'จำนวนฉบับต้องมีค่าตั้งแต่ {min} ฉบับ'
})

extend('email', {
  ...email,
  message: 'รูปแบบอีเมลไม่ถูกต้อง'
})

// validate วันที่ไทย พ.ศ. รูปแบบ DD-MM-YYYY
extend('buddhistDate', {
  message: 'รูปแบบวันที่ไม่ถูกต้อง (รูปแบบ วว-ดด-ปปปป พ.ศ. เช่น 01-01-2565)',
  validate (value) {
    if (!value || value.length !== 10) { return false }
    const parts = value.split('-')
    if (parts.length !== 3) { return false }
    const d = parseInt(parts[0], 10)
    const m = parseInt(parts[1], 10)
    const y = parseInt(parts[2], 10)
    if (isNaN(d) || isNaN(m) || isNaN(y)) { return false }
    // ปี พ.ศ. ต้องไม่น้อยกว่า 2400 (ค.ศ. 1857) และไม่เกิน 2700
    if (y < 2400 || y > 2700) { return false }
    if (m < 1 || m > 12) { return false }
    if (d < 1 || d > 31) { return false }
    // ตรวจวันในเดือนจริง (แปลง พ.ศ. → ค.ศ.)
    const yearCE = y - 543
    const date = new Date(yearCE, m - 1, d)
    return (
      date.getFullYear() === yearCE &&
      date.getMonth() === m - 1 &&
      date.getDate() === d
    )
  }
})

// validate ว่าวันสิ้นสุดต้องไม่ก่อนวันเริ่มต้น
extend('dateAfterStart', {
  params: ['target'],
  message: 'จนถึงวันที่ ต้องไม่ก่อนหรือเท่ากับ ตั้งแต่วันที่',
  validate (value, { target }) {
    if (!value || !target || value.length !== 10 || target.length !== 10) { return true }
    const parseDate = (str) => {
      const parts = str.split('-')
      if (parts.length !== 3) { return null }
      const d = parseInt(parts[0], 10)
      const m = parseInt(parts[1], 10)
      const y = parseInt(parts[2], 10) - 543
      return new Date(y, m - 1, d)
    }
    const start = parseDate(target)
    const end = parseDate(value)
    if (!start || !end) { return true }
    return end > start
  }
})

Vue.component('ValidationObserver', ValidationObserver)
Vue.component('ValidationProvider', ValidationProvider)
