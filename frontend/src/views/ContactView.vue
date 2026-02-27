<template>
  <div class="contact-page container">
    <h1>Liên hệ</h1>
    <p class="contact-intro">Gửi yêu cầu tư vấn hoặc báo giá. Chúng tôi sẽ phản hồi trong thời gian sớm nhất.</p>

    <ContactForm
      :form="form"
      :sending="sending"
      :submit-message="submitMessage"
      :submit-error="submitError"
      @submit="handleSubmit"
    />

    <SocialLinks
      :facebook-url="facebookUrl"
      :zalo-url="zaloUrl"
      :has-social-links="hasSocialLinks"
    />

    <div class="contact-info">
      <h2>Thông tin liên hệ</h2>
      <p>Hotline: {{ phoneNumber }}</p>
      <p>Email: {{ email }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import ContactForm from '@/components/contact/ContactForm.vue'
import SocialLinks from '@/components/contact/SocialLinks.vue'
import { useContactForm } from '@/composables/contact/useContactForm'
import { useContactInfo } from '@/composables/common/useContactInfo'

// Container component: orchestrates data and logic
const {
  form,
  sending,
  submitMessage,
  submitError,
  facebookUrl,
  zaloUrl,
  hasSocialLinks,
  submit,
} = useContactForm()

const { phoneNumber, email } = useContactInfo()

async function handleSubmit() {
  await submit('contact')
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
