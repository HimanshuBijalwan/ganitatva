# FractionBar

> Inherits the base contract in `00-kit-overview.md`. Read that first — this spec only states what's
> specific to `FractionBar`.
>
> **Revision note (2026-09-17):** this spec was rewritten against the seven authored Phase 1 concept YAML
> files in `content/concepts/arithmetic/` after pedagogy flagged that the original four-mode sketch
> (`explore`/`compare`/`equivalence`/`add`) did not match what the actual gate concept needs. The four real
> modes are `partition`, `equivalence`, `combine`, and `measure` — one per concept that mounts this widget
> across the fractions chain. `measure` is the mode the **Phase 1 exit gate itself rests on** (per
> `content/concepts/arithmetic/dividing-fractions.yaml`) and is specified in the most detail below.

## 1. Teaching job

`FractionBar` is the one widget that appears across almost the entire fractions chain, and it does a
**different, specific job in each mode** — it is not one interaction with cosmetic variations. What's
constant across all four modes is the object itself: a bar (or several) representing a whole, cut into
equal pieces, some of them counted. What changes is what the learner is being confronted with:

- **`partition`** (concept 1, `fractions-as-parts.yaml`): destroys "a fraction names a piece" and replaces
  it with "a fraction names a piece **size**, and a piece only means something when all the pieces in the
  whole are equal." Secondary: a fraction is meaningless without its whole — the same "half" on two
  differently-sized bars is two different amounts.
- **`equivalence`** (concept 3, `equivalent-fractions.yaml`): destroys "renaming a fraction changes its
  value" and, more precisely, destroys the belief that "do the same to both sides" means *add* — it means
  *multiply*. The widget proves this by showing the wrong operation (adding) visibly move the shaded amount,
  and the right operation (splitting every piece) visibly not move it.
- **`combine`** (concept 5, `adding-fractions.yaml`): destroys "add the tops, add the bottoms" by making
  the denominator a **unit name**, not a quantity — pieces of different sizes physically refuse to combine
  until re-cut to match, exactly like trying to add 3 metres to 2 feet.
- **`measure`** (concept 7, `dividing-fractions.yaml`, **THE EXIT GATE**): destroys "a division remainder is
  expressed in wholes." Division is framed as *measurement* — "how many of this stick fit inside that
  ribbon" — and the single highest-leverage gesture in the entire product is dragging the leftover piece out
  and laying it against the stick, reading out what fraction *of the stick* it covers. That single gesture
  is what turns 3/4 ÷ 1/2 into 1½ instead of the wrong-but-tempting 1¼. If this gesture is decorative rather
  than load-bearing, the Phase 1 gate fails.

## 2. Config schema

Each mode has its own config shape (they are validated as distinct sub-schemas, not one loose object). All
four share the base envelope from `00-kit-overview.md` §2.1.

### 2.1 `partition` mode

```jsonc
{
  "type": "FractionBar",
  "config": {
    "mode": "partition",
    "show_symbolic": false,             // notation not yet earned — readout is in words at first exposure
    "bars": [
      {
        "id": "main", "label": "first bar", "whole_length": 1.0,
        "partitions": 4, "shaded": 1, "shade_by": "tap",
        "partitions_control": { "min": 1, "max": 12, "step": 1, "label": "equal pieces" }
      },
      {
        "id": "other_whole", "label": "a different bar", "whole_length": 0.6, // DELIBERATELY a different whole
        "partitions": 4, "shaded": 1, "shade_by": "tap",
        "partitions_control": { "min": 1, "max": 12, "step": 1, "label": "equal pieces" }
      }
    ],
    "unequal_cuts": { "enabled": true, "label": "drag the cut lines", "snap_back_button": "make them equal again" },
    "whole_outline": { "always_visible": true, "pulse_when_piece_count_changes": true },
    "readout": { "style": "words", "template_id": "parts.readout.words", "also_show_piece_size_bar": true },
    "edge_cases": { "allow_zero_partitions": true, "allow_one_partition": true }
  }
}
```

### 2.2 `equivalence` mode

