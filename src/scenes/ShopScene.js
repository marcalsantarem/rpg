// Loja: comprar e vender itens/equipamentos.
import { W, H, COLORS } from '../config.js';
import { Controls } from '../core/Controls.js';
import { Audio } from '../core/Audio.js';
import { State, heroStats, itemCount, addItem, removeItem } from '../core/GameState.js';
import { Win, MenuList } from '../ui/UI.js';
import { SHOPS } from '../data/shops.js';
import { ITEMS, canEquip } from '../data/items.js';
import { HEROES } from '../data/heroes.js';

const sellPrice = (it) => it.sell ?? Math.floor((it.price ?? 0) / 2);

export class ShopScene extends Phaser.Scene {
  constructor() {
    super('Shop');
  }

  init(data) {
    this.opts = data;
  }

  create() {
    this.controls = new Controls(this);
    const shop = SHOPS[this.opts.shopId];
    this.shop = shop;
    this.topWin = new Win(this, 0, 0, W, 38);
    this.topWin.text(10, 6, shop.name, COLORS.yellow);
    this.msgText = this.topWin.text(10, 20, shop.greeting, COLORS.gray);
    this.cmdWin = new Win(this, 0, 38, 96, 56);
    this.goldWin = new Win(this, 0, 94, 96, 30);
    this.goldWin.text(8, 8, 'Moedas', COLORS.gray);
    this.goldText = this.goldWin.textRight(88, 8, `${State.g.gold}`);
    this.infoWin = new Win(this, 0, 124, 96, 116);
    this.listWin = new Win(this, 96, 38, 224, 202);
    this.infoTexts = [];
    this.sub = null;
    this.cmd = new MenuList(this, this.cmdWin, {
      x: 22, y: 7, width: 70, rowH: 14,
      items: [{ label: 'Comprar' }, { label: 'Vender' }, { label: 'Sair' }],
      onSelect: (_it, i) => {
        if (i === 0) this.openBuy();
        else if (i === 1) this.openSell();
        else this.close();
      },
      onCancel: () => this.close(),
    });
  }

  update() {
    this.controls.update();
    if (this.qty) this.qty.update(this.controls);
    else if (this.sub) this.sub.update(this.controls);
    else this.cmd.update(this.controls);
  }

  close() {
    this.scene.stop();
    this.scene.resume(this.opts.parent || 'Map');
  }

  refreshGold() {
    this.goldText.setText(`${State.g.gold}`);
    this.goldText.setX(88 - this.goldText.width);
  }

  showInfo(id) {
    this.infoTexts.forEach((t) => t.destroy());
    this.infoTexts = [];
    if (!id) return;
    const it = ITEMS[id];
    const add = (x, y, s, c) => this.infoTexts.push(this.infoWin.text(x, y, s, c));
    add(8, 6, `Tem: ${itemCount(id)}`, COLORS.gray);
    if (['weapon', 'armor', 'accessory'].includes(it.type)) {
      State.g.party.forEach((h, i) => {
        const y = 22 + i * 22;
        const ok = canEquip(it, h.id);
        add(8, y, HEROES[h.id].name, ok ? COLORS.white : COLORS.dim);
        if (!ok) return;
        const cur = heroStats(h);
        const nxt = heroStats(h, { ...h.equip, [it.type]: id });
        const key = it.type === 'weapon' ? 'atk' : it.type === 'armor' ? 'def' : Object.keys(it.stats ?? { res: 0 })[0] === 'hp' ? 'maxHp' : Object.keys(it.stats ?? { res: 0 })[0];
        const d = (nxt[key] ?? 0) - (cur[key] ?? 0);
        const label = { atk: 'For', def: 'Def', res: 'Res', agi: 'Agi', luck: 'Sor', maxHp: 'HP', mag: 'Mag' }[key] ?? key;
        add(16, y + 10, `${label} ${d > 0 ? '+' : ''}${d}`, d > 0 ? COLORS.green : d < 0 ? COLORS.red : COLORS.gray);
        if (h.equip[it.type] === id) add(70, y, 'E', COLORS.yellow);
      });
    }
  }

  setMsg(s) {
    this.msgText.setText(s);
  }

