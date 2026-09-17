# Ganitatva Widget Kit — Overview

> This document is the contract every widget spec in this folder inherits. If an individual spec
> (`fraction-bar.md`, `number-line.md`, ...) contradicts this file, this file wins unless the individual
> spec explicitly says why it deviates.

Status: DRAFT v1 — 2026-09-17. Companion specs: `fraction-bar.md`, `number-line.md`, `area-model.md`,
`balance-scale.md`, `function-grapher.md`, `abacus-board.md`, `probability-simulator.md`, `stepper-machine.md`.

---

## 1. Why this document exists

ADR-003 says content is data, not code: a content author writes YAML, never Dart, and a widget mounts from
that YAML. That only works if every widget obeys the *same* rules for how config flows in, how dragging
feels, how motion is used, how theming is applied, and how correctness is pinned in tests. Sixteen widgets
built to sixteen different conventions would blow the "author ships a concept in under a day" exit gate
(Goal G3) — the author would have to relearn the interaction language every time. This document is that
shared language.

---

## 2. The base widget contract

Every primitive in `content/schema/concept.schema.json`'s `$defs/widget.type` enum implements the same
shape. This is a spec-level interface sketch (non-normative Dart), not an implementation:

```
abstract class GanitatvaWidget<C extends WidgetConfig, S extends WidgetState> {
  C get config;                     // parsed + schema-validated at CONTENT BUILD time, immutable
  S get state;                      // current manipulable state (persisted-relevant + ephemeral)
  Stream<WidgetEvent> get events;    // telemetry: interaction, milestone reached, validation error
  String describeState({Verbosity v}); // full-sentence a11y description, regenerated on every state change
  void applyExternalState(S restored); // progress-resume AND golden-test fixture injection use the same path
  WidgetSnapshot toSnapshot();       // JSON-serializable — golden tests, save/restore, and crash reports
}
```

Four things fall out of this shape, and every individual spec assumes them:

