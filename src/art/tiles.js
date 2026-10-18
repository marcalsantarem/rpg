// Tileset 16x16 gerado proceduralmente + objetos desenhados em código.
import { makeCanvas, rng, px, rect, disc, ellipse, line, drawRows, addTexture, addSheet, shade } from '../core/Pixel.js';

const T = 16;
const COLS = 16;

// ---------- pintores de chão ----------
function speckle(ctx, ox, oy, r, base, colors, density = 0.25) {
  rect(ctx, ox, oy, T, T, base);
  for (let y = 0; y < T; y++)
    for (let x = 0; x < T; x++) if (r() < density) px(ctx, ox + x, oy + y, colors[Math.floor(r() * colors.length)]);
}

function grass(ctx, ox, oy, r, pal = ['#34502e', '#2a4226', '#40603a', '#4a6c40']) {
  speckle(ctx, ox, oy, r, pal[0], [pal[1], pal[2]], 0.3);
  for (let i = 0; i < 5; i++) {
    const x = ox + Math.floor(r() * 14) + 1;
    const y = oy + Math.floor(r() * 13) + 2;
    px(ctx, x, y, pal[3]);
    px(ctx, x, y - 1, pal[3]);
    px(ctx, x + 1, y, pal[1]);
  }
}

function dirt(ctx, ox, oy, r, pal = ['#6a5538', '#58462e', '#7c6646', '#4a3a26']) {
  speckle(ctx, ox, oy, r, pal[0], [pal[1], pal[2]], 0.35);
  for (let i = 0; i < 3; i++) {
    const x = ox + Math.floor(r() * 14);
    const y = oy + Math.floor(r() * 14);
    px(ctx, x, y, pal[3]);
    px(ctx, x + 1, y, pal[2]);
  }
}

function cobble(ctx, ox, oy, r) {
  rect(ctx, ox, oy, T, T, '#3e3a44');
  const stones = [
    [0, 0, 7, 5], [8, 0, 8, 4], [0, 6, 5, 5], [6, 5, 6, 6], [13, 5, 3, 6], [0, 12, 8, 4], [9, 12, 7, 4],
  ];
  for (const [x, y, w, h] of stones) {
    const c = ['#6c6874', '#625e6a', '#74707c'][Math.floor(r() * 3)];
    rect(ctx, ox + x, oy + y, w - 1, h - 1, c);
    rect(ctx, ox + x, oy + y, w - 1, 1, shade(c, 0.15));
    rect(ctx, ox + x, oy + y + h - 2, w - 1, 1, shade(c, -0.2));
  }
}

function water(ctx, ox, oy, r, frame) {
  rect(ctx, ox, oy, T, T, '#1c3450');
  for (let y = 0; y < T; y += 4)
    for (let x = 0; x < T; x++) {
      const v = Math.sin((x + frame * 4 + y * 1.7) * 0.7);
      if (v > 0.6) px(ctx, ox + x, oy + y + (frame ? 1 : 0), '#2e5478');
      if (v > 0.92) px(ctx, ox + x, oy + y + 1, '#6a90b0');
    }
}

function caveFloor(ctx, ox, oy, r, alt) {
  speckle(ctx, ox, oy, r, '#3a3034', ['#2e2629', '#45393e'], 0.35);
  for (let i = 0; i < 2; i++) {
    const x = ox + Math.floor(r() * 12) + 1;
    const y = oy + Math.floor(r() * 12) + 1;
    rect(ctx, x, y, 3, 2, '#2a2226');
    px(ctx, x, y, '#52454b');
  }
  if (alt) {
    // ossinhos e musgo
    line(ctx, ox + 3, oy + 10, ox + 7, oy + 8, '#c8c0a8');
    px(ctx, ox + 3, oy + 11, '#c8c0a8');
    px(ctx, ox + 7, oy + 7, '#c8c0a8');
    for (let i = 0; i < 6; i++) px(ctx, ox + 9 + Math.floor(r() * 5), oy + 2 + Math.floor(r() * 4), '#3a4a30');
  }
}

function caveWall(ctx, ox, oy, r) {
  rect(ctx, ox, oy, T, T, '#221a1e');
  for (let i = 0; i < 7; i++) {
    const x = ox + Math.floor(r() * 14);
    const y = oy + Math.floor(r() * 14);
    const w = 3 + Math.floor(r() * 4);
    rect(ctx, x, y, Math.min(w, ox + T - x), 2, '#2e2428');
    rect(ctx, x, y, Math.min(w, ox + T - x), 1, '#3c3036');
  }
  for (let i = 0; i < 10; i++) px(ctx, ox + Math.floor(r() * T), oy + Math.floor(r() * T), '#140e11');
}

