// Combate por turnos: inimigos à esquerda, grupo à direita, ordem por agilidade.
import { UW, UH, COLORS } from '../config.js';
import { BATTLERS, BATTLEBACKS, MOTIONS } from '../data/mzAssets.js';

const FIELD_H = UH - 72; // altura do campo de batalha (acima das janelas)
const LOOP_MOTIONS = new Set(['walk', 'wait', 'chant', 'guard', 'dying', 'abnormal', 'sleep', 'dead', 'victory', 'escape']);
import { Controls } from '../core/Controls.js';
import { Audio } from '../core/Audio.js';
import { State, heroStats, heroSkills, heroProtects, gainExp, addItem, removeItem, itemCount } from '../core/GameState.js';
import { physDamage, magicDamage, healAmount, hitChance, critChance, fleeChance } from '../core/Formulas.js';
import { Win, MenuList, makeText, uiCamera } from '../ui/UI.js';
import { textWidth } from '../core/Font.js';
import { SKILLS, STATUS_NAMES } from '../data/skills.js';
import { ITEMS } from '../data/items.js';
import { ENEMIES } from '../data/enemies.js';
import { HEROES } from '../data/heroes.js';

const wait = (scene, ms) => new Promise((r) => scene.time.delayedCall(ms, r));
const STATUS_COLOR = { veneno: COLORS.green, pavor: COLORS.purple, sono: COLORS.blue, cego: COLORS.gray };

export class BattleScene extends Phaser.Scene {
  constructor() {
    super('Battle');
  }

  init(data) {
    this.opts = data;
  }

  create() {
    this.controls = new Controls(this);
    this.turn = 0;
    this.fleeAttempts = 0;
    this.ui = null;
    this.ended = false;
    this.waitingOk = null;
    uiCamera(this);
    this.addBattleback(this.opts.bg || 'bg_forest');
    this.add.rectangle(0, FIELD_H, UW, UH - FIELD_H, 0x000000).setOrigin(0);
    this.createCombatants();
    // animação contínua dos battlers (padrão 0-1-2-1 do MZ)
    this.time.addEvent({ delay: 170, loop: true, callback: () => this.tickMotions() });
    this.createWindows();
    Audio.play(this.opts.music || 'battle', { restart: true });
    this.cameras.main.fadeIn(200, 255, 255, 255);
    this.run();
  }

  // ------------------------------------------------------------ combatentes
  createCombatants() {
    const party = State.g.party;
    this.heroes = party.map((h, i) => {
      const s = heroStats(h);
      const x = 292 + i * 10;
      const y = 58 + i * 20;
      const sprite = this.add.sprite(x, y, `mz_sv_actors_${BATTLERS[h.id]}`, 0).setOrigin(0.5, 1).setScale(1 / 3).setDepth(10 + i);
      const c = {
        isHero: true, ref: h, id: h.id, name: HEROES[h.id].name,
        hp: h.hp, mp: h.mp, maxHp: s.maxHp, maxMp: s.maxMp,
        atk: s.atk, def: s.def, mag: s.mag, res: s.res, agi: s.agi, luck: s.luck,
        status: new Set(), buffs: null, protects: heroProtects(h), sprite, homeX: x, homeY: y,
      };
      c.motion = 'wait';
      c.pattern = 0;
      if (c.hp <= 0) this.koPose(c);
      else this.setMotion(c, this.baseMotion(c));
      return c;
    });
    const ids = this.opts.enemies;
    const pos = this.enemyPositions(ids);
    const counts = {};
    this.enemies = ids.map((id, i) => {
      const d = ENEMIES[id];
      counts[id] = (counts[id] ?? 0) + 1;
      const same = ids.filter((x) => x === id).length > 1;
      const [x, y] = pos[i];
      const key = `mz_enemies_${d.mz}`;
      const src = this.textures.get(key).getSourceImage();
      const maxH = d.boss ? 118 : 72;
      const maxW = d.boss ? 170 : 110;
      const sc = Math.min(1 / 3, maxH / src.height, maxW / src.width);
      const sprite = this.add.image(x, y, key).setOrigin(0.5, 1).setScale(sc).setDepth(5 + y / 100);
      const alpha = 1;
      sprite.setAlpha(alpha);
      return {
        isHero: false, def0: d, id, name: same ? `${d.name} ${String.fromCharCode(64 + counts[id])}` : d.name,
        hp: d.hp, mp: d.mp, maxHp: d.hp, maxMp: d.mp,
        atk: d.atk, def: d.def, mag: d.mag, res: d.res, agi: d.agi, luck: d.luck,
        shadow: !!d.shadow, weak: d.weak ?? {}, boss: !!d.boss,
        status: new Set(), buffs: null, protects: new Set(d.boss ? ['sono'] : []), sprite, homeX: x, homeY: y, baseAlpha: alpha,
      };
    });
  }

  enemyPositions(ids) {
    if (ids.length === 1) return [[ENEMIES[ids[0]].boss ? 120 : 112, ENEMIES[ids[0]].boss ? 128 : 118]];
    if (ids.length === 2) return [[72, 112], [168, 122]];
    if (ids.length === 3) return [[60, 106], [150, 112], [106, 130]];
    return ids.map((_, i) => [50 + (i % 2) * 90 + Math.floor(i / 2) * 24, 100 + Math.floor(i / 2) * 24 + (i % 2) * 8]);
  }

