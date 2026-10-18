// Estado global do jogo (grupo, inventário, flags, posição) + regras de personagem.
import { HEROES, expForLevel, MAX_LEVEL } from '../data/heroes.js';
import { ITEMS, canEquip } from '../data/items.js';

export const STAT_KEYS = ['hp', 'mp', 'atk', 'def', 'mag', 'res', 'agi', 'luck'];

export const State = {
  g: null,
  debugNoEncounters: false,
};

export function newGame() {
  State.g = {
    party: [makeHero('aren', 1)],
    inventory: { pocao: 3, antidoto: 1 },
    gold: 120,
    flags: {},
    map: { id: 'cabana', x: 3, y: 3, dir: 'down' },
    playTime: 0,
    chapter: 1,
  };
  return State.g;
}

export function makeHero(id, level = 1) {
  const def = HEROES[id];
  const h = {
    id,
    level,
    exp: expForLevel(level),
    hp: 1,
    mp: 0,
    equip: { ...def.equip },
    status: [],
  };
  const s = heroStats(h);
  h.hp = s.hp;
  h.mp = s.mp;
  return h;
}

export function heroBaseStats(h) {
  const def = HEROES[h.id];
  const out = {};
  for (const k of STAT_KEYS) out[k] = Math.floor(def.base[k] + def.growth[k] * (h.level - 1));
  return out;
}

export function heroStats(h, equipOverride) {
  const s = heroBaseStats(h);
  const eq = equipOverride ?? h.equip;
  for (const slot of ['weapon', 'armor', 'accessory']) {
    const it = eq[slot] && ITEMS[eq[slot]];
    if (!it || !it.stats) continue;
    for (const [k, v] of Object.entries(it.stats)) s[k] = (s[k] ?? 0) + v;
  }
  s.maxHp = s.hp;
  s.maxMp = s.mp;
  return s;
}

export function heroProtects(h) {
  const out = new Set();
  for (const slot of ['weapon', 'armor', 'accessory']) {
    const it = h.equip[slot] && ITEMS[h.equip[slot]];
    if (it && it.protect) it.protect.forEach((p) => out.add(p));
  }
  return out;
}

export function heroSkills(h) {
  return HEROES[h.id].skills.filter(([lv]) => lv <= h.level).map(([, id]) => id);
}

export function clampHero(h) {
  const s = heroStats(h);
  h.hp = Math.max(0, Math.min(h.hp, s.maxHp));
  h.mp = Math.max(0, Math.min(h.mp, s.maxMp));
}

/** Concede EXP; retorna lista de eventos de nível { level, skills:[ids] } */
export function gainExp(h, amount) {
  const ups = [];
  if (h.hp <= 0) return ups;
  h.exp += amount;
  while (h.level < MAX_LEVEL && h.exp >= expForLevel(h.level + 1)) {
    const before = heroStats(h);
    const oldSkills = heroSkills(h);
    h.level++;
    const after = heroStats(h);
    h.hp += after.maxHp - before.maxHp;
    h.mp += after.maxMp - before.maxMp;
    const newSkills = heroSkills(h).filter((s) => !oldSkills.includes(s));
    ups.push({ level: h.level, skills: newSkills });
  }
  return ups;
}

export function partyLevel() {
  const p = State.g.party;
  return Math.round(p.reduce((a, h) => a + h.level, 0) / p.length);
}

export function joinParty(id) {
  if (State.g.party.some((h) => h.id === id)) return null;
  const h = makeHero(id, Math.max(1, partyLevel()));
  State.g.party.push(h);
  return h;
}

export function healParty() {
  for (const h of State.g.party) {
    const s = heroStats(h);
    h.hp = s.maxHp;
    h.mp = s.maxMp;
    h.status = [];
  }
}

// ----- inventário -----
export function itemCount(id) {
  return State.g.inventory[id] ?? 0;
}

export function addItem(id, n = 1) {
  State.g.inventory[id] = Math.min(99, itemCount(id) + n);
}

export function removeItem(id, n = 1) {
  const c = itemCount(id) - n;
  if (c <= 0) delete State.g.inventory[id];
  else State.g.inventory[id] = c;
}

export function hasItem(id) {
  return itemCount(id) > 0;
}

/** Equipa (ou remove com itemId null), devolvendo o anterior ao inventário. */
export function equip(h, slot, itemId) {
  const old = h.equip[slot];
  if (itemId) {
    const it = ITEMS[itemId];
    if (!it || it.type !== slot || !canEquip(it, h.id) || !hasItem(itemId)) return false;
    removeItem(itemId);
  }
  if (old) addItem(old);
  h.equip[slot] = itemId;
  clampHero(h);
  return true;
}

export function setFlag(k, v = true) {
  State.g.flags[k] = v;
}

export function flag(k) {
  return !!State.g.flags[k];
}

export function serialize() {
  return JSON.parse(JSON.stringify(State.g));
}

export function deserialize(data) {
  State.g = JSON.parse(JSON.stringify(data));
  for (const h of State.g.party) clampHero(h);
}

export function formatTime(sec) {
  sec = Math.floor(sec);
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
