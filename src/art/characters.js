// Gerador de sprites de personagens 16x24 por camadas (cabeça, cabelo, corpo, pernas).
// Frames: dir*3 + f, dir: 0 baixo, 1 esquerda, 2 direita, 3 cima; f: 0 parado, 1 passo A, 2 passo B.
import { makeCanvas, drawRows, addSheet, mirror } from '../core/Pixel.js';

const E = '................';
const blank = () => Array(24).fill(E);

// Monta 24 linhas a partir de {linha: texto}
function rowsAt(start, list, full = true) {
  const out = blank();
  list.forEach((r, i) => {
    out[start + i] = full ? r : r;
  });
  return out;
}
const half = (start, list) => rowsAt(start, mirror(list));

// ---------- cabeça ----------
const HEAD_HALF = ['......oo', '....ooss', '...ossss', '..osssss', '..osssss', '..osssss', '..ossess', '..ossess', '..oSssss', '...oSSss', '....oooo'];
const HEAD_DOWN = half(2, HEAD_HALF);
const HEAD_UP = half(2, HEAD_HALF.map((r) => r.replace(/e/g, 's')));
const HEAD_LEFT = (() => {
  const r = half(2, HEAD_HALF.map((x) => x.replace(/e/g, 's')));
  const set = (x, y, ch) => {
    r[y] = r[y].slice(0, x) + ch + r[y].slice(x + 1);
  };
  set(4, 8, 'e');
  set(4, 9, 'e');
  set(12, 10, 'S');
  set(12, 11, 'S');
  set(2, 9, 'o');
  set(1, 9, '.');
  return r;
})();

// ---------- cabelos / chapéus ----------
const CAP = {
  down: half(1, ['.....ooo', '....ohhh', '...ohhhh', '..ohhjhh', '..ohhhhh', '..ohhhhh', '..ohh.hh', '..oh....', '..oh....']),
  up: half(1, ['.....ooo', '....ohhh', '...ohhhh', '..ohhjhh', '..ohhhhh', '..ohhhhh', '..ohhhhh', '..ohhhhh', '..ohhhhh', '..oHhhhh', '...oHHhh', '....oooo']),
  left: rowsAt(1, [
    '.....oooooo.....', '....ohhhhhhho...', '...ohhhhhhhhho..', '..ohhjhhhhhhhho.', '..ohhhhhhhhhhho.',
    '..ohhhhhhhhhhho.', '..oh.hhhhhhhhho.', '..o....hhhhhhho.', '..o.....hhhhho..', '........ohhhho..', '.........oooo...',
  ]),
};
const LONG = {
  down: half(1, ['.....ooo', '....ohhh', '...ohhhh', '..ohhjhh', '.ohhhhhh', '.ohhhhhh', '.ohhh.hh', '.ohh....', '.ohh....', '.ohh....', '.ohh....', '.ohhh...', '.ohhh...', '..ohh...', '...oo...']),
  up: half(1, ['.....ooo', '....ohhh', '...ohhhh', '..ohhjhh', '.ohhhhhh', '.ohhhhhh', '.ohhhhhh', '.ohhhhhh', '.ohhhhhh', '.ohhhhhh', '.ohhhhhh', '.ohHhhhh', '.ohHhhhh', '..oHHhhh', '...ooHHh', '.....ooo']),
  left: rowsAt(1, [
    '.....oooooo.....', '....ohhhhhhho...', '...ohhhhhhhhho..', '..ohhjhhhhhhhho.', '..ohhhhhhhhhhhho',
    '..ohhhhhhhhhhhho', '..oh.hhhhhhhhhho', '..o....hhhhhhhho', '..o.....hhhhhhho', '........hhhhhhho',
    '.........hhhhhho', '.........hhhhhho', '.........ohhhhho', '..........ohhho.', '...........ooo..',
  ]),
};
const HAT = {
  down: half(0, ['.......o', '......oc', '......oc', '.....occ', '....occc', '...oaaaa', 'oooccccc', '.ooooooo']),
  left: rowsAt(0, [
    '...........o....', '..........oco...', '.........occo...', '........occco...', '......occccco...',
    '.....oaaaaaao...', 'oooooccccccccooo', '.oooooooooooooo.',
  ]),
};
HAT.up = HAT.down;
const BEARD = {
  down: half(10, ['...ohhhh', '...ohhhh', '....ohhh', '.....ohh', '......oo']),
  left: rowsAt(10, ['..ohhhh.........', '..ohhhh.........', '...ohhh.........', '....oho.........', '.....o..........']),
};
const BAND = { down: half(6, ['........', '....wwww']) };

