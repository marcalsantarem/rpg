// Cena de depuração para revisar a arte gerada (abrir com ?art=1).
import { makeText, Win } from '../ui/UI.js';
import { TILE_NAMES } from '../art/tiles.js';
import { CHARACTERS } from '../art/characters.js';
import { MONSTER_ART } from '../art/monsters.js';

export class ArtTestScene extends Phaser.Scene {
  constructor() {
    super('ArtTest');
  }

  create() {
    this.page = 0;
    this.pages = [() => this.tiles(), () => this.chars(), () => this.monsters(), () => this.bgs(), () => this.text()];
    this.render();
    this.input.keyboard.on('keydown-RIGHT', () => {
      this.page = (this.page + 1) % this.pages.length;
      this.render();
    });
    this.input.keyboard.on('keydown-LEFT', () => {
      this.page = (this.page + this.pages.length - 1) % this.pages.length;
      this.render();
    });
  }

  render() {
    this.children.removeAll(true);
    this.cameras.main.setBackgroundColor('#303040');
    this.pages[this.page]();
  }

  tiles() {
    TILE_NAMES.forEach((_n, i) => {
      this.add.image(4 + (i % 18) * 17, 4 + Math.floor(i / 18) * 17, 'tiles', i).setOrigin(0);
    });
  }

  chars() {
    const ids = [...Object.keys(CHARACTERS), 'cat'];
    ids.forEach((id, i) => {
      const x = 4 + (i % 6) * 52;
      const y = 4 + Math.floor(i / 6) * 76;
      for (let d = 0; d < 4; d++) for (let f = 0; f < 3; f++) {
        if (d > 1 && f > 0) continue;
        this.add.image(x + f * 16 + (d > 1 ? (d - 2) * 16 + 0 : 0), y + (d > 1 ? 48 : d * 24), `chr_${id}`, d * 3 + f).setOrigin(0);
      }
      makeText(this, x, y + 64, id);
    });
  }

  monsters() {
    let x = 4;
    let y = 4;
    let rowH = 0;
    for (const id of Object.keys(MONSTER_ART)) {
      const tex = this.textures.get(`mon_${id}`).getSourceImage();
      if (x + tex.width > 316) {
        x = 4;
        y += rowH + 12;
        rowH = 0;
      }
      this.add.image(x, y, `mon_${id}`).setOrigin(0);
      makeText(this, x, y + tex.height, id);
      x += tex.width + 6;
      rowH = Math.max(rowH, tex.height);
    }
  }

  bgs() {
    this.add.image(0, 0, 'bg_forest').setOrigin(0).setScale(0.5);
    this.add.image(160, 0, 'bg_deadforest').setOrigin(0).setScale(0.5);
    this.add.image(0, 80, 'bg_cave').setOrigin(0).setScale(0.5);
    this.add.image(160, 80, 'bg_web').setOrigin(0).setScale(0.5);
    this.add.image(0, 160, 'bg_grove').setOrigin(0).setScale(0.5);
  }

  text() {
    const w = new Win(this, 8, 8, 304, 120);
    w.text(10, 10, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789');
    w.text(10, 24, 'abcdefghijklmnopqrstuvwxyz .,!?:;-+/()');
    w.text(10, 38, 'áàâãéêíóôõúç ÁÀÂÃÉÊÍÓÔÕÚÇ "%*=<>_');
    w.text(10, 52, 'Coração, ação, mãe, pássaro, último, já.', 0xf8e078);
    w.text(10, 66, 'Os sinos de ossos estão rachando...', 0xf05858);
    w.text(10, 80, 'Pá Enferrujada   HP 120/120  MP 8/8', 0x90b8ff);
    this.add.image(40, 140, 'cursor').setOrigin(0);
    this.add.image(60, 140, 'chest', 0).setOrigin(0);
    this.add.image(80, 140, 'chest', 1).setOrigin(0);
    this.add.image(100, 132, 'altar', 0).setOrigin(0);
    this.add.image(120, 132, 'altar', 1).setOrigin(0);
    this.add.image(140, 140, 'obj_fragment').setOrigin(0);
    this.add.image(160, 140, 'obj_doll').setOrigin(0);
    this.add.image(180, 128, 'obj_shade').setOrigin(0);
    this.add.image(200, 140, 'obj_cocoon').setOrigin(0);
    this.add.image(220, 120, 'light').setOrigin(0).setScale(0.5);
    this.add.image(0, 180, 'fog').setOrigin(0).setScale(0.5);
  }
}
