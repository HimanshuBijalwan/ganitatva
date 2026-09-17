# Ganitatva — Live Progress

TASK: Phase 0 — Foundation
STATUS: 60% — all planning + specification complete; toolchain install and the paper dry run remain
COMPLETED:
  - Vision, architecture (ADR-001..005), phased plan, goals — written, then REVISED against research
  - Moat claim falsified and rewritten (Mathigon already ships manipulables free; ours is Layers 5–6,
    the native/offline surface they abandoned, Hindi, and CGU measurement)
  - 193-node math knowledge graph — DAG verified independently by main, zero cycles, zero orphans
  - 7 Phase 1 fractions concepts authored — 7/7 schema-valid, 7/7 ids in graph, zero-symbol lint passes
  - misconceptions.md — 45 entries from 8 root generators, detection signatures, gate scoring rubric
  - 17-entry widget enum finalized; 9 widget specs written, 3 rewritten against the real authored content
  - Art Direction Brief — THE BENCH — ✅ APPROVED BY USER 2026-09-17
  - Setup runbook, 5-platform GitHub Actions CI, release matrix
  - Distribution moved out of Phase 7 into Phase 2/3; per-fracture-point human gates added to Phase 3
IN PROGRESS:
  - (nothing — all six agents have handed back)
BLOCKED:
  - Everything downstream of the toolchain: needs the operator to run installs (App Store login required
    for Xcode). Not something an agent can do.
PENDING — the two Phase 0 exit-gate items:
  1. Toolchain install (~20–27GB, ~45min–1.5hrs hands-on). Two independent tracks, start together:
     Apple (full Xcode → iOS runtime → CocoaPods via brew) and Android (Android Studio → SDK → licences).
     Flutter SDK first, it's fast. Windows/Linux need no local setup — CI handles them.
  2. **Paper-and-scissors dry run of concept 7 on two real kids.** Highest-value action available.
  Then: GitHub repo + push CI · Developer Verification enrolment (calendar dependency) · font licensing
NEXT ACTION:
  - Operator starts both toolchain download tracks; paper dry run can happen in parallel (needs no code)
CONFIDENCE: High on the specification. Medium on the Phase 1 human gate — pedagogy self-assessed ~60–65%,
  and was right that the uncertainty sits in execution and instrument design, not in the teaching.
