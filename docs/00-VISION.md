# Ganitatva — Vision

**गणित (ganit) + तत्त्व (tattva) = the essence of mathematics.**

## The one-sentence thesis

> Most people don't find math hard. They find **symbol-first teaching** hard.
> Ganitatva teaches every idea as something you can **touch and move** before it ever becomes a symbol.

## What we are NOT building

This matters more than what we are building, because the graveyard is full of these:

- ❌ **Not a quiz app with a skin.** Byju's/Vedantu/Toppr are video + MCQ. Question banks are a commodity.
- ❌ **Not a video library.** Khan Academy already won that. Passive watching ≠ understanding.
- ❌ **Not a homework solver.** Photomath gives answers. Answers are the opposite of understanding.
- ❌ **Not a gamified streak trap.** Duolingo-style dark patterns optimize for daily-active-users, not comprehension. If we ever have to choose between engagement and understanding, understanding wins. This is a written constraint, not a slogan.

## What we ARE building

An **interactive intuition engine**. The unit of the product is not a video or a question — it's a
**manipulable widget**: a thing on screen where the learner drags something and watches the math respond.

**Hard product rule (never negotiable):**
> No concept ships without at least one widget the learner can manipulate.

That single rule is the entire moat. It's expensive, it's slow, and it's why nobody else does it at scale.

## The 6-layer concept doctrine

Every single concept in Ganitatva — arithmetic, calculus, or thermodynamics — is built in the same six layers, in this order:

| # | Layer | What it does | Failure mode it prevents |
|---|-------|--------------|--------------------------|
| 1 | **Hook (क्यों?)** | A real question the concept answers. Never "today we learn X." | "Why am I learning this?" |
| 2 | **Intuition** | A physical/visual metaphor. **Zero symbols allowed here.** | Symbol shock |
| 3 | **Manipulate** | Interactive widget. Learner changes input, sees math react. | Passive watching |
| 4 | **Formalize** | Now the notation — introduced only once the intuition exists. | Meaningless memorization |
| 5 | **Practice** | Adaptive items + **mistake diagnosis** (why it's wrong, not just ✗) | Drilling without feedback |
| 6 | **Connect** | Where this sits in the knowledge graph; what it unlocks. | Isolated, forgettable facts |

## Domain order (and why)

```
MATH  →  LOGIC  →  ALGORITHMS  →  PHYSICS
```

- **Math first** — it is the substrate for everything else. (User's own framing, and it's correct.)
- **Logic second** — cheap to build (truth tables, gates, quantifiers), enormously high leverage. It is the
  thing that makes proofs stop feeling like magic. Most curricula skip it entirely; that's our gap.
- **Algorithms third** — "what is a procedure that always works?" is just logic + math made executable.
  Sorting, Euclid's GCD, binary search, recursion — all beautiful when *animated*, all opaque when written.
- **Physics last** — physics is applied math. Teaching it before the math lands is why students memorize
  formulas. By the time we reach kinematics, the learner already owns derivatives and vectors.

## The abacus track (अबेकस)

Runs parallel to arithmetic, not inside it. Soroban-style bead manipulation builds **number sense** and
mental-math speed. It is also the single best physical anchor for place value — which is the root cause of
most later arithmetic failure. Ships as its own widget (`AbacusBoard`) + its own progression ladder.

## North Star metric

**Not** minutes-in-app. **Not** streak length. **Not** DAU.

> **Concepts Genuinely Understood (CGU)** = concepts where the learner passes a *delayed transfer test*
> — a novel problem, 7+ days later, that requires the idea but doesn't look like the practice items.

Recall decays; understanding transfers. We measure the thing we actually claim to sell.

## Success, stated plainly

A 14-year-old who believes they are "bad at math" spends 20 minutes in Ganitatva and says **"ohh — that's all it was?"**
Everything in this repo exists to make that sentence happen more often.
