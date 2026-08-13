# Project Conventions

Follow these rules for every component, section, and page in this repo.

## 1. Match the global type scale to the design first

Before building anything from a design, compare the design's mobile and desktop values for `h1`, `h2`, `h3`, and `p` against the `@layer base` rules in `app/globals.css`. If they don't match, **update `globals.css` first** — never compensate with per-element classes in a component.

Current scale in `app/globals.css`:

```css
h1,
.h1-style {
  @apply text-[min(40px,10vw)] leading-[96%] sm:text-[48px] md:text-[70px];
}

h2,
.h2-style {
  @apply text-[min(36px,8vw)] sm:text-[48px] md:text-[56px];
}

h3,
.h3-style {
  @apply text-[min(17.5px,4.85vw)] sm:text-[20px] md:text-[20px];
}

p,
.p-style {
  @apply text-[14px] leading-[120%] tracking-[-0.01em] md:text-[16px];
}
```

- Base value = mobile, `sm:`/`md:` = tablet/desktop. Keep the `min(px, vw)` pattern on headings so they shrink on small screens.
- Update `leading`, `tracking`, and `font-weight` here too if the design differs.
- Do this once, up front — every other rule below assumes the globals already match the design.

## 2. Folder structure

### Pages

A `page.tsx` only composes sections — no markup, no layout classes, no logic beyond the `main` wrapper.

```tsx
import Hero from "@/components/home/hero/hero";
import About from "@/components/home/about/about";
import Services from "@/components/home/services/services";
import Projects from "@/components/home/projects/projects";
import Testimonials from "@/components/home/testimonials/testimonials";
import Contact from "@/components/home/contact/contact";

export default function Home() {
  return (
    <main className="max-h-screen max-w-full overflow-x-clip">
      <Hero />
      <About />
      <Services />
      <Projects />
      <Testimonials />
      <Contact />
    </main>
  );
}
```

### Components

Mirror the site: page → section → component. Each section gets its own folder, and the section's **main file is named after the section and lives inside that folder** — it's the component the page imports. Everything that section needs sits next to it.

```
components/
  home/
    hero/
      hero.tsx
      hero-marquee.tsx
    projects/
      projects.tsx
      project-card.tsx
  about/
    team/
      team.tsx
      team-member.tsx
```

Sections are only imported by their page. If a section's sub-component is needed on another page, it moves to `_common/`.

Anything reused across more than one page or section moves to `_common/`. Low-level primitives live in `_ui/`.

```
components/
  _common/
    header.tsx
    footer.tsx
  _ui/
    button.tsx
    video.tsx
```

If a component has sub-components, it becomes a folder named after the component and the sub-components sit inside it.

```
components/
  _ui/
    lightbox/
      lightbox-gallery.tsx
      lightbox-image.tsx
      lightbox-icons.ts
      index.ts
  home/
    pricing/
      pricing-card/
        pricing-card.tsx
        pricing-card-features.tsx
```

### Assets

Assets use the **same page/section/component folder structure**, split by file type:

| File type            | Folder                  |
| -------------------- | ----------------------- |
| `.svg` `.png` `.jpg` | `public/assets/images/` |
| `.webm` `.mp4`       | `public/assets/videos/` |
| `.riv`               | `public/assets/rive/`   |
| Lottie `.json`       | `public/assets/lottie/` |

```
public/assets/
  images/
    home/
      hero/
        hero-badge.png
    _common/
      logo.svg
  videos/
    home/
      hero/
        hero-loop.webm
        hero-loop.jpg
  rive/
    home/
      hero/
        hero-scroll.riv
  lottie/
    home/
      pricing/
        pricing-check.json
```

The one exception: **a video's poster image lives next to the video**, in the videos folder, with the same filename and a different extension (`hero-loop.webm` + `hero-loop.jpg`) — not in `images/`.

## 3. Section structure

Every section follows the same nesting: `section` → padding wrapper → max-width wrapper → content.
Use the section's name as the `id`. The file lives at `components/<page>/<section>/<section>.tsx` per rule 2 and is default-exported for the page to import.

```tsx
import React from "react";
import Button from "@/components/_ui/button";

function ExampleSection() {
  return (
    <section id="section-name" className="relative z-0">
      <div className="px-global py-section-md">
        <div className="max-w-global mx-auto">[other code]</div>
      </div>
    </section>
  );
}

export default ExampleSection;
```

- `px-global` / `py-section-md` handle responsive spacing — don't hand-roll padding.
- `max-w-global` + `mx-auto` centers the content container.

## 4. No font styles on typography tags