  // Fundo de batalha do MZ (chão + paredes), cobrindo a tela
  addBattleback(key) {
    const pair = BATTLEBACKS[key];
    if (!pair) {
      this.add.image(0, 0, key).setOrigin(0).setScale(UW / 320);
      return;
    }
    pair.forEach((name, i) => {
      const k = `mz_battlebacks${i + 1}_${name}`;
      if (!this.textures.exists(k)) return;
      const img = this.textures.get(k).getSourceImage();
      const sc = Math.max(UW / img.width, UH / img.height);
      this.add.image(UW / 2, UH / 2 - 14, k).setScale(sc);
    });
  }

  // ------------------------------------------------------------ battlers (motions do MZ)
  baseMotion(c) {
    if (c.hp <= 0) return 'dead';
    if (c.status.has('sono')) return 'sleep';
    if (c.defending) return 'guard';
    if (c.status.size) return 'abnormal';
    if (c.hp < c.maxHp / 4) return 'dying';
    return 'wait';
  }

  setMotion(c, motion) {
    if (!c.isHero) return;
    c.motion = motion;
    c.pattern = 0;
    this.applyMotionFrame(c);
  }

  applyMotionFrame(c) {
    const m = MOTIONS[c.motion] ?? 1;
    const seq = LOOP_MOTIONS.has(c.motion) ? [0, 1, 2, 1] : [0, 1, 2, 2];
    const p = c.motion === 'dead' ? 2 : seq[c.pattern % 4];
    c.sprite.setFrame((m % 6) * 9 + Math.floor(m / 6) * 3 + p);
  }

  tickMotions() {
    for (const h of this.heroes ?? []) {
      h.pattern++;
      if (!LOOP_MOTIONS.has(h.motion) && h.pattern >= 4) {
        h.motion = this.baseMotion(h);
        h.pattern = 0;
      }
      this.applyMotionFrame(h);
    }
  }

  motionFor(actor, act) {
    if (act.item) return 'item';
    const s = SKILLS[act.skill];
    if (!s || act.skill === 'attack') return actor.id === 'kael' ? 'missile' : actor.id === 'mirela' || actor.id === 'selene' ? 'thrust' : 'swing';
    if (s.type === 'phys') return 'skill';
    return 'spell';
  }

  alive(list) {
    return list.filter((c) => c.hp > 0);
  }

  opponents(c) {
    return c.isHero ? this.enemies : this.heroes;
  }

  allies(c) {
    return c.isHero ? this.heroes : this.enemies;
  }

  // ------------------------------------------------------------ janelas
  createWindows() {
    this.enemyWin = new Win(this, 0, FIELD_H, 136, UH - FIELD_H);
    this.partyWin = new Win(this, 136, FIELD_H, UW - 136, UH - FIELD_H);
    this.enemyTexts = [];
    this.partyTexts = [];
    this.refreshWindows();
    this.topWin = new Win(this, 4, 4, UW - 8, 20, { depth: 12000 });
    this.topText = this.topWin.text(10, 5, '');
    this.topWin.setVisible(false);
  }

  refreshWindows(active = null) {
    this.enemyTexts.forEach((t) => t.destroy());
    this.enemyTexts = [];
    const names = [];
    for (const e of this.alive(this.enemies)) {
      const base = e.def0.name;
      const n = names.find((x) => x.n === base);
      if (n) n.c++;
      else names.push({ n: base, c: 1 });
    }
    names.slice(0, 5).forEach((n, i) => {
      this.enemyTexts.push(this.enemyWin.text(10, 6 + i * 12, n.n.length > 20 ? `${n.n.slice(0, 19)}.` : n.n));
      if (n.c > 1) this.enemyTexts.push(this.enemyWin.textRight(128, 6 + i * 12, `x${n.c}`, COLORS.gray));
    });
    this.partyTexts.forEach((t) => t.destroy());
    this.partyTexts = [];
    this.heroes.forEach((h, i) => {
      const y = 5 + i * 15.5;
      let color = COLORS.white;
      if (h.hp <= 0) color = COLORS.red;
      else if (h === active) color = COLORS.yellow;
      else if (h.status.size) color = STATUS_COLOR[[...h.status][0]] ?? COLORS.white;
      this.partyTexts.push(this.partyWin.text(10, y, h.name, color));
      const hpColor = h.hp <= 0 ? COLORS.red : h.hp < h.maxHp / 4 ? COLORS.orange : COLORS.white;
      this.partyTexts.push(this.partyWin.textRight(160, y, `${h.hp}/${h.maxHp}`, hpColor));
      this.partyTexts.push(this.partyWin.textRight(222, y, `${h.mp}`, COLORS.blue));
      if (h.status.size && h.hp > 0) {
        const st = [...h.status].map((s) => STATUS_NAMES[s][0]).join('');
        this.partyTexts.push(this.partyWin.text(62, y, st, STATUS_COLOR[[...h.status][0]]));
      }
    });
  }

