# Other Fracture Points: Negative Numbers, Variables, Functions

Brief coverage of documented misconceptions and evidence-backed interventions for three concepts beyond
fractions — negative numbers (near-term, arithmetic phase), variables and functions (pre-algebra/algebra,
Phase 3). Not full teardowns; enough to inform sequencing decisions when these phases are planned in detail.

Labeling: **VERIFIED** = stated fact with source URL. **INFERENCE** = my reasoning.

---

## Negative numbers

**VERIFIED — two distinct, well-documented misconceptions about the number line itself, not just about
arithmetic with negatives:**
1. **Split-ray misconception:** students mentally treat the number line as two separate rays (one for
   positives, one for negatives) that they align inconsistently depending on context, rather than as one
   continuous line.
2. **Amalgamated-translation misconception:** students construct the negative portion of the number line by
   mentally "translating" positive intervals rather than understanding negative numbers as a coherent
   extension of the same magnitude scale.
[ResearchGate, locating negative decimals on the number line](https://www.researchgate.net/publication/238071240_Locating_negative_decimals_on_the_number_line_Insights_into_the_thinking_of_pre-service_primary_teachers)
— note this specific study is about **pre-service teachers**, not children, which is itself a useful/alarming
data point: the adults who will teach this concept often hold the same misconceptions.

**VERIFIED — sign-specific errors:**
- **Pseudo-understanding:** a student places a number in roughly the correct position on the number line but
  omits or ignores the minus sign — i.e., magnitude sense exists somewhat independent of sign sense.
- **Unary misinterpretation:** confusing the negative sign's role as "subtract" (binary operator) vs.
  "negative" (unary/identity marker on the number itself) — e.g., not understanding why "flipping" a sign is
  different operationally from subtracting.
[ERIC EJ1124790, difficulties understanding negative numbers](https://files.eric.ed.gov/fulltext/EJ1124790.pdf)

**VERIFIED — downstream impact:** Incorrect negative-sign knowledge is documented as predictive of the
*types* of errors students make in algebra, and is inversely correlated with procedural correctness broadly
— i.e., this is not a self-contained arithmetic-unit problem, it's a leading indicator for algebra
difficulty. (Search summary, ERIC EJ1124790 and related sources.)

**VERIFIED, and directly relevant to widget design — a genuine caution against over-relying on the number
line for negatives specifically:** At least one strand of this research explicitly argues the number line
"may not be fit for early teaching of operations involving negative numbers" and that negative-number
teaching must extend to fractions/decimals, not stop at integers.
[Cambridge Maths Espresso 15](https://www.cambridgemaths.org/Images/espresso_15_introducing_negative_numbers.pdf)

**INFERENCE — tension with the fractions findings above:** This is worth flagging as a direct internal
tension in the research base, not smoothed over: for fractions, the evidence favors the number line as the
primary representation; for negative numbers, at least one credible source argues the number line alone is
*not* sufficient and can itself produce the split-ray/amalgamation misconceptions documented above. The
resolution is likely that the number line needs to be introduced for negatives through an *operation-based*
lens (e.g., temperature change, elevation, a thermometer or an owed-money model showing movement in two
directions) rather than a static "here's where -3 sits" labeling exercise — but this is my synthesis, not a
directly verified prescription, and should be treated as a hypothesis to test in Ganitatva's own design
process, not an established best practice.

**What this means for Ganitatva:** Do not treat "put it on the number line" as a universal safe default
for every concept just because it worked well for fractions. Negative numbers need their own concept-
specific Intuition-layer design (context-embedded, directional movement — e.g., debt/temperature/elevation
— rather than abstract labeling), and this phase should budget explicit design-testing time rather than
assuming the fractions widget pattern transfers unchanged.

---

## Variables

**VERIFIED — foundational taxonomy, Kieran (1980, 1992):** Students hold at least three distinct, documented
misreadings of what a letter/variable represents:
1. Ignoring the variable entirely (treating an expression as if the letter weren't there).
2. Assigning it an arbitrary/random fixed value rather than treating it as general.
3. Treating it as a **label for a concrete object** rather than a number — e.g., reading "g" in an
   expression as standing for "grams" (the object/unit) rather than as a number of grams.
[ERIC ED295804, Rosnick](https://files.eric.ed.gov/fulltext/ED295804.pdf),
(search summary synthesizing Kieran 1980/1992 as cited across multiple sources)

**VERIFIED — the unknown vs. generalized-number distinction, with a specific quantified result:** Research
distinguishing whether students can use a letter as a *specific unknown* (solve for it) versus as a
*generalized number* (reason about it as varying/general) found most students **can** do this in at least
one tested context (80.8% in one context, 69.2% in another; only 7.7% failed entirely in the easier
context) — i.e., the unknown/generalized-number distinction is learnable and mostly learned, but not
universally, and success is context-dependent rather than a fixed competence.
(Search summary of the "students' understanding of the variable as general number" EUDML source.)

**VERIFIED — theoretical framing for why this is hard at all:** The abstractness of algebra itself hinders
students from constructing stable "object representations" of what a variable even is — i.e., part of the
difficulty is that a variable doesn't correspond to a single fixed real-world referent the way a number
does, which is cognitively unusual for a learner whose entire prior mathematical experience has been about
specific, fixed quantities. (Kieran 1992, cross-referenced via multiple secondary sources.)

**What this means for Ganitatva:** The "letter as a label for an object" misconception (g = grams, not "a
number of grams") is the single most actionable, concretely-testable target for a variables Intuition-layer
widget — the widget should make the letter visibly and manipulably *stand for a changing quantity*
(e.g., a box/container whose contents can be filled to different amounts, with the letter as the label on
the box, not the box itself) rather than a static algebra-tile square. The plan's "balance-scale equations"
approach (Phase 3) is a reasonable design for the *unknown* interpretation (solve for the fixed but unknown
weight) but does not, on its own, teach the *generalized-number* interpretation (a quantity that varies) —
these likely need two separate widget experiences, not one widget doing double duty, given they are
documented as distinct cognitive achievements.

---

## Functions

**VERIFIED — foundational source, Leinhardt, Zaslavsky & Stein (1990), still the field's primary review:**
Reviews interpretation and construction tasks across the three core representations of a function
(algebraic/symbolic, tabular, graphical) and the specific misconceptions/intuitions at each.
[Sage Journals abstract](https://journals.sagepub.com/doi/abs/10.3102/00346543060001001)

**VERIFIED — specific, recurring documented misconceptions:**
- **Illegitimate connecting of points:** students draw continuous line segments connecting plotted points
  even when the function is only defined at discrete points (e.g., treating a scatter of integer inputs as
  if it must be a continuous curve).
- **Overgeneralized "two-variable" belief:** students believe every function must be expressible with both
  an x and a y variable in an explicit equation, which breaks down for functions given as graphs, tables, or
  verbal rules without an algebraic form.
- **Continuity-equals-function belief:** students believe any continuous graph must represent a function and
  any discontinuous graph cannot — conflating the vertical-line-test definition with a visual continuity
  heuristic.
(Search summary synthesizing multiple sources citing Leinhardt/Zaslavsky/Stein 1990 as the origin, still
cited as current in more recent papers, e.g., ETS Research Report Series 2019 learning-progression work.)

**VERIFIED — persists into undergraduate level:** The same categories of misconception (confusion about the
formal definition, misuse/misunderstanding of function notation, weak connections between representations)
are documented as persisting among undergraduate students, not just K-12 learners — i.e., this is not a
"kids just need more practice" problem that resolves with age/exposure alone; it reflects a genuinely
difficult conceptual leap. (Search summary, multiple sources on undergraduate function misconceptions.)

**What this means for Ganitatva:** Functions is the concept area with the strongest documented evidence that
**representation-switching itself** (not any single representation) is the actual skill being tested and
most often missing — students can often work within one representation (a table, or a graph) but fail to
connect what changes in one to what changes in another. This argues for a functions widget whose core
manipulation is explicitly **multi-representational and synchronized** — e.g., dragging a point on a graph
that simultaneously updates a table row and an algebraic expression live, all three visible and linked at
once — rather than three separate widgets for graph/table/formula taught in sequence. This is a specific,
actionable design implication distinct from what fractions or variables need, and should be captured in the
Phase 5 (`CalculusZoom`) and earlier function-introduction widget specs now, before those widgets are
designed independently by different agents/phases.

---

## What this means for Ganitatva (cross-cutting)

1. **Do not assume one widget-design pattern generalizes across concepts.** Fractions favors number-line-
   after-area-model sequencing; negative numbers may need the number line to be secondary to an
   operation/context-based intuition; variables need to distinguish unknown vs. generalized-number as
   separate experiences; functions need synchronized multi-representation manipulation as the core
   mechanic, not sequential single-representation widgets. This has a direct implication for
   `docs/02-PLAN.md`'s Phase 2 "widget kit: 8-10 primitives" — the kit needs to be validated against each
   concept's *specific* documented misconception, not designed as a generic toolbox and then reused
   wherever convenient.
2. **The negative-numbers finding that pre-service teachers themselves hold the split-ray/amalgamation
   misconceptions** is a useful reminder that Ganitatva's content-authoring process (Phase 2's "a person who
   cannot write Dart authors a complete concept... using only the authoring guide") cannot assume the human
   author has a correct mental model of the concept either — the authoring guide likely needs a
   misconception checklist per concept, not just a template for widget/content structure.
3. Across all three concepts, the misconceptions are well-documented and long-standing (Kieran 1980,
   Leinhardt/Zaslavsky 1990) but the *interventions* are comparatively much less rigorously evidenced than
   the fractions literature — flagging this honestly as **widely characterized, weakly intervention-tested**
   for variables and functions specifically. Phase 3/4 planning should expect to do more original pedagogical
   design work (and more testing) for these concepts than fractions, where the research essentially hands
   Ganitatva the answer (measurement division).
