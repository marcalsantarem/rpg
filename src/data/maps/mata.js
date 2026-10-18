// Floresta Ancestral: Mirela e Raizmor.
async function mirelaScene(a) {
  if (a.flag('mirela_joined')) return;
  a.set('mirela_met');
  await a.music(null);
  await a.face('mirela', 'down');
  await a.say('???', 'Parem aí! Mais um passo e vocês viram cogumelos. Esta floresta está sob minha proteção.');
  await a.say('Selene', 'Você é... a bruxa da floresta?');
  await a.say('Mirela', 'Maga, por favor. Mirela, guardiã da Floresta Ancestral. "Bruxa" é coisa que aldeão inventa quando não entende magia.');
  await a.sfx('heart');
  await a.shake(300, 0.006);
  await a.say('Mirela', 'Ótimo, vocês trouxeram companhia: cavaleiros sombrios! Lutem ao meu lado ou virem adubo.');
  const won = await a.battle(['cavaleiro', 'cavaleiro'], { bg: 'bg_deadforest' });
  if (!won) return;
  await a.say('Mirela', 'Hm. Nada mal para um escudeiro. E essa marca na sua mão... a Marca do Sol! Então a profecia era verdade.');
  await a.say('Aren', 'A Rainha Aranha disse que mandou a Lia para Raizmor. E nós temos um Cristal da Aurora.');
  await a.say('Mirela', 'Raizmor é o espírito mais antigo desta floresta. Ele guarda outro fragmento dos sinos, mas a sombra de Morvath o corrompeu.');
  await a.say('Mirela', 'Eu vou com vocês. Estudo os Sinos da Aurora há anos, e sozinha não consigo salvar Raizmor.');
  await a.remove('mirela');
  a.join('mirela');
  a.set('mirela_joined');
  await a.sfx('levelup');
  await a.say(null, 'Mirela entrou para o grupo!');
  await a.say('Mirela', 'Os espinhos ao norte crescem com a sombra. Um pouco de fogo arcano resolve.');
  await a.music('deadforest');
}

const FOG = { color: 0x8a60c8, alpha: 0.2 };

