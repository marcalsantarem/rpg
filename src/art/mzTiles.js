// Composição de mapas com os tilesets do RPG Maker MZ (tiles de 48px).
// Regras de autotile reproduzidas de rmmz_core.js (Tilemap._addAutotile):
//  - A1/A2 e topo de A4: tabela de "chão" (blocos 2x3, vizinhança de 8 direções)
//  - A3 e face de A4: tabela de "parede" (blocos 2x2, vizinhança de 4 direções)
import { makeCanvas, addTexture } from '../core/Pixel.js';

const T = 48;
const Q = 24;

// ---------------------------------------------------------------- construtores de spec
export const A1 = (set, k) => ({ t: 'a1', set: `${set}_A1`, k });
export const A2 = (set, k, table = false) => ({ t: 'a2', set: `${set}_A2`, k, table });
export const A3 = (set, k) => ({ t: 'a3', set: `${set}_A3`, k });
export const A4 = (set, k) => ({ t: 'a4', set: `${set}_A4`, k });
export const B = (set, c, r) => ({ t: 'b', set: `${set}_B`, c, r });
export const C = (set, c, r) => ({ t: 'b', set: `${set}_C`, c, r });
export const CH = (sheet, i) => ({ t: 'ch', sheet, i });
const keyOf = (s) => (s ? `${s.t}:${s.set ?? s.sheet}:${s.k ?? ''}:${s.c ?? ''}:${s.r ?? ''}:${s.i ?? ''}` : '');

// ---------------------------------------------------------------- legendas por tipo de mapa
// g = chão, d = objeto (camada de decoração), top/top2 = partes de cima (camada sobreposta),
// wall = {top, side}: vira face (side) quando a célula de baixo não é parede.
const O = 'Outside';
const I = 'Inside';
const D = 'Dungeon';

const OUTSIDE = {
  base: A2(O, 0),
  '.': { scatter: [B(O, 8, 3), B(O, 9, 3), B(O, 10, 3), B(O, 11, 3), B(O, 8, 4), B(O, 10, 4)] },
  ',': { d: B(O, 9, 4) },
  ':': { g: A2(O, 1) },
  '=': { g: A2(O, 3) },
  '~': { g: A1(O, 0) },
  F: { wall: { top: A4(O, 33), side: A4(O, 42) } },
  P: { wall: { top: A4(O, 33), side: A4(O, 42) } },
  T: { d: B(O, 13, 4), top: B(O, 13, 3) },
  G: { d: B(O, 8, 14), top: B(O, 8, 13) },
  h: { d: B(O, 13, 4), top: B(O, 13, 3) },
  B: { d: B(O, 14, 4) },
  '+': { d: B(O, 13, 14) },
  q: { d: C(O, 0, 9), top: C(O, 0, 8) },
  x: { d: A2(O, 6) },
  o: { d: B(O, 11, 1) },
  r: { d: B(O, 15, 3) },
  l: { d: B(O, 0, 3), top: B(O, 0, 2), top2: B(O, 0, 1) },
  S: { d: B(O, 9, 1) },
  u: { d: B(O, 12, 3) },
  Z: { d: B(O, 9, 14) },
  M: { d: B(O, 10, 13) },
  K: { d: B(O, 12, 4) },
  b: { d: B(O, 10, 15) },
  k: { d: B(O, 11, 5) },
  R: { g: A3(O, 2) },
  Y: { g: A3(O, 17) },
  W: { g: A3(O, 9), grp: 'house' },
  w: { g: A3(O, 9), grp: 'house', d: B(O, 0, 12) },
  D: { g: A3(O, 9), grp: 'house', d: CH('!Door1', 0) },
  C: { g: A3(O, 25), grp: 'temple' },
  c: { g: A3(O, 25), grp: 'temple', d: B(O, 3, 14) },
  E: { g: A3(O, 25), grp: 'temple', d: CH('!Door1', 1) },
  g: {},
  p: { g: A2(O, 1) },
  // penhasco com a entrada da gruta (no bosque)
  '#': { wall: { top: A4(O, 32), side: A4(O, 40) } },
  _: { g: A2(O, 1), d: C(O, 6, 15), top: C(O, 6, 14) },
};

