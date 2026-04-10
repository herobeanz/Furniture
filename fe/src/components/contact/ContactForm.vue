<template>
  <form class="contact-form" @submit.prevent="$emit('submit')">
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
</template>

<script setup lang="ts">
import { UiInput, UiButton } from '@/components/ui'

interface Props {
  form: {
    name: string
    phone: string
    email: string
    message: string
  }
  sending: boolean
  submitMessage: string
  submitError: boolean
}

defineProps<Props>()

defineEmits<{
  submit: []
}>()
</script>

<style scoped>
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
</style>
