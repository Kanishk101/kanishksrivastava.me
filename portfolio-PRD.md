# Portfolio Website — Product Requirements Document
### Brutalist-Luxury · Creative Technologist · White Dominant · Motion-First

---

## 0. OVERVIEW

A world-class personal portfolio for a Creative Technologist (Full-Stack Engineer + iOS Developer). The sole purpose: make any visitor — employer or casual observer — feel they've encountered someone operating at a genuinely rare intersection of engineering precision and design intelligence. The site should feel like a curated art gallery crossed with an Apple product page: breathable, intentional, unforgettable.

---

## 1. DESIGN PHILOSOPHY

### 1.1 Core Aesthetic DNA
- **Brutalist-Luxury**: The tension between raw typographic force and expensive restraint. Large, unapologetic headlines. Oceans of white space. Nothing decorative that isn't structural.
- **White Dominant**: Background is warm off-white (`#F9F7F4`), not clinical pure white. Everything breathes.
- **Intentional Jitter**: Certain animations — text reveals, hover states, section transitions — have deliberate, designed glitch/jitter moments. Not errors. Authorship.
- **Less is Loud**: The absence of elements IS the design. Spacing is the hero.

### 1.2 Design Principles
1. **Every pixel is deliberate.** Nothing is placed without intention.
2. **Motion communicates.** Animations aren't decoration — they carry meaning and pace.
3. **Typography does the heavy lifting.** Type is the primary visual element.
4. **Breathability over density.** When in doubt, add space.
5. **Classy restraint.** Never try too hard. The sophistication should feel effortless.

### 1.3 The Steve Jobs Principle
The site will feature, as a standalone full-bleed typographic section, the Jobs quote:
> *"Design is not just what it looks and feels like. Design is how it works."*
This section is a statement of personal philosophy. It earns its own moment.

---

## 2. TECHNICAL STACK

### 2.1 Framework
**Next.js 14+ (App Router)** — chosen for:
- Best-in-class performance + image optimization (critical for media-heavy portfolios)
- Static generation for fast initial load
- Vercel deployment with edge CDN (zero-config, industry standard)
- Excellent ecosystem for all animation libraries
- TypeScript support out of the box

### 2.2 Animation & 3D
| Library | Role |
|---|---|
| **GSAP + ScrollTrigger** | Primary animation engine. All scroll-driven reveals, section snap, text animations |
| **GSAP SplitText** | Character/word-level text animations for hero and section headers |
| **Three.js / React Three Fiber** | WebGL 3D elements (hero perspective transform, background depth) |
| **@react-three/drei** | Helper utilities for R3F |
| **Lenis** | Smooth inertia scroll. Synced with GSAP ScrollTrigger |
| **Framer Motion** | Section/page transition overlays (curtain wipes) |

### 2.3 Styling
- **Tailwind CSS** — utility-first, with custom design tokens
- **CSS Custom Properties** — for all design tokens (colors, spacing, type scale)
- Global grain/noise texture via SVG filter + CSS pseudo-element

### 2.4 Typography (Google Fonts + Variable)
| Role | Font | Weight |
|---|---|---|
| Display / Hero | **Cormorant Garamond** (serif, luxury) | 300, 700 |
| Primary Headlines | **Neue Haas Grotesk / PP Neue Montreal** → use **`DM Sans`** or **`Syne`** as open alternative | 400, 700, 800 |
| Body / UI | **Inter** → replaced with **`Outfit`** | 300, 400 |
| Quote / Editorial | Cormorant Garamond Italic | 300i |

> **Font Pairing Logic**: Display headings alternate between Cormorant (editorial luxury, Didot-like) and Syne (grotesque, Swiss force). Body uses Outfit for readability. The contrast between these two typeface personalities IS the brutalist-luxury aesthetic.

### 2.5 Color Palette
```
Background:     #F9F7F4  — warm off-white (primary canvas)
Surface:        #F0EDE8  — slightly darker warm white (cards, elevated surfaces)
Primary Text:   #0C0C0B  — near-black (not pure #000)
Secondary Text: #6B6760  — warm mid-grey
Muted Text:     #A8A49F  — light warm grey
Accent:         #C4B9AE  — nude stone (used sparingly: borders, dividers, highlights)
Grid Lines:     #E8E4DF  — barely-there structural lines
Hover:          #0C0C0B  — inverse (black bg, white text for hover states)
```

### 2.6 Deployment
- **Vercel** (primary) — zero-config, git-connected, edge CDN, analytics
- Domain: custom domain via Vercel DNS
- Environment: production + preview deployments on every PR

---

## 3. SITE ARCHITECTURE

```
/                     → Hero (full viewport, scrolljacked entry)
  ↓ scroll
/about                → About Me section
  ↓ scroll
/quote                → Steve Jobs Quote (full-bleed typographic interlude)
  ↓ scroll
/work                 → Projects (list with hover-preview → modal case study)
  ↓ scroll
/stack                → Skills & Stack
  ↓ scroll
/experience           → Experience Timeline
  ↓ scroll
/contact              → Contact & Social
```

**Navigation model**: Single-page app (SPA). All sections exist on one scrollable document. Lenis + GSAP ScrollTrigger handles the snap behavior. Projects open in a full-screen modal overlay with smooth transition — this preserves the scrolljack main flow while still allowing deep-dive case studies.

---

## 4. SECTIONS — DETAILED SPECIFICATION

