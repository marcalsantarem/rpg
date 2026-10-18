// UI, efeitos, objetos de evento e fundos de batalha.
import { makeCanvas, rng, px, rect, disc, ellipse, line, poly, thick, curve, drawRows, addTexture, addSheet, mix, shade, outlineCanvas } from '../core/Pixel.js';

function cursor(scene) {
  const rows = [
    '....oooo....',
    '...owwwwoooo',
    'oooowwwwwwwo',
    'owwwwwwwoooo',
    'owwwwwwwwo..',
    'owwwwwwgwo..',
    'oowwwwggo...',
    '..oooooo....',
  ];
  const { canvas, ctx } = makeCanvas(12, 8);
  drawRows(ctx, rows, { o: '#202028', w: '#f4f4f8', g: '#a0a0b8' });
  addTexture(scene, 'cursor', canvas);
  const a = makeCanvas(7, 4);
  drawRows(a.ctx, ['ooooooo', '.owwwo.', '..owo..', '...o...'], { o: '#202028', w: '#f4f4f8' });
  addTexture(scene, 'arrow_down', a.canvas);
}

function light(scene) {
  const S = 128;
  const { canvas, ctx } = makeCanvas(S, S);
  const img = ctx.createImageData(S, S);
  for (let y = 0; y < S; y++)
    for (let x = 0; x < S; x++) {
      const d = Math.hypot(x - S / 2 + 0.5, y - S / 2 + 0.5) / (S / 2);
      let a = Math.max(0, 1 - d);
      a = Math.min(1, a * 1.6);
      a = Math.round(a * 7) / 7; // bandas retrô
      const i = (y * S + x) * 4;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = 255;
      img.data[i + 3] = Math.round(a * 255);
    }
  ctx.putImageData(img, 0, 0);
  addTexture(scene, 'light', canvas);
}

