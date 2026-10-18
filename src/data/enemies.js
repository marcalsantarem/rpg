// actions: [skillId, peso]. weak: multiplicador por elemento. undead: cura vira dano, Luz/Rito dobram.
export const ENEMIES = {
  // ----- Bosque dos Sussurros -----
  lobo: {
    name: 'Lobo Sarnento', sprite: 'wolf', hp: 40, mp: 0, atk: 18, def: 6, mag: 2, res: 3, agi: 11, luck: 4,
    exp: 8, gold: 7, drops: [['pocao', 0.12]], steal: 'pocao', actions: [['attack', 4], ['mordida', 1]], weak: { fogo: 1.5 },
  },
  morcego: {
    name: 'Morcego Sangrento', sprite: 'bat', hp: 26, mp: 0, atk: 15, def: 4, mag: 2, res: 4, agi: 16, luck: 6,
    exp: 6, gold: 5, drops: [['colirio', 0.1]], steal: 'colirio', actions: [['attack', 3], ['sugar', 2]], weak: { luz: 1.5 },
  },
  cogumelo: {
    name: 'Cogumelo Carniceiro', sprite: 'mushroom', hp: 48, mp: 0, atk: 16, def: 8, mag: 6, res: 4, agi: 5, luck: 3,
    exp: 9, gold: 9, drops: [['erva_amarga', 0.25], ['antidoto', 0.1]], steal: 'erva_amarga', actions: [['attack', 3], ['esporos', 1]], weak: { fogo: 2 },
  },

  // ----- Caverna das Lamúrias -----
  esqueleto: {
    name: 'Esqueleto Errante', sprite: 'skeleton', hp: 85, mp: 0, atk: 30, def: 14, mag: 4, res: 6, agi: 8, luck: 4, undead: true,
    exp: 21, gold: 18, drops: [['pocao', 0.2]], steal: 'sal_bento', actions: [['attack', 3], ['golpe_osso', 1]], weak: { luz: 2, rito: 2.5, trevas: 0 },
  },
  aranha: {
    name: 'Aranha Tecelã', sprite: 'spider', hp: 62, mp: 0, atk: 28, def: 10, mag: 6, res: 6, agi: 16, luck: 6,
    exp: 18, gold: 14, drops: [['antidoto', 0.25]], steal: 'antidoto', actions: [['attack', 2], ['presa_venenosa', 2], ['jato_teia', 1]], weak: { fogo: 1.5 },
  },
  larva: {
    name: 'Larva Pálida', sprite: 'larva', hp: 100, mp: 0, atk: 27, def: 18, mag: 4, res: 8, agi: 4, luck: 2,
    exp: 20, gold: 12, drops: [['erva_amarga', 0.3]], steal: 'pocao', actions: [['attack', 2], ['mastigar', 1]], weak: { fogo: 1.5 },
  },
  fantasma: {
    name: 'Alma Lamuriosa', sprite: 'ghost', hp: 60, mp: 0, atk: 10, def: 40, mag: 22, res: 8, agi: 12, luck: 8, undead: true,
    exp: 24, gold: 16, drops: [['eter', 0.12], ['sal_bento', 0.2]], steal: 'eter', actions: [['lamuria', 2], ['toque_gelido', 2]], weak: { luz: 2, rito: 2.5, trevas: 0 },
  },

  // ----- Mata dos Enforcados -----
  corvo: {
    name: 'Corvo Agourento', sprite: 'crow', hp: 80, mp: 0, atk: 40, def: 14, mag: 6, res: 8, agi: 22, luck: 8,
    exp: 30, gold: 20, drops: [['colirio', 0.2]], steal: 'olho_vidro', stealRate: 0.15, actions: [['attack', 3], ['bicada', 2]], weak: { fogo: 1.3 },
  },
  enforcado: {
    name: 'Enforcado', sprite: 'hanged', hp: 140, mp: 0, atk: 46, def: 20, mag: 10, res: 10, agi: 7, luck: 2, undead: true,
    exp: 40, gold: 26, drops: [['sal_bento', 0.3], ['vela_retorno', 0.05]], steal: 'pocao_forte', actions: [['attack', 3], ['estrangular', 2], ['uivo', 1]], weak: { luz: 2, rito: 2.5, fogo: 1.3, trevas: 0 },
  },
  espantalho: {
    name: 'Espantalho Faminto', sprite: 'scarecrow', hp: 150, mp: 0, atk: 48, def: 22, mag: 6, res: 8, agi: 10, luck: 3,
    exp: 44, gold: 30, drops: [['pocao_forte', 0.15]], steal: 'pocao_forte', actions: [['attack', 3], ['foice', 2]], weak: { fogo: 2 },
  },
  raiz: {
    name: 'Raiz Rastejante', sprite: 'roots', hp: 120, mp: 0, atk: 42, def: 26, mag: 8, res: 10, agi: 6, luck: 2,
    exp: 36, gold: 22, drops: [['erva_amarga', 0.4]], steal: 'erva_amarga', actions: [['attack', 3], ['enraizar', 1]], weak: { fogo: 2 },
  },
  olho: {
    name: 'Olho do Pântano', sprite: 'eye', hp: 100, mp: 0, atk: 20, def: 16, mag: 32, res: 18, agi: 13, luck: 6,
    exp: 42, gold: 28, drops: [['eter', 0.2]], steal: 'eter', actions: [['olhar', 2], ['raio_olho', 1]], weak: { luz: 1.5 },
  },
  lobo_nevoa: {
    name: 'Lobo da Névoa', sprite: 'wolf_black', hp: 120, mp: 0, atk: 46, def: 18, mag: 4, res: 8, agi: 20, luck: 6,
    exp: 38, gold: 24, drops: [['pocao_forte', 0.12]], steal: 'pocao_forte', actions: [['attack', 3], ['mordida', 2], ['uivo', 1]], weak: { fogo: 1.5, luz: 1.3 },
  },

  // ----- Chefes -----
  tecela: {
    name: 'Tecelã de Ossos', sprite: 'weaver', boss: true, hp: 950, mp: 0, atk: 32, def: 16, mag: 24, res: 12, agi: 12, luck: 5,
    exp: 320, gold: 400, drops: [['anel_ossos', 1]], steal: 'eter', stealRate: 0.3, weak: { fogo: 1.5, luz: 1.2 },
    ai(self, ctx) {
      const hpr = self.hp / self.maxHp;
      if (ctx.turn % 4 === 0) return 'tecela_canto';
      if (hpr < 0.5 && Math.random() < 0.35) return 'tecela_ninhada';
      return ctx.pick([['tecela_presas', 3], ['tecela_casulo', 1], ['attack', 2]]);
    },
  },
  pai_galho: {
    name: 'Pai-Galho', sprite: 'tree', boss: true, hp: 1900, mp: 0, atk: 46, def: 22, mag: 30, res: 18, agi: 9, luck: 5,
    exp: 650, gold: 800, drops: [['foice_bento', 1]], steal: 'pocao_forte', stealRate: 0.3, weak: { fogo: 1.6 },
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
