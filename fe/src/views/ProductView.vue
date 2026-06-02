<template>
  <div class="product-page">
    <nav
      v-if="breadcrumb.length > 0"
      class="container product-breadcrumb"
      aria-label="Breadcrumb"
    >
      <RouterLink to="/" class="product-breadcrumb-link">Trang chủ</RouterLink>
      <template v-for="(item, i) in breadcrumb" :key="item.path + i">
        <i
          class="fa-solid fa-chevron-right product-breadcrumb-sep"
          aria-hidden="true"
        />
        <RouterLink
          v-if="i < breadcrumb.length - 1"
          :to="item.path"
          class="product-breadcrumb-link"
        >
          {{ item.name }}
        </RouterLink>
        <span v-else class="product-breadcrumb-current">{{ item.name }}</span>
      </template>
    </nav>

    <div class="container product-main">
      <NotFoundView v-if="isNotFound" />
      <ErrorState v-else-if="error" :message="error" />
      <ProductDetailSkeleton v-else-if="loading && !product" />

      <template v-else-if="product">
        <section class="product-detail">
          <ProductGallery
            :images="galleryImages"
            :current-image="currentImage || ''"
            :product-name="product.name"
            :selected-index="selectedIndex"
            @select-image="setSelectedImage"
            @prev="galleryPrev"
            @next="galleryNext"
          />
          <ProductInfo :product="product" />
        </section>

        <section
          v-if="hasRichDescription"
          class="container product-description-section"
        >
          <h2 class="product-description-title">Mô tả chi tiết</h2>
          <RichHtmlContent :html="product.description" />
        </section>
      </template>
    </div>

    <section v-if="product && !loading" class="container product-trust-section">
      <div class="product-trust-bar">
        <div
          v-for="item in PRODUCT_TRUST_ITEMS"
          :key="item.title"
          class="product-trust-item"
        >
          <i
            :class="['fa-solid', item.icon]"
            class="product-trust-icon"
            aria-hidden="true"
          />
          <div>
            <h4 class="product-trust-title">{{ item.title }}</h4>
            <p class="product-trust-desc">{{ item.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <div
      v-if="product && related.length > 0"
      class="container product-related-wrap"
    >
      <RelatedProductsCarousel :products="related" />
    </div>

    <section v-if="product" class="container product-consult-section">
      <div class="product-consult-bar">
        <div class="product-consult-copy">
          <i
            class="fa-regular fa-comments product-consult-icon"
            aria-hidden="true"
          />
          <div>
            <h3 class="product-consult-title">Cần tư vấn thêm về sản phẩm?</h3>
            <p class="product-consult-text">
              Đội ngũ {{ BRAND_NAME }} luôn sẵn sàng hỗ trợ bạn lựa chọn sản phẩm phù
              hợp nhất.
            </p>
          </div>
        </div>
        <div class="product-consult-links">
          <a
            v-if="zaloUrl"
            :href="zaloUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="product-consult-link"
          >
            <i class="fa-solid fa-phone" aria-hidden="true" />
            Zalo
            <span class="product-consult-hint">Chat ngay</span>
          </a>
          <a
            v-if="facebookUrl"
            :href="facebookUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="product-consult-link"
          >
            <i class="fa-brands fa-facebook-messenger" aria-hidden="true" />
            Messenger
            <span class="product-consult-hint">Chat ngay</span>
          </a>
          <a :href="telHref" class="product-consult-link">
            <i class="fa-solid fa-phone-volume" aria-hidden="true" />
            Hotline
            <span class="product-consult-phone">{{ phoneDisplay }}</span>
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'ProductView' })

import { computed } from "vue";
import { RouterLink } from "vue-router";
import RelatedProductsCarousel from "@/components/product/RelatedProductsCarousel.vue";
import NotFoundView from "@/views/NotFoundView.vue";
import ProductGallery from "@/components/product/ProductGallery.vue";
import ProductInfo from "@/components/product/ProductInfo.vue";
import ErrorState from "@/components/common/ErrorState.vue";
import ProductDetailSkeleton from "@/components/skeleton/ProductDetailSkeleton.vue";
import RichHtmlContent from "@/components/common/RichHtmlContent.vue";
import { isRichTextEmpty } from "@/utils/richText";
import { useProductData } from "@/composables/product/useProductData";
import { useContactInfo } from "@/composables/common/useContactInfo";
import { BRAND_NAME } from "@/constants/brand";
import { PRODUCT_TRUST_ITEMS } from "@/constants/product-page";

