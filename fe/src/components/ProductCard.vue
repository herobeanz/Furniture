<template>
  <article
    class="product-card"
    :class="{ 'product-card--compact': variant === 'compact' }"
  >
    <RouterLink :to="getProductPath(product)" class="product-card-image">
      <img
        v-if="cardImage"
        :src="cardImageSrc"
        :srcset="cardImageSrcSet"
        :sizes="IMAGE_SIZES.productCard"
        :alt="product.name"
        loading="lazy"
        decoding="async"
      />
      <div v-else class="no-image">Ảnh</div>
      <!-- <span v-if="showSaleTag && hasDiscount" class="tag sale">SALE CỰC SỐC</span> -->
      <!-- <span v-if="showSaleTag && hasDiscount" class="tag discount">{{ discountPercentage }}%</span> -->
      <span v-if="showHotTag" class="tag hot">HOT</span>
      <div class="product-quickview-overlay">
        <span class="product-quickview-label">Xem chi tiết</span>
      </div>
    </RouterLink>
    <div class="product-card-info">
      <div v-if="variant !== 'compact' && product.sku" class="product-code">
        MÃ: {{ product.sku }}
      </div>
      <RouterLink :to="getProductPath(product)" class="product-card-name">{{
        product.name
      }}</RouterLink>
      <p
        v-if="
          variant === 'compact' &&
          (product.material || product.shortDescription)
        "
        class="product-card-subtitle"
      >
        {{ product.material || product.shortDescription }}
      </p>
      <div class="product-card-prices">
        <span v-if="product.isContactPrice" class="price-contact">Liên hệ</span>
        <template v-else>
          <span v-if="hasDiscount" class="price-current">{{
            formatPrice(product.salePrice!)
          }}</span>
          <span v-if="hasDiscount" class="price-old">{{
            formatPrice(product.price)
          }}</span>
          <span v-else class="price-current">{{
            formatPrice(product.price)
          }}</span>
        </template>
      </div>
      <RouterLink
        v-if="variant === 'compact'"
        :to="getProductPath(product)"
        class="product-card-arrow"
        aria-label="Xem chi tiết"
      >
        <i class="fa-solid fa-arrow-right" aria-hidden="true" />
      </RouterLink>
      <div v-if="variant !== 'compact'" class="product-meta-row">
        <div class="product-meta sold">
          <span class="meta-icon bag">🛍️</span>
          <span class="meta-text">
            Đã bán: {{ (product.soldCount ?? 0).toLocaleString("vi-VN") }}+
          </span>
        </div>
        <div class="product-meta rating" v-if="product.rating != null">
          <span class="meta-icon star">⭐</span>
          <span class="meta-text"> {{ product.rating.toFixed(1) }}/5 </span>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Product } from "@/services/api/products";
import { formatPrice } from "@/utils/format";
import { resolveMediaUrl } from "@/utils/mediaUrl";
import {
  buildResponsiveSrcSet,
  IMAGE_SIZES,
  IMAGE_WIDTHS,
  optimizeImageUrl,
} from "@/utils/imageUrl";
import { getProductDisplayImage } from "@/utils/productGallery";
import { getProductPath } from "@/utils/navigation";

const props = withDefaults(
  defineProps<{
    product: Product;
    showSaleTag?: boolean;
    showHotTag?: boolean;
    variant?: "default" | "compact";
  }>(),
  { showSaleTag: true, showHotTag: false, variant: "default" },
);

const cardImage = computed(() =>
  getProductDisplayImage(props.product.thumbnail, props.product.images),
);

const cardImageBase = computed(() => resolveMediaUrl(cardImage.value));
const cardImageSrc = computed(() =>
  optimizeImageUrl(cardImageBase.value, { width: 480, quality: "auto" }),
);
const cardImageSrcSet = computed(() =>
  buildResponsiveSrcSet(cardImageBase.value, IMAGE_WIDTHS.card),
);

const hasDiscount = computed(() => {
  return (
    props.product.salePrice != null &&
    props.product.salePrice < props.product.price
  );
});
</script>

