export type ValidationResult = {
  valid: boolean
  message?: string
}

export type CurrencyCode = 'VND' | 'USD' | 'EUR' | 'RUB' | 'RUP' | string

const PHONE_ALLOWED = /[0-9+\-()\s]/

function stripSeparators(value: string): string {
  return value.replace(/\./g, '').replace(',', '.')
}

function addThousands(integerPart: string): string {
  if (!integerPart) return '0'
  return integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

export function sanitizePhoneInput(value: string): string {
  const chars = value.split('').filter((ch) => PHONE_ALLOWED.test(ch))
  return chars.join('').slice(0, 15)
}

export function validatePhoneVN(value: string): ValidationResult {
  const raw = (value || '').trim()
  if (!raw) return { valid: false, message: 'Số điện thoại là bắt buộc' }
  if (raw.length > 15) return { valid: false, message: 'Số điện thoại tối đa 15 ký tự' }
  if (!/^[0-9+\-()\s]+$/.test(raw)) {
    return { valid: false, message: 'Số điện thoại chỉ gồm số và ký tự + ( ) - khoảng trắng' }
  }

  const compact = raw.replace(/[\s()-]/g, '')
  if (!(compact.startsWith('0') || compact.startsWith('+84'))) {
    return { valid: false, message: 'Số điện thoại phải bắt đầu bằng 0 hoặc +84' }
  }

  const digits = compact.startsWith('+84') ? `0${compact.slice(3)}` : compact
  if (!/^0\d{9,10}$/.test(digits)) {
    return { valid: false, message: 'Số điện thoại không đúng định dạng' }
  }

  return { valid: true }
}

export function validateEmailStrict(value: string): ValidationResult {
  const raw = (value || '').trim()
  if (!raw) return { valid: true }
  if (raw.length > 255) return { valid: false, message: 'Email tối đa 255 ký tự' }
  if (raw.includes(' ')) return { valid: false, message: 'Email không đúng định dạng' }

  const parts = raw.split('@')
  if (parts.length !== 2) return { valid: false, message: 'Email không đúng định dạng' }
  const [local, domain] = parts
  if (!local || !domain) return { valid: false, message: 'Email không đúng định dạng' }

  const localPattern = /^[a-z0-9]+([._-][a-z0-9]+)*$/i
  if (!localPattern.test(local)) return { valid: false, message: 'Email không đúng định dạng' }

  const labels = domain.split('.')
  if (labels.length < 2) return { valid: false, message: 'Email không đúng định dạng' }
  const labelPattern = /^[a-z0-9]+(-[a-z0-9]+)*$/i
  if (!labels.every((label) => !!label && labelPattern.test(label))) {
    return { valid: false, message: 'Email không đúng định dạng' }
  }
  const tld = labels[labels.length - 1] || ''
  if (tld.length < 2) return { valid: false, message: 'Email không đúng định dạng' }

  return { valid: true }
}

export function sanitizeNumericInput(value: string, allowComma = false): string {
  const regex = allowComma ? /[0-9,]/ : /[0-9]/
  return value
    .split('')
    .filter((ch) => regex.test(ch))
    .join('')
}

export function sanitizeCurrencyInput(value: string): string {
  const raw = (value || '').replace(/\s/g, '')
  const filtered = raw
    .split('')
    .filter((ch) => /[0-9.,]/.test(ch))
    .join('')
  // Keep only first comma as decimal separator.
  const [head = '', ...rest] = filtered.split(',')
  return rest.length ? `${head},${rest.join('')}` : head
}

function toNumberFromLocale(value: string): number | null {
  if (!value) return null
  const normalized = stripSeparators(value)
  if (!/^\d+(\.\d+)?$/.test(normalized)) return null
  const n = Number(normalized)
  return Number.isFinite(n) ? n : null
}

export function formatCurrency(value: string, currency: CurrencyCode = 'VND'): string {
  const n = toNumberFromLocale(sanitizeCurrencyInput(value))
  if (n === null || n < 0) return ''
  const fixed = currency.toUpperCase() === 'VND' ? n.toFixed(0) : n.toFixed(2)
  const [intPart = '0', decimalPart = ''] = fixed.split('.')
  const formattedInt = addThousands(intPart)
  return decimalPart ? `${formattedInt},${decimalPart}` : formattedInt
}

export function formatIntegerQuantity(value: string): string {
  const digits = sanitizeNumericInput(value).replace(/^0+(?=\d)/, '').slice(0, 15)
  return addThousands(digits)
}

export function formatDecimal2(value: string): string {
  const cleaned = sanitizeCurrencyInput(value)
  if (!cleaned) return ''
  const [intRaw = '0', decimalRaw = ''] = cleaned.split(',')
  const intPart = sanitizeNumericInput(intRaw).replace(/^0+(?=\d)/, '').slice(0, 15)
  const decimalPart = sanitizeNumericInput(decimalRaw).slice(0, 2)
  const formattedInt = addThousands(intPart || '0')
  return decimalPart ? `${formattedInt},${decimalPart}` : formattedInt
}

export function sanitizeDateInput(value: string): string {
  return (value || '')
    .split('')
    .filter((ch) => /[0-9/]/.test(ch))
    .join('')
    .slice(0, 10)
}

export function formatDateInput(value: string, mode: 'date' | 'month' = 'date'): string {
  const raw = sanitizeDateInput(value)
  const digits = raw.replace(/\D/g, '')
  if (mode === 'month') {
    if (digits.length === 6) return `${digits.slice(0, 2)}/${digits.slice(2)}`
    return raw
  }
  if (digits.length === 8) {
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`
  }
  return raw
}

export function parseDate(value: string, mode: 'date' | 'month' = 'date'): Date | null {
  if (!value) return null
  if (mode === 'month') {
    const m = /^(\d{2})\/(\d{4})$/.exec(value)
    if (!m) return null
    const month = Number(m[1])
    const year = Number(m[2])
    if (month < 1 || month > 12 || year < 1000 || year > 9999) return null
    return new Date(year, month - 1, 1)
  }

  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value)
  if (!m) return null
  const day = Number(m[1])
  const month = Number(m[2])
  const year = Number(m[3])
  if (month < 1 || month > 12 || year < 1000 || year > 9999) return null
  const d = new Date(year, month - 1, day)
  if (d.getFullYear() !== year || d.getMonth() !== month - 1 || d.getDate() !== day) return null
  return d
}

export function isValidDate(value: string, mode: 'date' | 'month' = 'date'): boolean {
  return parseDate(value, mode) !== null
}

export function validateDateRange(
  from: string,
  to: string,
  required = true,
): ValidationResult {
  const fromValue = (from || '').trim()
  const toValue = (to || '').trim()

  if (!fromValue && !toValue) {
    return required
      ? { valid: false, message: 'Thời gian kiểm sát là bắt buộc.' }
      : { valid: true }
  }

  if (!fromValue || !toValue) {
    return { valid: false, message: 'Vui lòng chọn đủ Từ ngày và Đến ngày.' }
  }

  if (!isValidDate(fromValue, 'date') || !isValidDate(toValue, 'date')) {
    return { valid: false, message: 'Ngày không hợp lệ, vui lòng kiểm tra định dạng' }
  }

  const fromDate = parseDate(fromValue, 'date')
  const toDate = parseDate(toValue, 'date')
  if (!fromDate || !toDate || toDate < fromDate) {
    return { valid: false, message: 'Đến ngày phải lớn hơn hoặc bằng Từ ngày.' }
  }

  return { valid: true }
}

export function validateYear(value: string): ValidationResult {
  const raw = (value || '').trim()
  if (!/^\d{4}$/.test(raw)) {
    return { valid: false, message: 'Năm phải theo định dạng YYYY' }
  }
  const year = Number(raw)
  if (year < 1000 || year > 9999) {
    return { valid: false, message: 'Năm không hợp lệ' }
  }
  return { valid: true }
}
