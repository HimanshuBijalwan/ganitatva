# Art Direction Brief — Ganitatva

**Status: ✅ APPROVED BY USER 2026-09-17.** UI work may begin. The built result must still pass design-critic ≥65/100 + the non-transferability test before anything is called done. This is the Phase 0 design-doctrine gate artifact (`docs/02-PLAN.md` Phase 0 item 3; `docs/03-GOALS.md` G1). **No UI work may begin until this is approved.** Per doctrine hard stop 1, no design starts without a concept sentence + out-of-category references + a filled brief `[02 §1.2–1.3, §4]`.

Owner: design-director · Date: 2026-09-17 · Supersedes nothing.
Read with: `01-DISCOVERY-AND-DIRECTIONS.md` (why) · `02-DESIGN-TOKENS.md` (the numbers) · `IMAGERY-SYSTEM.md` (illustration-director).

> **Flutter note.** The design-research corpus is written for the web. Its *principles* transfer; its *mechanisms* (container queries, `:has()`, `animation-timeline`) do not. Every rule below states its Flutter translation. Where a rule is not in the corpus at all, it is marked **[outside doctrine]**.

---

## 1. Concept Sentence

> ### **Ganitatva is a bench, not a lesson: one mathematical object lies under the learner's hand, the single saturated colour in the whole app means "your hand goes here", and every other thing on screen is the quiet surface that object rests on.**

It survives mobile, print, motion and sound; the first screen expresses it literally (see `01-DISCOVERY-AND-DIRECTIONS.md` §3). Everything below traces back to it. Anything that cannot be traced back to it is cut, or justified here in writing.

---

## 2. References (5 primary, each with what to borrow — never the whole thing)

All five are **outside the client's category** per doctrine step 2 `[02 §1.2]`. Sourced by design-researcher.

1. **Braun ET66 calculator** (Dieter Rams + Dietrich Lubs, 1987 — V&A collection) — **borrow only this:** colour is assigned by function-consequence, not category-decoration. Grey for *every* numeric and operator key, green for memory, and exactly **one** accent (yellow) on the single highest-consequence key: equals. One accent colour, spent on the one action the interface exists to produce. **Do not borrow:** its total tonal flatness — an ET66-literal UI reads adult and exam-like, which is the exact fear we are defeating.
2. **Teenage Engineering OP-1** (pocket synth/sampler, Design S Award 2012) — **borrow only this:** the four physical encoders are colour-matched 1:1 to the on-screen elements they control. **Colour is the binding between a control and the live parameter it moves**, not decoration. **Do not borrow:** cryptic 3-letter hardware shorthand at 8pt — an 11–16 audience needs whole words at readable size.
3. **Ableton Push** (hardware grid controller) — **borrow only this:** colour means **state**, from a tiny fixed vocabulary, and **chrome recedes by going quiet, not by shrinking** — buttons black out entirely when contextually irrelevant rather than moving or resizing. **Do not borrow:** the full RGB gamut and dense multi-mode surround, which assume a trained user who already holds the mental model.
4. **Hobonichi Techo ruled line** (ruling engineered by Prof. Haruo Hibino / BB STONE design-psychology lab) — **borrow only this:** horizontal rules **interrupted by short vertical ticks**, which the eye reads as continuous straight lines while measurably reducing eye strain. This is our number-line and axis rendering technique, sourced rather than invented. **Do not borrow:** the physical-object culture (52gsm Tomoe River paper, leather covers) — none of it translates to a screen.
5. **Soroban** (Japanese abacus; Unshu soroban, registered traditional craft) — **borrow only this:** the bead positions *are* the answer. Place value and magnitude are legible as a shape on the frame, with no separate digit string to cross-reference. **Rule this gives us: the state of the manipulation is the readout; never add a numeric display that merely repeats what the object already shows.** **Do not borrow:** the trained bead-flicking grammar you must learn before the tool is usable at all — our widget must be graspable with zero taught procedure.

**Secondary borrows (one line each, fenced to one use):**
6. **Harry Beck's London Underground map (1933)** — a tiny fixed angle vocabulary (horizontal / vertical / 45° only). This governs **iconography only**. It may not touch the widgets: unlike Beck we cannot falsify scale — number lines and graphs stay metrically honest.
7. **Procreate full-screen mode** — a single gesture slides all chrome away, restorable from one corner indicator. This is our **Quiet** interaction, and the cleanest sourced precedent for "the interface disappears around the object".
8. **Cuisenaire rods (1931)** — a fixed, never-reused mapping used as a real measurement convention. We take the *principle* and apply it to **length and position, not hue** — its 10 wood-stain hues would fail contrast and CVD tests on a budget phone. Within a concept, one unit is always the same physical length.

