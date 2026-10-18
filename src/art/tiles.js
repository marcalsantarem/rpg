// Tileset 16x16 gerado em código: chão com variações, bordas automáticas (autotile),
// casas, florestas, cavernas e objetos de cenário.
import { makeCanvas, rng, px, rect, disc, ellipse, line, poly, outlineCanvas, addTexture, addSheet, shade, mix } from '../core/Pixel.js';
import { drawObj } from './objects.js';

const T = 16;
const COLS = 32;
const TAU = Math.PI * 2;
const BAYER = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];
const dth = (x, y) => (BAYER[y & 3][x & 3] + 0.5) / 16;
const clamp01 = (v) => Math.max(0, Math.min(1, v));

// Ruído de valor periódico (período = 16 px), para texturas que se repetem sem emendas.
function pnoise(seed, n) {
  const r = rng(seed);
  const g = Array.from({ length: n * n }, () => r());
  const at = (x, y) => g[(((y % n) + n) % n) * n + (((x % n) + n) % n)];
  return (x, y) => {
    const fx = (x / T) * n;
    const fy = (y / T) * n;
    const x0 = Math.floor(fx);
    const y0 = Math.floor(fy);
    const tx = fx - x0;
    const ty = fy - y0;
    const sx = tx * tx * (3 - 2 * tx);
    const sy = ty * ty * (3 - 2 * ty);
    const a = at(x0, y0) + (at(x0 + 1, y0) - at(x0, y0)) * sx;
    const b = at(x0, y0 + 1) + (at(x0 + 1, y0 + 1) - at(x0, y0 + 1)) * sx;
    return a + (b - a) * sy;
  };
}

// Textura manchada com rampa de cores e pontilhado ordenado (dithering).
function mottled(ctx, ox, oy, seed, ramp, contrast = 1) {
  const n1 = pnoise(seed, 4);
  const n2 = pnoise(seed + 11, 8);
  const k = ramp.length;
  for (let y = 0; y < T; y++)
    for (let x = 0; x < T; x++) {
      let v = n1(x, y) * 0.65 + n2(x, y) * 0.35;
      v = clamp01(0.5 + (v - 0.5) * 1.8 * contrast);
      const idx = v * (k - 1);
      const i0 = Math.floor(idx);
      const c = idx - i0 > dth(x, y) ? ramp[Math.min(k - 1, i0 + 1)] : ramp[i0];
      px(ctx, ox + x, oy + y, c);
    }
}

function blades(ctx, ox, oy, seed, count, dark, light, hi) {
  const r = rng(seed);
  for (let i = 0; i < count; i++) {
    const x = Math.floor(r() * T);
    const y = 3 + Math.floor(r() * 12);
    px(ctx, ox + x, oy + y, dark);
    px(ctx, ox + ((x + 15) % T), oy + y - 1, light);
    px(ctx, ox + ((x + 1) % T), oy + y - 1, light);
    px(ctx, ox + x, oy + y - 2, hi);
  }
}

function specks(ctx, ox, oy, seed, count, colors) {
  const r = rng(seed);
  for (let i = 0; i < count; i++) px(ctx, ox + Math.floor(r() * T), oy + Math.floor(r() * T), colors[Math.floor(r() * colors.length)]);
}

// ---------------------------------------------------------------- paletas
const PAL = {
  grass: ['#3a6234', '#41693a', '#487240', '#517c47'],
  grassBlade: ['#2f5129', '#64974f', '#7fb062'],
  dgrass: ['#1d2d2a', '#233733', '#2a413b', '#324c44'],
  dgrassBlade: ['#162320', '#3e6458', '#5a8a78'],
  dirt: ['#5e4a32', '#6c573b', '#7a6545', '#88734f'],
  ddirt: ['#3a3030', '#443838', '#4e4240', '#5a4c48'],
  cave: ['#2e2a34', '#36313c', '#3e3944', '#47414e'],
  water: ['#1a3352', '#1f3d60', '#25496e'],
  cwater: ['#141e34', '#182640', '#1e2e4c'],
};

// ---------------------------------------------------------------- chão
function grass(ctx, ox, oy, v) {
  mottled(ctx, ox, oy, 100 + v * 31, PAL.grass, 0.7);
  const [d, l, h] = PAL.grassBlade;
  blades(ctx, ox, oy, 300 + v * 17, v === 3 ? 9 : 5, d, l, h);
}

function darkgrass(ctx, ox, oy, v) {
  mottled(ctx, ox, oy, 140 + v * 29, PAL.dgrass, 0.7);
  const [d, l, h] = PAL.dgrassBlade;
  blades(ctx, ox, oy, 340 + v * 13, 5, d, l, h);
  if (v === 2) specks(ctx, ox, oy, 77, 3, ['#6a5a8a']);
}

function caveFloor(ctx, ox, oy, v) {
  mottled(ctx, ox, oy, 180 + v * 23, PAL.cave, 0.9);
  const r = rng(380 + v);
  for (let i = 0; i < 3; i++) {
    const x = Math.floor(r() * 13) + 1;
    const y = Math.floor(r() * 13) + 1;
    px(ctx, ox + x, oy + y, '#57505e');
    px(ctx, ox + x + 1, oy + y, '#57505e');
    px(ctx, ox + x, oy + y + 1, '#1f1c24');
    px(ctx, ox + x + 1, oy + y + 1, '#1f1c24');
  }
  if (v === 1) {
    line(ctx, ox + 3, oy + 11, ox + 7, oy + 9, '#24202a');
    line(ctx, ox + 7, oy + 9, ox + 9, oy + 10, '#24202a');
  }
}

