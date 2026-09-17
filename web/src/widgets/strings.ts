/**
 * Label resolution and number-to-words.
 *
 * The authored YAML references strings by id (`div.target.ribbon`). The content pipeline owns the
 * string table; until it supplies one, these built-in English defaults keep a raw id from ever
 * reaching a learner. Pass resolved strings through `config.strings` to override any of them.
 *
 * Everything in here is STATE LANGUAGE. Nothing in this file names a remedy, tells the learner
 * what to do about a state, or calls anything right or wrong (00-kit-overview.md §4.2 corollary).
 */

export const DEFAULT_STRINGS: Readonly<Record<string, string>> = Object.freeze({
  // measure mode — dividing-fractions.yaml
  'div.unit.whole': 'whole',
  'div.unit.sticks': 'sticks',
  'div.ruler.in-wholes': 'measured in wholes',
  'div.target.ribbon': 'ribbon',
  'div.stick.stick': 'stick',
  'div.stick.will-not-fit': 'That stick reaches past the end of the ribbon. It does not seat.',
  'div.remainder.fraction-of-stick': 'of the stick',
  'div.toggle.measured-in': 'measured in',
  'div.toggle.both-are-true': 'Both readings describe the same piece of ribbon.',
  'div.probe.one-whole': 'ribbon to one whole',
  'div.probe.sticks-per-whole': 'sticks in one whole',
  'div.samepieces.recut-both': 'same-sized pieces',
  'div.samepieces.counts-only': 'counts only',
  'div.predict.bigger-or-smaller':
    'Before laying anything down: will the count come out bigger or smaller than the ribbon?',
  'div.edge.divide-by-one': 'The stick is exactly one whole.',
  // State, not the conclusion. The learner reaches "there is no answer" by watching the ribbon
  // never fill; the authored string table may say more, and that is the author's call, not ours.
  'div.edge.divide-by-zero': 'The ribbon is not covered.',
  // partition mode — fractions-as-parts.yaml
  'parts.readout.words': 'pieces',
});

export function makeResolver(
  overrides: Record<string, string> | undefined,
): (id: string | undefined, fallback: string) => string {
  return (id, fallback) => {
    if (id === undefined) return fallback;
    const fromConfig = overrides?.[id];
    if (typeof fromConfig === 'string' && fromConfig.length > 0) return fromConfig;
    const builtIn = DEFAULT_STRINGS[id];
    if (typeof builtIn === 'string') return builtIn;
    return fallback;
  };
}

// ---------------------------------------------------------------------------
// Numbers in words — `describeState()` is a sentence, not a label (kit §8.2)
// ---------------------------------------------------------------------------

const UNITS = [
  'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
  'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen',
  'nineteen',
];
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

export function countWord(n: number): string {
  if (!Number.isFinite(n) || n < 0 || !Number.isInteger(n)) return String(n);
  if (n < 20) return UNITS[n] ?? String(n);
  if (n < 100) {
    const t = TENS[Math.floor(n / 10)] ?? '';
    const u = n % 10;
    if (t === '') return String(n);
    return u === 0 ? t : `${t}-${UNITS[u] ?? String(u)}`;
  }
  return String(n);
}

const DENOM_SINGULAR: Record<number, string> = {
  2: 'half', 3: 'third', 4: 'quarter', 5: 'fifth', 6: 'sixth', 7: 'seventh', 8: 'eighth',
  9: 'ninth', 10: 'tenth', 11: 'eleventh', 12: 'twelfth', 16: 'sixteenth', 20: 'twentieth',
  24: 'twenty-fourth', 32: 'thirty-second',
};

const DENOM_PLURAL: Record<number, string> = {
  2: 'halves', 3: 'thirds', 4: 'quarters', 5: 'fifths', 6: 'sixths', 7: 'sevenths', 8: 'eighths',
  9: 'ninths', 10: 'tenths', 11: 'elevenths', 12: 'twelfths', 16: 'sixteenths',
  20: 'twentieths', 24: 'twenty-fourths', 32: 'thirty-seconds',
};

/** "three quarters", "one half", "five sixths", "seven over thirteen". */
export function fractionWords(n: number, d: number): string {
  if (d === 1) return countWord(n);
  const word = n === 1 ? DENOM_SINGULAR[d] : DENOM_PLURAL[d];
  if (word === undefined) return `${countWord(n)} over ${countWord(d)}`;
  return `${countWord(n)} ${word}`;
}

/** "one and one half", "three", "one half". */
export function mixedWords(whole: number, n: number, d: number): string {
  if (n === 0) return countWord(whole);
  if (whole === 0) return fractionWords(n, d);
  return `${countWord(whole)} and ${fractionWords(n, d)}`;
}

/** The name of a piece size as a plural: "quarters", "sixths", "one-over-thirteens". */
export function pieceNameWords(d: number): string {
  return DENOM_PLURAL[d] ?? `pieces of one over ${countWord(d)}`;
}

/** "stick" / "sticks" against a mixed value; "one stick", "one and one half sticks". */
export function pluralUnit(whole: number, n: number, singular: string, plural: string): string {
  return whole === 1 && n === 0 ? singular : plural;
}

export function capitalise(s: string): string {
  return s.length === 0 ? s : s.charAt(0).toUpperCase() + s.slice(1);
}
