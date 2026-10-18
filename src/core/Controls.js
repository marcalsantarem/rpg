// Entrada unificada: estado calculado uma vez por frame (pressed é idempotente no mesmo frame).
const MAP = {
  up: ['UP', 'W'],
  down: ['DOWN', 'S'],
  left: ['LEFT', 'A'],
  right: ['RIGHT', 'D'],
  ok: ['Z', 'ENTER', 'SPACE'],
  cancel: ['X', 'ESC', 'BACKSPACE'],
  run: ['SHIFT'],
};

const REPEAT_DELAY = 260;
const REPEAT_RATE = 80;

export class Controls {
  constructor(scene) {
    this.scene = scene;
    const KC = Phaser.Input.Keyboard.KeyCodes;
    this.keys = {};
    for (const [action, names] of Object.entries(MAP)) {
      this.keys[action] = names.map((n) => scene.input.keyboard.addKey(KC[n], true, false));
    }
    this.prev = {};
    this.now = {};
    this.held = {};
    this.repeatAt = {};
    this.locked = 0;
    const onReset = () => this.reset();
    scene.events.on('resume', onReset);
    scene.events.on('wake', onReset);
    scene.events.once('shutdown', () => {
      scene.events.off('resume', onReset);
      scene.events.off('wake', onReset);
    });
  }

  reset() {
    this.scene.input.keyboard.resetKeys();
    for (const a of Object.keys(MAP)) {
      this.prev[a] = false;
      this.now[a] = false;
    }
    this.locked = 6; // ignora alguns frames após trocar de cena
  }

  update() {
    const t = this.scene.time.now;
    this.tapped = this.tapped || {};
    for (const a of Object.keys(MAP)) {
      this.prev[a] = this.now[a];
      // JustDown captura toques rápidos (keydown e keyup no mesmo frame)
      let just = false;
      for (const k of this.keys[a]) if (Phaser.Input.Keyboard.JustDown(k)) just = true;
      this.tapped[a] = just;
      this.now[a] = this.keys[a].some((k) => k.isDown);
      if ((this.now[a] && !this.prev[a]) || just) {
        this.held[a] = t;
        this.repeatAt[a] = t + REPEAT_DELAY;
      }
    }
    if (this.locked > 0) {
      this.locked--;
      for (const a of Object.keys(MAP)) {
        this.prev[a] = this.now[a];
        this.tapped[a] = false;
      }
    }
  }

  down(a) {
    return this.locked <= 0 && this.now[a];
  }

  pressed(a) {
    return this.locked <= 0 && ((this.now[a] && !this.prev[a]) || !!this.tapped?.[a]);
  }

  // Pressionado ou auto-repetição (para menus)
  repeat(a) {
    if (this.pressed(a)) return true;
    if (!this.down(a)) return false;
    const t = this.scene.time.now;
    if (t >= this.repeatAt[a]) {
      this.repeatAt[a] = t + REPEAT_RATE;
      return true;
    }
    return false;
  }

  dir() {
    for (const d of ['up', 'down', 'left', 'right']) if (this.down(d) || this.pressed(d)) return d;
    return null;
  }
}