`h1`–`h6` and `p` are already styled globally in `app/globals.css` (size, weight, line-height, tracking, color). Never add font-size, font-weight, leading, tracking, or color classes to them — if the design needs different values, fix the globals per rule 1.

```tsx
<h1 className="max-w-[10em] text-center">Heading</h1>
```

```tsx
<h1 className="text-4xl leading-tight font-bold text-gray-900">Heading</h1>
```

Need heading styling on a non-heading element? Use the `.h1-style`, `.h2-style`, `.h3-style`, `.p-style` helpers.

## 5. Always use the Button component

Never write a raw `<button>`. Import `Button` from `@/components/_ui/button` and **always pass an explicit `variant`** (and `size`) for every button, in every state and every place — no relying on defaults.

```tsx
<Button variant="primary" size="md">Book a Demo</Button>
<Button variant="secondary" size="md">Learn More</Button>
```

Variants: `primary` | `secondary`. Sizes: `sm` | `md` | `lg`.

If a new button style is needed, add a variant to `buttonVariants` in `components/_ui/button.tsx` — don't override with one-off classes.

## 6. Max-width in `em` for text

Headings and paragraphs get `max-width` in `em`, never `px`. Compute it as **target px ÷ that element's font-size**, then write the result in `em`.

- Heading at 70px that should wrap around 700px → `max-w-[10em]`
- Paragraph at 16px that should wrap around 384px → `max-w-[24em]`

This keeps line length consistent as the global font sizes scale across breakpoints.

## 7. Tailwind first

Use Tailwind utilities for everything. No inline `style` objects, no CSS modules, no styled-components. Global tokens and base styles belong in `app/globals.css`.

## 8. Borders between items

How to draw 1px dividing lines between items — grids, and stacked lists alike.

**Never** use `nth-child` math to add or strip borders per position. It has to be rewritten at every breakpoint and silently breaks when the column count changes. Use one of the two patterns below.

A plain stacked list is just Pattern A with a single column, so the same two patterns cover every case.

### Pattern A — square corners

```tsx
<div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-px p-px">
  <div className="outline-border p-6 outline-1">Cell</div>
  <div className="outline-border p-6 outline-1">Cell</div>
  <div className="outline-border p-6 outline-1">Cell</div>
</div>
```

**Why it works.** `outline` is drawn outside the box and does not affect layout. With `gap-px`, two neighbouring cells each paint their outline into the _same_ 1px strip, so the lines overlap instead of stacking into 2px. The `p-px` on the grid leaves room for the outlines on the outer edge, which gives you the frame for free.

**Column count is irrelevant.** Every cell gets the same single declaration, so 1 column, 2, 3 or 4 all render correctly with no breakpoint variants.

**Incomplete last row** is just empty grid space — no cell, no outline, nothing drawn. This is the whole point of the pattern.

### Pattern B — rounded wrapper corners

Outlines are always square, so they cannot supply the frame when the container is rounded — the clip eats the line along each arc and leaves four gaps at the corners. Move the frame onto the wrapper.

```tsx
<div className="border-border overflow-hidden rounded-xl border">
  <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-px">
    <div className="outline-border bg-background p-6 outline-1">Cell</div>
    <div className="outline-border bg-background p-6 outline-1">Cell</div>
    <div className="outline-border bg-background p-6 outline-1">Cell</div>
  </div>
</div>
```

The wrapper draws the rounded frame, `overflow-hidden` clips away the cells' perimeter outlines, and the cells are left supplying only the interior lines. Note there is no `p-px` on the grid here — the wrapper draws the frame now.

Required:

- `bg-*` on every cell — without it nothing gets clipped at the corners and content pokes past the curve.
- `overflow-hidden` on the wrapper — this is what removes the doubled outer line.

Do not use Pattern B when the grid contains `sticky` headers, dropdowns, tooltips, or any child that needs to escape the container — `overflow-hidden` will clip them. In that case use Pattern A and accept square corners, or round only the four corner cells directly (which reintroduces `nth-child` math, so treat it as a last resort).

### Do not do this

```tsx
<div className="bg-border grid grid-cols-3 gap-px">
  <div className="bg-background p-6">Cell</div>
</div>
```

Painting the container in the line colour and letting it show through the gaps looks correct only while the last row is full. As soon as the item count is not a multiple of the column count, the leftover cells have no element to cover them and the container colour shows through as a solid block of line-colour. Since column count changes at every breakpoint, this will break on some screen size regardless of the item count.

### Quick reference