```jsonc
{
  "type": "FractionBar",
  "config": {
    "mode": "equivalence",
    "bars": [
      { "id": "reference", "label": "the amount — do not touch", "whole_length": 1.0, "partitions": 2,
        "shaded": 1, "locked": true, "shade_edge_style": "solid vertical rule extending through both bars" },
      { "id": "renamer", "label": "rename it", "whole_length": 1.0, "partitions": 2, "shaded": 1,
        "locked_shaded_edge": true }    // the amount boundary CANNOT move; only the cuts multiply
    ],
    "split_control": { "label": "slice every piece into", "min": 1, "max": 8, "step": 1, "animate_ms": 450 },
    "unsplit_control": { "label": "glue pieces back together", "enabled_only_when_divisible": true },
    "sabotage_mode": {
      "enabled": true, "label": "try adding the same number to both instead",
      "effect": "numerator +k and denominator +k; the shaded edge is ALLOWED to move here",
      "show_edge_drift_marker": true
    },
    "readout": { "show_name_history": true, "show_point_on_mini_number_line": true, "highlight_when_name_is_simplest": true },
    "challenge_targets": [
      { "denominator": 6, "reachable": true },
      { "denominator": 7, "reachable": false }   // teaches: only multiples of the reference work
    ]
  }
}
```

### 2.3 `combine` mode

```jsonc
{
  "type": "FractionBar",
  "config": {
    "mode": "combine",
    "bars": [
      { "id": "addend_a", "label": "first amount", "whole_length": 1.0, "partitions": 2, "shaded": 1,
        "numerator_control": { "min": 0, "max": 12 }, "denominator_control": { "min": 1, "max": 12 } },
      { "id": "addend_b", "label": "second amount", "whole_length": 1.0, "partitions": 3, "shaded": 1,
        "numerator_control": { "min": 0, "max": 12 }, "denominator_control": { "min": 1, "max": 12 } },
      { "id": "total", "label": "poured together", "whole_length": 1.0, "extends_past_whole": true, "read_only": true }
    ],
    "pour": {
      "action": "drag the shaded pieces of the second bar onto the first", "tiling": "strict",
      "on_mismatch": { "behaviour": "piece hovers, edges highlighted red, will not seat" }, "allow_force": false
    },
    "recut": {
      "control": "find a cut that fits both", "min": 1, "max": 60,
      "suggest_lcm_button": "smallest cut that works", "animate_ms": 600,
      "recuts_shaded_regions": true, "highlight_when_both_tile": true
    },
    "claim_check": {
      "enabled": true, "input": "type any fraction you think is the total",
      "show_on_mini_number_line": true, "also_plot": ["addend_a", "addend_b"]
    },
    "readout": { "show_piece_name_separately": true, "show_unit_analogy_toggle": true, "show_symbolic": true }
  }
}
```

### 2.4 `measure` mode — THE GATE