function dirtFill(ctx, ox, oy, seed = 200) {
  mottled(ctx, ox, oy, seed, PAL.dirt, 0.8);
  const r = rng(seed + 5);
  for (let i = 0; i < 4; i++) {
    const x = Math.floor(r() * 15);
    const y = Math.floor(r() * 15);
    px(ctx, ox + x, oy + y, '#9a8660');
    px(ctx, ox + x, oy + y + 1, '#4a3a26');
  }
}

function ddirtFill(ctx, ox, oy) {
  mottled(ctx, ox, oy, 230, PAL.ddirt, 0.8);
  specks(ctx, ox, oy, 231, 5, ['#6a5c58', '#2a2222']);
}

function cobbleFill(ctx, ox, oy) {
  rect(ctx, ox, oy, T, T, '#38343e');
  // pedras em grade irregular (periódica)
  const stones = [
    [0, 0, 6, 5], [6, 0, 5, 5], [11, 0, 5, 5], [0, 5, 4, 6], [4, 5, 7, 5], [11, 5, 5, 6], [0, 11, 6, 5], [6, 10, 5, 6], [11, 11, 5, 5],
  ];
  const r = rng(250);
  for (const [x, y, w, h] of stones) {
    const base = ['#76727e', '#6c6874', '#807b88', '#706a76'][Math.floor(r() * 4)];
    rect(ctx, ox + x + 1, oy + y + 1, w - 1, h - 1, base);
    rect(ctx, ox + x + 1, oy + y + 1, w - 1, 1, shade(base, 0.22));
    rect(ctx, ox + x + 1, oy + y + 1, 1, h - 1, shade(base, 0.12));
    rect(ctx, ox + x + 1, oy + y + h - 1, w - 1, 1, shade(base, -0.28));
    rect(ctx, ox + x + w - 1, oy + y + 1, 1, h - 1, shade(base, -0.18));
  }
}

function waterFill(ctx, ox, oy, frame, pal = PAL.water) {
  mottled(ctx, ox, oy, 260, pal, 0.7);
  const hl = shade(pal[2], 0.35);
  const sp = shade(pal[2], 0.7);
  for (let i = 0; i < 4; i++) {
    const y = (i * 4 + 1 + frame * 2) % T;
    const x = (i * 5 + frame * 3) % T;
    for (let k = 0; k < 4; k++) px(ctx, ox + ((x + k) % T), oy + y, hl);
  }
  px(ctx, ox + ((3 + frame * 7) % T), oy + ((9 + frame * 5) % T), sp);
}

function woodFloor(ctx, ox, oy, v) {
  const tones = ['#6e4c30', '#7a5636', '#664628', '#74502f'];
  const r = rng(400 + v);
  for (let row = 0; row < 4; row++) {
    const y = row * 4;
    const c = tones[(row + v) % 4];
    rect(ctx, ox, oy + y, T, 4, c);
    rect(ctx, ox, oy + y, T, 1, shade(c, 0.12));
    rect(ctx, ox, oy + y + 3, T, 1, '#3e2a1a');
    const seam = (row * 7 + v * 5) % 14 + 1;
    rect(ctx, ox + seam, oy + y, 1, 3, '#3e2a1a');
    for (let i = 0; i < 3; i++) px(ctx, ox + Math.floor(r() * T), oy + y + 1 + Math.floor(r() * 2), shade(c, -0.12));
  }
}

function stoneFloor(ctx, ox, oy, v) {
  mottled(ctx, ox, oy, 420 + v * 9, ['#45424e', '#4c4956', '#54515e'], 0.6);
  rect(ctx, ox, oy, T, 1, '#2c2a34');
  rect(ctx, ox, oy, 1, T, '#2c2a34');
  rect(ctx, ox + 1, oy + 1, T - 1, 1, '#5e5b68');
  if (v !== 1) {
    rect(ctx, ox + 8, oy + 8, 8, 1, '#2c2a34');
    rect(ctx, ox + 8, oy, 1, 8, '#2c2a34');
  }
}

// ---------------------------------------------------------------- autotile genérico
// mask: bit 1=N, 2=L, 4=S, 8=O indicam vizinho do mesmo terreno.
function edgeAuto(ctx, ox, oy, mask, spec) {
  const tmp = makeCanvas(T, T);
  spec.fill(tmp.ctx, 0, 0);
  const fd = tmp.ctx.getImageData(0, 0, T, T).data;
  spec.under(ctx, ox, oy);
  const img = ctx.getImageData(ox, oy, T, T);
  const d0 = img.data;
  const w = spec.w ?? 2;
  const amp = spec.amp ?? 1;
  const s = spec.seed ?? 1;
  const jit = (t, side) => amp * (0.6 * Math.sin((TAU * t) / T + s + side) + 0.4 * Math.sin((TAU * 3 * t) / T + s * 2 + side * 1.7));
  const hex = (c) => [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)];
  const rimIn = spec.rimIn && hex(spec.rimIn);
  const rimIn2 = spec.rimIn2 && hex(spec.rimIn2);
  for (let y = 0; y < T; y++)
    for (let x = 0; x < T; x++) {
      let d = 99;
      if (!(mask & 1)) d = Math.min(d, y - (w + jit(x, 0)));
      if (!(mask & 2)) d = Math.min(d, 15 - x - (w + jit(y, 1)));
      if (!(mask & 4)) d = Math.min(d, 15 - y - (w + jit(x, 2)));
      if (!(mask & 8)) d = Math.min(d, x - (w + jit(y, 3)));
      const i = (y * T + x) * 4;
      if (d >= 0) {
        let c = [fd[i], fd[i + 1], fd[i + 2]];
        if (d < 1 && rimIn) c = rimIn;
        else if (d < 2 && rimIn2) c = rimIn2;
        d0[i] = c[0];
        d0[i + 1] = c[1];
        d0[i + 2] = c[2];
        d0[i + 3] = 255;
      } else if (d > -1.01 && spec.shadowOut) {
        const f = 1 - spec.shadowOut;
        d0[i] *= f;
        d0[i + 1] *= f;
        d0[i + 2] *= f;
      }
    }
  ctx.putImageData(img, ox, oy);
}

