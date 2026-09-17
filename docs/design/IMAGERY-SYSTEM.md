# Ganitatva — Imagery System Spec (Phase 0 design-doctrine gate)

Author: illustration-director. Status: DRAFT v1 — 2026-09-17, for design-director review before Art
Direction Brief lock. Depth source: `~/seo-command-center/docs/design-research/00-DESIGN-DOCTRINE.md`
[00], backed by `03-illustration-systems.md` [03], `01-ai-tells-vs-craft.md` [01], `02-studio-process.md`
[02], `06-rich-but-fast.md` [06]. Project grounding: `docs/widgets/00-kit-overview.md` [KIT],
`docs/02-PLAN.md` [PLAN], `content/concepts/arithmetic/fractions-as-parts.yaml` [SAMPLE].

**No images generated this round, per instruction.** This is the system spec and asset plan only.

---

## 0. The one fact that decides everything here

Before picking a system, I read the widget kit contract that already exists in this repo
(`docs/widgets/00-kit-overview.md`). Two things in it change the brief from "pick an illustration
style" to "there is only one correct answer":

1. **§2.1's config table already reserves a slot for exactly this job.** `interaction_level: readOnly`
   is defined as *"Renders, animates on a script, accepts no gesture"*, typical use *"Hook/Intuition
   layer illustration"* [KIT §2.1]. The Intuition layer is not a picture bolted next to a widget — it
   **is** a `GanitatvaWidget<C, S>` instance, same base class, same config envelope, same
   `describeState()` contract [KIT §2], just with gestures turned off.
2. **§7's theming law — "colour is never the sole carrier of meaning," every `role.*` paired with a
   second channel (hatch/shape/dash/position)** [KIT §7] — is written for widgets, but it is drawing
   law, and drawing law doesn't stop applying the moment a widget goes read-only.

