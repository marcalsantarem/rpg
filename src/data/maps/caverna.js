// Gruta de Cristal: dois andares, Kael preso num casulo e a Rainha Aranha.
export const caverna1 = {
  id: 'caverna1',
  name: 'Gruta de Cristal',
  music: 'dungeon',
  base: 'cavefloor',
  banner: true,
  dark: 0.72,
  lightRadius: 70,
  encounters: {
    rate: [12, 24],
    bg: 'bg_cave',
    groups: [
      { e: ['aranha'], w: 2 },
      { e: ['aranha', 'morcego'], w: 3 },
      { e: ['goblin'], w: 2 },
      { e: ['goblin', 'aranha'], w: 2 },
      { e: ['larva', 'morcego'], w: 2 },
      { e: ['sombra', 'sombra'], w: 1 },
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
    { type: 'chest', id: 'c3', x: 26, y: 1, item: 'erva_calmante', qty: 2 },
    { type: 'chest', id: 'c4', x: 2, y: 9, item: 'agua_sagrada', qty: 2 },
    {
      type: 'auto', id: 'entrada',
      cond: (f) => !f.cave_enter,
      script: async (a) => {
        a.set('cave_enter');
        await a.say('Selene', 'Que lindo... os cristais nas paredes brilham com a luz da lanterna.');
        await a.say('Aren', 'Lindo e perigoso. Fique perto da luz, Selene. Ouvi algo se arrastando lá no fundo.');
      },
    },
    {
      type: 'obj', id: 'teia', x: 5, y: 6, texture: 'obj_web', solid: true,
      script: async (a) => {
        if (!a.partyHas('kael')) {
          await a.say(null, 'Teias grossas como cordas de navio fecham a passagem. A espada de treino de Aren só se enrosca nelas.');
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
        await a.say(null, 'Um casulo de teia do tamanho de um homem. Algo se mexe lá dentro...');
        await a.say('???', 'Mmmf! Ei! Se vocês não forem aranhas, me tirem daqui, por favor!');
        const c = await a.ask(null, 'Abrir o casulo?', ['Abrir', 'Deixar']);
        if (c !== 0) return;
        await a.sfx('slash');
        await a.say('???', 'Até que enfim! Cuidado, as donas da casa voltaram!');
        const won = await a.battle(['aranha', 'aranha'], { bg: 'bg_web' });
        if (!won) return;
        await a.remove('casulo');
        await a.spawn('kael_npc', 'kael', 24, 2, 'down');
        await a.say('Kael', 'Ufa! Kael, patrulheiro. Estou caçando a Rainha Aranha há semanas... e ela me embrulhou como um presente.');
        await a.say('Aren', 'Aren, escudeiro de Aldenor. Procuramos uma menina chamada Lia.');
        await a.say('Kael', 'Vi os fogos-fátuos levando uma menina para o fundo da gruta, onde fica o covil da Rainha. Eu vou com vocês. Ela me deve um orgulho ferido.');
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
        await a.say('Selene', 'Ali, sobre a água! Uma criatura feita de sombra!');
        await a.say('Aren', 'Fugiu da luz da lanterna. As criaturas de Morvath estão por toda parte... vamos seguir.');
      },
    },
  ],
};

export const caverna2 = {
  id: 'caverna2',
  name: 'Covil da Rainha Aranha',
  music: 'dungeon',
  base: 'cavefloor',
  dark: 0.76,
  lightRadius: 70,
  encounters: {
    rate: [14, 26],
    bg: 'bg_web',
    groups: [
      { e: ['aranha', 'aranha'], w: 3 },
      { e: ['goblin', 'sombra'], w: 2 },
      { e: ['larva', 'aranha'], w: 2 },
      { e: ['goblin', 'goblin'], w: 1 },
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
    { type: 'chest', id: 'c3', x: 18, y: 4, item: 'pluma_aurora', qty: 1, cond: (f) => f.boss1 },
    { type: 'obj', id: 'tecela', x: 12, y: 4, texture: 'mon_weaver', solid: false, big: true, cond: (f) => !f.boss1 },
    { type: 'obj', id: 'casulo_a', x: 6, y: 2, texture: 'obj_cocoon', solid: true },
    { type: 'obj', id: 'casulo_b', x: 17, y: 2, texture: 'obj_cocoon', solid: true },
    {
      type: 'touch', id: 'chefe', x: 10, y: 7, w: 4, h: 1,
      cond: (f) => !f.boss1,
      script: async (a) => {
        await a.music(null);
        await a.sfx('heart');
        await a.say('???', 'Durma, durma, criancinha... a rainha tece seu sonho mais bonito...');
        await a.say('Kael', 'É ela, a Rainha Aranha. Cuidado com as presas, e não escutem a canção dela!');
        await a.say('Rainha Aranha', 'Visitantes... e um deles carrega a Marca do Sol. Que irritante. A luz machuca meus olhinhos.');
        await a.say('Rainha Aranha', 'O Mestre das Sombras me prometeu a gruta inteira, se eu guardasse este cristal longe da alvorada.');
        await a.say('Aren', 'Onde está a Lia?!');
        await a.say('Rainha Aranha', 'A menina? Mandei para o velho Raizmor, na floresta. Agora venham... minhas teias estão famintas!');
        const won = await a.battle(['tecela'], { boss: true, bg: 'bg_web', music: 'boss' });
        if (!won) return;
        a.set('boss1');
        await a.remove('tecela');
        await a.sfx('bell');
        await a.flash(0xffffff, 400);
        await a.say(null, 'A Rainha Aranha encolhe até virar uma aranhinha comum e foge por uma fresta. No chão, um cristal brilha como o sol nascente.');
        a.give('fragmento1', 1, true);
        await a.sfx('item');
        await a.say(null, 'Obteve o Cristal da Aurora I!');
        await a.say('Selene', 'Um fragmento dos Sinos de Cristal! Foi isso que roubaram do sino do templo?');
        await a.spawn('lumi', 'fairy', 12, 3, 'down', 1);
        await a.say('Lumi', 'Vocês conseguiram! A sombra que corrompia a Rainha se foi. Ela volta a ser só uma aranha mal-humorada.');
        await a.say('Lumi', 'Mas a menina está na Floresta Ancestral, presa num sono encantado. A névoa púrpura vai ceder diante deste cristal!');
        await a.remove('lumi');
        await a.say('Kael', 'A Floresta Ancestral... dizem que uma bruxa vive lá. Bom, depois de uma aranha gigante, o que é uma bruxa?');
        await a.say('Aren', 'Vamos voltar ao bosque. Aguente firme, Lia.');
        await a.music('dungeon');
      },
    },
  ],
};
