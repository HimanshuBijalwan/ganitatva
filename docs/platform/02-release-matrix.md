# Ganitatva — Release Matrix

Per-platform signing, store, cost and timeline requirements, plus the recommended release order.
Facts below were verified 2026-09-17 (search + official docs) — re-check before the actual submission,
store policy and fee changes are not rare (see the Android sideloading item below, which is *mid-rollout*
right now).

## Summary table

| Platform | Signing | Store account cost | Review gate | Typical review time |
|---|---|---|---|---|
| **Android — sideload/direct APK** | Debug-signed OK for testers; real upload key recommended before wide distribution | **Free**, but see ⚠️ Developer Verification below | None today, but see ⚠️ below | N/A |
| **Android — Google Play** | Play App Signing (Google holds the app signing key; you keep an upload key) | **$25 one-time** | Human + automated policy review, **plus a mandatory 12-tester / 14-day closed test** for new personal accounts before production access | Closed test: 14 days minimum (calendar time, not review queue). Production review after that: hours–days |
| **iOS — TestFlight internal** | Automatic signing via Xcode, Apple Developer membership | Shared with macOS — see below | None (internal testers only, up to 100 by Apple ID) | Minutes |
| **iOS — TestFlight external / App Store** | Same membership; distribution certificate + provisioning profile | **$99/yr** (Apple Developer Program — individual or org) | Beta App Review (external TestFlight) + full App Store Review (production) | Beta Review: ~15–17 hrs typical, up to multi-day in busy periods. App Store Review: 90% within 48 hrs, avg ~1.5 days, 2–5 days for flagged/complex apps; **has spiked to 7–30 days during reported 2026 congestion periods** |
| **macOS — direct .dmg** | Developer ID Application cert + notarization (`notarytool`) | **$0 extra** — same $99/yr Apple Developer Program as iOS | Notarization is automated (no human review) | Typically minutes |
| **macOS — Mac App Store** | App Store distribution cert, App Sandbox entitlements | $0 extra (same membership) | Same App Store Review queue as iOS | Same as iOS App Store figures above |
| **Windows — direct .exe/.msix** | Optional but recommended: Authenticode code-signing cert (unsigned = SmartScreen "unknown publisher" warning) | **$0** for the exe itself; a code-signing cert from a CA runs roughly **$70–400+/yr** depending on vendor/type | None — you control distribution | N/A |
| **Windows — Microsoft Store (MSIX)** | Store signs the package for you — no separate cert purchase needed | **$0** — individual developer registration fee was waived (was $19; free as of the current Microsoft Partner Center onboarding flow). Company accounts: $99 one-time | Microsoft Store certification | ~1–3 business days typical |
| **Linux — direct (.tar.gz / AppImage / GitHub Release)** | None required | $0 | None | N/A |
| **Linux — Flathub / Snap Store** | None required (store does its own build sandboxing, not a paid gate) | $0 | Community/automated review (Flathub), automated (Snap) | Days, community-dependent, low priority per ADR-005 |

---

## ⚠️ Two 2026 policy changes that materially affect ADR-005's "direct APK + Play Store" plan

These aren't hypothetical — they're mid-rollout right now and change the actual cost/timeline picture for
Android, which ADR-005 currently treats as the least-gated platform.

### 1. Android Developer Verification (sideloading is no longer a zero-gate path)

