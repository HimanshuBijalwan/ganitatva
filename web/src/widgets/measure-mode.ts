/**
 * FractionBar `measure` mode — THE PHASE 1 EXIT GATE.
 *
 * fraction-bar.md §3.4. Division is measurement: "how many of this stick fit inside that ribbon".
 * The whole concept turns on ONE gesture — dragging the leftover piece of ribbon out and laying it
 * ON the stick, where it visibly covers half of it. Everything else in this file exists to make
 * that gesture physical, exact and unmissable on a 5" phone.
 *
 * Load-bearing decisions, stated so they are not accidentally refactored away:
 *
 *  1. The leftover is laid ON TOP of the stick, not beside it. Coverage is then literally an
 *     overlap you can see, not two lengths you have to compare by eye.
 *  2. The count 1½ NEVER appears before that gesture. Until the leftover is laid flush, the
 *     readout says "one stick laid, and a piece of ribbon left over". The answer is produced by
 *     the learner's hands, not revealed by the widget.
 *  3. While the piece slides across the stick the coverage readout is live AND exact: the piece
 *     snaps to a common-piece grid (1/lcm(remainder, stick) subdivided), so every intermediate
 *     reading is a true fraction of the stick, and the flush position is a DETENT. Eyeballing is
 *     impossible; the fraction climbs to one half and locks.
 *  4. `refuse_overhang` is absolute. A copy that would pass the ribbon's far edge springs back.
 *     That refusal is what forces whole-copies-then-remainder instead of an approximate last lay.
 *  5. `in_wholes` is never marked wrong. It is a second true reading with its frame named.
 */

import * as R from './rational';
import type { Rat } from './rational';
import {
  clamp,
  drawBar,
  drawMixedWithUnit,
  drawStackedFraction,
  label,
  ruledLine,
  uiFont,
  vline,
} from './draw';
import { button, el, group, nextId, removeAll, row, setText } from './dom';
import { capitalise, countWord, fractionWords, mixedWords, pieceNameWords } from './strings';
import type {
  ActiveFrame,
  FractionBarSnapshot,
  MeasureConfig,
  MeasurePreset,
  MeasureSnapshot,
  ModeController,
  Prediction,
  Verbosity,
  WidgetHost,
} from './types';

const PAD_X = 14;
const PAD_TOP = 8;
const RULER_H = 22;
const BAY_LABEL_H = 17;
const READOUT_H = 34;
const MIN_TOUCH = 48; // tokens §9.1 R5 — ours are dragged, not tapped
const DETENT_PX = 12;
const SETTLE_MS = 180;
const DETENT_MS = 120;
/** The counter must be able to climb without bound in the divide-by-zero state; this only stops
 *  the integer from becoming silly, and is far beyond any reachable hand-laid count. */
const COUNT_CEILING = 9999;

type Bay = 'stick' | 'whole';
type GroupName = 'ladder' | 'lay' | 'frames' | 'probe' | 'pieces' | 'predict';

interface RemainderPlacement {
  against: Bay;
  offsetUnits: number;
  gridDen: number;
}

interface Geom {
  trackX: number;
  trackW: number;
  viewWholes: number;
  pxPerWhole: number;
  ribbonH: number;
  stickH: number;
  rulerY: number;
  ribbonY: number;
  laneY: number;
  stickBayLabelY: number;
  stickBayY: number;
  wholeBayLabelY: number;
  wholeBayY: number;
  showWholeBay: boolean;
  countY: number;
  trayLabelY: number;
  trayY: number;
  height: number;
}

interface DragState {
  kind: 'stick' | 'remainder';
  pointerId: number;
  grabDX: number;
  grabDY: number;
  x: number;
  y: number;
  engaged: Bay | null;
  offsetUnits: number;
  seats: boolean;
}

interface FlyState {
  kind: 'stick' | 'remainder';
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  t: number;
}

export class MeasureMode implements ModeController {
  private readonly host: WidgetHost;
  private readonly cfg: MeasureConfig;

  // ---- persisted state -----------------------------------------------------
  private presetId: string | null = null;
  private target: Rat;
  private stick: Rat;
  private copies = 0;
  private remainder: RemainderPlacement | null = null;
  private frame: ActiveFrame;
  private samePieces = false;
  private prediction: Prediction | null = null;
  private predictionAttempts = 0;

  // ---- ephemeral state -----------------------------------------------------
  private drag: DragState | null = null;
  private fly: FlyState | null = null;
  private refusalUntil = 0;
  private edgeMark = 0; // 0..1 stroke-weight step on the ribbon's far edge (state-mark)
  private samePiecesPhase = 0;
  private lastMoveEmit = 0;
  private geomCache: Geom | null = null;
  private geomWidth = -1;

  // ---- chrome --------------------------------------------------------------
  private groupsRoot: HTMLElement | null = null;
  private selector: HTMLElement | null = null;
  private activeGroup: GroupName = 'lay';
  private stickHandle: HTMLElement | null = null;
  private remHandle: HTMLElement | null = null;
  private readonly groupNodes = new Map<GroupName, HTMLElement>();
  private readonly chipNodes = new Map<GroupName, HTMLButtonElement>();
  private presetChips: HTMLButtonElement[] = [];
  private hintNode: HTMLElement | null = null;
  private readonly idBase = nextId('gt-fb-measure');

  constructor(host: WidgetHost, cfg: MeasureConfig) {
    this.host = host;
    this.cfg = cfg;
    this.target = R.fromSpec(cfg.target.fraction);
    this.stick = R.fromSpec(cfg.measuring_stick.fraction);
    this.frame = cfg.remainder?.frame_toggle?.initial ?? 'in_sticks';
    const first = cfg.presets[0];
    if (first !== undefined && this.matchesPreset(first)) this.presetId = first.id;
  }

  // =========================================================================
  // Mathematics. Every quantity below is exact; nothing here uses a float.
  // =========================================================================

  private get stickIsZero(): boolean {
    return R.isZero(this.stick);
  }

  /** How many whole copies fit. Unbounded when the stick has no length — deliberately. */
  private get maxCopies(): number {
    if (this.stickIsZero) return COUNT_CEILING;
    return R.fitCount(this.target, this.stick);
  }

  private get remainderLen(): Rat {
    if (this.stickIsZero) return this.target;
    return R.sub(this.target, R.scale(this.stick, this.copies));
  }

  private get exactCover(): boolean {
    return !this.stickIsZero && this.copies === this.maxCopies && R.isZero(this.remainderLen);
  }

  /** The leftover becomes a draggable object only once no further stick copy can seat. */
  private get leftoverActive(): boolean {
    if (this.stickIsZero) return false;
    if (this.cfg.remainder?.enabled === false) return false;
    return this.copies >= this.maxCopies && !R.isZero(this.remainderLen);
  }

  /**
   * Snap grid for the compare bay, in pieces per whole. A multiple of both the leftover's and the
   * stick's denominators, subdivided so the slide feels continuous while every intermediate
   * reading stays an exact fraction. Snapping is mandatory (kit §4.2); this is its grid.
   */
  private get gridDen(): number {
    const rem = this.remainderLen;
    const base = this.stickIsZero ? rem.d : R.lcm(rem.d, this.stick.d);
    return clamp(base * 4, 4, 720);
  }

  private get pieceUnits(): number {
    return Math.round((this.remainderLen.n * this.gridDen) / this.remainderLen.d);
  }

  private bayUnits(bay: Bay): number {
    const len = bay === 'stick' ? this.stick : R.ONE;
    return Math.round((len.n * this.gridDen) / len.d);
  }

  /** Overlap of the leftover piece with the bay object, as an exact fraction OF THE BAY OBJECT. */
  private coverage(bay: Bay, offsetUnits: number): Rat | null {
    const bu = this.bayUnits(bay);
    if (bu === 0) return null; // a zero-length stick has no reading; never render NaN at a learner
    const lo = Math.max(offsetUnits, 0);
    const hi = Math.min(offsetUnits + this.pieceUnits, bu);
    return R.rat(Math.max(0, hi - lo), bu);
  }

  /** The reading that is currently live: mid-drag if dragging, else the committed placement. */
  private liveCoverage(): { bay: Bay; value: Rat | null } | null {
    const d = this.drag;
    if (d !== null && d.kind === 'remainder' && d.engaged !== null) {
      return { bay: d.engaged, value: this.coverage(d.engaged, d.offsetUnits) };
    }
    if (this.remainder !== null) {
      return { bay: this.remainder.against, value: this.coverage(this.remainder.against, this.remainder.offsetUnits) };
    }
    return null;
  }

