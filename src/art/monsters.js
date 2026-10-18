// Sprites de monstros desenhados proceduralmente (voltados para a direita, onde fica o grupo).
import { makeCanvas, rng, px, rect, disc, ellipse, line, poly, thick, curve, outlineCanvas, addTexture, shade } from '../core/Pixel.js';

const OUT = '#0a0608';

const PAINT = {
  wolf(c, p) {
    const r = rng(7);
    thick(c, 10, 15, 3, 7, 2, p.d); // cauda
    thick(c, 4, 8, 2, 4, 1, p.d);
    ellipse(c, 22, 17, 13, 7, p.m);
    ellipse(c, 22, 20, 11, 4, p.l);
    ellipse(c, 20, 14, 10, 3, p.d);
    for (const lx of [11, 15, 28, 32]) {
      rect(c, lx, 21, 3, 9, lx === 15 || lx === 32 ? p.m : p.d);
      rect(c, lx - 1, 29, 4, 2, p.d);
    }
    disc(c, 37, 12, 6, p.m);
    disc(c, 36, 10, 3, p.l);
    rect(c, 40, 12, 7, 5, p.m);
    rect(c, 40, 15, 7, 2, p.d);
    poly(c, [[31, 9], [35, 2], [37, 9]], p.d);
    px(c, 46, 12, OUT);
    px(c, 39, 10, p.e);
    px(c, 40, 10, p.e);
    px(c, 39, 9, '#ffffff');
    for (let x = 41; x < 47; x += 2) px(c, x, 17, '#e8e0d0');
    // pelagem
    for (let i = 0; i < 14; i++) px(c, 10 + Math.floor(r() * 24), 11 + Math.floor(r() * 6), p.d);
    for (let i = 0; i < 6; i++) px(c, 14 + Math.floor(r() * 16), 19 + Math.floor(r() * 3), p.l);
  },

  bat(c, p) {
    const wing = [[16, 11], [2, 3], [5, 11], [1, 18], [8, 15], [12, 19], [16, 15]];
    poly(c, wing, p.d);
    poly(c, wing.map(([x, y]) => [35 - x, y]), p.d);
    line(c, 16, 11, 2, 3, p.m);
    line(c, 15, 12, 5, 11, p.m);
    line(c, 15, 13, 1, 18, p.m);
    line(c, 19, 11, 33, 3, p.m);
    line(c, 20, 12, 30, 11, p.m);
    line(c, 20, 13, 34, 18, p.m);
    disc(c, 17, 14, 5, p.m);
    disc(c, 17, 8, 4, p.m);
    poly(c, [[13, 7], [13, 1], [16, 5]], p.m);
    poly(c, [[21, 7], [21, 1], [18, 5]], p.m);
    disc(c, 16, 13, 2, p.l);
    px(c, 15, 8, p.e);
    px(c, 19, 8, p.e);
    px(c, 16, 11, '#ffffff');
    px(c, 18, 11, '#ffffff');
  },

  mushroom(c, p) {
    rect(c, 10, 15, 11, 15, p.s);
    rect(c, 10, 15, 3, 15, shade(p.s, -0.2));
    rect(c, 8, 28, 15, 3, shade(p.s, -0.3));
    ellipse(c, 15, 10, 14, 8, p.m);
    ellipse(c, 13, 7, 10, 5, p.l);
    rect(c, 2, 14, 27, 2, p.d);
    for (const [x, y, r] of [[8, 6, 2], [16, 4, 1], [22, 9, 2], [12, 11, 1]]) disc(c, x, y, r, '#e8e0d0');
    rect(c, 12, 19, 2, 3, OUT);
    rect(c, 18, 19, 2, 3, OUT);
    px(c, 12, 19, p.e);
    px(c, 18, 19, p.e);
    for (let x = 12; x < 20; x++) px(c, x, 24 + (x % 2), OUT);
    px(c, 14, 26, '#8ab040');
    px(c, 14, 27, '#8ab040');
  },

  spider(c, p) {
    const legs = [
      [[24, 15], [32, 4], [42, 16]], [[24, 17], [36, 8], [43, 24]], [[22, 18], [28, 10], [36, 28]], [[20, 18], [22, 12], [28, 29]],
      [[14, 18], [6, 6], [1, 20]], [[14, 19], [4, 12], [3, 28]], [[16, 19], [12, 12], [10, 29]], [[18, 19], [17, 14], [18, 29]],
    ];
    for (const [[x0, y0], [cx, cy], [x1, y1]] of legs) curve(c, x0, y0, cx, cy, x1, y1, 1, p.d);
    ellipse(c, 13, 14, 10, 8, p.m);
    ellipse(c, 11, 11, 6, 4, p.l);
    poly(c, [[11, 10], [15, 10], [13, 14], [15, 18], [11, 18], [13, 14]], p.a);
    ellipse(c, 27, 17, 6, 5, p.m);
    ellipse(c, 26, 15, 3, 2, p.l);
    for (const [x, y] of [[30, 15], [32, 16], [31, 18], [29, 17]]) px(c, x, y, p.e);
    line(c, 32, 20, 33, 23, '#e8e0d0');
    line(c, 30, 21, 30, 23, '#e8e0d0');
  },

  larva(c, p) {
    for (let i = 0; i < 6; i++) {
      const x = 6 + i * 5;
      const r = 5 + Math.min(i, 3) - (i === 5 ? 1 : 0);
      disc(c, x, 16 - Math.round(Math.sin(i) * 2), r, i % 2 ? p.m : p.l);
    }
    for (let i = 0; i < 6; i++) line(c, 6 + i * 5, 11, 6 + i * 5, 20, p.d);
    disc(c, 34, 14, 6, p.l);
    disc(c, 36, 14, 3, p.e);
    for (let a = 0; a < 8; a++) px(c, 36 + Math.round(Math.cos(a) * 3), 14 + Math.round(Math.sin(a) * 3), '#e8e0d0');
    disc(c, 36, 14, 1, OUT);
  },

  ghost(c, p) {
    disc(c, 15, 11, 10, p.m);
    rect(c, 5, 11, 21, 18, p.m);
    for (let x = 5; x < 26; x += 5) poly(c, [[x, 28], [x + 2.5, 34], [x + 5, 28]], p.m);
    disc(c, 12, 8, 6, p.l);
    rect(c, 7, 12, 4, 10, p.l);
    ellipse(c, 11, 11, 2, 3, OUT);
    ellipse(c, 19, 11, 2, 3, OUT);
    px(c, 11, 12, p.e);
    px(c, 19, 12, p.e);
    ellipse(c, 15, 20, 3, 4, OUT);
    ellipse(c, 15, 21, 2, 2, '#200810');
    thick(c, 6, 16, 1, 22, 1, p.m);
    thick(c, 25, 16, 29, 21, 1, p.m);
  },

  crow(c, p) {
    poly(c, [[4, 12], [0, 20], [8, 17]], p.d);
    ellipse(c, 14, 15, 9, 6, p.m);
    poly(c, [[8, 12], [20, 10], [16, 19], [6, 18]], p.d);
    disc(c, 22, 9, 5, p.m);
    poly(c, [[26, 8], [31, 10], [26, 12]], p.a);
    px(c, 23, 8, p.e);
    px(c, 24, 8, p.e);
    line(c, 13, 20, 12, 25, p.a);
    line(c, 17, 20, 18, 25, p.a);
    line(c, 10, 25, 14, 25, p.a);
    line(c, 16, 25, 20, 25, p.a);
    disc(c, 13, 13, 2, p.l);
  },

  scarecrow(c, p) {
    rect(c, 17, 10, 3, 38, '#4a3220');
    rect(c, 2, 17, 33, 3, '#5a3e28');
    rect(c, 10, 17, 17, 15, p.m);
    rect(c, 10, 17, 4, 15, p.d);
    rect(c, 19, 22, 5, 4, p.a);
    for (const x of [1, 3, 33, 35]) line(c, x, 19, x - (x < 18 ? 1 : -1), 24, '#c8a040');
    for (let x = 11; x < 27; x += 2) line(c, x, 32, x + (x % 4 ? 1 : -1), 36, '#c8a040');
    disc(c, 18, 9, 7, '#a88a5a');
    disc(c, 16, 7, 3, '#c0a070');
    px(c, 15, 8, OUT);
    px(c, 21, 8, OUT);
    px(c, 15, 7, p.e);
    px(c, 21, 7, p.e);
    line(c, 14, 12, 22, 12, OUT);
    for (let x = 15; x < 22; x += 2) {
      px(c, x, 11, OUT);
      px(c, x, 13, OUT);
    }
    poly(c, [[8, 4], [28, 4], [22, 2], [18, -6], [14, 2]], p.d);
    rect(c, 8, 3, 21, 2, shade(p.d, -0.3));
  },

  roots(c, p) {
    const lines = [
      [2, 30, 8, 14, 20, 16], [38, 30, 32, 12, 20, 14], [6, 28, 16, 26, 20, 20], [34, 28, 26, 28, 20, 20],
      [20, 4, 12, 8, 18, 14], [20, 4, 30, 6, 22, 14], [0, 18, 8, 20, 14, 18], [40, 18, 32, 22, 26, 18],
    ];
    for (const [a, b, cx, cy, d, e] of lines) curve(c, a, b, cx, cy, d, e, 2, p.m);
    for (const [a, b, cx, cy, d, e] of lines) curve(c, a, b, cx, cy, d, e, 0, p.l);
    disc(c, 20, 17, 7, p.d);
    disc(c, 20, 17, 4, '#e8d870');
    ellipse(c, 20, 17, 1, 3, OUT);
    px(c, 19, 15, '#ffffff');
    for (const [x, y] of [[6, 16], [34, 14], [12, 27], [30, 26], [16, 7], [25, 7]]) px(c, x, y, '#d8c8a8');
  },

  eye(c, p) {
    for (let i = 0; i < 5; i++) curve(c, 9 + i * 4, 24, 4 + i * 6, 30, 7 + i * 5, 34, 1, p.d);
    disc(c, 17, 15, 11, p.m);
    disc(c, 15, 12, 7, p.l);
    for (const [x0, y0, x1, y1] of [[7, 10, 12, 13], [8, 20, 13, 17], [26, 9, 22, 13], [25, 22, 21, 18], [16, 4, 17, 9]]) line(c, x0, y0, x1, y1, '#b02838');
    disc(c, 19, 15, 5, p.a);
    disc(c, 19, 15, 3, shade(p.a, -0.3));
    ellipse(c, 19, 15, 1, 4, OUT);
    px(c, 17, 13, '#ffffff');
    px(c, 18, 12, '#ffffff');
  },

  goblin(c, p) {
    // porrete
    thick(c, 24, 26, 28, 8, 1, '#6a4a2a');
    disc(c, 28, 7, 3, '#7a5a34');
    px(c, 27, 5, '#a0a0a0');
    px(c, 30, 8, '#a0a0a0');
    // pernas e tanga
    rect(c, 9, 26, 3, 7, p.d);
    rect(c, 16, 26, 3, 7, p.d);
    rect(c, 8, 32, 5, 2, '#3a2a1a');
    rect(c, 15, 32, 5, 2, '#3a2a1a');
    ellipse(c, 14, 20, 7, 7, p.m);
    ellipse(c, 12, 18, 4, 4, p.l);
    rect(c, 7, 23, 14, 4, '#6a4a2a');
    rect(c, 7, 23, 14, 1, '#8a6a3a');
    thick(c, 8, 16, 4, 24, 1, p.m);
    thick(c, 20, 16, 24, 24, 1, p.m);
    // cabeça com orelhas pontudas
    poly(c, [[6, 8], [0, 3], [7, 12]], p.m);
    poly(c, [[22, 8], [28, 3], [21, 12]], p.m);
    disc(c, 14, 9, 7, p.m);
    disc(c, 12, 7, 4, p.l);
    px(c, 11, 9, p.e);
    px(c, 17, 9, p.e);
    px(c, 11, 8, '#ffffff');
    line(c, 11, 13, 17, 13, '#2a1a10');
    px(c, 12, 14, '#f0f0e0');
    px(c, 16, 14, '#f0f0e0');
    poly(c, [[13, 10], [15, 10], [14, 12]], p.d);
  },

  darkknight(c, p) {
    // capa
    poly(c, [[8, 14], [24, 14], [27, 42], [5, 42]], p.c);
    // pernas
    rect(c, 11, 32, 4, 10, p.d);
    rect(c, 18, 32, 4, 10, p.d);
    rect(c, 10, 41, 6, 3, p.m);
    rect(c, 17, 41, 6, 3, p.m);
    // tronco
    rect(c, 9, 16, 15, 17, p.m);
    rect(c, 9, 16, 4, 17, p.l);
    rect(c, 9, 24, 15, 2, p.d);
    rect(c, 15, 18, 3, 5, p.a);
    // ombreiras
    ellipse(c, 9, 17, 4, 3, p.l);
    ellipse(c, 24, 17, 4, 3, p.m);
    // escudo
    poly(c, [[2, 20], [9, 19], [9, 30], [5, 34], [2, 30]], p.d);
    poly(c, [[3, 21], [8, 20], [8, 29], [5, 32], [3, 29]], p.m);
    px(c, 5, 25, p.a);
    // espada
    line(c, 26, 30, 31, 4, '#c8ccd8');
    line(c, 27, 30, 32, 5, '#7a7e8a');
    rect(c, 23, 29, 6, 2, p.a);
    // elmo com visor brilhante
    disc(c, 16, 9, 6, p.m);
    disc(c, 14, 7, 3, p.l);
    rect(c, 10, 8, 12, 2, '#0a0610');
    px(c, 13, 8, p.e);
    px(c, 18, 8, p.e);
    poly(c, [[16, 0], [18, 4], [14, 4]], p.a);
  },

  // ---------- chefes ----------
  weaver(c, p) {
    const legs = [
      [[46, 30], [60, 2], [86, 34]], [[46, 34], [70, 14], [84, 58]], [[44, 36], [56, 24], [70, 62]], [[40, 38], [44, 30], [52, 63]],
      [[22, 30], [8, 2], [2, 36]], [[22, 34], [4, 18], [6, 60]], [[26, 36], [14, 30], [18, 63]], [[30, 38], [28, 34], [34, 63]],
    ];
    for (const [[x0, y0], [cx, cy], [x1, y1]] of legs) {
      curve(c, x0, y0, cx, cy, x1, y1, 2, p.d);
      curve(c, x0, y0, cx, cy, x1, y1, 0, p.l);
    }
    ellipse(c, 32, 30, 22, 16, p.m);
    ellipse(c, 28, 25, 14, 9, p.l);
    // marcas de joia no abdômen
    poly(c, [[32, 20], [37, 28], [32, 36], [27, 28]], '#2a1030');
    poly(c, [[32, 22], [35, 28], [32, 34], [29, 28]], '#c03a5a');
    poly(c, [[32, 22], [32, 34], [29, 28]], '#e86a8a');
    for (const [x, y] of [[20, 24], [44, 24], [24, 36], [40, 36]]) disc(c, x, y, 2, '#8a3a6a');
    // tronco humanoide
    ellipse(c, 58, 34, 9, 7, p.m);
    rect(c, 56, 16, 9, 16, '#7a4a9a');
    rect(c, 56, 16, 3, 16, '#5a3478');
    rect(c, 59, 18, 3, 2, '#e8c050');
    thick(c, 56, 18, 50, 28, 1, p.s);
    thick(c, 64, 18, 72, 26, 1, p.s);
    line(c, 72, 26, 76, 24, p.s);
    line(c, 72, 26, 76, 28, p.s);
    disc(c, 60, 10, 6, p.s);
    poly(c, [[53, 6], [60, 3], [67, 6], [68, 22], [64, 14], [56, 14], [52, 24]], '#d8d4e8');
    for (const x of [56, 60, 64]) poly(c, [[x - 2, 4], [x, 0], [x + 2, 4]], '#e8c050');
    px(c, 58, 10, '#a02060');
    px(c, 62, 10, '#a02060');
    line(c, 59, 13, 61, 13, '#802040');
    // teias
    for (let i = 0; i < 4; i++) line(c, 30 + i * 6, 46, 26 + i * 8, 63, '#c8c4d4');
  },

  tree(c, p) {
    // raízes
    for (const [x0, cx, x1] of [[40, 20, 4], [44, 50, 30], [50, 64, 86], [46, 70, 72]]) curve(c, x0, 76, cx, 84, x1, 90, 3, p.d);
    poly(c, [[26, 90], [32, 40], [56, 40], [64, 90]], p.m);
    poly(c, [[30, 90], [34, 44], [40, 44], [38, 90]], p.d);
    for (let y = 46; y < 88; y += 5) line(c, 42 + (y % 3), y, 50 - (y % 4), y + 3, p.d);
    // galhos-braços
    curve(c, 34, 50, 14, 46, 6, 28, 3, p.m);
    curve(c, 54, 50, 76, 44, 84, 24, 3, p.m);
    for (const [x, y, dx, dy] of [[6, 28, -4, -6], [6, 28, 4, -8], [6, 28, -6, 2], [84, 24, 4, -6], [84, 24, -4, -8], [84, 24, 6, 2]]) thick(c, x, y, x + dx, y + dy, 1, p.m);
    // copa vermelha
    for (const [x, y, r] of [[44, 18, 18], [24, 24, 12], [64, 22, 13], [36, 8, 10], [54, 8, 10]]) disc(c, x, y, r, p.a);
    for (const [x, y, r] of [[40, 14, 10], [22, 20, 6], [60, 18, 7], [34, 5, 5]]) disc(c, x, y, r, shade(p.a, 0.25));
    for (let i = 0; i < 30; i++) px(c, 14 + ((i * 37) % 62), 2 + ((i * 23) % 34), shade(p.a, -0.4));
    // rosto
    ellipse(c, 38, 52, 4, 3, '#0c0606');
    ellipse(c, 51, 52, 4, 3, '#0c0606');
    disc(c, 38, 52, 1, p.e);
    disc(c, 51, 52, 1, p.e);
    ellipse(c, 45, 66, 8, 6, '#0c0606');
    for (let x = 38; x < 53; x += 3) {
      poly(c, [[x, 61], [x + 1.5, 64], [x + 3, 61]], '#d8c8a8');
      poly(c, [[x, 71], [x + 1.5, 68], [x + 3, 71]], '#d8c8a8');
    }
    // frutos sombrios e vaga-lumes
    for (const [x, y] of [[12, 34], [78, 30], [30, 30], [60, 28]]) {
      disc(c, x, y, 2, '#6a2a8a');
      px(c, x - 1, y - 1, '#c080e0');
    }
  },
};

