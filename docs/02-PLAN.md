# Ganitatva — Phased Plan

Start date: **2026-09-17**. Assumes one operator + AI assistance, working steadily.
Every phase has an **exit gate**. No phase starts until the previous gate actually passes — that rule is the
only thing standing between this and a beautiful engine nobody learns from.

---

## Phase 0 — Foundation · Sep 17 → Sep 24, 2026 (1 week)

The unglamorous week that prevents six months of pain.

> **Restructured 2026-09-17 — WEB FIRST (ADR-006).** The native toolchain is no longer on Phase 0's
> critical path. It moves to Phase 5. What this buys: Phase 1's gate can be tested on a URL this week
> instead of after ~25GB of downloads, two store accounts and a 12-tester queue.

1. **Web project scaffold** (hours, not days — Node 25 and pnpm are already installed)
   - Astro + TypeScript, one concept page rendering from the compiled content bundle
   - Canvas 2D widget harness — one mounted island, nothing more
2. **Repo + CI on day one**
   - GitHub repo, `main` protected
   - GitHub Actions: typecheck, **validate every content YAML against the schema**, build, deploy preview
   - Deploy target with per-branch preview URLs — a tester link per branch is the whole point
   - *(The 5-platform native CI in `.github/workflows/build.yml` is already written and stays parked until
     Phase 5. It was not wasted work — it just isn't Phase 0's gate any more.)*
3. **Native toolchain — start the downloads, don't wait for them.** ~20–27GB, no rush, nothing blocks on it.
   Runbook: `docs/platform/00-setup-runbook.md`. Also enrol in **Android Developer Verification now** —
   it is free and calendar-bound, so early enrolment costs nothing and late enrolment costs weeks.
3. **Design doctrine pass** (mandatory before any UI — per global design-doctrine rules)
   - Concept sentence, out-of-category references, Art Direction Brief
   - Reject the default EdTech look — but honestly: reference research found the blue-purple gradient hero
     is **not** actually the category norm (Khan, Duolingo, Vedantu, Desmos, GeoGebra, Mathway are all
     non-gradient). Rejecting it is hygiene, not a differentiator, and we should not congratulate ourselves
     for it. The norm we actually break is structural: ~75% of surveyed apps make content/questions/a game
     the hero rather than the interactive object.
4. **Content schema v1** — ✅ done (`content/schema/concept.schema.json`)
5. **Content pipeline v0** — YAML → validated → compiled JSON, consumed by the Astro build

6. **Paper-and-scissors dry run of concept 7** — before a single line of widget code is written.
   Take the authored intuition script from `content/concepts/arithmetic/dividing-fractions.yaml`, a paper
   ribbon and a paper measuring stick, and run it on **two real kids**. Costs an afternoon.
   **Why this is the highest-value action in Phase 0:** the Phase 1 gate rests on one gesture — dragging the
   leftover onto the stick. This test isolates the *pedagogy* from the *widget*. If the script fails on
   paper, no widget will rescue it — and that is worth learning now rather than three weeks and one widget
   implementation later. If it succeeds on paper and then fails in the app, we know the defect is execution,
   not teaching. Either outcome is actionable; skipping it makes a Phase 1 failure uninterpretable.

**EXIT GATE:** one concept page renders live at a shareable preview URL, opens correctly **on a real phone
browser**, CI blocks a deliberately-broken content YAML, **and the paper dry run has been run with its
result written down.**

---

## Phase 1 — The Vertical Slice · Sep 25 → Oct 8, 2026 (2 weeks)

**The most important phase in the entire project.** A defined *chain* of concepts, built to final quality, end to end.