  /**
   * True only once the learner has physically produced the reading: the whole leftover piece is
   * lying against the bay object, so its coverage is a complete measurement rather than a partial
   * overlap. Flush-left is the DETENT, but any fully-on placement reads the same and is honest.
   */
  private get measured(): boolean {
    if (this.stickIsZero) return false;
    if (this.exactCover) return true;
    const r = this.remainder;
    if (r === null) return false;
    const bu = this.bayUnits(r.against);
    if (bu === 0) return false;
    const overlap = Math.max(0, Math.min(r.offsetUnits + this.pieceUnits, bu) - Math.max(r.offsetUnits, 0));
    return overlap === Math.min(this.pieceUnits, bu);
  }

  private get commonDen(): number {
    return this.stickIsZero ? this.target.d : R.lcm(this.target.d, this.stick.d);
  }

  private matchesPreset(p: MeasurePreset): boolean {
    return (
      R.eq(this.target, R.fromSpec(p.target)) && R.eq(this.stick, R.fromSpec(p.stick))
    );
  }

  private get layingBlocked(): boolean {
    const sp = this.cfg.size_predictor;
    if (sp?.enabled !== true) return false;
    if (sp.record_prediction === false) return false;
    return this.prediction === null;
  }

  private get canAct(): boolean {
    return this.host.interactionLevel !== 'readOnly';
  }

  // =========================================================================
  // Geometry
  // =========================================================================

  private geom(): Geom {
    if (this.geomCache !== null && this.geomWidth === this.host.width) return this.geomCache;
    const bu = this.host.bu;
    const w = this.host.width;
    const trackX = PAD_X;
    const trackW = Math.max(60, w - PAD_X * 2);
    const ribbonH = clamp(1.5 * bu, 30, 46);
    const stickH = clamp(1.2 * bu, 26, 38);
    const viewWholes = Math.max(1, R.toNumber(this.target), R.toNumber(this.stick));
    const showWholeBay =
      this.cfg.remainder?.also_allow_compare_against_whole !== false &&
      (this.frame === 'in_wholes' || this.frame === 'both');

    let y = PAD_TOP;
    const rulerY = y;
    y += RULER_H;
    const ribbonY = y;
    y += ribbonH + 4;
    const laneY = y;
    y += stickH + 12;
    const stickBayLabelY = y;
    y += BAY_LABEL_H;
    const stickBayY = y;
    y += stickH + 8;
    let wholeBayLabelY = y;
    let wholeBayY = y;
    if (showWholeBay) {
      wholeBayLabelY = y;
      y += BAY_LABEL_H;
      wholeBayY = y;
      y += stickH + 8;
    }
    y += 4;
    const countY = y;
    y += READOUT_H + 8;
    const trayLabelY = y;
    y += BAY_LABEL_H;
    const trayY = y;
    y += stickH + 10;

    this.geomCache = {
      trackX,
      trackW,
      viewWholes,
      pxPerWhole: trackW / viewWholes,
      ribbonH,
      stickH,
      rulerY,
      ribbonY,
      laneY,
      stickBayLabelY,
      stickBayY,
      wholeBayLabelY,
      wholeBayY,
      showWholeBay,
      countY,
      trayLabelY,
      trayY,
      height: y,
    };
    this.geomWidth = this.host.width;
    return this.geomCache;
  }

  private invalidateGeom(): void {
    this.geomCache = null;
    this.geomWidth = -1;
  }

  measureHeight(): number {
    this.invalidateGeom();
    return this.geom().height;
  }

  private px(r: Rat): number {
    return R.toNumber(r) * this.geom().pxPerWhole;
  }

  private unitsToPx(units: number): number {
    return (units / this.gridDen) * this.geom().pxPerWhole;
  }

  private bayY(bay: Bay): number {
    const g = this.geom();
    return bay === 'stick' ? g.stickBayY : g.wholeBayY;
  }

  private pieceH(): number {
    return Math.max(14, this.geom().stickH * 0.58);
  }

  /** Where the leftover piece rests when it has not been picked up: the ribbon's own tail. */
  private leftoverHome(): { x: number; y: number } {
    const g = this.geom();
    const covered = this.stickIsZero ? R.ZERO : R.scale(this.stick, this.copies);
    return {
      x: g.trackX + this.px(covered),
      y: g.ribbonY + (g.ribbonH - this.pieceH()) / 2,
    };
  }

  private leftoverRect(): { x: number; y: number; w: number; h: number } {
    const h = this.pieceH();
    const w = this.px(this.remainderLen);
    if (this.drag !== null && this.drag.kind === 'remainder') {
      return { x: this.drag.x, y: this.drag.y, w, h };
    }
    if (this.fly !== null && this.fly.kind === 'remainder') {
      const t = this.fly.t;
      return { x: this.fly.x0 + (this.fly.x1 - this.fly.x0) * t, y: this.fly.y0 + (this.fly.y1 - this.fly.y0) * t, w, h };
    }
    if (this.remainder !== null) {
      const g = this.geom();
      const bay = this.remainder.against;
      return {
        x: g.trackX + this.unitsToPx(this.remainder.offsetUnits),
        y: this.bayY(bay) + (g.stickH - h) / 2,
        w,
        h,
      };
    }
    const home = this.leftoverHome();
    return { x: home.x, y: home.y, w, h };
  }

  private stickTrayRect(): { x: number; y: number; w: number; h: number } {
    const g = this.geom();
    return { x: g.trackX, y: g.trayY, w: Math.max(2, this.px(this.stick)), h: g.stickH };
  }

  // =========================================================================
  // Controls
  // =========================================================================

  buildControls(): void {
    const host = this.host;
    removeAll(host.controls);

    const selector = el('div', 'gt-fb__selector');
    selector.setAttribute('role', 'tablist');
    selector.setAttribute('aria-label', 'Which control is live');
    host.controls.appendChild(selector);
    this.selector = selector;

    const groups = el('div', 'gt-fb__groups');
    host.controls.appendChild(groups);
    this.groupsRoot = groups;

    this.addGroup('ladder', 'Ladder', () => this.buildLadder());
    this.addGroup('lay', 'Lay sticks', () => this.buildLay());
    if (this.cfg.remainder?.frame_toggle !== undefined) {
      this.addGroup('frames', 'Measured in', () => this.buildFrames());
    }
    if (this.cfg.whole_probe?.enabled === true) {
      this.addGroup('probe', 'One whole', () => this.buildProbe());
    }
    if (this.cfg.same_pieces_mode?.enabled === true) {
      this.addGroup('pieces', 'Same pieces', () => this.buildSamePieces());
    }
    if (this.cfg.size_predictor?.enabled === true) {
      this.addGroup('predict', 'Predict', () => this.buildPredict());
    }

    this.activeGroup = this.layingBlocked && this.groupNodes.has('predict') ? 'predict' : 'lay';
    this.syncGroups();
    this.buildHandles();
    this.refreshControls();
  }

  relayout(): void {
    this.invalidateGeom();
    this.syncGroups();
    this.refreshControls();
  }

  private addGroup(name: GroupName, chipLabel: string, build: () => HTMLElement): void {
    const node = build();
    node.id = `${this.idBase}-${name}`;
    this.groupNodes.set(name, node);
    this.groupsRoot?.appendChild(node);

    const chip = button(chipLabel, () => {
      this.activeGroup = name;
      this.syncGroups();
    }, { className: 'gt-fb__chip' });
    chip.setAttribute('role', 'tab');
    chip.setAttribute('aria-controls', node.id);
    this.chipNodes.set(name, chip);
    this.selector?.appendChild(chip);
  }

  private syncGroups(): void {
    this.groupNodes.forEach((node, name) => {
      const on = this.host.wide || name === this.activeGroup;
      node.hidden = !on;
    });
    this.chipNodes.forEach((chip, name) => {
      chip.setAttribute('aria-selected', String(name === this.activeGroup));
    });
    if (this.selector !== null) this.selector.hidden = this.host.wide;
  }

  private buildLadder(): HTMLElement {
    const g = group('ladder', 'Ladder');
    const list = el('div', 'gt-fb__chips');
    this.presetChips = [];
    this.cfg.presets.forEach((p, index) => {
      const chip = button(humanise(p.id), () => this.selectPreset(index), { className: 'gt-fb__chip' });
      chip.dataset.presetId = p.id;
      this.presetChips.push(chip);
      list.appendChild(chip);
    });
    g.appendChild(list);
    return g;
  }

