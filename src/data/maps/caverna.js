// Caverna das Lamúrias: dois andares, Kael preso em um casulo e a Tecelã de Ossos.
export const caverna1 = {
  id: 'caverna1',
  name: 'Caverna das Lamúrias',
  music: 'dungeon',
  base: 'cavefloor',
  banner: true,
  dark: 0.9,
  lightRadius: 58,
  encounters: {
    rate: [12, 24],
    bg: 'bg_cave',
    groups: [
      { e: ['aranha'], w: 2 },
      { e: ['aranha', 'morcego'], w: 3 },
      { e: ['esqueleto'], w: 2 },
      { e: ['esqueleto', 'aranha'], w: 2 },
      { e: ['larva', 'morcego'], w: 2 },
      { e: ['fantasma', 'fantasma'], w: 1 },
      { e: ['larva'], w: 1 },
    ],
  },
  rows: [
    '##############################',
    '##______#############_______##',
    '##_>__z_#############__-____##',
    '##_k____#############_______##',
    '###____##############__z____##',
    '#####_################_____###',
    '#####_################__k__###',
    '#####_#################___####',
    '#####_#################___####',
    '##____________##########_#####',
    '#__-____z______#########_#####',
    '#_____vvvv______########_#####',
    '#____vvvvvv_______________####',
    '#_k___vvvv_____z_______#######',
    '##____________-______#########',
    '###___z__________k___#########',
    '#####_________________########',
    '###########_____##############',
    '############___###############',
    '##############_###############',
    '#############__###############',
    '#############_-_##############',
    '##############_###############',
    '##############_###############',
  ],
  events: [
    { type: 'warp', x: 14, y: 23, to: 'bosque', tx: 28, ty: 11, dir: 'down', sfx: 'stairs' },
    { type: 'warp', x: 3, y: 2, to: 'caverna2', tx: 7, ty: 17, dir: 'up', sfx: 'stairs' },
    { type: 'chest', id: 'c1', x: 4, y: 14, item: 'pocao', qty: 2 },
    { type: 'chest', id: 'c2', x: 19, y: 15, item: 'eter', qty: 1 },
    { type: 'chest', id: 'c3', x: 26, y: 1, item: 'sal_bento', qty: 2 },
    { type: 'chest', id: 'c4', x: 2, y: 9, item: 'agua_benta', qty: 2 },
    {
      type: 'auto', id: 'entrada',
      cond: (f) => !f.cave_enter,
      script: async (a) => {
        a.set('cave_enter');
        await a.say('Selene', 'A lanterna... a chama encolheu. Como se tivesse medo.');
        await a.say('Aren', 'Fiquem perto da luz. E ouçam: as paredes estão chorando.');
      },
    },
    {
      type: 'obj', id: 'teia', x: 5, y: 6, texture: 'obj_web', solid: true,
      script: async (a) => {
        if (!a.partyHas('kael')) {
          await a.say(null, 'Teias grossas como cordas de navio fecham a passagem. A pá de Aren apenas se enrosca nelas.');
          return;
        }
        await a.say('Kael', 'Deixa comigo. Uma faca de caçador corta qualquer coisa que uma aranha consiga cuspir.');
        await a.sfx('slash');
        await a.remove('teia');
        await a.say(null, 'Kael cortou as teias!');
      },
    },
    {
      type: 'obj', id: 'casulo', x: 24, y: 2, texture: 'obj_cocoon', solid: true,
      cond: (f) => !f.kael_joined,
      script: async (a) => {
        await a.say(null, 'Um casulo do tamanho de um homem. Algo se mexe lá dentro...');
        await a.say('???', 'Mmmf! MMMF! Ei! Se vocês não forem aranhas, me tirem daqui!');
        const c = await a.ask(null, 'Abrir o casulo?', ['Abrir', 'Deixar']);
        if (c !== 0) return;
        await a.sfx('slash');
        await a.say('???', 'Até que enfim! Cuidado, as donas da casa voltaram!');
        const won = await a.battle(['aranha', 'aranha'], { bg: 'bg_web' });
        if (!won) return;
        await a.remove('casulo');
        await a.spawn('kael_npc', 'kael', 24, 2, 'down');
        await a.say('Kael', 'Ufa. Kael, caçador de recompensas. Estou no rastro da Tecelã de Ossos há meses... e ela me pendurou como um presunto.');
        await a.say('Aren', 'Aren, coveiro de Cinzalva. Procuramos uma menina chamada Lia.');
        await a.say('Kael', 'Uma menina? A Tecelã leva crianças para o fundo da caverna. Ela tece algo com... deixa pra lá. Eu vou com vocês. Ela me deve um orgulho.');
        await a.remove('kael_npc');
        a.join('kael');
        a.set('kael_joined');
        await a.sfx('levelup');
        await a.say(null, 'Kael entrou para o grupo!');
        await a.say('Kael', 'Ah, e aquelas teias bloqueando a passagem a oeste? Minha faca dá conta.');
      },
    },
    {
      type: 'touch', id: 'susto', x: 12, y: 12, w: 1, h: 3,
      cond: (f) => !f.cave_scare,
      script: async (a) => {
        a.set('cave_scare');
        await a.sfx('heart');
        await a.spawn('vulto', 'shade', 8, 11, 'down', 0.9);
        await a.wait(500);
        await a.sfx('scream');
        await a.shake(300, 0.012);
        await a.remove('vulto');
        await a.say('Selene', 'Ali, sobre a água! Havia alguém... alguém sem rosto!');
        await a.say('Aren', 'Já foi. Mas a água está cheia de fios brancos, como cabelo... Vamos seguir.');
      },
    },
  ],
};