  async banner(text, ms = 700) {
    this.topText.setText(text);
    this.topText.setX(Math.round((UW - 8 - textWidth(text)) / 2));
    this.topWin.setVisible(true);
    await wait(this, ms);
  }

  hideBanner() {
    this.topWin.setVisible(false);
  }

  // ------------------------------------------------------------ fluxo
  async run() {
    await wait(this, 300);
    const boss = this.enemies.find((e) => e.boss);
    await this.banner(boss ? `${boss.name} desperta!` : 'Algo surge das sombras!', 1000);
    this.hideBanner();
    while (!this.ended) {
      this.turn++;
      for (const h of this.heroes) h.defending = false;
      for (const e of this.enemies) e.defending = false;
      const choice = await this.chooseCommands();
      let actions = [];
      if (choice.flee) {
        const ok = await this.tryFlee();
        if (ok) return;
      } else actions = choice;
      for (const act of actions) if (act.defend) act.actor.defending = true;
      for (const e of this.alive(this.enemies)) actions.push(this.enemyAction(e));
      for (const act of actions) act.speed = act.actor.agi * (0.8 + Math.random() * 0.4) + (act.defend ? 1000 : 0);
      actions.sort((a, b) => b.speed - a.speed);
      for (const act of actions) {
        if (this.ended) break;
        if (act.actor.hp <= 0) continue;
        if (!(await this.preAction(act.actor))) continue;
        await this.execute(act);
        this.refreshWindows();
        if (await this.checkEnd()) return;
      }
      if (this.ended) return;
      await this.endOfRound();
      if (await this.checkEnd()) return;
    }
  }

  canAct(h) {
    return h.hp > 0 && !h.status.has('sono');
  }

  chooseCommands() {
    return new Promise((resolve) => {
      const actors = this.heroes.filter((h) => this.canAct(h));
      const actions = [];
      let i = 0;
      const next = () => {
        if (i >= actors.length) {
          this.refreshWindows();
          resolve(actions);
          return;
        }
        const hero = actors[i];
        this.commandMenu(hero, (act) => {
          this.heroStep(hero, false);
          if (act === 'back') {
            if (i > 0) {
              i--;
              actions.pop();
            }
            next();
            return;
          }
          if (act.flee) {
            this.refreshWindows();
            resolve({ flee: true });
            return;
          }
          actions.push(act);
          i++;
          next();
        });
      };
      next();
    });
  }

  heroStep(h, forward, ms = 120) {
    if (h.hp <= 0) return Promise.resolve();
    if (!forward && h.motion === 'walk') this.setMotion(h, this.baseMotion(h));
    return new Promise((r) => this.tweens.add({ targets: h.sprite, x: h.homeX - (forward ? 16 : 0), duration: ms, onComplete: r }));
  }

  // ------------------------------------------------------------ menus
  commandMenu(hero, done) {
    this.refreshWindows(hero);
    this.heroStep(hero, true);
    this.setMotion(hero, 'walk');
    const win = new Win(this, 0, FIELD_H, 136, UH - FIELD_H, { depth: 11000 });
    const items = [
      { label: 'Atacar', v: 'attack' },
      { label: 'Habilidade', v: 'skill', enabled: heroSkills(hero.ref).length > 0 },
      { label: 'Item', v: 'item' },
      { label: 'Defender', v: 'defend' },
      { label: 'Fugir', v: 'flee', enabled: !this.opts.noFlee },
    ];
    const close = () => {
      list.destroy();
      win.destroy();
      this.ui = null;
    };
    const list = new MenuList(this, win, {
      x: 12, y: 5, width: 120, rowH: 12.5, items,
      onSelect: (it) => {
        if (it.v === 'attack') {
          list.setActive(false);
          this.selectTarget(hero, 'enemy', (targets) => {
            if (!targets) {
              list.setActive(true);
              this.ui = list;
              return;
            }
            close();
            done({ actor: hero, skill: 'attack', targets });
          });
        } else if (it.v === 'skill') {
          list.setActive(false);
          this.skillMenu(hero, (act) => {
            if (!act) {
              list.setActive(true);
              this.ui = list;
              return;
            }
            close();
            done(act);
          });
        } else if (it.v === 'item') {
          list.setActive(false);
          this.itemMenu(hero, (act) => {
            if (!act) {
              list.setActive(true);
              this.ui = list;
              return;
            }
            close();
            done(act);
          });
        } else if (it.v === 'defend') {
          close();
          done({ actor: hero, defend: true });
        } else if (it.v === 'flee') {
          close();
          done({ flee: true });
        }
      },
      onCancel: () => {
        close();
        done('back');
      },
    });
    this.ui = list;
  }

  listWindow(entries, onPick, onCancel) {
    const win = new Win(this, 0, FIELD_H, UW, UH - FIELD_H, { depth: 11500 });
    const close = () => {
      list.destroy();
      win.destroy();
      this.hideBanner();
    };
    const showDesc = (it) => {
      if (it && it.desc) {
        this.topText.setText(it.desc);
        this.topText.setX(10);
        this.topWin.setVisible(true);
      } else this.hideBanner();
    };
    const list = new MenuList(this, win, {
      x: 12, y: 6, width: UW - 20, cols: 2, colW: 174, rowH: 12, visibleRows: 5, items: entries,
      onChange: showDesc,
      onSelect: (it) => {
        list.setActive(false);
        onPick(it, () => {
          list.setActive(true);
          this.ui = list;
          showDesc(list.current());
        }, close);
      },
      onCancel: () => {
        close();
        onCancel();
      },
    });
    showDesc(list.current());
    this.ui = list;
    return list;
  }