// ---------- corpos ----------
const TUNIC_HALF = ['....occc', '...occcc', '..occccc', '..ocoCcc', '..ocoCcc', '..osoaaa', '...oCccc', '...oCccc'];
const TUNIC = {
  down: half(12, TUNIC_HALF),
  up: half(12, TUNIC_HALF.map((r) => r.replace('s', 'c'))),
  left: rowsAt(12, ['.....occcco.....', '....occcccco....', '....occcccco....', '....occCCcco....', '....occCCcco....', '....oaasaaao....', '....oCccccco....', '.....oCccco.....']),
};
const LEGS = {
  down: [
    ['....oppooppo....', '....oppooppo....', '....oPPooPPo....', '....oooooooo....'],
    ['....oppooppo....', '....oppooPPo....', '....oPPooooo....', '....oooo........'],
  ],
  left: [
    ['......oppo......', '......oppo......', '.....oPPPo......', '.....ooooo......'],
    ['.....oppppo.....', '....oppo.oppo...', '...oPPPo.oPPo...', '...ooooo.oooo...'],
    ['.....oppppo.....', '....oPPo.oppo...', '...oPPPo.oPPo...', '...ooooo.oooo...'],
  ],
};
const ROBE_HALF = ['....occc', '...occcc', '..occccc', '..ocoCcc', '..ocoCcc', '..osoCca', '..oCcccc', '..oCcccc', '..oCcccc', '.oCccccc', '.oCCcccc', '.ooooooo'];
const ROBE = {
  down: half(12, ROBE_HALF),
  up: half(12, ROBE_HALF.map((r) => r.replace('s', 'c').replace('a', 'c'))),
  left: rowsAt(12, [
    '.....occcco.....', '....occcccco....', '....occcccco....', '....occCCcco....', '....occCCcco....', '....occsacco....',
    '....oCcccccco...', '...oCcccccccco..', '...oCcccccccco..', '...oCCccccccco..', '..oCCccccccccco.', '..ooooooooooooo.',
  ]),
  feet: {
    down: ['.oooooooooooooo.', '.ooooooooooPPoo.'],
    left: ['..ooooooooooooo.', '.oPPooooooooooo.', '..ooooooooooPPo.'],
  },
};

function overlay(base, layer) {
  return base.map((r, y) => {
    const l = layer[y];
    if (!l || l === E) return r;
    let out = '';
    for (let x = 0; x < 16; x++) out += l[x] && l[x] !== '.' ? l[x] : r[x];
    return out;
  });
}

function reverseRows(rows) {
  return rows.map((r) => [...r].reverse().join(''));
}

const HAIR_SETS = { short: CAP, long: LONG };

// Monta as linhas de um frame
function composeFrame(def, dir, f) {
  const d = dir === 'right' ? 'left' : dir;
  let rows = blank();
  const robe = def.body === 'robe';
  const body = robe ? ROBE : TUNIC;
  // pernas
  if (!robe) {
    const set = LEGS[d === 'up' ? 'down' : d];
    let legs;
    if (d === 'left') legs = set[f];
    else legs = f === 0 ? set[0] : f === 1 ? set[1] : reverseRows(set[1]);
    rows = overlay(rows, rowsAt(20, legs));
  }
  rows = overlay(rows, body[d]);
  if (robe && f > 0) {
    const feet = d === 'left' ? ROBE.feet.left[f] : f === 1 ? ROBE.feet.down[1] : reverseRows([ROBE.feet.down[1]])[0];
    rows[23] = feet;
  }
  // cabeça
  const head = d === 'down' ? HEAD_DOWN : d === 'up' ? HEAD_UP : HEAD_LEFT;
  rows = overlay(rows, head);
  // cabelo / capuz
  const hairStyle = def.hair;
  if (hairStyle && hairStyle !== 'bald') {
    const set = HAIR_SETS[hairStyle];
    let layer = set[d];
    if (def.hairChar && def.hairChar !== 'h') layer = layer.map((r) => r.replace(/[hHj]/g, (m) => (m === 'h' ? def.hairChar : m === 'H' ? def.hairChar.toUpperCase() : def.hairChar)));
    if (def.hat) layer = layer.map((r, y) => (y < 7 ? E : r));
    rows = overlay(rows, layer);
  }
  if (def.band && d === 'down') rows = overlay(rows, BAND.down);
  if (def.beard) rows = overlay(rows, d === 'up' ? blank() : BEARD[d]);
  if (def.hat) rows = overlay(rows, HAT[d]);
  if (def.child) rows = [E, E, E, ...rows.slice(0, 13), ...rows.slice(14, 18), ...rows.slice(20, 24)];
  if (dir === 'right') rows = reverseRows(rows);
  return rows;
}

