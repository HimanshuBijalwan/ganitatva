# ProbabilitySimulator

> Inherits the base contract in `00-kit-overview.md`. Read that first — this spec only states what's
> specific to `ProbabilitySimulator`. Shorter-form spec per the assignment's priority order.

## 1. Teaching job

**The one misunderstanding this widget exists to destroy:** a learner treats a single trial (or a handful of
trials) as meaningful evidence about probability — the gambler's-fallacy family of beliefs ("it's due for
tails," "that die rolled a 6 last time so it won't again") and the deeper confusion that theoretical
probability is a promise about the *next* outcome rather than a statement about *long-run frequency*.
`ProbabilitySimulator` destroys this by making the gap between "one trial" and "many trials" directly
visible: a live frequency chart converges toward the theoretical line only as trial count climbs into the
hundreds, and it visibly does **not** converge at low trial counts — the widget's most important design
decision is refusing to hide that early-trial noise.

## 2. Config schema

```jsonc
{
  "type": "ProbabilitySimulator",
  "config": {
    "id": "sim-a",
    "interaction_level": "guided",
    "mode": "explore",                  // "explore" | "converge-challenge"
    "device": { "type": "coin", "faces": ["heads", "tails"], "weights": [0.5, 0.5] },
    "trial_speed": { "step_mode": "single-step", "batch_size": 10 }, // "single-step" | "batch" | "instant"
    "run_count_target": 200,
    "show_running_frequency_chart": true,
    "show_theoretical_line": false,     // revealed only after some trials — see §5
    "seed": 20260917                    // REQUIRED — determinism for golden tests, per kit overview §2.1
  }
}
```

**Build-time validation:** `weights` must sum to 1 (schema-enforced, not merely UI-checked — an invalid
weight set is not a reachable config); `seed` is a required field for this widget specifically (the one
widget in the kit whose whole point is randomness, so it's the one place the kit-wide "seed required for
randomness" rule in `00-kit-overview.md` §2.1 actually binds).

## 3. Interaction model

- A single **"run trial"** button (44pt, thumb zone) fires one trial; **batch buttons** ("run 10" / "run
  100") fast-forward multiple trials without individual animation once `trial_speed.step_mode` allows it
  (§5). The running frequency chart updates after every trial, single or batched.
- **What the learner cannot break:** the trial log is append-only — past results cannot be edited, deleted,
  or "redone" (immutability is itself part of the lesson: real trials happened, you don't get to erase
  inconvenient ones); weight sliders (if exposed for `custom-weighted` devices) auto-normalize on drag so
  the set always sums to 1 — a learner cannot produce an invalid probability distribution by dragging one
  slider without the others compensating.

## 4. Responsive behaviour

- **`compact`:** device visual (coin/die/spinner) occupies the top third; the single big "run" button sits
  directly below it in the thumb zone; the frequency chart occupies the bottom third with the full trial
  history collapsed behind a "view log" toggle (not shown by default — a scrolling raw list of hundreds of
  trials doesn't fit and isn't the point; the chart is).
- **`expanded`:** device and chart render side by side; the full trial history is visible as a persistent
  table alongside the chart, since desktop width affords it without competing for the primary device+chart
  view.

## 5. Animation spec

| Trigger | Primitive | Duration | Pedagogical justification |
|---|---|---|---|
| Single-step trial (device animation: coin flip / die tumble / spinner spin) | physical randomizing motion, must look genuinely undetermined mid-animation | coin 500–700ms, die 400ms, spinner variable (friction-based) | If a learner can visually "read" the outcome before it lands, the animation undermines trust in the randomness it's meant to demonstrate — this is a hard correctness requirement on the animation, not a style choice. The first ~10 trials of any session always animate individually (never batch-skipped) so the learner viscerally connects "one flip = one data point" before batch mode abstracts it away. |
| Batch run (>20 trials at once) | brief motion-blur cue, then instant tally — no per-trial animation | ~400ms total | Keeps pace reasonable once the single-trial connection is already established; explicitly *not* used for the first ~10 trials (see above). |
| `show_theoretical_line` reveal | fade-in, 300ms | 300ms | Gated behind a minimum trial count (exploration-gated reveal, mirroring `concept.schema.json`'s `manipulate.reveal` pattern) — showing the theoretical line before any trials exist would hand the learner the answer instead of letting them watch convergence happen. |

## 6. Accessibility

- Outcomes are announced by **name/text always**, never color-only — die results show pip pattern **and**
  numeral, coin results show the face name as text (kit overview §7).
- The frequency chart has a **live text-equivalent summary**, e.g. *"Heads: 12 of 20, 60%. Theoretical: 50%
  (hidden until revealed)."* — updated on every commit, not every animation frame.
- Single-step mode announces each trial individually; batch mode announces one **summary** per batch (*"Ran
  10 trials: 6 heads, 4 tails"*), never 10 separate announcements — this is the same rate-limiting rule as
  `stepper-machine.md`'s batch/auto-play handling (kit overview §8.4).

## 7. Golden-test plan

1. `pre-trial-idle__compact` / `__expanded` — device at rest, no trials run.
2. `mid-flip-animation__t-mid` — pinned mid-animation frame of the coin/die/spinner motion.
3. `post-trial-result__compact` — single result just landed.
4. `frequency-chart-n1__expanded` vs `frequency-chart-n100__expanded` — this pair is the single most
   pedagogically load-bearing state in the widget: n=1 must look chaotic/uninformative, n=100 must show
   visible convergence toward the theoretical line (kit overview §9.3.2).
5. `weighted-custom-device__expanded` — non-uniform weight set, confirming normalized-weight rendering.
6. `seeded-determinism-check` — same `seed`, full run reproduced pixel-identical (proves the determinism
   requirement itself, not just a visual state).
7. `deuteranopia-chart-series` — colour-vision-deficiency simulated render of state #4 (n=100), confirming
   chart series are distinguishable without color (pattern/texture-differentiated bars or lines).
8. `dark-theme__frequency-chart-n100` — dark-theme render.