const INSIDE = {
  base: A2(I, 0),
  e: {},
  s: { g: A2(I, 1) },
  a: { g: A2(I, 10) },
  X: { g: A4(I, 19) },
  I: { g: A4(I, 27) },
  L: { g: A4(I, 27), d: B(I, 13, 4) },
  O: { g: A4(I, 27), d: B(I, 10, 8) },
  i: { g: A4(I, 27), d: B(I, 4, 8) },
  C: { g: A4(I, 8) },
  c: { g: A4(I, 8), d: B(I, 7, 8) },
  N: { g: A2(I, 7, true) },
  Q: { pair: [B(I, 8, 5), B(I, 8, 6)] },
  '[': { d: B(I, 4, 14) },
  ']': { d: B(I, 0, 15) },
  V: { d: B(I, 12, 10) },
  J: { d: B(I, 8, 12) },
  '^': { hseg: [B(I, 0, 14), B(I, 1, 14), B(I, 1, 14)] },
  '!': { hseg: [C(I, 8, 7), C(I, 9, 7), C(I, 10, 7)] },
  '*': { d: C(I, 9, 6), top: C(I, 9, 5) },
  '%': { d: B(I, 9, 10) },
};

const DUNGEON = {
  base: A2(D, 8),
  _: { scatter: [B(D, 1, 4), B(D, 5, 4), B(D, 1, 5)] },
  '-': { d: B(D, 5, 4) },
  '#': { wall: { top: A4(D, 1), side: A4(D, 9) } },
  z: { d: B(D, 5, 7), top: B(D, 5, 6) },
  n: { d: B(D, 8, 6) },
  v: { g: A1(D, 12) },
  '>': { d: B(D, 2, 1) },
  '<': { d: B(D, 2, 0) },
  k: { d: B(D, 1, 4) },
};

export const GROUP_LEGEND = { outside: OUTSIDE, inside: INSIDE, dungeon: DUNGEON };

export function mapGroup(def) {
  if (def.tileset) return def.tileset;
  if (def.base === 'wood' || def.base === 'stonefloor') return 'inside';
  if (def.base === 'cavefloor') return 'dungeon';
  return 'outside';
}

function baseSpec(def, legend) {
  if (def.base === 'stonefloor') return A2(I, 1);
  return legend.base;
}

// ---------------------------------------------------------------- quartos de autotile
function floorQuarter(qx, qy, h, v, d) {
  if (h && v) return d ? [qx ? 1 : 2, qy ? 3 : 4] : [2 + qx, qy];
  if (h) return [qx ? 1 : 2, qy ? 5 : 2];
  if (v) return [qx ? 3 : 0, qy ? 3 : 4];
  return [qx ? 3 : 0, qy ? 5 : 2];
}

function wallQuarter(qx, qy, h, v) {
  return [qx ? (h ? 1 : 3) : h ? 2 : 0, qy ? (v ? 1 : 3) : v ? 2 : 0];
}

// Origem (em tiles) do bloco de um autotile, como em _addAutotile
function autotileBlock(s, frame) {
  const k = s.k;
  const tx = k % 8;
  const ty = Math.floor(k / 8);
  const wsi = [0, 1, 2, 1][frame % 4];
  if (s.t === 'a1') {
    if (k === 0) return { bx: wsi * 2, by: 0, wall: false };
    if (k === 1) return { bx: wsi * 2, by: 3, wall: false };
    if (k === 2) return { bx: 6, by: 0, wall: false };
    if (k === 3) return { bx: 6, by: 3, wall: false };
    let bx = Math.floor(tx / 4) * 8;
    const by = ty * 6 + (Math.floor(tx / 2) % 2) * 3;
    bx += k % 2 === 0 ? wsi * 2 : 6;
    return { bx, by, wall: false };
  }
  if (s.t === 'a2') return { bx: tx * 2, by: ty * 3, wall: false };
  if (s.t === 'a3') return { bx: tx * 2, by: ty * 2, wall: true };
  // a4: linhas pares = topo (chão), ímpares = face (parede)
  return { bx: tx * 2, by: Math.floor(ty * 2.5 + (ty % 2 === 1 ? 0.5 : 0)), wall: ty % 2 === 1 };
}