function caveWallFace(ctx, ox, oy, r) {
  // parede frontal (visível quando há chão abaixo)
  rect(ctx, ox, oy, T, T, '#3a2e34');
  for (let x = 0; x < T; x += 4) {
    const h = 4 + Math.floor(r() * 6);
    rect(ctx, ox + x, oy, 3, h, '#2a2026');
    rect(ctx, ox + x + 3, oy, 1, T, '#1e161a');
  }
  rect(ctx, ox, oy + 13, T, 3, '#241c20');
  for (let i = 0; i < 8; i++) px(ctx, ox + Math.floor(r() * T), oy + Math.floor(r() * 12), '#4c3e44');
}

function woodFloor(ctx, ox, oy, r) {
  rect(ctx, ox, oy, T, T, '#6a4a30');
  for (let y = 0; y < T; y += 4) {
    rect(ctx, ox, oy + y + 3, T, 1, '#4a321e');
    const seam = Math.floor(r() * 12) + 2;
    px(ctx, ox + seam, oy + y, '#4a321e');
    px(ctx, ox + seam, oy + y + 1, '#4a321e');
    px(ctx, ox + seam, oy + y + 2, '#4a321e');
    for (let i = 0; i < 3; i++) px(ctx, ox + Math.floor(r() * T), oy + y + Math.floor(r() * 3), '#78563a');
  }
}

function stoneFloor(ctx, ox, oy, r) {
  rect(ctx, ox, oy, T, T, '#48444e');
  rect(ctx, ox, oy, T, 1, '#2e2a34');
  rect(ctx, ox, oy, 1, T, '#2e2a34');
  rect(ctx, ox + 8, oy + 8, 8, 1, '#2e2a34');
  rect(ctx, ox + 8, oy, 1, 8, '#2e2a34');
  for (let i = 0; i < 12; i++) px(ctx, ox + Math.floor(r() * T), oy + Math.floor(r() * T), r() < 0.5 ? '#54505a' : '#3e3a44');
}

function carpet(ctx, ox, oy) {
  rect(ctx, ox, oy, T, T, '#6a1c24');
  rect(ctx, ox + 1, oy, 1, T, '#c8a048');
  rect(ctx, ox + 14, oy, 1, T, '#c8a048');
  for (let y = 2; y < T; y += 4) {
    px(ctx, ox + 7, oy + y, '#8a2c34');
    px(ctx, ox + 8, oy + y + 1, '#8a2c34');
  }
}

function plaster(ctx, ox, oy, r, win, door) {
  rect(ctx, ox, oy, T, T, '#a89878');
  for (let i = 0; i < 14; i++) px(ctx, ox + Math.floor(r() * T), oy + Math.floor(r() * T), r() < 0.5 ? '#9a8a6c' : '#b4a486');
  rect(ctx, ox, oy, 2, T, '#5a4030');
  rect(ctx, ox + 14, oy, 2, T, '#5a4030');
  rect(ctx, ox, oy, T, 2, '#5a4030');
  rect(ctx, ox, oy + 14, T, 2, '#3e2c20');
  if (win) {
    rect(ctx, ox + 4, oy + 4, 8, 7, '#2a2018');
    rect(ctx, ox + 5, oy + 5, 6, 5, '#e8c060');
    rect(ctx, ox + 7, oy + 5, 1, 5, '#2a2018');
    rect(ctx, ox + 5, oy + 7, 6, 1, '#2a2018');
    px(ctx, ox + 5, oy + 5, '#f8e8a0');
  }
  if (door) {
    rect(ctx, ox + 3, oy + 3, 10, 13, '#2a1a10');
    rect(ctx, ox + 4, oy + 4, 8, 12, '#5a3a20');
    rect(ctx, ox + 8, oy + 4, 1, 12, '#3e2814');
    px(ctx, ox + 10, oy + 10, '#d8c060');
  }
}

function roof(ctx, ox, oy, r, base = '#6a2c2a', dark = '#441a1a', light = '#86403a') {
  rect(ctx, ox, oy, T, T, base);
  for (let y = 0; y < T; y += 4) {
    rect(ctx, ox, oy + y + 3, T, 1, dark);
    const off = (y / 4) % 2 ? 0 : 4;
    for (let x = off; x < T; x += 8) rect(ctx, ox + x, oy + y, 1, 3, dark);
    rect(ctx, ox, oy + y, T, 1, light);
  }
}