**Rejected as a reference class:** every competitor in the category. None appear here, per doctrine step 2.

---

## 3. Type Scale

**Two families, plus one declared exception.** Doctrine caps at two `[02 §4; 06 §2]`.

**Departure, stated in writing:** doctrine's eight recommended pairings `[02 §2.1]` are all commercial foundry faces and **none are licence-viable for a free app bundling fonts into five platform binaries**. Substitutes below are SIL OFL. Neither is on the instant-fail list (Inter / Space Grotesk / Manrope / Poppins / DM Sans) `[01 §1 Type]`. **[outside doctrine — licensing constraint]**

| Role | Typeface | Weight / Axis | Size (desktop / mobile, logical px) | Line-height | Why this face for this role |
|---|---|---|---|---|---|
| Display / H1 — the Hook question | **Fraunces** | wght 400, `opsz` 72, `SOFT` 60, `WONK` 1 | 44 / 30 | 1.12 | The Hook is a real question asked by a person, not a chapter title. Fraunces' optical-size and `WONK` axes give an engraved, drawn quality at display size — a nameplate on a tool, not a UI header. It is the only warmth in the type system and it carries the anti-austerity load alone. |
| H2 — layer titles, concept names | **Fraunces** | wght 500, `opsz` 36, `WONK` 0 | 28 / 22 | 1.20 | Same voice, wonk off: it must read as a label, not a statement. |
| Body — explanation, diagnosis text | **Atkinson Hyperlegible Next** | Regular 400 | 18 / 17 | 1.55 | ≥16px mobile minimum `[04 §3]`. Chosen because it was designed by the Braille Institute for maximum character differentiation for low-vision readers. |
| UI / labels / buttons | **Atkinson Hyperlegible Next** | Medium 500 | 15 / 15 | 1.20 | One face for every functional word in the app. No second UI voice. |
| Data — axis ticks, readouts, scale numerals | **Atkinson Hyperlegible Next** | Regular 400 / Bold 700 for the live readout | 12 / 11 min, ≥ 0.45 bu cap-height | 1.0 | **This is why Atkinson is here.** In a math app, confusing `1`/`l`/`I`, `0`/`O`, `6`/`b` is a *correctness* bug, not an aesthetic one. Atkinson's differentiated characters make an ambiguous numeral impossible. |
| Math notation *(declared 3rd family — justified)* | **KaTeX / Latin Modern**, via `flutter_math_fork` | as shipped | matched to body x-height | — | **Justification required by `[02 §4]`:** notation is a different writing system, not a style. Setting math italic in a UI sans misrepresents what a variable *is*, and every learner will meet this notation again in a textbook. Using the canonical math face is a pedagogical decision. It is also what `flutter_math_fork` already ships, so it costs no extra bytes. |

**Rules**
- **No fourth family.** If Devanagari needs one (Phase 7 / the Hindi lane), it comes back to this brief as a written amendment — it is not a build-time decision.
- **Fraunces never appears below 20px.** Below that it is a body face pretending, and it loses.
- **Numeric readouts are laid out in fixed-width slots by the painter**, so digits never reflow as a value changes — a layout rule, not a font feature, so it holds whether or not the face ships `tnum`. **[outside doctrine]**
- **Ship static instances, not variable fonts**, unless variable-axis rendering is verified on old Android. Four Atkinson weights + three Fraunces optical sizes; budget in `02-DESIGN-TOKENS.md`.
- **Text scaling:** all chrome honours `MediaQuery.textScaler` to 200%. **Widget interiors clamp it to 1.0–1.3** — an axis label at 200% destroys the diagram it labels. The bench margin absorbs the growth. **[outside doctrine]**

---

## 4. Colour Tokens

Full light + dark tables, CVD rules and validator output are in `02-DESIGN-TOKENS.md`. The law is here.

