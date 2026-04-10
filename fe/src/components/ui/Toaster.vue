<template>
  <Teleport to="body">
    <div class="toaster" aria-live="polite">
      <TransitionGroup name="toast-list" tag="div" class="toaster-list">
        <Toast
          v-for="t in toasts"
          :key="t.id"
          :id="t.id"
          :title="t.title"
          :description="t.description"
          :variant="t.variant"
          :duration="t.duration"
          @close="remove(t.id)"
        />
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useToastStore } from '@/stores/toast'
import Toast from './Toast.vue'

const toastStore = useToastStore()
const { toasts } = storeToRefs(toastStore)

function remove(id: string) {
  toastStore.remove(id)
}
</script>

<style scoped>
.toaster {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 9999;
  pointer-events: none;
}

.toaster-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  pointer-events: auto;
}

.toast-list-enter-active,
.toast-list-leave-active {
  transition: all 0.25s ease;
}

.toast-list-enter-from,
.toast-list-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.toast-list-move {
  transition: transform 0.25s ease;
}
</style>
