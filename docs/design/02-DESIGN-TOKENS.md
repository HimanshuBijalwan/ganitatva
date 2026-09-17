# Ganitatva — Design Tokens & Build Rules
**The numbers behind `00-ART-DIRECTION-BRIEF.md`.** Owner: design-director · 2026-09-17.
Binding on theme-dev and on every widget spec in `docs/widgets/`. If a value here disagrees with a widget spec, this file wins on *appearance* and the widget spec wins on *pedagogy* — see §9 for the rulings where they actually collided.

---

## 1. The bench unit (`bu`)

| | Touch platforms (Android, iOS) | Pointer platforms (macOS, Windows, Linux) |
|---|---|---|
| 1 bu | **4.0 mm** | **6.8 mm** |
| ≈ logical px | ≈ 25 dp | ≈ 26 px @96dpi Windows · ≈ 19 pt macOS *(verify per platform)* |
| Why | Hobonichi ruling pitch (3.7–4 mm), arrived at by eye-strain research | Same **visual angle** at ~60 cm viewing distance vs ~35 cm in the hand |

**Resolution rule:** `bu` is resolved **once**, in a single `BenchMetrics` provider, from **input modality and viewing distance — never from an OS check**. Widgets consume `bu` as a number and never ask which platform they are on. (This satisfies `docs/widgets/00-kit-overview.md` §5 rule 4.)

**The ruler test — mandatory QA gate.** Render a 10-bu ruler on each of the five platforms and measure it against a real ruler. **Phone: must read 40 mm.** If it does not, the metric is wrong and the build is wrong. Flutter does not expose true physical DPI reliably everywhere; this test is how we find out.

| Measure | Value |
|---|---|
| Object width: minimum / preferred / maximum | **14 bu / 20 bu / 28 bu** |
| Below minimum | Horizontal scroll. **Never shrink** — a shrunk number line is a broken number line. |
| Above maximum | Extra space becomes bench margin + marginalia. **Never a bigger object.** |
| Bead / drag handle diameter | 2.4 bu (≈ 60 dp on touch) |
| Object outline stroke | 0.2 bu |
| Minor ruling pitch | 1 bu |
| Major ruling pitch | 5 bu |
| Minor tick length | 0.4 bu · Major tick 0.8 bu |
| Tick label cap-height | ≥ 0.45 bu |
| Contact shadow offset | ≤ 0.15 bu (see §6) |

**Chrome spacing** (padding, gaps, margins) uses a plain 4-dp scale — `4 · 8 · 12 · 16 · 24 · 32 · 48 · 64`. Bench margin: 16 dp phone, 24 dp medium, then fluid. Text column max 640 dp.

---

## 2. Colour — light mode

| Token | Hex | Role | Contrast (computed) |
|---|---|---|---|
| `--live` | `#B4432A` | The one saturated colour. Touchable things only. | 4.93:1 on paper · 4.3:1 non-text vs sheet |
| `--live-press` | `#8F3520` | Pressed / dragging | 6.90:1 on paper |
| `--live-wash` | `#F0DED5` | Fill of the region a handle controls. **Always with a `--live` stroke** — the wash alone never carries meaning. | 1.23:1 — decorative by construction |
| `--paper` | `#F5F1E8` | App background (the bench) | — |
| `--sheet` | `#FBF8F1` | Working surface under a math object | — |
| `--sunk` | `#E9E3D6` | Wells, insets, inactive, contact shadow | — |
| `--rule` | `#D6CEBC` | Minor ruling / gridlines | 1.48:1 — **decorative only** |
| `--rule-major` | `#B8AE99` | Major ruling / sheet edge | 2.07:1 — **decorative only** |
| `--axis` | `#8F856E` | **Axes, major ticks, any load-bearing graphical structure** | **3.44:1** — clears SC 1.4.11 |
| `--ink-900` | `#1E1B16` | Primary text, object outlines | 15.23:1 |
| `--ink-700` | `#4A443A` | Secondary text | 8.55:1 |
| `--ink-500` | `#6F6859` | Tertiary text, tick labels | **4.90:1** |
| `--qty-blue` | `#12609B` | Drawn quantity A — the only quantity hue | 6.24:1 vs sheet |
| `--qty-graphite` | `#1E1B16` | Drawn quantity B — the pencil line | 15.23:1 |
| `--qty-blue-ramp` | `#86B2D6 · #4E8CBB · #1F6BA3 · #0A4571` | Magnitude, one hue light→dark | validated §4 |

## 3. Colour — dark mode