  private buildLay(): HTMLElement {
    const g = group('lay', 'Lay sticks');
    const r1 = row();
    r1.appendChild(button('Lay a stick', () => this.layStick(), { className: 'gt-fb__btn--primary' }));
    r1.appendChild(button('Take one back', () => this.removeStick()));
    g.appendChild(r1);

    const r2 = row();
    r2.appendChild(button('Return the leftover', () => this.returnLeftover()));
    r2.appendChild(button('Clear the sticks', () => this.clearCopies()));
    g.appendChild(r2);

    if (this.host.interactionLevel === 'free') {
      g.appendChild(this.stepperRow('Ribbon', 'target'));
      g.appendChild(this.stepperRow('Stick', 'stick'));
    }
    return g;
  }

  private stepperRow(name: string, which: 'target' | 'stick'): HTMLElement {
    const r = row('gt-fb__row--stepper');
    r.appendChild(el('span', 'gt-fb__stepper-name', name));
    const readout = el('span', 'gt-fb__stepper-value');
    readout.dataset.stepper = which;
    const mk = (text: string, part: 'n' | 'd', delta: number): HTMLButtonElement =>
      button(text, () => this.stepFraction(which, part, delta), {
        className: 'gt-fb__btn--step',
        ariaLabel: `${part === 'n' ? 'Top' : 'Bottom'} number of the ${name.toLowerCase()}, ${delta > 0 ? 'up' : 'down'} one`,
      });
    r.appendChild(mk('−', 'n', -1));
    r.appendChild(mk('+', 'n', +1));
    r.appendChild(readout);
    r.appendChild(mk('−', 'd', -1));
    r.appendChild(mk('+', 'd', +1));
    return r;
  }

  private buildFrames(): HTMLElement {
    const ft = this.cfg.remainder?.frame_toggle;
    const legend = this.host.str(ft?.label_id, 'measured in');
    const g = group('frames', capitalise(legend));
    const r = row();
    const opts: ActiveFrame[] = ft?.options !== undefined && ft.options.length > 0 ? [...ft.options] : ['in_sticks', 'in_wholes'];
    opts.forEach((opt) => {
      const b = button(opt === 'in_sticks' ? 'sticks' : 'wholes', () => this.setFrame(opt), { className: 'gt-fb__chip' });
      b.dataset.frame = opt;
      r.appendChild(b);
    });
    if (ft?.show_both_simultaneously_button !== false) {
      const text = typeof ft?.show_both_simultaneously_button === 'string'
        ? ft.show_both_simultaneously_button
        : 'show me both at once';
      const b = button(text, () => this.setFrame('both'), { className: 'gt-fb__chip' });
      b.dataset.frame = 'both';
      r.appendChild(b);
    }
    g.appendChild(r);
    const note = el('p', 'gt-fb__note', this.host.str(this.cfg.remainder?.frame_toggle?.explainer_id, 'Both readings describe the same piece of ribbon.'));
    note.hidden = true;
    note.dataset.role = 'frame-note';
    g.appendChild(note);
    return g;
  }

  private buildProbe(): HTMLElement {
    const wp = this.cfg.whole_probe;
    const g = group('probe', 'One whole');
    const r = row();
    r.appendChild(button(`Snap the ${this.ribbonWord} to one whole`, () => this.wholeProbe(), { className: 'gt-fb__btn--primary' }));
    g.appendChild(r);
    const out = el('p', 'gt-fb__note');
    out.dataset.role = 'probe-readout';
    setText(out, this.host.str(wp?.readout_id, 'sticks in one whole'));
    out.hidden = true;
    g.appendChild(out);
    return g;
  }

  private buildSamePieces(): HTMLElement {
    const sp = this.cfg.same_pieces_mode;
    const g = group('pieces', 'Same pieces');
    const r = row();
    const b = button(capitalise(this.host.str(sp?.label_id, 'same-sized pieces')), () => this.toggleSamePieces(), {
      className: 'gt-fb__chip',
      pressed: this.samePieces,
    });
    b.dataset.role = 'same-pieces-toggle';
    r.appendChild(b);
    if (sp?.suggest_common_denominator_button === true) {
      r.appendChild(button('Smallest piece that fits both', () => {
        if (!this.samePieces) this.toggleSamePieces();
      }));
    }
    g.appendChild(r);
    const out = el('p', 'gt-fb__note');
    out.dataset.role = 'same-pieces-readout';
    out.hidden = true;
    g.appendChild(out);
    return g;
  }

  private buildPredict(): HTMLElement {
    const sp = this.cfg.size_predictor;
    const g = group('predict', 'Predict');
    const q = el('p', 'gt-fb__note', this.host.str(sp?.ask_before_laying_id, 'Before laying anything down: will the count come out bigger or smaller than the ribbon?'));
    g.appendChild(q);
    const r = row();
    (['bigger', 'smaller', 'same'] as Prediction[]).forEach((p) => {
      const b = button(p, () => this.recordPrediction(p), { className: 'gt-fb__chip' });
      b.dataset.prediction = p;
      r.appendChild(b);
    });
    g.appendChild(r);
    const hint = el('p', 'gt-fb__note gt-fb__note--hint');
    hint.hidden = true;
    this.hintNode = hint;
    g.appendChild(hint);
    return g;
  }

  private get ribbonWord(): string {
    return this.host.str(this.cfg.target.label_id, 'ribbon');
  }

  private get stickWord(): string {
    return this.host.str(this.cfg.measuring_stick.label_id, 'stick');
  }

  private get sticksWord(): string {
    return this.host.str(this.cfg.counter?.unit_word_id, 'sticks');
  }

  private get wholeWord(): string {
    return this.host.str(this.cfg.unit?.label_id, 'whole');
  }

  // =========================================================================
  // Actions
  // =========================================================================

  private selectPreset(index: number): void {
    const p = this.cfg.presets[index];
    if (p === undefined || !this.canAct) return;
    this.presetId = p.id;
    this.target = R.fromSpec(p.target);
    this.stick = R.fromSpec(p.stick);
    this.resetLaying();
    this.prediction = null;
    this.samePieces = false;
    this.samePiecesPhase = 0;
    this.host.emit({ type: 'preset_selected', presetId: p.id, index });
    if (this.layingBlocked && this.groupNodes.has('predict')) {
      this.activeGroup = 'predict';
      this.syncGroups();
    }
    this.commit();
  }

  private resetLaying(): void {
    this.refusalUntil = 0;
    this.edgeMark = 0;
    this.copies = 0;
    this.remainder = null;
    this.drag = null;
    this.fly = null;
    this.invalidateGeom();
  }

  private stepFraction(which: 'target' | 'stick', part: 'n' | 'd', delta: number): void {
    if (!this.canAct) return;
    const cfg = which === 'target' ? this.cfg.target : this.cfg.measuring_stick;
    const current = which === 'target' ? this.target : this.stick;
    const nCtl = cfg.numerator_control;
    const dCtl = cfg.denominator_control;
    const nMin = nCtl?.min ?? (which === 'target' ? 1 : 0);
    const nMax = nCtl?.max ?? 12;
    const dMin = Math.max(1, dCtl?.min ?? 1);
    const dMax = dCtl?.max ?? 12;
    let n = current.n;
    let d = current.d;
    if (part === 'n') n = clamp(n + delta, nMin, nMax);
    else d = clamp(d + delta, dMin, dMax);
    let next = R.rat(n, d);
    if (which === 'target') {
      const max = this.cfg.target.max_value ?? 4;
      if (R.toNumber(next) > max) return;
      if (R.isZero(next)) return;
      if (cfg.allow_greater_than_one !== true && R.toNumber(next) > 1) return;
      this.target = next;
    } else {
      if (cfg.allow_greater_than_one !== true && R.toNumber(next) > 1) return;
      this.stick = next;
      next = this.stick;
    }
    this.presetId = null;
    this.resetLaying();
    this.host.emit({ type: 'fraction_changed', which, numerator: next.n, denominator: next.d });
    if (which === 'stick' && R.isZero(next)) {
      this.host.emit({ type: 'no_answer_state_entered', copies: this.copies });
    }
    this.commit();
  }

  /** The tap-to-lay path. Same code the drag release runs — one seat rule, one refusal rule. */
  private layStick(): boolean {
    if (!this.canAct || this.layingBlocked) return false;
    const before = this.copies;
    const fits = this.stickIsZero ? this.copies < COUNT_CEILING : this.copies < this.maxCopies;
    if (!fits) {
      this.host.emit({ type: 'stick_lay_attempted', copiesBefore: before, seated: false, refused: 'overhang' });
      this.refuse();
      return false;
    }
    this.copies += 1;
    this.remainder = null;
    this.host.emit({ type: 'stick_lay_attempted', copiesBefore: before, seated: true });
    if (this.exactCover) this.host.emit({ type: 'exact_cover_reached', copies: this.copies });
    if (this.stickIsZero && this.copies === 1) {
      this.host.emit({ type: 'no_answer_state_entered', copies: this.copies });
    }
    this.host.animate(this.host.reducedMotion ? 0 : DETENT_MS, (t) => {
      this.edgeMark = t;
      this.host.requestDraw();
    });
    this.commit();
    return true;
  }

