# AreaModel

> Inherits the base contract in `00-kit-overview.md`. Read that first — this spec only states what's
> specific to `AreaModel`.
>
> **Revision note (2026-09-17):** config schema and interaction model updated against the authored
> `content/concepts/arithmetic/multiplying-fractions.yaml` — the real mode is named `product`, not
> `multiply-fractions`, and factors greater than one are a **required** part of the mode (not a separate,
> later config as the original draft assumed), because the mandatory `stick-past-one`-equivalent preset here
> (a factor of 3/2) is what guards against the concept installing "multiplying by a fraction always shrinks"
> as a replacement false rule. See §2 and §3 for what changed.

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
    "mode": "product",               // "explore" | "product" | "equivalence-grid"
    "unit_square": { "show_outline": true, "label": "one whole" },
    "factors": [
      { "id": "across", "orientation": "horizontal", "fraction": { "numerator": 3, "denominator": 4 },
        "numerator_control": { "min": 0, "max": 8 }, "denominator_control": { "min": 1, "max": 8 },
        "allow_greater_than_one": true, "colour_token": "factor_a" },
      { "id": "down", "orientation": "vertical", "fraction": { "numerator": 2, "denominator": 3 },
        "numerator_control": { "min": 0, "max": 8 }, "denominator_control": { "min": 1, "max": 8 },
        "allow_greater_than_one": true, "colour_token": "factor_b" }
    ],
    "grid": { "auto_from_denominators": true, "show_cell_count": true },  // b-across by d-down, redrawn live
    "overlap": { "highlight": true, "show_cell_count": true, "compare_to_each_strip": true },  // strip A, strip B, overlap shown side by side
    "extend_beyond_unit": { "enabled": true, "draw_extra_unit_squares": true }, // a factor > 1 is visibly MORE than one copy
    "of_language": { "enabled": true, "show_symbolic_toggle": true },     // readout as "two thirds OF three quarters"
    "size_predictor": { "enabled": true, "ask_before_reveal": "bigger than both, between them, or smaller than both?", "record_prediction": true },
    "presets": [
      { "across": { "numerator": 1, "denominator": 2 }, "down": { "numerator": 1, "denominator": 2 } },
      { "across": { "numerator": 3, "denominator": 4 }, "down": { "numerator": 2, "denominator": 3 } },
      { "across": { "numerator": 3, "denominator": 4 }, "down": { "numerator": 1, "denominator": 1 } },  // times one, unchanged
      { "across": { "numerator": 3, "denominator": 4 }, "down": { "numerator": 3, "denominator": 2 } },  // factor past one — answer GROWS, mandatory guard
      { "across": { "numerator": 4, "denominator": 5 }, "down": { "numerator": 0, "denominator": 1 } }   // times zero
    ]
  }
}
```

**Build-time validation:** `factors[].denominator` ≤ 8 per axis (kept at 8, not 12, specifically because
`extend_beyond_unit` can render additional whole squares beyond the base grid — a wider per-axis cap
combined with `allow_greater_than_one` risks exceeding the render budget on `compact`); **`presets` must
include at least one entry with a factor's numerator exceeding its denominator** (the "factor past one"
guard) **and at least one entry with a zero factor** — this mirrors `fraction-bar.md` §2.4's build-time rule
almost exactly, for the same reason: a `product`-mode concept that only ever shows factors under one
installs "multiplying by a fraction always shrinks" as a false rule just as surely as omitting the
`stick-past-one` preset does on the division side. This is a build-time failure, not a style choice.
`max_denominator_per_axis` is no longer a separate cap distinct from `factors[].denominator`'s own bound —
the earlier draft's two-tier cap was redundant once the real per-axis bound (8) was confirmed against
content.

## 3. Interaction model

- Each factor has its own **stepper**, built from the same tap-segment interaction as `fraction-bar.md` (kit
  overview §3: shared conventions mean a skill learned in `FractionBar` transfers directly here) — dragging/
  tapping sets numerator and denominator independently per axis. **`allow_greater_than_one` is standard, not
  exceptional**: the numerator control's range (e.g. `{ min: 0, max: 8 }`) is not clamped to the
  denominator, so a factor can legitimately exceed one whole.
- The **overlap region is never directly editable.** The learner cannot shade or unshade overlap cells by
  hand; it is computed purely as the geometric intersection of the row-shading and column-shading. This is
  the single most important interaction-model decision in the spec: the overlap must be an *emergent
  consequence*, not another thing to manipulate, because the entire lesson is that the product is not a
  third independent choice.
- **`extend_beyond_unit`**: when a factor's numerator exceeds its denominator, the grid draws **additional
  whole unit squares** alongside the original one (`draw_extra_unit_squares: true`), so a factor like 3/2 is
  visibly "one whole square and half of a second," not a same-sized grid with an out-of-range shading. This
  is what makes the `size_predictor`'s "bigger than both, between them, or smaller than both" question
  honestly answerable across the whole preset range, including past one.
- **`overlap.compare_to_each_strip`**: alongside the grid itself, two 1D reference bars render — "strip A"
  (the across factor alone, unshaded-grid-free) and "strip B" (the down factor alone) — positioned next to
  the overlap so the learner can visually confirm the overlap is smaller than *each* strip individually
  when both factors are under one, without needing to count cells to see it.
- **`of_language`**: the readout can render as *"two thirds OF three quarters"* rather than *"two thirds
  times three quarters"* — a toggle, not a replacement, so the symbolic (`×`) reading is available
  alongside it via `show_symbolic_toggle` once the learner is ready for notation.
- In `explore` mode only, individual grid cells are directly tap-toggleable (building an arbitrary shaded
  region to explore "shaded cells / total cells" as a general fraction) — this mode has no row/column
  factors at all and is a distinct, simpler interaction than `product` mode.
- **`size_predictor`** gates a recorded prediction — "bigger than both, between them, or smaller than
  both" — before the overlap cell count is revealed, mirroring `fraction-bar.md`'s `measure`-mode
  `size_predictor` almost exactly (both exist for the same reason: to catch the "operation always makes X
  bigger/smaller" over-generalization before it calcifies, not after).
- **What the learner cannot break:** cannot exceed each factor's configured `denominator_control` bound
  (stepper stops responding past it); cannot touch a `locked: true` factor at all (no affordance rendered,
  kit overview §4.4); in `compact` layout the grid additionally cannot exceed the phone-safe denominator cap
  (§4) — the stepper simply won't go further, it does not present an unreachable "dense" state that later
  breaks touch precision. Unlike `fraction-bar.md`'s modes, `AreaModel`'s `product` mode has **no
  guided-discovery exception** — there's no deliberately-breakable state here, because the "answer bigger
  than both" over-generalization is caught by `size_predictor`'s gated prediction, not by letting the
  learner build an impossible grid.

## 4. Responsive behaviour

- **`compact`:** the grid takes the full width as a square; the two steppers stack **below** the grid
  (across-factor stepper first, then down-factor stepper) rather than beside it, keeping controls in the
  bottom-third thumb zone (kit overview §5.2). Tap-target math is explicit and binding: at a usable width of
  roughly 328dp (360dp screen − 32dp margin), an 8-column grid gives ~41dp cells — under the 44pt floor. So
  `compact` layout caps **interactive** grids at denominator ≤ 6 per axis (≈54dp cells, comfortably over the
  floor); if the concept's config specifies a denominator between 7 and 8, the grid renders in a
  **visual-only, non-interactive** mode for direct cell tapping — row/column shading is still set via the
  (always-44pt) steppers, which control the same grid, just not by tapping cells directly. This reflow rule
  is a hard floor, not a suggestion: cell size is never reduced below 44pt to fit more columns.
  `extend_beyond_unit`'s extra unit squares stack **below** the base grid on `compact` (vertical growth,
  matching the portrait aspect) rather than beside it; `overlap.compare_to_each_strip`'s two reference bars
  collapse to a single toggleable strip beneath the grid on `compact` (shown one at a time, switchable),
  since three simultaneous visual elements (grid + two full-width strips) don't fit legibly at 5" width.
- **`expanded`:** the grid renders centered with the across-stepper positioned horizontally **above** it and
  the down-stepper positioned vertically to its **left** — spatially mirroring the axis each stepper
  controls (kit overview §5.3's spatial-mapping rule). Larger cell size throughout; hovering a stepper
  highlights the row/column it's about to change before the change commits. `extend_beyond_unit`'s extra
  squares extend to the right/below the base grid without needing to collapse anything (desktop width
  affords it); both `compare_to_each_strip` reference bars render simultaneously alongside the grid.

## 5. Animation spec

| Trigger | Primitive | Duration | Pedagogical justification |
|---|---|---|---|
| Factor change (re-partition rows or columns) | `snap-settle` | 200–250ms | Grid lines redraw to the new denominator, same equivalence-by-motion logic as `fraction-bar.md`. |
| Row shading commits, then column shading commits, then overlap appears | `choreographed-sequence` — row shade fades in, **150ms hold**, column shade fades in, **150ms hold**, overlap cross-hatch fades in last | ~150ms per stage + holds | The overlap must visibly appear *after* and *because of* both shadings existing — simultaneity would hide the causal story that the product is a consequence of two independent choices, not a third one. This staggered reveal is the single most load-bearing animation in the widget. |
| Factor crosses past one (`extend_beyond_unit` engages) | extra unit square(s) slide/fade into frame alongside the base grid | 250ms | The extra square must visibly *arrive*, not simply appear, so the learner registers "the whole thing just got bigger" as an event tied to their own stepper action, not a static difference they might not notice. |
| `size_predictor` reveal | overlap cell count and `compare_to_each_strip` bars fade in together after the gated prediction is recorded | 300ms | Both the numeric answer and the strip comparison land in the same beat, so the learner checks their prediction against the full picture at once, not the number first and the visual confirmation as an afterthought. |
| `show_equation` / `of_language` symbolic reveal | fade-in, 300ms | 300ms | Gated behind ≥2 learner interactions (tracked via the `WidgetEvent` stream, kit overview §2), mirroring `concept.schema.json`'s `manipulate.reveal` pattern — the numeric rule is shown only after exploration, never before. |

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
9. **`factor-past-one__extend-beyond-unit__compact`** — mandatory guard preset (down factor 3/2), extra unit
   square(s) rendered, answer visibly larger than either base-unit shading. This is the multiplication
   mirror of `fraction-bar.md`'s GATE-CRITICAL `stick-past-one` state and should be treated with equivalent
   priority: omitting this golden test risks a silent regression that reinstalls "multiplying by a fraction
   always shrinks."
10. `factor-zero__compact` — the times-zero preset, confirming the grid/overlap renders an unambiguous empty
    state rather than an error or a blank/broken layout.
11. `compare-to-each-strip__expanded` — both 1D reference strips rendered alongside the grid and overlap,
    confirming the overlap is visually smaller than each strip for a both-under-one case.
12. `of-language-readout__compact` — the "two thirds OF three quarters" phrasing state, pre-symbolic-reveal.
13. `size-predictor-pending__compact` — gated-prediction state, overlap count and strips withheld until the
    learner commits a prediction.
14. `deuteranopia-row-col-overlap` — colour-vision-deficiency simulated render of state #2, confirming the
    cross-hatch communicates the overlap without relying on color.
15. `dark-theme__asymmetric-3-4-times-2-3` — dark-theme render of state #2.
