const DIAGNOSTICS_KEY = 'kotodama.diagnostics'
const MAX_DIAGNOSTICS = 25

export type DiagnosticContext = Record<string, string | number | boolean | undefined>
export type DiagnosticEvent = {
  id: string
  source: 'render' | 'api'
  message: string
  context: DiagnosticContext
  occurredAt: string
}

function createId() {
  return crypto.randomUUID?.() ?? `diag-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function safeMessage(error: unknown) {
  const message = error instanceof Error ? error.message : String(error)
  return message
    .replace(/Bearer\s+[\w.-]+/gi, 'Bearer [redacted]')
    .replace(/(password|token|secret)=([^\s&]+)/gi, '$1=[redacted]')
    .slice(0, 300)
}

function readDiagnostics(): DiagnosticEvent[] {
  try {
    const stored = window.sessionStorage.getItem(DIAGNOSTICS_KEY)
    if (!stored) return []
    const parsed: unknown = JSON.parse(stored)
    return Array.isArray(parsed) ? (parsed as DiagnosticEvent[]) : []
  } catch {
    return []
  }
}

/** Records a compact, non-sensitive diagnostic locally and emits a browser event for an optional monitoring adapter. */
export function reportDiagnostic(source: DiagnosticEvent['source'], error: unknown, context: DiagnosticContext = {}) {
  const event: DiagnosticEvent = {
    id: createId(),
    source,
    message: safeMessage(error),
    context,
    occurredAt: new Date().toISOString(),
  }
  if (typeof window === 'undefined') return event.id

  try {
    const diagnostics = [...readDiagnostics(), event].slice(-MAX_DIAGNOSTICS)
    window.sessionStorage.setItem(DIAGNOSTICS_KEY, JSON.stringify(diagnostics))
    window.dispatchEvent(new CustomEvent('kotodama:diagnostic', { detail: event }))
  } catch {
    // Observability must never interrupt the user's recovery path.
  }
  if (import.meta.env['DEV']) console.error(`[Kotodama ${source} error ${event.id}]`, error)
  return event.id
}

export function getRecentDiagnostics() {
  if (typeof window === 'undefined') return []
  return readDiagnostics()
}
