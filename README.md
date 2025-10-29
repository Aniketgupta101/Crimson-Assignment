# README

## Run the project

1) Install dependencies
```bash
npm install
```

2) Start the dev server
```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

Optional: build for production
```bash
npm run build && npm run start
```

## What this app does (short)
- Fetches research papers from the Enago public endpoint.
- Lets you search, sort, paginate, and export (CSV/PDF).
- Shows a rich detail view with a responsive modal.

## Architecture decisions (kept simple and practical)
- Next.js App Router with a small component split:
  - `features/PapersBrowser` holds page state and behavior (fetch, search, sort, paginate).
  - `ui/*` contains small reusable bits (card, button, spinner, error boundary).
  - `utils/export.ts` keeps CSV and print-preview logic separate from UI.
  - Global styles in `globals.scss` with CSS variables for consistent theming.
- Derived data is computed in steps: filter → sort → paginate. This keeps the state minimal and the code easier to reason about.

## Customization and styling
- Theme variables for color, radius, and shadows in `globals.scss` so tweaks are in one place.
- Cards and the modal are tuned for mobile: the image moves to the top on small screens, text is clamped to avoid overflow, and borders/shadows are softened for a more human feel.
- Pagination buttons are rounded “chips” with proper hover/active/focus styles.
- Respects reduced motion (animations/transitions are toned down if the user prefers).

## Optimization choices (right-sized for this scope)
- Debounced search so typing stays smooth.
- Print to PDF uses a hidden iframe to avoid opening a new tab.
- Clear error/loading/empty states so users always know what’s going on.

Nice-to-haves if we keep iterating
- Memoize filter/sort and use `useDeferredValue` for very large lists.
- Persist search/sort/page in the URL query so refresh and sharing work as expected.
- Abort in‑flight requests and add a tiny cache.
- Add a focus trap to the modal and return focus to the trigger on close.

## Hosted URL

Live demo: `https://crimsonassesmment.netlify.app/`

## Notes for reviewers
- Code aims to be readable first. Names are descriptive, and comments are used only where the intent may not be obvious.
- Styling choices were adjusted by hand based on what “felt” right in common breakpoints rather than pixel‑perfect specs.