// ---------------------------------------------------------------- folhagem
function leafCluster(ctx, cx, cy, r, ramp) {
  disc(ctx, cx, cy, r, ramp[0]);
  disc(ctx, cx - 1, cy - 1, Math.max(1, r - 1), ramp[1]);
  const o = Math.max(1, Math.floor(r / 3));
  disc(ctx, cx - 1 - o, cy - 1 - o, Math.max(1, r - 3), ramp[2]);
  px(ctx, cx - o - 1, cy - o - 2, ramp[3]);
  px(ctx, cx - o, cy - o - 2, ramp[3]);
}

const LEAF = {
  oak: ['#1e3a22', '#2c5230', '#3f6e3c', '#6a9a56'],
  pine: ['#14302a', '#1e4436', '#2c5a46', '#4a7c5c'],
  dark: ['#14262c', '#1c3a40', '#2a5254', '#4a8078'],
  forest: ['#173020', '#22432a', '#315c36', '#4f7f48'],
  dforest: ['#101e24', '#172c32', '#22403f', '#3a6a60'],
};

// Copa contínua (repete sem emendas)
function canopyLayer(ctx, ramp, seed) {
  rect(ctx, 0, 0, T, T, ramp[0]);
  const r = rng(seed);
  const pts = [[2, 2], [9, 1], [14, 6], [5, 8], [12, 11], [1, 12], [8, 14], [15, 15], [6, 4]].map(([x, y]) => [
    (x + Math.floor(r() * 5)) % T,
    (y + Math.floor(r() * 5)) % T,
  ]);
  for (const [bx, by] of pts) {
    const rad = 3 + Math.floor(r() * 3);
    for (const dx of [-16, 0, 16]) for (const dy of [-16, 0, 16]) leafCluster(ctx, bx + dx, by + dy, rad, ramp);
  }
}

function forestAuto(ctx, ox, oy, mask, ramp, under, trunk = '#4a3424', seed = 600) {
  under(ctx, ox, oy);
  const tmp = makeCanvas(T, T);
  canopyLayer(tmp.ctx, ramp, seed);
  const cd = tmp.ctx.getImageData(0, 0, T, T).data;
  const bump = (t) => 2.4 * Math.abs(Math.sin((Math.PI * (t + 2)) / 8));
  const openS = !(mask & 4);
  const keep = (x, y) => {
    if (x < 0 || y < 0 || x >= T || y >= T) return true;
    if (!(mask & 1) && y < 1 + bump(x)) return false;
    if (!(mask & 8) && x < 1 + bump(y)) return false;
    if (!(mask & 2) && x > 14 - bump(y)) return false;
    if (openS && y > 8 - bump(x) * 0.6) return false;
    return true;
  };
  if (openS) {
    // troncos e sombra sob a borda da mata
    ellipse(ctx, ox + 8, oy + 14, 8, 2, 'rgba(0,0,0,0.28)');
    for (const tx of [3, 11]) {
      rect(ctx, ox + tx, oy + 7, 3, 7, trunk);
      rect(ctx, ox + tx, oy + 7, 1, 7, shade(trunk, -0.35));
      rect(ctx, ox + tx + 2, oy + 7, 1, 7, shade(trunk, 0.2));
      px(ctx, ox + tx - 1, oy + 13, shade(trunk, -0.35));
      px(ctx, ox + tx + 3, oy + 13, shade(trunk, -0.2));
    }
  }
  const outline = shade(ramp[0], -0.55);
  for (let y = 0; y < T; y++)
    for (let x = 0; x < T; x++) {
      if (!keep(x, y)) continue;
      const i = (y * T + x) * 4;
      const edge = !keep(x - 1, y) || !keep(x + 1, y) || !keep(x, y - 1) || !keep(x, y + 1);
      ctx.fillStyle = edge ? outline : `rgb(${cd[i]},${cd[i + 1]},${cd[i + 2]})`;
      ctx.fillRect(ox + x, oy + y, 1, 1);
    }
}

// ---------------------------------------------------------------- caverna
function caveWallAuto(ctx, ox, oy, mask) {
  caveFloor(ctx, ox, oy, 0);
  const openS = !(mask & 4);
  const topH = openS ? 6 : T;
  // topo da rocha
  const tmp = makeCanvas(T, T);
  mottled(tmp.ctx, 0, 0, 700, ['#1a161e', '#211c26', '#29232e'], 0.9);
  line(tmp.ctx, 2, 4, 6, 6, '#352d3a');
  line(tmp.ctx, 6, 6, 9, 5, '#352d3a');
  line(tmp.ctx, 10, 12, 14, 11, '#352d3a');
  ctx.drawImage(tmp.canvas, 0, 0, T, topH, ox, oy, T, topH);
  if (openS) {
    // face do paredão
    for (let y = 6; y < T; y++) {
      const t = (y - 6) / 9;
      rect(ctx, ox, oy + y, T, 1, mix('#5a4f62', '#352e3c', t));
    }
    const r = rng(710 + mask);
    for (let x = 0; x < T; x += 3 + Math.floor(r() * 2)) {
      const h = 3 + Math.floor(r() * 6);
      rect(ctx, ox + x, oy + 6, 1, h, '#2a2430');
      px(ctx, ox + x + 1, oy + 7, '#73677c');
    }
    rect(ctx, ox, oy + 6, T, 1, '#7a6e84');
    rect(ctx, ox, oy + 15, T, 1, '#16121a');
    // gotas/estalactites
    for (const x of [3, 9, 13]) {
      px(ctx, ox + x, oy + 15, '#4a4054');
    }
  }
  // bordas
  const rim = '#3e3546';
  const dark = '#0e0b12';
  if (!(mask & 1)) {
    rect(ctx, ox, oy, T, 1, dark);
    rect(ctx, ox, oy + 1, T, 1, rim);
  }
  if (!(mask & 8)) {
    rect(ctx, ox, oy, 1, topH, dark);
    rect(ctx, ox + 1, oy, 1, topH, rim);
  }
  if (!(mask & 2)) {
    rect(ctx, ox + 15, oy, 1, topH, dark);
    rect(ctx, ox + 14, oy, 1, topH, '#15111a');
  }
}

