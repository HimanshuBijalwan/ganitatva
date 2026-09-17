# Ganitatva — Dev Domain Memory

## Environment facts (verified 2026-09-17)
- macOS 26.6.2, Apple Silicon arm64
- Present: Node 25.6.1, npm 11.9.0, pnpm 10.33.0, Python 3.14.6, Java 17 (OpenJDK), git 2.54, gh 2.95
- Absent: Flutter, Dart, Rust/cargo, CocoaPods, cmake, bun
- **Xcode: Command Line Tools only** (`/Library/Developer/CommandLineTools`) — full Xcode required for BOTH
  iOS and macOS Flutter builds. ~10 GB App Store download; schedule it early.
- **No Android SDK** at `~/Library/Android/sdk`
- **No Windows machine** → Windows builds must come from GitHub Actions `windows-latest`

## Gotchas logged
- On this machine `head` resolves to Perl LWP's HTTP tool, NOT coreutils.
  Always use `/usr/bin/head`, `sed -n '1,Np'`, or `awk 'NR<=N'` in pipelines and scripts.

## Testing stance
- **Golden tests are load-bearing here**, not optional polish. A math diagram that renders subtly wrong is a
  silent content bug that no unit test catches and no user reports — they just quietly fail to understand.
  Every widget primitive gets golden coverage before it's considered done.

## Widget kit base contract (settled 2026-09-17)
`GanitatvaWidget<C extends WidgetConfig, S extends WidgetState>` — immutable build-time-validated config;
persisted/ephemeral state split; a `WidgetEvent` stream emitting RAW interactions only (never pedagogical
judgments — those live in concept YAML `practice.misconceptions`); mandatory `describeState()` returning a
full sentence, treated as a second rendering target.

Config convention: widget-specific fields nest under `config`; reserved cross-widget keys are `id`,
`interaction_level` (readOnly|guided|free), `seed`, `a11y`. Requires no schema change — `$defs/widget.config`
is an open object.

Kit-wide binding rules:
- **Snapping is mandatory** wherever a value has an exact mathematical answer. No "eyeball it" placement —
  an imprecise drag that reads as correct teaches the wrong thing.
- **Zoom always has a non-pinch +/- fallback** — one-handed phone use is the design target.
- **44pt is a hard floor**, enforced by restructuring layout (stack, tab, stepper) — never by shrinking below it.
- **Colour is never the sole carrier of meaning.** Every spec names its paired non-colour signal (hatch
  orientation, shape, dash pattern, position, icon glyph).

Hardest widget to build: **FunctionGrapher** (depth — sandboxed evaluator + inverse-math for on-curve
dragging + three-way synchronized state). Second: **StepperMachine** (breadth — six algorithm state machines,
deterministic rewind, recursion call-stack modeling).
Possible shared engine later: CalculusZoom + UnitCircle reuse FunctionGrapher's viewport/curve machinery.

## Toolchain pins corrected 2026-09-17 (platform agent; verified by main against pub.dev)
- **`golden_toolkit` is DISCONTINUED** — last release 2023-02-21, flagged discontinued on pub.dev.
  ADR-002 had specced it. Replaced with **`alchemist` ^0.14.0** (published 2026-03-13, current).
- **Use `drift_flutter` ^0.3.1**, not `sqlite3_flutter_libs` (marked `+eol` on pub.dev).
- Verified stack at time of writing: Flutter 3.47.4 / Dart 3.13.3.
- CocoaPods: install via `brew install cocoapods`, **NOT** `sudo gem install` — the latter breaks on Apple
  Silicon under SIP.

## Phase 0 setup: actual shape of the work
Windows and Linux need **zero local setup** — they build entirely on GitHub Actions. The local critical path
is two INDEPENDENT tracks that should be started in the same sitting so their downloads overlap:
- **Track A (Apple):** full Xcode (App Store login, ~10–13GB) → iOS Simulator runtime (~4–7GB) → CocoaPods
- **Track B (Android):** Android Studio (~1GB) → SDK components (~3–5GB) → `flutter doctor --android-licenses`
Flutter SDK itself (~1GB, `git clone -b stable --depth 1`) is on nobody's critical path — do it first, it's fast.
Total ~20–27GB, ~2.5–4 hrs elapsed but only ~45min–1.5hrs hands-on.

## CI cost shaping
Expensive macOS/Windows runners are gated behind a cheap `content-validate` → `analyze` chain on
`ubuntu-latest`, so bad YAML fails in under a minute instead of after minutes of costly runner time.
