<div align="center">

# 🎓 ClasslyAI

**AI-powered study platform that generates study material, quizzes, and performance analytics.**

Built with [SvelteKit](https://svelte.dev) · [Gemini AI](https://ai.google.dev) · [Convex](https://convex.dev) · [TypeScript](https://typescriptlang.org)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

</div>

---

## Features

- **AI Study Material** — Enter a topic and Gemini returns an overview, key concepts and takeaways. Every guide is saved so you can reopen it later.
- **Smart Quizzes** — Auto-generated multiple choice quizzes on any topic. Quizzes are stored, so you can retake one instead of paying for generation again.
- **Performance Analytics** — Scores are recorded per attempt. The dashboard shows your average, your best, a score trend and the topics you get wrong most.
- **Theme Support** — Light, dark and forest themes, remembered per device.
- **Responsive Design** — Sidebar navigation on desktop, bottom tab bar on mobile.
- **Fast & Modern** — SvelteKit 2 with Svelte 5 runes and a Convex backend.

---

## Screenshots

<!-- Add screenshots here -->
<!-- ![Dashboard](docs/screenshots/dashboard.png) -->

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) **v20+**
- [pnpm](https://pnpm.io) **v9+**
- A [Google Gemini API key](https://ai.google.dev)
- A [Convex](https://convex.dev) account (the free tier is enough)

### Installation

```bash
git clone https://github.com/CapstonePhase/ClasslyAI.git
cd ClasslyAI

pnpm install
```

Set up Convex. This creates a dev deployment and writes the `CONVEX_*` variables
into `.env.local` for you:

```bash
pnpm dlx convex dev
```

Then add your Gemini key to `.env.local`:

```env
GEMINI_API_KEY=your_key_here
```

### Development

Convex needs to be running alongside Vite, so use two terminals:

```bash
pnpm dlx convex dev   # backend, watches src/lib/convex
pnpm dev              # frontend on http://localhost:5173
```

### Build & Preview

```bash
pnpm build
pnpm preview
```

---

## Project Structure

```
src/
├── lib/
│   ├── components/
│   │   ├── ui/            # Button, Card, Form, Search, Icon, Table…
│   │   ├── layout/        # PageHeader, PageSection, PageFooter
│   │   ├── quiz/          # QuizRunner, QuizResults
│   │   ├── study/         # StudyGuide
│   │   ├── dashboard/     # StatTiles, WeakTopics
│   │   └── HistoryList.svelte
│   ├── convex/            # Schema and backend functions
│   │   ├── schema.ts
│   │   ├── materials.ts   # Saved study guides
│   │   ├── quizzes.ts     # Saved quizzes
│   │   ├── attempts.ts    # One row per quiz taken
│   │   └── stats.ts       # Dashboard aggregates
│   ├── server/            # Server-only: Gemini client, rate limiter
│   ├── quiz.ts            # Grading and scoring
│   ├── format.ts          # Date helpers
│   └── settings.svelte.ts # Local preferences
├── routes/
│   ├── +layout.svelte     # App shell
│   ├── (home)/            # Landing page
│   ├── about/
│   ├── dashboard/         # Stats, trend, weak topics, recent attempts
│   ├── study/             # Generate and read study material
│   ├── quizzes/           # Generate, take and retake quizzes
│   ├── settings/          # Quiz defaults, theme, clearing data
│   └── api/
│       ├── generate/      # Study material generation
│       └── quiz/          # Quiz generation
├── app.css                # Design tokens & global styles
├── app.d.ts               # Global TypeScript declarations
└── app.html
```

---

## How it fits together

Gemini is only called from the two `api/` routes, so the key never reaches the
browser. What comes back is written to Convex, and every page reads from Convex
rather than from the response — which is why a quiz you generated last week is
still there, and why the dashboard has anything to show.

An **attempt** is stored separately from the **quiz** it belongs to. Retaking a
quiz adds one small row instead of copying all the question text again, and the
dashboard only has to read attempts to build its numbers. Deleting a quiz deletes
its attempts too, so the stats can't count scores for a quiz that no longer exists.

---

## Tech Stack

| Layer             | Technology                                                                                   |
| ----------------- | -------------------------------------------------------------------------------------------- |
| **Framework**     | [SvelteKit 2](https://svelte.dev) + [Svelte 5](https://svelte.dev/docs/svelte/overview)      |
| **Language**      | [TypeScript](https://typescriptlang.org) (strict mode)                                       |
| **Backend**       | [Convex](https://convex.dev) (schema, queries, mutations)                                    |
| **AI**            | [Google Gemini API](https://ai.google.dev)                                                   |
| **Styling**       | CSS custom properties (design tokens), scoped styles                                         |
| **Icons**         | [Font Awesome](https://fontawesome.com) via [svelte-fa](https://github.com/Cweili/svelte-fa) |
| **Content**       | [mdsvex](https://mdsvex.pngwn.io) for Markdown rendering                                     |
| **Linting**       | [ESLint](https://eslint.org) + [Prettier](https://prettier.io)                               |
| **Type Checking** | [svelte-check](https://github.com/sveltejs/language-tools)                                   |
| **Deployment**    | [Vercel](https://vercel.com)                                                                 |

---

## Environment Variables

`.env.local`, in the project root:

```env
# Written by `pnpm dlx convex dev`
CONVEX_DEPLOYMENT=dev:your-deployment
PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
PUBLIC_CONVEX_SITE_URL=https://your-deployment.convex.site

# Required
GEMINI_API_KEY=your_gemini_api_key_here

# Optional, defaults to gemini-3-flash-preview
GEMINI_MODEL=
```

> Never commit `.env.local` to version control. It's already in `.gitignore`.

---

## Available Scripts

| Command               | Description                         |
| --------------------- | ----------------------------------- |
| `pnpm dev`            | Start development server with HMR   |
| `pnpm build`          | Create optimized production build   |
| `pnpm preview`        | Preview production build locally    |
| `pnpm check`          | Run svelte-check for type errors    |
| `pnpm check:watch`    | Run svelte-check in watch mode      |
| `pnpm lint`           | Run Prettier + ESLint checks        |
| `pnpm format`         | Auto-format all files with Prettier |

---

## Known limitations

Being upfront about what isn't there rather than listing it as a feature:

- **No accounts.** Everything is stored in one shared workspace, so it's a
  single-user app as it stands. The data model doesn't assume otherwise, so
  adding auth later is mostly a matter of scoping queries to a user id.
- **Multiple choice only.** Short answer questions are not implemented.
- **No automated tests.** `pnpm check` and `pnpm lint` are the only gates.
- **The rate limiter is per-process**, so on serverless each instance keeps its
  own counter. It stops a stuck button, not a determined one.

---

## Deployment

ClasslyAI is configured for **Vercel**:

1. Push your repository to GitHub.
2. Import the project in [Vercel](https://vercel.com/new).
3. Add the environment variables above in the Vercel dashboard.
4. Run `pnpm dlx convex deploy` so production points at a production deployment.

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m "feat: add my feature"`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request.

Please ensure your code passes `pnpm lint` and `pnpm check` before submitting.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">
  <sub>Built with <3 for students everywhere.</sub>
</div>