### 4.1 LOADER
**Duration**: ~2.5–3 seconds
**Concept**: A monogram or name in thin grotesque type, centered, on `#0C0C0B` (dark background — the one dark moment before the white world opens). A horizontal loading bar in accent nude color ticks across. At 100%, the entire screen does a vertical split — two curtains sliding apart to reveal the white site beneath. Optionally: a brief grain texture flicker as it wipes.

**Behaviour**:
- On first visit only (sessionStorage flag)
- Progress bar animates from 0–100% in 2s
- At 100%, GSAP curtain split reveal (500ms)
- Site content begins animating in behind the curtain

---

### 4.2 HERO SECTION
**Layout**: Full viewport (`100dvh`). Centered typographic composition.

**The Perspective Scroll Effect**:
- At rest (scroll = 0): Your name renders in a small, flat, center-screen state — as if viewed from a great distance or a low angle. Think of the camera looking nearly parallel to a flat surface.
- As user scrolls: GSAP + perspective CSS transforms create the illusion of the camera pulling back and tilting upright — the name *rushes toward the viewer*, filling the viewport, as if the text is a physical object being raised.
- At full scroll threshold: Name is massive, brutalist, full-bleed, cropped by viewport edges intentionally.
- This is achieved via: `gsap.to()` on `perspective`, `rotateX`, `scale`, `letterSpacing`, and `opacity` simultaneously on scroll progress.

**Components**:
- Name: Cormorant Garamond, ultra-light (300), massive scale
- Role line: `Full-Stack Engineer · iOS Developer · Creative Technologist` — Syne, caps, tracked, small, below name
- Manifesto tagline: 1–2 lines, Outfit 300, warm grey, appears after name settles
- Scroll indicator: Animated thin vertical line with a dot that travels down it. "Scroll" in tiny caps beside it.
- Noise grain overlay: always present

**Manifesto Tagline** (placeholder — user to refine):
> *"I build things that work beautifully. I design things that work precisely."*

---

### 4.3 ABOUT ME SECTION
**Layout**: Two-column on desktop. Left: section label (`01 — About`), a sparse intro paragraph, a few key personal facts (city, availability, etc). Right: large editorial-style portrait placeholder (aspect ratio 3:4, warm-tinted). On mobile: single column, portrait above text.

**Typography**: Body in Outfit 300. A single large pull-quote in Cormorant Italic at the top of the section. 

**Content Placeholder** (exact spacing template):
```
[PULL QUOTE — 1 sentence, max 12 words, italic serif]

[INTRO PARAGRAPH — 3–4 lines. Who you are, what drives you.]

[SECONDARY PARAGRAPH — 2–3 lines. Your philosophy or approach.]

Based in [CITY]  ·  Open to [OPPORTUNITY TYPE]  ·  [YEAR] grad / [X] yrs exp
```

**Animation**: Section label and text split into lines, staggered up-reveal on scroll entry. Portrait fades + scales up slightly.

---

### 4.4 STEVE JOBS QUOTE SECTION
**Layout**: Full viewport. Black background (`#0C0C0B`). White text only.

**Typography**: Cormorant Garamond Italic, responsive fluid type (`clamp()`). The quote takes up ~60% of viewport width, centered. Attribution below in Syne small caps, accent color.

**Animation**: Each word of the quote reveals individually — a staggered scale+fade from slightly below. Feels like the words are being spoken, arriving one by one. Intentional slow timing — this moment is not rushed.

**Surrounding context**: This section acts as a "palate cleanser" between About and Work. It resets the visual register and reframes what follows.

---

### 4.5 WORK / PROJECTS SECTION
**Layout model**: The section snaps in (via ScrollTrigger) with a dark-curtain transition. The background shifts to `#F0EDE8` (surface, slightly darker).

**Project List Design**:
- Numbered list of projects (01, 02, 03...) in a clean table-like layout
- Each row: `[Number] — [Project Name] — [Type/Tag] — [Year]`
- On hover: a floating preview image appears near the cursor (follows mouse), slightly rotated, showing a project screenshot/mockup placeholder
- Hover also underlines project name with an animated line that wipes from left to right

**On Click → Full-Screen Modal Case Study**:
- A full-screen overlay slides up (Framer Motion `y: 100% → 0`)
- Contains: project hero image, project title, 1-paragraph description, tech stack used (as pill tags), and links (GitHub / Live)
- Background is dark (`#0C0C0B`) — intentional inversion for case study reading mode
- Close button (top-right `×`) slides the overlay back down

**Placeholder Projects** (to be replaced):
```
01 — Project Alpha      iOS App        2024
02 — Project Beta       Web Platform   2024
03 — Project Gamma      Full-Stack     2023
04 — Project Delta      Mobile / API   2023
```

---

### 4.6 SKILLS & STACK SECTION
**Layout**: Clean, structured, grouped. NOT a bar chart or percentage meter (those look amateur). Instead: a typographic grid of skill categories.

**Groups**:
- **Languages**: Swift, TypeScript, Python, JavaScript, Kotlin (placeholder)
- **Frontend**: React, Next.js, Three.js, GSAP, Tailwind
- **Backend**: Node.js, Express, PostgreSQL, REST, GraphQL
- **iOS**: SwiftUI, UIKit, CoreData, Xcode, TestFlight
- **Tools**: Git, Figma, Vercel, Docker, VS Code

**Visual Treatment**: Each group label in Syne caps. Skills as inline text tokens with a light border, nude background on hover. Subtle stagger-reveal animation on scroll.

---

### 4.7 EXPERIENCE / TIMELINE SECTION
**Layout**: Vertical timeline on the left (a thin vertical line in accent color). Each entry hangs off the timeline. Right side: role title, company, date range, 1-line description.

