// type: item | key | weapon | armor | accessory
export const ITEMS = {
  // ----- consumíveis -----
  pocao: { name: 'Poção', type: 'item', price: 20, desc: 'Restaura 50 HP de um aliado.', use: { heal: 50 }, target: 'ally', battle: true, field: true },
  pocao_forte: { name: 'Poção Forte', type: 'item', price: 90, desc: 'Restaura 160 HP de um aliado.', use: { heal: 160 }, target: 'ally', battle: true, field: true },
  eter: { name: 'Éter', type: 'item', price: 70, desc: 'Restaura 20 MP de um aliado.', use: { mp: 20 }, target: 'ally', battle: true, field: true },
  antidoto: { name: 'Antídoto', type: 'item', price: 12, desc: 'Cura Veneno.', use: { cure: ['veneno'] }, target: 'ally', battle: true, field: true },
  sal_bento: { name: 'Sal Bento', type: 'item', price: 18, desc: 'Cura Pavor.', use: { cure: ['pavor'] }, target: 'ally', battle: true, field: true },
  colirio: { name: 'Colírio', type: 'item', price: 12, desc: 'Cura Cegueira.', use: { cure: ['cego'] }, target: 'ally', battle: true, field: true },
  erva_amarga: { name: 'Erva Amarga', type: 'item', price: 0, sell: 10, desc: 'Restaura 30 HP e cura Veneno.', use: { heal: 30, cure: ['veneno'] }, target: 'ally', battle: true, field: true },
  vela_retorno: { name: 'Vela do Retorno', type: 'item', price: 150, desc: 'Revive um aliado com 30% do HP.', use: { revive: 0.3 }, target: 'deadAlly', battle: true, field: true },
  agua_benta: { name: 'Água Benta', type: 'item', price: 50, desc: 'Causa 80 de dano sagrado a um inimigo.', use: { damage: 80, element: 'luz' }, target: 'enemy', battle: true, field: false },

  // ----- itens-chave -----
  lanterna: { name: 'Lanterna de Vigília', type: 'key', desc: 'Lanterna abençoada da capela. Afasta um pouco a escuridão.' },
  boneca: { name: 'Boneca de Pano', type: 'key', desc: 'Pertence a Lia, irmã de Tomé. Está úmida e fria.' },
  fragmento1: { name: 'Fragmento do Sino I', type: 'key', desc: 'Um pedaço de osso que ainda vibra. Tirado da Tecelã.' },
  fragmento2: { name: 'Fragmento do Sino II', type: 'key', desc: 'Um pedaço de osso coberto de seiva. Tirado do Pai-Galho.' },

  // ----- armas -----
  pa_enferrujada: { name: 'Pá Enferrujada', type: 'weapon', who: ['aren'], stats: { atk: 6 }, price: 10, desc: 'A velha pá de coveiro de Aren.' },
  pa_ferro: { name: 'Pá de Ferro', type: 'weapon', who: ['aren'], stats: { atk: 13 }, price: 120, desc: 'Pá reforçada. Pesada e confiável.' },
  machado_coveiro: { name: 'Machado de Coveiro', type: 'weapon', who: ['aren'], stats: { atk: 21 }, price: 380, desc: 'Abre covas... e crânios.' },
  foice_bento: { name: 'Foice Bento', type: 'weapon', who: ['aren'], stats: { atk: 30, res: 4 }, price: 900, desc: 'Foice consagrada por Liora.' },
  cajado_freixo: { name: 'Cajado de Freixo', type: 'weapon', who: ['selene'], stats: { atk: 3, mag: 3 }, price: 10, desc: 'Cajado simples de noviça.' },
  maca_bento: { name: 'Maça Bento', type: 'weapon', who: ['selene'], stats: { atk: 9, mag: 5 }, price: 160, desc: 'Maça com inscrições sagradas.' },
  cetro_prata: { name: 'Cetro de Prata', type: 'weapon', who: ['selene'], stats: { atk: 12, mag: 10 }, price: 700, desc: 'Prata pura. Os mortos o temem.' },
  faca_caca: { name: 'Faca de Caça', type: 'weapon', who: ['kael'], stats: { atk: 10 }, price: 40, desc: 'Lâmina curta e afiada.' },
  arco_curto: { name: 'Arco Curto', type: 'weapon', who: ['kael'], stats: { atk: 16 }, price: 220, desc: 'Arco leve de caçador.' },
  arco_teixo: { name: 'Arco de Teixo', type: 'weapon', who: ['kael'], stats: { atk: 24, agi: 2 }, price: 460, desc: 'Teixo de cemitério. Preciso e cruel.' },
  varinha_osso: { name: 'Varinha de Osso', type: 'weapon', who: ['mirela'], stats: { atk: 3, mag: 6 }, price: 60, desc: 'Feita do dedo de alguém.' },
  grimorio: { name: 'Grimório Rachado', type: 'weapon', who: ['mirela'], stats: { atk: 4, mag: 12 }, price: 420, desc: 'As páginas sussurram.' },

  // ----- armaduras -----
  roupa_la: { name: 'Roupa de Lã', type: 'armor', who: 'all', stats: { def: 2 }, price: 20, desc: 'Roupas comuns de Cinzalva.' },
  gibao_couro: { name: 'Gibão de Couro', type: 'armor', who: ['aren', 'kael'], stats: { def: 6 }, price: 90, desc: 'Couro curtido e resistente.' },
  manto_cinzento: { name: 'Manto Cinzento', type: 'armor', who: ['selene', 'mirela'], stats: { def: 4, res: 4 }, price: 100, desc: 'Manto de peregrino.' },
  cota_malha: { name: 'Cota de Malha', type: 'armor', who: ['aren'], stats: { def: 11, agi: -1 }, price: 320, desc: 'Anéis de ferro. Pesada.' },
  capa_sombria: { name: 'Capa Sombria', type: 'armor', who: ['kael', 'mirela'], stats: { def: 7, res: 5, agi: 2 }, price: 280, desc: 'Tecido que bebe a luz.' },
  habito_sagrado: { name: 'Hábito Sagrado', type: 'armor', who: ['selene'], stats: { def: 9, res: 9 }, price: 600, desc: 'Hábito bordado com fios de prata.' },

  // ----- acessórios -----
  amuleto_prata: { name: 'Amuleto de Prata', type: 'accessory', who: 'all', stats: { res: 6 }, price: 150, desc: 'Resistência mágica +6.' },
  rosario: { name: 'Rosário', type: 'accessory', who: 'all', stats: { res: 2 }, protect: ['pavor'], price: 200, desc: 'Protege contra Pavor.' },
  anel_ossos: { name: 'Anel de Ossos', type: 'accessory', who: 'all', stats: { atk: 4, agi: 3 }, price: 400, desc: 'Força +4, Agilidade +3.' },
  fita_vermelha: { name: 'Fita Vermelha', type: 'accessory', who: 'all', stats: { hp: 40 }, protect: ['sono'], price: 300, desc: 'HP +40. Protege contra Sono.' },
  olho_vidro: { name: 'Olho de Vidro', type: 'accessory', who: 'all', stats: { luck: 5 }, protect: ['cego'], price: 250, desc: 'Protege contra Cegueira.' },
};

export const SLOT_NAMES = { weapon: 'Arma', armor: 'Armadura', accessory: 'Acessório' };
export const STAT_NAMES = { hp: 'HP', mp: 'MP', atk: 'Força', def: 'Defesa', mag: 'Magia', res: 'Resist.', agi: 'Agilid.', luck: 'Sorte' };

export function canEquip(item, heroId) {
  return item.who === 'all' || (Array.isArray(item.who) && item.who.includes(heroId));
}
