// Vila de Cinzalva e interiores.
// Scripts recebem a API do mapa (ver MapScene.makeApi).

export const cinzalva = {
  id: 'cinzalva',
  name: 'Vila de Cinzalva',
  music: 'town',
  base: 'grass',
  tint: { color: 0x9088c0, alpha: 1 },
  banner: true,
  rows: [
    'FFFFFFFFFFFFFF::FFFFFFFFFFFFFF',
    'FT.....T......::.....T......TF',
    'F.xxxxxxxx...S::....YYYYYYY..F',
    'F.x++.+.+x..T.::....YYYYYYY..F',
    'F.x......x....::....CCcEcCC..F',
    'F.x+.+RRRx....::.......:.....F',
    'F.x...WDWx....::::::::::....TF',
    'F.x+...:.x....::.............F',
    'F.xxxxx:xx....::...T.....B...F',
    'FT.....:......::.............F',
    'F......:::::::::::::::::::...F',
    'F..RRRRR....=======...RRRRR..F',
    'F..RRRRR....===o===...RRRRR..F',
    'F..WwDwW....=======...WwDwW..F',
    'F....:.........:........:....F',
    'F.l..::::::::::::::::::::..l.F',
    'F..............:.............F',
    'FT...,.,.....RRRRR....~~~....F',
    'F....,.,.....RRRRR....~~~~~..F',
    'F............WwDwW....~~~~~..F',
    'F...B....T.....:.......~~~...F',
    'F.T........T.........T.....T.F',
    'FT.................T.........F',
    'FFFFFFFFFFFFFFFFFFFFFFFFFFFFFF',
  ],
  events: [
    { type: 'warp', x: 7, y: 6, to: 'cabana', tx: 4, ty: 4, dir: 'up', sfx: 'door' },
    { type: 'warp', x: 23, y: 4, to: 'capela', tx: 6, ty: 8, dir: 'up', sfx: 'door' },
    { type: 'warp', x: 5, y: 13, to: 'pousada', tx: 5, ty: 5, dir: 'up', sfx: 'door' },
    { type: 'warp', x: 24, y: 13, to: 'loja', tx: 6, ty: 5, dir: 'up', sfx: 'door' },
    { type: 'warp', x: 15, y: 19, to: 'casa_anciao', tx: 5, ty: 5, dir: 'up', sfx: 'door' },
    { type: 'warp', x: 14, y: 0, to: 'bosque', tx: 15, ty: 26, dir: 'up' },
    { type: 'warp', x: 15, y: 0, to: 'bosque', tx: 16, ty: 26, dir: 'up' },
    { type: 'light', x: 2, y: 15, r: 40 },
    { type: 'light', x: 27, y: 15, r: 40 },
    {
      type: 'read', x: 13, y: 2,
      text: 'NORTE: Bosque dos Sussurros.\nPor ordem do Ancião: ninguém entra após o toque do sino.\n(Alguém riscou "sino" e escreveu "nunca mais".)',
    },
    {
      type: 'touch', x: 14, y: 1, w: 2, h: 1,
      cond: (f) => !f.selene_joined,
      script: async (a) => {
        await a.face('guarda', 'left');
        if (!a.flag('met_elder')) {
          await a.say('Guarda Hugo', 'Alto, Aren! O bosque está fechado. Desde que o sino calou, quem entra não volta.');
          await a.say('Guarda Hugo', 'O Ancião Bartolomeu quer falar com você. A casa dele fica ao sul da praça.');
        } else {
          await a.say('Guarda Hugo', 'Sozinho? Nem pensar. Vá até a capela e peça a bênção da Irmã Selene primeiro.');
        }
        await a.movePlayer('D');
      },
    },
    {
      type: 'npc', id: 'guarda', x: 16, y: 1, sprite: 'guard', dir: 'down',
      script: async (a) => {
        if (a.flag('boss2')) return a.say('Guarda Hugo', 'Vocês trouxeram a pequena Lia de volta... Eu devia ter tido coragem de ir junto.');
        if (a.flag('boss1')) return a.say('Guarda Hugo', 'Dizem que a névoa vermelha recuou ao norte do bosque. Isso é bom... não é?');
        if (a.flag('selene_joined')) return a.say('Guarda Hugo', 'Que a Rainha-Santa os proteja. E se ouvirem alguém chamando seus nomes no bosque... não respondam.');
        return a.say('Guarda Hugo', 'Faço a guarda há vinte anos. Nunca vi o bosque tão quieto. Nem os corvos cantam.');
      },
    },
    {
      type: 'npc', id: 'tome', x: 17, y: 14, sprite: 'child', dir: 'down', wander: true,
      cond: (f) => !f.boss2,
      script: async (a) => {
        if (a.hasItem('boneca') && !a.flag('tome_doll')) {
          a.set('tome_doll');
          await a.say('Tomé', 'Essa... essa é a boneca da Lia! Onde você achou?!');
          await a.say('Aren', 'No bosque, Tomé. Perto de uma trilha que vai para leste.');
          await a.say('Tomé', 'Então ela está viva! Ela tem que estar! Por favor, Aren... traga minha irmã de volta.');
          return;
        }
        if (a.flag('tome_doll')) return a.say('Tomé', 'Eu rezo toda noite. Mas a Lia diz no meu sonho que ninguém está ouvindo lá em cima.');
        await a.say('Tomé', 'Minha irmã Lia sumiu ontem à noite. Ela disse que uma moça bonita cantava no bosque...');
        await a.say('Tomé', 'Mamãe diz para eu não falar dela. Diz que falar o nome ajuda "Ele" a lembrar.');
      },
    },
    {
      type: 'npc', id: 'velha', x: 13, y: 12, sprite: 'oldwoman', dir: 'right',
      script: async (a) => {
        await a.say('Velha Inês', 'O poço sussurra à noite, menino. Diz nomes. Ontem disse o da Lia.');
        if (!a.flag('velha_story')) {
          a.set('velha_story');
          await a.say('Velha Inês', 'Minha avó contava: a Rainha-Santa Liora prendeu o Rei Sem Rosto com quatro sinos feitos dos ossos dela mesma.');
          await a.say('Velha Inês', 'Enquanto os sinos tocam, ele dorme. Quando calam... ele começa a lembrar dos nomes que comeu.');
        }
      },
    },
    {
      type: 'npc', id: 'aldeao', x: 20, y: 9, sprite: 'villager', dir: 'left', wander: true,
      script: async (a) => {
        if (a.flag('boss1')) return a.say('Aldeão Ivo', 'A lanterna da capela... ela brilha mais perto de você, Aren. Como se te conhecesse.');
        await a.say('Aldeão Ivo', 'Coveiro! Você que conversa com defuntos... pergunte a eles o que está acontecendo.');
        await a.say('Aldeão Ivo', 'Meu pai foi enterrado semana passada, e ontem a cova estava vazia. Vazia!');
      },
    },
    {
      type: 'npc', id: 'mulher', x: 21, y: 16, sprite: 'woman', dir: 'down', wander: true,
      script: async (a) => {
        await a.say('Clara', 'A Bruxa da Mata dos Enforcados... dizem que foi ela quem calou o sino. Se a encontrarem, não confiem nela.');
      },
    },
    {
      type: 'npc', id: 'bebado', x: 7, y: 14, sprite: 'drunk', dir: 'right',
      script: async (a) => {
        await a.say('Bêbado', 'Hic... Eu vi! No cemitério! Um homem sem rosto, olhando para a cabana do coveiro...');
        await a.say('Bêbado', '...ou era o meu reflexo na garrafa. Hic. Os dois me dão medo.');
      },
    },
    {
      type: 'npc', id: 'gato', x: 4, y: 6, sprite: 'cat', dir: 'down', wander: true,
      script: async (a) => {
        await a.sfx('cursor');
        await a.say('Gato Preto', 'Miau.');
        await a.say(null, '(O gato encara um ponto vazio atrás de Aren por muito tempo.)');
      },
    },
    {
      type: 'npc', id: 'estranho', x: 5, y: 4, sprite: 'stranger', dir: 'down',
      cond: (f) => f.selene_joined && !f.boss1 && !f.met_stranger,
      script: async (a) => {
        await a.music(null);
        await a.say('???', 'Coveiro... Você enterra os mortos com tanto cuidado.');
        await a.say('???', 'Mas me diga: quem enterra os nomes? Eu os guardo. Todos eles.');
        await a.say('???', '"Aren". Que nome gostoso. Eu vou lembrar dele.');
        a.set('met_stranger');
        await a.sfx('scream');
        await a.flash(0xffffff, 300);
        await a.remove('estranho');
        await a.shake(400, 0.01);
        await a.say('Selene', 'Aren! Quem... o que era aquilo? A lanterna quase apagou!');
        await a.music('town');
      },
    },
  ],
};

