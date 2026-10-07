# WHATNEW.md

# Portfolio Refactor + ISTMX Library

IMPORTANT:
Read this entire file before making any changes.

This file is the source of truth for the next development phase of the portfolio.

Do not start coding immediately. First inspect the existing repository, understand the current architecture, identify where every existing portfolio feature lives, and then implement the changes below without breaking existing functionality.

---

# 1. CURRENT CONTEXT

The portfolio is already deployed and largely finished.

DO NOT redesign the portfolio from scratch.

The current visual identity is intentional:

- Minimal
- Developer-focused
- Editorial
- Dark/light theme support
- Centered max-w-5xl mx-auto content
- Dotted grid lines
- Thin borders
- Generous whitespace
- Subtle Motion animations
- Inter / existing typography
- Small metadata
- Compact UI
- No unnecessary gradients
- No excessive shader effects
- No Awwwards-style visual overload

The current homepage, preloader, cat Easter egg, footer, blog, SEO, analytics, project visuals, and other working features should be preserved unless explicitly changed below.

The goal is to evolve the portfolio into a cleaner architecture and introduce a new ISTMX Library without turning the portfolio itself into a huge documentation website.

---

# 2. NEW DIRECTION

The portfolio is becoming the home of:

1. Aryan's personal portfolio
2. Projects
3. Writing
4. ISTMX Library

The new Library is inspired by the philosophy of shadcn:

> Small, useful, copyable source code that developers can own and modify.

ISTMX is NOT intended to replace:

- LangChain
- LangGraph
- React
- Tailwind
- Motion
- tiktoken
- OpenAI SDKs
- other existing libraries

Instead, ISTMX provides small utilities, UI components, patterns, and strategies that make existing tools easier to use.

The philosophy is:

Discover → Preview → Copy/Install → Own

The code should ideally become part of the user's codebase rather than forcing a heavy runtime dependency.

---

# 3. PROJECT SECTION

The existing large Bento-style Projects section should be reduced.

DO NOT remove projects entirely.

Projects are still important proof of what Aryan builds, but they should no longer dominate the homepage.

Replace the large project Bento presentation with smaller, cleaner project cards.

Preferred direction:

- Compact cards or horizontal rows
- Smaller project images
- Project name
- Short description
- Small technology metadata
- GitHub / project link
- Subtle hover motion
- No huge visual Bento compositions

Current important projects:

## Crew

Autonomous AI workforce / AI execution platform.

## CodeCat

AI-powered code review platform.

## Noiseless

Autonomous research agent that follows topics, filters information, and delivers research digests.

## ISTMX Skills

Open-source reusable skills and workflows for AI coding agents.

Do not add old/inactive projects such as Zenix as current featured work.

Keep project information accurate.

---

# 4. ISTMX LIBRARY

Create a new Library section/page.

Possible navigation:

- Home
- Projects
- Library
- Blogs
- About

Do not overcomplicate the navigation.

The Library should be discoverable without making the navigation feel like documentation software.

The Library should eventually contain multiple categories.

Suggested structure:

## Components

Reusable UI components, especially components useful for AI applications.

Examples:

- Shimmer Text
- Animated Text
- Layered Button
- Pixel Cat
- AI Chat
- Prompt Input
- Model Selector
- Token Usage UI
- Tool Activity
- Agent Activity
- Streaming UI
- Sources / Citations
- etc.

## Utilities

Small developer/AI utilities.

Examples:

- Token utilities
- Context utilities
- Cost utilities
- Model utilities
- Retry/backoff
- Provider helpers
- Prompt helpers

## Patterns

Small implementation patterns for AI systems.

Examples:

- RAG
- Agent loops
- Tool calling
- Streaming
- Provider fallback
- Memory
- Human approval
- Multi-agent handoff

## Strategies

Practical AI engineering/system-design strategies.

Examples:

- Context engineering
- Token budgeting
- RAG strategies
- Agent strategies
- AI system architecture
- Long-running agent strategies

Do NOT create dozens of fake items just to make the Library look large.

Only add things that are actually useful and implemented.

---

# 5. LIBRARY PHILOSOPHY

The Library should follow a shadcn-like source-first philosophy.

The goal is NOT:

Install ISTMX → depend on ISTMX forever.

The goal is:

Discover
↓
Preview
↓
Copy / Install source
↓
Modify
↓
Own

The user should receive understandable source code.

They should be able to rename it.

They should be able to modify it.

They should be able to remove ISTMX after copying/installing the source if the generated code has no runtime dependency on ISTMX.

