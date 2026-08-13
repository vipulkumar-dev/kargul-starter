@AGENTS.md

@CONVENTIONS.md

Read `CONVENTIONS.md` before writing any component, section, or page. Rule 1 comes first on every design: check the design's mobile + desktop `h1`/`h2`/`h3`/`p` values against the `@layer base` scale in `app/globals.css` and update the globals if they don't match. The rest covers the component + asset folder structure, section structure, typography rules, `Button` usage (always pass an explicit `variant`), `em`-based max-widths, Tailwind-only styling, `divide` for stacked borders, the no-comments rule, and the Figma layer-name directives (`[[hover]]`, `[[export]]`, `[[lightbox-image]]`).
