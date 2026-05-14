# Training Landing — Split Business Process & Automation Card

**Date:** 2026-05-14
**Status:** Approved

## Goal

Split the single "Business Process & Automation" module on the `/train-to-be-sharp` landing page into two paired offerings: an **introductory overview** (existing, lightly retitled) and a new **hands-on half-day workshop**.

This is a marketing copy change. It does not introduce a new course in the `courses` Postgres table.

## What changes

Single file: `src/app/train-to-be-sharp/page.tsx`.

### 1. Existing card — reposition as the introductory tier

Replace the current "Business Process & Automation" entry in the `modules` array (lines ~44-51) with:

```tsx
{
  icon: Briefcase,
  name: "Business Process & Automation",
  price: "$200",
  tag: "Two-hour session · Introduction",
  description:
    "Tips, tricks, and insights from how we actually run Cove Blades — AI automation for inbound calls and texts, plus the logistical playbook for drop-off, pickup, and mobile operations. The lay-of-the-land before you build your own.",
},
```

### 2. Add a new fourth card — hands-on build

Append to the `modules` array:

```tsx
{
  icon: Sparkles,
  name: "Build Your Business with AI — Hands-On",
  price: "$600",
  tag: "Half-day workshop",
  description:
    "A 3-4 hour one-on-one build session. Together we set up your website, email marketing, social profiles, business cards, phone number, and AI assistant — all using modern AI tooling. Walk out with a working business toolkit and the playbook to maintain it.",
},
```

### 3. Add `Sparkles` to the lucide-react import block

Insert `Sparkles` into the existing import (alphabetical placement is fine; the existing block is not strictly alphabetical).

### 4. Update the page metadata description

Replace the current description on line ~22-23:

> "Two- to three-day knife sharpening practicum with Cove Blades. Three modules: One-Inch Grinder ($600), Two-Inch Grinder ($400), Business Process & Automation ($200). Sharpness-tester verified, microscope-checked, every session recorded."

with:

> "Two- to three-day knife sharpening practicum with Cove Blades. Four modules: One-Inch Grinder ($600), Two-Inch Grinder ($400), Business Process & Automation ($200), and Build Your Business with AI Hands-On ($600). Sharpness-tester verified, microscope-checked, every session recorded."

### 5. Verify grid layout reflow

Confirm the existing grid container holding the modules accommodates 4 cards visually. If the container uses a fixed `grid-cols-3` it should change to a responsive 2×2 / 4-up layout (e.g. `md:grid-cols-2 lg:grid-cols-4` or similar) — only adjust if the rendered output looks broken.

## Out of scope

- No DB migration, no new row in `public.courses`. The cards are landing-page marketing only.
- No changes to `/courses`, `/dashboard`, or any other page.
- No copy changes elsewhere on the page.
- No SEO redirects.

## Verification

1. `npm run build` succeeds.
2. Browser visit to `/train-to-be-sharp` shows four module cards including the new hands-on one with `Sparkles` icon, "Half-day workshop" tag, $600 price.
3. Page `<meta name="description">` mentions four modules.
4. Existing "Business Process & Automation" card now reads "Two-hour session · Introduction" and the revised description.
