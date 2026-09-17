# Ganitatva — Goals

## North Star

> **CGU — Concepts Genuinely Understood**
> A concept counts only when the learner passes a **delayed transfer test**: a novel problem, **7+ days later**,
> that needs the idea but doesn't resemble the practice items.

**Deliberately rejected metrics:** minutes-in-app · streak length · DAU · lessons completed · questions answered.
Every one of those can go up while understanding goes down. We refuse to optimize them.

---

## Milestone goals

### G1 — "It builds everywhere" · by **Sep 24, 2026**
- [ ] `flutter doctor` fully clean
- [ ] Runs on macOS
- [ ] APK installed on a real Android phone
- [ ] Windows .exe produced by GitHub Actions
- [ ] Art Direction Brief approved (design-doctrine gate)
- **Measure:** 4 platform artifacts from one `git push`

### G2 — "The thesis is true" · by **Oct 8, 2026** ⭐ *the real bet*
- [ ] Fractions concept complete across all 6 layers
- [ ] 5 human testers run through it
- **Measure:** **≥ 4 of 5 explain 3/4 ÷ 1/2 in their own words** — no "flip and multiply"
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

### G6 — "The full stack of ideas" · by **Aug 19, 2027**
- [ ] Calculus, linear algebra, physics-1 live
- [ ] All 5 platforms in stores
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
