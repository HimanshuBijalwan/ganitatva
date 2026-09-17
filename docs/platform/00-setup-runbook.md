# Ganitatva — Phase 0 Setup Runbook

> Goal: this bare Mac → `flutter doctor` fully clean for all 5 targets (Android, iOS, macOS, Windows, Linux).
> Owner: operator (human). This agent does **not** run installers or modify the machine — every command
> below is for you to run, in order, with verification after each step.
>
> Ground truth checked 2026-09-17 (see `docs/01-ARCHITECTURE.md` and `.claude/memory/dev.md`):
> macOS 26.6.2, Apple Silicon (arm64). **Present:** Homebrew 7.0.2, Java 17.0.16 (Homebrew OpenJDK), git,
> gh, Rosetta 2. **Absent:** Flutter/Dart, full Xcode (only Command Line Tools at
> `/Library/Developer/CommandLineTools`), Android SDK, CocoaPods.
>
> **Shell gotcha:** on this machine `head` resolves to Perl LWP's HTTP client, not coreutils. Every
> verification snippet below uses `/usr/bin/head` or `sed -n` instead.

## 0. Read this first — the shape of the work

Two platforms need **zero local installation**: Windows and Linux build entirely in GitHub Actions
(`windows-latest`, `ubuntu-latest` — see `.github/workflows/build.yml`). This machine only needs to become
doctor-clean for **Android + iOS + macOS**. That collapses the real local critical path to two tracks:

| Track | Blocks | Longest pole |
|---|---|---|
| **A — Apple toolchain** | iOS, macOS | Full Xcode, ~10–13 GB, App Store login required |
| **B — Android toolchain** | Android | Android Studio + SDK, ~4–6 GB, licence acceptance required |
| **C — Flutter SDK itself** | all 5 | ~1 GB, no login, fast — do this first, it's on nobody's critical path |
| **D — Windows / Linux** | — | **nothing to do here** — CI is the build machine |

Tracks A and B do not depend on each other. **Start both downloads in the same sitting** (step 2 and step 5
below) so they run in the background together — this is the single biggest time-saver in Phase 0.

## 1. Legend

- 🌐 **App Store / Apple ID login required** — must be attended for ~1 minute to start
- 📦 **Large download** — safe to background; keep working on other Phase 0 tasks (design doctrine, content
  schema, repo setup — all owned by other agents/tracks and have no toolchain dependency)
- ✅ **Verify** — run immediately after the step; do not proceed past a failing verification

---

## Track C — Flutter SDK (do this first; ~5 min hands-on, ~5–10 min download)

### 1. Clone the Flutter SDK (stable channel)

```bash
mkdir -p ~/development
cd ~/development
git clone -b stable --depth 1 https://github.com/flutter/flutter.git
```

Why `git clone` over the Homebrew cask or a manual zip: it lets you pin the exact same version CI uses
(`subosito/flutter-action` in `.github/workflows/build.yml` pins `flutter-version: 3.47.4`), and it avoids
macOS Gatekeeper's quarantine flag that a browser-downloaded zip carries (which would otherwise block
first-run with "cannot be opened because the developer cannot be verified").

To match CI exactly instead of tracking stable's head:
```bash
cd ~/development/flutter
git fetch --depth 1 origin tag 3.47.4
git checkout 3.47.4
```

### 2. Add Flutter to PATH

