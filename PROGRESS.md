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
- Added one social-links section labelled “Elsewhere.” Its square icon buttons have a low-opacity outer border, a 3px gap, and a second border around each icon.
- Added hover/focus profile cards. GitHub loads public profile fields from GitHub’s user API; X loads an official public-post timeline; LinkedIn shows a local profile preview that links to the account; email opens a new message.
- Added click-triggered ring and sparkle effects in `ClickSparks.tsx`.
- Added a fixed frosted-glass blur at the bottom of the viewport in `ScrollBlur.tsx`.
- Removed duplicate social-section renderings from the home page; it now renders one instance.

## Current profile links

- GitHub: <https://github.com/istmX>
- LinkedIn: <https://www.linkedin.com/in/aryan-xf/>
- X: <https://x.com/Istm_x>
- Email: `xparyan68@gmail.com`

The email was entered as `gamil.com` in chat and interpreted as the common `gmail.com` domain. Confirm this before publishing if that was intentional.

## Current state and limitations

- The home page currently contains the navigation, hero, and social links. The project, writing, experience, and other portfolio sections from the reference are not built yet.
- The `/about` route exists as a placeholder. Projects and Blogs are linked in the navigation but their routes/content are not present yet.
- GitHub profile data is fetched in the browser when its preview is opened. If GitHub’s API is unavailable or rate-limited, the preview falls back to the local bio text.
- X’s embedded timeline requires a public X account with public posts. If the timeline cannot load, the profile link remains available.
- LinkedIn is shown as a styled local preview with a link to the live profile rather than an embedded account page.
- The profile cards and responsive layout have not been visually reviewed in a running browser during this work.
- No tests, lint, or production build have been run.

## Useful next steps

1. Verify the exact LinkedIn URL and email address before launch.
2. Review the hero and social previews at desktop and mobile widths, including both themes.
3. Build the Projects and Blogs pages and replace the `/about` placeholder with portfolio content.
4. Add the remaining portfolio sections from the reference, choosing only the sections that have accurate, ready-to-publish content.
5. Run the project’s lint/build checks when implementation verification is requested.