> **Scoping correction (2026-09-17).** This section originally read "ONE concept, fully built" and then named
> FRACTIONS. Those two statements contradict each other, and the knowledge graph made it obvious: the
> fractions sub-graph is **17 nodes**, not one. The schema's unit is one concept = one YAML file;
> "fractions" is a topic, not a unit.
> *(An earlier draft of this note said 14 — that came from grepping ids for the string "fraction" and missed
> `unit-fractions`, `division-as-measuring`, `decimals-intro` and others that sit on the fractions spine
> without the word in their id. The sub-graph is defined semantically in `docs/curriculum/01-graph-analysis.md` §4.)*
> The plan was naming a topic and calling it a scope.
>
> **Resolved:** Phase 1 ships the minimal coherent chain from `fraction-as-part-whole` through to
> `fraction-division` — roughly 7 nodes, pinned exactly against `content/graph/prerequisites.yaml`. Nodes
> outside that chain (simplification, decimal conversion, fraction-of-a-quantity, improper fractions,
> subtraction) are **explicitly out of Phase 1** and land in Phase 3.
> The exit gate is unchanged and still sits on `fraction-division`.

**Chosen chain: FRACTIONS.** Why this topic:
- Universally hated → highest possible "ohh" payoff
- Purely visual at its core → proves the thesis
- Exercises three different widgets (`FractionBar`, `NumberLine`, `AreaModel`) → proves the kit generalizes
- Contains the hardest teaching problem in school math: **why does dividing by ½ make it bigger?**
  If we can make *that* obvious, the method works.

Build all 6 layers for real: Hook → Intuition → Manipulate → Formalize → Practice (with mistake diagnosis) → Connect.
Plus progress persistence (IndexedDB), shipped **on the web** at a real URL.

**Testers open a link on their own phone.** No sideloading, no TestFlight invite, no store account. This is
the practical reason web goes first — the gate needs five humans, and friction between us and them is the
single most likely reason a gate slips.

⚠️ **Test on a real phone browser, never a laptop.** Pedagogy's assessment is that the whole gate reduces to
whether dragging the leftover onto the measuring stick *feels like discovery on a 5-inch screen*. Testing
that on a desktop with a mouse tests a different thing and would give us a false pass.

**EXIT GATE — a human gate, not a technical one:**
> 5 real testers (mix of kids and math-averse adults) use it.
> **≥ 4 of 5 can explain in their own words why 3/4 ÷ 1/2 = 3/2** — without reciting "flip and multiply."

If that gate fails, **do not proceed**. Fix the pedagogy. The whole company is that gate.

---

## Phase 2 — The Engine · Oct 9 → Nov 5, 2026 (4 weeks)

Turn one hand-built concept into a factory.

- **Widget kit**: 8–10 primitives, documented, golden-tested
- **Intuition-layer object library** — scheduled as its own line item at the same cadence as the widget kit,
  **not folded into it and not treated as illustration.** Under the current brief this is the ~25-object
  Bench Object Library, drawn in code (`CustomPainter`), run `readOnly` for Layer 2 and `guided`/`free` for
  Layer 3. Flagged by illustration-director as the gate's most important operational risk, and it is a real
  one: **if this isn't scheduled separately, the design gate passes on paper while Phase 1 ships a grey box
  for every Intuition layer.** Layer 2 is where the "ohh" is supposed to happen; a grey box there fails the
  whole thesis silently. (Direction-neutral: whatever art direction is approved, its Intuition-layer objects
  are widget-kit engineering and get their own line.)
- **Content pipeline**: YAML → validated → compiled bundle; authoring guide written
- **Author misconception checklist** — the authoring guide must carry, per concept, a list of documented
  misconceptions the author must not *reinforce*. Rationale: studies find even pre-service teachers hold the
  split-ray and amalgamated-translation misconceptions about negative numbers. **We cannot assume the author
  has a correct mental model either.** Content-as-data means one author's wrong model scales silently across
  every learner who touches that concept — so the checklist is a safety mechanism, not documentation polish.
  Source material: final section of `docs/research/03-other-fracture-points.md`. **Owner: content-pipeline.**
