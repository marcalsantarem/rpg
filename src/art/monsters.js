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
    // sarna: pele exposta e costelas
    ellipse(c, 24, 17, 4, 3, p.s);
    for (let i = 0; i < 3; i++) line(c, 21 + i * 2, 15, 22 + i * 2, 19, shade(p.s, -0.3));
    for (let i = 0; i < 20; i++) px(c, 10 + Math.floor(r() * 24), 11 + Math.floor(r() * 10), p.d);
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

  skeleton(c, p) {
    const b = p.m;
    const d = p.d;
    line(c, 14, 14, 14, 27, b); // espinha
    for (let y = 16; y < 25; y += 2) {
      line(c, 9, y, 19, y, b);
      px(c, 9, y + 1, d);
      px(c, 19, y + 1, d);
    }
    ellipse(c, 14, 28, 5, 2, b);
    thick(c, 11, 30, 9, 41, 1, b);
    thick(c, 17, 30, 19, 41, 1, b);
    rect(c, 7, 41, 4, 2, b);
    rect(c, 18, 41, 4, 2, b);
    thick(c, 8, 15, 5, 24, 1, b);
    thick(c, 20, 15, 23, 22, 1, b);
    // espada enferrujada
    line(c, 23, 22, 27, 6, p.a);
    line(c, 24, 22, 28, 6, shade(p.a, -0.3));
    rect(c, 21, 21, 5, 2, '#5a4a3a');
    disc(c, 14, 7, 6, b);
    rect(c, 10, 11, 8, 3, b);
    disc(c, 12, 7, 1, OUT);
    disc(c, 16, 7, 1, OUT);
    px(c, 12, 7, p.e);
    px(c, 16, 7, p.e);
    for (let x = 11; x < 18; x += 2) px(c, x, 12, OUT);
    px(c, 14, 9, OUT);
    disc(c, 12, 4, 1, shade(b, 0.3));
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

  hanged(c, p) {
    line(c, 13, 0, 13, 8, p.a);
    ellipse(c, 13, 9, 4, 2, p.a);
    disc(c, 12, 13, 5, p.s);
    disc(c, 11, 12, 2, shade(p.s, 0.2));
    px(c, 10, 13, '#e8e8e8');
    px(c, 14, 13, '#e8e8e8');
    px(c, 12, 16, '#5a1a2a');
    rect(c, 7, 18, 12, 16, p.m);
    rect(c, 7, 18, 3, 16, p.d);
    poly(c, [[7, 34], [9, 37], [11, 34], [13, 38], [15, 34], [17, 37], [19, 34]], p.m);
    thick(c, 6, 19, 4, 33, 1, p.m);
    thick(c, 20, 19, 22, 33, 1, p.m);
    px(c, 4, 34, p.s);
    px(c, 22, 34, p.s);
    thick(c, 11, 36, 11, 45, 1, p.d);
    thick(c, 15, 36, 16, 45, 1, p.d);
    rect(c, 10, 45, 3, 2, p.s);
    rect(c, 15, 45, 3, 2, p.s);
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
    // caveira no abdômen
    disc(c, 32, 29, 8, '#1a1018');
    disc(c, 32, 28, 7, p.s);
    disc(c, 29, 27, 2, '#1a1018');
    disc(c, 35, 27, 2, '#1a1018');
    poly(c, [[32, 30], [31, 32], [33, 32]], '#1a1018');
    for (let x = 28; x < 37; x += 2) rect(c, x, 34, 1, 2, '#1a1018');
    // tronco humanoide
    ellipse(c, 58, 34, 9, 7, p.m);
    rect(c, 56, 16, 9, 16, p.s);
    rect(c, 56, 16, 3, 16, shade(p.s, -0.25));
    thick(c, 56, 18, 50, 28, 1, p.s);
    thick(c, 64, 18, 72, 26, 1, p.s);
    line(c, 72, 26, 76, 24, p.s);
    line(c, 72, 26, 76, 28, p.s);
    disc(c, 60, 10, 6, p.s);
    poly(c, [[53, 6], [60, 1], [67, 6], [68, 22], [64, 14], [56, 14], [52, 24]], '#140c14');
    px(c, 58, 10, '#f02020');
    px(c, 62, 10, '#f02020');
    line(c, 58, 13, 62, 13, '#401018');
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
    // corpos pendurados
    for (const [x, y] of [[12, 40], [78, 36]]) {
      line(c, x, y - 8, x, y, '#a8986a');
      disc(c, x, y + 2, 2, '#a89a88');
      rect(c, x - 2, y + 4, 5, 8, '#3a3430');
      line(c, x - 1, y + 12, x - 1, y + 16, '#2a2422');
      line(c, x + 1, y + 12, x + 1, y + 16, '#2a2422');
    }
  },
};

