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

### Components

Mirror the site: page → section → component.

```
components/
  home/
    hero/
      hero-marquee.tsx
    pricing/
      pricing-card.tsx
  about/
    team/
      team-member.tsx
```

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
Use the section's name as the `id`.

```tsx
import React from "react";
import Button from "@/components/_ui/button";

function ExampleSection() {
  return (
    <section id="section-name" className="relative z-0">
      <div className="px-global py-section-md">
        <div className="max-w-global mx-auto">
          <div className="flex flex-col items-center gap-4">
            <h1 className="max-w-[10em] text-center">Example Section</h1>
            <p className="max-w-[24em] text-center">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste,
              neque laboriosam id harum consequatur quidem dolorem aperiam sit
            </p>
          </div>

          <div className="flex gap-3">
            <Button variant="primary" size="md">
              Book a Demo
            </Button>

            <Button variant="secondary" size="md">
              Learn More
            </Button>
          </div>
        </div>
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

## 8. Use `divide` for stacked borders

For lists or stacks that need separators between items, use Tailwind's `divide-*` utilities instead of putting a border on each child.

```tsx
<div className="divide-border flex flex-col divide-y">
  <div className="py-4">Item one</div>
  <div className="py-4">Item two</div>
</div>
```

## 9. No comments

Do not add comments of any kind to the code — no `//`, no `/* */`, no JSX `{/* */}`. Code should read on its own.

## 10. Figma layer-name directives

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
