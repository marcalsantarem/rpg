// Objetos desenhados como pixel art em texto (camada de decoração / eventos).
import { drawRows } from '../core/Pixel.js';

export const OBJ = {
  bush: {
    pal: { o: '#142012', d: '#24401e', m: '#2e5228', l: '#46703a', r: '#8a1c2a' },
    rows: [
      '................', '................', '................', '................',
      '.....oooooo.....', '...oommmmmloo...', '..ommmllmmmmmo..', '.ommllmmmmmmdmo.',
      '.omlmmmmmrmmmdo.', 'ommmmrmmmmmmddmo', 'ommmmmmmmmmdddmo', 'odmmmmmmmdddddmo',
      '.oddmmmdddddddo.', '..oodddddddoo...', '....oooooooo....', '................',
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

export function drawObj(ctx, ox, oy, name) {
  const o = OBJ[name];
  drawRows(ctx, o.rows, o.pal, ox, oy);
}
