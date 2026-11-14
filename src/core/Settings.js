const KEY = 'sinos_settings';
const DEFAULTS = { music: 0.6, sfx: 0.7, textSpeed: 2, battleSpeed: 1 }; // battleSpeed: 1 normal, 2 rápida

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : { ...DEFAULTS };
  } catch {
    return { ...DEFAULTS };
  }
}

export const Settings = {
  ...load(),
  save() {
    try {
      localStorage.setItem(KEY, JSON.stringify({ music: this.music, sfx: this.sfx, textSpeed: this.textSpeed, battleSpeed: this.battleSpeed }));
    } catch {
      /* armazenamento indisponível */
    }
  },
};
