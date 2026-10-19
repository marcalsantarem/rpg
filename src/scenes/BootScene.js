import { createPixelFont } from '../core/Font.js';
import { buildMisc } from '../art/misc.js';
import { newGame, State, joinParty } from '../core/GameState.js';
import { MAPS } from '../data/maps/index.js';
import { ENEMIES } from '../data/enemies.js';
import { W, H } from '../config.js';
import { mzFiles, SPRITES, FACES, OBJECT_SHEETS } from '../data/mzAssets.js';
import { makeCanvas, addSheet, addTexture } from '../core/Pixel.js';

// Tamanho do quadro de uma folha de personagem do MZ ($ = folha de um só personagem)
export function charFrameSize(sheetName, img) {
  const single = /^[!]?\$/.test(sheetName);
  return single ? [img.width / 3, img.height / 4] : [img.width / 12, img.height / 8];
}

// Recorta o bloco de um personagem (3 quadros x 4 direções) reordenando para o padrão do jogo:
// quadro 0 = parado (coluna do meio no MZ), 1 e 2 = passos.
function buildCharSheet(scene, key, sheetName, index) {
  const img = scene.textures.get(`mz_characters_${sheetName}`).getSourceImage();
  const [fw, fh] = charFrameSize(sheetName, img);
  const single = /^[!]?\$/.test(sheetName);
  const bx = single ? 0 : (index % 4) * fw * 3;
  const by = single ? 0 : Math.floor(index / 4) * fh * 4;
  const { canvas, ctx } = makeCanvas(fw * 3, fh * 4);
  const order = [1, 0, 2];
  for (let dir = 0; dir < 4; dir++)
    for (let f = 0; f < 3; f++) ctx.drawImage(img, bx + order[f] * fw, by + dir * fh, fw, fh, f * fw, dir * fh, fw, fh);
  addSheet(scene, key, canvas, fw, fh);
}

export class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  preload() {
    const g = this.add.graphics();
    this.load.on('progress', (p) => {
      g.clear();
      g.fillStyle(0x2a2440).fillRect(W / 2 - 200, H / 2 - 6, 400, 12);
      g.fillStyle(0xe8c050).fillRect(W / 2 - 198, H / 2 - 4, 396 * p, 8);
    });
    const enemyArt = Object.values(ENEMIES).map((e) => e.mz).filter(Boolean);
    for (const f of mzFiles(enemyArt)) {
      if (f.dir === 'sv_actors') this.load.spritesheet(f.key, f.path, { frameWidth: 64, frameHeight: 64 });
      else this.load.image(f.key, f.path);
    }
  }

  create() {
    createPixelFont(this, 'pix');
    buildMisc(this);
    this.buildMzTextures();
    this.scene.launch('Hud');
    const params = new URLSearchParams(location.search);
    if (params.has('map') && MAPS[params.get('map')]) {
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

  buildMzTextures() {
    // personagens de campo
    for (const [id, [sheet, index]] of Object.entries(SPRITES)) buildCharSheet(this, `chr_${id}`, sheet, index);
    // rostos 144x144
    for (const [id, [sheet, index]] of Object.entries(FACES)) {
      const img = this.textures.get(`mz_faces_${sheet}`).getSourceImage();
      const { canvas, ctx } = makeCanvas(144, 144);
      ctx.drawImage(img, (index % 4) * 144, Math.floor(index / 4) * 144, 144, 144, 0, 0, 144, 144);
      addTexture(this, `face_${id}`, canvas);
    }
    // baú: quadro 0 fechado, 1 aberto
    {
      const [sheet, index] = OBJECT_SHEETS.chest;
      const img = this.textures.get(`mz_characters_${sheet}`).getSourceImage();
      const [fw, fh] = charFrameSize(sheet, img);
      const bx = (index % 4) * fw * 3;
      const by = Math.floor(index / 4) * fh * 4;
      const { canvas, ctx } = makeCanvas(fw * 2, fh);
      ctx.drawImage(img, bx, by, fw, fh, 0, 0, fw, fh);
      ctx.drawImage(img, bx, by + fh * 3, fw, fh, fw, 0, fw, fh);
      addSheet(this, 'chest', canvas, fw, fh);
    }
    // cristal de salvamento: 6 quadros animados
    {
      const [sheet, index] = OBJECT_SHEETS.save;
      const img = this.textures.get(`mz_characters_${sheet}`).getSourceImage();
      const [fw, fh] = charFrameSize(sheet, img);
      const bx = (index % 4) * fw * 3;
      const by = Math.floor(index / 4) * fh * 4;
      const { canvas, ctx } = makeCanvas(fw * 6, fh);
      for (let i = 0; i < 6; i++) ctx.drawImage(img, bx + (i % 3) * fw, by + Math.floor(i / 3) * fh, fw, fh, i * fw, 0, fw, fh);
      addSheet(this, 'altar', canvas, fw, fh);
    }
  }
}
