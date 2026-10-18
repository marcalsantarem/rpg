// Tela de slots para salvar ou carregar.
import { W, H, COLORS } from '../config.js';
import { Controls } from '../core/Controls.js';
import { Audio } from '../core/Audio.js';
import { SaveSystem } from '../core/SaveSystem.js';
import { State, formatTime } from '../core/GameState.js';
import { Win, MenuList } from '../ui/UI.js';
import { HEROES } from '../data/heroes.js';

export class SaveLoadScene extends Phaser.Scene {
  constructor() {
    super('SaveLoad');
  }

  init(data) {
    this.opts = data || {};
  }

  async create() {
    this.controls = new Controls(this);
    this.busy = true;
    const save = this.opts.mode === 'save';
    this.add.rectangle(0, 0, W, H, 0x000000, 0.6).setOrigin(0);
    const top = new Win(this, 0, 0, W, 26);
    top.text(10, 7, save ? 'Salvar jornada — escolha um registro' : 'Carregar jornada — escolha um registro', COLORS.yellow);
    this.slots = await SaveSystem.list();
    this.slotWins = [];
    this.slots.forEach((s, i) => {
      const y = 30 + i * 70;
      const win = new Win(this, 0, y, W, 68);
      this.slotWins.push(win);
      win.text(26, 8, `Registro ${i + 1}`, COLORS.gray);
      if (!s) {
        win.text(26, 28, '— vazio —', COLORS.dim);
        return;
      }
      s.party.forEach((id, k) => win.add(this.add.image(120 + k * 20, 34, `chr_${HEROES[id].sprite}`, 0).setOrigin(0.5, 1)));
      win.text(26, 22, `${s.leader}`, COLORS.white);
      win.text(26, 36, `Nv ${s.level}`, COLORS.white);
      win.text(210, 8, formatTime(s.time), COLORS.white);
      win.text(120, 46, s.place, COLORS.gray);
    });
    const cursorWin = new Win(this, -100, -100, 10, 10);
    cursorWin.setDepth(20000);
    this.list = new MenuList(this, cursorWin, {
      x: 124, y: 153, width: 10, rowH: 70,
      items: this.slots.map((s) => ({ label: '', enabled: save || !!s })),
      onSelect: (_it, i) => this.choose(i),
      onCancel: () => this.close(),
    });
    this.busy = false;
  }

  update() {
    this.controls.update();
    if (this.busy || !this.list) return;
    if (this.confirm) this.confirm.update(this.controls);
    else this.list.update(this.controls);
  }

  close() {
    this.scene.stop();
    if (this.opts.parent) this.scene.resume(this.opts.parent);
  }

  async choose(i) {
    const slot = i + 1;
    if (this.opts.mode === 'save') {
      if (this.slots[i]) {
        const ok = await this.ask('Sobrescrever este registro?');
        if (!ok) return;
      }
      this.busy = true;
      await SaveSystem.save(slot);
      Audio.sfx('save');
      this.slots = await SaveSystem.list();
      const w = new Win(this, 80, 100, 160, 30, { depth: 21000 });
      w.text(20, 9, 'Jornada registrada.', COLORS.green);
      this.time.delayedCall(900, () => this.close());
      return;
    }
    this.busy = true;
    const ok = await SaveSystem.load(slot);
    if (!ok) {
      this.busy = false;
      Audio.sfx('buzzer');
      return;
    }
    Audio.sfx('save');
    for (const k of ['Menu', 'Map', 'Title', 'GameOver', 'EndChapter']) if (k !== this.opts.parent) this.scene.stop(k);
    if (this.opts.parent) this.scene.stop(this.opts.parent);
    this.cameras.main.fadeOut(400, 0, 0, 0);
    this.time.delayedCall(420, () => {
      this.scene.start('Map', { map: State.g.map.id, x: State.g.map.x, y: State.g.map.y, dir: State.g.map.dir });
    });
  }

  ask(question) {
    return new Promise((resolve) => {
      const win = new Win(this, 70, 90, 180, 60, { depth: 21000 });
      win.text(14, 8, question);
      const list = new MenuList(this, win, {
        x: 34, y: 26, width: 140, rowH: 13, items: [{ label: 'Sim' }, { label: 'Não' }],
        onSelect: (_it, k) => done(k === 0),
        onCancel: () => done(false),
      });
      const done = (v) => {
        list.destroy();
        win.destroy();
        this.confirm = null;
        resolve(v);
      };
      this.confirm = list;
    });
  }
}
