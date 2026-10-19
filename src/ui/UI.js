import { FONT, FONT_SIZE, COLORS, UI_SCALE } from '../config.js';
import { makeCanvas, rect, mix, addTexture } from '../core/Pixel.js';
import { textWidth } from '../core/Font.js';
import { Audio } from '../core/Audio.js';

const S = UI_SCALE;

// Câmera das cenas de interface: coordenadas lógicas (368x208) ampliadas 3x.
export function uiCamera(scene) {
  scene.cameras.main.setOrigin(0, 0).setZoom(S);
  return scene.cameras.main;
}

// Fundo de janela com a skin Window.png do MZ (desenhado em resolução nativa).
export function windowTexture(scene, w, h, style = 'default') {
  const key = `win_${style}_${w}x${h}`;
  if (scene.textures.exists(key)) return key;
  const W = w * S;
  const H = h * S;
  const { canvas, ctx } = makeCanvas(W, H);
  const skin = scene.textures.exists('mz_system_Window') ? scene.textures.get('mz_system_Window').getSourceImage() : null;
  if (skin) {
    const m = 4;
    if (style === 'solid' || style === 'dark') {
      ctx.fillStyle = '#12101c';
      ctx.fillRect(m, m, W - m * 2, H - m * 2);
    }
    ctx.save();
    ctx.globalAlpha = style === 'dark' || style === 'solid' ? 1 : 0.86;
    ctx.drawImage(skin, 0, 0, 96, 96, m, m, W - m * 2, H - m * 2);
    // padrão sobreposto (lado esquerdo inferior da skin), em ladrilhos
    ctx.globalAlpha = 0.5;
    for (let y = m; y < H - m; y += 96)
      for (let x = m; x < W - m; x += 96) {
        const cw = Math.min(96, W - m - x);
        const ch = Math.min(96, H - m - y);
        ctx.drawImage(skin, 0, 96, cw, ch, x, y, cw, ch);
      }
    ctx.restore();
    if (style === 'dark' || style === 'blood') {
      ctx.fillStyle = style === 'blood' ? 'rgba(90,10,20,0.45)' : 'rgba(0,0,0,0.45)';
      ctx.fillRect(m, m, W - m * 2, H - m * 2);
    }
    // moldura 9-slice (cantos de 24px)
    const c = 24;
    const sx = 96;
    const parts = [
      [0, 0, c, c, 0, 0, c, c],
      [96 - c, 0, c, c, W - c, 0, c, c],
      [0, 96 - c, c, c, 0, H - c, c, c],
      [96 - c, 96 - c, c, c, W - c, H - c, c, c],
      [c, 0, 96 - c * 2, c, c, 0, W - c * 2, c],
      [c, 96 - c, 96 - c * 2, c, c, H - c, W - c * 2, c],
      [0, c, c, 96 - c * 2, 0, c, c, H - c * 2],
      [96 - c, c, c, 96 - c * 2, W - c, c, c, H - c * 2],
    ];
    for (const [px, py, pw, ph, dx, dy, dw, dh] of parts) ctx.drawImage(skin, sx + px, py, pw, ph, dx, dy, dw, dh);
  } else {
    for (let y = 0; y < H; y++) rect(ctx, 0, y, W, 1, mix('#2e2858', '#0c0a1c', y / H));
    ctx.strokeStyle = '#e2def0';
    ctx.lineWidth = 3;
    ctx.strokeRect(2, 2, W - 4, H - 4);
  }
  addTexture(scene, key, canvas);
  return key;
}

// Retângulo de seleção (cursor) da skin do MZ
export function cursorTexture(scene, w, h) {
  const key = `cur_${w}x${h}`;
  if (scene.textures.exists(key)) return key;
  const W = Math.max(8, w * S);
  const H = Math.max(8, h * S);
  const { canvas, ctx } = makeCanvas(W, H);
  const skin = scene.textures.exists('mz_system_Window') ? scene.textures.get('mz_system_Window').getSourceImage() : null;
  if (skin) {
    const sx = 96;
    const sy = 96;
    const p = 48;
    const m = 4;
    const parts = [
      [0, 0, m, m, 0, 0, m, m],
      [p - m, 0, m, m, W - m, 0, m, m],
      [0, p - m, m, m, 0, H - m, m, m],
      [p - m, p - m, m, m, W - m, H - m, m, m],
      [m, 0, p - m * 2, m, m, 0, W - m * 2, m],
      [m, p - m, p - m * 2, m, m, H - m, W - m * 2, m],
      [0, m, m, p - m * 2, 0, m, m, H - m * 2],
      [p - m, m, m, p - m * 2, W - m, m, m, H - m * 2],
      [m, m, p - m * 2, p - m * 2, m, m, W - m * 2, H - m * 2],
    ];
    for (const [px, py, pw, ph, dx, dy, dw, dh] of parts) ctx.drawImage(skin, sx + px, sy + py, pw, ph, dx, dy, dw, dh);
  } else {
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.fillRect(0, 0, W, H);
  }
  addTexture(scene, key, canvas);
  return key;
}

