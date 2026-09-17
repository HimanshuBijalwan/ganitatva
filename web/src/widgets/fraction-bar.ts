/**
 * FractionBar — the Ganitatva widget class (web build, Canvas 2D, zero runtime dependencies).
 *
 * Implements the base contract in docs/widgets/00-kit-overview.md §2:
 *   config          immutable, validated at construction (a content error throws, loudly)
 *   state           persisted vs ephemeral, split inside each mode controller
 *   events          RAW interaction facts only — never a pedagogical judgement
 *   describeState() a full sentence, the widget's second rendering target
 *   applyExternalState / toSnapshot — one path for resume AND golden fixtures
 *
 * Mode priority, per the brief: `measure` is complete (see measure-mode.ts — it carries the
 * Phase 1 exit gate). `partition` is complete. `equivalence` and `combine` render their authored
 * bars and are not yet interactive (see stub-modes.ts for why that is a deliberate choice).
 */

import { clearHatchCache, isDarkTheme, readColours, readNumberVar } from './draw';
import { el } from './dom';
import { MeasureMode } from './measure-mode';
import { PartitionMode } from './partition-mode';
import { makeResolver } from './strings';
import { StubMode } from './stub-modes';
import * as R from './rational';
import type {
  EventListener,
  FractionBarConfig,
  FractionBarEvent,
  FractionBarSnapshot,
  InteractionLevel,
  MeasureConfig,
  ModeController,
  ThemeColours,
  Verbosity,
  WidgetHost,
} from './types';

const STYLE_ID = 'gt-fraction-bar-styles';
const ANNOUNCE_MS = 400;
const WIDE_PX = 900;

// ===========================================================================
// Build-time validation. A concept must not ship able to install a false rule.
// ===========================================================================

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) throw new Error(`FractionBar config: ${message}`);
}

function isIntFraction(f: { numerator: number; denominator: number } | undefined, allowZeroNum: boolean): boolean {
  if (f === undefined) return false;
  if (!Number.isInteger(f.numerator) || !Number.isInteger(f.denominator)) return false;
  if (f.denominator <= 0) return false;
  return allowZeroNum ? f.numerator >= 0 : f.numerator > 0;
}

/** `p.target` is a whole number of wholes AND divides exactly by `p.stick`. */
function isWholeNumberPreset(p: { target: { numerator: number; denominator: number }; stick: { numerator: number; denominator: number } }): boolean {
  if (p.stick.numerator === 0) return false;
  const t = R.fromSpec(p.target);
  const s = R.fromSpec(p.stick);
  if (t.d !== 1) return false;
  const q = R.div(t, s);
  return q.d === 1;
}

export function validateFractionBarConfig(config: FractionBarConfig): void {
  assert(typeof config === 'object' && config !== null, 'config is not an object');

  if (config.mode === 'measure') {
    assert(isIntFraction(config.target?.fraction, false), 'measure: target.fraction must be positive integers with denominator > 0');
    assert(isIntFraction(config.measuring_stick?.fraction, true), 'measure: measuring_stick.fraction must be non-negative integers with denominator > 0');
    assert(Array.isArray(config.presets) && config.presets.length > 0, 'measure: presets must be a non-empty array — the ladder IS the pedagogy');

    config.presets.forEach((p, i) => {
      assert(typeof p.id === 'string' && p.id.length > 0, `measure: presets[${i}] has no id`);
      assert(isIntFraction(p.target, false), `measure: presets[${i}] (${p.id}) has an invalid target`);
      assert(isIntFraction(p.stick, true), `measure: presets[${i}] (${p.id}) has an invalid stick`);
    });

    // fraction-bar.md §2.4 — both guards are build-time failures, not style choices.
    const hasStickPastOne = config.presets.some((p) => p.stick.numerator > p.stick.denominator);
    assert(
      hasStickPastOne,
      'measure: the ladder has no preset whose stick is longer than one whole (the `stick-past-one` guard). ' +
        'Without it this concept installs the replacement false rule "dividing by a fraction always makes it bigger".',
    );
    const hasWholeNumber = config.presets.some(isWholeNumberPreset);
    assert(
      hasWholeNumber,
      'measure: the ladder has no whole-number preset with an exact fit (the `bottles` guard). ' +
        'Without it the belief "a division answer must be smaller" is never made to fail on a case the learner can verify by counting.',
    );

    const rem = config.remainder;
    if (rem !== undefined && rem.enabled !== false) {
      assert(
        rem.compare_against === 'measuring_stick',
        'measure: remainder.compare_against must be "measuring_stick" — measuring the leftover against the whole instead is the exact error this concept exists to remove.',
      );
    }
    return;
  }

  if (config.mode === 'partition') {
    assert(Array.isArray(config.bars) && config.bars.length > 0, 'partition: bars must be a non-empty array');
    config.bars.forEach((b, i) => {
      assert(typeof b.id === 'string' && b.id.length > 0, `partition: bars[${i}] has no id`);
      assert(Number.isFinite(b.whole_length) && b.whole_length > 0, `partition: bars[${i}] has an invalid whole_length`);
      assert(Number.isInteger(b.partitions) && b.partitions >= 0, `partition: bars[${i}] has an invalid partitions count`);
      const min = b.partitions_control?.min;
      assert(min === undefined || min >= 0, `partition: bars[${i}].partitions_control.min must be >= 0`);
    });
    return;
  }

  if (config.mode === 'combine') {
    assert(Array.isArray(config.bars) && config.bars.length > 0, 'combine: bars must be a non-empty array');
    assert(
      config.pour?.allow_force !== true,
      'combine: pour.allow_force is fixed false — a mismatched pour must never be forceable, because the refusal IS the lesson.',
    );
    return;
  }

  if (config.mode === 'equivalence') {
    assert(Array.isArray(config.bars) && config.bars.length > 0, 'equivalence: bars must be a non-empty array');
    return;
  }

  assert(false, `unknown mode "${String((config as { mode?: unknown }).mode)}"`);
}

