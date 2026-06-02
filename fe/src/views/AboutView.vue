<template>
  <div class="about-page">
    <!-- Hero -->
    <section class="about-hero">
      <div class="container about-hero-inner">
        <div class="about-hero-copy">
          <span class="eyebrow">Về {{ BRAND_NAME }}</span>
          <h1 class="about-hero-title">Tinh tế trong<br />từng đường nét</h1>
          <p class="about-hero-text">
            {{ BRAND_NAME }} là thương hiệu nội thất gỗ cao cấp với hơn 10 năm
            kinh nghiệm trong thiết kế và sản xuất. Chúng tôi mang đến những sản
            phẩm tinh tế, bền vững và truyền cảm hứng cho không gian sống hiện
            đại.
          </p>
          <!-- <RouterLink to="san-pham" class="btn-cta">
            Khám phá sản phẩm
          </RouterLink> -->
        </div>
        <div class="about-hero-visual">
          <img
            :src="ABOUT_IMAGES.hero"
            alt="Không gian phòng khách"
            class="about-hero-image"
            loading="eager"
          />
        </div>
      </div>
    </section>

    <!-- Câu chuyện -->
    <section class="about-story section-shell section-shell--white">
      <div class="container about-story-inner">
        <div class="about-story-media">
          <img
            :src="ABOUT_IMAGES.workshop"
            :alt="'Xưởng gỗ ' + BRAND_NAME"
            class="about-story-image"
            loading="lazy"
          />
        </div>
        <div class="about-story-content">
          <span class="eyebrow">Câu chuyện của chúng tôi</span>
          <h2 class="about-story-title">Khởi nguồn từ đam mê gỗ tự nhiên</h2>
          <div class="about-story-body">
            <p>
              {{ BRAND_NAME }} được thành lập với niềm đam mê mãnh liệt với gỗ
              và mong muốn mang đến những giá trị bền vững cho ngôi nhà Việt.
            </p>
            <p>
              Từ những ngày đầu với xưởng mộc nhỏ, chúng tôi không ngừng học
              hỏi, cải tiến và hoàn thiện để tạo ra những sản phẩm nội thất chất
              lượng cao, tinh xảo trong từng chi tiết.
            </p>
          </div>
          <div class="about-pillars">
            <div
              v-for="pillar in ABOUT_STORY_PILLARS"
              :key="pillar.title"
              class="about-pillar"
            >
              <div class="about-pillar-head">
                <i
                  :class="pillar.icon"
                  class="about-pillar-icon"
                  aria-hidden="true"
                />
                <span class="about-pillar-title">{{ pillar.title }}</span>
              </div>
              <p class="about-pillar-desc">{{ pillar.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Giá trị cốt lõi -->
    <section class="about-values">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">Giá trị cốt lõi</span>
          <h2 class="section-heading">Những giá trị chúng tôi theo đuổi</h2>
          <p class="section-desc">
            Mỗi sản phẩm của {{ BRAND_NAME }} đều được tạo ra từ tâm huyết và
            những giá trị bền vững.
          </p>
        </div>
        <div class="values-grid">
          <div
            v-for="value in ABOUT_CORE_VALUES"
            :key="value.title"
            class="value-card"
          >
            <div class="value-icon" aria-hidden="true">
              <i :class="value.icon" />
            </div>
            <h3 class="value-title">{{ value.title }}</h3>
            <p class="value-desc">{{ value.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Quy trình sản xuất -->
    <section class="about-process section-shell section-shell--white">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">Quy trình sản xuất</span>
          <h2 class="section-heading">Tỉ mỉ trong từng công đoạn</h2>
          <p class="section-desc">
            Chúng tôi kiểm soát chặt chẽ từ khâu chọn gỗ đến hoàn thiện để đảm
            bảo chất lượng tốt nhất.
          </p>
        </div>
        <div class="process-grid">
          <article
            v-for="step in ABOUT_PROCESS_STEPS"
            :key="step.step"
            class="process-card group"
          >
            <div class="process-image-wrap">
              <span class="process-badge">{{ step.step }}</span>
              <img
                :src="step.image"
                :alt="step.title"
                class="process-image"
                loading="lazy"
              />
            </div>
            <h3 class="process-title">{{ step.title }}</h3>
            <p class="process-desc">{{ step.description }}</p>
          </article>
        </div>
      </div>
    </section>

    <!-- Con số ấn tượng -->
    <section class="about-stats section-shell section-shell--muted">
      <div class="container">
        <h2 class="stats-heading">Những con số ấn tượng</h2>
        <div class="stats-grid">
          <div v-for="stat in ABOUT_STATS" :key="stat.label" class="stat-item">
            <div class="stat-icon" aria-hidden="true">
              <i :class="stat.icon" />
            </div>
            <div class="stat-text">
              <div class="stat-value">{{ stat.value }}</div>
              <div class="stat-label">{{ stat.label }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { BRAND_NAME } from "@/constants/brand";
import {
  ABOUT_CORE_VALUES,
  ABOUT_IMAGES,
  ABOUT_PROCESS_STEPS,
  ABOUT_STATS,
  ABOUT_STORY_PILLARS,
} from "@/constants/about";
import { useCollectionsCacheStore } from "@/stores/collectionsCache";

const collectionsCache = useCollectionsCacheStore();
const primaryCollectionSlug = ref<string | null>(null);

onMounted(async () => {
  try {
    const list = await collectionsCache.fetchList();
    const match =
      list.find((c) => c.isActive) ??
      list[0];
    primaryCollectionSlug.value = match?.slug ?? null;
  } catch {
    primaryCollectionSlug.value = null;
  }
});
</script>

<style scoped>
.about-page {
  background: #faf9f6;
}

.eyebrow {
  display: block;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 600;
  color: var(--color-primary);
  margin-bottom: 0.5rem;
  font-family: var(--font-sans);
}

/* Hero */
.about-hero {
  background: #f5f2eb;
  padding: 5rem 0;
  overflow: hidden;
}

.about-hero-inner {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  align-items: center;
}

@media (min-width: 1024px) {
  .about-hero {
    padding: 7rem 0;
  }

  .about-hero-inner {
    grid-template-columns: 5fr 7fr;
  }
}

.about-hero-title {
  font-family: var(--font-serif);
  font-size: clamp(2rem, 5vw, 3rem);
  line-height: 1.15;
  color: var(--color-heading);
  margin-bottom: 1rem;
  font-weight: 600;
}

.about-hero-text {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  line-height: 1.7;
  max-width: 20rem;
  margin-bottom: 2rem;
}

.btn-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  text-decoration: none;
  background: var(--color-primary);
  color: #fff;
  transition: background var(--transition-fast);
}

.btn-cta:hover {
  background: var(--color-primary-hover);
  color: #fff;
}

.about-hero-visual {
  display: flex;
  justify-content: flex-end;
}

.about-hero-image {
  width: 100%;
  height: 380px;
  object-fit: cover;
  border-radius: 0.5rem;
  box-shadow: var(--shadow-md);
}

/* Story */
.about-story-inner {
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  align-items: center;
}

@media (min-width: 1024px) {
  .about-story-inner {
    grid-template-columns: 5fr 7fr;
    gap: 3rem;
  }
}

.about-story-image {
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 0.5rem;
  box-shadow: var(--shadow-md);
}

.about-story-title {
  font-family: var(--font-serif);
  font-size: clamp(1.5rem, 3vw, 1.875rem);
  color: var(--color-heading);
  margin-bottom: 1.25rem;
  font-weight: 600;
  line-height: 1.25;
}

.about-story-body {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  line-height: 1.7;
  margin-bottom: 2rem;
}

.about-story-body p {
  margin-bottom: 1rem;
}

.about-story-body p:last-child {
  margin-bottom: 0;
}

.about-pillars {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .about-pillars {
    grid-template-columns: repeat(3, 1fr);
  }
}

.about-pillar-head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
}

.about-pillar-icon {
  color: var(--color-primary);
  font-size: var(--icon-size-sm);
  line-height: 1;
  flex-shrink: 0;
}

.about-pillar-title {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-heading);
}

.about-pillar-desc {
  font-size: 0.6875rem;
  color: var(--color-text-light);
  line-height: 1.6;
  margin: 0;
}

/* Values */
.about-values {
  padding: 4rem 0;
}

.section-head {
  text-align: center;
  margin-bottom: 3rem;
}

.section-head .section-heading {
  margin-bottom: 0.5rem;
}

.section-head .section-desc {
  max-width: 32rem;
  margin-left: auto;
  margin-right: auto;
}

.values-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .values-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.value-card {
  background: #fff;
  padding: 1.5rem;
  border-radius: 0.5rem;
  text-align: center;
  border: 1px solid rgba(229, 231, 235, 0.6);
  box-shadow: var(--shadow-sm);
}

.value-icon {
  color: var(--color-primary);
  font-size: var(--icon-size-lg);
  margin-bottom: 0.75rem;
  line-height: 1;
}

.value-title {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-heading);
  margin: 0 0 0.5rem;
  font-family: var(--font-sans);
}

.value-desc {
  font-size: 0.6875rem;
  color: var(--color-text-light);
  line-height: 1.6;
  margin: 0;
}

/* Process */
.process-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

@media (min-width: 768px) {
  .process-grid {
    grid-template-columns: repeat(5, 1fr);
  }
}

.process-image-wrap {
  position: relative;
  height: 9rem;
  overflow: hidden;
  border-radius: 0.5rem;
  margin-bottom: 0.75rem;
}

.process-badge {
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  z-index: 1;
  background: var(--color-primary);
  color: #fff;
  font-size: 0.625rem;
  font-weight: 600;
  padding: 0.125rem 0.5rem;
  border-radius: 0.125rem;
}

.process-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-slow);
}

.group:hover .process-image {
  transform: scale(1.05);
}

.process-title {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-heading);
  margin: 0 0 0.25rem;
  font-family: var(--font-sans);
}

.process-desc {
  font-size: 0.6875rem;
  color: var(--color-text-light);
  line-height: 1.45;
  margin: 0;
}

/* Stats */
.stats-heading {
  text-align: center;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 600;
  color: var(--color-primary);
  margin-bottom: 2rem;
  font-family: var(--font-sans);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
}

@media (min-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem;
  }
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  text-align: center;
}

@media (min-width: 768px) {
  .stat-item {
    flex-direction: row;
    text-align: left;
    justify-content: flex-start;
  }
}

.stat-icon {
  font-size: var(--icon-size-xl);
  color: var(--color-primary);
  flex-shrink: 0;
  line-height: 1;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-heading);
  font-family: var(--font-sans);
}

.stat-label {
  font-size: 0.6875rem;
  color: var(--color-text-light);
  margin-top: 0.125rem;
}

@media (max-width: 768px) {
  .about-hero {
    padding: 3rem 0;
  }

  .about-hero-image {
    height: 280px;
  }

  .about-story-image {
    height: 280px;
  }
}
</style>
