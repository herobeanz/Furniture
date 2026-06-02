export interface OptimizeImageOptions {
  width?: number
  quality?: number | 'auto'
}

/**
 * Add Cloudinary transformations for web delivery.
 * Keeps non-Cloudinary URLs untouched.
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
  if (!isCloudinary) return trimmed

  const width = options.width && options.width > 0 ? Math.round(options.width) : undefined
  const quality = options.quality ?? 'auto'
  const transforms = ['f_auto', 'dpr_auto', `q_${quality}`]
  if (width) transforms.push(`w_${width}`, 'c_limit')

  return trimmed.replace('/upload/', `/upload/${transforms.join(',')}/`)
}