const {
  product,
  related,
  loading,
  error,
  isNotFound,
  selectedIndex,
  galleryImages,
  currentImage,
  breadcrumb,
  setSelectedImage,
} = useProductData();

const { phoneDisplay, phoneTel: telHref, facebookUrl, zaloUrl } = useContactInfo();

const hasRichDescription = computed(
  () => product.value != null && !isRichTextEmpty(product.value.description),
);

function galleryPrev() {
  const n = galleryImages.value.length;
  if (n <= 1) return;
  setSelectedImage((selectedIndex.value - 1 + n) % n);
}

function galleryNext() {
  const n = galleryImages.value.length;
  if (n <= 1) return;
  setSelectedImage((selectedIndex.value + 1) % n);
}

</script>

<style scoped>
.product-page {
  padding-bottom: 3rem;
  background: #faf9f6;
}

.product-breadcrumb {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  padding: 1.5rem 0 0.5rem;
  font-size: 0.6875rem;
  color: var(--color-text-light);
}

.product-breadcrumb-link {
  color: inherit;
  text-decoration: none;
  transition: color var(--transition-fast);
}

.product-breadcrumb-link:hover {
  color: var(--color-primary);
}

.product-breadcrumb-sep {
  font-size: 0.4375rem;
  opacity: 0.7;
}

.product-breadcrumb-current {
  color: var(--color-text-muted);
}

.product-main {
  padding: 1rem 0 0.5rem;
}

.product-detail {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.5rem;
  align-items: start;
}

@media (min-width: 1024px) {
  .product-detail {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 2.5rem;
  }
}

.product-description-section {
  margin-top: 2.5rem;
  padding: 2rem;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 0.25rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
}

.product-description-title {
  font-family: var(--font-serif);
  font-size: 1.375rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1.25rem;
}

.product-trust-section {
  padding: 1rem 0;
}

.product-trust-bar {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 0.25rem;
  padding: 1.25rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
}

@media (min-width: 640px) {
  .product-trust-bar {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .product-trust-bar {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

.product-trust-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding-right: 0.5rem;
}

@media (min-width: 1024px) {
  .product-trust-item:not(:last-child) {
    border-right: 1px solid rgba(0, 0, 0, 0.06);
  }
}

.product-trust-icon {
  font-size: 1rem;
  color: var(--color-primary);
  flex-shrink: 0;
}

.product-trust-title {
  font-size: 0.6875rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 0.125rem;
}

.product-trust-desc {
  font-size: 0.625rem;
  color: var(--color-text-light);
  margin: 0;
}

.product-related-wrap {
  padding-bottom: 0.25rem;
}

.product-consult-section {
  padding: 0 0 1rem;
}

.product-consult-bar {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 1.5rem;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 0.25rem;
  padding: 1.25rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
}

@media (min-width: 768px) {
  .product-consult-bar {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

.product-consult-copy {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.product-consult-icon {
  font-size: 1.5rem;
  color: var(--color-primary);
  flex-shrink: 0;
}

.product-consult-title {
  font-size: 0.75rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 0.25rem;
}

.product-consult-text {
  font-size: 0.6875rem;
  color: var(--color-text-light);
  margin: 0;
  max-width: 22rem;
}

.product-consult-links {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem 1.5rem;
  align-items: center;
  justify-content: flex-start;
}

@media (min-width: 768px) {
  .product-consult-links {
    justify-content: flex-end;
  }
}

.product-consult-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #374151;
  text-decoration: none;
  transition: color var(--transition-fast);
}

.product-consult-link:hover {
  color: var(--color-primary);
}

.product-consult-hint {
  font-weight: 400;
  color: var(--color-text-light);
  font-size: 0.6875rem;
}

.product-consult-phone {
  font-weight: 700;
  color: #111827;
  font-size: 0.6875rem;
}
</style>