export const cabana = {
  id: 'cabana',
  name: 'Cabana do Coveiro',
  music: 'town',
  base: 'wood',
  dark: 0.35,
  rows: [
    'XILIIiIOIX',
    'XeeeeeeeeX',
    'XQe[]eee%X',
    'XeeeeeeeeX',
    'XVeeeeeeJX',
    'XXXXaXXXXX',
  ],
  events: [
    { type: 'warp', x: 4, y: 5, to: 'cinzalva', tx: 7, ty: 7, dir: 'down', sfx: 'door' },
    { type: 'light', x: 7, y: 0, r: 50 },
    { type: 'read', x: 2, y: 0, text: 'Livros de registro do cemitério. A última página traz, em letra de outra pessoa: "Aren — em breve."' },
    { type: 'read', x: 3, y: 2, text: 'Uma pá enferrujada e um bilhete do Ancião: "Venha à minha casa assim que acordar. Urgente."' },
    {
      type: 'auto', id: 'acordar',
      cond: (f) => !f.intro_room,
      script: async (a) => {
        a.set('intro_room');
        await a.wait(400);
        await a.say('Aren', '...O mesmo sonho. O sino tocando ao contrário, e uma voz dizendo meu nome.');
        await a.say('Aren', 'Lá fora está escuro, mas o sol já devia ter nascido. Faz três dias que a manhã não chega direito.');
        await a.say(null, 'Dica: use as setas para andar, Z/Enter para confirmar e falar, X/Esc para o menu.');
      },
    },
  ],
};

