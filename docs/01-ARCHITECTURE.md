# Ganitatva — Architecture & Stack

> Status: **CONFIRMED 2026-09-17.** ADR-001 = Flutter. Audience = school students 11–16. Content = English-first (Hindi in Phase 7). No in-app AI tutor — fully offline.

## Machine ground truth (checked 2026-09-17)

| Tool | Status |
|---|---|
| macOS 26.6.2, Apple Silicon (arm64) | ✅ |
| Node 25.6.1 / npm 11.9 / pnpm 10.33 | ✅ |
| Java 17 (OpenJDK) | ✅ |
| git 2.54 / gh 2.95 | ✅ |
| **Flutter / Dart** | ❌ not installed |
| **Xcode (full)** | ❌ only Command Line Tools — required for iOS *and* macOS builds |
| **Android SDK** | ❌ not installed |
| **CocoaPods** | ❌ not installed |
| **Windows machine** | ❌ none — Windows builds must run in CI |

## ADR-001 — Cross-platform framework

**DECISION: Flutter — for the NATIVE track, which now starts in Phase 5, not Phase 0.**

> **Rescheduled 2026-09-17, not revoked.** The project ships **web first** (see ADR-006) and native second.
> Every argument below still holds *for the native app* — it is simply no longer the first thing built.
> What changed is not the reasoning about Flutter; it is the recognition that Phase 1's exit gate is
> platform-independent, and that a URL is a vastly cheaper way to reach five testers than an APK.

### Alternatives considered

| Option | Android | iOS | macOS | Windows | Custom drawing & animation | Verdict |
|---|---|---|---|---|---|---|
| **Flutter** | ✅ native | ✅ native | ✅ native | ✅ native | ✅✅ Impeller canvas, `CustomPainter` | **CHOSEN** |
| React Native + Expo | ✅✅ | ✅✅ | ⚠️ separate RN-macOS | ⚠️ separate RN-Windows | ✅ react-native-skia | Rejected |
| Tauri v2 + web UI | ⚠️ newer | ⚠️ newer | ✅✅ | ✅✅ | ⚠️ webview-tier perf | Rejected |
| Compose Multiplatform | ✅✅ | ⚠️ maturing | ✅ | ✅ | ✅ | Rejected |

### Why Flutter wins *for this specific app*

1. **One codebase genuinely reaches all 5 targets.** RN needs two shells (mobile + Electron/Tauri desktop).
   Tauri's mobile story is young. That's the literal requirement, and only Flutter clears it cleanly.
2. **This app is a drawing app wearing a math costume.** Number lines, animated proofs, dragging a
   parabola's coefficients, compass-and-straightedge constructions, abacus beads, vector fields — all of it is
   custom canvas + 60/120fps animation. Flutter renders every pixel itself via Impeller. This is its home turf.
3. **Cheap Android phones.** If the mission is "make math easy for the *world*", the median device is a
   ₹8,000 Android. AOT-compiled Flutter beats a webview there by a wide margin. This is the single biggest
   reason to reject Tauri, despite Tauri's lovely desktop story.
4. **APK is one command:** `flutter build apk --split-per-abi`.

### Why rejected (honestly)

- **React Native**: the mobile experience is excellent, but `react-native-windows`/`-macos` are a separate,
  slower-moving ecosystem outside Expo. You'd maintain two apps and call it one.
- **Tauri**: best-in-class desktop, tiny binaries, and you'd get a website free. Genuinely tempting. Loses on
  low-end Android animation performance — which is exactly where our core interaction lives.
- **Compose MP**: fine choice, smaller package ecosystem, iOS still the youngest leg.

### Cost of this decision (stated up front, not buried)

- Dart is a new language to learn. It's small and boring — ~2 days to productive. Acceptable.
- ~15–20 MB APK floor. Acceptable.
- Flutter **web** output is heavy and SEO-invisible. → We will **not** use Flutter web for the public site.
  A separate lightweight web surface handles marketing/SEO (see ADR-005).

## ADR-006 — Web first, native second (decided 2026-09-17)

**DECISION: ship a web product first; build the Flutter native app from Phase 5, sharing all content.**

