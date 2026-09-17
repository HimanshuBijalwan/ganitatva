# NumberLine

> Inherits the base contract in `00-kit-overview.md`. Read that first — this spec only states what's
> specific to `NumberLine`.
>
> **Revision note (2026-09-17):** rewritten against the seven authored Phase 1 concept YAML files in
> `content/concepts/arithmetic/`. The original spec invented a `measure-division` mode and made it the
> widget's primary teaching job. That mode is **not** what the authored content actually does — the
> hands-on division insight (remainder laid against the divisor) lives on `FractionBar`'s `measure` mode
> instead (see `fraction-bar.md` and `00-kit-overview.md` §10). `NumberLine`'s real, confirmed jobs are: the
> "a fraction is one number with a position" reframe, comparison via landmark reasoning, and a scripted,
> largely non-interactive Intuition-layer illustration role. This revision replaces the invented mode with
> the three modes actually authored.

## 1. Teaching job

**The one misunderstanding this widget exists to destroy:** a learner treats a fraction as **two separate
whole numbers stacked on top of each other** ("3 and 4") rather than **one number with a single position**
— an address reached by a stride size and a stride count together, the same way a house address is a
street name and a house number, not two unrelated facts. This is the hinge the entire fractions chain turns
on (`fractions-on-number-line.yaml` calls it exactly that): equivalence becomes "one point, many names,"
comparison becomes "whichever marker sits further right," and even division becomes a question about
hopping the line in steps of a chosen size — but `NumberLine` itself only needs to land the reframe, not
carry every downstream operation.

Two teaching jobs fall out of the same reframe, each carried by a different mode (§2):

- **Position, not a pair** (`stride-explore` mode): the two numbers are walking directions — stride size,
  stride count — not two independently-readable quantities. Also lands two consequences the learner finds
  for themselves: there's no wall at one (an "improper" fraction just means you walked past a milestone),
  and different directions can land on the same spot (seeding equivalence).
