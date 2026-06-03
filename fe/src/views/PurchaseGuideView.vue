<template>
  <div class="purchase-guide-page">
    <section class="purchase-guide-hero">
      <div class="container purchase-guide-hero-inner">
        <div class="purchase-guide-hero-copy">
          <span class="eyebrow">Hướng dẫn mua hàng</span>
          <h1 class="purchase-guide-hero-title">
            Đặt mua dễ dàng<br />chỉ với 3 cách
          </h1>
          <p class="purchase-guide-hero-text">
            {{ BRAND_NAME }} mang đến trải nghiệm mua sắm đơn giản, thuận tiện
            với nhiều kênh đặt hàng nhanh chóng, giúp bạn sở hữu những sản phẩm
            nội thất gỗ chất lượng dễ dàng hơn bao giờ hết.
          </p>
        </div>
        <div class="purchase-guide-hero-visual">
          <img
            :src="PURCHASE_GUIDE_HERO_IMAGE"
            alt="Không gian sống tiện nghi"
            class="purchase-guide-hero-image"
            loading="eager"
          />
        </div>
      </div>
    </section>

    <section class="purchase-guide-channels section-shell">
      <div class="container">
        <div class="purchase-guide-section-head">
          <span class="eyebrow">Các hình thức đặt hàng</span>
          <h2 class="purchase-guide-section-title">
            Chọn cách phù hợp với bạn
          </h2>
          <p class="purchase-guide-section-sub">
            {{ BRAND_NAME }} hỗ trợ đặt hàng nhanh chóng qua các kênh bên dưới.
            Bạn có thể chọn cách thuận tiện nhất cho mình.
          </p>
        </div>

        <div class="purchase-guide-channel-grid">
          <article
            v-for="channel in PURCHASE_ORDER_CHANNELS"
            :key="channel.number"
            class="purchase-guide-channel-card"
          >
            <div>
              <div class="purchase-guide-card-head">
                <span class="purchase-guide-card-num">{{
                  channel.number
                }}</span>
                <h3 class="purchase-guide-card-title">{{ channel.title }}</h3>
              </div>
              <p class="purchase-guide-card-intro">{{ channel.intro }}</p>

              <div class="purchase-guide-channel-body">
                <i
                  :class="[
                    channel.icon,
                    'purchase-guide-channel-icon',
                    `purchase-guide-channel-icon--${channel.iconTone}`,
                  ]"
                  aria-hidden="true"
                />
                <ul class="purchase-guide-benefits">
                  <li v-for="(benefit, i) in channel.benefits" :key="i">
                    <i class="fa-solid fa-check" aria-hidden="true" />
                    {{ benefit }}
                  </li>
                </ul>
              </div>
            </div>

            <a
              v-if="channel.cta.type === 'zalo' && zaloUrl"
              :href="zaloUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="purchase-guide-cta-btn purchase-guide-cta-btn--primary"
            >
              {{ channel.cta.label }}
              <i class="fa-regular fa-paper-plane" aria-hidden="true" />
            </a>
            <a
              v-else-if="channel.cta.type === 'messenger' && messengerUrl"
              :href="messengerUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="purchase-guide-cta-btn purchase-guide-cta-btn--primary"
            >
              {{ channel.cta.label }}
              <i class="fa-regular fa-paper-plane" aria-hidden="true" />
            </a>
            <a
              v-else-if="channel.cta.type === 'phone'"
              :href="'tel:' + phoneTel"
              class="purchase-guide-cta-btn purchase-guide-cta-btn--outline"
            >
              {{ channel.cta.label }}: {{ phoneDisplay }}
              <i class="fa-solid fa-phone" aria-hidden="true" />
            </a>
          </article>
        </div>
      </div>
    </section>

    <section class="purchase-guide-process">
      <div class="container">
        <div class="purchase-guide-section-head">
          <span class="eyebrow">Quy trình đặt hàng</span>
          <h2 class="purchase-guide-section-title">
            4 bước đơn giản để sở hữu sản phẩm
          </h2>
          <p class="purchase-guide-section-sub">
            Quy trình đặt hàng tại {{ BRAND_NAME }} đơn giản, minh bạch và nhanh
            chóng.
          </p>
        </div>

        <div class="purchase-guide-steps">
          <div
            v-for="(step, index) in PURCHASE_PROCESS_STEPS"
            :key="step.title"
            class="purchase-guide-step"
          >
            <div class="purchase-guide-step-icon-wrap">
              <i :class="step.icon" aria-hidden="true" />
            </div>
            <h3 class="purchase-guide-step-title">{{ step.title }}</h3>
            <p class="purchase-guide-step-desc">{{ step.description }}</p>
            <div
              v-if="index < PURCHASE_PROCESS_STEPS.length - 1"
              class="purchase-guide-step-connector"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </section>

    <section class="purchase-guide-values section-shell">
      <div class="container">
        <div class="purchase-guide-values-bar">
          <div
            v-for="(item, index) in PURCHASE_VALUE_PROPS"
            :key="item.title"
            class="purchase-guide-value"
            :class="{ 'purchase-guide-value--bordered': index > 0 }"
          >
            <i
              :class="item.icon"
              class="purchase-guide-value-icon"
              aria-hidden="true"
            />
            <div>
              <h4 class="purchase-guide-value-title">{{ item.title }}</h4>
              <p class="purchase-guide-value-desc">{{ item.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="purchase-guide-cta section-shell">
      <div class="container">
        <div class="purchase-guide-cta-banner">
          <div class="purchase-guide-cta-copy">
            <i
              class="fa-regular fa-circle-question purchase-guide-cta-question"
              aria-hidden="true"
            />
            <div>
              <h3 class="purchase-guide-cta-title">Cần hỗ trợ đặt hàng?</h3>
              <p class="purchase-guide-cta-text">
                Đội ngũ {{ BRAND_NAME }} luôn sẵn sàng tư vấn và hỗ trợ bạn chọn
                lựa sản phẩm phù hợp nhất.
              </p>
            </div>
          </div>
          <div class="purchase-guide-cta-links">
            <a :href="'tel:' + phoneTel" class="purchase-guide-cta-link">
              <span class="purchase-guide-cta-link-icon" aria-hidden="true">
                <i
                  class="fa-solid fa-phone-volume purchase-guide-cta-link-icon--phone"
                />
              </span>
              <span class="purchase-guide-cta-link-label">Hotline</span>
              <span class="purchase-guide-cta-link-strong">{{
                phoneDisplay
              }}</span>
            </a>
            <a
              v-if="zaloUrl"
              :href="zaloUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="purchase-guide-cta-link"
            >
              <span class="purchase-guide-cta-link-icon" aria-hidden="true">
                <i
                  class="fa-solid fa-comment-sms purchase-guide-cta-link-icon--zalo"
                />
              </span>
              <span class="purchase-guide-cta-link-label">Zalo</span>
              <span class="purchase-guide-cta-link-muted">Chat ngay</span>
            </a>
            <a
              v-if="messengerUrl"
              :href="messengerUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="purchase-guide-cta-link"
            >
              <span class="purchase-guide-cta-link-icon" aria-hidden="true">
                <i
                  class="fa-brands fa-facebook-messenger purchase-guide-cta-link-icon--messenger"
                />
              </span>
              <span class="purchase-guide-cta-link-label">Messenger</span>
              <span class="purchase-guide-cta-link-muted">Chat ngay</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { BRAND_NAME } from "@/constants/brand";
import {
  PURCHASE_GUIDE_HERO_IMAGE,
  PURCHASE_ORDER_CHANNELS,
  PURCHASE_PROCESS_STEPS,
  PURCHASE_VALUE_PROPS,
} from "@/constants/purchase-guide";
import { useContactInfo } from "@/composables/common/useContactInfo";

const { phoneDisplay, phoneTel, messengerUrl, zaloUrl } = useContactInfo();
</script>

<style scoped>
.purchase-guide-page {
  background: #faf9f6;
}

/* Hero */
.purchase-guide-hero {
  background: #f5f2eb;
  padding: 4rem 0;
  overflow: hidden;
}

@media (min-width: 1024px) {
  .purchase-guide-hero {
    padding: 6rem 0;
  }
}

.purchase-guide-hero-inner {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  align-items: center;
}

@media (min-width: 1024px) {
  .purchase-guide-hero-inner {
    grid-template-columns: 5fr 7fr;
    gap: 2rem;
  }
}

.purchase-guide-hero-title {
  font-family: var(--font-serif);
  font-size: var(--fs-page-title);
  line-height: 1.15;
  color: var(--color-heading);
  margin-bottom: 1rem;
  font-weight: 600;
}

.purchase-guide-hero-text {
  font-size: var(--fs-body-sm);
  color: var(--color-text-muted);
  line-height: 1.7;
  margin: 0;
}

.purchase-guide-hero-visual {
  display: flex;
  justify-content: flex-end;
}

.purchase-guide-hero-image {
  width: 100%;
  height: 280px;
  object-fit: cover;
  border-radius: 2px;
  box-shadow: 0 4px 6px rgb(0 0 0 / 0.07);
}

@media (min-width: 640px) {
  .purchase-guide-hero-image {
    height: 320px;
  }
}

/* Section head */
.purchase-guide-section-head {
  text-align: center;
  margin-bottom: 3rem;
}

.purchase-guide-section-title {
  font-family: var(--font-serif);
  font-size: var(--fs-section-title);
  color: var(--color-heading);
  margin: 0 0 0.5rem;
  font-weight: 600;
}

.purchase-guide-section-sub {
  font-size: var(--fs-body-sm);
  color: var(--color-text-muted);
  margin: 0;
}

/* Order channels */
.purchase-guide-channel-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

@media (min-width: 768px) {
  .purchase-guide-channel-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.purchase-guide-channel-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: #fff;
  padding: 1.5rem;
  border-radius: 2px;
  border: 1px solid var(--color-border-light);
  box-shadow: 0 1px 2px rgb(0 0 0 / 0.04);
}

.purchase-guide-card-head {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.purchase-guide-card-num {
  background: #f5f2eb;
  color: var(--color-primary-dark);
  font-size: var(--fs-body-sm);
  font-weight: 700;
  padding: 0.25rem 0.5rem;
  border-radius: 2px;
  flex-shrink: 0;
}

.purchase-guide-card-title {
  font-size: var(--fs-body-sm);
  font-weight: 700;
  color: var(--color-heading);
  margin: 0;
}

.purchase-guide-card-intro {
  font-size: var(--fs-body-sm);
  color: var(--color-text-muted);
  line-height: 1.65;
  margin: 0 0 1rem;
}

.purchase-guide-channel-body {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.purchase-guide-channel-icon {
  font-size: var(--fs-section-title);
  margin-top: 0.25rem;
  flex-shrink: 0;
}

.purchase-guide-channel-icon--zalo {
  color: #3b82f6;
}

.purchase-guide-channel-icon--messenger {
  color: #9333ea;
}

.purchase-guide-channel-icon--phone {
  color: var(--color-primary);
}

.purchase-guide-benefits {
  list-style: none;
  margin: 0;
  padding: 0;
  font-size: var(--fs-body-sm);
  color: var(--color-text);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.purchase-guide-benefits li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.purchase-guide-benefits i {
  font-size: var(--fs-caption);
  color: var(--color-primary);
}

.purchase-guide-cta-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  font-size: var(--fs-body-sm);
  font-weight: 500;
  padding: 0.625rem 1rem;
  border-radius: 2px;
  text-decoration: none;
  transition:
    background 0.2s ease,
    border-color 0.2s ease;
}

.purchase-guide-cta-btn i {
  font-size: var(--fs-caption);
}

.purchase-guide-cta-btn--primary {
  background: var(--color-primary-dark);
  color: #fff;
}

.purchase-guide-cta-btn--primary:hover {
  background: var(--color-primary-hover);
  color: #fff;
}

.purchase-guide-cta-btn--outline {
  border: 1px solid var(--color-primary);
  color: var(--color-primary-dark);
  font-weight: 700;
}

.purchase-guide-cta-btn--outline:hover {
  background: rgb(245 242 235 / 0.5);
}

/* Process */
.purchase-guide-process {
  padding: 4rem 0;
  background: #fff;
  border-top: 1px solid var(--color-border-light);
  border-bottom: 1px solid var(--color-border-light);
}

.purchase-guide-steps {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  position: relative;
}

@media (min-width: 640px) {
  .purchase-guide-steps {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .purchase-guide-steps {
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem;
  }
}

.purchase-guide-step {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.purchase-guide-step-icon-wrap {
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  background: #fcfbfa;
  border: 1px solid rgb(243 244 246 / 0.8);
  box-shadow: 0 1px 2px rgb(0 0 0 / 0.04);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary);
  font-size: var(--fs-card-title);
  margin-bottom: 1rem;
  transition: transform 0.2s ease;
}

.purchase-guide-step:hover .purchase-guide-step-icon-wrap {
  transform: scale(1.05);
}

.purchase-guide-step-title {
  font-size: var(--fs-body-sm);
  font-weight: 700;
  color: var(--color-heading);
  margin: 0 0 0.5rem;
}

.purchase-guide-step-desc {
  font-size: var(--fs-body-sm);
  color: var(--color-text-light);
  line-height: 1.55;
  max-width: 12.5rem;
  margin: 0;
}

.purchase-guide-step-connector {
  display: none;
}

@media (min-width: 1024px) {
  .purchase-guide-step-connector {
    display: block;
    position: absolute;
    top: 2rem;
    left: 75%;
    width: 50%;
    border-top: 1px dashed var(--color-border-light);
  }
}

/* Value props */
.purchase-guide-values {
  padding-top: 3rem;
  padding-bottom: 0;
}

.purchase-guide-values-bar {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  padding: 1.25rem;
  background: #fff;
  border: 1px solid rgb(243 244 246 / 0.6);
  border-radius: 2px;
  box-shadow: 0 1px 2px rgb(0 0 0 / 0.04);
}

@media (min-width: 1024px) {
  .purchase-guide-values-bar {
    grid-template-columns: repeat(4, 1fr);
  }
}

.purchase-guide-value {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

@media (min-width: 1024px) {
  .purchase-guide-value--bordered {
    border-left: 1px solid var(--color-border-light);
    padding-left: 1rem;
  }
}

.purchase-guide-value-icon {
  color: var(--color-primary);
  font-size: var(--fs-body);
  flex-shrink: 0;
}

.purchase-guide-value-title {
  font-size: var(--fs-body-sm);
  font-weight: 700;
  color: var(--color-heading);
  margin: 0 0 0.125rem;
}

.purchase-guide-value-desc {
  font-size: var(--fs-caption);
  color: var(--color-text-light);
  margin: 0;
  line-height: 1.4;
}

/* Bottom CTA */
.purchase-guide-cta {
  padding-bottom: 4rem;
}

.purchase-guide-cta-banner {
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
  .purchase-guide-cta-banner {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

.purchase-guide-cta-copy {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.purchase-guide-cta-question {
  font-size: var(--fs-section-title);
  color: var(--color-primary);
  flex-shrink: 0;
}

.purchase-guide-cta-title {
  font-size: var(--fs-body-sm);
  font-weight: 700;
  color: var(--color-heading);
  margin: 0 0 0.25rem;
}

.purchase-guide-cta-text {
  font-size: var(--fs-body-sm);
  color: var(--color-text-light);
  line-height: 1.55;
  margin: 0;
  max-width: 28rem;
}

.purchase-guide-cta-links {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
}

@media (min-width: 768px) {
  .purchase-guide-cta-links {
    width: max-content;
    min-width: 15.5rem;
    margin-left: auto;
  }
}

.purchase-guide-cta-link {
  display: grid;
  grid-template-columns: 1.25rem 5.75rem 1fr;
  column-gap: 0.5rem;
  align-items: center;
  font-size: var(--fs-body-sm);
  color: var(--color-text);
  text-decoration: none;
  transition: color 0.2s ease;
}

.purchase-guide-cta-link:hover {
  color: var(--color-primary);
}

.purchase-guide-cta-link:hover .purchase-guide-cta-link-label {
  color: var(--color-primary);
}

.purchase-guide-cta-link-icon {
  width: 1.25rem;
  height: 1.25rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.purchase-guide-cta-link-icon i {
  font-size: 1.125rem;
  line-height: 1;
  width: 1.125rem;
  text-align: center;
}

.purchase-guide-cta-link-icon--phone {
  color: var(--color-primary);
}

.purchase-guide-cta-link-icon--zalo {
  color: #3b82f6;
}

.purchase-guide-cta-link-icon--messenger {
  color: #9333ea;
}

.purchase-guide-cta-link-label {
  font-weight: 600;
  transition: color 0.2s ease;
}

.purchase-guide-cta-link-strong {
  font-size: var(--fs-body-sm);
  font-weight: 700;
  color: var(--color-heading);
  white-space: nowrap;
}

.purchase-guide-cta-link-muted {
  font-size: var(--fs-body-sm);
  font-weight: 400;
  color: var(--color-text-light);
  white-space: nowrap;
}
</style>
