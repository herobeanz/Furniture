<template>
  <footer class="site-footer">
    <div class="footer-cols">
      <div class="container footer-cols-inner">
        <!-- Column 1: Brand intro + socials -->
        <div class="footer-col footer-brand">
          <h3 class="footer-logo">{{ BRAND_NAME }}</h3>
          <p class="footer-desc">
            {{ BRAND_NAME }} là cửa hàng nội thất hỗ trợ bạn chọn lựa, bài trí và chăm sóc không gian sống một cách
            nhanh chóng và chính xác.
          </p>
          <div class="footer-socials">
            <a href="#" class="social-icon fb" aria-label="Facebook">f</a>
            <a href="#" class="social-icon ig" aria-label="Instagram">◎</a>
            <a href="#" class="social-icon tw" aria-label="Twitter">t</a>
            <a href="#" class="social-icon yt" aria-label="YouTube">▶</a>
          </div>
        </div>

        <!-- Column 2: Thông tin (CMS pages tĩnh) -->
        <div class="footer-col">
          <h4>Thông tin</h4>
          <ul>
            <li><a href="/page/gioi-thieu">Giới thiệu</a></li>
            <li><a href="/page/chinh-sach-bao-mat">Chính sách bảo hành</a></li>
            <li><a href="/page/chinh-sach-giao-hang">Chính sách giao hàng</a></li>
            <li><a href="/page/terms">Điều khoản sử dụng</a></li>
            <li><a href="/page/lien-he">Liên hệ</a></li>
          </ul>
        </div>

        <!-- Column 3: Nội thất (các loại phòng) -->
        <div class="footer-col">
          <h4>Nội thất</h4>
          <ul>
            <li><a href="/phong-khach">Phòng khách</a></li>
            <li><a href="/phong-ngu">Phòng ngủ</a></li>
            <li><a href="/phong-bep">Phòng bếp</a></li>
            <li><a href="/phong-tho">Phòng thờ</a></li>
          </ul>
        </div>

        <!-- Column 4: Address + contact -->
        <div class="footer-col footer-contact-col">
          <h4>Contact</h4>
          <ul class="footer-contact-list">
            <li>
              📍
              <a
                class="footer-address"
                href="https://maps.app.goo.gl/FTVZq3HGJzbsoC9V8"
                target="_blank"
                rel="noopener"
              >
                Làng Nghề Châu Phong, Liên Hà, Đông Anh, Hà Nội
              </a>
            </li>
            <li>
              ☎️
              <a class="footer-phone" href="tel:+84357803837">
                (+84) 357803837
              </a>
            </li>
            <li>
              📧
              <a class="footer-email" href="mailto:support@dogohungcuong.vn">
                support@dogohungcuong.vn
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <div class="container footer-bottom-inner">
        <p>Cung cấp bởi © {{ BRAND_NAME }}</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { BRAND_NAME } from '@/constants/brand'
</script>

<style scoped>
/* Footer */
.site-footer {
  background: #1a1a1a;
  color: #ccc;
  margin-top: auto;
}
.footer-cols {
  padding: 2.5rem 0 1.5rem;
}
.footer-cols-inner {
  display: grid;
  grid-template-columns: 2fr repeat(3, minmax(0, 1fr));
  gap: 2rem;
  align-items: flex-start;
}

.footer-brand {
  max-width: 380px;
}

.footer-logo {
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  color: #fff;
}

.footer-desc {
  font-size: 0.85rem;
  color: #aaa;
  margin: 0 0 1rem;
  line-height: 1.6;
}
.footer-col h4 {
  font-size: 0.95rem;
  margin-bottom: 1rem;
  font-weight: 600;
}
.footer-col h4 a {
  color: #fff;
  text-decoration: none;
}
.footer-col h4 a:hover {
  color: var(--color-primary);
}
.footer-col ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.footer-col li {
  margin-bottom: 0.4rem;
}
.footer-col a {
  color: #aaa;
  font-size: 0.85rem;
  text-decoration: none;
}
.footer-col a:hover {
  color: #fff;
}
.footer-address {
  font-size: 0.85rem;
  color: #aaa;
  text-decoration: none;
}
.footer-address:hover {
  color: #fff;
  text-decoration: underline;
}

.footer-contact-col {
  text-align: left;
}

.footer-phone {
  font-weight: 700;
  color: #fff;
  text-decoration: none;
}
.footer-phone:hover {
  color: #fff;
  text-decoration: underline;
}

.footer-hours {
  margin: 0 0 0.75rem;
  font-size: 0.85rem;
  color: #aaa;
}

.footer-socials {
  display: flex;
  justify-content: flex-start;
  gap: 0.5rem;
}

.social-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: 700;
  color: #fff;
  text-decoration: none;
}

.social-icon.fb {
  background: #1877f2;
}

.social-icon.ig {
  background: #e4405f;
}

.social-icon.tw {
  background: #1da1f2;
}

.social-icon.yt {
  background: #ff0000;
}

.footer-contact-list {
  list-style: none;
  padding: 0;
  margin: 0 0 0.75rem;
}
.footer-contact-list li {
  font-size: 0.85rem;
  margin-bottom: 0.35rem;
}

.footer-email {
  font-size: 0.85rem;
  color: #aaa;
  text-decoration: none;
}
.footer-email:hover {
  color: #fff;
  text-decoration: underline;
}

.footer-bottom {
  border-top: 1px solid #333;
  padding: 0.75rem 0;
}
.footer-bottom-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.footer-bottom-inner p {
  margin: 0;
  font-size: 0.8rem;
  color: #888;
}

@media (max-width: 768px) {
  .footer-cols-inner {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 480px) {
  .footer-cols-inner {
    grid-template-columns: 1fr;
  }
}
</style>
