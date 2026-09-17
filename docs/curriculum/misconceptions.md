# Ganitatva — Misconception Diagnosis Catalog

> **Owner:** pedagogy. **Status:** Phase 1 (fractions chain) complete; other tracks stubbed as they are authored.
> **Companion files:** `content/concepts/arithmetic/*.yaml` (each concept carries its own `practice.misconceptions`
> block — this document is the cross-cutting analysis and the engineering contract that sits behind them).

---

## 1. The stance

A red ✗ teaches nothing. Neither does restating the correct procedure more slowly and more loudly.

The premise of this catalog, and of the product, is this:

> **Learners are almost never careless. They are applying a rule that is consistent, that they inferred
> honestly from the evidence they were given, and that has usually worked for them until now.**

A learner who answers `1/2 + 1/3 = 2/5` is not failing to concentrate. They are executing a rule —
*operate on each part separately* — which is how coordinates add, how column addition works place by place,
how you combine scores across two innings, and, crucially, how multiplying fractions genuinely does work.
The rule is a reasonable generalisation. It is simply out of domain.

That changes what a remedy is. A remedy is **not** an explanation. A remedy is **an event that the learner's
belief cannot survive** — staged in a widget, watched happening, and named afterwards.

**The authoring rule that follows:**

| Not a remedy | A remedy |
|---|---|
| "Remember, you can't add the denominators." | Their answer is plotted on the number line and lands *between* the two amounts they added. |
| "The denominator tells you the size of the piece." | The slider cuts the bar into more pieces and the piece swatch visibly shrinks while the number grows. |
| "You have to flip the second fraction." | Set the target to one whole, count the sticks, and find the flipped fraction sitting there as a measured count. |
| "The remainder is a fraction of the divisor." | Physically drag the leftover ribbon onto the stick and see it cover half of it. |

If a remedy in any concept file can be satisfied by a sentence, it is not finished. The lint in
`scratchpad/validate.py` flags remedies whose text restates a procedure; the human check is harder and matters more.

**Never mark a diagnosed misconception simply wrong.** Name the frame the learner used, show that it is a true
statement about a different question, then show which question was asked. A learner who is told "no" learns to
guess. A learner who is told "that is the answer in metres, but you were counting sticks" learns the concept.

---

## 2. The eight root generators

Most of the ~45 distinct fraction errors catalogued below are produced by **eight** underlying beliefs.
Treat these as the real targets; the surface errors are symptoms. Fixing a symptom without touching its
generator buys you one question.

### G1 — Whole-number bias
*A fraction is two whole numbers that happen to be written close together.*
The learner's entire numerical experience before fractions involved single symbols whose magnitude was
directly readable. Nothing in `3/4` signals that the two digits are not independent.

**Produces:** `1/8 > 1/4` · `3/4 > 2/5` because 3>2 and 4>5 · placing `3/4` at the third tick ·
componentwise addition · "what is the next fraction after 3/4".
**Killed by:** the number-line concept. One point, one number, and the two digits are walking directions.
**Status: this is the single highest-value generator in Phase 1.** It has the widest blast radius.

### G2 — The vanished whole
*A fraction is an absolute amount, like "one litre".*
The word "of" is silently dropped. Half becomes a quantity rather than a proportion.

**Produces:** "half of a small bar = half of a big bar" · comparing shaded areas across differently-sized
diagrams · confusion about why `1/2` of 8 and `1/2` of 40 differ.
**Killed by:** two bars of different `whole_length` in `fractions-as-parts`; then the number line, which has
exactly one whole and shares it.

### G3 — Componentwise transfer
*An operation applied to a pair applies to each part separately.*
Correct for vectors, for column addition, for scaling a recipe — and for multiplying fractions.

**Produces:** `a/b + c/d = (a+c)/(b+d)` · adding k to top and bottom for equivalence · subtracting
componentwise to compare.
**Killed by:** the mediant trap (§4.5) — the strongest single confrontation in the chain, because the wrong
answer refutes itself without anyone being told.
**Caution:** componentwise *division* is algebraically valid (see §5.2). Do not build a detector for it.

### G4 — Direction slogans
*Multiplying makes bigger. Dividing makes smaller.*
Inferred from whole-number arithmetic where every multiplier and divisor met was ≥ 2. The rule has a
perfect track record because it was never tested at or below 1.