// ===========================================================================
// Styles — injected once. Every colour is a token with a documented fallback.
// ===========================================================================

const CSS = `
.gt-fb{
  --_live:var(--live,#B4432A);--_live-press:var(--live-press,#8F3520);--_live-wash:var(--live-wash,#F0DED5);
  --_paper:var(--paper,#F5F1E8);--_sheet:var(--sheet,#FBF8F1);--_sunk:var(--sunk,#E9E3D6);
  --_rule:var(--rule,#D6CEBC);--_rule-major:var(--rule-major,#B8AE99);--_axis:var(--axis,#8F856E);
  --_ink-900:var(--ink-900,#1E1B16);--_ink-700:var(--ink-700,#4A443A);--_ink-500:var(--ink-500,#6F6859);
  display:block;background:var(--_paper);color:var(--_ink-900);
  font:400 15px/1.45 "Atkinson Hyperlegible Next","Atkinson Hyperlegible",system-ui,sans-serif;
}
@media (prefers-color-scheme:dark){
  .gt-fb{
    --_live:var(--live,#E0643C);--_live-press:var(--live-press,#C24E2A);--_live-wash:var(--live-wash,#3A241B);
    --_paper:var(--paper,#14120F);--_sheet:var(--sheet,#211D18);--_sunk:var(--raised,var(--sunk,#2A2520));
    --_rule:var(--rule,#3C352C);--_rule-major:var(--rule-major,#574E41);--_axis:var(--axis,#726857);
    --_ink-900:var(--ink-050,var(--ink-900,#F0EAE0));--_ink-700:var(--ink-300,var(--ink-700,#BDB4A6));
    --_ink-500:var(--ink-500,#918978);
  }
}
.gt-fb__stage{position:relative;width:100%}
.gt-fb__canvas{display:block;width:100%;touch-action:none;-webkit-user-select:none;user-select:none}
.gt-fb__handles{position:absolute;inset:0;pointer-events:none}
.gt-fb__handle{position:absolute;pointer-events:auto;touch-action:none;background:transparent;border:0;
  -webkit-tap-highlight-color:transparent;cursor:grab}
.gt-fb__handle--segment{cursor:pointer}
.gt-fb__handle:focus-visible{outline:2px solid var(--_axis);outline-offset:2px}
.gt-fb__state{margin:8px 14px 0;font-size:14px;line-height:1.5;color:var(--_ink-700)}
.gt-fb__controls{margin:10px 14px 0;display:flex;flex-direction:column;gap:10px}
.gt-fb__selector,.gt-fb__chips,.gt-fb__row{display:flex;gap:8px;flex-wrap:nowrap;overflow-x:auto;
  scrollbar-width:thin;padding-bottom:2px;
  /* min-width:0 is load-bearing: as flex items in a column parent these default to
     min-width:auto, which refuses to shrink below content and makes overflow-x:auto a no-op.
     Without it the chip row escapes the object's right edge on a 360px phone. */
  min-width:0}
.gt-fb__chip{flex:0 0 auto}
.gt-fb__row{flex-wrap:wrap;overflow-x:visible}
.gt-fb__groups{display:flex;flex-direction:column;gap:10px}
.gt-fb__group{border:0;padding:0;margin:0}
.gt-fb__group-title{margin:0 0 6px;font-size:12px;font-weight:500;letter-spacing:.02em;color:var(--_ink-500);
  text-transform:lowercase}
.gt-fb__btn{min-height:48px;min-width:48px;padding:0 14px;border:1.5px solid var(--_axis);border-radius:0;
  background:var(--_sheet);color:var(--_ink-900);font:500 15px/1.2 inherit;cursor:pointer;white-space:nowrap;
  flex:0 0 auto}
.gt-fb__btn:focus-visible{outline:2px solid var(--_axis);outline-offset:2px}
.gt-fb__btn:active:not(:disabled){background:var(--_live-wash);border-color:var(--_live-press)}
.gt-fb__btn:disabled{color:var(--_ink-500);border-color:var(--_rule);background:var(--_sunk);cursor:default}
.gt-fb__btn--primary{border-color:var(--_live);border-width:2px}
.gt-fb__btn--step{min-width:48px;padding:0;font-size:20px}
.gt-fb__btn[aria-pressed="true"]{background:var(--_live-wash);border-color:var(--_live);border-width:2px;
  font-weight:700}
.gt-fb__chip{font-size:14px;padding:0 12px}
.gt-fb__row--stepper{align-items:center}
.gt-fb__stepper-name{min-width:56px;font-size:13px;color:var(--_ink-700)}
.gt-fb__stepper-value{min-width:28px;text-align:center;font-weight:700}
.gt-fb__note{margin:0;font-size:13px;color:var(--_ink-700)}
.gt-fb__note--hint{color:var(--_ink-500)}
.gt-fb__note--stub{border-left:3px solid var(--_rule-major);padding-left:10px}
.gt-fb__log-title{margin:0 0 4px;font-size:12px;font-weight:500;color:var(--_ink-500);text-transform:lowercase}
.gt-fb__log{margin:10px 14px 12px;padding:0 0 0 20px;max-height:132px;overflow-y:auto;font-size:13px;
  color:var(--_ink-700)}
.gt-fb__log-item{margin:2px 0}
.gt-fb[data-layout="wide"] .gt-fb__selector{display:none}
.gt-fb[data-layout="wide"] .gt-fb__groups{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}
@media (prefers-reduced-motion:reduce){.gt-fb *{animation:none!important;transition:none!important}}
`;