### The colour law — five clauses, each sourced
1. **There is exactly ONE saturated colour in the entire product.** (ET66: one yellow key.)
2. **It means "live under your hand."** It appears on the thing you can touch *and* on the part of the object that thing controls — binding control to parameter. (OP-1.) **It appears at most once per screen.** If a screen seems to need it twice, the screen is doing two jobs.
3. **Chrome recedes by going quiet, never by shrinking or moving.** (Push.) Inactive controls lose colour and contrast; they do not resize, and they never disappear except in Quiet mode.
4. **`--live` never appears inside a Layer-2 (Intuition) object.** Layer 2 is read-only — nothing there is touchable — so the colour law is true **by construction**, not by discipline. The same object gains its geru bead only when it mounts as a Manipulate widget, and only on the sub-part the hand can actually move. *(Raised by illustration-director; adopted, because it is a stronger form of the rule than I wrote.)*
5. **Two drawn quantities are never distinguished by hue alone.** Lightness, position, line style and a direct label carry it; hue is the last cue. (Sourced gap: found in **zero of 16** category apps.) This is independently kit law in `docs/widgets/00-kit-overview.md` §7 — the two documents arrived at it separately.

### The tokens (light mode; dark in `02-DESIGN-TOKENS.md`)
| Token | Hex | Role | Hue-bias note |
|---|---|---|---|
| `--live` | `#B4432A` | **Concept-carrying primary AND the single accent — they are the same token.** Handles, beads, the one primary button per screen. | Geru red-ochre — the colour of a fired clay bead and of an Indian surveyor's mark. Chosen because the abacus bead is an object the product already owns: our one saturated colour is literally the colour of the thing the learner's finger pushes. |
| `--live-press` | `#8F3520` | Pressed / dragging state | Same hue, −18% L. Tonal ramp per colour, not one raw hex `[01 §2.7]`. |
| `--live-wash` | `#F0DED5` | The only tinted fill in the app: the region a handle controls | Always carries a `--live` stroke; the wash alone never conveys meaning (clause 4). |
| `--paper` | `#F5F1E8` | App background — the bench | Warm off-white, never `#FFF` `[01 §2.8]`. ~4% warm lean toward the geru. |
| `--sheet` | `#FBF8F1` | The working surface a math object sits on | Lighter than the bench, so the live area is the brightest thing on screen. |
| `--sunk` | `#E9E3D6` | Wells, insets, inactive | |
| `--rule` | `#D6CEBC` | Minor ruling, gridlines, minor ticks | |
| `--rule-major` | `#B8AE99` | Major ruling, sheet edge | 2.07:1 vs sheet — **decorative ruling only**, never load-bearing. |
| `--axis` | `#8F856E` | **Axes, major ticks, any load-bearing graphical structure** | 3.44:1 vs sheet — clears SC 1.4.11 `[06 §5]`. Ruling may be faint; structure may not. |
| `--ink-900` | `#1E1B16` | Primary text, object outlines | Warm near-black, never `#000` `[01 §2.8]`. 15.23:1 on paper. |
| `--ink-700` | `#4A443A` | Secondary text | 8.55:1 |
| `--ink-500` | `#6F6859` | Tertiary text, tick labels | 4.90:1. Never lighter for text. |
| `--qty-blue` | `#12609B` | Drawn quantity A | 6.24:1 vs sheet. The **only** quantity hue. |
| `--qty-graphite` | `#1E1B16` | Drawn quantity B | Graphite — the pencil line. Achromatic, therefore maximally separable from both `--live` and `--qty-blue` under every CVD type. **Its dark-mode twin is chalk (`#DCD4C7`)** — on a dark bench you draw in chalk, not pencil. The material logic does the work, not a colour trick. |
| `--qty-blue-ramp` | `#86B2D6 → #4E8CBB → #1F6BA3 → #0A4571` | Magnitude, one hue light→dark | Riemann bars, histograms, heat. Never a rainbow. |

**Rule: if a colour is not in this table (or its dark twin), it does not ship.** There is no green. There is no purple. There is no gradient anywhere in the product.

**Rule: colour never means "wrong".** `--live` is red-ochre and red never marks an error, because **nothing** marks an error by colour. Mistakes are diagnosed in words (`00-VISION.md` Layer 5; `03-GOALS.md` principle 4). This removes the palette's ability to punish, which is exactly why the diagnosis has to be written — and Layer 5 is where the product's real work lives.

