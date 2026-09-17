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