<style scoped>
.product-card {
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-slow);
  border: 1px solid var(--color-border-light);
  position: relative;
}

.product-card::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 16px;
  padding: 1px;
  background: linear-gradient(
    135deg,
    var(--color-primary-light),
    var(--color-accent)
  );
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity var(--transition-base);
}

.product-card:hover {
  box-shadow: var(--shadow-xl);
  transform: translateY(-8px);
}

.product-card:hover::before {
  opacity: 1;
}

.product-card--compact {
  border-radius: 0.5rem;
  background: rgba(249, 250, 251, 0.5);
  box-shadow: none;
}

.product-card--compact::before {
  display: none;
}

.product-card--compact:hover {
  transform: none;
  box-shadow: var(--shadow-sm);
}

.product-card--compact .product-card-image {
  aspect-ratio: auto;
  height: 10rem;
  margin: 0.75rem 0.75rem 0;
  border-radius: 0.375rem;
  background: #fff;
}

.product-card--compact .product-card-info {
  padding: 0.75rem;
  position: relative;
}

.product-card--compact .product-card-name {
  font-size: var(--fs-body-sm);
  margin-bottom: 0.25rem;
  -webkit-line-clamp: 1;
}

.product-card--compact .product-card-subtitle {
  margin: 0 0 0.25rem;
  font-size: var(--fs-caption);
  color: var(--color-text-light);
  line-height: 1.3;
  -webkit-line-clamp: 1;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-card--compact .product-card-prices {
  margin-bottom: 0;
}

.product-card--compact .price-current {
  font-size: var(--fs-body-sm);
}

.product-card--compact .product-quickview-overlay {
  display: none;
}

.product-card-arrow {
  position: absolute;
  right: 0.75rem;
  bottom: 0.75rem;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 9999px;
  border: 1px solid var(--color-border);
  background: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-muted);
  font-size: var(--icon-size-xs);
  text-decoration: none;
  transition:
    background 0.2s,
    color 0.2s,
    border-color 0.2s;
  box-shadow: var(--shadow-sm);
}

.product-card-arrow i {
  line-height: 1;
}

.product-card-arrow:hover {
  background: var(--color-primary);
  color: #fff;
  border-color: var(--color-primary);
}

.product-card-image {
  position: relative;
  display: block;
  aspect-ratio: 1;
  background: var(--color-bg-alt);
  overflow: hidden;
}

.product-card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-slow);
}

.product-card:hover .product-card-image img {
  transform: scale(1.08);
}

.no-image {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-light);
  font-size: var(--fs-body-sm);
  background: linear-gradient(135deg, #fafaf9 0%, #f5f5f4 100%);
}

.product-quickview-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  background: rgba(0, 0, 0, 0);
  pointer-events: none;
  transition: all var(--transition-base);
}

.product-card:hover .product-quickview-overlay {
  opacity: 1;
  background: rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(4px);
  pointer-events: auto;
}

.product-quickview-label {
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  background: #fff;
  color: var(--color-text);
  font-size: var(--fs-body);
  font-weight: 600;
  box-shadow: var(--shadow-lg);
  transform: translateY(8px);
  transition: all var(--transition-base);
  letter-spacing: 0.02em;
}

.product-card:hover .product-quickview-label {
  transform: translateY(0);
}

.tag {
  position: absolute;
  top: 12px;
  font-size: var(--fs-body-sm);
  font-weight: 700;
  padding: 0.375rem 0.75rem;
  border-radius: 8px;
  color: #fff;
  backdrop-filter: blur(8px);
  box-shadow: var(--shadow-md);
  z-index: 2;
  animation: tagPulse 2s ease-in-out infinite;
}

@keyframes tagPulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.tag.sale {
  background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
  left: 12px;
}

.tag.discount {
  background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
  right: 12px;
}

.tag.hot {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  right: 12px;
  animation: hotGlow 2s ease-in-out infinite;
}

