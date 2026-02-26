import { computed } from 'vue'

/**
 * Centralized contact & social info for the whole app
 * Reads from env, provides sensible defaults.
 */
export function useContactInfo() {
  const phoneNumber = computed(() => import.meta.env.VITE_CONTACT_PHONE || '0357803837')
  const email = computed(() => import.meta.env.VITE_CONTACT_EMAIL || 'support@dogohungcuong.vn')
  const facebookUrl = computed(() => import.meta.env.VITE_FACEBOOK_URL || '')
  const zaloUrl = computed(() => import.meta.env.VITE_ZALO_URL || '')

  const hasSocialLinks = computed(() => !!(facebookUrl.value || zaloUrl.value))

  return {
    phoneNumber,
    email,
    facebookUrl,
    zaloUrl,
    hasSocialLinks,
  }
}