  private removeStick(): void {
    if (!this.canAct || this.copies === 0) return;
    this.copies -= 1;
    this.remainder = null;
    this.host.emit({ type: 'stick_removed', copiesAfter: this.copies });
    this.commit();
  }

  private clearCopies(): void {
    if (!this.canAct || (this.copies === 0 && this.remainder === null)) return;
    this.copies = 0;
    this.remainder = null;
    this.host.emit({ type: 'stick_removed', copiesAfter: 0 });
    this.commit();
  }

  private returnLeftover(): void {
    if (!this.canAct || this.remainder === null) return;
    this.remainder = null;
    this.host.emit({ type: 'remainder_returned' });
    this.commit();
  }

  private setFrame(f: ActiveFrame): void {
    if (!this.canAct || this.frame === f) return;
    this.frame = f;
    this.invalidateGeom();
    this.host.emit({ type: 'frame_toggled', frame: f });
    this.host.requestLayout();
    this.commit();
  }

  private wholeProbe(): void {
    if (!this.canAct) return;
    this.target = R.ONE;
    this.presetId = null;
    this.resetLaying();
    this.host.emit({ type: 'whole_probe_engaged' });
    this.commit();
  }

  private toggleSamePieces(): void {
    if (!this.canAct) return;
    this.samePieces = !this.samePieces;
    this.host.emit({ type: 'same_pieces_toggled', on: this.samePieces, commonDenominator: this.commonDen });
    const ms = this.cfg.same_pieces_mode?.animate_ms ?? 600;
    const from = this.samePiecesPhase;
    const to = this.samePieces ? 1 : 0;
    this.host.animate(this.host.reducedMotion ? 0 : ms, (t) => {
      this.samePiecesPhase = from + (to - from) * t;
      this.host.requestDraw();
    }, () => {
      this.samePiecesPhase = to;
      this.commit();
    });
    this.commit();
  }

  private recordPrediction(p: Prediction): void {
    if (!this.canAct) return;
    this.prediction = p;
    this.predictionAttempts += 1;
    this.host.emit({ type: 'prediction_recorded', value: p, attempt: this.predictionAttempts });
    const after = this.cfg.size_predictor?.reveal_boundary_hint_after_n_attempts;
    if (this.hintNode !== null && after !== undefined && this.predictionAttempts >= after) {
      const boundary = this.cfg.size_predictor?.boundary_is ?? 'stick length compared with one whole';
      setText(this.hintNode, `What decides it: ${boundary}.`);
      this.hintNode.hidden = false;
    }
    if (this.activeGroup === 'predict') {
      this.activeGroup = 'lay';
      this.syncGroups();
    }
    this.commit();
  }

  private refuse(): void {
    this.refusalUntil = now() + 1600;
    this.host.animate(this.host.reducedMotion ? 0 : DETENT_MS, (t) => {
      this.edgeMark = t;
      this.host.requestDraw();
    });
  }

  private commit(): void {
    this.host.requestDraw();
    this.host.announce();
    this.refreshControls();
    this.rebuildLog();
  }

  // =========================================================================
  // Handles — the drag surface. Real DOM, so focus, roles and 48 px are free.
  // =========================================================================