// ---------------------------------------------------------------- telhados e paredes
function roofAuto(ctx, ox, oy, mask, pal) {
  const [base, dark, light, ridge] = pal;
  rect(ctx, ox, oy, T, T, base);
  const r = rng(800 + mask);
  for (let row = 0; row < 4; row++) {
    const y = row * 4;
    const off = row % 2 ? 0 : 2;
    rect(ctx, ox, oy + y, T, 1, light);
    rect(ctx, ox, oy + y + 3, T, 1, dark);
    for (let x = off; x < T; x += 4) {
      rect(ctx, ox + x, oy + y + 1, 1, 2, dark);
      if (r() < 0.25) px(ctx, ox + x + 1, oy + y + 1, shade(base, 0.12));
    }
  }
  if (r() < 0.5) px(ctx, ox + 2 + Math.floor(r() * 12), oy + 5 + Math.floor(r() * 6), '#4a6a3a');
  if (!(mask & 1)) {
    rect(ctx, ox, oy, T, 3, ridge);
    rect(ctx, ox, oy, T, 1, shade(ridge, 0.3));
    rect(ctx, ox, oy + 3, T, 1, shade(ridge, -0.4));
  }
  if (!(mask & 4)) {
    rect(ctx, ox, oy + 13, T, 2, shade(dark, -0.2));
    rect(ctx, ox, oy + 15, T, 1, '#140c0c');
    rect(ctx, ox, oy + 12, T, 1, light);
  }
  if (!(mask & 8)) {
    rect(ctx, ox, oy, 2, T, '#4a3020');
    rect(ctx, ox, oy, 1, T, '#24160c');
  }
  if (!(mask & 2)) {
    rect(ctx, ox + 14, oy, 2, T, '#3a2414');
    rect(ctx, ox + 15, oy, 1, T, '#24160c');
  }
}

const TIMBER = '#4a3222';
function houseWall(ctx, ox, oy, mask, kind) {
  // reboco
  mottled(ctx, ox, oy, 820, ['#b0a080', '#bcac8c', '#c6b898'], 0.5);
  // sombra do beiral + viga superior
  rect(ctx, ox, oy, T, 2, TIMBER);
  rect(ctx, ox, oy + 2, T, 1, '#8a7c62');
  // fundação de pedra
  rect(ctx, ox, oy + 13, T, 3, '#5a5662');
  for (let x = 0; x < T; x += 4) {
    rect(ctx, ox + x, oy + 13, 1, 3, '#3e3a46');
    px(ctx, ox + x + 1, oy + 13, '#76727e');
  }
  rect(ctx, ox, oy + 15, T, 1, '#2a2630');
  if (!(mask & 8)) rect(ctx, ox, oy, 2, 13, TIMBER);
  if (!(mask & 2)) rect(ctx, ox + 14, oy, 2, 13, TIMBER);
  if (kind === 'wall') {
    line(ctx, ox + 3, oy + 12, ox + 12, oy + 3, TIMBER);
    line(ctx, ox + 4, oy + 12, ox + 13, oy + 3, TIMBER);
  } else if (kind === 'win') {
    rect(ctx, ox + 3, oy + 3, 10, 8, TIMBER);
    rect(ctx, ox + 4, oy + 4, 8, 6, '#f0c860');
    rect(ctx, ox + 4, oy + 4, 8, 1, '#f8e8a8');
    rect(ctx, ox + 7, oy + 4, 2, 6, TIMBER);
    rect(ctx, ox + 4, oy + 6, 8, 1, TIMBER);
    // floreira
    rect(ctx, ox + 3, oy + 11, 10, 2, '#6a4428');
    for (const [x, c] of [[4, '#d84a4a'], [6, '#f0d050'], [8, '#d84a4a'], [10, '#e88ad0'], [11, '#f0d050']]) px(ctx, ox + x, oy + 10, c);
    for (const x of [5, 7, 9]) px(ctx, ox + x, oy + 10, '#3e7a3a');
  } else if (kind === 'door') {
    rect(ctx, ox + 3, oy + 3, 10, 13, '#2a1a10');
    rect(ctx, ox + 4, oy + 4, 8, 12, '#7a5030');
    rect(ctx, ox + 5, oy + 3, 6, 1, '#2a1a10');
    for (const x of [6, 9]) rect(ctx, ox + x, oy + 4, 1, 12, '#5a3820');
    rect(ctx, ox + 4, oy + 7, 8, 1, '#4a4650');
    rect(ctx, ox + 4, oy + 12, 8, 1, '#4a4650');
    px(ctx, ox + 10, oy + 10, '#e0c060');
    rect(ctx, ox + 2, oy + 15, 12, 1, '#6a6672');
  }
}

