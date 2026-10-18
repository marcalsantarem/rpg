// Exploração: tilemap, movimento em grade, NPCs, eventos, scripts e atmosfera.
import { W, H, TILE, DIRS, DEBUG, COLORS } from '../config.js';
import { Controls } from '../core/Controls.js';
import { Audio } from '../core/Audio.js';
import { State, flag, setFlag, addItem, hasItem, joinParty, healParty, gainExp, heroStats } from '../core/GameState.js';
import { MessageBox } from '../ui/MessageBox.js';
import { Win } from '../ui/UI.js';
import { textWidth } from '../core/Font.js';
import { MAPS } from '../data/maps/index.js';
import { LEGEND } from '../data/maps/legend.js';
import { TILE_INDEX } from '../art/tiles.js';
import { ITEMS } from '../data/items.js';

const OPP = { up: 'down', down: 'up', left: 'right', right: 'left' };
const PATH_DIR = { U: 'up', D: 'down', L: 'left', R: 'right' };
const DEPTH_OVER = 3000;

export class MapScene extends Phaser.Scene {
  constructor() {
    super('Map');
  }

  init(data) {
    this.entry = data || {};
  }

  create() {
    const g = State.g;
    if (this.entry.map) g.map = { id: this.entry.map, x: this.entry.x, y: this.entry.y, dir: this.entry.dir ?? 'down' };
    this.def = MAPS[g.map.id];
    this.token = (this.token ?? 0) + 1;
    this.controls = new Controls(this);
    this.msg = new MessageBox(this);
    this.busy = false;
    this.transitioning = false;
    this.entities = [];
    // A instância da cena é reaproveitada a cada troca de mapa: limpa referências
    // a objetos do mapa anterior (já destruídos), senão o loop quebra.
    this.darkRT = null;
    this.lightImg = null;
    this.fog = null;
    this.battleResolve = null;
    this.overlayResult = undefined;
    this.api = this.makeApi();

    this.buildMap();
    this.player = this.makeActor(State.g.party[0].id, g.map.x, g.map.y, g.map.dir);
    this.player.isPlayer = true;
    this.createEvents();
    this.setupCamera();
    this.setupAtmosphere();
    this.resetEncounter();

    Audio.play(this.def.music);
    this.cameras.main.fadeIn(280, 0, 0, 0);
    if (this.def.banner && this.entry.from !== this.def.id) this.showBanner(this.def.name);

    const onWake = (_sys, data) => this.onWake(data);
    this.events.on('wake', onWake);
    this.events.once('shutdown', () => {
      this.events.off('wake', onWake);
      this.msg.destroy();
      if (this.lightImg) this.lightImg.destroy();
    });

    if (DEBUG) this.setupDebug();
    this.time.delayedCall(300, () => this.runAutoEvents());
  }

  // ---------------------------------------------------------------- mapa
  buildMap() {
    const def = this.def;
    const rows = def.rows;
    this.mapH = rows.length;
    this.mapW = rows[0].length;
    this.tilemap = this.make.tilemap({ tileWidth: TILE, tileHeight: TILE, width: this.mapW, height: this.mapH });
    const ts = this.tilemap.addTilesetImage('tiles', 'tiles', TILE, TILE, 0, 0);
    this.ground = this.tilemap.createBlankLayer('ground', ts).setDepth(0);
    this.deco = this.tilemap.createBlankLayer('deco', ts).setDepth(1);
    this.over = this.tilemap.createBlankLayer('over', ts).setDepth(DEPTH_OVER);
    this.solid = [];
    this.counter = [];
    this.animTiles = [];
    const idx = (name) => TILE_INDEX[name === '$' ? def.base : name];
    for (let y = 0; y < this.mapH; y++) {
      this.solid.push([]);
      this.counter.push([]);
      for (let x = 0; x < this.mapW; x++) {
        const ch = rows[y][x];
        const L = LEGEND[ch] ?? LEGEND['.'];
        let gname = L.g;
        if (L.cave) {
          const below = rows[y + 1]?.[x];
          if (below !== undefined && !LEGEND[below]?.cave) gname = 'caveface';
        }
        this.ground.putTileAt(idx(gname), x, y);
        if (L.d) this.deco.putTileAt(idx(L.d), x, y);
        if (L.top && y > 0) this.over.putTileAt(idx(L.top), x, y - 1);
        if (L.anim) this.animTiles.push({ x, y, frames: L.anim.map(idx) });
        this.solid[y].push(!!L.solid);
        this.counter[y].push(!!L.counter);
      }
    }
    if (this.animTiles.length) {
      let f = 0;
      this.time.addEvent({
        delay: 550,
        loop: true,
        callback: () => {
          f++;
          for (const t of this.animTiles) this.ground.putTileAt(t.frames[f % t.frames.length], t.x, t.y);
        },
      });
    }
  }

