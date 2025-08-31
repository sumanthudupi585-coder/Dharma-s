# Dharma's Cipher: The Kashi Khanda

An immersive philosophical text-based adventure game built with React 18, styled-components, and framer-motion.

## Quick Start

- Install deps: ni (or npm install)
- Run dev: npm start
- Build: npm run build (copies build to docs/ for GitHub Pages)

## Deployment (GitHub Pages via docs/)

1. Ensure package.json has the correct `homepage`: https://sumanthudupi585-coder.github.io/Dharma-sCiph
2. Build: `npm run build` (postbuild copies build/ to docs/)
3. Commit and push docs/ to your default branch
4. In GitHub repo settings → Pages, select source: `Deploy from a branch`, branch: `main`, folder: `/docs`

Client-side routing is handled internally; a 404.html is included to support direct links.

## Production Notes

- Relative asset paths are automatically configured by `homepage`
- Buttons meet touch target guidelines (44px min height)
- Components use React.lazy and Suspense for code splitting
- Error boundaries provide graceful failure UI
- Accessibility: focus outlines, ARIA roles, keyboard interactions

## Scripts

- start: react-scripts start
- build: react-scripts build (then postbuild to docs/)

## SEO

- robots.txt and sitemap.xml are in public/

## Contributing

- Follow existing patterns and code style
- Avoid adding console logs; prefer error boundaries and proper UI messaging