function fog(scene) {
  const S = 128;
  const { canvas, ctx } = makeCanvas(S, S);
  const img = ctx.createImageData(S, S);
  const r = rng(99);
  // ruído de valor periódico (tileável) em duas oitavas
  const octave = (n) => {
    const g = Array.from({ length: n * n }, () => r());
    const at = (x, y) => g[((y + n) % n) * n + ((x + n) % n)];
    return (x, y) => {
      const fx = (x / S) * n;
      const fy = (y / S) * n;
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
  };
  const o1 = octave(4);
  const o2 = octave(8);
  for (let y = 0; y < S; y++)
    for (let x = 0; x < S; x++) {
      let v = o1(x, y) * 0.7 + o2(x, y) * 0.3;
      v = Math.max(0, Math.min(1, (v - 0.4) * 2.2));
      v = Math.round(v * 4) / 4;
      const i = (y * S + x) * 4;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = 255;
      img.data[i + 3] = Math.round(v * 255);
    }
  ctx.putImageData(img, 0, 0);
  addTexture(scene, 'fog', canvas);
}

function fx(scene) {
  let c = makeCanvas(5, 5);
  drawRows(c.ctx, ['..w..', '..w..', 'wwwww', '..w..', '..w..'], { w: '#ffffff' });
  addTexture(scene, 'fx_spark', c.canvas);
  c = makeCanvas(4, 4);
  disc(c.ctx, 2, 2, 1, '#ffffff');
  rect(c.ctx, 1, 1, 2, 2, '#ffffff');
  addTexture(scene, 'fx_dot', c.canvas);
  c = makeCanvas(24, 24);
  for (let i = 0; i < 3; i++) line(c.ctx, 2 + i * 5, 22, 20 + i * 2, 2 + i * 2, '#ffffff');
  addTexture(scene, 'fx_claw', c.canvas);
  c = makeCanvas(24, 24);
  thick(c.ctx, 3, 21, 21, 3, 1, '#ffffff');
  line(c.ctx, 2, 20, 20, 2, '#c8d8ff');
  addTexture(scene, 'fx_slash', c.canvas);
  c = makeCanvas(16, 16);
  for (let a = 0; a < 16; a++) {
    const x = Math.round(8 + Math.cos((a / 16) * Math.PI * 2) * 7);
    const y = Math.round(8 + Math.sin((a / 16) * Math.PI * 2) * 7);
    px(c.ctx, x, y, '#ffffff');
  }
  addTexture(scene, 'fx_ring', c.canvas);
  c = makeCanvas(12, 6);
  ellipse(c.ctx, 6, 3, 5, 2, 'rgba(0,0,0,0.45)');
  addTexture(scene, 'shadow', c.canvas);
  c = makeCanvas(8, 8);
  poly(c.ctx, [[4, 0], [8, 6], [4, 8], [0, 6]], '#ffffff');
  addTexture(scene, 'fx_flame', c.canvas);
}

function eventSprites(scene) {
  // baú: 0 fechado, 1 aberto
  const chest = {
    pal: { o: '#140c08', w: '#7a4a28', l: '#9a6a3a', d: '#4a2c16', g: '#d8b050', k: '#1a1010' },
    closed: [
      '................', '................', '................', '..oooooooooooo..', '.olllllllllllldo', '.olwwwwwwwwwwwdo',
      '.oggggggggggggdo'.slice(0, 16), '.oooooooggooooo.', '.olwwwwwkkwwwwdo', '.owwwwwwggwwwwdo', '.owwwwwwwwwwwwdo',
      '.oggggggggggggdo', '.oddddddddddddo.', '..oooooooooooo..', '................', '................',
    ],
    open: [
      '................', '..oooooooooooo..', '.olllllllllllldo', '.okkkkkkkkkkkkdo', '.okkkkkkkkkkkkdo', '.ooooooooooooooo',
      '.olwwwwwwwwwwwdo', '.oooooooggooooo.', '.olwwwwwwwwwwwdo', '.owwwwwwwwwwwwdo', '.owwwwwwwwwwwwdo',
      '.oggggggggggggdo', '.oddddddddddddo.', '..oooooooooooo..', '................', '................',
    ],
  };
  let c = makeCanvas(32, 16);
  drawRows(c.ctx, chest.closed, chest.pal, 0, 0);
  drawRows(c.ctx, chest.open, chest.pal, 16, 0);
  addSheet(scene, 'chest', c.canvas, 16, 16);

  // altar de velas (ponto de save), 2 frames de chama
  c = makeCanvas(32, 24);
  for (let f = 0; f < 2; f++) {
    const ox = f * 16;
    const k = c.ctx;
    rect(k, ox + 2, 14, 12, 8, '#4a4652');
    rect(k, ox + 2, 14, 12, 1, '#6a6672');
    rect(k, ox + 1, 21, 14, 2, '#2e2a34');
    rect(k, ox + 5, 16, 6, 4, '#6a1a24');
    px(k, ox + 7, 17, '#d8b050');
    px(k, ox + 8, 18, '#d8b050');
    for (const [x, h] of [[3, 5], [7, 7], [11, 4]]) {
      rect(k, ox + x, 14 - h, 2, h, '#e8e0c8');
      const fy = 14 - h - 3 + (f === 1 && x === 7 ? -1 : 0);
      rect(k, ox + x, fy + 1, 2, 2, '#f08030');
      px(k, ox + x + (f ? 1 : 0), fy, '#f8e070');
    }
  }
  outlineCanvas(c.ctx, 32, 24, '#100c10');
  addSheet(scene, 'altar', c.canvas, 16, 24);

  // fragmento do sino (brilho)
  c = makeCanvas(16, 16);
  poly(c.ctx, [[4, 3], [11, 3], [13, 12], [2, 12]], '#c8bca0');
  poly(c.ctx, [[5, 4], [8, 4], [7, 11], [4, 11]], '#e8e0c8');
  line(c.ctx, 9, 4, 7, 11, '#5a4a3a');
  outlineCanvas(c.ctx, 16, 16, '#1a1010');
  addTexture(scene, 'obj_fragment', c.canvas);

  // boneca de pano (pista)
  c = makeCanvas(16, 16);
  disc(c.ctx, 8, 6, 3, '#d8c0a0');
  rect(c.ctx, 6, 9, 5, 5, '#8a2a3a');
  px(c.ctx, 7, 6, '#000');
  px(c.ctx, 9, 6, '#000');
  line(c.ctx, 5, 3, 11, 3, '#5a3a1a');
  outlineCanvas(c.ctx, 16, 16, '#1a1010');
  addTexture(scene, 'obj_doll', c.canvas);

  // névoa vermelha que bloqueia caminhos
  c = makeCanvas(16, 24);
  for (const [x, y, r] of [[5, 14, 5], [11, 12, 5], [8, 8, 5], [4, 19, 4], [12, 19, 4], [8, 17, 6]]) disc(c.ctx, x, y, r, 'rgba(150,20,30,0.45)');
  for (const [x, y, r] of [[7, 12, 3], [10, 17, 3]]) disc(c.ctx, x, y, r, 'rgba(220,60,60,0.35)');
  addTexture(scene, 'obj_mist', c.canvas);

  // sombra/vulto (para sustos)
  c = makeCanvas(16, 32);
  ellipse(c.ctx, 8, 6, 4, 5, '#000000');
  poly(c.ctx, [[3, 9], [13, 9], [15, 32], [1, 32]], '#000000');
  px(c.ctx, 6, 6, '#f02020');
  px(c.ctx, 10, 6, '#f02020');
  addTexture(scene, 'obj_shade', c.canvas);
}

// ---------- fundos de batalha 320x160 ----------
function bgForest(ctx, r, pal) {
  for (let y = 0; y < 160; y++) rect(ctx, 0, y, 320, 1, mix(pal.sky0, pal.sky1, Math.floor((y / 110) * 8) / 8));
  if (pal.moon) {
    disc(ctx, 150, 26, 13, pal.moon);
    disc(ctx, 146, 23, 11, shade(pal.moon, 0.1));
    disc(ctx, 155, 30, 2, shade(pal.moon, -0.12));
    disc(ctx, 145, 29, 1, shade(pal.moon, -0.12));
  }
  // camadas de árvores
  const layers = [
    { c: pal.far, base: 90, h: 50 },
    { c: pal.mid, base: 110, h: 60 },
  ];
  for (const L of layers) {
    for (let x = -10; x < 330; x += 14 + Math.floor(r() * 10)) {
      const h = L.h * (0.6 + r() * 0.5);
      if (pal.dead) {
        thick(ctx, x, L.base + 20, x + (r() - 0.5) * 6, L.base - h, 2, L.c);
        for (let b = 0; b < 3; b++) {
          const by = L.base - h * (0.4 + b * 0.2);
          thick(ctx, x, by, x + (r() < 0.5 ? -1 : 1) * (8 + r() * 10), by - 10 - r() * 8, 1, L.c);
        }
      } else {
        poly(ctx, [[x - 10, L.base + 20], [x, L.base - h], [x + 10, L.base + 20]], L.c);
        poly(ctx, [[x - 8, L.base - h * 0.3], [x, L.base - h * 0.9], [x + 8, L.base - h * 0.3]], shade(L.c, 0.06));
      }
    }
  }
  rect(ctx, 0, 110, 320, 50, pal.ground);
  for (let i = 0; i < 400; i++) px(ctx, Math.floor(r() * 320), 110 + Math.floor(r() * 50), r() < 0.5 ? shade(pal.ground, 0.12) : shade(pal.ground, -0.2));
  for (let y = 110; y < 160; y += 6) rect(ctx, 0, y, 320, 1, shade(pal.ground, -0.08));
  rect(ctx, 0, 108, 320, 3, shade(pal.ground, -0.3));
  // névoa
  for (let i = 0; i < 6; i++) ellipse(ctx, Math.floor(r() * 320), 104 + Math.floor(r() * 10), 40, 4, pal.mist);
}

function bgCave(ctx, r, web) {
  for (let y = 0; y < 160; y++) rect(ctx, 0, y, 320, 1, mix('#1a1216', '#0a0608', Math.floor((y / 160) * 6) / 6));
  // paredes rochosas
  for (let i = 0; i < 60; i++) {
    const x = Math.floor(r() * 320);
    const y = Math.floor(r() * 100);
    ellipse(ctx, x, y, 10 + Math.floor(r() * 20), 6 + Math.floor(r() * 10), r() < 0.5 ? '#2a1e24' : '#221820');
  }
  // estalactites
  for (let x = 0; x < 320; x += 12 + Math.floor(r() * 16)) {
    const h = 10 + Math.floor(r() * 30);
    poly(ctx, [[x, 0], [x + 5, h], [x + 10, 0]], '#30242a');
    line(ctx, x + 2, 0, x + 5, h - 2, '#45363e');
  }
  rect(ctx, 0, 112, 320, 48, '#2e2428');
  for (let i = 0; i < 300; i++) px(ctx, Math.floor(r() * 320), 112 + Math.floor(r() * 48), r() < 0.5 ? '#3a2e34' : '#1e161a');
  rect(ctx, 0, 110, 320, 3, '#160e12');
  for (let x = 0; x < 320; x += 30 + Math.floor(r() * 30)) {
    poly(ctx, [[x, 112], [x + 6, 92 - Math.floor(r() * 10)], [x + 12, 112]], '#3a2e34');
  }
  for (let i = 0; i < 8; i++) {
    const x = Math.floor(r() * 320);
    const y = 120 + Math.floor(r() * 36);
    line(ctx, x, y, x + 6, y - 2, '#c8c0a8');
    px(ctx, x + 7, y - 3, '#c8c0a8');
  }
  if (web) {
    const webAt = (cx, cy, R) => {
      for (let a = 0; a < 8; a++) line(ctx, cx, cy, Math.round(cx + Math.cos((a / 8) * 6.28) * R), Math.round(cy + Math.sin((a / 8) * 6.28) * R), '#8a86a0');
      for (let k = 1; k < 4; k++) {
        const rr = (R * k) / 4;
        for (let a = 0; a < 8; a++) {
          const a0 = (a / 8) * 6.28;
          const a1 = ((a + 1) / 8) * 6.28;
          line(ctx, Math.round(cx + Math.cos(a0) * rr), Math.round(cy + Math.sin(a0) * rr), Math.round(cx + Math.cos(a1) * rr), Math.round(cy + Math.sin(a1) * rr), '#6a6680');
        }
      }
    };
    webAt(30, 20, 36);
    webAt(290, 30, 40);
    webAt(160, -5, 50);
  }
}

function bgGrove(ctx, r) {
  bgForest(ctx, r, { sky0: '#2a0608', sky1: '#5a1418', far: '#30080c', mid: '#1a0406', ground: '#2a1a16', mist: '#6a2a2a', moon: '#e8a080', dead: true });
  for (let i = 0; i < 10; i++) curve(ctx, Math.floor(r() * 320), 160, Math.floor(r() * 320), 120, Math.floor(r() * 320), 112, 2, '#3a2016');
}

export function buildBattleBackgrounds(scene) {
  const make = (key, fn) => {
    const { canvas, ctx } = makeCanvas(320, 160);
    fn(ctx, rng(key.length * 131));
    addTexture(scene, key, canvas);
  };
  make('bg_forest', (c, r) => bgForest(c, r, { sky0: '#0e1422', sky1: '#2a3040', far: '#1a2a26', mid: '#0e1a16', ground: '#2a3a24', mist: '#4a5a5a', moon: '#d8d4c0' }));
  make('bg_deadforest', (c, r) => bgForest(c, r, { sky0: '#1a0a10', sky1: '#4a1a20', far: '#2a1218', mid: '#140a0c', ground: '#262220', mist: '#5a2a2a', moon: '#c85040', dead: true }));
  make('bg_cave', (c, r) => bgCave(c, r, false));
  make('bg_web', (c, r) => bgCave(c, r, true));
  make('bg_grove', (c, r) => bgGrove(c, r));
}

export function buildMisc(scene) {
  cursor(scene);
  light(scene);
  fog(scene);
  fx(scene);
  eventSprites(scene);
  buildBattleBackgrounds(scene);
}
