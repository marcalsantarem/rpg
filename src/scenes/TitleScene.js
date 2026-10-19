// Tela inicial com cenário noturno animado.
import { W, H, UW, UH, COLORS } from '../config.js';
import { Controls } from '../core/Controls.js';
import { Audio } from '../core/Audio.js';
import { Settings } from '../core/Settings.js';
import { SaveSystem } from '../core/SaveSystem.js';
import { newGame } from '../core/GameState.js';
import { Win, MenuList, makeText, uiCamera } from '../ui/UI.js';
import { textWidth } from '../core/Font.js';
import { makeCanvas, rng, px, rect, disc, poly, thick, mix, addTexture } from '../core/Pixel.js';
import { STORY } from '../data/story.js';
import { TITLE_IMAGE } from '../data/mzAssets.js';

function buildTitleArt(scene) {
  if (scene.textures.exists('title_bg')) return;
  const { canvas, ctx } = makeCanvas(W, H);
  const r = rng(13);
  for (let y = 0; y < H; y++) rect(ctx, 0, y, W, 1, mix('#0a0c24', '#4a3a6a', Math.floor((y / 200) * 10) / 10));
  for (let i = 0; i < 110; i++) px(ctx, Math.floor(r() * W), Math.floor(r() * 140), r() < 0.3 ? '#f0f0ff' : '#8a88b8');
  // lua prateada
  disc(ctx, 272, 112, 26, '#3a3a6a');
  disc(ctx, 272, 112, 22, '#c8c8e0');
  disc(ctx, 268, 108, 18, '#e8e8f8');
  for (const [x, y, rr] of [[280, 116, 3], [264, 120, 2], [276, 102, 2]]) disc(ctx, x, y, rr, '#b8b8d4');
  // montanhas
  poly(ctx, [[0, 170], [40, 120], [80, 150], [130, 100], [190, 160], [240, 118], [290, 150], [320, 128], [320, 240], [0, 240]], '#2a2448');
  poly(ctx, [[130, 100], [118, 114], [138, 112]], '#d8d8f0');
  poly(ctx, [[240, 118], [230, 128], [248, 127]], '#d8d8f0');
  // colinas
  const hill = (base, amp, color, f) => {
    for (let x = 0; x < W; x++) {
      const h = base - Math.round(Math.sin(x * f) * amp + Math.sin(x * f * 2.7) * amp * 0.4);
      rect(ctx, x, h, 1, H - h, color);
    }
  };
  hill(176, 8, '#1c1834', 0.02);
  // castelo com torre do sino
  const C = '#120e22';
  rect(ctx, 30, 120, 80, 70, C);
  for (let x = 30; x < 110; x += 8) rect(ctx, x, 116, 5, 4, C);
  rect(ctx, 22, 96, 18, 94, C);
  rect(ctx, 100, 100, 18, 90, C);
  poly(ctx, [[19, 98], [31, 76], [43, 98]], C);
  poly(ctx, [[97, 102], [109, 82], [121, 102]], C);
  rect(ctx, 58, 64, 24, 60, C);
  poly(ctx, [[54, 66], [70, 30], [86, 66]], C);
  rect(ctx, 69, 22, 2, 10, C);
  // sino de cristal brilhando na torre
  rect(ctx, 63, 74, 14, 16, '#2a2050');
  disc(ctx, 70, 82, 7, 'rgba(255,230,150,0.25)');
  poly(ctx, [[66, 86], [68, 77], [72, 77], [74, 86]], '#f8e8a0');
  poly(ctx, [[68, 86], [69, 78], [70, 78], [70, 86]], '#fffbe0');
  // janelas acesas
  for (const [x, y] of [[29, 110], [107, 114], [44, 140], [56, 140], [84, 140], [96, 140], [29, 140], [107, 150]]) {
    rect(ctx, x, y, 3, 5, '#f0c060');
    px(ctx, x, y, '#f8e8a8');
  }
  hill(200, 5, '#14102a', 0.035);
  // árvores
  for (const [x, h] of [[150, 40], [170, 52], [195, 38], [290, 50], [312, 36]]) {
    poly(ctx, [[x, 204 - h], [x - 9, 206], [x + 9, 206]], '#0e1426');
    poly(ctx, [[x, 204 - h - 10], [x - 6, 206 - h * 0.4], [x + 6, 206 - h * 0.4]], '#0e1426');
  }
  // casinhas da vila com janelas
  for (const x of [210, 236, 262]) {
    rect(ctx, x, 196, 18, 14, '#120e22');
    poly(ctx, [[x - 2, 197], [x + 9, 188], [x + 20, 197]], '#120e22');
    rect(ctx, x + 7, 201, 4, 4, '#f0c060');
  }
  rect(ctx, 0, 218, W, 22, '#0a0818');
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
    uiCamera(this);
    this.scene.stop('Hud');
    this.scene.launch('Hud');
    // ilustração de título do MZ cobrindo a tela
    const bgKey = `mz_titles1_${TITLE_IMAGE}`;
    if (this.textures.exists(bgKey)) {
      const img = this.textures.get(bgKey).getSourceImage();
      const sc = Math.max(W / img.width, H / img.height) / 3;
      this.add.image(UW / 2, UH / 2, bgKey).setScale(sc);
      this.add.rectangle(0, 0, UW, UH, 0x080418, 0.25).setOrigin(0);
    } else {
      buildTitleArt(this);
      this.add.image(0, 0, 'title_bg').setOrigin(0);
    }
    this.fog1 = this.add.tileSprite(0, UH - 80, UW, 80, 'fog').setOrigin(0).setTint(0x8070c0).setAlpha(0.25);
    this.fog2 = this.add.tileSprite(0, UH - 60, UW, 60, 'fog').setOrigin(0).setTint(0xb0a8e0).setAlpha(0.18);

    // morcegos
    this.bats = [];
    for (let i = 0; i < 4; i++) {
      const b = this.add.image(-40, 30 + i * 22, 'chr_fairy', 0).setScale(0.28).setAlpha(0.85);
      b.speed = 0.15 + Math.random() * 0.25;
      b.phase = Math.random() * 6;
      b.x = Math.random() * UW;
      this.bats.push(b);
    }

    // título
    const title = STORY.title;
    const tw = textWidth(title, 28);
    const tx = Math.round((UW - tw) / 2);
    makeText(this, tx + 2, 30, title, 0x000000, 28).setAlpha(0.6);
    this.titleText = makeText(this, tx, 28, title, 0xf0c850, 28);
    const st = STORY.subtitle;
    makeText(this, Math.round((UW - textWidth(st)) / 2), 66, st, 0xe0d8f0);
    makeText(this, 4, UH - 13, 'v0.2', COLORS.dim);
    makeText(this, UW - textWidth('Z: confirmar  X: voltar') - 4, UH - 13, 'Z: confirmar  X: voltar', COLORS.dim);

    this.flash = this.add.rectangle(0, 0, UW, UH, 0xffffff).setOrigin(0).setAlpha(0).setDepth(50000);
    this.nextFlash = this.time.now + 6000;

    Audio.play('title');
    this.cameras.main.fadeIn(800, 0, 0, 0);

    const hasSave = await SaveSystem.any();
    const desktop = !!window.desktop;
    const win = new Win(this, Math.round(UW / 2 - 50), 104, 100, 70);
    this.menu = new MenuList(this, win, {
      x: 14, y: 8, width: 80, rowH: 13,
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
      if (b.x > UW + 20) b.x = -20;
    }
    if (this.titleText) this.titleText.setAlpha(0.85 + Math.sin(time / 400) * 0.15);
    if (time > this.nextFlash) {
      this.nextFlash = time + 9000 + Math.random() * 9000;
      this.tweens.add({ targets: this.flash, alpha: { from: 0.18, to: 0 }, duration: 900 });
      if (Math.random() < 0.6) this.time.delayedCall(100, () => Audio.sfx('bell'));
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
    const win = new Win(this, Math.round(UW / 2 - 110), 70, 220, 100, { depth: 12000 });
    win.text(14, 8, 'Opções', COLORS.yellow);
    const speeds = ['', 'Lenta', 'Normal', 'Rápida', 'Instant.'];
    const rows = [
      { label: 'Música', get: () => `${Math.round(Settings.music * 10)}`, adj: (d) => (Settings.music = Math.max(0, Math.min(1, Math.round((Settings.music + d * 0.1) * 10) / 10))) },
      { label: 'Efeitos', get: () => `${Math.round(Settings.sfx * 10)}`, adj: (d) => (Settings.sfx = Math.max(0, Math.min(1, Math.round((Settings.sfx + d * 0.1) * 10) / 10))) },
      { label: 'Texto', get: () => speeds[Settings.textSpeed], adj: (d) => (Settings.textSpeed = Math.max(1, Math.min(4, Settings.textSpeed + d))) },
    ];
    const items = () => rows.map((r) => ({ label: r.label, right: `< ${r.get()} >` }));
    const list = new MenuList(this, win, {
      x: 18, y: 28, width: 190, rowH: 16, items: items(),
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