**Placeholder entries**:
```
[YEAR – YEAR]   [Role Title]       [Company Name]
                [1-line description of responsibilities / impact]

[YEAR – YEAR]   [Role Title]       [Company Name]
                [1-line description]

[YEAR]          [Education / Certification]   [Institution]
```

**Animation**: Timeline line draws itself from top to bottom as section scrolls into view (GSAP stroke-dashoffset on SVG line). Entries pop in sequentially.

---

### 4.8 CONTACT SECTION
**Layout**: Full viewport. Minimal. Centered. Dark background (matches loader — full circle, beginning and end are dark).

**Components**:
- Large display heading: *"Let's build something remarkable."* — Cormorant, massive
- Subtext: *"Currently open to full-time roles and select freelance projects."* — Outfit 300
- Large CTA email button: `[your@email.com]` — hover inverts (white bg → black text becomes black bg → white text), magnetic effect
- Social row: GitHub, LinkedIn, Twitter/X, Email — icon + label, horizontally spaced, hover underline
- Footer: Copyright line, year — tiny, warm grey

**Animation**: Heading does a slow, dramatic character-by-character reveal. Social icons stagger-fade in. All feel like a curtain call.

---

## 5. GLOBAL INTERACTION SYSTEM

### 5.1 Custom Cursor
- **Default state**: Small circle (~8px), filled `#0C0C0B`, no border
- **On hover over links/buttons**: Expands to ~40px, inverted (hollow, border only), with a slight lag (magnetic trailing effect)
- **On hover over project list items**: Transforms to show "View" text inside the circle
- **Magnetic effect**: Elements with `data-magnetic` attribute pull the cursor toward their center on nearby hover (GSAP + mouse tracking)
- **Jitter moment**: When transitioning between sections, cursor briefly jitters/glitches for 200ms — designed, not accidental

### 5.2 Scroll Architecture
- **Lenis** handles all scroll momentum and easing (`lerp: 0.08` for buttery feel)
- **GSAP ScrollTrigger** `scrub: true` for parallax effects
- **Section snapping**: `snap: 1` on major section breaks via ScrollTrigger
- **Mobile**: Standard momentum scroll (Lenis disabled on touch, native scroll used)

### 5.3 Section Transitions
Each section entry has its own personality:
- **Hero → About**: Smooth scroll, no hard cut
- **About → Quote**: Dark curtain wipe from bottom
- **Quote → Work**: Light curtain lifts up
- **Work → Stack**: Horizontal slide, grid-line flash
- **Stack → Experience**: Standard scroll, timeline draws in
- **Experience → Contact**: Dark curtain closes from top (like end credits)

### 5.4 Background Texture System
Two layers, always present:
1. **Noise/Grain**: SVG `feTurbulence` filter applied via CSS pseudo-element. Opacity ~4%. Adds tactile depth to the white canvas. Slightly animated (slow drift).
2. **Grid Lines**: Extremely subtle CSS grid of horizontal lines, `#E8E4DF`, spaced 80px apart. Opacity ~30%. Gives the page a ruled-paper / architectural drawing feel without being visible from a distance.

---

## 6. RESPONSIVE DESIGN

| Breakpoint | Strategy |
|---|---|
| Mobile (`< 768px`) | Single column. Scrolljack disabled. Lenis disabled. Native scroll. Type scales down with `clamp()`. |
| Tablet (`768–1024px`) | Hybrid layout. Some two-column sections collapse to one. Animations simplified. |
| Desktop (`> 1024px`) | Full experience. All animations, parallax, scrolljack, cursor effects active. |
| Large (`> 1440px`) | Max content width `1440px`. Generous outer margins. Typography scales up. |

---

## 7. PERFORMANCE TARGETS

| Metric | Target |
|---|---|
| Lighthouse Performance | > 90 |
| LCP (Largest Contentful Paint) | < 2.5s |
| CLS (Cumulative Layout Shift) | < 0.1 |
| TTI (Time to Interactive) | < 3.5s |
| Bundle Size (initial JS) | < 200KB gzipped |

**Strategies**:
- `next/font` for zero-FOUT font loading
- `next/image` for all images (WebP, lazy load, blur placeholder)
- GSAP loaded client-side only (`dynamic(() => import(...), { ssr: false })`)
- Three.js scene only mounted on desktop viewport (no WebGL on mobile)
- CSS animations used wherever GSAP is overkill (simple fades, micro-interactions)

---

## 8. FILE STRUCTURE

```
portfolio/
├── app/
│   ├── layout.tsx              # Root layout, fonts, metadata, cursor
│   ├── page.tsx                # Main SPA page — assembles all sections
│   └── globals.css             # Design tokens, base styles, grain overlay
├── components/
│   ├── Loader/
│   │   └── Loader.tsx          # Cinematic intro curtain
│   ├── Nav/
│   │   └── Nav.tsx             # Minimal floating navigation
│   ├── Cursor/
│   │   └── Cursor.tsx          # Custom magnetic cursor
│   ├── sections/
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Quote.tsx
│   │   ├── Work.tsx
│   │   ├── Stack.tsx
│   │   ├── Experience.tsx
│   │   └── Contact.tsx
│   ├── ui/
│   │   ├── SplitText.tsx       # GSAP SplitText wrapper
│   │   ├── MagneticButton.tsx  # Magnetic hover button
│   │   ├── ProjectModal.tsx    # Full-screen case study overlay
│   │   └── HoverImage.tsx      # Cursor-following project preview
│   └── three/
│       └── HeroScene.tsx       # R3F scene for hero perspective effect
├── lib/
│   ├── gsap.ts                 # GSAP instance + plugin registration
│   └── lenis.ts                # Lenis scroll instance
├── hooks/
│   ├── useScrollTrigger.ts
│   └── useMagneticCursor.ts
├── public/
│   ├── fonts/                  # Self-hosted font files
│   └── images/                 # Project screenshots, portrait
├── styles/
│   └── tokens.css              # All CSS custom properties
└── package.json
```