```bash
echo 'export PATH="$HOME/development/flutter/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

✅ **Verify:**
```bash
flutter --version
# expect: Flutter 3.47.4 • channel stable • Dart 3.13.3
which flutter   # should resolve under ~/development/flutter/bin, not a Homebrew shim
```

### 3. Pre-cache platform artifacts

```bash
flutter precache --android --ios --macos --windows --linux
```
This downloads Flutter's per-platform engine artifacts (~200–400 MB). It does **not** require Xcode or the
Android SDK to be installed yet — it can run before Tracks A/B finish.

✅ **Verify:** command exits 0, no red error lines.

### 4. Confirm desktop platforms are enabled

Desktop support (macOS/Windows/Linux) has been GA and enabled by default since Flutter 3.x — you should not
need to touch `flutter config`. Confirm:
```bash
flutter config
```
✅ **Verify:** `enable-macos-desktop`, `enable-windows-desktop`, `enable-linux-desktop` all read `true`
(or don't appear as disabled). If any read `false`, run
`flutter config --enable-macos-desktop --enable-windows-desktop --enable-linux-desktop`.

---

## Track A — Apple toolchain (iOS + macOS): full Xcode, CocoaPods

### 5. 🌐📦 Start the full Xcode download NOW — this is the longest pole in Phase 0

Two ways to get it; either needs an Apple ID signed in:

**Option A — Mac App Store (simplest):**
Open the App Store app → sign in with an Apple ID → search "Xcode" → Install.

**Option B — developer.apple.com (lets you pin an exact version, and you'll need this login anyway
for the $99/yr Apple Developer enrollment later — see `docs/platform/02-release-matrix.md`):**
```bash
open "https://developer.apple.com/download/all/?q=Xcode"
```
Sign in, download the `.xip` for the current Xcode release matched to macOS 26.6.x, then double-click to
expand it and drag `Xcode.app` to `/Applications`.

**Size/time:** ~10–13 GB compressed. On typical broadband this is 30–90 min of background download —
**start it now and go do something else** (design-doctrine pass, content schema, repo setup — none of that
touches the toolchain).

✅ **Verify (once installed):**
```bash
ls /Applications/Xcode.app  # exists
```

### 6. Switch the active developer directory from CLT to full Xcode

Right now `xcode-select -p` points at `/Library/Developer/CommandLineTools`. This is the #1 source of
confusing build failures on a fresh Apple Silicon setup (`xcrun: error: unable to find utility "X", not a
developer tool or in PATH`). Fix it explicitly:

```bash
sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer
sudo xcodebuild -license accept
```

✅ **Verify:**
```bash
xcode-select -p     # /Applications/Xcode.app/Contents/Developer
xcodebuild -version  # prints an actual Xcode version, no longer errors
```

### 7. 📦 First-launch components + iOS Simulator runtime

Xcode ships without a simulator runtime pre-attached in recent versions — it's a separate multi-GB download.

```bash
sudo xcodebuild -runFirstLaunch
xcodebuild -downloadPlatform iOS
```

**Size/time:** first-launch components are a few hundred MB; the iOS Simulator runtime is commonly
**4–7 GB** on current Xcode releases. Background this too.

✅ **Verify:**
```bash
xcodebuild -checkFirstLaunchStatus
xcrun simctl list runtimes   # at least one iOS runtime listed
```

### 8. CocoaPods — via Homebrew, not `sudo gem install`

Apple Silicon + System Integrity Protection routinely breaks `sudo gem install cocoapods` with
`Gem::FilePermissionError` because SIP blocks writes to the system Ruby gem paths. Skip that path entirely:

```bash
brew install cocoapods
```

CocoaPods ≥1.8 uses a CDN for the specs repo by default, so there's no multi-GB `master` repo clone anymore
— this step is fast (well under a minute).

✅ **Verify:**
```bash
pod --version
```
**Known failure mode:** if a later `pod install` in the Flutter project fails with "unable to find a
specification," run `pod setup` once and retry.

### 9. macOS build sanity check

```bash
cd ~/development/flutter/examples/hello_world   # or any scratch Flutter project once scaffolded
flutter build macos --release
```
Not required to be a real project yet — this step is really just "does `flutter doctor` clear the macOS
section." Full verification happens once the actual scaffold exists (`docs/platform/01-scaffold-plan.md`).

---

## Track B — Android toolchain

### 10. 📦 Download Android Studio — Apple Silicon build specifically

```bash
open "https://developer.android.com/studio"
```
**Download the "Mac (Apple Silicon)" `.dmg`, not the Intel one.** Picking the Intel build silently works
(via Rosetta) but runs the whole IDE emulated — much slower for no benefit on this machine. Install by
dragging to `/Applications`, then launch it once and complete the setup wizard (it will download SDK
platform, platform-tools, build-tools, and — if you opt in — an emulator system image).

**Size/time:** installer ~1.1 GB; SDK components pulled by the wizard ~3–5 GB more depending on whether you
install an emulator image. This can run **at the same time** as the Xcode download in step 5 — they don't
compete for anything except your network bandwidth.

✅ **Verify:**
```bash
ls "/Applications/Android Studio.app"
ls ~/Library/Android/sdk   # created once the wizard finishes
```

### 11. Accept Android SDK licences (needed even if you used the GUI wizard)

```bash
yes | flutter doctor --android-licenses
```
(`yes |` because this prompt needs a TTY and will hang under non-interactive automation — do this one in a
real terminal, attended.)

✅ **Verify:** `flutter doctor --android-licenses` reports "All SDK package licenses accepted."

### 12. Point Flutter at a known-good JDK

Android Gradle Plugin 8.x requires JDK 17+. This machine already has Homebrew OpenJDK 17.0.16 — but Android
Studio also bundles its own JDK, and having two on the machine is a classic source of `flutter doctor`
picking the wrong one silently. Pin it explicitly to Android Studio's bundled JDK (most robust option,
matches what the IDE itself uses):

```bash
flutter config --jdk-dir="/Applications/Android Studio.app/Contents/jbr/Contents/Home"
```

✅ **Verify:**
```bash
flutter doctor -v | grep -A2 "Java version"
```

### 13. Android build sanity check

```bash
flutter build apk --release --split-per-abi   # once the real scaffold exists
```

**Known Apple Silicon emulator gotcha (only if you use an emulator instead of a real phone):** in AVD
Manager, choose a **"Google APIs ARM64 v8a"** system image, not x86_64. x86_64 images run emulated under
Rosetta inside the emulator's own emulation layer — slow and occasionally unstable. The exit-gate criterion
in `docs/02-PLAN.md` ("APK installs on a real phone") is actually the *faster* path here: enable USB
debugging on any Android phone, plug it in, and skip the emulator entirely.

```bash
flutter devices        # phone should appear once USB-debugging is enabled and the cable is trusted
flutter install         # or: flutter run -d <device-id>
```

---

## Track D — Windows + Linux

**Nothing to install locally.** Both build exclusively in `.github/workflows/build.yml` on GitHub-hosted
runners (`windows-latest`, `ubuntu-latest`). The first `git push` after the scaffold exists is the
verification step — check the Actions tab for green `windows` and `linux` jobs and downloadable artifacts.

---

## 14. Final check — all 5 targets

```bash
flutter doctor -v
```

✅ **Exit criterion for this runbook:** every relevant section reports no `[✗]` lines:
- `[✓] Flutter`
- `[✓] Android toolchain`
- `[✓] Xcode - develop for iOS and macOS`
- `[✓] Connected device` (a real Android phone, or a macOS/iOS simulator target — at least one)

Ignore any `[!] Chrome` / web-tooling warning — **Flutter web is explicitly out of scope** (ADR-001: the
public marketing/SEO surface is a separate lightweight site, not Flutter web).

---

## Known failure modes on Apple Silicon (reference table)

| Symptom | Cause | Fix |
|---|---|---|
| `xcrun: error: unable to find utility "X"` | `xcode-select` still points at Command Line Tools | `sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer` |
| `Gem::FilePermissionError` installing CocoaPods | SIP blocks writes to system Ruby gem paths | `brew install cocoapods` instead of `sudo gem install` |
| Xcode license / first-launch step hangs or is silently skipped | Ran without `sudo`, or no network for first-launch component fetch | `sudo xcodebuild -runFirstLaunch`; check `xcodebuild -checkFirstLaunchStatus` |
| `pod install` fails: "unable to find a specification" | Local pod spec cache not initialized | `pod setup`, then retry |
| `flutter doctor --android-licenses` hangs | No TTY (running under a script/CI-like context) | Run interactively; or `yes \| flutter doctor --android-licenses` |
| Gradle build picks wrong JDK / version mismatch errors | Two JDKs on machine (Homebrew + Android Studio bundled) | `flutter config --jdk-dir=".../Android Studio.app/Contents/jbr/Contents/Home"` |
| Android emulator painfully slow or won't boot | x86_64 system image on Apple Silicon | Use an ARM64 ("Google APIs ARM64 v8a") system image, or skip the emulator and use a real phone |
| "cannot be opened because the developer cannot be verified" on the Flutter SDK itself | SDK was downloaded as a zip via browser (quarantine flag) | Use `git clone` (no quarantine flag) as in step 1, or `xattr -dr com.apple.quarantine <path>` |
| Android Studio IDE feels sluggish for no reason | Downloaded the Intel `.dmg`, running under Rosetta | Re-download the "Mac (Apple Silicon)" build explicitly |
| `flutter build ios` fails with missing simulator runtime | Xcode installed but iOS platform not downloaded (newer Xcode splits this out) | `xcodebuild -downloadPlatform iOS` |

## Size & time budget (planning number, not a promise)

| Item | Size | Notes |
|---|---|---|
| Full Xcode | ~10–13 GB | 🌐 App Store login to start |
| iOS Simulator runtime | ~4–7 GB | separate download, post-install |
| Android Studio + SDK components | ~4–6 GB | 🌐 no login, but licence acceptance is attended |
| Flutter SDK (shallow clone) | ~1 GB | no login |
| CocoaPods + misc | <100 MB | — |
| **Total download** | **~20–27 GB** | |

**Wall clock:** on a typical broadband connection, pure download time is roughly 30–60 minutes if Tracks A
and B run concurrently in the background. Add attended time for licence acceptance, first-launch steps, and
verification commands — realistically **~45 min to 1.5 hrs of hands-on time across a 2.5–4 hr elapsed
window**, consistent with `docs/02-PLAN.md`'s own Phase 0 estimate ("~3 hrs of work, several hours of
downloading"). The two big downloads (step 5, step 10) should be the very first thing you kick off in Phase
0 — everything else in this runbook, and all of Track D, has no dependency on them finishing.
