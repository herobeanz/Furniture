/** Card/listing hero: always prefer admin thumbnail over gallery. */
export function getProductDisplayImage(
  thumbnail: string | undefined | null,
  galleryUrls: string[] | undefined | null,
): string {
  const thumb = thumbnail?.trim()
  if (thumb) return thumb
  return galleryUrls?.find((url) => url?.trim())?.trim() || ''
}

/**
 * Gallery order on product detail: [thumbnail, ...detail images] without duplicates.
 */
export function buildProductGalleryList(
  thumbnail: string | undefined | null,
  galleryUrls: string[] | undefined | null,
): string[] {
  const thumb = thumbnail?.trim() || ''
  const extras = dedupeUrls(
    (galleryUrls ?? [])
      .map((url) => url?.trim())
      .filter((url): url is string => !!url)
      .filter((url) => url !== thumb),
  )

  if (!thumb) return extras
  return dedupeUrls([thumb, ...extras])
}

/** Gallery-only URLs for admin form (excludes main thumbnail). */
export function extractGalleryOnlyUrls(
  thumbnail: string | undefined | null,
  allUrls: string[] | undefined | null,
): string[] {
  const thumb = thumbnail?.trim() || ''
  return dedupeUrls(
    (allUrls ?? [])
      .map((url) => url?.trim())
      .filter((url): url is string => !!url)
      .filter((url) => url !== thumb),
  )
}

function dedupeUrls(urls: string[]): string[] {
  const seen = new Set<string>()
  const result: string[] = []
  for (const url of urls) {
    if (seen.has(url)) continue
    seen.add(url)
    result.push(url)
  }
  return result
}
