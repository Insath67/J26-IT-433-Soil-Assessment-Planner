import { ScanLine, Layers3, Sprout, Wheat } from 'lucide-react'
const icons = { scan: ScanLine, soil: Layers3, crop: Sprout, fertilizer: Wheat }
export default function ModuleIcon({ name, ...props }) {
 const Icon = icons[name] || Sprout
 return <Icon aria-hidden="true" {...props} />
}
