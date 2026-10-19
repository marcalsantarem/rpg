// Tela de slots para salvar ou carregar.
import { UW, UH, COLORS } from '../config.js';
import { Controls } from '../core/Controls.js';
import { Audio } from '../core/Audio.js';
import { SaveSystem } from '../core/SaveSystem.js';
import { State, formatTime } from '../core/GameState.js';
import { Win, MenuList, uiCamera } from '../ui/UI.js';
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
    uiCamera(this);
    this.busy = true;
    this.list = null;
    this.confirm = null;
    const save = this.opts.mode === 'save';
    this.add.rectangle(0, 0, UW, UH, 0x000000, 0.6).setOrigin(0);
    const top = new Win(this, 0, 0, UW, 24);
    top.text(10, 6, save ? 'Salvar jornada — escolha um registro' : 'Carregar jornada — escolha um registro', COLORS.yellow);
    this.slots = await SaveSystem.list();
    const win = new Win(this, 0, 24, UW, UH - 24);
    this.slots.forEach((s, i) => {
      const y = 6 + i * 59;
      win.text(10, y + 2, `Registro ${i + 1}`, COLORS.gray);
      if (!s) {
        win.text(10, y + 22, '— vazio —', COLORS.dim);
        return;
      }
      s.party.forEach((id, k) => {
        if (this.textures.exists(`face_${id}`)) win.add(this.add.image(96 + k * 46, y + 3, `face_${id}`).setOrigin(0).setScale(42 / 144));
      });
      win.text(10, y + 18, `${s.leader}`, COLORS.white);
      win.text(10, y + 30, `Nv ${s.level}`, COLORS.white);
      win.textRight(UW - 12, y + 2, formatTime(s.time), COLORS.white);
      win.textRight(UW - 12, y + 30, s.place, COLORS.gray);
    });
    this.list = new MenuList(this, win, {
      x: 8, y: 5, width: UW - 12, rowH: 59,
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
      const w = new Win(this, Math.round(UW / 2 - 80), 90, 160, 28, { depth: 21000 });
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
      const win = new Win(this, Math.round(UW / 2 - 90), 80, 180, 58, { depth: 21000 });
      win.text(14, 8, question);
      const list = new MenuList(this, win, {
        x: 18, y: 26, width: 150, rowH: 13, items: [{ label: 'Sim' }, { label: 'Não' }],
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