// ---------------------------------------------------------------- compositor
class Composer {
  constructor(scene, key) {
    this.scene = scene;
    this.key = key;
    this.parts = []; // lista de funções de desenho
    this.index = new Map();
    this.index.set('empty', 0);
    this.parts.push(null);
  }

  img(name) {
    return this.scene.textures.get(name).getSourceImage();
  }

  // devolve o índice de um tile composto (desenho de uma ou mais camadas)
  tile(id, draw) {
    if (this.index.has(id)) return this.index.get(id);
    const i = this.parts.length;
    this.parts.push(draw);
    this.index.set(id, i);
    return i;
  }

  drawAuto(ctx, dx, dy, s, n, frame = 0) {
    const src = this.img(`mz_tilesets_${s.set}`);
    const { bx, by, wall } = autotileBlock(s, frame);
    for (let i = 0; i < 4; i++) {
      const qx = i % 2;
      const qy = Math.floor(i / 2);
      const h = qx ? n.E : n.W;
      const v = qy ? n.S : n.N;
      const d = qx ? (qy ? n.SE : n.NE) : qy ? n.SW : n.NW;
      const [qsx, qsy] = wall ? wallQuarter(qx, qy, h, v) : floorQuarter(qx, qy, h, v, d);
      const sx = (bx * 2 + qsx) * Q;
      const sy = (by * 2 + qsy) * Q;
      const ddx = dx + qx * Q;
      const ddy = dy + qy * Q;
      if (s.table && (qsy === 1 || qsy === 5)) {
        // mesas/balcões: perna desenhada abaixo do tampo (como em _addAutotile)
        const qsx2 = qsy === 1 ? (4 - qsx) % 4 : qsx;
        ctx.drawImage(src, (bx * 2 + qsx2) * Q, (by * 2 + 3) * Q, Q, Q, ddx, ddy, Q, Q);
        ctx.drawImage(src, sx, sy, Q, Q / 2, ddx, ddy + Q / 2, Q, Q / 2);
      } else ctx.drawImage(src, sx, sy, Q, Q, ddx, ddy, Q, Q);
    }
  }

  drawSpec(ctx, dx, dy, s, n, frame) {
    if (!s) return;
    if (s.t === 'b') ctx.drawImage(this.img(`mz_tilesets_${s.set}`), s.c * T, s.r * T, T, T, dx, dy, T, T);
    else if (s.t === 'ch') {
      const img = this.img(`mz_characters_${s.sheet}`);
      const fw = img.width / 12;
      const fh = img.height / 8;
      ctx.drawImage(img, (s.i % 4) * fw * 3, Math.floor(s.i / 4) * fh * 4, fw, fh, dx, dy + T - fh, fw, fh);
    } else this.drawAuto(ctx, dx, dy, s, n, frame);
  }

  build() {
    const cols = 16;
    const rows = Math.ceil(this.parts.length / cols);
    const { canvas, ctx } = makeCanvas(cols * T, rows * T);
    this.parts.forEach((draw, i) => {
      if (draw) draw(ctx, (i % cols) * T, Math.floor(i / cols) * T);
    });
    addTexture(this.scene, this.key, canvas);
    return { key: this.key, count: this.parts.length };
  }
}

const NEIGH = { N: [0, -1], E: [1, 0], S: [0, 1], W: [-1, 0], NE: [1, -1], NW: [-1, -1], SE: [1, 1], SW: [-1, 1] };

/**
 * Gera as camadas do mapa. Retorna { texture, ground, deco, over, anim } onde
 * ground/deco/over são matrizes de índices no tileset gerado (0 = vazio).
 */
