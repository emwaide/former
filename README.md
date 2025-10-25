# Former – Weight & Body Composition Tracker

Former is an Expo + React Native experience focused on a calm, data-rich journey for weight loss and recomposition. The project is structured so the visual system, data hooks, and future backend integration stay cleanly separated.

## Architecture overview

- **App shell**: Expo Router with a stack root and bottom tabs (`app/_layout.tsx`, `app/(tabs)/*`). Each screen renders a `DashboardContent`-style component with polished layouts.
- **Styling**: Tailwind via NativeWind drives all layout, color, and typography. `ThemeProvider` syncs the system/light/dark scheme with NativeWind so class-based variants respond instantly.
- **UI Kit**: Reusable primitives live in `components/` (Card, Screen, Stack, ProgressBar, Gauge, MiniLineChart, Chip, TextField, Button, etc.) and are composed entirely with Tailwind classes for fast iteration.
- **Data layer**: Expo SQLite helpers in `db/init.ts` and `db/dao.ts` manage migrations and CRUD. `db/seed.ts` synthesises 12 weeks of demo readings for Emily.
- **Hooks**: `hooks/useUser`, `useReadings`, and `useAnalytics` abstract database access and computed metrics so screens remain declarative.
- **Metrics utilities**: `lib/metrics.ts` contains the conversion and analytic formulas requested (BMI, taper curve, muscle preservation score, hydration flag, etc.).
- **Testing harness**: Lightweight runner in `tests/` compiles with TypeScript and validates metric behaviours plus analytic summaries without external dependencies.

## File tree (key folders)

```
app/
  _layout.tsx
  (tabs)/
    _layout.tsx
    dashboard.tsx
    trends.tsx
    log.tsx
    insights.tsx
    settings.tsx
components/
  Button.tsx, Card.tsx, ... (UI kit)
db/
  init.ts, dao.ts, seed.ts
hooks/
  useUser.ts, useReadings.ts, useAnalytics.ts
lib/
  metrics.ts
theme/
  ThemeProvider.tsx
utils/
  format.ts
tests/
  harness.ts, metrics.test.ts, dashboard.test.ts, run-tests.ts
```

## Styling system

- Tailwind classes (via NativeWind) express the calm medical palette, rounded surfaces, and generous spacing described in the design brief.
- Typography leans on Poppins weights (regular/medium/semibold) set through Tailwind’s arbitrary `font-[...]` utilities.
- Shadows, radii, and spacing values live in `tailwind.config.js` so updates propagate instantly across the app.
- The `ThemeProvider` only manages the light/dark preference and feeds it to NativeWind; Settings exposes a toggle for manual overrides.

## Data model & SQLite

- `db/init.ts` bootstraps the `users` and `readings` tables with indexes.
- `db/dao.ts` offers CRUD helpers with optimistic insert support in `useReadings`.
- `db/seed.ts` seeds Emily’s profile and 12 weeks of synthetic readings (weight, body fat %, muscle mass, hydration, etc.).
- Hooks call DAO functions and memoise derived analytics so the UI can swap to a remote API later with minimal changes.

## UI kit highlights

- **Screen**: Safe-area aware wrapper with optional scroll/padding.
- **Card**: Shadowed surfaces with optional gradients and press states.
- **Stack helpers**: `HStack`, `VStack`, `Spacer` for consistent spacing.
- **Charts**: SVG-based `MiniLineChart` (actual vs predicted), `Gauge` (muscle score), `StackedBar` (fat vs lean).
- **Inputs**: Tailwind-styled `TextField`, `NumberField`, `Stepper`, and `Chip` groups for filters and toggles.
- **Feedback**: `ProgressBar`, `MetricNumber`, `EmptyState`, `Toast` for interaction cues.

## Screens

1. **Dashboard** – Greeting, goal progress, weekly change, actual vs predicted chart, and muscle preservation gauge.
2. **Trends** – Range filter (7d/30d/12w), weight and composition charts, stacked fat vs lean by week.
3. **Log** – Comprehensive form with unit toggle, inline validation, and optimistic inserts.
4. **Insights** – Quick-glance cards (fat loss, hydration, muscle) and dose phase chips.
5. **Settings** – Profile editor (name, sex, height, units, start/target weight) plus light/dark toggle.

All screens respect ≥44pt hit targets, voice labels, and contrast requirements.

## Running the project

```bash
# install dependencies (already vendored via package-lock)
npm install

# start the Expo dev server
npm run dev
```

The first launch runs migrations and seeds demo data automatically via `initializeDatabase()` and `seedDemoData()`.

## Testing

A lightweight TypeScript harness validates the analytics:

```bash
npm test
```

This compiles the metrics and harness into `.tmp/tests` and executes the assertions (no external Jest dependency required in this sandboxed environment).

## Database seeding

Seeding occurs automatically on boot. The `npm run seed` script prints a reminder that no manual step is necessary. To reset data during development, delete the Expo SQLite file from your simulator/emulator.

## Linting & maintenance

- `npm run lint` – Expo lint rules for TypeScript/React Native.
- `npm run check:all` – Unused code/dependency sweeps (Knip, ts-prune, depcheck).

## Resetting

Use `npm run reset-project` if you ever need the blank Expo starter again.

Enjoy building on Former! Reach out if you need additional data providers or backend integrations.
