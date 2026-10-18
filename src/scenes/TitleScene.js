// Tela inicial com cenário noturno animado.
import { W, H, COLORS } from '../config.js';
import { Controls } from '../core/Controls.js';
import { Audio } from '../core/Audio.js';
import { Settings } from '../core/Settings.js';
import { SaveSystem } from '../core/SaveSystem.js';
import { newGame } from '../core/GameState.js';
import { Win, MenuList, makeText } from '../ui/UI.js';
import { textWidth } from '../core/Font.js';
import { makeCanvas, rng, px, rect, disc, poly, thick, mix, addTexture } from '../core/Pixel.js';
import { STORY } from '../data/story.js';

function buildTitleArt(scene) {
  if (scene.textures.exists('title_bg')) return;
  const { canvas, ctx } = makeCanvas(W, H);
  const r = rng(13);
  for (let y = 0; y < H; y++) rect(ctx, 0, y, W, 1, mix('#04020a', '#3a0c16', Math.floor((y / 190) * 10) / 10));
  for (let i = 0; i < 90; i++) px(ctx, Math.floor(r() * W), Math.floor(r() * 130), r() < 0.3 ? '#a8a0b8' : '#5a5068');
  // lua vermelha
  disc(ctx, 258, 112, 40, '#3a0c12');
  disc(ctx, 258, 112, 36, '#5a1418');
  disc(ctx, 258, 112, 32, '#b02a28');
  disc(ctx, 252, 106, 26, '#c8403a');
  for (const [x, y, rr] of [[270, 118, 5], [246, 124, 3], [262, 98, 3], [244, 104, 2]]) disc(ctx, x, y, rr, '#962220');
  // colinas
  const hill = (base, amp, color, f) => {
    for (let x = 0; x < W; x++) {
      const h = base - Math.round(Math.sin(x * f) * amp + Math.sin(x * f * 2.7) * amp * 0.4);
      rect(ctx, x, h, 1, H - h, color);
    }
  };
  hill(170, 10, '#1a0a12', 0.02);
  // capela com torre do sino
  const C = '#0a0508';
  rect(ctx, 40, 120, 60, 70, C);
  poly(ctx, [[34, 122], [70, 92], [106, 122]], C);
  rect(ctx, 56, 52, 22, 70, C);
  poly(ctx, [[52, 54], [67, 24], [82, 54]], C);
  rect(ctx, 66, 14, 2, 12, C);
  rect(ctx, 62, 18, 10, 2, C);
  rect(ctx, 61, 62, 12, 14, '#2a0a10');
  poly(ctx, [[63, 66], [67, 63], [71, 66], [72, 74], [62, 74]], '#0a0508');
  rect(ctx, 66, 74, 2, 2, '#0a0508');
  rect(ctx, 80, 140, 6, 10, '#e0a040');
  rect(ctx, 50, 140, 6, 10, '#7a3a20');
  hill(196, 6, '#0c060a', 0.035);
  // árvores mortas
  for (const [x, h] of [[150, 70], [290, 90], [310, 60], [180, 46]]) {
    thick(ctx, x, 200, x + 2, 200 - h, 2, C);
    for (let b = 0; b < 4; b++) {
      const by = 200 - h * (0.45 + b * 0.14);
      const dir = b % 2 ? 1 : -1;
      thick(ctx, x + 1, by, x + dir * (10 + r() * 14), by - 8 - r() * 10, 1, C);
    }
  }
  // lápides e cruzes
  for (let i = 0; i < 9; i++) {
    const x = 110 + i * 22 + Math.floor(r() * 8);
    const y = 206 + Math.floor(r() * 10);
    if (i % 3 === 0) {
      rect(ctx, x + 3, y - 14, 2, 14, C);
      rect(ctx, x, y - 10, 8, 2, C);
    } else {
      rect(ctx, x, y - 10, 8, 10, C);
      disc(ctx, x + 4, y - 10, 4, C);
    }
  }
  rect(ctx, 0, 218, W, 22, '#050306');
  addTexture(scene, 'title_bg', canvas);
}

export class TitleScene extends Phaser.Scene {
  constructor() {
    super('Title');
  }