function injectStyles(): void {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID) !== null) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = CSS;
  document.head.appendChild(style);
}

// ===========================================================================
// The widget
// ===========================================================================

export class FractionBar {
  readonly config: FractionBarConfig;

  private readonly root: HTMLElement;
  private readonly stage: HTMLElement;
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly handlesEl: HTMLElement;
  private readonly controlsEl: HTMLElement;
  private readonly logEl: HTMLElement;
  private readonly stateEl: HTMLElement;
  private readonly readoutEl: HTMLElement;

  private readonly listeners = new Set<EventListener>();
  private readonly animHandles = new Set<number>();
  private mode: ModeController;
  private colours: ThemeColours;
  private buValue: number;
  private cssWidth = 0;
  private cssHeight = 0;
  private drawHandle: number | null = null;
  private announceHandle: number | null = null;
  private lastAnnounce = 0;
  private resizeObserver: ResizeObserver | null = null;
  private themeQuery: MediaQueryList | null = null;
  private motionQuery: MediaQueryList | null = null;
  private destroyed = false;
  private readonly resolve: (id: string | undefined, fallback: string) => string;

  constructor(root: HTMLElement, config: FractionBarConfig) {
    validateFractionBarConfig(config);
    injectStyles();

    this.config = config;
    this.root = root;
    this.resolve = makeResolver(config.strings);
    root.classList.add('gt-fb');
    root.dataset.mode = config.mode;
    if (config.id !== undefined) root.dataset.widgetId = config.id;

    this.stage = el('div', 'gt-fb__stage');
    this.canvas = el('canvas', 'gt-fb__canvas');
    // The canvas is paint. Every name, role and value lives in the DOM beside it.
    this.canvas.setAttribute('aria-hidden', 'true');
    this.handlesEl = el('div', 'gt-fb__handles');
    this.stage.appendChild(this.canvas);
    this.stage.appendChild(this.handlesEl);

    this.stateEl = el('p', 'gt-fb__state');
    this.stateEl.setAttribute('role', 'status');
    this.stateEl.setAttribute('aria-live', 'polite');
    this.stateEl.setAttribute('aria-atomic', 'true');

    this.readoutEl = el('div', 'gt-fb__readout');
    this.controlsEl = el('div', 'gt-fb__controls');

    const logWrap = el('div', 'gt-fb__log-wrap');
    const logTitle = el('h4', 'gt-fb__log-title', config.mode === 'measure' ? 'what has been laid' : 'what is on the bench');
    this.logEl = el('ol', 'gt-fb__log');
    logWrap.appendChild(logTitle);
    logWrap.appendChild(this.logEl);

    root.appendChild(this.stage);
    root.appendChild(this.stateEl);
    root.appendChild(this.controlsEl);
    root.appendChild(logWrap);

    const context = this.canvas.getContext('2d');
    if (context === null) throw new Error('FractionBar: Canvas 2D is unavailable in this environment');
    this.ctx = context;

    const dark = isDarkTheme(root);
    this.colours = readColours(root, dark);
    this.buValue = this.resolveBu();

    this.mode = this.createMode();
    this.mode.buildControls();
    this.observe();
    this.layout();
    this.announceNow();
  }

