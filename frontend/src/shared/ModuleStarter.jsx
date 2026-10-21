import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, CircleCheck } from 'lucide-react'
import ModuleIcon from './ModuleIcon'
import { modules } from './modules'
import { Button } from '@/components/ui/button'
import { requestApi } from '@/services/api'
export default function ModuleStarter({ slug }) {
 const module = modules.find(item => item.slug === slug)
 const [message, setMessage] = useState('')
 const [busy, setBusy] = useState(false)
 async function checkConnection() {
  setBusy(true)
  try { const data = await requestApi(`/${slug}/status`); setMessage(`API connected. ${data.message}`) }
  catch (error) { setMessage(error.message) }
  finally { setBusy(false) }
 }
 return <main id="content" className="module-page"><Link to="/" className="text-link"><ArrowLeft size={16}/>Back to workspace</Link><section className="module-welcome"><span className="module-symbol"><ModuleIcon name={module.icon} size={35}/></span><p className="site-eyebrow">{module.eyebrow}</p><h1>{module.title}</h1><p>{module.description}</p><span className="starter-status">This research module is being prepared</span><div className="starter-divider"/><h2>A space for the next insight.</h2><p>Your team's {module.detail.toLowerCase()} interface will appear here once integrated. Crop Finder is available to explore now.</p><div className="hero-actions"><Link to="/crop-finder" className="site-button">Explore Crop Finder <ArrowUpRight size={18}/></Link><Button variant="secondary" onClick={checkConnection} disabled={busy}>{busy ? 'Checking…' : 'Check API connection'}</Button></div><p role="status" className="api-message">{message && <><CircleCheck size={16}/>{message}</>}</p></section></main>
}
