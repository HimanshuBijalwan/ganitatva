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

That rule is non-negotiable. But it is **not**, by itself, the moat — see below.

## What the moat actually is (revised 2026-09-17, after research)

The founding draft of this document claimed the manipulable-widget rule "is the entire moat."
**Research falsified that, and we are recording the correction rather than quietly dropping it.**

**Mathigon/Polypad already does it** — 50+ polished manipulative types spanning nearly all of K-12,
genuinely best-in-class interaction design, **free forever** (funded by Amplify via school-district
contracts, not user payment), 600K+ monthly users, founder still running it. It survived its 2021
acquisition intact. We cannot out-widget them, and pretending otherwise would be strategy by wishful thinking.

Worse for the original claim: the evidence for manipulatives is **small-to-moderate, not overwhelming**
(Carbonneau et al. 2013, 55 studies, N=7,237), heavily moderated by *how well* they're used — and the
evidence for **virtual** manipulatives specifically is thinner than for physical ones. Manipulation is
necessary. It is nowhere near sufficient.

**So what is actually defensible — four things Mathigon leaves on the table:**

1. **The full pipeline, not just the widget.** Mathigon's atomic unit is an *interactive chapter* — a
   narrative you read through. Ours is a *masterable concept* with its own progress state. They are superb at
   Layers 2–3 (intuition + manipulate) and comparatively weak at Layers 5–6: no spaced repetition, no
   adaptive item generation, and **no mistake diagnosis**. Layer 5 is where our real work lives.
2. **The surface they abandoned.** Mathigon's Android app is no longer on Google Play and its iOS listing
   has gone stale; it is effectively a website now. **Native, offline-first, on a budget Android phone with
   no data** is an open lane — and it is exactly our stated design target, not a consolation prize.
3. **Hindi, and then other Indian languages.** Nobody serious is building interactive math intuition for
   Hindi-medium students. ADR-003 (content-as-data) makes this a translation problem rather than a rewrite.
4. **Measuring the thing we claim.** CGU — delayed transfer — is a harder metric than anyone in this
   category reports. Being the product that can actually prove comprehension is itself a position.

## The failure mode that actually kills products like this

Khan Academy's own efficacy research found real learning gains (~+20%) — but **only ~9% of users ever
reached the usage threshold that produces them.**

Read that again, because it reframes the whole project: **in this category, content quality is rarely what
fails. Completion is.** A learner who understood three concepts and left has been failed just as surely as
one who understood none.

This is why Layer 5 and the mastery loop are not "Phase 2 infrastructure" — they are the product. And it is
why the Phase 3 retention target is the hardest number in `docs/03-GOALS.md`, not a routine one.

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
