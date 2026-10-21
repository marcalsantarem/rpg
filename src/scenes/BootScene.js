import { createPixelFont } from '../core/Font.js';
import { buildTileset } from '../art/tiles.js';
import { buildAllCharacters, CHARACTERS } from '../art/characters.js';
import { buildMonsters } from '../art/monsters.js';
import { buildMisc } from '../art/misc.js';
import { newGame, State, joinParty } from '../core/GameState.js';
import { MAPS } from '../data/maps/index.js';
import { TILE } from '../config.js';
import { makeCanvas, addSheet, addTexture } from '../core/Pixel.js';

// Amplia uma textura em pixel art (vizinho mais próximo) e registra como spritesheet
function upscaleSheet(scene, src, dst, k, fw, fh) {
  const img = scene.textures.get(src).getSourceImage();
  const { canvas, ctx } = makeCanvas(img.width * k, img.height * k);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(img, 0, 0, img.width * k, img.height * k);
  addSheet(scene, dst, canvas, fw, fh);
}

// Retrato 16x16: cabeça e ombros do quadro "parado, de frente" do personagem
function buildFace(scene, id) {
  const img = scene.textures.get(`chr_${id}`).getSourceImage();
  const { canvas, ctx } = makeCanvas(16, 16);
  ctx.drawImage(img, 0, 2, 16, 16, 0, 0, 16, 16);
  addTexture(scene, `face_${id}`, canvas);
}

export class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  create() {
    createPixelFont(this, 'pix');
    buildTileset(this);
    upscaleSheet(this, 'tiles', 'tiles48', TILE / 16, TILE, TILE);
    buildAllCharacters(this);
    for (const id of Object.keys(CHARACTERS)) buildFace(this, id);
    buildMonsters(this);
    buildMisc(this);
    this.scene.launch('Hud');
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
