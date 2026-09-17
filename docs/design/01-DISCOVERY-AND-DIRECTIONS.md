# Ganitatva — Discovery, Teardown & Three Directions
**Design-doctrine process steps 1–5.** Owner: design-director. Date: 2026-09-17.
Companion files: `00-ART-DIRECTION-BRIEF.md` (the gate artifact), `02-DESIGN-TOKENS.md` (the numbers).

> Every rule asserted here is cited to the design-research corpus as `[NN §x]`.
> Where a claim is **not** in that corpus, it is marked **[outside doctrine]** and attributed.

---

## 1. Discovery

### 1.1 What this business actually does differently
Three things, all stated in `docs/00-VISION.md` and none of them cosmetic:

1. **The unit of the product is a manipulable object, not a lesson.** "No concept ships without at least one widget the learner can manipulate." That is a *layout* constraint before it is a product constraint: every concept screen has exactly one thing that must be the biggest, clearest, most touchable element on it.
2. **Intuition before notation.** Layer 2 forbids symbols entirely. So the design has to be able to teach with nothing but a drawn object — no formula, no label, no icon.
3. **It refuses the engagement machine.** No streaks, no XP, no badges, no notifications, no DAU. The North Star is *Concepts Genuinely Understood* — a delayed transfer test 7+ days later. This removes an entire furniture category (progress chrome) that every gamified competitor uses to fill screens.

### 1.2 The audience, and what they already believe
School students 11–16 who think they are bad at math. What they bring to first launch:

- **"Math is a performance I keep failing."** So anything that scores, ranks, times or celebrates reads as the exam again, in brighter colours. This is why the vision's anti-dark-pattern rule is also an *aesthetic* rule.
- **"Math is a wall of symbols that other people can read."** So a first screen dense with notation confirms the fear before they touch anything.
- **"Apps made for me are made for babies."** A 13-year-old is sharply sensitive to being condescended to. Mascots and cartoon rounding, which work for Khan Academy Kids (ages 2–8), actively insult this band.
- **They already own a physical vocabulary** — ruler, notebook margin, ruled page, coins, string, a ₹8,000 phone they use one-handed.

The design has to land between two failures, and both are real: **the sugar failure** (cartoon EdTech, which reads as "for children, and still about winning") and **the austerity failure** (Desmos/GeoGebra-style bare tool, which reads as "for people who are already good at this"). Neither is neutral ground. We have to choose a third thing.

### 1.3 Equity, assets and hard constraints that already exist
- **Name.** *गणित + तत्त्व* — "the essence of mathematics". Sanskrit, precise, adult in register. It is not a playful name and the design should not fight it. The nearest honest English gloss is "the substance of the thing" — which points at *material*, not at *fun*.
- **The abacus track is already in the product** (`AbacusBoard`, soroban-style). The bead is therefore a first-class object we already own, not a metaphor we invented for the brief.
- **Flutter, all 5 platforms, fully offline.** Everything — fonts, art, icons — ships inside the binary. This is the single most under-appreciated design constraint in the project and it eliminates whole approaches (see §1.4).
- **Design target is a budget Android phone;** the same design must hold on a 27" monitor.
- **Content is data (`ADR-003`).** A concept is a YAML file. So the design system must be expressible as *config a non-engineer can set*, not as per-screen art direction. Anything that requires a designer per concept will not survive 180 concepts.
- **Golden tests are load-bearing** (`memory/dev.md`): "a math diagram that renders subtly wrong is a silent content bug." The visual system must be mechanically checkable.

### 1.4 Constraints that killed options before they were drawn
- **No photography.** Offline + APK budget + 180 concepts. Dead.
- **No raster illustration library.** 180 bespoke intuition illustrations is neither affordable, consistent, nor bundle-able. Doctrine's anti-AI-image rules `[03 §3]` would in any case forbid shipping first-pass generated art, and a hand-made set at that volume is a second full-time job.
- **No commercial type.** Doctrine's eight recommended pairings `[02 §2.1]` are all commercial foundry faces (Grilli Type, Klim, Pangram Pangram, ABC Dinamo). **None are licence-viable for a free app that bundles fonts into five platform binaries.** I am departing from that list deliberately and openly; §7 of the brief names the open-licence substitutes and the reason for each. **[outside doctrine — licensing constraint, my call]**
- **No CSS.** The doctrine's layout mechanics are written for the web (container queries, `:has()`, `animation-timeline: scroll()`) `[02 §2.3; 06 §3]`. The *principles* transfer; the mechanisms do not. The brief states the Flutter translation for each, explicitly.