**Verified, not asserted:** every pair above was computed, and the categorical sets were run through the data-viz palette validator (OKLab ΔE under Machado protan/deutan simulation, chroma floor, lightness band, contrast). Both modes pass all checks. Output is recorded in `02-DESIGN-TOKENS.md` §4. **A finding worth keeping:** a mid-gold third quantity **fails** (ΔE 2.0 deutan against `--live` in dark mode) — which is why the quantity set is blue + graphite, not blue + gold + graphite. The restraint here is a measurement, not a preference.

---

## 5. Layout Rules

### Grid base
**Physical units, not pixels.** The bench is ruled in a real-world unit and everything inside a math object is expressed in it.

- **1 bu (bench unit) = 4 mm** on touch platforms (≈ 25 dp) — the Hobonichi ruling pitch, arrived at through eye-strain research rather than taste.
- **1 bu ≈ 6.8 mm** on pointer platforms, because a 27" monitor is viewed at roughly 60 cm versus a phone at 35 cm. Same **visual angle**, different physical size.
- Ticks, bead diameters, handle sizes, rule pitch and object widths are all specified in `bu`.
- **Chrome** (padding, margins, gaps) uses a conventional 4-dp scale: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64.

**The ruler test (QA, mandatory):** render a 10-bu ruler on each of the five platforms and measure it against a real ruler. If it is not 40 mm on a phone, the metric is wrong and the build is wrong. **[outside doctrine — my specification]** Flutter does not expose true physical DPI reliably everywhere; the implementation needs one `BenchMetrics` provider and a per-platform correction, verified by this test.

### Breakpoint philosophy
**Content-driven, never device-driven** `[02 §2.3]`. Flutter translation: the doctrine's container queries become **`LayoutBuilder` per component** — each widget decides its own layout from the width it is actually given, never from `MediaQuery.size` or a device class. The doctrine's `:has()`-by-item-count becomes a widget choosing its template from its own child count. No `if (isTablet)` anywhere in the codebase. **[outside doctrine — Flutter translation, my specification]**

**The object's size range:** minimum **14 bu**, preferred **20 bu**, maximum **28 bu**. It grows within that range as space allows. **Beyond 28 bu, extra space becomes bench and marginalia — never a bigger object.** Below 14 bu the object scrolls horizontally rather than shrinking, because a shrunk number line is a broken number line.

### Where the grid is deliberately broken, and why
Doctrine requires exactly one deliberate break tied to the concept `[02 §2.3; 01 §2.5]`.

> **The manipulable object is the only element in the entire product permitted to break the bench margin.** On a phone it goes edge-to-edge horizontally while every piece of text stays inset. Nothing else — no header, no image, no button, no card — may ever touch the screen edge.

This is the concept sentence made structural: the object outranks the page, visibly, in the geometry. It also makes the ~75% category norm (content as hero) impossible to reintroduce without breaking a layout rule.

### Dominant focal element per screen
| Screen | Dominant focal element |
|---|---|
| First launch / resume | **The object you were last holding, where you left it.** No dashboard, no greeting, no stats row. |
| Layer 1 — Hook | One oversized question in Fraunces. No widget yet. Type is the hero exactly once. |
| Layer 2 — Intuition | The drawn physical object. **Zero symbols on screen** — enforced by the layout, not by discipline. |
| Layer 3 — Manipulate | The live widget, full-bleed, with a single geru bead as the only saturated point. |
| Layer 4 — Formalize | The notation, set large. **The hierarchy deliberately flips:** the widget shrinks into the margin as a reference while the symbol takes the centre — so the learner watches the symbol land on the object they were just holding. |
| Layer 5 — Practice | The answer surface, which is **the same object**, never a multiple-choice list. Diagnosis is words below it. |
| Layer 6 — Connect | The current node in its local neighbourhood. Survey language permitted here and only here. |
| Concept list | A **tool rack**: each row carries a 6-bu ink miniature of that concept's own object. Structurally different per concept — not a card grid. |
| Progress ("the shelf") | The objects you actually hold. No number, no ring, no streak, no date. |

---

## 6. Imagery Plan

