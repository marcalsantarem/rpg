// Gerador de sprites 16x24 por camadas, com sombreamento automático.
// Frames: dir*3 + f — dir: 0 baixo, 1 esquerda, 2 direita, 3 cima; f: 0 parado, 1 passo A, 2 passo B.
//
// Letras dos moldes:
//   o contorno · e olho · m boca · g/G ouro · j brilho do cabelo · q brilho da pele
//   materiais (sombreados automaticamente; maiúscula = sombra explícita):
//   s pele · h cabelo · c roupa · d roupa secundária · a cinto/detalhe · p calça · b bota
//   n metal · r capa/capuz/faixa · t branco/avental · u couro/madeira
import { makeCanvas, addSheet, shade, disc, px, outlineCanvas, ellipse } from '../core/Pixel.js';

const E = '................';
const blank = () => Array(24).fill(E);
const MATERIALS = 'shcdapbnrtu';

// linha simétrica com contorno: pad pontos + 'o' + miolo + 'o' + pad pontos
const sym = (pad, inner) => {
  const s = `${'.'.repeat(pad)}o${inner}o${'.'.repeat(pad)}`;
  if (s.length !== 16) throw new Error(`linha inválida "${s}"`);
  return s;
};
function rowsAt(start, list) {
  const out = blank();
  list.forEach((r, i) => {
    if (r.length !== 16) throw new Error(`linha ${start + i} com ${r.length} colunas: "${r}"`);
    out[start + i] = r;
  });
  return out;
}
function setPx(rows, x, y, ch) {
  rows[y] = rows[y].slice(0, x) + ch + rows[y].slice(x + 1);
}
const reverseRows = (rows) => rows.map((r) => [...r].reverse().join(''));

// ---------------------------------------------------------------- cabeça
const FACE_DOWN = rowsAt(3, [
  '....oooooooo....',
  sym(3, 'ssssssss'),
  sym(2, 'ssssssssss'),
  sym(2, 'ssssssssss'),
  sym(2, 'sHHssssHHs'),
  sym(2, 'ssessssess'),
  sym(2, 'qsessssesS'),
  sym(2, 'ssssmmsssS'),
  sym(3, 'SssssssS'),
  '....oooooooo....',
]);
const FACE_UP = rowsAt(3, ['....oooooooo....', sym(3, 'ssssssss'), ...Array(6).fill(sym(2, 'ssssssssss')), sym(3, 'SssssssS'), '....oooooooo....']);
const FACE_LEFT = (() => {
  const r = rowsAt(3, [
    '....oooooooo....',
    sym(3, 'ssssssss'),
    sym(2, 'ssssssssss'),
    sym(2, 'ssssssssss'),
    sym(2, 'HHssssssss'),
    sym(2, 'sesssssSss'),
    sym(2, 'qesssssSSs'),
    sym(2, 'smsssssssS'),
    sym(3, 'SssssssS'),
    '....oooooooo....',
  ]);
  setPx(r, 1, 9, 'o');
  setPx(r, 2, 9, 's');
  return r;
})();

