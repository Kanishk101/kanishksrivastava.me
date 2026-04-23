# AGENT PROMPT — Portfolio Website Complete Overhaul
### Repository: `Kanishk101/kanishksrivastava.me`
### Stack: Next.js 14 · TypeScript · GSAP · Lenis · Framer Motion · Three.js / R3F · Tailwind CSS

---

## YOUR MISSION

You are executing a complete overhaul of a personal portfolio website. This document is your **single source of truth**. It contains:

1. A full audit of every bug and issue found
2. The complete design enhancement specification
3. Exact implementation instructions for every fix and feature
4. File-by-file action items

**Read every section before writing a single line of code.** Understand the full scope first, then execute sequentially.

**Design philosophy to hold throughout**: Brutalist-Luxury. White dominant (`#F9F7F4`). Grotesque + Serif type pairing. Maximum motion, minimum clutter. Every animation is intentional. Every pixel earns its place.

---

## PART 1 — COMPLETE BUG AUDIT

### 🔴 CRITICAL BUGS (break the experience)

---

#### BUG 1 — Hero captions permanently hidden by About section
**File**: `src/components/sections/Hero.tsx`
**Root cause**: The section is `300vh` tall. Role text and manifesto are wired to appear at scroll progress `0.45` and `0.52` of the ScrollTrigger scrub timeline. However, the About section's ScrollTrigger fires at roughly `65%` of this window, which means it begins stealing scroll events and the pin releases before the captions ever get a chance to appear. They are only visible briefly when scrolling back up.

**Fix**:
- Increase section height from `300vh` to `400vh`
- Move role text reveal to scroll progress `0.62`
- Move manifesto reveal to scroll progress `0.70`
- Add `clearProps: "filter"` after blur-in animations to prevent GPU layer retention

---

#### BUG 2 — Project modal scrolls the page instead of itself
**File**: `src/components/sections/Work.tsx`
**Root cause**: The modal uses `document.body.style.overflow = 'hidden'` to lock the page — but **Lenis bypasses this entirely**. Lenis operates on the `<html>` element's scroll, not `document.body`, so the body overflow lock has zero effect. The page scrolls underneath the open modal.

**Fix**:
```ts
// On modal OPEN:
getLenis()?.stop();
document.body.style.overflow = 'hidden'; // belt-and-suspenders

// On modal CLOSE:
getLenis()?.start();
document.body.style.overflow = '';
```
Also ensure the modal `motion.div` has `overflowY: 'auto'` and `-webkit-overflow-scrolling: 'touch'` and is tall enough to require internal scrolling.

---

#### BUG 3 — Lenis NOT synced with GSAP ScrollTrigger (causes drift)
**File**: `src/lib/lenis.ts`
**Root cause**: GSAP ScrollTrigger reads the native browser scroll position. Lenis intercepts scroll and prevents native scroll from updating. The two systems drift — ScrollTrigger animations fire at wrong scroll positions, parallax is choppy, and scrub timelines desync.

**Fix** — add this immediately after Lenis instantiation:
```ts
lenisInstance.on('scroll', () => {
  ScrollTrigger.update();
});
```
This is the canonical fix. Without it, every single ScrollTrigger animation in the site is broken.

---

#### BUG 4 — Cursor SSR hydration mismatch
**File**: `src/components/Cursor/Cursor.tsx`
**Root cause**: The current code does `if (typeof window !== "undefined" && window.matchMedia(...).matches) return null` at render time. This runs differently on server vs client, causing React hydration mismatch errors and a console warning storm.

**Fix**: Replace with a `mounted` state:
```tsx
const [mounted, setMounted] = useState(false);
useEffect(() => { setMounted(true); }, []);
if (!mounted) return null;
```

---

#### BUG 5 — Global magnetic effect not wired up
**File**: `src/components/Cursor/Cursor.tsx`
**Root cause**: The `data-magnetic` attribute exists on elements throughout the site, but there is no global listener that applies the magnetic shift effect to them. The cursor *state* changes to `HOVER_PROJECT` but the element itself never moves.

**Fix**: Inside `Cursor.tsx`, after mount, query all `[data-magnetic]` elements and attach `mousemove` + `mouseleave` listeners:
```ts
const magneticEls = Array.from(document.querySelectorAll<HTMLElement>('[data-magnetic]'));
magneticEls.forEach(el => {
  el.addEventListener('mousemove', (e) => {
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.hypot(dx, dy);
    if (dist < 100) {
      const s = (1 - dist / 100) * 0.38;
      gsap.to(el, { x: dx * s, y: dy * s, duration: 0.3, ease: 'power2.out' });
    }
  });
  el.addEventListener('mouseleave', () => {
    gsap.to(el, { x: 0, y: 0, duration: 0.55, ease: 'elastic.out(1, 0.3)' });
  });
});
```