  skillMenu(hero, done) {
    const entries = heroSkills(hero.ref).map((id) => {
      const s = SKILLS[id];
      const cost = s.hpCost ? `${Math.ceil(hero.maxHp * s.hpCost)}HP` : `${s.mp ?? 0}`;
      const ok = s.hpCost ? hero.hp > Math.ceil(hero.maxHp * s.hpCost) : hero.mp >= (s.mp ?? 0);
      return { label: s.name, right: cost, enabled: ok, id, desc: s.desc };
    });
    const prev = this.ui;
    this.listWindow(
      entries,
      (it, back, close) => {
        const s = SKILLS[it.id];
        this.selectTarget(hero, s.target, (targets) => {
          if (!targets) return back();
          close();
          done({ actor: hero, skill: it.id, targets });
        });
      },
      () => {
        this.ui = prev;
        done(null);
      },
    );
  }

  itemMenu(hero, done) {
    const entries = Object.keys(State.g.inventory)
      .filter((id) => ITEMS[id]?.battle)
      .map((id) => ({ label: ITEMS[id].name, right: `${itemCount(id)}`, id, desc: ITEMS[id].desc }));
    if (!entries.length) {
      Audio.sfx('buzzer');
      this.banner('Nenhum item utilizável.', 600).then(() => this.hideBanner());
      done(null);
      return;
    }
    const prev = this.ui;
    this.listWindow(
      entries,
      (it, back, close) => {
        this.selectTarget(hero, ITEMS[it.id].target, (targets) => {
          if (!targets) return back();
          close();
          done({ actor: hero, item: it.id, targets });
        });
      },
      () => {
        this.ui = prev;
        done(null);
      },
    );
  }

  selectTarget(actor, kind, cb) {
    const opp = this.opponents(actor);
    const own = this.allies(actor);
    let pool;
    let all = false;
    if (kind === 'self') return cb([actor]);
    if (kind === 'enemy') pool = this.alive(opp);
    else if (kind === 'allEnemies') {
      pool = this.alive(opp);
      all = true;
    } else if (kind === 'ally') pool = this.alive(own);
    else if (kind === 'allParty') {
      pool = this.alive(own);
      all = true;
    } else if (kind === 'deadAlly') pool = own.filter((c) => c.hp <= 0);
    if (!pool || !pool.length) {
      Audio.sfx('buzzer');
      cb(null);
      return;
    }
    const prevUi = this.ui;
    let idx = 0;
    if (kind === 'ally' || kind === 'deadAlly') idx = Math.max(0, pool.indexOf(actor));
    const cursors = [];
    const place = () => {
      cursors.forEach((c) => c.destroy());
      cursors.length = 0;
      const targets = all ? pool : [pool[idx]];
      for (const t of targets) {
        const b = t.sprite.getBounds();
        const c = this.add.image(b.x - 1, b.y + Math.min(b.height / 2, 14), 'cursor').setOrigin(1, 0.5).setDepth(13000);
        if (all) this.tweens.add({ targets: c, alpha: 0.3, duration: 150, yoyo: true, repeat: -1 });
        cursors.push(c);
      }
      if (!all) {
        this.topText.setText(pool[idx].name);
        this.topText.setX(Math.round((UW - 8 - textWidth(pool[idx].name)) / 2));
        this.topWin.setVisible(true);
      }
    };
    place();
    const finish = (res) => {
      cursors.forEach((c) => c.destroy());
      this.hideBanner();
      this.ui = prevUi;
      cb(res);
    };
    this.ui = {
      update: (c) => {
        if (!all && (c.repeat('up') || c.repeat('left'))) {
          idx = (idx + pool.length - 1) % pool.length;
          Audio.sfx('cursor');
          place();
        } else if (!all && (c.repeat('down') || c.repeat('right'))) {
          idx = (idx + 1) % pool.length;
          Audio.sfx('cursor');
          place();
        } else if (c.pressed('ok')) {
          Audio.sfx('confirm');
          finish(all ? pool : [pool[idx]]);
        } else if (c.pressed('cancel')) {
          Audio.sfx('cancel');
          finish(null);
        }
      },
    };
  }

  update() {
    this.controls.update();
    if (this.ui && this.ui.update) this.ui.update(this.controls);
    if (this.waitingOk && (this.controls.pressed('ok') || this.controls.pressed('cancel'))) {
      const r = this.waitingOk;
      this.waitingOk = null;
      r();
    }
  }

  waitOk() {
    return new Promise((r) => {
      this.waitingOk = r;
    });
  }

