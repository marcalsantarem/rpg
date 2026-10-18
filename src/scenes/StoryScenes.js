// Prólogo, Game Over e Fim de Capítulo.
import { W, H, COLORS } from '../config.js';
import { Controls } from '../core/Controls.js';
import { Audio } from '../core/Audio.js';
import { SaveSystem } from '../core/SaveSystem.js';
import { State, formatTime } from '../core/GameState.js';
import { Win, MenuList, makeText } from '../ui/UI.js';
import { wrapText, textWidth } from '../core/Font.js';
import { STORY } from '../data/story.js';

const wait = (scene, ms) => new Promise((r) => scene.time.delayedCall(ms, r));

function centered(scene, y, str, color, scale = 1) {
  const t = makeText(scene, Math.round((W - textWidth(str) * scale) / 2), y, str, color);
  t.setScale(scale);
  return t;
}

export class IntroScene extends Phaser.Scene {
  constructor() {
    super('Intro');
  }

  create() {
    this.controls = new Controls(this);
    this.fog = this.add.tileSprite(0, 0, W, H, 'fog').setOrigin(0).setTileScale(2.5, 1.5).setTint(0x601020).setAlpha(0.18);
    this.skip = false;
    makeText(this, W - textWidth('X: pular') - 6, H - 14, 'X: pular', COLORS.dim);
    Audio.play('title');
    this.run();
  }

  update() {
    this.controls.update();
    this.fog.tilePositionX += 0.2;
    this.fog.tilePositionY += 0.05;
    if (this.controls.pressed('cancel')) this.skip = true;
    if (this.waitOk && this.controls.pressed('ok')) {
      const r = this.waitOk;
      this.waitOk = null;
      r();
    }
  }

  okOr(ms) {
    return Promise.race([wait(this, ms), new Promise((r) => (this.waitOk = r))]);
  }

  async run() {
    for (const para of STORY.prologue) {
      if (this.skip) break;
      const lines = wrapText(para, 270);
      const y0 = Math.round(H / 2 - (lines.length * 13) / 2);
      const texts = lines.map((l, i) => centered(this, y0 + i * 13, l, 0xd8d0e0).setAlpha(0));
      this.tweens.add({ targets: texts, alpha: 1, duration: 900 });
      await wait(this, 900);
      if (!this.skip) await this.okOr(5200);
      this.waitOk = null;
      this.tweens.add({ targets: texts, alpha: 0, duration: 700 });
      await wait(this, 750);
      texts.forEach((t) => t.destroy());
    }
    // pesadelo
    Audio.stop(1.5);
    await wait(this, 600);
    this.cameras.main.flash(300, 160, 0, 0);
    Audio.sfx('heart');
    for (const l of STORY.nightmare) {
      const t = centered(this, 110, l, 0xc82828).setAlpha(0);
      Audio.sfx('whisper');
      this.tweens.add({ targets: t, alpha: 1, duration: 500, yoyo: true, hold: 700 });
      await wait(this, 1800);
      t.destroy();
    }
    Audio.sfx('bell');
    this.cameras.main.shake(700, 0.01);
    await wait(this, 300);
    Audio.sfx('scream');
    this.cameras.main.flash(500, 255, 255, 255);
    await wait(this, 700);
    this.cameras.main.fadeOut(900, 0, 0, 0);
    await wait(this, 1000);
    const g = State.g;
    this.scene.start('Map', { map: g.map.id, x: g.map.x, y: g.map.y, dir: g.map.dir, from: 'cabana' });
  }
}

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOver');
  }

  async create() {
    this.controls = new Controls(this);
    this.add.tileSprite(0, 0, W, H, 'fog').setOrigin(0).setTileScale(2.5, 1.5).setTint(0x500010).setAlpha(0.3);
    centered(this, 70, STORY.gameover[0], 0xc82828, 2);
    centered(this, 104, STORY.gameover[1], 0xa898b0);
    Audio.play('gameover', { restart: true });
    this.cameras.main.fadeIn(1200, 0, 0, 0);
    const has = await SaveSystem.any();
    const win = new Win(this, 100, 140, 120, 46);
    this.menu = new MenuList(this, win, {
      x: 24, y: 8, width: 92, rowH: 15,
      index: has ? 0 : 1,
      items: [
        { label: 'Carregar', enabled: has },
        { label: 'Tela título' },
      ],
      onSelect: (_it, i) => {
        if (i === 0) {
          this.menu.setActive(false);
          this.events.once('resume', () => this.menu.setActive(true));
          this.scene.launch('SaveLoad', { mode: 'load', parent: 'GameOver' });
          this.scene.pause();
        } else this.scene.start('Title');
      },
    });
  }

  update() {
    this.controls.update();
    if (this.menu) this.menu.update(this.controls);
  }
}

export class EndChapterScene extends Phaser.Scene {
  constructor() {
    super('EndChapter');
  }

  create() {
    this.controls = new Controls(this);
    this.add.tileSprite(0, 0, W, H, 'fog').setOrigin(0).setTileScale(2.5, 1.5).setTint(0x402030).setAlpha(0.2);
    Audio.play('ending', { restart: true });
    this.cameras.main.fadeIn(1500, 0, 0, 0);
    this.run();
  }

  update() {
    this.controls.update();
    if (this.menu) this.menu.update(this.controls);
    if (this.waitOk && this.controls.pressed('ok')) {
      const r = this.waitOk;
      this.waitOk = null;
      r();
    }
  }

  async run() {
    const lines = STORY.ending;
    let y = 30;
    const objs = [];
    for (let i = 0; i < lines.length; i++) {
      const l = lines[i];
      if (!l) {
        y += 8;
        continue;
      }
      const big = i === 0;
      const wrapped = big ? [l] : wrapText(l, 280);
      for (const w of wrapped) {
        const t = centered(this, y, w, big ? 0xc82828 : i === 1 ? 0xf8e078 : i === lines.length - 1 ? 0xb8a8c0 : 0xd8d0e0, big ? 2 : 1).setAlpha(0);
        objs.push(t);
        this.tweens.add({ targets: t, alpha: 1, duration: 900 });
        y += big ? 26 : 13;
        await wait(this, big ? 1200 : 700);
      }
    }
    await wait(this, 800);
    centered(this, 196, `Tempo de jogo: ${formatTime(State.g.playTime)}`, COLORS.gray);
    await wait(this, 600);
    const win = new Win(this, 90, 208, 140, 28);
    win.text(10, 7, 'Salvar progresso?', COLORS.white);
    const opt = new Win(this, 236, 196, 70, 40);
    this.menu = new MenuList(this, opt, {
      x: 22, y: 7, width: 44, rowH: 13,
      items: [{ label: 'Sim' }, { label: 'Não' }],
      onSelect: (_it, i) => {
        if (i === 0) {
          this.menu.setActive(false);
          this.events.once('resume', () => this.toTitle());
          this.scene.launch('SaveLoad', { mode: 'save', parent: 'EndChapter' });
          this.scene.pause();
        } else this.toTitle();
      },
    });
  }

  toTitle() {
    this.menu = null;
    this.cameras.main.fadeOut(1200, 0, 0, 0);
    this.time.delayedCall(1300, () => this.scene.start('Title'));
  }
}