- **Source (one primary language):** **the identity *is* the object vocabulary.** A finite library of ~20–30 physical things (bead, rod, strip, tile, jug, ruler, string, weight, coin, die, folded sheet, balance pan…) drawn in code by the same painter vocabulary as the interactive widgets. This is doctrine's identity-as-imagery pattern `[02 §2.4]` — the imagery is not commissioned separately from the system, so it is cheap to extend and impossible to apply inconsistently. **Secondary, used sparingly:** oversized numerals and ruled/ticked surfaces as texture — System 8, typographic backgrounds `[03 §1 System 8]`.
- **Why not the other seven systems:** cut-out collage, isometric mini-worlds, hand-painted washes, photo duotone and 3D clay all require per-asset production, which does not survive 180 concepts offline in an APK. Folk/regional motifs `[03 §1 System 7]` are explicitly excluded here: the doctrine itself flags that system as resting on convention with no verified case study, and mandates real local sourcing rather than generation — a commitment this project cannot honour in Phase 0. Revisit only with a named local artist.
- **Consistency rule — crop:** objects are drawn in plan or elevation only. No perspective, ever. An object is a thing on a bench seen from where your eyes are.
- **Consistency rule — grade:** flat fills and ink strokes only. **No gradient, no blur, no elevation, no glass.** **One exception, and it is a material fact rather than a lighting effect: the contact shadow** — a hard, zero-blur, single-tone mark where an object meets the bench, offset ≤ 0.15 bu, light locked at upper-left 315°. It appears only where an object touches a surface, never on chrome, text or a button, and it must never grow into a UI elevation shadow. Spec in `02-DESIGN-TOKENS.md` §6.
- **Consistency rule — weight:** one stroke weight per size class, expressed in `bu`, so an object drawn at 6 bu and the same object at 24 bu are recognisably the same hand.
- **Concept test** — every asset must restate the concept sentence or it is filler `[02 §2.4]`: *the object library* restates "one object under your hand" by being the only pictorial content in the product; *the ruled surface* restates "the quiet surface it rests on"; *the geru bead* restates "your hand goes here". **Anything that passes none of those three does not ship.**
- **Delegated to illustration-director:** the object library, the drawing rules, the app icon, empty/rest states, and the bundled-asset byte budget → `docs/design/IMAGERY-SYSTEM.md`.
- **No AI-generated raster art ships in the app.** Offline bundle size, cross-concept consistency and doctrine's anti-AI-image rules `[03 §3]` all point the same way. If generation is used at all it is as a *sketching* aid for the object library, never as a shipped asset.

---

## 7. Motion Rules

**Three named moves for the whole product** `[06 §3; 02 §2.5]`, defined before any polish. Nothing else animates. Ever.

1. **DETENT** — the only feedback on manipulation. When a dragged value lands on a meaningful position (an integer, a denominator boundary, a gridline), the tick beneath it thickens by one step and the bead seats. ≤ 90 ms, no easing curve worth naming. Optional haptic; optional wooden click (see below). **No colour flash, no bounce, no scale-up.** This is a mechanical click-stop, borrowed from instruments that have to be usable without looking at them.
2. **SETTLE** — how anything arrives. Elements do not fly in: the object is already there and *resolves* (opacity 0.6→1, 8 dp rise, 180 ms, decelerate). **The un-animated state is the final, fully visible state** — the golden rule `[06 §3]`. If the animation never runs, the screen is still correct.
3. **CARRY** — the product's one signature moment `[01 §2.18]`, used exactly once per concept. Moving from Manipulate to Formalize, the widget you were just holding physically carries into the margin and the notation lands on it, so the symbol is seen attaching to the object rather than replacing it. 320 ms. **This is the whole pedagogical thesis expressed as a transition, which is why it is the one animation worth its cost.**

**Page-load choreography:** bench → sheet → object → chrome. The object never arrives last, because the object is the point.

**Scroll behaviour:** none. **No parallax, no scroll-driven reveal, no pinned assembly.** A screen holds one object; if it needs scrolling, it is carrying too much. The exceptions are long-form text (Formalize, Connect) and the concept list, both of which are plain scroll with no motion attached.

**Hover / press:** visible press state within 0.1 s `[04 §2]`, uniform everywhere: `--live` → `--live-press`, no scale, no shadow, no ripple spread beyond the target.

**Restraint clause:** *an animation ships only if cutting it would lose narrative or functional clarity.* Applied: DETENT survives (cutting it loses the felt boundary between values). SETTLE survives (cutting it loses which thing changed). CARRY survives (cutting it loses the thesis). **Everything else was cut.**

**Device clause [outside doctrine — my specification]:** on the budget-Android profile, CARRY degrades to an instant cut if the frame rate drops below 55 fps during the transition. A dropped-frame animation on a cheap phone is worse than no animation.

