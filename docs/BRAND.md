# Metanite HQ brand tokens

Source of truth for colours and type in the app. Owner-supplied values (Nov 2026) take precedence over the older website palette in `METANITE-CONTEXT.md`.

## Colours

| Token | Hex | Use |
| --- | --- | --- |
| `--green` | `#13e52c` | Primary action, active state, key numbers, logo |
| `--bg` | `#0f0f22` | Page ground |
| `--bg-2` | `#15152c` | Cards, sidebar |
| `--bg-3` | `#1d1d38` | Hover, inputs, table stripes |
| `--line` | `#2a2a48` | Hairline borders |
| `--white` | `#f6f5f1` | Headings, primary text |
| `--text` | `#d9d8d3` | Body text |
| `--muted` | `#8f8fa6` | Labels, secondary text |
| `--green-dim` | `rgba(19,229,44,0.12)` | Green tint backgrounds (badges, selected rows) |
| `--amber` | `#f5b73b` | Warning / "at risk" |
| `--red` | `#ff5c5c` | Error / "critical" |
| `--blue` | `#5aa9ff` | Informational |

Scores use one scale everywhere: red (0-39), amber (40-69), green (70-100).

## Type

- Display and headings: Bricolage Grotesque, weight 700-780, letter-spacing -0.02em.
- Body and UI: Manrope, weights 400-600.
- Numbers in tables and scorecards: Manrope with `font-variant-numeric: tabular-nums`.

Both fonts are open licence (OFL) and are self-hosted in `public/fonts/` once the app exists. No Google Fonts calls at runtime.

## Shape and texture

- Corner radius: 3px on controls and cards. No pill buttons.
- Hairline 1px borders instead of shadows.
- No gradient text, no glassmorphism.
- Green is an accent. At most one solid green element per view (the primary action).

## Logo

- `brand/metanite-logo.png` wordmark, dark grounds only.
- `brand/metanite-icon.png` triangle mark, used as favicon and sidebar mark.
