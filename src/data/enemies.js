// actions: [skillId, peso]. weak: multiplicador por elemento.
// shadow: criatura sombria — curas causam dano, e Luz/Aurora são muito eficazes.
const SHADOW_WEAK = { luz: 2, aurora: 2.5, trevas: 0 };

export const ENEMIES = {
  // ----- Bosque de Verdemar -----
  lobo: {
    name: 'Lobo Cinzento', sprite: 'wolf', mz: 'SF_Wolf', hp: 34, mp: 0, atk: 14, def: 5, mag: 2, res: 3, agi: 11, luck: 4,
    exp: 8, gold: 7, drops: [['pocao', 0.12]], steal: 'pocao', actions: [['attack', 4], ['mordida', 1]], weak: { fogo: 1.5 },
  },
  morcego: {
    name: 'Diabrete Travesso', sprite: 'bat', mz: 'Petitdevil', hp: 22, mp: 0, atk: 11, def: 3, mag: 2, res: 4, agi: 16, luck: 6,
    exp: 6, gold: 5, drops: [['colirio', 0.1]], steal: 'colirio', actions: [['attack', 3], ['sugar', 2]], weak: { luz: 1.5 },
  },
  cogumelo: {
    name: 'Cogumelo Venenoso', sprite: 'mushroom', mz: 'Matango', hp: 40, mp: 0, atk: 12, def: 6, mag: 6, res: 4, agi: 5, luck: 3,
    exp: 9, gold: 9, drops: [['erva_medicinal', 0.25], ['antidoto', 0.1]], steal: 'erva_medicinal', actions: [['attack', 3], ['esporos', 1]], weak: { fogo: 2 },
  },

  // ----- Gruta de Cristal -----
  goblin: {
    name: 'Goblin Saqueador', sprite: 'goblin', mz: 'Goblin', hp: 80, mp: 0, atk: 33, def: 13, mag: 4, res: 6, agi: 11, luck: 8,
    exp: 21, gold: 24, drops: [['pocao', 0.25]], steal: 'erva_calmante', actions: [['attack', 3], ['porretada', 1]], weak: { fogo: 1.3 },
  },
  aranha: {
    name: 'Lagarto da Gruta', sprite: 'spider', mz: 'Frilledlizard', hp: 62, mp: 0, atk: 30, def: 10, mag: 6, res: 6, agi: 16, luck: 6,
    exp: 18, gold: 14, drops: [['antidoto', 0.25]], steal: 'antidoto', actions: [['attack', 2], ['presa_venenosa', 2], ['jato_teia', 1]], weak: { fogo: 1.5 },
  },
  larva: {
    name: 'Verme da Gruta', sprite: 'larva', mz: 'Sandworm', hp: 100, mp: 0, atk: 30, def: 18, mag: 4, res: 8, agi: 4, luck: 2,
    exp: 20, gold: 12, drops: [['erva_medicinal', 0.3]], steal: 'pocao', actions: [['attack', 2], ['mastigar', 1]], weak: { fogo: 1.5 },
  },
  sombra: {
    name: 'Sombra Errante', sprite: 'shadow', mz: 'Wraith', hp: 60, mp: 0, atk: 10, def: 40, mag: 22, res: 8, agi: 12, luck: 8, shadow: true,
    exp: 24, gold: 16, drops: [['eter', 0.12], ['erva_calmante', 0.2]], steal: 'eter', actions: [['lamento', 2], ['toque_gelido', 2]], weak: SHADOW_WEAK,
  },

  // ----- Floresta Ancestral -----
  corvo: {
    name: 'Corvo Sombrio', sprite: 'crow', mz: 'Crow', hp: 80, mp: 0, atk: 44, def: 14, mag: 6, res: 8, agi: 22, luck: 8,
    exp: 30, gold: 20, drops: [['colirio', 0.2]], steal: 'lente_elfica', stealRate: 0.15, actions: [['attack', 3], ['bicada', 2]], weak: { fogo: 1.3 },
  },
  cavaleiro: {
    name: 'Cavaleiro Sombrio', sprite: 'darkknight', mz: 'Blackknight', hp: 140, mp: 0, atk: 50, def: 20, mag: 10, res: 10, agi: 9, luck: 4, shadow: true,
    exp: 40, gold: 32, drops: [['erva_calmante', 0.3], ['pluma_aurora', 0.05]], steal: 'pocao_forte', actions: [['attack', 3], ['corte_sombrio', 2], ['uivo', 1]], weak: { ...SHADOW_WEAK, fogo: 1.2 },
  },
  espantalho: {
    name: 'Elfo Sombrio', sprite: 'scarecrow', mz: 'Darkelf', hp: 150, mp: 0, atk: 52, def: 22, mag: 6, res: 8, agi: 10, luck: 3,
    exp: 44, gold: 30, drops: [['pocao_forte', 0.15]], steal: 'pocao_forte', actions: [['attack', 3], ['foice', 2]], weak: { fogo: 2 },
  },
  raiz: {
    name: 'Mandrágora', sprite: 'roots', mz: 'Mandrake_mvt', hp: 120, mp: 0, atk: 46, def: 26, mag: 8, res: 10, agi: 6, luck: 2,
    exp: 36, gold: 22, drops: [['erva_medicinal', 0.4]], steal: 'erva_medicinal', actions: [['attack', 3], ['enraizar', 1]], weak: { fogo: 2 },
  },
  olho: {
    name: 'Fogo-fátuo Sombrio', sprite: 'eye', mz: 'Plasma', hp: 100, mp: 0, atk: 20, def: 16, mag: 32, res: 18, agi: 13, luck: 6, shadow: true,
    exp: 42, gold: 28, drops: [['eter', 0.2]], steal: 'eter', actions: [['olhar', 2], ['raio_olho', 1]], weak: SHADOW_WEAK,
  },
  lobo_sombrio: {
    name: 'Lobisomem Sombrio', sprite: 'wolf_black', mz: 'Wolfman', hp: 120, mp: 0, atk: 48, def: 18, mag: 4, res: 8, agi: 20, luck: 6, shadow: true,
    exp: 38, gold: 24, drops: [['pocao_forte', 0.12]], steal: 'pocao_forte', actions: [['attack', 3], ['mordida', 2], ['uivo', 1]], weak: { ...SHADOW_WEAK, fogo: 1.5 },
  },

  // ----- Chefes -----
  tecela: {
    name: 'Medusa', sprite: 'weaver', mz: 'Medusa', boss: true, hp: 950, mp: 0, atk: 40, def: 16, mag: 24, res: 12, agi: 12, luck: 5,
    exp: 320, gold: 400, drops: [['anel_lobo', 1]], steal: 'eter', stealRate: 0.3, weak: { fogo: 1.5, luz: 1.2, aurora: 1.3 },
    ai(self, ctx) {
      const hpr = self.hp / self.maxHp;
      if (ctx.turn % 4 === 0) return 'tecela_canto';
      if (hpr < 0.5 && Math.random() < 0.35) return 'tecela_ninhada';
      return ctx.pick([['tecela_presas', 3], ['tecela_casulo', 1], ['attack', 2]]);
    },
  },
  pai_galho: {
    name: 'Raizmor Corrompido', sprite: 'tree', mz: 'Treant', boss: true, hp: 1900, mp: 0, atk: 52, def: 22, mag: 30, res: 18, agi: 9, luck: 5,
    exp: 650, gold: 800, drops: [['lamina_sol', 1]], steal: 'pocao_forte', stealRate: 0.3, weak: { fogo: 1.6, aurora: 1.3 },
    ai(self, ctx) {
      const hpr = self.hp / self.maxHp;
      if (hpr < 0.4 && !self.healed) {
        self.healed = true;
        return 'galho_seiva';
      }
      if (ctx.turn % 3 === 0) return hpr < 0.5 ? 'galho_grito' : 'galho_chicote';
      return ctx.pick([['galho_esmagar', 2], ['attack', 2], ['galho_esporos', 1], ['galho_chicote', 1]]);
    },
  },
};