const BASE_PAL = { o: '#1a1018', e: '#24141c', w: '#d8d0e0' };

export function buildCharacter(scene, key, def) {
  const { canvas, ctx } = makeCanvas(48, 96);
  const pal = { ...BASE_PAL, ...def.pal };
  if (pal.c && !pal.C) pal.C = pal.c;
  // a sombra do cabelo/capuz quando hairChar é 'a'
  if (def.hairChar === 'a') pal.A = pal.A ?? pal.a;
  ['down', 'left', 'right', 'up'].forEach((dir, di) => {
    for (let f = 0; f < 3; f++) {
      drawRows(ctx, composeFrame(def, dir, f), pal, f * 16, di * 24);
    }
  });
  addSheet(scene, key, canvas, 16, 24);
}

// ---------- sprites especiais ----------
const CAT = {
  pal: { o: '#0a080c', k: '#26222a', l: '#3e3844', y: '#e8d040' },
  down: [
    E, E, E, E, E, E, E, E, E, E,
    '....o.....o.....', '...oko...oko....', '...okkoooko.....'.padEnd(16, '.'), '...okkkkkkko....', '...okykkykko....', '...okkkkkkko....',
    '....okkkkko.....', '...okkkkkkko.o..', '...okkkkkkko.ko.', '...okkkkkkkokko.', '...okklkkkkkko..', '...okkokkokko...', '...oo.oo.oo.....', E,
  ],
  left: [
    E, E, E, E, E, E, E, E, E, E, E, E,
    '..o.o...........', '.okoko..........', '.okkkko.........', '.oykkko.......o.', '..okkkooooooooko', '..okkkkkkkkkkko.',
    '...okkkkkkkkko..', '...okklkkkkkko..', '...oko.oko.oko..', '...oo..oo..oo...', E, E,
  ],
};

export function buildCat(scene, key) {
  const { canvas, ctx } = makeCanvas(48, 96);
  const up = CAT.down.map((r) => r.replace(/y/g, 'k'));
  const frames = [CAT.down, CAT.left, reverseRows(CAT.left), up];
  frames.forEach((rows, di) => {
    for (let f = 0; f < 3; f++) drawRows(ctx, rows, CAT.pal, f * 16, di * 24 + (f === 1 ? -1 : 0));
  });
  addSheet(scene, key, canvas, 16, 24);
}

// ---------- definições ----------
const SKIN = { s: '#e8b890', S: '#c08868' };
const PALE = { s: '#e8d4c8', S: '#b8a0a0' };