| Need                           | Use                                  |
| ------------------------------ | ------------------------------------ |
| Square corners                 | Pattern A                            |
| Rounded corners                | Pattern B                            |
| Sticky or overflowing children | Pattern A                            |
| Any column count / responsive  | Both — no breakpoint variants needed |

## 9. SVGs

**Prefer `<Image />`.** Render an SVG through `next/image` using its **public path as a string** — not a static import.

```tsx
<Image
  src="/assets/images/home/hero/badge.svg"
  alt="Verified"
  width={24}
  height={24}
/>
```

Go inline only when the graphic actually needs CSS — `currentColor`, hover / `group-hover`, animation, or a token-driven gradient. Then import the file and render it as a component. SVGR is already wired up in `next.config.ts`, so the markup stays clean.

```tsx
import ArrowIcon from "@/public/assets/images/_common/arrow.svg";

<ArrowIcon className="size-4 transition-colors group-hover:text-black" />;
```

**Never paste raw `<svg>` markup into a component.** If it renders inline, it comes from an imported `.svg` file.

How SVG handling behaves in this project:

- Every `.svg` import is transformed by SVGR into a React component (`next.config.ts` → `turbopack.rules`). It is **not** a `StaticImageData`, so `<Image src={ArrowIcon} />` does not work — that's why `<Image />` takes the path string instead.
- SVGR runs with `icon: true`, so the output is `<svg width="1em" height="1em" viewBox="…">`. Size it with a Tailwind class (`size-4`, `h-6 w-6`) — CSS beats the attributes — or by setting a font-size.
- Colours are **not** rewritten automatically. For `currentColor` to work, the `.svg` file itself must use `fill="currentColor"` / `stroke="currentColor"`. Fix the exported file once; don't wrap it in a component to patch colours.
- Files live in `public/assets/images/…` per rule 2.
- Decorative SVGs get `alt=""` on `<Image />`, or `aria-hidden` when inline.

## 10. Easing

GSAP's power eases are defined once and available to both CSS and Framer Motion. **Never hardcode a `cubic-bezier()` or a raw bezier array in a component.**

### Which curve to use

**Default to `power3` in-out for every animation** — `ease-power3-in-out` / `ease.power3InOut`. Use it unless the element is entering or leaving, in which case the direction decides:

| The animation                                                              | Use           |
| -------------------------------------------------------------------------- | ------------- |
| Anything already on screen — hover, toggle, layout shift, colour, movement | `power3InOut` |
| Entering — reveal on scroll, fade up from `opacity: 0`, modal opening      | `power3Out`   |
| Leaving — fade out, modal closing, item removed                            | `power3In`    |

The reason: an in-out curve starts and ends at zero speed, which is right for something that begins and ends on screen, but wrong for an entrance — it makes the element crawl at the start while it's still invisible. An entrance should arrive fast and settle, which is **out**. An exit should do the reverse, starting slow and accelerating away, which is **in**.

So a scroll reveal from `opacity: 0` uses `power3Out`, not the in-out default.

```tsx
<motion.div
  initial={{ opacity: 0, y: 24 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6, ease: ease.power3Out }}
/>
```

```tsx
<div className="ease-power3-in-out transition-colors duration-300 hover:bg-black" />
```

Reach for another power level only when `power3` is visibly wrong for that specific motion — `power1`/`power2` for small, quick UI moves, `power4` for long dramatic ones.

Tailwind — utilities come from the `@theme static` block in `app/globals.css`:

```tsx
<div className="ease-power3-in-out transition-transform duration-500 hover:scale-105" />
```

Framer Motion — the same curves as tuples from `lib/easings.ts`:

```tsx
import { motion } from "motion/react";
import { ease } from "@/lib/easings";

<motion.div
  animate={{ y: 0, opacity: 1 }}
  transition={{ duration: 0.6, ease: ease.power3Out }}
/>;
```

| GSAP       | Curve | Tailwind                                                    | `lib/easings.ts`                         |
| ---------- | ----- | ----------------------------------------------------------- | ---------------------------------------- |
| `power1.*` | quad  | `ease-power1-in` / `ease-power1-out` / `ease-power1-in-out` | `power1In` / `power1Out` / `power1InOut` |
| `power2.*` | cubic | `ease-power2-in` / `ease-power2-out` / `ease-power2-in-out` | `power2In` / `power2Out` / `power2InOut` |
| `power3.*` | quart | `ease-power3-in` / `ease-power3-out` / `ease-power3-in-out` | `power3In` / `power3Out` / `power3InOut` |
| `power4.*` | quint | `ease-power4-in` / `ease-power4-out` / `ease-power4-in-out` | `power4In` / `power4Out` / `power4InOut` |