function stoneWall(ctx, ox, oy, mask, kind) {
  rect(ctx, ox, oy, T, T, '#6a6876');
  const r = rng(900);
  for (let row = 0; row < 4; row++) {
    const y = row * 4;
    const off = row % 2 ? 0 : 4;
    for (let x = -off; x < T; x += 8) {
      const c = ['#74727e', '#6a6876', '#7c7a86', '#62606e'][Math.floor(r() * 4)];
      rect(ctx, ox + Math.max(0, x), oy + y, Math.min(7, 7 + x, T - x), 3, c);
      rect(ctx, ox + Math.max(0, x), oy + y, Math.min(7, 7 + x, T - x), 1, shade(c, 0.18));
    }
    rect(ctx, ox, oy + y + 3, T, 1, '#44424e');
  }
  if (r() < 0.6) px(ctx, ox + 3, oy + 14, '#4a6a3a');
  if (!(mask & 8)) {
    rect(ctx, ox, oy, 3, T, '#585664');
    rect(ctx, ox + 2, oy, 1, T, '#3c3a46');
  }
  if (!(mask & 2)) {
    rect(ctx, ox + 13, oy, 3, T, '#585664');
    rect(ctx, ox + 13, oy, 1, T, '#7e7c8a');
  }
  if (kind === 'win') {
    rect(ctx, ox + 5, oy + 2, 6, 12, '#2a2634');
    rect(ctx, ox + 6, oy + 4, 4, 9, '#3a5ab0');
    rect(ctx, ox + 7, oy + 3, 2, 1, '#3a5ab0');
    px(ctx, ox + 7, oy + 5, '#f0d060');
    px(ctx, ox + 8, oy + 7, '#d04050');
    px(ctx, ox + 7, oy + 9, '#80c0f0');
    px(ctx, ox + 8, oy + 11, '#f0d060');
    rect(ctx, ox + 6, oy + 8, 4, 1, '#2a2634');
  } else if (kind === 'door') {
    rect(ctx, ox + 3, oy + 2, 10, 14, '#2a2026');
    rect(ctx, ox + 4, oy + 4, 8, 12, '#6a4428');
    rect(ctx, ox + 5, oy + 3, 6, 1, '#6a4428');
    rect(ctx, ox + 7, oy + 3, 2, 13, '#3a2416');
    for (const y of [6, 11]) rect(ctx, ox + 4, oy + y, 8, 1, '#8a8694');
    px(ctx, ox + 6, oy + 9, '#e0c060');
    px(ctx, ox + 9, oy + 9, '#e0c060');
  }
}

function intWall(ctx, ox, oy, kind) {
  rect(ctx, ox, oy, T, 10, '#5a4660');
  for (let y = 1; y < 10; y += 4)
    for (let x = (y % 8 === 1 ? 0 : 2); x < T; x += 4) {
      px(ctx, ox + x, oy + y, '#6a5470');
      px(ctx, ox + x + 1, oy + y + 1, '#6a5470');
    }
  rect(ctx, ox, oy + 10, T, 6, '#5a3c26');
  rect(ctx, ox, oy + 10, T, 1, '#8a6440');
  for (let x = 0; x < T; x += 4) rect(ctx, ox + x, oy + 11, 1, 4, '#462e1c');
  rect(ctx, ox, oy + 15, T, 1, '#2a1a10');
  if (kind === 'shelf') {
    rect(ctx, ox + 1, oy, 14, 16, '#3a2414');
    const r = rng(950);
    for (let y = 1; y < 15; y += 5) {
      for (let x = 2; x < 14; x += 2) {
        const h = 3 + Math.floor(r() * 2);
        rect(ctx, ox + x, oy + y + 4 - h, 2, h, ['#8a2a2a', '#2a4a7a', '#6a6a2a', '#4a2a6a', '#2a6a4a'][Math.floor(r() * 5)]);
        px(ctx, ox + x, oy + y + 4 - h, '#d8c890');
      }
      rect(ctx, ox + 2, oy + y + 4, 12, 1, '#6a4428');
    }
  } else if (kind === 'fire') {
    rect(ctx, ox + 1, oy + 1, 14, 15, '#6a6676');
    rect(ctx, ox + 1, oy + 1, 14, 2, '#8a8694');
    rect(ctx, ox + 3, oy + 6, 10, 10, '#140c0c');
    poly(ctx, [[4, 16], [6, 9], [8, 12], [10, 8], [12, 16]].map(([x, y]) => [ox + x, oy + y]), '#e05a20');
    poly(ctx, [[6, 16], [8, 11], [10, 16]].map(([x, y]) => [ox + x, oy + y]), '#f8c040');
    rect(ctx, ox + 4, oy + 15, 8, 1, '#5a3a20');
  } else if (kind === 'win') {
    rect(ctx, ox + 3, oy + 1, 10, 9, '#3a2416');
    rect(ctx, ox + 4, oy + 2, 8, 7, '#3a5a8a');
    rect(ctx, ox + 4, oy + 2, 8, 1, '#7aa0d0');
    rect(ctx, ox + 7, oy + 2, 2, 7, '#3a2416');
    rect(ctx, ox + 2, oy + 1, 2, 10, '#8a2a3a');
    rect(ctx, ox + 12, oy + 1, 2, 10, '#8a2a3a');
  }
}