  // ------------------------------------------------------------ IA inimiga
  enemyAction(e) {
    const d = e.def0;
    const pick = (list) => {
      const total = list.reduce((a, [, w]) => a + w, 0);
      let r = Math.random() * total;
      for (const [id, w] of list) {
        r -= w;
        if (r <= 0) return id;
      }
      return list[0][0];
    };
    const skill = d.ai ? d.ai(e, { turn: this.turn, pick }) : pick(d.actions ?? [['attack', 1]]);
    return { actor: e, skill, targets: null };
  }

  resolveTargets(act) {
    const s = act.item ? { target: ITEMS[act.item].target } : SKILLS[act.skill];
    const a = act.actor;
    const opp = this.alive(this.opponents(a));
    const own = this.allies(a);
    switch (s.target) {
      case 'self':
        return [a];
      case 'allEnemies':
        return opp;
      case 'allParty':
        return this.alive(own);
      case 'deadAlly': {
        const t = act.targets?.filter((x) => x.hp <= 0) ?? [];
        return t;
      }
      case 'ally': {
        const t = act.targets?.filter((x) => x.hp > 0) ?? [];
        if (t.length) return t;
        return a.isHero ? [] : [this.alive(own).sort((x, y) => x.hp / x.maxHp - y.hp / y.maxHp)[0]].filter(Boolean);
      }
      default: {
        const t = act.targets?.filter((x) => x.hp > 0) ?? [];
        if (t.length) return t;
        if (!opp.length) return [];
        return [opp[Math.floor(Math.random() * opp.length)]];
      }
    }
  }

  // ------------------------------------------------------------ execução
  async preAction(c) {
    if (c.status.has('sono')) {
      if (Math.random() < 0.3) {
        c.status.delete('sono');
        await this.banner(`${c.name} acordou!`, 600);
      } else {
        await this.banner(`${c.name} está dormindo...`, 600);
        this.hideBanner();
        return false;
      }
    }
    if (c.status.has('pavor') && Math.random() < 0.35) {
      Audio.sfx('heart');
      this.shakeSprite(c);
      await this.banner(`${c.name} está paralisado de pavor!`, 800);
      this.hideBanner();
      return false;
    }
    return true;
  }

  async execute(act) {
    const a = act.actor;
    if (act.defend) {
      await this.banner(`${a.name} se defende.`, 450);
      this.hideBanner();
      return;
    }
    const targets = this.resolveTargets(act);
    if (!targets.length) return;
    if (a.isHero) await this.heroStep(a, true, 140);
    else await this.enemyBlink(a);

    if (act.item) {
      const it = ITEMS[act.item];
      if (itemCount(act.item) <= 0) {
        await this.banner('O item acabou!', 500);
      } else {
        removeItem(act.item);
        await this.banner(it.name, 450);
        for (const t of targets) await this.applyItem(a, t, it);
      }
    } else {
      const s = SKILLS[act.skill];
      if (s.mp) {
        if (a.isHero && a.mp < s.mp) {
          await this.banner(`MP insuficiente!`, 500);
          this.hideBanner();
          if (a.isHero) await this.heroStep(a, false);
          return;
        }
        if (a.isHero) a.mp -= s.mp;
      }
      if (s.hpCost) {
        const cost = Math.ceil(a.maxHp * s.hpCost);
        a.hp = Math.max(1, a.hp - cost);
        this.popup(a, `-${cost}`, COLORS.red);
      }
      if (act.skill !== 'attack') await this.banner(s.name, 450);
      if (a.isHero) this.setMotion(a, this.motionFor(a, act));
      await this.playAnim(s.anim ?? 'slash', targets, a);
      for (const t of targets) await this.applySkill(a, t, s);
    }
    this.hideBanner();
    if (a.isHero && a.hp > 0) await this.heroStep(a, false, 140);
    await wait(this, 120);
  }

  async applySkill(a, t, s) {
    if (t.hp <= 0 && s.type !== 'revive') return;
    switch (s.type) {
      case 'phys': {
        const hits = s.hits ?? 1;
        for (let i = 0; i < hits; i++) {
          if (t.hp <= 0) break;
          if (Math.random() > hitChance(a, t)) {
            Audio.sfx('miss');
            this.popup(t, 'Errou', COLORS.gray);
            await wait(this, 250);
            continue;
          }
          const crit = s.crit || Math.random() < critChance(a);
          const dmg = physDamage(a, t, s.power ?? 1, crit, s.element);
          if (crit) {
            Audio.sfx('crit');
            this.cameras.main.shake(150, 0.008);
          } else Audio.sfx('hit');
          await this.damage(t, dmg, crit);
          if (s.drain && a.hp > 0) this.heal(a, Math.round(dmg / 2));
          if (i < hits - 1) await wait(this, 180);
        }
        if (t.hp > 0 && s.status) await this.tryStatus(t, s.status);
        break;
      }
      case 'magic': {
        const dmg = magicDamage(a, t, s.power, s.element);
        if (dmg <= 0) {
          this.popup(t, 'Imune', COLORS.gray);
          await wait(this, 300);
          break;
        }
        await this.damage(t, dmg);
        if (s.drain && a.hp > 0) this.heal(a, Math.round(dmg / 2));
        if (t.hp > 0 && s.status) await this.tryStatus(t, s.status);
        break;
      }
      case 'heal': {
        const amt = healAmount(a, s.power);
        if (t.shadow) await this.damage(t, amt);
        else this.heal(t, amt);
        await wait(this, 250);
        break;
      }
      case 'revive': {
        if (t.hp > 0) break;
        t.hp = Math.max(1, Math.round(t.maxHp * s.power));
        this.revivePose(t);
        this.popup(t, `${t.hp}`, COLORS.green);
        await wait(this, 300);
        break;
      }
      case 'cleanse':
        t.status.clear();
        this.popup(t, 'Curado', COLORS.green);
        await wait(this, 250);
        break;
      case 'buff':
        if (s.cure) s.cure.forEach((st) => t.status.delete(st));
        t.buffs = { ...s.buff, turns: s.turns ?? 3 };
        this.popup(t, 'Protegido', COLORS.blue);
        await wait(this, 200);
        break;
      case 'status':
        await this.tryStatus(t, s.status, true);
        break;
      case 'steal':
        await this.steal(a, t);
        break;
      default:
        break;
    }
    this.refreshWindows();
  }