export const pousada = {
  id: 'pousada',
  name: 'Pousada do Corvo Branco',
  music: 'town',
  base: 'wood',
  rows: [
    'XIIiIILIIOIX',
    'XeeeeeeeeeeX',
    'XNNNeee[]eQX',
    'XeeeeeeeeeQX',
    'XV[]eeeeeeeX',
    'Xeeee]eeeeVX',
    'XXXXXaXXXXXX',
  ],
  events: [
    { type: 'warp', x: 5, y: 6, to: 'cinzalva', tx: 5, ty: 14, dir: 'down', sfx: 'door' },
    { type: 'light', x: 9, y: 0, r: 60 },
    {
      type: 'npc', id: 'marta', x: 2, y: 1, sprite: 'innkeeper', dir: 'down',
      script: async (a) => {
        await a.inn(25, 'Marta');
      },
    },
    {
      type: 'npc', id: 'cliente', x: 4, y: 4, sprite: 'villager', dir: 'left',
      script: async (a) => {
        await a.say('Viajante', 'Cheguei ontem e já quero ir embora. As pessoas daqui não dizem os próprios nomes em voz alta. Reparou?');
      },
    },
  ],
};

export const loja = {
  id: 'loja',
  name: 'Mercado de Cinzalva',
  music: 'town',
  base: 'wood',
  rows: [
    'XILLIIiIIILLIX',
    'XeeeeeeeeeeeeX',
    'XNNNNeeeeNNNNX',
    'XeeeeeeeeeeeeX',
    'XVJeeeeeeeeJVX',
    'XeeeeeeeeeeeeX',
    'XXXXXXaXXXXXXX',
  ],
  events: [
    { type: 'warp', x: 6, y: 6, to: 'cinzalva', tx: 24, ty: 14, dir: 'down', sfx: 'door' },
    {
      type: 'npc', id: 'odete', x: 2, y: 1, sprite: 'widow', dir: 'down',
      script: async (a) => {
        await a.say('Viúva Odete', 'Poções, sais, água benta... Tudo o que um vivo precisa para continuar vivo.');
        await a.shop('odete');
      },
    },
    {
      type: 'npc', id: 'bruno', x: 11, y: 1, sprite: 'smith', dir: 'down',
      script: async (a) => {
        await a.say('Bruno', 'Ferreiro Bruno, às ordens. Se vai para o bosque, vá bem armado.');
        await a.shop('bruno');
      },
    },
  ],
};