export function buildMzMap(scene, def, hash) {
  const legend = GROUP_LEGEND[mapGroup(def)];
  const rows = def.rows;
  const H = rows.length;
  const W = rows[0].length;
  const base = baseSpec(def, legend);
  const L = (x, y) => (x < 0 || y < 0 || x >= W || y >= H ? null : legend[rows[y][x]] ?? {});
  const ch = (x, y) => (x < 0 || y < 0 || x >= W || y >= H ? null : rows[y][x]);

  // 1) chão resolvido por célula (paredes A4 viram topo ou face)
  const groundSpec = [];
  for (let y = 0; y < H; y++) {
    groundSpec.push([]);
    for (let x = 0; x < W; x++) {
      const e = L(x, y);
      let g = e.g ?? base;
      if (e.wall) {
        const below = ch(x, y + 1);
        const isWall = below === null || (legend[below] && legend[below].wall);
        g = isWall ? e.wall.top : e.wall.side;
      }
      groundSpec[y].push(g);
    }
  }
  const sameGround = (x, y, s) => {
    if (x < 0 || y < 0 || x >= W || y >= H) return true;
    return keyOf(groundSpec[y][x]) === keyOf(s);
  };
  const neighbors = (fn) => Object.fromEntries(Object.entries(NEIGH).map(([k, [dx, dy]]) => [k, fn(dx, dy)]));

  const comp = new Composer(scene, `mzmap_${def.id}`);
  const ground = [];
  const deco = [];
  const over = Array.from({ length: H }, () => new Array(W).fill(-1));
  const anim = [];

  for (let y = 0; y < H; y++) {
    ground.push([]);
    deco.push([]);
    for (let x = 0; x < W; x++) {
      const e = L(x, y);
      const g = groundSpec[y][x];
      const n = neighbors((dx, dy) => sameGround(x + dx, y + dy, g));
      const nk = Object.values(n).map((b) => (b ? 1 : 0)).join('');
      // chão (água anima em 3 quadros)
      if (g.t === 'a1') {
        const frames = [0, 1, 2].map((f) => comp.tile(`g|${keyOf(g)}|${nk}|${f}`, (c, dx, dy) => comp.drawSpec(c, dx, dy, g, n, f)));
        ground[y].push(frames[0]);
        anim.push({ x, y, frames: [frames[0], frames[1], frames[2], frames[1]] });
      } else ground[y].push(comp.tile(`g|${keyOf(g)}|${nk}`, (c, dx, dy) => comp.drawSpec(c, dx, dy, g, n, 0)));

      // decoração
      let d = e.d ?? null;
      if (e.pair) {
        const below = ch(x, y + 1) === rows[y][x];
        const above = ch(x, y - 1) === rows[y][x];
        if (below) d = e.pair[0];
        else {
          d = e.pair[1];
          if (!above && y > 0) over[y - 1][x] = comp.tile(`o|${keyOf(e.pair[0])}`, (c, dx, dy) => comp.drawSpec(c, dx, dy, e.pair[0]));
        }
      }
      if (e.hseg) {
        const l = ch(x - 1, y) === rows[y][x];
        const r = ch(x + 1, y) === rows[y][x];
        d = l && r ? e.hseg[1] : l ? e.hseg[2] : r ? e.hseg[0] : e.hseg[1];
      }
      if (!d && e.scatter && hash(x * 7 + 3, y * 13 + 1) % 100 < 9) d = e.scatter[hash(x + 11, y + 5) % e.scatter.length];
      if (d) {
        let dn = {};
        if (d.t !== 'b' && d.t !== 'ch') dn = neighbors((dx, dy) => keyOf(L(x + dx, y + dy)?.d) === keyOf(d) || L(x + dx, y + dy) === null);
        const dk = Object.values(dn).map((b) => (b ? 1 : 0)).join('');
        deco[y].push(comp.tile(`d|${keyOf(d)}|${dk}`, (c, dx, dy) => comp.drawSpec(c, dx, dy, d, dn, 0)));
      } else deco[y].push(-1);

      // partes de cima (árvores, postes, estátuas)
      if (e.top && y > 0) over[y - 1][x] = comp.tile(`o|${keyOf(e.top)}`, (c, dx, dy) => comp.drawSpec(c, dx, dy, e.top));
      if (e.top2 && y > 1) over[y - 2][x] = comp.tile(`o|${keyOf(e.top2)}`, (c, dx, dy) => comp.drawSpec(c, dx, dy, e.top2));
    }
  }
  const tex = comp.build();
  return { texture: tex.key, ground, deco, over, anim };
}

// Desenha um tile isolado de um tileset numa textura própria (para objetos de evento)
export function tileTexture(scene, key, spec) {
  if (scene.textures.exists(key)) return key;
  const comp = new Composer(scene, key);
  const { canvas, ctx } = makeCanvas(T, T);
  comp.drawSpec(ctx, 0, 0, spec, {});
  addTexture(scene, key, canvas);
  return key;
}

export { O as OUT, I as INS, D as DUN };