```jsonc
{
  "type": "FractionBar",
  "config": {
    "mode": "measure",
    "unit": { "show_whole_outline": true,
      "background_ruler": { "show": true, "denominator": "from_target" } }, // ruler ticks behind the ribbon so both readings coexist
    "target": { "label": "ribbon", "fraction": { "numerator": 3, "denominator": 4 },
      "numerator_control": { "min": 1, "max": 12 }, "denominator_control": { "min": 1, "max": 12 },
      "allow_greater_than_one": true, "max_value": 4 },
    "measuring_stick": { "label": "stick", "fraction": { "numerator": 1, "denominator": 2 },
      "numerator_control": { "min": 0, "max": 12 }, "denominator_control": { "min": 1, "max": 12 },
      "allow_greater_than_one": true,
      "interaction": "drag-and-lay-end-to-end", "snap_to_previous_copy": true,
      "copies_persist_on_screen": true, "refuse_overhang": true },
    "counter": { "counts": "measuring_stick_copies", "show_unit_word_always": true, "format": "mixed", "live_while_dragging": true },
    "remainder": {
      "enabled": true, "appears_when": "target not exactly covered by whole copies",
      "compare_against": "measuring_stick",
      "action": "drag the leftover piece out and lay it against the stick",
      "also_allow_compare_against_whole": true,
      "frame_toggle": { "options": ["in_sticks", "in_wholes"], "initial": "in_sticks",
        "show_both_simultaneously_button": true }
    },
    "whole_probe": { "enabled": true, "action": "snap the target to exactly one whole and count the sticks" },
    "same_pieces_mode": { "enabled": true, "action": "cut the target and the stick into the same-sized pieces",
      "suggest_common_denominator_button": true, "animate_ms": 600 },
    "size_predictor": { "enabled": true, "ask_before_laying": true, "record_prediction": true,
      "reveal_boundary_hint_after_n_attempts": 4, "boundary_is": "stick length compared with one whole" },
    "edge_cases": {
      "stick_equals_one_whole": { "allowed": true },
      "stick_zero": { "allowed": true, "behaviour": "copies of zero length are laid forever and the target never fills" }
    },
    "presets": [
      { "id": "bottles", "target": { "numerator": 3, "denominator": 1 }, "stick": { "numerator": 1, "denominator": 2 } },
      { "id": "quarters-in-one", "target": { "numerator": 1, "denominator": 1 }, "stick": { "numerator": 1, "denominator": 4 } },
      { "id": "read-it-out-loud", "target": { "numerator": 3, "denominator": 4 }, "stick": { "numerator": 1, "denominator": 4 } },
      { "id": "the-gate", "target": { "numerator": 3, "denominator": 4 }, "stick": { "numerator": 1, "denominator": 2 } },
      { "id": "exact-again", "target": { "numerator": 2, "denominator": 3 }, "stick": { "numerator": 1, "denominator": 6 } },
      { "id": "another-remainder", "target": { "numerator": 5, "denominator": 6 }, "stick": { "numerator": 1, "denominator": 2 } },
      { "id": "stick-past-one", "target": { "numerator": 3, "denominator": 4 }, "stick": { "numerator": 3, "denominator": 2 } },
      { "id": "divide-by-one", "target": { "numerator": 3, "denominator": 4 }, "stick": { "numerator": 1, "denominator": 1 } },
      { "id": "divide-by-zero", "target": { "numerator": 3, "denominator": 4 }, "stick": { "numerator": 0, "denominator": 1 } }
    ]
  }
}
```

**Build-time validation, per mode:** `partition` — `partitions_control.min >= 0` (0 is *allowed* here as a
deliberate breakable edge case, see §3.1); `combine` — `pour.allow_force` is fixed `false`, mismatched pieces
must never be forceable to seat, since the refusal *is* the lesson; `measure` — `presets` must include at
least one entry with `stick.numerator > stick.denominator` (the `stick-past-one` guard) and at least one
whole-number-only entry (the `bottles` guard) — a `measure`-mode concept that ships without both is a
build-time failure, not a style choice, because omitting either one installs a false rule (see §7's
misconception table cross-reference). The nine-item `presets` order is treated as content, not sample data —
the pipeline preserves array order exactly as authored; reordering is a content edit, not a rendering
concern.

## 3. Interaction model

### 3.1 `partition`

- **Tap-toggle** shades/unshades a piece (sets the numerator). **Partition stepper** re-cuts the bar.
- **`unequal_cuts`** is a genuine departure from the kit-wide "snapping is mandatory" default (kit overview
  §4.2): the learner can drag cut lines to make pieces visibly unequal, on purpose. This is a **guided-
  discovery exception**, not a hole in the rule — the widget lets the learner build a broken state
  specifically so the next prompt ("would you still be happy to be handed any one of them without looking")
  makes them re-equalize it themselves. A `snap_back_button` always offers the safe return. See kit overview
  §4.2 addendum (added by this spec, §8 below) for the general pattern this establishes.
- **`edge_cases.allow_zero_partitions` / `allow_one_partition`**: also deliberate — the learner is allowed
  to "break it on purpose" (cut the bar into zero pieces) so the prompt "what goes wrong, and why" has
  something real to point at. This is *not* the same as the `measure`-mode `stick_zero` case (§3.4), which
  models a genuine mathematical edge case (division by zero); here it's pure UI breakage used pedagogically.
- Two bars with **different `whole_length`** render side by side specifically so "half of each" can be
  dragged into visual contact — direct disproof of "half is always the same amount."

### 3.2 `equivalence`

