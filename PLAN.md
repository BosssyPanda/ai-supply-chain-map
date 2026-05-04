# AI Supply Chain Explorer Implementation Plan

This app is added around the existing research repository. The current `data/`, `docs/`, `taxonomy/`, and `scripts/` files remain research source material and are not replaced by the React app.

## Implementation Shape

- Vite + React + TypeScript application in `src/`
- React Flow graph canvas with custom node and edge renderers
- ELK.js automatic layout with top-down and left-right options
- Tailwind CSS dark dashboard interface
- Typed sample data for the first polished UI pass
- PapaParse adapters that can normalize existing `data/*.csv` files into the app schema

## Acceptance Targets

- Default graph starts collapsed and readable
- Category clicks expand branches progressively
- Company/material clicks update the detail panel
- Company page routes work via `/companies/:id`
- Search and filters affect visible graph/table content
- Existing CSV validator continues to pass
- `npm run build` passes
