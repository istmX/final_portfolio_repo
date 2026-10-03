# Portfolio progress

Last updated: 2026-10-03

## Project direction

This is a personal developer portfolio for Aryan, using the name and logo **istmX**. The visual direction is a quiet, minimal portfolio inspired by the supplied references: a narrow centered layout, neutral colors, compact labels, subtle motion, and light/dark themes. The hero focuses on AI engineering alongside full-stack and mobile development.

`AboutMe.md` contains the longer background, technology, and project notes. It is a source of portfolio content; the visible hero bio has been edited independently.

## Completed

- Set up the app shell with Schibsted Grotesk and Inter fonts, metadata, theme initialization, and neutral-only color tokens in `app/globals.css`.
- Added light and dark color values using neutral shades from 100 through 950.
- Built a responsive navigation bar with the istmX logo, Home/About/Projects/Blogs links, a small-screen menu, and a separate theme toggle.
- Replaced the large profile banner direction with a compact hero section using the square `public/hero.png` portrait.
- Added the hero name, rotating roles, a more direct AI engineering bio, and technology chips for TypeScript, React, Motion, Python, Next.js, Express.js, LangChain, LangGraph, and RAG.
- Added an India local clock (IST) with a restrained seconds transition and a reusable `ShimmerText` component.
- Added one compact “Find me” social-links row directly after the hero, matching the supplied profile reference. The square icon buttons have a subtle double border and 3px inset gap.
- Added horizontal dotted dividers between the navigation, hero/profile, and social links, matching the dotted vertical container edges.
- Added reusable `components/ui/link-preview.tsx`: GitHub uses a wider, viewport-clamped screenshot preview through Microlink. X, LinkedIn, and email show a profile card using the hero portrait, India location, account handle, and relevant details.
- Added click-triggered ring and sparkle effects in `ClickSparks.tsx`.
- Added a fixed frosted-glass blur at the bottom of the viewport in `ScrollBlur.tsx`.
- Removed duplicate social-section renderings from the home page; it now renders one instance.
- Added a four-project responsive Bento section in the requested order: Crew, ISTMX Skills, CodeCat, and Noiseless.
- Added a custom Crew workspace preview, with the other projects using their existing local screenshots. Project screenshots sit inside framed media panels rather than filling the whole card.
- Added layered card and image borders, a hover radial glow, restrained image motion, and icon-only technology marks with hover/focus tooltips.
- Updated `AboutMe.md` to reflect the four highlighted projects and their display order.

## Current profile links

- GitHub: <https://github.com/istmX>
- LinkedIn: <https://www.linkedin.com/in/aryan-xf/>
- X: <https://x.com/Istm_x>
- Email: `xparyan68@gmail.com`

The email was entered as `gamil.com` in chat and interpreted as the common `gmail.com` domain. Confirm this before publishing if that was intentional.

## Current state and limitations

- The home page currently contains the navigation, hero, social links, and the four-project Bento section. Writing, experience, and other portfolio sections from the reference are not built yet.
- The `/about` route exists as a placeholder. Projects and Blogs are linked in the navigation but their routes/content are not present yet.
- Microlink renders a remote screenshot preview for GitHub. If its page blocks automated rendering, the direct profile link remains available.
- X, LinkedIn, and email use local profile cards; social cards link out to the live accounts, while the email card opens a mail client.
- The profile cards and responsive layout have not been visually reviewed in a running browser during this work.
- No tests, lint, or production build have been run.

## Useful next steps

1. Verify the exact LinkedIn URL and email address before launch.
2. Review the hero and social previews at desktop and mobile widths, including both themes.
3. Build the Blogs page and replace the `/about` placeholder with portfolio content.
4. Add the remaining portfolio sections from the reference, choosing only the sections that have accurate, ready-to-publish content.
5. Run the project’s lint/build checks when implementation verification is requested.
