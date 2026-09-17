# Competitor Teardown

Scope: Mathigon/Polypad, Brilliant, Khan Academy, Desmos, Photomath, Byju's. For each: atomic unit of
learning, what they do genuinely well, where learners drop off, business model, current status.

Labeling: **VERIFIED** = stated fact with source URL. **INFERENCE** = my reasoning from verified facts,
explicitly not itself sourced. Where evidence is thin, I say so rather than inflate it.

---

## Mathigon / Polypad — study this one hardest

This is the closest prior art to Ganitatva's thesis. Read this section before touching widget design.

### Atomic unit of learning
**VERIFIED:** Mathigon's product is "part interactive textbook, part virtual personal tutor" — courses built
from interactive prose interleaved with simulations, animations, games, and a scripted virtual-tutor voice
that gives hints and encouragement. [Mathigon](https://mathigon.org/) The manipulation layer is **Polypad**,
a standalone virtual-manipulatives canvas with 50+ manipulative types (algebra tiles, fraction bars, polygons,
geoboards, etc.) that can be dragged, rotated, combined, and dropped into any lesson.
[Polypad](https://mathigon.org/polypad)

**INFERENCE:** Mathigon's atomic unit is closer to "an interactive chapter" than a single concept-card.
A course is a linear narrative (story + prose + embedded widgets), not a discrete, independently-masterable
concept unit with its own mastery state. This is a structural difference from Ganitatva's plan, which
wants each concept to be a standalone six-layer unit with its own progress/mastery record (per
`docs/00-VISION.md`'s 6-layer doctrine and Phase 2's "knowledge graph + mastery model").

### What they do genuinely well
- **VERIFIED:** Polypad alone ships 50+ distinct manipulative types spanning nearly the entire K-12 math
  curriculum — fraction bars, algebra tiles, geoboards, number lines, graph plotting, dynamic geometry —
  in one unified, beautifully designed canvas. [Polypad](https://mathigon.org/polypad)
- **VERIFIED:** Mathigon has a library of 70+ ready-made tasks/lesson plans for Polypad covering the
  curriculum, meaning the widget kit is not just a toy — it's operationalized into teachable sequences.
  (See search summary of Mathigon course library, mathigon.org/courses.)
- **VERIFIED:** The interaction design quality is widely regarded as best-in-class; teacher-facing reviews
  (Alice Keeler, "Make Math Not Suck") independently praise the manipulatives as genuinely superior to
  prior digital-manipulative tools. [Alice Keeler](https://alicekeeler.com/2022/07/14/digital-math-manipulatives-with-mathigon/)
- **INFERENCE:** Mathigon proves, at scale and for free, the single hardest and most expensive part of
  Ganitatva's plan — a large, polished, genuinely manipulable widget library — is achievable by a team that
  started as basically one person (founder Philipp Legner) plus contractors. That de-risks feasibility but
  also raises the bar: "we built manipulable widgets" is not on its own a claim of novelty.

### Where learners drop off / limitations
- **VERIFIED, but weakly evidenced (no dropout study found):** Third-party reviews describe Mathigon as
  best paired with "a structured curriculum or workbook that provides regular practice and assessment" and
  designed to "supplement classroom instruction rather than replace it" — i.e., it is explicitly *not*
  positioned as a complete, sequenced, masterable curriculum with spaced repetition or diagnosis of wrong
  answers. (Search summary, thelearningstandard.org / joinmodulo.com reviews of Mathigon, 2026.)
- **INFERENCE, moderate confidence:** This is Mathigon's real gap relative to Ganitatva's plan: no visible
  FSRS-style spaced repetition, no adaptive item generation, no "mistake diagnosis" layer (Ganitatva's
  Layer 5), and course completion is not tied to a delayed-transfer mastery signal analogous to
  Ganitatva's proposed CGU metric. Mathigon is a superb **intuition + manipulate** engine bolted onto
  static-ish courses; it is comparatively weak on **practice + diagnose + connect** (Layers 5-6 of
  Ganitatva's doctrine).
- **VERIFIED (minor but telling signal):** Mathigon's Android app listing is no longer live on Google Play,
  and the iOS listing hasn't had a meaningful update in years — the product now functions primarily as a
  website, not a maintained native mobile app. [Nibble Blog](https://nibble-app.com/blog/mathigon-app)
  This matters directly to Ganitatva, which is offline-first and native-first by design; Mathigon effectively
  ceded the native-app, offline-capable surface.

### Business model
- **VERIFIED:** Mathigon was acquired by Amplify (a US K-12 curriculum publisher) in October 2021.
  [Amplify press release](https://amplify.com/news/amplify-acquires-k-12-mathematics-education-innovator-mathigon/),
  [BusinessWire](https://www.businesswire.com/news/home/20211013005759/en/Amplify-Acquires-K12-Mathematics-Education-Innovator-Mathigon)
- **VERIFIED:** Post-acquisition, Mathigon remains fully free — "no subscription, no upsells, no locked
  chapters" — because Amplify funds it as part of its broader curriculum business and monetizes via
  school-district contracts and licensing Mathigon's technology to other publishers, not via end-user
  payment. (Search summary citing Mathigon FAQs / EdTech Digest / edtechimpact.com, 2026.)
- **VERIFIED:** Founder Philipp Legner stayed on post-acquisition as VP, Mathigon Studio, and as of the
  most recent evidence found (2025 board-appointment bio at MoMath) is still in that role — the founder did
  not leave. [Philipp Legner LinkedIn](https://uk.linkedin.com/in/legner),
  [MoMath board bio, April 2025](https://momath.org/wp-content/uploads/2025/04/New-MoMath-Board-Members.pdf)

### Current status — the Amplify acquisition history, and why it matters to us
**VERIFIED:** This is the most important commercial fact for Ganitatva. Mathigon was **not** killed,
sunset, or paywalled after acquisition — unlike the far more common EdTech-acquisition outcome. It survives
as a permanently free, actively-funded product with 600,000+ monthly users
([Nibble Blog](https://nibble-app.com/blog/mathigon-app)), because it was folded into a publisher's B2B
(school-district) revenue engine rather than needing to generate consumer revenue itself.

**INFERENCE, flagged as contested:** A dissenting, unverified critical take exists (Sunil Singh, Medium,
"Amplify: A Company That Killed Math Storytelling") arguing Amplify's acquisitions of both Mathigon and
Desmos' curriculum arm diluted the original founders' narrative-led, storytelling-first pedagogy in favor
of standards-aligned curriculum packaging for district sales. I was unable to fetch the full article
(403 error) so I cannot verify its specific claims — flagging its existence and thesis only, not endorsing
it. This is a data point that "acquired by a curriculum publisher" is not an unambiguous happy ending;
it can mean the product survives operationally while its original creative ambition gets subordinated to
what sells to district procurement committees.

**What this means for Ganitatva:**
1. **Do not try to out-build Mathigon's widget library from scratch.** It already has 50+ polished
   manipulative types covering most of K-12 math, it's free, and it's actively maintained by its original
   founder. Study its interaction patterns (drag, snap, combine, undo, the Polypad canvas model) directly —
   this is the single highest-leverage "copy the interaction design, don't reinvent it" opportunity in this
   entire report. Building fraction bars, algebra tiles, and geoboards from first principles when a working,
   open reference implementation's *behavior* (not code — Mathigon's source isn't open) can be studied for
   free is a waste of Phase 1-2 time.
2. **The real gap Mathigon leaves open is exactly Ganitatva's Phase 2 engine**: mastery-tracked, spaced-
   repetition-driven, mistake-diagnosing practice wrapped around a widget, on a native offline-first app
   with a Hindi track. Mathigon is an interactive textbook; Ganitatva's plan is a mastery-tracked learning
   system. That is a real, defensible difference — but it means the plan's core marketing claim ("no concept
   ships without a manipulable widget" = "the entire moat," per `docs/00-VISION.md`) is not accurate as
   written. Mathigon already ships that. **The moat, if there is one, is the full six-layer pipeline plus
   offline/native/Hindi/CGU-measurement — not the widget alone.** This is a direct, plain contradiction of
   the vision doc's moat claim and should be corrected there, not softened here.
3. Mathigon's abandonment of native mobile apps is a gap Ganitatva's offline-first, native-first design
   directly fills — this is a legitimate differentiation angle, more concrete than "we have widgets too."

---

## Brilliant

### Atomic unit of learning
**VERIFIED:** Brilliant's product is built from interactive, guided "courses" made of sequential lessons
combining short explanation with an interactive quiz/puzzle-style problem the learner directly manipulates
to check understanding, not a video-first format. [Wikipedia: Brilliant](https://en.wikipedia.org/wiki/Brilliant_(website))

### What they do genuinely well
**VERIFIED:** Freemium access to 100+ guided courses; a design language built around active problem-solving
rather than passive video-watching, which the search evidence describes as outperforming typical MOOC
engagement benchmarks by roughly 30% (self-reported platform metric, not third-party audited). (Search
summary, 2025-2026 business-model sources — **flagging this specific "~30% better than MOOC benchmarks"
figure as widely claimed but weakly evidenced**, since it traces to Brilliant's own reporting rather than an
independent study.)

### Where learners drop off
**VERIFIED (user-reported, review-site sourced, not a formal study):** Two recurring complaints: (1) some
paths assume prior knowledge the learner doesn't have, creating steep difficulty jumps; (2) learners report
enjoying the content but not feeling it durably improves their knowledge, i.e., a completion/mastery gap
similar to Khan Academy's. There is also a structural complaint that past content isn't easily reviewable,
which directly undercuts retention. (Search summary of review-site/Reddit-sourced complaints — **weakly
evidenced**, self-reported and anecdotal, no controlled study found.)

### Business model
**VERIFIED:** Freemium, DTC, subscription-funded — ~$119-149/yr or ~$25/mo "Brilliant Premium," reported to
generate ~85% of revenue; FY2025 reported figures cited at ~1.8M MAU, 28% annual subscriber retention,
~12% annual churn. (Search summary of business-model aggregator sources, 2025-2026 — **these are
third-party estimates, not Brilliant's own audited disclosures; treat precision as approximate.**)

### Current status
**VERIFIED:** Actively operating, independent, growth strategy for 2024-2025 focused on B2B ("Brilliant for
Teams") and international expansion. (Search summary, 2025-2026 sources.)

**What this means for Ganitatva:** Brilliant proves interactive-first (vs. video-first) format retains
attention better than MOOCs, supporting the vision's anti-video stance. But its dropout complaint pattern —
"steep difficulty jumps" and "enjoyed it but didn't feel it stuck" — is precisely the failure mode
Ganitatva's 6-layer doctrine is designed to prevent (Hook→Intuition before Formalize, and a Practice layer
with mistake diagnosis instead of "solve puzzle, move on"). The CGU (delayed transfer test) metric directly
targets Brilliant's "didn't feel it stuck" complaint — that's a legitimately different and better bet than
what Brilliant measures.

---

## Khan Academy

### Atomic unit of learning
**VERIFIED:** Instructional video paired with a practice-exercise set, organized into skill trees aligned to
grade-level standards; more recently layered with Khanmigo, an AI Socratic-tutoring chat assistant.
[Khan Academy Blog, Khanmigo](https://blog.khanacademy.org/harnessing-ai-so-that-all-students-benefit-a-nonprofit-approach-for-equal-access/)
This is exactly the "video library" model `docs/00-VISION.md` explicitly rejects.

### What they do genuinely well
**VERIFIED:** Independently-cited, reasonably rigorous quasi-experimental research finds students who use
Khan Academy 30+ minutes/week (18+ hrs/school-year) show ~20% greater-than-expected learning gains on the
nationally-normed MAP Growth assessment. [Khan Academy Blog, Nov 2024 efficacy results](https://blog.khanacademy.org/khan-academy-efficacy-results-november-2024/)
This is one of the few results in this whole teardown backed by a large-N study rather than
company-reported engagement metrics.

### Where learners drop off
**VERIFIED — this is the single most important Khan Academy data point for Ganitatva:** Only **~9% of a
~350,000-student sample reached the "recommended dosage" of 30+ minutes/week** that the efficacy study
above is contingent on. [Khan Academy Blog, Nov 2024](https://blog.khanacademy.org/khan-academy-efficacy-results-november-2024/)
In other words: Khan Academy *works*, conditional on a usage threshold that ~91% of actual users never
reach. The product's core failure is not pedagogy — it's engagement/completion.

### Business model
**VERIFIED:** Nonprofit; ~$117.5M total FY2024-25 revenue, of which ~$90.4M is donations (Gates Foundation,
Google, AT&T, etc.) and ~$22.2M is program-service revenue; free to all end users.
(Search summary of tax-return/990 analysis sources.)

### Current status
**VERIFIED:** Actively operating, heavily investing in Khanmigo (AI tutor, GPT-4-based, free-to-US-teachers
deal with Microsoft). [Khan Academy Blog](https://blog.khanacademy.org/harnessing-ai-so-that-all-students-benefit-a-nonprofit-approach-for-equal-access/)

**What this means for Ganitatva:** The 9%-reach-threshold statistic is the strongest evidence in this entire
report that **passive-content platforms have a structural completion problem, not just a "our content isn't
good enough" problem** — Khan Academy's content is empirically shown to work and still only ~1 in 11 users
uses it enough to benefit. This should raise the bar of concern for Ganitatva's own retention risk (Phase 3
exit gate targets 7-day retention ≥25%, which is a directly comparable, harder-to-hit number than it looks
at first glance). It also validates the vision's instinct that Khan Academy's model — video + exercises,
donation-funded, free — is already "won" in its category and not worth competing with head-on, since
Ganitatva cannot out-donate a $117M/yr nonprofit's video library; it has to compete on completion, not
content volume or price.

---

## Desmos

### Atomic unit of learning
**VERIFIED:** Two distinct products under one brand: (1) the free graphing/scientific/geometry calculator
suite — an open-ended exploration tool, not a sequenced lesson unit; (2) "Desmos Classroom" (formerly
teacher.desmos.com) — teacher-authored, screen-by-screen interactive activities students work through live
in class, each screen typically one manipulable graph/interaction plus a response prompt.
[Desmos blog, "Desmos Studio PBC" / "Desmos Classroom at Amplify"](https://blog.desmos.com/articles/desmos-amplify-join-forces/)

### What they do genuinely well
**VERIFIED:** The calculator is widely regarded as best-in-class (75M+ annual users,
[desmos.com/about](https://www.desmos.com/about)) and free, unrestricted, ad-free — a rare example of a
sustainably free, high-quality math tool with no user-facing monetization at all.

### Where learners drop off
**No dropout data found; weakly evidenced territory.** Desmos Classroom activities are teacher-led and
synchronous (used live in a classroom), which structurally sidesteps the self-paced-dropout problem that
plagues Khan Academy and Brilliant — but this also means it depends on a teacher choosing to run it, and has
no real analog to an unsupervised, self-directed learner opening an app alone at home (Ganitatva's actual
use case).

### Business model
**VERIFIED:** In May 2022, Amplify acquired Desmos' *curriculum* business specifically; the calculator suite
spun off separately as **Desmos Studio PBC** (a Public Benefit Corporation, not a nonprofit), which
continues to license its calculator technology to test-makers/textbook publishers (B2B) while keeping the
consumer product entirely free.
[BusinessWire](https://www.businesswire.com/news/home/20220518005797/en/Amplify-Acquires-Desmos-Curriculum-to-Build-the-Future-of-Math-Instruction-Desmos-Calculators-to-Remain-Independent-and-Free-to-All),
[Desmos blog](https://blog.desmos.com/articles/desmos-amplify-join-forces/)

### Current status
**VERIFIED:** Both entities (Desmos Studio PBC and Desmos Classroom at Amplify) are actively operating as of
the most recent evidence found (2025 impact-assessment PDF exists for a related Desmos nonprofit entity).

**What this means for Ganitatva:** Desmos is the second data point (after Mathigon) that the B2B/licensing-
to-district-and-publisher model is the proven way to keep a genuinely good, free math tool alive
indefinitely without user-hostile monetization — directly relevant if Ganitatva ever needs a sustainability
model beyond "one operator, no revenue." It's also a caution: Desmos' split (calculator vs. curriculum, sold
to two different corporate structures) shows that even a beloved, technically excellent free tool doesn't
naturally stay a single coherent pedagogical product once money enters — the calculator's soul (pure,
open-ended exploration) and the curriculum's soul (sequenced instruction) went to different owners. Ganitatva
insisting on owning the full six-layer pipeline in one app, one team, is a deliberate rejection of that
split, and this history is a reasonable justification for that choice.

---

## Photomath

### Atomic unit of learning
**VERIFIED:** Point a phone camera at a printed or handwritten problem → get a step-by-step solution,
optionally with an animated walkthrough. The atomic unit is "a single already-posed problem," not a concept
or a lesson. [Wikipedia: Photomath](https://en.wikipedia.org/wiki/Photomath)

### What they do genuinely well
**VERIFIED:** Extremely low-friction problem recognition (OCR + solver) across a wide range of topics from
elementary arithmetic through calculus; large user base was enough to justify a Google acquisition valued up
to ~$550M. [Total Croatia News](https://total-croatia-news.com/news/business/croatian-photomath-2/)

### Where learners drop off / core criticism
**VERIFIED:** The dominant criticism, both from teachers and from recent research, is not "dropout" in the
retention sense but **misuse as an answer-shortcut**: recent controlled research (arXiv 2605.21629,
"Faster Completion, Less Learning," 2026) finds generative-AI-style math solvers reduce study time on
problems *and* reduce the knowledge built while solving them — i.e., faster task completion measurably
trades off against learning. [arXiv](https://arxiv.org/pdf/2605.21629) Khan Academy's own community forum
has threads specifically about "cheating with the Photomath app."
[Khan Academy Help Center](https://support.khanacademy.org/hc/en-us/community/posts/115000409307-Cheating-with-the-Photomath-app)

### Business model
**VERIFIED:** Freemium (free step solutions; paid subscription for textbook-matched solutions and animated
walkthroughs) until acquisition; acquired by Google in 2022, deal closed June 2023 after EU approval, now
folded into Google's Search/Lens/Gemini ecosystem. [Wikipedia](https://en.wikipedia.org/wiki/Photomath),
[TipRanks/Reuters via search summary]

### Current status
**VERIFIED:** Owned 100% by Alphabet, being oriented toward Google Lens / Gemini AI integration as of the
evidence found (search summary, 2025).

**What this means for Ganitatva:** Photomath is direct, strong empirical support for `docs/00-VISION.md`'s
explicit rejection of "homework solver" as a category — the arXiv 2026 finding that faster answer-completion
measurably reduces learning is exactly the mechanism the vision doc gestures at ("Answers are the opposite
of understanding") but doesn't cite. This is now a citable, VERIFIED backing for that design principle, not
just an assertion — worth adding to the vision doc as a footnote/citation.

---

## Byju's

### Atomic unit of learning
**VERIFIED:** Pre-recorded video lectures by "star teachers" paired with MCQ-style practice and adaptive
testing, sold through in-person and phone-based sales counseling rather than discovered organically.
(Search summary, multiple sources on Byju's product model.) This is exactly the "video + MCQ" model the
vision doc explicitly names and rejects.

### What they do genuinely well
**VERIFIED (historically, pre-collapse):** Byju's built the largest K-12 edtech user base in India and
reached a peak valuation of $22B, proving there is enormous latent demand for supplemental math/science
education among Indian families — validating market size, not product quality.
[CNBC](https://www.cnbc.com/2024/03/01/the-rise-and-fall-of-byjus-once-a-startup-darling-in-india.html)

### Where learners drop off / what actually killed the company
This is a business-model and governance collapse, **not primarily a pedagogy failure** — important to state
plainly since it changes what lessons transfer to Ganitatva. Full detail in `01-edtech-graveyard.md`.
Summary:
- **VERIFIED:** $1.2B loan in 2021, of which $533M was allegedly diverted into a hedge fund with no clear
  accounting; a US bankruptcy court held director Riju Ravindran in contempt for refusing to disclose its
  location, and found co-founders Byju Raveendran and Divya Gokulnath complicit.
  [Legal Maestros summary](https://legalmaestros.com/current-legal-update/byjus-financial-crisis-unveiled-understanding-the-complex-web-of-lawsuits-and-bankruptcy-filings/)
- **VERIFIED:** Debt-funded acquisition spree — WhiteHat Jr ($300M), Aakash Educational Services ($950M),
  Epic ($500M), Great Learning ($600M), Tynker, Osmo, and others — none properly integrated; WhiteHat Jr
  alone burned ~₹220 crore/month on marketing post-acquisition while posting losses.
  (Search summary, multiple business-press sources.)
- **VERIFIED:** Auditor Deloitte resigned in 2022 citing repeated failure to receive required financial
  statements; valuation collapsed ~95% from its 2022 peak.
  [CNBC](https://www.cnbc.com/2024/03/01/the-rise-and-fall-of-byjus-once-a-startup-darling-in-india.html)
- **VERIFIED:** US Chapter 11 filing Feb 2024; Indian NCLT insolvency proceedings from July 2024; as of
  November 2025 a judge ordered founder Byju Raveendran to pay $1.07B immediately plus a $10,000/day fine
  for non-cooperation. (Search summary, Bloomberg/legal-press sources, 2024-2025.)
- **VERIFIED, separately, a genuine product/GTM criticism (not just financial):** Byju's sales force used
  what multiple sources describe as emotionally coercive, high-pressure tactics targeting parents, including
  predatory sales practices and misleading advertising. (Search summary, multiple business-press sources.)

### Business model
**VERIFIED:** High-touch B2C sales (video subscriptions sold via aggressive counselor-led sales calls/home
visits), heavily subsidized by VC and debt capital rather than by unit-economics-positive organic growth.

### Current status
**VERIFIED:** In active insolvency/bankruptcy proceedings in both the US and India as of late 2025; assets
being sold off at steep losses (e.g., Tynker). [Business Standard](https://www.business-standard.com/industry/news/byjus-epic-tynker-sale-bankruptcy-us-125061100211_1.html)

**What this means for Ganitatva:** See `01-edtech-graveyard.md` for the full extraction of which failure
patterns transfer to a solo-operator, offline-first, no-sales-force app and which don't. Short version:
almost none of Byju's *specific* failure mechanisms (debt-funded M&A, predatory sales, accounting fraud)
are physically possible for Ganitatva's current structure — there's no debt, no sales force, no
acquisitions. The one mechanism that *does* transfer is the underlying temptation Byju's succumbed to:
optimizing for growth/engagement metrics that are easy to sell to investors (DAU, enrollment) over the
metric that actually matters (learning). Ganitatva's CGU metric is a direct, structural defense against that
temptation — worth stating explicitly as the reason CGU exists, not just as a nice measurement idea.

---

## Cross-cutting comparison table

| Product | Atomic unit | Business model | Core dropout mechanism |
|---|---|---|---|
| Mathigon | Interactive textbook chapter + Polypad widget | Publisher (Amplify) B2B funding, free to users | Weak sequencing/practice/mastery layer, not usage dropoff |
| Brilliant | Interactive guided lesson + puzzle | DTC freemium subscription | Difficulty spikes; "didn't feel it stuck" |
| Khan Academy | Video + exercise set | Nonprofit/donations, free | 91% of users never reach the effective-dosage threshold |
| Desmos | Open calculator / live teacher-led activity screen | B2B licensing (Studio) + publisher (Amplify Classroom) | N/A — sidesteps self-paced dropout via classroom use |
| Photomath | Single posed problem → solution | Freemium → acquired by Google | Misuse as answer-shortcut measurably reduces learning |
| Byju's | Video lecture + MCQ, sold via counselor | VC/debt-funded B2C sales | Company-level collapse (governance/debt), not a product dropout pattern |

## What this means for Ganitatva (top-level)

1. **The single most consequential finding across this whole teardown:** Mathigon already builds
   Ganitatva's stated moat — free, high-quality, manipulable widgets, still actively maintained by its
   founder, at scale — and it survived its acquisition intact rather than being killed. This means
   `docs/00-VISION.md`'s claim that the manipulable-widget rule "is the entire moat" is not defensible as
   written and should be revised. The defensible moat is the *complete, mastery-tracked, offline-first,
   mistake-diagnosing, six-layer pipeline* — something none of these six products do end-to-end.
2. Khan Academy's 9%-reach-threshold statistic is the strongest evidence that content quality is not the
   binding constraint in this category — completion/habit-formation is. Ganitatva's Phase 3 retention gate
   (≥25% D7) should be treated as the hardest, most important number in the entire plan, harder than it
   currently reads.
3. Byju's collapse is almost entirely inapplicable to Ganitatva mechanically (no debt, no sales force, no
   M&A) but its root cause — optimizing for metrics that are easy to report over metrics that reflect real
   learning — is exactly what the CGU metric exists to prevent. Keep it structurally load-bearing, not
   decorative.
4. Photomath and the 2026 arXiv finding give the vision doc's anti-"homework solver" stance a real citation
   it currently lacks.