export const mata1 = {
  id: 'mata1',
  name: 'Floresta Ancestral',
  music: 'deadforest',
  base: 'darkgrass',
  banner: true,
  dark: 0.4,
  lightRadius: 72,
  fog: FOG,
  encounters: {
    rate: [12, 22],
    bg: 'bg_deadforest',
    groups: [
      { e: ['corvo', 'corvo'], w: 3 },
      { e: ['cavaleiro'], w: 2 },
      { e: ['espantalho', 'corvo'], w: 2 },
      { e: ['raiz', 'raiz'], w: 2 },
      { e: ['olho', 'corvo'], w: 2 },
      { e: ['lobo_sombrio', 'lobo_sombrio'], w: 2 },
      { e: ['cavaleiro', 'raiz'], w: 1 },
    ],
  },
  rows: [
    'PPPPPPPPPPPPPPPPPPPPppPPPPPPPPPP',
    'PPPPPPPPPPPPPPPPPPPGppGPPPPPPPPP',
    'PPPPPPPPPPPPPPPPPPggppggPPPPPPPP',
    'PPPPPPPPPPPPPPPPPGgMppgghPPPPPPP',
    'PPPPPPPPPPPPPPPPPgggppggggPPPPPP',
    'PPPPPPPPPPhgggggggggppgggKgPPPPP',
    'PPPPPPPPppppppppppppppggGgggPPPP',
    'PPPPPPPgpgggggMggggGgggbggggPPPP',
    'PPPPPPggpgggGgggggggggggggGgPPPP',
    'PPPPgggpggggPPPPPPPPPgggGgggPPPP',
    'PPPgggrgggrgPPPPPPPPPPgggggPPPPP',
    'PPgggggggggggPPPPPPPPPPPgMgPPPPP',
    'PPgggrgggggrgPPPPPPPPPPPgggPPPPP',
    'PPgggggKgggggPPPPPPPPPPPhggPPPPP',
    'PPPgggrgggrgPPPPPPPPPPPPgggPPPPP',
    'PPPPggggpgPPPPPPPPPPPPPGgggPPPPP',
    'PPPPPgggpggPPPPPPPPPPPPPgbgPPPPP',
    'PPPPPPggpppppppppggPPPPPPPPPPPPP',
    'PPPPPPPgGggggggppgggPPPPPPPPPPPP',
    'PPPPPPPPPgggMggppgGggPPPPPPPPPPP',
    'PPPPPPPPPPhggggppggggPPPPPPPPPPP',
    'PPPPPPPPPPPggbgppgggPPPPPPPPPPPP',
    'PPPPPPPPPPPPGggppgGPPPPPPPPPPPPP',
    'PPPPPPPPPPPPPggppggPPPPPPPPPPPPP',
    'PPPPPPPPPPPPPPgppgPPPPPPPPPPPPPP',
    'PPPPPPPPPPPPPPPppPPPPPPPPPPPPPPP',
  ],
  events: [
    { type: 'warp', x: 15, y: 25, to: 'bosque', tx: 15, ty: 1, dir: 'down' },
    { type: 'warp', x: 16, y: 25, to: 'bosque', tx: 16, ty: 1, dir: 'down' },
    { type: 'warp', x: 20, y: 0, to: 'mata2', tx: 12, ty: 20, dir: 'up' },
    { type: 'warp', x: 21, y: 0, to: 'mata2', tx: 13, ty: 20, dir: 'up' },
    { type: 'chest', id: 'c1', x: 5, y: 11, item: 'pocao_forte', qty: 2 },
    { type: 'chest', id: 'c2', x: 25, y: 15, item: 'fita_vermelha', qty: 1 },
    { type: 'chest', id: 'c3', x: 25, y: 9, item: 'eter', qty: 2 },
    { type: 'chest', id: 'c4', x: 11, y: 19, gold: 250 },
    { type: 'read', x: 10, y: 5, text: 'Uma árvore anciã coberta de musgo luminoso. No tronco, runas élficas: "Quando a aurora calar, a floresta adormecerá."' },
    { type: 'read', x: 10, y: 20, text: 'Vaga-lumes dançam ao redor desta árvore antiga. Por um instante, parecem formar o desenho de um sino.' },
    {
      type: 'auto', id: 'entrada',
      cond: (f) => !f.mata_enter,
      script: async (a) => {
        a.set('mata_enter');
        await a.say('Kael', 'Já cacei em muitas florestas, mas nenhuma brilhava assim. Esses cogumelos estão... acesos?');
        await a.say('Selene', 'A floresta é linda, mas sinto a sombra pesando sobre ela. Como se estivesse doente.');
      },
    },
    { type: 'npc', id: 'mirela', x: 8, y: 12, sprite: 'mirela', dir: 'up', cond: (f) => !f.mirela_joined, script: mirelaScene },
    { type: 'touch', x: 8, y: 15, w: 1, h: 1, cond: (f) => !f.mirela_joined, script: mirelaScene },
    {
      type: 'obj', id: 'espinho1', x: 20, y: 2, texture: 'obj_bramble', solid: true,
      script: async (a) => {
        if (!a.partyHas('mirela')) {
          await a.say(null, 'Uma muralha de espinhos púrpura bloqueia a trilha. Quando Aren se aproxima, os galhos se fecham ainda mais.');
          return;
        }
        await a.say('Mirela', 'Chama Arcana! Espinhos sombrios não gostam de fogo azul.');
        await a.sfx('fire');
        await a.flash(0xff6020, 300);
        await a.remove('espinho1');
        await a.remove('espinho2');
        await a.say(null, 'Mirela queimou a muralha de espinhos!');
      },
    },
    { type: 'obj', id: 'espinho2', x: 21, y: 2, texture: 'obj_bramble', solid: true, linked: 'espinho1' },
  ],
};

