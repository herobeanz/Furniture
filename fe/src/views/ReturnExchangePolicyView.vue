<template>
  <div class="return-policy-page">
    <section class="return-policy-hero">
      <div class="container return-policy-hero-inner">
        <div class="return-policy-hero-copy">
          <span class="eyebrow">Chính sách đổi trả</span>
          <h1 class="return-policy-hero-title">
            Dễ dàng đổi trả<br />An tâm mua sắm
          </h1>
          <p class="return-policy-hero-text">
            {{ BRAND_NAME }} luôn mong muốn mang đến trải nghiệm mua sắm tốt nhất
            cho khách hàng. Chúng tôi hỗ trợ đổi trả sản phẩm nhanh chóng, minh
            bạch và thuận tiện.
          </p>
        </div>
        <div class="return-policy-hero-visual">
          <img
            :src="RETURN_EXCHANGE_HERO_IMAGE"
            alt="Không gian sống an tâm"
            class="return-policy-hero-image"
            loading="eager"
          />
        </div>
      </div>

      <div class="container return-policy-features-wrap">
        <div class="return-policy-features">
          <div
            v-for="(feature, index) in RETURN_EXCHANGE_HERO_FEATURES"
            :key="feature.title"
            class="return-policy-feature"
            :class="{ 'return-policy-feature--bordered': index > 0 }"
          >
            <i
              :class="feature.icon"
              class="return-policy-feature-icon"
              aria-hidden="true"
            />
            <div>
              <h4 class="return-policy-feature-title">{{ feature.title }}</h4>
              <p class="return-policy-feature-desc">{{ feature.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="return-policy-terms section-shell">
      <div class="container">
        <div class="return-policy-terms-head">
          <span class="eyebrow">Nội dung chính sách</span>
          <h2 class="return-policy-terms-title">Điều kiện và quy định đổi trả</h2>
          <p class="return-policy-terms-sub">
            Vui lòng đọc kỹ các điều kiện dưới đây để đảm bảo quyền lợi của bạn.
          </p>
        </div>

        <div class="return-policy-cards">
          <article
            v-for="card in RETURN_EXCHANGE_TERM_CARDS"
            :key="card.number"
            class="return-policy-card"
            :class="{ 'return-policy-card--stretch': card.note && !card.steps }"
          >
            <div class="return-policy-card-head">
              <span class="return-policy-card-num">{{ card.number }}</span>
              <h3 class="return-policy-card-title">{{ card.title }}</h3>
            </div>

            <p v-if="card.intro" class="return-policy-card-intro">{{ card.intro }}</p>

            <ul v-if="card.items?.length" class="return-policy-card-list">
              <li v-for="(item, i) in card.items" :key="i">
                <template v-if="typeof item === 'string'">{{ item }}</template>
                <template v-else>
                  <strong>{{ item.label }}</strong> {{ item.text }}
                </template>
              </li>
            </ul>

            <div v-if="card.steps?.length" class="return-policy-steps">
              <div
                v-for="step in card.steps"
                :key="step.title"
                class="return-policy-step"
              >
                <i :class="step.icon" class="return-policy-step-icon" aria-hidden="true" />
                <p>
                  <strong>{{ step.title }}</strong> {{ step.text }}
                </p>
              </div>
            </div>

            <div v-if="card.note" class="return-policy-card-note">
              {{ card.note }}
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="return-policy-cta section-shell">
      <div class="container">
        <div class="return-policy-cta-banner">
          <div class="return-policy-cta-copy">
            <div class="return-policy-cta-icon-wrap" aria-hidden="true">
              <i class="fa-solid fa-headset" />
            </div>
            <div>
              <h3 class="return-policy-cta-title">Cần hỗ trợ đổi trả?</h3>
              <p class="return-policy-cta-text">
                Đội ngũ chăm sóc khách hàng của {{ BRAND_NAME }} luôn sẵn sàng hỗ
                trợ bạn nhanh chóng và tận tâm nhất.
              </p>
            </div>
          </div>
          <div class="return-policy-cta-contact">
            <p>
              <i class="fa-solid fa-phone" aria-hidden="true" />
              Hotline:
              <a :href="'tel:' + phoneTel" class="return-policy-contact-strong">{{
                phoneDisplay
              }}</a>
            </p>
            <p>
              <i class="fa-regular fa-envelope" aria-hidden="true" />
              Email:
              <a :href="'mailto:' + email" class="return-policy-contact-link">{{
                email
              }}</a>
            </p>
            <p>
              <i class="fa-regular fa-clock" aria-hidden="true" />
              Thời gian làm việc: {{ CONTACT_HOURS_SHORT }}
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { BRAND_NAME } from '@/constants/brand'
import {
  RETURN_EXCHANGE_HERO_FEATURES,
  RETURN_EXCHANGE_HERO_IMAGE,
  RETURN_EXCHANGE_TERM_CARDS,
} from '@/constants/return-exchange-policy'
import { useContactInfo } from '@/composables/common/useContactInfo'

const { phoneDisplay, phoneTel, email, hoursShort: CONTACT_HOURS_SHORT } = useContactInfo()
</script>

<style scoped>
.return-policy-page {
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

.return-policy-hero {
  background: #f5f2eb;
  padding: 4rem 0 0;
  overflow: hidden;
  position: relative;
}

.return-policy-hero-inner {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  align-items: center;
  padding-bottom: 3rem;
}

@media (min-width: 1024px) {
  .return-policy-hero {
    padding-top: 6rem;
  }

  .return-policy-hero-inner {
    grid-template-columns: 5fr 7fr;
    gap: 2rem;
  }
}

.return-policy-hero-title {
  font-family: var(--font-serif);
  font-size: clamp(1.875rem, 4vw, 2.25rem);
  line-height: 1.15;
  color: var(--color-heading);
  margin-bottom: 1rem;
  font-weight: 600;
}

.return-policy-hero-text {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  line-height: 1.7;
  max-width: 20rem;
  margin: 0;
}

.return-policy-hero-visual {
  display: flex;
  justify-content: flex-end;
}

.return-policy-hero-image {
  width: 100%;
  height: 280px;
  object-fit: cover;
  border-radius: 2px;
  box-shadow: 0 4px 6px rgb(0 0 0 / 0.07);
}

@media (min-width: 640px) {
  .return-policy-hero-image {
    height: 320px;
  }
}

.return-policy-features-wrap {
  position: relative;
  z-index: 2;
  margin-top: -0.5rem;
  padding-bottom: 3rem;
}

.return-policy-features {
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
  .return-policy-features {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .return-policy-features {
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
  }
}

.return-policy-feature {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

@media (min-width: 1024px) {
  .return-policy-feature--bordered {
    border-left: 1px solid var(--color-border-light);
    padding-left: 1rem;
  }
}

.return-policy-feature-icon {
  color: var(--color-primary);
  font-size: 1rem;
  margin-top: 0.125rem;
  flex-shrink: 0;
}

.return-policy-feature-title {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-heading);
  margin: 0 0 0.25rem;
}

.return-policy-feature-desc {
  font-size: 0.6875rem;
  color: var(--color-text-light);
  line-height: 1.5;
  margin: 0;
}

.return-policy-terms {
  padding-top: 0;
}

.return-policy-terms-head {
  text-align: center;
  margin-bottom: 3rem;
}

.return-policy-terms-title {
  font-family: var(--font-serif);
  font-size: 1.5rem;
  color: var(--color-heading);
  margin: 0 0 0.5rem;
  font-weight: 600;
}

.return-policy-terms-sub {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  margin: 0;
}

.return-policy-cards {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .return-policy-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .return-policy-cards {
    grid-template-columns: repeat(3, 1fr);
  }
}

.return-policy-card {
  display: flex;
  flex-direction: column;
  background: #fff;
  padding: 1.5rem;
  border-radius: 2px;
  border: 1px solid var(--color-border-light);
  box-shadow: 0 1px 2px rgb(0 0 0 / 0.04);
}

.return-policy-card--stretch {
  justify-content: space-between;
}

.return-policy-card-head {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.return-policy-card-num {
  background: #f5f2eb;
  color: var(--color-primary-dark);
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.25rem 0.5rem;
  border-radius: 2px;
  flex-shrink: 0;
}

.return-policy-card-title {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-heading);
  margin: 0;
}

.return-policy-card-intro {
  font-size: 0.6875rem;
  color: var(--color-text-muted);
  line-height: 1.65;
  margin: 0 0 0.75rem;
}

.return-policy-card-list {
  font-size: 0.6875rem;
  color: var(--color-text);
  line-height: 1.55;
  margin: 0 0 1rem;
  padding-left: 1rem;
  list-style: disc;
}

.return-policy-card-list li {
  margin-bottom: 0.375rem;
}

.return-policy-card-list strong {
  color: var(--color-heading);
  font-weight: 600;
}

.return-policy-steps {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.return-policy-step {
  display: flex;
  align-items: flex-start;
  gap: 0.625rem;
  font-size: 0.6875rem;
  color: var(--color-text);
  line-height: 1.55;
}

.return-policy-step-icon {
  color: var(--color-primary);
  margin-top: 0.125rem;
  flex-shrink: 0;
}

.return-policy-step strong {
  color: var(--color-text);
  font-weight: 600;
}

.return-policy-card-note {
  background: #fcfbfa;
  border: 1px solid var(--color-border-light);
  padding: 0.625rem;
  border-radius: 2px;
  font-size: 0.625rem;
  color: var(--color-text-light);
  line-height: 1.55;
  margin-top: auto;
}

.return-policy-cta {
  padding-top: 0;
  padding-bottom: 4rem;
}

.return-policy-cta-banner {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 1.5rem;
  background: #fff;
  border: 1px solid var(--color-border-light);
  padding: 1.25rem;
  border-radius: 2px;
  box-shadow: 0 1px 2px rgb(0 0 0 / 0.04);
}

@media (min-width: 768px) {
  .return-policy-cta-banner {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

.return-policy-cta-copy {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.return-policy-cta-icon-wrap {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: #f5f2eb;
  color: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 1rem;
}

.return-policy-cta-title {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-heading);
  margin: 0 0 0.25rem;
}

.return-policy-cta-text {
  font-size: 0.6875rem;
  color: var(--color-text-light);
  line-height: 1.55;
  margin: 0;
  max-width: 28rem;
}

.return-policy-cta-contact {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: var(--color-text);
}

@media (min-width: 768px) {
  .return-policy-cta-contact {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 1.5rem;
    align-items: center;
  }
}

.return-policy-cta-contact p {
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.35rem;
}

.return-policy-cta-contact i {
  color: var(--color-text-light);
}

.return-policy-contact-strong {
  font-weight: 600;
  color: var(--color-heading);
  text-decoration: none;
}

.return-policy-contact-strong:hover {
  color: var(--color-primary);
}

.return-policy-contact-link {
  color: var(--color-text);
  text-decoration: none;
}

.return-policy-contact-link:hover {
  color: var(--color-primary);
}
</style>
