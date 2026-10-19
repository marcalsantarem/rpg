// Resolução interna 16:9 (tiles de 48px do RPG Maker MZ)
export const W = 1104;
export const H = 624;
export const TILE = 48;
// A interface é desenhada num espaço lógico 3x menor e ampliada por câmera com zoom 3
export const UI_SCALE = 3;
export const UW = W / UI_SCALE; // 368
export const UH = H / UI_SCALE; // 208
export const FONT = 'MZFont, "M PLUS 1 Code", monospace';
export const FONT_SIZE = 9;

const params = new URLSearchParams(typeof location !== 'undefined' ? location.search : '');
export const DEBUG = params.has('debug');

export const COLORS = {
  white: 0xffffff,
  gray: 0xa0a0b4,
  dim: 0x6c6c80,
  yellow: 0xf8e078,
  orange: 0xf0a040,
  red: 0xf05858,
  green: 0x78e078,
  blue: 0x90b8ff,
  purple: 0xc890f0,
  blood: 0xc82828,
};

export const DIRS = {
  down: { dx: 0, dy: 1, frame: 0 },
  left: { dx: -1, dy: 0, frame: 1 },
  right: { dx: 1, dy: 0, frame: 2 },
  up: { dx: 0, dy: -1, frame: 3 },
};
