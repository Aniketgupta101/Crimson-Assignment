# Project decisions (short and human)

This is a quick note on why the app is built the way it is. No buzzwords, just what I actually did and why.

## What I aimed for
- Keep it simple: fetch papers, show them nicely, let people search/sort/export.
- Make the UI feel hand-tuned, not generated.
- Prefer readable code over clever code.

## Architecture in plain terms
- Next.js (App Router) with a small, obvious layout:
  - `features/PapersBrowser` holds page state and most of the logic (fetch, search, sort, paginate).
  - `ui/` has the small, reusable bits (card, button, spinner, error boundary).
  - `utils/export.ts` keeps CSV and print-preview logic out of the components.
  - Styling lives in `globals.scss` with CSS variables for colors, radii, and shadows.
- Data flows like this: API → keep a single array in state → derive a view by filtering → sorting → slicing for pagination.
  - This avoids over-managing state and keeps the mental model simple.

## Customization choices
- Theme tokens in one place (colors, radius, shadows). If something looks slightly off, it’s easy to tweak.
- Cards and the detail modal were adjusted by hand for mobile:
  - On narrow screens, the image moves above the details so it never gets cut off.
  - Text clamps to a couple of lines so the layout doesn’t jump around.
  - Shadows and borders are soft; buttons and pagination have gentle rounded corners.
- Pagination buttons behave like chips: clear hover/active/focus styles, and the active state keeps readable contrast.
- Motion is respectful: if the user prefers reduced motion, animations/transitions back off.

## Optimization that felt right for this scope
- Debounced search so typing doesn’t stutter.
- Print to PDF uses a hidden iframe to trigger the system print dialog (no new tab popping open).
- Clear loading, error, and empty states so there’s never a “what’s happening?” moment.

Things I’d add if we stretch the scope a bit:
- Memoize filter/sort and use `useDeferredValue` for extra large lists.
- Persist search/sort/page in the URL so refresh and sharing keep state.
- Abort in-flight requests and add a tiny client cache.
- Focus trap in the modal and return focus to the trigger on close (good a11y polish).

## Naming and readability
- Function and component names are written like I’d say them aloud (e.g., `downloadPapersAsCSV`, `openPrintPreviewForPapers`, `PapersBrowser`).
- Comments show up only when the intent isn’t obvious.
- The goal is that a new developer “gets it” after a quick skim.

## Trade-offs
- No heavy state library or schema validation here; the brief didn’t need it, and it would add noise.
- Virtualization is not included to keep the markup straightforward; easy to add later if the list grows huge.

That’s it. If something feels off when you use it, it should be a small style or copy tweak—not a rebuild.
