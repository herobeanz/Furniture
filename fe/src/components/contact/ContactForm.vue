<template>
  <form class="contact-form" @submit.prevent="$emit('submit')">
    <div class="contact-form-grid">
      <input
        v-model="form.name"
        type="text"
        class="contact-field"
        placeholder="Họ và tên *"
        required
        autocomplete="name"
      />
      <PhoneInput
        v-model="form.phone"
        placeholder="Số điện thoại *"
        :required="true"
      />
    </div>

    <EmailInput
      v-model="form.email"
      placeholder="Email"
    />

    <div class="contact-field-group">
      <label for="contact-topic" class="contact-label">Chủ đề</label>
      <select id="contact-topic" v-model="form.topic" class="contact-field contact-select">
        <option v-for="opt in topics" :key="opt.value" :value="opt.value">
          {{ opt.label }}
        </option>
      </select>
    </div>

    <div class="contact-field-group">
      <label for="contact-message" class="contact-label">Nội dung tin nhắn *</label>
      <textarea
        id="contact-message"
        v-model="form.message"
        class="contact-field contact-textarea"
        rows="4"
        placeholder="Nhập nội dung bạn cần tư vấn..."
        required
      />
    </div>

    <button type="submit" class="contact-submit" :disabled="sending">
      {{ sending ? 'Đang gửi...' : 'Gửi tin nhắn' }}
      <i class="fa-regular fa-paper-plane" aria-hidden="true" />
    </button>

    <p
      v-if="submitMessage"
      class="contact-form-message"
      :class="{ 'contact-form-message--error': submitError }"
    >
      {{ submitMessage }}
    </p>
  </form>
</template>

<script setup lang="ts">
import { CONTACT_TOPICS } from '@/constants/contact'
import { PhoneInput, EmailInput } from '@/components/ui/inputs'

interface Props {
  form: {
    name: string
    phone: string
    email: string
    topic: string
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

const topics = CONTACT_TOPICS
</script>

<style scoped>
.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.contact-form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 640px) {
  .contact-form-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.contact-field-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.contact-label {
  font-size: 0.6875rem;
  font-weight: 500;
  color: var(--color-text-light);
}

.contact-field {
  width: 100%;
  background: rgba(249, 250, 251, 0.5);
  border: 1px solid var(--color-border);
  border-radius: 0.375rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.75rem;
  font-family: inherit;
  color: var(--color-heading);
  transition: border-color var(--transition-fast);
}

.contact-field::placeholder {
  color: var(--color-text-light);
}

.contact-field:focus {
  outline: none;
  border-color: var(--color-primary);
}

.contact-select {
  color: var(--color-text-muted);
}

.contact-textarea {
  resize: vertical;
  min-height: 6rem;
}

.contact-submit {
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: var(--color-primary);
  color: #fff;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  cursor: pointer;
  transition: background var(--transition-fast);
}

.contact-submit:hover:not(:disabled) {
  background: var(--color-primary-hover);
}

.contact-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.contact-submit i {
  font-size: var(--icon-size-xs);
  line-height: 1;
}

.contact-form-message {
  margin: 0;
  font-size: 0.75rem;
  color: #15803d;
}

.contact-form-message--error {
  color: var(--color-primary);
}
</style>
