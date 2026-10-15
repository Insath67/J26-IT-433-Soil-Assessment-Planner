const API_BASE = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '')
export async function requestApi(path, options = {}) {
 let response
 try { response = await fetch(`${API_BASE}${path}`, { ...options, signal: AbortSignal.timeout(20000) }) }
 catch { throw new Error('Cannot reach the API. Start the backend on port 8000 and retry.') }
 const data = await response.json()
 if (!response.ok) throw new Error(data.message || 'The API request failed.')
 return data
}