1. **Config errors are a build-time failure, not a runtime crash.** A concept YAML with `denominator: 0`
   never reaches a learner's device — it fails the content pipeline (ADR-003's "compiled at build time")
   before it ships. Widgets do not need defensive UI for impossible configs; they need to validate hard
   against their own JSON Schema at build time and trust the input at runtime. (They still validate
   *learner-generated* state at runtime — see each spec's "what the learner cannot break".)
2. **`state` always splits into persisted vs. ephemeral.** Persisted state is what progress-sync and the
   resume-where-you-left-off flow round-trip through Drift. Ephemeral state (mid-drag finger position,
   in-flight animation phase) never persists and never appears in a golden test unless the test is
   explicitly pinning an animation keyframe (see §6).
3. **`describeState()` is not an accessibility afterthought bolted on later — it is the widget's second
   rendering target.** A widget spec is incomplete if you can build the visual but not the sentence.
4. **`WidgetEvent` is how the practice/misconception-diagnosis layer observes manipulation** without the
   widget knowing anything about pedagogy. A widget never decides "the learner is wrong" — it just reports
   what happened (`markerMoved`, `operationApplied`, `trialRun`); the concept's `practice.misconceptions`
   patterns (from `concept.schema.json`) match against the event stream to produce a diagnosis. This keeps
   widgets reusable across concepts that diagnose the same action differently.

### 2.1 The config envelope

`concept.schema.json`'s `$defs/widget` only fixes two top-level keys: `type` and `config` (an open object).
Every widget's `config` object — regardless of what else it contains — reserves these keys by convention, so
authoring and tooling stay uniform without needing a schema change owned by another agent:

```jsonc
{
  "type": "FractionBar",           // from the schema enum
  "config": {
    "id": "bar-a",                  // optional, unique within the concept — lets prompts/practice address this instance
    "interaction_level": "free",    // "readOnly" | "guided" | "free" — see §4.4
    "seed": 20260917,               // REQUIRED for any widget with randomness (ProbabilitySimulator); ignored otherwise
    "a11y": { "verbosity": "full" },// "brief" | "full" — see §7
    // ...everything below "config" is widget-specific, defined in that widget's own spec
  }
}
```

`interaction_level` is the one field every widget must honor identically:

| Level | Meaning | Typical use |
|---|---|---|
| `readOnly` | Renders, animates on a script, accepts no gesture. | Hook/Intuition layer illustration |
| `guided` | Learner can act, but only within a narrowed, valid path (e.g. only the unlocked term is draggable). | Manipulate layer, first exposure |
| `free` | Full manipulation within the widget's own hard bounds. | Manipulate layer, later exposure; Practice layer |

---

## 3. Config flow, end to end

```
concept YAML  →  per-widget JSON Schema (owned by that widget's spec, referenced from concept.schema.json's
                  open "config" object)
             →  content build pipeline validates + compiles to a binary bundle (ADR-003)
             →  freezed + json_serializable generates the Dart WidgetConfig class
             →  GanitatvaWidget<C, S> mounts with that C
             →  learner interacts → WidgetState changes → WidgetEvent stream fires
             →  Riverpod-held state persists the "persisted" subset via Drift
             →  practice/misconception layer subscribes to events, never touches widget internals directly
```

The content author's entire surface is the YAML. If shipping a new concept ever requires touching a
widget's Dart, that is a bug in the widget's config schema, not a one-off exception (this is ADR-003's
corollary, restated for widgets specifically).

---

## 4. Shared interaction conventions

A learner who has used one widget should not have to relearn a gesture in the next one. These conventions
are mandatory; a widget spec may add widget-specific gestures on top, but may not redefine these.

**Prior art note:** these conventions (tap-toggle for discrete units, stepper over pinch, mandatory
snapping) are not invented from scratch — they're validated by observing Mathigon Polypad
(mathigon.org/polypad), an actively-maintained, teacher-praised virtual-manipulative library covering
fraction bars, algebra tiles, geoboards and number lines with mature drag/snap/combine interaction design.
We study its live interaction behavior as a reference (it is not open source, so no code is reused) rather
than reinventing manipulative UX from zero. Where a spec in this folder departs from Polypad's pattern for a
specific gesture, that spec says why.

### 4.1 The gesture vocabulary

| Gesture | Meaning everywhere it appears | Notes |
|---|---|---|
| **Tap-toggle** | Binary state flip on a discrete unit (shade a fraction segment, activate a bead, select a term). | Never continuous/analog — discreteness is often the pedagogical point (see `fraction-bar.md`). |
| **Drag-to-position** | Continuous placement along a defined axis (number line marker, function control point). | Always has a defined snap behavior (§4.2). Never free-floats in 2D unless the widget's teaching job requires 2D (e.g. `AreaModel` cell selection). |
| **Stepper (+/−)** | Discrete increment of a bounded integer (denominator, rod count, batch size). | Preferred over pinch-to-zoom for anything that must work one-handed — see §4.3. |
| **Long-press** | Reveals the current value/description without committing a change — a "peek", not an edit. | Also the standard trigger for the `describeState()` sentence on touch devices when no screen reader is active. |
| **Double-tap** | Reset-to-default for the tapped element only (not the whole widget). | Always reversible via undo/history, never destructive without confirmation for irreversible operations. |

### 4.2 Snapping is mandatory, never optional, for anything with a mathematically exact answer

If a value has a correct mathematical position (a fraction on a number line, a denominator, a probability
weight), the widget snaps to the valid set of positions. Free-floating "close enough" placement is banned
kit-wide: letting a learner eyeball an approximately-right answer teaches eyeballing, not the concept. Every
individual spec states its own snap grid.

### 4.3 Zoom/pan policy — one-handed first

Pinch-to-zoom requires a second hand (or an awkward one-handed pinch) and is explicitly disallowed as the
*only* way to zoom. Every widget that supports zoom (`NumberLine`, `FunctionGrapher`) must also expose
discrete `+`/`−` buttons ≥ 44pt, thumb-reachable in the bottom third of the screen in `compact` layout (§5).
Pinch may exist as a bonus accelerator on top, never as a requirement.

### 4.4 What the learner can never break

Every individual spec has a "what's draggable/snappable, what the learner cannot break" section, but the
kit-wide floor is:
- No gesture can produce a value outside the widget's configured domain (enforced by clamping the drag
  itself, not by allowing an invalid drop and then rejecting it — invalid states should be geometrically
  unreachable, not merely refused).
