// Vila de Aldenor e interiores.
// Scripts recebem a API do mapa (ver MapScene.makeApi).

export const cinzalva = {
  id: 'cinzalva',
  name: 'Vila de Aldenor',
  music: 'town',
  base: 'grass',
  tint: { color: 0xf0e0d0, alpha: 1 },
  banner: true,
  rows: [
    'FFFFFFFFFFFFFF::FFFFFFFFFFFFFF',
    'FT.....T......::.....T......TF',
    'F.xxxxxxxx...S::....YYYYYYY..F',
    'F.x++.+.+x..T.::....YYYYYYY..F',
    'F.x..q...x....::....CCcEcCC..F',
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
    { type: 'read', x: 13, y: 2, text: 'NORTE: Bosque de Verdemar.\nAviso da guarda: lobos e luzes estranhas foram vistos na trilha. Viaje em grupo!' },
    { type: 'read', x: 5, y: 4, text: 'Estátua da Rainha Liora erguendo um pequeno sino.\nNa base: "Enquanto a aurora tocar, a sombra não passará."' },
    {
      type: 'touch', x: 14, y: 1, w: 2, h: 1,
      cond: (f) => !f.selene_joined,
      script: async (a) => {
        await a.face('guarda', 'left');
        if (!a.flag('met_elder')) {
          await a.say('Guarda Hugo', 'Alto lá, escudeiro! O bosque está fechado desde que o sino do templo silenciou.');
          await a.say('Guarda Hugo', 'O Ancião Bartolomeu está à sua procura. A casa dele fica ao sul da praça.');
        } else {
          await a.say('Guarda Hugo', 'Ordens são ordens, Aren: ninguém sai sozinho. Passe no templo e leve a Selene com você.');
        }
        await a.movePlayer('D');
      },
    },
    {
      type: 'npc', id: 'guarda', x: 16, y: 1, sprite: 'guard', dir: 'down',
      script: async (a) => {
        if (a.flag('boss2')) return a.say('Guarda Hugo', 'Você trouxe a pequena Lia de volta! Seu pai teria orgulho, Aren. Já parece um cavaleiro de verdade.');
        if (a.flag('boss1')) return a.say('Guarda Hugo', 'Dizem que a névoa púrpura recuou ao norte do bosque. Bom trabalho, escudeiro!');
        if (a.flag('selene_joined')) return a.say('Guarda Hugo', 'Que a luz de Liora os guie. E fiquem longe das luzes que dançam entre as árvores!');
        return a.say('Guarda Hugo', 'Vinte anos de guarda e nunca vi o bosque tão quieto. Até os pássaros pararam de cantar.');
      },
    },
    {
      type: 'npc', id: 'tome', x: 17, y: 14, sprite: 'child', dir: 'down', wander: true,
      cond: (f) => !f.boss2,
      script: async (a) => {
        if (a.hasItem('boneca') && !a.flag('tome_doll')) {
          a.set('tome_doll');
          await a.say('Tomé', 'É a boneca da Lia! Onde você achou?!');
          await a.say('Aren', 'No bosque, Tomé. Uma fadinha de luz nos levou até ela.');
          await a.say('Tomé', 'Então a Lia está viva! Por favor, Aren... traga minha irmã de volta. Você prometeu que ia ser um cavaleiro!');
          return;
        }
        if (a.flag('tome_doll')) return a.say('Tomé', 'Eu deixei uma vela acesa na janela pra Lia achar o caminho de casa.');
        await a.say('Tomé', 'Minha irmã Lia sumiu ontem à noite. Ela disse que viu luzinhas coloridas dançando no bosque...');
        await a.say('Tomé', 'Eu falei pra ela não ir! Mas a Lia nunca escuta ninguém.');
      },
    },
    {
      type: 'npc', id: 'velha', x: 13, y: 12, sprite: 'oldwoman', dir: 'right',
      script: async (a) => {
        await a.say('Vovó Inês', 'Ah, o pequeno Aren! Já está maior que a espada do seu pai.');
        if (!a.flag('velha_story')) {
          a.set('velha_story');
          await a.say('Vovó Inês', 'Minha avó contava que a Rainha Liora forjou quatro Sinos de Cristal com a luz do primeiro amanhecer.');
          await a.say('Vovó Inês', 'Enquanto eles tocam, Morvath, o Rei das Sombras, dorme sob as montanhas. Se o sino do templo parou... é mau sinal, menino.');
        }
      },
    },
    {
      type: 'npc', id: 'aldeao', x: 20, y: 9, sprite: 'villager', dir: 'left', wander: true,
      script: async (a) => {
        if (a.flag('boss1')) return a.say('Fazendeiro Ivo', 'Ouvi dizer que vocês derrotaram uma aranha do tamanho de uma carroça! Aldenor está em boas mãos.');
        await a.say('Fazendeiro Ivo', 'Lobos atacaram minhas ovelhas ontem. Lobos com olhos brilhando em roxo! Isso não é coisa natural.');
      },
    },
    {
      type: 'npc', id: 'mulher', x: 21, y: 16, sprite: 'woman', dir: 'down', wander: true,
      script: async (a) => {
        if (a.flag('mirela_joined')) return a.say('Clara', 'A maga da floresta está com vocês? Hum... talvez eu tenha julgado mal. Ela parece só tímida.');
        await a.say('Clara', 'Dizem que uma bruxa mora na Floresta Ancestral. Minha mãe jura que ela transforma gente em sapo!');
      },
    },
    {
      type: 'npc', id: 'bardo', x: 7, y: 14, sprite: 'bard', dir: 'right',
      script: async (a) => {
        await a.say('Bardo Fínio', '♪ Quatro sinos de cristal, na alvorada a soar... enquanto a luz cantar, a sombra há de esperar ♪');
        await a.say('Bardo Fínio', 'Bonita, não? Se você virar herói, Aren, prometo escrever uma canção sobre você. Rima com "Aren"... "vai além"!');
      },
    },
    {
      type: 'npc', id: 'gato', x: 4, y: 6, sprite: 'cat', dir: 'down', wander: true,
      script: async (a) => {
        await a.sfx('cursor');
        await a.say('Gato Malhado', 'Miau!');
        await a.say(null, '(O gato se esfrega na sua perna e ronrona.)');
      },
    },
    {
      type: 'npc', id: 'estranho', x: 4, y: 4, sprite: 'stranger', dir: 'down',
      cond: (f) => f.selene_joined && !f.boss1 && !f.met_stranger,
      script: async (a) => {
        await a.music(null);
        await a.say('???', 'Então este é o portador da Marca do Sol... tão jovem.');
        await a.say('???', 'Meu mestre sente a luz em você, garoto. Os sinos se calarão um a um, e a aurora nunca mais virá.');
        await a.say('Aren', 'Quem é você?! Mostre o rosto!');
        await a.say('Arauto Sombrio', 'Sou apenas um mensageiro de Morvath. Nos veremos de novo... escudeiro.');
        a.set('met_stranger');
        await a.sfx('dark');
        await a.flash(0x8040c0, 300);
        await a.remove('estranho');
        await a.say('Selene', 'Ele sumiu numa nuvem de sombra! Aren, sua mão... a marca está brilhando!');
        await a.music('town');
      },
    },
  ],
};