- **Comparable only via a shared unit or a trusted landmark** (`compare` mode): two counts are only
  comparable when they count the same-sized piece — cross-denominator comparison ("3/8 vs 2/3, compare the
  numerators") is the same error as comparing rice grains to watermelons by count alone.

## 2. Config schema

`NumberLine` has three confirmed modes plus one general-purpose mode kept for concepts outside the Phase 1
fractions chain (negative numbers, generic magnitude) that hasn't been exercised by authored content yet.

### 2.1 `stride-explore` — the position reframe

```jsonc
{
  "type": "NumberLine",
  "config": {
    "mode": "stride-explore",
    "range": { "min": 0, "max": 2 }, "whole_unit": 1,
    "stride": { "control": "slider", "label": "strides per whole", "min": 1, "max": 12, "step": 1,
      "initial": 4, "render": "tick marks subdividing every whole, redrawn live" },
    "marker": { "id": "walker", "initial_value": 0.75, "draggable": true,
      "snap_to": "stride_ticks", "snap_tolerance_px": 12,
      "free_drag_toggle": "let me stand anywhere" },   // guided-discovery exception, see §3
    "readout": { "primary": "fraction", "secondary": "stride_sentence",
      "show_decimal_toggle": true, "hide_labels_toggle": "hide the labels and make me predict" },
    "trail": { "show_stride_arcs": true, "colour_completed_strides": true },
    "landmarks": { "show_whole_numbers": true, "show_half_marker": true },
    "second_marker": { "enabled": true, "id": "ghost" },  // park a second fraction to compare / catch an equal name
    "zoom": { "enabled": true, "min_range": 0.05 },
    "endpoints_editable": { "enabled": true, "presets": [[0, 1], [0, 2], [0, 4], [2, 3]] }
  }
}
```

### 2.2 `compare` — landmark-based magnitude judgement

```jsonc
{
  "type": "NumberLine",
  "config": {
    "mode": "compare",
    "range": { "min": 0, "max": 1 }, "allow_range_extend_to": 2,
    "landmarks": { "show_zero_one": true, "show_half": true,
      "half_marker_style": "dashed vertical line, labelled", "show_quarter_marks_toggle": true },
    "markers": [
      { "id": "yours", "colour_token": "learner_a", "fraction": { "numerator": 3, "denominator": 5 },
        "numerator_control": { "min": 0, "max": 24 }, "denominator_control": { "min": 1, "max": 12 } },
      { "id": "theirs", "colour_token": "learner_b", "fraction": { "numerator": 2, "denominator": 3 },
        "numerator_control": { "min": 0, "max": 24 }, "denominator_control": { "min": 1, "max": 12 } }
    ],
    "tick_mode": { "options": ["own_denominator", "common_denominator", "none"], "initial": "own_denominator",
      "common_denominator_animation_ms": 600 },
    "predict_first": { "enabled": true, "hide_positions_until_prediction": true },
    "readout": { "show_both_names_in_common_pieces": true, "show_distance_from_half": true,
      "show_distance_from_one": true, "show_symbol_toggle": true },
    "challenge_mode": { "tasks": [
      { "id": "find-a-between" },
      { "id": "bigger-top-and-bottom-yet-smaller" },
      { "id": "decide-using-half-only", "disable_common_denominator": true }  // forces landmark reasoning
    ] }
  }
}
```

**Note:** markers in `compare` mode are **not** freely dragged along the line by position — they're set via
each marker's own `numerator_control`/`denominator_control` steppers, and the line shows where that fraction
*lands*. This is a deliberate difference from `stride-explore`'s directly-draggable marker: the teaching job
here is "the fraction's two numbers determine the position," so the position must be a *consequence* of the
numbers, not an independently draggable fact (mirroring `area-model.md`'s rule that the overlap must be a
computed consequence, never a third independently-editable thing).

### 2.3 `illustrate` — scripted Intuition-layer support (readOnly)

```jsonc
{
  "type": "NumberLine",
  "config": {
    "mode": "illustrate",
    "interaction_level": "readOnly",     // always readOnly in this mode — see §3
    "range": { "min": 0, "max": 1 }, "landmarks": { "show_zero_one": true },
    "target_marker": { "value_fraction": { "numerator": 3, "denominator": 4 } },
    "hops": { "step_fraction": { "numerator": 1, "denominator": 2 }, "animate": true, "animate_ms": 900,
      "draw_style": "arcs above the line, each arc labelled as one stick",
      "partial_hop": { "show": true, "shade_fraction_of_hop": true } },
    "count_readout": { "unit": "sticks", "format": "mixed", "show_unit_word_always": true },
    "labels_off_until_hops_complete": true
  }
}
```

This mode exists specifically because `dividing-fractions.yaml` needs a **non-interactive** walkthrough of
the ribbon-and-stick idea at the Intuition layer, *before* the learner gets their hands on
`FractionBar`'s `measure` mode at the Manipulate layer. It is deliberately simpler than `stride-explore`: no
draggable marker, no stride slider — just a scripted hop sequence with arcs, run once, watched. See
`fraction-bar.md` §1 for why the actual hands-on gesture lives on the other widget.

### 2.4 `jump` — general-purpose directional movement (not yet exercised by Phase 1 content)

Retained for concepts outside the fractions chain — most importantly negative numbers, where directional
movement in a concrete context (temperature drop, elevation change, debt) is the safer framing than static
labeling (§3's negative-number caveat, unchanged from the previous revision). Config shape:
`{ "mode": "jump", "jump": { "start": number, "size": number, "direction": "forward"|"backward", "show_arcs": true } }`,
same hop-button interaction pattern as `illustrate` but learner-paced and interactive rather than scripted.

**Build-time validation (all modes):** `range.min < range.max`; `stride-explore`'s `stride.min >= 1` (a
zero-stride line is nonsensical, not a guided-discovery case — contrast with `fraction-bar.md`'s
`allow_zero_partitions`, which *is* a deliberate breakable case in a different widget); every marker's
resolved value must lie within `range` (extended by `allow_range_extend_to` where present) or the build
fails; `jump.size` must be non-zero.

## 3. Interaction model

- **`stride-explore`:** the stride slider re-partitions the whole live (tick marks redraw as the slider
  moves); the marker drags along the line and **snaps to `stride_ticks`** by default. The
  **`free_drag_toggle`** is a named guided-discovery exception (kit overview §4.2 addendum): switching it on
  lets the learner park the marker anywhere, unsnapped, specifically so the next prompt — "hunt for a stride
  size that puts a tick exactly under it" — has a genuine search to perform. It is opt-in, and turning it
  off snaps the marker back to the nearest valid tick. **`endpoints_editable`** is a second, distinct
  mechanism: the line's own `[min, max]` range is switchable between presets (not freely typed), specifically
  to break "half is always the middle of whatever's on screen" — asking where ½ sits on a `[2, 3]` line has
  no correct answer under that misconception, and the widget makes the learner test it directly.
- **`compare`:** each marker moves only as a **consequence** of its numerator/denominator steppers (§2.2
  note) — there's no direct drag-to-position gesture on this mode's markers, because the whole point is
  that position is *derived from* the two numbers, not set independently. **`predict_first`** hides both
  markers' positions until the learner commits a prediction, and **`tick_mode: common_denominator`**
  triggers a live re-cut animation (both fractions' tick grids redraw to a shared denominator) — the
  markers themselves **do not move** during this animation, which is the point: renaming isn't relocating.
  **`challenge_mode`**'s `disable_common_denominator` task is a genuine capability removal, not just a UI
  hint — with it active, the `tick_mode` control is inert, forcing landmark-only reasoning.
- **`illustrate`:** no learner gesture at all. The hop sequence plays once, automatically, at the config's
  `animate_ms` pace; `labels_off_until_hops_complete` deliberately withholds the numeric readout until the
  animation finishes, so the learner watches the *counting* happen before being handed the *number*.
- **`jump`:** single "hop" button (44pt, bottom-docked on `compact`), learner-paced, one tap per hop —
  unchanged from the previous revision's interaction description.
- **What the learner cannot break:** markers cannot leave the resolved range in any mode (dragging clamps at
  the bound); `stride.min` can never reach 0 (§2.4's validation — this is a hard floor, not a
  guided-discovery case, because an undefined stride length has no pedagogical payoff the way a deliberately
  unequal partition does in `fraction-bar.md`); `compare` mode's markers cannot be dragged directly — the
  only path to moving one is through its own numerator/denominator controls, which is itself an enforced
  "cannot break" rule (kit overview §4.4) protecting the position-is-a-consequence teaching point.
- **Mode caveat for negative-number concepts (content-authoring note, unchanged):** prefer `mode: "jump"` —
  directional movement in a concrete context — over any static point-labeling approach, per the split-ray
  and amalgamated-translation misconception research (`docs/research/03-other-fracture-points.md`).

## 4. Responsive behaviour

- **`compact`:** the line fills the width. `stride-explore`'s stride slider and zoom controls dock in the
  bottom-third thumb zone; `compare` mode's two marker-control clusters (numerator/denominator steppers per
  marker) stack vertically below the line rather than side by side, each clearly color-matched to its
  marker (kit overview §7). `illustrate` mode has no controls to place — the animation and its (post-hop)
  readout occupy the full widget area. When `range` is wider than fits legibly at the current zoom, the line
  pans/scrolls horizontally rather than compressing tick spacing below a legible minimum.
- **`expanded`:** the full configured `range` is visible without panning by default. `compare` mode places
  both marker-control clusters flanking the line, color-matched and spatially near their respective markers
  (kit overview §5.3's spatial-mapping rule). Hovering any point shows an exact-value tooltip (fraction,
  decimal, and mixed number). Keyboard: focused marker/control moves by one step per arrow-key press (kit
  overview §4.5).
- **Tick label collision rule (both tiers, binding on `compact`):** below a computed px-per-label threshold,
  labels thin out by dropping every other minor-tick label rather than shrinking font size below the
  legible floor. Major-tick (integer) labels are never dropped.

## 5. Animation spec

| Trigger | Primitive | Duration | Pedagogical justification |
|---|---|---|---|
| `illustrate` mode hop sequence | `trace-path` (arc rises and lands on the next stride tick, `draw_style: arcs above the line`) | 900ms per hop (per authored config), then a hold before the next | Matches `fraction-bar.md`'s stick-lay pacing rule: each hop must be individually watched, never blurred into one slide, because the counting *is* the lesson this mode exists to set up before `FractionBar` hands the learner the interactive version. |
| `stride-explore`: stride slider change | `snap-settle` — tick marks redraw live as the slider moves | continuous while dragging, ~150ms settle on release | The marker's fraction reading changes live as strides redraw, directly showing "same numerator, different position" when strides change without the marker moving. |
| `compare`: `tick_mode: common_denominator` | `choreographed-sequence` — both fractions' tick grids redraw to the shared denominator; markers hold position throughout | 600ms (per authored config) | Markers staying visually still while the grids redraw beneath them is the entire proof that renaming isn't relocating — if the markers so much as flickered during this animation it would undercut the lesson. |
| `compare`: `predict_first` reveal | `ghost-preview`-style fade-in of both markers after prediction is committed | 300ms | Confirms or contradicts the learner's committed guess in one clean reveal, not a live drag they could correct mid-guess. |
| `stride-explore`: marker drag | `snap-settle` on release (or none, in `free_drag_toggle` state — see §3) | 150–200ms | Confirms the release landed on a valid stride tick. |

## 6. Accessibility

- Every marker's position is announced as **fraction, decimal, and mixed number together** — e.g. *"three
  fourths, 0.75"* — never a bare decimal.
- `compare` mode's two markers are distinguished by **`colour_token` and a text label** (`"yours"`,
  `"theirs"`) — never color alone (kit overview §7) — and each marker's Semantics node is grouped with its
  own numerator/denominator controls, so a screen-reader user can navigate "marker A and its controls" as
  one unit distinct from "marker B and its controls."