export const CHARACTERS = {
  aren: { body: 'tunic', hair: 'short', pal: { ...SKIN, h: '#3a2e2a', H: '#241c1a', j: '#5a4a40', c: '#5e5040', C: '#40362a', a: '#8a6a3a', p: '#34303c', P: '#221e28' } },
  selene: { body: 'robe', hair: 'long', hairChar: 'a', band: true, pal: { ...PALE, a: '#e4e0ec', A: '#a8a4b8', c: '#34447a', C: '#222c54', w: '#9890b0' } },
  kael: { body: 'tunic', hair: 'long', hairChar: 'a', pal: { ...SKIN, a: '#3a5432', A: '#26381e', c: '#6a4a2e', C: '#4a321e', p: '#3a3a2a', P: '#2a2018' } },
  mirela: { body: 'robe', hair: 'long', hat: true, pal: { ...PALE, h: '#b8a8c8', H: '#8a7a9a', j: '#d8ccE8', c: '#46285a', C: '#2c1838', a: '#9a2030' } },
  elder: { body: 'robe', hair: 'short', beard: true, pal: { ...SKIN, h: '#d8d4d0', H: '#a8a4a0', j: '#f4f4f4', c: '#58505e', C: '#3c3642', a: '#a89060' } },
  villager: { body: 'tunic', hair: 'short', pal: { ...SKIN, h: '#6a4a2a', H: '#4a321c', j: '#8a6a40', c: '#4a5a3a', C: '#323e26', a: '#5a3a22', p: '#3a3430', P: '#2a2420' } },
  woman: { body: 'robe', hair: 'long', pal: { ...SKIN, h: '#8a5a2a', H: '#5a3a1c', j: '#aa7a40', c: '#7a3a3a', C: '#542626', a: '#d8d0c0' } },
  innkeeper: { body: 'robe', hair: 'long', pal: { ...SKIN, h: '#4a2a1a', H: '#2e1a10', j: '#6a4028', c: '#3e5a4a', C: '#2a4034', a: '#d8d0c0' } },
  widow: { body: 'robe', hair: 'long', hairChar: 'a', pal: { ...PALE, a: '#24202a', A: '#141018', c: '#2a2630', C: '#18141c' } },
  smith: { body: 'tunic', hair: 'bald', beard: true, pal: { s: '#d8a078', S: '#a87050', h: '#3a2a20', H: '#241810', j: '#3a2a20', c: '#5a4a3e', C: '#3e3228', a: '#2a2420', p: '#3a3430', P: '#2a2420' } },
  guard: { body: 'tunic', hair: 'short', hairChar: 'm', pal: { ...SKIN, m: '#8a8a9a', M: '#5a5a6a', c: '#6a6a7a', C: '#4a4a5a', a: '#8a2a2a', p: '#3a3440', P: '#221e28' } },
  child: { body: 'tunic', hair: 'short', child: true, pal: { ...SKIN, h: '#c8a050', H: '#9a7830', j: '#e8c870', c: '#5a6a8a', C: '#3e4a66', a: '#4a3a2a', p: '#4a3a2a', P: '#2a2018' } },
  oldwoman: { body: 'robe', hair: 'long', pal: { ...SKIN, h: '#a8a4a8', H: '#7a767a', j: '#c8c4c8', c: '#5a4a3a', C: '#3e3226', a: '#8a7a5a' } },
  drunk: { body: 'tunic', hair: 'short', pal: { s: '#e8a890', S: '#c07868', h: '#4a4a4a', H: '#2a2a2a', j: '#6a6a6a', c: '#6a5a3a', C: '#4a3e28', a: '#3a2a1a', p: '#3a3430', P: '#2a2420' } },
  stranger: { body: 'robe', hair: 'long', hairChar: 'a', pal: { s: '#120e14', S: '#0a080c', e: '#e02828', a: '#16121a', A: '#0c0a10', c: '#1c1820', C: '#100e14' } },
  lia: { body: 'robe', hair: 'long', child: true, pal: { ...SKIN, h: '#2a1e1a', H: '#1a1210', j: '#3e2e28', c: '#c8c0b0', C: '#9a9284', a: '#8a2a3a' } },
  ghostgirl: { body: 'robe', hair: 'long', child: true, pal: { s: '#c8d4e4', S: '#98a4c0', e: '#000000', h: '#141018', H: '#0a080c', j: '#2a2430', c: '#d8dcec', C: '#a8acc8', a: '#d8dcec' } },
  priestghost: { body: 'robe', hair: 'bald', pal: { s: '#a8b8c8', S: '#788898', e: '#101820', c: '#c8d0e0', C: '#98a0b8', a: '#c8a048' } },
};

export function buildAllCharacters(scene) {
  for (const [id, def] of Object.entries(CHARACTERS)) buildCharacter(scene, `chr_${id}`, def);
  buildCat(scene, 'chr_cat');
}