**Produces:** rejecting a correct smaller product · rejecting a correct larger quotient · re-doing correct work.
**Killed by:** `size_predictor` in both operation concepts, with the boundary discovered at exactly 1.
**Replacement risk — read this twice:** a chain that shows only divisors below 1 installs the equally false
*"dividing by a fraction always makes it bigger"*. The `stick-past-one` preset and the
`divisor-greater-than-one` generator are **mandatory in every practice mix**, not optional enrichment.
The sentence the learner leaves with must be about **one**, never about fractions.

### G5 — Division means sharing
*Divide = split into equal shares.*
Taught first, taught hardest, and it collapses the instant the divisor is a fraction — you cannot share
something among half a person. The learner concludes, reasonably, that the operation is meaningless and that
"flip and multiply" is an arbitrary rule to be obeyed.

**Produces:** "dividing by a fraction doesn't mean anything, it's just a rule" — *often while producing
correct answers* · inability to choose which number is the divisor in a word problem · flipping the wrong one.
**Killed by:** establishing measurement division ("how many of these fit inside that") on **whole numbers**,
before fractions — hence the `math.arithmetic.division-as-measuring` node, which is a sibling of
`division-as-equal-sharing`, not downstream of it. The two meanings genuinely branch.
**This is the root cause of the flip-and-multiply alienation.** It is invisible on every marking scheme.

### G6 — The remainder frame error
*A leftover is expressed in wholes.*
True of every ruler the learner has ever used: one metre and a bit, and the bit is in centimetres, never in
tape-lengths.

**Produces:** `3/4 ÷ 1/2 = 1¼` — the central error of the exit-gate concept · "1 remainder 1/4" as a final answer.
**Killed by:** `remainder.compare_against: measuring_stick` — dragging the leftover onto the stick — plus the
`frame_toggle` that shows *both* readings as simultaneously true.

### G7 — Procedure without referent
*Mathematics is a set of moves. Understanding is optional.*
Not a belief about fractions at all. A belief about what mathematics **is**.

**Produces:** correct answers with no explanation · insisting on the LCD to compare `1/10` with `9/10` ·
finding a common denominator before multiplying · flipping an arbitrary fraction · total collapse on transfer
items and on algebraic fractions two years later.
**Killed by:** nothing mechanical. Only by explanation-scored items (`explain-in-your-own-words`) and by
widgets that require a hand movement the procedure cannot supply.
**This is what the Phase 1 exit gate exists to detect.** See §6.

### G8 — Language damage
*The words used to teach fractions actively mislead.*

| Word | What the learner hears | Reality | Our policy |
|---|---|---|---|
| "reduce" / "cancel down" | the value gets smaller | the value is identical | **banned product-wide.** Use "rename" / "simplest form" |
| "improper fraction" | it is wrong and must be fixed | it passed a landmark | name it, then say plainly the name is historical baggage |
| "of" | an ordinary preposition, no meaning | it *is* the multiplication sign | install "of" = × explicitly, with a picture |
| "divide" | force apart, break up | how many times does this fit | say out loud that the everyday word is what misled them |
| "common denominator" | a procedure with a strange name | agree on a shared **unit name** first | teach it as choosing a unit, like agreeing to talk in centimetres |
| mixed number `1¾` | two things side by side, so multiply | secretly means `1 + ¾` | flag the inconsistency honestly — it bites in algebra |

G8 is cheap to fix and almost universally ignored. A learner can carry "simplifying makes it smaller" for
a decade because nobody ever said the word out loud.

---

## 3. How the generators map to the chain

| Concept | Primary generators attacked | The one confrontation that matters |
|---|---|---|
| 1 · fraction-as-part-whole | G1, G2, G8 | partitions slider: the number grows while the piece swatch shrinks, in one motion |
| 2 · fractions-on-number-line | **G1**, G8 | change the stride count; the same numerator lands somewhere else |
| 3 · equivalent-fractions | G3, G8 | `sabotage_mode`: add 1 to both and watch the shaded edge move |
| 4 · comparing-fractions | G1, G7 | predict-before-reveal, then re-cut both to the same pieces |
| 5 · fraction-addition | **G3** | the mediant trap — the wrong answer lands *between* the two addends |
| 6 · fraction-multiplication | **G4**, G8 | `size_predictor` sweeping a factor through 1 |
| 7 · fraction-division | **G5, G6, G4, G7** | drag the leftover onto the stick; `whole_probe` for the reciprocal |