  setupCamera() {
    const cam = this.cameras.main;
    const pw = this.mapW * TILE;
    const ph = this.mapH * TILE;
    const bx = pw < W ? (pw - W) / 2 : 0;
    const by = ph < H ? (ph - H) / 2 : 0;
    cam.setBounds(bx, by, Math.max(pw, W), Math.max(ph, H));
    cam.startFollow(this.player.sprite, true, 1, 1, 0, 12);
    cam.setRoundPixels(true);
  }

  setupAtmosphere() {
    const def = this.def;
    if (def.tint) {
      this.add.rectangle(0, 0, W, H, def.tint.color).setOrigin(0).setScrollFactor(0).setDepth(3800).setBlendMode(Phaser.BlendModes.MULTIPLY);
    }
    if (def.fog) {
      this.fog = this.add.tileSprite(0, 0, W, H, 'fog').setOrigin(0).setScrollFactor(0).setDepth(3900).setTint(def.fog.color).setAlpha(def.fog.alpha);
    }
    this.lights = (def.events ?? []).filter((e) => e.type === 'light');
    for (const e of def.events ?? []) if (e.type === 'save') this.lights.push({ x: e.x, y: e.y, r: 34 });
    if (def.dark) {
      this.darkRT = this.add.renderTexture(0, 0, W, H).setOrigin(0).setScrollFactor(0).setDepth(4000);
      this.lightImg = this.make.image({ x: 0, y: 0, key: 'light', add: false });
    }
  }

  updateAtmosphere(time) {
    const cam = this.cameras.main;
    if (this.fog) {
      this.fog.tilePositionX = cam.scrollX * 0.7 + time * 0.008;
      this.fog.tilePositionY = cam.scrollY * 0.7 + time * 0.003;
    }
    if (this.darkRT) {
      const rt = this.darkRT;
      rt.clear();
      rt.fill(0x000000, this.def.dark);
      const lantern = hasItem('lanterna') ? 1 : 0.65;
      const r = (this.def.lightRadius ?? 70) * lantern + Math.sin(time / 140) * 1.5 + Math.sin(time / 53) * 0.8;
      const ps = this.player.sprite;
      this.eraseLight(ps.x - cam.scrollX, ps.y - 10 - cam.scrollY, r);
      for (const L of this.lights) {
        this.eraseLight(L.x * TILE + 8 - cam.scrollX, L.y * TILE + 8 - cam.scrollY, L.r + Math.sin(time / 90 + L.x) * 1.2);
      }
    }
  }

  eraseLight(x, y, r) {
    if (x < -r || y < -r || x > W + r || y > H + r) return;
    this.lightImg.setScale((r * 2) / 128);
    this.darkRT.erase(this.lightImg, x, y);
  }

  showBanner(name) {
    const w = textWidth(name) + 28;
    const win = new Win(this, (W - w) / 2, 10, w, 22, { depth: 15000 });
    win.text(14, 5, name, COLORS.yellow);
    win.setAlpha(0);
    this.tweens.add({ targets: win, alpha: 1, duration: 300, hold: 1800, yoyo: true, onComplete: () => win.destroy() });
  }

  // ---------------------------------------------------------------- atores
  makeActor(spriteId, x, y, dir = 'down', alpha = 1) {
    const sprite = this.add.sprite(x * TILE + 8, y * TILE + TILE, `chr_${spriteId}`, DIRS[dir].frame * 3).setOrigin(0.5, 1);
    sprite.setAlpha(alpha);
    const a = { sprite, x, y, dir, moving: false, parity: 0 };
    this.setDepth(a);
    return a;
  }

