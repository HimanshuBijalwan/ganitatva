/**
 * Mount point for an Astro island.
 *
 * Usage from an island script:
 *
 *   import { mountFractionBar } from '../widgets/mount';
 *   const handle = mountFractionBar(el, config);
 *   handle.on((e) => track(e));        // RAW interaction events
 *   handle.describeState();            // full-sentence a11y description
 *   handle.destroy();                  // on island teardown / HMR
 *
 * `config` is the widget's `config` object straight out of the concept YAML (the `config:` block
 * under `widget: { type: FractionBar }`), with snake_case keys intact. No adapter, by design.
 */

import { FractionBar, validateFractionBarConfig } from './fraction-bar';
import type { EventListener, FractionBarConfig, FractionBarSnapshot, Verbosity } from './types';

export interface FractionBarHandle {
  readonly widget: FractionBar;
  /** Subscribe to the raw event stream. Returns an unsubscribe function. */
  on(listener: EventListener): () => void;
  describeState(v?: Verbosity): string;
  toSnapshot(): FractionBarSnapshot;
  applyExternalState(s: FractionBarSnapshot): void;
  destroy(): void;
}

/**
 * Mount a FractionBar into `el`. Throws on an invalid config — a content error must fail loudly
 * at build/mount time rather than degrade quietly in front of a learner
 * (00-kit-overview.md §2.1).
 */
export function mountFractionBar(el: HTMLElement, config: FractionBarConfig): FractionBarHandle {
  const widget = new FractionBar(el, config);
  return {
    widget,
    on: (listener) => widget.on(listener),
    describeState: (v) => widget.describeState(v),
    toSnapshot: () => widget.toSnapshot(),
    applyExternalState: (s) => widget.applyExternalState(s),
    destroy: () => widget.destroy(),
  };
}

export { FractionBar, validateFractionBarConfig };
export type { FractionBarConfig, FractionBarSnapshot, EventListener };
