export const HERO_CLASSES = {
  guerreiro: {
    id: 'guerreiro',
    job: 'Guerreiro',
    role: 'Vanguarda & Defesa',
    sprite: 'aren',
    desc: 'Combatente robusto da guarda de Aldenor. Domina golpes pesados, alta defesa e juramentos que protegem o grupo.',
    bio: 'Guerreiro da guarda de Aldenor e filho de um cavaleiro caído. Uma marca em forma de sol brilha em sua mão perto das sombras.',
    base: { hp: 94, mp: 10, atk: 13, def: 10, mag: 5, res: 6, agi: 8, luck: 8 },
    growth: { hp: 14, mp: 2, atk: 2.4, def: 1.9, mag: 0.8, res: 1.1, agi: 1.0, luck: 0.6 },
    skills: [[1, 'golpe_firme'], [3, 'lamina_aurora'], [5, 'juramento'], [7, 'investida'], [9, 'aurora_ascendente'], [11, 'escudo_solar']],
    equip: { weapon: 'espada_curta', armor: 'gibao_couro', accessory: null },
  },
  espadachim: {
    id: 'espadachim',
    job: 'Espadachim',
    role: 'Velocidade & Crítico',
    sprite: 'aren_espadachim',
    desc: 'Esgrimista veloz e letal. Desfere múltiplos cortes por turno, eleva o ataque da equipe e acerta pontos vitais.',
    bio: 'Espadachim de Aldenor e filho de um cavaleiro caído. Sua esgrima relâmpago canaliza o brilho da Marca do Sol em cada estocada.',
    base: { hp: 78, mp: 13, atk: 13, def: 7, mag: 6, res: 6, agi: 13, luck: 11 },
    growth: { hp: 11.5, mp: 2.5, atk: 2.5, def: 1.3, mag: 1.0, res: 1.0, agi: 1.9, luck: 1.1 },
    skills: [[1, 'corte_duplo'], [3, 'lamina_aurora'], [5, 'foco_lamina'], [7, 'estocada_relampago'], [9, 'tempestade_laminas'], [11, 'danca_aurora']],
    equip: { weapon: 'sabre_leve', armor: 'tunica_viagem', accessory: null },
  },
  monge: {
    id: 'monge',
    job: 'Monge',
    role: 'Artes Marciais & Ki',
    sprite: 'aren_monge',
    desc: 'Lutador disciplinado que une força física e energia espiritual. Combina combos marciais, ondas de luz e autocura.',
    bio: 'Discípulo das antigas artes marciais de Aldenor. Canaliza a Marca do Sol nos próprios punhos para esmagar as criaturas sombrias.',
    base: { hp: 88, mp: 14, atk: 12, def: 9, mag: 8, res: 9, agi: 11, luck: 9 },
    growth: { hp: 13.5, mp: 2.8, atk: 2.3, def: 1.6, mag: 1.3, res: 1.5, agi: 1.6, luck: 0.9 },
    skills: [[1, 'punho_ferro'], [3, 'palma_solar'], [5, 'chakra'], [7, 'combo_monastico'], [9, 'onda_espiritual'], [11, 'punho_divino']],
    equip: { weapon: 'manopla_couro', armor: 'tunica_viagem', accessory: null },
  },
  mago: {
    id: 'mago',
    job: 'Mago',
    role: 'Magia da Aurora',
    sprite: 'aren_mago',
    desc: 'Estudioso das artes arcanas e da luz solar. Domina feitiços ofensivos de fogo e aurora, drenagem astral e barreiras.',
    bio: 'Mago aprendiz de Aldenor e filho de um cavaleiro caído. A Marca do Sol em sua mão desperta feitiços ancestrais da Aurora.',
    base: { hp: 66, mp: 26, atk: 6, def: 6, mag: 15, res: 11, agi: 10, luck: 8 },
    growth: { hp: 9.5, mp: 4.8, atk: 1.0, def: 1.1, mag: 2.6, res: 1.9, agi: 1.3, luck: 0.8 },
    skills: [[1, 'orbe_solar'], [3, 'labareda_astral'], [5, 'manto_solar'], [7, 'dreno_astral'], [9, 'aurora_ascendente'], [11, 'supernova']],
    equip: { weapon: 'cajado_aurora', armor: 'manto_peregrino', accessory: null },
  },
};