function chapelWall(ctx, ox, oy, r, kind) {
  rect(ctx, ox, oy, T, T, '#6e6a76');
  for (let y = 0; y < T; y += 4) {
    rect(ctx, ox, oy + y + 3, T, 1, '#4a4652');
    const off = (y / 4) % 2 ? 0 : 4;
    for (let x = off; x < T; x += 8) rect(ctx, ox + x, oy + y, 1, 3, '#4a4652');
  }
  if (kind === 'win') {
    rect(ctx, ox + 5, oy + 2, 6, 12, '#2a2030');
    rect(ctx, ox + 6, oy + 3, 4, 10, '#8a1c2c');
    px(ctx, ox + 7, oy + 5, '#d84050');
    px(ctx, ox + 8, oy + 8, '#3050a0');
    px(ctx, ox + 7, oy + 10, '#d0a040');
    rect(ctx, ox + 6, oy + 2, 4, 1, '#2a2030');
  }
  if (kind === 'door') {
    rect(ctx, ox + 3, oy + 2, 10, 14, '#1e1418');
    rect(ctx, ox + 4, oy + 3, 8, 13, '#4a2c1c');
    rect(ctx, ox + 5, oy + 2, 6, 1, '#1e1418');
    rect(ctx, ox + 8, oy + 3, 1, 13, '#2e1a10');
    px(ctx, ox + 6, oy + 9, '#a08040');
    px(ctx, ox + 10, oy + 9, '#a08040');
  }
}

function intWall(ctx, ox, oy, r, kind) {
  rect(ctx, ox, oy, T, T, '#4e3e4c');
  for (let x = 0; x < T; x += 4) rect(ctx, ox + x, oy, 1, 12, '#42343f');
  rect(ctx, ox, oy + 12, T, 4, '#2e222a');
  rect(ctx, ox, oy + 12, T, 1, '#6a5466');
  if (kind === 'shelf') {
    rect(ctx, ox + 1, oy + 1, 14, 15, '#3a2414');
    for (let y = 2; y < 14; y += 4) {
      for (let x = 2; x < 14; x += 2) rect(ctx, ox + x, oy + y, 1, 3, ['#7a2a2a', '#2a4a6a', '#6a6a2a', '#4a2a5a'][Math.floor(r() * 4)]);
      rect(ctx, ox + 2, oy + y + 3, 12, 1, '#5a3a20');
    }
  }
  if (kind === 'fire') {
    rect(ctx, ox + 1, oy + 2, 14, 14, '#5a5462');
    rect(ctx, ox + 3, oy + 6, 10, 10, '#140c0c');
    rect(ctx, ox + 1, oy + 2, 14, 2, '#706a78');
    disc(ctx, ox + 8, oy + 13, 3, '#d05020');
    disc(ctx, ox + 8, oy + 13, 1, '#f8c040');
  }
  if (kind === 'win') {
    rect(ctx, ox + 4, oy + 2, 8, 8, '#1e1820');
    rect(ctx, ox + 5, oy + 3, 6, 6, '#283858');
    rect(ctx, ox + 7, oy + 3, 1, 6, '#1e1820');
    rect(ctx, ox + 5, oy + 5, 6, 1, '#1e1820');
    px(ctx, ox + 9, oy + 4, '#c8c8e0');
  }
}

function canopy(ctx, ox, oy, r, pal) {
  rect(ctx, ox, oy, T, T, pal[0]);
  const blobs = [[3, 3], [11, 2], [7, 8], [1, 12], [13, 11], [8, 15], [15, 6], [0, 5]];
  for (const [bx, by] of blobs) {
    const clip = { x: ox, y: oy, w: T, h: T };
    disc(ctx, ox + bx, oy + by, 4, pal[1], clip);
    disc(ctx, ox + bx - 1, oy + by - 1, 3, pal[2], clip);
    disc(ctx, ox + bx - 2, oy + by - 2, 1, pal[3], clip);
  }
  for (let i = 0; i < 8; i++) px(ctx, ox + Math.floor(r() * T), oy + Math.floor(r() * T), pal[0]);
}

// ---------- objetos (transparentes, camada de decoração) ----------
function treeParts(ctx, ox, oy, r, top, pal) {
  // árvore 16x32: top = metade superior (copa), senão base (copa inferior + tronco)
  const { canvas: c, ctx: t } = makeCanvas(16, 32);
  const [o, d, m, l, h] = pal;
  disc(t, 8, 10, 7, o);
  disc(t, 8, 15, 7, o);
  rect(t, 5, 20, 6, 10, o);
  disc(t, 8, 10, 6, d);
  disc(t, 8, 15, 6, d);
  disc(t, 7, 9, 5, m);
  disc(t, 6, 13, 4, m);
  disc(t, 10, 15, 3, m);
  disc(t, 6, 8, 2, l);
  disc(t, 9, 12, 1, l);
  px(t, 5, 6, h);
  px(t, 8, 10, h);
  rect(t, 6, 21, 4, 9, '#4a321e');
  rect(t, 6, 21, 1, 9, '#2e1e12');
  rect(t, 9, 21, 1, 9, '#5e4228');
  rect(t, 5, 29, 6, 1, '#1a120c');
  ctx.drawImage(c, 0, top ? 0 : 16, 16, 16, ox, oy, 16, 16);
}