Do not create unnecessary runtime coupling.

Do not build a giant ISTMX framework.

Do not turn ISTMX into another LangChain.

The philosophy is:

> Useful code, not another dependency.

---

# 6. COMPONENT ARCHITECTURE REFACTOR

Refactor the project into two clear component areas.

## Portfolio Components

Inside app, create/use:

app/portfolio-components/

Rename the current portfolio-specific component area to:

portfolio-components

This folder should contain components specifically belonging to Aryan's portfolio.

Examples:

- Hero
- Intro
- Projects
- Footer
- Social links
- Blog-related portfolio sections
- Portfolio-specific animations
- Cat Easter egg
- Preloader
- Portfolio-specific UI

Move portfolio-specific components into this area even if they are currently scattered elsewhere.

Do not blindly move generic reusable UI components here.

---

# 7. GENERIC UI COMPONENTS

At the repository root, create/use:

components/
└── ui/

This should become the source of reusable UI components.

This is intentionally similar in philosophy to shadcn's:

components/ui

Examples eventually:

components/
└── ui/
    ├── shimmer-text.tsx
    ├── animated-text.tsx
    ├── layered-button.tsx
    ├── pixel-cat.tsx
    └── ...

Only reusable components belong here.

Portfolio-specific sections should NOT remain mixed into this folder.

---

# 8. MOVE AND CLEAN EVERYTHING

Audit the entire repository.

Find all components, helpers, animations, UI pieces, data files, and portfolio-specific code that currently lives in inconsistent locations.

Classify each one.

## Portfolio-specific

Move into:

app/portfolio-components/

## Reusable UI

Move into:

components/ui/

## Generic utility

Put into an appropriate utility/lib location.

Do not create unnecessary folders.

Do not break imports.

After moving files:

- Update all imports
- Remove dead imports
- Remove duplicate components
- Remove unused files
- Remove abandoned implementations
- Verify aliases
- Run the project
- Fix all errors

---

# 9. FIRST LIBRARY COMPONENT — SHIMMER TEXT

There is already a reusable shimmer text component in the portfolio.

It is used in multiple places.

Preserve the reusable shimmer primitive.

The existing animated role/text transition is a separate composition built using the shimmer component.

The Library should eventually expose both concepts appropriately.

## Shimmer Text

A reusable shimmer text primitive.

Example concept:

<ShimmerText>
  AI Engineer
</ShimmerText>

## Animated Text / Animated Role

A composed text transition with:

- Changing text
- Blur
- Upward movement
- Entering/exiting text
- Shimmer effect

The current animation is part of the existing portfolio and should remain visually consistent.

Do not recreate the animation from scratch if the existing implementation can be extracted cleanly.

---

# 10. PIXEL CAT

The pixel cat is another potential Library component.

The Library version should be the reusable web companion component.

It should NOT become the entire Cat Home game.

Cat Home remains the portfolio Easter egg / separate experience.

The Library Pixel Cat should focus on:

- Pixel-art cat
- Optional movement
- Blink
- Idle behavior
- Interaction
- Optional wandering
- Optional cursor interaction
- Configurable size
- Theme compatibility
- Callbacks/events where useful

Keep it lightweight.

Do not turn it into a game engine.

The full Cat Home experience remains separate.

---

# 11. LAYERED BUTTON

The existing portfolio has a button component with:

- Layered borders
- Large typography
- Arrow
- Subtle elevation
- Theme-aware styling
- Light mode support
- Dark mode support

It should eventually become a Library component.

Do not call it GlowButton just because a glow can be added.

The important characteristic is the layered/editorial interaction.

Possible name:

LayeredButton

Potential improvements:

- Subtle Motion
- Edge glow
- Hover movement
- Arrow animation
- Press state
- Theme-aware glow
- Preserve the current minimal aesthetic

Do NOT turn it into an excessive neon effect.

The component must work properly in both light and dark themes.

---

# 12. AI UTILITY — TOKEN PLAN UTILITY

One of the first non-UI Library utilities should solve a real application problem:

Mapping application user plans to token limits when using existing AI libraries.

Example LangChain usage normally looks like:

