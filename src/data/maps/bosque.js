// Bosque dos Sussurros: liga a vila à Caverna (leste) e à Mata dos Enforcados (norte).
const L = (l, r) => `${l}::${r}`;

export const bosque = {
  id: 'bosque',
  name: 'Bosque dos Sussurros',
  music: 'forest',
  base: 'grass',
  banner: true,
  dark: 0.3,
  lightRadius: 90,
  fog: { color: 0x8090a0, alpha: 0.18 },
  encounters: {
    rate: [14, 28],
    bg: 'bg_forest',
    groups: [
      { e: ['lobo'], w: 3 },
      { e: ['lobo', 'lobo'], w: 3 },
      { e: ['morcego', 'morcego'], w: 3 },
      { e: ['cogumelo', 'morcego'], w: 2 },
      { e: ['lobo', 'cogumelo'], w: 2 },
      { e: ['morcego', 'morcego', 'morcego'], w: 1 },
      { e: ['cogumelo', 'cogumelo'], w: 1 },
    ],
  },
  rows: [
    L('FFFFFFFFFFFFFFF', 'FFFFFFFFFFFFFFF'),
    L('FFFFFFFFFFFFFT.', '.TFFFFFFFFFFFFF'),
    L('FFFFFFFFF.T....', '....T.FFFFFFFFF'),
    L('FFFFFF......B..', '...,......FFFFF'),
    L('FFFF...T......,', '......T....FFFF'),
    L('FFF..,.......T.', '.......B....FFF'),
    L('FF..T..........', '..T........T.FF'),
    L('FF.....r.......', '........#######'),
    L('FF.T.......T...', '.....T..#######'),
    L('FF.............', '........#######'),
    L('F,.....T.......', '........###_###'),
    L('FF.............', '...........:..F'),
    L('FF.....B.......', '::::::::::::..F'),
    L('FFF...T........', '.....T.......FF'),
    L('FFF............', '...........,.FF'),
    L('FF..,....T.....', '..B..........FF'),
    L('FF.............', '.......T.....FF'),
    L('FFF...r........', '...........rFFF'),
    L('FFF....T.......', '....T.......FFF'),
    L('FF.............', '.........,..FFF'),
    L('FF....T........', '......B.....FFF'),
    L('FFF............', '............FFF'),
    L('FFFF.....T.....', '....T......FFFF'),
    L('FFFFF..........', '..........FFFFF'),
    L('FFFFFFF.T......', '.....T..FFFFFFF'),
    L('FFFFFFFFF.T....', '...T..FFFFFFFFF'),
    L('FFFFFFFFFFFF...', '...FFFFFFFFFFFF'),
    L('FFFFFFFFFFFFFFF', 'FFFFFFFFFFFFFFF'),
  ],
  events: [
    { type: 'warp', x: 15, y: 27, to: 'cinzalva', tx: 14, ty: 1, dir: 'down' },
    { type: 'warp', x: 16, y: 27, to: 'cinzalva', tx: 15, ty: 1, dir: 'down' },
    { type: 'warp', x: 15, y: 0, to: 'mata1', tx: 15, ty: 24, dir: 'up' },
    { type: 'warp', x: 16, y: 0, to: 'mata1', tx: 16, ty: 24, dir: 'up' },
    { type: 'warp', x: 28, y: 10, to: 'caverna1', tx: 14, ty: 22, dir: 'up', sfx: 'stairs' },
    { type: 'save', x: 13, y: 11 },
    { type: 'chest', id: 'c1', x: 3, y: 7, item: 'pocao', qty: 2 },
    { type: 'chest', id: 'c2', x: 29, y: 14, item: 'eter', qty: 1 },
    { type: 'chest', id: 'c3', x: 4, y: 21, item: 'antidoto', qty: 2 },
    { type: 'chest', id: 'c4', x: 21, y: 3, gold: 80 },
    { type: 'obj', id: 'nevoa1', x: 15, y: 1, texture: 'obj_mist', solid: true, cond: (f) => !f.boss1 },
    { type: 'obj', id: 'nevoa2', x: 16, y: 1, texture: 'obj_mist', solid: true, cond: (f) => !f.boss1 },
    {
      type: 'touch', x: 15, y: 2, w: 2, h: 1,
      cond: (f) => !f.boss1,
      script: async (a) => {
        await a.sfx('whisper');
        await a.say(null, 'Uma névoa vermelha e espessa bloqueia a trilha para o norte. Lá dentro, algo respira devagar.');
        await a.say('Selene', 'Não, Aren. Sinto que ela devoraria a chama da lanterna. Precisamos de algo mais forte que isso.');
        await a.movePlayer('D');
      },
    },
    {
      type: 'touch', x: 15, y: 2, w: 2, h: 1,
      cond: (f) => f.boss1 && !f.mist_gone,
      script: async (a) => {
        a.set('mist_gone');
        await a.sfx('bell');
        await a.say(null, 'O Fragmento do Sino vibra na bolsa de Aren. Um som grave, quase inaudível...');
        await a.say(null, 'A névoa vermelha recua, como uma fera ferida, abrindo a trilha para a Mata dos Enforcados.');
        await a.say('Kael', 'Ótimo. Agora o caminho para o lugar mais assustador da região está livre. Que sorte a nossa.');
      },
    },
    {
      type: 'obj', id: 'viajante', x: 7, y: 16, texture: 'obj_bones', solid: true,
      script: async (a) => {
        await a.say(null, 'Restos de um viajante. Na mão ossuda, um bilhete: "Se ouvir alguém chamar seu nome no bosque, não responda. NÃO RESPONDA."');
        if (!a.flag('viajante_erva')) {
          a.set('viajante_erva');
          a.give('erva_amarga', 2);
        }
      },
    },
    {
      type: 'touch', id: 'boneca', x: 21, y: 12, w: 1, h: 1,
      cond: (f) => !f.doll_found,
      script: async (a) => {
        a.set('doll_found');
        await a.music(null);
        await a.sfx('whisper');
        await a.wait(600);
        await a.say('???', '...Aren... Aren...');
        await a.say('Selene', 'Você ouviu isso? Alguém chamou seu nome!');
        await a.spawn('fantasma_lia', 'ghostgirl', 25, 12, 'left', 0.6);
        await a.wait(500);
        await a.say('Menina pálida', 'Está tão escuro lá dentro... A moça canta tão bonito... Ela disse que eu posso dormir para sempre...');
        await a.say('Aren', 'Lia? Lia, é você?!');
        await a.move('fantasma_lia', 'RR', 260);
        await a.sfx('scream');
        await a.flash(0xffffff, 200);
        await a.remove('fantasma_lia');
        await a.wait(400);
        await a.say(null, 'No lugar onde a menina estava, há uma boneca de pano encharcada.');
        a.give('boneca', 1, true);
        await a.sfx('item');
        await a.say(null, 'Aren pegou a Boneca de Pano.');
        await a.say('Selene', 'Ela foi para o leste... para a caverna. Aren, aquela menina não tinha sombra.');
        await a.music('forest');
      },
    },
  ],
};