---

## 9. NAVIGATION

**Minimal floating nav** — top-right of screen, always visible.
- Contains: initials/monogram (left) + section links (right) in tiny Syne caps
- On scroll: nav background transitions from transparent → `rgba(249,247,244,0.85)` with backdrop blur
- Active section highlighted with accent underline
- Mobile: hamburger → full-screen menu overlay (dark background, large nav links, animated in)

---

## 10. METADATA & SEO

```
Title:          "[Your Name] — Full-Stack & iOS Engineer"
Description:    "Portfolio of [Your Name], a creative technologist building at the intersection of engineering and design."
OG Image:       Custom 1200×630 image (dark, name, role)
Canonical:      https://[yourdomain].com
Twitter Card:   summary_large_image
```

---

---

# CLAUDE BUILD PROMPTS

> Use these prompts sequentially in Claude to build the portfolio from foundation to final polish. Each prompt is self-contained and references the PRD above.

---

## PROMPT 1 — Project Scaffolding & Design System

```
You are an expert Next.js developer and creative technologist. Set up a production-ready Next.js 14+ portfolio project with the following exact specifications:

TECH STACK:
- Next.js 14 with App Router and TypeScript
- Tailwind CSS with custom config
- GSAP (with ScrollTrigger, SplitText plugins registered)
- Lenis for smooth scroll
- Framer Motion
- Three.js + React Three Fiber (@react-three/fiber) + @react-three/drei

DESIGN SYSTEM (implement as CSS custom properties in globals.css and Tailwind config):

Colors:
--bg-primary: #F9F7F4        /* warm off-white canvas */
--bg-surface: #F0EDE8        /* elevated surface */
--bg-dark: #0C0C0B           /* near-black for dark sections */
--text-primary: #0C0C0B
--text-secondary: #6B6760
--text-muted: #A8A49F
--accent: #C4B9AE             /* nude stone */
--grid-line: #E8E4DF

Typography:
- Import from Google Fonts: Cormorant Garamond (300, 300i, 700), Syne (400, 700, 800), Outfit (300, 400)
- Font variables: --font-display (Cormorant), --font-sans (Syne), --font-body (Outfit)
- Type scale using clamp() for fluid responsive sizes

Global styles to implement:
1. CSS noise/grain texture overlay on body using SVG feTurbulence filter via pseudo-element (opacity 4%, covers entire page, pointer-events none, fixed position)
2. Subtle CSS grid-line background (80px horizontal lines, --grid-line color, 30% opacity) also fixed, pointer-events none
3. Custom cursor: hide default cursor (cursor: none on *), set up a div#cursor that is a small 8px filled circle, and a div#cursor-follower that is a larger 40px hollow circle, both position fixed, pointer-events none. They follow the mouse with different lerp speeds (cursor: instant, follower: 0.15 lerp).
4. Smooth scroll behavior with Lenis, synced to GSAP ticker
5. Selection color styled to accent

File structure to create:
- app/layout.tsx (root layout with fonts, metadata, cursor, Lenis init)
- app/page.tsx (placeholder, imports all section components)
- app/globals.css (all design tokens, grain, grid, cursor base styles)
- styles/tokens.css (all CSS custom properties)
- lib/gsap.ts (GSAP instance, registers all plugins)
- lib/lenis.ts (Lenis singleton)
- components/Cursor/Cursor.tsx (cursor + follower component)
- components/Nav/Nav.tsx (minimal floating nav placeholder)

Generate all files with complete working code. Include all necessary package.json dependencies. The project must run with `npm run dev` without errors.
```

---

## PROMPT 2 — Cinematic Loader

```
Build the cinematic loader component for my portfolio. Reference this spec:

DESIGN:
- Full viewport, background #0C0C0B (dark — the only dark moment before the white site loads)
- Center: monogram "[INITIALS]" in Cormorant Garamond 300, ~80px, color #F9F7F4, letter-spaced
- Below monogram: a thin horizontal progress bar, 200px wide, 1px height, background #2A2A28
- Progress fill: animates from 0 to 100% width in 2000ms, fill color #C4B9AE (accent/nude)
- Percentage counter text (optional, small, Syne, below bar): counts 0 → 100
- Grain texture overlay present (inherits from global)

ANIMATION SEQUENCE:
1. On mount: monogram fades + slides up from 10px below (GSAP, 600ms, ease: power2.out)
2. Progress bar fills over 2000ms (GSAP, ease: none for linear feel)
3. At 100%: 200ms pause
4. CURTAIN REVEAL: The entire loader div splits into two halves (top and bottom, each 50vh) — top half slides up (y: -100%), bottom half slides down (y: 100%). Behind them, the site is visible. Duration 700ms, ease: expo.inOut.
5. Loader is then removed from DOM (display: none or unmount)

BEHAVIOUR:
- sessionStorage check: only show on first visit per session (key: 'loaderShown')
- Emits a callback/context when complete so the rest of the site knows to start its entry animations
- Must be a React component: components/Loader/Loader.tsx
- Integrate into app/layout.tsx or app/page.tsx appropriately

Also add a LoaderContext (contexts/LoaderContext.tsx) that provides `loaderComplete: boolean` to the entire app. Sections can use this to know when to start their entry animations.

Write complete, production-quality TypeScript code.
```

