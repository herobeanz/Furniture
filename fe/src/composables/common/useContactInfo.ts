import { computed } from 'vue'
import {
  CONTACT_ADDRESS,
  CONTACT_ADDRESS_FULL,
  CONTACT_HOURS_SHORT,
  formatPhoneDisplay,
  phoneTelHref,
  SITE,
} from '@/constants/site'

/**
 * Thông tin liên hệ & MXH dùng chung toàn app (từ SITE / .env).
 */
export function useContactInfo() {
  const phoneNumber = computed(() => SITE.contact.phone)
  const email = computed(() => SITE.contact.email)
  const facebookUrl = computed(() => SITE.social.facebook || '')
  const messengerUrl = computed(() => SITE.social.messenger || '')
  const zaloUrl = computed(() => SITE.social.zalo || '')
  const tiktokUrl = computed(() => SITE.social.tiktok || '')
  const instagramUrl = computed(() => SITE.social.instagram || '')
  const youtubeUrl = computed(() => SITE.social.youtube || '')
  const mapUrl = computed(() => SITE.contact.mapUrl)
  const address = computed(() => CONTACT_ADDRESS)
  const addressFull = computed(() => CONTACT_ADDRESS_FULL)
  const hoursShort = computed(() => CONTACT_HOURS_SHORT)

  const phoneDisplay = computed(() => formatPhoneDisplay(phoneNumber.value))
  const phoneTel = computed(() => phoneTelHref(phoneNumber.value))

  const hasSocialLinks = computed(
    () =>
      !!(
        facebookUrl.value ||
        messengerUrl.value ||
        zaloUrl.value ||
        tiktokUrl.value ||
        instagramUrl.value ||
        youtubeUrl.value
      )
  )

  return {
    phoneNumber,
    phoneDisplay,
    phoneTel,
    email,
    facebookUrl,
    messengerUrl,
    zaloUrl,
    tiktokUrl,
    instagramUrl,
    youtubeUrl,
    mapUrl,
    address,
    addressFull,
    hoursShort,
    hasSocialLinks,
  }
}