export const cabana = {
  id: 'cabana',
  name: 'Casa de Aren',
  music: 'town',
  base: 'wood',
  rows: ['XILIIiIOIX', 'XeeeeeeeeX', 'XQe[]eee%X', 'XeeeeeeeeX', 'XVeeeeeeJX', 'XXXXaXXXXX'],
  events: [
    { type: 'warp', x: 4, y: 5, to: 'cinzalva', tx: 7, ty: 7, dir: 'down', sfx: 'door' },
    { type: 'read', x: 2, y: 0, text: 'Livros sobre os grandes cavaleiros de Valdren. O mais gasto se chama "Juramentos da Ordem da Aurora".' },
    { type: 'read', x: 3, y: 2, text: 'A espada de treino que seu pai lhe deu, e um bilhete do Ancião: "Aren, venha à minha casa assim que acordar. É urgente."' },
    {
      type: 'auto', id: 'acordar',
      cond: (f) => !f.intro_room,
      script: async (a) => {
        a.set('intro_room');
        await a.wait(400);
        await a.say('Aren', '...Aquele sonho de novo. Uma voz me chamando, e um sino de cristal se apagando no escuro.');
        await a.say('Aren', 'E esta marca na minha mão... está quente. Ela nunca tinha brilhado assim antes.');
        await a.say(null, 'Dica: use as setas para andar, Z/Enter para confirmar e falar, X/Esc para abrir o menu.');
      },
    },
  ],
};

export const pousada = {
  id: 'pousada',
  name: 'Estalagem do Javali Dourado',
  music: 'town',
  base: 'wood',
  rows: ['XIIiIILIIOIX', 'XeeeeeeeeeeX', 'XNNNeee[]eQX', 'XeeeeeeeeeQX', 'XV[]eeeeeeeX', 'Xeeee]eeeeVX', 'XXXXXaXXXXXX'],
  events: [
    { type: 'warp', x: 5, y: 6, to: 'cinzalva', tx: 5, ty: 14, dir: 'down', sfx: 'door' },
    { type: 'npc', id: 'marta', x: 2, y: 1, sprite: 'innkeeper', dir: 'down', script: async (a) => a.inn(25, 'Marta') },
    {
      type: 'npc', id: 'cliente', x: 4, y: 4, sprite: 'villager', dir: 'left',
      script: async (a) => {
        await a.say('Viajante', 'Vim do sul pela estrada real. Lá também falam de sinos silenciosos... em Vel-Noar, a abadia está em alerta.');
      },
    },
  ],
};