---

## PROMPT 3 — Hero Section (Perspective Typographic Reveal)

```
Build the Hero section for my portfolio. This is the most important and visually complex section.

THE CORE EFFECT — Perspective Scroll Transform:
Using GSAP ScrollTrigger + CSS 3D perspective, create this effect:
- At scroll position 0 (initial state): The name "[YOUR NAME]" is displayed in a flat, seemingly distant, slightly tilted perspective — as if the camera is looking nearly parallel to a flat surface. Achieve this via:
  - CSS: perspective: 800px on parent, rotateX: 60deg on the text, scale: 0.4, letter-spacing: 0.5em, opacity: 0.6
  - The text appears small, spread-wide, flat, almost like a horizon line
- As user scrolls (ScrollTrigger scrub): GSAP animates the text from that initial state to:
  - rotateX: 0deg (fully upright)
  - scale: 1.2 (slightly oversized — it should slightly crop at edges on purpose)
  - letter-spacing: -0.02em (tight, brutalist)
  - opacity: 1
  - The feeling is: the name *erupts* toward the viewer as they scroll

LAYOUT (at final state):
- Name: Cormorant Garamond 300, ~15vw font size (massive), centered, color #0C0C0B
- Below name (fades in after scroll settles): 
  - Role line: "Full-Stack Engineer · iOS Developer · Creative Technologist" — Syne 400, 11px, letter-spacing 0.3em, uppercase, color #6B6760
  - Manifesto (appears after role): "I build things that work beautifully. I design things that work precisely." — Outfit 300, 16px, color #A8A49F, centered, max-width 400px
- Scroll indicator (bottom center, always visible):
  - Thin vertical SVG line (40px tall), a dot animates down it in a loop
  - "Scroll" text in Syne 9px caps beside it

MAGNETIC CURSOR INTERACTION:
- The name text should have a subtle magnetic-like cursor interaction — hovering near the name causes the letters to very slightly distort/spread (GSAP + mouse tracking on individual characters via SplitText)

BACKGROUND:
- #F9F7F4 (inherits global grain + grid)
- No other decorative elements — the name IS the visual

Section height: 200vh (the extra 100vh is the scroll distance for the perspective transform)

Build: components/sections/Hero.tsx — complete working TypeScript/React code with all GSAP animations.
```

---

## PROMPT 4 — About Me Section

```
Build the About Me section for my portfolio.

LAYOUT (desktop, >1024px):
- Two columns: 45% left / 55% right, vertically centered
- Left column:
  - Section label: "01 — About" in Syne 400, 10px, letter-spacing 0.4em, uppercase, color #A8A49F
  - Pull quote: 1 italic serif sentence in Cormorant Garamond 300i, 28px, color #0C0C0B, max 12 words
    Placeholder: "I write code the way others compose music."
  - Body text block 1 (3–4 lines placeholder): Outfit 300, 16px, line-height 1.8, color #6B6760
    Placeholder: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation."
  - Body text block 2 (2–3 lines): same styling
    Placeholder: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore."
  - Meta info row: "Based in [City]  ·  Open to full-time  ·  Class of [Year]" — Syne 400, 11px, letter-spacing 0.2em, color #A8A49F, margin-top 2rem

- Right column:
  - A portrait image placeholder: aspect-ratio 3/4, background #E8E4DF (warm grey), max-height 520px
  - Placeholder: a centered "[ Photo ]" text in Syne, muted — styled to look like a design wireframe box
  - Thin 1px border, accent color (#C4B9AE)
  - Subtle hover: image box scales to 1.02, border color darkens

SCROLL ANIMATIONS (trigger when section enters viewport):
- Section label: fade up from 15px, delay 0
- Pull quote: each word reveals with a staggered upward clip (overflow hidden on parent, words slide up into view) — SplitText by words
- Body paragraphs: fade up, staggered by 120ms each line
- Portrait: fades in + scales from 0.95 to 1.0

MOBILE (<768px): single column, portrait first (full width), then text below

Build: components/sections/About.tsx — complete TypeScript/React with GSAP ScrollTrigger animations.
```

---

## PROMPT 5 — Steve Jobs Quote Section

```
Build the Steve Jobs Quote interlude section.

SPEC:
- Full viewport height (100vh), background #0C0C0B (dark)
- This is a visual palate-cleanser between About and Work

CONTENT:
- Quote: "Design is not just what it looks and feels like. Design is how it works."
- Attribution: "— Steve Jobs"

TYPOGRAPHY:
- Quote: Cormorant Garamond 300i (italic), fluid size clamp(32px, 5vw, 72px)
- Color: #F9F7F4
- Max-width: 65% of viewport, centered horizontally and vertically
- Line height: 1.4
- Attribution: Syne 400, 11px, letter-spacing 0.4em, uppercase, color #C4B9AE, margin-top 2rem

ANIMATION (trigger on section scroll into view):
- Each WORD of the quote animates in individually:
  - Start state: opacity 0, y: 20px, scale: 0.95
  - End state: opacity 1, y: 0, scale: 1
  - Stagger: 0.06s between each word
  - Ease: power3.out
  - Duration per word: 0.5s
- Attribution fades in 300ms after last word lands
- Total effect: feels like the quote is being spoken — words arrive with weight

SECTION TRANSITION:
- Entry: A dark curtain (matching bg color) wipes down from top to reveal this section as it scrolls into view
- This section has NO grain texture (break from the pattern — the pure dark is a moment of silence)
- Grid lines also hidden here

Build: components/sections/Quote.tsx — complete TypeScript/React with GSAP animations.
```

