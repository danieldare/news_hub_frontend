# NewsHub

A modern news aggregator web application that unifies content from multiple news sources into a single, searchable, and personalized interface.

Built with **Next.js 16** (App Router), **TypeScript**, **Tailwind CSS 4**, and **Docker**.

## Architecture

```
┌───────────────────────────────────────────────────────┐
│         CLIENT COMPONENTS ('use client')              │
│  SearchBar │ Filters │ ArticleGrid │ Preferences      │
└─────────────────────────┬─────────────────────────────┘
                          │  fetch('/api/articles')
┌─────────────────────────┼─────────────────────────────┐
│         NEXT.JS ROUTE HANDLERS (Server)               │
│  /api/articles │ /api/categories │ /api/sources        │
│  (API keys secure, no CORS, server-side caching)      │
└─────────────────────────┬─────────────────────────────┘
                          │
┌─────────────────────────┼─────────────────────────────┐
│           AGGREGATION SERVICE (Server)                │
│  Parallel fetch │ Dedup │ Rank │ Paginate              │
└───────┬─────────┬─────────┬───────────────────────────┘
        │         │         │
  ┌─────┴───┐ ┌───┴─────┐ ┌┴────────┐
  │ NewsAPI  │ │Guardian │ │  NYT    │   Provider Adapters
  └─────────┘ └─────────┘ └─────────┘   (Strategy Pattern)
```

**Key design decisions:**

- **Route Handlers as API proxy** — All three API keys stay server-side. Client components call same-origin `/api/articles`, eliminating CORS issues and key exposure.
- **Strategy Pattern for providers** — Each API is encapsulated behind a `NewsProvider` interface. New sources can be added without modifying existing code (Open/Closed Principle).
- **URL state as source of truth** — All search/filter state lives in URL params via `useSearchParams`, making every view shareable and bookmarkable.
- **Zustand for preferences** — Lightweight global store with `localStorage` persistence. No backend needed for user accounts in v1.

## Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Framework | Next.js 16 (App Router) | Turbopack, Route Handlers, optimized navigation |
| Language | TypeScript 5 | Type safety across server/client boundary |
| Styling | Tailwind CSS 4 | CSS-first config, zero JS config files |
| Data Fetching | TanStack Query v5 | Client caching, dedup, retry, loading states |
| State | Zustand 5 + persist | Lightweight preferences with localStorage |
| Testing | Vitest + RTL + MSW | Fast tests, component testing, API mocking |
| Containerization | Docker (multi-stage) | Standalone Next.js output, minimal image |

## Getting Started

### Prerequisites

- Node.js 22+
- npm 10+
- API keys from:
  - [NewsAPI.org](https://newsapi.org/register)
  - [The Guardian](https://open-platform.theguardian.com/access/)
  - [New York Times](https://developer.nytimes.com/accounts/create)

### Local Development

```bash
# Clone and install
git clone https://github.com/yourusername/newshub.git
cd newshub
npm install

# Configure API keys
cp .env.example .env.local
# Edit .env.local and add your API keys

# Start dev server
npm run dev
# Open http://localhost:3000
```

### Docker

```bash
# Configure API keys
cp .env.example .env.local
# Edit .env.local and add your API keys

# Build and run
docker-compose up --build
# Open http://localhost:3000
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm test` | Run tests (Vitest) |
| `npm run test:watch` | Run tests in watch mode |

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # Route Handlers (server-side API proxy)
│   │   ├── articles/      # Aggregated article search
│   │   ├── categories/    # Merged categories from all providers
│   │   └── sources/       # Provider metadata
│   ├── search/            # Search results page
│   └── preferences/       # User preferences page
├── lib/
│   ├── providers/         # NewsAPI, Guardian, NYT adapters
│   ├── aggregator.ts      # Parallel fetch, dedup, rank, paginate
│   ├── api-client.ts      # Shared HTTP client with retry/timeout
│   └── types.ts           # Core TypeScript interfaces
├── components/
│   ├── articles/          # ArticleCard, ArticleGrid, skeletons
│   ├── filters/           # SearchBar, date/category/source/author
│   ├── preferences/       # PreferencesPanel
│   └── layout/            # Header, Sidebar, MobileNav
├── hooks/                 # useArticles, useDebounce, useSearchParams
├── stores/                # Zustand preference store
└── utils/                 # Dedup, date formatting, constants
```

## Features

- **Multi-source aggregation** — Articles from NewsAPI, The Guardian, and NYT in a unified feed
- **Search & filtering** — Keyword search, date range, category, source, and author filters
- **Personalized feed** — Preferred sources, categories, and authors ranked higher
- **URL-driven state** — Shareable/bookmarkable search URLs
- **Graceful degradation** — Partial results when individual providers fail
- **Mobile responsive** — 1/2/3-column grid with bottom-sheet filters on mobile
- **Server-side security** — API keys never exposed to client

## API Response Contract

`GET /api/articles` returns:

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

- HTTP 200 with `partial: true` when at least one provider succeeds
- HTTP 502 only when all providers fail

## Design Principles

- **SOLID** — Strategy pattern for providers, interface segregation via `ProviderFeature`
- **DRY** — Shared API client, unified `Article` type, reusable filter components
- **KISS** — URL params for filter state, localStorage for preferences, no unnecessary abstractions

## What I Would Do Differently With More Time

- Circuit breaker per provider to avoid repeated timeouts
- Redis/Upstash shared cache for reduced API consumption
- Cursor-based pagination across providers
- Playwright end-to-end tests
- Accessibility audit (WCAG 2.1 AA)
- Server-Sent Events for breaking news updates