function deadTree(ctx, ox, oy, top, hanged) {
  const { canvas: c, ctx: t } = makeCanvas(16, 32);
  const o = '#120c0e';
  const b = '#3a2a26';
  const l = '#52403a';
  rect(t, 6, 10, 4, 21, o);
  rect(t, 7, 10, 2, 21, b);
  px(t, 7, 14, l);
  px(t, 7, 20, l);
  line(t, 7, 12, 2, 5, o);
  line(t, 8, 12, 3, 5, b);
  line(t, 8, 14, 14, 6, o);
  line(t, 8, 15, 14, 7, b);
  line(t, 3, 5, 1, 2, o);
  line(t, 3, 5, 5, 1, o);
  line(t, 12, 8, 13, 2, o);
  line(t, 8, 10, 8, 2, o);
  line(t, 7, 9, 6, 3, b);
  // folhas vermelhas esparsas
  [[2, 3], [5, 1], [13, 3], [14, 6], [8, 2], [1, 2], [12, 7]].forEach(([x, y]) => {
    px(t, x, y, '#8a1c1c');
    px(t, x + 1, y, '#5a1010');
  });
  rect(t, 5, 30, 6, 1, o);
  if (hanged) {
    line(t, 13, 7, 13, 12, '#8a7a5a');
    // corpo pendurado
    rect(t, 12, 12, 3, 3, '#a89a88');
    px(t, 12, 13, '#201010');
    rect(t, 11, 15, 5, 7, '#3a3430');
    rect(t, 12, 22, 1, 4, '#2a2422');
    rect(t, 14, 22, 1, 4, '#2a2422');
    px(t, 11, 16, '#a89a88');
    px(t, 15, 16, '#a89a88');
  }
  ctx.drawImage(c, 0, top ? 0 : 16, 16, 16, ox, oy, 16, 16);
}

