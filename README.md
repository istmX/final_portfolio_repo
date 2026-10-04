# Developer Portfolio Template

A free, open-source portfolio template for developers. It includes a responsive portfolio, project showcase, writing section, interactive details, and a small pixel-art Cat Home experience. Built with Next.js, React, TypeScript, Tailwind CSS, and Motion.

## Preview

See the live template at **[aryanonai.vercel.app](https://aryanonai.vercel.app/)**.

## Features

- Responsive homepage with profile, social links, technology stack, and projects
- Blog index and article pages with per-post metadata and social previews
- Light and dark themes
- Motion effects with reduced-motion support
- Search metadata, structured data, `robots.txt`, `sitemap.xml`, and `llms.txt`
- Custom 404 page and animated first-visit preloader
- Optional pixel-art Cat Home experience

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Make it yours

- Edit the profile and technology capsules in `components/IntroHero.tsx`.
- Update project details in `components/projectData.ts`.
- Add or edit articles in `app/blogs/blogData.ts`.
- Change social links in `components/SocialLinks.tsx`.
- Adjust colors, typography, and global styles in `app/globals.css`.
- Set your canonical site URL in `lib/site.ts` and update page metadata in `app/layout.tsx`.
- Replace or remove `public/googlebcdf164ce86ae3d1.html` and add your own site verification file if you use Google Search Console.

## Deploy

Deploy with [Vercel](https://vercel.com/new) or another platform that supports Next.js. Update `lib/site.ts` before publishing so canonical URLs and the sitemap use your domain.

## License

Released under the [MIT License](LICENSE).
