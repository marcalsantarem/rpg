// Controles de toque (direcional + botões A/B) para celular. Fica fora do canvas, em HTML.
// O estado é lido por Controls.update() junto com o teclado.
export const VK = {
  now: { up: false, down: false, left: false, right: false, ok: false, cancel: false, run: false },
  tap: {},
};

const isTouch = () => window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;

export function requestLandscape() {
  const el = document.documentElement;
  if (!document.fullscreenElement) {
    if (el.requestFullscreen) el.requestFullscreen().catch(() => {});
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen().catch(() => {});
    else if (el.msRequestFullscreen) el.msRequestFullscreen().catch(() => {});
  }
  if (screen.orientation && screen.orientation.lock) {
    screen.orientation.lock('landscape').catch(() => {});
  } else if (screen.lockOrientation) {
    screen.lockOrientation('landscape');
  } else if (screen.webkitLockOrientation) {
    screen.webkitLockOrientation('landscape');
  } else if (screen.mozLockOrientation) {
    screen.mozLockOrientation('landscape');
  }
}

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
    let dx = t.clientX - (r.left + r.width / 2);
    let dy = t.clientY - (r.top + r.height / 2);
    if (document.body.classList.contains('force-rotate')) {
      const physDx = dx;
      const physDy = dy;
      dx = physDy;
      dy = -physDx;
    }
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

  const btnFull = pad.querySelector('#btn-full');
  if (btnFull) btnFull.addEventListener('click', requestLandscape);

  const btnLock = document.getElementById('btn-lock-landscape');
  if (btnLock) {
    btnLock.addEventListener('click', () => {
      requestLandscape();
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
        if (window.game && window.game.scale) window.game.scale.refresh();
      }, 200);
    });
  }

  const btnForce = document.getElementById('btn-force-rotate');
  if (btnForce) {
    btnForce.addEventListener('click', () => {
      document.body.classList.toggle('force-rotate');
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
        if (window.game && window.game.scale) window.game.scale.refresh();
      }, 150);
    });
  }

  // Tenta engajar paisagem na primeira interação de toque do usuário
  const onFirstTouch = () => {
    requestLandscape();
    window.removeEventListener('touchstart', onFirstTouch);
  };
  window.addEventListener('touchstart', onFirstTouch, { passive: true });

  // Redimensionamento quando o jogador vira o aparelho físico
  const onResize = () => {
    if (window.innerWidth > window.innerHeight) {
      document.body.classList.remove('force-rotate');
    }
    setTimeout(() => {
      if (window.game && window.game.scale) window.game.scale.refresh();
    }, 150);
  };
  window.addEventListener('resize', onResize);
  window.addEventListener('orientationchange', onResize);

  // Evita zoom/rolagem acidental
  document.addEventListener('gesturestart', (e) => e.preventDefault());
}