---

## 4. The catalog

Each entry: **pattern** (what you see) → **the coherent-but-false model** (what they believe, and why it is
reasonable) → **confrontation** (the specific manipulation).
Full text lives in each concept's `practice.misconceptions`; this section adds the cross-concept analysis and
the detection signature.

### 4.1 Concept 1 — Fractions as parts of a whole

| # | Pattern | Coherent-but-false model | Confrontation |
|---|---|---|---|
| 1.1 | Calls any one-of-four piece "a quarter" even when unequal | A fraction names a **piece**, not a **size**. Matches ordinary speech: "give me a piece". Equality never entered the rule. | `unequal_cuts` enabled, then: *you must accept whichever piece you are handed, without looking.* Self-interest re-equalises the cuts before any explanation. |
| 1.2 | `1/8 > 1/4` | G1. Eight beats four, and has done since they were four years old. | `partitions_control` + `also_show_piece_size_bar`. Number up and piece down **in the same drag**. |
| 1.3 | Half of a small bar = half of a large bar | G2. Every number word before this one named an absolute amount. | Two bars with different `whole_length`; drag one shaded region against the other. |
| 1.4 | Shades 3 of 8, names it `3/5` | Reading the picture as **part-to-part** (shaded vs unshaded). Genuinely correct for ratios — wrong notation. | Tapping the denominator readout lights the **whole outline**, not the unshaded remainder. |
| 1.5 | Counts pieces across two wholes on screen | "The whole" has fused with "everything visible". | `whole_outline.always_visible`; require them to point at the whole before answering. |

### 4.2 Concept 2 — A fraction is one number

| # | Pattern | Coherent-but-false model | Confrontation |
|---|---|---|---|
| 2.1 | On a 0–4 line, places `3/4` at 3 | G1 in its purest form: numerator = position, denominator = decoration. | Park the marker, change the stride count, watch the same numerator land elsewhere. |
| 2.2 | Places `1/2` at the visible midpoint of any line (e.g. at 2 on a 0–4 line) | "Half" = middle of the picture. **Correct in every textbook diagram they have seen**, because those all run 0 to 1. | `endpoints_editable` presets `[2,3]` and `[0,4]`. |
| 2.3 | "`5/4` isn't a real fraction" | A fraction is *part of a whole*, so it cannot exceed the whole. A sound deduction from an incomplete definition. | Drag past 1 with `trail.show_stride_arcs`. Five hops; nothing breaks. |
| 2.4 | `3/4 > 2/5` "because 3>2 and 4>5" | Componentwise comparison — how you compare coordinates or table rows. Right often enough to survive. | `second_marker`; then find a counterexample **together**. The rule must fail in front of them. |
| 2.5 | "What's the next fraction after `3/4`?" | Successor structure imported from whole numbers, where it is genuinely true. | `zoom` at `min_range`. Invite them to find a gap that resists. |
| 2.6 | Can place fractions only on pre-partitioned lines | Pattern-matching on the diagram, not measuring. Partitioning is something the *picture* does, not something *they* do. | `ticks_shown: whole_numbers_only` + stride slider. They must build the partition first. |

### 4.3 Concept 3 — Equivalent fractions

