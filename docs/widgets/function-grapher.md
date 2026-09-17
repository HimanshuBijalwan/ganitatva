# FunctionGrapher

> Inherits the base contract in `00-kit-overview.md`. Read that first — this spec only states what's
> specific to `FunctionGrapher`. Shorter-form spec per the assignment's priority order.

## 1. Teaching job

**The one misunderstanding this widget exists to destroy:** curriculum research on function misconceptions
(`docs/research/03-other-fracture-points.md`) identifies the core documented difficulty as
**representation-switching itself** — not weakness in reading a graph, or a table, or a formula in
isolation, but the failure to recognize that a graph, a table of (x, y) pairs, and an equation are *the same
object*. A learner who can read a graph and separately compute a table often cannot connect "this point on
the curve" to "this row in the table" to "this term in the formula." `FunctionGrapher` therefore does not
treat the graph as the primary view with a table as an accessory — it keeps **graph, table, and formula
live-linked and synchronized**: dragging a point on the curve updates the table row and the formula's
parameter display in the same frame, and editing a parameter (or a table cell, where writable) redraws the
curve immediately. The secondary job — that `m` and `b` are not abstract letters but felt quantities you can
drag — falls out of the same live-linking, but representation-switching is the primary target.

## 2. Config schema

```jsonc
{
  "type": "FunctionGrapher",
  "config": {
    "id": "graph-a",
    "interaction_level": "guided",
    "mode": "drag-curve",              // "drag-curve" | "explore-slider" | "compare"
    "functions": [
      {
        "id": "f1",
        "family": "linear",             // "linear" | "quadratic" | "custom"
        "expression": "m*x+b",          // required when family = "custom"; ignored (family-derived) otherwise
        "params": {
          "m": { "value": 1, "min": -5, "max": 5, "step": 0.1, "draggable": true },
          "b": { "value": 0, "min": -5, "max": 5, "step": 0.1, "draggable": true }
        },
        "color_role": "primary",
        "trace_enabled": true
      }
    ],
    "viewport": { "x_min": -5, "x_max": 5, "y_min": -5, "y_max": 5, "aspect_locked": true },
    "grid": { "show": true, "spacing": 1 },
    "point_probe": { "enabled": true, "snap_to": "curve" },
    "linked_views": { "table": true, "formula": true } // both default true — this is the widget's core job, not an add-on
  }
}
```

**Build-time validation:** `family: "custom"` requires a valid `expression`, parsed and range-checked
against `viewport` at build time (domain errors like division by zero within the visible viewport fail the
content build, not the runtime); `viewport.aspect_locked` defaults `true` and unlocking it requires an
explicit content-author override (see §4 — distorting the visual aspect ratio breaks the geometric meaning
of slope).

## 3. Interaction model

- **`drag-curve` mode (default first exposure):** the learner grabs visible control points directly on the
  line itself — e.g. drag the y-intercept point vertically to change `b`, drag a second point on the line
  to change `m` — rather than operating an abstract slider first. Direct manipulation of the object itself
  is more concrete for the target 11–16 audience than a labelled slider with no visual tie to the curve.
- **`explore-slider` mode:** promoted for later exposure and for `compare` mode with multiple functions —
  each parameter gets its own slider (44pt thumb).
- **Point-probe:** tap/drag along the curve to read a live `(x, y)` readout, synchronized with the linked
  table row (§1) — cannot leave the function's defined domain; the probe simply stops at a domain boundary
  rather than producing an undefined reading.
- **What the learner cannot break:** cannot set a parameter combination that produces an undefined function
  within the visible viewport (build-time validated, §2); cannot distort the aspect ratio without an
  explicit content-author unlock (§4); `linked_views` cannot be desynchronized by any learner action — table
  and formula update automatically and are never independently editable to a value inconsistent with the
  curve (in modes where the table is editable, editing a cell moves the curve, it does not create a
  contradiction between views).

## 4. Responsive behaviour

- **`compact`:** graph viewport occupies the top ~60% of the screen; parameter sliders/dock occupy the
  bottom 40% (thumb zone). The linked table, when shown, is a collapsible strip beneath the graph (tap to
  expand) rather than a permanent side panel, since `compact` width can't show graph + table + controls
  simultaneously without cramping all three below usable size.
- **`expanded`:** graph is the large central canvas; a persistent side panel shows the live-linked table and
  formula simultaneously (no collapsing needed) plus the parameter controls; mouse-wheel zoom, click-drag
  pan.
