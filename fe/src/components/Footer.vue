<template>
  <footer class="site-footer">
    <div class="footer-cols">
      <div class="container footer-cols-inner">
        <!-- Column 1: Brand intro + socials -->
        <div class="footer-col footer-brand">
          <div class="footer-logo-row">
            <img
              :src="SITE.brand.logoMarkSrc"
              :alt="SITE.brand.name"
              class="footer-mark"
              width="28"
              height="28"
              loading="lazy"
            />
            <span class="footer-logo-text">{{ SITE.brand.footerTitle }}</span>
          </div>
          <p class="footer-desc">
            {{ SITE.brand.tagline }}
          </p>
          <div class="footer-socials">
            <a
              v-if="facebookUrl"
              :href="facebookUrl"
              class="social-link"
              aria-label="Facebook"
              target="_blank"
              rel="noopener noreferrer"
              ><i class="fa-brands fa-facebook"
            /></a>
            <a
              v-if="tiktokUrl"
              :href="tiktokUrl"
              class="social-link"
              aria-label="TikTok"
              target="_blank"
              rel="noopener noreferrer"
              ><i class="fa-brands fa-tiktok"
            /></a>
            <a
              v-if="youtubeUrl"
              :href="youtubeUrl"
              class="social-link"
              aria-label="YouTube"
              target="_blank"
              rel="noopener noreferrer"
              ><i class="fa-brands fa-youtube"
            /></a>
          </div>
        </div>

        <div class="footer-col">
          <h4>Danh mục</h4>
          <ul>
            <li v-for="item in MAIN_NAV_ITEMS" :key="item.to">
              <RouterLink :to="item.to">{{ item.label }}</RouterLink>
            </li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>Hỗ trợ</h4>
          <ul>
            <li>
              <RouterLink to="/chinh-sach-bao-hanh"
                >Chính sách bảo hành</RouterLink
              >
            </li>
            <li>
              <RouterLink to="/chinh-sach-doi-tra"
                >Chính sách đổi trả</RouterLink
              >
            </li>
            <li>
              <RouterLink to="/huong-dan-mua-hang"
                >Hướng dẫn mua hàng</RouterLink
              >
            </li>
            <!-- <li><a href="/cau-hoi-thuong-gap">Câu hỏi thường gặp</a></li> -->
          </ul>
        </div>

        <!-- Column 4: Address + contact -->
        <div class="footer-col footer-contact-col">
          <h4>Thông tin liên hệ</h4>
          <ul class="footer-contact-list">
            <li>
              <i class="fa-solid fa-phone contact-icon" aria-hidden="true" />
              <a class="footer-phone" :href="phoneTel">{{ phoneDisplay }}</a>
            </li>
            <li>
              <i class="fa-solid fa-envelope contact-icon" aria-hidden="true" />
              <a class="footer-email" :href="'mailto:' + email">
                {{ email }}
              </a>
            </li>
            <li>
              <i
                class="fa-solid fa-location-dot contact-icon"
                aria-hidden="true"
              />
              <a
                v-if="mapUrl"
                class="footer-address"
                :href="mapUrl"
                target="_blank"
                rel="noopener noreferrer"
              >
                {{ addressFull }}
              </a>
              <span v-else class="footer-address">{{ addressFull }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <div class="container footer-bottom-inner">
        <p>© {{ currentYear }} {{ BRAND_NAME }}. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
import { BRAND_NAME, SITE } from "@/constants/brand";
import { MAIN_NAV_ITEMS } from "@/constants/main-nav";
import { useContactInfo } from "@/composables/common/useContactInfo";

const currentYear = new Date().getFullYear();
const {
  phoneDisplay,
  phoneTel,
  email,
  addressFull,
  mapUrl,
  facebookUrl,
  tiktokUrl,
  youtubeUrl,
} = useContactInfo();
</script>

<style scoped>
/* Footer */
.site-footer {
  background: var(--color-footer-bg);
  color: #a8a29e;
  margin-top: auto;
  font-size: var(--fs-body-sm);
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

.footer-logo-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  color: #fff;
}

.footer-mark {
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.footer-logo-text {
  font-weight: 700;
  font-size: var(--fs-body-sm);
  letter-spacing: 0.05em;
}

.footer-desc {
  font-size: var(--fs-body-sm);
  color: #78716c;
  margin: 0 0 1rem;
  line-height: 1.7;
}

.footer-col h4 {
  font-size: var(--fs-body);
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
  font-size: var(--fs-body);
  text-decoration: none;
  transition: all var(--transition-fast);
  display: inline-block;
  position: relative;
}

.footer-col a::before {
  content: "";
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
  font-size: var(--fs-body);
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
  font-weight: 600;
  color: #d6d3d1;
  text-decoration: none;
}

.footer-phone:hover {
  color: #fff;
}

.footer-contact-list {
  list-style: none;
  padding: 0;
  margin: 0 0 1rem;
}

.footer-contact-list li {
  font-size: var(--fs-body);
  margin-bottom: 0.875rem;
  display: flex;
  align-items: flex-start;
  gap: 0.625rem;
  line-height: 1.6;
}

.footer-email {
  font-size: var(--fs-body);
  color: #9ca3af;
  text-decoration: none;
  transition: color var(--transition-fast);
}

.footer-email:hover {
  color: #fff;
}

.footer-socials {
  display: flex;
  gap: 0.75rem;
}

.social-link {
  color: #a8a29e;
  font-size: var(--icon-size-md);
  transition: color 0.2s;
  line-height: 1;
  width: 1.3rem;
  height: 2.25rem;
  font-size: var(--fs-subtitle);
}

.social-link:hover {
  color: #fff;
}

.contact-icon {
  color: #a8a29e;
  flex-shrink: 0;
  margin-top: 0.125rem;
  font-size: var(--icon-size-sm);
  line-height: 1;
  width: 1.125rem;
  text-align: center;
}

.footer-bottom {
  border-top: 1px solid #292524;
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
  font-size: var(--fs-body-sm);
  color: #57534e;
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
    font-size: var(--fs-card-title);
  }

  .footer-desc {
    font-size: var(--fs-body-sm);
  }

  .footer-col h4 {
    font-size: var(--fs-body);
    margin-bottom: 1rem;
  }

  .footer-col a,
  .footer-contact-list li {
    font-size: var(--fs-body-sm);
  }

  .social-icon {
    width: 36px;
    height: 36px;
    font-size: var(--fs-body);
  }

  .footer-bottom {
    padding: 1.25rem 0;
  }

  .footer-bottom-inner p {
    font-size: var(--fs-body-sm);
  }
}
</style>
