/**
 * DOM helpers for widget chrome.
 *
 * Controls are real DOM buttons, not canvas hit-boxes. That is deliberate: it gives keyboard
 * parity (kit §4.5), focus rings, native screen-reader roles and a real ordered list for the
 * copy log (fraction-bar.md §6) without reimplementing any of it on a canvas.
 *
 * The canvas paints the mathematics. The DOM owns everything that has a name.
 */

export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className !== undefined) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

export interface ButtonOptions {
  className?: string;
  pressed?: boolean;
  disabled?: boolean;
  ariaLabel?: string;
  describedBy?: string;
}

export function button(
  text: string,
  onClick: () => void,
  opts: ButtonOptions = {},
): HTMLButtonElement {
  const b = el('button', `gt-fb__btn ${opts.className ?? ''}`.trim(), text);
  b.type = 'button';
  if (opts.pressed !== undefined) b.setAttribute('aria-pressed', String(opts.pressed));
  if (opts.ariaLabel !== undefined) b.setAttribute('aria-label', opts.ariaLabel);
  if (opts.describedBy !== undefined) b.setAttribute('aria-describedby', opts.describedBy);
  b.disabled = opts.disabled === true;
  b.addEventListener('click', (ev) => {
    ev.preventDefault();
    if (!b.disabled) onClick();
  });
  return b;
}

/** A labelled control group inside the dockable cluster. */
export function group(name: string, legend: string): HTMLElement {
  const g = el('section', 'gt-fb__group');
  g.dataset.group = name;
  const h = el('h4', 'gt-fb__group-title', legend);
  g.appendChild(h);
  return g;
}

export function row(className = ''): HTMLElement {
  return el('div', `gt-fb__row ${className}`.trim());
}

let uid = 0;
export function nextId(prefix: string): string {
  uid += 1;
  return `${prefix}-${uid}`;
}

export function setText(node: HTMLElement, text: string): void {
  if (node.textContent !== text) node.textContent = text;
}

export function removeAll(node: HTMLElement): void {
  while (node.firstChild !== null) node.removeChild(node.firstChild);
}
