import { NavLink, Link } from 'react-router-dom'
import { Leaf } from 'lucide-react'
import { modules } from './modules'
export default function Navigation() {
 return <header className="site-header">
  <Link className="site-brand" to="/" aria-label="Verdant home"><span className="site-brand-icon"><Leaf size={25}/></span><span>verdant<span className="site-brand-sub">KEGALLE RESEARCH</span></span></Link>
  <nav aria-label="Research modules" className="site-nav">
   <NavLink end to="/">Home</NavLink>
   {modules.map(module => <NavLink key={module.slug} to={`/${module.slug}`}>{module.title}</NavLink>)}
  </nav>
 </header>
}