  openBuy() {
    this.cmd.setActive(false);
    const items = () =>
      this.shop.stock.map((id) => ({ label: ITEMS[id].name, right: ITEMS[id].price, id, enabled: State.g.gold >= ITEMS[id].price }));
    const list = new MenuList(this, this.listWin, {
      x: 20, y: 8, width: 200, rowH: 13, visibleRows: 14, items: items(),
      onChange: (it) => {
        this.showInfo(it.id);
        this.setMsg(ITEMS[it.id].desc);
      },
      onSelect: (it) => {
        const item = ITEMS[it.id];
        const max = Math.min(99 - itemCount(it.id), Math.floor(State.g.gold / item.price));
        if (max <= 0) {
          Audio.sfx('buzzer');
          return;
        }
        list.setActive(false);
        this.askQty(item, max, item.price, (n) => {
          list.setActive(true);
          if (n > 0) {
            State.g.gold -= n * item.price;
            addItem(it.id, n);
            Audio.sfx('chest');
            this.setMsg(`Comprou ${item.name} x${n}. Obrigado.`);
            this.refreshGold();
            list.setItems(items());
            this.showInfo(it.id);
          }
        });
      },
      onCancel: () => {
        list.destroy();
        this.sub = null;
        this.showInfo(null);
        this.setMsg(this.shop.greeting);
        this.cmd.setActive(true);
      },
    });
    this.sub = list;
    this.showInfo(list.current()?.id);
    this.setMsg(ITEMS[list.current().id].desc);
  }

  openSell() {
    this.cmd.setActive(false);
    const items = () =>
      Object.keys(State.g.inventory)
        .filter((id) => ITEMS[id] && ITEMS[id].type !== 'key')
        .map((id) => ({ label: ITEMS[id].name, right: `${sellPrice(ITEMS[id])}`, id, enabled: sellPrice(ITEMS[id]) > 0 }));
    const back = () => {
      list.destroy();
      this.sub = null;
      this.showInfo(null);
      this.setMsg(this.shop.greeting);
      this.cmd.setActive(true);
    };
    const first = items();
    if (!first.length) {
      Audio.sfx('buzzer');
      this.setMsg('Você não tem nada que eu queira.');
      this.cmd.setActive(true);
      return;
    }
    const list = new MenuList(this, this.listWin, {
      x: 20, y: 8, width: 200, rowH: 13, visibleRows: 14, items: first,
      onChange: (it) => {
        this.showInfo(it.id);
        this.setMsg(`Pago ${sellPrice(ITEMS[it.id])} por unidade.`);
      },
      onSelect: (it) => {
        const item = ITEMS[it.id];
        list.setActive(false);
        this.askQty(item, itemCount(it.id), sellPrice(item), (n) => {
          list.setActive(true);
          if (n > 0) {
            State.g.gold += n * sellPrice(item);
            removeItem(it.id, n);
            Audio.sfx('item');
            this.setMsg(`Vendeu ${item.name} x${n}.`);
            this.refreshGold();
            const next = items();
            if (!next.length) return back();
            list.setItems(next);
            this.showInfo(list.current()?.id);
          }
        });
      },
      onCancel: back,
    });
    this.sub = list;
    this.showInfo(first[0].id);
  }

  askQty(item, max, unit, cb) {
    const win = new Win(this, 110, 96, 196, 52, { depth: 12000 });
    win.text(10, 8, item.name, COLORS.yellow);
    let n = 1;
    const t = win.text(10, 26, '');
    const draw = () => t.setText(`Qtd: < ${n} >    Total: ${n * unit}`);
    draw();
    this.qty = {
      update: (c) => {
        if (c.repeat('right') || c.repeat('up')) n = Math.min(max, n + 1);
        else if (c.repeat('left') || c.repeat('down')) n = Math.max(1, n - 1);
        else if (c.pressed('ok')) {
          Audio.sfx('confirm');
          this.qty = null;
          win.destroy();
          cb(n);
          return;
        } else if (c.pressed('cancel')) {
          Audio.sfx('cancel');
          this.qty = null;
          win.destroy();
          cb(0);
          return;
        } else return;
        Audio.sfx('cursor');
        draw();
      },
    };
  }
}
