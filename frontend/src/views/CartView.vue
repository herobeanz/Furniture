<template>
  <div class="cart-page container">
    <h1>Giỏ hàng</h1>
    <div v-if="items.length === 0" class="empty">
      <p>Giỏ hàng trống.</p>
      <RouterLink to="/" class="btn btn-primary">Tiếp tục mua sắm</RouterLink>
    </div>
    <template v-else>
      <div class="cart-list">
        <CartItem
          v-for="item in items"
          :key="item.id"
          :item="item"
          @remove="removeItem(item.id)"
          @update-quantity="(qty) => updateQuantity(item.id, qty)"
        />
      </div>
      <div class="cart-footer">
        <p class="cart-total">Tổng: <strong>{{ formatPrice(totalPrice) }}</strong></p>
        <p class="cart-note">Thanh toán và giao hàng sẽ được xử lý ở bước tiếp theo.</p>
        <RouterLink to="/lien-he?from=cart" class="btn btn-primary btn-checkout">
          Thanh toán / Liên hệ đặt hàng
        </RouterLink>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import CartItem from '@/components/CartItem.vue'
import { useCart } from '@/composables/useCart'
import { formatPrice } from '@/utils/format'

const { items, totalPrice, updateQuantity, removeItem } = useCart()
</script>

<style scoped>
.cart-page {
  padding: 2rem 1.5rem;
  max-width: 900px;
  margin: 0 auto;
}
.cart-page h1 {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
}
.empty {
  text-align: center;
  padding: 3rem;
}
.empty p {
  margin-bottom: 1rem;
  color: var(--color-text-muted);
}
.cart-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.cart-footer {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-border);
}
.cart-total {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
}
.cart-note {
  font-size: 0.875rem;
  color: var(--color-text-muted);
  margin-bottom: 1rem;
}
.btn-checkout {
  display: inline-block;
  margin-top: 0.5rem;
}
</style>