- The `@theme` block is `static`, so all twelve `--ease-power*` variables are always emitted to `:root` — usable in arbitrary values (`[transition-timing-function:var(--ease-power2-out)]`) and inline `animate` styles, not just via the utilities.
- Adding a curve means adding it in **both** places, with the same numbers, so CSS and Motion stay in sync.

## 11. The navbar and hero must paint instantly

Both are in the viewport the moment the page loads, so anything they fetch over the network is a frame the user spends staring at nothing. **Everything the first screen needs gets embedded in the HTML document itself.** This rule applies to the navbar and the hero only.

### 1. SVGs go inline

The logo and nav icons render as SVGR components (rule 9), never `<Image />` — inline SVG ships with the document and paints on the first frame.

```tsx
import Logo from "@/public/assets/images/_common/logo.svg";

<Logo className="h-8 w-auto" />;
```

### 2. Hero images become AVIF data URIs

Convert to AVIF first — any other format is too heavy to embed — then inline it.

```bash
npm run to:avif -- public/assets/images/home/hero/hero.png --width 1600 --quality 45
```

The script writes `hero.avif` next to the source and prints what it costs as base64 so you can judge it before inlining. Then:

```tsx
import Image from "next/image";
import { inlineAsset } from "@/lib/inline-asset";

const hero = inlineAsset("/assets/images/home/hero/hero.avif");

<Image src={hero} alt="" width={1600} height={900} priority />;
```

`next/image` detects the `data:` src and skips optimisation, so the bytes land in the HTML exactly as encoded.

### 3. Video posters are data URIs

The poster shows immediately and stays until the video is ready. `npm run extract:avif` pulls the first frame from every `.webm` under `public/` and converts it to AVIF next to the video (rule 2).

```tsx
<Video
  src="/assets/videos/home/hero/hero-loop.webm"
  poster={inlineAsset("/assets/videos/home/hero/hero-loop-frame.avif")}
/>
```

### 4. Rive and Lottie show a still first

Paint the inlined AVIF, then swap it for the animation on the library's load callback — `onLoad` for Rive, `onDOMLoaded` for `lottie-react`. Never leave an empty box while the runtime downloads.

```tsx
<div className="relative">
  {!loaded && (
    <Image src={fallback} alt="" fill className="object-cover" unoptimized />
  )}
  <Rive src="/assets/rive/home/hero/hero.riv" onLoad={() => setLoaded(true)} />
</div>
```

### Don't overdo it

These tricks buy a fast first paint; used everywhere they make the page slower. Inlined bytes can't be cached separately, are re-sent on every navigation to that page, and delay HTML parse.

- Only what is visible on first paint. Everything below the fold stays a normal file request through `<Image />`.
- `inlineAsset()` warns past 24KB raw; `to:avif` warns past 32KB of base64. Lower `--quality` or `--width` instead of ignoring it.
- `inlineAsset()` reads from disk at build time, so it only works in server components. Call it in the section (or page) and pass the string down as a prop to any client child.

## 12. Responsive layout

Most sections are text-driven and just follow the general layout from rule 3 — the padding and max-width wrappers plus the global type scale handle every breakpoint. Don't set fixed heights, don't size a whole section in `vw`, and don't rebuild the desktop composition separately for mobile.

Image-driven layouts are the exception, and there are three patterns.

### The image sets the box → aspect-ratio wrapper

When the layout's proportions come from an image, the **wrapper** owns the ratio and the image fills it. Never give the image a fixed pixel height.

```tsx
<div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl md:aspect-video">
  <Image src={cover} alt="" fill className="object-cover" />
</div>
```

Only the wrapper knows the ratio, so it can change per breakpoint (`aspect-square md:aspect-4/3`) without touching the image.

### The image escapes the box → `absolute` inside a `relative` wrapper

When artwork bleeds past the content column, the wrapper stays the layout anchor and the image is positioned out of it, so it never pushes siblings around.

```tsx
<div className="relative">
  <h2 className="max-w-[12em]">Heading</h2>
  <Image
    src={glow}
    alt=""
    className="pointer-events-none absolute -top-20 -right-40 w-[60vw] max-w-none md:w-[32rem]"
  />
</div>
```

- The parent needs `relative`; the page `main` already carries `overflow-x-clip` so the bleed can't create horizontal scroll.
- Decorative overflow gets `alt=""` and `pointer-events-none`.
- `max-w-none` when the image has to exceed its container width.

### Two sections overlap → negative margin

