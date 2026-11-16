// Capítulo II: Estrada Real e Abadia de Vel-Noar.
// Continuação direta da jornada dos Sinos da Aurora.

const FOG_CEMETERY = { color: 0x5a4670, alpha: 0.25 };
const FOG_CRYPT = { color: 0x301840, alpha: 0.3 };

// ============================================================================
// 1. Estrada de Vel-Noar (28 x 20)
// ============================================================================
export const estrada = {
  id: 'estrada',
  name: 'Estrada de Vel-Noar',
  music: 'forest',
  base: 'grass',
  banner: true,
  encounters: {
    rate: [28, 44],
    bg: 'bg_deadforest',
    groups: [
      { e: ['esqueleto', 'esqueleto'], w: 3 },
      { e: ['corvo', 'lobo_sombrio'], w: 3 },
      { e: ['cavaleiro', 'esqueleto'], w: 2 },
      { e: ['espectro'], w: 2 },
    ],
  },
  rows: [
    'FFFFFFFFFFFFFFFFFFFFFFFFFFFF',
    'FT...T.....TT.......T....TTF',
    'F..r...u........r.....u....F',
    'F.....FFFFFFFF......FFFF...F',
    'F...FFFT....TFFFFFFFFT..F..F',
    'F..FT..........TT........F.F',
    'F..F...r...x.....r..x....F.F',
    'F.FF......x[x.......x....F.F',
    'F.F.......x]x............F.F',
    '::::::::::::::::::::::::::::',
    '::::::::::::::::::::::::::::',
    'F.F....r.....u....r......F.F',
    'F.FF...T............T...FF.F',
    'F..F......FFFFFFFF......F..F',
    'F..FFFFFFFF......FFFFFFFF..F',
    'F...T......u...r......T....F',
    'F.....r..............u...r.F',
    'FT.......T...TT....T......TF',
    'FTT....TT..........TT....TTF',
    'FFFFFFFFFFFFFFFFFFFFFFFFFFFF',
  ],
  events: [
    // Warps: oeste para cinzalva, leste para cemiterio
    { type: 'warp', x: 0, y: 9, to: 'cinzalva', tx: 28, ty: 15, dir: 'left' },
    { type: 'warp', x: 0, y: 10, to: 'cinzalva', tx: 28, ty: 15, dir: 'left' },
    { type: 'warp', x: 27, y: 9, to: 'cemiterio', tx: 1, ty: 9, dir: 'right' },
    { type: 'warp', x: 27, y: 10, to: 'cemiterio', tx: 1, ty: 10, dir: 'right' },
    { type: 'save', x: 5, y: 6 },
    { type: 'light', x: 5, y: 6, r: 35 },
    {
      type: 'chest', id: 'e_c1', x: 14, y: 7, item: 'pocao_forte', qty: 2,
    },
    {
      type: 'npc', id: 'viajante_estrada', x: 18, y: 8, sprite: 'villager', dir: 'left',
      script: async (a) => {
        await a.face('viajante_estrada', a.facingPlayer('viajante_estrada'));
        await a.say('Mercador Fugitivo', 'Não sigam para o leste! A Abadia de Vel-Noar caiu sob uma maldição medonha.');
        await a.say('Mercador Fugitivo', 'Os sinos que antes protegiam a estrada pararam... e as tumbas do claustro começaram a se abrir!');
        await a.say('Aren', 'Nós viemos justamente para investigar o sino. Fique seguro perto da vila.');
      },
    },
    {
      type: 'read', x: 20, y: 11,
      text: 'Placa desgastada pelo tempo:\nLESTE: Abadia de Vel-Noar (Santuário dos Monges).\nOESTE: Vila de Aldenor.',
    },
  ],
};