- **Aspect-lock rule (both tiers, binding):** the viewport defaults to a locked aspect ratio so slope reads
  as a consistent visual angle. This is treated the same way `area-model.md` treats its 44pt floor: never
  silently violated to fit a layout. If a layout genuinely needs a non-square viewport, the content author
  must explicitly set `viewport.aspect_locked: false` and the widget renders a persistent, non-dismissible
  visual note that the aspect ratio is distorted — this is deliberately friction-y because an unlabelled
  distorted graph is a silent pedagogy bug (kit overview §9's framing).

## 5. Animation spec

| Trigger | Primitive | Duration | Pedagogical justification |
|---|---|---|---|
| Parameter drag (slider or direct curve-point drag) | `live-morph` — continuous, zero-latency redraw tied 1:1 to the drag position | per-frame, no easing delay | The kit's single most important primitive for anything parametric (kit overview §6): any lag between the drag and the curve's response breaks the causal link that teaches what `m`/`b` mean. The linked table row and formula display update in the same frame, not after. |
| Parameter change committed (drag released) | `comparison-residue` ("onion-skin") — previous curve left as a faint overlay | ~800ms hold | Lets the learner compare before/after without relying on memory, directly supporting the "what did changing `m` actually do" question. |
| Point-probe drag along curve | table row highlight tracks the probe position live | per-frame | This is the representation-switching animation: watching the highlighted table row move in lockstep with the probe *is* the lesson that graph-point and table-row are the same fact. |

## 6. Accessibility

- Each function line is distinguished by **color, dash pattern** (solid/dashed/dotted), **and** an
  end-of-line text label — never color alone (kit overview §7), which matters most in `compare` mode with
  multiple functions plotted together.
- A continuously live-morphing graph is not screen-reader-consumable frame by frame, so `describeState()`
  is the primary access path here, not a live region firing on every drag frame: it returns a full sentence
  on gesture-end only (kit overview §6/§8.4's announcement-on-commit rule) — e.g. *"Line: slope 2,
  y-intercept −1. Passes through (0, −1) and (1, 1)."* — and is also independently triggerable on demand.
- The linked table is a genuine accessible table (row/column Semantics), not an image of one, so it's the
  primary non-visual access path to the function's behavior — this matters more here than in most widgets,
  because it's the one representation that was always going to be screen-reader-native.

## 7. Golden-test plan

1. `default-linear-identity__compact` / `__expanded` — `y = x`, baseline case, table + formula both visible.
2. `slope-zero-horizontal__expanded` — edge case, confirms horizontal-line rendering and table behavior.
3. `slope-undefined-vertical-guided__expanded` — the explicitly guided edge case for an undefined slope,
   confirming the widget handles it as a deliberate teaching moment, not a crash state.
4. `quadratic-family-default__expanded` — non-linear family, confirms table/formula linkage generalizes.
5. `two-function-compare__expanded` — `compare` mode, confirms color+dash+label disambiguation.
6. `probe-tracks-table-row__t-mid` — pinned mid-frame of the point-probe-to-table-row live linkage, the
   single most pedagogically load-bearing state in the widget (kit overview §9.3.2).
7. `onion-skin-residue__t-post-release` — comparison-residue frame after a parameter drag commits.
8. `aspect-lock-violation-warning__expanded` — the explicit distorted-aspect note state, confirming it's
   never silent.
9. `compact-collapsed-table__compact` — collapsed-table strip state, confirming the reflow rule.
10. `deuteranopia-two-function-compare` — colour-vision-deficiency simulated render of state #5.
11. `dark-theme__default-linear-identity` — dark-theme render of state #1.

## 8. Known scope boundary — variable-as-quantity, and whether this widget covers it

Raised by curriculum during this pass (`docs/curriculum/00-track-maps.md` §5.4): the knowledge graph encodes
**variable-as-placeholder** (unknown-to-solve-for — `balance-scale.md`'s entire job) and
**variable-as-quantity** (a letter attached to something that varies) as two distinct prerequisite nodes,
per Kieran (1992)'s documented-distinct-achievements framing, not one node with two readings.
`function-as-machine` depends specifically on variable-as-quantity. `variable-as-quantity` sits at 41
descendants in the graph — one under curriculum's 42-descendant "load-bearing" cutoff, so this is a real,
near-load-bearing dependency with no widget currently built for it, not a hypothetical gap.

**My call, as widget-kit architect:**

- `BalanceScale` should **not** be stretched to cover this. Its entire mechanic (mirrored two-pan operations,
  isolate the fixed unknown) is built around `x` being one specific, undiscovered number — that's the
  correct model for variable-as-placeholder and the wrong model for a quantity that genuinely varies. Using
  it for both would blur a distinction the curriculum graph deliberately keeps separate.
- `FunctionGrapher`'s point-probe (§3, §5) is **real but partial** coverage: dragging along the curve and
  watching `x` vary while `y` responds live, synchronized with the table row, *is* the "a letter is a
  changing amount, and something else changes because of it" idea in action. But it presupposes coordinate-
  plane literacy and algebraic notation already in view — which makes it a **Manipulate/Formalize-layer**
  tool, not a **zero-symbol Intuition-layer** tool per `docs/00-VISION.md`'s 6-layer doctrine. Using it as a
  learner's *first* encounter with "a letter can mean a changing quantity" risks presenting the idea already
  wrapped in the very notation the Intuition layer exists to defer.
- **Recommendation, not an action I can take unilaterally:** scope a lightweight new primitive — tentatively
  `FunctionMachine` — for Phase 2/3: an input-slot/output-slot container metaphor (a box, or a
  fill/pour-style container) where a physical quantity visibly varies as the learner manipulates an input
  control and a second quantity visibly and immediately responds, with **no coordinate plane and no
  algebraic notation** at first exposure. This mirrors why `AbacusBoard` exists as a dedicated physical
  anchor for place value rather than overloading `NumberLine` for that job (`00-VISION.md`'s abacus-track
  reasoning) — variable-as-quantity plausibly deserves the same dedicated, more-concrete-than-a-graph
  treatment before `FunctionGrapher` picks it up for the Formalize/Manipulate layers. This is outside my
  assigned scope for this pass (adding a widget type requires a `content/schema/concept.schema.json` enum
  change I don't own, and a full spec I wasn't asked to write) — it's a recommendation for curriculum/
  pedagogy to weigh for Phase 3 scoping, not a decision I've made on their behalf.
- **Stopgap if no new primitive ships in time:** a content author may use `FunctionGrapher`'s point-probe /
  `explore-slider` mode to carry variable-as-quantity, but only for a concept placed *after* basic
  coordinate-plane fluency is already established elsewhere in the sequence — never as the very first
  encounter with the idea that a letter can vary. That ordering constraint should be stated explicitly in
  any concept YAML that takes this stopgap path, so it doesn't silently become the de facto Intuition-layer
  treatment.
