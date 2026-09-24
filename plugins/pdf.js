/* eslint-disable no-unused-vars */
import * as PDFDocument from 'pdfkit/js/pdfkit.standalone.js'
import blobStream from 'blob-stream'
import { saveAs } from 'file-saver'

/* eslint-disable import/no-webpack-loader-syntax */
// ฟอนต์
import thN from '!!arraybuffer-loader!~/assets/font/THSarabunNew.ttf'
import thB from '!!arraybuffer-loader!~/assets/font/THSarabunNewBold.ttf'

import checkmark from '!!arraybuffer-loader!~/assets/images/checkmark.png'
import BgLogo from '!!arraybuffer-loader!~/assets/images/kps.png'
import Logo from '!!arraybuffer-loader!~/assets/images/Logo_ksp.png'
import User from '!!arraybuffer-loader!~/assets/images/user.jpg'

const date = new Date().toISOString().slice(0, 10)
const [yyyy, mm, dd] = date.split('-')
const formattedDate = `${dd}/${mm}/${yyyy}`

// *******************บัตรประจำตัวผู้มีสิทธิเข้ารับการทดสอบและประเมิณสมรรถนะทางวิชาชีพครู*******************************
const PDF = {

  // ใบตรวจสอบข้อมูล
  print (data) {
    const myDoc = new PDFDocument({ size: 'A4' })
    const stream = myDoc.pipe(blobStream())

    // set font
    myDoc.registerFont('sarabun Bold', thB)
    myDoc.registerFont('sarabun', thN)

    let x = 0
    let y = 0

    // หัวข้อบรรทัดที่ 1
    x = 120
    y = 35
    // myDoc.font(thB, 16).text('ใบตรวจสอบข้อมูลการทดสอบและประเมินสมรรถนะทางวิชาชีพครู ด้านความรู้และประสบการณ์วิชาชีพ', x, y)
    myDoc.font(thB, 16).text('ใบตรวจสอบข้อมูลการสมัครเข้ารับการทดสอบและประเมินสมรรถนะทางวิชาชีพครู', x, y)

    // หัวข้อบรรทัดที่ 2
    x = 160
    y += 20
    myDoc.font(thB, 16).text('ด้านความรู้และประสบการณ์วิชาชีพ ตามมาตรฐานวิชาชีพครู', x, y)

    // // หัวข้อบรรทัดที่ 3
    x = 86
    y += 20
    myDoc.font(thB, 16).text('รายวิชาครู ด้วยระบบอิเล็กทรอนิกส์ ครั้งที่ 1 ประจำปี พ.ศ. 2569 ของสำนักงานเลขาธิการคุรุสภา', x, y)

    if (data.typeRegis) {
      const typeRegis = data.typeRegis === '1' ? 'ระบบอิเล็กทรอนิกส์' : 'ระบบกระดาษ'
      x = 255
      y += 20
      myDoc.font(thB, 16).text(typeRegis, {
        width: 420,
        align: 'center'
      })
    }
    // หัวข้อสีแดงบรรทัดที่ 1
    x = 160
    y += 20
    myDoc.font(thN, 16).fillColor('red')
    myDoc.font(thN, 16).text('" ใบตรวจสอบข้อมูลนี้ไม่สามารถใช้เป็นหลักฐานในการเข้าสอบได้ "', x, y)

    // หัวข้อที่ 1
    x = 70
    y += 30
    myDoc.font(thN, 16).fillColor('black')
    myDoc.font(thB, 16).text('1. ข้อมูลส่วนตัว', x, y)

    // หัวข้อที่ 1 บรรทัดที่ 1
    x = 85
    y += 20
    myDoc.font(thN, 16).fillColor('black')
    myDoc.font(thN).text('ชื่อภาษาไทย', x, y)
    x += myDoc.font(thN).widthOfString('ชื่อภาษาไทย')
    myDoc.text('....................................................................................................................................................', x, y + 2)
    myDoc.font(thN).fillColor('blue')
    myDoc.text(`${data.name1 ? data.name1 : ' '} ${data.name2 ? data.name2 : ' '} ${data.name3 ? data.name3 : ' '}`, x, y, {
      width: myDoc.font(thN).widthOfString('....................................................................................................................................................'),
      align: 'center'
    })

    // หัวข้อที่ 1 บรรทัดที่ 2

    x = 85
    y += 20
    myDoc.font(thN, 16).fillColor('black')
    myDoc.font(thN).text('ชื่อภาษาอังกฤษ', x, y)
    x += myDoc.font(thN).widthOfString('ชื่อภาษาอังกฤษ')
    myDoc.text('...............................................................................................................................................', x, y + 2)
    myDoc.font(thN).fillColor('blue')
    myDoc.text(`${data.name1EN ? data.name1EN : ' '} ${data.name2EN ? data.name2EN : ' '} ${data.nameMidEN ? data.nameMidEN : ''} ${data.name3EN ? data.name3EN : ' '}`, x, y, {
      width: myDoc.font(thN).widthOfString('...............................................................................................................................................'),
      align: 'center'
    })

    // หัวข้อที่ 1 บรรทัดที่ 3
    x = 85
    y += 20
    myDoc.font(thN, 16).fillColor('black')
    myDoc.font(thN).text('เพศ', x, y)
    x += myDoc.font(thN).widthOfString('เพศ')
    myDoc.text('.....................', x, y + 2)
    myDoc.font(thN).fillColor('blue')
    myDoc.text(data.gender ? data.gender : '-', x, y, {
      width: myDoc.font(thN).widthOfString('.....................'),
      align: 'center'
    })

    x += myDoc.font(thN).widthOfString('.....................')
    myDoc.font(thN).fillColor('black').text('วันเกิด', x, y)
    x += myDoc.font(thN).widthOfString('วันเกิด')
    myDoc.text('...........................................', x, y + 2)
    myDoc.font(thN).fillColor('blue')
    myDoc.text(data.birthDMY ? data.birthDMY : '-', x, y, {
      width: myDoc.font(thN).widthOfString('...........................................'),
      align: 'center'
    })

    x += myDoc.font(thN).widthOfString('...........................................')
    myDoc.font(thN).fillColor('black').text('สัญชาติ', x, y)
    x += myDoc.font(thN).widthOfString('สัญชาติ')
    myDoc.text('...........................................................................', x, y + 2)
    myDoc.font(thN).fillColor('blue')
    myDoc.text(data.nationality ? data.nationality : '-', x, y, {
      width: myDoc.font(thN).widthOfString('...........................................................................'),
      align: 'center'
    })

    // หัวข้อที่ 1 บรรทัดที่ 5
    x = 85
    y += 20
    myDoc.font(thN).fillColor('black').text('เลขประจำตัวประชาชน', x, y)
    x += myDoc.font(thN).widthOfString('เลขประจำตัวประชาชน')
    myDoc.text('............................................', x, y + 2)
    myDoc.font(thN).fillColor('blue')
    myDoc.text(data.customerId ? data.customerId : '-', x, y, {
      width: myDoc.font(thN).widthOfString('............................................'),
      align: 'center'
    })

    x += myDoc.font(thN).widthOfString('............................................')
    myDoc.font(thN, 16).fillColor('black')
    myDoc.font(thN).text('โทรศัพท์มือถือ', x, y)
    x += myDoc.font(thN).widthOfString('โทรศัพท์มือถือ')
    myDoc.text('...............................................................', x, y + 2)
    myDoc.font(thN).fillColor('blue')
    myDoc.text(data.telMobile ? data.telMobile : '-', x, y, {
      width: myDoc.font(thN).widthOfString('...............................................................'),
      align: 'center'
    })

    x = 85
    y += 20
    myDoc.font(thN).fillColor('black').text('อีเมล', x, y)
    x += myDoc.font(thN).widthOfString('อีเมล')
    myDoc.text('.........................................................................', x, y + 2)
    myDoc.font(thN).fillColor('blue')
    myDoc.text(data.email ? data.email : '-', x, y, {
      width: myDoc.font(thN).widthOfString('.........................................................................'),
      align: 'center'
    })

    // หัวข้อที่ 2
    x = 70
    y += 25
    myDoc.font(thB, 16).fillColor('black')
    myDoc.font(thB, 16).text('2. วุฒิการศึกษา', x, y)

    // หัวข้อที่ 2 บรรทัดที่ 1
    x = 85
    y += 20
    myDoc.font(thN, 16).fillColor('black')
    myDoc.font(thN).text('วุฒิการศึกษา', x, y)
    x += myDoc.font(thN).widthOfString('วุฒิการศึกษา')
    myDoc.text('..................................................................................................................................................', x, y + 2)
    myDoc.font(thN).fillColor('blue')
    myDoc.text(data.degree ? data.degree : '-', x, y, {
      width: myDoc.font(thN).widthOfString('..................................................................................................................................................'),
      align: 'center'
    })

    x = 85
    y += 20
    myDoc.font(thN).fillColor('black').text('สถานะการศึกษา', x, y)
    x += myDoc.font(thN).widthOfString('สถานะการศึกษา')
    myDoc.text('............................................................................................................................................', x, y + 2)
    myDoc.font(thN).fillColor('blue')
    myDoc.text(`${data.statusStudy ? data.statusStudy : '-'} ${data.grade ? data.grade : ' '}`, x, y, {
      width: myDoc.font(thN).widthOfString('............................................................................................................................................'),
      align: 'center'
    })

    // หัวข้อที่ 2 บรรทัดที่ 2
    x = 85
    y += 20
    myDoc.font(thN, 16).fillColor('black')
    myDoc.font(thN).text('สาขาวิชาเอก', x, y)
    x += myDoc.font(thN).widthOfString('สาขาวิชาเอก')
    myDoc.text('...................................................................................................................................................', x, y + 2)
    myDoc.font(thN).fillColor('blue')
    myDoc.text(data.major ? data.major : '-', x, y, {
      width: myDoc.font(thN).widthOfString('...................................................................................................................................................'),
      align: 'center'
    })

    x = 85
    y += 20
    myDoc.font(thN, 16).fillColor('black')
    myDoc.font(thN).text('สถาบันการศึกษา', x, y)
    x += myDoc.font(thN).widthOfString('สถาบันการศึกษา')
    myDoc.text('.............................................................................................................................................', x, y + 2)
    myDoc.font(thN).fillColor('blue')
    myDoc.text(data.university ? data.university : '-', x, y, {
      width: myDoc.font(thN).widthOfString('.............................................................................................................................................'),
      align: 'center'
    })
    // หัวข้อที่ 3
    x = 70
    y += 25
    myDoc.font(thB, 16).fillColor('black')
    myDoc.font(thB, 16).text('3. ที่อยู่ตามทะเบียนบ้านหรือที่พำนักประจำของนักศึกษาต่างชาติ', x, y)

    // หัวข้อที่ 3 บรรทัดที่ 1
    x = 85
    y += 20
    myDoc.font(thN, 16).fillColor('black')
    myDoc.font(thN).text('เลขที่', x, y)
    x += myDoc.font(thN).widthOfString('เลขที่')
    myDoc.text('...................................................................', x, y + 2)
    myDoc.font(thN).fillColor('blue')
    myDoc.text(data.address ? data.address : '-', x, y, {
      width: myDoc.font(thN).widthOfString('...................................................................'),
      align: 'center'
    })

    x += myDoc.font(thN).widthOfString('...................................................................')
    myDoc.font(thN).fillColor('black').text('ตรอก/ซอย', x, y)
    x += myDoc.font(thN).widthOfString('ตรอก/ซอย')
    myDoc.text('...........................................................................', x, y + 2)
    myDoc.font(thN).fillColor('blue')
    myDoc.text(data.soi ? data.soi : '-', x, y, {
      width: myDoc.font(thN).widthOfString('...........................................................................'),
      align: 'center'
    })

    x = 85
    y += 20
    myDoc.font(thN).fillColor('black').text('ถนน', x, y)
    x += myDoc.font(thN).widthOfString('ถนน')
    myDoc.text('....................................................................', x, y + 2)
    myDoc.font(thN).fillColor('blue')
    myDoc.text(data.road ? data.road : '-', x, y, {
      width: myDoc.font(thN).widthOfString('....................................................................'),
      align: 'center'
    })

    // หัวข้อที่ 3 บรรทัดที่ 2
    x += myDoc.font(thN).widthOfString('....................................................................')
    myDoc.font(thN, 16).fillColor('black')
    myDoc.font(thN).text('ตำบล/แขวง', x, y)
    x += myDoc.font(thN).widthOfString('ตำบล/แขวง')
    myDoc.text('.........................................................................', x, y + 2)
    myDoc.font(thN).fillColor('blue')
    myDoc.text(data.district ? data.district : '-', x, y, {
      width: myDoc.font(thN).widthOfString('.........................................................................'),
      align: 'center'
    })

    x = 85
    y += 20
    myDoc.font(thN).fillColor('black').text('อำเภอ/เขต', x, y)
    x += myDoc.font(thN).widthOfString('อำเภอ/เขต')
    myDoc.text('.........................................................', x, y + 2)
    myDoc.font(thN).fillColor('blue')
    myDoc.text(data.amphur ? data.amphur : '-', x, y, {
      width: myDoc.font(thN).widthOfString('.........................................................'),
      align: 'center'
    })

    // หัวข้อที่ 3 บรรทัดที่ 3
    x += myDoc.font(thN).widthOfString('.........................................................')
    myDoc.font(thN, 16).fillColor('black')
    myDoc.font(thN).text('จังหวัด', x, y)
    x += myDoc.font(thN).widthOfString('จังหวัด')
    myDoc.text('..................................................................................', x, y + 2)
    myDoc.font(thN).fillColor('blue')
    myDoc.text(data.province ? data.province : '-', x, y, {
      width: myDoc.font(thN).widthOfString('..................................................................................'),
      align: 'center'
    })

    x = 85
    y += 20
    myDoc.font(thN).fillColor('black').text('รหัสไปรษณีย์', x, y)
    x += myDoc.font(thN).widthOfString('รหัสไปรษณีย์')
    myDoc.text('......................................................', x, y + 2)
    myDoc.font(thN).fillColor('blue')
    myDoc.text(data.zipcode ? data.zipcode : '-', x, y, {
      width: myDoc.font(thN).widthOfString('......................................................'),
      align: 'center'
    })

    // หัวข้อที่ 4
    x = 70
    y += 25
    myDoc.font(thB, 16).fillColor('black')
    myDoc.font(thB, 16).text('4. ความต้องการพิเศษ', x, y)

    // หัวข้อที่ 4 บรรทัดที่ 1
    x = 85
    y += 20
    myDoc.font(thN, 16).fillColor('black')
    myDoc.font(thN).text('ประเภทความต้องการพิเศษ', x, y)
    x += myDoc.font(thN).widthOfString('ประเภทความต้องการพิเศษ')
    myDoc.text('............................................................................................................................', x, y + 2)
    myDoc.font(thN).fillColor('blue')
    myDoc.text(data.specialNeeds ? data.specialNeeds : '-', x, y, {
      width: myDoc.font(thN).widthOfString('...........................................................................................................................'),
      align: 'center'
    })

    // สี่เหลี่ยมครอบติ๊กถูก
    x = 35
    y += 30
    myDoc.rect(x, y, 525, 250).stroke()

    // ติ๊กถูกกล่องสี่เหลี่ยมที่ 1
    x = 45
    y += 4
    myDoc.rect(x, y + 2, 10, 10).stroke()
    myDoc.fontSize(14).fillColor('red').font(thB)
    myDoc.image(checkmark, x, y, { width: 12, height: 12 })
    // myDoc.text('/', x + 3, y - 2)
    x += 20
    myDoc.fontSize(12).fillColor('black').font(thN)
    myDoc.text('ข้าพเจ้าได้ตรวจสอบข้อมูลครบถ้วนแล้ว ขอยืนยันว่าข้อมุลที่ระบุมีความถูกต้องตรงกับความเป็นจริงทุกประการ หากมีการตรวจสอบและพบว่า ข้อมูลไม่ตรง', x, y, { width: 1000 })
    x = 65
    y += 16
    myDoc.text('กับความเป็นจริงและขัดกับคุณสมบัติของผู้มีสิทธิ์สอบ ข้าพเจ้ายินยอมที่จะถูกตัดสิทธิ์ในการเข้าสอบครั้งนี้และไม่ประสงค์ขอรับเงินคืนไม่ว่ากรณีใดๆ ทั้งสิ้น', x, y, { width: 1000 })

    // ติ๊กถูกกล่องสี่เหลี่ยมที่ 2
    x = 45
    y += 20
    myDoc.rect(x, y + 2, 10, 10).stroke()
    myDoc.fontSize(14).fillColor('red').font(thN)
    myDoc.image(checkmark, x, y, { width: 12, height: 12 })
    // myDoc.text('/', x + 3, y - 2)
    x += 20
    myDoc.fontSize(12).fillColor('black').font(thN)
    myDoc.text('ข้าพเจ้าได้ตรวจสอบข้อมูลครบถ้วนแล้ว ข้าพเจ้ายินยอมให้ใช้ข้อมูลที่ระบุในการสมัครเข้ารับการทดสอบเพื่อขอรับใบอนุญาตประกอบวิชาชีพครู', x, y, { width: 1000 })

    // ติ๊กถูกกล่องสี่เหลี่ยมที่ 3
    x = 45
    y += 20
    myDoc.rect(x, y + 2, 10, 10).stroke()
    myDoc.fontSize(14).fillColor('red').font(thB)
    myDoc.image(checkmark, x, y, { width: 12, height: 12 })
    // myDoc.text('✓๋', x + 3, y - 2)
    x += 20
    myDoc.fontSize(12).fillColor('black').font(thN)
    myDoc.text('ข้าพเจ้ายินยอมให้สำนักเลขาธิการคุรุสภา เก็บรวบรวม ใช้หรือเปิดเผยข้อมูลส่วนบุคคล ซึ่งรวมไปถึงข้อมูลประวัติอาชญากรรม หรือข้อมูลที่จำเป็นอื่นใด', x, y, { width: 1000 })
    x = 65
    y += 16
    myDoc.text('ซึ่งอาจกระทบ ต่อเจ้าของข้อมูลส่วนบุคคลในทำนองเดียวกัน หรือทำสำเนาใบสมัคร เอกสารประกอบการสมัคร ตลอดจน เอกสารใดๆ ที่ข้าพเจ้าได้ให้ไว้', x, y, { width: 1000 })
    x = 65
    y += 16
    myDoc.text('ต่อสำนักงานเลขาธิการคุรุสภา เพื่อประโยชน์ในการทดสอบและประเมินสมรรถนะทางวิชาชีพครู และการออกใบอนุญาตประกอบวิชาชีพทางการศึกษา', x, y, { width: 1000 })
    x = 65
    y += 16
    myDoc.text('นอกจากนี้ ข้าพเจ้ายินยอมให้หน่วยงานของรัฐ เจ้าหน้าที่ของรัฐ หน่วยงานเอกชน ตลอดจนหน่วยงานและบุคคลอื่นใด ที่มีข้อมูลส่วนบุคคลของข้าพเจ้า', x, y, { width: 1000 })
    x = 65
    y += 16
    myDoc.text('หรือที่เกี่ยวข้องกับข้าพเจ้าอยู่ในความครอบครอง หรือควบคุมดูแล ซึ่งรวมไปถึงข้อมูลประวัติอาขญากรรม หรือข้อมูลที่จำเป็นอื่นใดซึ่งอาจกระทบต่อเจ้าของ', x, y, { width: 1000 })
    x = 65
    y += 16
    myDoc.text('ข้อมูลส่วนบุคคลในทำนองเดียวกัน อยู่ในความครอบครองหรือควบคุมดูแล สามารถเปิดเผยข้อมูลส่วนบุคคลหรือข้อมูลอื่นใดให้แก่สำนักงานเลขาธิการคุรุสภา', x, y, { width: 1000 })
    x = 65
    y += 16
    myDoc.text('เพื่อประโยชน์ในการทดสอบและประเมินสมรรถนะทางวิชาชีพครู และการออกใบอนุญาตประกอบวิชาชีพทางการศึกษา ก่อนยื่นแบบ ใบสมัครฉบับนี้', x, y, { width: 1000 })
    x = 65
    y += 16
    myDoc.text('ข้าพเจ้าได้ศึกษาและทำความเข้าใจพระราชบัญญัติคุ้มครอง ข้อมุลส่วนบุคคล พ.ศ. 2562 ตลอดจนประกาศระเบียบที่เกี่ยวข้อง รวมทั้งใบสมัครและเอกสาร', x, y, { width: 1000 })
    x = 65
    y += 16
    myDoc.text('หลักฐาน แนบท้ายต่างๆ ทั้งหมด โดยตลอดเป้นอย่างดีและครบถ้วนสมบูรณ์แล้ว และข้าพเจ้าขอแสดงเจตนายอมรับ และสมัครใจที่จะปฏิบัติตามหลักเกณฑ์', x, y, { width: 1000 })
    x = 65
    y += 16
    myDoc.text('วิธีการ และขั้นตอน ตามที่ได้กำหนดไว้ในกฎหมาย ประกาศ และระเบียบต่างๆ ที่เกี่ยวข้องทุกประการ รวทั้งใบสมัครและเอกสารหลักฐานต่างๆ ที่ได้ยื่น', x, y, { width: 1000 })
    x = 65
    y += 16
    myDoc.text('กัพร้อมใบสมัคร หรือเป็นส่วนหนึ่งของการสมัครนั้น เป็นเอกสารราชการของสำนักงานเลขาธิการคุรุสภา', x, y, { width: 1000 })

    myDoc.end()

    stream.on('finish', function () {
      const blob = stream.toBlob('exam/pdf')
      saveAs(blob, 'ใบตรวจสอบข้อมูลการทดสอบ.pdf')
    })
  },

  // รายงานสนามสอบ
  printB (data) {
    const myDoc = new PDFDocument({ size: 'A4' })
    const stream = myDoc.pipe(blobStream())

    // set font
    myDoc.registerFont('sarabun Bold', thB)
    myDoc.registerFont('sarabun', thN)

    let x = 0
    let y = 0

    // หัวข้อสีแดงบรรทัดที่ 1
    x = 200
    y += 40
    myDoc.font(thB, 16).fillColor('black')
    myDoc.font(thB, 16).text('รายงานสนามสอบจำนวนผู้เข้าสอบวิชาครู', x, y)

    // บรรทัดที่ 1
    // x = 85
    // y += 50
    // myDoc.font(thN, 16).fillColor('black')
    // myDoc.font(thN).text('สนามสอบ', x, y)
    // x += myDoc.font(thN).widthOfString('สนามสอบ ')
    // myDoc.text('', x, y + 2)
    // myDoc.font(thN).fillColor('blue')
    // myDoc.text(data.Location ? data.Location : ' ', x, y, {
    //   width: myDoc.font(thN).widthOfString('............................................................................'),
    //   align: 'center'
    // })

    // x += myDoc.font(thN).widthOfString('...................')
    // myDoc.font(thN, 16).fillColor('black')
    // myDoc.font(thN).text('รอบที่', x, y)
    // x += myDoc.font(thN).widthOfString('รอบที่')
    // myDoc.text('................', x, y + 2)
    // myDoc.font(thN).fillColor('blue')
    // myDoc.text(data.eduuniversity ? data.eduuniversity : '-', x, y, {
    //   width: myDoc.font(thN).widthOfString('...............'),
    //   align: 'center'
    // })

    // บรรทัดที่ 2
    x = 85
    y += 50
    myDoc.font(thN, 16).fillColor('black')
    myDoc.font(thN).text('จำนวนผู้เข้าสอบทั้งหมด', x, y)
    x += myDoc.font(thN).widthOfString('จำนวนผู้เข้าสอบทั้งหมด')
    myDoc.text('...................', x, y + 2)
    myDoc.font(thN).fillColor('blue')
    myDoc.text(data.total ? data.total : '0', x, y, {
      width: myDoc.font(thN).widthOfString('...................'),
      align: 'center'
    })

    x += myDoc.font(thN).widthOfString('...................')
    myDoc.font(thN, 16).fillColor('black')
    myDoc.font(thN).text('คน', x, y)

    // บรรทัดที่ 3
    x = 85
    y += 20
    myDoc.font(thN, 16).fillColor('black')
    myDoc.font(thN).text('คนไทย จำนวน', x, y)
    x += myDoc.font(thN).widthOfString('คนไทย จำนวน')
    myDoc.text('..............', x, y + 2)
    myDoc.font(thN).fillColor('blue')
    myDoc.text(data.thai ? data.thai : '0', x, y, {
      width: myDoc.font(thN).widthOfString('..............'),
      align: 'center'
    })

    x += myDoc.font(thN).widthOfString('..............')
    myDoc.font(thN, 16).fillColor('black')
    myDoc.font(thN).text('คน', x, y)

    // บรรทัดที่ 4
    x = 85
    y += 20
    myDoc.font(thN, 16).fillColor('black')
    myDoc.font(thN).text('คนต่างชาติ จำนวน', x, y)
    x += myDoc.font(thN).widthOfString('คนต่างชาติ จำนวน')
    myDoc.text('..............', x, y + 2)
    myDoc.font(thN).fillColor('blue')
    myDoc.text(data.notThai ? data.notThai : '0', x, y, {
      width: myDoc.font(thN).widthOfString('..............'),
      align: 'center'
    })

    x += myDoc.font(thN).widthOfString('..............')
    myDoc.font(thN, 16).fillColor('black')
    myDoc.font(thN).text('คน', x, y)

    x = 85
    y += 50
    myDoc.font(thN, 16).fillColor('black')
    myDoc.font(thN).text('ข้อมูล ณ วันที่', x, y)
    x += myDoc.font(thN).widthOfString('ข้อมูล ณ วันที่')
    myDoc.text('', x, y + 2)
    myDoc.font(thN).fillColor('black')
    myDoc.text(formattedDate, x, y, {
      width: myDoc.font(thN).widthOfString('............................'),
      align: 'center'
    })

    myDoc.end()

    stream.on('finish', function () {
      const blob = stream.toBlob('exam/pdf')
      saveAs(blob, 'รายงานสนามสอบ.pdf')
    })
  },

  // ยื่นคำร้องขอมีสิทธิ์สอบ
  printRequest (data) {
    const myDoc = new PDFDocument({ size: 'A4' })
    const stream = myDoc.pipe(blobStream())

    // set font
    myDoc.registerFont('sarabun Bold', thB)
    myDoc.registerFont('sarabun', thN)

    let x = 0
    let y = 0

    // หัวข้อบรรทัดที่ 1
    x = 216
    y = 45
    myDoc.font(thB, 16).text('ข้อมูลผู้ขอยื่นคำร้องขอมีสิทธิสมัครสอบ', x, y)

    // หัวข้อบรรทัดที่ 2
    x = 120
    y += 28
    myDoc.font(thB, 14).text('สมัครเข้ารับการทดสอบและประเมินสมรรถนะทางวิชาชีพครู ด้านความรู้และประสบการณ์วิชาชีพ', x, y)
    x += 58
    y += 18
    myDoc.text('ตามมาตรฐานวิชาชีพครู รายวิชาครู ครั้งที่ 1 ประจำปี พ.ศ. 2569', x, y)
    x += 54
    y += 18
    myDoc.text('ของสำนักงานเลขาธิการคุรุสภา', x, y)

    // หัวข้อที่ 1
    x = 70
    y += 30
    myDoc.font(thN, 16).fillColor('black')
    myDoc.font(thB, 16).text('1. ข้อมูลส่วนตัว', x, y)

    // หัวข้อที่ 1 บรรทัดที่ 1
    x = 85
    y += 20
    myDoc.font(thN, 16).fillColor('black')
    myDoc.font(thN).text('ชื่อภาษาไทย', x, y)
    x += myDoc.font(thN).widthOfString('ชื่อภาษาไทย')
    myDoc.text('....................................................................................................................................................', x, y + 2)
    myDoc.font(thN).fillColor('blue')
    myDoc.text(`${data.name1 ? data.name1 : ' '} ${data.name2 ? data.name2 : ' '} ${data.name3 ? data.name3 : ' '}`, x, y, {
      width: myDoc.font(thN).widthOfString('....................................................................................................................................................'),
      align: 'center'
    })

    // หัวข้อที่ 1 บรรทัดที่ 2
    x = 85
    y += 20
    myDoc.font(thN, 16).fillColor('black')
    myDoc.font(thN).text('ชื่อภาษาอังกฤษ', x, y)
    x += myDoc.font(thN).widthOfString('ชื่อภาษาอังกฤษ')
    myDoc.text('...............................................................................................................................................', x, y + 2)
    myDoc.font(thN).fillColor('blue')
    myDoc.text(`${data.name1EN ? data.name1EN : ' '} ${data.name2EN ? data.name2EN : ' '} ${data.nameMidEN ? data.nameMidEN : ''} ${data.name3EN ? data.name3EN : ' '}`, x, y, {
      width: myDoc.font(thN).widthOfString('...............................................................................................................................................'),
      align: 'center'
    })

    // หัวข้อที่ 1 บรรทัดที่ 5
    x = 85
    y += 20
    myDoc.font(thN).fillColor('black').text('เลขประจำตัวประชาชน', x, y)
    x += myDoc.font(thN).widthOfString('เลขประจำตัวประชาชน')
    myDoc.text('............................................', x, y + 2)
    myDoc.font(thN).fillColor('blue')
    myDoc.text(data.customerId ? data.customerId : '-', x, y, {
      width: myDoc.font(thN).widthOfString('............................................'),
      align: 'center'
    })

    x += myDoc.font(thN).widthOfString('............................................')
    myDoc.font(thN, 16).fillColor('black')
    myDoc.font(thN).text('โทรศัพท์มือถือ', x, y)
    x += myDoc.font(thN).widthOfString('โทรศัพท์มือถือ')
    myDoc.text('...............................................................', x, y + 2)
    myDoc.font(thN).fillColor('blue')
    myDoc.text(data.telMobile ? data.telMobile : '-', x, y, {
      width: myDoc.font(thN).widthOfString('...............................................................'),
      align: 'center'
    })

    x = 85
    y += 20
    myDoc.font(thN).fillColor('black').text('อีเมล', x, y)
    x += myDoc.font(thN).widthOfString('อีเมล')
    myDoc.text('.........................................................................', x, y + 2)
    myDoc.font(thN).fillColor('blue')
    myDoc.text(data.email ? data.email : '-', x, y, {
      width: myDoc.font(thN).widthOfString('.........................................................................'),
      align: 'center'
    })

    // หัวข้อที่ 2
    x = 70
    y += 25
    myDoc.font(thB, 16).fillColor('black')
    myDoc.font(thB, 16).text('2. วุฒิการศึกษา', x, y)

    // หัวข้อที่ 2 บรรทัดที่ 1
    x = 85
    y += 20
    myDoc.font(thN, 16).fillColor('black')
    myDoc.font(thN).text('วุฒิการศึกษา', x, y)
    x += myDoc.font(thN).widthOfString('วุฒิการศึกษา')
    myDoc.text('..................................................................................................................................................', x, y + 2)
    myDoc.font(thN).fillColor('blue')
    myDoc.text(data.degree ? data.degree : '-', x, y, {
      width: myDoc.font(thN).widthOfString('..................................................................................................................................................'),
      align: 'center'
    })

    x = 85
    y += 20
    myDoc.font(thN).fillColor('black').text('สถานะการศึกษา', x, y)
    x += myDoc.font(thN).widthOfString('สถานะการศึกษา')
    myDoc.text('............................................................................................................................................', x, y + 2)
    myDoc.font(thN).fillColor('blue')
    myDoc.text(`${data.statusStudy ? data.statusStudy : '-'} ${data.grade ? data.grade : ' '}`, x, y, {
      width: myDoc.font(thN).widthOfString('............................................................................................................................................'),
      align: 'center'
    })

    // หัวข้อที่ 2 บรรทัดที่ 2
    x = 85
    y += 20
    myDoc.font(thN, 16).fillColor('black')
    myDoc.font(thN).text('สาขาวิชาเอก', x, y)
    x += myDoc.font(thN).widthOfString('สาขาวิชาเอก')
    myDoc.text('...................................................................................................................................................', x, y + 2)
    myDoc.font(thN).fillColor('blue')
    myDoc.text(data.major ? data.major : '-', x, y, {
      width: myDoc.font(thN).widthOfString('...................................................................................................................................................'),
      align: 'center'
    })

    x = 85
    y += 20
    myDoc.font(thN, 16).fillColor('black')
    myDoc.font(thN).text('สถาบันการศึกษา', x, y)
    x += myDoc.font(thN).widthOfString('สถาบันการศึกษา')
    myDoc.text('.............................................................................................................................................', x, y + 2)
    myDoc.font(thN).fillColor('blue')
    myDoc.text(data.university ? data.university : '-', x, y, {
      width: myDoc.font(thN).widthOfString('.............................................................................................................................................'),
      align: 'center'
    })

    x = 85
    y += 20
    myDoc.font(thN, 16).fillColor('black')
    myDoc.font(thN).text('รหัสนักศึกษา', x, y)
    x += myDoc.font(thN).widthOfString('รหัสนักศึกษา')
    myDoc.text('...........................................................................................................................................................', x, y + 2)
    myDoc.font(thN).fillColor('blue')
    myDoc.text(data.studentId ? data.studentId : '-', x, y, {
      width: myDoc.font(thN).widthOfString('...........................................................................................................................................................'),
      align: 'center'
    })
    // หัวข้อที่ 3
    x = 70
    y += 25
    myDoc.font(thB, 16).fillColor('black')
    myDoc.font(thB, 16).text('3. ที่อยู่ตามทะเบียนบ้านหรือที่พำนักประจำของนักศึกษาต่างชาติ', x, y)

    // หัวข้อที่ 3 บรรทัดที่ 1
    x = 85
    y += 20
    myDoc.font(thN, 16).fillColor('black')
    myDoc.font(thN).text('เลขที่', x, y)
    x += myDoc.font(thN).widthOfString('เลขที่')
    myDoc.text('...................................................................', x, y + 2)
    myDoc.font(thN).fillColor('blue')
    myDoc.text(data.address ? data.address : '-', x, y, {
      width: myDoc.font(thN).widthOfString('...................................................................'),
      align: 'center'
    })

    x += myDoc.font(thN).widthOfString('...................................................................')
    myDoc.font(thN).fillColor('black').text('ตรอก/ซอย', x, y)
    x += myDoc.font(thN).widthOfString('ตรอก/ซอย')
    myDoc.text('...........................................................................', x, y + 2)
    myDoc.font(thN).fillColor('blue')
    myDoc.text(data.soi ? data.soi : '-', x, y, {
      width: myDoc.font(thN).widthOfString('...........................................................................'),
      align: 'center'
    })

    x = 85
    y += 20
    myDoc.font(thN).fillColor('black').text('ถนน', x, y)
    x += myDoc.font(thN).widthOfString('ถนน')
    myDoc.text('....................................................................', x, y + 2)
    myDoc.font(thN).fillColor('blue')
    myDoc.text(data.road ? data.road : '-', x, y, {
      width: myDoc.font(thN).widthOfString('....................................................................'),
      align: 'center'
    })

    // หัวข้อที่ 3 บรรทัดที่ 2
    x += myDoc.font(thN).widthOfString('....................................................................')
    myDoc.font(thN, 16).fillColor('black')
    myDoc.font(thN).text('ตำบล/แขวง', x, y)
    x += myDoc.font(thN).widthOfString('ตำบล/แขวง')
    myDoc.text('.........................................................................', x, y + 2)
    myDoc.font(thN).fillColor('blue')
    myDoc.text(data.district ? data.district : '-', x, y, {
      width: myDoc.font(thN).widthOfString('.........................................................................'),
      align: 'center'
    })

    x = 85
    y += 20
    myDoc.font(thN).fillColor('black').text('อำเภอ/เขต', x, y)
    x += myDoc.font(thN).widthOfString('อำเภอ/เขต')
    myDoc.text('.........................................................', x, y + 2)
    myDoc.font(thN).fillColor('blue')
    myDoc.text(data.amphur ? data.amphur : '-', x, y, {
      width: myDoc.font(thN).widthOfString('.........................................................'),
      align: 'center'
    })

    // หัวข้อที่ 3 บรรทัดที่ 3
    x += myDoc.font(thN).widthOfString('.........................................................')
    myDoc.font(thN, 16).fillColor('black')
    myDoc.font(thN).text('จังหวัด', x, y)
    x += myDoc.font(thN).widthOfString('จังหวัด')
    myDoc.text('..................................................................................', x, y + 2)
    myDoc.font(thN).fillColor('blue')
    myDoc.text(data.province ? data.province : '-', x, y, {
      width: myDoc.font(thN).widthOfString('..................................................................................'),
      align: 'center'
    })

    x = 85
    y += 20
    myDoc.font(thN).fillColor('black').text('รหัสไปรษณีย์', x, y)
    x += myDoc.font(thN).widthOfString('รหัสไปรษณีย์')
    myDoc.text('......................................................', x, y + 2)
    myDoc.font(thN).fillColor('blue')
    myDoc.text(data.zipcode ? data.zipcode : '-', x, y, {
      width: myDoc.font(thN).widthOfString('......................................................'),
      align: 'center'
    })
    // สี่เหลี่ยมครอบติ๊กถูก
    x = 35
    y += 50
    myDoc.rect(x, y, 525, 100).stroke()

    // ติ๊กถูกกล่องสี่เหลี่ยมที่ 1
    x = 45
    y += 20
    myDoc.rect(x, y + 2, 10, 10).stroke()
    myDoc.fontSize(14).fillColor('red').font(thB)
    myDoc.image(checkmark, x, y, { width: 12, height: 12 })
    // myDoc.text('✓๋', x + 3, y - 2)
    x += 20
    myDoc.fontSize(12).fillColor('black').font(thN)

    myDoc.text('ข้าพเจ้าได้ศึกษาและทำความเข้าใจพระราชบัญญัติคุ้มครอง ข้อมุลส่วนบุคคล พ.ศ. 2562 ตลอดจนประกาศระเบียบที่เกี่ยวข้อง รวมทั้งใบสมัครและเอกสาร', x, y, { width: 1000 })
    x = 65
    y += 16
    myDoc.text('หลักฐาน แนบท้ายต่างๆ ทั้งหมด โดยตลอดเป้นอย่างดีและครบถ้วนสมบูรณ์แล้ว และข้าพเจ้าขอแสดงเจตนายอมรับ และสมัครใจที่จะปฏิบัติตามหลักเกณฑ์', x, y, { width: 1000 })
    x = 65
    y += 16
    myDoc.text('วิธีการ และขั้นตอน ตามที่ได้กำหนดไว้ในกฎหมาย ประกาศ และระเบียบต่างๆ ที่เกี่ยวข้องทุกประการ รวทั้งใบสมัครและเอกสารหลักฐานต่างๆ ที่ได้ยื่น', x, y, { width: 1000 })
    x = 65
    y += 16
    myDoc.text('พร้อมใบสมัคร หรือเป็นส่วนหนึ่งของการสมัครนั้น เป็นเอกสารราชการของสำนักงานเลขาธิการคุรุสภา', x, y, { width: 1000 })

    myDoc.end()

    stream.on('finish', function () {
      const blob = stream.toBlob('exam/pdf')
      saveAs(blob, 'ข้อมูลผู้ขอยื่นคำร้องขอมีสิทธิสมัครสอบ.pdf')
    })
  },

  // ยื่นคำร้องขอมีสิทธิ์สอบ
  printRequestRegistered (data) {
    const myDoc = new PDFDocument({ size: 'A4' })
    const stream = myDoc.pipe(blobStream())

    // set font
    myDoc.registerFont('sarabun Bold', thB)
    myDoc.registerFont('sarabun', thN)

    let x = 0
    let y = 0

    // หัวข้อบรรทัดที่ 1
    x = 216
    y = 45
    myDoc.font(thB, 16).text('ข้อมูลผู้ขอยื่นคำร้องขอมีสิทธิสมัครสอบ', x, y)

    // หัวข้อบรรทัดที่ 2
    x = 120
    y += 28
    myDoc.font(thB, 14).text('สมัครเข้ารับการทดสอบและประเมินสมรรถนะทางวิชาชีพครู ด้านความรู้และประสบการณ์วิชาชีพ', x, y)
    x += 58
    y += 18
    myDoc.text('ตามมาตรฐานวิชาชีพครู รายวิชาครู ครั้งที่ 1 ประจำปี พ.ศ. 2569', x, y)
    x += 54
    y += 18
    myDoc.text('ของสำนักงานเลขาธิการคุรุสภา', x, y)

    // หัวข้อที่ 1
    x = 70
    y += 30
    myDoc.font(thN, 16).fillColor('black')
    myDoc.font(thB, 16).text('1. ข้อมูลส่วนตัว', x, y)

    // หัวข้อที่ 1 บรรทัดที่ 1
    x = 85
    y += 20
    myDoc.font(thN, 16).fillColor('black')
    myDoc.font(thN).text('ชื่อภาษาไทย', x, y)
    x += myDoc.font(thN).widthOfString('ชื่อภาษาไทย')
    myDoc.text('....................................................................................................................................................', x, y + 2)
    myDoc.font(thN).fillColor('blue')
    myDoc.text(`${data.name1 ? data.name1 : ' '} ${data.name2 ? data.name2 : ' '} ${data.name3 ? data.name3 : ' '}`, x, y, {
      width: myDoc.font(thN).widthOfString('....................................................................................................................................................'),
      align: 'center'
    })

    // หัวข้อที่ 1 บรรทัดที่ 2
    x = 85
    y += 20
    myDoc.font(thN, 16).fillColor('black')
    myDoc.font(thN).text('ชื่อภาษาอังกฤษ', x, y)
    x += myDoc.font(thN).widthOfString('ชื่อภาษาอังกฤษ')
    myDoc.text('...............................................................................................................................................', x, y + 2)
    myDoc.font(thN).fillColor('blue')
    myDoc.text(`${data.name1EN ? data.name1EN : ' '} ${data.name2EN ? data.name2EN : ' '} ${data.nameMidEN ? data.nameMidEN : ''} ${data.name3EN ? data.name3EN : ' '}`, x, y, {
      width: myDoc.font(thN).widthOfString('...............................................................................................................................................'),
      align: 'center'
    })

    // หัวข้อที่ 1 บรรทัดที่ 5
    x = 85
    y += 20
    myDoc.font(thN).fillColor('black').text('เลขประจำตัวประชาชน', x, y)
    x += myDoc.font(thN).widthOfString('เลขประจำตัวประชาชน')
    myDoc.text('............................................', x, y + 2)
    myDoc.font(thN).fillColor('blue')
    myDoc.text(data.customerId ? data.customerId : '-', x, y, {
      width: myDoc.font(thN).widthOfString('............................................'),
      align: 'center'
    })

    x += myDoc.font(thN).widthOfString('............................................')
    myDoc.font(thN, 16).fillColor('black')
    myDoc.font(thN).text('โทรศัพท์มือถือ', x, y)
    x += myDoc.font(thN).widthOfString('โทรศัพท์มือถือ')
    myDoc.text('...............................................................', x, y + 2)
    myDoc.font(thN).fillColor('blue')
    myDoc.text(data.telMobile ? data.telMobile : '-', x, y, {
      width: myDoc.font(thN).widthOfString('...............................................................'),
      align: 'center'
    })

    x = 85
    y += 20
    myDoc.font(thN).fillColor('black').text('อีเมล', x, y)
    x += myDoc.font(thN).widthOfString('อีเมล')
    myDoc.text('.........................................................................', x, y + 2)
    myDoc.font(thN).fillColor('blue')
    myDoc.text(data.email ? data.email : '-', x, y, {
      width: myDoc.font(thN).widthOfString('.........................................................................'),
      align: 'center'
    })

    // หัวข้อที่ 2
    x = 70
    y += 25
    myDoc.font(thB, 16).fillColor('black')
    myDoc.font(thB, 16).text('2. ข้อมูลที่เข้ารับการทดสอบ', x, y)

    // หัวข้อที่ 3 บรรทัดที่ 1
    x = 85
    y += 20
    myDoc.font(thN, 16).fillColor('black')
    myDoc.font(thN).text('เลขประจำตัวผู้เข้ารับการทดสอบ', x, y)
    x += myDoc.font(thN).widthOfString('เลขประจำตัวผู้เข้ารับการทดสอบ')
    myDoc.text('....................................................................................................................', x, y + 2)
    myDoc.font(thN).fillColor('blue')
    myDoc.text(data.appId ? data.appId : '-', x, y, {
      width: myDoc.font(thN).widthOfString('....................................................................................................................'),
      align: 'center'
    })

    x = 85
    y += 20
    myDoc.font(thN).fillColor('black').text('วันที่สอบ', x, y)
    x += myDoc.font(thN).widthOfString('วันที่สอบ')
    myDoc.text('...........................................................................................................................................', x, y + 2)
    myDoc.font(thN).fillColor('blue')
    myDoc.text(`${data.dateExam ? data.dateExam : '-'}`, x, y, {
      width: myDoc.font(thN).widthOfString('...........................................................................................................................................'),
      align: 'center'
    })

    // หัวข้อที่ 3 บรรทัดที่ 2
    x = 85
    y += 20
    myDoc.font(thN, 16).fillColor('black')
    myDoc.font(thN).text('รอบที่สอบ', x, y)
    x += myDoc.font(thN).widthOfString('รอบที่สอบ')
    myDoc.text('...........................................................................................................................................', x, y + 2)
    myDoc.font(thN).fillColor('blue')
    myDoc.text(data.round ? data.round : '-', x, y, {
      width: myDoc.font(thN).widthOfString('...........................................................................................................................................'),
      align: 'center'
    })

    x = 85
    y += 20
    myDoc.font(thN, 16).fillColor('black')
    myDoc.font(thN).text('สนามสอบ', x, y)
    x += myDoc.font(thN).widthOfString('สนามสอบ')
    myDoc.text('.........................................................................................................................................', x, y + 2)
    myDoc.font(thN).fillColor('blue')
    myDoc.text(data.location ? data.location : '-', x, y, {
      width: myDoc.font(thN).widthOfString('.........................................................................................................................................'),
      align: 'center'
    })

    // หัวข้อที่ 3
    x = 70
    y += 25
    myDoc.font(thB, 16).fillColor('black')
    myDoc.font(thB, 16).text('3. วุฒิการศึกษา', x, y)

    // หัวข้อที่ 3 บรรทัดที่ 1
    x = 85
    y += 20
    myDoc.font(thN, 16).fillColor('black')
    myDoc.font(thN).text('วุฒิการศึกษา', x, y)
    x += myDoc.font(thN).widthOfString('วุฒิการศึกษา')
    myDoc.text('..................................................................................................................................................', x, y + 2)
    myDoc.font(thN).fillColor('blue')
    myDoc.text(data.degree ? data.degree : '-', x, y, {
      width: myDoc.font(thN).widthOfString('..................................................................................................................................................'),
      align: 'center'
    })

    x = 85
    y += 20
    myDoc.font(thN).fillColor('black').text('สถานะการศึกษา', x, y)
    x += myDoc.font(thN).widthOfString('สถานะการศึกษา')
    myDoc.text('............................................................................................................................................', x, y + 2)
    myDoc.font(thN).fillColor('blue')
    myDoc.text(`${data.statusStudy ? data.statusStudy : '-'} ${data.grade ? data.grade : ' '}`, x, y, {
      width: myDoc.font(thN).widthOfString('............................................................................................................................................'),
      align: 'center'
    })

    // หัวข้อที่ 3 บรรทัดที่ 2
    x = 85
    y += 20
    myDoc.font(thN, 16).fillColor('black')
    myDoc.font(thN).text('สาขาวิชาเอก', x, y)
    x += myDoc.font(thN).widthOfString('สาขาวิชาเอก')
    myDoc.text('...................................................................................................................................................', x, y + 2)
    myDoc.font(thN).fillColor('blue')
    myDoc.text(data.major ? data.major : '-', x, y, {
      width: myDoc.font(thN).widthOfString('...................................................................................................................................................'),
      align: 'center'
    })

    x = 85
    y += 20
    myDoc.font(thN, 16).fillColor('black')
    myDoc.font(thN).text('สถาบันการศึกษา', x, y)
    x += myDoc.font(thN).widthOfString('สถาบันการศึกษา')
    myDoc.text('.............................................................................................................................................', x, y + 2)
    myDoc.font(thN).fillColor('blue')
    myDoc.text(data.university ? data.university : '-', x, y, {
      width: myDoc.font(thN).widthOfString('.............................................................................................................................................'),
      align: 'center'
    })

    x = 85
    y += 20
    myDoc.font(thN, 16).fillColor('black')
    myDoc.font(thN).text('รหัสนักศึกษา', x, y)
    x += myDoc.font(thN).widthOfString('รหัสนักศึกษา')
    myDoc.text('................................................................................................................................................', x, y + 2)
    myDoc.font(thN).fillColor('blue')
    myDoc.text(data.studentId ? data.studentId : '-', x, y, {
      width: myDoc.font(thN).widthOfString('................................................................................................................................................'),
      align: 'center'
    })

    // สี่เหลี่ยมครอบติ๊กถูก
    x = 30
    y += 72
    myDoc.rect(x, y, 523, 150).stroke()

    // ติ๊กถูกกล่องสี่เหลี่ยมที่ 1
    x = 45
    y += 20
    myDoc.rect(x, y + 2, 10, 10).stroke()
    myDoc.fontSize(14).fillColor('red').font(thB)
    myDoc.image(checkmark, x, y, { width: 12, height: 12 })
    // myDoc.text('✓๋', x + 3, y - 2)
    x += 20
    myDoc.fontSize(12).fillColor('black').font(thN)

    myDoc.text('ข้าพเจ้าได้ศึกษาและทำความเข้าใจพระราชบัญญัติคุ้มครอง ข้อมุลส่วนบุคคล พ.ศ. 2562 ตลอดจนประกาศระเบียบที่เกี่ยวข้อง รวมทั้งใบสมัครและเอกสาร', x, y, { width: 1000 })
    x = 65
    y += 16
    myDoc.text('หลักฐาน แนบท้ายต่างๆ ทั้งหมด โดยตลอดเป้นอย่างดีและครบถ้วนสมบูรณ์แล้ว และข้าพเจ้าขอแสดงเจตนายอมรับ และสมัครใจที่จะปฏิบัติตามหลักเกณฑ์', x, y, { width: 1000 })
    x = 65
    y += 16
    myDoc.text('วิธีการ และขั้นตอน ตามที่ได้กำหนดไว้ในกฎหมาย ประกาศ และระเบียบต่างๆ ที่เกี่ยวข้องทุกประการ รวทั้งใบสมัครและเอกสารหลักฐานต่างๆ ที่ได้ยื่น', x, y, { width: 1000 })
    x = 65
    y += 16
    myDoc.text('พร้อมใบสมัคร หรือเป็นส่วนหนึ่งของการสมัครนั้น เป็นเอกสารราชการของสำนักงานเลขาธิการคุรุสภา', x, y, { width: 1000 })
    x = 65
    y += 16
    myDoc.text('I have completely checked the information. I hereby confirm that the information provided is correct and true in all respects.', x, y, { width: 1000 })
    x = 65
    y += 16
    myDoc.text('If there is an examination and it is found that the information does not correspond to reality and is contrary to the qualifications of', x, y, { width: 1000 })
    x = 65
    y += 16
    myDoc.text('those eligible to take the examination. I agree that my right to take this exam will be forfeited  and I do not wish to request', x, y, { width: 1000 })
    x = 65
    y += 16
    myDoc.text('a refund in any case.', x, y, { width: 1000 })

    myDoc.end()

    stream.on('finish', function () {
      const blob = stream.toBlob('exam/pdf')
      saveAs(blob, 'ข้อมูลผู้ขอยื่นคำร้องขอมีสิทธิสมัครสอบ.pdf')
    })
  }

}

export default ({ app }, inject) => {
  inject('PDF', PDF)
}
