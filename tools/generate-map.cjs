/**
 * Generate a static SVG world map for Act IV, once, at authoring time.
 * Natural Earth data via world-atlas (public domain). The output is a plain
 * SVG component with no runtime dependency — world-atlas and topojson-client
 * are devDependencies and never reach the browser.
 */
const fs = require('fs');
const topojson = require('topojson-client');

const topo = JSON.parse(fs.readFileSync('node_modules/world-atlas/countries-110m.json', 'utf8'));
const fc = topojson.feature(topo, topo.objects.countries);

// Trading partners tracked on /bloc. EU is drawn as its member states.
const EU = new Set(['Germany','France','Netherlands','Belgium','Spain','Italy','Poland','Sweden',
  'Denmark','Finland','Ireland','Austria','Portugal','Greece','Czechia','Romania','Hungary',
  'Bulgaria','Slovakia','Croatia','Lithuania','Slovenia','Latvia','Estonia','Luxembourg','Cyprus','Malta']);
const ROLE = new Map([
  ['Canada','home'],
  ['United States of America','incumbent'],
  ['United Kingdom','partner'], ['China','partner'], ['Japan','partner'],
  ['Mexico','partner'], ['South Korea','partner'], ['India','partner'],
  ['Australia','partner'], ['Norway','partner'], ['Singapore','partner'],
]);

// Equirectangular, clipped to drop most of Antarctica and the empty far south.
const W = 1000, H = 460, LAT_TOP = 84, LAT_BOTTOM = -56;
const project = ([lon, lat]) => [
  ((lon + 180) / 360) * W,
  ((LAT_TOP - lat) / (LAT_TOP - LAT_BOTTOM)) * H,
];

const round = n => Math.round(n);

/** Shoelace area in projected units — used to drop specks. */
function area(pts) {
  let a = 0;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    a += pts[j][0] * pts[i][1] - pts[i][0] * pts[j][1];
  }
  return Math.abs(a / 2);
}

/**
 * Perpendicular-distance simplification. At this size the map is a diagram,
 * not a chart: a coastline rendered to 0.1px is 80KB of detail nobody can see.
 */
function simplify(pts, tol) {
  if (pts.length < 4) return pts;
  const last = pts.length - 1;
  const keep = new Array(pts.length).fill(false);
  keep[0] = keep[last] = true;

  // A ring's first and last point are the same, so the baseline from one to
  // the other has zero length and every perpendicular distance computes as 0 —
  // which collapses the whole ring to two points. Seed the recursion at the
  // vertex farthest from the start so there are two real segments to work on.
  let far = 0, farD = -1;
  for (let i = 1; i < last; i++) {
    const d = Math.hypot(pts[i][0] - pts[0][0], pts[i][1] - pts[0][1]);
    if (d > farD) { farD = d; far = i; }
  }
  if (far === 0) return pts;
  keep[far] = true;
  const stack = [[0, far], [far, last]];
  while (stack.length) {
    const [lo, hi] = stack.pop();
    let maxD = 0, idx = -1;
    const [ax, ay] = pts[lo], [bx, by] = pts[hi];
    const dx = bx - ax, dy = by - ay;
    const len = Math.hypot(dx, dy) || 1;
    for (let i = lo + 1; i < hi; i++) {
      const d = Math.abs((pts[i][0] - ax) * dy - (pts[i][1] - ay) * dx) / len;
      if (d > maxD) { maxD = d; idx = i; }
    }
    if (maxD > tol && idx > 0) { keep[idx] = true; stack.push([lo, idx], [idx, hi]); }
  }
  return pts.filter((_, i) => keep[i]);
}

const MIN_AREA = 3;   // projected px^2 — drops specks, keeps real islands
const TOL = 0.8;      // px of allowed deviation

function ringToPath(ring) {
  let pts = ring.map(project);
  if (area(pts) < MIN_AREA) return '';
  pts = simplify(pts, TOL);
  if (pts.length < 3) return '';
  let d = '';
  for (let i = 0; i < pts.length; i++) {
    d += (i ? 'L' : 'M') + round(pts[i][0]) + ' ' + round(pts[i][1]);
  }
  return d + 'Z';
}
function geomToPath(g) {
  if (!g) return '';
  if (g.type === 'Polygon') return g.coordinates.map(ringToPath).join('');
  if (g.type === 'MultiPolygon') return g.coordinates.flat().map(ringToPath).join('');
  return '';
}

const base = [], marked = [];
for (const f of fc.features) {
  const name = f.properties && f.properties.name;
  const d = geomToPath(f.geometry);
  if (!d) continue;
  const role = ROLE.get(name) || (EU.has(name) ? 'partner' : null);
  if (role) marked.push({ name, role, d });
  else base.push(d);
}

/**
 * City-states that do not exist at 110m resolution. They are real trading
 * partners, so the map must agree with the table rather than quietly omitting
 * them; a small marker is honest where a sub-pixel polygon is not.
 */
const MARKERS = [
  { name: 'Singapore', lon: 103.8, lat: 1.35, role: 'partner' },
];

const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
const svg = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="World map. Canada highlighted, its trading partners marked, the United States shown separately." class="map">
  <g class="rest">${base.map(d=>`<path d="${d}"/>`).join('')}</g>
${marked.map(m=>`  <path class="${m.role}" data-name="${esc(m.name)}" d="${m.d}"><title>${esc(m.name)}</title></path>`).join('\n')}
${MARKERS.map(m=>{const [x,y]=project([m.lon,m.lat]);
  return `  <circle class="${m.role} marker" data-name="${esc(m.name)}" cx="${round(x)}" cy="${round(y)}" r="4"><title>${esc(m.name)}</title></circle>`;}).join('\n')}
</svg>`;

fs.mkdirSync('src/components/map', { recursive: true });
fs.writeFileSync('src/components/map/world.svg', svg);
const kb = Math.round(Buffer.byteLength(svg) / 1024);
console.log(`world.svg  ${kb}KB  ${base.length} background, ${marked.length} marked`);
console.log('markers:', MARKERS.map(m=>m.name).join(', '));
console.log('marked:', marked.map(m=>`${m.name}(${m.role})`).slice(0,12).join(', '), '…');
