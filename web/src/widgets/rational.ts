/**
 * Exact rational arithmetic.
 *
 * Every quantity in FractionBar that has a correct mathematical answer is held as a reduced
 * integer fraction, never as a float. This is what makes "snapping is mandatory"
 * (00-kit-overview.md §4.2) implementable: a snap target is an exact Rat, and equality is
 * integer equality, not an epsilon comparison.
 *
 * Floats appear in exactly one place in this widget: turning a Rat into pixels for painting.
 */

export interface Rat {
  readonly n: number;
  readonly d: number; // always > 0
}

export function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    const t = x % y;
    x = y;
    y = t;
  }
  return x === 0 ? 1 : x;
}

export function lcm(a: number, b: number): number {
  return Math.abs(a * b) / gcd(a, b);
}

/** Build a reduced Rat. Throws on a zero or non-integer denominator — a build-time content error. */
export function rat(n: number, d = 1): Rat {
  if (!Number.isInteger(n) || !Number.isInteger(d)) {
    throw new Error(`rational: expected integers, got ${n}/${d}`);
  }
  if (d === 0) throw new Error('rational: denominator is zero');
  const sign = d < 0 ? -1 : 1;
  const g = gcd(n, d);
  return { n: (sign * n) / g, d: Math.abs(d) / g };
}

export const ZERO: Rat = { n: 0, d: 1 };
export const ONE: Rat = { n: 1, d: 1 };

export function add(a: Rat, b: Rat): Rat {
  return rat(a.n * b.d + b.n * a.d, a.d * b.d);
}
export function sub(a: Rat, b: Rat): Rat {
  return rat(a.n * b.d - b.n * a.d, a.d * b.d);
}
export function mul(a: Rat, b: Rat): Rat {
  return rat(a.n * b.n, a.d * b.d);
}
export function scale(a: Rat, k: number): Rat {
  return rat(a.n * k, a.d);
}
/** a / b. Caller must check `isZero(b)` first — division by zero is a reachable learner state
 *  in `measure` mode and is modelled explicitly, never by letting Infinity leak into the UI. */
export function div(a: Rat, b: Rat): Rat {
  if (b.n === 0) throw new Error('rational: division by zero');
  return rat(a.n * b.d, a.d * b.n);
}
export function cmp(a: Rat, b: Rat): number {
  const l = a.n * b.d;
  const r = b.n * a.d;
  return l < r ? -1 : l > r ? 1 : 0;
}
export function eq(a: Rat, b: Rat): boolean {
  return a.n === b.n && a.d === b.d;
}
export function isZero(a: Rat): boolean {
  return a.n === 0;
}
export function toNumber(a: Rat): number {
  return a.n / a.d;
}
/** How many whole copies of `b` fit inside `a` (both non-negative, b > 0). */
export function fitCount(a: Rat, b: Rat): number {
  if (b.n === 0) throw new Error('rational: fitCount with a zero-length unit');
  return Math.floor((a.n * b.d) / (a.d * b.n));
}

export interface MixedRat {
  readonly whole: number;
  readonly n: number; // fractional part numerator, 0 when exact
  readonly d: number;
}

export function mixed(a: Rat): MixedRat {
  const whole = Math.floor(a.n / a.d);
  const remN = a.n - whole * a.d;
  if (remN === 0) return { whole, n: 0, d: 1 };
  const r = rat(remN, a.d);
  return { whole, n: r.n, d: r.d };
}

/** Express `a` as an integer number of 1/den pieces. Throws unless it lands exactly. */
export function inPiecesOf(a: Rat, den: number): number {
  const units = (a.n * den) / a.d;
  if (!Number.isInteger(units)) {
    throw new Error(`rational: ${a.n}/${a.d} is not a whole number of 1/${den} pieces`);
  }
  return units;
}

export function fromSpec(spec: { numerator: number; denominator: number }): Rat {
  return rat(spec.numerator, spec.denominator);
}
