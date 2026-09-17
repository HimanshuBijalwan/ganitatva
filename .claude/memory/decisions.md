# Ganitatva — Decision Log

---
DECISION: Flutter as the single cross-platform framework (ADR-001)
DATE: 2026-09-17
WHY: Only framework that genuinely reaches Android/iOS/macOS/Windows/Linux from one codebase. This app is
     fundamentally a custom-drawing + animation app (number lines, graphs, geometry, abacus), which is
     Flutter's Impeller canvas home turf. AOT performance on low-end Android matters because the mission is
     global reach and the median device is a budget phone.
ALTERNATIVES CONSIDERED: React Native + Expo · Tauri v2 + web UI · Compose Multiplatform
WHY REJECTED: RN — react-native-windows/-macos are a separate, slower ecosystem outside Expo; two apps
     pretending to be one. Tauri — best desktop story and would give a free website, but webview animation
     perf on cheap Android is exactly where our core interaction lives. Compose MP — viable, smaller package
     ecosystem, iOS is the youngest leg.
EXPECTED RESULT: one codebase → 5 platforms; 60fps custom math widgets on budget hardware
ACTUAL RESULT: (pending — validate at Phase 0 exit gate)
REUSABLE LESSON: Pick the cross-platform framework by what the app's HARDEST screen needs, not by
     team familiarity. Here the hardest screen is an animated interactive canvas, which eliminated webview
     options immediately.
STATUS: ✅ CONFIRMED by user 2026-09-17

---
DECISION: Content is DATA (YAML → compiled bundle), never hardcoded Dart (ADR-003)
DATE: 2026-09-17
WHY: Content is ~80% of total project effort. If authoring requires engineering, the project caps out at a
     few dozen concepts. Data also makes i18n a translation problem, enables over-the-air curriculum fixes
     without app-store review, and lets an LLM pipeline draft at volume for human review.
ALTERNATIVES CONSIDERED: hardcoded Dart screens per concept · CMS/headless backend
WHY REJECTED: Hardcoded — doesn't scale past ~50 concepts, blocks translation. CMS — adds a network
     dependency that breaks the offline-first principle.
EXPECTED RESULT: non-engineer authors a shippable concept in < 1 day
REUSABLE LESSON: If adding the Nth unit of content requires writing code, the engine has a bug.
STATUS: ✅ decided

---
DECISION: CI (GitHub Actions) set up in Phase 0, not later
DATE: 2026-09-17
WHY: There is no Windows machine available. GitHub Actions `windows-latest` IS the Windows build machine.
     Deferring CI would mean the Windows target is unverified for months.
EXPECTED RESULT: every push yields downloadable Android/macOS/Windows artifacts
REUSABLE LESSON: When a required target platform has no local hardware, CI stops being infrastructure
     hygiene and becomes a functional dependency. Schedule it accordingly.
STATUS: ✅ decided

---
DECISION: North Star = CGU (delayed transfer test), not engagement metrics
DATE: 2026-09-17
WHY: The product claim is "understanding." Minutes-in-app, streaks and DAU can all rise while comprehension
     falls — optimizing them would actively corrupt the product.
ALTERNATIVES CONSIDERED: DAU · streaks · lessons completed · time-in-app
WHY REJECTED: All are proxies for attention, not comprehension. Duolingo-style streak mechanics are a known
     path to high engagement and low transfer.
EXPECTED RESULT: product decisions stay aligned with the actual mission
REUSABLE LESSON: Measure the thing you actually sell, even when it's harder to instrument.
STATUS: ✅ decided

---
DECISION: Phase 1 exit gate is a HUMAN gate (5 testers), not a technical one
DATE: 2026-09-17
WHY: The dominant failure mode for this category is building a beautiful engine that doesn't teach. A
     technical gate ("it compiles, it's pretty") cannot detect that. Fractions chosen as the test concept
     because "why does ÷ ½ make it bigger" is the hardest teaching problem in school math — if the method
     cracks that, it generalizes.
EXPECTED RESULT: the core thesis is validated or falsified by Week 3, not Week 48
REUSABLE LESSON: Put the riskiest assumption behind the earliest gate, and make the gate unfakeable.
STATUS: ✅ decided

---
DECISION: Audience = school students 11–16 (Class 6–10)
DATE: 2026-09-17
WHY: This is where math breaks for most people — fractions, negative numbers, and early algebra are the
     documented drop-off points. Narrow enough to design one coherent UI and tone for, unlike "everyone
     from 8 to 30". Phase 3's ~180 concepts already map to this band.
