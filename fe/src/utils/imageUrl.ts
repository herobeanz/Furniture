export interface OptimizeImageOptions {
  width?: number
  quality?: number | 'auto'
}

/** Responsive width steps reused across public UI. */
export const IMAGE_WIDTHS = {
  card: [320, 480, 640] as const,
  hero: [640, 960, 1280] as const,
  bentoLarge: [480, 720, 960] as const,
  bentoSmall: [320, 480, 640] as const,
}

export const IMAGE_SIZES = {
  productCard: '(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw',
  blogCard: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  collectionCard: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  hero: '(max-width: 1024px) 100vw, 50vw',
  bentoLarge: '(max-width: 768px) 100vw, 66vw',
  bentoSmall: '(max-width: 768px) 50vw, 33vw',
} as const

function hasCloudinaryTransforms(url: string): boolean {
  const match = url.match(/\/upload\/([^/]+)\//)
  const segment = match?.[1]
  if (!segment) return false
  if (/^v\d+$/.test(segment)) return false
  return segment.includes(',') || /^(f_|w_|q_|c_|h_|dpr_|fl_)/.test(segment)
}

/**
 * Add Cloudinary transformations for web delivery.
 * Keeps non-Cloudinary URLs untouched; skips URLs already transformed.
 */
export function optimizeImageUrl(
  url: string | undefined | null,
  options: OptimizeImageOptions = {},
): string {
  if (!url) return ''
  const trimmed = url.trim()
  if (!trimmed) return ''

  const isCloudinary =
    trimmed.includes('res.cloudinary.com') && trimmed.includes('/upload/')
  if (!isCloudinary || hasCloudinaryTransforms(trimmed)) return trimmed

  const width =
    options.width && options.width > 0 ? Math.round(options.width) : undefined
  const quality = options.quality ?? 'auto'
  const transforms = ['f_auto', 'dpr_auto', `q_${quality}`]
  if (width) transforms.push(`w_${width}`, 'c_limit')

  return trimmed.replace('/upload/', `/upload/${transforms.join(',')}/`)
}

export function buildResponsiveSrcSet(
  url: string | undefined | null,
  widths: readonly number[],
  options: Omit<OptimizeImageOptions, 'width'> = {},
): string {
  const base = url?.trim()
  if (!base) return ''
  return widths
    .map((w) => `${optimizeImageUrl(base, { ...options, width: w })} ${w}w`)
    .join(', ')
}

/** Optimize inline images in TinyMCE / rich HTML for public pages. */
export function optimizeRichContentHtml(
  html: string,
  contentWidth = 900,
): string {
  if (!html) return ''

  return html.replace(/<img\b([^>]*?)>/gi, (full, attrs: string) => {
    const srcMatch = attrs.match(/\ssrc=["']([^"']+)["']/i)
    if (!srcMatch) return full

    const src = srcMatch[1]
    const optimized = optimizeImageUrl(src, {
      width: contentWidth,
      quality: 'auto',
    })
    let nextAttrs = attrs.replace(srcMatch[0], ` src="${optimized}"`)
    if (!/\sloading=/i.test(nextAttrs)) nextAttrs += ' loading="lazy"'
    if (!/\sdecoding=/i.test(nextAttrs)) nextAttrs += ' decoding="async"'
    return `<img${nextAttrs}>`
  })
}
