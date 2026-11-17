// Tela de seleção de classe do protagonista (Aren) antes de iniciar o jogo.
import { UW, UH, COLORS } from '../config.js';
import { Controls } from '../core/Controls.js';
import { Audio } from '../core/Audio.js';
import { newGame, makeHero, heroStats } from '../core/GameState.js';
import { Win, MenuList, drawBar, makeText, uiCamera } from '../ui/UI.js';
import { wrapText, textWidth } from '../core/Font.js';
import { HERO_CLASSES } from '../data/heroes.js';
import { ITEMS } from '../data/items.js';
import { SKILLS } from '../data/skills.js';

const CLASS_ORDER = ['guerreiro', 'espadachim', 'monge', 'mago'];

export class ClassSelectScene extends Phaser.Scene {
  constructor() {
    super('ClassSelect');
  }

  create() {
    this.controls = new Controls(this);
    this.leaving = false;
    uiCamera(this);

    if (this.textures.exists('title_bg')) {
      this.add.image(0, UH - 240, 'title_bg').setOrigin(0).setAlpha(0.45);
    }
    this.fog = this.add.tileSprite(0, 0, UW, UH, 'fog').setOrigin(0).setTileScale(2, 1.5).setTint(0x6050a0).setAlpha(0.2);

    const topWin = new Win(this, 4, 3, UW - 8, 21);
    const title = 'Escolha a Classe do Protagonista';
    topWin.text(Math.round((UW - 8 - textWidth(title)) / 2), 6, title, COLORS.yellow);

    this.leftWin = new Win(this, 4, 26, 122, 164);
    this.leftWin.text(10, 6, 'Classes', COLORS.gray);

    this.rightWin = new Win(this, 128, 26, UW - 132, 164);
    this.detailObjs = [];
    this.previewObjs = [];

    this.stepFrame = 0;
    this.activeSprite = null;
    this.time.addEvent({
      delay: 220,
      loop: true,
      callback: () => {
        this.stepFrame = (this.stepFrame + 1) % 4;
        if (this.activeSprite && this.activeSprite.active) {
          this.activeSprite.setFrame([0, 1, 0, 2][this.stepFrame]);
        }
      },
    });

    const items = CLASS_ORDER.map((id) => ({
      id,
      label: HERO_CLASSES[id].job,
    }));

    this.list = new MenuList(this, this.leftWin, {
      x: 20,
      y: 20,
      width: 96,
      rowH: 15,
      items,
      onChange: (it) => this.renderClass(it.id),
      onSelect: (it) => this.confirmClass(it.id),
      onCancel: () => this.backToTitle(),
    });

    const footer = 'Setas: escolher   Z/Enter: iniciar   X/Esc: voltar';
    makeText(this, Math.round((UW - textWidth(footer)) / 2), UH - 14, footer, COLORS.dim);

    this.renderClass(CLASS_ORDER[0]);
    this.cameras.main.fadeIn(300, 0, 0, 0);
  }

