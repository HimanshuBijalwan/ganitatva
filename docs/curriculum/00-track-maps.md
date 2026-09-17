# Ganitatva — Track Maps

This document explains *why* each track in `content/graph/prerequisites.yaml` is sequenced the way it is,
and calls out the four known fracture points by name. It is the narrative companion to the graph file; the
graph is the source of truth, this document is the argument for it.

**The test applied to every edge in the graph:** *if a learner lacks this prerequisite, does the new concept
become incoherent, or merely unfamiliar?* Only "incoherent" earns an edge. This matters because it is the
difference between a graph that reflects genuine dependency and a graph that reflects "the order my textbook
happened to use." During the graph-analysis pass (`01-graph-analysis.md`) one edge failed this test on
re-audit (`fraction-decimal-conversion` no longer requires `fraction-simplification` — converting a fraction
to a decimal is long division, not simplification) and was corrected. That correction is the kind of thing
this test is *for*.

Scope of this pass: **math domain only** — arithmetic, abacus, pre-algebra, algebra, geometry, trigonometry,
statistics & probability. Logic, algorithms, and physics are out of scope for this graph (per
`docs/00-VISION.md`'s domain order, math is the substrate everything else needs anyway).

---

## 1. Arithmetic (`math.arithmetic.*` — 56 nodes)

Arithmetic is the only track with two true roots in the whole math graph that matter at scale:
`counting` (171 descendants) and, one step later, `place-value` (170 descendants). Nearly every other node
in the entire 193-node graph — across every track — traces back through these two. That is not a modeling
choice; it is a fact about mathematics. You cannot make "place value" less structurally central by rearranging
the graph, only by refusing to admit how much depends on it, which would be dishonest.

**Sequencing logic:**
1. `counting` → `place-value` → `number-comparison` / `number-line` — the numeral system itself, before any
   operation touches it.
2. Addition → subtraction → multiplication (as *repeated addition*, not a table to memorize) → division —
   each operation is introduced as the previous one's natural extension or inverse, never dropped in cold.
   Two meanings of division are modeled as **siblings**, not a single node: `division-as-equal-sharing`
   (partitive — "share 12 among 4 people") and `division-as-measuring` (quotative — "how many groups of 4
   fit in 12"). Most arithmetic curricula only teach the partitive meaning explicitly and let the quotative
   meaning stay implicit. That implicit gap is exactly why "dividing by a fraction makes the answer bigger"
   feels impossible later — the sharing model of division has no answer for "share this by half a person."
   The measuring model does: "how many half-cups fit in 3/4 cup" is obviously more than 3/4. This node was
   added mid-build after a coordination exchange with the pedagogy agent building the fractions vertical
   slice (see §6) and is grounded in `docs/research/02-fractions-evidence.md`.
3. Factors, multiples, primes, LCM/GCD — the toolkit fractions need, built *before* fractions, not
   alongside them.
4. Negative numbers — deliberately placed **after** the whole-number operations are solid, not interleaved
   with them (see fracture point §5.2).
5. Fractions — the largest single sub-graph in the track (18 nodes); detailed fully in `01-graph-analysis.md`
   §4 since it is Phase 1's vertical slice.
6. Decimals, ratio/proportion, percentage, exponents/roots — each is fractions-in-a-different-notation, so
   each is sequenced strictly after the fractions spine it depends on (`decimals-intro` needs
   `unit-fractions`; `ratio-intro` and `percentage-intro` need `equivalent-fractions`).

**Why decimals sit *inside* fractions' dependency chain, not beside it:** a decimal is a fraction with a
denominator restricted to a power of ten. Teaching decimals as a parallel, unrelated notation (common in
practice — "now let's learn decimals" as if starting over) is exactly the kind of notation-first teaching
the whole project exists to avoid. `decimals-intro` requires `unit-fractions` for this reason.

---

## 2. Abacus (`math.abacus.*` — 8 nodes, parallel track)

Per `docs/00-VISION.md`, the abacus track "runs parallel to arithmetic, not inside it." The graph reflects
that literally: every abacus node's prerequisites reach *into* the arithmetic track (e.g.
`abacus-place-value` requires `math.arithmetic.place-value`; `abacus-multiplication` requires
`math.arithmetic.multiplication-tables`) but no arithmetic node ever requires an abacus node back. Abacus is
a second physical representation of the same ideas, not a gate anything else waits on. This also means the
abacus track can ship early or late within Phase 3 without blocking the rest of arithmetic — it is a
strict downstream consumer.

Sequencing inside the track mirrors arithmetic's own operation order (place value → addition → subtraction →
complementary numbers → multiplication → division), ending in `mental-math-visualization` (the "seeing the
beads without the beads" step — flash-anzan-style mental imagery), which only makes sense once every physical
manipulation beneath it is automatic.

---

## 3. Pre-Algebra (`math.prealgebra.*` — 18 nodes)

This is the shortest, highest-density track in the whole graph, and it contains fracture point #3
(variable-as-quantity, §5.3) plus the doorway to everything algebraic.

**Sequencing logic:**
1. `patterns-sequences` — regularity in numbers, spotted *before* it is named with a letter.
2. `variable-as-placeholder` → `variable-as-quantity` — split into **two separate nodes** on purpose. A
   letter as "the unknown number in this one equation" (placeholder) and a letter as "a quantity that
   varies" (quantity) are documented as distinct cognitive achievements, not two views of the same skill —
   see `docs/research/03-other-fracture-points.md`, citing Kieran (1980, 1992). Collapsing them into one
   node would misrepresent the actual difficulty; a learner can solidly have one without the other.
3. `algebraic-expressions` → `like-terms` → `combining-like-terms` → `distributive-property` — manipulating
   expressions, still without solving anything.
4. `equality-as-balance` → `one-step-equations` → `two-step-equations` — the balance-scale model of
   equality, then equations as *statements to satisfy*, not "problems with an = sign."
5. `coordinate-plane-intro` — placed here (not in geometry) because its immediate job in this track is
   hosting `plotting-points`, which pre-algebra's own `direct-variation` needs, and because algebra's entire
   graphing spine (`slope-concept` onward) depends on it. It requires both `number-line` and
   `negative-numbers-intro` from arithmetic — a coordinate plane is two signed number lines, and pretending
   otherwise (teaching quadrant I only, then "discovering" the rest later) just relocates the negative-number
   fracture point instead of resolving it.

---

## 4. Algebra (`math.algebra.*` — 35 nodes)

The deepest track by raw prerequisite-chain depth (see `01-graph-analysis.md` §2 for the actual longest
chains — several algebra terminal nodes sit 16-19 prerequisite-steps below `counting`). That depth is mostly
real, not an artifact: `quadratic-formula` genuinely is Class 10 content sitting on top of the *entire*
arithmetic and algebra foundation beneath it, and each individual edge along that chain passes the
incoherent-without-it test.

**Sequencing logic:**
1. Linear equations (one variable → with fractions → multi-step) and inequalities, built directly on
   pre-algebra's `two-step-equations` and `distributive-property`.
2. The slope/graphing spine: `slope-concept` (a rate-of-change idea, built on `ratio-intro` — slope *is* a
   ratio) → `slope-formula` → `linear-equation-graphing` → `slope-intercept-form` → systems of equations.
3. `function-as-machine` is introduced as its **own branch**, not a rename of "equation." It requires
   `variable-as-quantity` (not `variable-as-placeholder`) because a function's input is explicitly a varying
   quantity, and `evaluating-expressions`. This is fracture point #4 (§5.4).
4. Polynomials → factoring → quadratics — the standard factoring-before-formula sequence, because factoring
   builds the structural sense (a quadratic *is* a product) that makes the quadratic formula a derivation
   worth understanding rather than a chant.
5. Exponential functions, rational expressions, and radical expressions each branch off once their
   respective arithmetic foundation (`exponent-laws`, `fraction-simplification` → `factoring-gcf`,
   `square-roots-intro`) and algebra foundation (`function-as-machine`, `polynomial-vocabulary`,
   `linear-equations-one-variable`) are both in place.

---

## 5. The four fracture points

These are the transitions where the research consistently shows students don't just get *more wrong
answers* — they hold a different, internally coherent, wrong model of what the mathematics even means. Each
one gets disproportionate design attention regardless of where it lands in the raw load-bearing ranking
(§5.5 explains why those two things — "fracture point" and "load-bearing node" — are related but not the
same measurement).

### 5.1 Fractions

**Where:** `math.arithmetic.unit-fractions` through `math.arithmetic.fraction-division` (18-node sub-graph;
full detail in `01-graph-analysis.md` §4).

**Why here:** Every downstream fraction concept requires whole-number multiplication/division and
factors-and-multiples to already be automatic — fractions are the first place a student must hold a
*single magnitude* made of two numbers, and `docs/research/02-fractions-evidence.md` (VERIFIED, Siegler &
Lortie-Forgues) identifies **whole-number bias** as the root-cause mechanism behind nearly every fraction
error: students apply whole-number logic (bigger denominator = bigger fraction; add tops and bottoms
straight across) because they haven't yet built a fraction-as-single-magnitude model. That model cannot be
built before whole-number magnitude itself is solid, which is why fractions sits where it does and not
earlier.

**`math.arithmetic.fractions-on-number-line` (added after a second pedagogy-agent coordination round, §6.1)
is the node that actually builds that single-magnitude model**, as distinct from `fraction-as-part-whole`
(the part-whole/area reframe of *what a fraction means*, which the research above notes is good for that
job specifically but not for magnitude) and from the plain `number-line` (whole numbers only). It sits
between them: prerequisites `[fraction-as-part-whole, number-line]`, and it is now the direct prerequisite
of `comparing-fractions` (replacing the coarser whole-number `number-line` reference that node used to point
at) and an added prerequisite of `fraction-division` — the magnitude model is what makes "how many halves
fit into 3/4" a question about position on a line rather than a rule to apply.

**Why it's Phase 1's vertical slice:** it is universally hated, purely visual at its core, and contains the
hardest teaching problem in school math (why dividing by 1/2 makes the answer bigger). The research backs
the plan's instinct directly: number-line representation (not area models) is the specific evidence-backed
technique for fraction division comprehension (`docs/research/02-fractions-evidence.md`, citing
Gunderson et al. and the ScienceDirect fraction-division study) — which validates keeping `NumberLine` as
a widget in the fraction-division chain, not `AreaModel` alone.

### 5.2 Negative numbers

**Where:** `math.arithmetic.negative-numbers-intro` (54 descendants — the highest-ranked fracture point by
raw graph weight; #16 overall).

**Why here, not earlier or interleaved:** negative numbers are placed **after** all four whole-number
operations are solid, as a deliberate extension of the number line rather than a same-time complication. The
graph enforces this literally: `negative-numbers-intro` requires both `number-line` and `subtraction-basic`.

**A caution this graph reflects but the widget spec still needs to honor:**
`docs/research/03-other-fracture-points.md` documents two specific, well-studied misconceptions about the
number line *itself* when negatives are introduced — **split-ray** (students mentally treat it as two
disconnected rays for positive and negative rather than one continuous line) and **amalgamated-translation**
(they construct the negative side by "translating" positive intervals rather than understanding negatives as
a coherent extension of the same magnitude scale). The same source notes this was measured in *pre-service
teachers*, not just children — the adults who will teach this concept often hold the same flawed model. The
research explicitly warns against treating "put it on the number line" as a safe default here the way it is
for fractions: negative numbers need an operation-based, directional Intuition layer (debt, temperature,
elevation — movement in two directions) rather than a static labeling exercise. This is a pedagogy/widget
design note, not a graph-structure note, but it belongs in this document because it is *why*
`negative-numbers-intro` is treated as load-bearing rather than routine.

### 5.3 Variable-as-quantity

**Where:** `math.prealgebra.variable-as-quantity` (41 descendants — one below this graph's load-bearing
threshold of 42; see §5.5).

**Why it's split from `variable-as-placeholder`:** covered in §3.2 above. The practical implication for
content authoring: a widget or lesson built for "solve for the unknown" (a fixed, hidden value — the
`BalanceScale` model) does not automatically teach "a letter can stand for something that varies" (a
generalized quantity — closer to a fillable container labeled with the variable than a locked box with an
unknown weight inside). Treating these as one skill because they use the same symbol is precisely the
"letter as a label" misconception research flags as the single most actionable, testable target for a
variables Intuition layer.

### 5.4 Function-as-machine

**Where:** `math.algebra.function-as-machine` (only 9 descendants — the least "load-bearing" of the four
fracture points by raw graph weight, and a clean illustration of why raw descendant count alone would be a
bad way to decide what deserves design attention).

**Why here:** it requires `variable-as-quantity` specifically (not `variable-as-placeholder`) — a function's
input is a varying quantity by definition — plus `evaluating-expressions`. `docs/research/03-other-fracture-points.md`
(citing Leinhardt, Zaslavsky & Stein 1990, still the field's primary review) documents that the actual
missing skill at this fracture point is **representation-switching itself**: students can often work within
one representation of a function (a table, or a graph, or an equation) but fail to connect what changes in
one to what changes in another, and this persists into undergraduate study rather than resolving with more
practice. That is a strong argument — noted here for whoever designs the function-introduction widget — for
a manipulation that keeps graph, table, and formula visible and synchronized simultaneously, rather than
teaching the three representations as separate sequential lessons.

**Widget-coverage gap, resolved 2026-09-17 (cross-agent note):** the widgets agent confirmed `BalanceScale`
stays scoped to `variable-as-placeholder` only (its two-pan mechanic assumes a fixed, undiscovered number —
the wrong model for a genuinely varying quantity), and that `FunctionGrapher`'s point-probe covers
`variable-as-quantity` only partially — it's a Manipulate/Formalize-layer tool, not the zero-symbol
Intuition-layer treatment the 6-layer doctrine requires for a learner's *first* encounter with "a letter can
be a changing amount." Their proposal is a dedicated `FunctionMachine` primitive (input-slot/output-slot
container, no coordinate plane, no notation) for Phase 2/3. **Approved and applied 2026-09-17 by the
schema owner (main): `FunctionMachine` is now in the `concept.schema.json` widget enum (16 → 17).** Their stated stopgap — reusing `FunctionGrapher`'s point-probe, but only for a
concept placed after coordinate-plane fluency already exists — **is not enforced as a graph edge here on
purpose**: `variable-as-quantity` and `function-as-machine` do not actually require the coordinate plane to
be coherent (the doctrine test this graph applies to every edge), so adding one would misrepresent the
mathematics to serve an implementation stopgap, not fix a real dependency. In practice the ordering mostly
takes care of itself — `coordinate-plane-intro` sits at raw depth 6, `variable-as-quantity` at depth 10,
`function-as-machine` at depth 13, so any depth/level-ordered path engine (Phase 2) will surface
`coordinate-plane-intro` well before either — but that's a correlation from unrelated prerequisites, not a
guarantee. If the `FunctionGrapher` stopgap ships, the ordering assumption needs to live as an explicit
authoring note in that concept's YAML (`connect` or a comment), not as a fabricated graph prerequisite.

### 5.5 Fracture point ≠ load-bearing node

Worth stating explicitly because the numbers make it visible: "load-bearing" in this graph is a *structural*
property (how many nodes transitively depend on this one) computed from the DAG. "Fracture point" is a
*pedagogical* property (where students form a coherent-but-wrong mental model) drawn from doctrine and
research. They overlap for fractions and negative numbers (both happen to sit early enough in their tracks
to also have wide raw descendant counts) but they diverge sharply for `function-as-machine` (9 descendants,
not load-bearing by this graph's threshold) and `variable-as-quantity` (41 descendants, one node under the
threshold). Both still get full fracture-point design attention. A graph-weight threshold is a genuinely
useful, honest signal — but it is not the only signal, and this document is where the two are meant to be
read together rather than one silently standing in for the other.

---

## 6. Cross-track coordination note (fractions IDs)

### 6.1 Round 1 — initial id mapping

While this graph was being built, the pedagogy agent authoring `content/concepts/arithmetic/*.yaml` for the
Phase 1 fractions vertical slice proposed three new upstream nodes and flagged five downstream "unlocks"
targets. Resolution (full mapping sent back to that agent directly, summarized here for anyone reading the
graph later):

- **Accepted and added:** `math.arithmetic.division-as-measuring` (quotative division) — a genuine gap, not
  a duplicate; see §1.2 and §5.1 above. This is the one substantive structural change this coordination
  produced.
- **Declined as duplicates, existing nodes pointed to instead:** "equal-groups" →
  `math.arithmetic.multiplication-as-repeated-addition` (same mental model, already named); "whole-numbers-
  on-number-line" → `math.arithmetic.number-line` (already generic, already reused across the graph for this
  exact purpose).
- **Downstream targets resolved to existing nodes** (no new dangling ids needed): ratio-and-rate →
  `math.arithmetic.ratio-intro` / `math.arithmetic.unit-rate`; decimals-as-fractions →
  `math.arithmetic.fraction-decimal-conversion`; percentages → `math.arithmetic.percentage-intro`;
  unit-conversion → `math.prealgebra.rates-and-unit-conversion`; algebraic-fractions →
  `math.algebra.rational-expressions-intro`.

This is noted here because `content/graph/prerequisites.yaml` is meant to be the backbone every content file
conforms to (per `docs/01-ARCHITECTURE.md` ADR-004) — any future content author working on fractions should
use the ids in this graph's fractions sub-graph (`01-graph-analysis.md` §4) rather than inventing new ones.

### 6.2 Round 2 — after all 7 Phase-1 files were conformed

Once the pedagogy agent finished conforming its 7 concept files to the round-1 mapping, it surfaced two
further questions — a genuine graph gap, and a proposed edge. Both were decided against the same
incoherent-vs-merely-unfamiliar test used throughout this graph, not by default-accepting either:

- **Accepted: `math.arithmetic.fractions-on-number-line`.** Pedagogy's argument was specific and correct —
  the graph had `fraction-as-part-whole` (the part-whole reframe of what a fraction *means*) and
  `number-line` (whole numbers only), but no node for "a fraction is one number with a position on the
  line," which is the actual target of the whole-number-bias research (§5.1) and the hinge the
  componentwise-comparison error, the "5/4 isn't a real fraction" error, and the "is there a next fraction"
  error all trace back to. Telling evidence this was a real gap rather than a preference: `comparing-fractions`
  already pointed at plain `number-line` as if reaching for a fraction-specific version that didn't exist.
  Added with prerequisites `[fraction-as-part-whole, number-line]`; wired as the (replaced) prerequisite of
  `comparing-fractions` and an added prerequisite of `fraction-division` (§5.1). **Declined to wire it into**
  `mixed-numbers` **or** `improper-fractions`, despite pedagogy's single content file covering all three
  topics — regrouping between mixed and improper fractional forms is coherent purely through the
  part-whole/division model (`fraction-as-part-whole` + `division-with-remainder`), with no dependence on
  the number-line magnitude model. **One content file legitimately covering several graph-node topics is an
  authoring-scope decision, not a reason to add a graph edge** — the two are kept deliberately separate here.
- **Declined: edges from `fraction-division` to `ratio-intro` / `unit-rate` /
  `math.prealgebra.rates-and-unit-conversion`.** Pedagogy's underlying observation is real — a rate is a
  measurement-division question, and unit conversion is dimensional analysis, which is division dressed
  differently — but at the level these three nodes are currently scoped (basic ratio/rate/conversion using
  whole-number or decimal quantities), they remain fully coherent without ever having formally divided a
  fraction by a fraction. Forcing the edge would gate ordinary Class 6-7 rate and conversion work behind one
  of the arithmetic track's deepest nodes (`fraction-division` sits at raw depth 10-11), which most curricula
  — correctly — do not require. The connection pedagogy is pointing at is real for a *more advanced* version
  of unit conversion (one that explicitly uses fractional conversion factors), which is not what
  `rates-and-unit-conversion` currently is; if that more advanced node gets authored later, *it* should take
  `fraction-division` as a prerequisite. No change made to the current graph.

---

## 7. Geometry (`math.geometry.*` — 40 nodes)

The second true root of the whole graph: `point-line-plane` (51 descendants, no prerequisites — geometry
does not borrow its starting point from arithmetic at all, unlike every other track).

**Sequencing logic:** points/lines/planes → angles → polygons/triangles (the two big branches: perimeter/area
and congruence/similarity) → the Pythagorean theorem (requires both `area-of-triangles` — the classic
area-based proof — and `triangle-classification`, so a learner has *seen* a right triangle classified before
being told something special is true about it, plus `square-roots-intro` from arithmetic) → circles → 3D
shapes/volume → coordinate geometry (needs `coordinate-plane-intro` from pre-algebra *and*
`pythagorean-theorem` — distance-between-two-points is the Pythagorean theorem wearing a coordinate-grid
costume) → transformations → constructions → `proof-intuition` as the capstone, requiring both congruence
criteria and the triangle angle sum to already be settled facts a learner can reason *from*.

`similarity-concept` deliberately requires `math.arithmetic.ratio-intro`, not just `triangle-basics` — the
whole point of similarity is "same ratios, different size," so the ratio concept has to already exist before
similarity can mean anything more than "looks kind of the same."

---

## 8. Trigonometry (`math.trigonometry.*` — 15 nodes)

`docs/02-PLAN.md` is explicit that trigonometry goes **"unit circle first, triangles second — that order
matters."** The graph enforces this literally: `unit-circle-intro` (requiring `coordinate-plane-intro` and
`circle-basics`) is the track's root, and `right-triangle-ratios` is downstream of it, not the other way
around.