- `illustrate` mode's hop sequence fires one rate-limited announcement per completed hop (never per
  animation frame, kit overview §8.4), and the final `describeState()` gives the full sentence once
  `labels_off_until_hops_complete` releases: *"Three quarters, measured in half-sized sticks: one full stick
  and one half of another — one and a half sticks total."*
- `compare` mode's `challenge_mode` task with `disable_common_denominator: true` announces the restriction
  explicitly (*"Common-denominator view is off for this task — use the half-line landmark instead"*), so the
  missing control isn't silently absent.

## 7. Golden-test plan

**`stride-explore` mode:**
1. `stride-explore-default-3-of-4__compact` / `__expanded` — canonical reframe state, stride 4.
2. `stride-explore-endpoints-2-3__expanded` — the `[2, 3]` endpoint preset, disproving "half = visible
   middle."
3. `stride-explore-free-drag-unsnapped__t-mid` — the guided-discovery exception mid-drag, unsnapped marker.
4. `stride-explore-past-one__compact` — marker beyond the first whole-number post, confirming "no wall at
   one."
5. `stride-explore-ghost-marker-comparison__expanded` — second/ghost marker active.

**`compare` mode:**
6. `compare-predict-pending__compact` — positions hidden, prediction not yet committed.
7. `compare-own-denominator__expanded` vs `compare-common-denominator-recut__t-mid` — pinned mid-frame of
   the `choreographed-sequence` recut, markers held static while grids redraw — the single most
   pedagogically load-bearing animation frame in this mode (kit overview §9.3.2).
8. `compare-landmark-only-challenge__compact` — `disable_common_denominator` task active, control
   inert-and-labeled state.
9. `compare-near-miss-pair__expanded` — a componentwise-comparison-fails pair (e.g. 5/8 vs 7/11), both
   markers visible.

**`illustrate` mode:**
10. `illustrate-hop-arc__t0`, `__t0.5-mid-arc`, `__t1-landed` — three pinned frames of the scripted hop
    animation for 3/4 measured in halves.
11. `illustrate-labels-revealed-post-hops__compact` — end state, count readout released.

**Shared:**
12. `dense-minor-ticks-label-collision__compact` — forces the every-other-label collision rule (§4).
13. `deuteranopia-compare-two-markers` — colour-vision-deficiency simulated render of state #9.
14. `dark-theme__stride-explore-default-3-of-4` — dark-theme render of state #1.
