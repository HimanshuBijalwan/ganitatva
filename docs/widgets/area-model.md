# AreaModel

> Inherits the base contract in `00-kit-overview.md`. Read that first — this spec only states what's
> specific to `AreaModel`.

## 1. Teaching job

**The one misunderstanding this widget exists to destroy:** a learner believes multiplication always makes
things bigger — so "2/3 × 3/4" feels like it should exceed both factors, the same way 2×3 exceeds both 2
and 3 for whole numbers. `AreaModel` destroys this by making the answer a **visible overlap, not a
computed total**: a unit square (the whole = 1) is partitioned by rows for one factor and by columns for
the other; the learner sets each factor independently (shading rows, then shading columns), and the product
is *whatever cells both shadings land on* — an intersection, which is necessarily smaller than either
shading alone. The learner never applies the rule "multiply numerators, multiply denominators"; they watch
an overlap region emerge from two independent choices and count it. This is the direct complement to
`number-line.md`'s division story — see `00-kit-overview.md` §10 for how the three fractions-slice widgets
divide the labor.

## 2. Config schema

```jsonc
{
  "type": "AreaModel",
  "config": {
    "id": "grid-a",
    "interaction_level": "guided",
    "mode": "multiply-fractions",    // "explore" | "multiply-fractions" | "multiply-integers-partial-products" | "equivalence-grid"
    "factor_a": { "numerator": 3, "denominator": 4, "axis": "rows",    "locked": false },
    "factor_b": { "numerator": 2, "denominator": 3, "axis": "columns", "locked": false },
    "max_denominator_per_axis": 8,   // hard cap; compact layout further restricts, see §4
    "show_grid_lines": true,
    "show_overlap_count": true,
    "show_equation": false,          // revealed only after ≥2 learner interactions — see §5
    "color_roles": { "row_shade": "primary", "col_shade": "secondary", "overlap_shade": "tertiary" }
  }
}
```