**Sound:** the product has exactly one sound — a soft wooden bead click on DETENT. **Default off**, opt-in in settings. No jingle, no fanfare, no success chime, no voice. Category note: sound-on-correct-answer is confirmed in Khan Academy and Khan Academy Kids and is a live user complaint in both.

**Banned outright:** confetti · celebration · any looping idle animation · mascot motion · streak fire · bounce or overshoot easing · uniform fade-up-on-scroll `[01 §1 Motion]` · `transition: all` equivalents · any animation whose purpose is to fill time.

---

## 8. Component List with Distinctive Treatment Notes

| Component | Standard treatment (the category norm) | What makes ours distinctive (tie to concept) |
|---|---|---|
| **Nav** | 4–5-icon bottom tab bar with badge dots | **Three word-labelled destinations, no icons at all, no badges.** Words, because a 13-year-old should never have to guess a glyph and because the Hindi lane makes labels translatable where icons are not. The rail vanishes entirely in Quiet mode — chrome recedes by going quiet `[ref 3]`. |
| **Hero (concept screen)** | Question card + answer options + progress chip | **One object on a ruled sheet, edge-to-edge, and nothing else.** It is the only element allowed to break the margin. There is physically nowhere to put a progress chip. |
| **The manipulable widget** | A bordered, rounded, shadowed card | **No card, no border, no shadow, no elevation.** The working sheet is a change of paper tone plus a 1-bu ruled edge. The object lies *on* the bench, not *in* a box — the difference between a tool on a table and a picture of a tool. |
| **Handle / control** | Blue circle with a drop shadow | **A geru bead:** a 2.4-bu solid disc with a 0.2-bu ink outline and one flat facet. The only saturated thing on screen. Visual size (~60 dp) already exceeds the 48-dp target minimum. |
| **Readout** | A number field beside every control | **Usually absent.** Soroban rule `[ref 5]`: the state of the object *is* the answer. A numeric readout appears only when the concept is *about* the numeral. |
| **CTA / button** | Filled pill in the brand colour, repeated many times per screen | **One per screen, ever.** Geru fill, 4-dp radius (a bench edge, not a sweet), and the label is always a verb the learner would say: "Split it", "Let go", "Show me the symbol" — never "Submit", "Continue", "Next". Secondary actions are ink text with a rule under them, never a second filled button. |
| **Card / grid item (concept list)** | One uniform `<Card>` for everything `[01 §1 Components]` | **A tool rack.** Each row carries a 6-bu ink miniature of its own concept's object, so rows are structurally different from each other by construction. There is no generic card component in this codebase. |
| **Progress** | Ring / streak / XP / badge shelf | **A shelf of objects you hold**, described in words ("held" / "needs another look"). No count, no ring, no day, nothing that can break. |
| **Practice item** | Multiple-choice list + red ✗ | **The same manipulable object as the answer surface.** Mistake diagnosis is a sentence on the bench. No colour, no mark, no sound marks an answer wrong. |
| **Footer / settings** | Icon grid | Plain text list, ink only. |
| **Empty state** | Illustration + cheerful copy | An empty bench with the ruling visible. It reads as *ready*, not as *missing*. |

---

## 9. Mobile-First Rules

Design target is a budget Android phone; 360 dp is the floor `[04 §3]`.

- **What never collapses:** **the manipulable object and its geru handle.** Named explicitly, per template. Everything else is negotiable; these two are not.
- **Order of collapse, in order:** marginalia column → explanatory text becomes a pull-tab → section titles shrink → the nav rail's padding tightens. **The object is last and it never goes below 14 bu** — below that it scrolls horizontally instead of shrinking.
- **The nav never becomes icons.** If labels do not fit, there are too many destinations.
- **Touch targets: 48 dp minimum, spaced ≥ 8 dp.** Above the 44–48 px practical implementation of the 1 cm human-factors minimum `[04 §3]`, because our targets are dragged, not tapped — and NN/g's view-tap asymmetry is at its worst on small draggable handles.
- **Primary action sits in the lower-centre thumb band** `[04 §3]`. The object sits above it. **Exactly one sticky element** on any screen `[04 §3]` — the nav rail, or nothing.
- **Motion budget on mobile:** DETENT and SETTLE always run (both are sub-200 ms and compositor-cheap). CARRY degrades to a cut below 55 fps. **No motion at all on the Practice layer except DETENT** — a learner mid-thought should not be shown a transition.
- **Reduced motion:** `MediaQuery.disableAnimations` neutralises SETTLE and CARRY entirely; DETENT keeps only its non-moving tick-weight change `[06 §3]`.
- **27" and up:** the object stops growing at 28 bu. The extra width becomes **bench margin and a marginalia column** carrying the Formalize and Connect material as textbook-style side notes. **The desktop does not scale the object up; it opens the margin.** A pointer platform also gets `1 bu ≈ 6.8 mm`, so the object holds the same visual angle it has in the hand.

