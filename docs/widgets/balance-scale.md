# BalanceScale

> Inherits the base contract in `00-kit-overview.md`. Read that first — this spec only states what's
> specific to `BalanceScale`. This is a shorter-form spec per the assignment's priority order; it still
> covers every required section, at less depth than the three fractions-slice specs.

## 1. Teaching job

**The one misunderstanding this widget exists to destroy:** a learner treats "=" as an instruction to
*compute an answer* (read left to right, produce a number) rather than a *statement that two things weigh
the same*. This is why "solving for x" feels like guess-and-check rather than a mechanical, reliable
process. `BalanceScale` makes the equals sign physically literal: two pans must stay level, and **any
operation applied to one side is mechanically forced onto the other** — the widget will not let a learner
apply an operation to only one pan. Isolating a variable stops being a memorized sequence of moves and
becomes "the only way to keep the thing level while removing clutter from one side."

## 2. Config schema

```jsonc
{
  "type": "BalanceScale",
  "config": {
    "id": "scale-a",
    "interaction_level": "guided",
    "mode": "solve-for-x",              // "explore" | "solve-for-x" | "verify-balance"
    "left":  [ { "type": "variable", "var_name": "x", "coefficient": 2 }, { "type": "constant", "value": 3 } ],
    "right": [ { "type": "constant", "value": 9 } ],
    "unknown_var": "x",
    "allowed_operations": ["add", "subtract", "multiply", "divide"],
    "operation_scope": "both-sides-only", // fixed value; not learner-configurable, stated explicitly for clarity
    "show_tilt": true,
    "solution_target": { "var_name": "x", "value": 3 }
  }
}
```

**Build-time validation:** `left`/`right` each non-empty; `solution_target` required in `solve-for-x` mode
and must be the actual algebraic solution of the given equation (checked at build time so a broken concept
never ships an unsolvable scale); `operation_scope` is always `"both-sides-only"` — there is no config path
that allows a one-sided operation, because the mechanic *is* the lesson.

## 3. Interaction model

- Dragging an operation tile (e.g. "−3") onto one pan **automatically spawns a mirrored ghost tile** hovering
  over the other pan; the operation only commits once the learner drops the mirror too. Releasing a term
  without completing its mirror triggers a snap-back — the scale visibly stays tilted/unbalanced as feedback
  until resolved, never silently reverting.
- Combining like terms (e.g. `+x` and `−x` on the same pan) requires dragging them into contact; they
  visually annihilate on contact (§5) — cancellation is a *physical act*, not a rule applied from a menu.
- **What the learner cannot break:** cannot commit a single-sided operation (the drag simply cannot complete
  without its mirror — geometrically unreachable, not refused after the fact); cannot divide by a
  coefficient of 0 (not a reachable operation tile when the relevant coefficient is 0); `explore` mode has no
  `solution_target` and never claims "solved," it only ever reports current balance state.

## 4. Responsive behaviour

- **`compact`:** the scale renders horizontally compressed; each pan's term stack lays out vertically and
  scrolls if dense (5+ terms). The operation-tile tray docks at the bottom (thumb zone); dragging a tile a
  short distance onto "left pan" or "right pan" targets (large ≥44pt drop zones, not the full visual pan
  outline) is sufficient — precision dragging onto a tiny illustrated pan is not required.
- **`expanded`:** wide horizontal scale with larger pans, mouse drag-and-drop; a keyboard-accessible
  alternative exists at both tiers per kit overview §4.5 — select a tile, then press an explicit "Apply to
  both sides" button, which performs the same mirrored operation without a drag gesture at all.

## 5. Animation spec

| Trigger | Primitive | Duration | Pedagogical justification |
|---|---|---|---|
| Any imbalance (left-sum ≠ right-sum) | `physical-response` (spring) — tilt angle is a **continuous** function of the difference, always live, never a discrete balanced/unbalanced flag | 600–900ms settle | The scale is the one widget in the kit that models a real physical object with inertia, so spring motion is earned here (kit overview §6 table) — and the tilt must be *proportional*, because a screenshot mid-imbalance needs to visually communicate "how far off," not just "off." |
| Mirror-tile pending drop | `ghost-preview` pulsing on the un-dropped side | continuous while pending | Invites the matching drop; makes the "you must do this to both sides" rule visible before the learner acts wrong. |
| Like-term cancellation | quick "poof" (scale-down + fade), 250ms | 250ms | A physical act of cancelling, not a silent disappearance — reinforces that opposite terms actively cancel rather than merely being deleted. |
| Solved state reached | `highlight-pulse` on the isolated variable term | 350ms | Marks the moment `x` stands alone, tying the visual event to the algebraic milestone. |

## 6. Accessibility

- Tilt is communicated by rotation angle **and** a numeric live region ("left pan heavier by 3 units")
  **and** a textual balance-meter bar rendered alongside the scale — judging a rotated illustration by eye
  is genuinely hard for low-vision users, so this is the widget's colour/shape-analog of the
  never-sole-carrier rule (kit overview §7) applied to a rotation signal instead of a color signal.
- Each pan is exposed as an ordered list of terms in the Semantics tree; operations are announced in full
  sentences: *"Subtracted 3 from both sides. Left: 2x. Right: 6."*
- The mirrored-drag requirement has a full non-drag keyboard path (§4) — this is load-bearing accessibility,
  not a convenience, since the core mechanic is otherwise a two-target drag gesture that's hard for
  switch-access users.

## 7. Golden-test plan

1. `balanced-neutral__compact` / `__expanded` — level scale, default state.
2. `tilted-left__expanded`, `tilted-right__expanded` — proportional tilt at two different imbalance
   magnitudes, confirming tilt angle scales with the difference, not just a binary flag.
3. `mirrored-drag-pending__t-mid` — ghost-preview mid-gesture frame, one side dropped, mirror pending.
4. `cancellation-poof__t-mid` — mid-animation frame of like-term annihilation.
5. `solved-state__compact` — isolated `x`, `highlight-pulse` frame, the single most pedagogically
   load-bearing state (kit overview §9.3.2).
6. `dense-term-stack__compact` — 5+ terms per side, confirming the vertical-scroll reflow rule.
7. `keyboard-only-flow__expanded` — state reached via the "Apply to both sides" button path, confirming
   parity with the drag path.
8. `dark-theme__solved-state` — dark-theme render of state #5.
