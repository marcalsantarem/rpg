// Prólogo, Game Over e Fim de Capítulo.
import { UW, UH, COLORS } from '../config.js';
import { Controls } from '../core/Controls.js';
import { Audio } from '../core/Audio.js';
import { SaveSystem } from '../core/SaveSystem.js';
import { State, formatTime } from '../core/GameState.js';
import { Win, MenuList, makeText, uiCamera } from '../ui/UI.js';
import { wrapText, textWidth } from '../core/Font.js';
import { STORY } from '../data/story.js';

const wait = (scene, ms) => new Promise((r) => scene.time.delayedCall(ms, r));

function centered(scene, y, str, color, scale = 1) {
  const size = Math.round(9 * scale);
  return makeText(scene, Math.round((UW - textWidth(str, size)) / 2), y, str, color, size);
}

export class IntroScene extends Phaser.Scene {
  constructor() {
    super('Intro');
  }

  create() {
    this.controls = new Controls(this);
    uiCamera(this);
    this.fog = this.add.tileSprite(0, 0, UW, UH, 'fog').setOrigin(0).setTileScale(2.5, 1.5).setTint(0x403070).setAlpha(0.18);
    this.skip = false;
    this.waitOk = null;
    makeText(this, UW - textWidth('X: pular') - 6, UH - 14, 'X: pular', COLORS.dim);
    Audio.play('title');
    this.run();
  }

  update() {
    this.controls.update();
    this.fog.tilePositionX += 0.2;
    this.fog.tilePositionY += 0.05;
    if (this.controls.pressed('cancel')) this.skip = true;
    if (this.waitOk && (this.controls.pressed('ok') || this.skip)) {
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
      const lines = wrapText(para, 300);
      const y0 = Math.round(UH / 2 - (lines.length * 13) / 2);
      const texts = lines.map((l, i) => centered(this, y0 + i * 13, l, 0xd8d0e0).setAlpha(0));
      this.tweens.add({ targets: texts, alpha: 1, duration: 900 });
      if (!this.skip) await this.okOr(900);
      if (!this.skip) await this.okOr(5200);
      this.waitOk = null;
      this.tweens.add({ targets: texts, alpha: 0, duration: 700 });
      await wait(this, 750);
      texts.forEach((t) => t.destroy());
    }
    if (this.skip) {
      Audio.stop(0.5);
      this.cameras.main.fadeOut(500, 0, 0, 0);
      await wait(this, 550);
      const g0 = State.g;
      this.scene.start('Map', { map: g0.map.id, x: g0.map.x, y: g0.map.y, dir: g0.map.dir, from: 'cabana' });
      return;
    }
    // sonho
    Audio.stop(1.5);
    await wait(this, 600);
    this.cameras.main.flash(300, 255, 220, 140);
    for (const l of STORY.dream) {
      const t = centered(this, 96, l, 0xf0d070).setAlpha(0);
      Audio.sfx('light');
      this.tweens.add({ targets: t, alpha: 1, duration: 500, yoyo: true, hold: 700 });
      await wait(this, 1800);
      t.destroy();
    }
    Audio.sfx('bell');
    await wait(this, 300);
    this.cameras.main.flash(600, 255, 240, 200);
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
    uiCamera(this);
    this.menu = null;
    this.add.tileSprite(0, 0, UW, UH, 'fog').setOrigin(0).setTileScale(2.5, 1.5).setTint(0x302050).setAlpha(0.3);
    centered(this, 56, STORY.gameover[0], 0xe0b050, 2);
    centered(this, 90, STORY.gameover[1], 0xa898b0);
    Audio.play('gameover', { restart: true });
    this.cameras.main.fadeIn(1200, 0, 0, 0);
    const has = await SaveSystem.any();
    const win = new Win(this, Math.round(UW / 2 - 60), 120, 120, 44);
    this.menu = new MenuList(this, win, {
      x: 14, y: 8, width: 100, rowH: 14,
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
    uiCamera(this);
    this.menu = null;
    this.waitOk = null;
    this.add.tileSprite(0, 0, UW, UH, 'fog').setOrigin(0).setTileScale(2.5, 1.5).setTint(0x402030).setAlpha(0.2);
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
    let y = 18;
    const objs = [];
    for (let i = 0; i < lines.length; i++) {
      const l = lines[i];
      if (!l) {
        y += 8;
        continue;
      }
      const big = i === 0;
      const wrapped = big ? [l] : wrapText(l, 320);
      for (const w of wrapped) {
        const t = centered(this, y, w, big ? 0xf0c050 : i === 1 ? 0xf8e078 : i === lines.length - 1 ? 0xb8a8c0 : 0xd8d0e0, big ? 2 : 1).setAlpha(0);
        objs.push(t);
        this.tweens.add({ targets: t, alpha: 1, duration: 900 });
        y += big ? 26 : 13;
        await wait(this, big ? 1200 : 700);
      }
    }
    await wait(this, 800);
    centered(this, 160, `Tempo de jogo: ${formatTime(State.g.playTime)}`, COLORS.gray);
    await wait(this, 600);
    const win = new Win(this, Math.round(UW / 2 - 100), 176, 140, 26);
    win.text(10, 7, 'Salvar progresso?', COLORS.white);
    const opt = new Win(this, Math.round(UW / 2 + 44), 168, 70, 38);
    this.menu = new MenuList(this, opt, {
      x: 12, y: 6, width: 52, rowH: 13,
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
