# NewsHub

A news aggregator that pulls articles from NewsAPI, The Guardian, and the New York Times into a single feed with search, filtering, and personalization.

Built with **Next.js 16** (App Router), **TypeScript**, **Tailwind CSS 4**, and **Docker**.

## How It Works

Client components fetch from internal Next.js Route Handlers (`/api/articles`, `/api/categories`), which fan out to all three news APIs in parallel server-side. This keeps API keys off the client, avoids CORS, and lets us aggregate, deduplicate, and rank results before sending them back.

Each news API is wrapped in a provider class that implements a shared `NewsProvider` interface (Strategy Pattern), so adding a new source means adding one file without touching existing code.

Search and filter state lives in URL params (`useSearchParams`), so every view is shareable and bookmarkable. User preferences (preferred sources, categories, authors) are stored client-side with Zustand + localStorage.

## Tech Stack

- **Next.js 16** — App Router, Turbopack, Route Handlers
- **TypeScript 5** — strict mode
- **Tailwind CSS 4** — CSS-first config (`@theme inline`)
- **TanStack Query v5** — client caching, dedup, retry
- **Zustand 5** — preferences with `persist` middleware
- **Vitest + React Testing Library + MSW** — unit and component tests
- **Docker** — multi-stage build with standalone output

## Getting Started

### Prerequisites

- Node.js 22+
- API keys from [NewsAPI](https://newsapi.org/register), [The Guardian](https://open-platform.theguardian.com/access/), and [NYT](https://developer.nytimes.com/accounts/create)

### Local Development

```bash
npm install
cp .env.example .env.local
# Add your API keys to .env.local
npm run dev
```

### Docker

```bash
cp .env.example .env.local
# Add your API keys to .env.local
docker-compose up --build
# App runs on http://localhost:3000
```

### Scripts

```bash
npm run dev          # Dev server (Turbopack)
npm run build        # Production build
npm test             # Run tests
npm run test:watch   # Tests in watch mode
```

## Project Structure

```
src/
├── app/
│   ├── api/                # Route Handlers — server-side API proxy
│   │   ├── articles/       # Aggregated search across all providers
│   │   ├── categories/     # Merged categories
│   │   └── sources/        # Provider metadata
│   └── preferences/        # User preferences page
├── lib/
│   ├── providers/          # NewsAPI, Guardian, NYT adapters
│   ├── aggregator.ts       # Parallel fetch, dedup, rank, paginate
│   ├── api-client.ts       # HTTP client with retry + timeout
│   └── types.ts            # Core interfaces
├── components/
│   ├── articles/           # ArticleCard, HeroArticleCard, skeletons
│   ├── filters/            # SearchBar, CategoryPills, date/source/author filters
│   ├── preferences/        # PreferencesPanel
│   ├── layout/             # Header, MobileNav
│   └── ui/                 # Reusable Button component
├── hooks/                  # useArticles, useCategories, usePreferences, useSearchParams
├── stores/                 # Zustand preferences store
└── utils/                  # Dedup, hashing, date formatting, constants
```

## Features

- **Multi-source aggregation** — parallel fetch from 3 APIs with deduplication
- **Search & filtering** — keyword, date range, category, source, author
- **Personalized feed** — preferred sources/categories/authors ranked higher
- **Graceful degradation** — partial results when some providers fail, with status banner
- **Mobile responsive** — bottom-sheet filters, responsive grid
- **Accessible** — skip link, focus-visible, aria dialogs, reduced motion support

## API Response Shape

`GET /api/articles` returns 200 with `partial: true` when some providers fail, or 502 when all fail:

```json
{
  "data": [],
  "meta": {
    "page": 1,
    "pageSize": 20,
    "total": 100,
    "hasMore": true,
    "partial": false,
    "providerStatuses": [
      { "provider": "newsapi", "status": "ok", "latencyMs": 250 }
    ]
  },
  "errors": []
}
```

## Given More Time

- Cursor-based pagination across providers
- E2E tests with Playwright
- SSE or WebSocket for live breaking news
