# Ganitatva — Graph Analysis

Quantitative analysis of `content/graph/prerequisites.yaml`: verification results, the load-bearing
ranking, the longest prerequisite chains (and whether they can be flattened), and a full breakdown of the
fractions sub-graph, since fractions is Phase 1's vertical slice.

All numbers in this document were produced by a generator script
(`build_graph.py`, run from the session scratchpad — not checked into the repo) that computes every derived
field from the hand-authored `prerequisites` list per node, then **independently re-verified** by a second,
separate script (`verify_graph.py`) that re-parses the actual written YAML file from scratch with its own
parser and recomputes the DAG/orphan checks without importing anything from the generator. This two-script
split exists specifically so a bug in the generator's own bookkeeping can't produce a false "PASS" — see §1.

---

## 1. Verification result

**The graph is a genuine DAG with no cycles, and every `prerequisites`/`unlocks` id referenced resolves to
a real node. Both properties were checked twice, independently.**

- **Node count:** 193
- **Method:** Kahn's-algorithm topological sort. A cycle would leave at least one node whose indegree never
  reaches zero; the independent verifier's topological sort visited all 193/193 nodes, confirming no cycle
  exists. The generator additionally runs a second, algorithmically distinct check (a monotonicity assertion
  over every edge: a prerequisite's derived `level` must never exceed its dependent's), which passed on
  every one of the graph's edges.
- **Orphan check:** every id appearing in any node's `prerequisites` or `unlocks` list was confirmed to
  exist as an actual node `id` elsewhere in the file. Zero orphans found, in both the generator's inline
  check and the independent re-parse.
- **Unlocks consistency:** `unlocks` is mechanically the transpose of `prerequisites` (if A lists B as a
  prerequisite, B lists A in `unlocks`, and nothing else) — verified by direct set comparison over all 193
  nodes in the independent verifier, not merely computed-and-trusted.
- **Two root nodes**, confirmed to have zero prerequisites and to be the *only* zero-prerequisite nodes:
  `math.arithmetic.counting` and `math.geometry.point-line-plane`. Every other track roots itself back into
  one of these two, either directly or (for abacus, pre-algebra, algebra, trigonometry, statistics) via
  another track's nodes — there is no third, accidental island.
- **54 leaf nodes** (unlock nothing further) — expected and correct: these are terminal, examinable skills
  (e.g. `fraction-subtraction`, `improper-fractions`, `law-of-cosines`, `combinations`), not a sign of a
  disconnected graph.

Per-track node counts (193 total, target was "roughly 180"):

| Track | Nodes |
|---|---|
| Arithmetic | 56 |
| Abacus | 8 |
| Pre-Algebra | 18 |
| Algebra | 35 |
| Geometry | 40 |
| Trigonometry | 15 |
| Statistics & Probability | 21 |
| **Total** | **193** |

---

## 2. Load-bearing nodes

**Method:** for every node, computed the size of its full transitive descendant set (every node reachable by
following `unlocks` edges forward, not just direct children). `load_bearing: true` is set when that count is
at or above a data-driven threshold — the 85th percentile of nonzero descendant counts across the graph,
floored at 8 — which came out to **≥ 42 descendants**. 22 of 193 nodes clear it.

**Top 20 by transitive descendant count:**