### 9.1 The same design on a 5" phone and a 27" monitor

The doctrine's answer to "responsive" is *let content decide layout* `[02 §2.3]`. Ours is sharper, because a number line is a measuring instrument and an instrument has a correct size.

| | 5" budget Android (360 dp) | 27" monitor (2560 px) |
|---|---|---|
| **1 bu** | 4.0 mm | 6.8 mm — same **visual angle** at 60 cm as 4 mm at 35 cm |
| **The object** | 14 bu — fills the width, edge to edge, the only element allowed to break the margin | 20–28 bu — larger in millimetres, **identical in apparent size to the eye** |
| **Extra space goes to** | nothing; there is none | **bench margin + a marginalia column** carrying Formalize and Connect as textbook side notes |
| **Text** | inset, single column, 17 px body | inset, max 640 dp measure — the column does **not** widen |
| **Controls** | lower-centre thumb band, 48 dp targets `[04 §3]` | spatially aligned to the thing each one governs — free real estate a phone does not have |
| **Nav** | three word-labels at the bottom | three word-labels, same order, same words |
| **Motion** | CARRY degrades to a cut below 55 fps | full |
| **What is identical** | the object's apparent size, the ruling pitch, the single geru bead, the type scale's ratios, every token |

**The rule in one line: the desktop does not scale the object up — it opens the margin.** A learner who does a concept on a phone at school and again on a desktop at home is holding the *same instrument at the same size*, with more room around it. That is only expressible because the design is specified in millimetres, and it is the single hardest thing in this brief to copy.

---

## 10. Don'ts

**From the template:**
- No colour outside §4's token table (or its dark twin in `02-DESIGN-TOKENS.md`).
- No typeface outside §3. KaTeX is the single declared exception and it is justified in writing.
- No animation without a stated narrative or functional reason (§7 restraint clause).
- No image that fails §6's concept test.
- No layout collapse before the content genuinely requires it.

**Product-specific, and equally binding:**
- **No second saturated colour, ever.** If a screen seems to need two, the screen is doing two jobs.
- **No colour, mark or sound ever means "wrong".** Diagnosis is words.
- **Never distinguish two drawn quantities by hue alone.** Never more than three quantities on screen at once — a fourth means the widget is wrong.
- **No gradient, no blur, no elevation, no glass, anywhere** — and the one permitted contact shadow (§6) is hard-edged, zero-blur, object-only, and may never become a UI shadow. (Doctrine's own teardown of Apple's Liquid Glass documents the usability cost `[01 §4 Teardown 4]`.)
- **No card, and no generic `Card` widget in the codebase.**
- **No streak, XP, badge, heart, leaderboard, level, confetti, celebration or mascot.** Not as a toggle. Not as an experiment.
- **No push notification and no daily reminder, ever.** We are not renting attention (`03-GOALS.md` principle 6).
- **No ad, no upsell, and no gated step inside a learning flow.**
- **No icon where a word fits.**
- **No numeric readout that repeats what the object already shows**, unless the numeral is the concept.
- **No screen whose only content is that you finished something.**
- **No centred body copy over two lines · no all-caps eyebrow on every section · no one-radius-one-shadow-everywhere · no mixed icon libraries · no "Unlock / Elevate / Seamless / Effortless" copy · no rhetorical-question headlines** `[01 §1]`.

---

## 11. The Art Direction Stated as Restraint

Doctrine step 6 requires this section: *what are we deliberately not doing, and why does that restriction serve the concept?* `[02 §1.4]` — Razorpay shipped exactly two colours and called it "the discipline that makes everything else land".

