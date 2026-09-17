# Fractions: Misconceptions and Efficacy Evidence

Phase 1's vertical slice is fractions. This document covers documented misconceptions, the
number-line-vs-area-model debate, the measurement/quotitive interpretation of division, why "flip and
multiply" persists despite being poor pedagogy, and — because Ganitatva's entire method rests on it — the
actual evidence quality behind "manipulable widgets teach better."

Labeling: **VERIFIED** = stated fact with source URL. **INFERENCE** = my reasoning. Where evidence is thin,
flagged explicitly as "widely claimed but weakly evidenced" per instructions.

---

## 1. Documented misconceptions in fractions

**VERIFIED, foundational source — Siegler & Lortie-Forgues (Hard Lessons, 2017; and Lortie-Forgues, Tian &
Siegler 2015):** The core, root-cause misconception across nearly all fraction errors is **whole-number
bias** — students apply the logic that governs whole-number magnitude and arithmetic directly to fractions,
where it produces systematically wrong answers.
[Siegler/Lortie-Forgues 2015 PDF](https://siegler.tc.columbia.edu/wp-content/uploads/2019/02/2015-Siegler-Lortie-Forgues.pdf),
[Hard Lessons, 2017](https://journals.sagepub.com/doi/abs/10.1177/0963721417700129)

Concrete instances of whole-number bias, **VERIFIED** from the same research program:
- **Magnitude misjudgment:** a student judges 1/8 > 1/4 "because 8 is bigger than 4" — correct logic for
  whole numbers, wrong for fractions. (Search summary of Siegler/Lortie-Forgues research program.)
- **Componentwise arithmetic:** adding fractions by adding numerators and denominators straight across
  (e.g., 1/2 + 1/3 = 2/5) — treating the fraction as two independent whole numbers rather than one
  magnitude. (Search summary, same source; also documented in
  [Mao, Sutherland & Fainstein, 2026, SAGE](https://journals.sagepub.com/doi/10.1177/10534512261446611).)
- **INFERENCE, connecting to root cause:** Both errors share one mechanism — the student has not built a
  mental model of a fraction *as a single number with a magnitude* (a point on a number line), only as
  "two whole numbers stacked" (a notation to be manipulated by whole-number rules). This is the central
  target Ganitatva's Intuition layer needs to hit for fractions specifically.

**Widely claimed but weakly evidenced, flagging explicitly:** Popular teaching-resource sites (Mathnasium
and similar) list many other "common misconceptions" (e.g., confusing numerator/denominator roles,
believing a larger denominator always means a larger fraction, difficulty with equivalent fractions) that
are pedagogically plausible and consistent with whole-number bias but are sourced to practitioner blogs
rather than to peer-reviewed studies in the searches performed. Treat these as reasonable secondary symptoms
of whole-number bias, not as independently established phenomena.

---

## 2. Number line vs. area model (pie chart) — the evidence, not just the "debate"

This is not actually a live, contested debate in the recent research literature the way popular framing
suggests — the evidence has a fairly clear direction, with an important nuance about *what each
representation is good for*.

**VERIFIED — number-line advantage for magnitude/comparison:**
- Gunderson et al. found students trained on a number line to represent fraction magnitude outperformed
  students trained on circular area models on a later, symbols-only fraction-comparison task.
  [Gunderson et al., JECP](https://siegler.tc.columbia.edu/wp-content/uploads/2019/12/Gunderson-et-al-2019-JECP.pdf)
- At-risk 4th graders taught with a number-line-focused curriculum outperformed those taught with an
  area-model-focused curriculum. (Search summary, same research program.)
- Number lines, but not area models, were found to support both accuracy *and* correct conceptual models
  specifically for **fraction division**. [ScienceDirect, Number lines support fraction division](https://www.sciencedirect.com/science/article/abs/pii/S0361476X18305290)
  This is directly relevant to Ganitatva's Phase 1 gate (3/4 ÷ 1/2).
- **Theoretical mechanism, VERIFIED as the researchers' stated rationale:** the number line is the target
  mature mental representation — it's a unidimensional magnitude scale that directly extends the
  whole-number line children already have, so training on it builds the *correct* end-state representation
  directly, rather than requiring a later re-representation step. This is the "integrated theory of
  numerical development" framework. [Temple University summary PDF](https://sites.temple.edu/cognitionlearning/files/2017/05/Hamdan-Gunderson-2017.pdf)

**VERIFIED — where area models are actually better:**
- Area/region models (fraction circles, shaded shapes) are specifically better for building **part-whole
  understanding and equal partitioning** — i.e., the *concept* of what a fraction even means (cutting a
  whole into equal parts) — which is a different job than representing magnitude/comparison.
  (Search summary, cross-referencing Siegler research program summaries.)
- **VERIFIED, current US practice:** Common Core introduces fractions via area models in grades 1-2, with
  number lines introduced only later — i.e., current mainstream US curriculum sequencing is arguably
  backwards relative to what the magnitude/comparison evidence supports, though it may be defensible for
  the separate job of building part-whole *concept* formation first. (Search summary of EdWeek 2013
  coverage of federal research on this exact tension.)

**INFERENCE — resolving the "debate" for Ganitatva's design:** This is not "number line good, area model
bad." It's two tools for two different jobs: **area/region models for concept formation (what IS a
fraction — equal parts of a whole)**, then **number lines for magnitude, comparison, and operations
(how BIG is it, how does it compare, what happens when you act on it)**. Ganitatva's plan already names
three widgets for fractions — `FractionBar`, `NumberLine`, `AreaModel` — which is structurally correct
per this evidence, provided the *sequencing* follows concept-first (bar/area) then magnitude-and-operations
(number line), not an arbitrary rotation between the three.

---

## 3. Measurement (quotitive) division — this is the load-bearing concept for the Phase 1 gate

**VERIFIED — the two interpretations of division, and why they matter for fractions specifically:**
Division has two distinct real-world interpretations that happen to give identical answers for whole
numbers but diverge sharply in how intuitive they are for fraction division:
- **Partitive ("sharing") division** — "share 12 into 4 groups; how big is each group?" This is the
  interpretation most children learn first, and it maps naturally to whole-number division, but it becomes
  deeply unintuitive when the divisor is a fraction ("share 3/4 into 1/2 of a group" is a nonsensical
  sentence).
- **Measurement/quotitive ("how many fit") division** — "how many groups of 1/2 fit into 3/4?" This
  interpretation remains fully sensible and intuitive for fraction divisors.
  [Wikipedia: Quotition and partition](https://en.wikipedia.org/wiki/Quotition_and_partition),
  [Great Minds / Eureka Math explainer](https://greatminds.org/math/blog/eureka/fractional-division-interpretation-what-is-the-difference-between-partitive-and-measurement)

**VERIFIED — this is precisely the answer to the plan's stated hardest problem ("why does dividing by 1/2
make it bigger?"):** Under the measurement interpretation, "8 ÷ 1/2" is literally the question "how many
halves fit into 8?" — and the intuitive, concrete answer (16) requires no algorithm at all, just counting.
The generalizable version: "how many half-dollar coins fit into $100?" → 200 — a real-world framing that
makes the "gets bigger" result obvious rather than paradoxical. (Search summary synthesizing Math Doctors,
Quora explainer threads, and the measurement-division literature above — this specific real-world framing
is **INFERENCE-adjacent synthesis of verified sources**, not a direct quote from a single study, but the
underlying mechanism (measurement division reframes "bigger" as "more small pieces fit") is verified.)

**VERIFIED — connection to "flip and multiply":** Fraction-division pedagogy research explicitly links the
standard algorithm to the *partitive* interpretation, not the measurement one: "the partitive interpretation
of division has a direct connection to the invert-and-multiply rule, and students fluent with partitive
division can intuitively notice this direct connection."
[Corwin Connect, "Rethinking Fraction Division"](https://corwin-connect.com/2014/07/rethinking-fraction-division-one-hardest-topics-teach-learn/)
The recommended alternative sequence: build measurement-division understanding first (concrete, intuitive,
answers "why bigger?"), then let students **derive their own shortcut/algorithm from repeated measurement-
division problems**, arriving at invert-and-multiply as a discovered pattern rather than a delivered rule.
[Langford Math](https://langfordmath.com/M247/2014/MeasDivMakeUp.html),
[Corwin Connect](https://corwin-connect.com/2014/07/rethinking-fraction-division-one-hardest-topics-teach-learn/)

**This maps directly and cleanly onto Ganitatva's own six-layer doctrine** — Intuition (measurement
framing, concrete, zero symbols) → Manipulate (a widget where the learner literally counts how many 1/2s
fit into 3/4 using a manipulable bar or number line) → Formalize (only now introduce invert-and-multiply,
framed as "the shortcut for what you just did by counting"). This is strong, specific, actionable
validation of the plan's approach for this exact concept — not a generic endorsement.

---

## 4. Why "flip and multiply" is taught despite being pedagogically poor

**VERIFIED:** The dominant critique across math-education sources is that the rule is taught as an
unexplained mnemonic ("keep, change, flip" / "same, change, flip") that students memorize and apply
correctly while having no model of *why* it works — described by multiple sources as "mostly meaningless"
procedurally-correct performance.
[gfletchy.com](https://gfletchy.com/2016/08/02/making-sense-of-invert-and-multiply/),
[Math Doctors](https://www.themathdoctors.org/dividing-fractions-why-invert-and-multiply/)

**INFERENCE — why it persists anyway, despite this well-known critique:** No single study directly answers
"why do teachers keep teaching it this way," but the structural incentives are inferable from the broader
evidence gathered: (1) it is fast to teach and fast to grade — procedural fluency is testable with a
worksheet, conceptual understanding is not; (2) building the measurement-division intuition properly takes
real class time that standardized-test-driven curricula under time pressure often don't budget for;
(3) NCTM and math-ed researchers have been recommending the "derive it yourself" alternative for years
(the Corwin Connect and NCTM sources above are both practitioner-facing, i.e., aimed at teachers who
already want to do better) — suggesting the gap is not lack of known-better pedagogy but a
time/incentive/curriculum-coverage constraint that classroom teachers face and that **does not bind
Ganitatva**, which has no test-coverage pressure, no class period limits, and no requirement to move on
before mastery. This is a genuine structural advantage Ganitatva has over classroom teaching for this
specific concept, worth naming explicitly.

---

## 5. Manipulatives: how strong is the evidence, really? (Critical for the thesis itself)

This section is the most important gate-check in this document, because it examines evidence for the
premise the entire product is built on, not just a downstream pedagogical choice within it.

**VERIFIED — Carbonneau, Marley & Selig meta-analysis (2013), the primary large-scale study found:**
55 studies, N=7,237, K-college, comparing manipulatives-based instruction to abstract-symbols-only
instruction. Result: **statistically significant, but only small-to-moderate effect sizes** in favor of
manipulatives — not a large or overwhelming effect.
[ASU/Semantic Scholar summary](https://www.semanticscholar.org/paper/A-meta-analysis-of-the-efficacy-of-teaching-with-Carbonneau-Marley/a12dde2dadd78449bdcbf1e44439230b1d6ce26d),
[ERIC EJ1007941](https://eric.ed.gov/?id=EJ1007941)

**VERIFIED — the effect is heavily moderated, not uniform:** The Carbonneau meta-analysis explicitly found
the manipulatives-benefit relationship is **moderated by instructional and methodological quality** — i.e.,
*how* manipulatives are used matters as much as *whether* they're used. Younger children benefited more from
physical manipulatives than older students. (Same sources.)

**VERIFIED — virtual manipulatives specifically have thinner evidence than physical ones:** Moyer-Packenham
& Westenskow (2013) found a "moderate effect" of virtual manipulatives vs. other instructional treatments,
but the searches performed found this described as "limited research" relative to the much larger physical-
manipulatives literature. (Search summary, cited via the same review sources.) This matters directly to
Ganitatva, which is 100% virtual/digital manipulatives (Flutter widgets), not physical objects.

**VERIFIED — concreteness fading has stronger, more specific evidence than "manipulatives alone":**
A systematic review (Educational Psychology Review, 2014) and specific studies found the sharpest, most
consistent transfer benefit comes not from manipulatives-as-such but from **concreteness fading** —
deliberately starting concrete and *explicitly, gradually* fading toward abstract symbols within the same
teaching sequence — with fading conditions outperforming both purely-concrete and purely-abstract
conditions on transfer tasks.
[Educational Psychology Review, 2014](https://link.springer.com/article/10.1007/s10648-014-9249-3),
ScienceDirect summaries of the same program.

**VERIFIED — a real, non-trivial criticism exists:** Some researchers argue the concrete/abstract
distinction itself is not as clean as commonly assumed, and that manipulative-based instruction "runs the
risk of eliciting rote manipulation of symbols without conceptual understanding or transfer" if not
carefully designed — i.e., a badly-designed manipulative can produce the exact same shallow,
pattern-matching behavior that symbol-first teaching produces, just with a physical/visual object instead
of a symbol. [The Learning Scientists guest post](https://www.learningscientists.org/blog/2017/4/4-1),
cross-referenced against the concreteness-fading systematic review.

**INFERENCE — what this means, stated plainly because it is a genuine contradiction of the vision doc's
confidence level:** `docs/00-VISION.md` states the manipulable-widget rule "is the entire moat" and implies
near-certainty that touching-before-symbolizing works. The actual evidence supports a real but **modest**
effect (small-to-moderate, not large), **conditional on instructional design quality**, with the strongest
results coming specifically from *fading* (concrete → abstract, explicitly sequenced) rather than from
concrete manipulation alone, and weaker evidence specifically for the *digital/virtual* manipulatives
Ganitatva is actually building versus the *physical* manipulatives most of the underlying research studied.
This does not mean the approach is wrong — the direction of the evidence favors it, and Ganitatva's
Formalize layer (Layer 4, arriving explicitly after Manipulate) already implements concreteness fading
correctly by design, which is good. But the vision doc's certainty ("no concept ships without a widget,"
stated as non-negotiable and as sufficient) should be read as a design commitment and product bet, not as a
claim with strong empirical backing behind the strength of that commitment. **A badly-executed widget is
not automatically better than a well-executed direct explanation** — execution quality is, per the
evidence, at least as important as the concrete/abstract choice itself. This is the single most important
qualifier a reviewer of the vision doc should know.

---

## 6. Practice, mistake diagnosis, and feedback — evidence for Ganitatva's Layer 5

**VERIFIED:** Worked examples are a well-established effective learning method generally. Specifically for
*erroneous* worked examples / mistake diagnosis: **elaborated error feedback** (explaining *why* an error
happened and how to avoid recurrence, or explicitly rejecting the wrong hypothesis) is more effective than
simple right/wrong marking.
[Grosse & Renkl summary, mrbartonmaths.com PDF](https://mrbartonmaths.com/resourcesnew/8.%20Research/Explicit%20Instruction/Worked%20examples%20with%20mistakes.pdf)

**VERIFIED — an important caveat that qualifies Ganitatva's Layer 5 design:** Effects are mixed and
condition-dependent. Error-explanation prompts helped *declarative-conceptual* knowledge when paired with
adaptable feedback, but the same prompts *hindered* practical diagnostic-skill learning in at least one
study. Learners need sufficient prior knowledge/scaffolding to benefit from seeing incorrect examples at
all — simply showing an error is not automatically instructive. Corrective feedback can even be
counterproductive if students can't understand it or if it shifts their focus to "right vs. wrong" instead
of the underlying solving process.
(Search summary synthesizing multiple sources: Springer "Worked examples with errors," PMC 9203230, NSF
PAR 10429504.)

**INFERENCE:** This directly informs the design of Ganitatva's "mistake diagnosis" feature (explicitly named
in the vision doc's Layer 5 as "why it's wrong, not just ✗"). The evidence supports building it, but with
two design constraints the vision doc doesn't currently specify: (1) diagnostic explanations must be
scaffolded to the learner's current level, not a blanket generic explanation, since low-prior-knowledge
learners can be actively hindered by unscaffolded error-explanation; (2) feedback should target the
*process* (why the reasoning went wrong) rather than just flag the *answer* as wrong, since answer-focused
feedback risks shifting attention away from the solving process in exactly the way research warns against.

---

## What this means for Ganitatva

1. **The Phase 1 exit gate concept (why 3/4 ÷ 1/2 = 3/2) is exceptionally well-chosen** — it sits exactly
   at the documented research fault line (partitive vs. measurement division), and the measurement
   interpretation gives a genuinely intuitive, symbol-free path to the "why bigger?" question that the
   standard curriculum systematically avoids teaching. This is the single strongest alignment found between
   the vision/plan and the research literature in this entire investigation. Build the widget around
   **counting how many halves fit**, not around visualizing "flipping" — the flip is the derived shortcut,
   not the intuition.
2. **Sequence FractionBar/AreaModel before NumberLine for concept formation, then NumberLine for magnitude/
   comparison/operations** — this is what the evidence actually supports, not "use all three
   interchangeably." Make this sequencing explicit in the curriculum spec, not left to per-concept author
   discretion.
3. **Directly contradicts the vision doc's certainty level, not its direction:** the manipulable-widget
   thesis is evidence-*aligned* but evidence-*modest* (small-to-moderate effects, quality-dependent, weaker
   specifically for digital manipulatives than physical ones). Recommend softening "this is the entire
   moat" language in `docs/00-VISION.md` to something like "this is the most promising, most defensible bet
   available, contingent on execution quality" — and treating the Phase 1 human exit gate (5 testers,
   4-of-5 can explain it) as the real test of execution quality, since the literature says execution quality
   is what actually determines whether this works, not the concrete-vs-abstract choice alone.
4. Layer 5 (mistake diagnosis) needs a scaffolding rule, not just a diagnosis feature: don't show the same
   depth of "why it's wrong" explanation to every learner regardless of their evident prior understanding —
   the evidence explicitly warns this can hinder rather than help lower-prior-knowledge learners.
