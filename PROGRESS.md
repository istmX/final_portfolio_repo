# Portfolio progress

Last updated: 2026-10-04

## Project direction

This is a personal developer portfolio for Aryan, using the name and logo **istmX**. The visual direction is a quiet, minimal portfolio inspired by the supplied references: a narrow centered layout, neutral colors, compact labels, subtle motion, and light/dark themes. The hero focuses on AI engineering alongside full-stack and mobile development.

`AboutMe.md` contains the longer background, technology, and project notes. It is a source of portfolio content; the visible hero bio has been edited independently.

## Completed

- Set up the app shell with Schibsted Grotesk and Inter fonts, metadata, theme initialization, and neutral-only color tokens in `app/globals.css`.
- Added light and dark color values using neutral shades from 100 through 950.
- Built a responsive navigation bar with the istmX logo, Home/About/Projects/Blogs links, a small-screen menu, and a separate theme toggle.
- Replaced the large profile banner direction with a compact hero section using the square `public/hero.png` portrait.
- Added the hero name and rotating roles with matching articles, plus a professional summary describing Aryan as an 18-year-old developer and student. Its TypeScript, React, Next.js, Express, React Native, Expo, Python, LangChain, LangGraph, and RAG references use the existing inline technology capsules.
- Added an India local clock (IST) whose seconds flip in a fixed-size slot, with reduced-motion support.
- Added one compact “Find me” social-links row directly after the hero, matching the supplied profile reference. The square icon buttons have a subtle double border and 3px inset gap.
- Added horizontal dotted dividers between the navigation, hero/profile, and social links, matching the dotted vertical container edges. Vertical rails are hidden on mobile, where content has extra side padding.
- Made the mobile navigation menu overlay page content instead of pushing it down.
- Added reusable `components/ui/link-preview.tsx`: GitHub uses a wider, viewport-clamped screenshot preview through Microlink. X, LinkedIn, and email show a profile card using the hero portrait, India location, account handle, and relevant details.
- Added click-triggered ring and sparkle effects in `ClickSparks.tsx`.
- Added a fixed frosted-glass blur at the bottom of the viewport in `ScrollBlur.tsx`.
- Removed duplicate social-section renderings from the home page; it now renders one instance.
- Added a four-project responsive Bento section in the requested order: Crew, ISTMX Skills, CodeCat, and Noiseless. Crew and Noiseless span the grid; ISTMX Skills and CodeCat sit side by side.
- Retained the supplied Crew artwork and existing screenshots for all four projects. Images remain the visual focus inside simple media panels with restrained sizing and minimal overlays.
- Replaced most hand-drawn technology marks with Simple Icons brand SVGs, added a local AWS logo asset, and created a custom Motion mark. The separate technology area uses individual tooltips and visible light tiles for AWS and Vercel in dark mode.
- Simplified project cards by removing decorative image overlays and custom project glyphs. Project names, types, descriptions, and compact technology icon rows establish the hierarchy; each technology icon has a hover and keyboard-focus tooltip.
- Added rounded inset image frames with a double border separated by a 2px gap, extra image breathing room, and a restrained multi-color project-specific radial glow on hover.
- Added visible project destination links for ISTMX Skills, CodeCat, and Noiseless; their project images also link to the same destinations and show a pointer cursor. Crew is labeled “In development”; ISTMX Skills is labeled “Open source.”
- Kept project information in the home page Bento cards; there are no dedicated project detail pages or dynamic project routes.
- Added direct external project links to the primary live destinations on the ISTMX Skills, CodeCat, and Noiseless cards. Crew is marked as currently building and has no destination link yet.
- The Projects navigation item points to the Bento section on the home page.
- Updated project cards with the requested descriptions and full per-project build stacks from `AboutMe.md` and the supplied project details: Crew includes its web, mobile, backend, agent, database, and infrastructure tools; Noiseless includes its documented application, backend, AI, and Slack stack; CodeCat includes its framework, UI, AI SDK, database, Prisma, and Auth.js stack; ISTMX Skills lists JavaScript and npm. Each stack is shown through the existing icon tooltips.
- Lowered the global bottom blur behind the main page content so it no longer overlays and softens project cards.
- Added `components/index.ts` as a barrel export for the reusable components and project data.
- Added a compact Tech Stack section after Find Me and before GitHub Contributions. The 30 selected technologies appear as icon capsules inside one bordered container, centered on mobile and left-aligned on wider screens. Capsules can be selected to highlight a technology, with keyboard-accessible button controls.
- Added a neutral, responsive contribution heatmap for the `istmX` GitHub profile after Tech Stack, with a left-aligned “GitHub Contributions” heading. It fetches only the current calendar year, shows dynamically aligned month labels above the graph, and offers day-level hover details and a profile link. Each page load requests fresh data; the upstream service caches results for up to one hour.
- Pointed the About navigation item to the professional summary on the homepage; the Tech Stack section follows in the same page flow.
- Added a home Blogs preview after Projects with three compact article rows and related backend, frontend, and mobile images. The `/blogs` listing contains eight original articles; `/blogs/[slug]` pages include metadata, optional lead images, image credits, reading time, and not-found handling. Article topics draw from the project and “What I Build” notes in `AboutMe.md`.
- Added dotted horizontal dividers after Projects and Blogs. The home ends with a minimal centered quote attributed to “a wise cat,” a quiet meowing detail with a hand-drawn arrow and subtle hint, then a rounded-top transition into a compact footer. The interactive roaming pixel cat remains the Cat Home easter egg elsewhere on the page.
- Reworked the final footer to continue the portfolio’s dotted grid and minimal dark styling. It uses the exact line “Built this when I should've been building my main project.”, followed by an animated Aryan SVG signature, “Thanks for visiting.”, a quiet meowing line, minimal social links, copyright, and a small back-to-top control. Decorative flowers and a duplicate footer cat were removed; the existing roaming portfolio cat remains the only one.
- Added `FooterSignature.tsx`, an original cursive SVG signature that draws its strokes once when it enters view, then settles to full opacity. It honors reduced-motion preferences. The signature paths are being refined for clearer “Aryan” letterforms.
- Refined Cat Home to use the global fonts already loaded in `app/layout.tsx`, fill the viewport with a camera that adapts to screen proportions, and keep stats and actions in compact floating controls. Added mobile movement/action controls and expanded cat interactions, including carrying the cat, cuddling, calling, feeding, play, sleep, and laser play.

