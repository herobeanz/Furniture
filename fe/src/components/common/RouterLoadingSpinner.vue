<template>
  <Teleport to="body">
    <Transition name="router-loading">
      <div v-if="isLoading" class="router-loading-overlay">
        <div class="router-loading-spinner">
          <div class="spinner"></div>
          <p v-if="loadingMessage" class="loading-message">{{ loadingMessage }}</p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useRouterLoadingStore } from '@/stores/routerLoading'

const routerLoadingStore = useRouterLoadingStore()
const { isLoading, loadingMessage } = storeToRefs(routerLoadingStore)
</script>

<style scoped>
.router-loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  pointer-events: none;
}

.router-loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid var(--color-bg-alt);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.loading-message {
  font-size: var(--fs-body-sm);
  color: var(--color-text-muted);
  margin: 0;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.router-loading-enter-active,
.router-loading-leave-active {
  transition: opacity 0.2s ease;
}

.router-loading-enter-from,
.router-loading-leave-to {
  opacity: 0;
}
</style>