export const capela = {
  id: 'capela',
  name: 'Capela de Santa Liora',
  music: 'chapel',
  base: 'stonefloor',
  dark: 0.3,
  rows: [
    'XCCCCcCcCCCCX',
    'Xs*ss!!!ss*sX',
    'XsssssssssssX',
    'Xs^^^sas^^^sX',
    'XsssssasssssX',
    'Xs^^^sas^^^sX',
    'XsssssasssssX',
    'Xs^^^sas^^^sX',
    'XsssssasssssX',
    'XXXXXXaXXXXXX',
  ],
  events: [
    { type: 'warp', x: 6, y: 9, to: 'cinzalva', tx: 23, ty: 5, dir: 'down', sfx: 'door' },
    { type: 'light', x: 2, y: 1, r: 40 },
    { type: 'light', x: 10, y: 1, r: 40 },
    { type: 'save', x: 9, y: 2 },
    { type: 'read', x: 6, y: 1, text: 'O altar de Santa Liora. Uma inscrição: "Com meus ossos fiz sinos. Com meu silêncio, a vigília."' },
    {
      type: 'npc', id: 'selene', x: 6, y: 2, sprite: 'selene', dir: 'up',
      cond: (f) => !f.selene_joined,
      script: async (a) => {
        if (!a.flag('met_elder')) {
          await a.face('selene', a.facingPlayer('selene'));
          await a.say('Selene', 'Aren? Que a paz de Liora esteja com você. Desculpe, não posso conversar agora... o sino...');
          await a.say('Selene', 'O Ancião estava procurando por você. Vá vê-lo, por favor.');
          return;
        }
        await a.face('selene', a.facingPlayer('selene'));
        await a.say('Selene', 'O Ancião te mandou, não foi? Então ele finalmente acredita em mim.');
        await a.say('Selene', 'Esta manhã, a corda do sino estava cortada. Não rasgada... roída. E no chão havia teias. Teias enormes.');
        await a.say('Aren', 'Teias... Lia, a irmã do Tomé, sumiu perto do bosque. Dizem que alguém cantava lá.');
        await a.say('Selene', 'Então vou com você. Não discuta. Sou a única nesta vila que sabe fechar ferimentos e abrir orações.');
        await a.sfx('item');
        await a.say('Selene', 'E leve isto: a Lanterna de Vigília. Ela foi acesa com a chama do altar há trezentos anos e nunca apagou.');
        a.give('lanterna', 1, true);
        await a.say(null, 'Aren recebeu a Lanterna de Vigília!');
        await a.remove('selene');
        a.join('selene');
        a.set('selene_joined');
        await a.sfx('levelup');
        await a.say(null, 'Selene entrou para o grupo!');
        await a.say('Selene', 'O altar de velas ali ao lado guarda nossas preces. Sempre que encontrarmos um, podemos registrar nossa jornada.');
      },
    },
    {
      type: 'npc', id: 'padre', x: 6, y: 6, sprite: 'priestghost', dir: 'up', alpha: 0.55,
      cond: (f) => f.selene_joined && !f.priest_seen,
      script: async (a) => {
        a.set('priest_seen');
        await a.say('Padre Anselmo', '...Liora... perdoe-me... eu toquei o sino ao contrário... para salvar meu nome...');
        await a.say('Selene', 'Padre Anselmo?! Mas... nós o enterramos no inverno!');
        await a.sfx('whisper');
        await a.fade('out', 400);
        await a.remove('padre');
        await a.fade('in', 400);
        await a.say('Aren', 'Ele sumiu. Os mortos não deviam andar, Selene. Eu os ouço desde criança, mas nunca... os vi.');
      },
    },
  ],
};

