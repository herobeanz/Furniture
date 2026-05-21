<template>
  <div class="contact-page">
    <!-- Hero + info bar -->
    <section class="contact-hero">
      <div class="container contact-hero-inner">
        <div class="contact-hero-copy">
          <span class="eyebrow">Liên hệ với chúng tôi</span>
          <h1 class="contact-hero-title">
            Chúng tôi luôn sẵn sàng<br />hỗ trợ bạn
          </h1>
          <p class="contact-hero-text">
            Bạn có câu hỏi về sản phẩm, cần tư vấn thiết kế nội thất hay muốn
            đặt hàng theo yêu cầu? Đội ngũ {{ BRAND_NAME }} luôn sẵn sàng lắng
            nghe và hỗ trợ bạn nhanh chóng nhất.
          </p>

          <div class="contact-hero-chips">
            <a :href="'tel:' + phoneTel" class="contact-chip">
              <span class="contact-chip-icon" aria-hidden="true">
                <i class="fa-solid fa-phone" />
              </span>
              <span>
                <span class="contact-chip-label">Hotline</span>
                <span class="contact-chip-value">{{ phoneDisplay }}</span>
              </span>
            </a>
            <div class="contact-chip">
              <span class="contact-chip-icon" aria-hidden="true">
                <i class="fa-regular fa-clock" />
              </span>
              <span>
                <span class="contact-chip-label">Thời gian làm việc</span>
                <span class="contact-chip-value">{{
                  CONTACT_HOURS_SHORT
                }}</span>
              </span>
            </div>
          </div>
        </div>
        <div class="contact-hero-visual">
          <img
            :src="CONTACT_IMAGES.hero"
            :alt="'Showroom ' + BRAND_NAME"
            class="contact-hero-image"
            loading="eager"
          />
        </div>
      </div>

      <div class="container contact-info-bar-wrap">
        <div class="contact-info-bar">
          <div class="contact-info-item">
            <i
              class="fa-solid fa-location-dot contact-info-icon"
              aria-hidden="true"
            />
            <div>
              <h4 class="contact-info-title">Địa chỉ</h4>
              <p class="contact-info-text">
                {{ CONTACT_ADDRESS.line1 }}<br />{{ CONTACT_ADDRESS.line2 }}
              </p>
            </div>
          </div>
          <div class="contact-info-item">
            <i class="fa-solid fa-phone contact-info-icon" aria-hidden="true" />
            <div>
              <h4 class="contact-info-title">Hotline</h4>
              <p class="contact-info-text">
                {{ phoneDisplay }}<br />(Tư vấn &amp; hỗ trợ)
              </p>
            </div>
          </div>
          <div class="contact-info-item">
            <i
              class="fa-regular fa-envelope contact-info-icon"
              aria-hidden="true"
            />
            <div>
              <h4 class="contact-info-title">Email</h4>
              <p class="contact-info-text">
                <a :href="'mailto:' + email" class="contact-info-link">{{
                  email
                }}</a
                ><br />(Phản hồi trong 24h)
              </p>
            </div>
          </div>
          <div class="contact-info-item">
            <i
              class="fa-regular fa-clock contact-info-icon"
              aria-hidden="true"
            />
            <div>
              <h4 class="contact-info-title">Thời gian làm việc</h4>
              <p class="contact-info-text">
                {{ CONTACT_HOURS_LINES[0] }}<br />{{ CONTACT_HOURS_LINES[1] }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Form + map -->
    <section class="contact-main section-shell">
      <div class="container contact-main-inner">
        <div class="contact-form-card">
          <span class="contact-form-eyebrow">Gửi liên hệ cho chúng tôi</span>
          <h2 class="contact-form-heading">Nhận tư vấn nhanh chóng</h2>
          <p class="contact-form-desc">
            Hãy để lại thông tin, chúng tôi sẽ liên hệ lại với bạn trong thời
            gian sớm nhất.
          </p>
          <ContactForm
            :form="form"
            :sending="sending"
            :submit-message="submitMessage"
            :submit-error="submitError"
            @submit="handleSubmit"
          />
        </div>

        <div class="contact-side">
          <div class="contact-map">
            <img
              :src="CONTACT_IMAGES.map"
              alt="Bản đồ chỉ đường"
              class="contact-map-image"
              loading="lazy"
            />
            <div class="contact-map-pin">
              <i class="fa-solid fa-location-dot" aria-hidden="true" />
              <span>{{ BRAND_NAME }}</span>
            </div>
          </div>

          <div class="contact-quick">
            <div>
              <h3 class="contact-quick-title">Bạn cần hỗ trợ nhanh?</h3>
              <p class="contact-quick-desc">
                Liên hệ trực tiếp với chúng tôi qua các kênh bên dưới.
              </p>
            </div>

            <a :href="'tel:' + phoneTel" class="contact-quick-link">
              <span class="contact-quick-left">
                <i
                  class="fa-solid fa-phone-volume contact-quick-icon"
                  aria-hidden="true"
                />
                <span>
                  <span class="contact-quick-label"
                    >Gọi ngay cho chúng tôi</span
                  >
                  <span class="contact-quick-value">{{ phoneDisplay }}</span>
                </span>
              </span>
              <i
                class="fa-solid fa-chevron-right contact-quick-arrow"
                aria-hidden="true"
              />
            </a>

            <a
              v-if="facebookUrl"
              :href="facebookUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="contact-quick-link"
            >
              <span class="contact-quick-left">
                <i
                  class="fa-regular fa-comment-dots contact-quick-icon"
                  aria-hidden="true"
                />
                <span>
                  <span class="contact-quick-label">Chat với chúng tôi</span>
                  <span class="contact-quick-value">Messenger</span>
                </span>
              </span>
              <i
                class="fa-solid fa-chevron-right contact-quick-arrow"
                aria-hidden="true"
              />
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Showroom CTA -->
    <section class="contact-showroom">
      <div class="container">
        <div class="showroom-banner">
          <div class="showroom-media">
            <img
              :src="CONTACT_IMAGES.showroom"
              alt="Showroom trải nghiệm"
              class="showroom-image"
              loading="lazy"
            />
          </div>
          <div class="showroom-content">
            <span class="showroom-eyebrow">Ghé thăm Showroom</span>
            <h2 class="showroom-title">Trải nghiệm sản phẩm thực tế</h2>
            <p class="showroom-text">
              Chúng tôi luôn chào đón bạn đến tham quan showroom để trải nghiệm
              chất lượng sản phẩm và nhận tư vấn trực tiếp từ đội ngũ thiết kế.
            </p>
            <a
              :href="mapsUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="showroom-cta"
            >
              Xem đường đi
              <i class="fa-regular fa-compass" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import ContactForm from "@/components/contact/ContactForm.vue";
import { useContactForm } from "@/composables/contact/useContactForm";
import { useContactInfo } from "@/composables/common/useContactInfo";
import { BRAND_NAME } from "@/constants/brand";
import {
  CONTACT_HOURS_LINES,
  CONTACT_IMAGES,
  CONTACT_MAP_QUERY,
} from "@/constants/contact";

const { form, sending, submitMessage, submitError, facebookUrl, submit } =
  useContactForm();

const {
  phoneDisplay,
  phoneTel,
  email,
  address: CONTACT_ADDRESS,
  mapUrl: siteMapUrl,
  hoursShort: CONTACT_HOURS_SHORT,
} = useContactInfo();

const mapsUrl = computed(
  () =>
    siteMapUrl.value ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CONTACT_MAP_QUERY)}`,
);

async function handleSubmit() {
  await submit("contact");
}
</script>

<style scoped>
.contact-page {
  background: #faf9f6;
}

.eyebrow {
  display: block;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 600;
  color: var(--color-primary);
  margin-bottom: 0.75rem;
  font-family: var(--font-sans);
}

/* Hero */
.contact-hero {
  background: #f5f2eb;
  padding: 4rem 0 0;
  overflow: hidden;
  position: relative;
}

.contact-hero-inner {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  align-items: center;
  padding-bottom: 3rem;
}

@media (min-width: 1024px) {
  .contact-hero {
    padding-top: 6rem;
  }

  .contact-hero-inner {
    grid-template-columns: 5fr 7fr;
    padding-bottom: 3rem;
  }
}

.contact-hero-title {
  font-family: var(--font-serif);
  font-size: clamp(1.875rem, 4vw, 2.25rem);
  line-height: 1.15;
  color: var(--color-heading);
  margin-bottom: 1rem;
  font-weight: 600;
}

.contact-hero-text {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  line-height: 1.7;
  max-width: 20rem;
  margin-bottom: 2rem;
}

.contact-hero-chips {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

@media (min-width: 640px) {
  .contact-hero-chips {
    flex-direction: row;
    gap: 1.5rem;
  }
}

.contact-chip {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: inherit;
}

.contact-chip-icon {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  border: 1px solid rgba(146, 64, 14, 0.3);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary);
  font-size: var(--icon-size-sm);
  flex-shrink: 0;
}

.contact-chip-label {
  display: block;
  font-size: 0.625rem;
  text-transform: uppercase;
  font-weight: 500;
  color: var(--color-text-light);
  margin-bottom: 0.125rem;
}

.contact-chip-value {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-heading);
}

.contact-hero-visual {
  display: flex;
  justify-content: flex-end;
}

.contact-hero-image {
  width: 100%;
  height: 350px;
  object-fit: cover;
  border-radius: 0.5rem;
  box-shadow: var(--shadow-md);
}

.contact-info-bar-wrap {
  position: relative;
  z-index: 20;
  margin-top: -1rem;
  padding-bottom: 3rem;
}

.contact-info-bar {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  background: #fff;
  border: 1px solid rgba(229, 231, 235, 0.6);
  border-radius: 0.5rem;
  padding: 1.25rem;
  box-shadow: var(--shadow-sm);
}

@media (min-width: 640px) {
  .contact-info-bar {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .contact-info-bar {
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
  }

  .contact-info-item:not(:last-child) {
    border-right: 1px solid var(--color-border-light);
    padding-right: 0.5rem;
  }
}

.contact-info-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.contact-info-icon {
  color: var(--color-primary);
  font-size: var(--icon-size-md);
  line-height: 1;
  margin-top: 0.125rem;
  flex-shrink: 0;
}

.contact-info-title {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-heading);
  margin: 0 0 0.125rem;
  font-family: var(--font-sans);
}

.contact-info-text {
  font-size: 0.6875rem;
  color: var(--color-text-muted);
  line-height: 1.5;
  margin: 0;
}

.contact-info-link {
  color: inherit;
  text-decoration: none;
}

.contact-info-link:hover {
  color: var(--color-primary);
}

/* Main */
.contact-main-inner {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  align-items: start;
}

@media (min-width: 1024px) {
  .contact-main-inner {
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }
}

.contact-form-card {
  background: #fff;
  padding: 2rem;
  border-radius: 0.5rem;
  border: 1px solid var(--color-border-light);
  box-shadow: var(--shadow-sm);
}

.contact-form-eyebrow {
  display: block;
  font-size: 0.625rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 600;
  color: var(--color-primary);
  margin-bottom: 0.25rem;
}

.contact-form-heading {
  font-family: var(--font-serif);
  font-size: 1.25rem;
  color: var(--color-heading);
  margin: 0 0 0.5rem;
  font-weight: 600;
}

.contact-form-desc {
  font-size: 0.6875rem;
  color: var(--color-text-light);
  margin: 0 0 1.5rem;
  line-height: 1.5;
}

.contact-side {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.contact-map {
  position: relative;
  height: 18rem;
  border-radius: 0.5rem;
  overflow: hidden;
  background: #e5e7eb;
  border: 1px solid var(--color-border-light);
  box-shadow: var(--shadow-sm);
}

.contact-map-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.95) contrast(1.05);
}

.contact-map-pin {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  padding: 0.375rem 0.75rem;
  border-radius: 0.375rem;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--color-border-light);
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.625rem;
  font-weight: 700;
  color: var(--color-heading);
  white-space: nowrap;
}

.contact-map-pin i {
  color: #dc2626;
  font-size: var(--icon-size-sm);
}

.contact-quick {
  background: #fff;
  padding: 1.5rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(229, 231, 235, 0.8);
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.contact-quick-title {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-heading);
  margin: 0 0 0.125rem;
}

.contact-quick-desc {
  font-size: 0.6875rem;
  color: var(--color-text-light);
  margin: 0;
}

.contact-quick-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  border: 1px solid var(--color-border-light);
  border-radius: 0.375rem;
  text-decoration: none;
  color: inherit;
  transition:
    border-color var(--transition-fast),
    background var(--transition-fast);
}

.contact-quick-link:hover {
  border-color: rgba(146, 64, 14, 0.3);
  background: rgba(254, 243, 199, 0.15);
}

.contact-quick-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.contact-quick-icon {
  font-size: var(--icon-size-sm);
  color: var(--color-text-light);
  transition: color var(--transition-fast);
}

.contact-quick-link:hover .contact-quick-icon {
  color: var(--color-primary);
}

.contact-quick-label {
  display: block;
  font-size: 0.625rem;
  color: var(--color-text-light);
}

.contact-quick-value {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-heading);
}

.contact-quick-arrow {
  font-size: var(--icon-size-xs);
  color: var(--color-text-light);
}

/* Showroom */
.contact-showroom {
  padding-bottom: 4rem;
}

.showroom-banner {
  display: grid;
  grid-template-columns: 1fr;
  background: #fff;
  border: 1px solid var(--color-border-light);
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

@media (min-width: 768px) {
  .showroom-banner {
    grid-template-columns: 5fr 7fr;
    align-items: stretch;
  }
}

.showroom-media {
  min-height: 14rem;
}

.showroom-image {
  width: 100%;
  height: 100%;
  min-height: 14rem;
  object-fit: cover;
}

@media (min-width: 768px) {
  .showroom-media {
    min-height: 220px;
  }

  .showroom-image {
    min-height: 100%;
  }
}

.showroom-content {
  padding: 2rem;
}

@media (min-width: 768px) {
  .showroom-content {
    padding: 3rem;
  }
}

.showroom-eyebrow {
  display: block;
  font-size: 0.625rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 600;
  color: var(--color-primary);
  margin-bottom: 0.25rem;
}

.showroom-title {
  font-family: var(--font-serif);
  font-size: clamp(1.25rem, 2.5vw, 1.5rem);
  color: var(--color-heading);
  margin: 0 0 0.75rem;
  font-weight: 600;
}

.showroom-text {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  line-height: 1.65;
  margin: 0 0 1.5rem;
  max-width: 36rem;
}

.showroom-cta {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  background: var(--color-primary);
  color: #fff;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  text-decoration: none;
  border-radius: 0.375rem;
  transition: background var(--transition-fast);
}

.showroom-cta:hover {
  background: var(--color-primary-hover);
  color: #fff;
}

.showroom-cta i {
  font-size: 0.6875rem;
  line-height: 1;
}

@media (max-width: 768px) {
  .contact-hero {
    padding-top: 3rem;
  }

  .contact-hero-image {
    height: 260px;
  }

  .contact-info-bar-wrap {
    padding-bottom: 2rem;
  }

  .contact-form-card {
    padding: 1.5rem;
  }
}
</style>