// ---------------------------------------------------------------- árvores e objetos grandes
function treeCanvas(kind) {
  const { canvas, ctx } = makeCanvas(16, 32);
  if (kind === 'pine') {
    rect(ctx, 7, 22, 3, 8, '#4a3020');
    rect(ctx, 7, 22, 1, 8, '#2e1c10');
    const p = LEAF.pine;
    for (const [y, w] of [[2, 3], [7, 5], [12, 7], [17, 8]]) {
      poly(ctx, [[8, y], [8 - w, y + 7], [8 + w, y + 7]], p[0]);
      poly(ctx, [[8, y + 1], [8 - w + 2, y + 6], [8 + w - 1, y + 6]], p[1]);
      poly(ctx, [[8, y + 1], [8 - w + 2, y + 5], [9, y + 5]], p[2]);
      px(ctx, 7, y + 2, p[3]);
    }
  } else if (kind === 'ancient') {
    // árvore anciã: tronco largo e retorcido, musgo e vaga-lumes
    const p = LEAF.dark;
    for (const [x, y, rr] of [[8, 6, 6], [3, 9, 4], [13, 9, 4], [8, 12, 5]]) leafCluster(ctx, x, y, rr, p);
    poly(ctx, [[5, 30], [6, 16], [10, 16], [11, 30]], '#3a2c2a');
    poly(ctx, [[3, 31], [6, 26], [7, 31]], '#3a2c2a');
    poly(ctx, [[13, 31], [10, 26], [9, 31]], '#3a2c2a');
    line(ctx, 7, 17, 7, 29, '#251c1a');
    line(ctx, 9, 18, 9, 28, '#4e3e38');
    for (const [x, y] of [[4, 14], [11, 15], [6, 18]]) line(ctx, x, y, x, y + 3, '#4a7a5a');
    ellipse(ctx, 8, 22, 1, 2, '#1a1414');
  } else {
    const p = kind === 'dark' ? LEAF.dark : LEAF.oak;
    rect(ctx, 6, 18, 4, 12, '#5a3c26');
    rect(ctx, 6, 18, 1, 12, '#33200f');
    rect(ctx, 9, 18, 1, 12, '#7a5636');
    px(ctx, 7, 22, '#33200f');
    px(ctx, 8, 26, '#33200f');
    px(ctx, 5, 29, '#5a3c26');
    px(ctx, 10, 29, '#5a3c26');
    for (const [x, y, rr] of [[8, 6, 5], [4, 10, 4], [12, 10, 4], [8, 12, 5], [5, 15, 3], [11, 15, 3]]) leafCluster(ctx, x, y, rr, p);
    if (kind === 'oak') for (const [x, y] of [[4, 8], [11, 6], [9, 13]]) px(ctx, x, y, '#c84040');
  }
  outlineCanvas(ctx, 16, 32, '#0c140e');
  ellipse(ctx, 8, 30, 7, 2, 'rgba(0,0,0,0.3)');
  return canvas;
}

function bushArt(ctx, ox, oy, ramp, berries) {
  const { canvas, ctx: t } = makeCanvas(16, 16);
  for (const [x, y, rr] of [[5, 9, 4], [11, 9, 4], [8, 7, 4], [8, 11, 4]]) leafCluster(t, x, y, rr, ramp);
  if (berries) for (const [x, y] of [[5, 8], [10, 7], [8, 11], [12, 11]]) px(t, x, y, berries);
  outlineCanvas(t, 16, 16, '#0c140e');
  ellipse(t, 8, 15, 6, 1, 'rgba(0,0,0,0.25)');
  ctx.drawImage(canvas, ox, oy);
}

function hedge(ctx, ox, oy) {
  const { canvas, ctx: t } = makeCanvas(16, 16);
  rect(t, 1, 6, 14, 8, '#2c5230');
  for (const x of [3, 8, 13]) leafCluster(t, x, 7, 3, LEAF.oak);
  rect(t, 1, 11, 14, 3, '#1e3a22');
  for (const [x, c] of [[2, '#e85a7a'], [5, '#f0d050'], [8, '#e85a7a'], [11, '#a070e0'], [13, '#f0d050'], [6, '#ffffff']]) px(t, x, 5 + (x % 3), c);
  outlineCanvas(t, 16, 16, '#0c140e');
  ctx.drawImage(canvas, ox, oy);
}

function statue(ctx, ox, oy) {
  const { canvas, ctx: t } = makeCanvas(16, 16);
  rect(t, 3, 12, 10, 4, '#6a6876');
  rect(t, 3, 12, 10, 1, '#8a8896');
  rect(t, 6, 5, 4, 7, '#9a98a6');
  poly(t, [[5, 12], [6, 6], [10, 6], [11, 12]], '#8a8896');
  disc(t, 8, 3, 2, '#a8a6b4');
  rect(t, 7, 0, 2, 1, '#e0c060');
  line(t, 10, 6, 12, 2, '#a8a6b4');
  px(t, 12, 1, '#e0e8ff');
  outlineCanvas(t, 16, 16, '#1a1820');
  ctx.drawImage(canvas, ox, oy);
}

function crystal(ctx, ox, oy) {
  poly(ctx, [[ox + 7, oy + 4], [ox + 9, oy + 9], [ox + 7, oy + 13], [ox + 5, oy + 9]], '#5ab0e0');
  poly(ctx, [[ox + 7, oy + 4], [ox + 7, oy + 13], [ox + 5, oy + 9]], '#8ad8f8');
  poly(ctx, [[ox + 11, oy + 8], [ox + 12, oy + 11], [ox + 11, oy + 13], [ox + 10, oy + 11]], '#4a90d0');
  px(ctx, ox + 6, oy + 7, '#e0f8ff');
}

