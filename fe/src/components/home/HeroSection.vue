<template>
  <section class="home-hero">
    <div class="container hero-inner">
      <div class="hero-copy">
        <span class="hero-eyebrow">Nội thất gỗ cao cấp</span>
        <h1 class="heading-display hero-title">
          Tinh tế trong<br />từng đường nét
        </h1>
        <p class="hero-text">
          Mang đến không gian sống hiện đại, ấm cúng và gần gũi với thiên nhiên
          từ chất liệu gỗ tự nhiên cao cấp.
        </p>
        <div class="hero-actions">
          <RouterLink to="/san-pham" class="btn-hero btn-hero--primary">
            Khám phá sản phẩm
          </RouterLink>
          <RouterLink to="/bo-suu-tap" class="btn-hero btn-hero--outline">
            Xem bộ sưu tập
          </RouterLink>
        </div>
      </div>
      <div class="hero-visual">
        <img
          v-if="heroImage"
          :src="heroImage"
          alt="Nội thất gỗ cao cấp"
          class="hero-image"
        />
        <div v-else class="hero-image hero-image--placeholder" />
      </div>
    </div>

    <div class="container value-bar-wrap">
      <div class="value-bar">
        <div v-for="item in valueProps" :key="item.icon" class="value-bar-item">
          <i
            :class="valueIconClass(item.icon)"
            class="value-icon"
            aria-hidden="true"
          />
          <div>
            <h4 class="value-title">{{ item.title }}</h4>
            <p class="value-desc">{{ item.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
import { HOME_HERO_IMAGE } from "@/constants/home";
import { VALUE_PROPS } from "@/constants/design-system";
import { resolveMediaUrl } from "@/utils/mediaUrl";

const valueProps = VALUE_PROPS;
const heroImage = resolveMediaUrl(HOME_HERO_IMAGE);

function valueIconClass(icon: string): string {
  const map: Record<string, string> = {
    tree: "fa-solid fa-tree",
    shield: "fa-solid fa-shield-halved",
    truck: "fa-solid fa-truck",
    ruler: "fa-solid fa-ruler-combined",
  };
  return map[icon] ?? "fa-solid fa-circle-check";
}
</script>

<style scoped>
.home-hero {
  background: var(--color-hero-bg);
  padding: 5rem 0 0;
  overflow: hidden;
}

.hero-inner {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  align-items: center;
  padding-bottom: 4rem;
}

@media (min-width: 1024px) {
  .hero-inner {
    grid-template-columns: 5fr 7fr;
    gap: 2rem;
    padding-bottom: 4rem;
  }
}

.hero-eyebrow {
  display: block;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 600;
  color: var(--color-primary);
  margin-bottom: 0.75rem;
}

.hero-title {
  font-family: var(--font-serif);
  font-size: clamp(2rem, 5vw, 3rem);
  line-height: 1.15;
  color: #111827;
  margin-bottom: 1rem;
  font-weight: 600;
  letter-spacing: -0.01em;
}

.hero-text {
  font-size: 0.875rem;
  color: var(--color-text-muted);
  line-height: 1.7;
  max-width: 20rem;
  margin-bottom: 2rem;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.btn-hero {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  text-decoration: none;
  transition:
    background 0.2s,
    border-color 0.2s,
    color 0.2s;
}

.btn-hero--primary {
  background: var(--color-primary);
  color: #fff;
}

.btn-hero--primary:hover {
  background: var(--color-primary-hover);
  color: #fff;
}

.btn-hero--outline {
  border: 1px solid #9ca3af;
  color: var(--color-text);
  background: transparent;
}

.btn-hero--outline:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.hero-visual {
  display: flex;
  justify-content: flex-end;
}

.hero-image {
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  border-radius: 0.5rem;
  box-shadow: var(--shadow-lg);
}

.hero-image--placeholder {
  min-height: 280px;
  background: linear-gradient(135deg, #e7e5e4 0%, #d6d3d1 100%);
}

.value-bar-wrap {
  margin-top: 0;
  padding-bottom: 4rem;
}

.value-bar {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  background: #fff;
  border: 1px solid var(--color-border-light);
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
}

@media (min-width: 640px) {
  .value-bar {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 768px) {
  .value-bar {
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
  }
}

.value-bar-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding-right: 0.5rem;
}

@media (min-width: 768px) {
  .value-bar-item:not(:last-child) {
    border-right: 1px solid var(--color-border-light);
  }
}

.value-icon {
  font-size: var(--icon-size-md);
  color: var(--color-primary);
  flex-shrink: 0;
  line-height: 1;
}

.value-title {
  font-size: 0.75rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 0.125rem;
}

.value-desc {
  font-size: 0.6875rem;
  color: var(--color-text-muted);
  margin: 0;
}

@media (max-width: 768px) {
  .home-hero {
    padding-top: 3rem;
  }

  .hero-inner {
    padding-bottom: 2rem;
  }

  .value-bar-wrap {
    padding-bottom: 2.5rem;
  }
}
</style>
