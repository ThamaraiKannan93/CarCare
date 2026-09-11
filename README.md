# Area 51 Car Care — Responsive Website

A complete, responsive front-end recreation of the Area 51 Car Care premium car wash
website (reference: https://www.area51carcare.com). Built with **semantic HTML, modern
CSS, and vanilla JavaScript** — no frameworks, no build step.

## How to run

Just open `index.html` in any browser. Everything works from the file directly.

For the cleanest experience (so relative paths and the carousel behave exactly like
production), serve the folder over a tiny local server:

```bash
# Python 3
python -m http.server 8899
```

Then visit http://127.0.0.1:8899 — no dependencies to install.

## Folder structure

```
area51carcare/
├── index.html      # Markup — all page sections
├── styles.css      # All styling, theming, animations & responsive rules
├── script.js       # Interactivity (carousel, menu, reveals, counters, parallax)
├── images/
│   └── logo.jpeg   # Brand logo
└── README.md
```

> The hero carousel photos are loaded from Unsplash via CDN (exactly as the original
> site does), so the carousel images need an internet connection. Everything else —
> layout, fonts, logo, styling — works offline.

## Sections

- **Fixed header** with logo, nav links, "Book Now" CTA, and a mobile hamburger menu
- **Hero** — auto-playing image carousel (5 slides, arrows + dots) over an animated
  black/cyan backdrop with particles, twinkling stars and a display-font headline
- **Services** — 3-card grid with SVG icons
- **Packages** — 3 pricing cards with a highlighted "Most popular" plan
- **About** — copy plus animated count-up stats
- **Contact** — location, hours and booking details
- **Footer** — logo, copyright, quick links

## Techniques used

**1. Semantic HTML / CSS architecture**
- Semantic landmarks: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`
- CSS custom properties (design tokens) for the whole colour system and typography, so
  the black + electric-cyan theme is defined once in `:root` and reused everywhere
- BEM-ish, component-scoped class names (`.service-card`, `.pricing-card`, `.hero-*`)

**2. Responsive web design**
- Mobile-first fluid sizing with `clamp()` for type, spacing and containers
- CSS Grid with `repeat(auto-fit, minmax(...))` so card grids reflow automatically
- Breakpoints at **768px** (tablet/mobile) and **480px** (small phones): the nav
  collapses into a hamburger, multi-column grids stack, and heavy decorative
  animations are switched off for performance
- `prefers-reduced-motion` support for accessibility

**3. Translating a design faithfully**
- Layout, spacing, colour palette, typography (Bebas Neue + Outfit) and interaction
  details reproduced to match the reference design

**4. Interactive UI (vanilla JavaScript)**
- **Preferred approach: vanilla JS** — zero dependencies, fast, and easy to maintain
- Hamburger menu toggle, custom **carousel** (autoplay, prev/next, dots, lazy-loaded
  images, pauses when tab is hidden), **scroll-triggered reveals** and **stat
  count-ups** via `IntersectionObserver`, smooth anchor scrolling with header offset,
  and a subtle scroll/mouse **parallax** (disabled on mobile & reduced-motion)

---
Recreated for local development and learning purposes.
