/**
 * FractionBar `partition` mode (fraction-bar.md §2.1, §3.1).
 *
 * Teaching job: a fraction names a piece SIZE, and a piece only means anything when all the
 * pieces in the whole are equal — and a fraction is meaningless without its whole, which is why
 * two bars with different `whole_length` sit side by side.
 *
 * Carries the first of the kit's named guided-discovery exceptions (kit §4.2): `unequal_cuts`
 * suspends snapping ON PURPOSE, opt-in and always reversible via the snap-back control, so the
 * learner can watch "any piece will do" fail in front of them.
 */

import { clamp, drawBar, label, uiFont, vline } from './draw';
import { button, el, group, removeAll, row, setText } from './dom';
import { capitalise, countWord, fractionWords } from './strings';
import type {
  FractionBarSnapshot,
  ModeController,
  PartitionConfig,
  PartitionSnapshot,
  Verbosity,
  WidgetHost,
} from './types';

const PAD_X = 14;
const PAD_TOP = 10;
const ROW_GAP = 18;
const LABEL_H = 17;
const READOUT_H = 22;
const MIN_TOUCH = 48;

interface BarState {
  id: string;
  label: string;
  wholeLength: number;
  partitions: number;
  shaded: boolean[];
  /** null = equal cuts (snapped). Non-null = the guided-discovery exception is in play. */
  cuts: number[] | null;
}

export class PartitionMode implements ModeController {
  private readonly host: WidgetHost;
  private readonly cfg: PartitionConfig;
  private readonly bars: BarState[];
  private unequal = false;
  private segmentHandles: HTMLElement[] = [];
  private cutHandles: HTMLElement[] = [];
  private drag: { bar: number; cut: number; pointerId: number } | null = null;

  constructor(host: WidgetHost, cfg: PartitionConfig) {
    this.host = host;
    this.cfg = cfg;
    this.bars = cfg.bars.map((b) => ({
      id: b.id,
      label: host.str(b.label_id, b.label ?? b.id),
      wholeLength: clamp(b.whole_length, 0.1, 1),
      partitions: Math.max(0, Math.round(b.partitions)),
      shaded: Array.from({ length: Math.max(0, Math.round(b.partitions)) }, (_, i) => i < b.shaded),
      cuts: null,
    }));
  }

  private get barH(): number {
    return clamp(1.5 * this.host.bu, 30, 46);
  }

  private get rowH(): number {
    return LABEL_H + this.barH + READOUT_H + ROW_GAP;
  }

  private trackX(): number {
    return PAD_X;
  }

  private trackW(): number {
    return Math.max(60, this.host.width - PAD_X * 2);
  }

  private barTop(i: number): number {
    return PAD_TOP + i * this.rowH + LABEL_H;
  }

  measureHeight(): number {
    return PAD_TOP + this.bars.length * this.rowH + 6;
  }

  /** Cut positions in 0..1 along the bar, equal unless the exception is in play. */
  private cutsOf(b: BarState): number[] {
    if (b.cuts !== null) return b.cuts;
    const out: number[] = [];
    for (let i = 1; i < b.partitions; i += 1) out.push(i / b.partitions);
    return out;
  }

  private segmentBounds(b: BarState, index: number): { a: number; z: number } {
    const cuts = this.cutsOf(b);
    const a = index === 0 ? 0 : (cuts[index - 1] ?? index / Math.max(1, b.partitions));
    const z = index === b.partitions - 1 ? 1 : (cuts[index] ?? (index + 1) / Math.max(1, b.partitions));
    return { a, z };
  }

  private shadedCount(b: BarState): number {
    return b.shaded.reduce((n, on) => (on ? n + 1 : n), 0);
  }

  // -------------------------------------------------------------------------
  // Controls
  // -------------------------------------------------------------------------