// pequenas decorações espalhadas automaticamente pelo chão
function scatter(ctx, ox, oy, kind) {
  const P = (x, y, c) => px(ctx, ox + x, oy + y, c);
  switch (kind) {
    case 'tuft':
      for (const [x, y] of [[6, 10], [8, 9], [10, 10]]) {
        P(x, y, '#6a9a52');
        P(x, y + 1, '#2c4a28');
      }
      P(7, 10, '#4a7440');
      P(9, 10, '#4a7440');
      break;
    case 'pebbles':
      P(5, 11, '#8a8a8a');
      P(6, 11, '#6a6a6a');
      P(9, 8, '#9a9a96');
      P(9, 9, '#5a5a56');
      break;
    case 'flowerY':
      for (const [x, y] of [[4, 6], [10, 11]]) {
        P(x, y, '#f0d050');
        P(x, y + 1, '#2c4a28');
      }
      break;
    case 'flowerW':
      for (const [x, y] of [[7, 5], [11, 9], [5, 12]]) {
        P(x, y, '#f0f0ff');
        P(x, y + 1, '#2c4a28');
      }
      break;
    case 'flowerR':
      for (const [x, y] of [[6, 8], [9, 12]]) {
        P(x, y, '#e05060');
        P(x + 1, y, '#f08090');
        P(x, y + 1, '#2c4a28');
      }
      break;
    case 'fern':
      for (const [x, y] of [[6, 10], [7, 9], [8, 8], [9, 9], [10, 10]]) P(x, y, '#3e7060');
      P(8, 9, '#5a9078');
      break;
    case 'bluebell':
      for (const [x, y] of [[5, 7], [11, 10]]) {
        P(x, y, '#7ad0f0');
        P(x, y + 1, '#3a6a8a');
      }
      break;
    case 'glowshroom':
      P(7, 10, '#a0f0e0');
      P(8, 10, '#70d0c0');
      P(7, 11, '#c8c0b0');
      P(10, 7, '#a0f0e0');
      P(10, 8, '#c8c0b0');
      break;
    case 'cpebbles':
      P(4, 10, '#5a5464');
      P(5, 10, '#3a3444');
      P(11, 6, '#5a5464');
      break;
    case 'puddle':
      ellipse(ctx, ox + 8, oy + 10, 3, 1, '#1e2e48');
      P(7, 10, '#4a6a98');
      break;
    case 'crystalS':
      P(6, 9, '#8ad8f8');
      P(6, 10, '#4a90d0');
      P(7, 10, '#5ab0e0');
      break;
    default:
      break;
  }
}

// ---------------------------------------------------------------- registro
const REG = [];
export const TILE_INDEX = {};
export const VARIANTS = {};
export const AUTOS = {};
function reg(name, paint) {
  TILE_INDEX[name] = REG.length;
  REG.push({ name, paint });
}
function regVariants(base, n, fn) {
  VARIANTS[base] = n;
  for (let v = 0; v < n; v++) reg(`${base}#${v}`, (c, x, y) => fn(c, x, y, v));
}
function regAuto(name, fn, { bits = 'NESW', frames = 1 } = {}) {
  AUTOS[name] = { bits, frames };
  const masks = bits === 'EW' ? [0, 2, 8, 10] : Array.from({ length: 16 }, (_, i) => i);
  for (const m of masks)
    for (let f = 0; f < frames; f++) reg(frames > 1 ? `${name}@${m}@${f}` : `${name}@${m}`, (c, x, y) => fn(c, x, y, m, f));
}

reg('empty', () => {});
reg('void', (c, x, y) => rect(c, x, y, T, T, '#000000'));
regVariants('grass', 4, grass);
regVariants('darkgrass', 4, darkgrass);
regVariants('cavefloor', 4, caveFloor);
regVariants('wood', 3, woodFloor);
regVariants('stonefloor', 3, stoneFloor);
reg('dirtplain', (c, x, y) => dirtFill(c, x, y));

const G0 = (c, x, y) => grass(c, x, y, 0);
const DG0 = (c, x, y) => darkgrass(c, x, y, 0);
regAuto('dirt', (c, x, y, m) => edgeAuto(c, x, y, m, { under: G0, fill: dirtFill, w: 1.5, amp: 1.1, rimIn: '#4e3e2a', shadowOut: 0.28, seed: 1 }));
regAuto('cobble', (c, x, y, m) => edgeAuto(c, x, y, m, { under: G0, fill: cobbleFill, w: 0.5, amp: 0.5, rimIn: '#2e2a34', shadowOut: 0.3, seed: 2 }));
regAuto('darkdirt', (c, x, y, m) => edgeAuto(c, x, y, m, { under: DG0, fill: ddirtFill, w: 1.5, amp: 1.1, rimIn: '#2a2222', shadowOut: 0.3, seed: 3 }));
regAuto(
  'water',
  (c, x, y, m, f) => edgeAuto(c, x, y, m, { under: G0, fill: (k, a, b) => waterFill(k, a, b, f), w: 2, amp: 0.8, rimIn: '#6a8ab0', rimIn2: '#142640', shadowOut: 0.45, seed: 4 }),
  { frames: 2 },
);
regAuto(
  'cavewater',
  (c, x, y, m, f) => edgeAuto(c, x, y, m, { under: (k, a, b) => caveFloor(k, a, b, 0), fill: (k, a, b) => waterFill(k, a, b, f, PAL.cwater), w: 1.5, amp: 0.8, rimIn: '#4a6a98', rimIn2: '#0e1424', shadowOut: 0.4, seed: 5 }),
  { frames: 2 },
);
regAuto('carpet', (c, x, y, m) =>
  edgeAuto(c, x, y, m, {
    under: (k, a, b) => woodFloor(k, a, b, 0),
    fill: (k, a, b) => {
      rect(k, a, b, T, T, '#7a2430');
      for (let yy = 1; yy < T; yy += 4)
        for (let xx = (yy % 8 === 1 ? 1 : 3); xx < T; xx += 4) {
          px(k, a + xx, b + yy, '#9a3440');
          px(k, a + xx + 1, b + yy + 1, '#5a1820');
        }
    },
    w: 1,
    amp: 0,
    rimIn: '#d8b050',
    rimIn2: '#5a1820',
    seed: 6,
  }),
);
regAuto('forest', (c, x, y, m) => forestAuto(c, x, y, m, LEAF.forest, G0));
regAuto('darkforest', (c, x, y, m) => forestAuto(c, x, y, m, LEAF.dforest, DG0, '#3a2c2a'));
// variações do miolo da mata (máscara 15) para quebrar a repetição
export const AUTO_FILL_VARIANTS = { forest: 3, darkforest: 3 };
for (let v = 1; v <= 3; v++) {
  reg(`forest@15#${v}`, (c, x, y) => forestAuto(c, x, y, 15, LEAF.forest, G0, '#4a3424', 600 + v * 97));
  reg(`darkforest@15#${v}`, (c, x, y) => forestAuto(c, x, y, 15, LEAF.dforest, DG0, '#3a2c2a', 600 + v * 97));
}
regAuto('cavewall', caveWallAuto);
regAuto('roof', (c, x, y, m) => roofAuto(c, x, y, m, ['#9a4a34', '#6a2c20', '#b86048', '#5a3a2a']));
regAuto('slate', (c, x, y, m) => roofAuto(c, x, y, m, ['#46507a', '#2c3452', '#5c68a0', '#6a6876']));
regAuto('wall', (c, x, y, m) => houseWall(c, x, y, m, 'wall'), { bits: 'EW' });
regAuto('wallwin', (c, x, y, m) => houseWall(c, x, y, m, 'win'), { bits: 'EW' });
regAuto('walldoor', (c, x, y, m) => houseWall(c, x, y, m, 'door'), { bits: 'EW' });
regAuto('stone', (c, x, y, m) => stoneWall(c, x, y, m, 'plain'), { bits: 'EW' });
regAuto('stonewin', (c, x, y, m) => stoneWall(c, x, y, m, 'win'), { bits: 'EW' });
regAuto('stonedoor', (c, x, y, m) => stoneWall(c, x, y, m, 'door'), { bits: 'EW' });

