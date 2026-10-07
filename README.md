# Aryan’s Portfolio & ISTMX

This repository contains the personal portfolio of **Aryan**, also known online as **aryanonai**. Aryan uses **istmX** as his developer handle and GitHub identity. The portfolio presents his work, writing, projects, and the ISTMX ecosystem.

|                   |                                                                                        |
| ----------------- | -------------------------------------------------------------------------------------- |
| Website           | [aryanonai.vercel.app](https://aryanonai.vercel.app/)                                  |
| GitHub profile    | [github.com/istmX](https://github.com/istmX)                                           |
| This repository   | [github.com/istmX/final_portfolio_repo](https://github.com/istmX/final_portfolio_repo) |
| Component library | [ISTMX Library](https://aryanonai.vercel.app/library)                                  |

## Identity and projects

Aryan is the person behind the online identity `aryanonai` and the developer handle `istmX`. **ISTMX** is his project ecosystem, not a separate person or company. Its current projects include:

- **[ISTMX Skills](https://istmx.dpdns.org/)** — reusable skills and structured workflows for AI coding agents. [Source on GitHub](https://github.com/istmX/skills).
- **[ISTMX UI](https://www.npmjs.com/package/@istmx/ui)** — a CLI that adds editable component source to a developer’s project.
- **[ISTMX Library](https://aryanonai.vercel.app/library)** — documentation, previews, installation instructions, usage examples, and API references for the components.

The portfolio also features Crew, CodeCat, and Noiseless. Their current descriptions and links are maintained in [`projectData.ts`](app/portfolio-components/projectData.ts).

## ISTMX Component Library

ISTMX components are intended to be copied into a project and edited there. The CLI provides the source files; the consuming app owns the implementation and does not depend on a hosted ISTMX runtime.

| Component              | What it does                                                                                                       | Documentation                                                        |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------- |
| **Animated Text**      | Rotates through text with configurable blur, fade, shimmer, slide, and per-character wave effects.                 | [Read docs](https://aryanonai.vercel.app/library/animated-text)      |
| **Image Accordion**    | Presents images as a selectable stack and transitions the selected image into a preview canvas.                    | [Read docs](https://aryanonai.vercel.app/library/image-accordion)    |
| **Dock Navigation**    | A navigation dock with pointer-proximity magnification, elastic lift, and moving tooltips.                         | [Read docs](https://aryanonai.vercel.app/library/dock-navigation)    |
| **Mobile Menu Dock**   | A mobile navigation dock with a section menu and component search.                                                 | [Read docs](https://aryanonai.vercel.app/library/mobile-menu-dock)   |
| **Scroll Story Cards** | A scroll-scrubbed story sequence where cards travel upward on a curved path and drive image and color transitions. | [Read docs](https://aryanonai.vercel.app/library/scroll-story-cards) |
| **Pixel Cat**          | A configurable pixel-art cat that moves within its parent container and supports optional interaction.             | [Read docs](https://aryanonai.vercel.app/library/pixel-cat)          |

Each page documents installation, usage, props, accessibility behavior, interaction details, and implementation limitations. The Library source files live in [`components/ui/`](components/ui); the CLI’s packaged copies live in [`packages/cli/registry/`](packages/cli/registry).

### Add a component

From the root of a React project configured with Tailwind CSS, run:

```sh
npx @istmx/ui add image-accordion
```

The CLI also supports pnpm, Yarn, and Bun:

```sh
pnpm dlx @istmx/ui add image-accordion
yarn dlx @istmx/ui add image-accordion
bunx @istmx/ui add image-accordion
```

The component source is copied into `components/ui/`. The CLI detects the package manager and installs required dependencies when they are missing. Components use React and Tailwind CSS; animated components use Motion, and components that compose class names use `clsx` and `tailwind-merge`. Some examples use Tabler icons. See the [CLI README](packages/cli/README.md) for all commands, options, and component details.

### CLI options

```sh
npx @istmx/ui add animated-text --no-install
npx @istmx/ui add animated-text --overwrite
npx @istmx/ui --help
```

- `--no-install` copies the component and prints the dependency command without installing packages.
- `--overwrite` allows existing generated component or helper files to be replaced.
- Component names can be supplied with hyphens or spaces, such as `animated-text` or `animated text`.

The CLI package is [`@istmx/ui`](https://www.npmjs.com/package/@istmx/ui). Its package manifest and executable are in [`packages/cli/`](packages/cli/).

## Portfolio features

- Personal introduction identifying Aryan, `aryanonai`, and the `istmX` GitHub identity.
- Social profile links, technology stack, and GitHub contribution activity.
- Project index with descriptions, technologies, images, status, and relevant external links.
- Homepage component index linking directly to Library documentation.
- Writing index and individual article pages.
- Responsive navigation with searchable component links and a mobile bottom dock.
- Light and dark themes, subtle motion, and reduced-motion support.
- Shared editorial elements including dotted container rules, reusable section frames, code blocks, buttons, and navigation controls.
- Optional Cat Home experience at `/cat-home`.

## Routes

| Route             | Purpose                                   | Search visibility |
| ----------------- | ----------------------------------------- | ----------------- |
| `/`               | Aryan’s portfolio homepage                | Indexable         |
| `/library`        | ISTMX component catalog                   | Indexable         |
| `/library/[slug]` | Documentation for an individual component | Indexable         |
| `/blogs`          | Writing index                             | Indexable         |
| `/blogs/[slug]`   | Individual article                        | Indexable         |
| `/cat-home`       | Optional pixel-art cat experience         | `noindex`         |
| `/test`           | Development component playground          | `noindex`         |

The site also generates `/sitemap.xml`, `/robots.txt`, and `/llms.txt`. The sitemap lists the homepage, Library, component pages, Writing, and public articles. The playground and Cat Home are intentionally excluded from indexing. Sitemap submission and structured data help communicate the site’s content but do not guarantee crawling, indexing, or rankings.

## Technology

- [Next.js](https://nextjs.org/) 16 with the App Router
- [React](https://react.dev/) 19 and [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) 4
- [Motion](https://motion.dev/) for interaction and scroll-linked animation
- [Tabler Icons](https://tabler.io/icons) for interface icons
- `clsx` and `tailwind-merge` through the shared [`cn`](lib/utils.ts) helper
- Schibsted Grotesk and Inter for portfolio typography; Geist Mono for code
- [Vercel](https://vercel.com/) deployment

## Repository map

```text
app/
  page.tsx                         Homepage and person/project structured data
  layout.tsx                       Root layout, fonts, and shared metadata
  library/
    page.tsx                       Component catalog
    [slug]/page.tsx                Component documentation and metadata
    [slug]/opengraph-image.tsx     Component-specific social preview
  blogs/                            Writing index, articles, and article data
  portfolio-components/            Portfolio sections and shared UI
    library/                        Library registry, previews, and source data
  cat-home/                         Optional interactive cat experience
  test/                              Noindex component playground
components/ui/                      Editable source components
lib/utils.ts                        Shared class-name helper
packages/cli/                        @istmx/ui CLI and published component registry
public/llms.txt                      AI/search-readable site guide
```

## Local development

### Requirements

- Node.js 20.9 or newer to run this Next.js 16 site ([Next.js system requirements](https://nextjs.org/docs/app/getting-started/installation)). The standalone ISTMX UI CLI declares Node.js 18 or newer.
- npm, pnpm, Yarn, or Bun.

### Install and run

```sh
git clone https://github.com/istmX/final_portfolio_repo.git
cd final_portfolio_repo
npm install
npm run dev
```

The development server is available at `http://localhost:3000` by default.

### Available scripts

```sh
npm run dev      # Start the development server
npm run build    # Create a production build
npm run start    # Serve the production build
npm run lint     # Run ESLint
npx tsc --noEmit # Check TypeScript types
```

## Updating the Library

The component registry in [`library-items.ts`](app/portfolio-components/library/library-items.ts) drives the catalog, component documentation, and page metadata. Component search entries are in [`component-search-data.ts`](app/portfolio-components/library/component-search-data.ts). The CLI registry is maintained separately under [`packages/cli/registry/`](packages/cli/registry), because it ships source files to npm users.

When adding or changing a component, keep its implementation, documentation source, usage example, props, accessibility details, source link, search entry, and CLI copy aligned. Update the Library links and component list in this README when the public catalog changes. The component detail route generates its canonical URL and social metadata from the registry entry.

## Search and structured data

The site uses Next.js metadata APIs for page-specific titles, descriptions, canonical URLs, Open Graph, and X/Twitter cards. Structured data connects Aryan to the online identities `aryanonai` and `istmX`, then connects the ISTMX ecosystem and its projects to the same creator. Component and article pages include their own page metadata and structured information.

Related files:

- [`app/page.tsx`](app/page.tsx) — homepage metadata and Person/ProfilePage/ISTMX structured data.
- [`app/library/[slug]/page.tsx`](app/library/%5Bslug%5D/page.tsx) — component metadata, canonical URLs, and breadcrumbs.
- [`app/blogs/[slug]/page.tsx`](app/blogs/%5Bslug%5D/page.tsx) — article metadata and author attribution.
- [`app/sitemap.ts`](app/sitemap.ts) and [`app/robots.ts`](app/robots.ts) — crawler discovery rules.
- [`public/llms.txt`](public/llms.txt) — concise first-party site and component guide.

## License

This repository is available under the [MIT License](LICENSE). The separate [ISTMX UI package](packages/cli/package.json) also declares the MIT license.
