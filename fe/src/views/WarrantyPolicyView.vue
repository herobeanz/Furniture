<template>
  <div class="warranty-page">
    <section class="warranty-hero">
      <div class="container warranty-hero-inner">
        <div class="warranty-hero-copy">
          <span class="eyebrow">Chính sách bảo hành</span>
          <h1 class="warranty-hero-title">
            Cam kết chất lượng<br />An tâm sử dụng
          </h1>
          <p class="warranty-hero-text">
            {{ BRAND_NAME }} cam kết mang đến những sản phẩm nội thất gỗ chất
            lượng cao cùng chính sách bảo hành rõ ràng, minh bạch để bạn hoàn
            toàn yên tâm khi sử dụng.
          </p>
        </div>
        <div class="warranty-hero-visual">
          <img
            :src="WARRANTY_HERO_IMAGE"
            alt="Không gian sống an tâm"
            class="warranty-hero-image"
            loading="eager"
          />
        </div>
      </div>

      <div class="container warranty-features-wrap">
        <div class="warranty-features">
          <div
            v-for="(feature, index) in WARRANTY_HERO_FEATURES"
            :key="feature.title"
            class="warranty-feature"
            :class="{ 'warranty-feature--bordered': index > 0 }"
          >
            <i
              :class="feature.icon"
              class="warranty-feature-icon"
              aria-hidden="true"
            />
            <div>
              <h4 class="warranty-feature-title">{{ feature.title }}</h4>
              <p class="warranty-feature-desc">{{ feature.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="warranty-terms section-shell">
      <div class="container">
        <div class="warranty-terms-head">
          <span class="eyebrow">Nội dung chính sách</span>
          <h2 class="warranty-terms-title">Điều khoản bảo hành</h2>
          <p class="warranty-terms-sub">
            Chính sách bảo hành áp dụng cho tất cả các sản phẩm nội thất gỗ do
            {{ BRAND_NAME }} cung cấp.
          </p>
        </div>

        <div class="warranty-cards">
          <article
            v-for="card in WARRANTY_TERM_CARDS"
            :key="card.number"
            class="warranty-card"
            :class="{ 'warranty-card--stretch': card.note && !card.steps }"
          >
            <div class="warranty-card-head">
              <span class="warranty-card-num">{{ card.number }}</span>
              <h3 class="warranty-card-title">{{ card.title }}</h3>
            </div>

            <p v-if="card.intro" class="warranty-card-intro">
              {{ card.intro }}
            </p>

            <ul v-if="card.items?.length" class="warranty-card-list">
              <li v-for="(item, i) in card.items" :key="i">
                <template v-if="typeof item === 'string'">{{ item }}</template>
                <template v-else>
                  <strong>{{ item.label }}</strong> {{ item.text }}
                </template>
              </li>
            </ul>

            <div v-if="card.steps?.length" class="warranty-steps">
              <div
                v-for="step in card.steps"
                :key="step.title"
                class="warranty-step"
              >
                <i
                  :class="step.icon"
                  class="warranty-step-icon"
                  aria-hidden="true"
                />
                <p>
                  <strong>{{ step.title }}</strong> {{ step.text }}
                </p>
              </div>
            </div>

            <div v-if="card.contactLines" class="warranty-contact-lines">
              <p>
                <i class="fa-solid fa-phone" aria-hidden="true" />
                Hotline:
                <a :href="'tel:' + phoneTel" class="warranty-contact-strong">{{
                  phoneDisplay
                }}</a>
              </p>
              <p>
                <i class="fa-regular fa-envelope" aria-hidden="true" />
                Email:
                <a :href="'mailto:' + email" class="warranty-contact-link">{{
                  email
                }}</a>
              </p>
              <p>
                <i class="fa-regular fa-clock" aria-hidden="true" />
                Thời gian làm việc: {{ CONTACT_HOURS_SHORT }}
              </p>
            </div>

            <div v-if="card.note" class="warranty-card-note">
              <template v-if="card.number === '06'">
                <strong>Lưu ý:</strong> Chính sách bảo hành có thể được cập nhật
                theo thời điểm. Vui lòng liên hệ để được hỗ trợ thông tin mới
                nhất.
              </template>
              <template v-else>{{ card.note }}</template>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="warranty-cta section-shell">
      <div class="container">
        <div class="warranty-cta-banner">
          <div class="warranty-cta-copy">
            <div class="warranty-cta-icon-wrap" aria-hidden="true">
              <i class="fa-regular fa-circle-check" />
            </div>
            <div>
              <h3 class="warranty-cta-title">
                An tâm với chất lượng từ {{ BRAND_NAME }}
              </h3>
              <p class="warranty-cta-text">
                Chúng tôi luôn đặt chất lượng và sự hài lòng của khách hàng lên
                hàng đầu. Mọi sản phẩm đều được kiểm tra kỹ lưỡng trước khi đến
                tay bạn.
              </p>
            </div>
          </div>
          <RouterLink to="/lien-he" class="warranty-cta-btn">
            Liên hệ hỗ trợ
            <i class="fa-regular fa-paper-plane" aria-hidden="true" />
          </RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
import { BRAND_NAME } from "@/constants/brand";
import {
  WARRANTY_HERO_FEATURES,
  WARRANTY_HERO_IMAGE,
  WARRANTY_TERM_CARDS,
} from "@/constants/warranty-policy";
import { useContactInfo } from "@/composables/common/useContactInfo";

const {
  phoneDisplay,
  phoneTel,
  email,
  hoursShort: CONTACT_HOURS_SHORT,
} = useContactInfo();
</script>

<style scoped>
.warranty-page {
  background: #faf9f6;
}

/* Hero */
.warranty-hero {
  background: #f5f2eb;
  padding: 4rem 0 0;
  overflow: hidden;
  position: relative;
}

.warranty-hero-inner {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  align-items: center;
  padding-bottom: 3rem;
}

@media (min-width: 1024px) {
  .warranty-hero {
    padding-top: 6rem;
  }

  .warranty-hero-inner {
    grid-template-columns: 5fr 7fr;
    gap: 2rem;
  }
}

.warranty-hero-title {
  font-family: var(--font-serif);
  font-size: var(--fs-page-title);
  line-height: var(--lh-h1);
  color: var(--color-heading);
  margin-bottom: 1rem;
  font-weight: 600;
}

.warranty-hero-text {
  font-size: var(--fs-body-lg);
  color: var(--color-text-muted);
  line-height: var(--lh-body);
  margin: 0;
}

.warranty-hero-visual {
  display: flex;
  justify-content: flex-end;
}

.warranty-hero-image {
  width: 100%;
  height: 280px;
  object-fit: cover;
  border-radius: 2px;
  box-shadow: 0 4px 6px rgb(0 0 0 / 0.07);
}

@media (min-width: 640px) {
  .warranty-hero-image {
    height: 320px;
  }
}

.warranty-features-wrap {
  position: relative;
  z-index: 2;
  margin-top: -0.5rem;
  padding-bottom: 3rem;
}

.warranty-features {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  padding: 1.25rem;
  background: #fff;
  border: 1px solid rgb(243 244 246 / 0.6);
  border-radius: 2px;
  box-shadow: 0 1px 2px rgb(0 0 0 / 0.04);
}

@media (min-width: 640px) {
  .warranty-features {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .warranty-features {
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
  }
}

.warranty-feature {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

@media (min-width: 1024px) {
  .warranty-feature--bordered {
    border-left: 1px solid var(--color-border-light);
    padding-left: 1rem;
  }
}

.warranty-feature-icon {
  color: var(--color-primary);
  font-size: var(--fs-body);
  margin-top: 0.125rem;
  flex-shrink: 0;
}

.warranty-feature-title {
  font-size: var(--fs-body-sm);
  font-weight: 700;
  color: var(--color-heading);
  margin: 0 0 0.25rem;
}

.warranty-feature-desc {
  font-size: var(--fs-body-sm);
  color: var(--color-text-light);
  line-height: var(--lh-body);
  margin: 0;
}

/* Terms */
.warranty-terms {
  padding-top: 2rem;
}

.warranty-terms-head {
  text-align: center;
  margin-bottom: 3rem;
}

.warranty-terms-title {
  font-family: var(--font-serif);
  font-size: var(--fs-section-title);
  line-height: var(--lh-h2);
  color: var(--color-heading);
  margin: 0 0 0.5rem;
  font-weight: 600;
}

.warranty-terms-sub {
  font-size: var(--fs-body-lg);
  line-height: var(--lh-body);
  color: var(--color-text-muted);
  margin: 0;
}

.warranty-cards {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .warranty-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .warranty-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

.warranty-card {
  display: flex;
  flex-direction: column;
  background: #fff;
  padding: 1.5rem;
  border-radius: 2px;
  border: 1px solid var(--color-border-light);
  box-shadow: 0 1px 2px rgb(0 0 0 / 0.04);
}

.warranty-card--stretch {
  justify-content: space-between;
}

.warranty-card-head {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.warranty-card-num {
  background: #f5f2eb;
  color: var(--color-primary-dark);
  font-size: var(--fs-body-sm);
  font-weight: 700;
  padding: 0.25rem 0.5rem;
  border-radius: 2px;
  flex-shrink: 0;
}

.warranty-card-title {
  font-size: var(--fs-card-title);
  line-height: var(--lh-h3);
  font-weight: 700;
  color: var(--color-heading);
  margin: 0;
}

.warranty-card-intro {
  font-size: var(--fs-body);
  color: var(--color-text-muted);
  line-height: var(--lh-body);
  margin: 0 0 0.75rem;
}

.warranty-card-list {
  font-size: var(--fs-body);
  color: var(--color-text);
  line-height: var(--lh-body);
  margin: 0 0 1rem;
  padding-left: 1rem;
  list-style: disc;
}

.warranty-card-list li {
  margin-bottom: 0.375rem;
}

.warranty-card-list strong {
  color: var(--color-heading);
  font-weight: 600;
}

.warranty-steps {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.warranty-step {
  display: flex;
  align-items: flex-start;
  gap: 0.625rem;
  font-size: var(--fs-body);
  color: var(--color-text);
  line-height: var(--lh-body);
}

.warranty-step-icon {
  color: var(--color-primary);
  margin-top: 0.125rem;
  flex-shrink: 0;
}

.warranty-step strong {
  color: var(--color-text);
  font-weight: 600;
}

.warranty-contact-lines {
  font-size: var(--fs-body);
  color: var(--color-text);
  line-height: var(--lh-body);
  margin-bottom: 1rem;
}

.warranty-contact-lines p {
  margin: 0 0 0.5rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.35rem;
}

.warranty-contact-lines i {
  color: var(--color-text-light);
  width: 1rem;
}

.warranty-contact-strong {
  font-weight: 600;
  color: var(--color-heading);
  text-decoration: none;
}

.warranty-contact-strong:hover {
  color: var(--color-primary);
}

.warranty-contact-link {
  color: var(--color-text);
  text-decoration: none;
}

.warranty-contact-link:hover {
  color: var(--color-primary);
}

.warranty-card-note {
  background: #fcfbfa;
  border: 1px solid var(--color-border-light);
  padding: 0.75rem;
  border-radius: 2px;
  font-size: var(--fs-body-sm);
  color: var(--color-text-light);
  line-height: var(--lh-body);
  margin-top: auto;
}

.warranty-card-note strong {
  color: var(--color-text);
  font-weight: 600;
}

/* CTA */
.warranty-cta {
  padding-top: 2.5rem;
  padding-bottom: 4rem;
}

.warranty-cta-banner {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 1.5rem;
  background: #fff;
  border: 1px solid var(--color-border-light);
  padding: 1.5rem;
  border-radius: 2px;
  box-shadow: 0 1px 2px rgb(0 0 0 / 0.04);
}

@media (min-width: 768px) {
  .warranty-cta-banner {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

.warranty-cta-copy {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.warranty-cta-icon-wrap {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: #f5f2eb;
  color: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: var(--fs-body);
}

.warranty-cta-title {
  font-size: var(--fs-card-title);
  line-height: var(--lh-h3);
  font-weight: 700;
  color: var(--color-heading);
  margin: 0 0 0.25rem;
}

.warranty-cta-text {
  font-size: var(--fs-body-sm);
  color: var(--color-text-light);
  line-height: var(--lh-body);
  margin: 0;
  max-width: 36rem;
}

.warranty-cta-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: var(--color-primary-dark);
  color: #fff;
  font-size: var(--fs-button);
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 0.625rem 1.25rem;
  border-radius: 2px;
  text-decoration: none;
  white-space: nowrap;
  transition: background 0.2s ease;
  flex-shrink: 0;
}

.warranty-cta-btn:hover {
  background: var(--color-primary-hover);
  color: #fff;
}

.warranty-cta-btn i {
  font-size: var(--fs-caption);
}
</style>