**Selected steps, not an inverted flip.** Dark mode is *the bench under a lamp*, so it is warm near-black with a brown lean, never `#000` `[01 §2.8]`. The graphite quantity becomes **chalk** — on a dark bench you draw in chalk, not pencil. That is the material logic doing the work, not a colour trick.

| Token | Hex | Role | Contrast (computed) |
|---|---|---|---|
| `--live` | `#E0643C` | Same job, brightened to hold on dark | 4.83:1 on sheet · 5.39:1 for bench-on-live-fill |
| `--live-press` | `#C24E2A` | Pressed / dragging | — |
| `--live-wash` | `#3A241B` | Controlled region; always with a `--live` stroke | 1.16:1 — decorative by construction |
| `--paper` (bench) | `#14120F` | App background | — |
| `--sheet` | `#211D18` | Working surface | — |
| `--raised` | `#2A2520` | Wells, inactive, contact shadow | — |
| `--rule` | `#3C352C` | Minor ruling | decorative only |
| `--rule-major` | `#574E41` | Major ruling | 2.05:1 — decorative only |
| `--axis` | `#726857` | Axes, major ticks, load-bearing structure | **3.06:1** |
| `--ink-050` | `#F0EAE0` | Primary text | 14.00:1 on sheet |
| `--ink-300` | `#BDB4A6` | Secondary text | 8.17:1 |
| `--ink-500` | `#918978` | Tertiary text, tick labels | **4.83:1** |
| `--qty-blue` | `#3A8AC2` | Drawn quantity A | 4.46:1 vs sheet |
| `--qty-chalk` | `#DCD4C7` | Drawn quantity B | 11.40:1 |
| `--qty-blue-ramp` | `#2C5F85 · #3A7CA8 · #579EC9 · #8CC1E6` | Magnitude | validated §4 |

**Dark mode is a differentiator, not a checkbox.** Khan Academy's absence of one is confirmed from its own help centre, and category-wide neglect is the working hypothesis. For an offline app on a budget phone used after dark, this is cheap ground to own.

---

## 4. Colour-blind safety — how widget colours stay distinguishable

This is the one place where the category research found a **completely empty field: zero of 16 apps** showed any explicit practice for distinguishing plotted or manipulated elements safely. It is therefore treated as a differentiating requirement, not a compliance chore.

### 4.1 The four rules
1. **Never hue alone.** Every pair of drawn quantities is separated by at least **two** of: lightness, line style (solid / dashed / dotted), fill pattern (solid / 45° hatch / 135° hatch), position, or a direct label. This is already kit law (`docs/widgets/00-kit-overview.md` §7) — the two documents agree independently, which is the strongest kind of agreement.
2. **Direct-label by default.** With two or more quantities on screen, each is labelled *on or beside itself*. A legend is the fallback, never the primary.
3. **Maximum three quantities.** A fourth means the widget is teaching two things and should be two widgets.
4. **One chromatic quantity hue, plus one achromatic.** Blue and graphite/chalk. This is the strongest possible CVD position — an achromatic series is separable from any hue under every deficiency type — and it is *also* the restraint the concept wanted.

### 4.2 The measurement that produced it
Run with the data-viz palette validator (OKLab ΔE ×100 under Machado–Oliveira–Fernandes 2009 CVD simulation at severity 1.0, plus lightness band, chroma floor and WCAG contrast).

| Set | Result |
|---|---|
| Light: `--live` + `--qty-blue` (surface `--sheet`) | **ALL CHECKS PASS.** Worst pair ΔE **17.5** protan, 28.1 tritan; normal-vision 26.6 |
| Dark: `--live` + `--qty-blue` (surface `--sheet`) | **ALL CHECKS PASS.** Worst pair ΔE **19.0** protan, 31.5 tritan; normal-vision 27.7 |
| Blue ramp, light (4 steps) | **ALL CHECKS PASS** — monotone, ΔL ≥ 0.06, light end 2.12:1 |
| Blue ramp, dark (4 steps) | **ALL CHECKS PASS** — monotone, ΔL ≥ 0.06, dark end 2.46:1 |
| Adding the achromatic series as a third slot | Separation checks pass with margin (worst normal-vision ΔE 26.9). The lightness-band and chroma-floor checks flag it — **correctly and expectedly**, since both assume a hue and the validator's own scope note says "categorical palettes only". A deliberately achromatic series is out of scope for those two checks, not failing them. |

