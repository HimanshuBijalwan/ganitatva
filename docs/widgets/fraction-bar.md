# FractionBar

> Inherits the base contract in `00-kit-overview.md`. Read that first — this spec only states what's
> specific to `FractionBar`.

## 1. Teaching job

**The one misunderstanding this widget exists to destroy:** a learner reads "3/4" as two unrelated whole
numbers stacked on top of each other — "3 and 4" — rather than as *one* quantity: a whole cut into 4 equal
parts, 3 of them taken. Everything downstream (comparing fractions, adding unlike denominators, and
eventually why 3/4 ÷ 1/2 = 3/2) is unreachable until a fraction is felt as one thing, not two.

`FractionBar`'s secondary, load-bearing job (still the same misunderstanding, one layer deeper): two bars
partitioned *differently* can shade the *same amount* — equivalence isn't a rule to memorize
(`a/b = ac/bd`), it's what happens automatically when you re-cut a bar without changing what's shaded.

This widget deliberately does **not** own the "division makes it bigger" insight — that's `number-line.md`
(measurement division). `FractionBar` owns the prerequisite: making "3/4" mean one thing before any
operation on it can mean anything. See `00-kit-overview.md` §10 for how the three fractions-slice widgets
divide the labor.

## 2. Config schema

```jsonc
{
  "type": "FractionBar",
  "config": {
    "id": "bar-a",
    "interaction_level": "guided",
    "mode": "explore",              // "explore" | "compare" | "equivalence" | "add"
    "denominator_range": { "min": 1, "max": 12 },
    "bars": [
      {
        "id": "a",
        "whole_count": 1,            // how many whole bars (1 = proper fraction only; >1 enables improper/mixed)
        "numerator": 3,
        "denominator": 4,
        "color_role": "primary",
        "locked_denominator": false, // true = learner can shade/unshade but not re-cut
        "locked_numerator": false,
        "label": "3/4"               // shown above the bar; null = no label (harder mode)
      }
    ],
    "target": { "numerator": 6, "denominator": 8 }, // required in "compare"/"equivalence" modes; the bar the learner must match
    "show_decimal": false,
    "show_labels": true
  }
}
```

**Build-time validation (fails the content pipeline, never reaches a device):** `denominator` for every bar
must be within `denominator_range`; `numerator <= denominator * whole_count`; `target` required when
`mode` is `compare` or `equivalence`; at least one `bars[]` entry.

## 3. Interaction model

- **Tap-toggle** a segment to shade/unshade it — this sets the numerator directly, one discrete unit at a
  time. No partial shading is possible; a segment is either fully shaded or not. This is deliberate: partial
  shading would let a learner "eyeball" roughly three-quarters without ever committing to a discrete count,
  which is exactly the fuzziness this widget exists to remove.
- **Stepper (+/−)** changes the denominator (re-cuts the bar into more/fewer equal parts), per
  `00-kit-overview.md` §4.1 — not pinch, so it works one-handed. Changing the denominator **preserves the
  shaded proportion** (not the shaded segment count): re-cutting 3/4 into eighths automatically shows 6/8
  shaded, not 3/8. That auto-preservation *is* the equivalence lesson — the widget never explains
  equivalence in text, it just makes the rule impossible to violate.
- In `compare`/`equivalence` mode, a **second bar** (the `target`, rendered `locked_denominator: true,
  locked_numerator: true`) sits below or beside the learner's bar; a `highlight-pulse` (see §5) fires when
  the learner's shaded proportion matches the target's, regardless of whether the denominators match —
  this is the moment the equivalence insight is supposed to land.
- **What the learner cannot break:** cannot exceed `denominator_range.max` (stepper simply stops responding
  past the bound — no error state, the bound is just not reachable); cannot shade more segments than exist;
  cannot produce denominator 0 (stepper floor is 1); `locked_*` bars ignore all gestures entirely and render
  with no drag/tap affordance (§4.4 of the kit overview — locked means geometrically unreachable, not
  refused after the fact).

## 4. Responsive behaviour

