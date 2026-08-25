function errorDetails(error) {
  return error instanceof Error ? { error: error.name, message: error.message } : { error: 'UnknownError' }
}

export function log(level, event, fields = {}) {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    event,
    ...fields,
  }
  console[level === 'error' ? 'error' : 'log'](JSON.stringify(entry))
}

export function logError(event, error, fields = {}) {
  log('error', event, { ...fields, ...errorDetails(error) })
}
