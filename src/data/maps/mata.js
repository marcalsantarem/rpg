// Mata dos Enforcados: Mirela e o Pai-Galho.
async function mirelaScene(a) {
  if (a.flag('mirela_joined')) return;
  a.set('mirela_met');
  await a.music(null);
  await a.face('mirela', 'down');
  await a.say('???', 'Mais um passo e eu transformo vocês em adubo. Já tenho problemas suficientes.');
  await a.say('Selene', 'Você é... a Bruxa da Mata. A vila diz que você calou o sino da capela.');
  await a.say('Mirela', 'A vila diz muita coisa. Eu sou Mirela. E eu estava tentando FAZER o sino tocar de novo, sua noviça ingênua.');
  await a.sfx('heart');
  await a.shake(300, 0.006);
  await a.say('Mirela', 'Ótimo. Vocês fizeram barulho e acordaram os Enforcados. Ou lutamos juntos, ou viramos frutas nas árvores.');
  const won = await a.battle(['enforcado', 'enforcado'], { bg: 'bg_deadforest' });
  if (!won) return;
  await a.say('Mirela', 'Hm. Vocês não são completamente inúteis.');
  await a.say('Aren', 'A Tecelã guardava um fragmento dos Sinos de Ossos. Ela disse que deu o corpo de Lia ao Pai-Galho.');
  await a.say('Mirela', 'Então você tem um fragmento... Por isso a névoa deixou vocês passarem. O Pai-Galho guarda o outro, no coração da mata.');
  await a.say('Mirela', 'Eu vou junto. Não por vocês, nem pela vila que me queimaria viva. Por causa do que está vindo depois.');
  await a.remove('mirela');
  a.join('mirela');
  a.set('mirela_joined');
  await a.sfx('levelup');
  await a.say(null, 'Mirela entrou para o grupo!');
  await a.say('Mirela', 'Os espinhos ao norte se alimentam de medo. O meu fogo se alimenta deles. Vamos.');
  await a.music('deadforest');
}

const FOG = { color: 0xb02020, alpha: 0.22 };

export const mata1 = {
  id: 'mata1',
  name: 'Mata dos Enforcados',
  music: 'deadforest',
  base: 'darkgrass',
  banner: true,
  dark: 0.6,
  lightRadius: 72,
  fog: FOG,
  encounters: {
    rate: [12, 22],
    bg: 'bg_deadforest',
    groups: [
      { e: ['corvo', 'corvo'], w: 3 },
      { e: ['enforcado'], w: 2 },
      { e: ['espantalho', 'corvo'], w: 2 },
      { e: ['raiz', 'raiz'], w: 2 },
      { e: ['olho', 'corvo'], w: 2 },
      { e: ['lobo_nevoa', 'lobo_nevoa'], w: 2 },
      { e: ['enforcado', 'raiz'], w: 1 },
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
    { type: 'read', x: 10, y: 5, text: 'Um corpo balança no galho. Pendurada no pescoço, uma placa: "BRUXO". A letra é idêntica à da placa da vila.' },
    { type: 'read', x: 10, y: 20, text: 'Outro enforcado. Este ainda segura um terço quebrado. Os lábios se movem: "...o sino... toque o sino..."' },
    {
      type: 'auto', id: 'entrada',
      cond: (f) => !f.mata_enter,
      script: async (a) => {
        a.set('mata_enter');
        await a.say('Kael', 'Já cacei em muitas florestas. Nenhuma me olhava de volta.');
        await a.say('Selene', 'As árvores... estão sangrando seiva vermelha. Liora, guarde-nos.');
      },
    },
    { type: 'npc', id: 'mirela', x: 8, y: 12, sprite: 'mirela', dir: 'up', cond: (f) => !f.mirela_joined, script: mirelaScene },
    { type: 'touch', x: 8, y: 15, w: 1, h: 1, cond: (f) => !f.mirela_joined, script: mirelaScene },
    {
      type: 'obj', id: 'espinho1', x: 20, y: 2, texture: 'obj_bramble', solid: true,
      script: async (a) => {
        if (!a.partyHas('mirela')) {
          await a.say(null, 'Uma muralha de espinhos negros pulsa como veias. Quando Aren se aproxima, ela cresce.');
          return;
        }
        await a.say('Mirela', 'Queimem, queimem. Vocês sempre gostaram de medo; provem o calor.');
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
  name: 'Coração da Mata',
  music: 'deadforest',
  base: 'darkgrass',
  dark: 0.62,
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
        await a.say('Mirela', 'Ali. Entre as raízes. Vejam.');
        await a.say(null, 'Presa entre as raízes, uma menina dorme. A casca da árvore cresce devagar sobre os braços dela.');
        await a.say('Pai-Galho', 'SHHHH... a pequenina está quase esquecendo. Quando ela esquecer o próprio nome, vai virar folha. Folha bonita, vermelha.');
        await a.say('Pai-Galho', 'Eu guardo o sino de Liora há trezentos anos. Ninguém o toca. Ninguém o ouve. O Rei me prometeu que eu jamais seria cortado.');
        await a.say('Aren', 'Eu sou coveiro. Sei cavar até a raiz de qualquer coisa.');
        await a.say('Pai-Galho', 'Então venha, coveiro. Plante-se aqui!');
        const won = await a.battle(['pai_galho'], { boss: true, bg: 'bg_grove', music: 'boss' });
        if (!won) return;
        a.set('boss2');
        await a.remove('pai_galho');
        await a.sfx('bell');
        await a.flash(0xffffff, 500);
        await a.say(null, 'O Pai-Galho tomba com um gemido longo. De seu tronco partido rola outro pedaço de osso vibrante.');
        a.give('fragmento2', 1, true);
        await a.sfx('item');
        await a.say(null, 'Obteve o Fragmento do Sino II!');
        await a.spawn('lia_npc', 'lia', 12, 5, 'down');
        await a.say('Selene', 'Lia! Ela está respirando... está quente!');
        await a.say('Lia', '...Lia. Meu nome é Lia. Eu... eu ainda lembro.');
        await a.say('Aren', 'Vamos para casa, Lia. Seu irmão está esperando.');
        await a.fade('out', 1000);
        a.heal();
        await a.warp('casa_anciao', 5, 4, 'up');
      },
    },
  ],
};