### 1.5 Three candidate positioning directions
| | Position | The promise | Why it could win | Why it could fail |
|---|---|---|---|---|
| **A** | **The bench** — math as a material you handle | "Here is the thing. Pick it up." | Directly encodes the product rule (one object, under your hand). Warm without being childish. Owns the abacus bead we already have. | Risks reading as quaint / craft-fair if the material language gets decorative. |
| **B** | **The instrument** — math as a signal you drive | "Turn this and watch what happens." | Strongest control legibility; synth/oscilloscope references are rich; dark-first looks expensive. | Dark-first is wrong for a budget LCD phone used in daylight, and "instrument panel" reads as *expert equipment* — straight into the austerity failure for a scared 13-year-old. |
| **C** | **The survey** — math as one connected territory you map | "You are here. This is what's next to it." | Makes `ADR-004`'s knowledge graph the identity; cartography is a beautiful, under-used language. | The map becomes the product and the widget stops being the hero — which breaks the one rule that cannot break. Also adjacent to the "levels/worlds" metaphor the category already uses. |

**A wins.** B and C each contribute one bounded thing (§5.4); neither survives as the spine.

---

## 2. Teardown — what the category actually looks like

Delegated to design-researcher, 16 products (Khan Academy, Khan Academy Kids, Duolingo, Duolingo Math, Photomath, Brilliant, Byju's, Vedantu, Toppr, Desmos, GeoGebra, Prodigy, Mathway, DragonBox, Doodle Maths, Cuemath).

### 2.1 The honest evidence position
Pixel-level verification was achieved for only two entries (Duolingo, via a published design-system teardown; Braun ET66, via museum/press sources). Most other claims come from official store listings and blogs describing *features*, not pixels. **Byju's, Toppr, Vedantu, Cuemath, GeoGebra's current skin and post-acquisition DragonBox are weakly evidenced and must be re-verified from store screenshots before any of this is quoted externally.** I am reporting that limit rather than laundering it, per `[05]`'s own gap disclosure.

### 2.2 What actually clears the ≥70% bar
Doctrine step 3: anything in ≥70% of the comparison set is the niche norm and is disqualified as a differentiator `[02 §1.2; 05]`.

**Only one visual/structural trait clears 70% on hard evidence — and it is the important one:**

> **11–12 of 16 products (~75%) make content, questions, or a game progression the hero of the screen. The interactive object, where it exists at all, is subordinate to it.** Only Desmos, GeoGebra and DragonBox (3/16) make the canvas or the manipulable object the hero. Prodigy is the sharpest negative case: the math is an *interruption* to the game.

Two further traits plausibly clear 70% once business-model and platform convention are counted, but were not screenshot-verified: **ad/upsell somewhere in the free flow**, and **a 4–5-icon bottom tab bar within the consumer-mobile subset**.

### 2.3 Contested ground (30–70%) — and the structural finding underneath it
XP/points/badges, mascots, confetti, streak counters and the levels/worlds map all land in the 30–70% band. But the useful finding is *how they cluster*:

> **The category is not one visual language, it is two.** A **gamified-consumer** language (Duolingo, Duolingo Math, Khan Academy + Kids, Brilliant, Prodigy, Doodle) where all of those traits appear together — and a **bare-tool** language (Desmos, GeoGebra, Mathway, Photomath) where they are essentially all absent.

Ganitatva's brief sits structurally on the tool side, which is the **smaller, less crowded half**. That is good news and a warning at once: the tool half is uncrowded *because it serves people who already like math*. Our actual white space is **tool-grade clarity aimed at someone who is frightened**, which nobody in the set is doing.

### 2.4 Assumptions the research killed
Worth recording, because they would otherwise have shaped the design on false premises:
- **The blue-purple gradient EdTech hero is not the category norm.** Confirmed non-gradient: Khan Academy, Duolingo, Vedantu (whose wordmark is red-orange, not purple), Desmos, GeoGebra, Mathway. Rejecting it is hygiene, not a differentiator — we should not congratulate ourselves for it.
- **Full-bleed colour backgrounds are rare**, not the norm. Duolingo is white-dominant with bordered colour blocks.
- **Corporate Memphis is a marketing-site convention more than an in-app one** for the products actually inspected.
- **Hearts/lives is a Duolingo signature, not a category convention.**

### 2.5 The gap map — genuine, sourced opportunity
1. **Colour-blind-safe distinction between plotted / manipulated elements was found in ZERO of 16 apps.** Searched for specifically; did not surface anywhere. This is the most confidently stated gap in the report, and it is squarely inside our core screen: every one of our 15 widget primitives depends on telling drawn quantities apart.
2. **Dark mode is a probable category-wide gap.** Khan Academy's absence is confirmed from its own help centre. For an offline app on a budget phone used after dark, a real dark mode (not an inverted flip) is a low-risk differentiator.
3. **Progress rings were confirmed for no app in the set** — open territory we are choosing not to enter anyway.

### 2.6 The norms I am breaking, in writing
| Norm | Evidence band | What we do instead |
|---|---|---|
| Content/questions/game is the hero of the screen | **~75% — clears the bar** | The manipulable object is the only hero. It is the sole element allowed to break the layout margin. Nothing else may be larger or louder. |
| Ad/upsell in the learning flow | inferred norm | None. Ever. No notifications either. |
| 4–5-icon bottom tab bar | norm in consumer subset | Three **word-labelled** destinations, no icons, no badge dots, and the rail disappears entirely in Quiet mode. |
| Streak / XP / badges / hearts / leaderboard | contested, clustered | None. Progress is a shelf of objects you understand, described in words. |
| Mascot / confetti / celebration | contested, clustered | None. The reward is that the object did what you predicted. |
| Colour used for branding | universal | Colour is spent entirely on "this is alive under your hand". Never on identity. |
| Hue-alone distinction of plotted quantities | **100% of the set, by omission** | Never. Lightness + position + line style + direct label carry it; hue is the last cue, not the first. |

---

## 3. Concept sentence

> ### **Ganitatva is a bench, not a lesson: one mathematical object lies under the learner's hand, the single saturated colour in the whole app means "your hand goes here", and every other thing on screen is the quiet surface that object rests on.**

### 3.1 Does it survive the four medium tests?
- **Mobile.** Yes — and it is *strongest* here. A 5" screen has room for exactly one object and a margin. The concept makes the constraint into the idea.
- **Print / still.** Yes. A single object on a ruled sheet with a red-ochre bead, margin notes in the gutter. That is a recognisable poster.
- **Motion.** Yes. Motion exists only where the object responds to a hand. Nothing else on screen is ever allowed to move. That is a complete motion brief in one clause.
- **Sound.** Yes, and this is the test that proves it is an idea and not a tagline: a bench has one sound — the **wooden click of a bead reaching its stop**. No jingle, no fanfare, no "correct!" chime. Silence is the default state; the click is opt-in.

### 3.2 Can the first screen visibly express it?
Yes, and it must. First launch shows **one object on the bench with a geru bead on it, and one line of type.** No dashboard, no stats row, no greeting, no streak. On resume it shows *the object you were last holding*, still where you left it. If a stranger opens the app and cannot tell within two seconds which thing they are supposed to touch, the concept has failed and the screen is wrong.

---

## 4. Three directions

Genuinely different executions, not three colourways.

### Direction 1 — **THE BENCH** *(recommended)*
- **Concept sentence.** As above: a quiet working surface holding one object your hand owns.
- **Imagery system.** No illustration library at all: **the identity *is* the object vocabulary** — a finite set of ~20–30 drawable physical things (bead, rod, strip, tile, jug, ruler, string, weight, coin, die, folded sheet, balance pan) rendered by the same painter code as the interactive widgets. Doctrine's identity-as-imagery pattern `[02 §2.4]` — the Vrints-Kolsteren/NotR case, where the graphic language *is* the imagery, so it is cheap to extend and impossible to apply inconsistently. Secondary system, used sparingly: oversized numerals and ruled/ticked surfaces as texture (System 8, typographic backgrounds) `[03 §1 System 8]`.
- **Type/colour mood.** Warm paper and graphite; one red-ochre. A drawn, engraved display serif over an unmistakably legible sans. Mood: a good workshop with the light on — not a classroom, not a laboratory.
- **Hero idea (first screen).** A fraction bar lying on a ruled sheet, one geru bead on its divider, and the line *"Cut it wherever you like."* Nothing else.
- **Signature interaction.** **Quiet** — press and hold anywhere on the bench and all chrome fades away, leaving only the object and its ruling; tap to bring it back. Borrowed from Procreate's full-screen gesture. The interface literally performing its own disappearance.
- **Mobile note.** The object goes edge-to-edge horizontally while all text stays inset. On a 5" phone the bench *is* the screen.

### Direction 2 — **THE INSTRUMENT**
- **Concept sentence.** Ganitatva is an instrument for mathematics: you drive a parameter and watch the quantity answer, the way a hand on a dial moves a needle.
- **Imagery system.** No objects at all — traces, needles, scales, meters. Line-art scientific-instrument fragments `[03 §1 System 2]` used as section furniture.
- **Type/colour mood.** Dark-first instrument panel; a single phosphor-bright trace colour; grotesque + monospace, small-caps labelling, engraved tick legends.
- **Hero idea.** A function grapher: a dark panel, a dim grid, one bright live trace, and three labelled sliders in a row beneath.
- **Signature interaction.** **Solo** — hold any control and every other element on the panel dims to outline while that one parameter sweeps its full range, so you see exactly what it and only it does.
- **Mobile note.** The control row pins to the bottom thumb band `[04 §3]`; the panel fills everything above it.
- **Why it loses.** Two independent reasons. (a) Dark-first is wrong for the stated design target — a budget LCD Android phone in daylight, where a dark UI washes out and gains no battery benefit. (b) "Instrument panel" is *expert equipment* semantics. It is beautiful to us and intimidating to the exact learner in §1.2. It walks straight into the austerity failure.

### Direction 3 — **THE SURVEY**
- **Concept sentence.** Mathematics is one continuous territory, and Ganitatva is the survey you make of it — every concept a place you have actually stood in.
- **Imagery system.** Cartographic: contours, hachures, hypsometric tints, plate-mark borders, map marginalia. Concepts you understand are surveyed and contoured; the rest is blank sheet.
- **Type/colour mood.** Map conventions — letterspaced small caps for regions, italics for "water", a tinted-ochre-and-slate palette, hairline rules.
- **Hero idea.** The knowledge graph as a single zoomable sheet; the widget appears as an *inset panel* in the corner, the way a chart carries a detail inset.
- **Signature interaction.** **Zoom-to-place** — one continuous pan/zoom from the whole territory down to a single concept, with no page transition anywhere.
- **Mobile note.** Sheet pans under the finger; a fixed "you are here" pin in the lower thumb band.
- **Why it loses.** It makes the map the hero and demotes the widget to an inset — which breaks the one product rule that cannot break. It is also the closest of the three to the category's existing levels/worlds metaphor (4/16 apps), so it is the least differentiated. **Its good idea is worth keeping in a box** (§5.4).

---

## 5. Recommendation

### 5.1 The call
**Direction 1, The Bench.**

### 5.2 The honest argument
1. **It is the only one of the three that cannot be executed while breaking the product's one hard rule.** A bench with nothing on it is broken. That is a design language whose empty state *demands* a manipulable object — the rule enforces itself in the layout rather than in a code review.
2. **It is the only one that resolves the §1.2 double bind.** Warm paper, wood and graphite are *approachable without being childish* — the register of a good workshop, a craft tool, a well-made notebook. It is not a laboratory (austerity failure) and not a playground (sugar failure). Direction 2 fails the first test; a sweeter version of Direction 1 would fail the second.
3. **It is the cheapest to run at 180 concepts, by a wide margin.** The imagery system is code, drawn from a finite object library, driven by YAML config (`ADR-003`). Directions 2 and 3 both need per-concept art direction — the exact thing that caps a project at fifty concepts.
4. **It is the best fit for the actual device.** Flat fills, ink strokes, no gradients, no blur, no elevation, no shadow — this is the cheapest possible thing to render at 60fps on an ₹8,000 phone with Impeller, *and* the most legible in daylight. The aesthetic and the performance budget point the same direction, which almost never happens.
5. **It already owns material we have.** The soroban bead is in the widget kit. Making the bead the app's one saturated colour means the brand mark and the product's oldest object are the same thing.
6. **It survives the non-transferability test hardest** (see the brief, §11).

### 5.3 What choosing it costs us — stated plainly
- **We give up "delight" as a lever.** No celebration means the only reward available is comprehension itself. If the pedagogy is weak, nothing in the visual design will paper over it. This is a feature of the vision doc and a genuine risk to first-session retention. **I am recommending we accept it and let the Phase 1 human gate judge it.**
- **A paper-warm light UI is the harder of the two modes to make look expensive.** Dark UIs flatter mediocre execution; warm light ones expose it. The tick weights, the ruling and the margin have to be right or it will look like a plain form.
- **Physical-unit layout (§brief 5) is more implementation work** than percentage layout, and needs a per-platform ruler test in QA.
- **Direction 2's dark panel is the better-looking screenshot.** We will lose some store-listing glamour. We take that trade knowingly.

### 5.4 The two bounded annexations
Neither is a blend; each is a single import with a fence around it.

- **From Direction 2 — the control grammar, inside the widget only.** Labelled ticks, a named readout per control, and the discipline that every control states what it controls. It may not touch app chrome, and it may not bring the dark panel with it.
- **From Direction 3 — the map, on exactly one screen.** The Connect layer (Layer 6) and the knowledge-graph screen may use survey language: contoured for understood, blank for unmapped. It may not appear on any concept screen, and the widget is never demoted to an inset.

Anything outside those two fences is a violation of the brief, not an extension of it.

---

## 6. Open questions the next stage must not guess
1. **Font licensing must be verified before implementation** — specifically Atkinson Hyperlegible Next's weight availability and OFL terms, Fraunces' variable-axis rendering on old Android, and the KaTeX font licence as shipped by `flutter_math_fork`. If any fails, come back to me; do not silently substitute a system font.
2. **The physical-unit (`bu`) metric needs a real device test** across Android, iOS, macOS, Windows, Linux before it is trusted. Flutter does not expose true physical DPI reliably on every platform.
3. **Does the geru bead read as "wrong/error" to an actual 13-year-old?** Our rule says red never means wrong — but the rule lives in our heads, not theirs. This belongs in the Phase 1 five-tester session as an explicit question.
4. **Quiet mode's discoverability.** A hidden long-press gesture may never be found. Needs a first-run affordance decision, and it should be tested, not assumed.
5. **Whether the progress "shelf" is motivating enough to be worth building at all,** given that we have removed every other progress signal. This is a pedagogy question, not a design one — route it to the pedagogy agent.

---

## 7. Amendment — `00-VISION.md` revision of 2026-09-17 (post-research)

The vision doc was revised while this brief was being written. Two changes materially affect art direction, and the brief above has been written to absorb them rather than around them.

### 7.1 Mathigon / Polypad is the real comparison, and it was not in the teardown
The revised vision names Mathigon/Polypad as best-in-class at manipulables, free forever, 600K+ monthly users — and records that the manipulable-widget rule is **not** by itself the moat.

**This is a gap in my step-3 evidence and I am flagging it rather than papering over it.** Polypad was not among the 16 products torn down. **It is now the single most important comparison in the set and must be torn down before any build is called done.** Anything I say about its visual language here is general knowledge, not verified this session — treat it as a hypothesis for design-critic to test, not a finding.

What does not change: Polypad's stated surfaces are **web-first** — its Android app is off Google Play and its iOS listing has gone stale. So the design target that this brief is built around (**native, offline, budget Android, in the hand, in daylight**) is the surface they have abandoned. A design specified in **millimetres on a physical device** (brief §5) is a direct expression of that lane, and is close to meaningless on the web surface they own.

### 7.2 Completion is the failure mode — and we have banned every conventional lever for it
Khan Academy's own efficacy research found real gains but **only ~9% of users ever reached the usage threshold that produces them.** The revised vision draws the correct conclusion: in this category, content quality is rarely what fails — completion is.

This lands hard on us, because §2.6 of this document just deleted streaks, XP, badges, leaderboards and notifications. **We have removed the category's entire completion toolkit and must now carry completion with design instead of pressure.** Four rules in the brief exist specifically for this, and they should be read as load-bearing rather than as polish:

1. **Resume-in-place is the first screen.** The app opens on *the object you were last holding, where you left it* — not a dashboard, not a greeting, not a menu. Nothing stands between launch and the hand.
2. **No dead ends.** Every layer's end state already shows the next object. There is never a screen whose only content is that you finished something.
3. **The shelf is honest, not motivational.** Progress is the objects you actually hold, stated in words ("held" / "needs another look"). It never counts days, never counts items, never breaks.
4. **Quiet mode is a completion feature, not a flourish.** The single most common reason a 13-year-old abandons a screen is that it looks like more work than it is. Stripping the chrome to one object is the cheapest possible reduction of perceived cost.

**Honest risk, restated:** these four are weaker completion levers than a streak. That is the vision's deliberate trade, not an oversight — and the Phase 3 target of 25% D7 retention is where it gets judged. If D7 misses badly, the correct response is to re-open this trade in writing, not to quietly add a streak chip.

### 7.3 Layer 5 (Practice + mistake diagnosis) is where the product's real work lives
The revised vision moves the centre of gravity from Layers 2–3 to Layer 5. The brief's treatment of Practice is therefore not a minor screen: **the answer surface is the same manipulable object, never a multiple-choice list**, and **mistake diagnosis is words on the bench, never a colour, never a mark, never a sound.** The "red never means wrong" rule (brief §4) is what makes that possible — the palette has no vocabulary for punishment, so diagnosis has to be written.

### 7.4 Hindi is now a named strategic lane, not just Phase 7 localisation
The type system must be checked for **Devanagari** coverage before it is locked, not after. Atkinson Hyperlegible Next and Fraunces are Latin-first; Devanagari will need a third face, which is a declared exception the brief must eventually carry. **Do not solve this now — but do not pick a face that makes it impossible.** Added to the open questions in §6.
