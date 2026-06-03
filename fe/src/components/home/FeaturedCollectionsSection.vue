<template>
  <section class="featured-collections section-shell">
    <div class="container">
      <div class="section-head">
        <h2 class="section-heading">Bộ sưu tập nổi bật</h2>
        <p class="section-desc">
          Những thiết kế được yêu thích nhất, mang dấu ấn riêng của
          {{ BRAND_NAME }}.
        </p>
      </div>

      <div v-if="loading" class="bento-skeleton">
        <div class="sk sk-large" />
        <div class="sk-col">
          <div class="sk sk-small" />
          <div class="sk sk-small" />
        </div>
      </div>

      <div v-else-if="tiles.length === 0" class="empty">
        Chưa có bộ sưu tập nào.
      </div>

      <div v-else class="bento-grid">
        <RouterLink
          v-if="tiles[0]"
          :to="tiles[0].href"
          class="bento-tile bento-tile--large group"
        >
          <img
            v-if="tiles[0].thumbnail"
            :src="resolveMediaUrl(tiles[0].thumbnail)"
            :alt="tiles[0].name"
            class="bento-img"
          />
          <div v-else class="bento-img bento-img--placeholder" />
          <div class="bento-overlay">
            <span class="bento-label">{{ tiles[0].subtitle }}</span>
            <h3 class="bento-heading">{{ tiles[0].tagline }}</h3>
            <span class="bento-cta bento-cta--pill">
              Xem ngay
              <i class="fa-solid fa-arrow-right" aria-hidden="true" />
            </span>
          </div>
        </RouterLink>

        <div v-if="tiles.length > 1" class="bento-col">
          <RouterLink
            v-for="tile in tiles.slice(1, 3)"
            :key="tile.id + tile.href"
            :to="tile.href"
            class="bento-tile bento-tile--small group"
          >
            <img
              v-if="tile.thumbnail"
              :src="resolveMediaUrl(tile.thumbnail)"
              :alt="tile.name"
              class="bento-img"
            />
            <div v-else class="bento-img bento-img--placeholder" />
            <div class="bento-overlay">
              <span class="bento-label">{{ tile.subtitle }}</span>
              <h3 class="bento-heading bento-heading--sm">
                {{ tile.tagline }}
              </h3>
              <span class="bento-cta bento-cta--icon" aria-hidden="true">
                <i class="fa-solid fa-arrow-right" />
              </span>
            </div>
          </RouterLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { RouterLink } from "vue-router";
import type { Collection } from "@/services/api/collections";
import { BRAND_NAME } from "@/constants/brand";
import { resolveMediaUrl } from "@/utils/mediaUrl";

export interface FeaturedTile {
  id: number;
  name: string;
  thumbnail?: string;
  subtitle: string;
  tagline: string;
  href: string;
}

interface Props {
  collections: Collection[];
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
});

const loading = computed(() => props.loading);

const tiles = computed<FeaturedTile[]>(() => {
  const fromCollections: FeaturedTile[] = props.collections
    .slice(0, 3)
    .map((c) => ({
      id: c.id,
      name: c.name,
      thumbnail: c.thumbnail,
      subtitle: c.name,
      tagline: c.description?.trim() || "Khám phá bộ sưu tập",
      href: `/bo-suu-tap/${c.slug}`,
    }));

  return fromCollections.slice(0, 3);
});
</script>

<style scoped>
.section-head {
  text-align: center;
  margin-bottom: 2.5rem;
}

.section-head .section-heading {
  margin-bottom: 0.5rem;
}

.section-head .section-desc {
  max-width: 28rem;
  margin-left: auto;
  margin-right: auto;
}

.bento-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 768px) {
  .bento-grid {
    grid-template-columns: 7fr 5fr;
    gap: 1rem;
  }
}

.bento-col {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.bento-tile {
  position: relative;
  overflow: hidden;
  border-radius: 0.5rem;
  display: block;
  text-decoration: none;
  color: #fff;
}

.bento-tile--large {
  min-height: 380px;
}

.bento-tile--small {
  flex: 1;
  min-height: 182px;
}

.bento-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  inset: 0;
  transition: transform 0.5s ease;
}

.bento-img--placeholder {
  background: linear-gradient(135deg, #e7e5e4 0%, #d6d3d1 100%);
}

.group:hover .bento-img {
  transform: scale(1.05);
}

.bento-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  padding: 1.5rem 2rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  z-index: 1;
}

.bento-label {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.85);
  margin-bottom: 0.25rem;
}

.bento-heading {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.bento-heading--sm {
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.bento-cta--pill {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #fff;
  color: var(--color-text);
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  width: max-content;
}

.bento-cta--pill i {
  font-size: var(--icon-size-xs);
  line-height: 1;
}

.bento-cta--icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.2);
  font-size: var(--icon-size-sm);
  line-height: 1;
  transition:
    background 0.2s,
    color 0.2s;
}

.group:hover .bento-cta--icon {
  background: #fff;
  color: var(--color-text);
}

.bento-skeleton {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 768px) {
  .bento-skeleton {
    grid-template-columns: 7fr 5fr;
  }
}

.sk {
  background: var(--color-border-light);
  border-radius: 0.5rem;
  animation: pulse 1.5s ease-in-out infinite;
}

.sk-large {
  min-height: 380px;
}

.sk-col {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.sk-small {
  flex: 1;
  min-height: 182px;
}

.empty {
  text-align: center;
  color: var(--color-text-muted);
  padding: 2rem;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

@media (max-width: 768px) {
  .featured-collections {
    padding: 2.5rem 0;
  }

  .bento-tile--large {
    min-height: 280px;
  }

  .bento-tile--small {
    min-height: 160px;
  }
}
</style>