const OBJ = {
  bush: {
    pal: { o: '#142012', d: '#24401e', m: '#2e5228', l: '#46703a', r: '#8a1c2a' },
    rows: [
      '................', '................', '................', '................',
      '.....oooooo.....', '...oommmmmloo...', '..ommmllmmmmmo..', '.ommllmmmmmmdmo.',
      '.omlmmmmmrmmmdo.', 'ommmmrmmmmmmddmo', 'ommmmmmmmmmdddmo', 'odmmmmmmmdddddmo',
      '.oddmmmdddddddo.', '..oodddddddoo...', '....oooooooo....', '................',
    ],
  },
  grave: {
    pal: { o: '#18141c', s: '#7a7684', d: '#56525e', l: '#9a96a4', g: '#2a4226', m: '#3c5a34' },
    rows: [
      '................', '.....oooooo.....', '....ollllsso....', '...olssssssdo...',
      '...olsdsdssdo...', '...olssssssdo...', '...olsddddsdo...', '...olssssssdo...',
      '...olsdddssdo...', '...olssssssdo...', '...olssssssdo...', '...odddddddddo..',
      '..oooooooooooo..', '..gmmgmmgmmgmg..', '................', '................',
    ],
  },
  cross: {
    pal: { o: '#18141c', s: '#6a5040', l: '#8a6a50', d: '#4a3428' },
    rows: [
      '................', '......ooo.......', '......olo.......', '......osd.......',
      '...oooosdoooo...', '...olllsssssdo..', '...oddddsdddddo.', '....ooo.sdooo...',
      '......osd.......', '......osd.......', '......osd.......', '......osd.......',
      '.....oosdoo.....', '....ooooooo.....', '................', '................',
    ],
  },
  fence: {
    pal: { o: '#1e140e', w: '#7a5a3a', l: '#9a7a54', d: '#4e3622' },
    rows: [
      '................', '................', '..o.......o.....', '.olo.....olo....',
      '.owdo....owdo...', 'ooooooooooooooooo'.slice(0, 16), 'lllllllllllllllll'.slice(0, 16), 'wwwwwwwwwwwwwwww',
      'ddddddddddddddd'.padEnd(16, 'd'), 'oooooooooooooooo', '.owdo....owdo...', '.owdo....owdo...',
      'oooooooooooooooo', 'llllllllllllllll', 'dddddddddddddddd', 'oooooooooooooooo',
    ],
  },
  well: {
    pal: { o: '#141018', s: '#7a7684', d: '#4e4a56', l: '#9a96a4', w: '#1c3450', b: '#2e5478', r: '#5a3a22' },
    rows: [
      '..r..........r..', '..r..........r..', '.orrrrrrrrrrrro.', '..r..........r..',
      '..r....oo....r..', '..r....oo....r..', '.ooooooooooooooo', 'olllllllllllllo.',
      'olsoooooooooslo.', 'olsowwwbwwwosdo.', 'olsowbwwwwwosdo.', 'olssoooooooosdo.',
      'oddsssdssssdddo.', 'odddsdddsddddo..', '.ooooooooooooo..', '................',
    ],
  },
  rock: {
    pal: { o: '#141018', s: '#6a6672', l: '#8a8694', d: '#46424e' },
    rows: [
      '................', '................', '................', '................',
      '................', '.....oooooo.....', '....ollllsso....', '...olsssssssdo..',
      '..olssssssssdo..', '..olssssssssddo.', '..osssssssssddo.', '..odsssssssdddo.',
      '...oddddddddddo.', '....oooooooooo..', '................', '................',
    ],
  },
  stalag: {
    pal: { o: '#0e0a0c', s: '#4a3e44', l: '#64565c', d: '#2e2428' },
    rows: [
      '................', '.......o........', '......olo.......', '......osdo......',
      '.....olsdo......', '.....olsdo......', '....olssdo......', '....olssddo.....',
      '...olsssddo.....', '...olsssddo..o..', '..olssssddo.olo.', '..olssssdddoosdo',
      '.olssssssddoosdo', '.oddddddddddoddo', '..oooooooooooooo', '................',
    ],
  },
  web: {
    pal: { w: '#d8d4e0', g: '#9a96a8' },
    rows: [
      'w......w......w.', '.g.....w.....g..', '..g....w....g...', '...gwwwwwwwg....',
      '...w...w...w....', '...w.gwwwg.w....', 'wwwwwwg.gwwwwwww', '...w.gwwwg.w....',
      '...w...w...w....', '...gwwwwwwwg....', '..g....w....g...', '.g.....w.....g..',
      'w......w......w.', '.......w........', '.......w........', '.......w........',
    ],
  },
  bones: {
    pal: { b: '#d0c8b0', d: '#8a826e', o: '#2a2226' },
    rows: [
      '................', '................', '................', '................',
      '................', '.......obbo.....', '......obbbbo....', '......obdbdo....',
      '.......obbo.....', '..bo....oo......', '...bbbbbbbbd....', '..bo......db....',
      '.......db.......', '.....bbbbbbd....', '.......d.b......', '................',
    ],
  },
  mushroom: {
    pal: { o: '#140c10', r: '#8a1c2a', l: '#b83a40', w: '#e0d8c8', s: '#c8b8a0' },
    rows: [
      '................', '................', '................', '................',
      '................', '................', '...ooooo........', '..orlwrro.......',
      '.orrrrwrro..ooo.', '.ooooooooo.olwro', '....osso...ooooo', '....osso....oso.',
      '....osso....oso.', '...oossoo...ooo.', '................', '................',
    ],
  },
  bramble: {
    pal: { o: '#0e0808', b: '#3a1a1a', l: '#5a2a24', t: '#c0b0a0', g: '#2a2a1a' },
    rows: [
      '..o.....o....o..', '.obo..oblo..obo.', 'oblboobbbo.oblbo', '.obbbbtbbbobbbo.',
      '..obbbbbbbbbbbo.', '.obtbbbbblbbbbo.', 'obbbbgbbbbbbtbo.', 'oblbbbbbtbbbbbbo',
      '.obbbbbbbbbbgbo.', '..obbbtbbbbbbbo.', '.obbbbbbbblbbbo.', 'obbbgbbbbbbbbtbo',
      'obtbbbbbbbbbbbo.', '.obbbbbobbbbbo..', '..ooobo.obooo...', '.....o...o......',
    ],
  },
  lamp: {
    pal: { o: '#0e0a0e', m: '#3a3640', l: '#f8d070', y: '#f8f0b0', d: '#c08030' },
    rows: [
      '......oooo......', '.....ommmmo.....', '....ooooooo.....', '....olyyldo.....',
      '....olyyldo.....', '....oddddddo....', '.....ommmmo.....', '.......mo.......',
      '.......mo.......', '.......mo.......', '.......mo.......', '.......mo.......',
      '.......mo.......', '......ommo......', '.....oooooo.....', '................',
    ],
  },
  sign: {
    pal: { o: '#1a120c', w: '#8a6a44', l: '#a8885c', d: '#5a4028', t: '#2a1e14' },
    rows: [
      '................', '................', '..oooooooooooo..', '..ollllllllllo..',
      '..owttwtwttwwdo.', '..owwwwwwwwwwdo.', '..owtwttwtwwwdo.', '..odddddddddddo.',
      '..oooooodoooooo.', '.......odo......', '.......odo......', '.......odo......',
      '......oodoo.....', '................', '................', '................',
    ],
  },
  counter: {
    pal: { o: '#1a100a', w: '#7a5434', l: '#9a7048', d: '#4a301c' },
    rows: [
      'oooooooooooooooo', 'llllllllllllllll', 'wwwwwwwwwwwwwwww', 'dddddddddddddddd',
      'oooooooooooooooo', 'wdwwwwwdwwwwwdww', 'wdwwwwwdwwwwwdww', 'wdwwwwwdwwwwwdww',
      'wdwwwwwdwwwwwdww', 'wdwwwwwdwwwwwdww', 'wdwwwwwdwwwwwdww', 'wdwwwwwdwwwwwdww',
      'dddddddddddddddd', 'oooooooooooooooo', '................', '................',
    ],
  },
  bed: {
    pal: { o: '#1a100a', w: '#6a4428', p: '#d8d0c0', s: '#a8a090', b: '#5a2a4a', l: '#7a3a62' },
    rows: [
      '.oooooooooooooo.', '.owwwwwwwwwwwwo.', '.oopppppppppppo.', '.opppppppppppso.',
      '.opssssssssssso.', '.oooooooooooooo.', '.obllllllllllbo.', '.oblbbbbbbbblbo.',
      '.obbbbbbbbbbbbo.', '.obbbbbbbbbbbbo.', '.obbbbbbbbbbbbo.', '.obbbbbbbbbbbbo.',
      '.oddddddddddddo.'.replace(/d/g, 'w'), '.oooooooooooooo.', '.ow..........wo.', '................',
    ],
  },
  table: {
    pal: { o: '#1a100a', w: '#7a5434', l: '#9a7048', d: '#4a301c', c: '#c8b878', f: '#f8e8a0' },
    rows: [
      '................', '................', '......of........', '......oc........',
      '.oooooooooooooo.', 'ollllllllllllllo', 'owwwwwwwwwwwwwwo', 'owwwwwwwwwwwwwwo',
      'odddddddddddddddo'.slice(0, 16), 'oooooooooooooooo', '.od..........do.', '.od..........do.',
      '.od..........do.', '.oo..........oo.', '................', '................',
    ],
  },
  chair: {
    pal: { o: '#1a100a', w: '#7a5434', l: '#9a7048', d: '#4a301c' },
    rows: [
      '................', '................', '................', '................',
      '.....oooooo.....', '.....olllwo.....', '.....owwwwo.....', '.....owwwwo.....',
      '....oooooooo....', '....owwwwwwo....', '....odddddd o...'.replace(' ', 'd'), '....oooooooo....',
      '....od....do....', '....od....do....', '....oo....oo....', '................',
    ],
  },
  barrel: {
    pal: { o: '#1a100a', w: '#7a5434', l: '#9a7048', d: '#4a301c', m: '#5a5a62' },
    rows: [
      '................', '................', '....oooooooo....', '...olllllllwo...',
      '...ommmmmmmmo...', '..olwwwwwwwwdo..', '..olwwwwwwwwdo..', '..ommmmmmmmmmo..',
      '..olwwwwwwwwdo..', '..olwwwwwwwwdo..', '..olwwwwwwwwdo..', '..ommmmmmmmmmo..',
      '...olwwwwwwdo...', '....oooooooo....', '................', '................',
    ],
  },
  crate: {
    pal: { o: '#1a100a', w: '#8a6440', l: '#a88050', d: '#5a3e24' },
    rows: [
      '................', '................', '.oooooooooooooo.', '.ollllllllllllo.',
      '.olwwwwwwwwwwdo.', '.owdwwwwwwwwdwo.', '.owwdwwwwwwdwwo.', '.owwwdwwwwdwwwo.',
      '.owwwwdwwdwwwwo.', '.owwwwwddwwwwwo.', '.owwwwdwwdwwwwo.', '.owwwdwwwwdwwwo.',
      '.odddddddddddddo'.slice(0, 16), '.oooooooooooooo.', '................', '................',
    ],
  },
  pew: {
    pal: { o: '#1a100a', w: '#5a3a22', l: '#7a5432', d: '#3a2414' },
    rows: [
      '................', '................', '................', 'oooooooooooooooo',
      'llllllllllllllll', 'wwwwwwwwwwwwwwww', 'oooooooooooooooo', 'dddddddddddddddd',
      'oooooooooooooooo', 'llllllllllllllll', 'wwwwwwwwwwwwwwww', 'oooooooooooooooo',
      'od............do', 'od............do', 'oo............oo', '................',
    ],
  },
  altar: {
    pal: { o: '#141018', s: '#8a8694', l: '#aaa6b4', d: '#5a5662', r: '#7a1c2a', g: '#c8a048' },
    rows: [
      '................', '................', '.......gg.......', '......g..g......',
      '.......gg.......', '.......gg.......', '.oooooooooooooo.', '.ollllllllllllo.',
      '.orrrrrrrrrrrro.', '.orrrrggrrrrrro.', '.orrrrrrrrrrrro.', '.osssssssssssdo.',
      '.osssssssssssdo.', '.oddddddddddddo.', '.oooooooooooooo.', '................',
    ],
  },
  candles: {
    pal: { o: '#141018', w: '#e0d8c0', y: '#f8e070', r: '#f08030', m: '#3a3640' },
    rows: [
      '................', '...y......y.....', '...r..y...r.....', '...o..r...o..y..',
      '..owo.o..owo.r..', '..owo.owooowo.o.', '..owo.owo.owoowo', '..owo.owo.owo.wo',
      '..owo.owo.owoowo', '.ommmmmmmmmmmmmo', '.ooooooooooooooo', '................',
      '................', '................', '................', '................',
    ],
  },
  pot: {
    pal: { o: '#141010', c: '#8a5a3a', l: '#a87250', d: '#5a3a24' },
    rows: [
      '................', '................', '................', '................',
      '................', '.....oooooo.....', '.....odddddo....', '......oooo......',
      '....olccccdo....', '...olcccccddo...', '...olcccccddo...', '...occcccdddo...',
      '....odddddddo...', '.....ooooooo....', '................', '................',
    ],
  },
  stump: {
    pal: { o: '#140c08', w: '#5a3e24', l: '#9a7a50', d: '#3a2614', r: '#7a5a38' },
    rows: [
      '................', '................', '................', '................',
      '................', '................', '....oooooooo....', '...olllrlllldo..',
      '...olrlllrlldo..', '...owllllllwdo..', '...owwwwwwwwdo..', '...owdwwwdwwdo..',
      '..oowwwdwwwwdoo.', '..ooooooooooooo.', '................', '................',
    ],
  },
  flowers: {
    pal: { r: '#a83040', w: '#d8d0e0', y: '#d8b040', g: '#1e3a1c' },
    rows: [
      '................', '................', '...r.......w....', '..rgr.....wgw...',
      '...g.......g....', '...g...y...g....', '.......g........', '..w...yg.....r..',
      '.wgw...g....rgr.', '..g..........g..', '..g.....r....g..', '.......rgr......',
      '........g.......', '........g.......', '................', '................',
    ],
  },
  stairsDown: {
    pal: { o: '#0a0608', a: '#4a3e44', b: '#3a3034', c: '#2a2226', d: '#1a1416', e: '#0e0a0c' },
    rows: [
      'oooooooooooooooo', 'oaaaaaaaaaaaaaao', 'oooooooooooooooo', 'obbbbbbbbbbbbbbo',
      'oooooooooooooooo', 'occccccccccccco'.padEnd(16, 'o'), 'oooooooooooooooo', 'oddddddddddddddo',
      'oooooooooooooooo', 'oeeeeeeeeeeeeeeo', 'oooooooooooooooo', 'oooooooooooooooo',
      'oooooooooooooooo', 'oooooooooooooooo', 'oooooooooooooooo', 'oooooooooooooooo',
    ],
  },
  stairsUp: {
    pal: { o: '#0a0608', a: '#6a5e64', b: '#5a4e54', c: '#4a3e44', d: '#3a2e34', e: '#2a2226' },
    rows: [
      'oooooooooooooooo', 'oeeeeeeeeeeeeeeo', 'oooooooooooooooo', 'oddddddddddddddo',
      'oooooooooooooooo', 'occccccccccccco'.padEnd(16, 'o'), 'oooooooooooooooo', 'obbbbbbbbbbbbbbo',
      'oooooooooooooooo', 'oaaaaaaaaaaaaaao', 'oooooooooooooooo', '................',
      '................', '................', '................', '................',
    ],
  },
  cocoon: {
    pal: { o: '#2a2630', w: '#d8d4e0', g: '#a09cb0', d: '#706c80' },
    rows: [
      '.......w........', '.......w........', '......ooo.......', '.....owwgo......',
      '....owgwwgo.....', '....owwwgwo.....', '...owgwwwwgo....', '...owwwgwwwo....',
      '...owwgwwgwo....', '...owgwwwwgo....', '...odwwgwwdo....', '....odwwwdo.....',
      '....oddgddo.....', '.....odddo......', '......ooo.......', '................',
    ],
  },
  bloodpool: {
    pal: { r: '#5a1014', d: '#3a080c', l: '#7a1c20' },
    rows: [
      '................', '................', '................', '................',
      '.....rrr........', '...rrrrrrr......', '..rrrlrrrrrr....', '..rrrrrrdrrrr...',
      '...rrrrdddrrr...', '....rrrrrrrr....', '......rrr...r...', '................',
      '..........rr....', '................', '................', '................',
    ],
  },
  roots: {
    pal: { o: '#100808', r: '#4a2a1e', l: '#6a4030' },
    rows: [
      'o...o.......o..o', 'ro.orro...orrorr', '.rorl.rro.rl..r.', '..rr...lrro....r',
      '.rr......rr..orr', 'rl.......lr.orl.', 'r........r..rr..', '..........rrr...',
      '...orro...r.....', '..orllro..r.....', '.or....rorl.....', 'or......rr......',
      'r........ro.....', '.........r......', '..........r.....', '................',
    ],
  },
};