ALTERNATIVES CONSIDERED: everyone (kids→adults) · adult self-learners · young kids abacus-first
WHY REJECTED: "Everyone" makes tone and UI unsolvable — you cannot speak to an 8-year-old and a 30-year-old
     in one voice. Adults-only forfeits the biggest pain point. Kids-only defers the logic/algorithms/physics
     vision indefinitely.
IMPLICATION: Abacus track is repositioned as number-sense/mental-math support WITHIN this band, not a
     separate young-kids product. Parent/teacher dashboards move to Phase 7.
STATUS: ✅ decided

---
DECISION: English-first content; Hindi localization in Phase 7
DATE: 2026-09-17
WHY: Prove pedagogy quality in one language before doubling content cost. ADR-003 (content-as-data) makes
     later translation a data problem, not a rewrite — so deferring costs almost nothing structurally.
ALTERNATIVES CONSIDERED: Hindi+English day one · Hindi-first
WHY REJECTED: Bilingual day-one would stretch Phase 3 from ~13 weeks to ~20 with zero added validation of
     the core thesis. Hindi-first is a real underserved gap but forfeits global reach during the phase where
     we most need diverse testers.
CONSTRAINT THIS CREATES: every content string must be externalized from day one — no hardcoded English in
     Dart, ever. Cheap now, very expensive to retrofit.
STATUS: ✅ decided

---
DECISION: No in-app AI tutor — app is fully offline. AI used only in the authoring pipeline.
DATE: 2026-09-17
WHY: Preserves the offline-first principle (design target = budget Android phone, no data). No backend, no
     per-user API cost, no internet dependency. Critically: a hallucinated explanation in MATH is far more
     damaging than in most domains — a learner cannot detect the error, which is the exact opposite of the
     product's purpose.
ALTERNATIVES CONSIDERED: Claude API in-app doubt-solving · AI only in authoring
WHY REJECTED: In-app AI adds backend + recurring cost + connectivity requirement, and introduces
     unverifiable explanations into a product whose entire claim is trustworthy understanding.
NOTE: AI-assisted *authoring* (Phase 3 drafting of ~180 concepts) remains in scope — every draft passes
     human review before shipping. That is the only way one operator reaches that volume.
REUSABLE LESSON: In domains where the user cannot evaluate correctness, generated content needs a human
     gate before it reaches them — not after.
STATUS: ✅ decided

---
DECISION: Moat claim REVISED — "manipulable widgets" is necessary but not the moat
DATE: 2026-09-17 (after research agent findings)
WHY: The founding vision doc claimed the no-concept-without-a-widget rule "is the entire moat." Research
     falsified this. Mathigon/Polypad already ships 50+ polished manipulative types across nearly all of
     K-12, free forever (Amplify funds it via school-district B2B contracts, not user payment), 600K+ MAU,
     founder still in place, survived its 2021 acquisition intact. Separately, the manipulatives evidence
     base is only small-to-moderate (Carbonneau et al. 2013, 55 studies, N=7,237) and heavily moderated by
     execution quality — with thinner evidence for VIRTUAL manipulatives than physical ones.
REVISED POSITION — four defensible things Mathigon leaves open:
     1. Full pipeline vs interactive chapter. Mathigon is strong on Layers 2-3, weak on 5-6: no spaced
        repetition, no adaptive generation, no mistake diagnosis. Layer 5 is our real work.
     2. The abandoned surface. Mathigon's Android app is off Google Play, iOS stale — it is a website now.
        Native + offline + budget Android is an OPEN LANE and already our stated design target.
     3. Hindi and Indian-language interactive math — nobody serious is there. ADR-003 makes it tractable.
     4. CGU (delayed transfer) — nobody in the category measures this.
EXPECTED RESULT: strategy rests on a true claim rather than a flattering one
REUSABLE LESSON: Commission the research that can falsify your thesis BEFORE the thesis is expensive to
     change, and give the researcher explicit permission to contradict you. This one cost a few hours at
     Week 0; at Week 30 it would have cost the product. Also: the finding that looked like bad news
     (a strong incumbent) contained the best news — the incumbent had vacated the exact surface we target.
STATUS: ✅ decided — vision doc updated