Google is rolling out a requirement that **only verified developers' apps can be installed on certified
Android devices — including sideloaded APKs and third-party stores, not just Google Play.** Verification
opened to all developers in March 2026. The requirement is **already live** in Brazil, Indonesia, Singapore
and Thailand as of September 2026, and Google's stated plan is global rollout through 2027. Unverified-
developer APKs will still install, but through a deliberately frictioned path (an "advanced installation
flow" with a 24-hour wait, or ADB) — Google has said a separate, lighter workflow is planned for students
and hobbyists, details of which are still emerging.

**Implication for this project:** "direct APK" distribution, as written in ADR-005, will not stay
frictionless for the life of this project. **Recommendation: register for Android Developer Verification
early (Phase 0–1), even before there's anything to distribute.** It's free, but identity verification has
its own lead time — better to have it done before Phase 3's beta cohort needs a friction-free install.

### 2. Google Play's 12-tester / 14-day closed testing requirement is a real calendar dependency

Any Play Console **personal account created after 2023-11-13** (i.e., almost certainly this project's
account) must run a closed test with **at least 12 testers opted in continuously for 14 consecutive days**
before Google will grant production access — per app. This is not a review-queue wait; it's a minimum
calendar duration that only starts once 12 real testers have actually opted in and stayed opted in.

**Implication for scheduling:** this 14-day clock should start **well before** the intended Play Store
launch date, not the week before. The Phase 1 exit gate already calls for 5 human testers
(`docs/02-PLAN.md`) — that's a natural seed group; grow it to 12+ opted-in testers as early as Phase 2 so
the 14-day window is already satisfied by the time Phase 3's ~180-concept content milestone is ready to go
public. (Org/business Play Console accounts and accounts created before 2023-11-13 are exempt — not
applicable here.)

---

## Signing & compliance notes by platform

### Android
- Generate a real upload keystore before any wide distribution (`keytool -genkeypair -v -keystore upload-keystore.jks ...`); **never commit it** — store it as a GitHub Actions secret (`ANDROID_KEYSTORE_BASE64`, `ANDROID_KEYSTORE_PASSWORD`, etc.) once signing is wired into `.github/workflows/build.yml`. Not wired yet — the current `android` job intentionally ships Flutter's default debug-signed release build, which is fine for an internal/CI-artifact APK but not for Play Store.
- Because the audience is school students 11–16, Play Console's **Target audience and content** declaration and **Data Safety** form are mandatory and will need honest, specific answers (this app collects no account data and has no backend, which makes both forms simple to fill out truthfully — a direct dividend of the "no in-app AI, fully offline" decision in `.claude/memory/decisions.md`). A privacy policy URL is required even for a data-free app.

### iOS / macOS
- Start Apple Developer Program enrollment as an **individual** account, not organization — org accounts need a D-U-N-S number lookup/verification that adds real lead time; individual enrollment is typically near-instant once the $99 fee clears. Switch to an org account later only if a registered company name is a hard requirement (e.g., for trademark reasons).
- Enrollment is free to *start* (just needs an Apple ID) — begin it in Phase 0, in parallel with the Xcode download in `docs/platform/00-setup-runbook.md`, since both need the same Apple ID login moment.
- App Sandbox entitlements are required for Mac App Store distribution (not for direct .dmg). Drift's database file lives under the app's own documents directory via `drift_flutter`, which is sandbox-compatible by default — no expected engineering cost here, but verify once the scaffold exists.
- Because the audience includes under-16 users, expect Apple's standard age-rating questionnaire (12+ likely, given no user-generated content, no chat, no ads) and the Privacy Nutrition Label. Given "no in-app AI, fully offline, no backend" (ADR + decision log), this should be one of the simplest privacy labels possible to fill out truthfully.

### Windows
- Ship early via GitHub Actions artifacts / GitHub Releases (already what `windows` job in `build.yml` produces) — no gate at all for this.
- For a public release, prefer the **Microsoft Store (MSIX)** path over buying a standalone Authenticode certificate: individual registration is now free, the Store signs the package for you, and it gets auto-update plumbing for free. A direct-download .exe remains useful for testers who don't want a Store account, accepting the SmartScreen "unknown publisher" click-through until the app has enough Store reputation.

### Linux
- No signing or store gate blocks anything. Ship the CI-produced `build/linux/x64/release/bundle/` as a GitHub Release asset immediately; Flathub/Snap listings are a nice-to-have, correctly deprioritized per ADR-005.

---

## Recommended release order

Given the summary above, **iOS App Store production is the single most gated release** — it's the only
one combining a paid enrollment *with real lead time*, a two-stage human review (Beta + full App Store), and
the strictest policy bar for an app aimed at minors. Everything else either has no gate, a cheap one-time
fee, or a gate that runs in parallel with other work rather than blocking it. Sequence accordingly:

1. **Linux + Windows, informal (GitHub Releases)** — Phase 0, day one. Already what the CI in
   `.github/workflows/build.yml` produces. Zero cost, zero gate.
2. **Android, sideload APK to real testers** — Phase 0–1. Start Android Developer Verification enrollment
   now (⚠️ above) so it's done long before it might become mandatory.
3. **Apple Developer Program enrollment (individual)** — start Phase 0, in parallel with step 2. Unlocks
   both iOS and macOS later at no extra cost. This is the step with the least control over lead time
   (identity verification), so starting it earliest is the highest-leverage scheduling move in this whole
   document.
4. **iOS TestFlight internal** — as soon as step 3 clears and the scaffold produces a signed archive
   (Phase 1). No review gate; ideal vehicle for the Phase 1 human exit-gate testers who use iPhones.
5. **macOS direct .dmg, notarized** — Phase 1–2, once step 3 clears. Notarization is automated, so this is
   effectively gate-free once the Apple Developer membership exists.
6. **Google Play Console account + start the 12-tester/14-day closed test** — open the account and begin
   recruiting testers as early as Phase 1–2 (⚠️ above) so the 14-day clock is already satisfied well before
   the Phase 3 content milestone. $25 one-time.
7. **Google Play production release** — once the 14-day closed test completes and content is ready
   (realistically aligned with Phase 3's ~180-concept milestone, `docs/02-PLAN.md`).
8. **Microsoft Store (MSIX)** — Phase 2–3, whenever packaging time allows; free, low lead time, not
   urgent relative to the mobile platforms.
9. **macOS Mac App Store** — Phase 3+, once the direct-.dmg experience is validated; adds sandboxing work
   and a review queue for marginal reach gain over direct distribution.
10. **iOS TestFlight external, then App Store production** — last, deliberately. Start the Beta App Review
    submission as soon as there's a real build worth outside eyes on (don't wait for Phase 3 completeness),
    because this queue is the one most likely to run long, and starting it early is the only lever available
    against Apple's queue times.
11. **Linux — Flathub/Snap** — anytime after step 1, genuinely low priority per ADR-005; no scheduling
    pressure.