| Rank | Descendants | Level | Node | Title |
|---|---|---|---|---|
| 1 | 171 | 1 | `math.arithmetic.counting` | Counting |
| 2 | 170 | 2 | `math.arithmetic.place-value` | Place Value |
| 3 | 160 | 2 | `math.arithmetic.addition-basic` | Addition of Whole Numbers |
| 4 | 139 | 2 | `math.arithmetic.multiplication-as-repeated-addition` | Multiplication as Repeated Addition |
| 5 | 124 | 3 | `math.arithmetic.multiplication-tables` | Multiplication Facts and Tables |
| 6 | 116 | 3 | `math.arithmetic.division-as-equal-sharing` | Division as Equal Sharing (Partitive) |
| 7 | 96 | 4 | `math.arithmetic.division-with-remainder` | Division with Remainders |
| 8 | 87 | 2 | `math.arithmetic.addition-regrouping` | Addition with Regrouping (Carrying) |
| 9 | 84 | 4 | `math.arithmetic.multiplication-multidigit` | Multi-Digit Multiplication |
| 10 | 70 | 4 | `math.arithmetic.unit-fractions` | Unit Fractions |
| 11 | 69 | 2 | `math.arithmetic.number-comparison` | Comparing and Ordering Numbers |
| 12 | 61 | 4 | `math.arithmetic.fraction-as-part-whole` | Fractions as Part of a Whole |
| 13 | 59 | 2 | `math.arithmetic.number-line` | The Number Line |
| 14 | 57 | 4 | `math.arithmetic.factors-and-multiples` | Factors and Multiples |
| 15 | 57 | 2 | `math.arithmetic.subtraction-basic` | Subtraction of Whole Numbers |
| 16 | 54 | 3 | `math.arithmetic.negative-numbers-intro` | Negative Numbers |
| 17 | 51 | 1 | `math.geometry.point-line-plane` | Points, Lines, and Planes |
| 18 | 49 | 4 | `math.arithmetic.long-division` | Long Division |
| 19 | 44 | 4 | `math.arithmetic.equivalent-fractions` | Equivalent Fractions |
| 20 | 43 | 4 | `math.arithmetic.order-of-operations` | Order of Operations (BODMAS) |

**How to read this list honestly, not just report it:** raw descendant count is dominated by distance from
a root — the first eight arithmetic nodes here are, almost by definition, ancestors of nearly everything,
because they *are* the trunk of the tree. That is a real property, not a bug, and it matches this project's
own doctrine ("place value... carries enormous downstream weight" — `.claude/agents/ganitatva-curriculum.md`).
But it means this ranking, taken alone, would systematically hide load-bearing nodes that sit a little
further from the root inside a *specific* track. Two worth surfacing that raw rank obscures:

- **`math.prealgebra.patterns-sequences` (43 descendants) and `math.prealgebra.variable-as-placeholder`
  (42) are load-bearing; `math.prealgebra.variable-as-quantity` (41) is not** — one node under the
  threshold. These three sit in a near-linear chain (each is the sole prerequisite path to the next), so
  their descendant sets differ by almost nothing. Treat this trio as a single fracture zone deserving equal
  investment (see `00-track-maps.md` §5.3) rather than reading the 42-vs-41 split as meaningful — it isn't;
  it's an artifact of exactly where an arbitrary percentile cutoff happened to fall inside one tight cluster.
- **`math.algebra.function-as-machine` has only 9 descendants** — nowhere near load-bearing by this metric —
  despite being one of the four doctrine-named fracture points. This is the clearest evidence that
  "load-bearing" (structural) and "fracture point" (pedagogical) are different measurements; see
  `00-track-maps.md` §5.5 for the full argument. Function-as-machine's low count is real and explicable: most
  of algebra's actual bulk (polynomials, factoring, quadratics) branches off `algebraic-expressions`
  directly, not through the function abstraction, so relatively few *graph* nodes sit downstream of it even
  though the *concept* is foundational to everything function-shaped later (Phase 5 calculus, Phase 6
  physics — both out of this graph's current scope, which further depresses this count relative to its true
  importance).

**Outside arithmetic**, the highest load-bearing node in each track (by raw descendant count): geometry's
`point-line-plane` (51, a track root, structurally identical in role to `counting`); pre-algebra's
`patterns-sequences` (43); algebra's `polynomial-vocabulary` (13 — algebra branches wide rather than deep,
so no single algebra node dominates the way arithmetic's trunk does); trigonometry's `unit-circle-intro`
(14); statistics' `probability-as-likelihood` (9). None of the geometry/trig/statistics tracks clear the
graph-wide 42-descendant threshold on their own — expected, since those tracks are structurally "leaves" of
the whole-graph tree (nothing outside math depends on them yet, and the graph currently stops at Class 10
content), not because they are less important within their own track.

---

## 3. Longest prerequisite chains — and whether they can be flattened

**Method:** for each node, the longest path (in node count) from any root to that node, computed via
dynamic programming over a topological order (`raw_depth[n] = 1 + max(raw_depth[p] for p in prereqs(n))`,
1 for a root). This is the same recurrence used for the schema's `level` field, just not compressed into
1-10 (see §5 for why levels are compressed and depths are not).

