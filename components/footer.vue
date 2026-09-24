<template>
  <footer class="footer">
    <v-container fluid class="footer-content">
      <strong class="footer-title">หากมีปัญหาเกี่ยวกับระบบสมาชิก สามารถติดต่อได้ที่</strong>
      <div class="footer-contact">
        <div class="contact-item contact-item--phone">
          <v-icon small color="white" class="contact-icon">
            mdi-phone
          </v-icon>
          <div class="contact-copy">
            <span>Call Center โทร. 0-2257-7159 กด 5</span>
            <span class="service-hours">จันทร์ - ศุกร์ เวลา 08.30-17.30 น.</span>
          </div>
        </div>
        <div class="contact-item">
          <img id="imageLine" src="~/assets/images/Line_icon_w.png" alt="LINE" class="contact-icon">
          <span>LineID : @Thaijobjob</span>
        </div>
      </div>
    </v-container>
  </footer>
</template>

<script>
export default {
  name: 'FooterPage'
}
</script>

<style scoped>
.footer {
  display: block;
  width: 100%;
  color: #fff;
  background: #327531;
  font-size: 15px;
}
.footer-content { display: flex; min-height: 54px; align-items: center; justify-content: space-between; padding: 10px 32px; }
.footer-contact { display: flex; align-items: center; gap: 18px; }
.contact-item { display: flex; align-items: center; }
.contact-copy { display: flex; align-items: center; }
.service-hours::before { content: '('; margin-left: 4px; }
.service-hours::after { content: ')'; }
.contact-icon { flex: 0 0 auto; margin-right: 5px; }
#imageLine { width: 16px; height: 16px; vertical-align: middle; }
@media screen and (max-width: 960px) {
  .footer-content {
    min-height: 0;
    align-items: stretch;
    flex-direction: column;
    gap: 12px;
    padding: 18px 20px 20px;
  }
  .footer-title {
    display: block;
    padding-bottom: 10px;
    border-bottom: 1px solid rgba(255, 255, 255, .28);
    font-size: 16px;
    line-height: 1.45;
  }
  .footer-contact {
    align-items: stretch;
    flex-direction: column;
    gap: 12px;
  }
  .contact-item { align-items: flex-start; line-height: 1.45; }
  .contact-icon { width: 20px; margin-top: 2px; margin-right: 8px; }
  .contact-copy { min-width: 0; align-items: flex-start; flex-direction: column; }
  .service-hours { color: rgba(255, 255, 255, .85); }
  .service-hours::before,
  .service-hours::after { content: none; }
}
</style>
