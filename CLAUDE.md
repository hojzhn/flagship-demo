# Flagship — project notes

A hi-fi product mockup for a **fintech app** styled to Apple's macOS design system. Vite 8 + React 19, Tailwind v3, single-page interactive shell.

## Product domain

Flagship is a thematic investing app. The vocabulary is specific — read it once before building views.

- **Instruments** — individual securities (NVDA, MSFT, AAPL…). See [src/data/Instruments.js](src/data/Instruments.js). Fields: `id`, `ticker`, `name`, `price`, `sector`.
- **Themes** — analytical groupings (e.g. "AI infrastructure", "Cybersecurity"). Read-only taxonomy maintained by the platform. **The user does not back themes**, they're computed lenses over holdings. See [src/data/Themes.js](src/data/Themes.js).
- **Baskets** — the purchasable products. `name` + `shortName` (used in Portfolio's Instruments tab "held through" labels) + curator + fee + risk + horizon + weighted `holdings` + `themedAround[]` + `thesis` + `recentEvents[]`. See [src/data/Baskets.js](src/data/Baskets.js).
- **Standings** — a user's commitment to a basket. `{ basketId, level (monthly $), startedAt, currentValue, status: "active" | "paused" }`. The central user state. Created via `BACK_THEME`, mutated via `ADJUST_LEVEL` / `PAUSE` / `RESUME` / `RETRACT`.
- **Direct holdings** — shares held outside any basket. `{ instrumentId, shares, acquiredAt }`.

State + reducer live in [src/data/StandingsContext.jsx](src/data/StandingsContext.jsx). Wrap views in `<StandingsProvider>`, read via `useStandings()` (returns `{ state, dispatch }`). Action creators are exported as `actions` — e.g., `actions.backTheme(basketId, level)` creates a new standing with `currentValue = level`. The action name keeps the UI's "back this theme" phrasing even though standings reference a `basketId` (the theme is mechanical via `basket.themedAround`).

The `backTheme` action creator **generates the new `standingId` itself** and includes it in the action so the caller can navigate to that standing immediately after dispatching:
```js
const action = actions.backTheme(basketId, level);
dispatch(action);
goStanding(action.standingId);
```

### Derivation — never hand-roll, always use Derive.js

[src/data/Derive.js](src/data/Derive.js) is the single source of computed views. Use these instead of recomputing in components:

- `instrumentsForStanding(standing)` — per-instrument breakdown of one standing (weight, value, shares)
- `unifiedInstruments(standings, directHoldings)` — one row per instrument across all sources, sorted by value, with `sources[]` breakdown
- `portfolioTotal(standings, directHoldings)` — total $
- `themeExposures(standings, directHoldings)` — per-theme value, split into `backed` (held via a basket that's `themedAround` the theme) and `incidental` (held via some other basket / direct)
- `concentrationAlerts(standings, directHoldings, threshold)` — instruments ≥ N% of portfolio
- `tenureDays(standing)` — days since `startedAt`
- `newsForBasket(basketId)` — news items tagged with any theme the basket is `themedAround`
- `coverageLabel(n)` — maps 1–5 coverage rating to "Sparse" / "Limited" / "Moderate" / "Strong" / "Wide"
- `basketAllocationBySector(basket)` — groups holdings by sector, sums weights, sorts heaviest first
- `projectedExposure(standings, directHoldings, basket, level)` — current vs 12-month-projected exposure to the basket's primary theme; returns `null` if basket has no `themedAround`
- `themesReinforcedByStanding(standing, allStandings, directHoldings)` — for the standing detail page; each theme the standing's basket overlaps with, plus `contributionPct` (this standing's contribution to the theme), `exposurePct` (total portfolio exposure), and `isDirect` / `throughTickers`
- `activityForStanding(standing)` — synthesizes "First deployment" + monthly deployments from `standing.startedAt` + platform events from `basket.recentEvents`; sorted newest first
- `portfolioGain(standings, directHoldings)` — sum of (currentValue − contributed-at-level) across active standings; returns `{ gain, gainPct }`. Direct holdings excluded (no cost basis in data)
- `standingGain(standing)` — same calc for one standing; returns `{ gain, gainPct, contributed }`. Used by Discover BasketCard (when backed), Portfolio Standings rows, and StandingDetail header
- `newsForTheme(themeId)` — news items tagged with this theme id
- `basketsForTheme(themeId)` — baskets where `themedAround.includes(themeId)`
- `instrumentsForTheme(themeId)` — full instrument records for the theme's member ids

### Formatting — always use Format.js

[src/data/Format.js](src/data/Format.js) is the only place that formats numbers. Don't `toFixed` or `Intl.NumberFormat` in components. Use:

- `fmtMoney(n)` — USD whole dollars
- `fmtMoneyCents(n)` — USD with cents
- `fmtPct(n, digits?)` — multiplies by 100, appends `%`
- `fmtShares(n)` — share count with up to 2 decimals
- `fmtDays(n)` — "1 day" / "N days"

## Directory layout

The git/working root is `standing-app/` (outer), but the actual Vite project is nested one level deeper at `standing-app/standing-app/`. Always run npm scripts from there. Shell sessions in this environment lose `cwd` between commands — prefer absolute paths or `npm --prefix /c/Users/User/Desktop/Dev/standing-app/standing-app run <script>`.

```
standing-app/standing-app/
├── index.html                    # title: "Flagship"
├── tailwind.config.js            # custom palette wired to CSS vars
├── src/
│   ├── main.jsx                  # wraps <App> in <StandingsProvider>
│   ├── App.jsx                   # shell: <Sidebar> + <TopBar> + renderView(route)
│   ├── index.css                 # CSS vars (Apple system palette) + @tailwind
│   ├── components/               # SHARED primitives used across views
│   │   ├── Sidebar.jsx           # macOS nav, takes {active, onSelect}
│   │   ├── TopBar.jsx            # SHELL: children override default chrome
│   │   ├── TopBarChrome.jsx      # default chrome (breadcrumb, search, theme, CTA)
│   │   ├── SearchField.jsx       # shared search input
│   │   ├── Icon.jsx              # SF-Symbols-style inline SVGs (path map)
│   │   ├── Page.jsx              # page header (h1) + description + slot
│   │   ├── SectionHeader.jsx     # section header (h2) + meta + description
│   │   ├── Card.jsx              # rounded-macos card with hairline border
│   │   ├── Button.jsx            # variant={primary|outline|danger|ghost}, size={sm|md|lg}
│   │   ├── SegmentedControl.jsx  # pill-style tab switcher
│   │   ├── ProgressBar.jsx       # value/total bar
│   │   ├── HoldingsTable.jsx     # weighted holdings table (instrument/weight/30D/sector)
│   │   └── Pill.jsx              # tone={neutral|info|warning|success|danger|outline}, size={sm|md}
│   ├── views/                    # VIEW-specific code, one folder per view
│   │   ├── Discover/
│   │   │   ├── index.jsx         # tabs (Baskets | Themes), sort label, list
│   │   │   ├── ThemeCard.jsx     # one theme row, computes GAP tone inline
│   │   │   └── BasketCard.jsx    # one basket row — clickable, onClick navigates to detail
│   │   ├── BasketDetail/
│   │   │   ├── index.jsx         # breadcrumb + title + thesis + (holdings) + news + CTA
│   │   │   └── NewsCard.jsx      # title/summary/coverage dots/source pills
│   │   ├── Commit/
│   │   │   ├── index.jsx         # two-column commit panel + holdings table
│   │   │   ├── LevelPicker.jsx   # large $ input + $100/$250/$500/$1000 presets
│   │   │   └── CommitSummary.jsx # sector allocation, risk, cadence, fee, projected exposure
│   │   ├── StandingDetail/
│   │   │   ├── index.jsx         # header + adjust/pause/retract; mode-swaps body between summary and all-activity
│   │   │   ├── Activity.jsx      # 4-row preview + "See all activity" trigger
│   │   │   ├── AllActivity.jsx   # full timeline sub-view with "Back to overview"
│   │   │   └── ThemesReinforced.jsx  # contribution % / total exposure % per theme
│   │   ├── ThemeDetail/
│   │   │   ├── index.jsx         # breadcrumb + title + instruments + related baskets + news
│   │   │   └── ThemeInstruments.jsx  # instrument table (no weight column)
│   │   └── Portfolio/
│   │       ├── index.jsx         # portfolio total + gain + segmented tabs
│   │       ├── ConcentrationAlert.jsx  # warning banner for concentrated positions
│   │       ├── Standings.jsx     # tab: standings list (clickable rows) + Direct holdings synthetic row
│   │       ├── Instruments.jsx   # tab: unified instruments, expandable to show sources
│   │       └── Themes.jsx        # tab: theme exposures with backed/incidental bar + legend
│   └── data/                     # all domain data + derivation + formatting
│       ├── Instruments.js        # + change30d field per instrument
│       ├── Themes.js
│       ├── Baskets.js            # + thesis: { headline, paragraphs } per basket
│       ├── Seed.js               # initial standings + direct holdings
│       ├── News.js               # news items tagged by theme id
│       ├── Derive.js             # computed views (use these in components)
│       ├── Format.js             # number/money/% formatters
│       └── StandingsContext.jsx  # reducer + provider + useStandings()
```

### components/ vs views/

- **`src/components/`** — reusable primitives. Generic, no domain references. A `Pill` doesn't know what a basket is.
- **`src/views/<ViewName>/`** — one folder per top-level view. `index.jsx` is the entry. Co-located card/section components stay here unless a second view starts using them, then promote to `components/`.

The user-stated rule: **extract on the second use**, not the third.

### Filename-case in data/ — fixed

`Derive.js` and `StandingsContext.jsx` previously imported with lowercase paths (`./instruments.js`) while the files on disk are capitalized. Fixed in both. Keep imports matching the actual filename casing for Linux CI compatibility.

## Sidebar structure

```
Invest
  - Discover                 (built; has Themes + Baskets tabs)
    ├ BasketDetail           (drill-in from a basket card)
    │  ├ Commit              ("Back this basket" CTA when no standing)
    │  │  └ StandingDetail   (landing after a successful commit, from: "discover")
    │  └ StandingDetail      ("View your standing" CTA when a standing exists, from: "discover")
    └ ThemeDetail            (drill-in from a theme card)
  - Portfolio                (built; has Standings / Instruments / Themes tabs)
    └ StandingDetail         (drill-in from a row in Standings tab, from: "portfolio")
  - Activity                 (not yet built)
System
  - Settings                 (not yet built)
```

Default route is `{ name: "discover" }`. Heading "Invest" picked over "Markets" (this app is positions-centric, not markets-centric); "Standings" was tempting but too narrow.

## Routing — no router lib

App-level state is a single `route` object so detail pages can carry an id:
```
{ name: "discover" }
{ name: "portfolio" }
{ name: "basket-detail",   basketId:   "ai-infra-expansion" }
{ name: "commit",          basketId:   "ai-infra-expansion" }
{ name: "standing-detail", standingId: "std-ai-infra-1", from?: "discover" | "portfolio" }
{ name: "theme-detail",    themeId:    "ai-infrastructure" }
```

`App.jsx` switches on `route.name` to render the right view, to choose which top-bar variant to show, and to pick the right content `max-width` for the layout (narrow for reading views, wider for the commit panel). When entering a detail route, the sidebar's `active` is mapped back to its parent (`basket-detail` and `commit` → `discover`) so the sidebar keeps the right item highlighted.

No router library. Add a new top-level view by extending the switch in `App.jsx` and adding an entry to `Sidebar.jsx`'s NAV. Add a new detail route by giving it a unique `route.name` and the relevant ids.

### Content max-width

Default reading views use `max-w-[700px]` (centered) for readable column widths. Surfaces with tables or two-up layouts (Commit, Portfolio) use `max-w-[920px]`. The `wideRoutes` boolean in `App.jsx` controls this — add a new route here when it needs more room.

## TopBar — children override default chrome

`<TopBar>` is a shell. Two ways to use it:

```jsx
// Top-level view → default chrome (breadcrumb, search, theme, notif, CTA)
<TopBar view={route.name} theme={theme} onToggleTheme={toggleTheme} />

// Detail view → take full control via children
<TopBar>
  <BackButton />
  <PrimaryButton className="ml-auto" />
</TopBar>
```

When `children` is omitted, the shell renders `<TopBarChrome view theme onToggleTheme />`. Detail pages compose their own left/right content. The shell stays consistent (height, hairline-b, padding) across both modes.

### Discover view conventions (carry to other views)

- **Page header** uses `<Page title="…" description="…">` — keep description short, max ~2 lines (it's max-w-2xl).
- **Top of view = filter/tab row**, then a **meta row** (`N items` left, `Sorted by … ↓` right) in `text-2xs text-ink-muted`.
- **List of cards** with `space-y-3`, cards use `<Card>` (10px radius, hairline border, subtle shadow).
- Inside a card, **section dividers use `.hairline-t`** with `pt-4 mt-4`, not `<hr>` or `border-t`.
- **Money/percent/shares** must go through `Format.js` — never `toFixed` or `Intl` inline.
- **Tone semantics** (Pill + status colors):
  - `info` (blue) — informational. e.g. user has some backing on a theme.
  - `warning` (orange) — needs attention. e.g. ≥10% of portfolio is incidentally exposed to a theme with zero intentional backing. Be sparing — too many warnings and none stand out.
  - `neutral` (gray) — quantitative tag with no signal weight (curator, fee, horizon).
  - `success` / `danger` — keep reserved for actual good/bad events (gain/loss, paused, retracted).

## Components convention — extract on the second use

User-stated priority: **always extract a shared component when a UI pattern repeats**. Don't wait for a third copy. SearchField was extracted as soon as Sidebar + TopBar both wanted one. Watch for repetition aggressively, including across views.

Shared components live in `src/components/`. Domain-specific formatting belongs in `src/data/Format.js`, not new components.

## Design system — strict macOS look

User wants the actual Apple system palette, not "Apple HIG applied to custom colors". Don't drift toward warm/earthy tones — that was an earlier (rejected) palette.

- Light: `#ffffff` canvas, `#f5f5f7` surface, `#1d1d1f` ink, system blue `#007AFF` accent.
- Dark: `#1c1c1e` canvas, `#2c2c2e` surface, `#f5f5f7` ink, accent `#0a84ff`. Toggle by adding `.dark` to `<html>`.
- Typography: SF Pro stack in `index.css`. Letter-spacing `-0.01em`, weights 400/500/600. Use `.tnum` (tabular-nums) on numeric data.
- Sidebar uses `.vibrancy` (translucent + `backdrop-filter`) and `.hairline-r` (1px inset shadow). Borders are hairlines via `box-shadow: inset`, not `border:`, so they stay crisp on retina.
- Corner radius: 10px for cards (`rounded-macos`), 7–8px for controls.
- Status colors: `#34c759` success, `#ff9f0a` warning, `#ff3b30` danger.

## Motion conventions

**Page transitions** are driven by `framer-motion` in `App.jsx`. The renderView output is wrapped in `<AnimatePresence mode="wait">` keyed by `routeKey` — when the route changes, the old view fades + slides down (4px), the new one fades + slides up (4px) over 180ms. Detail routes include their id in the key so navigating between siblings (basket A → basket B) also transitions. Don't add ad-hoc fade-in classes on top-level view wrappers — the framer transition already covers it.

**Row cascade inside a list** is plain CSS, defined in `index.css`:

- `.row-enter` — fade + 6px upward slide (~320ms). Wrap each row in a list with this class and an inline `animationDelay` to stagger. Keep the animation on a **wrapper** element so the inner clickable row is free to own its own `transform` (hover lift) without conflict.

Stagger delay convention: `${i * 50}ms`. Fast enough to read as one motion, slow enough to register as a cascade.

Clickable card-style rows (BasketCard, ThemeCard, anything that wraps a `<Card>` in a `<button>`) get a subtle hover lift:

```
transition-transform duration-150 ease-out enabled:hover:-translate-y-0.5
```

Use `enabled:hover:` so disabled buttons stay flat. Don't change the shadow on hover — the lift alone reads cleanly against the existing `shadow-card`. Table-style rows (`<Row>` inside a `<Card padded={false}>`, like Portfolio Standings) use `hover:bg-black/[0.02]` instead of a lift — they're row dividers, not separated cards, so translating would break the row grid.

## CSS variable pattern — opacity support

To use Tailwind opacity modifiers (`bg-accent/10`, `bg-success/10`, `bg-canvas/80`) with our themed colors, variables are exposed in **two forms**:

```css
--accent: #007aff;          /* hex for inline use: style={{ stroke: 'var(--accent)' }} */
--accent-rgb: 0 122 255;    /* triplet for Tailwind: rgb(var(--accent-rgb) / <alpha-value>) */
```

If you add a new themed color that needs `/opacity`, add **both** forms in `index.css` (light + dark blocks) and the rgb variant in `tailwind.config.js`.

## Code style

The user's IDE auto-formatter normalizes to **double quotes + semicolons**. Match it in new files; the formatter will reconcile on save either way.

## Vite 8 / rolldown gotcha — JSX must be `.jsx`

Vite 8 uses rolldown's parser, which rejects JSX in `.js` files at the parser layer. `@vitejs/plugin-react`'s `include` option doesn't help — it runs too late. **All files with JSX must use `.jsx`** (or `.tsx`). Pure data/object files can stay `.js` (e.g. `Instruments.js`, `Themes.js`, `Baskets.js`).

## Build / dev

```
npm run dev       # vite, port 5173 (or 5174 if taken)
npm run build     # vite build
npm run lint
```

No tests. No router (single-view `useState` in App.jsx). State lives in `StandingsContext` (reducer + provider) — not Redux/Zustand.
