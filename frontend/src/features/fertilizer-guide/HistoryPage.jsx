import { useState } from 'react'
import { readHistory } from './localHistory'

export default function HistoryPage({ onOpen }) {
  const [page, setPage] = useState(0)
  const [{ records, error }] = useState(() => {
    try { return { records: readHistory(), error: '' } }
    catch { return { records: [], error: 'Browser history could not be read. Check your browser storage settings.' } }
  })
  const items = records.slice(page * 20, (page + 1) * 20)

  return (
    <section className="fg-history">
      <div className="fg-eyebrow">YOUR PREVIOUS RESULTS</div>
      <h1>Recommendation history</h1>
      <p>Recommendations saved in this browser. Reopen your soil measurements, fertilizer results, and application guidance.</p>
      {error && <div className="fg-error" role="alert">{error}</div>}
      {!error && !items.length && <div className="fg-detail-panel fg-history-item">No saved recommendations yet. Create a fertilizer recommendation to get started.</div>}
      {items.map(item => <article key={item.id} className="fg-detail-panel fg-history-item">
        <div className="fg-history-heading"><h2>{item.inputs.crop} / {item.inputs.growth_stage}</h2><time dateTime={item.created_at}>{new Date(item.created_at).toLocaleString('en-LK')}</time></div>
        <p>{item.inputs.soil_type} / pH {item.inputs.pH}</p>
        <p><strong>Organic:</strong> {item.ml_predictions.organic.fertilizer}</p>
        <p><strong>Inorganic:</strong> {item.ml_predictions.inorganic.fertilizer}</p>
        <button type="button" className="fg-primary" onClick={() => onOpen(item)}>View recommendation</button>
      </article>)}
      {records.length > 20 && <div className="fg-history-pagination">
        <button className="fg-secondary" disabled={!page} onClick={() => setPage(n => n - 1)}>Previous</button>
        <span>Page {page + 1}</span>
        <button className="fg-secondary" disabled={(page + 1) * 20 >= records.length} onClick={() => setPage(n => n + 1)}>Next</button>
      </div>}
    </section>
  )
}