@keyframes hotGlow {
  0%,
  100% {
    box-shadow: 0 0 10px rgba(245, 158, 11, 0.5);
  }
  50% {
    box-shadow: 0 0 20px rgba(245, 158, 11, 0.8);
  }
}

.product-card-info {
  padding: 1.25rem;
}

.product-code {
  font-size: var(--fs-body-sm);
  color: var(--color-text-muted);
  margin-bottom: 0.5rem;
  font-weight: 500;
  letter-spacing: 0.05em;
}

.product-card-name {
  display: block;
  font-weight: 600;
  font-size: var(--fs-body);
  margin-bottom: 0.75rem;
  color: var(--color-text);
  line-height: 1.5;
  transition: color var(--transition-fast);
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.product-card-name:hover {
  color: var(--color-primary);
}

.product-card-prices {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-bottom: 0.875rem;
}

.price-current {
  font-weight: 700;
  font-size: var(--fs-body-lg);
  color: var(--color-primary);
  letter-spacing: -0.01em;
}

.price-contact {
  font-weight: 700;
  font-size: var(--fs-body);
  color: var(--color-text);
  background: var(--color-bg-alt);
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
}

.price-old {
  font-size: var(--fs-body);
  color: var(--color-text-light);
  text-decoration: line-through;
  opacity: 0.7;
}

.product-meta-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--color-border-light);
}

.product-meta {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  color: var(--color-text-muted);
  font-size: var(--fs-body-sm);
  font-weight: 500;
}

.product-meta .meta-icon {
  font-size: var(--fs-body);
}

.product-meta.rating .meta-icon {
  color: #fbbf24;
}

.product-meta.sold .meta-icon {
  color: var(--color-primary-light);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .product-card {
    border-radius: 14px;
  }

  .product-card-info {
    padding: 1.125rem;
  }

  .product-card-name {
    font-size: var(--fs-body);
  }

  .price-current {
    font-size: var(--fs-body-lg);
  }
}

@media (max-width: 768px) {
  .product-card {
    border-radius: 12px;
  }

  .product-card-info {
    padding: 1rem;
  }

  .product-card-name {
    font-size: var(--fs-body);
    margin-bottom: 0.625rem;
  }

  .product-card-prices {
    margin-bottom: 0.75rem;
  }

  .price-current {
    font-size: var(--fs-body);
  }

  .price-old {
    font-size: var(--fs-body-sm);
  }

  .product-meta-row {
    padding-top: 0.625rem;
  }

  .product-meta {
    font-size: var(--fs-body-sm);
  }
}

@media (max-width: 480px) {
  .product-card {
    border-radius: 10px;
  }

  .product-card-info {
    padding: 0.875rem;
  }

  .product-code {
    font-size: var(--fs-body-sm);
    margin-bottom: 0.375rem;
  }

  .product-card-name {
    font-size: var(--fs-body-sm);
    line-height: 1.4;
    margin-bottom: 0.5rem;
  }

  .product-card-prices {
    gap: 0.5rem;
    margin-bottom: 0.625rem;
  }

  .price-current {
    font-size: var(--fs-body);
  }

  .price-contact {
    font-size: var(--fs-body-sm);
    padding: 0.1875rem 0.625rem;
  }

  .price-old {
    font-size: var(--fs-body-sm);
  }

  .tag {
    top: 8px;
    font-size: var(--fs-body-sm);
    padding: 0.25rem 0.5rem;
    border-radius: 6px;
  }

  .tag.sale,
  .tag.hot {
    left: 8px;
    right: 8px;
  }

  .product-quickview-label {
    padding: 0.625rem 1.25rem;
    font-size: var(--fs-body-sm);
  }

  .product-meta-row {
    padding-top: 0.5rem;
    gap: 0.5rem;
  }

  .product-meta {
    font-size: var(--fs-body-sm);
    gap: 0.25rem;
  }

  .product-meta .meta-icon {
    font-size: var(--fs-body-sm);
  }
}

/* Hover effects disabled on touch devices */
@media (hover: none) {
  .product-card:hover {
    transform: none;
  }

  .product-quickview-overlay {
    display: none;
  }
}
</style>