  // ---- host surface handed to the mode controller --------------------------

  private get host(): WidgetHost {
    const self = this;
    return {
      get ctx() { return self.ctx; },
      get width() { return self.cssWidth; },
      get height() { return self.cssHeight; },
      get bu() { return self.buValue; },
      get colours() { return self.colours; },
      get reducedMotion() { return self.reducedMotion; },
      get wide() { return self.cssWidth >= WIDE_PX; },
      get controls() { return self.controlsEl; },
      get handles() { return self.handlesEl; },
      get log() { return self.logEl; },
      get readout() { return self.readoutEl; },
      get interactionLevel() { return self.interactionLevel; },
      str: (id, fallback) => self.resolve(id, fallback),
      emit: (e) => self.emit(e),
      announce: () => self.announce(),
      requestDraw: () => self.requestDraw(),
      requestLayout: () => self.layout(),
      animate: (d, f, done) => self.animate(d, f, done),
    };
  }

  private get interactionLevel(): InteractionLevel {
    return this.config.interaction_level ?? 'free';
  }

  private get reducedMotion(): boolean {
    return this.motionQuery?.matches === true;
  }

  private createMode(): ModeController {
    switch (this.config.mode) {
      case 'measure':
        return new MeasureMode(this.host, this.config);
      case 'partition':
        return new PartitionMode(this.host, this.config);
      default:
        return new StubMode(this.host, this.config);
    }
  }

  private resolveBu(): number {
    const coarse =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(pointer: coarse)').matches;
    // 02-DESIGN-TOKENS.md §1: one bench unit, resolved from input modality — never from an OS check.
    return readNumberVar(this.root, '--bu', coarse ? 25 : 22);
  }

  // ---- layout / paint ------------------------------------------------------

  private observe(): void {
    if (typeof window === 'undefined') return;
    if (typeof ResizeObserver === 'function') {
      this.resizeObserver = new ResizeObserver(() => this.layout());
      this.resizeObserver.observe(this.root);
    } else {
      window.addEventListener('resize', this.onWindowResize);
    }
    if (typeof window.matchMedia === 'function') {
      this.motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.themeQuery = window.matchMedia('(prefers-color-scheme: dark)');
      if (typeof this.themeQuery.addEventListener === 'function') {
        this.themeQuery.addEventListener('change', this.onThemeChange);
      }
    }
  }

  private readonly onWindowResize = (): void => {
    this.layout();
  };

  private readonly onThemeChange = (): void => {
    clearHatchCache();
    this.colours = readColours(this.root, isDarkTheme(this.root));
    this.requestDraw();
  };

