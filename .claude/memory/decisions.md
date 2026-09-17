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

---
DECISION: Refused to add a graph edge that would encode implementation convenience as conceptual dependency
DATE: 2026-09-17 (curriculum agent's call; endorsed by main)
CONTEXT: The FunctionGrapher stopgap for variable-as-quantity only works if coordinate-plane fluency comes
     first. The tempting fix was to add `coordinate-plane-intro` as a prerequisite edge, guaranteeing the order.
CURRICULUM DECLINED, CORRECTLY: `variable-as-quantity` and `function-as-machine` do not require the
     coordinate plane to be COHERENT — they are merely harder to render without it. That fails the graph's
     own edge test ("incoherent, or just unfamiliar?"). The edge would have described our tooling, not the
     mathematics.
WHY THIS MATTERS MORE THAN IT LOOKS: the graph drives learning paths, prerequisite diagnosis and spaced
     repetition. A false edge would tell a struggling learner "you're stuck on functions because you're
     shaky on the coordinate plane" — which could be flatly untrue, sending them to re-learn something
     irrelevant. False edges don't fail loudly; they misdiagnose quietly, forever.
RESOLUTION: ordering constraint lives as a human-readable note in the concept YAML, never as a graph edge,
     and must never be assumed from depth correlation as the graph grows. Today's ordering
     (coordinate-plane depth 6 < variable-as-quantity depth 10) is coincidence, not guarantee.
REUSABLE LESSON: A model that drives decisions must describe reality, not the convenience of whoever is
     building against it. When tooling needs an ordering the domain doesn't have, record it in the tooling
     layer — the moment you push it into the shared model, every consumer inherits the lie.
STATUS: ✅ endorsed

---
DECISION: Art direction = THE BENCH (concept sentence approved by design-director; USER SIGN-OFF PENDING)
DATE: 2026-09-17
CONCEPT SENTENCE: "Ganitatva is a bench, not a lesson: one mathematical object lies under the learner's
     hand, the single saturated colour in the whole app means 'your hand goes here', and every other thing
     on screen is the quiet surface that object rests on."
WHY THIS DIRECTION (not taste — structure): of three directions (Bench / Instrument / Survey), Bench is the
     only one that CANNOT be built while breaking the product's one hard rule. A bench with nothing on it is
     visibly broken, so "no concept without a manipulable widget" enforces itself in the LAYOUT rather than
     in code review. It also resolves the real double bind — warm paper/graphite/wood is approachable
     without being childish, where a dark instrument panel reads "math is for experts" and anything sweeter
     reads "this is for babies". And flat fills with no gradient/blur/elevation is simultaneously cheapest
     to render at 60fps on a budget phone and most legible in daylight — aesthetics and performance budget
     agreeing is rare enough to weight heavily.
COSTS ACCEPTED IN WRITING: delight is given up entirely as a lever (comprehension becomes the only reward
     available); a warm light UI is the harder mode to make look expensive; the rejected direction would
     have produced the better store screenshot.
STATUS: ⚠️ AWAITING USER SIGN-OFF — no UI work may begin until approved. Built result must additionally
     pass design-critic ≥65/100 + non-transferability before anything is called done.

---
DECISION: There is no green in this product. No colour, mark or sound ever means "wrong".
DATE: 2026-09-17 (design-director ruling; endorsed)
WHAT: `role.incorrect` deleted from the widget kit theme. `role.correct` renamed `role.resolved` and
     re-scoped to "the object reached a mathematically notable state" — a property of the object, not a
     verdict on the learner.
WHY IT'S RIGHT: the doctrine already says a red ✗ teaches nothing and diagnosis must be words. A theme that
     ships an "incorrect" colour token hands every future author a one-keystroke way to violate that — and
     they will, under deadline. Deleting the token removes the affordance rather than relying on discipline.
REUSABLE LESSON: To enforce a principle, delete the affordance that breaks it. A rule that depends on
     everyone remembering it under pressure is not a rule, it's a hope.
STATUS: ✅ endorsed

---
DECISION: Intuition-layer object library is ENGINEERING, scheduled separately from the widget kit
DATE: 2026-09-17 (illustration-director risk; escalated by design-director; scheduled by main)
THE RISK, STATED PLAINLY: the ~25-object Bench Object Library is code-drawn (`CustomPainter`) widget-kit
     work, not illustration. If it rides along inside "the widget kit" line item, the design gate passes on
     paper while Phase 1 ships a GREY BOX for every Intuition layer. Layer 2 is where the "ohh" is supposed
     to happen — a grey box there fails the entire thesis, and fails it silently.
ACTION: added to docs/02-PLAN.md Phase 2 as its own line item at the same cadence as the widget kit,
     phrased direction-neutrally so it survives a change of art direction.
REUSABLE LESSON: When a deliverable sits across two disciplines' boundaries, it belongs to neither by
     default and gets scheduled by nobody. Name its owner and its line item explicitly, or it evaporates —
     the second time this exact failure mode appeared today (cf. the Phase 2 authoring-guide checklist).
STATUS: ✅ scheduled

---
DECISION: Honest correction — rejecting the "blue-purple EdTech gradient" is hygiene, not differentiation
DATE: 2026-09-17
WHY: docs/02-PLAN.md Phase 0 (written by main) instructed rejecting "friendly EdTech blue-and-purple with a
     cartoon mascot" as if that were the category norm being broken. Reference research found it is NOT the
     norm — Khan, Duolingo, Vedantu, Desmos, GeoGebra and Mathway are all non-gradient. The norm we actually
     break is structural: ~75% of surveyed apps make content/questions/a game the hero rather than the
     interactive object.
     Also recorded: pixel-level verification was achieved for only 2 of 16 surveyed apps. The design agent
     flagged its own evidence limit rather than presenting the survey as stronger than it was.
REUSABLE LESSON: Check that the norm you're congratulating yourself for breaking is actually a norm.
     A strawman competitor makes a design brief feel sharper while giving it nothing real to push against.
STATUS: ✅ corrected in plan

---
DECISION: OPEN — font licensing must be resolved before any UI ships
DATE: 2026-09-17 (design-director open question; unowned, logged by main)
WHAT: Atkinson Hyperlegible Next terms/weights, Fraunces variable axes on older Android, and the KaTeX
     licence as actually shipped all need checking. Explicit instruction from the brief: do NOT silently
     substitute a system font if licensing turns out to be a problem — that would quietly break the type
     system the whole direction rests on.
OTHER OPEN ITEMS from the brief (do not guess these): the `bu` physical metric needs a real ruler test on
     all five platforms; whether the geru bead reads as "error" to an actual 13-year-old (put it in the
     Phase 1 five-tester session); Quiet mode discoverability; whether the progress "shelf" motivates at all.
STATUS: ⚠️ open — resolve in Phase 0/1

---
DECISION: Art Direction Brief APPROVED by user — THE BENCH
DATE: 2026-09-17
STATUS: ✅ user signed off. UI work unblocked. Built result must still clear design-critic ≥65/100 +
     non-transferability before "done". Supersedes the pending status in the earlier entry.

---
DECISION: Paper-and-scissors dry run of concept 7 BEFORE any Flutter is written
DATE: 2026-09-17 (pedagogy agent's recommendation; adopted into Phase 0 with exit-gate teeth)
WHY IT'S THE HIGHEST-VALUE ACTION AVAILABLE: the whole Phase 1 gate reduces to one gesture — dragging the
     leftover onto the measuring stick. Testing the intuition script on paper with two real kids isolates
     the PEDAGOGY from the WIDGET. If it fails on paper, no widget rescues it. If it passes on paper and
     then fails in the app, we know the defect is execution, not teaching.
     Cost: one afternoon. Without it, a Phase 1 failure is uninterpretable — we would not know whether to
     rebuild the teaching or the interaction, and would likely rebuild the wrong one.
REUSABLE LESSON: When a bet depends on two things at once (idea × execution), find the cheap test that
     isolates one of them. An expensive test that confounds both tells you almost nothing when it fails.
STATUS: ✅ added to Phase 0 as item 6 and written into the Phase 0 exit gate

---
DECISION: The Phase 1 gate is scored on the EXPLANATION, never the answer
DATE: 2026-09-17 (pedagogy agent finding; adopted)
THE TRAP: the number 3/2 is reachable by at least three routes — the measurement model (what we taught),
     chanted flip-and-multiply (what we're replacing), and componentwise division, which is ALGEBRAICALLY
     VALID since (a÷c)/(b÷d) = (a/b)(d/c). A learner can produce 3/2 having understood nothing we intended.
CONSEQUENCE: passing this gate by accident is WORSE than failing it — we would build Phases 2–7 on a thesis
     we never actually tested, and not find out for a year. Do NOT build a detector for componentwise
     division; it isn't wrong, it's just not evidence.
ALSO ADOPTED: separate "the pedagogy failed" from "the instrument failed" (misconceptions.md §6.4). A
     teenager who understands may still not say it aloud to an adult with a clipboard. Rebuilding pedagogy
     because five people were shy would be an expensive mistake.
REUSABLE LESSON: Before trusting a test, ask what ELSE could produce a pass. A metric with multiple causal
     routes to the same reading measures none of them.
STATUS: ✅ written into docs/03-GOALS.md G2

---
DECISION: Accessibility text must announce STATE, never the remedy
DATE: 2026-09-17 (pedagogy caught the defect in widgets' spec; widgets generalized the fix; endorsed)
THE DEFECT: FractionBar `combine` mode's pour-refusal screen-reader announcement ended "...They will not
     combine until both are cut the same way." That clause is the REVEAL of concept 5 — the answer to its
     own discovery prompt. A sighted learner sees a red edge and has to work out why; a screen-reader
     learner was handed the conclusion for free.
WHY IT MATTERS: it is a pedagogy leak and an equity regression at the same time, and it arrived disguised
     as an accessibility improvement — which is exactly why it nearly shipped. Being helpful in the
     announcement destroyed the lesson for the learner who most needed it intact.
GENERALIZED (kit-wide, docs/widgets/00-kit-overview.md §4.2): the guided-discovery exception governs the
     GESTURE, not the announcement. Being allowed into an invalid state never licenses announcing the
     remedy — only the state. The rejected wording is kept in the doc so a future editor who re-adds the
     helpful-sounding clause sees why it went.
ALSO TIGHTENED: an intentionally-invalid widget state must now name the specific `practice.misconceptions`
     entry it is the remedy for, or it is unvalidated input wearing the exception's justification as a costume.
REUSABLE LESSON: Accessibility text is content, and it is subject to every pedagogical rule the visible
     content is. Treating it as a mechanical description is how a11y work quietly ships a worse experience
     to the users it was written for.
PROCESS NOTE: pedagogy reviewed widgets' spec and found this; widgets fixed and generalized it. Neither
     agent owns both files. Cross-review across ownership boundaries is what caught it.
STATUS: ✅ fixed and generalized

---
DECISION: Android distribution is a CALENDAR dependency, not a launch-day task
DATE: 2026-09-17 (platform agent findings; verified and adopted)
WHAT CHANGED: two 2026 Android policy shifts undercut ADR-005's original "direct APK + Play Store" assumption.
     1. **Android Developer Verification** — sideloaded APKs will require a verified developer. Live in 4
        countries as of Sept 2026, global through 2027. This hits our "direct APK" path specifically, which
        matters because budget Android is our declared design target.
     2. **Play's 12-tester / 14-day closed testing** for new personal accounts (ours will be one). It is a
        queue you must START, not a review you can wait out.
WHY THIS IS THE DANGEROUS KIND OF DEPENDENCY: neither can be fixed by working harder closer to launch. They
     consume wall-clock regardless of effort. Discovering them in Phase 6 would have cost a delayed launch
     for no engineering reason at all.
ACTION: enrol in Developer Verification early (free, has lead time). Seed the 12-tester requirement from the
     Phase 1 exit gate's 5 human testers and recruit the rest alongside — that converts a blocking
     dependency into a by-product of work already scheduled.
ALSO CORRECTED: Microsoft Store individual registration is now free (was $19). Windows store cost = $0.
REUSABLE LESSON: Separate dependencies that consume EFFORT from those that consume CALENDAR. Calendar ones
     must be started early even when nothing else is ready, and they are the ones a build-focused plan
     reliably forgets.
STATUS: ✅ ADR-005 amended

---
DECISION: ADR-002 pins corrected — golden_toolkit is discontinued
DATE: 2026-09-17 (platform agent flagged; main verified against pub.dev and amended the ADR)
WHAT: `golden_toolkit` (specced in ADR-002) last shipped 2023-02-21 and is flagged discontinued on pub.dev.
     Replaced with `alchemist` ^0.14.0. Also `drift_flutter` ^0.3.1 rather than `sqlite3_flutter_libs` (+eol).
PROCESS NOTE WORTH KEEPING: the agent verified every version live (pub.dev API, `gh api .../releases/latest`,
     Flutter's releases_macos.json) rather than recalling them, explicitly because this ecosystem moves fast
     and stale pins are worse than no pins. It then declined to edit `01-ARCHITECTURE.md` itself because
     that file was outside its write scope, and surfaced the amendment instead. Both behaviours are correct
     and worth reinforcing.
REUSABLE LESSON: Package versions are exactly the class of fact a model should never answer from memory.
     Verify pins at the moment of writing them, every time.
STATUS: ✅ amended
