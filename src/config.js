export const W = 320;
export const H = 240;
export const TILE = 16;
export const FONT = 'pix';

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