  private buildHandles(): void {
    removeAll(this.host.handles);
    if (!this.canAct) {
      this.stickHandle = null;
      this.remHandle = null;
      return;
    }

    const sh = el('div', 'gt-fb__handle gt-fb__handle--stick');
    sh.tabIndex = 0;
    sh.setAttribute('role', 'button');
    sh.addEventListener('pointerdown', (e) => this.onPointerDown(e, 'stick'));
    sh.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.layStick();
      }
    });
    this.host.handles.appendChild(sh);
    this.stickHandle = sh;

    const rh = el('div', 'gt-fb__handle gt-fb__handle--remainder');
    rh.tabIndex = 0;
    rh.setAttribute('role', 'slider');
    rh.setAttribute('aria-orientation', 'horizontal');
    rh.addEventListener('pointerdown', (e) => this.onPointerDown(e, 'remainder'));
    rh.addEventListener('keydown', (e) => this.onRemainderKey(e));
    this.host.handles.appendChild(rh);
    this.remHandle = rh;
  }

  private onPointerDown(e: PointerEvent, kind: 'stick' | 'remainder'): void {
    if (!this.canAct) return;
    if (kind === 'stick' && this.layingBlocked) return;
    if (kind === 'remainder' && !this.leftoverActive) return;
    const node = e.currentTarget;
    if (!(node instanceof HTMLElement)) return;
    e.preventDefault();
    const p = this.pointerInCanvas(e);
    const rect = kind === 'stick' ? this.stickTrayRect() : this.leftoverRect();
    this.fly = null;
    this.drag = {
      kind,
      pointerId: e.pointerId,
      grabDX: p.x - rect.x,
      grabDY: p.y - rect.y,
      x: rect.x,
      y: rect.y,
      engaged: null,
      offsetUnits: this.remainder?.offsetUnits ?? 0,
      seats: false,
    };
    if (kind === 'remainder') {
      this.remainder = null;
      this.host.emit({ type: 'remainder_picked_up' });
    }
    node.setPointerCapture(e.pointerId);
    const move = (ev: PointerEvent): void => this.onPointerMove(ev);
    const up = (ev: PointerEvent): void => {
      node.removeEventListener('pointermove', move);
      node.removeEventListener('pointerup', up);
      node.removeEventListener('pointercancel', up);
      this.onPointerUp(ev);
    };
    node.addEventListener('pointermove', move);
    node.addEventListener('pointerup', up);
    node.addEventListener('pointercancel', up);
    this.host.requestDraw();
  }

  private onPointerMove(e: PointerEvent): void {
    const d = this.drag;
    if (d === null || d.pointerId !== e.pointerId) return;
    e.preventDefault();
    const p = this.pointerInCanvas(e);
    const g = this.geom();
    d.x = p.x - d.grabDX;
    d.y = p.y - d.grabDY;

    if (d.kind === 'stick') {
      const laneMid = g.laneY + g.stickH / 2;
      const inLane = Math.abs(d.y + g.stickH / 2 - laneMid) < g.stickH * 1.6;
      d.seats = inLane && (this.stickIsZero || this.copies < this.maxCopies);
      d.engaged = inLane ? 'stick' : null;
    } else {
      const pieceMid = d.y + this.pieceH() / 2;
      const bays: Array<[Bay, number]> = [['stick', this.bayY('stick') + g.stickH / 2]];
      if (g.showWholeBay) bays.push(['whole', this.bayY('whole') + g.stickH / 2]);
      let engaged: Bay | null = null;
      for (const [bay, mid] of bays) {
        if (Math.abs(pieceMid - mid) < g.stickH * 1.5) {
          engaged = bay;
          break;
        }
      }
      d.engaged = engaged;
      if (engaged !== null) {
        d.y = this.bayY(engaged) + (g.stickH - this.pieceH()) / 2;
        const unitPx = this.unitsToPx(1);
        const raw = (d.x - g.trackX) / Math.max(unitPx, 0.0001);
        let units = Math.round(raw);
        // DETENT on the flush position — the one placement with an exact answer.
        if (Math.abs(units * unitPx) <= DETENT_PX) units = 0;
        units = clamp(units, -this.pieceUnits, this.bayUnits(engaged));
        d.offsetUnits = units;
        d.x = g.trackX + this.unitsToPx(units);
        const cov = this.coverage(engaged, units);
        const t = now();
        if (t - this.lastMoveEmit > 60) {
          this.lastMoveEmit = t;
          this.host.emit({
            type: 'remainder_moved',
            against: engaged,
            coverageN: cov?.n ?? 0,
            coverageD: cov?.d ?? 1,
          });
        }
      }
    }
    this.host.requestDraw();
  }

  private onPointerUp(e: PointerEvent): void {
    const d = this.drag;
    if (d === null || d.pointerId !== e.pointerId) return;
    this.drag = null;
    if (d.kind === 'stick') {
      if (d.engaged !== null) {
        const seated = this.layStick();
        if (!seated) this.springBack('stick', d.x, d.y);
      } else {
        this.springBack('stick', d.x, d.y);
      }
      return;
    }
    if (d.engaged !== null) {
      this.remainder = { against: d.engaged, offsetUnits: d.offsetUnits, gridDen: this.gridDen };
      const cov = this.coverage(d.engaged, d.offsetUnits);
      this.host.emit({
        type: 'remainder_laid',
        against: d.engaged,
        coverageN: cov?.n ?? 0,
        coverageD: cov?.d ?? 1,
      });
      this.commit();
    } else {
      this.host.emit({ type: 'remainder_returned' });
      this.springBack('remainder', d.x, d.y);
    }
  }

  /** SETTLE: 180 ms, decelerate, no overshoot. Reduced motion lands it instantly. */
  private springBack(kind: 'stick' | 'remainder', x0: number, y0: number): void {
    const home = kind === 'stick' ? this.stickTrayRect() : this.leftoverHome();
    this.fly = { kind, x0, y0, x1: home.x, y1: home.y, t: 0 };
    this.host.animate(this.host.reducedMotion ? 0 : SETTLE_MS, (t) => {
      if (this.fly !== null) this.fly.t = t;
      this.host.requestDraw();
    }, () => {
      this.fly = null;
      this.commit();
    });
  }

  private onRemainderKey(e: KeyboardEvent): void {
    if (!this.leftoverActive) return;
    const bay: Bay = this.remainder?.against ?? (this.frame === 'in_wholes' && this.geom().showWholeBay ? 'whole' : 'stick');
    const max = this.bayUnits(bay);
    const current = this.remainder?.offsetUnits ?? -this.pieceUnits;
    let next: number | null = null;
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        next = current + 1;
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        next = current - 1;
        break;
      case 'Home':
      case 'Enter':
      case ' ':
        next = 0;
        break;
      case 'End':
        next = max;
        break;
      case 'Escape':
        if (this.remainder !== null) {
          this.returnLeftover();
          e.preventDefault();
        }
        return;
      default:
        return;
    }
    e.preventDefault();
    const units = clamp(next, -this.pieceUnits, max);
    this.remainder = { against: bay, offsetUnits: units, gridDen: this.gridDen };
    const cov = this.coverage(bay, units);
    this.host.emit({ type: 'remainder_laid', against: bay, coverageN: cov?.n ?? 0, coverageD: cov?.d ?? 1 });
    this.commit();
  }

  private pointerInCanvas(e: PointerEvent): { x: number; y: number } {
    const box = this.host.handles.getBoundingClientRect();
    return { x: e.clientX - box.left, y: e.clientY - box.top };
  }

  // =========================================================================
  // Chrome sync
  // =========================================================================

  private refreshControls(): void {
    const g = this.geom();
    this.presetChips.forEach((chip) => {
      chip.setAttribute('aria-pressed', String(chip.dataset.presetId === this.presetId));
      chip.disabled = !this.canAct;
    });
    this.groupNodes.forEach((node) => {
      node.querySelectorAll<HTMLButtonElement>('button[data-frame]').forEach((b) => {
        b.setAttribute('aria-pressed', String(b.dataset.frame === this.frame));
      });
      node.querySelectorAll<HTMLButtonElement>('button[data-prediction]').forEach((b) => {
        b.setAttribute('aria-pressed', String(b.dataset.prediction === this.prediction));
      });
      const toggle = node.querySelector<HTMLButtonElement>('button[data-role="same-pieces-toggle"]');
      if (toggle !== null) toggle.setAttribute('aria-pressed', String(this.samePieces));
      const note = node.querySelector<HTMLElement>('[data-role="frame-note"]');
      if (note !== null) note.hidden = this.frame !== 'both';
      const probe = node.querySelector<HTMLElement>('[data-role="probe-readout"]');
      if (probe !== null) {
        const show = R.eq(this.target, R.ONE) && this.measured;
        probe.hidden = !show;
        if (show) {
          const q = this.quotient();
          if (q !== null) {
            setText(probe, `${capitalise(this.countWords(q))} in one ${this.wholeWord}.`);
          }
        }
      }
      const sp = node.querySelector<HTMLElement>('[data-role="same-pieces-readout"]');
      if (sp !== null) {
        sp.hidden = !this.samePieces;
        if (this.samePieces) {
          const L = this.commonDen;
          const a = Math.round((this.target.n * L) / this.target.d);
          const b = Math.round((this.stick.n * L) / this.stick.d);
          setText(sp, `${countWord(a)} pieces measured in lots of ${countWord(b)} pieces.`);
        }
      }
      node.querySelectorAll<HTMLButtonElement>('button').forEach((b) => {
        if (b.dataset.presetId !== undefined) return;
        if (!this.canAct) b.disabled = true;
      });
    });
    this.syncHandles(g);
  }

  private syncHandles(g: Geom): void {
    if (this.stickHandle !== null) {
      const r = this.stickTrayRect();
      place(this.stickHandle, r.x, r.y, r.w, r.h);
      this.stickHandle.setAttribute(
        'aria-label',
        `${capitalise(this.stickWord)}, ${R.isZero(this.stick) ? 'no length' : this.lengthWords(this.stick)}. Activate to lay one along the ${this.ribbonWord}.`,
      );
      this.stickHandle.setAttribute('aria-disabled', String(this.layingBlocked));
      this.stickHandle.hidden = false;
    }
    if (this.remHandle !== null) {
      const active = this.leftoverActive;
      this.remHandle.hidden = !active;
      if (active) {
        const r = this.leftoverRect();
        place(this.remHandle, r.x, r.y, r.w, r.h);
        const bay: Bay = this.remainder?.against ?? 'stick';
        const max = this.bayUnits(bay);
        const off = this.remainder?.offsetUnits ?? -this.pieceUnits;
        const cov = this.coverage(bay, off);
        this.remHandle.setAttribute('aria-valuemin', '0');
        this.remHandle.setAttribute('aria-valuemax', String(max));
        this.remHandle.setAttribute('aria-valuenow', String(Math.max(0, Math.min(off + this.pieceUnits, max) - Math.max(off, 0))));
        this.remHandle.setAttribute(
          'aria-valuetext',
          cov === null || R.isZero(cov)
            ? `Leftover piece of ${this.ribbonWord}, not against the ${bay === 'stick' ? this.stickWord : this.wholeWord}.`
            : `Leftover piece covering ${fractionWords(cov.n, cov.d)} of the ${bay === 'stick' ? this.stickWord : this.wholeWord}.`,
        );
        this.remHandle.setAttribute(
          'aria-label',
          `Leftover piece of ${this.ribbonWord}. Drag it onto the ${this.stickWord}, or use the arrow keys.`,
        );
      }
    }
    void g;
  }

  private rebuildLog(): void {
    const log = this.host.log;
    removeAll(log);
    const items: string[] = [];
    for (let k = 1; k <= Math.min(this.copies, 40); k += 1) {
      items.push(
        this.stickIsZero
          ? `${capitalise(this.stickWord)} ${k} of ${this.copies}, no length.`
          : `${capitalise(this.stickWord)} ${k} of ${this.copies}, full length.`,
      );
    }
    if (this.copies > 40) items.push(`… and ${this.copies - 40} more.`);
    if (this.leftoverActive) {
      const cov = this.remainder === null ? null : this.coverage(this.remainder.against, this.remainder.offsetUnits);
      if (cov === null || R.isZero(cov)) {
        items.push(`Leftover ${this.ribbonWord}, still on the ${this.ribbonWord}.`);
      } else {
        const where = this.remainder?.against === 'whole' ? `one ${this.wholeWord}` : `the ${this.stickWord}`;
        items.push(`Leftover ${this.ribbonWord}, covering ${fractionWords(cov.n, cov.d)} of ${where}.`);
      }
    }
    items.forEach((text) => log.appendChild(el('li', 'gt-fb__log-item', text)));
    log.hidden = items.length === 0;
  }

  // =========================================================================
  // Painting
  // =========================================================================

  draw(): void {
    const { ctx, colours } = this.host;
    const g = this.geom();
    ctx.clearRect(0, 0, this.host.width, this.host.height);
    ctx.fillStyle = colours.paper;
    ctx.fillRect(0, 0, this.host.width, this.host.height);

    this.drawRulerBand(g);
    this.drawRibbon(g);
    this.drawLane(g);
    this.drawBay(g, 'stick');
    if (g.showWholeBay) this.drawBay(g, 'whole');
    this.drawCount(g);
    this.drawTray(g);
    this.drawFloating(g);
  }

  private drawRulerBand(g: Geom): void {
    const { ctx, colours } = this.host;
    label(ctx, this.ribbonWord, g.trackX, g.rulerY + RULER_H / 2, colours.ink700, uiFont(13, 500));
    if (this.cfg.unit?.show_whole_outline === false) return;
    const wholes = Math.ceil(g.viewWholes - 1e-9);
    for (let k = 1; k <= wholes; k += 1) {
      const x = g.trackX + k * g.pxPerWhole;
      if (x > g.trackX + g.trackW + 0.5) break;
      vline(ctx, x, g.rulerY + RULER_H - 6, g.ribbonY + g.ribbonH + 4, colours.axis, 2);
      label(
        ctx,
        k === 1 ? `1 ${this.wholeWord}` : String(k),
        x - 3,
        g.rulerY + RULER_H / 2,
        colours.ink500,
        uiFont(11, 500),
        'right',
      );
    }
  }

  private rulerDen(): number {
    const br = this.cfg.unit?.background_ruler;
    if (br?.show === false) return 0;
    const d = br?.denominator ?? 'from_target';
    if (typeof d === 'number') return clamp(Math.round(d), 1, 60);
    return this.samePieces ? this.commonDen : this.target.d;
  }

  private drawRibbon(g: Geom): void {
    const { ctx, colours } = this.host;
    const w = this.px(this.target);
    const covered = this.stickIsZero ? 0 : this.px(R.scale(this.stick, this.copies));
    const leftoverW = Math.max(0, w - covered);
    const hasLeftover = this.leftoverActive && this.remainder === null && this.drag === null && this.fly === null;

    // Ruling behind the ribbon — decorative, so `--rule`, never `--axis`.
    ruledLine(ctx, g.trackX, g.trackX + g.trackW, g.ribbonY + g.ribbonH + 2, colours.rule, 9);

    drawBar(ctx, g.trackX, g.ribbonY, w, g.ribbonH, {
      stroke: colours.qtyBlue,
      strokeWidth: 2,
      fill: colours.sheet,
      hatchColour: colours.qtyBlue,
      hatchAngle: 45,
      contactShadow: colours.sunk,
      shadowOffset: Math.min(3, this.host.bu * 0.15),
    }, this.dpr);

    // Ruler ticks read through the ribbon, so both readings coexist on one object.
    const den = this.rulerDen();
    if (den > 0) {
      const total = Math.ceil(g.viewWholes * den - 1e-9);
      for (let k = 1; k < total; k += 1) {
        if (k % den === 0) continue;
        const x = g.trackX + (k / den) * g.pxPerWhole;
        if (x > g.trackX + w + 0.5) continue;
        vline(ctx, x, g.ribbonY + 3, g.ribbonY + g.ribbonH - 3, colours.rule, 1);
      }
    }

    // Where each laid copy ends, marked on the ribbon itself.
    if (!this.stickIsZero) {
      for (let k = 1; k <= this.copies; k += 1) {
        const x = g.trackX + this.px(R.scale(this.stick, k));
        vline(ctx, x, g.ribbonY, g.ribbonY + g.ribbonH, colours.axis, 1, [3, 3]);
      }
    }

    // The uncovered tail. Before it is the final remainder it is just a well; once no further
    // copy can seat it becomes an object with its own grab tab.
    if (leftoverW > 0.5) {
      if (hasLeftover) {
        this.drawLeftoverPiece(g, g.trackX + covered, g.ribbonY + (g.ribbonH - this.pieceH()) / 2, leftoverW);
      } else if (!this.stickIsZero) {
        ctx.save();
        ctx.globalAlpha = 1;
        drawBar(ctx, g.trackX + covered, g.ribbonY + 4, leftoverW, g.ribbonH - 8, {
          stroke: colours.axis,
          strokeWidth: 1,
          fill: colours.sunk,
          dash: [4, 3],
        }, this.dpr);
        ctx.restore();
      }
    }

    // The far edge. `refuse_overhang` is expressed as a stroke-weight step, never a colour.
    const refusing = now() < this.refusalUntil;
    vline(ctx, g.trackX + w, g.ribbonY - 3, g.ribbonY + g.ribbonH + 3, colours.ink900, refusing ? 4 : 2 + this.edgeMark);
    if (refusing) {
      label(
        ctx,
        this.host.str(this.cfg.measuring_stick.on_refuse_message_id, 'does not seat'),
        Math.min(g.trackX + w + 6, g.trackX + g.trackW),
        g.ribbonY - 2,
        colours.ink700,
        uiFont(11, 500),
        'right',
        'bottom',
      );
    }
  }

  private drawLeftoverPiece(g: Geom, x: number, y: number, w: number): void {
    const { ctx, colours } = this.host;
    const h = this.pieceH();
    drawBar(ctx, x, y, w, h, {
      stroke: colours.qtyBlue,
      strokeWidth: 2,
      fill: colours.sheet,
      hatchColour: colours.qtyBlue,
      hatchAngle: 45,
      dash: [5, 3],
      contactShadow: colours.sunk,
      shadowOffset: 2,
    }, this.dpr);
    // The grab tab is the only geru inside the bench: "your hand goes here".
    const tabW = Math.min(Math.max(w * 0.34, 10), w);
    ctx.fillStyle = colours.live;
    ctx.fillRect(x + (w - tabW) / 2, y - 3, tabW, 3);
    ctx.fillRect(x + (w - tabW) / 2, y + h, tabW, 3);
  }

  private drawLane(g: Geom): void {
    const { ctx, colours } = this.host;
    const trackEnd = g.trackX + this.px(this.target);
    ctx.fillStyle = colours.sunk;
    ctx.fillRect(g.trackX, g.laneY, Math.max(0, trackEnd - g.trackX), g.stickH);

    if (this.stickIsZero) {
      const shown = Math.min(this.copies, 24);
      for (let k = 0; k < shown; k += 1) {
        vline(ctx, g.trackX + k * 3, g.laneY + 2, g.laneY + g.stickH - 2, colours.qtyGraphite, 1);
      }
      if (this.copies > 0) {
        label(
          ctx,
          `${countWord(this.copies)} laid, no length`,
          g.trackX + Math.min(shown, 24) * 3 + 8,
          g.laneY + g.stickH / 2,
          colours.ink700,
          uiFont(12, 500),
        );
      }
      return;
    }

    const stickW = this.px(this.stick);
    for (let k = 0; k < this.copies; k += 1) {
      const x = g.trackX + stickW * k;
      drawBar(ctx, x, g.laneY, stickW, g.stickH, {
        stroke: colours.qtyGraphite,
        strokeWidth: 2,
        fill: colours.sheet,
        hatchColour: colours.qtyGraphite,
        hatchAngle: 135,
        contactShadow: colours.sunk,
        shadowOffset: 2,
      }, this.dpr);
      if (stickW >= 16) {
        label(ctx, String(k + 1), x + stickW / 2, g.laneY + g.stickH / 2, colours.ink900, uiFont(12, 700), 'center');
      }
      if (this.samePiecesPhase > 0.4) {
        this.drawSubdivision(x, g.laneY, stickW, g.stickH, this.stick, clamp((this.samePiecesPhase - 0.4) / 0.4, 0, 1));
      }
    }
    if (this.samePiecesPhase > 0) {
      this.drawSubdivision(g.trackX, g.ribbonY, this.px(this.target), g.ribbonH, this.target, clamp(this.samePiecesPhase / 0.4, 0, 1));
    }

    // Ghost preview of where the next copy would seat, and whether it would.
    const d = this.drag;
    if (d !== null && d.kind === 'stick' && d.engaged !== null) {
      const x = g.trackX + stickW * this.copies;
      const fits = this.copies < this.maxCopies;
      ctx.save();
      ctx.globalAlpha = 0.55;
      drawBar(ctx, x, g.laneY, stickW, g.stickH, {
        stroke: fits ? colours.axis : colours.ink900,
        strokeWidth: fits ? 2 : 3,
        dash: [6, 4],
      }, this.dpr);
      ctx.restore();
    }
  }

  private drawSubdivision(x: number, y: number, w: number, h: number, len: Rat, alpha: number): void {
    if (alpha <= 0 || w <= 2) return;
    const { ctx, colours } = this.host;
    const L = this.commonDen;
    const pieces = Math.round((len.n * L) / len.d);
    if (pieces <= 1) return;
    ctx.save();
    ctx.globalAlpha = alpha;
    for (let i = 1; i < pieces; i += 1) {
      vline(ctx, x + (w * i) / pieces, y + 2, y + h - 2, colours.axis, 1);
    }
    ctx.restore();
  }

  private drawBay(g: Geom, bay: Bay): void {
    const { ctx, colours } = this.host;
    const y = this.bayY(bay);
    const labelY = (bay === 'stick' ? g.stickBayLabelY : g.wholeBayLabelY) + BAY_LABEL_H / 2;
    const isStick = bay === 'stick';
    const len = isStick ? this.stick : R.ONE;
    const w = this.px(len);

    label(
      ctx,
      isStick ? `lay the leftover on the ${this.stickWord}` : `…or on one ${this.wholeWord}`,
      g.trackX,
      labelY,
      colours.ink700,
      uiFont(12, 500),
    );

    if (isStick && this.stickIsZero) {
      vline(ctx, g.trackX, y, y + g.stickH, colours.qtyGraphite, 2);
      label(ctx, `The ${this.stickWord} has no length.`, g.trackX + 8, y + g.stickH / 2, colours.ink700, uiFont(12, 500));
      return;
    }

    drawBar(ctx, g.trackX, y, w, g.stickH, {
      stroke: isStick ? colours.qtyGraphite : colours.axis,
      strokeWidth: 2,
      fill: colours.sheet,
      hatchColour: isStick ? colours.qtyGraphite : undefined,
      hatchAngle: 135,
      contactShadow: colours.sunk,
      shadowOffset: 2,
    }, this.dpr);
    label(
      ctx,
      isStick ? this.stickWord : `one ${this.wholeWord}`,
      g.trackX + w - 5,
      y + g.stickH / 2,
      colours.ink500,
      uiFont(11, 500),
      'right',
    );

    // The committed placement of the leftover, drawn ON the bay object so coverage is an overlap.
    if (this.remainder !== null && this.remainder.against === bay && this.drag === null && this.fly === null) {
      const r = this.leftoverRect();
      this.drawLeftoverPiece(g, r.x, r.y, r.w);
      const cov = this.coverage(bay, this.remainder.offsetUnits);
      if (cov !== null) this.drawCoverageMark(g, bay, cov, r);
    }
  }

  private drawCoverageMark(
    g: Geom,
    bay: Bay,
    cov: Rat,
    r: { x: number; y: number; w: number; h: number },
  ): void {
    const { ctx, colours } = this.host;
    const y = this.bayY(bay);
    const edge = clamp(r.x + r.w, g.trackX, g.trackX + this.px(bay === 'stick' ? this.stick : R.ONE));
    vline(ctx, edge, y - 4, y + g.stickH + 4, colours.ink900, 2);
    const words = R.isZero(cov) ? 'none' : fractionWords(cov.n, cov.d);
    label(
      ctx,
      `${words} of the ${bay === 'stick' ? this.stickWord : this.wholeWord}`,
      Math.min(edge + 6, g.trackX + g.trackW),
      y + g.stickH + 9,
      colours.ink700,
      uiFont(12, 500),
      edge + 6 > g.trackX + g.trackW * 0.7 ? 'right' : 'left',
      'top',
    );
  }

  /** The count. Never a bare number — the unit word is structural. */
  private drawCount(g: Geom): void {
    const { ctx, colours } = this.host;
    const y = g.countY + READOUT_H / 2;
    ctx.fillStyle = colours.sheet;
    ctx.fillRect(g.trackX, g.countY, g.trackW, READOUT_H);
    vline(ctx, g.trackX, g.countY, g.countY + READOUT_H, colours.rule, 1);

    if (this.stickIsZero) {
      const laidWord = this.copies === 1 ? this.stickWord : this.sticksWord;
      label(ctx, `${capitalise(countWord(this.copies))} ${laidWord} laid.`, g.trackX + 8, y - 7, colours.ink900, uiFont(15, 700));
      label(ctx, this.host.str(this.cfg.edge_cases?.stick_zero?.readout_id, `The ${this.ribbonWord} is not covered.`), g.trackX + 8, y + 10, colours.ink700, uiFont(12, 500));
      return;
    }

    const live = this.liveCoverage();
    const showSticks = this.frame !== 'in_wholes';
    const showWholes = this.frame !== 'in_sticks';
    let x = g.trackX + 8;

    if (showSticks) {
      const cov = live !== null && live.bay === 'stick' ? live.value : null;
      if (this.exactCover) {
        const total = R.rat(this.copies, 1);
        x += drawMixedWithUnit(ctx, this.copies, 0, 1, this.unitTextFor(total), x, y, 22, colours.ink900);
      } else if (cov !== null && !R.isZero(cov)) {
        const total = R.add(R.rat(this.copies, 1), cov);
        const m = R.mixed(total);
        x += drawMixedWithUnit(ctx, m.whole, m.n, m.d, this.unitTextFor(total), x, y, 22, colours.ink900);
      } else {
        x += drawMixedWithUnit(ctx, this.copies, 0, 1, this.unitTextFor(R.rat(this.copies, 1)), x, y, 22, colours.ink900);
        const rem = this.remainderLen;
        if (!R.isZero(rem)) {
          label(ctx, `+ leftover`, x + 4, y, colours.ink500, uiFont(12, 500));
          x += 62;
        }
      }
    }

    if (showWholes) {
      if (showSticks) {
        label(ctx, '·', x + 4, y, colours.ink500, uiFont(14, 500));
        x += 14;
      }
      const rem = this.remainderLen;
      if (this.exactCover || R.isZero(rem)) {
        x += drawMixedWithUnit(ctx, this.copies, 0, 1, this.unitTextFor(R.rat(this.copies, 1)), x, y, 18, colours.ink700);
      } else {
        x += drawMixedWithUnit(ctx, this.copies, 0, 1, `${this.unitTextFor(R.rat(this.copies, 1))} and`, x, y, 18, colours.ink700);
        const m = R.mixed(rem);
        x += drawMixedWithUnit(ctx, m.whole, m.n, m.d, `of a ${this.wholeWord}`, x, y, 18, colours.ink700);
      }
    }

    if (this.layingBlocked) {
      label(ctx, 'no prediction recorded yet', g.trackX + g.trackW - 6, y, colours.ink500, uiFont(11, 500), 'right');
    }
  }

  private drawTray(g: Geom): void {
    const { ctx, colours } = this.host;
    label(ctx, this.stickWord, g.trackX, g.trayLabelY + BAY_LABEL_H / 2, colours.ink700, uiFont(12, 500));
    if (this.drag !== null && this.drag.kind === 'stick') {
      const r = this.stickTrayRect();
      drawBar(ctx, r.x, r.y, r.w, r.h, { stroke: colours.rule, strokeWidth: 1, dash: [4, 4] }, this.dpr);
      return;
    }
    if (this.fly !== null && this.fly.kind === 'stick') return;
    this.drawStickObject(this.stickTrayRect());
  }

  private drawStickObject(r: { x: number; y: number; w: number; h: number }): void {
    const { ctx, colours } = this.host;
    if (this.stickIsZero) {
      vline(ctx, r.x, r.y, r.y + r.h, colours.qtyGraphite, 2);
      label(ctx, 'no length', r.x + 8, r.y + r.h / 2, colours.ink500, uiFont(11, 500));
      return;
    }
    drawBar(ctx, r.x, r.y, r.w, r.h, {
      stroke: colours.qtyGraphite,
      strokeWidth: 2,
      fill: colours.sheet,
      hatchColour: colours.qtyGraphite,
      hatchAngle: 135,
      contactShadow: colours.sunk,
      shadowOffset: 2,
    }, this.dpr);
    const grip = Math.min(22, r.w * 0.5);
    ctx.fillStyle = colours.live;
    ctx.fillRect(r.x + (r.w - grip) / 2, r.y - 3, grip, 3);
    ctx.fillRect(r.x + (r.w - grip) / 2, r.y + r.h, grip, 3);
    if (!this.samePieces) {
      const m = R.mixed(this.stick);
      const ctxAny = ctx;
      ctxAny.save();
      if (r.w > 40) {
        if (m.n !== 0) drawStackedFraction(ctxAny, m.n === 0 ? m.whole : m.n, m.d, r.x + 6, r.y + r.h / 2, 18, colours.ink900, 500);
      }
      ctxAny.restore();
    }
  }

  private drawFloating(g: Geom): void {
    const d = this.drag;
    if (d !== null && d.kind === 'stick') {
      this.drawStickObject({ x: d.x, y: d.y, w: Math.max(2, this.px(this.stick)), h: g.stickH });
      return;
    }
    if (d !== null && d.kind === 'remainder') {
      const r = this.leftoverRect();
      this.drawLeftoverPiece(g, r.x, r.y, r.w);
      if (d.engaged !== null) {
        const cov = this.coverage(d.engaged, d.offsetUnits);
        if (cov !== null) this.drawCoverageMark(g, d.engaged, cov, r);
      }
      return;
    }
    const f = this.fly;
    if (f === null) return;
    const t = f.t;
    const x = f.x0 + (f.x1 - f.x0) * t;
    const y = f.y0 + (f.y1 - f.y0) * t;
    if (f.kind === 'stick') this.drawStickObject({ x, y, w: Math.max(2, this.px(this.stick)), h: g.stickH });
    else this.drawLeftoverPiece(g, x, y, this.px(this.remainderLen));
  }

  private get dpr(): number {
    return typeof window === 'undefined' ? 1 : window.devicePixelRatio || 1;
  }

  // =========================================================================
  // Accessibility — STATE, never the remedy (kit §4.2 corollary, fraction-bar.md §6)
  // =========================================================================

  /**
   * Nothing this method returns may name what to do about a state, say why something does not
   * fit, or call any reading right or wrong. An earlier draft of this spec leaked the answer to
   * screen-reader users; the rule exists because of that.
   */
  describeState(v: Verbosity = 'full'): string {
    const s: string[] = [];
    s.push(`The ${this.ribbonWord} is ${this.lengthWords(this.target)}.`);
    s.push(
      this.stickIsZero
        ? `The ${this.stickWord} has no length.`
        : `The ${this.stickWord} is ${this.lengthWords(this.stick)}.`,
    );

    if (!this.stickIsZero) {
      if (this.copies === 0) {
        s.push(`No ${this.sticksWord} are laid.`);
      } else {
        const unit = this.copies === 1 ? this.stickWord : this.sticksWord;
        s.push(`${capitalise(countWord(this.copies))} ${unit} ${this.copies === 1 ? 'is' : 'are'} laid along the ${this.ribbonWord}.`);
      }
    }

    if (v === 'full') {
      if (now() < this.refusalUntil) {
        s.push(this.host.str(this.cfg.measuring_stick.on_refuse_message_id, `That ${this.stickWord} reaches past the end of the ${this.ribbonWord}. It does not seat.`));
      }
      if (this.stickIsZero) {
        // the count sentence carries this state; saying it twice floods the live region
      } else if (this.exactCover) {
        s.push(`The ${this.sticksWord} cover the ${this.ribbonWord} exactly, with nothing left over.`);
      } else if (this.leftoverActive) {
        const cov = this.remainder === null ? null : this.coverage(this.remainder.against, this.remainder.offsetUnits);
        if (cov === null || R.isZero(cov)) {
          s.push(`A piece of ${this.ribbonWord} is left over.`);
        } else {
          const where = this.remainder?.against === 'whole' ? `one ${this.wholeWord}` : `the ${this.stickWord}`;
          s.push(`The leftover piece is lying on ${where}, covering ${fractionWords(cov.n, cov.d)} of it.`);
        }
      }
      if (this.samePieces) {
        const L = this.commonDen;
        const a = Math.round((this.target.n * L) / this.target.d);
        const b = Math.round((this.stick.n * L) / this.stick.d);
        s.push(`Both are cut into ${pieceNameWords(L)}: the ${this.ribbonWord} is ${countWord(a)} pieces and the ${this.stickWord} is ${countWord(b)} pieces.`);
      }
      if (this.layingBlocked) s.push('No prediction is recorded yet.');
    }

    s.push(this.countSentence());
    return s.filter((x) => x !== '').join(' ');
  }

  /** The count, in whichever frame or frames are active. Both are stated as true. */
  private countSentence(): string {
    if (this.stickIsZero) {
      const laid = this.copies === 1 ? this.stickWord : this.sticksWord;
      return `${capitalise(countWord(this.copies))} ${laid} laid, and the ${this.ribbonWord} is not covered.`;
    }
    const rem = this.remainderLen;
    const sticksLine = (): string => {
      const q = this.measured ? this.quotient() : null;
      if (q !== null) return `Measured in ${this.sticksWord}: ${this.countWords(q)}.`;
      if (this.copies === 0) return '';
      return `Count so far: ${this.countWords(R.rat(this.copies, 1))}, and a piece left over.`;
    };
    const wholesLine = (): string => {
      const laid = this.copies === 0 ? `no ${this.sticksWord}` : this.countWords(R.rat(this.copies, 1));
      if (R.isZero(rem)) return `Measured in ${this.wholeWord}s: ${laid}, nothing left over.`;
      return `Measured in ${this.wholeWord}s: ${laid} and ${this.lengthWords(rem)} left over.`;
    };
    if (this.frame === 'in_sticks') return sticksLine();
    if (this.frame === 'in_wholes') return wholesLine();
    return [
      sticksLine(),
      wholesLine(),
      this.host.str(this.cfg.remainder?.frame_toggle?.explainer_id, 'Both are true; the question asked for sticks.'),
    ]
      .filter((x) => x !== '')
      .join(' ');
  }

  /** "three quarters of a whole", "one whole", "three wholes", "one and one half wholes". */
  private lengthWords(r: Rat): string {
    const m = R.mixed(r);
    if (r.d === 1) return `${countWord(r.n)} ${r.n === 1 ? this.wholeWord : `${this.wholeWord}s`}`;
    if (m.whole === 0) return `${fractionWords(m.n, m.d)} of a ${this.wholeWord}`;
    return `${mixedWords(m.whole, m.n, m.d)} ${this.wholeWord}s`;
  }

  /** "one stick", "six sticks", "one half of a stick", "one and one half sticks". */
  private countWords(r: Rat): string {
    const m = R.mixed(r);
    if (r.d === 1) return `${countWord(r.n)} ${r.n === 1 ? this.stickWord : this.sticksWord}`;
    if (m.whole === 0) return `${fractionWords(m.n, m.d)} of a ${this.stickWord}`;
    return `${mixedWords(m.whole, m.n, m.d)} ${this.sticksWord}`;
  }

  /** The unit word a painted mixed number carries. Never absent (counter.show_unit_word_always). */
  private unitTextFor(r: Rat): string {
    const m = R.mixed(r);
    if (r.d === 1 && r.n === 1) return this.stickWord;
    if (m.whole === 0 && m.n !== 0) return `of a ${this.stickWord}`;
    return this.sticksWord;
  }

  private quotient(): Rat | null {
    if (this.stickIsZero) return null;
    return R.div(this.target, this.stick);
  }

  // =========================================================================
  // Snapshot / restore — the same path serves resume and golden fixtures (kit §2)
  // =========================================================================

  snapshot(): MeasureSnapshot {
    return {
      mode: 'measure',
      presetId: this.presetId,
      target: { numerator: this.target.n, denominator: this.target.d },
      stick: { numerator: this.stick.n, denominator: this.stick.d },
      copies: this.copies,
      remainder:
        this.remainder === null
          ? null
          : {
              against: this.remainder.against,
              offsetUnits: this.remainder.offsetUnits,
              gridDenominator: this.remainder.gridDen,
            },
      frame: this.frame,
      samePieces: this.samePieces,
      prediction: this.prediction,
      predictionAttempts: this.predictionAttempts,
    };
  }

  restore(s: FractionBarSnapshot): void {
    if (s.mode !== 'measure') return;
    this.presetId = s.presetId;
    this.target = R.fromSpec(s.target);
    this.stick = R.fromSpec(s.stick);
    this.copies = clamp(Math.round(s.copies), 0, COUNT_CEILING);
    this.frame = s.frame;
    this.samePieces = s.samePieces;
    this.samePiecesPhase = s.samePieces ? 1 : 0;
    this.prediction = s.prediction;
    this.predictionAttempts = s.predictionAttempts;
    this.drag = null;
    this.fly = null;
    this.remainder = null;
    const r = s.remainder;
    if (r !== null && this.leftoverActive) {
      const bay: Bay = r.against;
      this.remainder = {
        against: bay,
        offsetUnits: clamp(Math.round(r.offsetUnits), -this.pieceUnits, this.bayUnits(bay)),
        gridDen: this.gridDen,
      };
    }
    this.invalidateGeom();
    this.commit();
  }

  destroy(): void {
    this.drag = null;
    this.fly = null;
    this.groupNodes.clear();
    this.chipNodes.clear();
    this.presetChips = [];
  }
}

function place(node: HTMLElement, x: number, y: number, w: number, h: number): void {
  const width = Math.max(w, MIN_TOUCH);
  const height = Math.max(h, MIN_TOUCH);
  node.style.left = `${x - (width - w) / 2}px`;
  node.style.top = `${y - (height - h) / 2}px`;
  node.style.width = `${width}px`;
  node.style.height = `${height}px`;
}

function humanise(id: string): string {
  return id.replace(/-/g, ' ');
}

function now(): number {
  return typeof performance === 'undefined' ? Date.now() : performance.now();
}
