/**
 * Painting primitives shared by every FractionBar mode.
 *
 * Design rules enforced here rather than remembered at each call site
 * (docs/design/02-DESIGN-TOKENS.md):
 *  - no blur, no gradient, no glass, no elevation. The one depth cue is a hard, zero-blur
 *    contact shadow at 315°, offset <= 0.15 bu.
 *  - square-cut terminals, no rounded caps.
 *  - no green, no red, no "incorrect" colour. Diagnosis is words, never paint.
 *  - every quantity carries a second, non-colour channel: hatch angle, position, and a direct
 *    label on the object itself.
 */

import type { ThemeColours } from './types';

const LIGHT: ThemeColours = {
  live: '#B4432A',
  livePress: '#8F3520',
  liveWash: '#F0DED5',
  paper: '#F5F1E8',
  sheet: '#FBF8F1',
  sunk: '#E9E3D6',
  rule: '#D6CEBC',
  ruleMajor: '#B8AE99',
  axis: '#8F856E',
  ink900: '#1E1B16',
  ink700: '#4A443A',
  ink500: '#6F6859',
  qtyBlue: '#12609B',
  qtyGraphite: '#1E1B16',
};

const DARK: ThemeColours = {
  live: '#E0643C',
  livePress: '#C24E2A',
  liveWash: '#3A241B',
  paper: '#14120F',
  sheet: '#211D18',
  sunk: '#2A2520',
  rule: '#3C352C',
  ruleMajor: '#574E41',
  axis: '#726857',
  ink900: '#F0EAE0',
  ink700: '#BDB4A6',
  ink500: '#918978',
  qtyBlue: '#3A8AC2',
  qtyGraphite: '#DCD4C7', // chalk on a dark bench — the material logic, not a colour trick
};

const VAR_NAMES: Record<keyof ThemeColours, string> = {
  live: '--live',
  livePress: '--live-press',
  liveWash: '--live-wash',
  paper: '--paper',
  sheet: '--sheet',
  sunk: '--sunk',
  rule: '--rule',
  ruleMajor: '--rule-major',
  axis: '--axis',
  ink900: '--ink-900',
  ink700: '--ink-700',
  ink500: '--ink-500',
  qtyBlue: '--qty-blue',
  qtyGraphite: '--qty-graphite',
};

/** Dark-mode aliases: the page may define these instead of the light names. */
const DARK_ALIASES: Partial<Record<keyof ThemeColours, string>> = {
  sunk: '--raised',
  ink900: '--ink-050',
  ink700: '--ink-300',
  qtyGraphite: '--qty-chalk',
};

export function isDarkTheme(el: HTMLElement): boolean {
  const attr = el.closest('[data-theme]')?.getAttribute('data-theme');
  if (attr === 'dark') return true;
  if (attr === 'light') return false;
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia('(prefers-color-scheme: dark)').matches
    : false;
}

/**
 * Resolve the palette from CSS custom properties on the page, falling back to the tokens in
 * 02-DESIGN-TOKENS.md. Every colour that reaches the canvas comes through here, so the token
 * audit ("every colour on screen appears in §2 or §3") has exactly one place to look.
 */
export function readColours(el: HTMLElement, dark: boolean): ThemeColours {
  const base = dark ? DARK : LIGHT;
  if (typeof window === 'undefined' || typeof window.getComputedStyle !== 'function') return base;
  const cs = window.getComputedStyle(el);
  const out: Record<string, string> = {};
  (Object.keys(VAR_NAMES) as Array<keyof ThemeColours>).forEach((key) => {
    const alias = dark ? DARK_ALIASES[key] : undefined;
    const aliasValue = alias === undefined ? '' : cs.getPropertyValue(alias).trim();
    const direct = cs.getPropertyValue(VAR_NAMES[key]).trim();
    out[key] = aliasValue !== '' ? aliasValue : direct !== '' ? direct : base[key];
  });
  return out as unknown as ThemeColours;
}