  /** Recompute the canvas box from the width we are actually given. No breakpoint branches. */
  private layout(): void {
    if (this.destroyed) return;
    const width = Math.max(1, Math.round(this.stage.clientWidth || this.root.clientWidth || 360));
    this.cssWidth = width;
    this.root.dataset.layout = width >= WIDE_PX ? 'wide' : 'narrow';
    const height = Math.max(80, Math.round(this.mode.measureHeight()));
    this.cssHeight = height;
    const dpr = typeof window === 'undefined' ? 1 : window.devicePixelRatio || 1;
    this.canvas.width = Math.round(width * dpr);
    this.canvas.height = Math.round(height * dpr);
    this.canvas.style.height = `${height}px`;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.mode.relayout();
    this.requestDraw();
  }

  private requestDraw(): void {
    if (this.destroyed || this.drawHandle !== null) return;
    if (typeof requestAnimationFrame !== 'function') {
      this.paint();
      return;
    }
    this.drawHandle = requestAnimationFrame(() => {
      this.drawHandle = null;
      this.paint();
    });
  }

  private paint(): void {
    if (this.destroyed) return;
    this.mode.draw();
  }

  private animate(durationMs: number, onFrame: (t: number) => void, onDone?: () => void): void {
    if (this.destroyed) return;
    if (durationMs <= 0 || this.reducedMotion || typeof requestAnimationFrame !== 'function') {
      onFrame(1);
      onDone?.();
      return;
    }
    const start = typeof performance === 'undefined' ? Date.now() : performance.now();
    const step = (): void => {
      if (this.destroyed) return;
      const nowMs = typeof performance === 'undefined' ? Date.now() : performance.now();
      const raw = Math.min(1, (nowMs - start) / durationMs);
      // decelerate, never overshoot (02-DESIGN-TOKENS.md §7)
      onFrame(1 - (1 - raw) ** 3);
      if (raw < 1) {
        const h = requestAnimationFrame(step);
        this.animHandles.add(h);
      } else {
        onDone?.();
      }
    };
    const handle = requestAnimationFrame(step);
    this.animHandles.add(handle);
  }

  // ---- events / a11y -------------------------------------------------------

  on(listener: EventListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private emit(e: FractionBarEvent): void {
    this.listeners.forEach((l) => {
      try {
        l(e);
      } catch {
        // A telemetry listener must never break the bench.
      }
    });
  }

  /**
   * Rate-limited so a continuous drag does not flood a screen reader (kit §8.4). The live region
   * carries STATE only; naming the remedy is forbidden and is enforced inside each mode.
   */
  private announce(): void {
    if (this.destroyed) return;
    const nowMs = typeof performance === 'undefined' ? Date.now() : performance.now();
    if (nowMs - this.lastAnnounce >= ANNOUNCE_MS) {
      this.announceNow();
      return;
    }
    if (this.announceHandle !== null) return;
    this.announceHandle = window.setTimeout(() => {
      this.announceHandle = null;
      this.announceNow();
    }, ANNOUNCE_MS - (nowMs - this.lastAnnounce));
  }

  private announceNow(): void {
    if (this.destroyed) return;
    this.lastAnnounce = typeof performance === 'undefined' ? Date.now() : performance.now();
    const text = this.describeState();
    if (this.stateEl.textContent !== text) this.stateEl.textContent = text;
  }

  describeState(v?: Verbosity): string {
    return this.mode.describeState(v ?? this.config.a11y?.verbosity ?? 'full');
  }

  toSnapshot(): FractionBarSnapshot {
    return this.mode.snapshot();
  }

  applyExternalState(s: FractionBarSnapshot): void {
    this.mode.restore(s);
    this.layout();
    this.announceNow();
  }

  destroy(): void {
    if (this.destroyed) return;
    this.destroyed = true;
    this.mode.destroy();
    this.listeners.clear();
    if (this.drawHandle !== null && typeof cancelAnimationFrame === 'function') cancelAnimationFrame(this.drawHandle);
    this.animHandles.forEach((h) => {
      if (typeof cancelAnimationFrame === 'function') cancelAnimationFrame(h);
    });
    this.animHandles.clear();
    if (this.announceHandle !== null) window.clearTimeout(this.announceHandle);
    this.resizeObserver?.disconnect();
    if (this.resizeObserver === null && typeof window !== 'undefined') {
      window.removeEventListener('resize', this.onWindowResize);
    }
    if (this.themeQuery !== null && typeof this.themeQuery.removeEventListener === 'function') {
      this.themeQuery.removeEventListener('change', this.onThemeChange);
    }
    while (this.root.firstChild !== null) this.root.removeChild(this.root.firstChild);
    this.root.classList.remove('gt-fb');
  }
}

export type { MeasureConfig };
export * from './types';
