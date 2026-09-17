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
