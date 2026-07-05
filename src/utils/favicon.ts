/**
 * Returns the best favicon URL for a given origin.
 * Falls back to Google's favicon service when a direct /favicon.ico doesn't work.
 */
export function getFaviconUrl(rawUrl: string): string {
  try {
    const url = new URL(rawUrl)
    return `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=128`
  } catch {
    return ''
  }
}

/**
 * Tries to derive a friendly name from a URL.
 */
export function getAppName(rawUrl: string): string {
  try {
    const url = new URL(rawUrl)
    // strip www. and take the hostname
    return url.hostname.replace(/^www\./, '').split('.')[0]
  } catch {
    return rawUrl
  }
}