  async create() {
    this.controls = new Controls(this);
    this.leaving = false;
    this.options = null;
    this.menu = null;
    buildTitleArt(this);
    this.add.image(0, 0, 'title_bg').setOrigin(0);
    this.fog1 = this.add.tileSprite(0, 150, W, 90, 'fog').setOrigin(0).setTint(0x804050).setAlpha(0.35);
    this.fog2 = this.add.tileSprite(0, 170, W, 70, 'fog').setOrigin(0).setTint(0xa08090).setAlpha(0.25);

    // morcegos
    this.bats = [];
    for (let i = 0; i < 4; i++) {
      const b = this.add.image(-40, 40 + i * 18, 'mon_bat').setScale(0.35).setTint(0x000000);
      b.speed = 0.25 + Math.random() * 0.35;
      b.phase = Math.random() * 6;
      b.x = Math.random() * W;
      this.bats.push(b);
    }

    // título
    const title = STORY.title;
    const tw = textWidth(title) * 3;
    const tx = Math.round((W - tw) / 2);
    for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1], [2, 3]]) makeText(this, tx + dx, 28 + dy, title, 0x000000).setScale(3);
    this.titleText = makeText(this, tx, 28, title, 0xe83a3a).setScale(3);
    const st = STORY.subtitle;
    makeText(this, Math.round((W - textWidth(st)) / 2), 66, st, 0xb8a8c0);
    makeText(this, 4, H - 13, 'v0.1', COLORS.dim);
    makeText(this, W - textWidth('Z: confirmar  X: voltar') - 4, H - 13, 'Z: confirmar  X: voltar', COLORS.dim);

    this.flash = this.add.rectangle(0, 0, W, H, 0xffffff).setOrigin(0).setAlpha(0).setDepth(50000);
    this.nextFlash = this.time.now + 6000;

    Audio.play('title');
    this.cameras.main.fadeIn(800, 0, 0, 0);

    const hasSave = await SaveSystem.any();
    const desktop = !!window.desktop;
    const win = new Win(this, 112, 128, 96, 74);
    this.menu = new MenuList(this, win, {
      x: 24, y: 9, width: 70, rowH: 14,
      index: hasSave ? 1 : 0,
      items: [
        { label: 'Novo Jogo', v: 'new' },
        { label: 'Continuar', v: 'load', enabled: hasSave },
        { label: 'Opções', v: 'options' },
        { label: 'Sair', v: 'quit', enabled: desktop },
      ],
      onSelect: (it) => this.select(it.v),
    });
  }

  update(time) {
    this.controls.update();
    if (this.fog1) {
      this.fog1.tilePositionX += 0.15;
      this.fog2.tilePositionX -= 0.1;
    }
    for (const b of this.bats ?? []) {
      b.x += b.speed;
      b.y += Math.sin(time / 300 + b.phase) * 0.3;
      if (b.x > W + 20) b.x = -20;
    }
    if (this.titleText) this.titleText.setAlpha(0.85 + Math.sin(time / 400) * 0.15);
    if (time > this.nextFlash) {
      this.nextFlash = time + 9000 + Math.random() * 9000;
      this.tweens.add({ targets: this.flash, alpha: { from: 0.5, to: 0 }, duration: 350 });
      if (Math.random() < 0.6) this.time.delayedCall(300, () => Audio.sfx('bell'));
    }
    if (this.options) this.options.update(this.controls);
    else if (this.menu && !this.leaving) this.menu.update(this.controls);
  }

  select(v) {
    if (v === 'new') {
      this.leaving = true;
      Audio.stop(1);
      this.cameras.main.fadeOut(900, 0, 0, 0);
      this.time.delayedCall(950, () => {
        newGame();
        this.scene.start('Intro');
      });
    } else if (v === 'load') {
      this.events.once('resume', () => this.menu.setActive(true));
      this.menu.setActive(false);
      this.scene.launch('SaveLoad', { mode: 'load', parent: 'Title' });
      this.scene.pause();
    } else if (v === 'options') this.openOptions();
    else if (v === 'quit' && window.desktop) window.desktop.quit();
  }

  openOptions() {
    this.menu.setActive(false);
    const win = new Win(this, 50, 110, 220, 100, { depth: 12000 });
    win.text(14, 8, 'Opções', COLORS.yellow);
    const speeds = ['', 'Lenta', 'Normal', 'Rápida', 'Instant.'];
    const rows = [
      { label: 'Música', get: () => `${Math.round(Settings.music * 10)}`, adj: (d) => (Settings.music = Math.max(0, Math.min(1, Math.round((Settings.music + d * 0.1) * 10) / 10))) },
      { label: 'Efeitos', get: () => `${Math.round(Settings.sfx * 10)}`, adj: (d) => (Settings.sfx = Math.max(0, Math.min(1, Math.round((Settings.sfx + d * 0.1) * 10) / 10))) },
      { label: 'Texto', get: () => speeds[Settings.textSpeed], adj: (d) => (Settings.textSpeed = Math.max(1, Math.min(4, Settings.textSpeed + d))) },
    ];
    const items = () => rows.map((r) => ({ label: r.label, right: `< ${r.get()} >` }));
    const list = new MenuList(this, win, {
      x: 34, y: 28, width: 180, rowH: 16, items: items(),
      onSelect: () => {},
      onCancel: () => {
        Settings.save();
        list.destroy();
        win.destroy();
        this.options = null;
        this.menu.setActive(true);
      },
    });
    win.text(14, 80, 'Setas: ajustar   X: voltar', COLORS.dim);
    this.options = {
      update: (c) => {
        const d = c.repeat('left') ? -1 : c.repeat('right') ? 1 : 0;
        if (d) {
          rows[list.index].adj(d);
          Audio.setVolumes();
          Audio.sfx('cursor');
          list.setItems(items());
        }
        list.update(c);
      },
    };
  }
}
