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
          <h4>Thông tin liên hệ</h4>
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
                xuongdogohungcuong@gmail.com
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
  background: linear-gradient(135deg, #1a1a1a 0%, #2c2c2c 100%);
  color: #d1d5db;
  margin-top: auto;
}

.footer-cols {
  padding: 4rem 0 2.5rem;
}

.footer-cols-inner {
  display: grid;
  grid-template-columns: 2fr repeat(3, minmax(0, 1fr));
  gap: 3rem;
  align-items: flex-start;
}

.footer-brand {
  max-width: 420px;
}

.footer-logo {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #fff;
  letter-spacing: -0.02em;
}

.footer-desc {
  font-size: 0.9375rem;
  color: #9ca3af;
  margin: 0 0 1.5rem;
  line-height: 1.7;
}

.footer-col h4 {
  font-size: 1rem;
  margin-bottom: 1.25rem;
  font-weight: 600;
  color: #fff;
  letter-spacing: 0.02em;
}

.footer-col h4 a {
  color: #fff;
  text-decoration: none;
  transition: color var(--transition-fast);
}

.footer-col h4 a:hover {
  color: var(--color-primary-light);
}

.footer-col ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-col li {
  margin-bottom: 0.75rem;
}

.footer-col a {
  color: #9ca3af;
  font-size: 0.9375rem;
  text-decoration: none;
  transition: all var(--transition-fast);
  display: inline-block;
  position: relative;
}

.footer-col a::before {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 1px;
  background: var(--color-primary-light);
  transition: width var(--transition-base);
}

.footer-col a:hover {
  color: #fff;
  transform: translateX(4px);
}

.footer-col a:hover::before {
  width: 100%;
}

.footer-address {
  font-size: 0.9375rem;
  color: #9ca3af;
  text-decoration: none;
  transition: color var(--transition-fast);
}

.footer-address:hover {
  color: #fff;
}

.footer-contact-col {
  text-align: left;
}

.footer-phone {
  font-weight: 700;
  color: var(--color-primary-light);
  text-decoration: none;
  transition: all var(--transition-fast);
}

.footer-phone:hover {
  color: var(--color-accent);
  transform: translateX(4px);
}

.footer-contact-list {
  list-style: none;
  padding: 0;
  margin: 0 0 1rem;
}

.footer-contact-list li {
  font-size: 0.9375rem;
  margin-bottom: 0.875rem;
  display: flex;
  align-items: flex-start;
  gap: 0.625rem;
  line-height: 1.6;
}

.footer-email {
  font-size: 0.9375rem;
  color: #9ca3af;
  text-decoration: none;
  transition: color var(--transition-fast);
}

.footer-email:hover {
  color: #fff;
}

.footer-socials {
  display: flex;
  justify-content: flex-start;
  gap: 0.75rem;
}

.social-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 700;
  color: #fff;
  text-decoration: none;
  transition: all var(--transition-base);
  position: relative;
  overflow: hidden;
}

.social-icon::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.1);
  transform: scale(0);
  transition: transform var(--transition-base);
  border-radius: 12px;
}

.social-icon:hover::before {
  transform: scale(1);
}

.social-icon:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.social-icon.fb {
  background: linear-gradient(135deg, #1877f2 0%, #0c63d4 100%);
}

.social-icon.ig {
  background: linear-gradient(135deg, #f58529 0%, #dd2a7b 50%, #8134af 100%);
}

.social-icon.tw {
  background: linear-gradient(135deg, #1da1f2 0%, #0d8bd9 100%);
}

.social-icon.yt {
  background: linear-gradient(135deg, #ff0000 0%, #cc0000 100%);
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1.5rem 0;
}

.footer-bottom-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.footer-bottom-inner p {
  margin: 0;
  font-size: 0.875rem;
  color: #6b7280;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .footer-cols-inner {
    grid-template-columns: 1fr 1fr;
    gap: 2.5rem;
  }
  
  .footer-brand {
    max-width: 100%;
  }
}

@media (max-width: 768px) {
  .footer-cols {
    padding: 3rem 0 2rem;
  }
  
  .footer-cols-inner {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .footer-brand {
    text-align: center;
  }
  
  .footer-socials {
    justify-content: center;
  }
  
  .footer-contact-col {
    text-align: center;
  }
  
  .footer-contact-list li {
    justify-content: center;
  }
  
  .footer-col {
    text-align: center;
  }
  
  .footer-col a:hover {
    transform: translateX(0);
  }
}

@media (max-width: 480px) {
  .footer-cols {
    padding: 2.5rem 0 1.5rem;
  }
  
  .footer-logo {
    font-size: 1.25rem;
  }
  
  .footer-desc {
    font-size: 0.875rem;
  }
  
  .footer-col h4 {
    font-size: 0.9375rem;
    margin-bottom: 1rem;
  }
  
  .footer-col a,
  .footer-contact-list li {
    font-size: 0.875rem;
  }
  
  .social-icon {
    width: 36px;
    height: 36px;
    font-size: 0.9375rem;
  }
  
  .footer-bottom {
    padding: 1.25rem 0;
  }
  
  .footer-bottom-inner p {
    font-size: 0.8125rem;
  }
}
</style>