export class Win extends Phaser.GameObjects.Container {
  constructor(scene, x, y, w, h, opts = {}) {
    super(scene, x, y);
    this.w = w;
    this.h = h;
    const style = opts.style ?? ((opts.depth ?? 0) >= 11000 ? 'solid' : 'default');
    this.bg = scene.add.image(0, 0, windowTexture(scene, w, h, style)).setOrigin(0).setScale(1 / S);
    this.add(this.bg);
    this.setScrollFactor(0);
    this.setDepth(opts.depth ?? 10000);
    scene.add.existing(this);
  }

  text(x, y, str, color = COLORS.white, size) {
    const t = makeText(this.scene, x, y, str, color, size);
    this.add(t);
    return t;
  }

  textRight(xRight, y, str, color = COLORS.white, size) {
    const t = makeText(this.scene, xRight - textWidth(String(str), size), y, str, color, size);
    this.add(t);
    return t;
  }
}

// Texto com a fonte do MZ, renderizado em resolução 3x (nítido na câmera ampliada).
export function makeText(scene, x, y, str, color = COLORS.white, size = FONT_SIZE) {
  const t = scene.add.text(x, y, String(str), {
    fontFamily: FONT,
    fontSize: `${size}px`,
    color: '#ffffff',
    stroke: '#101018',
    strokeThickness: size > 12 ? 2 : 1,
    lineSpacing: Math.round(size * 0.3),
    resolution: S,
  });
  t.setTint(color);
  t.setScrollFactor(0);
  return t;
}

