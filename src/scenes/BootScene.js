import { createPixelFont } from '../core/Font.js';
import { buildTileset } from '../art/tiles.js';
import { buildAllCharacters } from '../art/characters.js';
import { buildMonsters } from '../art/monsters.js';
import { buildMisc } from '../art/misc.js';
import { newGame, State, joinParty } from '../core/GameState.js';
import { MAPS } from '../data/maps/index.js';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  create() {
    createPixelFont(this, 'pix');
    buildTileset(this);
    buildAllCharacters(this);
    buildMonsters(this);
    buildMisc(this);
    const params = new URLSearchParams(location.search);
    if (params.has('art')) this.scene.start('ArtTest');
    else if (params.has('map') && MAPS[params.get('map')]) {
      // atalho de teste: ?map=id&x=&y=&party=selene,kael&flags=a,b
      newGame();
      for (const id of (params.get('party') || '').split(',').filter(Boolean)) joinParty(id);
      for (const f of (params.get('flags') || '').split(',').filter(Boolean)) State.g.flags[f] = true;
      const m = MAPS[params.get('map')];
      const warp = Object.values(MAPS).flatMap((x) => x.events ?? []).find((e) => e.type === 'warp' && e.to === m.id);
      this.scene.start('Map', {
        map: m.id,
        x: params.has('x') ? +params.get('x') : warp?.tx ?? 2,
        y: params.has('y') ? +params.get('y') : warp?.ty ?? 2,
        dir: warp?.dir ?? 'down',
      });
    } else this.scene.start('Title');
  }
}