  setDepth(a) {
    a.sprite.setDepth(100 + a.sprite.y + (a.isPlayer ? 0.5 : 0));
  }

  setFrame(a, f) {
    if (a.static) return;
    a.sprite.setFrame(DIRS[a.dir].frame * 3 + f);
  }

  face(a, dir) {
    a.dir = dir;
    this.setFrame(a, 0);
  }

  moveActor(a, dir, ms = 160) {
    return new Promise((resolve) => {
      const d = DIRS[dir];
      a.dir = dir;
      a.moving = true;
      a.tx = a.x + d.dx;
      a.ty = a.y + d.dy;
      a.parity ^= 1;
      this.setFrame(a, a.parity ? 1 : 2);
      this.time.delayedCall(ms * 0.55, () => this.setFrame(a, 0));
      this.tweens.add({
        targets: a.sprite,
        x: a.tx * TILE + 8,
        y: a.ty * TILE + TILE,
        duration: ms,
        onUpdate: () => this.setDepth(a),
        onComplete: () => {
          a.x = a.tx;
          a.y = a.ty;
          a.moving = false;
          this.setDepth(a);
          resolve();
        },
      });
    });
  }

  inBounds(x, y) {
    return x >= 0 && y >= 0 && x < this.mapW && y < this.mapH;
  }

  entityAt(x, y, filter) {
    return this.entities.find((e) => !e.removed && (filter ? filter(e) : true) && ((e.x === x && e.y === y) || (e.moving && e.tx === x && e.ty === y)));
  }

  blocked(x, y, self) {
    if (!this.inBounds(x, y) || this.solid[y][x]) return true;
    const p = this.player;
    if (self !== p && ((p.x === x && p.y === y) || (p.moving && p.tx === x && p.ty === y))) return true;
    return !!this.entityAt(x, y, (e) => e !== self && e.solid);
  }

  // ---------------------------------------------------------------- eventos
  goneKey(id) {
    return `gone:${this.def.id}:${id}`;
  }

  createEvents() {
    this.touches = [];
    this.reads = [];
    this.warps = [];
    this.autos = [];
    const f = State.g.flags;
    for (const ev of this.def.events ?? []) {
      if (ev.id && flag(this.goneKey(ev.id))) continue;
      switch (ev.type) {
        case 'warp':
          this.warps.push(ev);
          break;
        case 'touch':
          this.touches.push(ev);
          break;
        case 'read':
          this.reads.push(ev);
          break;
        case 'auto':
          this.autos.push(ev);
          break;
        case 'npc': {
          if (ev.cond && !ev.cond(f)) break;
          const a = this.makeActor(ev.sprite, ev.x, ev.y, ev.dir ?? 'down', ev.alpha ?? 1);
          Object.assign(a, { ev, id: ev.id, kind: 'npc', solid: true, home: { x: ev.x, y: ev.y }, next: this.time.now + 1000 + Math.random() * 3000 });
          this.entities.push(a);
          break;
        }
        case 'obj': {
          if (ev.cond && !ev.cond(f)) break;
          const sprite = this.add.image(ev.x * TILE + (ev.big ? TILE : 8), ev.y * TILE + TILE, ev.texture).setOrigin(0.5, 1);
          const a = { sprite, ev, id: ev.id, kind: 'obj', x: ev.x, y: ev.y, solid: ev.solid !== false, static: true };
          this.setDepth(a);
          this.entities.push(a);
          break;
        }
        case 'chest': {
          if (ev.cond && !ev.cond(f)) break;
          const opened = flag(`chest:${this.def.id}:${ev.id}`);
          const sprite = this.add.sprite(ev.x * TILE + 8, ev.y * TILE + TILE, 'chest', opened ? 1 : 0).setOrigin(0.5, 1);
          const a = { sprite, ev, id: ev.id, kind: 'chest', x: ev.x, y: ev.y, solid: true, static: true };
          this.setDepth(a);
          this.entities.push(a);
          break;
        }
        case 'save': {
          const sprite = this.add.sprite(ev.x * TILE + 8, ev.y * TILE + TILE, 'altar', 0).setOrigin(0.5, 1);
          this.time.addEvent({ delay: 220, loop: true, callback: () => sprite.setFrame(sprite.frame.name === 0 ? 1 : 0) });
          const a = { sprite, ev, kind: 'save', x: ev.x, y: ev.y, solid: true, static: true };
          this.setDepth(a);
          this.entities.push(a);
          break;
        }
        default:
          break;
      }
    }
  }