---

#### BUG 6 — No click effect on cursor
**File**: `src/components/Cursor/Cursor.tsx`
**Root cause**: No `click` event listener exists anywhere.

**Fix**: Add `window.addEventListener('click', handleClick)` where `handleClick`:
1. Creates a div at `e.clientX / e.clientY` with a border-radius 50%, border `1.5px solid var(--accent)`, starting at 4×4px
2. Animates `scale: 16, opacity: 0` over 0.6s with GSAP and removes on complete (ripple shockwave)
3. Simultaneously animates the cursor dot: `gsap.fromTo(dot, { scaleX: 2.2, scaleY: 0.4 }, { scaleX: 1, scaleY: 1, duration: 0.55, ease: 'elastic.out(1.2, 0.35)' })` (squash-spring morph)

---

#### BUG 7 — `section.section` has `overflow: hidden` globally
**File**: `src/app/globals.css`
**Root cause**: The `.section` class has `overflow: hidden` which clips the floating hover image in Work (it gets cut off at the section boundary) and prevents any parallax elements from escaping section boundaries for depth effect.

**Fix**: Remove `overflow: hidden` from `.section`. Add `overflow: hidden` only to specific elements that actually need clipping (e.g., `.text-clip` wrappers for text reveals).

---

#### BUG 8 — Grain texture shows through Quote section
**File**: `src/app/globals.css` + `src/components/sections/Quote.tsx`
**Root cause**: `body::before` is `position: fixed` and covers the entire viewport always. `isolation: isolate` on a child element does not prevent a fixed-position ancestor pseudo-element from showing through.

**Fix**: Give the Quote section `position: relative; z-index: 1` and add a `::before` pseudo-element on `.section-dark` that is `position: absolute; inset: 0; z-index: 9991; background: var(--bg-dark)` — this covers the grain layer (z-index 9990) within dark sections by sitting one layer above it while the dark section itself establishes a stacking context.

Alternatively (simpler): set grain `body::before` to `mix-blend-mode: overlay` — this makes it invisible on very dark backgrounds naturally.

---

#### BUG 9 — Placeholder social links go to GitHub/LinkedIn homepages
**Files**: `src/components/sections/Contact.tsx`, `src/components/Nav/Nav.tsx`
**Root cause**: Social URLs are set to `https://github.com/` etc. with no username path.

**Fix**: Create `src/lib/constants.ts`:
```ts
export const SOCIAL = {
  github: 'https://github.com/Kanishk101',
  linkedin: 'https://linkedin.com/in/[YOUR_LINKEDIN_HANDLE]',
  twitter: 'https://twitter.com/[YOUR_TWITTER_HANDLE]',
  email: 'hello@kanishksrivastava.me',
};
```
Import and use `SOCIAL` everywhere social links appear. Replace all hardcoded URLs.

---

#### BUG 10 — Cursor distort effect only works on Hero typography
**File**: `src/components/sections/Hero.tsx` + `src/components/Cursor/Cursor.tsx`
**Root cause**: The character-distort mousemove handler is only attached inside `Hero.tsx` to `charsRef`. No other interactive text elements have this treatment.

**Fix**: The global magnetic effect (BUG 5 fix) covers this broadly. Additionally, all section headings should get `data-magnetic` so the magnetic cursor behavior applies site-wide.

---

### 🟠 SIGNIFICANT IMPLEMENTATION GAPS

---

#### GAP 1 — All post-Hero sections are free scroll with no parallax
**Current state**: About, Quote, Work, Stack, Experience, Contact all use `toggleActions: "play none none reverse"` only — simple entrance animations, no scrub, no depth, no parallax motion. Once you scroll past the hero the entire page is flat.

**Required**: Every section needs `scrub: true` on at least one GSAP timeline for continuous scroll-tied motion. Detailed spec in Part 2.

---

#### GAP 2 — Section color alternation is jarring (no transition)
**Current state**: White → White → **Black** (Quote) → White → White → White → **Black** (Contact). The dark sections appear abruptly with no transition whatsoever.

**Required**: A cinematic gradient bridge between Hero and Quote (and between Experience and Contact). Details in Part 2 — Design Spec.

---

#### GAP 3 — No horizontal scroll moments or carousels
**Required**: 
1. Sticky horizontal pill carousel in Stack section (progresses via vertical scroll)
2. Marquee hover band on project rows in Work section

---