| We are deliberately not doing | Why the restriction serves the concept |
|---|---|
| **A second saturated colour** | Because the one colour has a *job* — "your hand goes here" — and a job shared by two colours is a job nobody can read. This is the ET66's single yellow key, applied to a whole product. |
| **Any decorative use of our own brand colour** | Because a brand colour used for identity is colour spent on us; colour spent on "this is alive" is spent on the learner. Every reference in §2 does the second thing and none does the first. |
| **Illustration as a separate discipline** | Because 180 concepts cannot each afford a drawing. Making the object vocabulary *be* the imagery is the only version of this that survives Phase 3 — and it means the identity can never drift from the product. |
| **Depth: shadow, elevation, gradient, glass** | Because a bench is a flat surface with things on it, and because every one of those costs frames on a ₹8,000 phone. The aesthetic and the performance budget agree for once; we should not waste that. |
| **Motion beyond three moves** | Because the only thing that should move is the thing the learner is moving. Motion elsewhere is the interface asking for attention it did not earn. |
| **Sound beyond one click** | Because a bench has one sound. And because a success chime is a reward mechanic wearing a costume. |
| **The entire progress-chrome category** | Because we measure delayed transfer, not days. Any widget that counts is a widget that can break, guilt, or be gamed — and it takes screen space from the object. |
| **Icons in navigation** | Because words cannot be misread by a nervous 13-year-old, and because words translate to Hindi where glyphs do not. |
| **Dark-first** (Direction 2's better screenshot) | Because the design target is a budget LCD phone in daylight, where a dark UI washes out and saves no battery. We give up the glamorous store screenshot on purpose. |
| **Growing the object on large screens** | Because a number line is a measuring instrument and an instrument has a correct size. The desktop opens the margin instead. |

---

## 12. The Non-Transferability Test

Doctrine's highest-level test `[01 §2.28; §3]`: *replace only the logo and brand name with a competitor's — would anything look out of place?* A "no" is a failure.

**Swap in Khan Academy, Byju's, Vedantu or Toppr:** the layout has exactly one slot and it holds an object. There is nowhere to put a video player, a question list, a live-class banner or a mock-test score. **Their content does not fit the geometry.** The single-object margin break would have to be deleted for their product to function.

**Swap in Duolingo or Brilliant:** the palette has no vocabulary for reward. There is no success colour, no celebration motion, no streak slot, no XP typographic style — and `--live` is red-ochre, which in their systems reads as failure. **Their core loop has no colour to speak in.**

**Swap in Desmos or GeoGebra** (the nearest neighbours, and the two that come closest to surviving this test themselves): their plotting depends on a multi-hue categorical palette applied to many simultaneous functions. Our rule — one quantity hue plus graphite, never more than three quantities, never hue alone — **would break their product on the first two-function graph.** And their chrome is toolbar-dense by design, which the one-object-per-screen rule forbids.

**Swap in Mathigon/Polypad** (the most important comparison, and one not yet torn down — see `01-DISCOVERY-AND-DIRECTIONS.md` §7.1): a Polypad canvas is many manipulatives coexisting on one shared scratchpad. Our colour law allows the saturated colour **once per screen**, and our layout allows **one object**. **A Polypad session would be monochrome and illegal under this brief within about four seconds.** Additionally, a design specified in **millimetres on a physical device** is close to meaningless on the web surface Polypad actually owns. *(Flagged: based on general knowledge of Polypad, not verified this session. design-critic must verify before ship.)*

**The single element that would break first in every case:** the geru bead. It is not decoration and it is not branding — it is a promise that this specific mark is the thing you may touch. **Any competitor using their own brand colour would have to break that promise on the first screen.**

---

## Approval

**Sign-off required before any UI work begins** (doctrine step 6; `docs/02-PLAN.md` Phase 0; `docs/03-GOALS.md` G1).

- [ ] Concept sentence accepted
- [ ] Direction 1 (The Bench) accepted over Directions 2 and 3
- [ ] Colour law accepted — one saturated colour, red never means wrong
- [ ] Type departure from doctrine's commercial pairings accepted (licensing)
- [ ] Physical-unit (`bu`) layout accepted, including the ruler test as a QA gate
- [ ] The restraint list (§11) accepted, including what it costs us
- [ ] Open questions in `01-DISCOVERY-AND-DIRECTIONS.md` §6 routed, not guessed

**This brief does not approve itself.** The built result is scored by design-critic against the rubric (≥65/100) plus the non-transferability test; a FAIL blocks "done" `[01 §3]`.
