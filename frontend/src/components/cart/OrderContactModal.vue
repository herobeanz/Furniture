<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="modal-overlay" @click.self="close">
        <div class="modal-content">
          <div class="modal-header">
            <h2>Liên hệ đặt hàng</h2>
            <button type="button" class="modal-close" @click="close" aria-label="Đóng">
              ×
            </button>
          </div>
          <div class="modal-body">
            <p class="modal-description">Chọn phương thức liên hệ để đặt hàng:</p>
            <div class="contact-options">
              <a
                :href="phoneLink"
                class="contact-option contact-option-phone"
                @click="handlePhoneClick"
              >
                <div class="option-icon">📞</div>
                <div class="option-content">
                  <h3>Gọi điện trực tiếp</h3>
                  <p>{{ phoneNumber }}</p>
                </div>
              </a>
              <a
                v-if="facebookUrl"
                :href="facebookLink"
                target="_blank"
                rel="noopener noreferrer"
                class="contact-option contact-option-facebook"
                @click="handleFacebookClick"
              >
                <div class="option-icon">💬</div>
                <div class="option-content">
                  <h3>Liên hệ qua Facebook</h3>
                  <p>Nhắn tin qua Facebook Messenger</p>
                </div>
              </a>
              <a
                v-if="zaloUrl"
                :href="zaloLink"
                target="_blank"
                rel="noopener noreferrer"
                class="contact-option contact-option-zalo"
                @click="handleZaloClick"
              >
                <div class="option-icon">💙</div>
                <div class="option-content">
                  <h3>Liên hệ qua Zalo</h3>
                  <p>Nhắn tin qua Zalo</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  isOpen: boolean
  phoneNumber?: string
  facebookUrl?: string
  zaloUrl?: string
  cartMessage?: string
}

const props = withDefaults(defineProps<Props>(), {
  phoneNumber: '(024) 1234 5678',
  facebookUrl: '',
  zaloUrl: '',
  cartMessage: '',
})

const emit = defineEmits<{
  close: []
}>()

const phoneLink = computed(() => {
  // Remove spaces and format for tel: link
  const cleaned = props.phoneNumber.replace(/\s+/g, '').replace(/[()]/g, '')
  return `tel:${cleaned}`
})

const encodedCartMessage = computed(() => {
  return props.cartMessage ? encodeURIComponent(props.cartMessage) : ''
})

const facebookLink = computed(() => {
  if (!props.facebookUrl) return ''
  if (!encodedCartMessage.value) return props.facebookUrl
  const sep = props.facebookUrl.includes('?') ? '&' : '?'
  return `${props.facebookUrl}${sep}ref=${encodedCartMessage.value}`
})

const zaloLink = computed(() => {
  if (!props.zaloUrl) return ''
  if (!encodedCartMessage.value) return props.zaloUrl
  const sep = props.zaloUrl.includes('?') ? '&' : '?'
  return `${props.zaloUrl}${sep}text=${encodedCartMessage.value}`
})

function close() {
  emit('close')
}

function handlePhoneClick() {
  close()
}

function handleFacebookClick() {
  close()
}

function handleZaloClick() {
  close()
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: #fff;
  border-radius: 8px;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--color-border);
}

.modal-header h2 {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  font-size: 2rem;
  line-height: 1;
  color: var(--color-text-muted);
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s;
}

.modal-close:hover {
  background: var(--color-bg-alt);
  color: var(--color-text);
}

.modal-body {
  padding: 1.5rem;
}

.modal-description {
  color: var(--color-text-muted);
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
}

.contact-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.contact-option {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  border: 2px solid var(--color-border);
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.2s;
  cursor: pointer;
}

.contact-option:hover {
  border-color: var(--color-primary);
  background: var(--color-bg-alt);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.option-icon {
  font-size: 2rem;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.option-content {
  flex: 1;
}

.option-content h3 {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.25rem;
  color: var(--color-text);
}

.option-content p {
  font-size: 0.875rem;
  margin: 0;
  color: var(--color-text-muted);
}

.contact-option-phone:hover {
  border-color: #22c55e;
}

.contact-option-facebook:hover {
  border-color: #1877f2;
}

.contact-option-zalo:hover {
  border-color: #0068ff;
}

/* Modal transition */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.9) translateY(-20px);
  opacity: 0;
}

@media (max-width: 600px) {
  .modal-content {
    margin: 1rem;
    max-width: calc(100% - 2rem);
  }

  .modal-header,
  .modal-body {
    padding: 1rem;
  }

  .contact-option {
    padding: 1rem;
  }

  .option-icon {
    font-size: 1.5rem;
    width: 40px;
    height: 40px;
  }
}
</style>