**The 15 longest chains in the graph, by node count (deepest first):**

| Length | Terminal node |
|---|---|
| 19 | `math.algebra.quadratic-formula` |
| 19 | `math.algebra.solving-rational-equations` |
| 18 | `math.algebra.difference-of-squares` |
| 18 | `math.algebra.quadratic-equations-factoring` |
| 18 | `math.algebra.simplifying-rational-expressions` |
| 18 | `math.trigonometry.amplitude-period-phase` |
| 17 | `math.algebra.compound-inequalities` |
| 17 | `math.algebra.factoring-trinomials` |
| 17 | `math.algebra.parabola-graphing` |
| 17 | `math.algebra.rational-expressions-intro` |
| 17 | `math.algebra.systems-of-equations-elimination` |
| 17 | `math.trigonometry.graphing-sine-cosine` |
| 17 | `math.trigonometry.law-of-cosines` |
| 17 | `math.trigonometry.trig-applications` |
| 16 | `math.algebra.factoring-gcf` |

**Assessment — most of this depth is real, not an artifact.** The role definition's own guardrail says to
prefer shallow-wide graphs because "a 9-deep prerequisite chain means 9 chances to lose someone," and a
19-step chain looks, at first glance, like a direct violation of that. Tracing the actual chain to
`quadratic-formula` —

```
counting → place-value → addition-basic → multiplication-as-repeated-addition →
division-as-equal-sharing → division-with-remainder → long-division → order-of-operations →
variable-as-placeholder → variable-as-quantity → algebraic-expressions → like-terms →
combining-like-terms → adding-subtracting-polynomials → multiplying-polynomials → factoring-gcf →
factoring-trinomials → quadratic-equations-factoring → quadratic-formula
```

— it splits cleanly into two eras, each individually well justified: eight genuinely sequential arithmetic
steps (Class 1-5 material — each step is procedurally required by the next, not a stylistic choice), then
eleven genuinely sequential algebra steps (Class 8-10 material, standard factor-before-formula sequencing).
Every edge along this specific chain passes the "incoherent without it" test individually. **The 9-deep
guardrail is best read as a warning against padding a *single, local* concept with unnecessary intermediate
steps, not as a claim that the entire K-10 curriculum's terminal, most-advanced content must be reachable in
9 hops from `counting` — that would require cutting real content, not simplifying pedagogy.** The same
pattern holds for the trigonometry chains (`amplitude-period-phase`, `graphing-sine-cosine`,
`law-of-cosines`) — they inherit the *full* algebra function-graphing spine because periodic functions
genuinely are functions, plus geometry's similarity chain because trig ratios genuinely depend on
similarity (`00-track-maps.md` §8). Removing that inheritance would misrepresent the mathematics, not
streamline it.

**Where an audit found a real problem, it was fixed rather than just noted:** every chain above 12 deep was
checked edge-by-edge against the incoherent-vs-unfamiliar test. One edge failed it —
`fraction-decimal-conversion` originally required `fraction-simplification`, but converting *any* fraction
to a decimal is long division of numerator by denominator; simplifying first makes the arithmetic tidier in
examples, it does not make the conversion *coherent*. That edge was replaced with `long-division` (the
actual mechanism) before this graph was finalized. Effect: `fraction-decimal-conversion`'s depth dropped
from 13 to 8, and `percentage-intro`'s dropped from 13 to 10 (`percentage-intro` sits directly on top of
`fraction-decimal-conversion`). This is the one structural correction this analysis pass produced; the graph
file already reflects it.

**Remaining flattening opportunities, considered and rejected:** several other deep chains were checked for
the same failure pattern (`decimal-division`, `one-step-equations`, `right-triangle-ratios`, `percentage-of-a-quantity`)
and each edge held up — e.g. `right-triangle-ratios` depends on `similarity-criteria` (not just the
unit-circle chain) because the reason a right triangle's side ratios are a fixed function of its angle *at
all*, independent of triangle size, **is** similarity; dropping that prerequisite would make the concept
"work" proceduraly while hiding why it's true, which is exactly the kind of notation-without-understanding
gap this project exists to close. No further edges were cut.