- **`split_control`** is a multiplier stepper ("slice every piece into *k*"), not a raw denominator field —
  every existing cut line spawns *k* children simultaneously, shaded pieces included, which is what makes
  the numerator visibly multiply in lockstep with the denominator. **`unsplit_control`** runs it in reverse
  and is disabled whenever the current partition count isn't evenly divisible — ungluable states are
  geometrically unreachable (kit overview §4.4), not merely refused.
- **The shaded edge (the reference bar's boundary) cannot move** under `split_control`/`unsplit_control` —
  it's `locked_shaded_edge`. This is the whole proof: the amount stays fixed while the name changes.
- **`sabotage_mode`** is the other deliberate guided-discovery exception: it performs the learner's likely
  wrong instinct ("add the same number to both") *for real*, and lets the edge visibly drift
  (`show_edge_drift_marker`). This is not a trick UI state hidden behind a warning — it's a first-class mode
  the learner opts into, because the belief has to fail in front of them, not be asserted wrong.
- **`challenge_targets`** with `reachable: false` entries are a genuine dead end by design — dragging toward
  an unreachable denominator (e.g. 7 from a base of 2) simply never lands, teaching "only multiples work" by
  exhaustion rather than by rule.

### 3.3 `combine`

- **Pour** is a cross-bar drag: shaded pieces from `addend_b` are dragged onto `addend_a`. `tiling: strict`
  means a piece that doesn't align to the receiving bar's grid **hovers and refuses to seat** (red-highlighted
  edges) — `allow_force: false` is non-negotiable (§2.4's build-time rule): the refusal to combine
  mismatched units is the entire point, exactly mirroring why you can't add 3 metres to 2 feet without
  converting first.
- **Recut** is a shared stepper that re-partitions *both* addend bars simultaneously to a common piece count
  the learner searches for (with an LCM-suggestion shortcut). `recuts_shaded_regions: true` means the
  shaded pieces visibly multiply along with the unshaded ones — a half becomes three visible shaded sixths,
  not a relabeled "0.5."
- **`claim_check`** is a free-text/numeric input, not a drag gesture: the learner types a guessed total and
  it's plotted on a mini number line next to both addends. This is the **mediant-trap self-refutation**
  mechanic — `(a+c)/(b+d)` (add-tops-add-bottoms) always lands strictly *between* the two addends, which is
  geometrically impossible for a sum of two positive amounts, and the widget lets the learner see their own
  wrong answer fail without being told.
- **What the learner cannot break:** cannot force a mismatched pour (see above); cannot type a claim_check
  guess that silently "succeeds" if wrong — it always plots exactly where the number says, including into
  the geometrically-impossible mediant zone, because showing the impossible placement *is* the correction.

### 3.4 `measure`

This is the highest-stakes mode in the whole widget kit. Every element below is required, not optional
polish (per pedagogy's "if this is decorative, the company fails its Phase 1 gate" framing):

- **`measuring_stick`** renders as a physical, draggable object laid end-to-end along the `target`. Each lay
  action leaves a **persistent copy** on screen (`copies_persist_on_screen: true`) — the stick doesn't move
  and disappear, it accumulates, so the count is visually auditable, not just numerically reported.
  `snap_to_previous_copy: true` means each new copy's start snaps flush to the previous copy's end — no gaps,
  no overlaps. **`refuse_overhang: true`** is a hard rule: a copy that would extend past the target's far
  edge will not seat at all (it springs back) — this is what forces the *whole-copies-then-remainder*
  structure rather than letting the learner "eyeball" an approximate final placement.
- **The remainder gesture — `remainder.compare_against: measuring_stick` — is the single highest-leverage
  interaction in the product.** Once whole copies stop fitting, the leftover piece of the target must be
  **draggable out** of the target and **laid against the stick** (not against the target's own ruler) to
  read out what fraction of the stick it covers. This is a distinct drag target from the stick-laying gesture
  above — it's a different object (the leftover remnant, not a fresh stick copy) with a different valid
  drop zone (against the stick, not along the target). 3/4 ÷ 1/2 becomes 1½ *at exactly this gesture*, not
  before it and not by a formula shown afterward.
- **`counter.show_unit_word_always: true`** means the running count is never rendered as a bare number — it
  is always "1 stick," "1½ sticks," never "1.5." The unit word is structural, not a label that could be
  toggled off.
- **`frame_toggle`** switches the remainder's readout between `in_sticks` and `in_wholes`, plus an explicit
  "show me both at once" state. Both readings are true statements about the same leftover piece (e.g. "one
  quarter of a metre" AND "one half of a stick") — the widget must present them side by side as **two true
  answers to two different questions**, never marking the wholes-reading as simply wrong. This directly
  targets the #1 documented misconception for this concept (§7).
- **`whole_probe`** snaps the target to exactly one whole and counts sticks — the count that appears **is the
  flipped divisor**, giving the reciprocal a concrete, measured meaning ("sticks per whole") before
  `formalize` ever writes "invert and multiply." This is what makes "which one do I flip" stop being a
  guessable question.
- **`same_pieces_mode`** re-cuts target and stick to a shared denominator, then **hides the fractions and
  shows only the two whole-number counts** — the fraction visibly leaves the problem, landing on ordinary
  whole-number division.
- **`size_predictor`** gates a recorded bigger/smaller/same prediction **before** any laying begins, with the
  true boundary condition being "is the stick shorter or longer than one whole" — not "is it a fraction."
  This is what prevents the concept from installing a *replacement* false rule ("dividing by a fraction
  always makes it bigger" — see the `stick-past-one` preset, mandatory per §2.4's build-time rule).
- **What the learner cannot break:** stick copies can never overhang (`refuse_overhang`, geometrically
  unreachable, not refused after the fact); the remainder can only be compared against the stick or (via
  `also_allow_compare_against_whole`) the whole — never against an arbitrary third object; `stick_zero` is
  an explicitly *allowed* edge case (§3.5) precisely because it's mathematically real, unlike `partition`
  mode's UI-breakage allowances (§3.1) — the distinction matters for how each is golden-tested (§7).

### 3.5 Divide-by-zero as a seen, not asserted, fact

`edge_cases.stick_zero` is the one place in the entire widget kit where the learner is allowed to attempt an
operation with no defined answer — and the widget's job is to let them **discover** that, not block the
gesture. Laying a zero-length stick copy is permitted repeatedly; the target visibly never fills, the
counter climbs without bound, and no "answer" state is ever reached. This is deliberately different from
every other "what the learner cannot break" rule in this kit (which prevent unreachable states outright) —
here the unreachable *answer* is the entire lesson, so the attempt itself must be reachable.

## 4. Responsive behaviour

- **`compact`:** each mode's primary manipulable (the partition bar; the split/reference bar pair; the
  addend bars + total; the target ribbon + stick) spans ~90% of width. In `measure` mode specifically, the
  target and the accumulating stick copies stack vertically with the copy-log scrollable once more than
  ~4–5 copies have been laid (dense presets like `quarters-in-one`, which lays 4 copies, are the practical
  ceiling before scrolling engages). The `frame_toggle`, `whole_probe`, and `same_pieces_mode` controls dock
  in the bottom-third thumb zone as a control cluster, not scattered individually — `measure` mode has more
  simultaneous controls than any other widget in the kit, so **grouping them into one dockable cluster with
  a mode-select (which control is "live" right now) is a hard requirement**, not a nice-to-have, to keep the
  screen legible at 5" width.
- **`expanded`:** `measure` mode lays the target and stick side by side with all controls (frame_toggle,
  whole_probe, same_pieces_mode, size_predictor) visible simultaneously in a side panel — no clustering
  needed. `combine` mode shows all three bars (addend A, addend B, total) simultaneously without stacking.
- **Segment tap-target math** (unchanged from the original spec, restated because `measure`/`combine` modes
  can involve denominators up to 12): at ~328dp usable width, 8+ segments narrow below the 44pt floor — past
  denominator 8 on `compact`, segments use padded invisible hit-regions (nearest-centroid) rather than
  shrinking further, and dense cases (`denominator: 12`) stack two rows exactly as in the original spec.

## 5. Animation spec

| Trigger | Primitive | Duration | Pedagogical justification |
|---|---|---|---|
| `equivalence`: `split_control`/`unsplit_control` re-cut | `snap-settle` | 450ms (per authored config) | Every cut line spawns children live while the shaded edge stays fixed — the equivalence proof happens in the motion itself. |
| `combine`: `recut` | `snap-settle`, `recuts_shaded_regions: true` | 600ms | The shaded region visibly subdivides along with the unshaded — a learner sees "the count changed because the pieces changed," not a silent relabel. |
| `combine`: pour mismatch | brief hover + red-edge refusal, no seat | — | The refusal *is* the correction; there is no "successful" animation for a mismatched pour because none should exist. |
| `measure`: stick lay (each copy) | `trace-path`-family lay-and-seat, `snap_to_previous_copy` | per-copy, learner-paced (tap-to-lay, not auto-run) | Matches `number-line.md`'s hop discreteness rule: each copy must be individually watched and counted, never auto-animated past the learner on first exposure. |
| `measure`: remainder drag-to-stick | direct-manipulation drag, live coverage readout while dragging | continuous during drag | This is the single most load-bearing animation in the widget (§1, §3.4) — the coverage fraction must update live as the remainder piece slides against the stick, not only on release, so the "aha" is felt during the gesture, not after it. |
| `measure`: `same_pieces_mode` re-cut | `choreographed-sequence` — target re-cuts, stick re-cuts, then fractions fade out leaving only counts | 600ms + fade | Ordered specifically: both must finish re-cutting to the common piece *before* the fraction labels disappear, or the "the fraction left the problem" reveal loses its causal footing. |
| `partition`: unequal-cuts drag | live-morph, direct drag of the cut line | per-frame | No snap while dragging in this specific sub-mode — the whole point is letting the learner feel the pieces go unequal in real time. |

## 6. Accessibility

- Shaded vs. unshaded segments: color + diagonal hatch (unchanged from original spec, kit overview §7).
- `measure` mode's `frame_toggle` states are **both** exposed to `describeState()` when
  `show_both_simultaneously` is active: *"Leftover piece: one quarter of a metre. Also: one half of a
  stick. Both are true; the question asked for sticks."* — never presenting one frame as correct and the
  other as suppressed.
- **A11y announcements describe what's on screen, never what the learner should conclude from it — this is
  a kit-wide rule, stated generally in `00-kit-overview.md` §4.2's guided-discovery-exception refinement,
  and it binds every announcement in this section.** `combine` mode's pour-refusal state announces:
  *"These pieces are sixths. This bar is cut into halves. The piece will not seat."* — state only, matching
  exactly what a sighted learner gets from the red edge plus the two visible grids (a piece that won't seat,
  and why the grids look different). It must **not** add "...until both are cut the same way" or any other
  phrasing that names the remedy — that clause is the reveal of this concept and the target of its second
  manipulate prompt ("turn the cut dial until both sets of pieces fit the same grid"), and handing it over
  in the announcement gives a screen-reader learner the conclusion for free while a sighted learner still has
  to work it out. The cut dial (`recut` control) is on screen and discoverable exactly as it is for a
  sighted learner; the announcement's job stops at describing the refusal, not resolving it.
- `measure` mode's stick-copy log is a genuine ordered list in the Semantics tree ("Stick 1 of 2, full.
  Stick 2 of 2, half."), independently navigable from the live drag gesture, so a screen-reader user can
  review what's been laid without re-performing the drag.
- Per kit overview §7, `equivalence` mode's `sabotage_mode` edge-drift marker is color **and** an explicit
  "the amount moved" text flag — a state description, not a conclusion, so it passes the same test as the
  pour-refusal fix above.
- `equivalence` mode's `challenge_targets` dead-end state (denominator 7, unreachable from a base of 2)
  announces only position/reachability as attempted — e.g. *"No cut count found. Cut count is now 14; the
  amount has not landed on that name."* — never a rule like "only multiples work." The learner reaching that
  conclusion by exhausting the search **is** the teaching (§3.2); the announcement must not shortcut it any
  more than the pour-refusal announcement may.

## 7. Golden-test plan

Per `00-kit-overview.md` §9.3 floor, plus per-mode states. **The four states pedagogy explicitly named as
golden-test-mandatory for `measure` mode are marked GATE-CRITICAL and take priority over every other state
in this list if implementation time is constrained.**

**`partition` mode:**
1. `partition-default-3-of-4__compact` / `__expanded`.
2. `partition-unequal-cuts__compact` — the deliberate-breakage state (§3.1), mid-drag.
3. `partition-two-different-wholes__expanded` — the `whole_length: 0.6` disproof case.
4. `partition-zero-partitions-edge-case__compact` — the allowed break-it state.

**`equivalence` mode:**
5. `equivalence-split-morph__t0`, `__t0.5`, `__t1` — three pinned frames of the split-control re-cut.
6. `equivalence-sabotage-edge-drift__t-mid` — the sabotage-mode failure state mid-drift.
7. `equivalence-unreachable-target-7__expanded` — the dead-end challenge_target state.

**`combine` mode:**
8. `combine-pour-mismatch-refusal__compact` — hovering, red-edge, refuse-to-seat frame.
9. `combine-recut-shaded-regions__t-mid` — mid-animation frame of the recut showing shaded pieces
   subdividing.
10. `combine-mediant-trap-plotted__expanded` — `claim_check` state showing an impossible mediant answer
    plotted between the two addends.
11. `combine-total-extends-past-one__compact` — the total bar's `extends_past_whole` state.

**`measure` mode — GATE-CRITICAL (pedagogy-mandated):**
12. **`measure-remainder-laid-against-stick__the-gate__compact` / `__expanded`** — GATE-CRITICAL. The
    `the-gate` preset (3/4 ÷ 1/2), remainder piece mid-drag against the stick, live coverage readout
    visible. This is the single most important golden state in the entire widget kit — a subtly wrong
    render here is exactly the silent content bug pedagogy warned would defeat testers without them being
    able to report it.
13. **`measure-frame-toggle-in-sticks__the-gate`** and **`measure-frame-toggle-in-wholes__the-gate`** —
    GATE-CRITICAL pair, both toggle states pinned for the same preset, confirming both readings render as
    equally valid, not right/wrong.
14. **`measure-preset-stick-past-one__compact`** — GATE-CRITICAL. The `stick-past-one` preset, confirming
    the answer renders visibly *smaller* than the target, guarding against the replacement false rule.
15. **`measure-preset-divide-by-zero__compact`** — GATE-CRITICAL. The `stick_zero` state: copies
    accumulating with the target never filling, counter climbing, no answer state reached.
16. `measure-whole-probe__quarters-in-one__expanded` — the reciprocal-as-measured-count state.
17. `measure-same-pieces-mode__pre` / `__post` — before/after the fraction-hiding recut.
18. `measure-size-predictor-pending__compact` — the gated-prediction state, laying blocked until a
    prediction is recorded.
19. `measure-dense-copy-log__compact` — 4+ stick copies laid, confirming the scroll/cluster reflow rule (§4)
    fires correctly.
20. `deuteranopia-frame-toggle-both` — colour-vision-deficiency simulated render of state #13's "show both"
    variant, confirming the two readings are distinguishable without color.
21. `dark-theme__measure-remainder-laid-against-stick__the-gate` — dark-theme render of state #12.

## 8. Kit-wide rule update this spec establishes

Discovering `unequal_cuts`, `edge_cases.allow_zero_partitions`, and `sabotage_mode` in the actual authored
content revealed that `00-kit-overview.md` §4.2 and §4.4 as originally written were too absolute: they
described every non-snapped, every-config-invalid state as something to prevent. The real pattern, confirmed
across three of this widget's four modes, is a **guided-discovery exception**: a concept may deliberately
allow an otherwise-invalid or unsnapped state, *always opt-in and always reversible*, specifically so the
learner can watch a plausible-sounding wrong instinct fail in front of them rather than being told it's
wrong. This is distinct from a state that's merely unvalidated — every guided-discovery exception in this
spec (`unequal_cuts`, `sabotage_mode`, `allow_zero_partitions`, `measure` mode's `stick_zero`) is explicitly
named, explicitly bounded, and has a stated pedagogical purpose in the concept YAML. `00-kit-overview.md`
should be amended to name this pattern generally (see the kit-overview edit accompanying this revision).