| # | Pattern | Coherent-but-false model | Confrontation |
|---|---|---|---|
| 3.1 | `1/2 = 2/3` (adds 1 to both) | **Half-remembered correct principle**: "do the same to both". Nobody said the ratio-preserving operation is multiplication. | `sabotage_mode` runs *their* rule and the shaded edge moves. Then run multiply-by-same beside it. Both must be seen. |
| 3.2 | `1/2 → 1/6` when rewriting in sixths | The denominator is the thing being converted; the numerator is "how many I own" and ownership doesn't change on relabelling. | Split animation **including shaded region**: one shaded half becomes three shaded sixths on screen. Predict before releasing. |
| 3.3 | Believes simplest form is a smaller value | **G8, pure.** "Reduce" and "cancel" mean shrink and destroy everywhere else in their life. | Both names plotted at one point. Then never use the word "reduce" in the product again. |
| 3.4 | `3/4 = 4/5` "both one piece short" | Gap reasoning with the piece size silently assumed equal. A sophisticated strategy failing on one hidden assumption. | Both on the line, zoom into each gap. Different lengths. |
| 3.5 | `16/64 → 1/4` by striking the sixes | Cancelling abstracted into a **digit-deletion game**, inferred from watching a teacher strike things out. Occasionally right. | Ask them to reach it with split/unsplit controls only. It cannot be done. Factors are multiplied, not visible. |
| 3.6 | "Fifths and sixths have no common denominator" | Common denominators are **found by recognition**, not constructed. 30 is outside their memorised tables. | Split both bars at once: fifths into six, sixths into five. Always constructible. |

### 4.4 Concept 4 — Comparing fractions

| # | Pattern | Coherent-but-false model | Confrontation |
|---|---|---|---|
| 4.1 | `1/8 > 1/3` | G1 on the denominator. | Numerator locked at 1; sweep the denominator and watch the marker walk toward zero. |
| 4.2 | `3/8 > 2/3` (numerators only) | The denominator is a category label to be ignored — like ignoring "apples" when comparing 3 apples to 2 apples. **The label just isn't the same on both sides.** | `predict_first`, then common denominator: `9/24` vs `16/24`. Their own rule now gives the opposite answer. The rule wasn't wrong; the precondition was missing. |
| 4.3 | `5/6 = 7/8` "both one piece short" | 3.4 recurring. Distance-to-one is genuinely meaningful; the piece size is the hidden variable. | `show_distance_from_one` with both gaps shaded. |
| 4.4 | `6−5 = 1`, `4−3 = 1`, "so equal" | 4.3 converted into arithmetic — which makes it *feel more rigorous* and therefore harder to abandon. | `near-miss-pair` generator with the line visible. Ask which they believe. Then ask what the subtraction measured. |
| 4.5 | Insists on the LCD for `1/10` vs `9/10` | **G7.** Comparison is a procedure to execute, not a judgement to make. Not wrong about fractions — wrong about what mathematics is. Also slow enough to make them avoid fractions. | `challenge_mode: decide-using-half-only` with the LCD control **disabled**. They must look. |
| 4.6 | Picks by shaded area across differently-sized diagrams | G2 resurfacing under time pressure. | Move to the number line, which has one shared whole. Removes the error rather than correcting it. |

### 4.5 Concept 5 — Adding fractions · **the mediant trap**

The most common error in school mathematics deserves its own section, because the confrontation is
unusually strong and is worth protecting from future edits.

**Pattern:** `1/2 + 1/3 = 2/5`.

**The model:** G3. Operate on each part separately. This is how coordinates add, how column addition works
place by place, how you combine two innings — **and it is exactly how multiplying fractions works**, which
they may already half-remember. Underneath sits the real gap: the denominator is being read as a *quantity*
rather than as the *name of a unit*.

**Why the usual remedy fails:** telling them the denominators don't add is a rule competing with a rule.
They have no reason to prefer yours.

**The confrontation — and why it is general, not anecdotal:**

> `(a+c)/(b+d)` is the **mediant** of `a/b` and `c/d`, and for positive denominators it **always lies
> strictly between them.**

So the wrong answer is *always* smaller than the larger of the two amounts being added. Adding two positive
amounts and landing between them is impossible, and a 12-year-old can see that without knowing the word
mediant. The `claim_check` control plots the learner's own typed answer beside both addends on a mini number
line. **The rule refutes itself, on every instance, not just on the one we chose.**

Follow immediately with two things:
1. The `pour` action — the `1/3`-sized piece physically **will not seat** on the halves grid (`tiling: strict`,
   `allow_force: false`). Pieces that are different sizes do not tile together.
2. The unit reading: *2 metres + 3 metres = 5 metres, and it has never once been 5 metremetres.*
   You add the counts and keep the name. Nobody in history has added the units together.

And say the honest thing out loud: **their instinct is not stupid, it is early.** It is a correct description
of multiplication arriving two concepts ahead of schedule. Seeing addition and multiplication side by side is
what finally separates them.