export function makeCursor(scene, x, y) {
  const c = scene.add.image(x, y, 'cursor').setOrigin(1, 0).setScrollFactor(0).setDepth(2000);
  scene.tweens.add({ targets: c, x: x - 2, duration: 280, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
  return c;
}

// Barra simples (HP/MP)
export function drawBar(g, x, y, w, ratio, color) {
  g.fillStyle(0x000000, 1).fillRect(x, y, w + 2, 4);
  g.fillStyle(0x2a2438, 1).fillRect(x + 1, y + 1, w, 2);
  g.fillStyle(color, 1).fillRect(x + 1, y + 1, Math.round(w * Math.max(0, Math.min(1, ratio))), 2);
}

/**
 * Lista navegável com cursor de mão.
 * items: [{ label, enabled=true, color, right, value }]
 */
export class MenuList {
  constructor(scene, parent, opts) {
    this.scene = scene;
    this.parent = parent; // Container (Win)
    this.x = opts.x;
    this.y = opts.y;
    this.width = opts.width ?? 100;
    this.rowH = opts.rowH ?? 12;
    this.cols = opts.cols ?? 1;
    this.colW = opts.colW ?? this.width;
    this.visibleRows = opts.visibleRows ?? 99;
    this.onSelect = opts.onSelect;
    this.onCancel = opts.onCancel;
    this.onChange = opts.onChange;
    this.sound = opts.sound !== false;
    this.index = opts.index ?? 0;
    this.scroll = 0;
    this.active = true;
    this.texts = [];
    const cw = opts.cursorW ?? (this.cols > 1 ? this.colW - 4 : this.width);
    this.cursor = scene.add.image(0, 0, cursorTexture(scene, cw, this.rowH)).setOrigin(0).setScale(1 / S).setScrollFactor(0);
    parent.addAt(this.cursor, 1);
    this.bob = scene.tweens.add({ targets: this.cursor, alpha: 0.55, duration: 450, yoyo: true, repeat: -1 });
    this.setItems(opts.items ?? []);
  }

  setItems(items, keepIndex = true) {
    this.items = items;
    if (!keepIndex) this.index = 0;
    this.index = Math.max(0, Math.min(this.index, items.length - 1));
    this.render();
  }

  render() {
    this.texts.forEach((t) => t.destroy());
    this.texts = [];
    const perPage = this.visibleRows * this.cols;
    const row = Math.floor(this.index / this.cols);
    if (row < this.scroll) this.scroll = row;
    if (row >= this.scroll + this.visibleRows) this.scroll = row - this.visibleRows + 1;
    const start = this.scroll * this.cols;
    this.items.slice(start, start + perPage).forEach((it, i) => {
      const idx = start + i;
      const cx = this.x + (idx % this.cols) * this.colW;
      const cy = this.y + (Math.floor(idx / this.cols) - this.scroll) * this.rowH;
      const enabled = it.enabled !== false;
      const color = !enabled ? COLORS.dim : it.color ?? COLORS.white;
      const t = makeText(this.scene, cx, cy, it.label, color);
      this.parent.add(t);
      this.texts.push(t);
      if (it.right !== undefined && it.right !== null) {
        const rs = String(it.right);
        const r = makeText(this.scene, cx + this.colW - 8 - textWidth(rs), cy, rs, color);
        this.parent.add(r);
        this.texts.push(r);
      }
    });
    if (this.scrollUp) this.scrollUp.destroy();
    if (this.scrollDown) this.scrollDown.destroy();
    this.scrollUp = this.scrollDown = null;
    const totalRows = Math.ceil(this.items.length / this.cols);
    if (this.scroll > 0) {
      this.scrollUp = makeText(this.scene, this.x + this.width - 10, this.y - 10, '<', COLORS.gray).setAngle(90);
      this.parent.add(this.scrollUp);
    }
    if (this.scroll + this.visibleRows < totalRows) {
      this.scrollDown = makeText(this.scene, this.x + this.width - 4, this.y + this.visibleRows * this.rowH, '<', COLORS.gray).setAngle(-90);
      this.parent.add(this.scrollDown);
    }
    this.placeCursor();
  }

  placeCursor() {
    if (!this.items.length) {
      this.cursor.setVisible(false);
      return;
    }
    const cx = this.x + (this.index % this.cols) * this.colW;
    const cy = this.y + (Math.floor(this.index / this.cols) - this.scroll) * this.rowH;
    this.cursor.setPosition(cx - 4, cy - 1).setVisible(true);
    if (!this.active) this.cursor.setAlpha(0.35);
  }

  setActive(v) {
    this.active = v;
    if (this.bob) this.bob.paused = !v;
    this.placeCursor();
    return this;
  }

  current() {
    return this.items[this.index];
  }

  move(delta) {
    const n = this.items.length;
    if (!n) return;
    let ni = this.index + delta;
    if (ni < 0) ni = delta === -1 ? n - 1 : (this.index % this.cols) + Math.floor((n - 1) / this.cols) * this.cols;
    if (ni >= n) ni = delta === 1 ? 0 : this.index % this.cols;
    ni = Math.max(0, Math.min(n - 1, ni));
    if (ni !== this.index) {
      this.index = ni;
      if (this.sound) Audio.sfx('cursor');
      this.render();
      if (this.onChange) this.onChange(this.current(), this.index);
    }
  }

  update(c) {
    if (!this.active) return;
    if (c.repeat('up')) this.move(-this.cols);
    else if (c.repeat('down')) this.move(this.cols);
    else if (this.cols > 1 && c.repeat('left')) this.move(-1);
    else if (this.cols > 1 && c.repeat('right')) this.move(1);
    else if (c.pressed('ok')) {
      const it = this.current();
      if (!it) return;
      if (it.enabled === false) {
        Audio.sfx('buzzer');
        return;
      }
      Audio.sfx('confirm');
      if (this.onSelect) this.onSelect(it, this.index);
    } else if (c.pressed('cancel')) {
      if (this.onCancel) {
        Audio.sfx('cancel');
        this.onCancel();
      }
    }
  }

  destroy() {
    this.texts.forEach((t) => t.destroy());
    if (this.scrollUp) this.scrollUp.destroy();
    if (this.scrollDown) this.scrollDown.destroy();
    if (this.bob) this.bob.remove();
    this.cursor.destroy();
  }
}
