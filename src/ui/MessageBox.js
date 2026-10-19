import { Win, MenuList, makeText } from './UI.js';
import { wrapText, textWidth } from '../core/Font.js';
import { Settings } from '../core/Settings.js';
import { COLORS, UW, UH } from '../config.js';
import { HEROES } from '../data/heroes.js';
import { FACES } from '../data/mzAssets.js';

const BOX_H = 62;
const BOX_Y = UH - BOX_H - 4;
const FACE_NAMES = Object.fromEntries(Object.entries(HEROES).map(([id, h]) => [h.name, id]));
import { Audio } from '../core/Audio.js';

const CPS = [0, 28, 55, 110, 100000];
const LINES = 4;

export class MessageBox {
  constructor(scene, depth = 20000) {
    this.scene = scene;
    this.depth = depth;
    this.active = false;
    this.win = null;
  }

  open(pos, style) {
    this.pendingClose = false;
    const y = pos === 'top' ? 4 : BOX_Y;
    if (this.win && this.winPos === pos && this.winStyle === style) return;
    this.closeWin();
    this.winPos = pos;
    this.winStyle = style;
    this.win = new Win(this.scene, 4, y, UW - 8, BOX_H, { depth: this.depth, style });
    this.body = makeText(this.scene, 10, 7, '');
    this.win.add(this.body);
    this.arrow = this.scene.add.image(UW - 22, BOX_H - 10, 'arrow_down').setScrollFactor(0).setVisible(false);
    this.win.add(this.arrow);
    this.scene.tweens.add({ targets: this.arrow, y: BOX_H - 8, duration: 300, yoyo: true, repeat: -1 });
  }

  closeWin() {
    if (this.nameWin) this.nameWin.destroy();
    this.nameWin = null;
    if (this.win) this.win.destroy();
    this.win = null;
    this.face = null;
  }

  setName(name) {
    if (this.nameWin) this.nameWin.destroy();
    this.nameWin = null;
    if (!name) return;
    const w = textWidth(name) + 16;
    const y = this.winPos === 'top' ? BOX_H + 6 : BOX_Y - 19;
    this.nameWin = new Win(this.scene, 4, y, w, 19, { depth: this.depth + 1, style: this.winStyle });
    this.nameWin.text(8, 4, name, COLORS.yellow);
  }

  // Rosto do herói (folha de faces do MZ) quando ele é quem fala
  setFace(name) {
    if (this.face) this.face.destroy();
    this.face = null;
    const id = FACE_NAMES[name];
    const f = id && FACES[id];
    const key = f && `face_${id}`;
    if (key && this.scene.textures.exists(key)) {
      this.face = this.scene.add.image(7, 7, key).setOrigin(0).setScale(1 / 3);
      this.win.add(this.face);
    }
    this.body.setX(this.face ? 62 : 10);
  }

  /** Mostra texto; resolve quando o jogador confirma a última página. */
  say(text, opts = {}) {
    this.open(opts.pos ?? 'bottom', opts.style);
    this.setName(opts.name);
    this.setFace(opts.name);
    const lines = wrapText(text, this.face ? UW - 80 : UW - 28);
    this.pages = [];
    for (let i = 0; i < lines.length; i += LINES) this.pages.push(lines.slice(i, i + LINES).join('\n'));
    this.page = 0;
    this.keepOpen = !!opts.keepOpen;
    this.startPage();
    this.active = true;
    this.mode = 'text';
    return new Promise((resolve) => {
      this.resolve = resolve;
    });
  }

  startPage() {
    this.full = this.pages[this.page];
    this.shown = 0;
    this.typing = true;
    this.body.setText('');
    this.arrow.setVisible(false);
  }

  /** Pergunta com opções; resolve com o índice escolhido. */
  async choice(question, options, opts = {}) {
    if (question) await this.say(question, { ...opts, keepOpen: true });
    else this.open(opts.pos ?? 'bottom', opts.style);
    this.mode = 'choice';
    this.active = true;
    const w = Math.max(...options.map((o) => textWidth(o))) + 26;
    const h = options.length * 12 + 14;
    const y = this.winPos === 'top' ? BOX_H + 8 : BOX_Y - 21 - h;
    this.choiceWin = new Win(this.scene, UW - 4 - w, y, w, h, { depth: this.depth + 2, style: opts.style });
    return new Promise((resolve) => {
      const finish = (i) => {
        this.list.destroy();
        this.choiceWin.destroy();
        this.choiceWin = null;
        this.list = null;
        this.active = false;
        if (!opts.keepOpen) this.deferClose();
        resolve(i);
      };
      this.list = new MenuList(this.scene, this.choiceWin, {
        x: 12, y: 7, width: w - 20,
        items: options.map((o) => ({ label: o })),
        onSelect: (_it, i) => finish(i),
        onCancel: opts.noCancel ? null : () => finish(options.length - 1),
      });
    });
  }

  deferClose() {
    this.pendingClose = true;
    this.pendingFrames = 0;
  }

  update(c, dt) {
    if (!this.active) {
      if (this.pendingClose && ++this.pendingFrames > 1) {
        this.pendingClose = false;
        this.closeWin();
      }
      return;
    }
    if (this.mode === 'choice') {
      if (this.list) this.list.update(c);
      return;
    }
    if (this.typing) {
      this.shown += (CPS[Settings.textSpeed] * dt) / 1000;
      const n = Math.min(this.full.length, Math.floor(this.shown));
      this.body.setText(this.full.slice(0, n));
      if (n >= this.full.length) this.endTyping();
      else if (c.pressed('ok') || c.pressed('cancel')) {
        this.body.setText(this.full);
        this.endTyping();
      }
      return;
    }
    if (this.keepOpen && this.page >= this.pages.length - 1) return;
    if (c.pressed('ok') || c.pressed('cancel')) {
      Audio.sfx('cursor');
      if (this.page < this.pages.length - 1) {
        this.page++;
        this.startPage();
      } else {
        this.active = false;
        const r = this.resolve;
        this.resolve = null;
        this.deferClose();
        if (r) r();
      }
    }
  }

  endTyping() {
    this.typing = false;
    const last = this.page >= this.pages.length - 1;
    if (this.keepOpen && last) {
      this.active = false;
      const r = this.resolve;
      this.resolve = null;
      if (r) r();
      return;
    }
    this.arrow.setVisible(true);
  }

  destroy() {
    this.closeWin();
    if (this.choiceWin) this.choiceWin.destroy();
  }
}