Remaining concept-5 entries:

| # | Pattern | Coherent-but-false model | Confrontation |
|---|---|---|---|
| 5.2 | `1/2 + 1/3 = 1/6 + 1/6 = 2/6` | "Finding a common denominator" is literally an operation on **denominators** — which is what the phrase says. The numerator is a fixed count of things they own. | `recut` with `recuts_shaded_regions`, watched slowly. Predict the new count before releasing. |
| 5.3 | Inconsistent fragments (keeps one numerator, keeps the larger denominator) | Reconstructing a half-remembered procedure with no model underneath. **Diagnostic signature: the answers differ between attempts.** | Stop the procedure entirely. Symbolic readout **off** until they can say "five of the piece called a sixth" in words. |
| 5.4 | Rewrites `7/6` as `6/7` or as `1` | G2 as a hard ceiling: a fraction cannot exceed its whole, so an answer above 1 must be their own mistake. | `extends_past_whole` on the total bar; the total sits calmly right of 1. |
| 5.5 | `1½ + 2½ = 3 1` (no carry) | Whole parts do add to whole parts — that half is right. The fraction part is a **decoration attached to** the whole number, so it cannot overflow. | Build it on bars with mixed-number display off. The two halves seat into a complete bar. |
| 5.6 | **Correct answer, cannot say why the denominator didn't change** | **G7.** Produces correct work, survives every marking scheme, collapses silently at algebraic fractions two years later. The most dangerous entry here precisely because it never looks like an error. | `show_unit_analogy_toggle` + require the answer **spoken** as a count and a name. If they cannot say "five of the piece called a sixth", the concept is not finished regardless of their score. |

### 4.6 Concept 6 — Multiplying fractions

| # | Pattern | Coherent-but-false model | Confrontation |
|---|---|---|---|
| 6.1 | Rejects a correct smaller product | **G4.** Every multiplier they ever met was ≥ 2. Reinforced by English: "multiply" means increase, as in multiplying rabbits. | `size_predictor`, prediction **on record**, sweeping a factor from ¼ through 1 to 2. They locate the boundary themselves. Do not hand them the corrected slogan. |
| 6.2 | Cross-multiplies | Crossing is a move they were genuinely taught — for comparing and for proportions — with no stated domain. Choosing between straight and crossed is a coin flip. | `grid.show_cell_count`: 4 across × 3 down. There is no crossing anywhere in the picture. Then give crossing a home (§4.4) so it stops floating free. |
| 6.3 | Finds a common denominator first | G7 overgeneralised from addition. **Produces correct answers slowly**, which is why it survives undetected for years. | Let them do it both ways; it agrees. Then ask *why* addition needed it. Multiplying builds a new unit rather than comparing counts. The ritual answers a question nobody asked. |
| 6.4 | `1/2 × 1/2 = 2/4` or `= 1` | Operation confusion under similar notation; the most recently practised routine fires. **Signature: the answer equals the correct sum.** | `of_language` on — "half **of** a half" — before any symbol. Nobody who says that aloud answers 1. |
| 6.5 | Cannot start a word problem containing "of" | **G8.** They have no rule for that word at all, so they guess by recency. | `word-problem-of` alongside the widget with `of_language` on. "Of" must be installed as a synonym for ×, not offered as a translation tip. |
| 6.6 | **"Multiplying by a fraction always shrinks"** | A **brand-new false rule this concept installs** if only factors below 1 are shown. Swapping one over-general slogan for its opposite. | `stick`-past-one analogue: the `3/2` factor preset + `extend_beyond_unit`. `multiply-past-one` generator is mandatory before the concept is complete. |

### 4.7 Concept 7 — Dividing fractions · **the exit-gate concept**

