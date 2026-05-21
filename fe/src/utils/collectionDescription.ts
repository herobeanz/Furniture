export const COLLECTION_DESCRIPTION_SEP = '\n\n---\n\n'

/** Text shown on public collection hero (short description only). */
export function collectionPublicDescription(raw: string | undefined | null): string {
  const text = (raw ?? '').trim()
  if (!text) return ''
  if (text.includes(COLLECTION_DESCRIPTION_SEP)) {
    return (text.split(COLLECTION_DESCRIPTION_SEP)[0] ?? '').trim()
  }
  return text
}
