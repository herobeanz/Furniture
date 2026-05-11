/**
 * Centralized logger — debug/info only in DEV, error always.
 * Use this instead of console.log everywhere.
 */
const isDev = import.meta.env.DEV

export const logger = {
  debug: (...args: unknown[]) => {
    if (isDev) console.debug('[debug]', ...args)
  },
  info: (...args: unknown[]) => {
    if (isDev) console.info('[info]', ...args)
  },
  warn: (...args: unknown[]) => {
    console.warn('[warn]', ...args)
  },
  error: (...args: unknown[]) => {
    console.error('[error]', ...args)
  },
}