- **`compact` (phone, portrait, one-handed):** the bar spans ~90% of screen width at a fixed height tall
  enough that every segment clears the 44pt tap-target floor *in height* even when width per segment gets
  narrow. For `denominator > 8`, tap hit-regions are padded invisibly beyond the visible segment boundary
  (nearest-centroid hit-testing) so touch precision doesn't degrade even as visual segments narrow past
  44pt. Past `denominator > 8` on `compact`, the bar defaults to **stacking two rows** of segments (top row
  = first half of parts, bottom row = second half) rather than shrinking segment width further — this keeps
  every segment individually tappable at the cost of a taller widget, which is acceptable because `compact`
  layout gives interactive content the top two-thirds of the screen (kit overview §5.2). The denominator
  stepper and mode controls dock in the bottom third (thumb zone).
- **`expanded` (desktop, 27"):** multiple bars render side by side (used heavily in `compare` mode), full
  height, no row-stacking needed even at `denominator = 12`. Hover reveals a tooltip with the decimal
  equivalent regardless of `show_decimal`. Keyboard: Tab focuses a bar, Left/Right arrows move a "cursor"
  segment, Space toggles it; Up/Down arrows drive the denominator stepper (kit overview §4.5).

## 5. Animation spec

| Trigger | Primitive (from kit vocabulary) | Duration | Pedagogical justification |
|---|---|---|---|
| Denominator change (re-cut) | `snap-settle` | 200–250ms, ease-out | Segments visibly redistribute while the *shaded area stays constant* — watching 3/4 redraw as 6/8 with the same amount of blue filled is the equivalence proof, done by eye, live. This is the single most important motion in the whole widget. |
| Segment tap (shade/unshade) | quick fill/unfill, 120ms | 120ms | Fast enough to feel like direct manipulation (no perceptible lag between tap and result), slow enough to be visible as a discrete event rather than an instant cut (a learner should see *this specific segment* fill, not just "the total changed"). |
| Target matched (compare/equivalence mode) | `highlight-pulse` | 350ms | Marks the "aha" moment without a modal interruption — the bar itself glows, the lesson stays on the bar, not in a popup. |

## 6. Accessibility

- Shaded vs. unshaded segments are distinguished by fill color **and** a diagonal hatch pattern on shaded
  segments (kit overview §7's colour-never-sole-carrier rule) — verified against deuteranopia simulation in
  golden tests (§7 below).
- `describeState()` returns, e.g.: *"Fraction bar A: 3 of 4 parts shaded, equals three fourths, 0.75."* In
  `compare` mode, adds: *"Target: six of eight parts shaded. These are equal."*
- Denominator stepper is a separate, separately-labeled Semantics node: *"Number of parts: 4, adjustable"* —
  not folded into the bar's own label, so a screen-reader user can navigate to "the thing that changes the
  cut count" distinctly from "the thing that changes what's shaded."
- Each bar in multi-bar `compare` mode is distinguished by `color_role` **and** a text label (`"Bar A"`,
  `"Bar B"`) — never color alone, since two adjacent blue-family roles can be hard to tell apart even for
  full-color-vision users at a glance.

## 7. Golden-test plan

Per `00-kit-overview.md` §9.3 floor, plus widget-specific states:

1. `default-1-of-1__compact` / `__expanded` — whole bar undivided (denominator 1), the trivial base case.
2. `default-3-of-4__compact` / `__expanded` — the canonical teaching example.
3. `improper-5-of-4-two-wholes__expanded` — `whole_count: 2`, tests multi-bar rendering for improper
   fractions.
4. `dense-denominator-12__compact` — stress case for the two-row stacking reflow rule (§4); must show the
   stack, not shrunk-below-44pt segments.
5. `dense-denominator-12__expanded` — same config, proving `expanded` does *not* need to stack.
6. `equivalence-morph__t0`, `equivalence-morph__t0.5`, `equivalence-morph__t1` — three pinned frames of the
   `snap-settle` re-cut animation (denominator 4→8, numerator preserved as proportion), at injected
   `AnimationController` values 0, 0.5, 1 (kit overview §6.1/9.1) — this is the single most pedagogically
   load-bearing animation in the widget and gets three frames, not one.
7. `compare-target-matched__compact` — two-bar compare mode, `highlight-pulse` mid-pulse frame.
8. `deuteranopia-shaded-vs-unshaded` — colour-vision-deficiency simulated render of state #2, confirming
   the hatch pattern alone communicates which segments are shaded.
9. `dark-theme__default-3-of-4` — dark-theme render of state #2.
