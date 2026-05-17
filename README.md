# LeadFlow CRM

A single-page Lead Management CRM built for the Superleap Frontend Intern Assessment.

## Tech Stack Chosen (and Why)

### Framework: React 18 + Vite
React was chosen for its component model and ecosystem maturity, which makes it straightforward to split a CRM into reusable table, form, and board modules. Vite keeps iteration fast with near-instant startup and HMR, which matters when tuning filters, drag-and-drop interactions, and form behavior. TypeScript in strict mode adds compile-time guardrails for lead status and API DTO shapes.

### State Management: TanStack Query + Zustand
TanStack Query handles all server state (fetching, caching, optimistic updates, retries, and loading/error status) so async behavior stays consistent across list/detail/board views. Zustand is used only for lightweight client UI state like filters and toasts, keeping global state small and explicit. This split avoids overloading one tool for both server and local state concerns.

### Styling: Tailwind CSS
Tailwind was selected to ship a polished UI quickly with consistent spacing, color, and typography tokens. Utility classes make status visuals, badges, transitions, and responsive layouts easy to implement without large custom CSS files. It also keeps design iteration fast while still allowing reusable UI primitives.

### Mock API: json-server
json-server provides a realistic REST-like API with almost no setup overhead, which is ideal for a frontend assessment. It supports CRUD against `db.json`, enabling realistic integration work for optimistic UI and error handling. Running it alongside Vite simulates a normal app+API workflow locally.

## Setup & Run

### Prerequisites
- Node.js 18+
- npm or yarn

### Install
```bash
npm install
```

### Run (API + App together)
```bash
npm run dev
```

This starts:
- **Vite dev server** on `http://localhost:5173`
- **json-server API** on `http://localhost:3001`

The Vite proxy routes `/api/*` -> `http://localhost:3001/*` automatically.

### Build
```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── board/          # Kanban board (KanbanCard, KanbanColumn)
│   ├── layout/         # AppLayout with sidebar nav
│   ├── leads/          # Lead-specific components
│   │   ├── BulkActionBar.tsx
│   │   ├── LeadFilters.tsx
│   │   ├── LeadForm.tsx
│   │   ├── LeadFormModal.tsx
│   │   ├── LeadRow.tsx
│   │   └── LeadsTable.tsx
│   └── ui/             # Reusable UI primitives
│       ├── ConfirmDialog.tsx
│       ├── Modal.tsx
│       ├── Skeleton.tsx
│       ├── StatusBadge.tsx
│       ├── StatusTransitionMenu.tsx
│       └── Toast.tsx
├── hooks/
│   ├── useFilteredLeads.ts  # Client-side filter logic
│   ├── useLeads.ts          # All React Query mutations/queries
│   └── useUrlFilters.ts     # Sync filter state ↔ URL params
├── lib/
│   └── api.ts          # Axios API client
├── pages/
│   ├── BoardPage.tsx
│   ├── LeadDetailPage.tsx
│   └── LeadsPage.tsx
├── store/
│   ├── filterStore.ts  # Zustand: search/status/source filters
│   └── toastStore.ts   # Zustand: toast notifications
└── types/
    └── lead.ts         # Lead type, status config, transition logic
```

## Features

### Level 1 — Core CRUD + Status Rules ✅
- **List view** with sortable table, colored status badges, source tags, last-updated time
- **Search** by name or email (debounced, client-side)
- **Status filter** — multi-select pills that filter the table live
- **Source filter** — dropdown
- Empty, loading, and error states with clear messaging
- **Create lead** — modal form with inline validation (name required, email format)
- **Edit lead** — pre-filled modal, same validation
- **Delete lead** — confirmation dialog, optimistic removal with rollback on failure
- **Status transitions** — dropdown showing only valid next statuses; locked badge for CONVERTED/LOST
- **Deep-linkable URLs** — `/leads`, `/leads/:id`, `/leads/:id/edit`, `/board`
- Filters persist in URL query params (`?q=&status=&source=`)

### Level 2 — Kanban Board ✅
- `/board` route with 5 columns (NEW → CONTACTED → QUALIFIED → CONVERTED, LOST)
- **Drag-and-drop** via @dnd-kit — invalid drops snap back with visual error feedback
- **Optimistic updates** — card moves immediately, reverts on API failure
- CONVERTED and LOST columns are locked (cards are not draggable)
- Filters and search from the list view persist on the board via shared Zustand store + URL params

### Level 3 — Bulk Actions + Performance ✅
- **Row checkboxes** with select-all (indeterminate state supported)
- **Bulk action bar** floats above the page when ≥1 lead selected
- **Bulk delete** with confirmation and result summary toast (X succeeded, Y failed)
- **Bulk status change** — only shows transitions valid for *every* selected lead
- **Virtualisation** — `@tanstack/react-virtual` renders only visible rows; smooth with 5000+ leads
- **URL state** — search, status filter, source reflected in URL for shareability

## Design Decisions

### 1) Component, State, and Async Logic Organization
- Components are organized by domain: `components/leads` for table/form flows, `components/board` for Kanban, and `components/ui` for reusable primitives.
- Server state is centralized in `hooks/useleads.ts` using TanStack Query mutations/queries, while local cross-page UI state (filters, toasts) lives in lightweight Zustand stores.
- URL query params are synchronized through `hooks/useUrlFilters.ts` so views remain shareable and stable across route changes.

### 2) How Status Rules Are Enforced in the UI
- Status transitions are defined once in `src/type/lead.ts` via `STATUS_CONFIG` and helpers like `getValidTransitions()` and `isValidTransition()`.
- The transition UI only renders allowed options from these helpers, so invalid moves are never presented.
- Terminal statuses (`CONVERTED`, `LOST`) are treated as locked in both list and board interactions.

### 3) What I'd Do Differently for Offline Support or Concurrent Edits
- For offline support, I would add persistence for query cache and mutation queue (for example using local storage + background replay) so users can continue editing while disconnected and sync later.
- For concurrent edits, I would add optimistic concurrency control using record versions/ETags and detect conflicts on update; when conflicts occur, show a merge dialog (server version vs local draft).
- I would also introduce real-time updates (WebSocket/SSE) so status changes by another user appear instantly instead of only after refetch.

### 4) What I'd Improve With Another Week
- Add automated tests: status-rule unit tests, integration tests for CRUD flows, and drag/drop interaction tests.
- Improve accessibility with keyboard drag/drop affordances, stronger focus states, and screen-reader announcements for status changes.
- Add audit history per lead and richer analytics (conversion funnel, source performance, time-in-stage).

## AI Usage Note

AI tools were used to speed up boilerplate-heavy areas (query/mutation scaffolding, repetitive Tailwind class drafting, and API edge-case checklists). I accepted suggestions that reduced repetitive code but only after validating behavior against the status-transition rules and user flows in this project. I intentionally wrote critical business logic (status constraints, optimistic rollback behavior, and component boundaries) by hand, and rejected suggestions that introduced unnecessary abstraction or changed expected UX.

## Screen Recording (1-3 minutes)

walkthrough link 

- Recording link: https://drive.google.com/file/d/1kyHb5qNhPkowcLxr4Zqb37U0J9z55r18/view?usp=sharing