export const MONSTER_ART = {
  wolf: { w: 48, h: 32, paint: 'wolf', pal: { m: '#6e6a66', l: '#8e8a84', d: '#4a4642', s: '#c0a8a0', e: '#f0c030' } },
  wolf_black: { w: 48, h: 32, paint: 'wolf', pal: { m: '#2e2a3e', l: '#463e5a', d: '#1a1626', s: '#6a5a8a', e: '#c060ff' } },
  bat: { w: 36, h: 24, paint: 'bat', pal: { m: '#4a3a5a', l: '#6a5a7a', d: '#2a2034', e: '#f0d040' } },
  mushroom: { w: 32, h: 32, paint: 'mushroom', pal: { m: '#8a3a9a', l: '#aa5aba', d: '#5a2068', s: '#e0d4c0', e: '#f0e040' } },
  goblin: { w: 32, h: 36, paint: 'goblin', pal: { m: '#5a9a4a', l: '#7aba5a', d: '#3a6a32', e: '#f03030' } },
  spider: { w: 44, h: 30, paint: 'spider', pal: { m: '#3a2a3e', l: '#5a4660', d: '#1e1622', a: '#b02060', e: '#f04040' } },
  larva: { w: 42, h: 28, paint: 'larva', pal: { m: '#6aaa4a', l: '#8aca62', d: '#4a7a36', e: '#f0c030' } },
  shadow: { w: 30, h: 36, paint: 'ghost', pal: { m: '#3a2c5a', l: '#5a4a86', e: '#ff6a6a' }, alpha: 0.85 },
  crow: { w: 32, h: 26, paint: 'crow', pal: { m: '#1e1e2a', l: '#34344a', d: '#121218', a: '#c8a040', e: '#c060ff' } },
  darkknight: { w: 34, h: 44, paint: 'darkknight', pal: { m: '#3a3448', l: '#5a5270', d: '#221e2c', c: '#4a1a2a', a: '#9a7ad0', e: '#c060ff' } },
  scarecrow: { w: 38, h: 48, paint: 'scarecrow', pal: { m: '#5a4a6a', d: '#3a2a3a', a: '#7a3a2a', e: '#c060ff' } },
  roots: { w: 40, h: 32, paint: 'roots', pal: { m: '#4a3a28', l: '#6a5438', d: '#2a2014' } },
  eye: { w: 34, h: 36, paint: 'eye', pal: { m: '#d8c8e0', l: '#f0e8f4', d: '#4a3060', a: '#8a40d0' } },
  weaver: { w: 88, h: 64, paint: 'weaver', pal: { m: '#4a3a5a', l: '#6a5a7a', d: '#2a2034', s: '#e0d0e0' } },
  tree: { w: 90, h: 92, paint: 'tree', pal: { m: '#3e2e26', d: '#24180e', a: '#3a2a5a', e: '#c060ff' } },
};

export function buildMonsters(scene) {
  for (const [id, art] of Object.entries(MONSTER_ART)) {
    const { canvas, ctx } = makeCanvas(art.w, art.h);
    PAINT[art.paint](ctx, art.pal);
    outlineCanvas(ctx, art.w, art.h, OUT);
    addTexture(scene, `mon_${id}`, canvas);
  }
}
