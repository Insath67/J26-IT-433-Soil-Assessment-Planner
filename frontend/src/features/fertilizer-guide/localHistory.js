const KEY = 'saru-bima-fertilizer-history-v1'

export function readHistory() {
  const value = JSON.parse(localStorage.getItem(KEY) || '[]')
  if (!Array.isArray(value)) throw new Error('Browser history could not be read.')
  return value
}

export function saveHistory(result) {
  const record = {
    ...result,
    id: result.id || crypto.randomUUID(),
    created_at: result.created_at || new Date().toISOString(),
    saved_locally: true,
  }
  const records = readHistory().filter(item => item.id !== record.id)
  localStorage.setItem(KEY, JSON.stringify([record, ...records].slice(0, 100)))
  return record
}