  async runAutoEvents() {
    for (const ev of this.autos) {
      if (ev.cond && !ev.cond(State.g.flags)) continue;
      await this.runScript(ev.script, ev);
    }
  }

  async runScript(fn, ev) {
    if (!fn) return;
    const token = this.token;
    this.busy = true;
    try {
      await fn(this.api, ev);
    } catch (e) {
      console.error('Erro no script', e);
    } finally {
      if (this.token === token && !this.transitioning) this.busy = false;
    }
  }

  alive(token) {
    return this.token === token && this.sys.isActive() !== false;
  }

  removeEntity(id, persistent = true) {
    const e = this.entities.find((x) => x.id === id && !x.removed);
    if (e) {
      e.removed = true;
      e.sprite.destroy();
    }
    if (persistent) setFlag(this.goneKey(id));
  }

  // ---------------------------------------------------------------- loop
  update(time, delta) {
    this.controls.update();
    if (!this.busy || this.msg.active) State.g.playTime += delta / 1000;
    this.msg.update(this.controls, delta);
    this.updateAtmosphere(time);
    if (this.transitioning) return;
    if (!this.busy && !this.msg.active) this.updateNpcs(time);
    if (this.msg.active || this.busy || this.player.moving) return;
    const c = this.controls;
    if (c.pressed('cancel')) {
      this.openMenu();
      return;
    }
    if (c.pressed('ok')) {
      this.interact();
      return;
    }
    const dir = c.dir();
    if (dir) this.tryStep(dir);
  }

  updateNpcs(time) {
    for (const n of this.entities) {
      if (n.kind !== 'npc' || n.removed || !n.ev.wander || n.moving || time < n.next) continue;
      n.next = time + 1500 + Math.random() * 3000;
      const dir = ['up', 'down', 'left', 'right'][Math.floor(Math.random() * 4)];
      const d = DIRS[dir];
      const nx = n.x + d.dx;
      const ny = n.y + d.dy;
      if (Math.abs(nx - n.home.x) > 2 || Math.abs(ny - n.home.y) > 2) continue;
      if (this.blocked(nx, ny, n) || this.isTrigger(nx, ny)) {
        this.face(n, dir);
        continue;
      }
      this.moveActor(n, dir, 300);
    }
  }

  isTrigger(x, y) {
    return this.warps.some((w) => w.x === x && w.y === y) || this.touches.some((t) => x >= t.x && y >= t.y && x < t.x + (t.w ?? 1) && y < t.y + (t.h ?? 1));
  }

  tryStep(dir) {
    const p = this.player;
    if (p.dir !== dir) this.face(p, dir);
    const d = DIRS[dir];
    const nx = p.x + d.dx;
    const ny = p.y + d.dy;
    if (this.blocked(nx, ny, p)) return;
    const ms = this.controls.down('run') ? 105 : 165;
    this.moveActor(p, dir, ms).then(() => this.onArrive());
  }

  onArrive() {
    const p = this.player;
    const g = State.g;
    g.map.x = p.x;
    g.map.y = p.y;
    g.map.dir = p.dir;
    const warp = this.warps.find((w) => w.x === p.x && w.y === p.y && (!w.cond || w.cond(g.flags)));
    if (warp) {
      this.warpTo(warp.to, warp.tx, warp.ty, warp.dir, warp.sfx);
      return;
    }
    const touch = this.touches.find(
      (t) => p.x >= t.x && p.y >= t.y && p.x < t.x + (t.w ?? 1) && p.y < t.y + (t.h ?? 1) && (!t.cond || t.cond(g.flags)) && !(t.id && flag(this.goneKey(t.id))),
    );
    if (touch) {
      this.runScript(touch.script, touch);
      return;
    }
    if (this.def.encounters && !State.debugNoEncounters) {
      this.encSteps--;
      if (this.encSteps <= 0) {
        this.resetEncounter();
        this.randomBattle();
        return;
      }
    }
    const dir = this.controls.dir();
    if (dir && !this.busy && !this.msg.active) this.tryStep(dir);
  }

