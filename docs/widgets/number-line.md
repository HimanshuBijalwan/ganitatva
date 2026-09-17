# NumberLine

> Inherits the base contract in `00-kit-overview.md`. Read that first — this spec only states what's
> specific to `NumberLine`.

## 1. Teaching job

**The one misunderstanding this widget exists to destroy:** a learner believes division always shrinks —
so "3/4 ÷ 1/2" feels like it should produce something smaller than 3/4, and "flip and multiply" lands as an
arbitrary trick to memorize rather than a fact they could have predicted. `NumberLine` destroys this via
**measurement (quotative) division**: ÷ ½ is not "shrink 3/4", it's the question *"how many half-size hops
fit inside 3/4?"* — a counting question. The learner physically hops a half-length step along the line,
counts hops (1 full hop, then a half hop left over — 1.5 hops total), and the answer "more than one hop"
falls out of *counting*, not calculating. That single reframe — division as "how many of these fit" — is
the whole reason this widget exists.

Secondary, general-purpose job (used across many non-fraction concepts too): a number is a **position on a
continuous line**, not just a count of discrete objects — this is what makes negative numbers, fractions,
and decimals feel like "the same kind of thing" instead of three unrelated systems.

## 2. Config schema

```jsonc
{
  "type": "NumberLine",
  "config": {
    "id": "line-a",
    "interaction_level": "guided",
    "mode": "measure-division",       // "explore" | "plot-point" | "jump" | "measure-division" | "compare"
    "range": { "min": -2, "max": 4, "hard_bounds": true },
    "ticks": { "major_interval": 1, "minor_interval": 0.25, "label_style": "fraction" }, // "fraction"|"decimal"|"mixed"|"none"
    "markers": [
      { "id": "m1", "value": 0.75, "color_role": "primary", "shape": "circle", "label": "3/4", "draggable": true }
    ],
    "jump": { "start": 0, "size": 0.5, "count": "auto", "direction": "forward", "show_arcs": true },
    "measure_division": { "dividend": 0.75, "divisor": 0.5, "reveal_remainder_as_fraction": true },
    "zoom": { "enabled": true, "min_scale": 0.5, "max_scale": 4 },
    "snap_to": "denominator-of-divisor"  // "tick" | "any-forbidden" | "denominator-of-divisor" | "denominator-of(marker id)"
  }
}
```

**Build-time validation:** `measure_division.divisor` must be non-zero (schema-enforced — "divide by zero"
is never a reachable config, not merely a UI-blocked one); `range.min < range.max`; every `markers[].value`
must lie within `range` or the build fails; `snap_to: "any-forbidden"` exists only as an explicit,
named-and-justified escape hatch for `mode: "explore"` free plotting — every other mode requires a defined
snap grid (kit overview §4.2).

## 3. Interaction model

- **Drag-to-position** a marker along the line; it snaps to the grid defined by `snap_to` (kit overview
  §4.2) — in `measure-division` mode specifically, ticks snap to multiples of the divisor, so a learner
  literally cannot place a marker "almost at a half-hop" — the line only offers valid hop-lengths as
  landing spots.
- **Jump/hop control:** a single "hop" button (44pt, bottom-docked on `compact`) advances one jump of
  `jump.size` and increments a large, visible hop counter. The learner self-paces — taps once per hop — so
  the *counting itself* is their action, not something animated past them. A "play all hops" auto-run exists
  but is never the first exposure (`interaction_level: guided` forces manual stepping for the first pass
  through any `measure-division` concept).
- **Zoom** via `+`/`−` buttons (kit overview §4.3) plus optional pinch/scroll-wheel as an accelerator, never
  a requirement.
- **What the learner cannot break:** markers cannot leave `range` (dragging clamps at the bound — the line
  has hard edges early in the curriculum specifically so numbers stay concrete before negatives/large
  magnitudes are introduced elsewhere); `jump.size` and `measure_division.divisor` can never be 0 (not a
  reachable config, see above); in `measure-division` mode the hop button is disabled mid-arc (can't stack
  hops faster than they can be counted — see §5).

- **Mode caveat for negative-number concepts (content-authoring note, not a config constraint):** curriculum
  research into fraction/integer misconceptions (see `docs/research/03-other-fracture-points.md`) flags that
  a *static* `plot-point` presentation of negative numbers ("label −3 on the line") risks reinforcing two
  documented misconceptions — split-ray thinking (treating the line as two disconnected positive/negative
  rays meeting at zero) and amalgamated translation (confusing a number's position with an operation's
  direction). For negative-number concepts specifically, authors should prefer `mode: "jump"` — directional
  movement framed in a concrete context (temperature drop, elevation change, debt) — over `plot-point`, so
  a negative number is first felt as "a movement in the other direction" on the *same continuous line*,
  never as a separate labeled dot. `plot-point` remains appropriate for its actual job here: confirming a
  fraction's position once magnitude, not direction, is the point.

