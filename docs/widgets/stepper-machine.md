# StepperMachine

> Inherits the base contract in `00-kit-overview.md`. Read that first — this spec only states what's
> specific to `StepperMachine`. Shorter-form spec per the assignment's priority order.

## 1. Teaching job

**The one misunderstanding this widget exists to destroy:** a learner treats an algorithm as a black box —
something you run, not something you could do by hand — and "understanding" collapses into recognizing the
algorithm's name rather than being able to predict its next move. `StepperMachine` destroys this by making
every algorithm a sequence of small, honest, individually-inspectable steps: one comparison, one swap, one
stack push. If a learner can't correctly predict what happens next, they don't yet understand the
algorithm — and the widget is built to make that gap visible to the learner in the moment, via
predict-then-reveal (§3), not just to animate a solution past them.

## 2. Config schema

```jsonc
{
  "type": "StepperMachine",
  "config": {
    "id": "stepper-a",
    "interaction_level": "guided",
    "algorithm": { "type": "bubble-sort", "input": [5, 2, 8, 1, 9] }, // also: selection-sort | euclid-gcd | binary-search | linear-search | recursion-factorial
    "step_mode": "predict-then-reveal", // "auto-play" | "manual-next" | "predict-then-reveal"
    "speed_ms": 600,                    // auto-play only
    "show_structures": { "array": true, "call_stack": false, "pointer_labels": true },
    "comparison_highlight": true
  }
}
```

**Build-time validation:** `algorithm.input` shape must match what `algorithm.type` expects (e.g.
`binary-search` requires a sorted array — an unsorted input for binary-search fails the content build, since
that's a content-author error, not a valid "what if" scenario this widget is built to explore);
`show_structures.call_stack` is force-enabled and `array` force-disabled (or shown alongside, per algorithm)
for `recursion-factorial`, since a recursive algorithm without a visible call stack defeats the widget's job.

## 3. Interaction model

- **Step forward / step back** buttons (44pt, bottom-docked) advance or rewind exactly **one atomic
  operation** (one comparison, one swap, one stack push/pop) — not a "step to next interesting point," an
  actual single primitive operation, so the granularity itself models what "an algorithm" is made of.
  Step-back is deliberately supported (unusual for algorithm visualizers, which are typically forward-only)
  because re-examining a step is how confusion actually gets resolved; a **step-index scrubber** allows
  jumping directly to any step, recomputing state discretely (algorithm state is not interpolated between
  steps — there is no meaningful "half a swap").
- **`predict-then-reveal` mode:** before each step executes, the learner must tap a predicted outcome (e.g.
  "will these swap? yes / no") via an accessible button group — the step is **blocked** until a prediction is
  made. This is the widget's concrete implementation of the 6-layer doctrine's "Manipulate: learner changes
  input, math responds" for a domain that's inherently procedural rather than continuous (there's no slider
  to drag; the prediction *is* the manipulation).
- **What the learner cannot break:** cannot skip the predict tap in `predict-then-reveal` mode (the step
  literally will not execute without it); cannot step past the algorithm's natural termination (step-forward
  is disabled once complete); step-back never produces a state inconsistent with forward replay — the same
  step index always reproduces the identical state (determinism requirement, load-bearing for golden tests
  §7).

## 4. Responsive behaviour

- **`compact`:** primary data structure (array bars, or the active stack frame) occupies the full width at
  the top; step controls dock at the bottom (thumb zone). For `recursion-factorial`, the call-stack view is
  a **separate tab**, toggled full-screen rather than split with the array view — two simultaneous panels
  don't fit legibly at 5" width, so this reflows to tab-switching instead of shrinking both below usability.
- **`expanded`:** array/structure view and call-stack view render **side by side simultaneously** (desktop
  width affords the split `compact` can't), plus a persistent step-index scrubber timeline across the
  bottom, always visible.

## 5. Animation spec

| Trigger | Primitive | Duration | Pedagogical justification |
|---|---|---|---|
| Compare step | two elements pulse/highlight together, **no movement** | 300–400ms | Comparing must look visually distinct from moving, or learners conflate "the algorithm looked at these" with "the algorithm changed these" — a common source of confusion when watching sort visualizations passively. |
| Swap step | `arc-swap` — the two elements trade positions along a visible arc, not a straight cross-fade | 350–450ms | A straight cross-fade lets two elements appear to pass through each other, misleading about what a swap structurally does; the arc keeps both elements individually trackable throughout. |
| Recurse step | `frame-slide` — new call-stack frame slides in from below with a slight scale-down ("going deeper"), showing its local variables on the frame itself | 200–300ms | Direction (down/smaller) encodes meaning, not decoration — matches the kit-wide rule that `frame-slide` direction must be semantic (kit overview §6 table). |
| Auto-play | same per-step animations, paced by `speed_ms`, always interruptible | per `speed_ms` | Auto-play is never an uninterruptible modal sequence — pause/step-back must be available mid-sequence at all times, since re-inspection is core to the pedagogy (§1), not an escape hatch. |

## 6. Accessibility

- Compare/swap/recurse steps each carry a **distinct icon glyph** in addition to color and motion, so a
  static screenshot or a screen-reader-described frame is unambiguous even out of animation context (kit
  overview §7).
- Manual-next mode announces each step in plain language: *"Comparing index 2 (value 5) and index 3 (value
  3). 5 is greater than 3 — swap needed."* Auto-play announces at a rate-limited cadence matching `speed_ms`,
  never faster than a listener could parse (kit overview §8.4's batch-announcement rule, applied here to
  auto-play speed rather than batch size).
- The predict-then-reveal prediction control is a button group, not a drag or swipe gesture — deliberately
  keyboard/switch-operable, since it's the widget's core interactive moment and must not be gated behind a
  gesture that's hard for some input methods (kit overview §4.5).

## 7. Golden-test plan

1. `initial-unsorted-array__compact` / `__expanded` — starting state before any steps.
2. `first-comparison-highlight__t-mid` — pinned frame of the compare-step pulse.
3. `mid-swap-arc__t-mid` — pinned mid-frame of the `arc-swap` animation, the single most pedagogically
   load-bearing frame for the sorting algorithms (kit overview §9.3.2).
4. `fully-sorted-end-state__compact` — completion state.
5. `recursion-call-stack-max-depth__expanded` — `factorial(5)` or similar, both array and call-stack panels
   visible side by side (desktop).
6. `recursion-call-stack-max-depth__compact` — same algorithm, confirming the tab-switch reflow rule fires
   instead of a cramped split view.
7. `predict-prompt-pending__compact` — step blocked, waiting on the learner's prediction tap.
8. `step-back-determinism-check` — stepping back to an earlier index and confirming it reproduces the exact
   prior state pixel-for-pixel (proves the determinism requirement, not just a visual state).
9. `binary-search-pointer-narrowing__expanded` — a frame set showing low/high/mid pointer labels narrowing
   across steps, specific to the `binary-search` algorithm type.
10. `deuteranopia-swap-vs-compare` — colour-vision-deficiency simulated render confirming the icon-glyph
    distinction (§6) between compare and swap states is legible without color.
11. `dark-theme__fully-sorted-end-state` — dark-theme render of state #4.
