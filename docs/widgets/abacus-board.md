# AbacusBoard

> Inherits the base contract in `00-kit-overview.md`. Read that first — this spec only states what's
> specific to `AbacusBoard`. Shorter-form spec per the assignment's priority order.

## 1. Teaching job

**The one misunderstanding this widget exists to destroy:** a learner treats place value as an arbitrary,
memorized column-naming convention ("this column is called tens") rather than a real fact about quantity —
that the *exact same bead*, moved one rod to the left, becomes worth ten times as much. Per
`docs/00-VISION.md`, this is the dedicated physical anchor for place value, running parallel to the
arithmetic track rather than nested inside it. Soroban-style bead manipulation is chosen (not a simplified
abstraction) because the physical authenticity — this is a real tool people actually use for real mental
math — is itself part of the widget's credibility with the target audience.

## 2. Config schema

```jsonc
{
  "type": "AbacusBoard",
  "config": {
    "id": "abacus-a",
    "interaction_level": "guided",
    "mode": "represent-number",        // "explore" | "represent-number" | "add" | "subtract"
    "rods": { "count": 3, "labels": ["hundreds", "tens", "ones"], "show_labels": true },
    "beads_per_rod": { "heaven": 1, "earth": 4 },  // standard soroban 1:4; fixed, not learner-configurable
    "starting_value": 0,
    "target_number": 37,               // required in "represent-number" mode
    "operation": { "type": "add", "operand": 5, "show_carry_animation": true } // required in "add"/"subtract" modes
  }
}
```

**Build-time validation:** `rods.count == rods.labels.length`; `target_number` fits within the configured
rod count (e.g. 3 rods cannot represent a target above 999); `operation.operand` combined with
`starting_value` must not overflow the configured rod count either — an overflowing operation is a distinct,
explicitly-designed "what happens when you run out of rods" moment elsewhere, not a silent failure here.

## 3. Interaction model

- **Tap/flick** a bead toward the beam to activate it, away to deactivate — binary, immediate snap, no
  partial/ambiguous "almost touching the beam" state (an ambiguous middle position would misteach: a bead is
  either counted or it isn't). Each bead clears 44pt comfortably since a rod holds at most 5 beads.
- **What the learner cannot break:** a rod cannot exceed its physical bead budget (1 heaven × 5 + 4 earth ×
  1 = max 9 per rod, standard soroban) — the UI enforces this by construction, not by rejecting an invalid
  tap; `represent-number` mode locks once the target is reached (learner cannot "overshoot" past the
  target and have the widget silently accept it — reaching a value that isn't the target simply isn't
  flagged as done, it stays open for correction).
- Rod count beyond what fits on screen **scrolls horizontally**; bead size is never reduced below 44pt to
  cram in more rods (same hard floor as `area-model.md` and `fraction-bar.md`'s reflow rules) — this is a
  kit-wide-consistent rule restated here because it's especially tempting to violate on a wide multi-digit
  number.

## 4. Responsive behaviour

- **`compact`:** rods run vertical (matching a real soroban's orientation — this widget does not flatten to
  horizontal for phone convenience, because physical authenticity is part of its teaching job, §1), laid out
  left to right, horizontally scrollable past 5 rods. Board fills the width.
- **`expanded`:** scales up; typically shows all configured rods without scrolling. Keyboard: focused rod's
  beads adjustable via Up/Down arrows (kit overview §4.5), each press toggling one bead in sequence.

## 5. Animation spec

| Trigger | Primitive | Duration | Pedagogical justification |
|---|---|---|---|
| Bead flick | short physical slide toward/away from the beam, slight overshoot + settle | 150ms | Mimics the tactile click of a real bead — reinforces that this is a real tool, not an abstract counter. |
| Carry / regroup (e.g. 9 + 1 on the ones rod) | `choreographed-sequence`: ones-rod beads reset to zero first, **80ms stagger**, then tens-rod gains one bead | 200ms per stage + 80ms stagger | The regrouping must visibly *travel one rod to the left*, in that order — this staggered left-travel motion is the direct visual analog of "carry the one," and is the single most load-bearing animation in the widget. Simultaneous reset+gain would hide which caused which. |

## 6. Accessibility

- Active vs. inactive beads are distinguished by **position relative to the beam** (a spatial signal, not
  just color) **and** color role **and** an optional high-contrast beam-line marker — position is actually
  the primary signal here, which makes this widget naturally more colour-vision-safe than most, but the
  pairing is still stated and tested explicitly (kit overview §7).
- `describeState()` reports per rod and total: *"Tens rod: 3. Ones rod: 7. Total: 37."* Carry events fire an
  explicit live-region announcement: *"Ones rod full — regrouped as one ten."*

## 7. Golden-test plan

1. `zero-state__compact` / `__expanded` — all beads at rest.
2. `represent-target-37__compact` — canonical two-digit representation.
3. `carry-animation__t0-pre`, `__t1-mid-reset`, `__t2-post-gain` — three pinned frames of the choreographed
   carry sequence (9 + 1 on ones rod), the single most pedagogically load-bearing animation in the widget.
4. `max-value-rod-9__expanded` — full rod (1 heaven + 4 earth active), confirming the physical bead-budget
   cap renders correctly.
5. `rod-overflow-scroll__compact` — rod count exceeding visible width, confirming horizontal-scroll reflow
   rather than shrunk beads.
6. `deuteranopia-active-inactive-beads` — colour-vision-deficiency simulated render, confirming position
   alone (not color) already disambiguates active/inactive.
7. `dark-theme__represent-target-37` — dark-theme render of state #2.
