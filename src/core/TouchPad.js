// Controles de toque (direcional + botões A/B) para celular. Fica fora do canvas, em HTML.
// O estado é lido por Controls.update() junto com o teclado.
export const VK = {
  now: { up: false, down: false, left: false, right: false, ok: false, cancel: false, run: false },
  tap: {},
};

const isTouch = () => window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;

function setDir(dir, run) {
  for (const d of ['up', 'down', 'left', 'right']) {
    const on = d === dir;
    if (on && !VK.now[d]) VK.tap[d] = true;
    VK.now[d] = on;
  }
  VK.now.run = !!run;
}

function bindDpad(el) {
  const update = (t) => {
    const r = el.getBoundingClientRect();
    const dx = t.clientX - (r.left + r.width / 2);
    const dy = t.clientY - (r.top + r.height / 2);
    const dist = Math.hypot(dx, dy);
    if (dist < r.width * 0.12) return setDir(null);
    const dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : dy > 0 ? 'down' : 'up';
    setDir(dir, dist > r.width * 0.42);
    el.dataset.dir = dir;
  };
  const end = () => {
    setDir(null);
    el.dataset.dir = '';
  };
  el.addEventListener('touchstart', (e) => {
    e.preventDefault();
    update(e.targetTouches[0]);
  }, { passive: false });
  el.addEventListener('touchmove', (e) => {
    e.preventDefault();
    update(e.targetTouches[0]);
  }, { passive: false });
  el.addEventListener('touchend', (e) => {
    e.preventDefault();
    if (!e.targetTouches.length) end();
  }, { passive: false });
  el.addEventListener('touchcancel', end);
}

function bindButton(el, key) {
  el.addEventListener('touchstart', (e) => {
    e.preventDefault();
    VK.now[key] = true;
    VK.tap[key] = true;
    el.classList.add('down');
  }, { passive: false });
  const up = (e) => {
    e.preventDefault();
    VK.now[key] = false;
    el.classList.remove('down');
  };
  el.addEventListener('touchend', up, { passive: false });
  el.addEventListener('touchcancel', up, { passive: false });
}

export function setupTouchPad() {
  if (!isTouch()) return;
  document.body.classList.add('touch');
  const pad = document.getElementById('touch');
  bindDpad(pad.querySelector('#dpad'));
  bindButton(pad.querySelector('#btn-a'), 'ok');
  bindButton(pad.querySelector('#btn-b'), 'cancel');
  // primeiro toque: tela cheia e tentativa de travar em paisagem
  const goFull = () => {
    const el = document.documentElement;
    if (!document.fullscreenElement && el.requestFullscreen) el.requestFullscreen().catch(() => {});
    if (screen.orientation && screen.orientation.lock) screen.orientation.lock('landscape').catch(() => {});
  };
  pad.querySelector('#btn-full').addEventListener('click', goFull);
  // evita zoom/rolagem acidental
  document.addEventListener('gesturestart', (e) => e.preventDefault());
}