---

## 4. The fractions sub-graph (Phase 1's vertical slice)

18 nodes (17 in `math.arithmetic.*`, plus one node in `math.algebra.*` that consumes it downstream). Full
sub-graph:

| Node | Level | Depth | Descendants | Load-bearing | Prerequisites |
|---|---|---|---|---|---|
| `unit-fractions` | 4 | 6 | **70** | **yes** | `division-as-equal-sharing` |
| `division-as-measuring` | 3 | 5 | 1 | no | `multiplication-as-repeated-addition` |
| `fraction-as-part-whole` | 4 | 7 | **61** | **yes** | `unit-fractions` |
| `decimals-intro` | 4 | 7 | 10 | no | `place-value`, `unit-fractions` |
| `equivalent-fractions` | 4 | 8 | **44** | **yes** | `fraction-as-part-whole`, `factors-and-multiples` |
| `mixed-numbers` | 4 | 8 | 1 | no | `fraction-as-part-whole`, `division-with-remainder` |
| `fraction-addition-like-denominators` | 4 | 8 | 4 | no | `fraction-as-part-whole` |
| `fraction-of-a-quantity` | 4 | 8 | 6 | no | `fraction-as-part-whole`, `multiplication-multidigit` |
| `fraction-decimal-conversion` | 4 | 8 | 3 | no | `decimals-intro`, `long-division` |
| `fractions-on-number-line` | 4 | 8 | 2 | no | `fraction-as-part-whole`, `number-line` |
| `improper-fractions` | 5 | 9 | 0 | no | `mixed-numbers` |
| `comparing-fractions` | 5 | 9 | 0 | no | `equivalent-fractions`, `fractions-on-number-line` |
| `fraction-multiplication` | 5 | 9 | 3 | no | `fraction-of-a-quantity`, `equivalent-fractions` |
| `fraction-addition-unlike-denominators` | 6 | 11 | 3 | no | `fraction-addition-like-denominators`, `lcm` |
| `fraction-simplification` | 6 | 11 | 3 | no | `equivalent-fractions`, `gcd` |
| `fraction-division` | 6 | 10 | 0 | no | `fraction-multiplication`, `division-as-measuring`, `fractions-on-number-line` |
| `fraction-subtraction` | 6 | 12 | 0 | no | `fraction-addition-unlike-denominators` |
| `linear-equations-with-fractions` (algebra) | 8 | 16 | 1 | no | `linear-equations-one-variable`, `fraction-addition-unlike-denominators` |

(All ids under `math.arithmetic.*` except the last row. "Depth" is the raw longest-chain depth from §3;
"Level" is the schema-compressed 1-10 field — see §5.)

**Reading the sub-graph:**

- **The spine is `unit-fractions → fraction-as-part-whole → equivalent-fractions`.** These are also,
  unsurprisingly, the three load-bearing nodes in the sub-graph — everything else in the fractions arc
  (comparison, simplification, mixed numbers, every arithmetic operation on fractions, decimals, ratio,
  percentage) sits downstream of this three-node spine. Get these three right and nearly the entire
  arithmetic track's second half follows; get them wrong and everything downstream inherits the error. This
  is the graph's own confirmation of `docs/research/02-fractions-evidence.md`'s "whole-number bias" framing:
  the spine's entire job is building a fraction as *one magnitude*, not two stacked whole numbers, before
  any operation touches it.