So the imagery system for Layer 2 isn't a separate deliverable that happens to share a "vocabulary"
with the widgets by choice — it's **the same code, the same class, the same render path**, one flag
different. That is the strongest possible version of the doctrine's identity-as-imagery pattern
[02 §2, "Identity-as-imagery-system": Vrints-Kolsteren's stamp/lock-up language *is* the NotR identity
across menus, packaging, uniforms, "which keeps the system cheap to extend and impossible to apply
inconsistently"]. Ganitatva's bench-object vocabulary is not applied to the product; it is the product.

This also answers the review question up front: an asset restates the concept sentence when the exact
same object a learner sees resting on the bench in Layer 2 is the exact same object their hand moves in
Layer 3. Anything that can't make that round trip is filler, and I've cut it before it reached this doc.

---

## 1. System choice — one system, not two

**Primary system: code-drawn vector (Flutter `CustomPainter`), authored as the Bench Object Library —
the same painter language the interactive widgets already use, run in `readOnly` mode for Layer 2.**
Not SVG-via-`flutter_svg`, not raster. Reasons, in order of weight:

1. **It's already the architecture, not a new one.** See §0. Building a second, image-asset-based
   illustration pipeline alongside a widget kit that already has a `readOnly` slot for this exact job
   would be building the doctrine's anti-pattern — "assembled from a shared stock-illustration library"
   [01 craft-signal #13, inverted] — inside our own product, against our own contract.
2. **APK size, honestly solved, not budgeted around.** 180 concepts (→ growing) as 180 independent
   raster or SVG assets is a real offline-APK cost and a real consistency risk (the doctrine's own
   warning: "generate all washes in one session... one wash as the reference fed into every
   subsequent generation" [03 System 4] is a workaround for a problem that doesn't exist if there's no
   per-asset generation step at all). ~25–30 parametrized `CustomPainter` classes compile once; a new
   concept spends a few bytes of YAML config (`object: rod, count: 4, live: false`), not a new file. See
   §4 for the actual budget.
3. **It structurally eliminates the AI-tell risk surface, not just the "reject before ship" checklist.**
   [01 §1 Imagery, tells #20–21: malformed anatomy shipped unedited, Corporate-Memphis proportions] and
   [03 §3's whole "human edit pass on every asset"] are problems that only exist when there are 180
   independent generations to individually get right. With a hand-authored vocabulary, there are ~25–30
   things to get right once, reviewed once, golden-tested forever after (`docs/widgets/00-kit-overview.md`
   §9's golden-image CI gate already applies — a bench object is a widget, so a visual regression here
   already fails CI the same way a shaded-region-off-by-one fails CI [KIT §9.4]). No six-fingered hand
   is possible in a system with no hands to generate.
4. **Doctrine's own material logic rules out the two systems that would otherwise fit an "object
   library" brief.** 3D clay objects are "the highest AI-look risk... accent object, never wallpaper" —
   and the brief already rejects glossy 3D outright. Isometric mini-worlds are explicitly on the
   product's "NOT" list. Cut-out collage and hand-painted washes both require photographic/painterly
   raster — wrong medium for a soroban-bead-and-drafting-tool register that wants to read as *drawn*,
   not *painted*. Line-art corner fragments is the closest of the 8 doctrine systems in spirit, but it's
   still framed around fragments of one master scene [03 System 2] rather than a reusable object
   vocabulary — the Bench Object Library keeps that system's single-ink-line discipline
   ([03 §"AI-prompt recipe": "continuous single-weight line... no shading, no cross-hatching"] — I keep
   the single-weight-line discipline, drop the "one master scene" framing) but restructures it around
   reusable objects instead of one-off fragments, because 180 concepts can't share one master scene.

**Second system (tiny, deferred, non-generative): real photographed bench-material texture
(photo + duotone/grain grading, [03 System 5]), used on exactly one surface — the Play Store feature
graphic / App Store promotional artwork background — never inside the running app.** Justification: a
store listing is judged before install, with no live UI to show yet; a photographed close-up of real
wood grain / brass / card stock, graded to the locked palette, gives that one thumbnail-sized surface a
tactile credibility a flat vector card can't at that scale, and doctrine is explicit that this is the one
system where **you do not generate — you grade real photography** [my own Step 1 standing note, and
[03 System 5]'s "source photography (real, not AI, for authenticity)"]. Per `docs/02-PLAN.md`, store
listings are Phase 7 scope [PLAN "Phase 7 — Store listings + ASO"], so this system is **specified now,
produced later** — I give it a slot in §4 so design-director can approve or cut it at brief-lock, but no
photography is commissioned this round.

That's the whole system list: 1 primary (code-drawn, structural), 1 secondary (photo, one surface,
deferred). No AI-image generation is used for any asset that ships inside the app.

---

## 2. Style anchor and palette lock

Even though the primary medium is hand-authored Dart, not AI generation, I'm writing these as fixed,
paste-verbatim specs — they're what every `CustomPainter` class is reviewed against, and they're what
the deferred photo-grading pass (§1, second system) must match if it's ever produced.

**Style anchor (31 words):** *Flat-shade vector objects drawn like drafting-tool diagrams on warm ruled
paper — wood, brass, card, string, clay-fired bead, square-cut terminals, one hard contact shadow,
upper-left light, zero gradients, zero gloss, zero mascots, zero floating unsupported objects.*

**Palette lock (named, mapped to brief tokens — brief owns these values, I only restate them in words):**
- *paper / working-sheet / sunk* → the three warm-neutral grounds objects sit on (`paper #F5F1E8`,
  `working-sheet #FBF8F1`, `sunk #E9E3D6`)
- *ink* → all linework and material shading, never pure black (`ink-900/700/500`)
- *rule* → the one thin structural line family (ticks, margins, grid) (`rule` / `rule-major`)
- *geru* → the single saturated touch colour — **never used to render a Bench Object Library shape
  itself; only used on the same object, later, once it enters a `guided`/`free` Manipulate widget** (see
  §3.5). This is the one rule I'd flag hardest for design-director sign-off: *Layer 2 illustrations are
  `readOnly` [KIT §2.1] — nothing in them is touchable, so geru never appears in them at all.* Geru is
  not a decoration this system reaches for; it's literally absent until the same object becomes
  interactive one layer later.
- *quantity blue / quantity gold* → reserved for `role.primary`/`role.secondary` inside Manipulate
  widgets comparing 2–3 quantities [KIT §7]; the Bench Object Library's own single-object renders in
  Layer 2 essentially never need this axis (nothing to compare when there's one object). Where a Layer-2
  scene legitimately shows two of the same object for comparison (e.g. two differently-sized strips,
  per `fractions-as-parts.yaml`'s two-bar layout [SAMPLE]), it stays in ink/paper tones with a
  second-channel distinguisher (see §3.5) — blue/gold is reserved for the Manipulate widget, not spent
  early.

**Standing negative clause (applies to every object, every export, every deferred photo asset):** no
symmetrical composition · no glossy or plastic sheen · no soft/blurred ambient shadow · no rounded/soft
terminals reading as friendly-mascot · no gradient fills · no embedded digits or symbols in Layer-2
renders (zero-symbol rule is product law, not house style — see §3.5) · no floating object without a
contact shadow · no purple/teal AI palette · no isometric projection · no generic abacus-clipart or
graduation-cap silhouette anywhere in the icon set (§5).

**Light direction:** fixed upper-left (I'm using 315°/upper-left as the working default, matching the
drafting-lamp convention the reference register already implies — Japanese stationery, drafting tools).
**This is a placeholder pending design-director's Art Direction Brief locking an exact shadow-angle
token; every painter class takes it as a named constant, not a hardcoded number, so it moves once,
everywhere, if the brief specifies otherwise.**

---

## 3. The Bench Object Library

25 objects. Each is a parametrized `CustomPainter`-equivalent shape class (name, material, one-line
concept coverage, and which existing Manipulate widget it hands off to, per `docs/widgets/*.md`). Kept
to 25, not 30, because every object earns its slot by covering ground nothing else on the list covers —
a 26th object would be the first filler item, so I stopped at 25.

| # | Object | Material | Serves (Intuition layer, concepts) | Hands off to (Manipulate widget) |
|---|---|---|---|---|
| 1 | Bead | clay-fired, strung | place value, base-10 grouping, counting, abacus operations | `AbacusBoard` |
| 2 | Rod | wood | magnitude, rod-joining addition/subtraction, multiplication as rod arrays, ratio; future: unknown-length rod (algebra bridge) | `AbacusBoard`, future algebra-tiles widget |
| 3 | Strip / bar | card, scored | fractions as parts of a whole, percentages, ratio bars | `FractionBar` |
| 4 | Tile | card, gridable | area, area-as-multiplication, square numbers | `AreaModel` |
| 5 | Grid card | ruled card | coordinate plane, probability sample-space tables, area backdrop | `AreaModel`, `FunctionGrapher` |
| 6 | Jug / beaker | turned wood or brass, fill line | volume/capacity, division as pouring/sharing, rate/concentration (future calc bridge) | — |
| 7 | Weight | stamped brass disc | mass, equation balance, inequality | `BalanceScale` |
| 8 | Balance beam | wood beam, brass fulcrum | equality/inequality, "keep both sides equal" | `BalanceScale` |
| 9 | Coin / token | clay-fired disc, blank | counting, binary outcome (probability), money/decimals, TRUE/FALSE (logic) | `ProbabilitySimulator` |
| 10 | Die | carved wood cube, dot pips | probability, sample space, combinatorics, expected value | `ProbabilitySimulator` |
| 11 | Thread / string | waxed cotton | number line as taut thread, sequences as knots, graphs/networks, circumference | `NumberLine` |
| 12 | Pin / peg | brass | coordinates, marked roots/solutions, geoboard geometry, plotted function points | `FunctionGrapher` |
| 13 | Folded card | creased card | symmetry, fraction-by-folding, reflection/transformation geometry | — |
| 14 | Ruler | wood, brass edge, ticked | measurement, number-line ticks, scale/units, constructions | `NumberLine` |
| 15 | Set square + protractor | wood/brass drafting tool | angles, slope/gradient (pre-calc bridge) | — |
| 16 | Compass (drafting) | brass | circles, radius/diameter, construction, loci | — |
| 17 | Chalk tally mark | chalk on slate-dark card | tally counting, discrete counting, "visited" marker (algorithms) | `StepperMachine` |
| 18 | Open box / container | wood or card, open lid | sets (logic), equal groups, place-value carrying, stacks/queues | `StepperMachine` |
| 19 | Stack (of tiles/discs) | card or clay-fired | place-value stacking, exponents, CS stack push/pop (deliberate double meaning) | `StepperMachine` |
| 20 | Wedge / slice | cut card | fractions of a circular whole, probability spinner sectors, angle-as-turn-fraction | `ProbabilitySimulator` |
| 21 | Spool | wound thread on wood | iteration/loops (unwinding = steps), constant-rate unwind = linear function | `StepperMachine` |
| 22 | Blank tag / label | card tag on string loop, **no digits** | the unknown/variable "slot," algorithm parameter placeholder | future algebra widget |
| 23 | Perforated stencil | card, punched holes | binary/logic (hole = true), set membership, sieve-type algorithms | `StepperMachine` |
| 24 | Nested boxes | graduated wood, one inside another | recursion, place-value nesting, subsets-within-sets, self-similarity (future calc) | `StepperMachine` |
| 25 | Bench groove / inlay track | wood, carved, bead riding in it | the number line literalized as the bench surface itself | `NumberLine`, `FunctionGrapher` |

**Coverage check against the brief's domain list:** arithmetic — 1,2,17,19; fractions — 3,13,20;
pre-algebra — 7,8,22,2; geometry — 4,13,14,15,16,12; probability — 9,10,20,6; logic — 9,18,23,24;
algorithms — 17,18,19,21,23,24; forward-looking (calculus/physics) — 6, 21, 24, 25 (rate and
self-similarity are the two ideas that need a physical anchor before symbols, same as everything else).

### 3.1 Material families (the finite hatch vocabulary — 4, not 25)

Every object belongs to exactly one of four material families, and the *family*, not the individual
object, owns its rendering texture. This is what keeps 25 objects reading as one hand rather than 25
separate decisions:
- **Wood** (rod, ruler, balance-beam, spool, nested boxes, compass handle, set square, bench-groove,
  die): straight parallel grain hatch, 1 direction, ink-500 at low opacity.
- **Brass** (weight, pin, compass, fulcrum, ruler edge-trim): fine cross-hatch, 45°, ink-700 at low
  opacity, slightly denser than wood grain to read "harder" material.
- **Card** (strip/bar, tile, grid card, folded card, wedge, blank tag, perforated stencil, container,
  chalk-tally ground): flat fill only, no hatch — card is the "blank" material, deliberately the
  quietest texture so anything drawn *on* a card (scoring lines, chalk marks, punched holes) reads as
  the content, not the material.
- **Clay-bead / string** (bead, coin/token, thread): small irregular stipple (bead/coin) or a single
  clean stroke (thread/string) — the only family allowed a slightly irregular, hand-formed edge (a fired
  clay bead is not machine-precise), which is also the one deliberate "imperfection" signal the system
  carries [per 03 §3's "force imperfect/uneven linework," applied structurally to one material family
  rather than randomly across all 25].

### 3.2 Drawing rules (fixed, every object)

- **Stroke weight:** 2.5dp at a 96dp reference canvas, scaling proportionally, with a hard floor of
  1.25dp so linework never vanishes at small sizes (see §3.4).
- **Terminal style:** square-cut (butt caps), never rounded. Rounded terminals read soft/friendly/
  mascot-adjacent — the brief explicitly rejects that register — square-cut reads cut-wood/scored-card/
  drafting-tool, which is the material logic.
- **Permitted angles:** true vertical, true horizontal, and exactly one diagonal family locked at 45°
  (hatch, shadow, and any cut-line all share this single diagonal — no freehand angles). True circular
  arcs only where the object is inherently round (bead, coin, die corner radius, compass), always drawn
  as a mathematically true arc, never an organic/wobbly curve.
- **Fill logic:** flat colour, maximum two tones per object (a base tone + one darker "far side/
  underside" tone) — no gradients, ever. Pattern/hatch is the second channel wherever an object needs to
  carry more than one piece of meaning at once, matching kit law [KIT §7, "colour is never the sole
  carrier of meaning... paired with hatch/pattern fill, shape, dash style, position, or text label"].
- **Shadow:** exactly one hard-edged contact shadow directly beneath the object, ink-500 at low opacity,
  no blur/no soft falloff, no ambient occlusion. This is a *contact* shadow (object touches the bench),
  never a cast/product-render shadow implying a floating object — floating-object-with-disagreeing-
  shadow is an explicit reject condition (§6).
- **Light direction:** fixed, see §2 — one angle, never varied, across all 25 objects.

### 3.3 "This one is live" — deliberately, it doesn't show, in this layer

Per §0/§2: Layer-2 Bench Object renders are `readOnly` — nothing in them is touchable, so nothing in
them carries the geru LIVE colour. The moment the *same* object (same painter class, same parameters)
mounts inside a Manipulate widget at `interaction_level: guided` or `free` [KIT §2.1], exactly the
touchable sub-part gets geru fill/outline — the one bead that slides, the one pan that responds, the one
cut-line that drags — and everything else in the scene stays in the ink/paper palette. No idle pulse, no
looping shimmer (motion-for-motion's-sake is an explicit doctrine reject [01 tell #25]); the kit's
existing `highlight-pulse` primitive fires only on a *confirmed* state change [KIT §6], never as ambient
decoration. This is a note for platform/widgets, not something I implement — flagging it here because
it's the exact mechanism that makes "one mathematical object lies under the learner's hand" literally
true frame-to-frame, not just true as a metaphor.

### 3.4 Legibility at 24dp and at 400dp

- **24dp (app-icon-adjacent scale, dense list-row thumbnails):** every object must be identifiable by
  silhouette alone. Test: fill the object solid ink-900 on paper, no internal linework — if it can't be
  named from the silhouette, the object's shape language has failed, not the render size. At this size,
  material hatch, grain, and stipple all drop out entirely (below the 1.25dp stroke floor); only outline
  + one defining internal mark survive (e.g. the bead's string-hole, the die's single top pip).
- **400dp (Manipulate-widget scale, `expanded` desktop layout):** full detail level — material hatch
  per §3.1, the two-tone fill, the single contact shadow, and (where relevant) the geru touch affordance
  per §3.3 all render. Because these are vector paths, not raster, there is no resolution loss between
  24dp and 400dp — the detail *level* changes by design (a `detailLevel` param keyed to canvas size), not
  by upscaling artifact.

### 3.5 Zero-symbol discipline

The product rule (Intuition layer = zero symbols) is enforced at the object level, not just the concept
level: no object in this library ever renders a digit, an operator, or a letter. Object #22 (blank tag)
is deliberately blank — text mode: at most a single generic mark (a dot, a short dash) never a
character — for exactly this reason; the moment a concept needs the tag to say "3" or "x," that concept
has moved into Formalize, and formalize-layer rendering is KaTeX/Latin Modern via `flutter_math_fork`,
outside this library entirely (per the brief's locked type system).

---

## 4. Asset list and byte budget

**Framing note:** the doctrine's asset-table columns (`loading`/`fetchpriority`, CSS z-index, scroll-
linked parallax) are written for web pages [03 §2, 06]. Ganitatva's Layer-2/3 illustration ships inside
a native Flutter app, not a browser — I'm translating each column to its Flutter equivalent rather than
forcing web semantics onto a different runtime, and flagging the one place (the Phase-7 SEO web surface,
[PLAN]) where the literal web rules will apply unchanged.

| Asset | Format | Renders via | Bundled bytes | Loads | Notes |
|---|---|---|---|---|---|
| Bench Object Library (25 objects × `readOnly`/`guided`/`free` variants) | Dart `CustomPainter` classes (vector, code) | compiled into the AOT binary | **est. 40–80KB compiled Dart** for the full 25-object set (order-of-magnitude estimate — actual number is a platform build-output measurement, not an asset-pipeline number) | always resident, no runtime fetch, no lazy-load concept applies | marginal cost per *new* concept ≈ 0 bytes (a YAML config line referencing an existing object) |
| Android adaptive icon foreground | Vector Drawable (XML) authored from the same path data as icon direction §5 | native Android renderer, resolution-independent | ~2–6KB | always resident | background layer is flat `paper` colour, no image |
| Android adaptive icon fallback raster (older API levels, if `flutter_launcher_icons` tooling requires it) | PNG, mdpi–xxxhdpi (48–192px) | packaged mipmap set | ~15–25KB total across densities | always resident (only the device's own density ships) | only produced if platform agent confirms vector-only isn't supported at target min-SDK |
| iOS icon | PNG 1024×1024, flattened, **no alpha** (App Store requirement) | Xcode asset catalog, auto-derives smaller sizes | ~80–150KB (single source file; Xcode generates the rest at build time, not shipped as 15 separate files) | always resident | must be flattened — iOS icons render behind an OS-applied mask/shine, alpha is rejected at submission |
| macOS icns | `.icns` bundle, 16–1024px raster set, generated from the 1024 master via `iconutil` | app bundle resource | ~200–350KB (icns bundles all sizes in one file) | always resident | |
| Windows ico | `.ico`, 16/24/32/48/256px raster set | app resource | ~100–150KB | always resident | 256px slot stores an embedded PNG per the ICO spec |
| Empty/rest states (e.g. "no concepts unlocked yet," "download more content") | same `CustomPainter` objects, composed (a nested-box or open-container, per §3, in a resting pose) | compiled Dart, reuses existing painters | **0 marginal bytes** | always resident | deliberately *not* a bespoke illustration — reuses #18/#24 so the empty state still reads as "the same bench," not a foreign mascot moment |
| Error/offline state | same system — a folded-card (#13) with one corner turned, or the bench-groove (#25) shown empty | compiled Dart | 0 marginal | always resident | offline is the product's normal state, not a failure state — the illustration should not apologize for it (matches "fully OFFLINE" as a feature, not a degradation) |
| Onboarding (max 3 screens) | same `CustomPainter` objects, `readOnly`, drawn from whichever object the first 3 unlocked concepts already use | compiled Dart | 0 marginal | always resident | **recommend not commissioning bespoke onboarding art at all** — reusing the first real concepts' Layer-2 objects is both cheaper and more honest (the product is shown doing its actual job from screen 1) |
| Store screenshot frames (Play, App Store, Mac App Store) | PNG/JPEG, fixed per-store device-class dimensions | real device/simulator screenshots + a caption band overlay (Fraunces headline on a `paper`/`sunk` band) | not bundled in the app; produced once, uploaded to console | N/A (marketing collateral, zero runtime cost) | **Phase 7 scope per `docs/02-PLAN.md`** — specified here, produced later |
| Feature graphic / promo art background (optional, second system) | JPEG or WebP, photographed material texture, duotone-graded to palette | real photography, graded, composited with exported vector objects on top | not bundled in the app | N/A | deferred — see §1's "second system"; needs design-director approval before any photography is commissioned |

**Total bundled true-image-asset budget target for the budget-Android build: ≤150KB** (icon files only —
everything else in the table above is either compiled code with ~0 marginal bytes or produced outside
the app entirely). This is a deliberately different shape of budget than a typical web-illustration
project: instead of a per-page byte ceiling, almost the entire visual system is free at the margin
because it's code, not files — the actual size lever for this app lives in the Flutter engine binary
and font subsetting, both outside this document's scope.

---

## 5. App icon direction — 3 proposals

All three must clear: legible at 48px on a cluttered Android home screen, legible and distinctive at
1024px, and must not collapse into the brief's named clichés (graduation cap, abacus clipart, blue
square with x²). All three are drawn *only* from the Bench Object Library — no new shapes invented for
the icon.

**A — "The tick and the bead" (recommended).** A single ruled tick-line (like a notebook margin rule,
object family: card/rule) crossing the icon slightly off-centre, with one bead (object #1) resting on
it, rendered in the single geru LIVE colour — the only element on the entire icon that isn't
ink-on-paper. Everything else in the product spends geru sparingly on one touchable thing per screen;
the icon spends it on the one thing the *whole app* is about. At 48px this reads as a warm cream square
with a single small red-ochre mark on a line — an ownable, near-abstract silhouette that doesn't compete
with the 40 other icons around it on a home screen. At 1024px, tick subdivisions either side and a faint
wood-grain hatch under the line become visible. This is the one proposal that makes the concept
sentence — "the single saturated colour... means your hand goes here" — literally, not
metaphorically, the icon.

**B — "The corner fold."** A card square (object #13, folded card) with one corner folded down,
pinned by a single brass pin (object #12) at the fold point. Reads as "there's a physical object here
with a worked crease in it," ties to the symmetry/fraction-folding object. **Flagged risk:** dog-ear/
folded-corner icons are a moderately common shape in note-taking and document apps; recommend B only as
a fallback if A tests poorly, and only with the pin detail doing the differentiating work.

**C — "The balance notch."** An ultra-reduced single-stroke balance beam (object #8) — just beam and
fulcrum, no pans — tipped asymmetrically, with the lower (tipped-down) end marked in geru. Deliberately
off-centre and asymmetric (satisfies the doctrine's "no symmetrical composition" instant-fail check even
at icon scale). Reads as a simple diagonal stroke pivoting on a dot at 48px. Weaker than A on
distinctiveness (a tilted line is a more generic shape family than a tick-plus-bead), stronger than A on
literally depicting "equation/balance," which is closer to what school-math iconography usually reaches
for — meaning it risks being *slightly* more legible as "a math app" and slightly less bespoke.

**Recommendation: A**, with B held as the only fallback (not C — C's tilted-line-and-dot silhouette is
too close to a generic "chart/trend" glyph family at 48px, which is its own kind of cliché collision).

---

## 6. Anti-AI + a11y rules enforced on every asset

**Anti-AI (structural, not per-asset, per §1.3):** because the primary system is hand-authored code, the
usual per-image reject list (glossy sheen, symmetry, malformed hands, purple/teal palette, floating
objects) is enforced once, at the 25-object review, not 180 times. I will still run every object through
the doctrine's reject checklist [00 Step 5 / 01 §3] at first-implementation review: no glossy/plastic
sheen · no bilateral symmetry in any composed scene (individual objects may be locally symmetric — a
die, a coin — but multi-object Layer-2 scenes must not centre/mirror) · no overdetailing (each object
caps at 2 fill tones + 1 hatch, per §3.2, specifically to prevent overdetailing creeping in over 180
concepts' worth of "just one more detail" requests) · no floating objects without the fixed contact
shadow · no purple/teal palette (structurally impossible — the palette lock has no purple or teal token
to reach for) · the deferred photo-texture system (§1) is the one "mix real media" element on the page
per [03 §3's mixing-media rule], satisfied at the store-listing surface rather than in-app.

**Accessibility, mapped to Flutter (not the web `alt` decision tree, per [06 §5], translated to this
runtime):**
- **Meaningful (a Layer-2 Bench Object that IS the lesson):** every one, being a `GanitatvaWidget`,
  implements `describeState()` with a full sentence, not a label — e.g. *"A card strip, scored into four
  equal parts, one part shaded"* — per the kit's existing contract [KIT §2 point 3, §8 point 2: "not
  `3/4`"]. Writing the content of that sentence per object is illustration-director's job; the mechanism
  already exists in the kit, so nothing new is being invented here.
- **Decorative (a background hatch fill, a non-content flourish on an empty/error state):** wrapped in
  `ExcludeSemantics` — Flutter's direct equivalent of `alt=""` (empty, never omitted) [06 §5].
- **Contrast:** ink-on-paper linework (`ink-700` on `paper`, `ink-300` on `bench` dark) checked at
  4.5:1 for any label text and 3:1 for the object's own meaningful outline/fill boundary once it's part
  of an interactive widget (WCAG 1.4.3 / 1.4.11, [06 §5 lines ~145–147]) — checked at the *worst-case*
  overlap point, never the average, per doctrine. **Flagging for verification once design-director's
  brief locks exact overlay scenarios** — Layer-2 renders carry no text by the zero-symbol rule (§3.5),
  so this mostly applies to Manipulate-layer composites, which is platform/widgets' build surface, not
  mine, but the rule originates here.
- **CVD:** the quantity blue/gold axis inherits the kit's existing golden-test requirement — one
  deuteranopia-simulated render per widget state that uses `role.primary`/`role.secondary`
  [KIT §9.3 point 5] — already mandatory kit-wide, restated here so it isn't lost crossing from platform
  docs into design docs.
- **Focus/keyboard:** not this document's surface (Layer-2 is `readOnly`, non-focusable by definition);
  flagged to widgets for the Manipulate-layer instances of the same objects, per [KIT §4.5, §8 point 5].

---

## 7. The one honest risk

**This spec looks cheap and safe on paper (near-zero marginal bytes, near-zero AI-tell risk) and that's
real — but it moves the entire cost from "commission N images" to "build ~25 correct, reusable, animatable
Dart painter classes," and that's platform/widgets engineering, not illustration-direction. I can design
the vocabulary and the drawing rules; I cannot personally implement 25 `CustomPainter` classes with
detail-level LOD, material hatch families, and `describeState()` sentences. If that engineering capacity
isn't scheduled and resourced as its own workstream — distinct from "design is done" — this gate passes
on paper while Phase 1+ ships with placeholder grey boxes standing in for every Intuition layer, which is
the single most visible way this plan could fail without ever looking like a design failure.** Concretely:
this needs a line item and an owner (likely platform/widgets, in the same cadence as the widget-kit build
itself, since it *is* the widget kit) before it counts as scheduled, not just specified.

**Cut order if the byte budget or schedule breaks (in order, nothing on this list touches the 25-object
core vocabulary — that's load-bearing pedagogy, not polish):**
1. The deferred photo+duotone store-feature-graphic background (§1 second system) — ship flat
   vector-only store art instead. Zero loss to the in-app product.
2. Material-hatch fidelity at 400dp — collapse from 4 material families to 2 (wood, card) by folding
   brass into wood's hatch angle and clay-bead into card's flat fill. A richness cut, not a functional
   one; the silhouette-level identification (§3.4) is unaffected.
3. Bespoke onboarding art — already recommended against commissioning in §4; if somehow scoped in
   first, cut it first, since reusing the first 3 concepts' real Layer-2 objects was always the cheaper
   and more honest option.

**Not cut under any budget pressure:** the app icon (§5 — the single most-seen asset the product has),
and the 25-object vocabulary's breadth (§3 — cutting objects means some concept in the 180-concept plan
has no valid Intuition-layer object to reach for, which breaks the pedagogy contract, not just the visual
system).

---

## 8. Consistency checklist (ticked against this spec)

- [x] Style anchor written once (§2), verbatim, paste-only from here forward.
- [x] Master reference is the drawing-rules document (§3.2–3.4), not a single reference image — correct
      adaptation for a code-drawn system, where "the reference" is the rule set every painter class is
      reviewed against, not a generated master asset.
- [x] Colours named in words, mapped to brief tokens (§2) — no hex invented, none contradicted.
- [x] Light direction fixed (§2, §3.2) — flagged as pending final confirmation against design-director's
      brief, not guessed silently.
- [x] Whole vocabulary specified in one pass, one session (this document), not built asset-by-asset over
      time — the single biggest lever against drift across 180 concepts.
- [x] Identical "post-process" pass defined structurally: 4 material families (§3.1), 2 fill tones max,
      1 hatch angle, 1 shadow treatment — applied by rule to every object, not eyeballed per asset.
- [x] No AI-image generation used or planned for any in-app asset; the one photographic asset (§1 second
      system) is explicitly graded-real-photography, explicitly deferred, explicitly single-surface.

## Per-asset-category pass line (anti-AI-image rules, §00 Step 5, applied structurally)

- **Bench Object Library (25 objects):** no glossy/plastic sheen (flat fill only, §3.2) · no symmetry in
  composed scenes (§6) · no overdetailing (2-tone/1-hatch cap, §3.2) · no floating objects (mandatory
  contact shadow, §3.2) · no broken hands/malformed anatomy (no anatomy in the object set at all) · no
  purple/teal (not in palette lock, §2). **PASS by construction**, pending first-implementation visual
  review against this spec.
- **App icon (3 proposals, §5):** asymmetric where relevant (C explicitly, A implicitly off-centre) ·
  no generic grad-cap/abacus-clipart/blue-x² silhouette (explicitly checked against brief's named
  clichés) · legible at 48px and 1024px (stated per-proposal). **PASS**, recommend A.
- **Empty/error/onboarding states (§4):** reuse existing reviewed objects, zero new generation surface.
  **PASS by inheritance** from the Bench Object Library review.
- **Store/marketing surfaces (§1, §4, deferred):** real photography only if produced, explicitly not
  AI-generated, explicitly single-surface, explicitly Phase 7. **N/A this round — nothing produced.**

---

## 9. Convergence check against `01-DISCOVERY-AND-DIRECTIONS.md`

I read (not edited) design-director's concurrent draft before finishing this spec. Direction 1, "THE
BENCH," independently arrives at the same primary system: no illustration library, "the identity *is*
the object vocabulary... rendered by the same painter code as the interactive widgets," citing the same
identity-as-imagery pattern [02 §2.4 there, §2 "Identity-as-imagery-system" here — same source, adjacent
line numbering]. No contradiction to reconcile on the primary system; §1–§4 of this document are the
detailed execution of that direction, not a competing one.

**One scope question for design-director, not resolved unilaterally:** that draft names a *secondary*
system, "oversized numerals and ruled/ticked surfaces as texture (System 8, typographic backgrounds)
`[03 §1 System 8]`," used sparingly. System 8 is zero-asset by definition [03 System 8: "none beyond a
web font... this system deliberately avoids the AI-image-look problem altogether"] — no image files, and
in this Flutter context it's most naturally a thin background `CustomPainter` (ruled lines, faint
oversized numerals at low opacity behind content) rather than an "object" at all — it's environment, not
something a hand touches, so I did not fold it into the 25-object Bench Object Library in §3 (adding it
there would have been the first filler item, per my own review question). I'd treat it as in scope for
whoever owns screen/background chrome (theme-dev, step 11) rather than this document's object
vocabulary — flagging the boundary rather than guessing which agent claims it. If design-director wants
it specified here instead, it's a small addition (one more `CustomPainter`, ~0 marginal bytes, same
palette/light-direction constants from §2) and I can add it on request.

---

*No files written outside `docs/design/`. This file: `docs/design/IMAGERY-SYSTEM.md`, the only file this
agent touched.*