export const loja = {
  id: 'loja',
  name: 'Mercado de Aldenor',
  music: 'town',
  base: 'wood',
  rows: ['XILLIIiIIILLIX', 'XeeeeeeeeeeeeX', 'XNNNNeeeeNNNNX', 'XeeeeeeeeeeeeX', 'XVJeeeeeeeeJVX', 'XeeeeeeeeeeeeX', 'XXXXXXaXXXXXXX'],
  events: [
    { type: 'warp', x: 6, y: 6, to: 'cinzalva', tx: 24, ty: 14, dir: 'down', sfx: 'door' },
    {
      type: 'npc', id: 'odete', x: 2, y: 1, sprite: 'merchant', dir: 'down',
      script: async (a) => {
        await a.say('Odete', 'Olá, Aren! Vai sair em aventura? Leve poções. Muitas poções!');
        await a.shop('odete');
      },
    },
    {
      type: 'npc', id: 'bruno', x: 11, y: 1, sprite: 'smith', dir: 'down',
      script: async (a) => {
        await a.say('Bruno', 'Ferreiro Bruno, às ordens. Essa espada de treino não vai aguentar um goblin, garoto.');
        await a.shop('bruno');
      },
    },
  ],
};

export const capela = {
  id: 'capela',
  name: 'Templo de Santa Liora',
  music: 'chapel',
  base: 'stonefloor',
  rows: ['XCCCCcCcCCCCX', 'Xs*ss!!!ss*sX', 'XsssssssssssX', 'Xs^^^sas^^^sX', 'XsssssasssssX', 'Xs^^^sas^^^sX', 'XsssssasssssX', 'Xs^^^sas^^^sX', 'XsssssasssssX', 'XXXXXXaXXXXXX'],
  events: [
    { type: 'warp', x: 6, y: 9, to: 'cinzalva', tx: 23, ty: 5, dir: 'down', sfx: 'door' },
    { type: 'light', x: 2, y: 1, r: 40 },
    { type: 'light', x: 10, y: 1, r: 40 },
    { type: 'save', x: 9, y: 2 },
    { type: 'read', x: 6, y: 1, text: 'O altar de Santa Liora. Sobre ele, um pequeno sino de cristal rachado, sem brilho algum.' },
    {
      type: 'npc', id: 'selene', x: 6, y: 2, sprite: 'selene', dir: 'up',
      cond: (f) => !f.selene_joined,
      script: async (a) => {
        await a.face('selene', a.facingPlayer('selene'));
        if (!a.flag('met_elder')) {
          await a.say('Selene', 'Bom dia, Aren! Que a luz de Liora esteja com você. Desculpe, estou preocupada com o sino...');
          await a.say('Selene', 'O Ancião mandou chamar você. Vá vê-lo primeiro, por favor.');
          return;
        }
        await a.say('Selene', 'O Ancião te contou, não foi? O sino não tocou nesta alvorada. Nem na anterior.');
        await a.say('Selene', 'Hoje cedo encontrei teias enormes perto do altar, e o cristal estava rachado. Como se algo tivesse roubado a luz dele.');
        await a.say('Aren', 'Teias... e a Lia sumiu seguindo luzes no bosque. Tudo isso está ligado.');
        await a.say('Selene', 'Então vou com você. Alguém precisa cuidar dos seus arranhões, futuro cavaleiro.');
        await a.sfx('item');
        await a.say('Selene', 'Leve isto: a Lanterna da Aurora. Foi acesa com a chama do altar há trezentos anos e nunca se apagou.');
        a.give('lanterna', 1, true);
        await a.say(null, 'Aren recebeu a Lanterna da Aurora!');
        await a.remove('selene');
        a.join('selene');
        a.set('selene_joined');
        await a.sfx('levelup');
        await a.say(null, 'Selene entrou para o grupo!');
        await a.say('Selene', 'Os altares de velas guardam a bênção de Liora. Quando encontrarmos um, poderemos descansar e registrar nossa jornada.');
      },
    },
    {
      type: 'npc', id: 'sacerdote', x: 3, y: 2, sprite: 'priest', dir: 'down',
      script: async (a) => {
        if (a.flag('boss2')) return a.say('Sacerdote Anselmo', 'Sinto o brilho de dois cristais com vocês. A esperança voltou a Aldenor!');
        if (a.flag('selene_joined')) return a.say('Sacerdote Anselmo', 'Cuide bem da Selene, Aren. E lembre-se: a sombra teme a luz que vem do coração.');
        return a.say('Sacerdote Anselmo', 'Rezo desde a madrugada, mas o sino não responde. Algo levou embora a luz do cristal.');
      },
    },
  ],
};

