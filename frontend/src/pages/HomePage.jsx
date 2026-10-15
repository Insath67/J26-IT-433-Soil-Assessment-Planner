import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, MapPin, Leaf, Sparkles } from 'lucide-react'
import { modules } from '../shared/modules'
import ModuleIcon from '../shared/ModuleIcon'

function FieldIllustration() {
 return <svg className="field-art" viewBox="0 0 600 620" role="img" aria-label="Illustration of green fields and hills in Kegalle">
  <defs><linearGradient id="sky" x2="0" y2="1"><stop stopColor="#d8efbc"/><stop offset="1" stopColor="#f3f7de"/></linearGradient><linearGradient id="hill" x2="0" y2="1"><stop stopColor="#80ac68"/><stop offset="1" stopColor="#315e3e"/></linearGradient><clipPath id="fieldclip"><rect width="600" height="620" rx="28"/></clipPath></defs>
  <g clipPath="url(#fieldclip)"><rect width="600" height="620" fill="url(#sky)"/><circle cx="445" cy="133" r="57" fill="#f6b25a"/>
  <path d="M-60 320 Q90 110 290 280 Q430 80 660 290 V630H-60" fill="#aecb8e"/>
  <path d="M-60 380 Q180 125 370 350 Q510 200 660 320 V630H-60" fill="url(#hill)"/>
  <path d="M-50 400Q240 295 650 490V660H-50" fill="#a5c982"/>
  <path d="M-80 475Q160 320 670 530V660H-80" fill="#437b48"/>
  <path d="M-50 520Q220 355 670 600V670H-50" fill="#163f2d"/>
  {[0,1,2,3,4].map(i=><path key={i} d={`M${-80+i*42} 650 Q${180+i*37} ${310+i*28} 680 ${570+i*35}`} fill="none" stroke="#83b56c" strokeWidth="12"/>)}
  <path d="M300 310Q140 400 350 460Q460 500 380 650" fill="none" stroke="#e2c995" strokeWidth="23"/>
  <g fill="#214d33"><path d="M80 360v-82h8v82Z"/><ellipse cx="84" cy="264" rx="33" ry="55"/><path d="M510 343v-60h7v60Z"/><ellipse cx="513" cy="270" rx="26" ry="42"/></g>
  <g fill="#f7fae9"><path d="M350 305v-35h48v35Z"/><path d="m342 270 32-24 32 24Z" fill="#a66f3f"/><path d="M370 305v-19h10v19Z" fill="#315b37"/></g>
  </g>
 </svg>
}
export default function HomePage() {
 return <main id="content" className="home-page">
  <section className="home-hero">
   <div className="home-hero-copy">
    <div className="location-pill"><MapPin size={14}/> ROOTED IN KEGALLE, SRI LANKA</div>
    <h1>Better soil insights.<br/><em>Brighter growing<br/>possibilities.</em></h1>
    <p>From the soil beneath your feet to the crop you plant next. Explore one connected workspace for smarter agricultural decisions.</p>
    <div className="hero-actions"><Link className="site-button" to="/crop-finder">Find your crop <ArrowUpRight size={19}/></Link><a className="text-link" href="#explore">Explore the workspace <ArrowRight size={17}/></a></div>
    <div className="hero-footnote"><span className="leaf-stamp"><Leaf size={21}/></span><span>Four research components.<br/><strong>One shared vision for better farming.</strong></span></div>
   </div>
   <div className="home-visual"><FieldIllustration/><div className="visual-label"><span className="small-icon"><Sparkles size={19}/></span><span>Know your land.<br/><strong>Discover what could grow.</strong></span></div><span className="visual-caption">SOIL · CLIMATE · CROPS</span></div>
  </section>
  <section id="explore" className="explore-section" aria-labelledby="explore-title">
   <div className="explore-heading"><div><p className="site-eyebrow">YOUR FIELD, FROM EVERY ANGLE</p><h2 id="explore-title">Where would you like to start?</h2></div><p>Follow the journey from soil discovery<br/>to informed crop planning.</p></div>
   <div className="module-grid">{modules.map(module=><Link className={`module-card ${module.slug === 'crop-finder' ? 'module-featured' : ''}`} key={module.slug} to={`/${module.slug}`}><div className="module-card-top"><span className="module-symbol"><ModuleIcon name={module.icon} size={27}/></span><span className="module-number">{module.number}</span></div><p className="module-eyebrow">{module.eyebrow}</p><h3>{module.title}</h3><p className="module-description">{module.description}</p><div className="module-card-bottom"><span>{module.status}</span><ArrowUpRight size={21}/></div></Link>)}</div>
  </section>
  <section className="research-note"><Leaf size={28}/><div><h2>Built for our region. Growing through research.</h2><p>This workspace brings four research components together. Crop Finder currently uses synthetic data; the other modules are ready for your team's implementation.</p></div><span>KEGALLE<br/>SRI LANKA</span></section>
  <footer className="site-footer"><span>Verdant / Kegalle Crop Research</span><span>Understand the soil. Shape the next season.</span></footer>
 </main>
}
