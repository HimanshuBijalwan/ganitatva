# Ganitatva — Phased Plan

Start date: **2026-09-17**. Assumes one operator + AI assistance, working steadily.
Every phase has an **exit gate**. No phase starts until the previous gate actually passes — that rule is the
only thing standing between this and a beautiful engine nobody learns from.

---

## Phase 0 — Foundation · Sep 17 → Sep 24, 2026 (1 week)

The unglamorous week that prevents six months of pain.

1. **Toolchain install** (~3 hrs of work, several hours of downloading)
   - Flutter SDK + `flutter doctor` clean
   - **Full Xcode** from App Store (~10 GB) — required for macOS *and* iOS
   - Android Studio → Android SDK + platform-tools, accept licenses
   - CocoaPods
2. **Repo + CI on day one**
   - GitHub repo, `main` protected
   - GitHub Actions: on every push build **Android APK**, **macOS**, **Windows** (`windows-latest`), iOS-unsigned
   - Artifacts downloadable from every run ← this is how Windows gets tested without a Windows machine
3. **Design doctrine pass** (mandatory before any UI — per global design-doctrine rules)
   - Concept sentence, out-of-category references, Art Direction Brief
   - Explicitly reject: "friendly EdTech blue-and-purple with a cartoon mascot"
4. **Content schema v1** — JSON Schema for a concept file; one hand-written example
5. **Skeleton app** — Riverpod + go_router + Drift wired, one screen

**EXIT GATE:** App runs on macOS, APK installs on a real phone, CI produces a Windows .exe artifact, `flutter doctor` is clean.

---

## Phase 1 — The Vertical Slice · Sep 25 → Oct 8, 2026 (2 weeks)

**The most important phase in the entire project.** One concept, built to final quality, end to end.

**Chosen concept: FRACTIONS.** Why this one:
- Universally hated → highest possible "ohh" payoff
- Purely visual at its core → proves the thesis
- Exercises three different widgets (`FractionBar`, `NumberLine`, `AreaModel`) → proves the kit generalizes
- Contains the hardest teaching problem in school math: **why does dividing by ½ make it bigger?**
  If we can make *that* obvious, the method works.

Build all 6 layers for real: Hook → Intuition → Manipulate → Formalize → Practice (with mistake diagnosis) → Connect.
Plus: progress persistence, and the same experience on all 4 platforms.

**EXIT GATE — a human gate, not a technical one:**
> 5 real testers (mix of kids and math-averse adults) use it.
> **≥ 4 of 5 can explain in their own words why 3/4 ÷ 1/2 = 3/2** — without reciting "flip and multiply."

If that gate fails, **do not proceed**. Fix the pedagogy. The whole company is that gate.

---

## Phase 2 — The Engine · Oct 9 → Nov 5, 2026 (4 weeks)

Turn one hand-built concept into a factory.

- **Widget kit**: 8–10 primitives, documented, golden-tested
- **Content pipeline**: YAML → validated → compiled bundle; authoring guide written
- **Knowledge graph** + path engine + prerequisite diagnosis
- **FSRS spaced repetition** + mastery model
- **Practice generators**: parameterized item templates, not static question banks
- **Profile & progress**, offline-first — deliberately *without* streak-guilt mechanics
- Over-the-air content updates

- **Distribution hypothesis** (new — was wrongly deferred to Phase 7): name the channel. Realistic candidates
  for a solo operator with no ad budget: individual teachers (the route Desmos and Mathigon actually grew
  through), Hindi-medium schools and coaching centres, and parents of Class 6–10 students. Pick one to test first.

**EXIT GATE:** a person who cannot write Dart authors a complete, shippable concept in under one day, using only the authoring guide — **and** a written, falsifiable channel hypothesis exists.

---

## Phase 3 — Math Breadth · Nov 6, 2026 → Feb 4, 2027 (13 weeks)

Content marathon. This is where the real cost lives — 80% of total project effort is content, not code.

- **Arithmetic + Abacus track** (place value, four operations, mental math ladder)
- **Pre-algebra & Algebra** (balance-scale equations, factoring via area, functions)
- **Geometry** (constructions, invariants, proof intuition)
- **Trigonometry** (unit circle first, triangles second — that order matters)
- **Probability & Statistics** (simulation-first, formula-second)

Target: **~180 concepts** ≈ Class 6–10 equivalent coverage.

Also in this phase: **test the channel hypothesis with real users**, not just build content for them.

**EXIT GATE:** 180 concepts live · 100 beta users · **7-day retention ≥ 25%** · first CGU measurements flowing ·
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