| # | Pattern | Coherent-but-false model | Confrontation |
|---|---|---|---|
| **7.1** | **`3/4 ÷ 1/2 = 1¼`** | **G6 — the central error.** They laid the stick, saw it fit once, saw a quarter of the ribbon left, and reported the leftover *in metres*. Every tape measure in their life behaves that way. They are reasoning correctly from one wrong assumption. | **Drag the leftover out and lay it against the stick.** It covers half of it. Then `frame_toggle` with *show both at once*: one quarter of a metre **and** one half of a stick, both true, only one answering the question asked. **Never mark this wrong — name the frame.** |
| 7.2 | "1 remainder 1/4" and stops | Whole-number division convention: quotient + remainder is a complete answer. `12 ÷ 5 = 2 r 2` is perfectly valid and nobody said the remainder could be re-expressed. Distinct from 7.1: they didn't misread the frame, they stopped early. | Ask: *one what, and a quarter of what?* `show_unit_word_always` makes "1 stick remainder ¼ metre" visibly an answer in two currencies. |
| 7.3 | Flips the first, or flips both | Pure symptom of a rule with no referent. If flipping is just a move, there is no principled way to pick a target; they guess, and guess right half the time. **Never appears in a learner who knows what the flipped number counts.** | `whole_probe`: set the ribbon to exactly one whole and count sticks. `1/2` → 2. `2/3` → 1½. The flipped divisor is sitting there as *sticks per whole*. The target has no such reading, so the question dissolves. |
| 7.4 | Rejects a correct larger quotient | **G4.** Divisors were always ≥ 2. Never tested below 1. | The `bottles` preset, first in the ladder and deliberately whole-number: 3 litres, half-litre bottles, 6 bottles — counted on screen, no fraction arithmetic. The belief must fail on a countable case first. |
| 7.5 | **"Dividing by a fraction always makes it bigger"** | The **replacement false rule** this concept installs if the ladder is cut short. A teaching failure, not a learner failure. | `stick-past-one` preset (`3/4 ÷ 3/2 = 1/2`) is **mandatory**, and `divisor-greater-than-one` must appear in every practice mix. `size_predictor` boundary at 1. |
| 7.6 | `3/4 ÷ 1/2 = 3/8` (multiplies) | Recency: two fractions and an operator fire the previous concept's routine. Plus a genuine half-memory that division involves multiplying — which it does, *after* a flip. | `size_predictor` first. `3/8 < 1` means fewer than one stick fits — yet the half-metre stick visibly sits inside the ribbon. Prediction contradicts picture; no arithmetic needed. |
| **7.7** | **"It's meaningless / it's just a rule"** — often while answering correctly | **G5.** Division = sharing, and sharing among half a person is nonsense, so the operation is nonsense and the rule must be obeyed blindly. **The root cause of flip-and-multiply alienation, and invisible on every marking scheme.** | Do not argue with sharing; it isn't wrong, it's incomplete. Establish measurement division on **whole numbers** first (ladder presets 1–2). Then `word-problem-missing-whole` rehabilitates the sharing reading in the form that *does* survive: "this is half of what I need, so what do I need?" |
| 7.8 | Carries the common denominator into the answer (`3/4 ÷ 2/4` → "3/2 of a quarter") | Transfer from addition, where the unit name **does** survive because counts are being combined. Here counts are being *compared*, so the unit cancels and the answer is a pure count of sticks. A correct rule from a neighbouring operation. | `same_pieces_mode` with counts-only readout: 3 against 2, fractions hidden. Ask what the answer counts. Then run the same two fractions through addition and ask why they differ. |
| 7.9 | Computes `1/2 ÷ 3/4` (wrong order) | Division is order-free — generalised from addition and multiplication, which genuinely are. Nothing in the written form says which number is the stick. | The widget's two roles are physically different objects: ribbon on the bench, stick in your hand. Swap them and watch 1½ become ⅔. Ask which question each arrangement answers, in words. |
| **7.10** | **Correct answer, explained as "flip the second one and multiply"** | **Not an arithmetic error — a diagnosis of *understanding*, and the one the exit gate exists to catch.** Working procedure, no model. Fails on transfer, on choosing the divisor in word problems, and on rational expressions two years later. | `explain-in-your-own-words`, scored on the explanation, never on the number. Then hand them the widget **with the answer already given** and ask them to make the picture show it. A learner with the model lays one stick, drags the leftover onto it, says "one and a half sticks". A learner without it has nothing to do with their hands. |

---

## 5. Engineering contract — detection signatures

For the practice engine. Given the item parameters and the learner's response, these are the computable
signatures that select a diagnosis. Diagnose on the **first** matching signature in order.

### 5.1 Signature table

