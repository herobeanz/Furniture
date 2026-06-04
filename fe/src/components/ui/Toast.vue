<template>
  <div
    class="toast"
    :class="[variant]"
    role="alert"
    @mouseenter="pause"
    @mouseleave="resume"
  >
    <div class="toast-icon" v-if="showIcon">
      <span v-if="variant === 'success'">✓</span>
      <span v-else-if="variant === 'error'">✕</span>
      <span v-else-if="variant === 'warning'">!</span>
    </div>
    <div class="toast-content">
      <p class="toast-title">{{ title }}</p>
      <p v-if="description" class="toast-description">{{ description }}</p>
    </div>
    <button
      type="button"
      class="toast-close"
      aria-label="Đóng"
      @click="close"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M18 6L6 18M6 6l12 12" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import type { ToastVariant } from '@/stores/toast'

const props = withDefaults(
  defineProps<{
    id: string
    title: string
    description?: string
    variant?: ToastVariant
    duration?: number
  }>(),
  { variant: 'default' }
)

const emit = defineEmits<{ close: [] }>()

const showIcon = ref(props.variant !== 'default')
let timer: ReturnType<typeof setTimeout> | null = null

function close() {
  emit('close')
}

function startTimer() {
  if (props.duration && props.duration > 0) {
    timer = setTimeout(close, props.duration)
  }
}

function pause() {
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
}

function resume() {
  startTimer()
}

onMounted(() => {
  startTimer()
})

onUnmounted(() => {
  if (timer) clearTimeout(timer)
})
</script>

<style scoped>
.toast {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  border-radius: 8px;
  border: 1px solid var(--toast-border, #e5e7eb);
  background: var(--toast-bg, #fff);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 320px;
  max-width: 420px;
  animation: toast-in 0.25s ease-out;
}

@keyframes toast-in {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.toast-icon {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--fs-caption);
  font-weight: 700;
}

.toast.default .toast-icon {
  display: none;
}

.toast.success .toast-icon {
  background: #dcfce7;
  color: #166534;
}

.toast.error .toast-icon {
  background: #fee2e2;
  color: #b91c1c;
}

.toast.warning .toast-icon {
  background: #fef3c7;
  color: #b45309;
}

.toast-content {
  flex: 1;
  min-width: 0;
}

.toast-title {
  font-size: var(--fs-body-sm);
  font-weight: 600;
  color: var(--color-text);
  margin: 0;
  line-height: 1.4;
}

.toast-description {
  font-size: var(--fs-body-sm);
  color: var(--color-text-muted);
  margin: 0.25rem 0 0 0;
  line-height: 1.4;
}

.toast-close {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  color: var(--color-text-muted);
  background: transparent;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.toast-close:hover {
  background: var(--color-bg-alt);
  color: var(--color-text);
}
</style>
