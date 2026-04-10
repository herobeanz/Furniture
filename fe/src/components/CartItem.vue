<template>
  <div class="cart-item">
    <div class="cart-item-image">
      <RouterLink :to="productLink">
        <img v-if="item.image" :src="item.image" :alt="item.name" />
        <div v-else class="no-img">Ảnh</div>
      </RouterLink>
    </div>
    <div class="cart-item-info">
      <RouterLink :to="productLink" class="cart-item-name">{{ item.name }}</RouterLink>
      <p class="cart-item-price">{{ formatPrice(item.price) }} × {{ item.quantity }}</p>
    </div>
    <div class="cart-item-actions">
      <div class="qty-wrap">
        <button type="button" aria-label="Giảm số lượng" @click="emit('updateQuantity', item.quantity - 1)">−</button>
        <span>{{ item.quantity }}</span>
        <button type="button" aria-label="Tăng số lượng" @click="emit('updateQuantity', item.quantity + 1)">+</button>
      </div>
      <button type="button" class="remove-btn" @click="emit('remove')">Xóa</button>
    </div>
    <div class="cart-item-total">{{ formatPrice(item.price * item.quantity) }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import type { CartItem as CartItemType } from '@/stores/cart'
import { formatPrice } from '@/utils/format'
import { getProductPath } from '@/utils/navigation'

const props = defineProps<{
  item: CartItemType
}>()

const emit = defineEmits<{
  remove: []
  updateQuantity: [quantity: number]
}>()

const productLink = computed(() => getProductPath(props.item))
</script>

<style scoped>
.cart-item {
  display: grid;
  grid-template-columns: 80px 1fr auto auto;
  gap: 1rem;
  align-items: center;
  padding: 1rem;
  background: var(--color-bg-alt);
  border-radius: 8px;
}
.cart-item-image {
  width: 80px;
  height: 80px;
  border-radius: 6px;
  overflow: hidden;
  background: #fff;
}
.cart-item-image a {
  display: block;
  width: 100%;
  height: 100%;
}
.cart-item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.no-img {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  color: #999;
}
.cart-item-name {
  font-weight: 600;
  color: #1a1a1a;
}
.cart-item-name:hover {
  color: var(--color-primary);
}
.cart-item-price {
  margin-top: 0.25rem;
  font-size: 0.9rem;
  color: var(--color-text-muted);
}
.qty-wrap {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.qty-wrap button {
  width: 28px;
  height: 28px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  font-size: 1rem;
  line-height: 1;
  background: #fff;
  cursor: pointer;
}
.qty-wrap button:hover {
  background: var(--color-bg-alt);
  border-color: var(--color-primary);
}
.remove-btn {
  margin-top: 0.5rem;
  font-size: 0.8rem;
  color: var(--color-primary);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}
.remove-btn:hover {
  text-decoration: underline;
}
.cart-item-total {
  font-weight: 600;
  color: var(--color-primary);
}

@media (max-width: 600px) {
  .cart-item {
    grid-template-columns: 60px 1fr;
    grid-template-rows: auto auto;
  }
  .cart-item-actions {
    grid-column: 1 / -1;
  }
  .cart-item-total {
    grid-column: 2;
    grid-row: 1;
    text-align: right;
  }
}
</style>