// ---------------------------------------------------------------- cabelos e chapéus
const SHORT_TOP = ['.....oooooo.....', '...oohhhhhhoo...', '..ohhhhjjhhhho..', '.ohhhjjhhhhHhho.', '.ohhjhhhhhhhHho.', '.ohHhhhhhhhhHho.'];
const HAIR = {
  short: {
    down: rowsAt(1, [...SHORT_TOP, '.ohhh.hhhh.hhho.', '.oh..........ho.']),
    up: rowsAt(1, [...SHORT_TOP, '.ohhHhhhhhhHhho.', '.ohhhHhhhhHhhho.', '.oHhhhhhhhhhhHo.', '..oHhhhhhhhhHo..', '...oHHhhhhHHo...', '....oooooooo....']),
    left: rowsAt(1, [
      '.....oooooo.....', '....ohhhhhhoo...', '...ohhhjjhhhho..', '..ohhjjhhhhHhho.', '..ohjhhhhhhhHho.', '..ohhhhhhhhHhho.',
      '..oh.hhhhhhhhho.', '..o...hhhhhhhho.', '..o....hhhhhho..', '........hhhhho..', '.........hhho...',
    ]),
  },
  long: {
    down: rowsAt(1, [
      ...SHORT_TOP, '.ohhh.hhhh.hhho.', '.ohh........hho.', '.ohh........hho.', '.ohh........hho.', '.ohHh......hHho.',
      '.ohHho....ohHho.', '.ohHho....ohHho.', '..ohho....ohho..', '...oo......oo...',
    ]),
    up: rowsAt(1, [
      ...SHORT_TOP, '.ohhHhhhhhhHhho.', '.ohhhHhhhhHhhho.', '.oHhhhhhhhhhhHo.', '.ohhHhhhhhhHhho.', '.ohhhHhhhhHhhho.',
      '.ohHhhhhhhhhHho.', '.ohHhhjhhjhhHho.', '..ohHhhhhhhHho..', '...ooHhhhhHoo...', '.....oooooo.....',
    ]),
    left: rowsAt(1, [
      '.....oooooo.....', '....ohhhhhhoo...', '...ohhhjjhhhho..', '..ohhjjhhhhHhho.', '..ohjhhhhhhhHho.', '..ohhhhhhhhHhho.',
      '..oh.hhhhhhhhho.', '..o...hhhhhhhhho', '..o....hhhhhhhho', '........hhhhhHho', '.........hhhHho.', '.........hhHhho.',
      '.........ohHho..', '..........ohho..', '...........oo...',
    ]),
  },
};
const HAT = {
  down: rowsAt(0, ['.......oo.......', '......ocCo......', '......occCo.....', '.....occcCo.....', '.....occccCo....', '....orrrrrrro...', 'ooocccccccccCooo', '.oooooooooooooo.']),
  left: rowsAt(0, ['...........oo...', '..........ocCo..', '.........occCo..', '........occcCo..', '......occcccCo..', '.....orrrrrrro..', 'oooocccccccccooo', '.oooooooooooooo.']),
};
HAT.up = HAT.down;
const BEARD = {
  down: rowsAt(10, ['...hhhhhhhhhh...', '...ohhhhhhhho...', '....ohhhhhho....', '.....ohhhho.....', '......oHHo......']),
  left: rowsAt(10, ['..hhhhh.........', '..ohhhho........', '...ohhho........', '....oho.........']),
};
const VEIL_BAND = rowsAt(6, ['.oaaaaaaaaaaaao.']);
const HELMET_NOSE = rowsAt(7, ['.......nn.......', '.......nN.......']);

// ---------------------------------------------------------------- corpos
const TORSO_DOWN = [
  '....occcccco....',
  '..occcddddccco..',
  '.occccddddcccco.',
  `.oco${'ccddddcc'}oco.`,
  `.oco${'cccddccc'}oco.`,
  `.oso${'aaaggaaa'}oso.`,
];
const TORSO_LEFT = ['.....occcco.....', '....odccccco....', '...odcccccco....', '...odcCCCcco....', '...odcCCCcco....', '...oaasaagao....'];
const BODY = {
  tunic: {
    down: rowsAt(12, [...TORSO_DOWN, `..o${'cccccccccc'}o..`, `..o${'CccccccccC'}o..`]),
    left: rowsAt(12, [...TORSO_LEFT, '...occccccco....', '....oCccccCo....']),
  },
  robe: {
    down: rowsAt(12, [
      ...TORSO_DOWN, `..o${'ccccddcccc'}o..`, `..o${'ccccddcccc'}o..`, `..o${'CcccddcccC'}o..`, `.o${'CccccddccccC'}o.`, `.o${'CCcccddcccCC'}o.`, '.oooooooooooooo.',
    ]),
    left: rowsAt(12, [
      ...TORSO_LEFT, '...odcccccco....', '...odccccccco...', '..oCdccccccco...', '..oCdcccccccCo..', '.oCCdccccccCCo..', '.ooooooooooooo..',
    ]),
  },
};
for (const b of Object.values(BODY)) b.up = b.down.map((r) => r.replace(/d/g, 'c').replace(/g/g, 'a'));