export const HEROES = {
  aren: {
    name: 'Aren',
    classId: 'guerreiro',
    job: HERO_CLASSES.guerreiro.job,
    sprite: HERO_CLASSES.guerreiro.sprite,
    bio: HERO_CLASSES.guerreiro.bio,
    base: { ...HERO_CLASSES.guerreiro.base },
    growth: { ...HERO_CLASSES.guerreiro.growth },
    skills: [...HERO_CLASSES.guerreiro.skills],
    equip: { ...HERO_CLASSES.guerreiro.equip },
  },
  selene: {
    name: 'Selene',
    job: 'Sacerdotisa',
    sprite: 'selene',
    bio: 'Aprendiz do Templo de Santa Liora. Gentil e determinada, cuida do sino do templo desde criança.',
    base: { hp: 64, mp: 22, atk: 7, def: 7, mag: 12, res: 11, agi: 8, luck: 10 },
    growth: { hp: 10, mp: 4, atk: 1.1, def: 1.2, mag: 2.2, res: 2.0, agi: 1.0, luck: 0.8 },
    skills: [[1, 'cura'], [1, 'luz'], [3, 'purificar'], [5, 'bencao'], [7, 'prece'], [9, 'reviver'], [11, 'julgamento'], [13, 'raio_solar']],
    equip: { weapon: 'cajado_freixo', armor: 'tunica_viagem', accessory: null },
  },
  kael: {
    name: 'Kael',
    job: 'Patrulheiro',
    sprite: 'kael',
    bio: 'Arqueiro errante que caçava a Rainha Aranha. Brincalhão, ágil e leal a quem salva sua pele.',
    base: { hp: 72, mp: 12, atk: 11, def: 7, mag: 6, res: 6, agi: 14, luck: 12 },
    growth: { hp: 11, mp: 2, atk: 2.1, def: 1.3, mag: 0.9, res: 1.0, agi: 2.0, luck: 1.2 },
    skills: [[1, 'golpe_duplo'], [1, 'roubar'], [5, 'flecha_veneno'], [7, 'olho_aguia'], [9, 'chuva_flechas'], [11, 'disparo_triplo']],
    equip: { weapon: 'faca_caca', armor: 'gibao_couro', accessory: null },
  },
  mirela: {
    name: 'Mirela',
    job: 'Maga',
    sprite: 'mirela',
    bio: 'Maga guardiã da Floresta Ancestral. Os aldeões a chamam de bruxa, mas ela estuda os Sinos da Aurora há anos.',
    base: { hp: 58, mp: 28, atk: 5, def: 6, mag: 15, res: 10, agi: 10, luck: 7 },
    growth: { hp: 9, mp: 5, atk: 0.8, def: 1.0, mag: 2.6, res: 1.8, agi: 1.2, luck: 0.7 },
    skills: [[1, 'chama_arcana'], [1, 'dreno_arcano'], [1, 'sono'], [7, 'furia_arcana'], [9, 'tempestade_fogo'], [11, 'confusao'], [13, 'meteoro_arcano']],
    equip: { weapon: 'varinha_carvalho', armor: 'manto_peregrino', accessory: null },
  },
};

export function applyHeroClass(classId = 'guerreiro') {
  const cls = HERO_CLASSES[classId] ?? HERO_CLASSES.guerreiro;
  Object.assign(HEROES.aren, {
    classId: cls.id,
    job: cls.job,
    sprite: cls.sprite,
    bio: cls.bio,
    base: { ...cls.base },
    growth: { ...cls.growth },
    skills: cls.skills.map(([lv, sk]) => [lv, sk]),
    equip: { ...cls.equip },
  });
  return cls;
}

export const MAX_LEVEL = 50;

export function expForLevel(level) {
  if (level <= 1) return 0;
  const n = level - 1;
  return Math.round(10 * Math.pow(n, 2.2) + 10 * n);
}