**Why this order, concretely:** if right-triangle ratios (SOH-CAH-TOA) come first, sine and cosine are
learned as *properties of a triangle's side lengths* — a fact about a shape — with no reason the same idea
should later apply to angles beyond 90° or to a circle at all. Starting from the unit circle instead defines
sine and cosine as *coordinates of a point at a given angle of rotation*, which is the actual general
definition; right triangles then become one visible special case of it, not a separate topic bolted on
before periodicity, graphing, or the law of sines can make sense. `right-triangle-ratios` itself requires
`similarity-criteria` from geometry, not just the unit-circle chain — the reason a triangle's side ratios are
a fixed function of its angle *at all*, independent of the triangle's size, is similarity. Skipping that
prerequisite is exactly how "trig ratios" end up memorized as an unmotivated table.

`graphing-sine-cosine` and `amplitude-period-phase` reach back into the algebra track (`function-graphing`),
which is why trigonometry contains some of the graph's longest prerequisite chains (§`01-graph-analysis.md`
§2) — periodic functions are functions, and inherit that entire prerequisite spine.

---

## 9. Statistics & Probability (`math.statistics.*` — 21 nodes)

`docs/02-PLAN.md` calls for "simulation-first, formula-second," and the graph's two roots reflect that:
`data-collection-types` (leading to frequency tables, graphs, and the mean/median/mode/spread cluster) and
`probability-as-likelihood` (leading to experiments, sample space, and compound events) are independent
entry points that only merge later, at `scatter-plots-correlation`.

**Sequencing logic:** `probability-as-likelihood` requires `math.arithmetic.fraction-as-part-whole`
specifically — probability *is* a part-of-a-whole fraction (favorable outcomes over total outcomes) before
it is anything else, so the fractions fracture point is a direct prerequisite here, not a coincidence of
timing. `probability-experiments` (simulation) is required before
`theoretical-vs-experimental-probability` — the graph forces the "run it and see" step before the formula
that predicts it, matching the plan's stated ordering rather than the more common textbook order (formula
first, "verify with a simulation" as an afterthought exercise). `mean-concept` is framed and named as "fair
share" specifically so it connects back to `division-as-equal-sharing` conceptually, even though it isn't a
formal graph prerequisite of it — a deliberate content-authoring note as much as a graph one.
`compound-events-independent` requires `fraction-multiplication` — "and" for independent probabilities is
literally fraction multiplication, another place where treating probability as a separate topic from
fractions would hide a real dependency.
