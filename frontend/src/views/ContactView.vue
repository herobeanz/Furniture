<template>
  <div class="contact-page container">
    <h1>Liên hệ</h1>
    <p class="contact-intro">Gửi yêu cầu tư vấn hoặc báo giá. Chúng tôi sẽ phản hồi trong thời gian sớm nhất.</p>

    <!-- Cart summary khi từ giỏ hàng -->
    <section v-if="fromCart && cartItems.length > 0" class="cart-summary">
      <h2>Đơn hàng của bạn ({{ cartItems.length }} sản phẩm)</h2>
      <ul class="cart-summary-list">
        <li v-for="item in cartItems" :key="item.id" class="cart-summary-item">
          <span class="item-name">{{ item.name }}</span>
          <span class="item-qty">× {{ item.quantity }}</span>
          <span class="item-price">{{ formatPrice(item.price * item.quantity) }}</span>
        </li>
      </ul>
      <p class="cart-summary-total">Tổng: <strong>{{ formatPrice(cartTotal) }}</strong></p>
    </section>

    <form class="contact-form" @submit.prevent="onSubmit">
      <UiInput
        v-model="form.name"
        label="Họ tên"
        placeholder="Nhập họ tên"
        required
      />
      <UiInput
        v-model="form.phone"
        label="Số điện thoại"
        type="tel"
        placeholder="Nhập SĐT"
        required
      />
      <UiInput
        v-model="form.email"
        label="Email"
        type="email"
        placeholder="email@example.com"
      />
      <div class="form-group">
        <label for="contact-message">Nội dung</label>
        <textarea
          id="contact-message"
          v-model="form.message"
          placeholder="Nội dung yêu cầu..."
          rows="5"
          required
        />
      </div>
      <UiButton type="submit" :disabled="sending">
        {{ sending ? 'Đang gửi...' : 'Gửi yêu cầu' }}
      </UiButton>
      <p v-if="submitMessage" class="form-message" :class="{ error: submitError }">
        {{ submitMessage }}
      </p>
    </form>

    <!-- Social: Messenger, Zalo -->
    <div v-if="hasSocialLinks" class="social-section">
      <h2>Liên hệ nhanh</h2>
      <div class="social-buttons">
        <a
          v-if="facebookUrl"
          :href="facebookUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="btn btn-social btn-facebook"
        >
          Facebook Messenger
        </a>
        <a
          v-if="zaloUrl"
          :href="zaloUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="btn btn-social btn-zalo"
        >
          Zalo
        </a>
      </div>
    </div>

    <div class="contact-info">
      <h2>Thông tin liên hệ</h2>
      <p>Hotline: (024) 1234 5678</p>
      <p>Email: support@furniture-store.vn</p>
      <p>Giờ làm việc: Thứ 2 - Thứ 6, 8:00 - 21:00</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRoute } from 'vue-router'
import { UiInput, UiButton } from '@/components/ui'
import { inquiryService } from '@/services/inquiry.service'
import { useCart } from '@/composables/useCart'
import { useTrackingStore } from '@/stores/tracking'
import { useToast } from '@/composables/useToast'
import { formatPrice } from '@/utils/format'

const route = useRoute()
const { toast } = useToast()
const { items: cartItems, totalPrice: cartTotal } = useCart()
const trackingStore = useTrackingStore()

const fromCart = computed(() => route.query.from === 'cart')

const form = reactive({
  name: '',
  phone: '',
  email: '',
  message: '',
})

const sending = ref(false)
const submitMessage = ref('')
const submitError = ref(false)

const facebookUrl = import.meta.env.VITE_FACEBOOK_URL || ''
const zaloUrl = import.meta.env.VITE_ZALO_URL || ''
const hasSocialLinks = computed(() => !!(facebookUrl || zaloUrl))

async function onSubmit() {
  sending.value = true
  submitMessage.value = ''
  submitError.value = false
  try {
    await inquiryService.create({
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email?.trim() || undefined,
      message: form.message.trim(),
      productIds: fromCart.value ? cartItems.value.map((i) => i.id) : undefined,
      anonymousId: trackingStore.getAnonymousId(),
      source: fromCart.value ? 'cart_checkout' : 'contact_page',
    })
    submitMessage.value = 'Đã gửi yêu cầu thành công. Chúng tôi sẽ liên hệ bạn sớm.'
    toast.success('Đã gửi thành công', 'Chúng tôi sẽ liên hệ bạn sớm.')
    form.name = ''
    form.phone = ''
    form.email = ''
    form.message = ''
  } catch (e: any) {
    submitError.value = true
    const msg = e?.response?.data?.message || e?.response?.data?.details?.[0] || e?.message
    submitMessage.value = msg || 'Gửi thất bại. Vui lòng thử lại.'
    toast.error('Gửi thất bại', msg || 'Vui lòng thử lại.')
  } finally {
    sending.value = false
  }
}
</script>

<style scoped>
.contact-page {
  padding: 2rem 1.5rem;
  max-width: 560px;
  margin: 0 auto;
}
.contact-page h1 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}
.contact-intro {
  color: var(--color-text-muted);
  margin-bottom: 2rem;
}

.cart-summary {
  background: var(--color-bg-alt);
  border-radius: 8px;
  padding: 1rem 1.25rem;
  margin-bottom: 1.5rem;
}
.cart-summary h2 {
  font-size: 1rem;
  margin-bottom: 0.75rem;
}
.cart-summary-list {
  list-style: none;
  padding: 0;
  margin: 0 0 0.5rem 0;
}
.cart-summary-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  padding: 0.25rem 0;
}
.item-name {
  flex: 1;
}
.item-qty {
  color: var(--color-text-muted);
}
.item-price {
  font-weight: 600;
  color: var(--color-primary);
}
.cart-summary-total {
  margin: 0;
  font-size: 1rem;
  padding-top: 0.5rem;
  border-top: 1px solid var(--color-border);
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-bottom: 2.5rem;
}
.form-group label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.35rem;
}
.form-group textarea {
  width: 100%;
  padding: 0.625rem 0.75rem;
  font-size: 1rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-family: inherit;
  resize: vertical;
}
.form-group textarea:focus {
  outline: none;
  border-color: var(--color-primary);
}
.form-message {
  margin: 0;
  font-size: 0.9rem;
  color: #0a0;
}
.form-message.error {
  color: var(--color-primary);
}

.social-section {
  margin-bottom: 2rem;
}
.social-section h2 {
  font-size: 1.1rem;
  margin-bottom: 0.75rem;
}
.social-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}
.btn-social {
  display: inline-flex;
  align-items: center;
  padding: 0.6rem 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  border-radius: 6px;
  text-decoration: none;
  transition: opacity 0.2s;
}
.btn-social:hover {
  opacity: 0.9;
}
.btn-facebook {
  background: #1877f2;
  color: #fff;
}
.btn-zalo {
  background: #0068ff;
  color: #fff;
}

.contact-info {
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-border);
}
.contact-info h2 {
  font-size: 1.1rem;
  margin-bottom: 0.75rem;
}
.contact-info p {
  margin-bottom: 0.35rem;
  color: var(--color-text-muted);
  font-size: 0.95rem;
}
</style>