  renderClass(classId) {
    const cls = HERO_CLASSES[classId] ?? HERO_CLASSES.guerreiro;

    this.previewObjs.forEach((o) => o.destroy());
    this.previewObjs = [];
    this.detailObjs.forEach((o) => o.destroy());
    this.detailObjs = [];

    // Painel esquerdo: retrato e sprite animado de Aren na classe escolhida
    const pGfx = this.add.graphics().setScrollFactor(0);
    pGfx.fillStyle(0x080614, 0.7).fillRect(10, 86, 102, 68);
    pGfx.lineStyle(1, 0x5a5480, 1).strokeRect(10, 86, 102, 68);
    this.leftWin.add(pGfx);
    this.previewObjs.push(pGfx);

    const faceKey = `face_${cls.sprite}`;
    if (this.textures.exists(faceKey)) {
      const face = this.add.image(16, 94, faceKey).setOrigin(0).setScale(2);
      this.leftWin.add(face);
      this.previewObjs.push(face);
    }

    const spr = this.add.sprite(84, 144, `chr_${cls.sprite}`, [0, 1, 0, 2][this.stepFrame]).setOrigin(0.5, 1).setScale(2);
    this.leftWin.add(spr);
    this.previewObjs.push(spr);
    this.activeSprite = spr;

    this.previewObjs.push(this.leftWin.text(16, 130, 'Aren', COLORS.yellow));
    this.previewObjs.push(this.leftWin.text(16, 141, 'Nv 1', COLORS.gray));

    // Painel direito: descrição, atributos, equipamento e habilidades
    const addR = (o) => {
      this.detailObjs.push(o);
      return o;
    };

    addR(this.rightWin.text(10, 5, cls.job, COLORS.yellow));
    addR(this.rightWin.textRight(226, 5, cls.role, COLORS.blue));

    wrapText(cls.desc, 216)
      .slice(0, 3)
      .forEach((line, i) => {
        addR(this.rightWin.text(10, 17 + i * 10, line, COLORS.white));
      });

    // Atributos iniciais (base + equipamento inicial da classe)
    const sample = makeHero('aren', 1, cls.id);
    const st = heroStats(sample);
    const g = this.add.graphics().setScrollFactor(0);
    this.rightWin.add(g);
    this.detailObjs.push(g);

    const leftStats = [
      { label: 'HP', val: st.maxHp, max: 110, col: 0x58c058 },
      { label: 'Força', val: st.atk, max: 22, col: 0xf09848 },
      { label: 'Defesa', val: st.def, max: 18, col: 0x5880e0 },
      { label: 'Agilid.', val: st.agi, max: 18, col: 0x58c058 },
    ];
    const rightStats = [
      { label: 'MP', val: st.maxMp, max: 30, col: 0x5880e0 },
      { label: 'Magia', val: st.mag, max: 24, col: 0xb888f8 },
      { label: 'Resist.', val: st.res, max: 18, col: 0xb888f8 },
      { label: 'Sorte', val: st.luck, max: 16, col: 0xf8e078 },
    ];

    leftStats.forEach((row, i) => {
      const y = 50 + i * 11;
      addR(this.rightWin.text(10, y, row.label, COLORS.gray));
      addR(this.rightWin.textRight(68, y, `${row.val}`, COLORS.white));
      drawBar(g, 72, y + 3, 38, row.val / row.max, row.col);
    });

    rightStats.forEach((row, i) => {
      const y = 50 + i * 11;
      addR(this.rightWin.text(120, y, row.label, COLORS.gray));
      addR(this.rightWin.textRight(180, y, `${row.val}`, COLORS.white));
      drawBar(g, 184, y + 3, 38, row.val / row.max, row.col);
    });

    // Equipamento inicial
    const wep = ITEMS[cls.equip.weapon]?.name ?? '—';
    const arm = ITEMS[cls.equip.armor]?.name ?? '—';
    addR(this.rightWin.text(10, 97, 'Equip.:', COLORS.gray));
    addR(this.rightWin.text(50, 97, `${wep} / ${arm}`, COLORS.white));

    // Habilidades da classe
    addR(this.rightWin.text(10, 110, 'Habilidades da Classe:', COLORS.gray));
    cls.skills.slice(0, 6).forEach(([lv, skId], idx) => {
      const colX = idx % 2 === 0 ? 10 : 122;
      const rowY = 121 + Math.floor(idx / 2) * 11;
      const skName = SKILLS[skId]?.name ?? skId;
      addR(this.rightWin.text(colX, rowY, `Nv${lv}`, lv === 1 ? COLORS.green : COLORS.dim));
      addR(this.rightWin.text(colX + 24, rowY, skName, lv === 1 ? COLORS.white : COLORS.gray));
    });
  }

  confirmClass(classId) {
    if (this.leaving) return;
    this.leaving = true;
    this.list.setActive(false);
    Audio.stop(1);
    this.cameras.main.fadeOut(700, 0, 0, 0);
    this.time.delayedCall(750, () => {
      newGame(classId);
      this.scene.start('Intro');
    });
  }

  backToTitle() {
    if (this.leaving) return;
    this.leaving = true;
    this.list.setActive(false);
    this.cameras.main.fadeOut(250, 0, 0, 0);
    this.time.delayedCall(270, () => {
      this.scene.start('Title');
    });
  }

  update() {
    this.controls.update();
    if (this.fog) {
      this.fog.tilePositionX += 0.15;
      this.fog.tilePositionY += 0.04;
    }
    if (!this.leaving && this.list) {
      this.list.update(this.controls);
    }
  }
}
