/**
 * `equivalence` and `combine` — NOT YET INTERACTIVE.
 *
 * These render the authored bars faithfully and read out their state, and they do nothing else.
 * They are deliberately honest stubs rather than half-working interactions: both modes carry a
 * load-bearing refusal (the locked shaded edge; the mismatched pour that will not seat), and a
 * half-built version of either would teach the wrong thing convincingly — which is precisely the
 * silent content bug 00-kit-overview.md §9 exists to prevent.
 *
 * The notice is rendered in the DOM, not only on the canvas, so it reaches a screen reader too.
 */

import { drawBar, label, uiFont, vline } from './draw';
import { el, removeAll } from './dom';
import { capitalise, countWord, fractionWords } from './strings';
import type {
  CombineConfig,
  EquivalenceConfig,
  FractionBarSnapshot,
  ModeController,
  StubSnapshot,
  Verbosity,
  WidgetHost,
} from './types';

const PAD_X = 14;
const PAD_TOP = 10;
const LABEL_H = 17;
const ROW_GAP = 16;

interface StubBar {
  id: string;
  label: string;
  wholeLength: number;
  partitions: number;
  shaded: number;
}

export class StubMode implements ModeController {
  private readonly host: WidgetHost;
  private readonly mode: 'equivalence' | 'combine';
  private readonly bars: StubBar[];

  constructor(host: WidgetHost, cfg: EquivalenceConfig | CombineConfig) {
    this.host = host;
    this.mode = cfg.mode;
    this.bars = cfg.bars.map((b) => ({
      id: b.id,
      label: host.str(b.label_id, b.label ?? b.id),
      wholeLength: b.whole_length,
      partitions: Math.max(1, Math.round(b.partitions ?? 1)),
      shaded: Math.max(0, Math.round(b.shaded ?? 0)),
    }));
  }

  private get barH(): number {
    return Math.max(28, Math.min(1.4 * this.host.bu, 42));
  }

  private get rowH(): number {
    return LABEL_H + this.barH + ROW_GAP;
  }

  measureHeight(): number {
    return PAD_TOP + this.bars.length * this.rowH + 8;
  }

  buildControls(): void {
    removeAll(this.host.controls);
    removeAll(this.host.handles);
    const note = el(
      'p',
      'gt-fb__note gt-fb__note--stub',
      `${capitalise(this.mode)} mode renders its bars but is not yet interactive in this build.`,
    );
    this.host.controls.appendChild(note);
    removeAll(this.host.log);
    this.bars.forEach((b) => {
      this.host.log.appendChild(el('li', 'gt-fb__log-item', this.barSentence(b)));
    });
    this.host.log.hidden = false;
  }

  relayout(): void {
    // Nothing positioned: the stub has no handles.
  }

  private barSentence(b: StubBar): string {
    return `${capitalise(b.label)}: ${countWord(b.partitions)} equal pieces, ${countWord(b.shaded)} shaded — ${fractionWords(b.shaded, b.partitions)} of this bar.`;
  }

  draw(): void {
    const { ctx, colours } = this.host;
    ctx.clearRect(0, 0, this.host.width, this.host.height);
    ctx.fillStyle = colours.paper;
    ctx.fillRect(0, 0, this.host.width, this.host.height);
    const trackW = Math.max(60, this.host.width - PAD_X * 2);
    const dpr = typeof window === 'undefined' ? 1 : window.devicePixelRatio || 1;

    this.bars.forEach((b, i) => {
      const w = trackW * b.wholeLength;
      const top = PAD_TOP + i * this.rowH + LABEL_H;
      label(ctx, b.label, PAD_X, top - LABEL_H / 2, colours.ink700, uiFont(12, 500));
      drawBar(ctx, PAD_X, top, w, this.barH, {
        stroke: colours.axis,
        strokeWidth: 2,
        fill: colours.sheet,
        contactShadow: colours.sunk,
        shadowOffset: 2,
      }, dpr);
      const seg = w / b.partitions;
      for (let s = 0; s < b.shaded && s < b.partitions; s += 1) {
        drawBar(ctx, PAD_X + s * seg, top, seg, this.barH, {
          stroke: colours.qtyBlue,
          strokeWidth: 2,
          fill: colours.sheet,
          hatchColour: colours.qtyBlue,
          hatchAngle: 45,
        }, dpr);
      }
      for (let s = 1; s < b.partitions; s += 1) {
        vline(ctx, PAD_X + s * seg, top, top + this.barH, colours.axis, 1);
      }
    });
  }

  describeState(v: Verbosity = 'full'): string {
    const s = this.bars.map((b) => this.barSentence(b));
    if (v === 'full') s.push(`${capitalise(this.mode)} mode is not yet interactive.`);
    return s.join(' ');
  }

  snapshot(): StubSnapshot {
    return { mode: this.mode, note: 'not-yet-interactive' };
  }

  restore(_s: FractionBarSnapshot): void {
    // Nothing to restore: the stub holds no learner state.
  }

  destroy(): void {
    // No listeners registered.
  }
}
