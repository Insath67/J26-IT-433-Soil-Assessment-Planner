# Shared design system

Tailwind CSS provides utility classes. shadcn-style components are editable React source composed using those classes. This project uses both; they are not competing CSS frameworks.

The one global stylesheet is `frontend/src/globals.css`, imported once by `main.jsx`. Tailwind v4 is connected through `@tailwindcss/vite`. `components.json` points to globals.css and uses the `@/` alias.

| Token | Use |
| --- | --- |
| --primary / --primary-foreground | Green actions and text on them |
| --secondary / --secondary-foreground | Light green supporting surfaces |
| --accent / --accent-foreground | Orange emphasis |
| --background / --foreground | App canvas and normal text |
| --card / --card-foreground | White surfaces and their text |
| --muted / --muted-foreground | Supporting backgrounds and secondary text |
| --border / --input / --ring | Borders, controls and keyboard focus |

Example:

```jsx
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

<Card className="border-border">
  <CardContent className="p-6 text-foreground">
    <h2 className="text-xl font-semibold">Your module</h2>
    <Button variant="secondary">Continue</Button>
  </CardContent>
</Card>
```

Typography uses locally installed DM Sans and Manrope. The homepage illustration is bundled SVG markup, so it does not depend on external image servers. Illustration colors are decorative; UI theme colors come from tokens.

The supplied crop dashboard's existing CSS is scoped to `.crop-module` to prevent rules for main/footer/nav from leaking into other pages. Shared primary/secondary/accent roles have been connected to the theme; crop detail tones are derived from these same tokens with color-mix. Use member CSS with a page wrapper or CSS Modules for future work.

Local Button, Card and Input components were manually prepared. You can add more through `npx shadcn@latest add dialog` (from frontend), with internet access. Review component changes before committing. The shadcn CLI is not needed to start the app.

Official references:
- https://tailwindcss.com/docs/installation/using-vite
- https://ui.shadcn.com/docs/theming
- https://ui.shadcn.com/docs/installation/manual