export const casa_anciao = {
  id: 'casa_anciao',
  name: 'Casa do Ancião',
  music: 'town',
  base: 'wood',
  rows: [
    'XIILIIiIIOIX',
    'XeeeeeeeeeeX',
    'XQeee[]eee%X',
    'Xeeee]eeeeeX',
    'XaaaaaaaaaaX',
    'XeeeeeeeeeVX',
    'XXXXXaXXXXXX',
  ],
  events: [
    { type: 'warp', x: 5, y: 6, to: 'cinzalva', tx: 15, ty: 20, dir: 'down', sfx: 'door' },
    { type: 'light', x: 9, y: 0, r: 60 },
    {
      type: 'npc', id: 'anciao', x: 8, y: 2, sprite: 'elder', dir: 'down',
      script: async (a) => {
        if (a.flag('boss2')) return a.say('Ancião Bartolomeu', 'Descansem. Vocês fizeram mais por Cinzalva do que esta vila merece.');
        if (a.flag('boss1')) {
          await a.say('Ancião Bartolomeu', 'Um fragmento do Sino de Ossos! Então a Tecelã guardava um deles...');
          await a.say('Ancião Bartolomeu', 'Se a névoa recuou ao norte, a Mata dos Enforcados está aberta. O resto do sino, e talvez Lia, estão lá.');
          return;
        }
        if (a.flag('met_elder')) {
          return a.say('Ancião Bartolomeu', a.flag('selene_joined') ? 'O bosque fica ao norte. Sigam a trilha para leste, onde a menina foi vista. Que Liora os guie.' : 'Vá à capela, Aren. A Irmã Selene sabe mais sobre o sino do que eu.');
        }
        a.set('met_elder');
        await a.say('Ancião Bartolomeu', 'Aren, graças a Liora. Feche a porta. Não quero que o vento ouça.');
        await a.say('Ancião Bartolomeu', 'A pequena Lia sumiu na beira do bosque. É a terceira criança este mês. E o sino da capela... parou de tocar sozinho.');
        await a.say('Ancião Bartolomeu', 'Aquele sino é feito de um fragmento dos Sinos de Ossos de Santa Liora. Enquanto ele toca, o Rei Sem Rosto dorme.');
        await a.say('Aren', 'O Rei Sem Rosto é uma história para assustar crianças, Ancião.');
        await a.say('Ancião Bartolomeu', 'Então por que, desde que você nasceu, os mortos falam com você?');
        await a.say('Ancião Bartolomeu', 'Vá até a capela e fale com a Irmã Selene. Depois, vão ao bosque. Encontrem Lia. E descubram o que calou o sino.');
        await a.sfx('item');
        a.give('pocao', 3, true);
        a.gold(50);
        await a.say(null, 'Aren recebeu 3 Poções e 50 moedas.');
      },
    },
    { type: 'npc', id: 'lia', x: 1, y: 3, sprite: 'lia', dir: 'right', cond: (f) => f.boss2 },
    { type: 'npc', id: 'tome_casa', x: 2, y: 3, sprite: 'child', dir: 'left', cond: (f) => f.boss2 },
    {
      type: 'auto', id: 'final',
      cond: (f) => f.boss2 && !f.ending,
      script: async (a) => {
        a.set('ending');
        await a.wait(500);
        await a.say('Tomé', 'Lia! Lia, você voltou! Você está quente de novo!');
        await a.say('Lia', '...Tomé? Eu sonhei que uma árvore cantava meu nome. E cada vez que ela cantava, eu esquecia um pedaço dele.');
        await a.say('Ancião Bartolomeu', 'Vocês a trouxeram de volta. E com ela, dois fragmentos do Sino de Ossos.');
        await a.say('Mirela', 'Não comemore ainda, velho. Os fragmentos estavam com a Tecelã e com o Pai-Galho por um motivo. Eles eram guardiões... ou carcereiros.');
        await a.say('Kael', 'Ótimo. Matamos os carcereiros. Isso costuma dar muito certo.');
        await a.say('Selene', 'Mirela, você disse que sabia sobre os sinos. O que ainda não nos contou?');
        await a.say('Mirela', 'Que existem quatro sinos. Que dois já se calaram. E que, a cada sino que cala, Ele lembra de um nome que devorou.');
        await a.sfx('bell');
        await a.shake(800, 0.006);
        await a.say('Lia', 'Aren... a árvore também cantava o seu nome. Ela dizia que o Rei já está quase lembrando de você.');
        await a.say('Aren', '...')
        await a.say('Ancião Bartolomeu', 'Então não há tempo a perder. Ao leste fica a Abadia de Vel-Noar, onde dizem que o terceiro sino ainda soa. Descansem esta noite. Amanhã...');
        await a.fade('out', 1200);
        await a.endChapter();
      },
    },
  ],
};