  buildControls(): void {
    removeAll(this.host.controls);
    const g = group('partition', 'Pieces');
    this.bars.forEach((b, i) => {
      const r = row('gt-fb__row--stepper');
      r.appendChild(el('span', 'gt-fb__stepper-name', b.label));
      const ctl = this.cfg.bars[i]?.partitions_control;
      const min = ctl?.min ?? (this.cfg.edge_cases?.allow_zero_partitions === true ? 0 : 1);
      const max = ctl?.max ?? 12;
      const step = ctl?.step ?? 1;
      r.appendChild(button('−', () => this.setPartitions(i, b.partitions - step, min, max), {
        className: 'gt-fb__btn--step',
        ariaLabel: `${b.label}: one fewer piece`,
      }));
      const value = el('span', 'gt-fb__stepper-value');
      value.dataset.bar = b.id;
      r.appendChild(value);
      r.appendChild(button('+', () => this.setPartitions(i, b.partitions + step, min, max), {
        className: 'gt-fb__btn--step',
        ariaLabel: `${b.label}: one more piece`,
      }));
      g.appendChild(r);
    });

    if (this.cfg.unequal_cuts?.enabled === true) {
      const r = row();
      const t = button(this.host.str(this.cfg.unequal_cuts.label_id, this.cfg.unequal_cuts.label ?? 'drag the cut lines'), () => {
        this.unequal = !this.unequal;
        this.rebuildHandles();
        this.commit();
      }, { className: 'gt-fb__chip', pressed: this.unequal });
      t.dataset.role = 'unequal-toggle';
      r.appendChild(t);
      r.appendChild(button(this.cfg.unequal_cuts.snap_back_button ?? 'make them equal again', () => {
        this.bars.forEach((b) => {
          b.cuts = null;
          this.host.emit({ type: 'cuts_reset', barId: b.id });
        });
        this.rebuildHandles();
        this.commit();
      }));
      g.appendChild(r);
    }
    this.host.controls.appendChild(g);
    this.rebuildHandles();
    this.refresh();
  }

  relayout(): void {
    this.syncHandles();
  }

  private setPartitions(i: number, next: number, min: number, max: number): void {
    const b = this.bars[i];
    if (b === undefined || this.host.interactionLevel === 'readOnly') return;
    const n = clamp(Math.round(next), min, max);
    if (n === b.partitions) return;
    const prev = b.shaded;
    b.partitions = n;
    b.cuts = null;
    b.shaded = Array.from({ length: n }, (_, k) => prev[k] ?? false);
    this.host.emit({ type: 'partitions_changed', barId: b.id, partitions: n });
    this.rebuildHandles();
    this.commit();
  }

  private toggleSegment(barIndex: number, segIndex: number): void {
    const b = this.bars[barIndex];
    if (b === undefined || this.host.interactionLevel === 'readOnly') return;
    const was = b.shaded[segIndex] ?? false;
    b.shaded[segIndex] = !was;
    this.host.emit({ type: 'segment_toggled', barId: b.id, index: segIndex, shadedAfter: this.shadedCount(b) });
    this.commit();
  }