---

## PROMPT 6 — Work / Projects Section

```
Build the Work / Projects section with hover-preview list and full-screen modal case studies.

SECTION LAYOUT:
- Background: #F0EDE8 (surface, slightly off from main bg — signals a new "room")
- Section label: "02 — Work" (Syne caps, muted, top-left)
- A horizontal rule in accent color below the label

PROJECT LIST:
Build a table-like list of projects. Each row contains:
- Left: index number "01" — Syne 700, 13px, color #A8A49F
- Center-left: project name — Cormorant Garamond 700, 36px on desktop, color #0C0C0B
- Center-right: project type tag — Syne 400, 11px, letter-spacing 0.3em, uppercase, color #6B6760
- Right: year — Syne 400, 13px, color #A8A49F
- Full-width thin border-bottom in #E8E4DF between rows
- Row height: 80px

Placeholder projects:
01 | Project Alpha      | iOS Application   | 2024
02 | Project Beta       | Web Platform      | 2024
03 | Project Gamma      | Full-Stack App    | 2023
04 | Project Delta      | Mobile & API      | 2023

HOVER INTERACTIONS on each row:
1. Project name underline: a line wipes in from left to right (CSS clip-path or scaleX transform on a pseudo-element)
2. Entire row background: very subtly shifts to #E8E4DF
3. Floating preview image: a div (200×140px) follows the mouse cursor, slightly rotated (-3deg), shows a placeholder image (grey rectangle with project name). It appears on row hover with a scale-in from 0.8 to 1.0, and trails the cursor position with a lerp factor of 0.12 (smooth lag). This is positioned fixed, pointer-events none.
4. Cursor transforms: when hovering a row, the cursor expands and shows "View" text inside it

ON CLICK — Full-Screen Case Study Modal:
- A full-screen overlay (position: fixed, inset 0, z-index 100) slides up from bottom (y: 100% → 0%, Framer Motion, duration 0.6s, ease: [0.76, 0, 0.24, 1])
- Modal background: #0C0C0B
- Modal content (white text on dark):
  - Top bar: project number + name (Cormorant 300, large), close button (×) top-right
  - Hero placeholder image: full-width, 50vh height, background #1A1A18
  - Below: two columns
    - Left: project description (2 paragraphs placeholder), tech stack pills (Syne 10px, bordered pills in accent)
    - Right: links — "View Live ↗" and "GitHub ↗" as large hover-underline links
- Close: click × OR press Escape key → slides back down
- Body scroll locked while modal is open

SCROLL ANIMATIONS for list:
- Rows stagger in from opacity 0, y: 30px, stagger 0.1s each on section enter

Build: components/sections/Work.tsx + components/ui/ProjectModal.tsx + components/ui/HoverImage.tsx — complete TypeScript/React.
```

---

## PROMPT 7 — Skills & Experience Sections

```
Build two sections: Skills/Stack and Experience/Timeline.

=== SKILLS / STACK SECTION ===

LAYOUT:
- Background: #F9F7F4 (returns to main bg)
- Section label: "03 — Stack" (Syne caps, muted)
- NOT a bar chart. A typographic grid of skill groups.

Layout: CSS grid, 3 columns on desktop, 2 on tablet, 1 on mobile

Each group card:
- Group label: Syne 700, 11px, letter-spacing 0.4em, uppercase, color #A8A49F, border-bottom 1px #E8E4DF, padding-bottom 8px, margin-bottom 16px
- Skills: displayed as inline pill tokens
  - Outfit 300, 13px
  - Padding: 6px 14px
  - Border: 1px solid #E8E4DF
  - Background: transparent
  - On hover: background #0C0C0B, color #F9F7F4, border-color #0C0C0B — transition 200ms
  - Slight letter-spacing 0.05em

Groups and skills (placeholders, user will update):
- Languages: Swift, TypeScript, Python, JavaScript, Dart
- Frontend: React, Next.js, Three.js, GSAP, Tailwind CSS
- Backend: Node.js, Express, PostgreSQL, REST APIs, GraphQL
- iOS: SwiftUI, UIKit, CoreData, Xcode, TestFlight
- Tools & Platforms: Git, Figma, Vercel, Docker, Firebase

ANIMATION: Group cards stagger-fade-up on scroll entry. Skills pills stagger in within each card after the card appears.

=== EXPERIENCE / TIMELINE SECTION ===

LAYOUT:
- Background: #F9F7F4
- Section label: "04 — Experience"
- Left side: thin vertical SVG line (the timeline spine), 2px, color #C4B9AE
- Timeline entries hang off this spine

Each entry:
- A small circle node on the spine (6px, filled #C4B9AE)
- To the right of the spine: 
  - Date range: Syne 400, 11px, color #A8A49F, margin-bottom 4px
  - Role title: Syne 700, 18px, color #0C0C0B
  - Company: Cormorant Garamond 300i, 18px, color #6B6760 — beside role with " · " separator
  - Description: Outfit 300, 14px, line-height 1.7, color #6B6760, max-width 480px

Placeholder entries:
2023–Present | Senior Engineer / Lead    | [Company Name]     | "Brief description of role, impact, key responsibility."
2021–2023    | Full-Stack Developer      | [Company Name]     | "Brief description."
2020–2021    | iOS Developer (Intern)    | [Company Name]     | "Brief description."
2020         | BSc Computer Science      | [University Name]  | "Graduated with First Class Honours."

TIMELINE ANIMATION:
- The vertical SVG line draws itself from top to bottom using stroke-dashoffset animation as section scrolls in (GSAP ScrollTrigger scrub)
- Each entry fades in from opacity 0, x: 20px as the timeline line passes its node point
- Circle nodes scale from 0 to 1 as line reaches them

Build: components/sections/Stack.tsx and components/sections/Experience.tsx — complete TypeScript/React.
```