  async applyItem(a, t, it) {
    const u = it.use;
    if (u.revive) {
      if (t.hp > 0) return;
      t.hp = Math.max(1, Math.round(t.maxHp * u.revive));
      this.revivePose(t);
      Audio.sfx('heal');
      this.popup(t, `${t.hp}`, COLORS.green);
    }
    if (t.hp <= 0) return;
    if (u.damage) {
      await this.playAnim(u.element === 'luz' ? 'light' : 'slash', [t], a);
      const mult = t.weak?.[u.element] ?? 1;
      await this.damage(t, Math.round(u.damage * mult));
    }
    if (u.heal) {
      Audio.sfx('heal');
      await this.playAnim('heal', [t], a);
      if (t.shadow) await this.damage(t, u.heal);
      else this.heal(t, u.heal);
    }
    if (u.mp) {
      Audio.sfx('heal');
      t.mp = Math.min(t.maxMp, t.mp + u.mp);
      this.popup(t, `${u.mp}`, COLORS.blue);
    }
    if (u.cure) {
      u.cure.forEach((st) => t.status.delete(st));
      if (!u.heal) {
        Audio.sfx('heal');
        this.popup(t, 'Curado', COLORS.green);
      }
    }
    this.refreshWindows();
    await wait(this, 300);
  }

  async tryStatus(t, statuses, announceFail = false) {
    let any = false;
    for (const [st, chance] of Object.entries(statuses)) {
      if (t.hp <= 0) return;
      if (t.protects.has(st)) continue;
      let c = chance;
      if (t.boss) c *= st === 'sono' ? 0 : 0.35;
      if (t.status.has(st) || Math.random() > c) continue;
      t.status.add(st);
      any = true;
      this.popup(t, STATUS_NAMES[st], STATUS_COLOR[st] ?? COLORS.white, -10);
      await wait(this, 300);
    }
    if (!any && announceFail) {
      this.popup(t, 'Falhou', COLORS.gray);
      await wait(this, 300);
    }
    this.refreshWindows();
  }

  async steal(a, t) {
    const d = t.def0;
    if (!d || !d.steal || t.stolen) {
      await this.banner('Não há nada para roubar.', 600);
      return;
    }
    const chance = (d.stealRate ?? 0.55) * (1 + (a.luck - t.luck) / 40);
    Audio.sfx('steal');
    if (Math.random() < chance) {
      t.stolen = true;
      addItem(d.steal);
      await this.banner(`Roubou ${ITEMS[d.steal].name}!`, 800);
    } else await this.banner('Falhou em roubar!', 600);
  }

  heal(t, amt) {
    t.hp = Math.min(t.maxHp, t.hp + amt);
    this.popup(t, `${amt}`, COLORS.green);
    this.refreshWindows();
  }

  async damage(t, dmg, crit = false) {
    t.hp = Math.max(0, t.hp - dmg);
    if (t.status.has('sono') && Math.random() < 0.6) t.status.delete('sono');
    this.popup(t, `${dmg}`, crit ? COLORS.yellow : COLORS.white);
    this.shakeSprite(t);
    if (t.isHero) {
      if (t.hp > 0) this.setMotion(t, 'damage');
      t.sprite.setTint(0xff6060);
      this.time.delayedCall(160, () => t.sprite.clearTint());
    } else {
      t.sprite.setTintFill(0xffffff);
      this.time.delayedCall(80, () => t.sprite.clearTint());
    }
    this.refreshWindows();
    if (t.hp <= 0) await this.kill(t);
    else await wait(this, 200);
  }

  async kill(t) {
    if (t.isHero) {
      t.status.clear();
      t.buffs = null;
      this.koPose(t);
      await wait(this, 300);
      return;
    }
    Audio.sfx('death');
    t.sprite.setTint(0xb02040);
    await new Promise((r) =>
      this.tweens.add({ targets: t.sprite, alpha: 0, scaleX: 1.1, scaleY: 0.2, y: t.homeY, duration: 450, ease: 'Quad.easeIn', onComplete: r }),
    );
    t.sprite.setVisible(false);
    this.refreshWindows();
  }

