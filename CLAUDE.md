@AGENTS.md

@CONVENTIONS.md

Read `CONVENTIONS.md` before writing any component, section, or page. Rule 1 comes first on every design: check the design's mobile + desktop `h1`/`h2`/`h3`/`p` values against the `@layer base` scale in `app/globals.css` and update the globals if they don't match. The rest covers the component + asset folder structure, section structure, typography rules, `Button` usage (always pass an explicit `variant`), `em`-based max-widths, Tailwind-only styling, the outline patterns for borders between items, SVG handling (`<Image />` by path, SVGR component only when it needs CSS), the shared GSAP power easings for Tailwind and Framer Motion, inlining the navbar + hero assets so the first screen paints instantly, the responsive layout patterns (aspect-ratio wrappers, absolute bleeds, negative-margin overlaps), the no-comments rule, and the Figma layer-name directives (`[[hover]]`, `[[export]]`, `[[lightbox-image]]`).