### Why web goes first

1. **Distribution is our #1 unaddressed risk.** Research found every healthy comparable (Mathigon, Khan,
   Desmos) reaches learners through schools or the open web. We have no institutional channel and no ad
   budget. **A URL is the lowest-friction distribution that exists** — a teacher shares a link and it works.
2. **It bypasses both Android calendar dependencies** identified in ADR-005 — Developer Verification and
   Play's 12-tester/14-day queue. Those consume wall-clock regardless of effort; the web route simply
   doesn't have them.
3. **Phase 1's gate is platform-independent.** "4 of 5 testers explain 3/4 ÷ 1/2 in their own words" does
   not care whether the widget ran in Chrome or in an APK. Testing the thesis on the cheaper platform is
   strictly better.
4. **SEO and discovery.** An app is not discoverable; a page is. Content-heavy, statically-rendered concept
   pages are indexable — and that is a real acquisition channel we otherwise do not have.
5. **ADR-003 already bought us this option.** Content is data. The 193-node graph, the 7 authored concepts
   and the misconception catalog are platform-neutral assets that survive any shell decision. This is
   exactly the optionality that decision was for; this is the moment to spend it.

### Why native still happens (Phase 5+)

Mathigon is a website, and it **abandoned** the native/offline surface — Android app off the Play Store, iOS
stale. That vacated lane is still the strongest structural opening we found, and it is only reachable with a
native app. Budget-Android animation performance — the reason ADR-001 rejected webview stacks — remains real
**at scale**, with many widgets and dense scenes. It is not a problem for a handful of widgets on a modern
phone browser, which is what the web product needs first.

### Web stack

| Concern | Choice | Why |
|---|---|---|
| Site shell | **Astro** | Islands architecture: concept pages ship as static HTML with **zero JS by default**, and only the widget hydrates. Content-heavy + SEO-critical + interactive islands is precisely Astro's shape. |
| Widgets | **TypeScript + Canvas 2D** | Full pixel control, no framework overhead in the hot path. Implements the same specs in `docs/widgets/` as the Flutter widgets will. |
| Offline | **PWA + service worker** | Keeps the offline-first principle honest on web. Precache the content bundle. |
| Local progress | **IndexedDB** | Same role Drift plays natively. |
| Content | **same YAML → compiled JSON pipeline** | One source, two consumers. The pipeline is the shared asset. |

**Explicitly rejected: Flutter web.** Heavy output, CanvasKit download cost, and SEO-invisible — which would
forfeit the single biggest reason to ship web first. Using it "to share code" would defeat the purpose.

### The honest cost

**Two widget implementations.** The *specs* in `docs/widgets/` are shared and they were the expensive part;
the rendering code is not shared. We accept that duplication deliberately, in exchange for reaching both the
open web (where discovery lives) and the native/offline lane (which Mathigon vacated).

**The mitigation that matters:** keep the engine logic — graph traversal, FSRS scheduling, misconception
matching, practice generation — as pure, data-driven functions with no rendering dependency. That is the
part worth porting carefully once; the widgets are the part that must be native to each platform anyway.

---

## ADR-002 — Native (Flutter) stack — Phase 5+

| Concern | Choice | Why |
|---|---|---|
| State | **Riverpod** | compile-safe, testable without widgets, no BuildContext games |
| Routing | **go_router** | deep links → a concept URL works on every platform |
| Local DB | **Drift** + `drift_flutter` (^0.3.1) | typed queries, runs on all 5 targets, offline-first. *Use `drift_flutter`, not `sqlite3_flutter_libs` — pub.dev marks the latter `+eol`.* |
| Math typesetting | **flutter_math_fork** | LaTeX rendering, offline |
| Animation | native `AnimationController` + custom `CustomPainter` | no dependency needed |
| Serialization | `freezed` + `json_serializable` | content schema safety |
| Tests | `flutter_test` + **`alchemist`** (^0.14.0) | **golden tests on widgets** — a math diagram that renders wrong is a silent content bug. *Amended 2026-09-17: originally specced `golden_toolkit`, which is **discontinued** — last release 2023-02-21, flagged on pub.dev. `alchemist` serves the same purpose and is current.* |