## 4. Responsive behaviour

- **`compact`:** the line fills the width; when `range` is wider than fits legibly at the current zoom, the
  line pans/scrolls horizontally rather than compressing tick spacing below a legible minimum. The zoom
  `+`/`−` cluster and the hop/step button sit in the bottom-third thumb zone (kit overview §5.2); double-tap
  on the line zooms to a region around the tap point as an accelerator.
- **`expanded`:** the full configured `range` is visible without panning by default (line width scales to
  fit). Hovering any point shows an exact-value tooltip (fraction, decimal, and mixed number). Keyboard:
  focused marker moves by one snap-step per arrow-key press (kit overview §4.5); Space triggers the next
  hop in `measure-division`/`jump` modes.
- **Tick label collision rule (both tiers, but binding on `compact`):** below a computed px-per-label
  threshold, labels thin out by dropping every other minor-tick label rather than shrinking font size below
  the legible floor. Major-tick (integer) labels are never dropped.

## 5. Animation spec

| Trigger | Primitive | Duration | Pedagogical justification |
|---|---|---|---|
| Each hop (measure-division / jump mode) | `trace-path` (arc rises and lands on the next snapped tick) | 300–500ms per hop, ease-in-out, then a **200ms hold** before the next hop is allowed | The hop-count number increments **on landing**, not on arc start — number and motion are causally tied. The 200ms hold between hops keeps hops visually discrete; blurring them into one continuous slide would hide the thing being counted. This is the load-bearing animation for the whole widget's teaching job. |
| Next hop, before commit | `ghost-preview` — faint preview of the landing zone | continuous while pending | Lets the learner predict where the next hop lands before it happens — predict-then-confirm is a stronger intuition builder than watching a hop resolve passively. |
| Marker drag | `snap-settle` on release | 150–200ms | Confirms the release landed on a valid grid point, not an approximation. |

## 6. Accessibility

- Every marker's position is announced as **fraction, decimal, and mixed number together** — e.g. *"three
  fourths, 0.75"* — never a bare decimal, since decimal-only readout would defeat a fraction-focused lesson.
- Multiple markers are distinguished by **shape** (circle/triangle/square) **and** color **and** a text
  label — never color alone (kit overview §7); this matters especially in `compare` mode where two markers
  sit close together.
- The line exposes an `adjustable` (slider-like) Semantics role with a live region announcing value changes;
  in `measure-division`/`jump` mode, each hop gets its own announcement — *"Hop 1 of 2: now at one half. Hop
  2 of 2: now at one. Remaining: one fourth of a hop."* — rate-limited to one announcement per committed hop,
  never per animation frame (kit overview §8.4).
- `describeState()` for `measure-division` mode returns the full sentence form of the division itself once
  complete: *"Three fourths divided by one half: one full hop and one half of another hop — one and a half
  hops total."*

## 7. Golden-test plan

1. `default-integers__compact` / `__expanded` — plain integer line, no fractions, baseline case.
2. `fraction-ticks-quarters__compact` — minor ticks at 1/4 intervals with fraction labels, the canonical
   fractions-slice state.
3. `negative-range-crossing-zero__expanded` — range spans negative to positive, confirms zero-crossing
   renders unambiguously.
4. `measure-division-hop-arc__t0`, `__t0.5-mid-arc`, `__t1-landed` — three pinned frames of the load-bearing
   `trace-path` hop animation for 3/4 ÷ 1/2, at injected controller values 0, 0.5, 1.
5. `measure-division-complete__compact` — end state showing "1.5 hops", hop counter, and remainder framing
   together — this is the single most pedagogically load-bearing static state per kit overview §9.3.2.
6. `zoomed-in-region__expanded` — post-zoom state, confirms tick relabeling at higher zoom.
7. `dense-minor-ticks-label-collision__compact` — narrow-width case forcing the every-other-label collision
   rule (§4) to fire; must show thinned labels, not overlapping text.
8. `compare-two-markers__expanded` — two distinctly-shaped markers on one line.
9. `deuteranopia-marker-distinction` — colour-vision-deficiency simulated render of state #8, confirming
   shape alone disambiguates the markers.
10. `dark-theme__measure-division-complete` — dark-theme render of state #5.
