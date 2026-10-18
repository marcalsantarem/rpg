export const HEROES = {
  aren: {
    name: 'Aren',
    job: 'Coveiro',
    sprite: 'aren',
    bio: 'Jovem coveiro de Cinzalva. Desde a infância ouve os mortos sussurrarem sob a terra.',
    base: { hp: 62, mp: 8, atk: 12, def: 8, mag: 5, res: 6, agi: 9, luck: 8 },
    growth: { hp: 12, mp: 2, atk: 2.3, def: 1.6, mag: 0.8, res: 1.0, agi: 1.2, luck: 0.6 },
    skills: [[1, 'pa_pesada'], [3, 'rito_funebre'], [5, 'coragem'], [7, 'cova_rasa'], [9, 'voz_dos_mortos']],
    equip: { weapon: 'pa_enferrujada', armor: 'roupa_la', accessory: null },
  },
  selene: {
    name: 'Selene',
    job: 'Clériga',
    sprite: 'selene',
    bio: 'Noviça da capela de Cinzalva. Sua fé é firme, mas ela teme o que o sino silencioso significa.',
    base: { hp: 46, mp: 20, atk: 7, def: 6, mag: 12, res: 11, agi: 8, luck: 10 },
    growth: { hp: 9, mp: 4, atk: 1.1, def: 1.2, mag: 2.2, res: 2.0, agi: 1.0, luck: 0.8 },
    skills: [[1, 'cura'], [1, 'luz'], [3, 'purificar'], [5, 'bencao'], [7, 'prece'], [9, 'reviver'], [11, 'julgamento']],
    equip: { weapon: 'cajado_freixo', armor: 'roupa_la', accessory: null },
  },
  kael: {
    name: 'Kael',
    job: 'Caçador',
    sprite: 'kael',
    bio: 'Caçador errante que perseguia a Tecelã. Sarcástico, rápido e com dívidas com a morte.',
    base: { hp: 54, mp: 10, atk: 11, def: 7, mag: 6, res: 6, agi: 14, luck: 12 },
    growth: { hp: 10, mp: 2, atk: 2.1, def: 1.3, mag: 0.9, res: 1.0, agi: 2.0, luck: 1.2 },
    skills: [[1, 'golpe_duplo'], [1, 'roubar'], [5, 'flecha_veneno'], [7, 'olho_aguia'], [9, 'chuva_flechas']],
    equip: { weapon: 'faca_caca', armor: 'gibao_couro', accessory: null },
  },
  mirela: {
    name: 'Mirela',
    job: 'Bruxa',
    sprite: 'mirela',
    bio: 'Bruxa da Mata dos Enforcados, odiada pela vila. Sabe mais sobre os sinos do que admite.',
    base: { hp: 42, mp: 26, atk: 5, def: 5, mag: 15, res: 10, agi: 10, luck: 7 },
    growth: { hp: 8, mp: 5, atk: 0.8, def: 1.0, mag: 2.6, res: 1.8, agi: 1.2, luck: 0.7 },
    skills: [[1, 'fogo_fatuo'], [1, 'toque_sombrio'], [1, 'sono'], [7, 'pacto_sangue'], [9, 'inferno'], [11, 'maldicao']],
    equip: { weapon: 'varinha_osso', armor: 'manto_cinzento', accessory: null },
  },
};

export const MAX_LEVEL = 50;

export function expForLevel(level) {
  if (level <= 1) return 0;
  const n = level - 1;
  return Math.round(10 * Math.pow(n, 2.2) + 10 * n);
}
