// Bosque de Verdemar: liga a vila à Gruta de Cristal (leste) e à Floresta Ancestral (norte).
const L = (l, r) => `${l}::${r}`;

export const bosque = {
  id: 'bosque',
  name: 'Bosque de Verdemar',
  music: 'forest',
  base: 'grass',
  banner: true,
  fog: { color: 0xc0d8e0, alpha: 0.1 },
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
        await a.say(null, 'Uma névoa púrpura e espessa bloqueia a trilha para o norte. Ela parece... viva.');
        await a.say('Selene', 'É magia sombria, Aren. A lanterna sozinha não é forte o bastante para dissipá-la.');
        await a.movePlayer('D');
      },
    },
    {
      type: 'touch', x: 15, y: 2, w: 2, h: 1,
      cond: (f) => f.boss1 && !f.mist_gone,
      script: async (a) => {
        a.set('mist_gone');
        await a.sfx('bell');
        await a.say(null, 'O Cristal da Aurora brilha na bolsa de Aren e solta um som claro, como um pequeno sino.');
        await a.say(null, 'A névoa púrpura se desfaz em fiapos de luz, abrindo a trilha para a Floresta Ancestral.');
        await a.say('Kael', 'Agora sim! Esse cristal é mais útil que muito mapa que eu já comprei.');
      },
    },
    {
      type: 'obj', id: 'viajante', x: 7, y: 16, texture: 'obj_pack', solid: true,
      script: async (a) => {
        await a.say(null, 'Uma mochila de viajante esquecida. Dentro, um bilhete: "Luzes coloridas dançando entre as árvores. Lindas... mas não as siga."');
        if (!a.flag('viajante_erva')) {
          a.set('viajante_erva');
          a.give('erva_medicinal', 2);
        }
      },
    },
    {
      type: 'touch', id: 'boneca', x: 21, y: 12, w: 1, h: 1,
      cond: (f) => !f.doll_found,
      script: async (a) => {
        a.set('doll_found');
        await a.sfx('light');
        await a.spawn('lumi', 'fairy', 25, 12, 'left', 1);
        await a.wait(400);
        await a.say('???', 'Até que enfim alguém com luz no coração! Ei, aqui! Aqui embaixo... quer dizer, aqui em cima!');
        await a.say('Lumi', 'Eu sou Lumi, uma fada da aurora. As luzes que levaram a menina eram fogos-fátuos sombrios, enfeitiçados pela Rainha Aranha!');
        await a.say('Aren', 'A Lia! Você sabe onde ela está?');
        await a.say('Lumi', 'Eles a levaram para a Gruta de Cristal, a leste. Ela deixou cair isto. Vou na frente, sigam minha luz!');
        a.give('boneca', 1, true);
        await a.sfx('item');
        await a.say(null, 'Aren recebeu a Boneca de Pano.');
        await a.move('lumi', 'RR', 220);
        await a.remove('lumi');
        await a.say('Selene', 'Uma fada de verdade! Nos livros do templo elas são mensageiras de Liora. Vamos, Aren, para a gruta!');
      },
    },
  ],
};