const LEGS = {
  down: [
    ['....oppooppo....', '....obboobbo....', '...obbboobbbo...', '...oooooooooo...'],
    ['....oppooppo....', '....obboobbo....', '...obbbooooo....', '...ooooo........'],
  ],
  left: [
    ['......oppo......', '......obbo......', '.....obbbo......', '.....ooooo......'],
    ['.....opppo......', '....oppoobbo....', '...obbbo.obbo...', '...ooooo.oooo...'],
    ['.....opppo......', '....obboobbo....', '...obbbo.obbo...', '...ooooo.oooo...'],
  ],
};
const ROBE_FEET = { down: '.oooooooooobbo..', left: ['obbooooooooooo..', '.oooooooooobbo..'] };

// ---------------------------------------------------------------- equipamentos
const GEAR = {
  // capa vermelha do escudeiro
  cape: {
    back: {
      down: rowsAt(14, ['o..............o', 'or............ro', 'or............ro', 'or............ro', 'orR..........Rro', 'orR..........Rro', '.orR........Rro.', '..ooo......ooo..']),
      left: rowsAt(13, ['................', '...........ro...', '...........rro..', '...........rRro.', '...........rRro.', '..........rrRro.', '..........rRRro.', '.........orRRo..', '.........oooo...']),
    },
    front: {
      up: rowsAt(12, [
        '....orrrrrro....', '..orrrrrrrrrro..', '.orrrrrrrrrrrro.', '.orrRrrrrrrRrro.', '.orrRrrrrrrRrro.', '.orrRrrrrrrRrro.', '.orRrrrrrrrrRro.', '.orRrrrrrrrrRro.',
        '..orRrrrrrrRro..', '...oooooooooo...',
      ]),
    },
  },
  quiver: {
    front: {
      up: rowsAt(9, ['.........t.t....', '........tutu....', '........ouuo....', '........ouuo....', '.......ouuo.....', '.......ouuo.....', '......ouuo......', '......ouuo......', '......oooo......']),
      down: rowsAt(13, ['..........u.....', '.........u......', '........u.......', '.......u........']),
    },
    back: {
      down: rowsAt(9, ['............tt..', '............uo..', '............uo..']),
      left: rowsAt(9, ['..........t.t...', '..........tut...', '..........ouuo..', '...........ouuo.', '...........ouuo.', '...........ouuo.', '............oo..']),
    },
  },
  pendant: { front: { down: rowsAt(14, ['.......gg.......', '......gggg......', '.......gG.......']) } },
  apron: {
    front: {
      down: rowsAt(14, ['......tttt......', '.....tttttt.....', '.....tttttt.....', '.....tttttt.....', '.....tTTTTt.....', '.....tTTTTt.....', '......tttt......']),
      left: rowsAt(15, ['....ttt.........', '....ttt.........', '...ottt.........', '...ottt.........', '...oTTT.........']),
    },
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

const remap = (rows, map) => rows.map((r) => r.replace(/[hHj]/g, (m) => map[m] ?? m));

// Monta as linhas (letras) de um frame
export function composeFrame(def, dir, f) {
  const d = dir === 'right' ? 'left' : dir;
  let rows = blank();
  const robe = def.body === 'robe';
  const body = BODY[def.body];
  const gear = (def.gear ?? []).map((g) => GEAR[g]);
  // camadas de trás
  for (const g of gear) if (g.back?.[d]) rows = overlay(rows, g.back[d]);
  if (!robe) {
    const set = LEGS[d === 'up' ? 'down' : d];
    const legs = d === 'left' ? set[f] : f === 0 ? set[0] : f === 1 ? set[1] : reverseRows(set[1]);
    rows = overlay(rows, rowsAt(20, legs));
  }
  rows = overlay(rows, body[d]);
  if (robe && f > 0) {
    rows[23] = d === 'left' ? ROBE_FEET.left[f - 1] : f === 1 ? ROBE_FEET.down : reverseRows([ROBE_FEET.down])[0];
  }
  rows = overlay(rows, d === 'down' ? FACE_DOWN : d === 'up' ? FACE_UP : FACE_LEFT);
  // cabelo / capuz / véu
  if (def.hair && def.hair !== 'bald') {
    let layer = HAIR[def.hair][d];
    if (def.hairMat) {
      const m = def.hairMat;
      layer = remap(layer, { h: m, H: m.toUpperCase(), j: m });
    }
    if (def.hat) layer = layer.map((r, y) => (y < 7 ? E : r));
    rows = overlay(rows, layer);
  }
  if (def.veilBand && d === 'down') rows = overlay(rows, VEIL_BAND);
  if (def.helmet && d === 'down') rows = overlay(rows, HELMET_NOSE);
  if (def.beard && d !== 'up') rows = overlay(rows, BEARD[d]);
  if (def.hat) rows = overlay(rows, HAT[d]);
  for (const g of gear) if (g.front?.[d]) rows = overlay(rows, g.front[d]);
  if (def.child) rows = [E, E, E, ...rows.slice(0, 13), ...rows.slice(14, 18), ...rows.slice(20, 24)];
  if (dir === 'right') rows = reverseRows(rows);
  return rows;
}

const FIXED = { o: '#1c1420', e: '#1c1424', m: '#a8645a', g: '#e8c050', G: '#9a7428', q: '#fff0dc' };

function buildPalette(def) {
  const pal = { ...FIXED };
  for (const [k, v] of Object.entries(def.pal)) {
    pal[k] = v;
    if (MATERIALS.includes(k)) {
      pal[k.toUpperCase()] = shade(v, -0.32);
      pal[`${k}+`] = shade(v, 0.22);
    }
  }
  if (def.pal.h) pal.j = shade(def.pal.h, 0.38);
  if (def.pal.e) pal.e = def.pal.e;
  return pal;
}

// Desenha o frame com luz vinda do alto à esquerda: borda direita/inferior escurece, superior/esquerda clareia.
function drawShaded(ctx, rows, pal, ox, oy) {
  const at = (x, y) => (y < 0 || y >= rows.length || x < 0 || x >= 16 ? '.' : rows[y][x]);
  const edge = (c) => c === '.' || c === 'o';
  for (let y = 0; y < rows.length; y++)
    for (let x = 0; x < 16; x++) {
      const ch = rows[y][x];
      if (ch === '.') continue;
      let col = pal[ch];
      if (MATERIALS.includes(ch) && pal[ch.toUpperCase()]) {
        if (edge(at(x + 1, y)) || edge(at(x, y + 1))) col = pal[ch.toUpperCase()];
        else if (edge(at(x - 1, y)) || edge(at(x, y - 1))) col = pal[`${ch}+`];
      }
      if (!col) continue;
      ctx.fillStyle = col;
      ctx.fillRect(ox + x, oy + y, 1, 1);
    }
}

export function buildCharacter(scene, key, def) {
  const { canvas, ctx } = makeCanvas(48, 96);
  const pal = buildPalette(def);
  ['down', 'left', 'right', 'up'].forEach((dir, di) => {
    for (let f = 0; f < 3; f++) drawShaded(ctx, composeFrame(def, dir, f), pal, f * 16, di * 24);
  });
  addSheet(scene, key, canvas, 16, 24);
}

// ---------------------------------------------------------------- sprites especiais
const CAT = {
  pal: { o: '#0a080c', k: '#2e2a34', l: '#4a4454', y: '#e8d040', p: '#e890a0' },
  down: [
    E, E, E, E, E, E, E, E, E, E,
    '....o.....o.....', '...olo...olo....', '...okkoooko.....', '...okkkkkkko....', '...okykkykko....', '...okkkpkkko....',
    '....okkkkko.....', '...okkkkkkko.o..', '...okkllkkko.ko.', '...okkkkkkkokko.', '...okklkkkkkko..', '...okkokkokko...', '...oo.oo.oo.....', E,
  ],
  left: [
    E, E, E, E, E, E, E, E, E, E, E, E,
    '..o.o...........', '.okoko..........', '.okkkko.........', '.oykkko.......o.', '..okkkooooooooko', '..okkkkkkkkkkko.',
    '...okklkkkkkko..', '...okkkkkkkkko..', '...oko.oko.oko..', '...oo..oo..oo...', E, E,
  ],
};

function drawRowsSimple(ctx, rows, pal, ox, oy) {
  rows.forEach((r, y) => {
    for (let x = 0; x < r.length; x++) {
      const c = pal[r[x]];
      if (!c) continue;
      ctx.fillStyle = c;
      ctx.fillRect(ox + x, oy + y, 1, 1);
    }
  });
}

export function buildCat(scene, key) {
  const { canvas, ctx } = makeCanvas(48, 96);
  const up = CAT.down.map((r) => r.replace(/[yp]/g, 'k'));
  const frames = [CAT.down, CAT.left, reverseRows(CAT.left), up];
  frames.forEach((rows, di) => {
    for (let f = 0; f < 3; f++) drawRowsSimple(ctx, rows, CAT.pal, f * 16, di * 24 + (f === 1 ? -1 : 0));
  });
  addSheet(scene, key, canvas, 16, 24);
}

// Fada luminosa (guia) — mesma folha de 3x4 frames, flutuando
export function buildFairy(scene, key) {
  const { canvas, ctx } = makeCanvas(48, 96);
  for (let di = 0; di < 4; di++)
    for (let f = 0; f < 3; f++) {
      const ox = f * 16;
      const oy = di * 24 + (f === 1 ? 1 : f === 2 ? -1 : 0);
      ellipse(ctx, ox + 8, oy + 22, 3, 1, 'rgba(0,0,0,0.25)');
      disc(ctx, ox + 8, oy + 10, 5, 'rgba(160,230,255,0.25)');
      ellipse(ctx, ox + 4, oy + 8, 3, 2, 'rgba(220,250,255,0.7)');
      ellipse(ctx, ox + 12, oy + 8, 3, 2, 'rgba(220,250,255,0.7)');
      disc(ctx, ox + 8, oy + 11, 2, '#f8fcff');
      disc(ctx, ox + 8, oy + 8, 1, '#ffe8c8');
      px(ctx, ox + 8, oy + 14, '#a0e8ff');
    }
  addSheet(scene, key, canvas, 16, 24);
}

// ---------------------------------------------------------------- elenco
const SKIN = { s: '#f0c8a0' };
const TAN = { s: '#d8a478' };
const PALE = { s: '#f4dccc' };

export const CHARACTERS = {
  // heróis
  aren: { body: 'tunic', hair: 'short', gear: ['cape'], pal: { ...SKIN, h: '#7a4a28', c: '#3a5aa8', d: '#e0d8c4', a: '#6a4428', p: '#4a3e34', b: '#4a3020', r: '#b83434' } },
  selene: { body: 'robe', hair: 'long', hairMat: 't', veilBand: true, gear: ['pendant'], pal: { ...PALE, t: '#f2f0fa', a: '#4a6ac0', c: '#ece8f4', d: '#5a7ad0' } },
  kael: { body: 'tunic', hair: 'long', hairMat: 'r', gear: ['quiver'], pal: { ...TAN, r: '#3e7040', c: '#8a5c38', d: '#5a7a4a', a: '#4a3020', p: '#4e4a3a', b: '#3a2a1a', u: '#7a5030', t: '#e8e0d0' } },
  mirela: { body: 'robe', hair: 'long', hat: true, pal: { ...PALE, h: '#dcd4ec', c: '#6040a0', d: '#3c2868', a: '#d04858', r: '#d04858' } },
  // aldeões
  elder: { body: 'robe', hair: 'short', beard: true, pal: { ...SKIN, h: '#ece8e4', c: '#6a5a8a', d: '#d8c890', a: '#9a7440' } },
  villager: { body: 'tunic', hair: 'short', pal: { ...SKIN, h: '#7a5030', c: '#5a8a3e', d: '#d8c8a8', a: '#5a3a22', p: '#4a4038', b: '#3a2a20' } },
  woman: { body: 'robe', hair: 'long', pal: { ...SKIN, h: '#c07a30', c: '#b04848', d: '#f0e4c8', a: '#5a3a22' } },
  innkeeper: { body: 'robe', hair: 'long', gear: ['apron'], pal: { ...SKIN, h: '#6a3a22', c: '#3e7a6a', d: '#e8e0d0', a: '#5a3a22', t: '#f0ece0' } },
  merchant: { body: 'robe', hair: 'long', hairMat: 'r', gear: ['apron'], pal: { ...TAN, r: '#d8903a', c: '#7a4a9a', d: '#e8d8b8', a: '#5a3a22', t: '#e8dcc0' } },
  smith: { body: 'tunic', hair: 'bald', beard: true, gear: ['apron'], pal: { ...TAN, h: '#4a3020', c: '#6a5a4e', d: '#9a7a5a', a: '#3a2a20', p: '#4a4038', b: '#2a2018', t: '#5a3e2c' } },
  guard: { body: 'tunic', hair: 'short', hairMat: 'n', helmet: true, pal: { ...SKIN, n: '#b0b4c4', c: '#2c4c94', d: '#a0a4b4', a: '#6a4428', p: '#3a3a4a', b: '#2a2a34' } },
  child: { body: 'tunic', hair: 'short', child: true, pal: { ...SKIN, h: '#e0b050', c: '#5a80c0', d: '#e8dcc0', a: '#5a3a22', p: '#5a4a3a', b: '#3a2a1a' } },
  lia: { body: 'robe', hair: 'long', child: true, pal: { ...SKIN, h: '#6a3e24', c: '#f0e4cc', d: '#c05a70', a: '#c05a70' } },
  oldwoman: { body: 'robe', hair: 'long', pal: { ...SKIN, h: '#cccad0', c: '#7a6a52', d: '#d8ccb0', a: '#5a4a3a' } },
  bard: { body: 'tunic', hair: 'short', gear: ['cape'], pal: { ...SKIN, h: '#d8b060', c: '#a04a8a', d: '#f0d870', a: '#5a3a22', p: '#3a6a5a', b: '#3a2a1a', r: '#4a8a6a' } },
  priest: { body: 'robe', hair: 'bald', gear: ['pendant'], pal: { ...SKIN, c: '#f0ecf4', d: '#d8b048', a: '#d8b048' } },
  stranger: { body: 'robe', hair: 'long', hairMat: 'c', pal: { s: '#2a2432', e: '#ff4848', c: '#262030', d: '#3a2c48', a: '#5a3a7a' } },
};

export function buildAllCharacters(scene) {
  for (const [id, def] of Object.entries(CHARACTERS)) buildCharacter(scene, `chr_${id}`, def);
  buildCat(scene, 'chr_cat');
  buildFairy(scene, 'chr_fairy');
}

// Validação (usada pelo npm run check): monta todos os frames e confere dimensões.
export function validateCharacters() {
  const errors = [];
  for (const [id, def] of Object.entries(CHARACTERS))
    for (const dir of ['down', 'left', 'right', 'up'])
      for (let f = 0; f < 3; f++) {
        const rows = composeFrame(def, dir, f);
        if (rows.length !== 24 || rows.some((r) => r.length !== 16)) errors.push(`${id} ${dir} ${f}: dimensões erradas`);
      }
  return errors;
}

export { outlineCanvas };