---

## PROMPT 8 — Contact Section & Navigation

```
Build the Contact section and the global Navigation component.

=== CONTACT SECTION ===

LAYOUT:
- Full viewport (100dvh), background #0C0C0B (dark — mirrors loader, bookends the experience)
- Everything centered, vertically and horizontally

COMPONENTS:
1. Availability badge (top-center):
   - Small pill: a pulsing green dot (CSS keyframe animation) + "Available for opportunities" text
   - Syne 400, 11px, letter-spacing 0.2em, color #A8A49F
   - Border: 1px solid #2A2A28, padding 6px 16px, border-radius 100px

2. Main heading:
   - "Let's build something remarkable." 
   - Cormorant Garamond 300, clamp(40px, 7vw, 96px), color #F9F7F4
   - Line-break after "something" on smaller screens

3. Subtext:
   - "Currently open to full-time roles and select freelance projects."
   - Outfit 300, 16px, color #6B6760, margin-top 16px

4. Email CTA button:
   - "[your@email.com]" — displayed as a large button
   - Syne 700, 20px
   - Border: 1px solid #3A3A38
   - Padding: 18px 40px
   - Background: transparent, color: #F9F7F4
   - Hover: background #F9F7F4, color #0C0C0B, border-color #F9F7F4 — transition 300ms ease
   - Magnetic effect: button shifts slightly toward cursor on hover (useMagneticCursor hook)
   - onClick: mailto link

5. Social links row (below CTA):
   - GitHub, LinkedIn, Twitter/X, Email icons + labels
   - Arranged horizontally, spaced evenly, centered
   - Each: icon (Lucide or inline SVG) + label in Syne 11px caps, color #6B6760
   - Hover: color shifts to #F9F7F4, underline wipes in from left
   - Spacing: 40px between each

6. Footer bar (very bottom, full-width):
   - Left: "© [YEAR] [Your Name]" — Syne 400, 11px, #3A3A38
   - Right: "Designed & Built with intention" — Syne 400, 11px, #3A3A38
   - Separated by a thin top border #2A2A28

ANIMATIONS:
- Heading: character-by-character reveal (SplitText by chars) — stagger 0.03s, opacity 0→1, y: 10px→0
- All other elements: stagger-fade-up after heading completes

=== NAVIGATION COMPONENT ===

DESIGN:
- Position: fixed, top 0, full width, z-index 50
- Padding: 24px 48px (desktop), 16px 24px (mobile)
- Two ends:
  - Left: monogram "[INITIALS]" — Cormorant Garamond 300, 20px, color #0C0C0B (inverts to #F9F7F4 on dark sections)
  - Right: section links — "About · Work · Stack · Experience · Contact" in Syne 400, 11px, letter-spacing 0.3em, uppercase, color #6B6760
- Background: transparent by default → rgba(249,247,244,0.85) + backdrop-filter: blur(12px) on scroll (>50px)
- Active section: the corresponding nav link gets a tiny dot indicator below it (4px circle, accent color)
- Color inversion: when viewport is inside a dark section (Quote or Contact), all nav text inverts to light colors — use IntersectionObserver to detect dark sections and toggle a `data-dark-nav` attribute

MOBILE NAV (<768px):
- Hide section links
- Show hamburger (three thin horizontal lines, Syne)
- On open: full-screen overlay, background #0C0C0B, section links centered vertically in large Cormorant type (48px), staggered fade-in

Build: components/sections/Contact.tsx and components/Nav/Nav.tsx — complete TypeScript/React.
```

---

## PROMPT 9 — Cursor, Magnetic Effects & Polish Pass

