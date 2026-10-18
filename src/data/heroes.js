export const HEROES = {
  aren: {
    name: 'Aren',
    job: 'Escudeiro',
    sprite: 'aren',
    bio: 'Escudeiro da guarda de Aldenor e filho de um cavaleiro caído. Uma marca em forma de sol brilha em sua mão perto das sombras.',
    base: { hp: 84, mp: 10, atk: 12, def: 8, mag: 5, res: 6, agi: 9, luck: 8 },
    growth: { hp: 13, mp: 2, atk: 2.3, def: 1.6, mag: 0.8, res: 1.0, agi: 1.2, luck: 0.6 },
    skills: [[1, 'golpe_firme'], [3, 'lamina_aurora'], [5, 'juramento'], [7, 'investida'], [9, 'aurora_ascendente']],
    equip: { weapon: 'espada_curta', armor: 'tunica_viagem', accessory: null },
  },
  selene: {
    name: 'Selene',
    job: 'Sacerdotisa',
    sprite: 'selene',
    bio: 'Aprendiz do Templo de Santa Liora. Gentil e determinada, cuida do sino do templo desde criança.',
    base: { hp: 64, mp: 22, atk: 7, def: 7, mag: 12, res: 11, agi: 8, luck: 10 },
    growth: { hp: 10, mp: 4, atk: 1.1, def: 1.2, mag: 2.2, res: 2.0, agi: 1.0, luck: 0.8 },
    skills: [[1, 'cura'], [1, 'luz'], [3, 'purificar'], [5, 'bencao'], [7, 'prece'], [9, 'reviver'], [11, 'julgamento']],
    equip: { weapon: 'cajado_freixo', armor: 'tunica_viagem', accessory: null },
  },
  kael: {
    name: 'Kael',
    job: 'Patrulheiro',
    sprite: 'kael',
    bio: 'Arqueiro errante que caçava a Rainha Aranha. Brincalhão, ágil e leal a quem salva sua pele.',
    base: { hp: 72, mp: 12, atk: 11, def: 7, mag: 6, res: 6, agi: 14, luck: 12 },
    growth: { hp: 11, mp: 2, atk: 2.1, def: 1.3, mag: 0.9, res: 1.0, agi: 2.0, luck: 1.2 },
    skills: [[1, 'golpe_duplo'], [1, 'roubar'], [5, 'flecha_veneno'], [7, 'olho_aguia'], [9, 'chuva_flechas']],
    equip: { weapon: 'faca_caca', armor: 'gibao_couro', accessory: null },
  },
  mirela: {
    name: 'Mirela',
    job: 'Maga',
    sprite: 'mirela',
    bio: 'Maga guardiã da Floresta Ancestral. Os aldeões a chamam de bruxa, mas ela estuda os Sinos da Aurora há anos.',
    base: { hp: 58, mp: 28, atk: 5, def: 6, mag: 15, res: 10, agi: 10, luck: 7 },
    growth: { hp: 9, mp: 5, atk: 0.8, def: 1.0, mag: 2.6, res: 1.8, agi: 1.2, luck: 0.7 },
    skills: [[1, 'chama_arcana'], [1, 'dreno_arcano'], [1, 'sono'], [7, 'furia_arcana'], [9, 'tempestade_fogo'], [11, 'confusao']],
    equip: { weapon: 'varinha_carvalho', armor: 'manto_peregrino', accessory: null },
  },
};

export const MAX_LEVEL = 50;

export function expForLevel(level) {
  if (level <= 1) return 0;
  const n = level - 1;
  return Math.round(10 * Math.pow(n, 2.2) + 10 * n);
}
