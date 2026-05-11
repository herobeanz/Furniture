import { ref, reactive } from 'vue'
import { inquiryApi } from '@/services/api/inquiries'
import { useToast } from '@/composables/useToast'
import { extractErrorMessage } from '@/utils/error'
import { useContactInfo } from '@/composables/common/useContactInfo'

/**
 * Composable for Contact form logic
 */
export function useContactForm() {
  const { toast } = useToast()

  const form = reactive({
    name: '',
    phone: '',
    email: '',
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
      await inquiryApi.create({
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email?.trim() || undefined,
        message: form.message.trim(),
        source,
        productId,
      })
      submitMessage.value = 'Đã gửi yêu cầu thành công. Chúng tôi sẽ liên hệ bạn sớm.'
      toast.success('Đã gửi thành công', 'Chúng tôi sẽ liên hệ bạn sớm.')
      // Reset form
      form.name = ''
      form.phone = ''
      form.email = ''
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
