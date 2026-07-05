const MANIFEST_FILES = ['manifest.webmanifest', 'manifest.json']
const ICON_FILES = [
  'icons/icon-512-maskable.png',
  'icons/icon-512.png',
  'icons/icon-192-maskable.png',
  'icons/icon-192.png',
  'android-chrome-512x512.png',
  'android-chrome-192x192.png',
  'apple-touch-icon.png',
]

export const APP_ICON_REFRESH_INTERVAL = 10 * 60 * 1000

function unique(values: string[]): string[] {
  return [...new Set(values)]
}

function scoreIcon(sizes?: string, purpose?: string, type?: string): number {
  const largestSize = Math.max(
    ...((sizes ?? '')
      .split(/\s+/)
      .map((size) => size.match(/^(\d+)x(\d+)$/))
      .filter((match): match is RegExpMatchArray => Boolean(match))
      .map((match) => Number(match[1]))),
    0,
  )

  return (
    largestSize +
    (purpose?.includes('maskable') ? 10_000 : 0) +
    (purpose?.includes('any') ? 5_000 : 0) +
    (type === 'image/png' ? 1_000 : 0)
  )
}

function getBaseUrls(url: URL): string[] {
  return unique([new URL('.', url).toString(), new URL('/', url).toString()])
}

function buildManifestCandidates(url: URL): string[] {
  const baseUrls = getBaseUrls(url)
  return unique(
    baseUrls.flatMap((baseUrl) => MANIFEST_FILES.map((manifestFile) => new URL(manifestFile, baseUrl).toString())),
  )
}

function buildIconCandidates(url: URL): string[] {
  const baseUrls = getBaseUrls(url)
  return unique(baseUrls.flatMap((baseUrl) => ICON_FILES.map((iconFile) => new URL(iconFile, baseUrl).toString())))
}

function getFallbackFavicon(url: URL): string {
  return `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=128`
}

async function fetchManifestLink(pageUrl: URL): Promise<string | null> {
  try {
    const response = await fetch(pageUrl.toString(), { cache: 'no-store' })
    if (!response.ok) return null

    const html = await response.text()
    const document = new DOMParser().parseFromString(html, 'text/html')
    const manifestLink = document.querySelector('link[rel~="manifest"]')?.getAttribute('href')

    return manifestLink ? new URL(manifestLink, pageUrl).toString() : null
  } catch {
    return null
  }
}

async function getManifestIcon(url: URL): Promise<string | null> {
  const manifestLink = await fetchManifestLink(url)
  const manifestCandidates = unique([
    ...(manifestLink ? [manifestLink] : []),
    ...buildManifestCandidates(url),
  ])

  for (const manifestUrl of manifestCandidates) {
    try {
      const response = await fetch(manifestUrl, { cache: 'no-store' })
      if (!response.ok) continue

      const manifest = (await response.json()) as {
        icons?: Array<{ src?: string; sizes?: string; purpose?: string; type?: string }>
      }

      const icon = manifest.icons
        ?.filter((item): item is { src: string; sizes?: string; purpose?: string; type?: string } => Boolean(item.src))
        .sort((left, right) => scoreIcon(right.sizes, right.purpose, right.type) - scoreIcon(left.sizes, left.purpose, left.type))[0]

      if (icon?.src) {
        return new URL(icon.src, manifestUrl).toString()
      }
    } catch {
      continue
    }
  }

  return null
}

async function canLoadImage(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const image = new Image()
    let settled = false

    const finish = (result: boolean) => {
      if (settled) return
      settled = true
      window.clearTimeout(timeoutId)
      resolve(result)
    }

    const timeoutId = window.setTimeout(() => {
      image.src = ''
      finish(false)
    }, 4_000)

    image.onload = () => finish(true)
    image.onerror = () => finish(false)
    image.referrerPolicy = 'no-referrer'
    image.src = url
  })
}

async function getKnownPwaIcon(url: URL): Promise<string | null> {
  for (const candidate of buildIconCandidates(url)) {
    if (await canLoadImage(candidate)) return candidate
  }

  return null
}

export async function resolveAppIconUrl(rawUrl: string): Promise<string> {
  try {
    const url = new URL(rawUrl)

    return (
      (await getManifestIcon(url)) ??
      (await getKnownPwaIcon(url)) ??
      getFallbackFavicon(url)
    )
  } catch {
    return ''
  }
}

export function getDisplayIconUrl(icon: string, updatedAt?: number): string {
  if (!icon) return ''

  try {
    const url = new URL(icon)
    url.searchParams.set('mpal-icon', String(updatedAt ?? Date.now()))
    return url.toString()
  } catch {
    const separator = icon.includes('?') ? '&' : '?'
    return `${icon}${separator}mpal-icon=${updatedAt ?? Date.now()}`
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