  resetEncounter() {
    const r = this.def.encounters?.rate ?? [20, 30];
    this.encSteps = r[0] + Math.floor(Math.random() * (r[1] - r[0] + 1));
  }

  randomBattle() {
    const groups = this.def.encounters.groups;
    const total = groups.reduce((a, g) => a + g.w, 0);
    let roll = Math.random() * total;
    let pick = groups[0];
    for (const g of groups) {
      roll -= g.w;
      if (roll <= 0) {
        pick = g;
        break;
      }
    }
    this.busy = true;
    this.startBattle(pick.e, {}).then(() => {
      this.busy = false;
    });
  }

  interact() {
    const p = this.player;
    const d = DIRS[p.dir];
    let tx = p.x + d.dx;
    let ty = p.y + d.dy;
    let ent = this.entityAt(tx, ty);
    if (!ent && this.inBounds(tx, ty) && this.counter[ty][tx]) {
      tx += d.dx;
      ty += d.dy;
      ent = this.entityAt(tx, ty);
    }
    if (ent) {
      if (ent.kind === 'npc') {
        if (ent.ev.script) {
          this.face(ent, OPP[p.dir]);
          this.runScript(ent.ev.script, ent.ev);
        }
      } else if (ent.kind === 'chest') this.runScript(() => this.openChest(ent));
      else if (ent.kind === 'save') this.runScript(() => this.useAltar());
      else if (ent.kind === 'obj' && ent.ev.script) this.runScript(ent.ev.script, ent.ev);
      else if (ent.kind === 'obj' && ent.ev.linked) {
        const main = this.entities.find((e) => e.id === ent.ev.linked && !e.removed);
        if (main) this.runScript(main.ev.script, main.ev);
      }
      return;
    }
    const read = this.reads.find((r) => r.x === tx && r.y === ty);
    if (read) this.runScript(() => this.msg.say(read.text));
  }

  async openChest(ent) {
    const key = `chest:${this.def.id}:${ent.id}`;
    if (flag(key)) {
      await this.msg.say('O baú está vazio.');
      return;
    }
    setFlag(key);
    ent.sprite.setFrame(1);
    Audio.sfx('chest');
    const ev = ent.ev;
    if (ev.gold) {
      State.g.gold += ev.gold;
      await this.msg.say(`Encontrou ${ev.gold} moedas!`);
    } else {
      addItem(ev.item, ev.qty ?? 1);
      await this.msg.say(`Encontrou ${ITEMS[ev.item].name}${(ev.qty ?? 1) > 1 ? ` x${ev.qty}` : ''}!`);
    }
  }

  async useAltar() {
    Audio.sfx('save');
    healParty();
    await this.msg.say('Um altar de velas de Santa Liora. As chamas aquecem o grupo e restauram suas forças.');
    const c = await this.msg.choice('Registrar a jornada (salvar)?', ['Salvar', 'Agora não']);
    if (c === 0) await this.openOverlay('SaveLoad', { mode: 'save' });
  }

  // ---------------------------------------------------------------- transições
  warpTo(map, x, y, dir = 'down', sfx) {
    this.transitioning = true;
    this.busy = true;
    if (sfx) Audio.sfx(sfx);
    const cam = this.cameras.main;
    cam.fadeOut(240, 0, 0, 0);
    cam.once('camerafadeoutcomplete', () => this.scene.restart({ map, x, y, dir, from: this.def.id }));
    return new Promise(() => {});
  }

  openMenu() {
    Audio.sfx('confirm');
    this.openOverlay('Menu', { canSave: !this.def.encounters });
  }