// ============================================================================
// 2. Pátio de Vel-Noar (28 x 20)
// ============================================================================
export const cemiterio = {
  id: 'cemiterio',
  name: 'Pátio da Abadia',
  music: 'cemetery',
  base: 'darkgrass',
  dark: 0.38,
  lightRadius: 76,
  fog: FOG_CEMETERY,
  banner: true,
  encounters: {
    rate: [24, 40],
    bg: 'bg_cemetery',
    groups: [
      { e: ['esqueleto', 'esqueleto'], w: 3 },
      { e: ['gargula', 'esqueleto'], w: 2 },
      { e: ['espectro', 'espectro'], w: 2 },
      { e: ['gargula', 'gargula'], w: 1 },
      { e: ['espectro', 'esqueleto'], w: 2 },
    ],
  },
  rows: [
    'PPPPPPPPPPPPPPPPPPPPPPPPPPPP',
    'PPPPPPPPPPCCCCCCCCPPPPPPPPPP',
    'PPPPPPPPPCCcCCCCcCCPPPPPPPPP',
    'PPPPPPPPPCCsCCCCsCCPPPPPPPPP',
    'PPPPPPPPPCCssssssCCPPPPPPPPP',
    'PPPPPPPPPCCssEsssCCPPPPPPPPP',
    'PPgqqgPgPCCss:sssCCPgPqqggPP',
    'P.g..g...==::::::==...g..g.P',
    'P.q..q..:===::::===:...q..qP',
    '::::::::::::=::=:::::::::::P',
    '::::::::::::=::=:::::::::::P',
    'P.q..q..:===::::===:...q..qP',
    'P.g..g...==::::::==...g..g.P',
    'PPgqqgPgP==::::::==PgPqqggPP',
    'PPPgPPPPPg::::::::gPPPPPgPPP',
    'PPPPPPPPgghgG..GghggPPPPPPPP',
    'PPPPPPPggg..b..b..gggPPPPPPP',
    'PPPPPPPhg........ghgPPPPPPPP',
    'PPPPPPPPggG..rr..GggPPPPPPPP',
    'PPPPPPPPPPPPPPPPPPPPPPPPPPPP',
  ],
  events: [
    { type: 'warp', x: 0, y: 9, to: 'estrada', tx: 26, ty: 9, dir: 'left' },
    { type: 'warp', x: 0, y: 10, to: 'estrada', tx: 26, ty: 10, dir: 'left' },
    { type: 'warp', x: 13, y: 5, to: 'abadia', tx: 12, ty: 18, dir: 'up', sfx: 'door' },
    { type: 'save', x: 8, y: 12 },
    { type: 'light', x: 8, y: 12, r: 38 },
    { type: 'light', x: 19, y: 12, r: 38 },
    {
      type: 'chest', id: 'cem_c1', x: 22, y: 11, item: 'pocao_forte', qty: 2,
    },
    {
      type: 'chest', id: 'cem_c2', x: 4, y: 7, item: 'rosario_sagrado', qty: 1,
    },
    {
      type: 'npc', id: 'espirito_monge', x: 13, y: 8, sprite: 'priest', dir: 'down', alpha: 0.75,
      script: async (a) => {
        await a.sfx('whisper');
        await a.say('Espírito de Irmão Lucas', 'Viajantes... não entrem no claustro sem estar preparados.');
        await a.say('Espírito de Irmão Lucas', 'O Abade Malphas foi tomado pela loucura das sombras. Ele arrancou o sino de cristal e o trancou na cripta profunda.');
        await a.say('Selene', 'Nós temos a bênção da Rainha Liora e a chama do templo. Vamos libertar a abadia!');
        await a.say('Espírito de Irmão Lucas', 'Então busquem a Chave da Cripta no relicário do claustro... que a luz os ampare.');
      },
    },
  ],
};

// ============================================================================
// 3. Claustro de Vel-Noar (26 x 20)
// ============================================================================
export const abadia = {
  id: 'abadia',
  name: 'Claustro de Vel-Noar',
  music: 'cemetery',
  base: 'stonefloor',
  dark: 0.45,
  lightRadius: 74,
  banner: true,
  encounters: {
    rate: [22, 38],
    bg: 'bg_cave',
    groups: [
      { e: ['esqueleto', 'esqueleto'], w: 3 },
      { e: ['gargula', 'esqueleto'], w: 2 },
      { e: ['espectro', 'gargula'], w: 2 },
      { e: ['espectro', 'espectro'], w: 2 },
    ],
  },
  rows: [
    'XXXXXXXXXXXXXXXXXXXXXXXXXX',
    'XCCCCcCCCCcCCCCcCCCCcCCCCX',
    'XCs*ssssssssssssssssss*sCX',
    'XCs!ssssssssss>sssssss!sCX',
    'XCssssssssssssssssssssssCX',
    'XC^^^ssssssaaaaasssss^^^CX',
    'XC^^^ssssssaaaaasssss^^^CX',
    'XCssssssssssssssssssssssCX',
    'XC^^^ssssssaaaaasssss^^^CX',
    'XC^^^ssssssaaaaasssss^^^CX',
    'XCssssssssssssssssssssssCX',
    'XCLssssssssaaaaasssssssLCX',
    'XCLssssssssssssssssssssLCX',
    'XCsssssssss::::sssssssssCX',
    'XCsssssssss::::sssssssssCX',
    'XCs*ssssssssssssssssss*sCX',
    'XCsssssssss::::sssssssssCX',
    'XCsssssssss::::sssssssssCX',
    'XCCCCCCCCCcEaaEcCCCCCCCCCX',
    'XXXXXXXXXXXXXXXXXXXXXXXXXX',
  ],
  events: [
    // Saída para o pátio
    { type: 'warp', x: 11, y: 18, to: 'cemiterio', tx: 13, ty: 6, dir: 'down', sfx: 'door' },
    { type: 'warp', x: 14, y: 18, to: 'cemiterio', tx: 13, ty: 6, dir: 'down', sfx: 'door' },
    // Escadaria para a cripta
    {
      type: 'touch', x: 14, y: 3, w: 1, h: 1,
      script: async (a) => {
        if (!a.hasItem('chave_cripta')) {
          await a.say(null, 'Uma grade de ferro maciço com símbolos de caveiras tranca a descida para a cripta.');
          await a.say('Kael', 'Tem um buraco de fechadura antigo aqui. Deve haver uma chave neste claustro.');
          await a.movePlayer('D');
          return;
        }
        await a.sfx('door');
        await a.say(null, 'Aren usou a Chave da Cripta! A grade de ferro se ergue com um rangido estridente.');
        await a.warp('cripta', 12, 18, 'up', 'stairs');
      },
    },
    { type: 'light', x: 3, y: 2, r: 36 },
    { type: 'light', x: 22, y: 2, r: 36 },
    { type: 'light', x: 3, y: 15, r: 36 },
    { type: 'light', x: 22, y: 15, r: 36 },
    { type: 'save', x: 20, y: 3 },
    {
      type: 'chest', id: 'ab_manto', x: 4, y: 11, item: 'manto_abade', qty: 1,
    },
    {
      type: 'obj', id: 'relicario', x: 21, y: 11, texture: 'obj_pot', solid: true,
      script: async (a) => {
        if (a.flag('found_chave_cripta')) {
          await a.say(null, 'O relicário de ouro desbotado está vazio.');
          return;
        }
        a.set('found_chave_cripta');
        await a.sfx('chest');
        a.give('chave_cripta', 1, true);
        await a.say(null, 'Entre pergaminhos sagrados e cinzas, Aren encontrou a Chave da Cripta!');
      },
    },
  ],
};