## ADR-003 — Content is DATA, not code

The single most important architectural decision after ADR-001.

```
content/
  concepts/
    arithmetic/fractions-as-parts.yaml
    algebra/balance-scale-equations.yaml
  graph/prerequisites.yaml
  practice/generators/
```

A concept is a **YAML file** — declaring its 6 layers, which widgets to mount, with what config, and how to
generate practice items. It is compiled at build time into a binary bundle.

**Why this matters:**
- Content scales without touching Dart. Authoring ≠ engineering.
- Translation (Hindi/regional) becomes a data problem, not a rewrite.
- Content can ship **over-the-air**, bypassing app-store review for curriculum fixes.
- An LLM pipeline can draft concepts at volume for human review — the only way one person reaches 500 concepts.

**Corollary:** if adding a concept requires writing Dart, the engine has a bug.

## ADR-004 — The Knowledge Graph is the backbone

Concepts form a DAG: `prerequisites → concept → unlocks`.

It drives four things at once:
1. The **learning path** (what's next for *this* learner)
2. **Root-cause diagnosis** — "you're not failing at algebra, you're shaky on negative numbers"
3. The **map UI** — seeing math as one connected object, not 12 disconnected chapters
4. **Spaced repetition** scheduling (FSRS), weighted by how many things depend on a node

This is also where the existing `/graphify` tooling plugs in.

## ADR-005 — Platform build & distribution matrix

| Target | Built where | Blocker to clear | Distribution |
|---|---|---|---|
| **Android APK** | this Mac | install Android SDK | direct APK + Play Store |
| **macOS** | this Mac | install **full Xcode** | direct .dmg + Mac App Store |
| **iOS** | this Mac | full Xcode + CocoaPods + Apple Dev ($99/yr) | TestFlight → App Store |
| **Windows** | ⚠️ **GitHub Actions `windows-latest`** | none — CI from day 1 | .msix / installer |
| Linux | GitHub Actions `ubuntu-latest` | none | free, low priority |

**CI is not a "later" task.** With no Windows machine in the room, GitHub Actions *is* the Windows build
machine. It gets set up in Phase 0, not Phase 6.

### Android distribution reality (added 2026-09-17 — this changes an assumption above)

Two 2026 policy shifts make "direct APK + Play Store" less simple than this ADR assumed. Both are **calendar
dependencies**, which is the dangerous kind — they cannot be fixed by working harder closer to launch.

1. **Android Developer Verification is mid-rollout.** Sideloaded APKs will require a *verified developer*.
   Live in 4 countries as of Sept 2026, going global through 2027. Our direct-APK path — which matters
   precisely because a budget Android phone is the declared design target — **will not stay frictionless.**
   Action: enrol early. Free, but it has its own lead time.
2. **Google Play's 12-tester / 14-day closed-testing requirement** applies to new personal developer
   accounts, which ours will be. It is a queue you must *start*, not a review you can wait out.
   Action: seed it from the Phase 1 exit gate's 5 human testers and recruit the rest alongside — that turns
   a blocking dependency into a by-product of work already scheduled.

Corrected while here: **Microsoft Store individual registration is now free** (was $19), so that cost line is $0.

## Widget kit — the reusable core

~15 primitives cover the overwhelming majority of school + early-college math:

**Number & arithmetic:** `NumberLine` · `AbacusBoard` (Soroban) · `AreaModel` · `FractionBar`
**Algebra:** `BalanceScale` · `FunctionGrapher` (live parameter sliders) · `MatrixTransform`
**Geometry & trig:** `GeometryCanvas` (compass/straightedge, drag-invariant) · `UnitCircle`
**Probability:** `ProbabilitySimulator` (dice/coins/spinners, live frequency convergence)
**Logic:** `TruthTable` · `LogicGates` · `SetDiagram` (interactive Venn)
**Algorithms:** `StepperMachine` (sorting/GCD/search with tape + stack view)
**Calculus & physics:** `CalculusZoom` (local linearity, Riemann sums) · `VectorField`

Each is a Dart class driven by declarative JSON config — so content YAML composes them without new code.
