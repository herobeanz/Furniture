export type InquiryStatusKey = 'new' | 'contacted' | 'done'

export const INQUIRY_STATUS_LABELS: Record<InquiryStatusKey, string> = {
  new: 'Mới',
  contacted: 'Đang xử lý',
  done: 'Đã xử lý',
}

export const INQUIRY_STATUS_CLASS: Record<InquiryStatusKey, string> = {
  new: 'status-new',
  contacted: 'status-contacted',
  done: 'status-done',
}

export function inquiryStatusLabel(status: string): string {
  return INQUIRY_STATUS_LABELS[status as InquiryStatusKey] ?? status
}

export function inquiryStatusClass(status: string): string {
  return INQUIRY_STATUS_CLASS[status as InquiryStatusKey] ?? 'status-new'
}