---
DECISION: Completion, not content quality, is the category's primary failure mode
DATE: 2026-09-17
WHY: Khan Academy's own efficacy research shows real gains (~+20%) but only ~9% of users reach the usage
     threshold that produces them. Content quality is rarely what fails in this category; people leaving is.
IMPLICATION: Layer 5 (practice + mistake diagnosis) and the mastery loop are not Phase 2 infrastructure —
     they ARE the product. The Phase 3 retention target is the hardest number in docs/03-GOALS.md.
     Note the tension to manage: we reject engagement dark patterns AND need completion. Resolution is that
     completion must come from the work being comprehensible and satisfying, not from manufactured guilt.
     That is a harder design problem and we are choosing it deliberately.
REUSABLE LESSON: Before optimizing quality, check whether quality is the binding constraint. Often reach or
     completion is, and quality work then has near-zero marginal effect.
STATUS: ✅ decided

---
DECISION: Distribution planning moves from Phase 7 into Phase 2/3 — no longer deferred
DATE: 2026-09-17
WHY: Research flagged that docs/02-PLAN.md had distribution appearing only in Phase 7 ("ongoing from Sep
     2027"), despite discovery/CAC being a documented primary failure driver for good products. Every
     healthy comparable (Mathigon, Khan, Desmos) has an institutional channel — schools. We have none, and
     a consumer-CAC-funded path is exactly what is not available to a solo operator with no ad budget.
EXPECTED RESULT: a real channel hypothesis exists before 180 concepts are written for nobody
REUSABLE LESSON: "Build it then figure out distribution" is the default plan shape and it is the default
     failure shape. Distribution deserves a phase gate, not an epilogue.
STATUS: ✅ decided — plan amended

---
DECISION: Widget events report RAW INTERACTIONS, never pedagogical judgments
DATE: 2026-09-17 (widgets agent, accepted)
WHY: A widget that knows "the learner has the add-tops-add-bottoms misconception" is welded to one concept.
     A widget that emits "learner dropped segment X at position Y" is reusable everywhere. Misconception
     matching lives in the concept YAML (`practice.misconceptions` patterns), not in Dart.
EXPECTED RESULT: ~16 widgets carry ~180 concepts instead of needing per-concept variants
REUSABLE LESSON: Push interpretation UP to the data layer and keep the component dumb. The moment a
     reusable component encodes domain judgment, it stops being reusable — and you find out late.
STATUS: ✅ accepted

---
DECISION: describeState() is a second rendering target, not an accessibility afterthought
DATE: 2026-09-17 (widgets agent, accepted)
WHY: Every widget must render its state as a full English sentence for screen readers. Treated as a first-
     class output alongside the canvas, it stays correct; bolted on later it rots immediately.
SIDE BENEFIT (noted, not yet planned): this same sentence output is a natural hook for Hindi localization
     of widget state in Phase 7, and for automated testing of widget semantics.
STATUS: ✅ accepted

---
DECISION: Widget enum — merge TruthTable+LogicGates into LogicBoard; split GeometryCanvas
DATE: 2026-09-17 (widgets agent recommendation, accepted)
WHY (merge): A truth table and a gate diagram are the SAME boolean expression under two representations.
     Toggling between them on the same expression — seeing the table row light up the wire — is itself the
     lesson, not a convenience. Two separate widgets would duplicate engineering and lose the lesson.
WHY (split): GeometryCanvas bundled two different teaching jobs AND two different engineering problems:
     step-gated compass/straightedge construction (procedural — closer to StepperMachine) versus free
     drag-and-observe invariant discovery (a constraint-solving engine). As scoped it risked being harder
     to build than FunctionGrapher, for two audiences that don't need the same widget.
NICE CONSEQUENCE: framing construction as procedural surfaces a real curriculum edge — a compass-and-
     straightedge construction IS an algorithm. That's a genuine geometry↔algorithms link for the knowledge
     graph, not a forced one. Flagged to curriculum.
VERIFIED SAFE: no authored content referenced the changed entries at time of change.
STATUS: ✅ applied to content/schema/concept.schema.json

---
DECISION: OPEN RISK — FunctionGrapher needs a sandboxed expression evaluator
DATE: 2026-09-17 (widgets agent, flagged not resolved)
WHAT: Per ADR-003, custom functions are defined in content YAML, not compiled Dart. So FunctionGrapher must
     evaluate author-written expressions at 60–120fps with zero drag latency (the live-morph causal link IS
     the lesson; any lag breaks it), while keeping graph + accessible table + formula consistent in one frame.
WHY IT MATTERS BEYOND PERF: today content is first-party, so an evaluator is a correctness and performance
     problem only. **Phase 7 proposes community-contributed concepts** — at that moment the same evaluator
     becomes an untrusted-input surface. Design it sandboxed from the start (whitelisted operations, no
     arbitrary execution, bounded iteration); retrofitting a sandbox after community content ships is the
     kind of thing that goes badly.
NEXT ACTION: prototype and benchmark the evaluator in Phase 2 before FunctionGrapher-dependent content is
     authored. Do not let Phase 3 content assume capabilities that aren't proven.
STATUS: ⚠️ open — owned by platform/widgets in Phase 2

---
DECISION: The content AUTHOR is a risk vector — Phase 2 authoring guide gets a misconception checklist
DATE: 2026-09-17 (research agent routing note; unowned recommendation, adopted by main)
WHY: Research found that even pre-service teachers hold the split-ray and amalgamated-translation
     misconceptions about negative numbers. We had been implicitly assuming authors hold correct mental
     models and that quality risk lived only in delivery. It does not.
WHY IT'S SHARPER THAN IT LOOKS: ADR-003 makes content data so it SCALES. That cuts both ways — a single
     author's wrong model propagates silently to every learner who touches that concept, and unlike a code
     bug it throws no error and nobody reports it. They simply fail to understand, and we read it as a
     retention problem.
DECIDED: the Phase 2 authoring guide carries a per-concept "misconceptions you must not reinforce"
     checklist, sourced from docs/research/03-other-fracture-points.md. Treated as a safety mechanism, not
     documentation polish. Owner: content-pipeline (Phase 2).
ROUTING NOTE: curriculum correctly declined this as out of scope (it is Phase 2 tooling, not graph work).
     It had no owner among active agents and would have evaporated. Captured by main instead.
REUSABLE LESSON: Two things. (1) When a pipeline scales content, it scales errors at the same rate — build
     the check at the authoring step, not the review step. (2) In a multi-agent setup, a correctly-declined
     recommendation is exactly the kind that vanishes. The orchestrator must own the unowned, or delegation
     quietly loses work that no individual agent did anything wrong to lose.
STATUS: ✅ captured — Phase 2 deliverable with named owner

---
DECISION: Add FunctionMachine widget — BalanceScale and FunctionGrapher both fail the Intuition layer
DATE: 2026-09-17 (agent-negotiated; schema call escalated to and made by main)
WHY: Kieran (1992) distinguishes variable-as-placeholder (an unknown to solve for) from variable-as-quantity
     (a generalized, varying amount). The 192-node graph encodes these as separate nodes with a real
     prerequisite edge, and `function-as-machine` depends specifically on variable-as-quantity.
     Neither existing widget can serve variable-as-quantity's INTUITION layer:
       - BalanceScale's mirrored-pans mechanic structurally assumes a fixed unknown — wrong mental model.
       - FunctionGrapher's point-probe works, but presupposes coordinate-plane literacy, making it a
         Manipulate/Formalize tool. The doctrine requires Intuition to be zero-symbol.
     So the choice was: add a widget, or break the doctrine for this concept. Added the widget.
DESIGN: input slot → output slot container. No coordinate plane, no algebraic notation. Same rationale as
     AbacusBoard existing rather than overloading NumberLine — a dedicated physical anchor beats a
     stretched general-purpose one.
STOPGAP ACCEPTED: FunctionGrapher's point-probe may carry variable-as-quantity content, but only for
     concepts placed AFTER coordinate-plane fluency is established — never as first exposure. Any concept
     YAML relying on the stopgap must state that ordering constraint explicitly.
REUSABLE LESSON: When no existing component can serve a layer your own doctrine mandates, that is the
     doctrine doing its job — it surfaced a real gap instead of letting a stretched widget quietly ship a
     wrong mental model. Overloading a component to avoid adding one is how mental-model bugs enter a
     system, and they are invisible afterwards.
PROCESS NOTE (worth keeping): this resolved through agent-to-agent negotiation without main arbitrating —
     widgets raised it, research routed it out of its own lane, curriculum supplied the concrete graph
     dependency, widgets made the call within its lane, and escalated ONLY the schema change, which it
     correctly did not own. That is the delegation working as intended.
STATUS: ✅ applied — enum 16 → 17