```
Implement the full custom cursor system and global magnetic interaction effects, then do a complete polish pass.

=== CUSTOM CURSOR SYSTEM ===

Build components/Cursor/Cursor.tsx:

State machine — the cursor has these states:
1. DEFAULT: small 8px filled circle (#0C0C0B), hidden on dark sections (#F9F7F4)
2. HOVER_LINK: expands to 40px hollow circle (border 1.5px, same color), slight spring overshoot on expand
3. HOVER_PROJECT: 64px circle with "View →" text inside (Syne 10px, centered), rotates slowly
4. HOVER_MAGNETIC: cursor disappears (opacity 0) — the magnetic element visually tracks cursor instead
5. JITTER (transition state): when section changes, cursor rapidly jitters position ±4px for 200ms (GSAP shake keyframes)

Implementation:
- Two DOM elements: #cursor (8px dot, instant tracking) and #cursor-follower (40px ring, lerp: 0.12)
- Mouse position tracked globally via mousemove, stored in a ref
- GSAP ticker updates follower position: lerp(current, target, 0.12) on each tick
- State controlled via Context: CursorContext with setCursorState()
- All interactive elements call setCursorState on mouseenter/mouseleave via a custom useCursor hook

=== MAGNETIC BUTTON SYSTEM ===

Build components/ui/MagneticButton.tsx:
- Wraps any element with data-magnetic attribute
- On mousemove within 80px radius of element center: element shifts toward cursor
  - Shift amount: (cursorPos - elementCenter) * 0.35 (35% of distance)
  - GSAP: gsap.to(element, { x: shiftX, y: shiftY, duration: 0.3, ease: 'power2.out' })
- On mouseleave: gsap.to(element, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' }) — elastic snap back
- Apply to: email CTA button, nav monogram, social link icons

=== POLISH PASS ===

Apply these site-wide refinements:

1. PAGE TRANSITIONS between section scrolljack snaps:
   - A thin horizontal line (2px, accent color) sweeps across the full width in 300ms as each section snaps in
   - This acts as a "divider wipe" — feels like a film cut

2. TEXT SELECTION styling:
   - ::selection { background: #0C0C0B; color: #F9F7F4; }

3. SCROLLBAR:
   - Custom scrollbar: width 4px, track: transparent, thumb: #C4B9AE, border-radius 2px
   - Only visible on desktop hover

4. LINK HOVER UNDERLINES:
   - All anchor tags: custom underline that fills from left using CSS clip-path or background-size animation
   - No default browser underline styling anywhere

5. FOCUS STYLES:
   - Replace default browser outline with: outline: 2px solid #C4B9AE, outline-offset: 4px

6. REDUCED MOTION:
   - @media (prefers-reduced-motion: reduce): disable all GSAP animations, use simple opacity transitions only

7. FONT RENDERING:
   - -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility; on body

8. IMAGE OPTIMIZATION:
   - All images use next/image with priority on hero, blur placeholder everywhere else

9. META TAGS:
   - Complete OG tags, twitter:card, canonical, manifest.json, favicon (simple monogram)

Write all complete code for cursor system and apply all polish items with exact implementation.
```

---

## PROMPT 10 — Final Integration, Performance & Deployment

```
Perform final integration, performance optimization, and deployment configuration for the portfolio.

=== FINAL INTEGRATION ===

1. Wire all sections into app/page.tsx in correct order:
   Loader → Nav → Hero → About → Quote → Work → Stack → Experience → Contact
   
2. LoaderContext: ensure loaderComplete gates all section entry animations (nothing animates until loader is done)

3. ScrollTrigger section snapping: configure Lenis + GSAP ScrollTrigger to snap between these sections:
   - hero, about, quote, work, stack, experience, contact
   - scrub: true for within-section parallax
   - snap: { snapTo: 1, duration: 0.5, ease: 'power2.inOut' } on section boundaries

4. Dark section detection: IntersectionObserver watching .section-dark (Quote and Contact) to toggle nav color inversion

5. Mobile detection: disable scrolljack, Lenis, cursor effects, and Three.js scene on touch devices / <768px

=== PERFORMANCE OPTIMIZATION ===

1. Dynamic imports for heavy libraries:
   const HeroScene = dynamic(() => import('@/components/three/HeroScene'), { ssr: false })
   GSAP plugins loaded client-side only

2. next.config.js:
   - Enable image optimization domains
   - Bundle analyzer setup
   - Compiler options for production

3. Font optimization:
   - Use next/font/google for Cormorant Garamond, Syne, Outfit
   - display: 'swap', preload: true

4. Lazy loading:
   - All sections below the fold use React.lazy or dynamic()
   - Images use next/image with lazy loading (except hero)

=== DEPLOYMENT CONFIGURATION ===

1. vercel.json:
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" }
      ]
    }
  ]
}

2. .env.example with placeholder variables

3. README.md with:
   - Project overview
   - Local setup instructions (npm install, npm run dev)
   - How to update content (which files to edit for name, bio, projects, etc.)
   - Deployment steps (push to GitHub → auto-deploy on Vercel)

4. Generate a sitemap.xml and robots.txt in /public

Run a final check: npm run build must complete with 0 errors. Fix any TypeScript errors, missing imports, or build warnings. The site should score >90 on Lighthouse performance.
```

---

## BONUS PROMPT — Content Fill & Personalization

```
I'm ready to fill in my personal content. Replace all placeholders in the portfolio with my real information:

NAME: [Your Full Name]
INITIALS: [XX]
ROLE: Full-Stack Engineer · iOS Developer · Creative Technologist
LOCATION: [Your City, Country]
EMAIL: [your@email.com]
GITHUB: github.com/[username]
LINKEDIN: linkedin.com/in/[username]
TWITTER: twitter.com/[username]

MANIFESTO: [Your 1-2 line positioning statement]

ABOUT PULL QUOTE: [Your 1 sentence, max 12 words, italic]
ABOUT PARA 1: [3-4 lines about who you are]
ABOUT PARA 2: [2-3 lines about your philosophy]
AVAILABILITY: [Full-time / Freelance / Both]

PROJECTS:
01 | [Project Name] | [Type] | [Year] | [Description] | [GitHub URL] | [Live URL] | [Stack: comma separated]
02 | [Project Name] | [Type] | [Year] | [Description] | [GitHub URL] | [Live URL] | [Stack: comma separated]
[continue as needed]

EXPERIENCE:
[Date] | [Role] | [Company] | [1-line description]
[repeat]

EDUCATION:
[Year] | [Degree] | [Institution]

Replace every placeholder in every component file with this real data. Keep all animations and styles intact.
```

---

*PRD Version 1.0 — Generated from design interview*
*Framework: Next.js 14 · Stack: GSAP + Three.js + Lenis + Framer Motion*
*Aesthetic: Brutalist-Luxury · White Dominant · Cormorant × Syne*