reg('intwall', (c, x, y) => intWall(c, x, y));
reg('intshelf', (c, x, y) => intWall(c, x, y, 'shelf'));
reg('intfire', (c, x, y) => intWall(c, x, y, 'fire'));
reg('intwin', (c, x, y) => intWall(c, x, y, 'win'));
reg('stairsDown', (c, x, y) => drawObj(c, x, y, 'stairsDown'));

// árvores (16x32 divididas em topo/base)
const TREES = {};
for (const kind of ['oak', 'pine', 'dark', 'ancient']) {
  reg(`${kind}Top`, (c, x, y) => {
    TREES[kind] = TREES[kind] || treeCanvas(kind);
    c.drawImage(TREES[kind], 0, 0, 16, 16, x, y, 16, 16);
  });
  reg(`${kind}Bottom`, (c, x, y) => {
    TREES[kind] = TREES[kind] || treeCanvas(kind);
    c.drawImage(TREES[kind], 0, 16, 16, 16, x, y, 16, 16);
  });
}
reg('bush', (c, x, y) => bushArt(c, x, y, LEAF.oak, '#d84a5a'));
reg('darkbush', (c, x, y) => bushArt(c, x, y, LEAF.dark, '#7ad0f0'));
reg('hedge', hedge);
reg('statue', statue);
reg('crystal', crystal);
for (const k of ['tuft', 'pebbles', 'flowerY', 'flowerW', 'flowerR', 'fern', 'bluebell', 'glowshroom', 'cpebbles', 'puddle', 'crystalS']) reg(`s_${k}`, (c, x, y) => scatter(c, x, y, k));
reg('flowers', (c, x, y) => drawObj(c, x, y, 'flowers'));
for (const name of ['fence', 'well', 'rock', 'stalag', 'web', 'mushroom', 'bramble', 'lamp', 'sign', 'counter', 'bed', 'table', 'chair', 'barrel', 'crate', 'pew', 'altar', 'candles', 'pot', 'stump', 'stairsUp', 'roots'])
  reg(name, (c, x, y) => drawObj(c, x, y, name));

export const TILE_NAMES = REG.map((r) => r.name);

// Variações de árvore escolhidas por posição
export const OBJ_VARIANTS = { oakBottom: ['oakBottom', 'oakBottom', 'pineBottom'], oakTop: ['oakTop', 'oakTop', 'pineTop'] };

// Decorações espalhadas por tipo de chão (caractere do mapa)
export const SCATTER = {
  '.': ['s_tuft', 's_tuft', 's_pebbles', 's_flowerY', 's_flowerW', 's_flowerR'],
  g: ['s_fern', 's_bluebell', 's_glowshroom', 's_fern'],
  _: ['s_cpebbles', 's_cpebbles', 's_puddle', 's_crystalS'],
};

export function hash2(x, y) {
  let h = (Math.imul(x, 374761393) + Math.imul(y, 668265263)) >>> 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177) >>> 0;
  return (h ^ (h >>> 16)) >>> 0;
}

export function tileExists(name) {
  return TILE_INDEX[name] !== undefined || !!VARIANTS[name] || !!AUTOS[name];
}

export function buildTileset(scene) {
  const rows = Math.ceil(REG.length / COLS);
  const { canvas, ctx } = makeCanvas(COLS * T, rows * T);
  REG.forEach((t, i) => t.paint(ctx, (i % COLS) * T, Math.floor(i / COLS) * T));
  addSheet(scene, 'tiles', canvas, T, T);
  // objetos avulsos também como texturas (para eventos)
  for (const name of ['cocoon', 'web', 'candles', 'bramble']) {
    const { canvas: c, ctx: k } = makeCanvas(T, T);
    drawObj(k, 0, 0, name);
    addTexture(scene, `obj_${name}`, c);
  }
}
