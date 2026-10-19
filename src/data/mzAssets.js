// Mapeamento dos gráficos do RPG Maker MZ (assets/mz) para os elementos do jogo.
export const MZ_ROOT = 'assets/mz';

// Personagens de campo: [folha em img/characters, índice 0-7 (linha*4 + coluna)]
export const SPRITES = {
  aren: ['Actor1', 0],
  selene: ['Actor1', 7],
  kael: ['Actor2', 6],
  mirela: ['Actor1', 5],
  elder: ['People2', 0],
  villager: ['People1', 4],
  woman: ['People1', 3],
  innkeeper: ['People1', 5],
  merchant: ['People4', 5],
  smith: ['People4', 4],
  guard: ['Actor3', 6],
  child: ['People1', 2],
  lia: ['People1', 1],
  oldwoman: ['People1', 7],
  bard: ['People3', 5],
  priest: ['People3', 4],
  stranger: ['Evil', 7],
  cat: ['Nature', 1],
  fairy: ['Nature', 5],
};

// Battlers laterais (img/sv_actors) e rostos (img/faces: [folha, índice])
export const BATTLERS = { aren: 'Actor1_1', selene: 'Actor1_8', kael: 'Actor2_7', mirela: 'Actor1_6' };
export const FACES = { aren: ['Actor1', 0], selene: ['Actor1', 7], kael: ['Actor2', 6], mirela: ['Actor1', 5] };

// Objetos de evento desenhados com folhas "!" do MZ
export const OBJECT_SHEETS = {
  chest: ['!Chest', 4],
  save: ['!Crystal', 3],
  door: ['!Door1', 0],
  doorTemple: ['!Door1', 2],
};

// Motions dos battlers (Sprite_Actor.MOTIONS do MZ)
export const MOTIONS = {
  walk: 0, wait: 1, chant: 2, guard: 3, damage: 4, evade: 5, thrust: 6, swing: 7, missile: 8,
  skill: 9, spell: 10, item: 11, escape: 12, victory: 13, dying: 14, abnormal: 15, sleep: 16, dead: 17,
};

// Fundos de batalha: chave do jogo -> [battlebacks1, battlebacks2]
export const BATTLEBACKS = {
  bg_forest: ['Grassland', 'Forest'],
  bg_cave: ['Crystal', 'Crystal'],
  bg_web: ['RockCave', 'RockCave'],
  bg_deadforest: ['GrassMaze', 'GrassMaze'],
  bg_grove: ['PoisonSwamp', 'PoisonSwamp'],
};

// Conjuntos de tiles por tipo de mapa
export const TILESET_GROUPS = {
  outside: { A1: 'Outside_A1', A2: 'Outside_A2', A3: 'Outside_A3', A4: 'Outside_A4', A5: 'Outside_A5', B: 'Outside_B', C: 'Outside_C' },
  inside: { A1: 'Inside_A1', A2: 'Inside_A2', A4: 'Inside_A4', A5: 'Inside_A5', B: 'Inside_B', C: 'Inside_C' },
  dungeon: { A1: 'Dungeon_A1', A2: 'Dungeon_A2', A4: 'Dungeon_A4', A5: 'Dungeon_A5', B: 'Dungeon_B', C: 'Dungeon_C' },
};

export const TITLE_IMAGE = 'Night';

// Lista de arquivos a carregar (usada pelo BootScene e pelo validador)
export function mzFiles(enemyArt) {
  const files = [];
  const seen = new Set();
  const add = (dir, name) => {
    const key = `mz_${dir}_${name}`;
    if (seen.has(key)) return;
    seen.add(key);
    files.push({ key, path: `${MZ_ROOT}/${dir}/${encodeURIComponent(name)}.png`, dir, name });
  };
  const sheets = new Set([...Object.values(SPRITES).map((s) => s[0]), ...Object.values(OBJECT_SHEETS).map((s) => s[0])]);
  sheets.forEach((s) => add('characters', s));
  Object.values(BATTLERS).forEach((b) => add('sv_actors', b));
  new Set(Object.values(FACES).map((f) => f[0])).forEach((f) => add('faces', f));
  new Set(enemyArt).forEach((e) => add('enemies', e));
  Object.values(BATTLEBACKS).forEach(([a, b]) => {
    add('battlebacks1', a);
    add('battlebacks2', b);
  });
  new Set(Object.values(TILESET_GROUPS).flatMap((g) => Object.values(g))).forEach((t) => add('tilesets', t));
  ['Window', 'IconSet', 'Shadow1'].forEach((s) => add('system', s));
  add('titles1', TITLE_IMAGE);
  return files;
}
