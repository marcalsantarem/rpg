// Utilitários para desenhar pixel art em canvas e registrar como texturas Phaser.

export function makeCanvas(w, h) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d', { willReadFrequently: true });
  ctx.imageSmoothingEnabled = false;
  return { canvas: c, ctx };
}

export function rng(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function px(ctx, x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, 1, 1);
}

export function rect(ctx, x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

export function disc(ctx, cx, cy, r, color, clip) {
  ctx.fillStyle = color;
  const r2 = r * r + r * 0.6;
  for (let y = -r; y <= r; y++)
    for (let x = -r; x <= r; x++) {
      if (x * x + y * y > r2) continue;
      const X = cx + x;
      const Y = cy + y;
      if (clip && (X < clip.x || Y < clip.y || X >= clip.x + clip.w || Y >= clip.y + clip.h)) continue;
      ctx.fillRect(X, Y, 1, 1);
    }
}

export function ellipse(ctx, cx, cy, rx, ry, color) {
  ctx.fillStyle = color;
  for (let y = -ry; y <= ry; y++)
    for (let x = -rx; x <= rx; x++) {
      if ((x * x) / (rx * rx + 0.5) + (y * y) / (ry * ry + 0.5) > 1) continue;
      ctx.fillRect(cx + x, cy + y, 1, 1);
    }
}

export function line(ctx, x0, y0, x1, y1, color) {
  ctx.fillStyle = color;
  let dx = Math.abs(x1 - x0);
  let dy = -Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1;
  const sy = y0 < y1 ? 1 : -1;
  let err = dx + dy;
  for (;;) {
    ctx.fillRect(x0, y0, 1, 1);
    if (x0 === x1 && y0 === y1) break;
    const e2 = 2 * err;
    if (e2 >= dy) {
      err += dy;
      x0 += sx;
    }
    if (e2 <= dx) {
      err += dx;
      y0 += sy;
    }
  }
}

// Desenha linhas de caracteres usando uma paleta { char: '#rrggbb' }. '.' e ' ' são transparentes.
export function drawRows(ctx, rows, palette, ox = 0, oy = 0, flip = false) {
  const w = rows.reduce((m, r) => Math.max(m, r.length), 0);
  rows.forEach((r, y) => {
    for (let x = 0; x < r.length; x++) {
      const ch = r[x];
      if (ch === '.' || ch === ' ') continue;
      const col = palette[ch];
      if (!col) continue;
      ctx.fillStyle = col;
      ctx.fillRect(ox + (flip ? w - 1 - x : x), oy + y, 1, 1);
    }
  });
}

// Espelha meia-sprite (lado esquerdo) para formar sprite simétrica.
export function mirror(rows) {
  return rows.map((r) => r + [...r].reverse().join(''));
}

// Contorna automaticamente pixels opacos com uma cor de contorno.
export function outlineCanvas(ctx, w, h, color) {
  const img = ctx.getImageData(0, 0, w, h);
  const d = img.data;
  const solid = (x, y) => x >= 0 && y >= 0 && x < w && y < h && d[(y * w + x) * 4 + 3] > 0;
  const marks = [];
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      if (solid(x, y)) continue;
      if (solid(x - 1, y) || solid(x + 1, y) || solid(x, y - 1) || solid(x, y + 1)) marks.push([x, y]);
    }
  ctx.fillStyle = color;
  for (const [x, y] of marks) ctx.fillRect(x, y, 1, 1);
}

export function addTexture(scene, key, canvas) {
  if (scene.textures.exists(key)) scene.textures.remove(key);
  return scene.textures.addCanvas(key, canvas);
}

// Registra um canvas como spritesheet (frames numerados da esquerda p/ direita, cima p/ baixo).
export function addSheet(scene, key, canvas, fw, fh) {
  const tex = addTexture(scene, key, canvas);
  const cols = Math.floor(canvas.width / fw);
  const rows = Math.floor(canvas.height / fh);
  let i = 0;
  for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) tex.add(i++, 0, x * fw, y * fh, fw, fh);
  return tex;
}

export function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function rgbToHex(r, g, b) {
  const c = (v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0');
  return `#${c(r)}${c(g)}${c(b)}`;
}

export function shade(hex, f) {
  const [r, g, b] = hexToRgb(hex);
  return f >= 0 ? rgbToHex(r + (255 - r) * f, g + (255 - g) * f, b + (255 - b) * f) : rgbToHex(r * (1 + f), g * (1 + f), b * (1 + f));
}

export function mix(a, b, t) {
  const A = hexToRgb(a);
  const B = hexToRgb(b);
  return rgbToHex(A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t, A[2] + (B[2] - A[2]) * t);
}

// Polígono preenchido (scanline, regra par-ímpar)
export function poly(ctx, pts, color) {
  ctx.fillStyle = color;
  const ys = pts.map((p) => p[1]);
  const minY = Math.floor(Math.min(...ys));
  const maxY = Math.ceil(Math.max(...ys));
  for (let y = minY; y <= maxY; y++) {
    const xs = [];
    for (let i = 0; i < pts.length; i++) {
      const [x0, y0] = pts[i];
      const [x1, y1] = pts[(i + 1) % pts.length];
      if (y0 === y1) continue;
      const yy = y + 0.5;
      if ((yy >= y0 && yy < y1) || (yy >= y1 && yy < y0)) xs.push(x0 + ((yy - y0) * (x1 - x0)) / (y1 - y0));
    }
    xs.sort((a, b) => a - b);
    for (let i = 0; i + 1 < xs.length; i += 2) {
      const a = Math.round(xs[i]);
      const b = Math.round(xs[i + 1]);
      if (b > a) ctx.fillRect(a, y, b - a, 1);
    }
  }
}

// Linha grossa (discos ao longo do caminho)
export function thick(ctx, x0, y0, x1, y1, r, color) {
  const n = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0)));
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    disc(ctx, Math.round(x0 + (x1 - x0) * t), Math.round(y0 + (y1 - y0) * t), r, color);
  }
}

// Curva quadrática grossa
export function curve(ctx, x0, y0, cx, cy, x1, y1, r, color) {
  const n = 24;
  let px0 = x0;
  let py0 = y0;
  for (let i = 1; i <= n; i++) {
    const t = i / n;
    const x = (1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * cx + t * t * x1;
    const y = (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * cy + t * t * y1;
    if (r > 0) thick(ctx, Math.round(px0), Math.round(py0), Math.round(x), Math.round(y), r, color);
    else line(ctx, Math.round(px0), Math.round(py0), Math.round(x), Math.round(y), color);
    px0 = x;
    py0 = y;
  }
}