  koPose(h) {
    h.sprite.setPosition(h.homeX, h.homeY);
    this.setMotion(h, 'dead');
  }

  revivePose(h) {
    h.sprite.clearTint().setPosition(h.homeX, h.homeY);
    this.setMotion(h, 'wait');
  }

  shakeSprite(c) {
    const x0 = c.sprite.x;
    this.tweens.add({ targets: c.sprite, x: x0 + 3, duration: 40, yoyo: true, repeat: 2, onComplete: () => c.sprite.setX(x0) });
  }

  popup(t, text, color, dy = 0) {
    const b = t.sprite.getBounds();
    const x = Math.round(b.centerX - textWidth(text) / 2);
    const y = Math.round(b.y + Math.min(b.height * 0.4, 20) + dy);
    const txt = makeText(this, x, y, text, color).setDepth(14000);
    this.tweens.add({ targets: txt, y: y - 10, duration: 160, yoyo: true, ease: 'Quad.easeOut' });
    this.tweens.add({ targets: txt, alpha: 0, delay: 750, duration: 250, onComplete: () => txt.destroy() });
  }

  enemyBlink(e) {
    return new Promise((r) => {
      let n = 0;
      const ev = this.time.addEvent({
        delay: 70,
        repeat: 5,
        callback: () => {
          n++;
          if (n % 2) e.sprite.setTintFill(0xffffff);
          else e.sprite.clearTint();
          if (n >= 6) r();
        },
      });
      return ev;
    });
  }

  // ------------------------------------------------------------ animações
  async playAnim(kind, targets, actor) {
    const tasks = targets.map((t) => this.animOn(kind, t, actor));
    await Promise.all(tasks);
  }

  animOn(kind, t, actor) {
    const b = t.sprite.getBounds();
    const cx = b.centerX;
    const cy = b.centerY;
    const depth = 13500;
    return new Promise((resolve) => {
      const done = () => resolve();
      const fx = (key, tint, props) => {
        const img = this.add.image(cx, cy, key).setDepth(depth).setTint(tint);
        if (props.flip) img.setFlipX(true);
        this.tweens.add({ targets: img, ...props.tw, onComplete: () => img.destroy() });
        return img;
      };
      switch (kind) {
        case 'slash':
        case 'crit':
          Audio.sfx('slash');
          fx('fx_slash', kind === 'crit' ? 0xffe070 : 0xffffff, { flip: !actor.isHero, tw: { alpha: 0, scale: 1.4, duration: 260 } });
          this.time.delayedCall(200, done);
          break;
        case 'claw':
          Audio.sfx('slash');
          fx('fx_claw', actor.isHero ? 0xffffff : 0xff8080, { flip: actor.isHero, tw: { alpha: 0, duration: 280 } });
          this.time.delayedCall(220, done);
          break;
        case 'fire':
          Audio.sfx('fire');
          for (let i = 0; i < 10; i++) {
            const p = this.add.image(cx + (Math.random() - 0.5) * b.width * 0.8, b.bottom - 4, 'fx_flame').setDepth(depth);
            p.setTint(i % 2 ? 0xf8a030 : 0xe03020).setScale(1 + Math.random());
            this.tweens.add({ targets: p, y: p.y - 20 - Math.random() * 25, alpha: 0, delay: i * 30, duration: 450, onComplete: () => p.destroy() });
          }
          this.time.delayedCall(500, done);
          break;
        case 'light':
          Audio.sfx('light');
          {
            const r = this.add.image(cx, cy, 'fx_ring').setDepth(depth).setTint(0xfff8d0);
            this.tweens.add({ targets: r, scale: 4, alpha: 0, duration: 450, onComplete: () => r.destroy() });
            for (let i = 0; i < 8; i++) {
              const s = this.add.image(cx, cy, 'fx_spark').setDepth(depth).setTint(0xffffe0);
              const a = (i / 8) * Math.PI * 2;
              this.tweens.add({ targets: s, x: cx + Math.cos(a) * 24, y: cy + Math.sin(a) * 24, alpha: 0, duration: 420, onComplete: () => s.destroy() });
            }
          }
          this.time.delayedCall(450, done);
          break;
        case 'dark':
          Audio.sfx('dark');
          {
            const r = this.add.image(cx, cy, 'fx_ring').setDepth(depth).setTint(0x9040c0).setScale(4);
            this.tweens.add({ targets: r, scale: 0.3, alpha: 0.2, duration: 450, onComplete: () => r.destroy() });
            t.sprite.setTint(0x8040a0);
            this.time.delayedCall(450, () => t.sprite.clearTint());
          }
          this.time.delayedCall(450, done);
          break;
        case 'heal':
          Audio.sfx('heal');
          for (let i = 0; i < 8; i++) {
            const p = this.add.image(cx + (Math.random() - 0.5) * 16, b.bottom - 2, 'fx_spark').setDepth(depth).setTint(0x80ff90);
            this.tweens.add({ targets: p, y: p.y - 26, alpha: 0, delay: i * 40, duration: 450, onComplete: () => p.destroy() });
          }
          this.time.delayedCall(450, done);
          break;
        case 'poison':
          Audio.sfx('poison');
          for (let i = 0; i < 8; i++) {
            const p = this.add.image(cx + (Math.random() - 0.5) * b.width * 0.7, cy + (Math.random() - 0.5) * 10, 'fx_dot').setDepth(depth).setTint(0x70d040);
            this.tweens.add({ targets: p, y: p.y - 14, scale: 2, alpha: 0, delay: i * 40, duration: 400, onComplete: () => p.destroy() });
          }
          this.time.delayedCall(420, done);
          break;
        case 'sleep':
          Audio.sfx('sleep');
          {
            const r = this.add.image(cx, cy, 'fx_ring').setDepth(depth).setTint(0x80a0ff);
            this.tweens.add({ targets: r, scale: 3, alpha: 0, duration: 450, onComplete: () => r.destroy() });
          }
          this.time.delayedCall(450, done);
          break;
        case 'steal':
          this.time.delayedCall(150, done);
          break;
        default:
          done();
      }
    });
  }

