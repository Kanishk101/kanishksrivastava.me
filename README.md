# kanishksrivastava.me

A brutalist-luxury personal portfolio built with Next.js 16, GSAP, Framer Motion, and Lenis smooth scroll.

## ✨ Features

- **Cinematic Loader** — KS monogram, progress bar, vertical curtain-split reveal
- **Perspective Hero** — Name erupts from flat/distant to full-size via scroll-driven transform
- **Custom Cursor** — 5-state cursor system (default, hover, project view, magnetic, jitter)
- **Magnetic Interactions** — Buttons and elements attract toward cursor
- **Word-by-Word Reveals** — Pull quote and Steve Jobs quote animate word by word
- **Project Case Studies** — Hover-preview list with full-screen slide-up modals
- **Self-Drawing Timeline** — Experience spine draws itself on scroll
- **Dark Section Inversion** — Nav automatically inverts on dark sections
- **Noise Grain Overlay** — SVG feTurbulence for tactile depth
- **Smooth Scroll** — Lenis with GSAP ticker sync (desktop only)

## 🛠 Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16 (App Router, TypeScript) |
| Animation | GSAP + ScrollTrigger |
| Transitions | Framer Motion |
| Scroll | Lenis |
| Styling | Tailwind CSS v4 + CSS Custom Properties |
| Fonts | Cormorant Garamond · Syne · Outfit (via next/font) |
| Icons | Inline SVGs + Lucide React |

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/yourusername/kanishksrivastava.me.git
cd kanishksrivastava.me

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Updating Content

All content is stored as data arrays in component files. To update:

| Content | File |
|---------|------|
| Name, role, manifesto | `src/components/sections/Hero.tsx` |
| About bio, pull quote | `src/components/sections/About.tsx` |
| Projects list | `src/components/sections/Work.tsx` |
| Skills/Stack | `src/components/sections/Stack.tsx` |
| Experience timeline | `src/components/sections/Experience.tsx` |
| Social links, email | `src/components/sections/Contact.tsx` |
| Monogram initials | `src/components/Loader/Loader.tsx` + `Nav.tsx` |
| SEO metadata | `src/app/layout.tsx` |

## 🎨 Design System

Tokens are defined in `src/styles/tokens.css`:
- **Colors**: `--bg-primary: #F9F7F4`, `--bg-dark: #0C0C0B`, `--accent: #C4B9AE`
- **Typography**: Display (Cormorant), Sans (Syne), Body (Outfit)
- **Spacing**: 4px → 128px scale
- **Animation**: Duration + easing tokens

## 📦 Build & Deploy

```bash
# Production build
npm run build

# Deploy to Vercel
vercel deploy --prod
```

Or push to GitHub — auto-deploys on Vercel if connected.

## 📄 License

MIT