export function readNumberVar(el: HTMLElement, name: string, fallback: number): number {
  if (typeof window === 'undefined' || typeof window.getComputedStyle !== 'function') return fallback;
  const raw = window.getComputedStyle(el).getPropertyValue(name).trim();
  if (raw === '') return fallback;
  const parsed = Number.parseFloat(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

// ---------------------------------------------------------------------------
// Hatch — the mandatory non-colour channel (kit §7, tokens §4.1)
// ---------------------------------------------------------------------------

const hatchCache = new Map<string, CanvasPattern | null>();

export type HatchAngle = 45 | 135;

export function hatch(
  ctx: CanvasRenderingContext2D,
  colour: string,
  angle: HatchAngle,
  dpr: number,
): CanvasPattern | null {
  const key = `${colour}|${angle}|${Math.round(dpr * 100)}`;
  const cached = hatchCache.get(key);
  if (cached !== undefined) return cached;

  const size = Math.max(6, Math.round(7 * dpr));
  const tile = document.createElement('canvas');
  tile.width = size;
  tile.height = size;
  const tctx = tile.getContext('2d');
  let pattern: CanvasPattern | null = null;
  if (tctx !== null) {
    tctx.strokeStyle = colour;
    tctx.lineWidth = Math.max(1, dpr);
    tctx.lineCap = 'butt';
    tctx.beginPath();
    if (angle === 45) {
      tctx.moveTo(-size, size);
      tctx.lineTo(size, -size);
      tctx.moveTo(0, size * 2);
      tctx.lineTo(size * 2, 0);
    } else {
      tctx.moveTo(-size, -size);
      tctx.lineTo(size, size);
      tctx.moveTo(0, -size * 2);
      tctx.lineTo(size * 2, size);
    }
    tctx.stroke();
    pattern = ctx.createPattern(tile, 'repeat');
    if (pattern !== null && typeof DOMMatrix === 'function') {
      pattern.setTransform(new DOMMatrix([1 / dpr, 0, 0, 1 / dpr, 0, 0]));
    }
  }
  hatchCache.set(key, pattern);
  return pattern;
}

export function clearHatchCache(): void {
  hatchCache.clear();
}

// ---------------------------------------------------------------------------
// Objects
// ---------------------------------------------------------------------------

export interface BarStyle {
  stroke: string;
  strokeWidth: number;
  fill?: string;
  hatchColour?: string;
  hatchAngle?: HatchAngle;
  dash?: number[];
  contactShadow?: string;
  shadowOffset?: number;
}

/** A rectangular bench object. Hard contact shadow only, no blur, square corners. */
export function drawBar(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  style: BarStyle,
  dpr: number,
): void {
  const width = Math.max(0, w);
  if (style.contactShadow !== undefined && width > 0.5) {
    const off = style.shadowOffset ?? 2;
    ctx.fillStyle = style.contactShadow;
    ctx.fillRect(x + off, y + off, width, h);
  }
  if (style.fill !== undefined && width > 0) {
    ctx.fillStyle = style.fill;
    ctx.fillRect(x, y, width, h);
  }
  if (style.hatchColour !== undefined && width > 0) {
    const p = hatch(ctx, style.hatchColour, style.hatchAngle ?? 45, dpr);
    if (p !== null) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(x, y, width, h);
      ctx.clip();
      ctx.fillStyle = p;
      ctx.fillRect(x, y, width, h);
      ctx.restore();
    }
  }
  ctx.save();
  ctx.strokeStyle = style.stroke;
  ctx.lineWidth = style.strokeWidth;
  ctx.lineCap = 'butt';
  ctx.lineJoin = 'miter';
  if (style.dash !== undefined) ctx.setLineDash(style.dash);
  const inset = style.strokeWidth / 2;
  ctx.strokeRect(x + inset, y + inset, Math.max(0, width - style.strokeWidth), h - style.strokeWidth);
  ctx.restore();
}

export function vline(
  ctx: CanvasRenderingContext2D,
  x: number,
  y0: number,
  y1: number,
  colour: string,
  width: number,
  dash?: number[],
): void {
  ctx.save();
  ctx.strokeStyle = colour;
  ctx.lineWidth = width;
  ctx.lineCap = 'butt';
  if (dash !== undefined) ctx.setLineDash(dash);
  ctx.beginPath();
  const px = Math.round(x) + (width % 2 === 1 ? 0.5 : 0);
  ctx.moveTo(px, y0);
  ctx.lineTo(px, y1);
  ctx.stroke();
  ctx.restore();
}

/**
 * Hobonichi ruling: a horizontal rule interrupted by short vertical ticks reads as continuous
 * while reducing strain (tokens §6). The one borrowed drawing technique in the product.
 */
export function ruledLine(
  ctx: CanvasRenderingContext2D,
  x0: number,
  x1: number,
  y: number,
  colour: string,
  pitch: number,
): void {
  ctx.save();
  ctx.strokeStyle = colour;
  ctx.lineWidth = 1;
  ctx.beginPath();
  const py = Math.round(y) + 0.5;
  for (let x = x0; x < x1; x += pitch) {
    ctx.moveTo(x, py);
    ctx.lineTo(Math.min(x + pitch * 0.72, x1), py);
  }
  ctx.stroke();
  ctx.restore();
}

export const UI_FONT =
  '500 15px "Atkinson Hyperlegible Next", "Atkinson Hyperlegible", system-ui, sans-serif';
export const TICK_FONT =
  '400 11px "Atkinson Hyperlegible Next", "Atkinson Hyperlegible", system-ui, sans-serif';

export function uiFont(sizePx: number, weight = 500): string {
  return `${weight} ${sizePx}px "Atkinson Hyperlegible Next", "Atkinson Hyperlegible", system-ui, sans-serif`;
}

export function label(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  colour: string,
  font: string,
  align: CanvasTextAlign = 'left',
  baseline: CanvasTextBaseline = 'middle',
): void {
  ctx.save();
  ctx.fillStyle = colour;
  ctx.font = font;
  ctx.textAlign = align;
  ctx.textBaseline = baseline;
  ctx.fillText(text, x, y);
  ctx.restore();
}

/**
 * Fixed-width digit slots, laid by the painter, so a value that changes while dragging does not
 * reflow the readout (tokens §5). Independent of whether the shipped face has `tnum`.
 */
export function drawFixedInt(
  ctx: CanvasRenderingContext2D,
  value: number,
  x: number,
  y: number,
  colour: string,
  font: string,
  align: 'left' | 'right' = 'left',
): number {
  ctx.save();
  ctx.font = font;
  ctx.fillStyle = colour;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  let slot = 0;
  for (let d = 0; d <= 9; d += 1) slot = Math.max(slot, ctx.measureText(String(d)).width);
  const digits = String(value).split('');
  const total = slot * digits.length;
  const startX = align === 'left' ? x : x - total;
  digits.forEach((ch, i) => {
    ctx.fillText(ch, startX + slot * i + slot / 2, y);
  });
  ctx.restore();
  return total;
}

/** A stacked vulgar fraction: numerator, rule, denominator. Returns the width drawn. */
export function drawStackedFraction(
  ctx: CanvasRenderingContext2D,
  n: number,
  d: number,
  x: number,
  yMiddle: number,
  sizePx: number,
  colour: string,
  weight = 700,
): number {
  const font = uiFont(sizePx * 0.62, weight);
  ctx.save();
  ctx.font = font;
  const w = Math.max(ctx.measureText(String(n)).width, ctx.measureText(String(d)).width);
  ctx.restore();
  const gap = sizePx * 0.1;
  drawFixedInt(ctx, n, x + w / 2 - measureInt(ctx, n, font) / 2, yMiddle - sizePx * 0.28, colour, font);
  ctx.save();
  ctx.strokeStyle = colour;
  ctx.lineWidth = Math.max(1, sizePx * 0.05);
  ctx.beginPath();
  ctx.moveTo(x, Math.round(yMiddle) + 0.5);
  ctx.lineTo(x + w, Math.round(yMiddle) + 0.5);
  ctx.stroke();
  ctx.restore();
  drawFixedInt(ctx, d, x + w / 2 - measureInt(ctx, d, font) / 2, yMiddle + sizePx * 0.32, colour, font);
  return w + gap;
}

function measureInt(ctx: CanvasRenderingContext2D, value: number, font: string): number {
  ctx.save();
  ctx.font = font;
  let slot = 0;
  for (let d = 0; d <= 9; d += 1) slot = Math.max(slot, ctx.measureText(String(d)).width);
  ctx.restore();
  return slot * String(value).length;
}

/** "1½ sticks" — a mixed number with its unit word always attached. Returns width drawn. */
export function drawMixedWithUnit(
  ctx: CanvasRenderingContext2D,
  whole: number,
  n: number,
  d: number,
  unitWord: string,
  x: number,
  yMiddle: number,
  sizePx: number,
  colour: string,
): number {
  let cursor = x;
  const numFont = uiFont(sizePx, 700);
  if (whole !== 0 || n === 0) {
    cursor += drawFixedInt(ctx, whole, cursor, yMiddle, colour, numFont);
    cursor += sizePx * 0.12;
  }
  if (n !== 0) {
    cursor += drawStackedFraction(ctx, n, d, cursor, yMiddle, sizePx, colour);
    cursor += sizePx * 0.12;
  }
  if (unitWord !== '') {
    ctx.save();
    ctx.font = uiFont(sizePx * 0.62, 500);
    ctx.fillStyle = colour;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'left';
    ctx.fillText(unitWord, cursor + sizePx * 0.06, yMiddle + sizePx * 0.04);
    cursor += ctx.measureText(unitWord).width + sizePx * 0.12;
    ctx.restore();
  }
  return cursor - x;
}

export function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}

/** Decelerate, no overshoot — DETENT and SETTLE both (tokens §7). */
export function decelerate(t: number): number {
  const x = clamp(t, 0, 1);
  return 1 - (1 - x) * (1 - x) * (1 - x);
}
