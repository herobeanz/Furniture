<template>
  <div>
    <LoadingState v-if="loading" />
    <ErrorState v-else-if="error" :message="error" />
    <slot v-else />
  </div>
</template>

<script setup lang="ts">
import LoadingState from './LoadingState.vue'
import ErrorState from './ErrorState.vue'

interface Props {
  loading?: boolean
  error?: string | null
}

withDefaults(defineProps<Props>(), {
  loading: false,
  error: null,
})
</script>
