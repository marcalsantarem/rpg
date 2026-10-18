// Menu principal (sobreposto ao mapa): itens, habilidades, equipamento, status, ordem, salvar, config.
import { W, H, COLORS } from '../config.js';
import { Controls } from '../core/Controls.js';
import { Audio } from '../core/Audio.js';
import { Settings } from '../core/Settings.js';
import { State, heroStats, heroSkills, heroBaseStats, itemCount, removeItem, equip, formatTime } from '../core/GameState.js';
import { Win, MenuList, drawBar } from '../ui/UI.js';
import { wrapText } from '../core/Font.js';
import { HEROES, expForLevel } from '../data/heroes.js';
import { ITEMS, canEquip, STAT_NAMES } from '../data/items.js';
import { SKILLS } from '../data/skills.js';
import { MAP_NAMES } from '../data/maps/index.js';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super('Menu');
  }

  init(data) {
    this.opts = data || {};
  }

  create() {
    this.controls = new Controls(this);
    this.stack = [];
    this.buildMain();
  }

  update(time) {
    this.controls.update();
    if (this.timeText) this.timeText.setText(formatTime(State.g.playTime));
    const top = this.stack[this.stack.length - 1];
    if (top && top.update) top.update(this.controls);
  }

  push(page) {
    this.stack.push(page);
  }

  pop() {
    const p = this.stack.pop();
    if (p && p.destroy) p.destroy();
  }

  close() {
    while (this.stack.length) this.pop();
    this.scene.stop();
    this.scene.resume(this.opts.parent || 'Map');
  }

  // ------------------------------------------------------------ principal
  buildMain() {
    const objs = [];
    const partyWin = new Win(this, 0, 0, 232, H);
    objs.push(partyWin);
    this.partyWin = partyWin;
    this.drawParty();

    const cmdWin = new Win(this, 232, 0, 88, 134);
    objs.push(cmdWin);
    const locWin = new Win(this, 232, 134, 88, 46);
    objs.push(locWin);
    const name = MAP_NAMES[State.g.map.id] ?? '';
    wrapText(name, 72).slice(0, 2).forEach((l, i) => locWin.text(8, 8 + i * 13, l, COLORS.gray));
    const infoWin = new Win(this, 232, 180, 88, 60);
    objs.push(infoWin);
    infoWin.text(8, 7, 'Moedas', COLORS.gray);
    this.goldText = infoWin.textRight(80, 19, `${State.g.gold}`);
    infoWin.text(8, 32, 'Tempo', COLORS.gray);
    this.timeText = infoWin.textRight(80, 44, formatTime(State.g.playTime));

    const list = new MenuList(this, cmdWin, {
      x: 20, y: 8, width: 64, rowH: 15,
      items: [
        { label: 'Itens', v: 'items' },
        { label: 'Habilid.', v: 'skills' },
        { label: 'Equipar', v: 'equip' },
        { label: 'Status', v: 'status' },
        { label: 'Ordem', v: 'order', enabled: State.g.party.length > 1 },
        { label: 'Salvar', v: 'save', enabled: !!this.opts.canSave },
        { label: 'Config.', v: 'config' },
        { label: 'Título', v: 'title' },
      ],
      onSelect: (it) => this.mainSelect(it.v, list),
      onCancel: () => this.close(),
    });
    this.mainList = list;
    this.push({
      update: (c) => list.update(c),
      destroy: () => {
        list.destroy();
        objs.forEach((o) => o.destroy());
      },
    });
  }

  drawParty(highlight = -1) {
    const win = this.partyWin;
    if (this.partyObjs) this.partyObjs.forEach((o) => o.destroy());
    this.partyObjs = [];
    const g = this.add.graphics().setScrollFactor(0);
    win.add(g);
    this.partyObjs.push(g);
    State.g.party.forEach((h, i) => {
      const y = 8 + i * 58;
      const def = HEROES[h.id];
      const s = heroStats(h);
      const spr = this.add.image(28, y + 30, `chr_${def.sprite}`, 0).setOrigin(0.5, 1);
      if (h.hp <= 0) spr.setTint(0x806070);
      win.add(spr);
      this.partyObjs.push(spr);
      const add = (o) => {
        this.partyObjs.push(o);
        return o;
      };
      add(win.text(48, y, def.name, i === highlight ? COLORS.yellow : COLORS.white));
      add(win.text(48, y + 12, def.job, COLORS.gray));
      add(win.text(130, y, `Nv ${h.level}`, COLORS.white));
      add(win.text(130, y + 12, h.hp <= 0 ? 'Caído' : h.status?.length ? 'Mal' : '', h.hp <= 0 ? COLORS.red : COLORS.green));
      add(win.text(48, y + 26, 'HP', COLORS.gray));
      add(win.textRight(150, y + 26, `${h.hp}/${s.maxHp}`, h.hp < s.maxHp / 4 ? COLORS.orange : COLORS.white));
      add(win.text(160, y + 26, 'MP', COLORS.gray));
      add(win.textRight(222, y + 26, `${h.mp}/${s.maxMp}`, COLORS.blue));
      drawBar(g, 48, y + 40, 100, h.hp / s.maxHp, 0x58c058);
      drawBar(g, 160, y + 40, 60, s.maxMp ? h.mp / s.maxMp : 0, 0x5880e0);
    });
    if (this.goldText) this.goldText.setText(`${State.g.gold}`);
  }

  // Escolha de herói pela janela do grupo; cb(index|null)
  pickHero(cb, { filter, keep = false } = {}) {
    const items = State.g.party.map((h, i) => ({ label: '', i, enabled: filter ? filter(h) : true }));
    const list = new MenuList(this, this.partyWin, {
      x: 14, y: 16, width: 200, rowH: 58, items,
      onSelect: (it) => {
        if (!keep) this.pop();
        cb(it.i);
      },
      onCancel: () => {
        this.pop();
        cb(null);
      },
    });
    this.push({ update: (c) => list.update(c), destroy: () => list.destroy() });
    return list;
  }

  mainSelect(v, list) {
    list.setActive(false);
    const back = () => {
      list.setActive(true);
      this.drawParty();
    };
    if (v === 'items') this.itemsPage(back);
    else if (v === 'skills')
      this.pickHero((i) => (i === null ? back() : this.skillsPage(i, back)));
    else if (v === 'equip')
      this.pickHero((i) => (i === null ? back() : this.equipPage(i, back)));
    else if (v === 'status')
      this.pickHero((i) => (i === null ? back() : this.statusPage(i, back)));
    else if (v === 'order') this.orderPage(back);
    else if (v === 'save') {
      this.events.once('resume', back);
      this.scene.launch('SaveLoad', { mode: 'save', parent: 'Menu' });
      this.scene.pause();
    } else if (v === 'config') this.configPage(back);
    else if (v === 'title') this.titlePage(back);
  }

  // ------------------------------------------------------------ itens
  itemsPage(back) {
    const objs = [];
    const top = new Win(this, 0, 0, W, 24, { depth: 11000 });
    const desc = top.text(8, 6, '');
    const win = new Win(this, 0, 24, W, H - 24, { depth: 11000 });
    objs.push(top, win);
    const entries = () => {
      const inv = State.g.inventory;
      const order = (id) => ['item', 'weapon', 'armor', 'accessory', 'key'].indexOf(ITEMS[id]?.type);
      return Object.keys(inv)
        .filter((id) => ITEMS[id])
        .sort((a, b) => order(a) - order(b))
        .map((id) => {
          const it = ITEMS[id];
          return {
            label: it.name,
            right: it.type === 'key' ? '' : inv[id],
            id,
            enabled: !!(it.field && it.type === 'item'),
            color: it.type === 'key' ? COLORS.yellow : undefined,
          };
        });
    };
    const showDesc = (it) => desc.setText(it ? ITEMS[it.id].desc : 'Nenhum item.');
    const list = new MenuList(this, win, {
      x: 20, y: 8, width: 300, cols: 2, colW: 152, rowH: 13, visibleRows: 16, items: entries(),
      onChange: showDesc,
      onSelect: (it) => {
        const item = ITEMS[it.id];
        list.setActive(false);
        objs.forEach((o) => o.setVisible(false));
        this.pickHero(
          (i) => {
            if (i === null) {
              objs.forEach((o) => o.setVisible(true));
              list.setActive(true);
              this.drawParty();
              return;
            }
            const h = State.g.party[i];
            if (this.useItemOn(item, it.id, h)) {
              list.setItems(entries());
              showDesc(list.current());
            } else Audio.sfx('buzzer');
            this.drawParty(i);
            if (itemCount(it.id) <= 0) {
              this.pop();
              objs.forEach((o) => o.setVisible(true));
              list.setActive(true);
              this.drawParty();
            }
          },
          { keep: true },
        );
      },
      onCancel: () => {
        this.pop();
        back();
      },
    });
    showDesc(list.current());
    this.push({
      update: (c) => list.update(c),
      destroy: () => {
        list.destroy();
        objs.forEach((o) => o.destroy());
      },
    });
  }

  useItemOn(item, id, h) {
    const s = heroStats(h);
    const u = item.use;
    if (!u) return false;
    if (u.revive) {
      if (h.hp > 0) return false;
      h.hp = Math.max(1, Math.round(s.maxHp * u.revive));
    } else if (h.hp <= 0) return false;
    let did = !!u.revive;
    if (u.heal && h.hp < s.maxHp) {
      h.hp = Math.min(s.maxHp, h.hp + u.heal);
      did = true;
    }
    if (u.mp && h.mp < s.maxMp) {
      h.mp = Math.min(s.maxMp, h.mp + u.mp);
      did = true;
    }
    if (u.cure && h.status?.length) {
      h.status = h.status.filter((x) => !u.cure.includes(x));
      did = true;
    }
    if (!did) return false;
    removeItem(id);
    Audio.sfx('heal');
    return true;
  }

  // ------------------------------------------------------------ habilidades
  skillsPage(heroIdx, back) {
    const h = State.g.party[heroIdx];
    const objs = [];
    const top = new Win(this, 0, 0, W, 24, { depth: 11000 });
    const desc = top.text(8, 6, '');
    const head = new Win(this, 0, 24, W, 24, { depth: 11000 });
    const mpText = head.text(8, 6, '');
    const win = new Win(this, 0, 48, W, H - 48, { depth: 11000 });
    objs.push(top, head, win);
    const refreshHead = () => {
      const s = heroStats(h);
      mpText.setText(`${HEROES[h.id].name}   HP ${h.hp}/${s.maxHp}   MP ${h.mp}/${s.maxMp}`);
    };
    refreshHead();
    const entries = () =>
      heroSkills(h).map((id) => {
        const s = SKILLS[id];
        const cost = s.hpCost ? `${Math.round(s.hpCost * 100)}%HP` : `${s.mp ?? 0}`;
        return { label: s.name, right: cost, id, enabled: !!s.field && h.hp > 0 && h.mp >= (s.mp ?? 0) };
      });
    const showDesc = (it) => desc.setText(it ? SKILLS[it.id].desc ?? '' : '');
    const list = new MenuList(this, win, {
      x: 20, y: 8, width: 300, cols: 2, colW: 152, rowH: 13, visibleRows: 14, items: entries(),
      onChange: showDesc,
      onSelect: (it) => {
        const sk = SKILLS[it.id];
        const apply = (targets) => {
          if (h.mp < (sk.mp ?? 0)) return false;
          let did = false;
          for (const t of targets) {
            const st = heroStats(t);
            if (sk.type === 'heal' && t.hp > 0 && t.hp < st.maxHp) {
              t.hp = Math.min(st.maxHp, t.hp + Math.round(sk.power + heroStats(h).mag * 1.2));
              did = true;
            } else if (sk.type === 'revive' && t.hp <= 0) {
              t.hp = Math.max(1, Math.round(st.maxHp * sk.power));
              did = true;
            } else if (sk.type === 'cleanse' && t.hp > 0 && t.status?.length) {
              t.status = [];
              did = true;
            }
          }
          if (did) {
            h.mp -= sk.mp ?? 0;
            Audio.sfx('heal');
          }
          return did;
        };
        if (sk.target === 'allParty') {
          if (!apply(State.g.party)) Audio.sfx('buzzer');
          list.setItems(entries());
          refreshHead();
          return;
        }
        list.setActive(false);
        objs.forEach((o) => o.setVisible(false));
        this.pickHero(
          (i) => {
            if (i === null) {
              objs.forEach((o) => o.setVisible(true));
              list.setItems(entries());
              list.setActive(true);
              refreshHead();
              return;
            }
            if (!apply([State.g.party[i]])) Audio.sfx('buzzer');
            this.drawParty(i);
          },
          { keep: true },
        );
      },
      onCancel: () => {
        this.pop();
        back();
      },
    });
    showDesc(list.current());
    this.push({
      update: (c) => list.update(c),
      destroy: () => {
        list.destroy();
        objs.forEach((o) => o.destroy());
      },
    });
  }

  // ------------------------------------------------------------ equipar
  equipPage(heroIdx, back) {
    const h = State.g.party[heroIdx];
    const objs = [];
    const top = new Win(this, 0, 0, W, 24, { depth: 11000 });
    const desc = top.text(8, 6, '');
    const statWin = new Win(this, 0, 24, 140, 136, { depth: 11000 });
    const slotWin = new Win(this, 140, 24, 180, 58, { depth: 11000 });
    const listWin = new Win(this, 140, 82, 180, 158, { depth: 11000 });
    const bottom = new Win(this, 0, 160, 140, 80, { depth: 11000 });
    objs.push(top, statWin, slotWin, listWin, bottom);
    const spr = this.add.image(20, 26, `chr_${HEROES[h.id].sprite}`, 0).setOrigin(0.5, 1);
    bottom.add(spr);
    bottom.text(36, 8, HEROES[h.id].name, COLORS.yellow);
    bottom.text(36, 20, `Nv ${h.level} ${HEROES[h.id].job}`, COLORS.gray);
    bottom.text(10, 40, 'Z: equipar   X: voltar', COLORS.dim);
    bottom.text(10, 54, 'Esq.: remover', COLORS.dim);
    let statTexts = [];
    const drawStats = (preview) => {
      statTexts.forEach((t) => t.destroy());
      statTexts = [];
      const cur = heroStats(h);
      const keys = ['hp', 'mp', 'atk', 'def', 'mag', 'res', 'agi', 'luck'];
      keys.forEach((k, i) => {
        const y = 8 + i * 15;
        const ck = k === 'hp' ? 'maxHp' : k === 'mp' ? 'maxMp' : k;
        statTexts.push(statWin.text(8, y, STAT_NAMES[k], COLORS.gray));
        statTexts.push(statWin.textRight(84, y, `${cur[ck]}`));
        if (preview) {
          const nv = preview[ck];
          const col = nv > cur[ck] ? COLORS.green : nv < cur[ck] ? COLORS.red : COLORS.white;
          statTexts.push(statWin.text(90, y, '>', COLORS.dim));
          statTexts.push(statWin.textRight(132, y, `${nv}`, col));
        }
      });
    };
    drawStats(null);
    const slots = ['weapon', 'armor', 'accessory'];
    const slotItems = () =>
      slots.map((s) => ({ label: `${{ weapon: 'Arma', armor: 'Corpo', accessory: 'Acess.' }[s]} ${h.equip[s] ? ITEMS[h.equip[s]].name : '—'}`, s }));
    let pickList = null;
    const slotList = new MenuList(this, slotWin, {
      x: 20, y: 7, width: 156, rowH: 15, items: slotItems(),
      onChange: (it) => desc.setText(h.equip[it.s] ? ITEMS[h.equip[it.s]].desc : ''),
      onSelect: (it) => {
        const slot = it.s;
        const options = Object.keys(State.g.inventory)
          .filter((id) => ITEMS[id] && ITEMS[id].type === slot && canEquip(ITEMS[id], h.id))
          .map((id) => ({ label: ITEMS[id].name, right: itemCount(id), id }));
        options.push({ label: '(remover)', id: null, enabled: slot !== 'weapon' });
        slotList.setActive(false);
        const preview = (o) => {
          const eq = { ...h.equip, [slot]: o ? o.id : null };
          drawStats(heroStats(h, eq));
          desc.setText(o && o.id ? ITEMS[o.id].desc : 'Remover o equipamento.');
        };
        pickList = new MenuList(this, listWin, {
          x: 20, y: 8, width: 156, rowH: 13, visibleRows: 11, items: options,
          onChange: preview,
          onSelect: (o) => {
            equip(h, slot, o.id);
            Audio.sfx('item');
            done();
          },
          onCancel: () => done(),
        });
        preview(options[0]);
        const done = () => {
          pickList.destroy();
          pickList = null;
          slotList.setItems(slotItems());
          slotList.setActive(true);
          drawStats(null);
          desc.setText('');
        };
      },
      onCancel: () => {
        this.pop();
        back();
      },
    });
    this.push({
      update: (c) => {
        if (pickList) pickList.update(c);
        else {
          if (c.pressed('left')) {
            const s = slotList.current().s;
            if (h.equip[s] && !(s === 'weapon')) {
              equip(h, s, null);
              Audio.sfx('cancel');
              slotList.setItems(slotItems());
              drawStats(null);
            }
          }
          slotList.update(c);
        }
      },
      destroy: () => {
        if (pickList) pickList.destroy();
        slotList.destroy();
        statTexts.forEach((t) => t.destroy());
        objs.forEach((o) => o.destroy());
      },
    });
  }

  // ------------------------------------------------------------ status
  statusPage(heroIdx, back) {
    let idx = heroIdx;
    let win = null;
    const build = () => {
      if (win) win.destroy();
      const h = State.g.party[idx];
      const def = HEROES[h.id];
      const s = heroStats(h);
      const base = heroBaseStats(h);
      win = new Win(this, 0, 0, W, H, { depth: 11000 });
      const spr = this.add.image(26, 40, `chr_${def.sprite}`, 0).setOrigin(0.5, 1).setScale(1.5);
      win.add(spr);
      win.text(50, 10, def.name, COLORS.yellow);
      win.text(50, 22, def.job, COLORS.gray);
      win.text(130, 10, `Nível ${h.level}`);
      const next = expForLevel(h.level + 1);
      win.text(130, 22, `EXP ${h.exp}`, COLORS.gray);
      win.text(220, 10, 'Próximo', COLORS.gray);
      win.textRight(310, 22, `${Math.max(0, next - h.exp)}`);
      win.text(10, 50, 'HP', COLORS.gray);
      win.textRight(110, 50, `${h.hp}/${s.maxHp}`);
      win.text(10, 62, 'MP', COLORS.gray);
      win.textRight(110, 62, `${h.mp}/${s.maxMp}`, COLORS.blue);
      ['atk', 'def', 'mag', 'res', 'agi', 'luck'].forEach((k, i) => {
        const y = 80 + i * 13;
        win.text(10, y, STAT_NAMES[k], COLORS.gray);
        win.textRight(100, y, `${s[k]}`);
        const diff = s[k] - base[k];
        if (diff) win.text(104, y, `${diff > 0 ? '+' : ''}${diff}`, diff > 0 ? COLORS.green : COLORS.red);
      });
      win.text(140, 50, 'Equipamento', COLORS.gray);
      ['weapon', 'armor', 'accessory'].forEach((sl, i) => {
        win.text(140, 62 + i * 13, h.equip[sl] ? ITEMS[h.equip[sl]].name : '—');
      });
      win.text(140, 108, 'Habilidades', COLORS.gray);
      heroSkills(h).forEach((sk, i) => win.text(140 + (i % 2) * 88, 120 + Math.floor(i / 2) * 12, SKILLS[sk].name, COLORS.white));
      wrapText(def.bio, 296).forEach((l, i) => win.text(10, 172 + i * 12, l, COLORS.gray));
      if (State.g.party.length > 1) win.text(10, 222, '< >  trocar personagem', COLORS.dim);
    };
    build();
    this.push({
      update: (c) => {
        if (c.pressed('cancel') || c.pressed('ok')) {
          Audio.sfx('cancel');
          this.pop();
          back();
        } else if (c.pressed('right') || c.pressed('down')) {
          idx = (idx + 1) % State.g.party.length;
          Audio.sfx('cursor');
          build();
        } else if (c.pressed('left') || c.pressed('up')) {
          idx = (idx + State.g.party.length - 1) % State.g.party.length;
          Audio.sfx('cursor');
          build();
        }
      },
      destroy: () => win && win.destroy(),
    });
  }

  // ------------------------------------------------------------ ordem
  orderPage(back) {
    this.pickHero(
      (a) => {
        if (a === null) return back();
        this.drawParty(a);
        this.pickHero((b) => {
          if (b !== null && b !== a) {
            const p = State.g.party;
            [p[a], p[b]] = [p[b], p[a]];
            Audio.sfx('confirm');
            this.refreshLeader();
          }
          this.drawParty();
          this.orderPage(back);
        });
      },
      {},
    );
  }

  refreshLeader() {
    const map = this.scene.get('Map');
    if (map && map.player) {
      map.player.sprite.setTexture(`chr_${State.g.party[0].id}`);
      map.setFrame(map.player, 0);
    }
  }

  // ------------------------------------------------------------ configurações
  configPage(back) {
    const win = new Win(this, 40, 60, 240, 110, { depth: 11000 });
    win.text(14, 8, 'Configurações', COLORS.yellow);
    const speeds = ['', 'Lenta', 'Normal', 'Rápida', 'Instant.'];
    const rows = [
      { label: 'Música', get: () => `${Math.round(Settings.music * 10)}`, adj: (d) => (Settings.music = Math.max(0, Math.min(1, Math.round((Settings.music + d * 0.1) * 10) / 10))) },
      { label: 'Efeitos', get: () => `${Math.round(Settings.sfx * 10)}`, adj: (d) => (Settings.sfx = Math.max(0, Math.min(1, Math.round((Settings.sfx + d * 0.1) * 10) / 10))) },
      { label: 'Texto', get: () => speeds[Settings.textSpeed], adj: (d) => (Settings.textSpeed = Math.max(1, Math.min(4, Settings.textSpeed + d))) },
    ];
    const items = () => rows.map((r) => ({ label: r.label, right: `< ${r.get()} >` }));
    const list = new MenuList(this, win, {
      x: 34, y: 30, width: 200, rowH: 16, items: items(),
      onSelect: () => {},
      onCancel: () => {
        Settings.save();
        this.pop();
        back();
      },
    });
    win.text(14, 86, 'Setas: ajustar   X: voltar', COLORS.dim);
    this.push({
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
      destroy: () => {
        list.destroy();
        win.destroy();
      },
    });
  }

  titlePage(back) {
    const win = new Win(this, 60, 80, 200, 70, { depth: 11000 });
    win.text(14, 10, 'Voltar à tela título?', COLORS.white);
    win.text(14, 22, 'O progresso não salvo será perdido.', COLORS.dim);
    const list = new MenuList(this, win, {
      x: 34, y: 40, width: 160, rowH: 13, items: [{ label: 'Não' }, { label: 'Sim' }],
      onSelect: (_it, i) => {
        if (i === 1) {
          this.scene.stop('Map');
          this.scene.start('Title');
          return;
        }
        this.pop();
        back();
      },
      onCancel: () => {
        this.pop();
        back();
      },
    });
    this.push({
      update: (c) => list.update(c),
      destroy: () => {
        list.destroy();
        win.destroy();
      },
    });
  }
}