  openOverlay(key, data = {}) {
    return new Promise((resolve) => {
      this.events.once('resume', () => resolve(this.overlayResult));
      this.scene.launch(key, { ...data, parent: 'Map' });
      this.scene.pause();
    });
  }

  startBattle(enemies, opts = {}) {
    return new Promise((resolve) => {
      this.busy = true;
      Audio.stop(0.05);
      Audio.sfx('encounter');
      const cam = this.cameras.main;
      cam.flash(120, 255, 255, 255);
      cam.shake(350, 0.01);
      this.time.delayedCall(140, () => cam.flash(120, 255, 255, 255));
      this.time.delayedCall(380, () => cam.fadeOut(200, 0, 0, 0));
      this.time.delayedCall(620, () => {
        this.battleResolve = resolve;
        this.scene.launch('Battle', {
          enemies,
          bg: opts.bg ?? this.def.encounters?.bg ?? 'bg_forest',
          boss: !!opts.boss,
          music: opts.music,
          noFlee: !!(opts.boss || opts.noFlee),
        });
        this.scene.sleep();
      });
    });
  }

  onWake(data) {
    const cam = this.cameras.main;
    cam.resetFX();
    cam.fadeIn(250, 0, 0, 0);
    Audio.play(this.def.music, { restart: true });
    // líder pode ter mudado (ex.: troca no menu)
    this.player.sprite.setTexture(`chr_${State.g.party[0].id}`);
    this.setFrame(this.player, 0);
    const r = this.battleResolve;
    this.battleResolve = null;
    if (r) r(data?.result === 'win');
  }

  // ---------------------------------------------------------------- API de scripts
  makeApi() {
    const S = this;
    const token = this.token;
    const wait = (ms) => new Promise((res) => S.time.delayedCall(ms, res));
    const find = (id) => (id === 'player' ? S.player : S.entities.find((e) => e.id === id && !e.removed));
    const walk = async (actor, path, ms) => {
      for (const ch of path) {
        if (!S.alive(token)) return;
        await S.moveActor(actor, PATH_DIR[ch], ms);
      }
    };
    return {
      say: (name, text, opts = {}) => S.msg.say(text, { name, ...opts }),
      ask: (name, question, options) => S.msg.choice(question, options, { name }),
      flag: (k) => flag(k),
      set: (k, v = true) => setFlag(k, v),
      hasItem: (id) => hasItem(id),
      partyHas: (id) => State.g.party.some((h) => h.id === id),
      give: (id, n = 1, silent = false) => {
        addItem(id, n);
        if (!silent) {
          Audio.sfx('item');
          return S.msg.say(`Obteve ${ITEMS[id].name}${n > 1 ? ` x${n}` : ''}!`);
        }
        return Promise.resolve();
      },
      gold: (n) => {
        State.g.gold += n;
      },
      join: (id) => {
        joinParty(id);
      },
      heal: () => healParty(),
      battle: (enemies, opts) => S.startBattle(enemies, opts),
      wait,
      fade: (dir, ms = 500) =>
        new Promise((res) => {
          const cam = S.cameras.main;
          if (dir === 'out') {
            cam.fadeOut(ms, 0, 0, 0);
            cam.once('camerafadeoutcomplete', res);
          } else {
            cam.fadeIn(ms, 0, 0, 0);
            cam.once('camerafadeincomplete', res);
          }
        }),
      shake: (ms = 300, i = 0.01) => {
        S.cameras.main.shake(ms, i);
        return wait(ms);
      },
      flash: (color = 0xffffff, ms = 250) => {
        S.cameras.main.flash(ms, (color >> 16) & 255, (color >> 8) & 255, color & 255);
        return wait(ms);
      },
      sfx: (id) => {
        Audio.sfx(id);
        return Promise.resolve();
      },
      music: (id) => {
        if (id) Audio.play(id);
        else Audio.stop(0.6);
        return Promise.resolve();
      },
      face: (id, dir) => {
        const a = find(id);
        if (a) S.face(a, dir);
        return Promise.resolve();
      },
      facingPlayer: (id) => {
        const a = find(id);
        if (!a) return 'down';
        const dx = S.player.x - a.x;
        const dy = S.player.y - a.y;
        return Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : dy > 0 ? 'down' : 'up';
      },
      move: (id, path, ms = 220) => {
        const a = find(id);
        return a ? walk(a, path, ms) : Promise.resolve();
      },
      movePlayer: async (path, ms = 165) => {
        await walk(S.player, path, ms);
        const g = State.g;
        g.map.x = S.player.x;
        g.map.y = S.player.y;
      },
      remove: (id) => {
        S.removeEntity(id, !id.startsWith('tmp') && !S.entities.find((e) => e.id === id)?.temp);
        return Promise.resolve();
      },
      spawn: (id, sprite, x, y, dir = 'down', alpha = 1) => {
        let a;
        if (S.textures.exists(`chr_${sprite}`)) a = S.makeActor(sprite, x, y, dir, alpha);
        else {
          const img = S.add.image(x * TILE + 8, y * TILE + TILE, `obj_${sprite}`).setOrigin(0.5, 1).setAlpha(alpha);
          a = { sprite: img, x, y, static: true };
          S.setDepth(a);
        }
        Object.assign(a, { id, kind: 'npc', ev: {}, solid: false, temp: true });
        S.entities.push(a);
        a.sprite.setAlpha(0);
        S.tweens.add({ targets: a.sprite, alpha, duration: 300 });
        return wait(300);
      },
      shop: (id) => S.openOverlay('Shop', { shopId: id }),
      inn: (price, name) => S.inn(price, name),
      save: () => S.openOverlay('SaveLoad', { mode: 'save' }),
      warp: (map, x, y, dir) => S.warpTo(map, x, y, dir),
      endChapter: () => {
        S.transitioning = true;
        S.scene.start('EndChapter');
        return new Promise(() => {});
      },
    };
  }