export const MONSTER_ART = {
  wolf: { w: 48, h: 32, paint: 'wolf', pal: { m: '#5a5048', l: '#7a6e62', d: '#3a322c', s: '#b08080', e: '#f03030' } },
  wolf_black: { w: 48, h: 32, paint: 'wolf', pal: { m: '#2a2630', l: '#403a48', d: '#18141c', s: '#8a5a6a', e: '#f0d030' } },
  bat: { w: 36, h: 24, paint: 'bat', pal: { m: '#4a3040', l: '#6a4a5a', d: '#2a1a24', e: '#f03030' } },
  mushroom: { w: 32, h: 32, paint: 'mushroom', pal: { m: '#8a2a2a', l: '#aa4038', d: '#5a1818', s: '#d8c8b0', e: '#f0e040' } },
  skeleton: { w: 30, h: 44, paint: 'skeleton', pal: { m: '#d8d0b8', d: '#9a927c', a: '#8a6a4a', e: '#f03030' } },
  spider: { w: 44, h: 30, paint: 'spider', pal: { m: '#3a2a3e', l: '#5a4660', d: '#1e1622', a: '#b02030', e: '#f04040' } },
  larva: { w: 42, h: 28, paint: 'larva', pal: { m: '#c8b8a8', l: '#e0d4c4', d: '#9a8a7a', e: '#5a1a2a' } },
  ghost: { w: 30, h: 36, paint: 'ghost', pal: { m: '#a8b8d0', l: '#d0dcec', e: '#f04040' }, alpha: 0.8 },
  crow: { w: 32, h: 26, paint: 'crow', pal: { m: '#1e1e2a', l: '#34344a', d: '#121218', a: '#c8a040', e: '#f03030' } },
  hanged: { w: 26, h: 48, paint: 'hanged', pal: { m: '#4a4038', d: '#2e2620', a: '#8a7a5a', s: '#8a9a88' } },
  scarecrow: { w: 38, h: 48, paint: 'scarecrow', pal: { m: '#5a4a6a', d: '#3a2a3a', a: '#7a3a2a', e: '#f04020' } },
  roots: { w: 40, h: 32, paint: 'roots', pal: { m: '#4a2e20', l: '#6a4430', d: '#2a1810' } },
  eye: { w: 34, h: 36, paint: 'eye', pal: { m: '#d8c0c0', l: '#f0e0e0', d: '#5a3040', a: '#8ab030' } },
  weaver: { w: 88, h: 64, paint: 'weaver', pal: { m: '#d0c8b4', l: '#e8e0d0', d: '#5a4a50', s: '#c8bca8' } },
  tree: { w: 90, h: 92, paint: 'tree', pal: { m: '#3e2a20', d: '#24160e', a: '#6a1a1e', e: '#f8d040' } },
};

export function buildMonsters(scene) {
  for (const [id, art] of Object.entries(MONSTER_ART)) {
    const { canvas, ctx } = makeCanvas(art.w, art.h);
    PAINT[art.paint](ctx, art.pal);
    outlineCanvas(ctx, art.w, art.h, OUT);
    addTexture(scene, `mon_${id}`, canvas);
  }
}
