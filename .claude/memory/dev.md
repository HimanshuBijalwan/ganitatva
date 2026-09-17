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