function obj(ctx, ox, oy, name) {
  const o = OBJ[name];
  drawRows(ctx, o.rows, o.pal, ox, oy);
}

// ---------- definição do tileset ----------
// nome -> função(ctx, ox, oy, r)
const PAINTERS = {
  empty: () => {},
  void: (c, x, y) => rect(c, x, y, T, T, '#000000'),
  grass: (c, x, y, r) => grass(c, x, y, r),
  grass2: (c, x, y, r) => {
    grass(c, x, y, r);
    obj(c, x, y, 'flowers');
  },
  dirt: (c, x, y, r) => dirt(c, x, y, r),
  cobble: (c, x, y, r) => cobble(c, x, y, r),
  water1: (c, x, y, r) => water(c, x, y, r, 0),
  water2: (c, x, y, r) => water(c, x, y, r, 1),
  darkgrass: (c, x, y, r) => grass(c, x, y, r, ['#262c22', '#1c2218', '#30362a', '#3e2a28']),
  darkdirt: (c, x, y, r) => dirt(c, x, y, r, ['#3e2e28', '#30221e', '#4c3830', '#5a1c1c']),
  cavefloor: (c, x, y, r) => caveFloor(c, x, y, r, false),
  cavefloor2: (c, x, y, r) => caveFloor(c, x, y, r, true),
  cavewall: (c, x, y, r) => caveWall(c, x, y, r),
  caveface: (c, x, y, r) => caveWallFace(c, x, y, r),
  wood: (c, x, y, r) => woodFloor(c, x, y, r),
  stonefloor: (c, x, y, r) => stoneFloor(c, x, y, r),
  carpet: (c, x, y) => carpet(c, x, y),
  plaster: (c, x, y, r) => plaster(c, x, y, r),
  plasterwin: (c, x, y, r) => plaster(c, x, y, r, true),
  plasterdoor: (c, x, y, r) => plaster(c, x, y, r, false, true),
  roof: (c, x, y, r) => roof(c, x, y, r),
  roofslate: (c, x, y, r) => roof(c, x, y, r, '#34344a', '#1e1e2e', '#48486a'),
  chapel: (c, x, y, r) => chapelWall(c, x, y, r),
  chapelwin: (c, x, y, r) => chapelWall(c, x, y, r, 'win'),
  chapeldoor: (c, x, y, r) => chapelWall(c, x, y, r, 'door'),
  intwall: (c, x, y, r) => intWall(c, x, y, r),
  intshelf: (c, x, y, r) => intWall(c, x, y, r, 'shelf'),
  intfire: (c, x, y, r) => intWall(c, x, y, r, 'fire'),
  intwin: (c, x, y, r) => intWall(c, x, y, r, 'win'),
  canopy: (c, x, y, r) => canopy(c, x, y, r, ['#16261a', '#1e3420', '#2a4628', '#3e5e34']),
  redcanopy: (c, x, y, r) => canopy(c, x, y, r, ['#1e0e10', '#3a1418', '#561c20', '#7a2a28']),
  treeTop: (c, x, y, r) => treeParts(c, x, y, r, true, ['#0e1a0e', '#1e3420', '#2c4a2a', '#3e6234', '#5a7e46']),
  treeBottom: (c, x, y, r) => treeParts(c, x, y, r, false, ['#0e1a0e', '#1e3420', '#2c4a2a', '#3e6234', '#5a7e46']),
  deadTop: (c, x, y) => deadTree(c, x, y, true, false),
  deadBottom: (c, x, y) => deadTree(c, x, y, false, false),
  hangTop: (c, x, y) => deadTree(c, x, y, true, true),
  hangBottom: (c, x, y) => deadTree(c, x, y, false, true),
};
for (const name of Object.keys(OBJ)) PAINTERS[name] = (c, x, y) => obj(c, x, y, name);

export const TILE_NAMES = Object.keys(PAINTERS);
export const TILE_INDEX = Object.fromEntries(TILE_NAMES.map((n, i) => [n, i]));

export function buildTileset(scene) {
  const n = TILE_NAMES.length;
  const rows = Math.ceil(n / COLS);
  const { canvas, ctx } = makeCanvas(COLS * T, rows * T);
  TILE_NAMES.forEach((name, i) => {
    const ox = (i % COLS) * T;
    const oy = Math.floor(i / COLS) * T;
    PAINTERS[name](ctx, ox, oy, rng(1000 + i * 77));
  });
  addSheet(scene, 'tiles', canvas, T, T);
  // objetos avulsos também como texturas (para eventos)
  for (const name of ['cocoon', 'bones', 'web', 'bloodpool', 'candles', 'bramble']) {
    const { canvas: c, ctx: k } = makeCanvas(T, T);
    obj(k, 0, 0, name);
    addTexture(scene, `obj_${name}`, c);
  }
}

export { OBJ, ellipse };
