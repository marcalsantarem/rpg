// Salvamento em 3 slots: arquivos JSON via Electron, ou localStorage no navegador.
import { State, serialize, deserialize } from './GameState.js';
import { HEROES, HERO_CLASSES } from '../data/heroes.js';
import { MAP_NAMES } from '../data/maps/index.js';

const desktop = typeof window !== 'undefined' ? window.desktop : null;
const LS = (slot) => `sinos_save_${slot}`;

async function readRaw(slot) {
  try {
    if (desktop) return await desktop.readSave(slot);
    const raw = localStorage.getItem(LS(slot));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export const SaveSystem = {
  async list() {
    const out = [];
    for (let s = 1; s <= 3; s++) {
      const d = await readRaw(s);
      if (!d || !d.state) {
        out.push(null);
        continue;
      }
      const lead = d.state.party[0];
      const leadCls = lead.id === 'aren' ? HERO_CLASSES[lead.classId || d.state.protagonistClass || 'guerreiro'] : null;
      out.push({
        slot: s,
        leader: HEROES[lead.id].name,
        job: leadCls ? leadCls.job : HEROES[lead.id].job,
        level: lead.level,
        party: d.state.party.map((h) => {
          if (h.id === 'aren') {
            const cls = HERO_CLASSES[h.classId || d.state.protagonistClass || 'guerreiro'];
            return cls ? cls.sprite : 'aren';
          }
          return HEROES[h.id]?.sprite ?? h.id;
        }),
        place: MAP_NAMES[d.state.map.id] ?? d.state.map.id,
        time: d.state.playTime,
        savedAt: d.savedAt,
      });
    }
    return out;
  },

  async save(slot) {
    const data = { version: 1, savedAt: new Date().toISOString(), state: serialize() };
    if (desktop) await desktop.writeSave(slot, data);
    else localStorage.setItem(LS(slot), JSON.stringify(data));
  },

  async autoSave() {
    if (!State.g) return;
    try {
      const data = { version: 1, savedAt: new Date().toISOString(), state: serialize(), isAuto: true };
      if (desktop && desktop.writeSave) {
        await desktop.writeSave(1, data).catch(() => {});
      } else {
        localStorage.setItem(LS(1), JSON.stringify(data));
        localStorage.setItem('sinos_autosave', JSON.stringify(data));
      }
    } catch {
      /* ignora */
    }
  },

  async load(slot) {
    const d = await readRaw(slot);
    if (!d || !d.state) return false;
    deserialize(d.state);
    return true;
  },

  async any() {
    return (await this.list()).some(Boolean);
  },

  get state() {
    return State.g;
  },
};