```python
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(
    model="gpt-4o-mini",
    temperature=0.7,
    max_tokens=500,
    api_key="..."
)
The ISTMX utility should allow something conceptually like:
from langchain_openai import ChatOpenAI
from istmx import istm_token

llm = ChatOpenAI(
    model="gpt-4o-mini",
    temperature=0.7,
    max_tokens=istm_token,
    api_key="..."
)
The important part is:
ChatOpenAI remains LangChain's ChatOpenAI.
ISTMX does NOT replace ChatOpenAI.
ISTMX only provides the token value.
The developer can define their plans separately.
For example:
from istmx import Token

istm_token = Token(
    free=500,
    pro=2000,
    business=10000,
    enterprise=50000,
)
Then the application can resolve the appropriate plan.
For example:
istm_token = Token.for_plan("free")


which resolves to:
500

Then:
llm = ChatOpenAI(    model="gpt-4o-mini",    temperature=0.7,    max_tokens=istm_token,    api_key="...")


The exact API can be refined during implementation.
The core concept must remain:
User plan → configured token limit → value passed to existing AI library.
# 13. TOKEN UTILITY REQUIREMENTS

The utility should make it easy to define many plans in a short configuration.

Example:

Token(
    free=500,
    starter=1000,
    pro=2000,
    business=10000,
    enterprise=50000,
)

The developer controls the values.

ISTMX does not impose its own plans.

There should be:

- No external ISTMX account
- No hosted service
- No database requirement
- No API key management
- No unnecessary runtime service

The utility should be simple source code.

The goal is to eliminate repetitive plan/token logic from an AI application.

---

# 14. TOKEN UTILITY — IMPORTANT DISTINCTION

Do not confuse:

API key
↓
Authentication credential

Token
↓
Model input/output token count or model token limit

Plan
↓
Application user's subscription/access level

The ISTMX example is about:

Application plan → token limit

It is NOT about storing or managing API keys.

---

# 15. TOKEN UTILITY AND EXISTING ECOSYSTEMS

ISTMX is a utility layer around existing tools.

For example:

LangChain:
- ChatOpenAI
- ChatAnthropic
- ChatGroq
- etc.

ISTMX:
- provides useful small configuration helpers

For token counting where needed, use appropriate mature tooling such as tiktoken where supported.

Do not recreate a tokenizer unnecessarily.

Initially support:

- Python
- JavaScript
- TypeScript

Do not add unnecessary language support.

---

# 16. LIBRARY UI

The Library can take inspiration from shadcn-style registries.

Each Library item should eventually have:

- Preview
- Code
- Installation
- Usage
- API / Props where relevant
- Dependencies
- Source
- Copy button
- GitHub/source link where relevant

For UI components:

Preview | Code

For utilities:

Example | Code

The exact visual design should be ISTMX's own.

Do NOT copy another website's exact design.

Use the existing portfolio design language.

---

# 17. LIBRARY ITEM EXAMPLE

A component page could look conceptually like:

SHIMMER TEXT

A lightweight shimmer text effect.

[ Preview ] [ Code ]

LIVE PREVIEW

AI Engineer

INSTALLATION

...

USAGE

...

PROPS

...

DEPENDENCIES

React
Motion

SOURCE

[ Copy ]

The Token utility could look like:

TOKEN PLAN

A tiny utility for mapping application
plans to AI token limits.

[ Example ] [ Code ]

EXAMPLE

free      → 500
starter   → 1000
pro       → 2000
business  → 10000

USAGE

...

LANGUAGES

Python
JavaScript
TypeScript

SOURCE

[ Copy ]

Keep pages short and easy to understand.

---

# 18. NAVIGATION REFACTOR

Update the main navbar for the new Library direction.

Keep it minimal.

Do not overcrowd it.

The Library should be discoverable.

Also update the mobile navigation.

There is a specific mobile hamburger/menu idea that will be implemented.

Before changing it, inspect the existing mobile navigation and preserve working behavior.

The new hamburger interaction should feel intentional and fit the existing portfolio aesthetic.

Do not simply use a generic sidebar menu without considering the existing design.

---

# 19. PRETTIER

Add:

.prettierrc

Configure Prettier appropriately for the project.

Because the project uses Tailwind CSS, add the appropriate Tailwind class sorting/prettier integration.

Keep formatting consistent.

Do not introduce unnecessary formatting rules.

---

# 20. CLSX + TAILWIND MERGE

Add:

clsx
tailwind-merge

Use them to create a reusable cn() helper.

Concept:

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

Use cn() when composing conditional or conflicting Tailwind classes.

Do not blindly refactor every existing class.

Use it when creating/refactoring relevant components.

---

# 21. MOBILE NAVIGATION

Refactor the mobile hamburger navigation.

Keep the existing portfolio's visual language.

The interaction should be:

- Responsive
- Accessible
- Smooth
- Minimal
- Motion-aware
- Reduced-motion compatible

The exact interaction can be designed based on the existing implementation and the new concept provided during development.

Do not introduce an unrelated UI style.

---

# 22. PROJECTS — NEW SMALL CARD DESIGN

Replace the current large Bento-style project presentation with a smaller project presentation.

Preferred structure:

SELECTED WORK

Crew
Autonomous AI workforce...
[small image] →

CodeCat
AI-powered code review...
[small image] →

Noiseless
Autonomous research...
[small image] →

ISTMX Skills
Reusable skills for AI coding agents...
[small image] →

Cards can be horizontal or compact vertical cards.

Use subtle motion.

Keep the project images.

Do not make the cards huge.

Do not make the Projects section disappear.

---

# 23. PORTFOLIO DESIGN PRINCIPLES

Do not turn the Library into an Awwwards-style redesign.

Do not add:

- Giant shader backgrounds
- Excessive gradients
- Excessive glassmorphism
- Huge decorative effects
- Random 3D
- Cursor distortion everywhere
- Purple AI gradients
- Overly complicated animation
- Decorative effects without purpose

The portfolio is intentionally minimal.

The Library should feel like a developer's workshop.

Clean.

Technical.

Minimal.

Interactive where useful.

---

# 24. EXISTING FEATURES THAT MUST KEEP WORKING

Do not accidentally remove or break:

- Preloader
- "wait a minute babe"
- Animated eyes
- Live clock
- Theme system
- Home hero
- Technology capsules
- Tiny cat details
- Footer
- Signature animation
- "meow meow meow mewww ~"
- Cat Easter egg
- /cat-home
- Blog system
- SEO metadata
- Sitemap
- Robots
- llms.txt
- Analytics
- Structured data
- Project images
- Responsive behavior
- Accessibility
- Reduced motion

These are already intentional parts of the portfolio.

---

# 25. CURRENT PORTFOLIO PHILOSOPHY

The old portfolio direction was heavily focused on chasing Awwwards-style visual design.

The current portfolio intentionally focuses on:

"This is Aryan.
This is what I build.
This is how I think."

The Library should continue that philosophy.

It is not another decorative portfolio section.

It is a real developer resource.

---

# 26. FILE ORGANIZATION PRINCIPLE

Before creating a new file, ask:

1. Is this portfolio-specific?
2. Is this reusable UI?
3. Is this a generic utility?
4. Is this Library-specific?
5. Does an existing file already solve this?

Do not create duplicate abstractions.

Prefer composition over giant components.

Prefer small files with clear responsibilities.

---

# 27. AUDIT FIRST

Before changing anything:

Inspect:

- app/
- components/
- lib/
- utility files
- package.json
- Tailwind configuration
- existing UI components
- navigation
- mobile navigation
- project data
- blog system
- existing animations

Understand where everything currently lives.

Do not assume the existing structure matches this document.

Find the actual files first.

---

# 28. PHASE 1 — ARCHITECTURE

Create:

app/
└── portfolio-components/

and:

components/
└── ui/

Move components according to responsibility.

Update all imports.

Make sure the application still works.

---

# 29. PHASE 2 — DEVELOPER TOOLING

Add:

.prettierrc

Add:

clsx
tailwind-merge

Create the cn() helper.

Verify Tailwind class merging works.

Run formatting.

---

# 30. PHASE 3 — PROJECTS

Replace the large Bento project presentation with compact project cards/rows.

Keep:

- Crew
- CodeCat
- Noiseless
- ISTMX Skills

Do not add inactive projects.

Do not destroy the existing project data.

---

# 31. PHASE 4 — NAVIGATION

Update desktop navigation.

Add Library.

Keep navigation minimal.

Update mobile navigation with the new hamburger concept.

Verify keyboard and accessibility behavior.

---

# 32. PHASE 5 — LIBRARY FOUNDATION

Create the Library route.

Build the basic registry architecture.

Do not create dozens of components.

Make it easy to add new Library items later.

---

# 33. PHASE 6 — FIRST LIBRARY ITEMS

Extract real existing components.

First:

1. Shimmer Text
2. Animated Text
3. Layered Button
4. Pixel Cat

Reuse the existing implementations.

Do not recreate them unnecessarily.

---

# 34. PHASE 7 — FIRST AI UTILITY

Prototype the token-plan utility.

The utility should demonstrate the ISTMX philosophy.

Example:

from istmx import Token

istm_token = Token(
    free=500,
    pro=2000,
    business=10000,
    enterprise=50000,
)

user_token_limit = istm_token.for_plan("pro")

Then:

from langchain_openai import ChatOpenAI

llm = ChatOpenAI(
    model="gpt-4o-mini",
    temperature=0.7,
    max_tokens=user_token_limit,
    api_key="..."
)

Again:

ChatOpenAI is still LangChain.

ISTMX only provides the token configuration value.

The implementation can evolve if a better API is discovered during development.

---

# 35. DO NOT OVERBUILD

The first milestone is intentionally small.

Target:

Portfolio
    ↓
Smaller Projects
    ↓
Library
    ↓
4 real UI components
    ↓
1 real AI utility

That is enough for the first release.

Do not spend days creating infrastructure for 100 future components.

Do not invent components just to increase the item count.

The Library should grow naturally from things Aryan actually builds.

---

# 36. FUTURE LIBRARY DIRECTION

Potential future UI components:

- AI Chat
- Prompt Input
- Model Selector
- Token Usage
- Tool Call
- Agent Activity
- Streaming Response
- Sources/Citations
- Command interfaces
- AI loading states

Potential future utilities:

- Token helpers
- Context helpers
- Cost calculators
- Model limits
- Retry/backoff
- Provider fallback
- Prompt helpers

Potential future patterns:

- RAG
- Agent loops
- Tool calling
- Streaming
- Memory
- Human approval
- Multi-agent handoff
- Long-running agents

Potential future strategies:

- Context engineering
- Token budgeting
- RAG strategies
- Agent strategies
- AI architecture
- Long-running agent design

These are ideas, not requirements for this first implementation.

---

# 37. DO NOT MAKE ISTMX A HEAVY DEPENDENCY

The entire philosophy is:

Existing tools remain the foundation.

Examples:

LangChain
React
Tailwind
Motion
tiktoken
LangGraph
OpenAI SDKs
etc.

ISTMX provides small useful additions around them.

The developer should never feel:

"I have to use the entire ISTMX ecosystem."

Instead:

"I needed this one thing, I found it in ISTMX, I copied it, and now it is mine."

---

# 38. QUALITY BAR

Every Library item should be:

- Actually useful
- Small
- Understandable
- Customizable
- Responsive where applicable
- Theme-aware where applicable
- Accessible
- Reduced-motion friendly
- Properly documented
- Free of unnecessary dependencies
- Easy to copy
- Easy to modify

Do not prioritize item count.

Prioritize quality.

---

# 39. BUILD AND QA

After implementation, run:

npm run lint

Run:

npm run build

Run type checking if available.

Run formatting.

Fix all errors.

Then manually verify:

- Desktop
- Mobile
- Light mode
- Dark mode
- Reduced motion
- Navbar
- Mobile hamburger
- Home
- Projects
- Library
- Blogs
- Preloader
- Footer
- Cat Easter egg
- Cat Home

Do not stop at "the code looks correct."

Actually verify the application.

---

# 40. FINAL DEFINITION OF DONE

The refactor is complete when:

- Portfolio-specific components are organized under app/portfolio-components
- Reusable UI components are organized under components/ui
- Existing functionality still works
- Imports are clean
- No obvious duplicate components remain
- Prettier is configured
- Tailwind class merging is available
- cn() exists
- Projects are smaller and cleaner
- Library exists
- Library is reachable from navigation
- Mobile navigation is updated
- Shimmer Text is available as a reusable component
- Animated Text is available as a reusable component
- Layered Button is available as a reusable component
- Pixel Cat is available as a reusable component
- Token utility direction is established
- Python support is considered
- JavaScript support is considered
- TypeScript support is considered
- Light/dark themes work
- Mobile works
- Reduced motion works
- Build passes
- No unnecessary dependencies were introduced
- No giant abstraction/framework was created
- Existing portfolio remains visually consistent

---

# 41. MOST IMPORTANT RULE

Do not turn ISTMX into another framework.

Do not replace LangChain.

Do not replace React.

Do not replace Tailwind.

Do not replace Motion.

Do not replace tiktoken.

Do not build a giant abstraction layer.

Do not chase component counts.

Do not chase visual awards.

Do not invent things just to fill the Library.

Build small things that solve real problems.

Make the source understandable.

Let people copy it.

Let them modify it.

Let them own it.

The goal is:

> Useful code, not another dependency.

And the guiding principle for every future Library item is:

> If Aryan already built it while solving a real problem, extract it.
> If he hasn't needed it, don't invent it just because the Library needs another item.