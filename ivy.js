// Landing screen: ivy vines that grow in from the edges + a typing line.

const SVG_NS = 'http://www.w3.org/2000/svg';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Small seeded random generator so the vines look the same on every visit.
function rng(seed) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}

// A three-lobed ivy leaf, pointing "up" from its stem at (0, 0).
const LEAF = 'M0 0C-2-3-9-4-10-9C-7-10-5-9-4-10C-5-14-2-18 0-21C2-18 5-14 4-10C5-9 7-10 10-9C9-4 2-3 0 0Z';
const VEIN = 'M0 0L0-16M0-8L-6-11M0-8L6-11';

function el(name, attrs, parent) {
  const node = document.createElementNS(SVG_NS, name);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
  parent?.appendChild(node);
  return node;
}

// Smooth path through points (quadratic curves between midpoints).
function smoothPath(pts) {
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const mx = (pts[i][0] + pts[i + 1][0]) / 2;
    const my = (pts[i][1] + pts[i + 1][1]) / 2;
    d += `Q${pts[i][0].toFixed(1)} ${pts[i][1].toFixed(1)} ${mx.toFixed(1)} ${my.toFixed(1)}`;
  }
  const last = pts.at(-1);
  return d + `L${last[0].toFixed(1)} ${last[1].toFixed(1)}`;
}

function walk(rand, x, y, angle, steps, stepLen) {
  const pts = [[x, y]];
  let wobble = rand() * Math.PI * 2;
  for (let i = 0; i < steps; i++) {
    wobble += 0.55 + rand() * 0.3;
    angle += Math.sin(wobble) * 0.32 + (rand() - 0.5) * 0.15;
    x += Math.cos(angle) * stepLen;
    y += Math.sin(angle) * stepLen;
    pts.push([x, y]);
  }
  return pts;
}

function addVine(svg, rand, pts, { delay, duration, leafEvery, leafScale, depth }) {
  const g = el('g', { class: 'vine' }, svg);
  const path = el('path', { d: smoothPath(pts), class: 'stem' }, g);
  const len = path.getTotalLength();
  path.style.strokeDasharray = len;
  path.style.strokeDashoffset = reduceMotion ? 0 : len;
  path.style.setProperty('--len', len);
  path.style.animationDelay = `${delay}s`;
  path.style.animationDuration = `${duration}s`;

  let side = 1;
  for (let s = leafEvery * (0.6 + rand() * 0.5); s < len - 6; s += leafEvery * (0.75 + rand() * 0.5)) {
    const p = path.getPointAtLength(s);
    const q = path.getPointAtLength(Math.min(len, s + 1));
    const tangent = (Math.atan2(q.y - p.y, q.x - p.x) * 180) / Math.PI;
    side = -side;
    const rot = tangent + side * (55 + rand() * 35) + 90;
    const scale = leafScale * (0.7 + rand() * 0.6);
    const leafDelay = delay + (s / len) * duration;

    const outer = el('g', { transform: `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) rotate(${rot.toFixed(1)}) scale(${scale.toFixed(2)})` }, g);
    const leaf = el('g', { class: 'leaf-g' }, outer);
    leaf.style.animationDelay = `${leafDelay.toFixed(2)}s`;
    el('path', { d: LEAF, class: 'leaf' }, leaf);
    el('path', { d: VEIN, class: 'vein' }, leaf);

    // Occasionally sprout a short side branch
    if (depth > 0 && rand() < 0.18) {
      const ang = (tangent * Math.PI) / 180 + side * (0.6 + rand() * 0.6);
      const branch = walk(rand, p.x, p.y, ang, 4 + Math.floor(rand() * 4), 22);
      addVine(svg, rand, branch, { delay: leafDelay, duration: duration * 0.35, leafEvery, leafScale: leafScale * 0.8, depth: depth - 1 });
    }
  }
}

function drawVines() {
  const svg = document.getElementById('vines');
  if (!svg) return;
  const { width: w, height: h } = svg.getBoundingClientRect();
  svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
  svg.replaceChildren();
  const rand = rng(327);
  const step = Math.max(26, Math.min(w, h) / 22);
  const leafScale = Math.max(0.9, Math.min(w, h) / 520);
  const opts = { duration: 3.2, leafEvery: step * 0.9, leafScale, depth: 1 };

  // Vines creeping in from the corners and edges
  const starts = [
    [-10, h * 0.08, 0.35, 0.0, 14],          // top-left, heading right/down
    [w * 0.12, -10, 1.25, 0.3, 11],          // top edge, heading down
    [w + 10, h * 0.9, Math.PI + 0.25, 0.5, 14], // bottom-right, heading left/up
    [w * 0.92, h + 10, -1.9, 0.8, 10],       // bottom edge, heading up
    [w + 10, h * 0.15, Math.PI - 0.4, 1.1, 8],  // right edge, short
  ];
  for (const [x, y, a, delay, n] of starts) {
    addVine(svg, rand, walk(rand, x, y, a, n, step), { ...opts, delay });
  }
}

function typeLoop() {
  const target = document.getElementById('typed');
  if (!target) return;
  const phrases = [
    'data-driven products.',
    'machine learning people actually use.',
    'user insights & A/B testing.',
    'human-centered AI.',
  ];
  if (reduceMotion) { target.textContent = phrases[0]; return; }
  let i = 0, n = 0, deleting = false;
  const tick = () => {
    const word = phrases[i];
    n += deleting ? -1 : 1;
    target.textContent = word.slice(0, n);
    let wait = deleting ? 35 : 70;
    if (!deleting && n === word.length) { deleting = true; wait = 1800; }
    else if (deleting && n === 0) { deleting = false; i = (i + 1) % phrases.length; wait = 350; }
    setTimeout(tick, wait);
  };
  setTimeout(tick, 900);
}

drawVines();
typeLoop();
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(drawVines, 250);
});