**Build-time validation:** `factor_a.denominator` and `factor_b.denominator` each ≤
`max_denominator_per_axis`; `numerator <= denominator` for each factor (proper fractions only — improper
products are a later, explicitly different config, not this widget's default teaching job);
`max_denominator_per_axis` itself capped at 12 kit-wide, matching `fraction-bar.md`'s cap, so the two
widgets stay visually consistent for a learner moving between them.

## 3. Interaction model

- Each factor has its own **row-stepper** / **column-stepper**, built from the same tap-segment interaction
  as `fraction-bar.md` (kit overview §3: shared conventions mean a skill learned in `FractionBar` transfers
  directly here) — dragging/tapping sets numerator and denominator independently per axis.
- The **overlap region is never directly editable.** The learner cannot shade or unshade overlap cells by
  hand; it is computed purely as the geometric intersection of the row-shading and column-shading. This is
  the single most important interaction-model decision in the spec: the overlap must be an *emergent
  consequence*, not another thing to manipulate, because the entire lesson is that the product is not a
  third independent choice.
- In `explore` mode only, individual grid cells are directly tap-toggleable (building an arbitrary shaded
  region to explore "shaded cells / total cells" as a general fraction) — this mode has no row/column
  factors at all and is a distinct, simpler interaction than the multiplication modes.
- **What the learner cannot break:** cannot exceed `max_denominator_per_axis` (stepper stops responding past
  the bound); cannot set a numerator exceeding the denominator on either axis; cannot touch a `locked: true`
  factor at all (no affordance rendered, kit overview §4.4); in `compact` layout the grid additionally
  cannot exceed the phone-safe denominator cap (§4) — the stepper simply won't go further, it does not
  present an unreachable "dense" state that later breaks touch precision.

## 4. Responsive behaviour

- **`compact`:** the grid takes the full width as a square; the two steppers stack **below** the grid
  (row-factor stepper first, then column-factor stepper) rather than beside it, keeping controls in the
  bottom-third thumb zone (kit overview §5.2). Tap-target math is explicit and binding: at a usable width of
  roughly 328dp (360dp screen − 32dp margin), an 8-column grid gives ~41dp cells — under the 44pt floor. So
  `compact` layout caps **interactive** grids at denominator ≤ 6 per axis (≈54dp cells, comfortably over the
  floor); if the concept's config specifies a denominator between 7 and `max_denominator_per_axis` (8), the
  grid renders in a **visual-only, non-interactive** mode for direct cell tapping — row/column shading is
  still set via the (always-44pt) steppers, which control the same grid, just not by tapping cells directly.
  This reflow rule is a hard floor, not a suggestion: cell size is never reduced below 44pt to fit more
  columns.
- **`expanded`:** the grid renders centered with the row-stepper positioned vertically to its **left** and
  the column-stepper positioned horizontally **above** it — spatially mirroring the axis each stepper
  controls (kit overview §5.3's spatial-mapping rule). Larger cell size throughout; hovering a stepper
  highlights the row/column it's about to change before the change commits.

## 5. Animation spec

| Trigger | Primitive | Duration | Pedagogical justification |
|---|---|---|---|
| Factor change (re-partition rows or columns) | `snap-settle` | 200–250ms | Grid lines redraw to the new denominator, same equivalence-by-motion logic as `fraction-bar.md`. |
| Row shading commits, then column shading commits, then overlap appears | `choreographed-sequence` — row shade fades in, **150ms hold**, column shade fades in, **150ms hold**, overlap cross-hatch fades in last | ~150ms per stage + holds | The overlap must visibly appear *after* and *because of* both shadings existing — simultaneity would hide the causal story that the product is a consequence of two independent choices, not a third one. This staggered reveal is the single most load-bearing animation in the widget. |
| `show_equation` reveal | fade-in, 300ms | 300ms | Gated behind ≥2 learner interactions (tracked via the `WidgetEvent` stream, kit overview §2), mirroring `concept.schema.json`'s `manipulate.reveal` pattern — the numeric rule is shown only after exploration, never before. |

## 6. Accessibility

- Row shading and column shading use different **colors** and different **hatch orientations** (horizontal
  lines for rows, vertical lines for columns) so the overlap renders as a **cross-hatch** that is legible by
  pattern alone, independent of color perception (kit overview §7) — this is the widget's primary
  colour-never-sole-carrier case and is explicitly golden-tested (§7 below).
- `describeState()` returns all three facts together, e.g.: *"Rows: 3 of 4 shaded. Columns: 2 of 3 shaded.
  Overlap: 6 of 12 cells, equals one half."* — never just the final answer, since the whole pedagogical
  point is the relationship between the three numbers, not the isolated product.
- In `explore` mode, grid cells are individually focusable via roving tabindex on `expanded` (keyboard
  parity, kit overview §4.5); each cell announces its row/column position and shaded state on focus.
- Steppers are separately labeled Semantics nodes distinct from the grid itself (matching
  `fraction-bar.md`'s pattern), so "the control that changes rows" is navigable independently of "the grid
  that shows the result."

## 7. Golden-test plan

1. `default-half-times-half__compact` / `__expanded` — the canonical 1/2 × 1/2 = 1/4 case.
2. `asymmetric-3-4-times-2-3__expanded` — the widget's flagship non-trivial case, matching the fractions
   vertical slice's worked example.
3. `dense-denominator-8__compact` — forces the visual-only/steppers-only reflow rule from §4; must show
   non-interactive grid + functioning steppers, not sub-44pt tappable cells.
4. `dense-denominator-8__expanded` — same config, confirming `expanded` stays fully cell-interactive.
5. `repartition-mid-animation__t0.5` — pinned mid-frame of the `snap-settle` re-partition.
6. `overlap-reveal__pre-row`, `__post-row-pre-column`, `__post-column-pre-overlap`, `__overlap-revealed` —
   four pinned frames of the `choreographed-sequence`, since the ordering itself is the thing under test,
   not just the endpoints. This is the single most pedagogically load-bearing sequence in the spec (kit
   overview §9.3.2).
7. `explore-mode-arbitrary-shading__compact` — non-rectangular hand-built selection in `explore` mode.
8. `equation-reveal-hidden` vs `equation-reveal-shown` — before/after the ≥2-interaction gate.
9. `deuteranopia-row-col-overlap` — colour-vision-deficiency simulated render of state #2, confirming the
   cross-hatch communicates the overlap without relying on color.
10. `dark-theme__asymmetric-3-4-times-2-3` — dark-theme render of state #2.
