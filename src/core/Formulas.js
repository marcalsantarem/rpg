// Fórmulas de combate.
const rand = (a, b) => a + Math.random() * (b - a);

export function elementMult(target, element) {
  if (!element || !target.weak) return 1;
  return target.weak[element] ?? 1;
}

export function hitChance(a, t) {
  let c = 0.95 + (a.agi - t.agi) * 0.005;
  if (a.status.has('cego')) c *= 0.5;
  if (t.status.has('sono')) c = 1;
  return Math.max(0.3, Math.min(0.99, c));
}

export function critChance(a) {
  return 0.04 + a.luck / 300;
}

export function physDamage(a, t, power = 1, crit = false, element = null) {
  const def = t.def * (t.buffs?.def ?? 1);
  let base = crit ? a.atk * 1.25 : a.atk - def * 0.5;
  base = Math.max(a.atk * 0.15, base);
  let dmg = base * power * rand(0.88, 1.08) * elementMult(t, element);
  if (crit) dmg *= 1.5;
  if (t.defending) dmg *= 0.5;
  return Math.max(1, Math.round(dmg));
}

export function magicDamage(a, t, power, element = null) {
  const res = t.res * (t.buffs?.res ?? 1);
  let base = power + a.mag * 1.0 - res * 0.5;
  base = Math.max(power * 0.3, base);
  let dmg = base * rand(0.9, 1.1) * elementMult(t, element);
  if (t.defending) dmg *= 0.6;
  return Math.max(element && elementMult(t, element) === 0 ? 0 : 1, Math.round(dmg));
}

export function healAmount(a, power) {
  return Math.round((power + a.mag * 1.2) * rand(0.95, 1.05));
}

export function fleeChance(party, enemies, attempts) {
  const avg = (l) => l.reduce((s, c) => s + c.agi, 0) / Math.max(1, l.length);
  const c = 0.5 + (avg(party) - avg(enemies)) / 50 + attempts * 0.12;
  return Math.max(0.2, Math.min(0.95, c));
}