When the design collapses one section into the one above, pull the lower section up and give it a stacking context.

```tsx
<section id="stats" className="relative z-10 -mt-24 md:-mt-40">
```

- Always pair the negative margin with `relative z-*` so the pulled section paints above the previous one.
- Keep the pull responsive — the overlap is usually smaller or zero on mobile.
- Never fake it with a fixed height on the section above or by absolutely positioning a whole section; both break the moment the content wraps differently.

## 13. No comments

Do not add comments of any kind to the code — no `//`, no `/* */`, no JSX `{/* */}`. Code should read on its own.

## 14. Figma layer-name directives

Layer names in Figma carry build instructions inside double square brackets. Read them and act on them — the bracketed token is an instruction, not part of the layer's content, so never render it as text or use it in a class name or `id`.

### `[[hover]]`

The layer is the **hover state** of its sibling/parent, not a second element on the page. Build one element and move the layer's styles into a `hover:` variant — don't stack both versions in the markup.

```tsx
<Button variant="primary" size="md">
  Book a Demo
</Button>
```

```tsx
<div className="group relative">
  <Image
    src={cover}
    alt="Cover"
    className="transition-transform duration-300 group-hover:scale-105"
  />
</div>
```

Never render the hover layer as its own visible node, and never toggle it with React state when a `hover:` / `group-hover:` class does the job.

### `[[export]]`

Export that layer as **one flat image asset** and render a single `<Image />`. Do not rebuild its insides as markup — no nested `div`s, no separate text nodes, no re-created shapes, icons, or gradients from its children.

```tsx
<Image
  src="/assets/images/home/stats/stats-badge.png"
  alt="Stats badge"
  width={320}
  height={120}
/>
```

```tsx
<div className="rounded-2xl bg-white p-6 shadow">
  <div className="flex items-center gap-2">
    <span className="h-8 w-8 rounded-full bg-black" />
    <p>98% uptime</p>
  </div>
</div>
```

Download it with the Figma MCP asset tools, save it under `public/assets/` per rule 2, and reference it by path. Keep transparency (PNG/WebP) when the layer sits on a non-flat background; use SVG when it's pure vector.

### `[[lightbox-image]]`

The image opens in a lightbox on click. Wrap the group in `LightboxGallery` and render each image with `LightboxImage` — never a hand-rolled modal.

```tsx
import { LightboxGallery, LightboxImage } from "@/components/_ui/lightbox";
import Shot1 from "@/public/assets/images/home/gallery/shot-1.png";
import Shot2 from "@/public/assets/images/home/gallery/shot-2.png";

<LightboxGallery
  id="home-gallery"
  className="grid grid-cols-2 gap-4 md:grid-cols-3"
>
  <LightboxImage
    src={Shot1}
    alt="Brand identity system"
    full="/assets/images/home/gallery/shot-1-large.png"
    fullWidth={2120}
    fullHeight={1700}
    className="aspect-4/3 overflow-hidden rounded-3xl"
  />
  <LightboxImage
    src={Shot2}
    alt="Packaging design"
    full="/assets/images/home/gallery/shot-2-large.png"
    fullWidth={2120}
    fullHeight={1700}
    className="aspect-4/3 overflow-hidden rounded-3xl"
  />
</LightboxGallery>;
```

**`LightboxGallery`** — one instance per group of images. The `id` names the gallery and is what the images navigate within.

| Prop                               | Default   | Notes                                          |
| ---------------------------------- | --------- | ---------------------------------------------- |
| `id` (required)                    | —         | Gallery id; also the wrapper's DOM `id`        |
| `className`                        | —         | Layout classes for the wrapper (grid, flex, …) |
| `overlayColor`                     | `#000000` |                                                |
| `overlayOpacity`                   | `0.9`     |                                                |
| `overlayBlur`                      | `0`       | px of backdrop blur                            |
| `loop` / `counter` / `wheelToZoom` | `true`    |                                                |
| `onOpen` / `onClose`               | —         | Use to pause carousels/autoplay while open     |

**`LightboxImage`** — `src` is the thumbnail (static import preferred), `full` is the large file. Dimensions come from `fullWidth`/`fullHeight`, or automatically from a static import. Supports `fill`, `sizes`, `quality`, `priority`, `loading`, `imageClassName`, and `children` for badges/overlays.

Notes:

- PhotoSwipe is code-split — the gallery only downloads it on first hover/focus/click, so an unused gallery costs nothing.
- Multiple galleries on one page are fine; give each its own `id`.
- Images in separate `LightboxGallery` wrappers never navigate into each other.