- No gesture can silently produce a mathematically nonsensical state (division by zero, a probability
  weight set that doesn't sum to 1, a fraction with denominator 0). These are prevented by construction
  (see each spec), not caught after the fact with an error toast.
- `guided` mode never allows an action outside the one path the current prompt is walking the learner
  through; `free` mode allows the full space the widget's config defines, and no more.

### 4.5 Keyboard/desktop parity

Every drag gesture has a keyboard equivalent on `expanded` layout (arrow keys move a focused draggable by
one snap-step; Enter/Space commits a stepper action). This is not a "nice to have" — it is the same
mechanism accessibility relies on (§7), so building it once serves both desktop mouse users without touch
and switch/keyboard accessibility users on any platform.

---

## 5. Responsive model

Two breakpoints are named and load-bearing; everything between them must reflow continuously, but only the
two named tiers are golden-tested (keeps the pinned-state count sane — see §6.3).

| Tier | Width | Design target | Primary input |
|---|---|---|---|
| `compact` | < 600dp | 5" budget Android phone, portrait, **one-handed** | Touch, thumb zone |
| `expanded` | > 1024dp | 27" desktop monitor | Mouse + keyboard |

(600–1024dp is `medium` — tablets/phone-landscape. It interpolates between the two named layouts; it is
smoke-tested but not golden-pinned.)

Kit-wide responsive rules, binding on every widget:

1. **Reflow, don't shrink past the floor.** A control never shrinks below its minimum functional size
   (44pt touch target; a legible font size). When content would force it smaller, the layout *restructures*
   instead — stacks vertically instead of horizontally, moves to horizontal scroll, switches from
   interactive-grid to stepper-only, etc. Each spec states its own restructuring rule.
2. **Thumb zone on `compact`.** Primary interactive controls (the thing the learner manipulates most, and
   any "run/step/confirm" action) live in the bottom third of the screen. Passive display (the graph, the
   bar, the board) can occupy the top two-thirds.
3. **Spatial mapping on `expanded`.** Where a control governs an axis or region (row-stepper vs.
   column-stepper in `AreaModel`), the desktop layout places the control spatially aligned to what it
   controls — this is free real estate on a 27" monitor that a 5" phone doesn't have, and it measurably
   reduces the "which control does what" lookup cost.
4. **No platform-specific widget variants.** Per the task constraint, no widget may require a specific
   platform; `compact`/`expanded` are screen-size responses, never OS checks.

---

## 6. Animation vocabulary

Motion is expensive to build and expensive to a learner's attention. Every named primitive below exists
because it does a specific piece of pedagogical work; a widget spec may not invent ad hoc motion outside
this vocabulary without stating a new, equally specific justification (and adding it here).

| Primitive | What it looks like | Duration | Pedagogical job | Used by |
|---|---|---|---|---|
| **snap-settle** | Element eases to its nearest valid position/state. | 150–250ms, ease-out | Confirms "this landed on a real answer", not an approximation. | `FractionBar`, `NumberLine`, `AreaModel` |
| **highlight-pulse** | Brief glow/scale pulse (1 cycle). | 300–400ms | Marks "this is now true" (target reached, values equal) without a modal interruption. | `FractionBar`, `BalanceScale` |
| **trace-path** | An element visibly travels along a defined path rather than teleporting/fading. | 300–500ms per step, ease-in-out | The motion *is* the operation (a jump, a hop) — hiding it as an instant cut would hide the math. | `NumberLine` |
| **ghost-preview** | A faint, non-committed preview of where an action would land, shown before the learner commits. | continuous while pending | Predict-then-confirm: lets a learner reason before acting, not just react to the result. | `NumberLine`, `BalanceScale` |
| **live-morph** | Continuous, zero-latency redraw tied 1:1 to a drag/slider position — no easing delay. | per-frame | The single most important primitive for anything parametric: delay would break the "I moved it, it responded" causal link that teaches the parameter's meaning. | `FunctionGrapher` |
| **comparison-residue** ("onion-skin") | Previous state left behind as a faint overlay for a short hold. | ~800ms hold | Lets the learner compare before/after without relying on memory. | `FunctionGrapher` |
| **choreographed-sequence** | Multiple sub-animations fire in a fixed order with a short stagger, not simultaneously. | stagger 80–150ms between stages | When the *order* of cause and effect is the lesson (a carry regrouping, an overlap appearing only after both shadings exist), simultaneity would hide which caused which. | `AreaModel`, `AbacusBoard` |
| **physical-response** (spring) | Damped spring settle, not a fixed ease-curve. | 600–900ms settle | Used only where the widget models a physical object with real inertia (a balance scale, a bead); a discrete-math widget never uses spring motion, because it would imply physicality that isn't there. | `BalanceScale`, `AbacusBoard` |
| **arc-swap** | Two elements trade positions along a visible arc, not a straight cross-fade. | 350–450ms | A straight cross-fade lets two elements pass "through" each other, which misleads about what a swap does structurally. | `StepperMachine` |
| **frame-slide** | A new discrete unit (stack frame, hop counter) slides/scales in from a semantically meaningful direction. | 200–300ms | Direction encodes meaning ("deeper" = down/smaller; "next" = forward) — never decorative. | `StepperMachine`, `NumberLine` |

**Kit-wide rule:** every animation must be individually pausable/rewindable/skippable and must never be the
*only* way information reaches the learner — the end state must be fully legible from a static frame (this
is what makes golden-testing motion possible at all; see §6.1).

### 6.1 Motion and golden tests

Because motion can't be pinned as "the animation", each spec's golden-test plan pins specific **keyframes**
of any load-bearing animation (typically: pre-state, one mid-animation frame at a stated `t`, post-state).
A widget that cannot produce a deterministic frame at a given `t` (e.g. because it depends on wall-clock
time or unseeded randomness) is a spec bug — animations are driven by an injectable `AnimationController`
value, never by `DateTime.now()`.

---

## 7. Theming hooks

Widgets never hold raw colors. They hold **semantic roles**, resolved by the active theme (light/dark,
and eventually per-domain palettes per `docs/00-VISION.md`'s domain order):

| Role | Meaning | Hard rule |
|---|---|---|
| `role.primary` / `role.secondary` / `role.tertiary` | Distinguish multiple instances of the same kind of thing (bar A vs. bar B, function 1 vs. function 2). | Always paired with a non-color distinguisher — see below. |
| `role.correct` / `role.incorrect` | Outcome feedback. | Never the *only* signal — always paired with a glyph (✓/✗ shape, not just green/red) and, where relevant, the `describeState()` sentence. |
| `role.neutral` | Inert/background structural elements (grid lines, unfilled segments). | — |
| `role.highlight` | Transient attention marker (pulse target, active comparison). | Time-bounded; never a resting state. |
| `role.locked` | An element the learner cannot currently act on (`guided` mode's narrowed path). | Always paired with a visibly different affordance (no drag handle rendered), not color alone. |

**Colour-never-sole-carrier is kit law, not a per-widget suggestion.** Every place a spec uses `role.*` to
distinguish two things that carry different meaning, it also specifies a second channel: hatch/pattern
fill, shape, dash style, position, or text label. Each individual spec states its own pairing (e.g.
`FractionBar`'s shaded segments use color + diagonal hatch; `AreaModel`'s row/column shading uses two hatch
*orientations* so the overlap is a cross-hatch independent of color perception).

Dark mode is a first-class target (not a later pass): every role must be defined for both light and dark,
and contrast ratios follow WCAG AA minimums (4.5:1 text, 3:1 for large graphical elements) in both.

---

## 8. Accessibility baseline

This section is the floor every individual spec's "Accessibility" section builds on:

1. **Colour is never the sole carrier of meaning** (§7) — restated here because it is the single most
   commonly violated rule in math UI, not because it's new.
2. **`describeState()` is a full sentence, not a label.** "Fraction bar, three of four parts shaded, equals
   three fourths" — not "3/4". It updates on every committed state change (not every animation frame — see
   §6's announcement-on-gesture-end rule, to avoid announcement spam during a continuous drag).
3. **Every widget exposes a Semantics tree** that mirrors its visual structure: draggable elements are
   `adjustable` (slider-like) with clear increment/decrement semantics tied to the same snap grid as touch;
   discrete toggles are `button`/`checkbox`-like; read-only display elements are `label`s grouped logically,
   not one flat list.
4. **Live regions announce state changes that happen without direct focus** (a balance scale tilting because
   of a mirrored auto-action, a frequency chart updating after a batch run) — but are rate-limited to avoid
   flooding a screen reader during rapid/batch interaction (§6's batch-vs-single-step distinction in
   `probability-simulator.md` and `stepper-machine.md` is the general pattern).
5. **Keyboard parity is accessibility infrastructure, not a desktop nicety** (§4.5) — the same arrow-key/
   Enter path that serves a mouse user without a touchscreen also serves switch-access and screen-reader
   users on any platform.
6. **Minimum touch target 44×44pt everywhere**, per the task constraint — treated as an accessibility
   requirement (motor-accessibility), not just a "budget phone" concession.

---

## 9. Golden-test strategy

**Why this matters more here than in a typical app:** per the architect brief, a math diagram that renders
subtly wrong is a silent content bug — a shaded region one segment off, a graph with a distorted aspect
ratio, a balance scale that doesn't actually reflect the equation — teaches the *wrong* thing convincingly.
Nobody files a bug report for "I now have a misconception"; it just silently defeats the entire premise of
`docs/00-VISION.md`. Golden tests are the load-bearing defense here, not a nice-to-have coverage metric.

### 9.1 Mechanics

- Tooling: `flutter_test` + `golden_toolkit` (ADR-002). Each widget's golden tests live alongside its Dart
  implementation (not specified here — that's the implementer's file layout), but the **matrix of states to
  pin** is specified in this docs folder, per widget, because deciding *what* must never silently change is
  a pedagogy decision as much as an engineering one.
- Every golden fixture is built from a fully-specified `WidgetConfig` + injected `seed` (§2.1) +, for
  animation keyframes, an injected `AnimationController` value (§6.1) — never real time, never unseeded
  randomness. Determinism is a hard requirement: the same fixture must render pixel-identical on every CI
  run.

### 9.2 Naming convention

`golden/<widget-name>/<state-name>__<breakpoint>[__<theme>].png`, e.g.
`golden/fraction-bar/default-3-of-4__compact.png`,
`golden/number-line/jump-arc-mid__expanded__dark.png`.

### 9.3 What gets pinned (kit-wide floor; each spec adds its own list)

Every widget spec's golden-test plan must include, at minimum:
1. **Default/canonical state** at `compact` and `expanded`.
2. **The single most pedagogically load-bearing state** for that widget's teaching job, called out by name
   in the spec (e.g. `AreaModel`'s overlap-reveal; `ProbabilitySimulator`'s n=1 vs n=100 convergence pair).
3. **A dense/edge-case state** that stresses the responsive-reflow rule from §5 (max denominator, max rod
   count, max array length — whatever "dense" means for that widget) at `compact`, to prove the reflow rule
   actually fires rather than silently shrinking below the 44pt floor.
4. **One mid-animation keyframe** for each load-bearing animation named in that widget's spec (§6.1).
5. **One colour-vision-deficiency simulated render** (deuteranopia, the most common form) verifying the
   non-color distinguisher (§7) is actually legible without color.
6. **Light and dark theme** for the default state at minimum (not exhaustively for every state, to keep the
   matrix bounded — each spec may promote more states to dual-theme if the theme materially changes
   legibility, e.g. anything using hatch patterns).

### 9.4 CI gate

A golden-image diff beyond a stated per-pixel tolerance fails CI. An *intentional* visual change requires a
human to re-approve the new golden image in the same PR that changes the widget — it is never
auto-accepted, because the entire point of this section is that a visual regression here is a silent
pedagogy bug, not a cosmetic one.

---

## 10. How this composes: the fractions vertical slice

Phase 1's exit gate is entirely about `FractionBar`, `NumberLine`, and `AreaModel` proving the kit
generalizes across the hardest teaching problem in school math (why dividing by ½ makes a number bigger).
They divide the labor rather than each attempting the whole concept:

- **`FractionBar`** establishes the prerequisite everything else depends on: a fraction is *one* quantity
  (a portion of a whole), and two differently-partitioned bars can represent the same quantity
  (equivalence). Without this, "3/4 ÷ 1/2" is two meaningless whole-number pairs.
- **`NumberLine`** carries the actual division insight, via *measurement division*: ÷ ½ asks "how many
  half-hops fit in 3/4?" — a counting question whose answer is visibly more than one hop.
- **`AreaModel`** carries fraction *multiplication* (a fraction of a fraction is an overlap, not a sum) —
  the complementary operation a learner needs so that "why does division behave oppositely to
  multiplication" is itself visible, not asserted.

A concept YAML composes these three by *mounting more than one widget across the Manipulate layers of a
concept sequence*, each with `interaction_level` progressing from `guided` (first exposure) to `free`
(consolidation) — no single widget is asked to be the whole lesson.
