# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

`erp-demo-frontend` is the React SPA client for the `erp-demo` Express/Mongoose backend (a sibling working directory). Vite + React 19 + TypeScript, styled with React-Bootstrap. It is a personal learning project.

## Commands

```sh
npm run dev       # Vite dev server (default http://localhost:5173)
npm run build     # Type-check (tsc -b) then production build (vite build)
npm run lint      # ESLint over the repo
npm run preview   # Serve the built bundle locally
```

There is no test runner configured. `npm run build` fails on any type error because it runs `tsc -b` before bundling — treat type errors as build breakers.

Configure the backend URL with a `.env` file: `VITE_API_URL=http://localhost:8000` (or wherever the backend runs). Without it the API client falls back to `http://localhost:8000`.

## Architecture

Entry: [src/main.tsx](src/main.tsx) mounts `<App>` in `StrictMode` and imports Bootstrap CSS + bootstrap-icons + `index.css` globally (once, here).

[src/App.tsx](src/App.tsx) is the whole app shell and router:

```
<AuthProvider>            ← auth state (context)
  <BrowserRouter>
    <AppLayout>           ← renders <NavBar> only when authenticated, then <Routes>
```

Every route except `/login` is wrapped in two guards, in this order:

```
<ProtectedRoute>                              ← redirects to /login if not authenticated
  <PermissionGuard module="x" feature="y">    ← shows an error message if the user lacks the permission
    <SomePage />
```

### Auth (the central concept)

- [src/context/AuthContext.tsx](src/context/AuthContext.tsx) holds `token` + decoded `userData` and exposes `login(token)`, `logout()`, `isAuthenticated`. The JWT is persisted in `localStorage` under `token` and decoded client-side by [src/utils/token.ts](src/utils/token.ts) (`decodeToken` — manual base64 of the JWT payload, no library). Consume it via the `useAuth()` hook; it throws if used outside `AuthProvider`.
- [src/api/axios.ts](src/api/axios.ts) is the single axios instance used by every page. A **request interceptor** reads `token` from `localStorage` and sets `Authorization: Bearer <token>`. There is no response interceptor (no automatic 401→logout) — keep that in mind when touching auth flows.

### Permission model — mirrors the backend

The decoded token carries `rolePermission` (`TokenPayload` in [src/types/auth.ts](src/types/auth.ts)), shaped exactly like the backend's role document: `rolePermission[module][feature].access`. The frontend uses the **same module/feature keys as the backend** (e.g. `product`/`readProducts`, `productCategory`/`createProductCategory`, `user`/`readUsers`, `stock`/`readShelves`). Two places consume it:

- [src/components/PermissionGuard.tsx](src/components/PermissionGuard.tsx) gates whole routes (used throughout `App.tsx`).
- Pages also gate individual UI elements inline, e.g. `userData?.rolePermission?.product?.createProduct?.access && (...)` to show/hide New/Edit/Delete buttons.

This is **UI gating only** — the backend is the real enforcement point. When adding a page or action, gate it with the matching backend feature key, and if the key doesn't exist in the backend role yet, it must be added there too (see the backend's `CLAUDE.md`).

### Pages

Pages live in [src/pages/](src/pages/). Two recurring shapes:

- **List pages** (`ProductsPage`, `UsersPage`, `StocksPage`, …): fetch once in `useEffect` via `api.get`, store in state, paginate **client-side** by slicing (`itemsPerPage = 10`) and render [src/components/Pagination.tsx](src/components/Pagination.tsx). Delete uses the browser `confirm()` then `api.delete`.
- **Form pages** (`ProductFormPage`, `UserFormPage`, …): one component serves both create and edit. It reads `useParams()` — an `id` present means edit (PUT, pre-loaded via GET), absent means create (POST). On success it `navigate()`s back to the list. Errors are caught with `error instanceof AxiosError` and shown from a local `error` state.

### Types

Per-domain interfaces in [src/types/](src/types/). Note the common split between a read shape and a request shape (e.g. `Product` vs `ProductRequest`). Add new domain types here.

## Conventions

- **React 19 with the React Compiler enabled** (`babel-plugin-react-compiler` via `@rolldown/plugin-babel` in [vite.config.ts](vite.config.ts)). It auto-memoizes — do **not** add manual `useMemo`/`useCallback`/`React.memo`; write plain components.
- **Strict TypeScript** ([tsconfig.app.json](tsconfig.app.json)): `strict`, `noUnusedLocals`, `noUnusedParameters`. `verbatimModuleSyntax` is on, so import types with `import type { ... }` (the codebase already does this consistently). Relative imports may include the `.tsx`/`.ts` extension (`allowImportingTsExtensions`).
- **UI**: React-Bootstrap components + Bootstrap 5.3 utility classes + bootstrap-icons (`<i className="bi bi-pencil">`). Prefer Bootstrap classes/components over custom CSS.
- **Routing**: `react-router-dom` v7 (`BrowserRouter`, `useNavigate`, `useParams`, `Link`); `react-router-bootstrap` (`LinkContainer`) wires Bootstrap nav items to the router in the Navbar.
- Components are heavily JSDoc-commented.

## Backend integration

The API is the `erp-demo` Express backend (see its `CLAUDE.md`). Contract points already wired here:
- JWT auth: login `POST /login` returns the token as `body.login`; it's stored in `localStorage` and attached as `Bearer` by the axios interceptor.
- The backend's default dev CORS origin is the Vite dev port (`http://localhost:5173`), so `npm run dev` works against a locally-running backend without extra CORS config.
- Endpoints used include `/login`, `/product` (+ `/product/category`), `/user`, `/stock` (+ `/stock/shelf`), and `/asset/*` (e.g. `/asset/product/units` for form dropdowns). Data is tenant-scoped server-side; the client never sends a tenant.