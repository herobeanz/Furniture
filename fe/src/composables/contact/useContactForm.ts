import { ref, reactive } from 'vue'
import { inquiryApi } from '@/services/api/inquiries'
import { useToast } from '@/composables/useToast'
import { extractErrorMessage } from '@/utils/error'
import { useContactInfo } from '@/composables/common/useContactInfo'
import { CONTACT_TOPICS } from '@/constants/contact'

/**
 * Composable for Contact form logic
 */
export function useContactForm() {
  const { toast } = useToast()

  const form = reactive({
    name: '',
    phone: '',
    email: '',
    topic: '',
    message: '',
  })

  const sending = ref(false)
  const submitMessage = ref('')
  const submitError = ref(false)

  const { facebookUrl, zaloUrl, hasSocialLinks } = useContactInfo()

  async function submit(source: 'contact' | 'product' = 'contact', productId?: number) {
    sending.value = true
    submitMessage.value = ''
    submitError.value = false
    try {
      const topicLabel = CONTACT_TOPICS.find((t) => t.value === form.topic)?.label
      const topicLine =
        form.topic && topicLabel && topicLabel !== 'Chọn chủ đề'
          ? `[Chủ đề: ${topicLabel}]\n\n`
          : ''

      await inquiryApi.create({
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email?.trim() || undefined,
        message: `${topicLine}${form.message.trim()}`,
        source,
        productId,
      })
      submitMessage.value = 'Đã gửi yêu cầu thành công. Chúng tôi sẽ liên hệ bạn sớm.'
      toast.success('Đã gửi thành công', 'Chúng tôi sẽ liên hệ bạn sớm.')
      // Reset form
      form.name = ''
      form.phone = ''
      form.email = ''
      form.topic = ''
      form.message = ''
      return true
    } catch (e: any) {
      submitError.value = true
      const msg = extractErrorMessage(e, 'Gửi thất bại. Vui lòng thử lại.')
      submitMessage.value = msg
      toast.error('Gửi thất bại', msg)
      return false
    } finally {
      sending.value = false
    }
  }

  function reset() {
    form.name = ''
    form.phone = ''
    form.email = ''
    form.topic = ''
    form.message = ''
    submitMessage.value = ''
    submitError.value = false
  }

  return {
    form,
    sending,
    submitMessage,
    submitError,
    facebookUrl,
    zaloUrl,
    hasSocialLinks,
    submit,
    reset,
  }
}