- **Knowledge graph** + path engine + prerequisite diagnosis
- **FSRS spaced repetition** + mastery model
- **Practice generators**: parameterized item templates, not static question banks
- **Profile & progress**, offline-first — deliberately *without* streak-guilt mechanics
- Over-the-air content updates

- **Distribution hypothesis** (new — was wrongly deferred to Phase 7): name the channel. Realistic candidates
  for a solo operator with no ad budget: individual teachers (the route Desmos and Mathigon actually grew
  through), Hindi-medium schools and coaching centres, and parents of Class 6–10 students. Pick one to test first.

**EXIT GATE:** a person who cannot write code authors a complete, shippable concept in under one day, using only the authoring guide — **and** a written, falsifiable channel hypothesis exists.

---

## Phase 3 — Math Breadth · Nov 6, 2026 → Feb 4, 2027 (13 weeks)

Content marathon. This is where the real cost lives — 80% of total project effort is content, not code.

**Per-fracture-point human gates (added 2026-09-17).** Phase 1 gives fractions a dedicated 5-tester gate.
The graph shows three other fracture points deserve the same treatment rather than being folded into one
aggregate retention number at the end of a 13-week phase:

| Fracture point | Structural weight | Why it needs its own gate |
|---|---|---|
| `negative-numbers-intro` | **54 descendants** | Split-ray and amalgamated-translation misconceptions are documented **in pre-service teachers themselves** — arguably more alarming than the fractions evidence |
| `variable-as-quantity` | 41 descendants | Distinct cognitive achievement from variable-as-placeholder; `function-as-machine` depends on it specifically |
| `function-as-machine` | 9 descendants | Low descendant count but a genuine fracture point — raw counts are root-dominated and understate late-graph concepts |

Each gets a lightweight 5-tester check when Phase 3 reaches it. A failure there is a signal to stop and fix,
exactly as in Phase 1 — not a number to average away.

- **Arithmetic + Abacus track** (place value, four operations, mental math ladder)
- **Pre-algebra & Algebra** (balance-scale equations, factoring via area, functions)
- **Geometry** (constructions, invariants, proof intuition)
- **Trigonometry** (unit circle first, triangles second — that order matters)
- **Probability & Statistics** (simulation-first, formula-second)

Target: **~180 concepts** ≈ Class 6–10 equivalent coverage.

**Public web launch + SEO (new, and this is the payoff for going web first).** Every concept becomes a
statically-rendered, indexable page. Astro ships zero JS for the prose; only the widget hydrates. This is a
real acquisition channel, and it compounds — ~180 indexed concept pages is a meaningful surface, and unlike
ads it does not stop working when you stop paying.

Also in this phase: **test the channel hypothesis with real users**, not just build content for them.

**EXIT GATE:** 180 concepts live and publicly indexed · 100 beta users · **7-day retention ≥ 25%** · first CGU measurements flowing ·
channel hypothesis either validated or replaced. Note that 25% D7 is a *hard* target given Khan's ~9% threshold
finding — treat a miss as signal about the product, not about the number.

---

## Phase 4 — Logic & Algorithms · Feb 5 → Apr 1, 2027 (8 weeks)

The differentiator nobody else ships.

- **Logic**: propositions, truth tables, implication (and why "if false then anything" is not a trick),
  quantifiers, proof techniques — contradiction, induction, construction
- **Algorithms**: what a procedure *is* · Euclid's GCD · binary search · sorting (animated, side-by-side) ·
  recursion (with a live call-stack view) · complexity as *intuition*, not notation · intro graph algorithms

`StepperMachine` and `TruthTable`/`LogicGates` carry this entire phase.

**EXIT GATE:** a learner with no programming background can trace a recursive call stack and explain why binary search is fast.

---

## Phase 5 — Calculus & Linear Algebra · Apr 2 → May 27, 2027 (8 weeks)
## ⟂ and the NATIVE TRACK begins, in parallel

**This is where ADR-001 comes off the shelf.** Flutter app targeting the lane Mathigon vacated: native,
offline, on a budget Android phone with no data. Everything that makes this cheap was decided in Phase 0:

