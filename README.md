# MOUSUMI — Smart Tailoring, Barishal

A custom-stitching e-commerce web app for MOUSUMI: browse designs, save
measurements, book a doorstep pickup slot, pay, and track an order live —
all styled as a single self-contained "app" screen (fixed header, internal
navigation, modals, drawer, toasts).

This is a clean React + Vite rebuild of the design in [`implement/`](implement/)
(an exported `.dc.html` prototype that only runs through its own proprietary
`support.js` runtime and CDN-loaded React/Babel). Every screen, animation,
color, and interaction from that prototype is reproduced here — same
`@keyframes`, same easing curves, same hover states — but as ordinary,
buildable, dependency-light source files instead of a single 1,800-line
HTML document.

## Getting started

```bash
npm install
npm run dev
```

Then open the URL Vite prints (defaults to **http://localhost:5174**).

Other scripts:

```bash
npm run build     # production build to dist/
npm run preview   # serve the production build locally
```

Requires Node.js 18+.

## Project structure

```
index.html                   Vite entry HTML (fonts, meta tags, favicon)
public/assets/                Product photos + the measurement-guide video
src/
  main.jsx                   Bootstrap — decides shop vs staff panel, see below
  App.jsx                    Mounts the print receipt + the app shell (shop)
  context/
    AppContext.jsx           All shop state + actions (cart, auth, orders, …)
    selectors.js              Derives everything a screen reads from that state
  data/
    catalog.js                Designs, categories, budgets, demo orders, offers…
  components/
    layout/                  Header, nav drawer, search overlay, toast
    modals/                  Login/OTP, account/address/measurement editors
    pages/                   One file per screen (Home, Catalogue, Design,
                               Order flow, Cart, Track, How it works, Offers,
                               Reviews, Account, Order confirmation)
    Receipt.jsx               Print-only invoice (triggered by "Print receipt")
  staff/                     The staff panel — a second, separate app that
                               shares this build but not App.jsx's state.
                               StaffContext.jsx (auth only), StaffLogin,
                               StaffLayout, AdminDashboard (full order
                               management), TailorQueue (assigned orders,
                               stage-only). See supabase/README.md for the
                               roles/permissions and staff-login setup.
  lib/
    staffApi.js                Staff panel's Supabase calls (see supabase/README.md)
  styles/
    global.css                Reset, fonts, the full @keyframes library, print rules
    interactions.css          Hover/focus effects as reusable classes
    responsive.css             Mobile Safari zoom fix + an overflow-x safety net
implement/                    Original exported design (kept for reference,
                               not part of the build — see .gitignore)
```

**Shop vs staff panel:** `main.jsx` picks one of two completely separate
apps before anything else renders — the shop (`App.jsx`) or the staff panel
(`src/staff/StaffApp.jsx`) — based on hostname (`staff.mousumi.dipusardar.com`
vs `mousumi.dipusardar.com`, both pointed at this same deployment) or, for
local dev where there's only one hostname, a `/staff` path prefix
(`localhost:5174/staff`). They share this repo/build/Supabase project but
nothing else — no shared React state, no shared auth session.

`context/selectors.js` is the heart of the app: one function that takes the
current state and returns everything a page needs — computed labels, list
data, and the click/change handlers — mirroring the original prototype's
logic 1:1. Pages themselves stay close to plain markup; almost no logic
lives in the page components.

## What's real vs. simulated right now

This matches the original prototype exactly: it's a fully interactive
**frontend**, with **no backend yet**. Concretely:

- Everything lives in React state for the current tab — refreshing the
  page resets the cart, login session, and any edits.
- Login is phone + a 4-digit code that is always **`1234`** (there's no SMS
  provider wired up).
- The 3 sample orders (for track/account) and the catalogue are hard-coded
  in `src/data/catalog.js`, not fetched from anywhere.
- "Pay" on checkout doesn't talk to bKash/Nagad/Rocket/a card processor —
  it just completes the order.

None of that affects how the site looks, animates, or navigates — it's
exactly as demo-able as the original. Turning it into a live business
system (persistent orders, real auth/SMS, real payment capture, an admin
view for order status) is backend work and its own set of decisions
(hosting, database, payment provider accounts); happy to scope that next
whenever you're ready.

## Design fidelity notes

- Every dynamic inline style from the source (`style="…"` strings built in
  JS) was converted to a plain React style object, property by property —
  not rewritten or reinterpreted.
- Every `style-hover="…"` / `style-focus="…"` in the source became a real
  CSS class with a `:hover`/`:focus` rule in `src/styles/interactions.css`
  (see the comment at the top of that file for why `!important` is used
  there).
- All `@keyframes` (`msFloat`, `msRise`, `msHeroInA/B`, `msMarquee`, `msToast`,
  `msDrawer`, …) are unchanged in `src/styles/global.css`.
- Only the two photos used exclusively by the unrelated `AURA Store.dc.html`
  sample in `implement/` were left out of `public/assets/`; everything
  MOUSUMI actually uses is there.
