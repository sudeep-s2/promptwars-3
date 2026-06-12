# Project Constraints

- **Strict Static Site:** Zero backend, zero database, zero remote sync. Fails safe.
- **Offline-First Mandate:** Core features, including score calculation and projections, must function completely offline.
- **Robust Storage Wrappers:** Direct calls to `localStorage` are prohibited within React components to avoid security issues and quota crashes.
- **Strict TypeScript Validation:** Zero `any` declarations in the codebase.
- **No calculation spinners:** All mathematical carbon outputs must be calculated deterministically and render immediately.
- **Strict Input Validation:** All numeric inputs must be verified before modifying application state (e.g. range limits, type enforcement).
- **Maximum Build Size:** Total bundle size must remain under 10MB to maintain PWA requirements.
