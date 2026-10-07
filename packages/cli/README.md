# ISTMX UI

Editable UI components for your codebase. ISTMX adds the component source to
your project so you can read it, change it, and make it yours.

**Website:** [aryanonai.vercel.app](http://aryanonai.vercel.app/)

## Add a component

Run the command from your project root:

```sh
npx @istmx/ui add animated-text
```

Or use your preferred package manager:

```sh
pnpm dlx @istmx/ui add animated-text
yarn dlx @istmx/ui add animated-text
bunx @istmx/ui add animated-text
```

The CLI detects your package manager, copies the editable component to
`components/ui/animated-text.tsx`, adds the shared `cn` helper at
`lib/utils.ts` if it is missing, and installs any missing dependencies:

- [Motion](https://motion.dev/) for animation
- [clsx](https://www.npmjs.com/package/clsx) and [tailwind-merge](https://www.npmjs.com/package/tailwind-merge) for class composition

Your project should already use React and have Tailwind CSS configured. After
installation, the component is yours to edit; your app does not need to import
runtime code from `@istmx/ui`.

## Animated Text

Import the copied source into your app:

```tsx
import AnimatedText from '@/components/ui/animated-text'

export function Intro() {
  return (
    <p>
      I&apos;m{' '}
      <AnimatedText
        items={['an AI engineer', 'a full-stack developer', 'a builder']}
        effects={['blur', 'fade', 'shimmer']}
        interval={2400}
      />
    </p>
  )
}
```

Available effects are `blur`, `fade`, `shimmer`, `slide`, and `wave`. Use the
`effect` prop for one effect, or `effects` to combine several. The component
respects the user's reduced-motion setting.

### Customize the text and shimmer

Use `className` to style the wrapper and `textClassName` to style the changing
text. For shimmer, set custom CSS colors with `effectOptions`:

```tsx
<AnimatedText
  items={['an AI engineer', 'a builder']}
  effects={['blur', 'shimmer']}
  textClassName="font-semibold"
  effectOptions={{
    shimmer: {
      color: '#71717a',
      highlight: '#f4f4f5',
      duration: 2.2,
      width: 36,
    },
  }}
/>
```

Other options include `direction`, `interval`, `speed`, `scale`, and effect
settings for blur, fade, slide, and wave. The full component implementation is
in your `components/ui/animated-text.tsx` file.

## CLI options

```sh
npx @istmx/ui add animated-text --no-install
npx @istmx/ui add animated-text --overwrite
```

- `--no-install` copies the source and prints the dependency command instead
  of installing packages.
- `--overwrite` replaces component and helper files that already exist.

Component names accept either hyphens or spaces: `animated-text` or `animated
text`.

The CLI requires Node.js 18 or later. The npm package is `@istmx/ui`; the
installed executable is named `istmx`.
