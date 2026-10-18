// type: item | key | weapon | armor | accessory
export const ITEMS = {
  // ----- consumíveis -----
  pocao: { name: 'Poção', type: 'item', price: 20, desc: 'Restaura 50 HP de um aliado.', use: { heal: 50 }, target: 'ally', battle: true, field: true },
  pocao_forte: { name: 'Poção Forte', type: 'item', price: 90, desc: 'Restaura 160 HP de um aliado.', use: { heal: 160 }, target: 'ally', battle: true, field: true },
  eter: { name: 'Éter', type: 'item', price: 70, desc: 'Restaura 20 MP de um aliado.', use: { mp: 20 }, target: 'ally', battle: true, field: true },
  antidoto: { name: 'Antídoto', type: 'item', price: 12, desc: 'Cura Veneno.', use: { cure: ['veneno'] }, target: 'ally', battle: true, field: true },
  erva_calmante: { name: 'Erva Calmante', type: 'item', price: 18, desc: 'Cura Medo.', use: { cure: ['pavor'] }, target: 'ally', battle: true, field: true },
  colirio: { name: 'Colírio', type: 'item', price: 12, desc: 'Cura Cegueira.', use: { cure: ['cego'] }, target: 'ally', battle: true, field: true },
  erva_medicinal: { name: 'Erva Medicinal', type: 'item', price: 0, sell: 10, desc: 'Restaura 30 HP e cura Veneno.', use: { heal: 30, cure: ['veneno'] }, target: 'ally', battle: true, field: true },
  pluma_aurora: { name: 'Pluma da Aurora', type: 'item', price: 150, desc: 'Desperta um aliado desmaiado com 30% do HP.', use: { revive: 0.3 }, target: 'deadAlly', battle: true, field: true },
  agua_sagrada: { name: 'Água Sagrada', type: 'item', price: 50, desc: 'Causa 80 de dano sagrado a um inimigo.', use: { damage: 80, element: 'luz' }, target: 'enemy', battle: true, field: false },

  // ----- itens-chave -----
  lanterna: { name: 'Lanterna da Aurora', type: 'key', desc: 'Lanterna do templo acesa com a chama de Liora. Afasta a escuridão.' },
  boneca: { name: 'Boneca de Pano', type: 'key', desc: 'A boneca preferida de Lia, irmã de Tomé.' },
  fragmento1: { name: 'Cristal da Aurora I', type: 'key', desc: 'Fragmento de um Sino de Cristal. Brilha com luz própria.' },
  fragmento2: { name: 'Cristal da Aurora II', type: 'key', desc: 'Outro fragmento de Sino de Cristal, morno como o sol.' },

  // ----- armas -----
  espada_curta: { name: 'Espada Curta', type: 'weapon', who: ['aren'], stats: { atk: 6 }, price: 10, desc: 'A espada de treino de Aren.' },
  espada_ferro: { name: 'Espada de Ferro', type: 'weapon', who: ['aren'], stats: { atk: 13 }, price: 120, desc: 'Lâmina sólida forjada em Aldenor.' },
  espada_longa: { name: 'Espada Longa', type: 'weapon', who: ['aren'], stats: { atk: 21 }, price: 380, desc: 'Espada de cavaleiro, longa e equilibrada.' },
  lamina_sol: { name: 'Lâmina do Sol', type: 'weapon', who: ['aren'], stats: { atk: 30, res: 4 }, price: 900, desc: 'Uma espada antiga que brilha ao amanhecer.' },
  cajado_freixo: { name: 'Cajado de Freixo', type: 'weapon', who: ['selene'], stats: { atk: 3, mag: 3 }, price: 10, desc: 'Cajado simples de aprendiz.' },
  maca_sagrada: { name: 'Maça Sagrada', type: 'weapon', who: ['selene'], stats: { atk: 9, mag: 5 }, price: 160, desc: 'Maça com runas do templo.' },
  cetro_prata: { name: 'Cetro de Prata', type: 'weapon', who: ['selene'], stats: { atk: 12, mag: 10 }, price: 700, desc: 'Prata pura. As sombras recuam diante dele.' },
  faca_caca: { name: 'Faca de Caça', type: 'weapon', who: ['kael'], stats: { atk: 10 }, price: 40, desc: 'Lâmina curta e afiada.' },
  arco_curto: { name: 'Arco Curto', type: 'weapon', who: ['kael'], stats: { atk: 16 }, price: 220, desc: 'Arco leve de patrulheiro.' },
  arco_teixo: { name: 'Arco de Teixo', type: 'weapon', who: ['kael'], stats: { atk: 24, agi: 2 }, price: 460, desc: 'Arco élfico, preciso e veloz.' },
  varinha_carvalho: { name: 'Varinha de Carvalho', type: 'weapon', who: ['mirela'], stats: { atk: 3, mag: 6 }, price: 60, desc: 'Varinha feita de um galho da Floresta Ancestral.' },
  grimorio: { name: 'Grimório Antigo', type: 'weapon', who: ['mirela'], stats: { atk: 4, mag: 12 }, price: 420, desc: 'Um livro de feitiços da época de Liora.' },

  // ----- armaduras -----
  tunica_viagem: { name: 'Túnica de Viagem', type: 'armor', who: 'all', stats: { def: 2 }, price: 20, desc: 'Roupas resistentes para a estrada.' },
  gibao_couro: { name: 'Gibão de Couro', type: 'armor', who: ['aren', 'kael'], stats: { def: 6 }, price: 90, desc: 'Couro curtido e resistente.' },
  manto_peregrino: { name: 'Manto do Peregrino', type: 'armor', who: ['selene', 'mirela'], stats: { def: 4, res: 4 }, price: 100, desc: 'Manto encantado contra intempéries.' },
  cota_malha: { name: 'Cota de Malha', type: 'armor', who: ['aren'], stats: { def: 11, agi: -1 }, price: 320, desc: 'Anéis de ferro. Pesada, mas segura.' },
  capa_floresta: { name: 'Capa da Floresta', type: 'armor', who: ['kael', 'mirela'], stats: { def: 7, res: 5, agi: 2 }, price: 280, desc: 'Tecido élfico verde-musgo.' },
  habito_sagrado: { name: 'Hábito Sagrado', type: 'armor', who: ['selene'], stats: { def: 9, res: 9 }, price: 600, desc: 'Bordado com fios de prata do templo.' },

  // ----- acessórios -----
  amuleto_prata: { name: 'Amuleto de Prata', type: 'accessory', who: 'all', stats: { res: 6 }, price: 150, desc: 'Resistência mágica +6.' },
  talisma_coragem: { name: 'Talismã da Coragem', type: 'accessory', who: 'all', stats: { res: 2 }, protect: ['pavor'], price: 200, desc: 'Protege contra Medo.' },
  anel_lobo: { name: 'Anel do Lobo', type: 'accessory', who: 'all', stats: { atk: 4, agi: 3 }, price: 400, desc: 'Força +4, Agilidade +3.' },
  fita_vermelha: { name: 'Fita Vermelha', type: 'accessory', who: 'all', stats: { hp: 40 }, protect: ['sono'], price: 300, desc: 'HP +40. Protege contra Sono.' },
  lente_elfica: { name: 'Lente Élfica', type: 'accessory', who: 'all', stats: { luck: 5 }, protect: ['cego'], price: 250, desc: 'Protege contra Cegueira.' },
};

export const SLOT_NAMES = { weapon: 'Arma', armor: 'Armadura', accessory: 'Acessório' };
export const STAT_NAMES = { hp: 'HP', mp: 'MP', atk: 'Força', def: 'Defesa', mag: 'Magia', res: 'Resist.', agi: 'Agilid.', luck: 'Sorte' };

export function canEquip(item, heroId) {
  return item.who === 'all' || (Array.isArray(item.who) && item.who.includes(heroId));
}
