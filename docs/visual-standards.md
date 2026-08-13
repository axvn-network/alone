# Visual Style Contract

This document defines the standardized design tokens for the AXVN Tech Holding project to ensure visual consistency and accessibility.

## 1. Color Palette (Design Tokens)

| Token | Hex | Usage |
| :--- | :--- | :--- |
| `AXVN-navy` | `#07111D` | Primary backgrounds, dark text |
| `AXVN-deep` | `#0B1B2E` | Secondary backgrounds |
| `AXVN-charcoal` | `#111827` | Tertiary backgrounds/overlays |
| `AXVN-gold` | `#C9A24A` | Primary accent, CTA, labels |
| `AXVN-champagne`| `#E6C879` | Secondary accent |
| `AXVN-ivory` | `#F4F1EA` | Primary body text |
| `AXVN-silver` | `#AEB6C1` | Secondary/muted text |

## 2. Layout & Spacing

-   **Horizontal Padding:** `var(--section-px)`
-   **Vertical Padding:** `var(--section-py)`
-   **Container Width:** `max-w-[1400px]` (standardized)

## 3. Accessibility Standards
-   All text must meet WCAG AA contrast ratio requirements against its background.
-   Avoid low-contrast arbitrary hex values; use `AXVN-` tokens exclusively.