| Concept | Signature (given item, response `r`) | Diagnosis |
|---|---|---|
| compare | `r` picks larger denominator, both numerators = 1 | 4.1 / G1 |
| compare | `r` picks larger numerator, denominators differ | 4.2 |
| compare | `r = "equal"` and `b−a == d−c` | 4.3 / 4.4 |
| equivalence | `r == (a+k)/(b+k)` for some k ≥ 1 | 3.1 / G3 |
| equivalence | `r == a/(b·k)` (numerator unscaled) | 3.2 |
| addition | `r == (a+c)/(b+d)` | **4.5 mediant / G3** |
| addition | `r == (a+c)/lcm(b,d)` (common denom, numerators unscaled) | 5.2 |
| addition | `r == a/b · c/d` | operation confusion |
| addition | response varies across identical re-presentations | 5.3 / G7 |
| multiplication | `r == (a·d)/(b·c)` | 6.2 cross-multiply |
| multiplication | `r == (a+c)/(b+d)` or `== a/b + c/d` | 6.4 |
| multiplication | correct value, but `predict` step said "bigger" with `c/d < 1` | 6.1 / G4 |
| division | `r == ⌊q⌋ + (remainder ÷ 1 whole)` — i.e. **remainder measured in wholes** | **7.1 / G6** |
| division | `r` submitted as a `(quotient, remainder)` pair | 7.2 |
| division | `r == (b/a)·(c/d)` | 7.3 flipped the target |
| division | `r == (b/a)·(d/c)` | 7.3 flipped both |
| division | `r == (a/b)·(c/d)` | 7.6 multiplied |
| division | `r == (c/d) ÷ (a/b)` | 7.9 reversed |
| division | correct value, `predict` step said "smaller" with `c/d < 1` | 7.4 / G4 |
| division | correct value, `predict` said "bigger" with `c/d > 1` | **7.5 — the replacement false rule** |
| any | correct value, explanation item rejected | **G7 / 7.10 — the gate failure mode** |

### 5.2 Two traps for whoever builds the engine

**Trap 1 — componentwise division is VALID. Do not build a detector for it.**
A learner who computes `3/4 ÷ 1/2` as `(3÷1)/(4÷2) = 3/2` has used a genuine identity:

> `(a÷c)/(b÷d) = (a/c)·(d/b) = ad/cb = (a/b)·(d/c)` ✓ always true

It only looks like a misconception because it usually produces ugly numbers. **Never mark it wrong.**
But note carefully: it is *not evidence of understanding* either. See §6.3.

**Trap 2 — the gate item is not a clean discriminator on the answer alone.**
For `3/4 ÷ 1/2 = 3/2`, at least three routes produce the correct value:
- the measurement model (what we are teaching),
- flip-and-multiply chanted with no model (7.10),
- componentwise division (valid, but mechanical).

**Therefore the exit gate cannot be scored on the number.** It must be scored on the explanation.
This is not a nicety; it is the difference between passing the gate and lying to ourselves about passing it.

---

## 6. Scoring the Phase 1 exit gate

> **G2:** ≥ 4 of 5 testers explain in their own words why `3/4 ÷ 1/2 = 3/2`, without reciting
> "flip and multiply." (`docs/03-GOALS.md`)

This is the company's decision gate. A vague rubric here would let us pass it by accident, which would be
worse than failing it.

### 6.1 Protocol

1. Run the whole chain. Do **not** pre-teach or hint.
2. Remove the device. Ask, with no widget in front of them:
   *"You've got three quarters of a metre of ribbon and you're cutting half-metre pieces. How many pieces do
   you get, and why is that answer bigger than the ribbon you started with?"*
3. **Say nothing for at least fifteen seconds.** Silence is the instrument.
4. One neutral follow-up only, if they stall: *"Can you show me with your hands?"*
5. Record verbatim. Score afterwards, by someone who did not run the session.

### 6.2 PASS — any one of these is sufficient

The explanation must contain a **mechanism**, not a move. Any of:

- **Counting in a new unit.** "You're asking how many half-metres fit in it. One fits, then there's a bit
  left, and the bit is half of a half-metre, so one and a half."
- **The unit-size argument.** "The answer counts half-metres, not metres. Half-metres are smaller so you need
  more of them — like how you're 150 in centimetres but 1.5 in metres."