#### GAP 4 — No typography animation beyond Hero's perspective effect
**Required**: All section headings throughout the site should use the **mask-wipe + blur-to-sharp combo** — text hidden behind a clip container that wipes open on scroll entry, combined with `filter: blur(8px) → blur(0px)`.

---

#### GAP 5 — Experience timeline has no draw animation
**Required**: The vertical SVG timeline line draws itself using `stroke-dashoffset` as section scrolls. Entries animate in sequentially as the line passes each node.

---

#### GAP 6 — No editorial depth layer (ghost numbers, column lines)
**Required**: Ghost section numbers (`01`, `02`, `03`, `04`) watermarked behind content. Vertical column grid lines. Both via CSS — no JS needed.

---

#### GAP 7 — Cursor is reactive only to links/buttons — not all content
**Required**: Cursor state machine must respond to:
- `[data-cursor="pointer"]` → HOVER_PROJECT state (large ring with "View →")
- `[data-magnetic]` → magnetic shift on element
- All `<a>` and `<button>` → HOVER_LINK state (expanded ring)
- Dark sections → cursor color inverts to `var(--text-light)`
- Section transitions → JITTER state (200ms designed glitch)

---

#### GAP 8 — No `robots.txt`, `sitemap.xml`, manifest, or OG tags
**Files needed**: `public/robots.txt`, `public/sitemap.xml`, `public/site.webmanifest`  
**Fix**: Create all three. Add complete OG + Twitter meta tags to `app/layout.tsx`.

---

#### GAP 9 — `AGENTS.md` and `Progress-1.md` in repo root
**Fix**: Move both files to a `.internal/` folder or add to `.gitignore`. They look unprofessional in a public portfolio repo.

---

## PART 2 — COMPLETE DESIGN ENHANCEMENT SPECIFICATION

---

### 2.1 DESIGN TOKENS (ensure these are all present in `src/styles/tokens.css`)

```css
:root {
  /* Colors */
  --bg-primary:        #F9F7F4;   /* warm off-white — main canvas */
  --bg-surface:        #F0EDE8;   /* slightly darker — work/stack sections */
  --bg-dark:           #0C0C0B;   /* near-black — quote, contact */
  --bg-dark-elevated:  #161614;   /* cards inside dark sections */
  --bg-dark-subtle:    #1A1917;   /* gradient midpoint */
  --bg-dark-border:    #2A2A28;   /* borders inside dark sections */
  --text-primary:      #0C0C0B;
  --text-secondary:    #6B6760;
  --text-muted:        #A8A49F;
  --text-light:        #F9F7F4;
  --accent:            #C4B9AE;   /* nude stone */
  --accent-warm:       #B8A99A;   /* slightly darker nude */
  --grid-line:         #E8E4DF;

  /* Typography */
  --font-cormorant:    'Cormorant Garamond', Georgia, serif;
  --font-syne:         'Syne', system-ui, sans-serif;
  --font-outfit:       'Outfit', system-ui, sans-serif;

  /* Type Scale (fluid, clamp-based) */
  --text-display-xl:   clamp(64px, 12vw, 160px);
  --text-display-lg:   clamp(48px, 8vw, 120px);
  --text-display-md:   clamp(36px, 5vw, 80px);
  --text-display-sm:   clamp(28px, 3.5vw, 56px);
  --text-heading:      clamp(22px, 2.5vw, 36px);
  --text-label:        11px;
  --text-body:         16px;
  --text-small:        13px;
  --text-micro:        10px;

  /* Spacing */
  --space-xs:    8px;
  --space-sm:    16px;
  --space-md:    24px;
  --space-lg:    40px;
  --space-xl:    64px;
  --space-2xl:   96px;
  --space-3xl:   140px;

  /* Layout */
  --max-content:     1440px;
  --nav-height:      72px;

  /* Animation */
  --duration-fast:   150ms;
  --duration-base:   300ms;
  --duration-slow:   600ms;
  --duration-xslow:  1000ms;
  --ease-out:        cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out:     cubic-bezier(0.76, 0, 0.24, 1);

  /* Marquee */
  --marquee-duration: 20s;
}
```

---

### 2.2 TYPOGRAPHY SYSTEM

**Font pairing principle**: Every section heading alternates between **Cormorant Garamond** (luxury editorial serif) and **Syne 800** (grotesque bruiser). The visual tension between them IS the brutalist-luxury aesthetic. Do not use them at the same weight — Cormorant always at 300 or 700, Syne always at 700 or 800.

**Typography entrance animation** — apply to ALL section headings site-wide:

This is a **two-layer animation** applied simultaneously on scroll entry:

**Layer 1 — Mask Wipe (per word)**:
1. Wrap each word in `<span class="text-clip">` (overflow: hidden)
2. Inside each clip, wrap the word in `<span class="text-clip-inner">`
3. On scroll entry: GSAP animates `.text-clip-inner` from `y: 110%` to `y: 0%`, staggered 0.08s per word

**Layer 2 — Blur to Sharp (on the whole heading)**:
GSAP simultaneously animates the heading element from `filter: blur(8px)` to `filter: blur(0px)` over 0.7s

Combined: `gsap.to(clipInners, { y: '0%', stagger: 0.08, duration: 0.7, ease: 'power3.out' })` alongside `gsap.to(heading, { filter: 'blur(0px)', duration: 0.7 })`

---

### 2.3 HERO SECTION — Enhanced

**File**: `src/components/sections/Hero.tsx`

The hero scroll timeline (400vh total, scrub: 0.8, pin: true) must have these phases:

**Phase 1 (0% → 55%)** — Name perspective eruption:
```
FROM: { rotateX: 60, rotateY: -10, scale: 0.4, letterSpacing: '0.5em', opacity: 0.6 }
TO:   { rotateX: 0,  rotateY: 0,   scale: 1.05, letterSpacing: '-0.02em', opacity: 1 }
ease: 'none'
```
The `rotateY: -10 → 0` is the "camera pan" — it gives the illusion of the 3D camera tilting into alignment.

**Phase 2 (55% → 70%)** — Gradient bridge starts (hero → quote):  
A `position: absolute; inset: 0` div (`gradientBridgeRef`) fades in, transitioning from `rgba(12,12,11,0)` to `rgba(12,12,11,0.85)`:
```
gsap.to(gradientBridge, { opacity: 1, duration: 0.25 }, 0.55)
```
This creates the cinematic darkening-as-you-scroll-deeper effect.

**Phase 3 (62% → 70%)** — Role + manifesto reveal:
```
role:      { opacity: 0, y: 20, filter: 'blur(6px)' } → { opacity: 1, y: 0, filter: 'blur(0px)' } at 0.62
manifesto: { opacity: 0, y: 16, filter: 'blur(4px)' } → { opacity: 1, y: 0, filter: 'blur(0px)' } at 0.70
```

**Phase 4 (75%)** — Scroll indicator fades out as dark takes over.

**Gradient bridge div** (add to Hero JSX, after the name container):
```tsx
<div
  ref={gradientBridgeRef}
  style={{
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to bottom, transparent 0%, #0C0C0B 100%)',
    opacity: 0,
    pointerEvents: 'none',
    zIndex: 2,
  }}
/>
```

**Layout styles** (Syne 800 on role line):
- Name: `font-family: var(--font-cormorant)`, `font-weight: 300`, `font-size: var(--text-display-xl)`, `letter-spacing: -0.02em`
- Role: `font-family: var(--font-syne)`, `font-weight: 800`, `font-size: var(--text-label)`, `letter-spacing: 0.4em`, `text-transform: uppercase`, `color: var(--text-secondary)`
- Manifesto: `font-family: var(--font-outfit)`, `font-weight: 300`, `font-size: 17px`, `color: var(--text-muted)`, `max-width: 420px`
- Section height: `400vh`
- Perspective on name container parent: `perspective: 1000px`, `transform-style: preserve-3d`

---

### 2.4 MARQUEE BAND (between Hero and About)

**File**: Create `src/components/ui/MarqueeBand.tsx`

A full-width horizontal ticker that sits between Hero and About sections. Creates momentum and flow between the cinematic Hero reveal and the calmer About section.

