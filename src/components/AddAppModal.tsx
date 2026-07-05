import { useEffect, useState } from 'react'
import { Link } from 'lucide-react'
import { Modal } from './ui/Modal'
import { Button } from './ui/Button'
import { useAppStore } from '../store/useAppStore'
import { getAppName, getDisplayIconUrl, resolveAppIconUrl } from '../utils/favicon'

interface AddAppModalProps {
  open: boolean
  onClose: () => void
}

function normaliseUrl(raw: string): string {
  const trimmed = raw.trim()
  if (!trimmed) return trimmed
  if (!/^https?:\/\//i.test(trimmed)) return `https://${trimmed}`
  return trimmed
}

export function AddAppModal({ open, onClose }: AddAppModalProps) {
  const addApp = useAppStore((state) => state.addApp)
  const [url, setUrl] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [derivedIcon, setDerivedIcon] = useState('')

  useEffect(() => {
    const normalizedUrl = url ? normaliseUrl(url) : ''
    if (!normalizedUrl) return

    let active = true

    void resolveAppIconUrl(normalizedUrl).then((icon) => {
      if (active) setDerivedIcon(icon)
    })

    return () => {
      active = false
    }
  }, [url])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const normUrl = normaliseUrl(url)
    try {
      new URL(normUrl)
    } catch {
      setError('Please enter a valid URL.')
      return
    }
    const finalName = name.trim() || getAppName(normUrl)
    const icon = await resolveAppIconUrl(normUrl)
    addApp({ name: finalName, url: normUrl, icon })
    setUrl('')
    setName('')
    setDerivedIcon('')
    onClose()
  }

  const handleClose = () => {
    setUrl('')
    setName('')
    setError('')
    setDerivedIcon('')
    onClose()
  }

  const handleUrlChange = (nextUrl: string) => {
    setUrl(nextUrl)
    if (!nextUrl.trim()) setDerivedIcon('')
  }

  const derivedName = name.trim() || (url ? getAppName(normaliseUrl(url)) : '')

  return (
    <Modal open={open} onClose={handleClose} title="Add App">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Preview */}
        {(derivedName || derivedIcon) && (
          <div className="flex items-center gap-3 rounded-2xl border border-white/40 bg-white/30 px-4 py-3 dark:border-white/10 dark:bg-white/5">
            {derivedIcon && (
              <img src={getDisplayIconUrl(derivedIcon)} alt="" className="h-8 w-8 rounded-xl object-contain" />
            )}
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
              {derivedName || 'App preview'}
            </span>
          </div>
        )}

        {/* URL field */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            App URL
          </label>
          <div className="flex items-center gap-2 rounded-2xl border border-white/40 bg-white/50 px-4 py-2.5 focus-within:ring-2 focus-within:ring-primary/40 dark:border-white/10 dark:bg-white/10">
            <Link className="h-4 w-4 shrink-0 text-slate-400" />
            <input
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => handleUrlChange(e.target.value)}
              className="flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 dark:text-white"
              autoFocus
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
            />
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>

        {/* Name field (optional) */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Name <span className="font-normal normal-case">(optional)</span>
          </label>
          <input
            type="text"
            placeholder={derivedName || 'My App'}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-2xl border border-white/40 bg-white/50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40 dark:border-white/10 dark:bg-white/10 dark:text-white"
          />
        </div>

        <div className="flex gap-3">
          <Button type="button" variant="secondary" className="flex-1" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" className="flex-1" disabled={!url.trim()}>
            Add
          </Button>
        </div>
      </form>
    </Modal>
  )
}