### 4.3 The finding that set the restraint
**A mid-gold third quantity was tested and rejected on measurement, not taste.** In dark mode, forcing gold into the dark lightness band pushes it toward the geru, and `#B98C1E ↔ #E0643C` separates by only **ΔE 2.0 under deuteranopia** (normal-vision 12.0, itself below the 15 floor). Two quantities a colour-blind learner cannot tell apart is a **content bug** in a math app, not a styling issue. **There is no gold in this product, and the reason is a number.**

### 4.4 What is checked before ship
- Contrast measured at the **worst-case overlap**, not the average — every place text or a mark sits on a ruled or washed surface `[06 §5]`.
- **3:1 minimum for meaningful graphical objects** — axes, ticks, control outlines, plotted lines (SC 1.4.11) `[06 §5]`. This is why `--axis` exists as a separate token from `--rule-major`: ruling may be faint, **structure may not**.
- A **visible focus indicator** on every keyboard-operable control, ≥3:1 against both the control and what is behind it (SC 2.4.7) `[06 §5]`. Flutter: a 2-dp `--axis` ring, offset 2 dp — never removed, never replaced by colour change alone.
- **Greyscale pass:** every widget's goldens render once in greyscale. If two quantities become indistinguishable, the widget fails. **[outside doctrine — my specification, and the cheapest possible CVD regression test]**

---

## 5. Type

| Role | Face | Weight / Axis | Desktop / Mobile (logical px) | Line-height |
|---|---|---|---|---|
| Display / H1 | Fraunces | 400, `opsz` 72, `SOFT` 60, `WONK` 1 | 44 / 30 | 1.12 |
| H2 | Fraunces | 500, `opsz` 36, `WONK` 0 | 28 / 22 | 1.20 |
| Body | Atkinson Hyperlegible Next | 400 | 18 / 17 | 1.55 |
| UI / label / button | Atkinson Hyperlegible Next | 500 | 15 / 15 | 1.20 |
| Tick / axis numeral | Atkinson Hyperlegible Next | 400 | 12 / 11 min, ≥ 0.45 bu cap-height | 1.0 |
| Live readout | Atkinson Hyperlegible Next | 700 | 28 / 24 | 1.1 |
| Math notation | KaTeX / Latin Modern (`flutter_math_fork`) | as shipped | matched to body x-height | — |

**Rules**
- Fraunces never below 20 px. Atkinson never above 28 px except the live readout.
- Numeric readouts use **painter-laid fixed-width slots**, so digits never reflow as a value changes — independent of whether the face ships `tnum`.
- `MediaQuery.textScaler` honoured to **200% in chrome**, clamped **1.0–1.3 inside widget interiors**. The bench margin absorbs the growth; the object does not.
- **Ship static instances** unless variable-axis rendering is verified on old Android: Atkinson 400/500/700 + Fraunces 400/500 at two optical sizes. **Font byte budget: ≤ 420 KB total, subset to Latin + the glyphs actually used.** Revisit only for the Devanagari lane, as a written amendment.
- **Licensing must be verified before implementation** — Atkinson Hyperlegible Next weight availability and OFL terms, Fraunces axes, and the KaTeX font licence as shipped. **If any fails, come back to this brief. Do not silently substitute a system font.**

---

## 6. Surface, depth and the contact shadow

