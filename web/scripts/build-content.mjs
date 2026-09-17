// Ganitatva content pipeline: YAML -> validated -> compiled JSON.
//
// ADR-003: content is DATA. This script is the boundary between authoring and engineering,
// and it is deliberately strict — a concept that cannot be validated must not reach a learner.
// It is also the CI gate: bad content fails here, in seconds, on a cheap runner.

import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';
import Ajv from 'ajv/dist/2020.js';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = join(HERE, '..', '..');
const CONTENT = join(REPO, 'content');
const OUT = join(HERE, '..', 'src', 'generated');

const walk = (dir, out = []) => {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (e.endsWith('.yaml') || e.endsWith('.yml')) out.push(p);
  }
  return out;
};

const errors = [];
const fail = (file, msg) => errors.push(`${relative(REPO, file)}: ${msg}`);

// ---- schema ----
const schema = JSON.parse(readFileSync(join(CONTENT, 'schema', 'concept.schema.json'), 'utf8'));
const ajv = new Ajv({ allErrors: true, strict: false });
const validate = ajv.compile(schema);

// ---- graph ----
const graph = parseYaml(readFileSync(join(CONTENT, 'graph', 'prerequisites.yaml'), 'utf8'));
const graphIds = new Set(graph.nodes.map((n) => n.id));

// ---- concepts ----
const files = walk(join(CONTENT, 'concepts'));
const concepts = [];

for (const file of files) {
  let doc;
  try {
    doc = parseYaml(readFileSync(file, 'utf8'));
  } catch (e) {
    fail(file, `YAML parse error: ${e.message}`);
    continue;
  }

  if (!validate(doc)) {
    for (const e of validate.errors ?? []) fail(file, `schema: ${e.instancePath || '/'} ${e.message}`);
    continue;
  }

  // Cross-check against the knowledge graph. A concept whose id isn't a graph node is
  // unreachable by the path engine — it would render but never be assigned to anyone.
  if (!graphIds.has(doc.id)) fail(file, `id "${doc.id}" is not a node in the knowledge graph`);
  for (const p of doc.prerequisites ?? []) {
    if (!graphIds.has(p)) fail(file, `prerequisite "${p}" is not a node in the knowledge graph`);
  }

  // The rule that makes this product what it is, enforced mechanically rather than by review.
  const w = doc.layers?.manipulate?.widget;
  if (!w?.type) fail(file, 'manipulate layer has no widget — no concept ships without one');

  // The intuition layer is meant to be symbol-free. Catch the obvious leaks.
  const intuition = JSON.stringify(doc.layers?.intuition ?? {});
  const leaks = intuition.match(/\$[^$]+\$|\\frac|\b\d+\s*\/\s*\d+\b|÷|×\s*\d/g);
  if (leaks) fail(file, `symbols leaked into the intuition layer: ${[...new Set(leaks)].join(', ')}`);

  concepts.push({ ...doc, _slug: doc.id.split('.').pop() });
}

if (errors.length) {
  console.error(`\n✗ content validation FAILED — ${errors.length} problem(s):\n`);
  for (const e of errors) console.error('  ' + e);
  console.error('');
  process.exit(1);
}

mkdirSync(OUT, { recursive: true });
concepts.sort((a, b) => (a.level ?? 0) - (b.level ?? 0) || a.id.localeCompare(b.id));
writeFileSync(join(OUT, 'concepts.json'), JSON.stringify(concepts, null, 2));
writeFileSync(
  join(OUT, 'graph.json'),
  JSON.stringify({ meta: graph.meta, nodes: graph.nodes }, null, 2)
);

console.log(`✓ ${concepts.length} concepts validated and compiled`);
console.log(`✓ graph: ${graph.nodes.length} nodes`);
for (const c of concepts) console.log(`    ${c.level ?? '?'}  ${c._slug.padEnd(34)} ${c.layers.manipulate.widget.type}`);
