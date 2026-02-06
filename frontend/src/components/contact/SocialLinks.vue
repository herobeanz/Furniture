<template>
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
</template>

<script setup lang="ts">
interface Props {
  facebookUrl: string
  zaloUrl: string
  hasSocialLinks: boolean
}

defineProps<Props>()
</script>

<style scoped>
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
</style>