// ============================================================================
// 4. Catacumbas dos Três Reis (26 x 20)
// ============================================================================
export const cripta = {
  id: 'cripta',
  name: 'Cripta dos Três Reis',
  music: 'catacombs',
  base: 'cavefloor',
  dark: 0.65,
  lightRadius: 65,
  fog: FOG_CRYPT,
  banner: true,
  encounters: {
    rate: [20, 36],
    bg: 'bg_cave',
    groups: [
      { e: ['esqueleto', 'gargula'], w: 3 },
      { e: ['espectro', 'espectro'], w: 3 },
      { e: ['gargula', 'espectro'], w: 2 },
      { e: ['esqueleto', 'esqueleto', 'esqueleto'], w: 1 },
    ],
  },
  rows: [
    '##########################',
    '##_##_#############_##_###',
    '##_v_______________v_#####',
    '###___________________####',
    '###_____CCC!q!CCC_____####',
    '###_____C___n___C_____####',
    '###____zC_______Cz____####',
    '###_____CCCCsCCCC_____####',
    '##_v________s_______v__###',
    '##__________s__________###',
    '###____z____s____z____####',
    '###_________s_________####',
    '###___#s#___s___#s#___####',
    '###___#s#___s___#s#___####',
    '####________s________#####',
    '#####__z____s____z__######',
    '######______s______#######',
    '#######_____s_____########',
    '########____<____#########',
    '##########################',
  ],
  events: [
    // Escadaria subindo de volta para a abadia
    { type: 'warp', x: 12, y: 18, to: 'abadia', tx: 12, ty: 4, dir: 'down', sfx: 'stairs' },
    { type: 'save', x: 6, y: 9 },
    { type: 'light', x: 6, y: 9, r: 36 },
    {
      type: 'chest', id: 'cr_c1', x: 19, y: 9, item: 'besta_pesada', qty: 1,
    },
    // Chefe Malphas
    {
      type: 'obj', id: 'abade_boss', x: 12, y: 5, texture: 'mon_abbot', solid: true,
      cond: (f) => !f.boss3,
      script: async (a) => {
        await a.music(null);
        await a.sfx('whisper');
        await a.say('Abade Malphas', 'Quem ousa perturbar o sono eterno de Vel-Noar...?');
        await a.say('Selene', 'Abade Malphas! O que aconteceu com o terceiro sino? Por que a abadia caiu nas trevas?');
        await a.say('Abade Malphas', 'A luz da aurora é fraca... passageira. Apenas na noite sem fim não há dor nem morte.');
        await a.say('Abade Malphas', 'Morvath nos ofereceu a eternidade. Entreguem seus cristais... ou unam-se às minhas tumbas!');
        await a.say('Aren', 'A luz de Liora não vai se apagar aqui. Pela aurora!');
        const won = await a.battle(['abade_chefe'], { boss: true, bg: 'bg_cave', music: 'boss' });
        if (!won) return;
        a.set('boss3');
        await a.remove('abade_boss');
        await a.sfx('bell');
        await a.flash(0xffffff, 800);
        await a.say(null, 'As correntes de trevas que envolviam o santuário se desfazem em poeira estelar!');
        await a.say(null, 'O terceiro fragmento do Sino de Cristal surge brilhando em dourado puro.');
        a.give('fragmento3', 1, true);
        await a.sfx('item');
        await a.say(null, 'Aren obteve o Cristal da Aurora III!');
        await a.say('Mirela', 'Três dos quatro sinos foram resgatados! Sinto o poder de Morvath recuando nas montanhas!');
        await a.say('Kael', 'Agora só resta o último sino... aquele na Cidadela Proibida do Norte.');
        await a.say('Selene', 'Com a luz deste cristal, a bênção de Liora nos acompanhará até o fim.');
      },
    },
  ],
};
