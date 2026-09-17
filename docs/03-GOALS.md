# Ganitatva — Goals

## North Star

> **CGU — Concepts Genuinely Understood**
> A concept counts only when the learner passes a **delayed transfer test**: a novel problem, **7+ days later**,
> that needs the idea but doesn't resemble the practice items.

**Deliberately rejected metrics:** minutes-in-app · streak length · DAU · lessons completed · questions answered.
Every one of those can go up while understanding goes down. We refuse to optimize them.

---

## Milestone goals

### G1 — "A stranger can open it on their phone" · by **Sep 24, 2026**
*(Rewritten 2026-09-17 for web-first — ADR-006. The old G1 measured native build artifacts; that moves to G5.)*
- [x] Art Direction Brief approved (design-doctrine gate) — ✅ 2026-09-17
- [ ] One concept page live at a shareable preview URL
- [ ] Opens and works correctly **on a real phone browser**
- [ ] CI rejects a deliberately-broken content YAML
- [ ] Paper dry run of concept 7 run on two kids, result written down
- [ ] Android Developer Verification enrolment started (calendar dependency — free, has lead time)
- **Measure:** you can text the link to someone and they can use it

### G2 — "The thesis is true" · by **Oct 8, 2026** ⭐ *the real bet*
- [ ] Fractions concept complete across all 6 layers
- [ ] 5 human testers run through it
- **Measure:** **≥ 4 of 5 explain 3/4 ÷ 1/2 in their own words** — no "flip and multiply"

**How this gate is scored — and how it could be passed by accident:**
> The *number* 3/2 is not evidence of anything. At least three different routes produce it: the measurement
> model (what we taught), chanted flip-and-multiply (what we're trying to replace), and componentwise
> division — which is **algebraically valid**, since (a÷c)/(b÷d) = (a/b)(d/c). A learner can arrive at 3/2
> while understanding nothing we intended.
>
> So: **score the explanation, never the answer.** Rubric with accept/reject example sentences is in
> `docs/curriculum/misconceptions.md` §6. Do not build a detector for componentwise division — it isn't wrong.
>
> Passing this gate by accident is **worse than failing it**, because we'd then build Phase 2–7 on a thesis
> we never actually tested.

**Separate "pedagogy failed" from "instrument failed."** An 11–16-year-old who understands may still not
*say* it to an adult with a clipboard. `misconceptions.md` §6.4 distinguishes these. Rebuilding the pedagogy
because five people were shy would be an expensive mistake.

- **If this fails:** stop. Redesign the pedagogy. Do not build Phase 2.

### G3 — "Content scales without engineers" · by **Nov 5, 2026**
- [ ] 10 widget primitives, documented + golden-tested
- [ ] YAML → bundle pipeline live
- [ ] Knowledge graph + FSRS running
- **Measure:** a non-Dart-writer ships a complete concept in **< 1 day** from the guide alone

### G4 — "Real learners, real retention" · by **Feb 4, 2027**
- [ ] ~180 math concepts (Class 6–10 equivalent)
- [ ] 100 beta users
- **Measure:** **7-day retention ≥ 25%** · median **CGU ≥ 12 per active learner**

### G5 — "Math → Logic → Algorithms" · by **Apr 1, 2027**
- [ ] Logic + algorithms tracks live
- **Measure:** a non-programmer traces a recursive call stack correctly

### G5b — "Native, on the lane Mathigon left" · from **Apr 2027**
*Gated on G4 passing. Do not build a second client for a product nobody finished on the first one.*
- [ ] Flutter app running from the same content bundle, zero content rewritten
- [ ] Installs and runs offline on a budget Android phone with no data
- **Measure:** a learner completes a concept start-to-finish in airplane mode

### G6 — "The full stack of ideas" · by **Aug 19, 2027**
- [ ] Calculus, linear algebra, physics-1 live
- [ ] Web public and indexed; native in stores
- **Measure:** learners **derive** projectile range instead of recalling it · 1,000 active learners

---

## Principles that override goals

When these conflict with a metric, **these win**:

1. **Understanding > engagement.** If a feature raises usage but not comprehension, it does not ship.
2. **No concept without a manipulable widget.** No exceptions, ever.
3. **Intuition before notation.** Symbols are earned, never assumed.
4. **Mistakes get diagnosed, not just marked wrong.** A red ✗ teaches nothing.
5. **Offline-first.** A learner on a ₹8,000 phone with no data is the *design target*, not an edge case.
6. **No dark patterns.** No guilt streaks, no artificial scarcity, no engagement traps. We are not renting attention.

---

## The completion trade — and the rule for when it hurts

We have deleted this category's entire completion toolkit: no streaks, no XP, no badges, no hearts, no
confetti, no mascot. In exchange, completion has to be carried by design instead — resume-in-place, no dead
ends, an honest shelf, Quiet mode.

**Be clear-eyed: those are weaker levers than a streak.** That is the deliberate trade, not an oversight.

**The governance rule, written down now while it is cheap to mean it:**
> If G4's 7-day retention misses badly, the correct response is to **re-open this trade in writing** — argue
> it, and change the principle openly if the argument wins. The wrong response, and the one that will feel
> reasonable at the time, is to quietly add "just a small streak chip."

This rule exists because the moment retention disappoints is exactly the moment the principle will feel
expensive and negotiable. Deciding now, in calm conditions, is the only way the decision means anything.