export const casa_anciao = {
  id: 'casa_anciao',
  name: 'Casa do Ancião',
  music: 'town',
  base: 'wood',
  rows: ['XIILIIiIIOIX', 'XeeeeeeeeeeX', 'XQeee[]eee%X', 'Xeeee]eeeeeX', 'XaaaaaaaaaaX', 'XeeeeeeeeeVX', 'XXXXXaXXXXXX'],
  events: [
    { type: 'warp', x: 5, y: 6, to: 'cinzalva', tx: 15, ty: 20, dir: 'down', sfx: 'door' },
    {
      type: 'npc', id: 'anciao', x: 8, y: 2, sprite: 'elder', dir: 'down',
      script: async (a) => {
        if (a.flag('boss2')) return a.say('Ancião Bartolomeu', 'Descansem, meus jovens. Vocês fizeram mais por Aldenor do que qualquer um poderia pedir.');
        if (a.flag('boss1')) {
          await a.say('Ancião Bartolomeu', 'Um Cristal da Aurora! A Rainha Aranha guardava um fragmento do sino em seu covil...');
          await a.say('Ancião Bartolomeu', 'Se a névoa recuou ao norte, a Floresta Ancestral está aberta. Lia, e talvez outro cristal, estão lá.');
          return;
        }
        if (a.flag('met_elder')) {
          return a.say('Ancião Bartolomeu', a.flag('selene_joined') ? 'O bosque fica ao norte da vila. Lia foi vista na trilha. Que Liora os guie!' : 'Vá ao templo, Aren. A Selene entende do sino melhor que qualquer um.');
        }
        a.set('met_elder');
        await a.say('Ancião Bartolomeu', 'Aren, que bom que veio. Sente-se, temos pouco tempo.');
        await a.say('Ancião Bartolomeu', 'A pequena Lia desapareceu no bosque esta noite. E o sino do templo não tocou na alvorada pela segunda vez.');
        await a.say('Ancião Bartolomeu', 'Aquele sino guarda um dos Cristais da Aurora. Sem ele, as criaturas de Morvath ficam mais ousadas a cada noite.');
        await a.say('Aren', 'Mas Ancião, eu sou só um escudeiro... a guarda não deveria ir?');
        await a.say('Ancião Bartolomeu', 'Seu pai também começou como escudeiro. E aquela marca na sua mão não brilha à toa, rapaz.');
        await a.say('Ancião Bartolomeu', 'Vá ao templo e fale com a Selene. Depois, sigam para o bosque. Encontrem Lia e descubram o que roubou a luz do sino.');
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
        await a.say('Tomé', 'Lia! Você voltou! Nunca mais saia sozinha, ouviu?!');
        await a.say('Lia', 'Desculpa, Tomé... As luzinhas eram tão bonitas. Depois eu dormi, e sonhei com uma árvore triste cantando.');
        await a.say('Ancião Bartolomeu', 'Vocês a trouxeram de volta. E com ela, dois Cristais da Aurora.');
        await a.say('Mirela', 'Não comemorem ainda. A Rainha Aranha e Raizmor eram guardiões antigos, corrompidos pela sombra de Morvath.');
        await a.say('Kael', 'Ótimo. Então tem mais guardiões malvados por aí. Adoro meu trabalho.');
        await a.say('Selene', 'Mirela, você estuda os sinos há anos. O que mais sabe?');
        await a.say('Mirela', 'Que existem quatro sinos, e os outros dois também estão perdendo o brilho. Quando todos se calarem, o selo de Morvath se rompe.');
        await a.sfx('bell');
        await a.shake(600, 0.004);
        await a.say('Lia', 'Aren... a árvore falou de você no meu sonho. Disse que a luz do sol mora na sua mão.');
        await a.say('Aren', 'Então é isso que eu vou fazer: reunir os quatro sinos. Pela Lia, por Aldenor... e pelo meu pai.');
        await a.say('Ancião Bartolomeu', 'Ao leste fica a Abadia de Vel-Noar, onde dizem que o terceiro sino ainda toca. Descansem esta noite. Ao amanhecer, partam.');
        await a.fade('out', 1200);
        await a.endChapter();
      },
    },
  ],
};
