import { useEffect } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import Navigation from './shared/Navigation'
import HomePage from './pages/HomePage'
import SoilScan from './features/soil-scan/Page'
import SoilHealth from './features/soil-health/Page'
import CropFinder from './features/crop-finder/App'
import FertilizerGuide from './features/fertilizer-guide/Page'
import './shared/workspace.css'
export default function App() {
 const { pathname } = useLocation()
 useEffect(() => { window.scrollTo(0, 0); document.title = `${pathname === '/' ? 'Home' : pathname.slice(1).split('-').map(s=>s[0].toUpperCase()+s.slice(1)).join(' ')} | Verdant` }, [pathname])
 return <><a className="skip-link" href={pathname === '/crop-finder' ? '#main' : '#content'}>Skip to content</a><Navigation/><Routes>
  <Route path="/" element={<HomePage/>}/>
  <Route path="/soil-scan" element={<SoilScan/>}/>
  <Route path="/soil-health/*" element={<SoilHealth/>}/>
  <Route path="/crop-finder" element={<div className="crop-module"><CropFinder/></div>}/>
  <Route path="/fertilizer-guide" element={<FertilizerGuide/>}/>
  <Route path="*" element={<main id="content" className="module-page"><h1>Page not found</h1><Link to="/">Return to home</Link></main>}/>
 </Routes></>
}
