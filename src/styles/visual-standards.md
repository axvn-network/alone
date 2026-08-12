# Visual Style Contract

This document defines the standardized design tokens for the GVI Tech Holding project to ensure visual consistency and accessibility.

## 1. Color Palette (Design Tokens)

| Token | Hex | Usage |
| :--- | :--- | :--- |
| `gvi-navy` | `#07111D` | Primary backgrounds, dark text |
| `gvi-deep` | `#0B1B2E` | Secondary backgrounds |
| `gvi-charcoal` | `#111827` | Tertiary backgrounds/overlays |
| `gvi-gold` | `#C9A24A` | Primary accent, CTA, labels |
| `gvi-champagne`| `#E6C879` | Secondary accent |
| `gvi-ivory` | `#F4F1EA` | Primary body text |
| `gvi-silver` | `#AEB6C1` | Secondary/muted text |

## 2. Layout & Spacing

-   **Horizontal Padding:** `var(--section-px)`
-   **Vertical Padding:** `var(--section-py)`
-   **Container Width:** `max-w-[1400px]` (standardized)

## 3. Accessibility Standards
-   All text must meet WCAG AA contrast ratio requirements against its background.
-   Avoid low-contrast arbitrary hex values; use `gvi-` tokens exclusively.