- **Same-pieces reduction.** "Cut both into quarters. Three quarters against two quarters. How many twos in
  three? One and a half."
- **The missing-whole route.** "If three quarters is only half of what I need, I need twice that — one and a
  half." (Valid — the second reading of division, and independently arrived at.)
- **The reciprocal, *with meaning*.** "There are two halves in a whole, and I've got three quarters of a
  whole, so I've got three quarters of two halves, which is one and a half." ← This *is* flip-and-multiply,
  but the learner has said what the flipped number counts. **That passes.** The gate is against the empty
  chant, not against the algorithm.

Partial credit does not exist. It is a pass or it is not.

### 6.3 FAIL — regardless of whether the number is right

- "You flip the second one and multiply." / "Keep, change, flip." / "That's just the rule."
- "Three divided by one is three, four divided by two is two." — correct, valid, **and mechanical**. No
  mechanism, no pass. (See §5.2 Trap 1.)
- Correct number, no account of *why* it exceeds `3/4`.
- Answers `1¼` (7.1) or "1 remainder ¼" (7.2) — the frame error was never resolved.
- Cannot say **what the answer counts**. "One and a half" with no unit attached is not understanding.
  If asked "one and a half *what*?" they must say pieces, sticks, half-metres, portions — something.

### 6.4 If the gate fails

`docs/02-PLAN.md` says stop, and it means it. Before redesigning anything, classify each failure against §2:

| Failure profile | Read it as | Fix |
|---|---|---|
| Testers say `1¼` | **G6 survived.** The remainder confrontation did not land. | The `remainder.compare_against` interaction is the highest-leverage thing in the product. Rebuild it before anything else. |
| Testers chant the rule | **G7 / G5 survived.** Measurement division was never installed, or formalize leaked upward into intuition. | Check that "flip" appears nowhere before the formalize layer, and that presets 1–3 of the ladder actually ran. |
| Testers say "dividing by a fraction makes it bigger" and stop | **G4 replacement rule.** The ladder was cut short. | `stick-past-one` was skipped or under-weighted. This is a content bug, not a pedagogy failure. |
| Testers get it but cannot say it | Possibly a **language** problem, not an understanding one. | Try the sentence-builder response mode before concluding the pedagogy failed. Do not lower the bar; do check the instrument. |

Distinguishing "the pedagogy is wrong" from "the instrument is wrong" is worth a day. Rebuilding the pedagogy
because five people were shy is not.

---

## 7. Authoring rules for future concepts

1. **Name the belief, not the error.** "They got it wrong" is not a diagnosis. "They believe the leftover is
   expressed in wholes, because every ruler they have used behaves that way" is.
2. **Say why the belief is reasonable.** If you cannot construct the case for the wrong rule, you do not yet
   understand your learner, and your remedy will miss.
3. **The remedy is an event, not a sentence.** It must name a widget, a control and an action.
4. **Check for the replacement rule.** Every corrected over-generalisation can install its mirror image.
   Every concept that teaches a direction-of-change must include the case on the other side of the boundary.
   *This has its own row in the review checklist because it is the failure we are most likely to ship.*
5. **Look for the error that the notation causes** (G8) before blaming the learner's model. It is cheaper to
   fix and more often the real cause.
6. **Include at least one "correct answer, wrong understanding" entry per concept.** These are the errors
   that reach adulthood, because nothing in a marking scheme can see them.
7. **Never end a remedy with "then explain the rule."** If the widget didn't do it, the sentence won't.

---

## 8. Coverage status

| Track | Status |
|---|---|
| arithmetic · fractions (7 concepts) | ✅ complete — 45 entries, 8 root generators, detection signatures, gate rubric |
| arithmetic · whole numbers, place value, decimals | ⬜ not authored |
| arithmetic · ratio, rate, percentage | ⬜ not authored — expect heavy inheritance from G5 and G6 |
| abacus | ⬜ not authored |
| pre-algebra / algebra | ⬜ not authored — expect G1 (variable as label vs quantity) and G8 (the `1¾` juxtaposition trap) to dominate |
| geometry · trigonometry · probability | ⬜ not authored |
| logic · algorithms · physics | ⬜ Phase 4+ |