- **Content transfers at zero cost** — the 193-node graph, every concept YAML, the misconception catalog
  are platform-neutral. That was the entire point of ADR-003.
- **Widget specs transfer** — `docs/widgets/` was written as specs, not as code, precisely so a second
  implementation is a build job rather than a redesign. The expensive part was the design.
- **The 5-platform CI already exists** — `.github/workflows/build.yml`, written in Phase 0 and parked.
- **Developer Verification enrolment is already done** (started Phase 0), so the calendar dependency has
  already elapsed rather than starting now.

**What is genuinely duplicated: the widget rendering code.** Accepted knowingly in ADR-006. Keep the engine
logic — graph traversal, FSRS, misconception matching, practice generation — as pure data-driven functions
so it ports once and carefully; the widgets have to be native to each platform regardless.

**Sequencing check before starting:** do not open the native track until Phase 3's retention gate has
passed. Building a second client for a product nobody finished on the first one would be the most expensive
possible way to avoid confronting a retention problem.

- **Calculus**: local linearity → limits → derivatives → integration as accumulation → FTC *seen, not stated*
- **Linear algebra**: vectors, linear transformations as **grid deformation**, matrices, determinants as area scaling, eigenvectors

`CalculusZoom` and `MatrixTransform` carry this phase. These are also the exact prerequisites physics needs.

**EXIT GATE:** derivatives and vectors are solid enough that physics can be built on them without re-teaching.

---

## Phase 6 — Physics · May 28 → Aug 19, 2027 (12 weeks)

Now — and only now — physics, built entirely on math the learner already owns.

Kinematics → forces & Newton's laws → energy & momentum → circular motion & gravitation → waves & oscillation → intro electricity & magnetism.

Every topic derives from the math. **Zero formula memorization.** That's only possible because of Phase 5.

**EXIT GATE:** a learner derives projectile range from scratch rather than recalling it.

---

## Phase 7 — Scale & Release · ongoing from Sep 2027

- Store listings + ASO, all platforms
- **Hindi localization** (content-as-data makes this tractable)
- Lightweight **web surface** for SEO/discovery — *not* Flutter web
- Teacher/parent dashboards · classroom mode
- Community-contributed concepts

---

## Reality check on the timeline

**~48 weeks to the full vision.** But the decisive moment is **Week 3, not Week 48.**

By Oct 8, 2026 you will know — from five real humans — whether the core thesis works.
Everything after that is execution. Everything before that is the actual bet.

## Top risks & mitigations

| Risk | Severity | Mitigation |
|---|---|---|
| **Content is 80% of the work; engineering is the fun 20%** | 🔴 High | Content pipeline + LLM-assisted authoring built in Phase 2, before breadth |
| Building an engine nobody learns from | 🔴 High | Human exit gate at Phase 1 — hard stop |
| No Windows machine | 🟡 Med | GitHub Actions from Phase 0, not later |
| Scope creep into physics early | 🟡 Med | Hard gate — physics cannot start before Phase 5 passes |
| iOS: full Xcode + $99/yr + review | 🟡 Med | Ship Android/macOS/Windows first; iOS follows |
| Solo burnout on a 48-week plan | 🟡 Med | Every phase ships something installable and usable |
| **No distribution channel** — every healthy comparable (Mathigon, Khan, Desmos) reaches learners through schools; we have no institutional channel and no ad budget | 🔴 High | Channel hypothesis due in Phase 2, tested in Phase 3 — *not* deferred to Phase 7 |
| **Completion, not content quality, is what kills products here** (Khan: real gains, ~9% reach the threshold) | 🔴 High | Layer 5 + mastery loop treated as core product, not infrastructure |
| Math is a crowded market — Mathigon is a strong, free, well-funded incumbent | 🟡 Med | We don't out-widget them; we take the pipeline (Layers 5–6), the native/offline surface they abandoned, and Hindi |