**Design**:
- Height: 48px
- Background: `var(--bg-dark)` (dark band — creates a thin dark stripe that foreshadows the Quote section's dark palette)
- Text: `Full-Stack Engineer · iOS Developer · Creative Technologist · Available · Kanishk Srivastava ·` repeated
- Font: `Syne 800`, 11px, letter-spacing 0.35em, uppercase, `color: var(--accent)` (nude)
- Two tracks: one forward, one reverse (slightly different content), stacked vertically
- CSS animation: `marqueeScroll` and `marqueeScrollReverse` (add keyframes to globals.css)
- Pauses on hover

```tsx
const ITEMS = ['Full-Stack Engineer', 'iOS Developer', 'Creative Technologist', 'Available', 'Kanishk Srivastava'];

export default function MarqueeBand() {
  const text = ITEMS.map(i => `${i} · `).join('').repeat(6);
  return (
    <div style={{ overflow: 'hidden', background: 'var(--bg-dark)', height: '48px', display: 'flex', alignItems: 'center' }}>
      <div className="marquee-track" style={{ '--marquee-duration': '20s' } as React.CSSProperties}>
        <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: '10px', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'var(--accent)', whiteSpace: 'nowrap' }}>
          {text}
        </span>
      </div>
    </div>
  );
}
```

---

### 2.5 ABOUT SECTION — Enhanced with parallax

**File**: `src/components/sections/About.tsx`

**Ghost number**: Add `<div className="ghost-number">01</div>` inside the section (position absolute, z-index 0). Content sits above it at z-index 1.

**Parallax on portrait**: The portrait image box should have a GSAP ScrollTrigger with `scrub: 1` that moves it `y: -40px` as the section scrolls — creates depth separation from text.

**Typography**: Apply the mask-wipe + blur-to-sharp entrance to the pull quote (Cormorant 300i, 28px).

**Section transition out**: As About exits, add a subtle `gsap.to(section, { opacity: 0.8 }, {...})` scrub to soften entry into the Marquee / Quote gradient.

---

### 2.6 QUOTE SECTION — Cinematic continuation of Hero

**File**: `src/components/sections/Quote.tsx`

This section **must feel like a continuation** of the Hero's gradient bridge darkening — not a hard cut.

**Approach**:
- The Quote section starts at `background: transparent` and has a `::before` pseudo-element `position: absolute; inset: 0; background: var(--bg-dark); z-index: 0`
- The hero gradient bridge has already darkened the viewport to ~85% black by the time Quote enters
- Quote's content is at `z-index: 1` above the solid dark pseudo-element

**Word-by-word reveal** (the spoken-word animation):
```ts
const words = quoteText.split(' ');
// Wrap each in a .text-clip + .text-clip-inner structure
gsap.fromTo('.quote-word-inner', 
  { y: '110%', opacity: 0, filter: 'blur(4px)' },
  { y: '0%', opacity: 1, filter: 'blur(0px)', stagger: 0.07, duration: 0.55, ease: 'power3.out',
    scrollTrigger: { trigger: quoteRef.current, start: 'top 60%', once: true }
  }
);
```

**Scrub parallax**: The quote text very slowly drifts `y: -20px` as you scroll through the section (`scrub: 2`) — a gentle breathing motion.

**Layout**: Full viewport (`100dvh`). Centered. Quote at 62% viewport width max. Cormorant 300i, fluid size `clamp(28px, 4.5vw, 64px)`. Attribution in Syne 400, 10px, letter-spacing 0.4em, uppercase, `var(--accent)`.

---

### 2.7 WORK SECTION — Marquee hover band + hover image

**File**: `src/components/sections/Work.tsx`

**Ghost number**: `<div className="ghost-number">02</div>`

**Project row marquee band** (the key premium feature):
Each project row, on hover, reveals a marquee band. This band:
- Slides open below the hovered row (height: 0 → 52px, `transition: height 0.4s cubic-bezier(0.16,1,0.3,1)`)
- Background: `var(--text-primary)` (black)
- Contains: Syne 800, 13px, letter-spacing 0.3em, uppercase, `var(--accent)` colored text marquee
- Content: `[PROJECT NAME] · [TYPE] · [YEAR] ·` repeated horizontally

```tsx
// Inside each project row:
const [hovered, setHovered] = useState(false);
const marqueeText = `${project.title} · ${project.type} · ${project.year} · `.repeat(10);

<div
  className="project-marquee-band"
  style={{ height: hovered ? '52px' : '0px' }}
>
  <div className="marquee-track" style={{ '--marquee-duration': '12s' } as React.CSSProperties}>
    <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: '12px', letterSpacing: '0.3em', color: 'var(--accent)', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
      {marqueeText}
    </span>
  </div>
</div>
```

**Project row design** (Syne 800 for project titles):
- Index: Syne 400, 12px, `var(--text-muted)`, `min-width: 48px`
- Title: `Syne 800`, `clamp(28px, 3.5vw, 48px)`, `var(--text-primary)` — this is the grotesque oomph moment
- Type tag: Cormorant 300i, 18px, `var(--text-secondary)` — serif contrast against the grotesque title
- Year: Syne 400, 12px, `var(--text-muted)`
- Row border: `1px solid var(--grid-line)` top
- Row height on desktop: `96px` (generous, breathable)
- On hover: title gets `letter-spacing: 0.02em` transition and slight `color: var(--text-primary)` intensification

**Floating preview image** (cursor-following):
- Position: fixed, pointer-events none, z-index 500
- Size: 220px × 150px
- Background: `var(--bg-surface)` with project name watermarked
- Border: `1px solid var(--grid-line)`
- Rotation: `rotate(-4deg)` (slightly tilted)
- Follows cursor with lerp 0.1 (smooth lag)
- Scale: 0 → 1 on row hover, 1 → 0 on leave

**Modal fix** (modal scroll issue — BUG 2):
```tsx
const openModal = (project: Project) => {
  setActiveProject(project);
  setModalOpen(true);
  getLenis()?.stop();
  document.body.style.overflow = 'hidden';
};

const closeModal = () => {
  setModalOpen(false);
  getLenis()?.start();
  document.body.style.overflow = '';
};
```

---

### 2.8 STACK SECTION — Horizontal sticky carousel

**File**: `src/components/sections/Stack.tsx`

**Ghost number**: `<div className="ghost-number">03</div>`

**The horizontal carousel** — this is the premium scroll moment for the Skills section.

Instead of a vertical grid, the skills carousel is a **horizontal strip that progresses via vertical scroll**:

```tsx
// Section is 300vh tall
// Inner content is pinned
// As user scrolls down 300vh, the horizontal strip moves left by its full width

const stripRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  const stripWidth = stripRef.current?.scrollWidth ?? 0;
  const viewportWidth = window.innerWidth;
  
  gsap.to(stripRef.current, {
    x: -(stripWidth - viewportWidth + 160), // 160 = padding
    ease: 'none',
    scrollTrigger: {
      trigger: sectionRef.current,
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
      pin: true,
      pinSpacing: true,
    },
  });
}, []);
```

**Each skill group card** in the horizontal strip:
- Width: 280px, flex-shrink: 0
- Height: 320px
- Background: `var(--bg-surface)`
- Border: `1px solid var(--grid-line)`
- Padding: 32px
- Group label: Syne 800, 10px, letter-spacing 0.4em, uppercase, `var(--text-muted)`, border-bottom `1px solid var(--grid-line)`, padding-bottom 12px, margin-bottom 20px
- Skills: `stack-pill` class (see globals.css)
- On hover: card `background: var(--bg-primary)`, `border-color: var(--text-muted)`, slight `y: -4px` transition

**Strip layout**:
```
[Section Label + Ghost Number]  [Card 1]  [Card 2]  [Card 3]  [Card 4]  [Card 5]  →
```
Label is fixed at left of viewport while strip scrolls. Cards are:
1. Languages (Swift, TypeScript, Python, JS, Dart)
2. Frontend (React, Next.js, Three.js, GSAP, Tailwind)
3. Backend (Node.js, Express, PostgreSQL, REST, GraphQL)
4. iOS (SwiftUI, UIKit, CoreData, Xcode, TestFlight)
5. Tools (Git, Figma, Vercel, Docker, Firebase)

**Parallax depth**: Each card has a slightly different `translateY` at scroll start (`0`, `-16px`, `8px`, `-8px`, `16px`) that resolves to 0 — creating a wave entry effect.

---

### 2.9 EXPERIENCE SECTION — Timeline draw animation

**File**: `src/components/sections/Experience.tsx`

**Ghost number**: `<div className="ghost-number">04</div>`

**SVG timeline draw**:
```tsx
<svg
  ref={timelineSvgRef}
  style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: '2px' }}
  viewBox="0 0 2 100"
  preserveAspectRatio="none"
>
  <line
    ref={timelineLineRef}
    x1="1" y1="0" x2="1" y2="100"
    stroke="var(--accent)"
    strokeWidth="1.5"
    strokeDasharray="100"
    strokeDashoffset="100"  // starts invisible
  />
</svg>
```

GSAP ScrollTrigger with `scrub: 1` animates `strokeDashoffset` from `100` to `0` as section scrolls into view. Each entry has its own ScrollTrigger that fires as the line reaches its node position.

**Entry animation** (mask-wipe + blur-to-sharp on role titles):
```ts
gsap.from(entry, {
  opacity: 0,
  x: 20,
  filter: 'blur(4px)',
  duration: 0.6,
  ease: 'power2.out',
  scrollTrigger: {
    trigger: entry,
    start: 'top 75%',
    once: true,
  },
});
```

**Typography**:
- Date range: Syne 400, 11px, letter-spacing 0.2em, `var(--text-muted)`, uppercase
- Role: **Syne 800**, 20px, `var(--text-primary)` — grotesque weight for authority
- Company: Cormorant 300i, 20px, `var(--text-secondary)` — serif softness in contrast
- Description: Outfit 300, 14px, line-height 1.75, `var(--text-secondary)`, max-width 480px

---

### 2.10 CONTACT SECTION — Gradient bridge from Experience

**File**: `src/components/sections/Contact.tsx`

**Gradient bridge entry** (no hard cut from white to black):
Add a `<div>` between the Experience section and Contact section in `page.tsx`:

```tsx
<div style={{
  height: '40vh',
  background: 'linear-gradient(to bottom, var(--bg-primary) 0%, var(--bg-dark-subtle) 40%, var(--bg-dark) 100%)',
  pointerEvents: 'none',
}} />
```

This creates a cinematic fade from warm white into the deep dark Contact section.

**Design**:
- `position: relative; background: var(--bg-dark); color: var(--text-light)`
- Availability pill (animated pulsing dot): 
  ```tsx
  <span style={{
    display: 'inline-flex', alignItems: 'center', gap: '8px',
    border: '1px solid var(--bg-dark-border)', padding: '6px 16px',
    borderRadius: '100px', fontSize: '11px', letterSpacing: '0.2em',
    fontFamily: 'var(--font-syne)', color: 'var(--text-muted)', textTransform: 'uppercase',
  }}>
    <span style={{
      width: '6px', height: '6px', borderRadius: '50%',
      backgroundColor: '#4ade80', // green
      animation: 'pulse 2s ease-in-out infinite',
    }} />
    Available for opportunities
  </span>
  ```
  Add `@keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1) } 50% { opacity: 0.4; transform: scale(0.8) } }` to globals.css.

- Main heading: Cormorant 300, `var(--text-display-lg)`, `var(--text-light)`
  Reveal with Syne SplitText character-by-character stagger

- Email CTA: `data-magnetic` attribute, Syne 700, 20px, border `1px solid var(--bg-dark-border)`, padding `18px 48px`
  Hover: `background: var(--text-light); color: var(--bg-dark); border-color: var(--text-light)`

- Social row: GitHub, LinkedIn, Twitter/X, Email — Syne 400, 11px caps, `var(--text-secondary)`, 48px gap
  Each icon: inline SVG, 18px, `var(--text-muted)`, hover: `var(--text-light)`

- Footer: `border-top: 1px solid var(--bg-dark-border)`, padding-top 24px, `var(--bg-dark-border)` colored text

---

### 2.11 NAVIGATION — Dark section awareness

**File**: `src/components/Nav/Nav.tsx`

**Scroll-aware background**:
```ts
useEffect(() => {
  const lenis = getLenis();
  lenis?.on('scroll', ({ scroll }: { scroll: number }) => {
    setScrolled(scroll > 60);
  });
}, []);
```
When scrolled: `background: rgba(249,247,244,0.9); backdrop-filter: blur(12px); border-bottom: 1px solid var(--grid-line)`

**Dark section detection** via IntersectionObserver on `.section-dark` elements → toggle `data-dark` attribute on nav → CSS inverts text colors.

**Active section highlighting**: IntersectionObserver on each section, tracks which is most visible, highlights corresponding nav link with a 4px circle dot below it in `var(--accent)`.

**Nav links**: Syne 400, 10px, letter-spacing 0.3em, uppercase, `var(--text-muted)`, hover: `var(--text-primary)`, 32px gap between links.

---

## PART 3 — FILE-BY-FILE ACTION CHECKLIST

Execute in this exact order. Check off each before moving to the next.

### Phase 1: Foundation (do first, nothing else works without this)
- [ ] **`src/styles/tokens.css`** — Add ALL missing design tokens from Section 2.1
- [ ] **`src/lib/lenis.ts`** — Add `lenis.on('scroll', () => ScrollTrigger.update())` fix
- [ ] **`src/app/globals.css`** — Add: marquee keyframes, `.text-clip` + `.text-clip-inner`, `.ghost-number`, `.stack-pill`, `.project-marquee-band`, pulse keyframe, column grid lines, vertical grid lines, `overflow: hidden` removal from `.section`
- [ ] **`src/lib/constants.ts`** — Create with SOCIAL links object

### Phase 2: Cursor system (do second — everything interacts with it)
- [ ] **`src/components/Cursor/Cursor.tsx`** — Full rewrite with: mounted fix, click ripple+morph, global magnetic wiring, dark section detection, all cursor states, lerped follower

### Phase 3: Hero (the centrepiece)
- [ ] **`src/components/sections/Hero.tsx`** — 400vh height, rotateY camera pan, gradient bridge div, caption reveal at 0.62/0.70, role in Syne 800

### Phase 4: New UI components
- [ ] **`src/components/ui/MarqueeBand.tsx`** — Create marquee between Hero and About
- [ ] **`src/components/ui/HoverImage.tsx`** — Cursor-following project preview image (fixed, lerped)

### Phase 5: Section overhauls
- [ ] **`src/components/sections/About.tsx`** — Ghost number, parallax portrait, mask-wipe heading, scrollTrigger scrub
- [ ] **`src/components/sections/Quote.tsx`** — Word-by-word reveal, scrub parallax, gradient continuation, z-index grain fix
- [ ] **`src/components/sections/Work.tsx`** — Syne 800 titles, marquee hover band, modal Lenis fix, hover image, ghost number 02
- [ ] **`src/components/sections/Stack.tsx`** — Horizontal sticky carousel, ghost number 03, wave entry parallax
- [ ] **`src/components/sections/Experience.tsx`** — SVG timeline draw, Syne 800 roles, ghost number 04, mask-wipe headings
- [ ] **`src/components/sections/Contact.tsx`** — Gradient bridge, availability pill, magnetic email CTA, SOCIAL constants, footer

### Phase 6: Integration
- [ ] **`src/app/page.tsx`** — Add MarqueeBand between Hero and About, add gradient bridge div between Experience and Contact, correct section order
- [ ] **`src/components/Nav/Nav.tsx`** — Dark section detection, scroll-aware bg, active section tracking, SOCIAL constants
- [ ] **`src/app/layout.tsx`** — Complete OG/Twitter meta tags, manifest link

### Phase 7: SEO & housekeeping
- [ ] **`public/robots.txt`** — Create
- [ ] **`public/sitemap.xml`** — Create
- [ ] **`public/site.webmanifest`** — Create
- [ ] Move `AGENTS.md` and `Progress-1.md` to `.internal/` folder

---

## PART 4 — QUALITY GATES

Before considering this done, verify each of these:

**Functional**:
- [ ] Hero captions are fully visible when scrolling down (not just up)
- [ ] Project modal scroll works inside the modal (page does NOT scroll behind it)
- [ ] Cursor dot and ring both appear and track correctly on desktop
- [ ] Click anywhere → ripple expands + cursor squashes and springs
- [ ] Hovering any `[data-magnetic]` element → element shifts toward cursor
- [ ] Hovering a project row → marquee band slides open below the row
- [ ] Stack section horizontal carousel progresses as you scroll down
- [ ] Experience timeline line draws itself on scroll
- [ ] Quote section has NO visible grain texture (or grain is appropriately toned)
- [ ] Dark sections (Quote, Contact) have NO jarring hard cut — gradient bridges both
- [ ] Social links go to correct profiles (not GitHub/LinkedIn homepage)
- [ ] Modal closes on Escape key press

**Visual**:
- [ ] Ghost section numbers (`01`–`04`) are visible but subtle behind content
- [ ] Vertical column grid lines visible at ~18% opacity
- [ ] Horizontal grid lines at ~18% opacity
- [ ] All section headings animate with mask-wipe + blur-to-sharp on scroll
- [ ] Syne 800 weight used on: role line in Hero, project titles in Work, role names in Experience
- [ ] Cormorant 300i used on: About pull quote, Work project type, Experience company names, Quote section
- [ ] Marquee band visible between Hero and About (dark band with nude text)

**Performance**:
- [ ] `npm run build` completes with zero TypeScript errors
- [ ] No console errors in browser
- [ ] No React hydration warnings
- [ ] Scrolling feels smooth (Lenis + ScrollTrigger synced)

---

## PART 5 — DESIGN DECISIONS RATIONALE

If you are making decisions during implementation, these principles guide them:

1. **When in doubt, add space** — Padding and margin are the primary design tools. Sections should breathe. Never feel cramped.

2. **Syne 800 for power, Cormorant for grace** — These two fonts must appear in the same sections in contrast. The collision between them creates the brutalist-luxury tension.

3. **The gradient bridges are sacred** — The Hero-to-Quote and Experience-to-Contact transitions must feel like a single continuous camera move, not two separate sections. The dark should feel like you're scrolling INTO it, not being teleported there.

4. **Ghost numbers are watermarks, not features** — They should be visible at 60-70% when looking for them, but invisible to someone not looking. `-webkit-text-stroke: 1px var(--grid-line)` with no fill and `opacity: 0.7` is right.

5. **The marquee band between Hero and About is a momentum-keeper** — It prevents the sudden quietness after the dramatic Hero. The thin dark band with flowing text is the musical "bridge" between the dramatic opening and the calmer About section.

6. **Parallax depth, not parallax chaos** — Parallax `y` values should never exceed ±40px on any element. Subtlety creates depth. Large parallax values create motion sickness.

7. **The cursor IS the personality** — Every interactive element needs a cursor response. If something is clickable and the cursor doesn't react, it's broken. Every `<a>`, `<button>`, `[data-magnetic]`, and `[data-cursor]` must trigger the cursor state machine.

---

*Prompt version 2.0 — Generated from full repo audit + design interview*  
*Execute phases in order. Do not skip Phase 1 — everything depends on it.*