## Current profile links

- GitHub: <https://github.com/istmX>
- LinkedIn: <https://www.linkedin.com/in/aryan-xf/>
- X: <https://x.com/Istm_x>
- Email: `xparyan68@gmail.com`

The email was entered as `gamil.com` in chat and interpreted as the common `gmail.com` domain. Confirm this before publishing if that was intentional.

## Current state and limitations

- The home page currently contains the navigation, hero, social links, Tech Stack, GitHub Contributions, the four-project Bento section, a linked Blogs preview, the closing quote/easter egg hint, and the minimal signature footer. The existing roaming pixel cat links to Cat Home.
- The About navigation item scrolls to the professional summary on the homepage, with Tech Stack and GitHub Contributions following below. The Projects navigation item returns to the home project section; project information and external destinations are shown in the Bento cards.
- The contribution graph uses the public `github-contributions-api.jogruber.de` service and displays a fallback message if contribution data cannot be loaded.
- Microlink renders a remote screenshot preview for GitHub. If its page blocks automated rendering, the direct profile link remains available.
- X, LinkedIn, and email use local profile cards; social cards link out to the live accounts, while the email card opens a mail client.
- The profile cards and responsive layout have not been visually reviewed in a running browser during this work.
- No tests, lint, or production build have been run.

## Useful next steps

1. Verify the exact LinkedIn URL and email address before launch.
2. Review the hero and social previews at desktop and mobile widths, including both themes.
3. Replace the `/about` placeholder with portfolio content.
4. Add the remaining portfolio sections from the reference, choosing only the sections that have accurate, ready-to-publish content.
5. Run the project’s lint/build checks when implementation verification is requested.
