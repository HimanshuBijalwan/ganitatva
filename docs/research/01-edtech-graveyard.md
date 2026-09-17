# The EdTech Graveyard

What killed or stalled companies in this space, with an explicit separation of which failure patterns
transfer to a small, solo-operator, offline-first, ad-free, no-sales-force app — and which categorically
do not.

Labeling: **VERIFIED** = stated fact with source URL. **INFERENCE** = my reasoning from verified facts.

---

## Byju's — the instructive recent collapse

**VERIFIED, timeline:**
- Peak valuation ~$22B (2022). [CNBC](https://www.cnbc.com/2024/03/01/the-rise-and-fall-of-byjus-once-a-startup-darling-in-india.html)
- 2021: raised a $1.2B term loan; $533M of it allegedly diverted to a hedge fund with no accounting
  provided to lenders. A US bankruptcy court later held director Riju Ravindran in contempt for refusing to
  disclose the money's location, and found co-founders Byju Raveendran and Divya Gokulnath complicit.
  [Legal Maestros](https://legalmaestros.com/current-legal-update/byjus-financial-crisis-unveiled-understanding-the-complex-web-of-lawsuits-and-bankruptcy-filings/)
- Debt/equity-funded acquisition spree with no real integration: WhiteHat Jr ($300M, 2020), Aakash
  Educational Services (~$950M), Epic ($500M), Great Learning ($600M), Tynker, Osmo, and others.
  (Search summary, multiple business-press sources.) WhiteHat Jr specifically burned ~₹220 crore/month on
  marketing post-acquisition while both losing money and facing its own misselling accusations pre-deal.
- 2022: auditor Deloitte resigned, citing repeated failure to receive required financial statements for
  FY ending March 2022. [CNBC](https://www.cnbc.com/2024/03/01/the-rise-and-fall-of-byjus-once-a-startup-darling-in-india.html)
- Valuation collapsed ~95% from peak; Feb 2024 Chapter 11 filing (US entity); July 2024 NCLT insolvency
  proceedings begin (India); Nov 2025 court orders founder to personally pay $1.07B immediately plus
  $10,000/day fine for non-cooperation. (Search summary, Bloomberg/legal press, 2024-2025.)
- Separately and independent of the financial collapse: sales force used what multiple sources
  characterize as emotionally coercive, high-pressure door-to-door and phone tactics targeting parents,
  plus misleading advertising. (Search summary, multiple business-press sources.)

**INFERENCE — root cause classification:** Byju's did not fail because its pedagogy was bad (video + MCQ is
mediocre pedagogy, but that alone doesn't cause a $22B collapse) or because the market rejected it (peak
user base was enormous). It failed because of **governance and capital-structure decisions layered entirely
on top of the product**: debt-funded acquisitions that didn't integrate, opaque accounting, and a sales
culture that optimized short-term enrollment over long-term trust. This is a company-collapse story, not a
learning-product-collapse story.

## The broader 2021-2025 EdTech VC collapse

**VERIFIED:** Global edtech VC investment peaked at $16.7B in 2021 (pandemic remote-learning bubble) and
fell to under $3B by 2025.
[Rest of World, 2026](https://restofworld.org/2026/edtech-funding-collapse-k12-startups-ai-workforce/)
Q1 2024 specifically hit a 10-year low at $580M globally.
[HolonIQ](https://www.holoniq.com/notes/edtech-vc-collapse-at-580m-for-q1-not-even-an-ai-tailwind-could-hold-up-the-10-year-low)

**VERIFIED — stated failure drivers from industry press:** High customer acquisition costs, long
institutional (school-district) sales cycles, and low retention tied to unclear/unmeasured learning
outcomes. For-profit startups struggled to differentiate from rivals and had weak unit economics.
(Search summary, marketbrief.edweek.org / news.crunchbase.com, 2024-2025.) Investors are now shifting
capital toward AI tools and workforce training with clearer ROI, away from K-12 consumer edtech generally.
(Same sources.)

**VERIFIED, broader startup base rate:** 966 startups shut down in 2024 (up 25.6% from 769 in 2023, per
Carta); 60% of failed startups run out of capital entirely rather than returning anything to investors.
(Search summary, TechCrunch, Jan 2025.)

## Prodigy Math — the cautionary tale closest to Ganitatva's stated "what we are NOT building" list

**VERIFIED:** Prodigy is a K-8 math game with heavy gamification (avatars, battles, in-game currency
"Magicoin") layered on top of curriculum-aligned math questions. Progress and rewards slow sharply once a
free player runs out of Magicoin, creating pressure toward the paid membership tier
($4.95-$8.95/month/child). [Nibble Blog](https://nibble-app.com/blog/prodigy-review)

**VERIFIED:** In February 2021, the Campaign for a Commercial-Free Childhood (CCFC) and 21 advocacy
partners filed an FTC complaint alleging Prodigy's business model is manipulative — designed to make money
off children via upsell pressure rather than to maximize learning.
[Common Dreams](https://www.commondreams.org/news/2021/02/23/complaint-ftc-child-advocates-warn-prodigy-math-game-exploiting-pandemic-prey-students-parents),
[NBC News](https://www.nbcnews.com/tech/tech-news/child-protection-nonprofit-alleges-manipulative-upselling-math-game-prodigy-n1258294)

**VERIFIED:** Independent criticism includes unskippable video ads after every in-game "battle," with
reports that only about a third of actual play time is spent on math content — the rest is gameplay/ad
friction. (Search summary, Fairplay for Kids / selfctrl.com, review aggregation.)

**INFERENCE:** Prodigy is the concrete, math-specific proof that `docs/00-VISION.md`'s explicit rejection of
"gamified streak trap" / Duolingo-style dark patterns is not a hypothetical risk — it is a documented,
FTC-complaint-triggering failure mode that has already happened in exactly this product category (K-8 math
app), not just in language-learning apps. This should be treated as a named case study in the vision doc,
not just a generic warning.

## MOOC-era dropout data (context for what "self-paced, unsupervised" completion realistically looks like)

**VERIFIED:** Completion rates for most MOOCs are below 13%, with figures commonly cited between 5-10% when
measured against total enrollment (higher, ~25-45%, only when measured against actively-participating
students rather than all registrants).
(Search summary, multiple sources including insidehighered.com, openpraxis.org.) A frequently-cited extreme
example: a Coursera bioelectricity course had ~12,700 registrants but only ~350 sat the final exam — a 97%
dropout rate. (Search summary, insidehighered.com.) Research on edX specifically finds this dropout problem
has **not improved over years** despite continued platform and learning-science investment.
(Search summary, arxiv.org/1802.09344 context.)

**INFERENCE:** This is the ceiling risk for any self-paced, unsupervised, install-and-open-alone product —
which is exactly Ganitatva's delivery model (no classroom, no teacher enforcing use, offline so no
server-side nudge infrastructure by default). Even class-leading platforms don't solve this; MOOC-level
dropout is the base rate to beat, not an edge case to dismiss.

---

## Failure-pattern extraction: applies vs. does not apply to Ganitatva

| Failure pattern | Seen in | Applies to Ganitatva? | Why |
|---|---|---|---|
| Debt-funded, un-integrated acquisitions | Byju's | **No** | Solo operator, no capital raised, no acquisition targets |
| Predatory/high-pressure sales | Byju's | **No** | No sales force; app-store distribution only |
| Accounting opacity / governance fraud | Byju's | **No** | No investors to defraud, no board to mislead |
| Dark-pattern gamification for engagement metrics | Prodigy, Duolingo (per vision doc) | **Directly relevant — already a written constraint** | Same product category (K-8/K-10 math), same temptation (engagement > understanding) |
| High CAC / long district sales cycles | General edtech VC collapse | **Partially** — no district sales planned, but Play/App Store discovery CAC still applies | INFERENCE: Ganitatva still needs *some* discovery mechanism; "free, no sales cycle" doesn't mean "free, no distribution problem" |
| Low retention tied to unmeasured learning outcomes | General edtech VC collapse, Khan Academy's 9%-dosage stat | **Yes, centrally** | This is the single biggest transferable risk — see below |
| Self-paced dropout (MOOC pattern) | MOOCs broadly, Khan Academy | **Yes, centrally** | Ganitatva is self-paced, unsupervised, no classroom scaffold |
| Content-volume competition against an already-dominant free incumbent | Khan Academy vs. anyone trying to out-video them | **Partially** | Ganitatva isn't competing on video volume, but *is* implicitly competing on content breadth (180 concepts target) against Mathigon's already-large free library |
| Acquisition eventually diluting founder pedagogy vision (contested claim re: Amplify) | Mathigon/Desmos, per one unverified critical source | **INFERENCE only, unverified** | Relevant only if Ganitatva ever seeks acquisition/investment; not an operational risk today |

## What this means for Ganitatva

1. **Most of the "EdTech graveyard" as popularly told (Byju's-style) is a false-flag risk for this specific
   project.** A solo operator building an offline-first app with no debt, no sales force, and no
   acquisitions cannot fail the way Byju's failed. Don't over-index Phase-0/1 planning on governance/finance
   risk mitigation that doesn't apply yet.
2. **The graveyard risks that genuinely transfer are exactly two: (a) self-paced dropout (MOOC/Khan Academy
   pattern) and (b) the temptation to gamify engagement instead of measuring understanding (Prodigy
   pattern).** Both are already named in `docs/00-VISION.md` (North Star metric section; "what we are NOT
   building" list) — this research confirms those instincts are correct and evidence-backed, not just
   founder taste. Recommend citing the Prodigy FTC complaint directly in the vision doc as the concrete
   precedent for the anti-gamification constraint, since it's the same subject-matter category (K-8 math)
   and therefore the most damning possible precedent.
3. **Distribution/discovery risk is under-addressed in `docs/02-PLAN.md`.** The plan has no phase or task
   for "how does a 14-year-old ever find this app" beyond implicit app-store presence in Phase 7 (Store
   listings + ASO, "ongoing from Sep 2027"). Given the general edtech-VC-collapse finding that CAC is a
   primary failure driver even for good products, and that Mathigon/Khan Academy/Desmos all solved
   distribution via institutional (school/district/teacher) channels that Ganitatva's plan does not use,
   this is a real, currently-unaddressed gap — flagging it now while it's cheap to plan around, not after
   Phase 3 ships 180 concepts nobody finds.
4. The MOOC dropout ceiling (even best-case ~25-45% of *active* participants complete, single-digit percent
   of all registrants) is a sobering, evidence-grounded reference point for Phase 1's human exit gate and
   Phase 3's 25% D7 retention target — both targets are ambitious relative to the sector's actual track
   record, which is fine as an ambition but should be held knowingly, not naively.