export const caverna2 = {
  id: 'caverna2',
  name: 'Ninho da Tecelã',
  music: 'dungeon',
  base: 'cavefloor',
  dark: 0.92,
  lightRadius: 58,
  encounters: {
    rate: [14, 26],
    bg: 'bg_web',
    groups: [
      { e: ['aranha', 'aranha'], w: 3 },
      { e: ['esqueleto', 'fantasma'], w: 2 },
      { e: ['larva', 'aranha'], w: 2 },
      { e: ['esqueleto', 'esqueleto'], w: 1 },
    ],
  },
  rows: [
    '########################',
    '####n______________n####',
    '###n________________n###',
    '###__________________###',
    '###___k__________k___###',
    '####________________####',
    '#######__________#######',
    '##########____##########',
    '##########____##########',
    '#####______________#####',
    '####__-_________k___####',
    '####________________####',
    '#####_____####_____#####',
    '######___######___######',
    '######___######___######',
    '#####_____####______####',
    '####___z___##___-___####',
    '####_______##_______####',
    '#####__<___###______####',
    '########################',
  ],
  events: [
    { type: 'warp', x: 7, y: 18, to: 'caverna1', tx: 3, ty: 3, dir: 'down', sfx: 'stairs' },
    { type: 'save', x: 12, y: 10 },
    { type: 'light', x: 12, y: 10, r: 36 },
    { type: 'chest', id: 'c1', x: 5, y: 16, item: 'pocao', qty: 3 },
    { type: 'chest', id: 'c2', x: 19, y: 17, item: 'cetro_prata', qty: 1 },
    { type: 'chest', id: 'c3', x: 18, y: 4, item: 'vela_retorno', qty: 1, cond: (f) => f.boss1 },
    { type: 'obj', id: 'tecela', x: 12, y: 4, texture: 'mon_weaver', solid: false, big: true, cond: (f) => !f.boss1 },
    { type: 'obj', id: 'casulo_a', x: 6, y: 2, texture: 'obj_cocoon', solid: true },
    { type: 'obj', id: 'casulo_b', x: 17, y: 2, texture: 'obj_cocoon', solid: true },
    {
      type: 'touch', id: 'chefe', x: 10, y: 7, w: 4, h: 1,
      cond: (f) => !f.boss1,
      script: async (a) => {
        await a.music(null);
        await a.sfx('heart');
        await a.say('???', 'Dorme, dorme, criancinha... a mamãe tece o seu nominho...');
        await a.say('Kael', 'É ela. A Tecelã de Ossos. Não olhem nos olhos do rosto de cima. Nem nos de baixo.');
        await a.say('Tecelã de Ossos', 'Ahhh... um coveiro. Que gentil. Você veio me trazer mais corpos? Ou o seu próprio?');
        await a.say('Tecelã de Ossos', 'O Rei tem fome de nomes, e eu os fio tão finos, tão macios... O seu vai dar um fio lindo, Aren.');
        await a.say('Aren', 'Onde está a Lia?!');
        await a.say('Tecelã de Ossos', 'Lia? O corpo eu dei ao Pai-Galho. O nome... o nome eu já engoli. Venham, venham para o colo da mamãe!');
        const won = await a.battle(['tecela'], { boss: true, bg: 'bg_web', music: 'boss' });
        if (!won) return;
        a.set('boss1');
        await a.remove('tecela');
        await a.sfx('bell');
        await a.flash(0xffffff, 400);
        await a.say(null, 'Entre os restos da Tecelã, algo branco brilha: um pedaço curvo de osso que vibra como um sino.');
        a.give('fragmento1', 1, true);
        await a.sfx('item');
        await a.say(null, 'Obteve o Fragmento do Sino I!');
        await a.say('Selene', 'Um pedaço dos Sinos de Ossos de Santa Liora... A Tecelã o mantinha aqui. Por quê?');
        await a.spawn('fantasma_lia', 'ghostgirl', 12, 3, 'down', 0.6);
        await a.say('Menina pálida', 'Obrigada... o fio do meu nome se soltou um pouquinho. Mas meu corpo está na floresta vermelha, preso nas raízes.');
        await a.say('Menina pálida', 'A árvore canta mais alto que a moça-aranha. Por favor... antes que eu esqueça quem eu sou.');
        await a.remove('fantasma_lia');
        await a.say('Kael', 'A floresta vermelha... a Mata dos Enforcados. A névoa de lá não deixa ninguém passar.');
        await a.say('Aren', 'Talvez agora deixe. O fragmento está... quente. Vamos voltar ao bosque.');
        await a.music('dungeon');
      },
    },
  ],
};
