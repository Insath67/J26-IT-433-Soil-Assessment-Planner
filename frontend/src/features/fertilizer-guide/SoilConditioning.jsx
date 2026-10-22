import { Sprout, ShieldCheck, Layers } from 'lucide-react'

const TOPICS = [
  { title: 'Soil conditioning', icon: Sprout, purpose: 'Improve soil conditions for plant growth.', description: 'Conditioning focuses on soil structure, organic matter, water movement, and the root environment.', steps: ['Assess soil texture, pH, drainage, and organic matter before choosing an amendment.', 'Use suitable mature compost or mulch to support the soil surface and root environment.', 'Track plant growth and repeat soil measurements to assess changes.'] },
  { title: 'Soil remediation / decontamination', icon: ShieldCheck, purpose: 'Address pollutants in contaminated soil.', description: 'Remediation requires identifying the contaminant and selecting a treatment for the site. Fertilizer measurements alone cannot establish whether soil is contaminated or safe.', steps: ['Record suspected pollution sources and arrange contaminant-specific laboratory testing.', 'Have a qualified environmental specialist assess the results and select a cleanup approach.', 'Verify the outcome with follow-up testing before resuming the intended land use.'] },
  { title: 'Soil stabilization', icon: Layers, purpose: 'Improve physical stability and reduce soil movement.', description: 'Stabilization addresses erosion, weak soil structure, and movement. The appropriate approach depends on slope, drainage, soil properties, and land use.', steps: ['Inspect bare ground, runoff paths, erosion, and drainage conditions.', 'Consider surface cover and vegetation as part of an erosion-management plan.', 'Seek a site assessment for unstable slopes or structural ground problems.'] },
]

export default function SoilConditioning() {
  return <section className="fg-conditioning">
    <div className="fg-eyebrow">CARE FOR YOUR SOIL</div>
    <h1>Soil conditioning</h1>
    <p>Explore soil improvement, pollutant cleanup, and physical stabilization.</p>
    <div className="fg-conditioning-grid">
      {TOPICS.map(({ title, icon: Icon, purpose, description, steps }) => <article className="fg-detail-panel fg-conditioning-card" key={title}>
        <span className="fg-card-icon"><Icon size={25} /></span>
        <h2>{title}</h2><h3>{purpose}</h3><p>{description}</p>
        <ol>{steps.map(step => <li key={step}>{step}</li>)}</ol>
      </article>)}
    </div>
  </section>
}