  // ------------------------------------------------------------ rodada / fim
  async endOfRound() {
    for (const c of [...this.heroes, ...this.enemies]) {
      if (c.hp <= 0) continue;
      if (c.status.has('veneno')) {
        const dmg = Math.max(1, Math.floor(c.maxHp / (c.boss ? 30 : 12)));
        Audio.sfx('poison');
        c.hp = Math.max(c.isHero ? 1 : 0, c.hp - dmg);
        this.popup(c, `${dmg}`, COLORS.green);
        if (c.hp <= 0) await this.kill(c);
        await wait(this, 200);
      }
      if (c.status.has('pavor') && Math.random() < 0.25) c.status.delete('pavor');
      if (c.status.has('cego') && Math.random() < 0.15) c.status.delete('cego');
      if (c.buffs && --c.buffs.turns <= 0) c.buffs = null;
    }
    this.refreshWindows();
  }

  async checkEnd() {
    if (this.ended) return true;
    if (!this.alive(this.enemies).length) {
      await this.victory();
      return true;
    }
    if (!this.alive(this.heroes).length) {
      await this.defeat();
      return true;
    }
    return false;
  }

  writeBack() {
    for (const h of this.heroes) {
      h.ref.hp = h.hp;
      h.ref.mp = h.mp;
      h.ref.status = [];
    }
  }

  async victory() {
    this.ended = true;
    this.ui = null;
    Audio.play('victory', { restart: true });
    for (const h of this.alive(this.heroes)) {
      this.setMotion(h, 'victory');
    }
    const exp = this.enemies.reduce((a, e) => a + e.def0.exp, 0);
    const gold = this.enemies.reduce((a, e) => a + e.def0.gold, 0);
    State.g.gold += gold;
    const drops = [];
    for (const e of this.enemies) for (const [id, ch] of e.def0.drops ?? []) if (Math.random() < ch) drops.push(id);
    drops.forEach((d) => addItem(d));
    this.writeBack();
    const lines = ['Vitória!', `Ganhou ${exp} de EXP e ${gold} moedas.`];
    for (const d of drops) lines.push(`Obteve ${ITEMS[d].name}!`);
    for (const h of this.heroes) {
      const ups = gainExp(h.ref, exp);
      for (const up of ups) {
        lines.push(`${h.name} subiu para o nível ${up.level}!`);
        for (const sk of up.skills) lines.push(`${h.name} aprendeu ${SKILLS[sk].name}!`);
      }
      if (ups.length) lines.levelUp = true;
    }
    await this.showLines(lines);
    this.finish('win');
  }

  async showLines(lines) {
    const win = new Win(this, 20, 60, 280, 40, { depth: 15000 });
    const t = win.text(12, 8, '');
    for (const l of lines) {
      if (/subiu para o nível/.test(l)) Audio.sfx('levelup');
      t.setText(l);
      await Promise.race([this.waitOk(), wait(this, 2500)]);
      this.waitingOk = null;
      await wait(this, 80);
    }
    win.destroy();
  }

  async defeat() {
    this.ended = true;
    this.ui = null;
    Audio.stop(0.5);
    await this.banner('O grupo foi derrotado...', 1500);
    this.cameras.main.fadeOut(900, 0, 0, 0);
    await wait(this, 1000);
    this.scene.stop('Map');
    this.scene.start('GameOver');
  }

  async tryFlee() {
    this.fleeAttempts++;
    const ok = Math.random() < fleeChance(this.alive(this.heroes), this.alive(this.enemies), this.fleeAttempts - 1);
    if (ok) {
      this.ended = true;
      Audio.sfx('run');
      for (const h of this.alive(this.heroes)) {
        this.setMotion(h, 'escape');
        h.sprite.setFlipX(true);
        this.tweens.add({ targets: h.sprite, x: h.homeX + 80, duration: 500 });
      }
      await this.banner('Fugiram!', 700);
      this.writeBack();
      this.finish('flee');
      return true;
    }
    Audio.sfx('buzzer');
    await this.banner('Não conseguiram fugir!', 800);
    this.hideBanner();
    return false;
  }

  finish(result) {
    this.cameras.main.fadeOut(250, 0, 0, 0);
    this.time.delayedCall(260, () => {
      this.scene.stop();
      this.scene.wake('Map', { result });
    });
  }
}
