// type: phys | magic | heal | revive | cleanse | buff | status | steal
// target: enemy | allEnemies | ally | allParty | deadAlly | self
export const SKILLS = {
  attack: { name: 'Atacar', type: 'phys', power: 1, target: 'enemy', anim: 'slash' },

  // ----- Aren (Escudeiro) -----
  golpe_firme: { name: 'Golpe Firme', mp: 2, type: 'phys', power: 1.5, target: 'enemy', anim: 'slash', desc: 'Um golpe de espada vigoroso. Dano 150%.' },
  lamina_aurora: { name: 'Lâmina da Aurora', mp: 4, type: 'phys', power: 1.2, element: 'aurora', target: 'enemy', anim: 'light', desc: 'A marca do sol ilumina a espada. Devasta criaturas sombrias.' },
  juramento: { name: 'Juramento', mp: 5, type: 'buff', target: 'allParty', cure: ['pavor'], buff: { def: 1.35 }, turns: 4, anim: 'heal', desc: 'Um juramento de cavaleiro: remove Medo e eleva a Defesa do grupo.' },
  investida: { name: 'Investida', mp: 8, type: 'phys', power: 2.3, target: 'enemy', anim: 'crit', desc: 'Avança com toda a força. Dano 230%.' },
  aurora_ascendente: { name: 'Aurora Ascendente', mp: 12, type: 'magic', power: 34, element: 'aurora', target: 'allEnemies', anim: 'light', desc: 'Uma explosão de luz dourada atinge todos os inimigos.' },

  // ----- Selene (Sacerdotisa) -----
  cura: { name: 'Cura', mp: 4, type: 'heal', power: 20, target: 'ally', field: true, anim: 'heal', desc: 'Restaura HP de um aliado.' },
  luz: { name: 'Luz', mp: 4, type: 'magic', power: 15, element: 'luz', target: 'enemy', anim: 'light', desc: 'Raio sagrado. Forte contra criaturas sombrias.' },
  purificar: { name: 'Purificar', mp: 3, type: 'cleanse', target: 'ally', field: true, anim: 'heal', desc: 'Remove todos os males de um aliado.' },
  bencao: { name: 'Bênção', mp: 6, type: 'buff', target: 'allParty', buff: { def: 1.25, res: 1.35 }, turns: 4, anim: 'light', desc: 'Eleva Defesa e Resistência do grupo.' },
  prece: { name: 'Prece', mp: 10, type: 'heal', power: 22, target: 'allParty', field: true, anim: 'heal', desc: 'Restaura HP de todo o grupo.' },
  reviver: { name: 'Reviver', mp: 12, type: 'revive', power: 0.35, target: 'deadAlly', field: true, anim: 'light', desc: 'Desperta um aliado desmaiado.' },
  julgamento: { name: 'Julgamento', mp: 14, type: 'magic', power: 44, element: 'luz', target: 'allEnemies', anim: 'light', desc: 'Luz divina sobre todos os inimigos.' },

  // ----- Kael (Patrulheiro) -----
  golpe_duplo: { name: 'Golpe Duplo', mp: 3, type: 'phys', power: 0.8, hits: 2, target: 'enemy', anim: 'claw', desc: 'Dois golpes rápidos.' },
  roubar: { name: 'Roubar', mp: 0, type: 'steal', target: 'enemy', anim: 'steal', desc: 'Tenta roubar um item do inimigo.' },
  flecha_veneno: { name: 'Flecha Venenosa', mp: 4, type: 'phys', power: 1.0, target: 'enemy', status: { veneno: 0.8 }, anim: 'poison', desc: 'Dano e chance de envenenar.' },
  olho_aguia: { name: 'Olho de Águia', mp: 6, type: 'phys', power: 1.4, crit: true, target: 'enemy', anim: 'crit', desc: 'Golpe crítico garantido.' },
  chuva_flechas: { name: 'Chuva de Flechas', mp: 9, type: 'phys', power: 0.85, target: 'allEnemies', anim: 'claw', desc: 'Atinge todos os inimigos.' },

  // ----- Mirela (Maga) -----
  chama_arcana: { name: 'Chama Arcana', mp: 4, type: 'magic', power: 24, element: 'fogo', target: 'enemy', anim: 'fire', desc: 'Uma bola de fogo azulado.' },
  dreno_arcano: { name: 'Dreno Arcano', mp: 5, type: 'magic', power: 18, element: 'trevas', drain: true, target: 'enemy', anim: 'dark', desc: 'Absorve a energia vital do inimigo.' },
  sono: { name: 'Sono', mp: 4, type: 'status', status: { sono: 0.75 }, target: 'enemy', anim: 'sleep', desc: 'Faz um inimigo adormecer.' },
  furia_arcana: { name: 'Fúria Arcana', hpCost: 0.15, type: 'magic', power: 40, element: 'fogo', target: 'allEnemies', anim: 'fire', desc: 'Custa 15% do HP máximo. Uma onda de magia pura.' },
  tempestade_fogo: { name: 'Tempestade de Fogo', mp: 11, type: 'magic', power: 34, element: 'fogo', target: 'allEnemies', anim: 'fire', desc: 'Fogo sobre todos os inimigos.' },
  confusao: { name: 'Confusão', mp: 8, type: 'status', status: { pavor: 0.6, cego: 0.5 }, target: 'allEnemies', anim: 'dark', desc: 'Medo e Cegueira em todos os inimigos.' },

  // ----- Monstros -----
  mordida: { name: 'Mordida', type: 'phys', power: 1.25, target: 'enemy', anim: 'claw' },
  uivo: { name: 'Uivo Aterrador', type: 'status', status: { pavor: 0.35 }, target: 'allEnemies', anim: 'dark' },
  sugar: { name: 'Mordida Drenante', type: 'phys', power: 0.9, drain: true, target: 'enemy', anim: 'claw' },
  esporos: { name: 'Esporos', type: 'status', status: { veneno: 0.45 }, target: 'allEnemies', anim: 'poison' },
  porretada: { name: 'Porretada', type: 'phys', power: 1.4, target: 'enemy', anim: 'crit' },
  presa_venenosa: { name: 'Presa Venenosa', type: 'phys', power: 1.0, status: { veneno: 0.6 }, target: 'enemy', anim: 'claw' },
  jato_teia: { name: 'Jato de Teia', type: 'status', status: { cego: 0.6 }, target: 'enemy', anim: 'sleep' },
  mastigar: { name: 'Mastigar', type: 'phys', power: 1.5, target: 'enemy', anim: 'claw' },
  lamento: { name: 'Lamento Sombrio', type: 'magic', power: 14, element: 'trevas', status: { pavor: 0.25 }, target: 'allEnemies', anim: 'dark' },
  toque_gelido: { name: 'Toque Gélido', type: 'magic', power: 20, element: 'trevas', drain: true, target: 'enemy', anim: 'dark' },
  bicada: { name: 'Bicada nos Olhos', type: 'phys', power: 1.0, status: { cego: 0.4 }, target: 'enemy', anim: 'claw' },
  corte_sombrio: { name: 'Corte Sombrio', type: 'phys', power: 1.5, element: 'trevas', target: 'enemy', anim: 'slash' },
  foice: { name: 'Foice Encantada', type: 'phys', power: 1.6, target: 'enemy', anim: 'slash' },
  enraizar: { name: 'Enraizar', type: 'status', status: { sono: 0.4 }, target: 'enemy', anim: 'poison' },
  olhar: { name: 'Olhar Arcano', type: 'magic', power: 22, element: 'trevas', status: { pavor: 0.4 }, target: 'enemy', anim: 'dark' },
  raio_olho: { name: 'Raio Sombrio', type: 'magic', power: 18, element: 'trevas', status: { veneno: 0.3 }, target: 'allEnemies', anim: 'poison' },

  // ----- Chefes -----
  tecela_presas: { name: 'Presas Reais', type: 'phys', power: 1.5, status: { veneno: 0.5 }, target: 'enemy', anim: 'claw' },
  tecela_casulo: { name: 'Casulo', type: 'status', status: { sono: 0.85 }, target: 'enemy', anim: 'sleep' },
  tecela_ninhada: { name: 'Ninhada', type: 'phys', power: 0.75, target: 'allEnemies', anim: 'claw' },
  tecela_canto: { name: 'Canção Hipnótica', type: 'magic', power: 16, element: 'trevas', status: { pavor: 0.45 }, target: 'allEnemies', anim: 'dark' },
  galho_chicote: { name: 'Chicote de Galhos', type: 'phys', power: 1.0, target: 'allEnemies', anim: 'slash' },
  galho_esmagar: { name: 'Esmagar', type: 'phys', power: 2.0, target: 'enemy', anim: 'crit' },
  galho_seiva: { name: 'Seiva Sombria', type: 'heal', power: 160, target: 'self', anim: 'heal' },
  galho_esporos: { name: 'Pólen Venenoso', type: 'status', status: { veneno: 0.6, cego: 0.3 }, target: 'allEnemies', anim: 'poison' },
  galho_grito: { name: 'Rugido da Floresta', type: 'magic', power: 30, element: 'trevas', status: { pavor: 0.4 }, target: 'allEnemies', anim: 'dark' },
};

export const STATUS_NAMES = { veneno: 'Veneno', cego: 'Cegueira', pavor: 'Medo', sono: 'Sono' };
export const STATUS_SHORT = { veneno: 'VEN', cego: 'CEG', pavor: 'MED', sono: 'SON' };
export const ELEMENT_NAMES = { fogo: 'Fogo', luz: 'Luz', trevas: 'Trevas', aurora: 'Aurora' };