**There is no elevation in this product.** No blur, no gradient, no glass, no Material elevation, no `BoxShadow` with a blur radius. (Doctrine's own teardown documents the usability cost of shipping glassmorphism at OS scale `[01 §4 Teardown 4]`.)

**One exception, and it is a material fact rather than a lighting effect: the contact shadow.** An object resting on the bench casts a **hard, flat, zero-blur** mark where it touches — the way a real object on a real table does.

| Rule | Value |
|---|---|
| Light direction | **Upper-left, 315°** — locked, a single named constant, changed in one place or not at all |
| Blur radius | **0** |
| Offset | ≤ 0.15 bu |
| Colour | `--sunk` (light) / `--raised` (dark). **One flat tone. No opacity ramp.** |
| Where | Only where an object meets a surface. **Never on chrome, never on text, never on a button.** |

**Ruling for illustration-director:** the contact shadow is approved exactly as fenced above; the 315° placeholder is now the locked token. It is not a shadow in the UI sense and must never grow into one.

**Ruled surfaces (System 8 / background chrome — scope ruling).** This belongs to theme-dev, not to the object library; illustration-director was right to leave it out. Spec:
- Ruling is drawn by a single background painter at 1 bu minor / 5 bu major, in `--rule` / `--rule-major`.
- **Hobonichi rule:** horizontal rules are **interrupted by short vertical ticks**, which the eye reads as continuous while reducing strain. This is the one borrowed drawing technique in the product and it applies to every number line, axis and ruled sheet.
- **Oversized numerals as texture:** permitted on exactly two surfaces — the concept-list header and the empty state — in `--rule-major`, never overlapping body text, never behind a widget, never animated. Zero bytes; it is paint, not an asset.

---

## 7. Motion — timings

| Move | What | Duration | Curve | Notes |
|---|---|---|---|---|
| **DETENT** | Value lands on a meaningful position: tick thickens one step, bead seats | tick ≤ 120 ms · positional settle 150–200 ms | decelerate, **no overshoot** | Optional haptic + optional wooden click (default off). No colour flash, no glow, no scale. |
| **SETTLE** | How anything arrives | 180 ms | decelerate | opacity 0.6→1 + 8 dp rise. **The un-animated state is the final state** `[06 §3]`. |
| **CARRY** | Manipulate → Formalize: the widget carries into the margin, the notation lands on it | 320 ms | standard | The product's one signature moment. Once per concept. Degrades to an instant cut below 55 fps. |

- **Press feedback visible within 0.1 s** `[04 §2]`: `--live` → `--live-press`. No ripple beyond the target, no scale, no shadow.
- **Reduced motion** (`MediaQuery.disableAnimations`): SETTLE and CARRY off entirely; DETENT keeps only its non-moving tick-weight change `[06 §3]`.
- **No scroll-driven motion of any kind.** No parallax, no reveal-on-scroll, no pinned assembly.
- **Sound:** one wooden bead click on DETENT. Default off, opt-in.
- Every animation must be **pausable, rewindable and skippable**, and the end state fully legible from a static frame (kit law, `docs/widgets/00-kit-overview.md` §6 — adopted verbatim).

---

## 8. Iconography

- **Use a word wherever a word fits.** Navigation has no icons at all. The icon set should stay under ~20 glyphs; if it grows past that, the interface has started talking in symbols, which is the thing the product exists to postpone.
- **Angle vocabulary: horizontal, vertical and 45° only** (Beck). True circular arcs permitted only where the thing is inherently round.
- **Stroke 1.5 dp at a 24-dp box** (0.0625 × box), scaling proportionally. **Square-cut terminals.** No rounded caps — rounded caps are the mascot register.
- **Outline only.** The single filled state is `--live`, and only on something touchable.
- **One set, drawn in-house, from the same painter vocabulary as the objects.** No icon library, ever. Mixed icon libraries are an instant-fail tell `[01 §1 Components]`.
- **No badge dots, no notification counts, no status pips.**

---

## 9. Cross-agent rulings

Two sibling agents shipped specs that overlap this brief. Both converged independently on colour-never-sole-carrier and first-class dark mode, which is reassuring. Where they genuinely collided, here are the rulings.

### 9.1 With `docs/widgets/00-kit-overview.md`

**R1 — `role.correct` / `role.incorrect` are removed as colour roles.**
The kit defines outcome-feedback roles paired with ✓/✗ glyphs. This brief forbids any colour, mark or sound from meaning "wrong". Ruling:
- `role.incorrect` is **deleted.** An object is never in an "incorrect" state; it is simply in *a* state. Wrongness is a property of a submitted **answer**, and answers are diagnosed in **words** in Layer 5 ("not yet — you split it into 5; the question asked for 4"). No ✗. No red. No sound.
- `role.correct` is **renamed `role.resolved`** and re-scoped to mean *the object has reached a mathematically notable state* — balanced, equal, exact. That is a truth about the object, not a judgement about the learner. Rendered as a stroke-weight step and the object's own geometry (the beam goes level, the bars align) — plus `--live` only if the learner is currently holding it. **Never green; there is no green.**

**R2 — `highlight-pulse` loses its glow and its scale.**
Renamed **`state-mark`**: expressed as a stroke-weight step and tick thickening, not a glow (a glow is a lighting effect, which the flat material language has no vocabulary for) and not a scale pulse (that is overshoot). Duration unchanged.

**R3 — the two motion vocabularies are not in competition; they govern different things.**
My three moves govern **the interface** — how screens and chrome behave. The kit's primitives govern **the mathematics** — how a quantity visibly changes. `trace-path`, `ghost-preview`, `live-morph`, `comparison-residue`, `choreographed-sequence`, `arc-swap` and `frame-slide` are **exempt from the three-move cap, because cutting them would lose the lesson** — which is precisely what the restraint clause tests for. Two riders: (a) `ghost-preview` and `comparison-residue` render in `--rule`/ink at reduced opacity, **never in a second hue**; (b) `physical-response` springs must be **damped with no visible overshoot past rest** — a bead seats, it does not bounce.

**R4 — `compact` / `expanded` are test fixtures, not layout authorities.**
Golden tests need deterministic widths; that is a *testing* requirement, not a layout one. Widgets still lay out from the width they are actually given (`LayoutBuilder`). **Any `if (tier == compact)` branch in production code is a defect.** The named tiers exist so goldens can be pinned.

**R5 — touch targets are 48 dp, not 44.** Ours are *dragged*, not tapped, and NN/g's view-tap asymmetry is worst on small draggable handles `[04 §3]`.

**R6 — `role.primary/secondary/tertiary` map to the palette as:** primary → `--qty-blue`; secondary → `--qty-graphite` / `--qty-chalk`; tertiary → `--qty-blue-ramp` step 1 **plus mandatory hatch**. The kit's implicit three-instance maximum and this brief's "never more than three quantities" are the same rule.

### 9.2 With `docs/design/IMAGERY-SYSTEM.md`

- **Approved:** code-drawn `CustomPainter` as the single in-app imagery system; the 25-object Bench Object Library; the four-material hatch vocabulary; square-cut terminals; the 24 dp silhouette test.
- **Approved and now locked:** *geru never renders inside a Layer-2 object.* This is a **stronger** form of the colour law than I wrote — it makes "the saturated colour means your hand goes here" true by construction rather than by discipline. Adopted into the brief.
- **Approved:** app icon **Direction A — "the tick and the bead."** It makes the colour law itself the icon. B is the fallback; C is rejected (a tilted line-and-dot reads as a generic trend glyph at 48 px).
- **Approved with a fence:** the deferred store-only photographic texture (System 5) is the product's **second and final** imagery system `[03 §Exec 1]`. Store surfaces only, never in-app, real photography or a named artist, **never AI-generated**, Phase 7.
- **Ruled:** System 8 belongs to theme-dev as background chrome, specified in §6 above — not folded into the object library.
- **Escalated, not absorbed:** illustration-director's honest risk is correct and it is the most important operational finding of this whole gate. **The Bench Object Library is widget-kit engineering, not illustration.** If it is not scheduled as its own line item at the same cadence as the widget kit, this gate passes on paper while Phase 1 ships grey boxes for every Intuition layer. **That belongs in `docs/02-PLAN.md` Phase 2, and it is not mine to schedule.**

---

## 10. Pre-ship gate (doctrine's 25-item gate `[06 §7]`, translated to Flutter)

The web gate assumes LCP/CLS/srcset/WOFF2. The equivalents that actually bind here:

| # | Check |
|---|---|
| 1 | **60 fps sustained** while dragging on the budget-Android reference device. Frame budget, not a page-weight budget. |
| 2 | Cold start to first interactive object **≤ 2.5 s** on that device (the LCP analogue). |
| 3 | Input-to-paint on drag **≤ 200 ms** worst case (the INP analogue) `[06 §3]`. |
| 4 | **No layout shift after first paint** — the object's size is known before it is drawn (the CLS analogue). |
| 5 | Every animation runs on transform/opacity-equivalent GPU work; no per-frame layout. |
| 6 | Reduced-motion neutralises SETTLE and CARRY. |
| 7 | WCAG AA: 4.5:1 text, 3:1 large text and meaningful graphics, **checked at worst-case overlap**. |
| 8 | Visible focus ring on every keyboard-operable control; full keyboard parity on every custom widget `[06 §5]`. |
| 9 | `describeState()` returns a full sentence for every widget; decorative paint is `ExcludeSemantics`. |
| 10 | **Greyscale golden pass** — no two quantities become indistinguishable. |
| 11 | **The ruler test** on all five platforms. |
| 12 | Font + asset budget: ≤ 420 KB type, ≤ 150 KB bundled image assets. |
| 13 | Token audit: **every colour on screen appears in §2 or §3.** Any other value is a defect. |
| 14 | No `Card`, no `BoxShadow` with blur, no gradient, no `Colors.*` constant anywhere in the codebase. |
| 15 | The non-transferability test, run by design-critic (`00-ART-DIRECTION-BRIEF.md` §12). |

**Nothing is "done" until design-critic returns PASS — rubric ≥ 65/100 plus the non-transferability test. A FAIL blocks done `[01 §3]`.**