  async inn(price, name) {
    const c = await this.msg.choice(`Bem-vindos ao Corvo Branco. Uma noite custa ${price} moedas. Vão descansar?`, ['Sim', 'Não'], { name });
    if (c !== 0) {
      await this.msg.say('Volte quando quiser. Se ainda estiver vivo.', { name });
      return;
    }
    if (State.g.gold < price) {
      await this.msg.say('Sem moedas, sem cama. Sinto muito, querido.', { name });
      return;
    }
    State.g.gold -= price;
    const cam = this.cameras.main;
    await this.api.fade('out', 600);
    Audio.stop(0.3);
    Audio.sfx('save');
    healParty();
    await this.api.wait(1200);
    Audio.play(this.def.music, { restart: true });
    await this.api.fade('in', 600);
    cam.resetFX();
    await this.msg.say('Bom dia... se é que dá pra chamar isso de dia. HP e MP restaurados.', { name });
  }

  // ---------------------------------------------------------------- depuração
  setupDebug() {
    const kb = this.input.keyboard;
    kb.on('keydown-F1', () => {
      healParty();
      State.g.gold += 1000;
      this.showBanner('DEBUG: grupo curado, +1000 moedas');
    });
    kb.on('keydown-F2', () => {
      State.debugNoEncounters = !State.debugNoEncounters;
      this.showBanner(`DEBUG: encontros ${State.debugNoEncounters ? 'OFF' : 'ON'}`);
    });
    kb.on('keydown-F3', () => {
      for (const h of State.g.party) {
        gainExp(h, 1000);
        const s = heroStats(h);
        h.hp = s.maxHp;
        h.mp = s.maxMp;
      }
      this.showBanner('DEBUG: +1000 EXP');
    });
    kb.on('keydown-F4', async () => {
      if (this.busy || this.msg.active) return;
      const ids = Object.keys(MAPS);
      this.busy = true;
      const i = await this.msg.choice(null, [...ids, 'cancelar']);
      this.busy = false;
      if (i < ids.length) {
        const m = MAPS[ids[i]];
        const warp = Object.values(MAPS).flatMap((x) => x.events ?? []).find((e) => e.type === 'warp' && e.to === m.id);
        if (warp) this.warpTo(m.id, warp.tx, warp.ty, warp.dir);
      }
    });
    kb.on('keydown-F5', () => {
      if (!this.busy && this.def.encounters) this.randomBattle();
    });
  }
}
