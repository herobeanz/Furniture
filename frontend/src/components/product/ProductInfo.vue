<template>
  <div class="product-info">
    <h1 class="product-name">{{ product.name }}</h1>
    <div class="product-prices">
      <span class="price-current">{{ formatPrice(product.price) }}</span>
      <span v-if="product.salePrice" class="price-old">
        {{ formatPrice(product.salePrice) }}
      </span>
      <span v-if="product.salePrice" class="sale-badge">Sale</span>
    </div>
    
    <ProductDetails :product="product" />
    
    <p v-if="product.description" class="product-desc">
      {{ product.description }}
    </p>

    <div class="add-to-cart-form">
      <div class="quantity-wrap">
        <label for="qty">Số lượng:</label>
        <input
          id="qty"
          :value="quantity"
          type="number"
          min="1"
          max="99"
          class="qty-input"
          @input="$emit('updateQuantity', Number(($event.target as HTMLInputElement).value))"
        />
      </div>
      <button type="button" class="btn btn-primary btn-add-cart" @click="$emit('addToCart')">
        Thêm vào giỏ hàng
      </button>
      <button
        type="button"
        class="btn btn-outline btn-wishlist"
        :class="{ active: inWishlist }"
        @click="$emit('toggleWishlist')"
        title="Yêu thích"
      >
        ♥ Yêu thích
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '@/services/product.service'
import { formatPrice } from '@/utils/format'
import ProductDetails from './ProductDetails.vue'

interface Props {
  product: Product
  quantity: number
  inWishlist: boolean
}

defineProps<Props>()

defineEmits<{
  addToCart: []
  toggleWishlist: []
  updateQuantity: [quantity: number]
}>()
</script>

<style scoped>
.product-info {
  min-width: 0;
}
.product-name {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  line-height: 1.3;
}
.product-prices {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}
.price-current {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-primary);
}
.price-old {
  font-size: 1rem;
  color: #999;
  text-decoration: line-through;
}
.sale-badge {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.2rem 0.5rem;
  background: var(--color-primary);
  color: #fff;
  border-radius: 4px;
}
.product-desc {
  color: var(--color-text-muted);
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  white-space: pre-wrap;
}
.add-to-cart-form {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
}
.quantity-wrap {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.quantity-wrap label {
  font-size: 0.9rem;
  color: var(--color-text-muted);
}
.qty-input {
  width: 4rem;
  padding: 0.5rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: 1rem;
  text-align: center;
}
.btn-add-cart {
  padding: 0.75rem 1.5rem;
}
.btn-wishlist.active {
  color: var(--color-primary);
  border-color: var(--color-primary);
}
</style>