export const mata2 = {
  id: 'mata2',
  name: 'Coração da Floresta',
  music: 'deadforest',
  base: 'darkgrass',
  dark: 0.45,
  lightRadius: 72,
  fog: FOG,
  rows: [
    'PPPPPPPPPPPPPPPPPPPPPPPPPP',
    'PPPPPPPKKKKKKKKKKKKPPPPPPP',
    'PPPPPhKggggggggggggKhPPPPP',
    'PPPPGggggggggggggggggGPPPP',
    'PPPgggggKgggggggggKgggggPP',
    'PPPgggbgggggggggggggbgggPP',
    'PPPPggggggggggggggggggPPPP',
    'PPPPPgggMgggggggggMggPPPPP',
    'PPPPPPGggggggggggggGPPPPPP',
    'PPPPPPPPPgggppgggPPPPPPPPP',
    'PPPPPPPPPPggppggPPPPPPPPPP',
    'PPPPPPPPPPPgppgPPPPPPPPPPP',
    'PPPPPPPPhgggppggggPPPPPPPP',
    'PPPPPPPgggggppgggggPPPPPPP',
    'PPPPPPPgMgggppggggKPPPPPPP',
    'PPPPPPPPggggppggggPPPPPPPP',
    'PPPPPPPPPGggppggGPPPPPPPPP',
    'PPPPPPPPPPPgppgPPPPPPPPPPP',
    'PPPPPPPPPPPgppgPPPPPPPPPPP',
    'PPPPPPPPPPPhppgPPPPPPPPPPP',
    'PPPPPPPPPPPPppPPPPPPPPPPPP',
    'PPPPPPPPPPPPppPPPPPPPPPPPP',
  ],
  events: [
    { type: 'warp', x: 12, y: 21, to: 'mata1', tx: 20, ty: 1, dir: 'down' },
    { type: 'warp', x: 13, y: 21, to: 'mata1', tx: 21, ty: 1, dir: 'down' },
    { type: 'save', x: 9, y: 13 },
    { type: 'light', x: 9, y: 13, r: 36 },
    { type: 'chest', id: 'c1', x: 16, y: 14, item: 'pocao_forte', qty: 2 },
    { type: 'obj', id: 'pai_galho', x: 12, y: 6, texture: 'mon_tree', solid: false, big: true, cond: (f) => !f.boss2 },
    {
      type: 'touch', id: 'chefe', x: 12, y: 10, w: 2, h: 1,
      cond: (f) => !f.boss2,
      script: async (a) => {
        await a.music(null);
        await a.sfx('heart');
        await a.wait(400);
        await a.say('Mirela', 'Ali, entre as raízes. É a menina!');
        await a.say(null, 'Lia dorme envolta em raízes macias, cercada por flores que brilham num tom púrpura.');
        await a.say('Raizmor', 'Shhh... a pequena sonha um sonho sem fim. Aqui, a sombra não a alcança. Aqui, nada muda nunca mais.');
        await a.say('Mirela', 'Raizmor, sou eu, Mirela! A sombra de Morvath está falando por você. Acorde!');
        await a.say('Raizmor', 'Guardei o cristal da rainha por trezentos anos... estou CANSADO. A escuridão prometeu descanso eterno. Para mim, e para todos.');
        await a.say('Aren', 'Então vamos libertar você dessa sombra. Pela Lia!');
        const won = await a.battle(['pai_galho'], { boss: true, bg: 'bg_grove', music: 'boss' });
        if (!won) return;
        a.set('boss2');
        await a.remove('pai_galho');
        await a.sfx('bell');
        await a.flash(0xffffff, 500);
        await a.say(null, 'A sombra escapa do tronco de Raizmor como fumaça. Suas folhas voltam a ficar verdes, e um cristal dourado rola até os pés de Aren.');
        a.give('fragmento2', 1, true);
        await a.sfx('item');
        await a.say(null, 'Obteve o Cristal da Aurora II!');
        await a.say('Raizmor', '...Obrigado, pequenos. Eu me perdi na escuridão. Levem o cristal... e a criança. Ela está livre.');
        await a.spawn('lia_npc', 'lia', 12, 5, 'down');
        await a.say('Lia', '...Hã? Onde estou? Aren?! Você veio me buscar!');
        await a.say('Aren', 'Claro que vim. Vamos para casa, Lia. O Tomé está esperando.');
        await a.fade('out', 1000);
        a.heal();
        await a.warp('casa_anciao', 5, 4, 'up');
      },
    },
  ],
};