  private rebuildHandles(): void {
    removeAll(this.host.handles);
    this.segmentHandles = [];
    this.cutHandles = [];
    if (this.host.interactionLevel === 'readOnly') return;

    this.bars.forEach((b, i) => {
      for (let s = 0; s < b.partitions; s += 1) {
        const h = el('div', 'gt-fb__handle gt-fb__handle--segment');
        h.tabIndex = 0;
        h.setAttribute('role', 'checkbox');
        h.addEventListener('click', () => this.toggleSegment(i, s));
        h.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.toggleSegment(i, s);
          }
        });
        this.host.handles.appendChild(h);
        this.segmentHandles.push(h);
      }
      if (this.unequal) {
        for (let c = 0; c < Math.max(0, b.partitions - 1); c += 1) {
          const h = el('div', 'gt-fb__handle gt-fb__handle--cut');
          h.tabIndex = 0;
          h.setAttribute('role', 'slider');
          h.addEventListener('pointerdown', (e) => this.onCutDown(e, i, c));
          this.host.handles.appendChild(h);
          this.cutHandles.push(h);
        }
      }
    });
  }

  private onCutDown(e: PointerEvent, barIndex: number, cutIndex: number): void {
    const node = e.currentTarget;
    if (!(node instanceof HTMLElement)) return;
    e.preventDefault();
    this.drag = { bar: barIndex, cut: cutIndex, pointerId: e.pointerId };
    node.setPointerCapture(e.pointerId);
    const move = (ev: PointerEvent): void => this.onCutMove(ev);
    const up = (): void => {
      node.removeEventListener('pointermove', move);
      node.removeEventListener('pointerup', up);
      this.drag = null;
      this.commit();
    };
    node.addEventListener('pointermove', move);
    node.addEventListener('pointerup', up);
  }

  /** live-morph: no snap while dragging here — feeling the pieces go unequal IS the point. */
  private onCutMove(e: PointerEvent): void {
    const d = this.drag;
    if (d === null || d.pointerId !== e.pointerId) return;
    const b = this.bars[d.bar];
    if (b === undefined) return;
    const box = this.host.handles.getBoundingClientRect();
    const barW = this.trackW() * b.wholeLength;
    const t = clamp((e.clientX - box.left - this.trackX()) / Math.max(barW, 1), 0.02, 0.98);
    const cuts = [...this.cutsOf(b)];
    const lo = d.cut === 0 ? 0.02 : (cuts[d.cut - 1] ?? 0) + 0.02;
    const hi = d.cut === cuts.length - 1 ? 0.98 : (cuts[d.cut + 1] ?? 1) - 0.02;
    const placed = clamp(t, lo, hi);
    cuts[d.cut] = placed;
    b.cuts = cuts;
    this.host.emit({ type: 'cut_dragged', barId: b.id, index: d.cut, positionPermille: Math.round(placed * 1000) });
    this.host.requestDraw();
    this.syncHandles();
  }

  private commit(): void {
    this.host.requestDraw();
    this.host.announce();
    this.refresh();
  }

  private refresh(): void {
    this.bars.forEach((b) => {
      const node = this.host.controls.querySelector<HTMLElement>(`[data-bar="${b.id}"]`);
      if (node !== null) setText(node, String(b.partitions));
    });
    const toggle = this.host.controls.querySelector<HTMLButtonElement>('button[data-role="unequal-toggle"]');
    if (toggle !== null) toggle.setAttribute('aria-pressed', String(this.unequal));
    this.syncHandles();
    this.rebuildLog();
  }

  private syncHandles(): void {
    let si = 0;
    let ci = 0;
    this.bars.forEach((b, i) => {
      const barW = this.trackW() * b.wholeLength;
      const top = this.barTop(i);
      for (let s = 0; s < b.partitions; s += 1) {
        const node = this.segmentHandles[si];
        si += 1;
        if (node === undefined) continue;
        const { a, z } = this.segmentBounds(b, s);
        const x = this.trackX() + a * barW;
        const w = (z - a) * barW;
        // Past the 44 pt floor the hit region is padded rather than shrunk (spec §4).
        const width = Math.max(w, MIN_TOUCH);
        node.style.left = `${x - (width - w) / 2}px`;
        node.style.top = `${top}px`;
        node.style.width = `${width}px`;
        node.style.height = `${Math.max(this.barH, MIN_TOUCH)}px`;
        node.setAttribute('aria-checked', String(b.shaded[s] ?? false));
        node.setAttribute('aria-label', `${b.label}, piece ${s + 1} of ${b.partitions}`);
      }
      if (this.unequal) {
        const cuts = this.cutsOf(b);
        for (let c = 0; c < cuts.length; c += 1) {
          const node = this.cutHandles[ci];
          ci += 1;
          if (node === undefined) continue;
          const x = this.trackX() + (cuts[c] ?? 0) * barW;
          node.style.left = `${x - MIN_TOUCH / 2}px`;
          node.style.top = `${top - 4}px`;
          node.style.width = `${MIN_TOUCH}px`;
          node.style.height = `${this.barH + 8}px`;
          node.setAttribute('aria-label', `${b.label}, cut line ${c + 1}`);
          node.setAttribute('aria-valuetext', `${Math.round((cuts[c] ?? 0) * 100)} per cent along`);
        }
      }
    });
  }

  private rebuildLog(): void {
    removeAll(this.host.log);
    this.bars.forEach((b) => {
      this.host.log.appendChild(el('li', 'gt-fb__log-item', this.barSentence(b)));
    });
    this.host.log.hidden = false;
  }

  private barSentence(b: BarState): string {
    if (b.partitions === 0) return `${capitalise(b.label)}: cut into no pieces at all.`;
    const shaded = this.shadedCount(b);
    const equal = b.cuts === null;
    const size = equal
      ? `each piece is ${fractionWords(1, b.partitions)} of this bar`
      : 'the pieces are not all the same size';
    return `${capitalise(b.label)}: ${countWord(b.partitions)} pieces, ${countWord(shaded)} shaded; ${size}.`;
  }

  // -------------------------------------------------------------------------
  // Paint
  // -------------------------------------------------------------------------

  draw(): void {
    const { ctx, colours } = this.host;
    ctx.clearRect(0, 0, this.host.width, this.host.height);
    ctx.fillStyle = colours.paper;
    ctx.fillRect(0, 0, this.host.width, this.host.height);

    this.bars.forEach((b, i) => {
      const barW = this.trackW() * b.wholeLength;
      const x0 = this.trackX();
      const top = this.barTop(i);
      label(ctx, b.label, x0, top - LABEL_H / 2, colours.ink700, uiFont(12, 500));

      // The whole outline is always visible — a fraction is meaningless without its whole.
      drawBar(ctx, x0, top, barW, this.barH, {
        stroke: colours.axis,
        strokeWidth: 2,
        fill: colours.sheet,
        contactShadow: colours.sunk,
        shadowOffset: 2,
      }, this.dpr);

      for (let s = 0; s < b.partitions; s += 1) {
        const { a, z } = this.segmentBounds(b, s);
        if (b.shaded[s] === true) {
          drawBar(ctx, x0 + a * barW, top, (z - a) * barW, this.barH, {
            stroke: colours.qtyBlue,
            strokeWidth: 2,
            fill: colours.sheet,
            hatchColour: colours.qtyBlue,
            hatchAngle: 45,
          }, this.dpr);
        }
      }
      this.cutsOf(b).forEach((c) => {
        vline(ctx, x0 + c * barW, top, top + this.barH, colours.axis, this.unequal ? 3 : 1);
        if (this.unequal) {
          ctx.fillStyle = colours.live;
          ctx.fillRect(x0 + c * barW - 5, top - 3, 10, 3);
        }
      });
      if (b.partitions === 0) {
        label(ctx, 'no pieces', x0 + 8, top + this.barH / 2, colours.ink500, uiFont(12, 500));
      }
      label(ctx, this.barSentence(b), x0, top + this.barH + READOUT_H / 2 + 2, colours.ink700, uiFont(12, 500));
    });
  }

  private get dpr(): number {
    return typeof window === 'undefined' ? 1 : window.devicePixelRatio || 1;
  }

  describeState(v: Verbosity = 'full'): string {
    const parts = this.bars.map((b) => this.barSentence(b));
    if (v === 'full' && this.unequal) {
      parts.push('The cut lines can be dragged; the pieces are not being snapped to equal sizes.');
    }
    return parts.join(' ');
  }

  snapshot(): PartitionSnapshot {
    return {
      mode: 'partition',
      bars: this.bars.map((b) => ({
        id: b.id,
        partitions: b.partitions,
        shaded: [...b.shaded],
        cuts: b.cuts === null ? null : [...b.cuts],
      })),
    };
  }

  restore(s: FractionBarSnapshot): void {
    if (s.mode !== 'partition') return;
    s.bars.forEach((saved) => {
      const b = this.bars.find((x) => x.id === saved.id);
      if (b === undefined) return;
      b.partitions = Math.max(0, Math.round(saved.partitions));
      b.shaded = Array.from({ length: b.partitions }, (_, i) => saved.shaded[i] ?? false);
      b.cuts = saved.cuts === null ? null : [...saved.cuts];
    });
    this.rebuildHandles();
    this.commit();
  }

  destroy(): void {
    this.segmentHandles = [];
    this.cutHandles = [];
    this.drag = null;
  }
}