- **`division-as-measuring` is a deliberate late addition** (`00-track-maps.md` §6.1) sitting as a *sibling*
  to `division-as-equal-sharing`, not a descendant of it — both meanings of whole-number division are built
  independently on `multiplication-as-repeated-addition`, and only the measurement meaning feeds
  `fraction-division`. This is the graph encoding a specific pedagogical claim: the sharing model of division
  has no coherent answer for "divide by one-half," while the measuring model does ("how many halves fit into
  this"), which is *why* fraction division is learnable rather than a rule to memorize.
- **`fractions-on-number-line` is a second, later addition** (`00-track-maps.md` §6.2), sitting between
  `fraction-as-part-whole` and both `comparing-fractions` and `fraction-division`. It exists to hold the
  specific idea `fraction-as-part-whole` does not: a fraction as *one magnitude with a position*, not a
  part-whole relationship. Its addition was itself evidence-driven — before it existed, `comparing-fractions`
  pointed at the plain whole-number `number-line` node, which cannot actually represent where 3/4 sits
  relative to 1/2. That mismatch was the tell that a node was missing, not just that an edge needed
  re-pointing.
- **`fraction-division` is a leaf node (0 descendants) in this graph's current scope.** That is worth stating
  plainly rather than glossing over: nothing later in the Class 6-10 graph formally requires having divided a
  fraction by a fraction. That doesn't make the concept unimportant — it is Phase 1's entire gate — it means
  its importance is pedagogical and real-world (the single hardest "ohh, that's all it was" moment the
  vision doc names explicitly) rather than structural (unlocking later coursework). Structural load-bearing
  and pedagogical priority diverge here exactly as they do for `function-as-machine` (§2) — a second instance
  of the same general point, not a coincidence.
- **`comparing-fractions` and `improper-fractions` are also leaves.** Both are genuinely terminal
  skills at this graph's scope (nothing currently modeled formally requires comparing two fractions or
  converting an improper fraction, as opposed to *using* the equivalent-fractions and mixed-number machinery
  those two skills are built from). Not a gap — a correct reflection of where terminal, examinable skills
  sit versus where a concept is itself infrastructure for something else.
- **One cross-track consumer:** `math.algebra.linear-equations-with-fractions` is the only node outside
  arithmetic that reaches directly into this sub-graph (via `fraction-addition-unlike-denominators`), which
  then feeds the `solving-rational-equations` chain — one of the two 19-deep chains in §3. Fractional
  arithmetic fluency is a real, direct prerequisite for solving equations with fractional coefficients, not
  merely "useful practice."

---

## 5. Why `level` is a compressed tier, not the raw chain depth

The schema (`content/schema/concept.schema.json`) caps `level` at 1-10, but this graph's longest chains run
to depth 19 (§3). A hard clamp (`min(depth, 10)`) would have collapsed roughly half the graph's nodes —
everything past depth 10 — into an undifferentiated `level: 10`, destroying exactly the ordering information
`level` exists to carry. Instead, `level` is a **proportional rescale** of raw depth into the 1-10 range
(`level = round(1 + (depth-1)/(max_depth-1) * 9)`), which is provably monotonic — a prerequisite's `level` is
never greater than its dependent's, verified for every edge in the graph — while still spreading nodes across
the full 1-10 range instead of piling up at the ceiling. Anyone building the path engine or spaced-repetition
weighting on top of this graph (Phase 2) should treat `level` as a coarse difficulty/sequencing tier for UI
and scheduling purposes, and use the graph's actual edges — not the `level` numbers — for anything that needs
true dependency depth.

---

## 6. Summary

- 193 nodes, verified genuine DAG (no cycles, no orphan references, `unlocks` consistent with
  `prerequisites`) by two independent scripts.
- Load-bearing ranking is real but root-dominated by construction; read alongside the four doctrine fracture
  points (`00-track-maps.md` §5), which are a different and complementary signal.
- The graph's longest chains (16-19 deep) are mostly genuine curriculum depth, not accidental
  over-linearization; one genuine over-constraint was found and fixed during this analysis
  (`fraction-decimal-conversion`).
- The fractions sub-graph's spine (`unit-fractions → fraction-as-part-whole → equivalent-fractions`, plus
  `fractions-on-number-line` added in a second coordination round to carry the magnitude/position model
  those first three don't) carries almost the entire arithmetic track's second half; `fraction-division`
  itself is structurally a leaf, and its importance is pedagogical rather than load-bearing — the clearest
  demonstration in this graph that the two are not the same measurement.
- Two rounds of cross-agent coordination on the fractions sub-graph are both fully resolved: one node
  accepted and added on each round (`division-as-measuring`, `fractions-on-number-line`), one proposed edge
  set declined with reasoning recorded (`fraction-division` → ratio/rate/unit-conversion) — see
  `00-track-maps.md` §6.
