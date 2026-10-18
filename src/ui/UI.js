import { FONT, COLORS } from '../config.js';
import { makeCanvas, rect, mix, addTexture } from '../core/Pixel.js';
import { textWidth } from '../core/Font.js';
import { Audio } from '../core/Audio.js';

const WIN_TOP = '#2e2858';
const WIN_BOTTOM = '#0c0a1c';

export function windowTexture(scene, w, h, style = 'default') {
  const key = `win_${style}_${w}x${h}`;
  if (scene.textures.exists(key)) return key;
  const { canvas, ctx } = makeCanvas(w, h);
  const top = style === 'blood' ? '#4a1820' : style === 'dark' ? '#16121e' : WIN_TOP;
  const bottom = style === 'blood' ? '#12060a' : style === 'dark' ? '#050408' : WIN_BOTTOM;
  for (let y = 0; y < h; y++) {
    const t = Math.floor((y / Math.max(1, h - 1)) * 10) / 10;
    rect(ctx, 0, y, w, 1, mix(top, bottom, t));
  }
  const ring = (i, color) => {
    rect(ctx, i, i, w - i * 2, 1, color);
    rect(ctx, i, h - 1 - i, w - i * 2, 1, color);
    rect(ctx, i, i, 1, h - i * 2, color);
    rect(ctx, w - 1 - i, i, 1, h - i * 2, color);
  };
  ring(0, '#06040a');
  ring(1, style === 'blood' ? '#e8c8c8' : '#e2def0');
  ring(2, style === 'blood' ? '#8a4a50' : '#7a74a0');
  // cantos arredondados
  ctx.clearRect(0, 0, 1, 1);
  ctx.clearRect(w - 1, 0, 1, 1);
  ctx.clearRect(0, h - 1, 1, 1);
  ctx.clearRect(w - 1, h - 1, 1, 1);
  rect(ctx, 1, 1, 1, 1, '#06040a');
  rect(ctx, w - 2, 1, 1, 1, '#06040a');
  rect(ctx, 1, h - 2, 1, 1, '#06040a');
  rect(ctx, w - 2, h - 2, 1, 1, '#06040a');
  addTexture(scene, key, canvas);
  return key;
}

export class Win extends Phaser.GameObjects.Container {
  constructor(scene, x, y, w, h, opts = {}) {
    super(scene, x, y);
    this.w = w;
    this.h = h;
    this.bg = scene.add.image(0, 0, windowTexture(scene, w, h, opts.style)).setOrigin(0);
    this.add(this.bg);
    this.setScrollFactor(0);
    this.setDepth(opts.depth ?? 10000);
    scene.add.existing(this);
  }

  text(x, y, str, color = COLORS.white) {
    const t = makeText(this.scene, x, y, str, color);
    this.add(t);
    return t;
  }

  textRight(xRight, y, str, color = COLORS.white) {
    const t = makeText(this.scene, xRight - textWidth(String(str)), y, str, color);
    this.add(t);
    return t;
  }
}

export function makeText(scene, x, y, str, color = COLORS.white) {
  const t = scene.add.bitmapText(x, y, FONT, String(str));
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
    this.cursor = scene.add.image(0, 0, 'cursor').setOrigin(1, 0).setScrollFactor(0);
    parent.add(this.cursor);
    this.bob = scene.tweens.add({ targets: this.cursor, displayOriginX: 14, duration: 280, yoyo: true, repeat: -1 });
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
    this.cursor.setPosition(cx - 2, cy + 1).setVisible(true);
    this.cursor.setAlpha(this.active ? 1 : 0.5);
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
