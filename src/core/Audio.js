// Música e efeitos chiptune gerados em tempo real com Web Audio.
import { Settings } from './Settings.js';
import { SONGS } from '../data/music.js';

const NOTE_IDX = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };

function noteFreq(name) {
  const m = /^([A-G])([#b]?)(-?\d)$/.exec(name);
  if (!m) return null;
  let n = NOTE_IDX[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0);
  const oct = parseInt(m[3], 10);
  const midi = (oct + 1) * 12 + n;
  return 440 * Math.pow(2, (midi - 69) / 12);
}

function parseTrack(str, defLen = 2) {
  return str
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((tok) => {
      const [n, d] = tok.split(':');
      return { n, d: d ? parseFloat(d) : defLen };
    });
}

const INSTR = {
  sq12: { wave: 'pulse', duty: 0.125, a: 0.005, d: 0.08, s: 0.6, r: 0.04 },
  sq25: { wave: 'pulse', duty: 0.25, a: 0.005, d: 0.1, s: 0.55, r: 0.05 },
  sq50: { wave: 'pulse', duty: 0.5, a: 0.01, d: 0.12, s: 0.5, r: 0.06 },
  tri: { wave: 'triangle', a: 0.005, d: 0.05, s: 0.9, r: 0.03 },
  bell: { wave: 'sine', a: 0.002, d: 0.9, s: 0.0, r: 0.3, harm: true },
  pad: { wave: 'pulse', duty: 0.5, a: 0.25, d: 0.3, s: 0.6, r: 0.4 },
  noise: { wave: 'noise' },
};

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.current = null;
    this.currentId = null;
    this.waves = {};
  }

  init() {
    if (this.ctx) return true;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    this.ctx = new AC();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0.5;
    this.master.connect(this.ctx.destination);
    this.sfxGain = this.ctx.createGain();
    this.sfxGain.gain.value = Settings.sfx;
    this.sfxGain.connect(this.master);
    // buffer de ruído
    const len = this.ctx.sampleRate;
    this.noiseBuf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const data = this.noiseBuf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    const unlock = () => {
      if (this.ctx.state === 'suspended') this.ctx.resume();
    };
    window.addEventListener('keydown', unlock);
    window.addEventListener('mousedown', unlock);
    window.addEventListener('touchstart', unlock, { passive: true });
    return true;
  }

  pulseWave(duty) {
    if (this.waves[duty]) return this.waves[duty];
    const n = 32;
    const real = new Float32Array(n);
    const imag = new Float32Array(n);
    for (let k = 1; k < n; k++) {
      real[k] = (2 / (k * Math.PI)) * Math.sin(k * Math.PI * duty);
    }
    const w = this.ctx.createPeriodicWave(real, imag);
    this.waves[duty] = w;
    return w;
  }

  setVolumes() {
    if (!this.ctx) return;
    this.sfxGain.gain.value = Settings.sfx;
    if (this.current) this.current.gain.gain.value = Settings.music * (this.current.song.vol ?? 1);
  }

  // ---------- Música ----------
  play(id, { restart = false } = {}) {
    if (!this.init()) return;
    if (this.currentId === id && !restart && this.current) return;
    this.stop(0.3);
    const song = SONGS[id];
    if (!song) return;
    this.currentId = id;
    const gain = this.ctx.createGain();
    gain.gain.value = Settings.music * (song.vol ?? 1);
    gain.connect(this.master);
    const step = 60 / song.bpm / 4;
    const start = this.ctx.currentTime + 0.08;
    const tracks = song.tracks.map((t) => ({
      ...t,
      notes: parseTrack(t.notes, t.len ?? 2),
      i: 0,
      time: start,
      done: false,
    }));
    const state = { song, gain, tracks, step, timer: null };
    state.timer = setInterval(() => this.schedule(state), 25);
    this.current = state;
    this.schedule(state);
  }

  schedule(state) {
    const ahead = this.ctx.currentTime + 0.15;
    let allDone = true;
    for (const tr of state.tracks) {
      while (!tr.done && tr.time < ahead) {
        const note = tr.notes[tr.i];
        const dur = note.d * state.step;
        if (note.n !== 'r' && note.n !== '-') this.playNote(tr, note.n, tr.time, dur, state.gain);
        tr.time += dur;
        tr.i++;
        if (tr.i >= tr.notes.length) {
          if (state.song.loop !== false) tr.i = 0;
          else tr.done = true;
        }
      }
      if (!tr.done) allDone = false;
    }
    if (allDone) {
      clearInterval(state.timer);
    }
  }

  playNote(tr, n, t, dur, dest) {
    const ctx = this.ctx;
    const ins = INSTR[tr.inst] || INSTR.sq50;
    const vol = tr.vol ?? 0.3;
    if (ins.wave === 'noise') {
      this.drum(n, t, vol, dest);
      return;
    }
    const f = noteFreq(n);
    if (!f) return;
    const g = ctx.createGain();
    g.connect(dest);
    const osc = ctx.createOscillator();
    if (ins.wave === 'pulse') osc.setPeriodicWave(this.pulseWave(ins.duty));
    else osc.type = ins.wave;
    osc.frequency.value = f;
    if (tr.vib) {
      const lfo = ctx.createOscillator();
      const lg = ctx.createGain();
      lfo.frequency.value = 5.5;
      lg.gain.value = f * 0.012;
      lfo.connect(lg).connect(osc.frequency);
      lfo.start(t);
      lfo.stop(t + dur + ins.r + 0.05);
    }
    osc.connect(g);
    const end = t + Math.max(0.03, dur - 0.01);
    let stopAt;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + ins.a);
    if (ins.s === 0) {
      g.gain.exponentialRampToValueAtTime(0.0001, t + ins.a + ins.d);
      stopAt = t + ins.a + ins.d + 0.02;
    } else {
      const sus = Math.max(end, t + ins.a + ins.d);
      g.gain.linearRampToValueAtTime(vol * ins.s, t + ins.a + ins.d);
      g.gain.setValueAtTime(vol * ins.s, sus);
      g.gain.linearRampToValueAtTime(0, sus + ins.r);
      stopAt = sus + ins.r + 0.02;
    }
    osc.start(t);
    osc.stop(stopAt);
    if (ins.harm) {
      const o2 = ctx.createOscillator();
      const g2 = ctx.createGain();
      o2.type = 'sine';
      o2.frequency.value = f * 2.76;
      g2.gain.setValueAtTime(vol * 0.35, t);
      g2.gain.exponentialRampToValueAtTime(0.0001, t + 0.4);
      o2.connect(g2).connect(dest);
      o2.start(t);
      o2.stop(t + 0.45);
    }
  }

  drum(kind, t, vol, dest) {
    const ctx = this.ctx;
    if (kind === 'k') {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(140, t);
      o.frequency.exponentialRampToValueAtTime(40, t + 0.12);
      g.gain.setValueAtTime(vol * 1.6, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.15);
      o.connect(g).connect(dest);
      o.start(t);
      o.stop(t + 0.16);
      return;
    }
    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuf;
    const filt = ctx.createBiquadFilter();
    const g = ctx.createGain();
    let len = 0.05;
    if (kind === 'h') {
      filt.type = 'highpass';
      filt.frequency.value = 7000;
      len = 0.04;
      vol *= 0.5;
    } else if (kind === 's') {
      filt.type = 'bandpass';
      filt.frequency.value = 1800;
      len = 0.14;
    } else {
      filt.type = 'lowpass';
      filt.frequency.value = 400;
      len = 0.3;
    }
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + len);
    src.connect(filt).connect(g).connect(dest);
    src.start(t, Math.random() * 0.5);
    src.stop(t + len + 0.01);
  }

  stop(fade = 0.2) {
    if (!this.current) return;
    const s = this.current;
    clearInterval(s.timer);
    const now = this.ctx.currentTime;
    s.gain.gain.cancelScheduledValues(now);
    s.gain.gain.setValueAtTime(s.gain.gain.value, now);
    s.gain.gain.linearRampToValueAtTime(0, now + fade);
    setTimeout(() => s.gain.disconnect(), (fade + 0.3) * 1000);
    this.current = null;
    this.currentId = null;
  }

  // ---------- Efeitos ----------
  tone(type, f0, f1, dur, vol = 0.25, t0 = 0, duty) {
    const ctx = this.ctx;
    const t = ctx.currentTime + t0;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    if (type === 'pulse') o.setPeriodicWave(this.pulseWave(duty ?? 0.5));
    else o.type = type;
    o.frequency.setValueAtTime(f0, t);
    if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(this.sfxGain);
    o.start(t);
    o.stop(t + dur + 0.02);
  }

  noise(dur, vol = 0.3, type = 'lowpass', f0 = 2000, f1 = 200, t0 = 0) {
    const ctx = this.ctx;
    const t = ctx.currentTime + t0;
    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuf;
    src.loop = true;
    const filt = ctx.createBiquadFilter();
    filt.type = type;
    filt.frequency.setValueAtTime(f0, t);
    filt.frequency.exponentialRampToValueAtTime(Math.max(30, f1), t + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(filt).connect(g).connect(this.sfxGain);
    src.start(t);
    src.stop(t + dur + 0.02);
  }

  sfx(name) {
    if (!this.init()) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();
    const T = (...a) => this.tone(...a);
    const N = (...a) => this.noise(...a);
    switch (name) {
      case 'cursor': T('pulse', 1046, 1046, 0.03, 0.12, 0, 0.25); break;
      case 'confirm': T('pulse', 784, 784, 0.04, 0.15, 0, 0.25); T('pulse', 1175, 1175, 0.06, 0.15, 0.04, 0.25); break;
      case 'cancel': T('pulse', 523, 330, 0.08, 0.15, 0, 0.5); break;
      case 'buzzer': T('pulse', 110, 100, 0.18, 0.2, 0, 0.5); break;
      case 'hit': N(0.14, 0.45, 'lowpass', 3000, 200); T('square', 180, 60, 0.1, 0.15); break;
      case 'slash': N(0.1, 0.35, 'highpass', 6000, 1500); T('square', 400, 80, 0.08, 0.1); break;
      case 'crit': N(0.2, 0.5, 'lowpass', 5000, 100); T('square', 300, 40, 0.18, 0.2); break;
      case 'miss': N(0.12, 0.15, 'bandpass', 3000, 800); break;
      case 'magic': T('sine', 300, 1400, 0.35, 0.2); T('pulse', 600, 2000, 0.3, 0.08, 0.05, 0.125); break;
      case 'fire': N(0.5, 0.4, 'lowpass', 1200, 150); T('sawtooth', 200, 80, 0.4, 0.08); break;
      case 'light': [1318, 1568, 2093, 2637].forEach((f, i) => T('sine', f, f, 0.25, 0.12, i * 0.05)); break;
      case 'dark': T('sawtooth', 500, 60, 0.5, 0.15); N(0.5, 0.2, 'lowpass', 600, 80); break;
      case 'heal': [1046, 1318, 1568, 2093].forEach((f, i) => T('triangle', f, f, 0.18, 0.18, i * 0.06)); break;
      case 'poison': T('square', 200, 120, 0.15, 0.1); T('square', 180, 100, 0.15, 0.1, 0.12); break;
      case 'item': T('triangle', 880, 880, 0.06, 0.2); T('triangle', 1318, 1318, 0.1, 0.2, 0.06); break;
      case 'encounter':
        for (let i = 0; i < 8; i++) T('pulse', 1600 - i * 150, 1600 - i * 150, 0.05, 0.12, i * 0.04, 0.125);
        N(0.6, 0.3, 'bandpass', 4000, 300, 0.1);
        break;
      case 'door': N(0.15, 0.4, 'lowpass', 600, 100); T('square', 90, 60, 0.12, 0.1, 0.05); break;
      case 'stairs': [0, 0.1, 0.2, 0.3].forEach((d) => N(0.06, 0.25, 'lowpass', 800, 200, d)); break;
      case 'chest': [523, 659, 784, 1046].forEach((f, i) => T('pulse', f, f, 0.08, 0.12, i * 0.05, 0.25)); break;
      case 'levelup': [523, 659, 784, 1046, 784, 1046, 1318].forEach((f, i) => T('pulse', f, f, 0.1, 0.12, i * 0.07, 0.25)); break;
      case 'death': N(0.6, 0.35, 'lowpass', 2000, 60); T('sawtooth', 300, 40, 0.5, 0.1); break;
      case 'scream': T('sawtooth', 900, 300, 0.7, 0.18); T('sawtooth', 940, 280, 0.7, 0.14); N(0.7, 0.2, 'bandpass', 2500, 800); break;
      case 'bell':
        T('sine', 392, 392, 2.2, 0.3); T('sine', 784, 784, 1.5, 0.12); T('sine', 1082, 1082, 0.9, 0.08); break;
      case 'save': [784, 988, 1175, 1568].forEach((f, i) => T('sine', f, f, 0.4, 0.12, i * 0.09)); break;
      case 'heart': T('sine', 70, 40, 0.15, 0.4); T('sine', 70, 40, 0.15, 0.3, 0.22); break;
      case 'whisper': N(1.2, 0.12, 'bandpass', 1500, 2500); N(1.0, 0.08, 'bandpass', 900, 600, 0.3); break;
      case 'run': N(0.3, 0.25, 'highpass', 2000, 6000); break;
      case 'steal': T('pulse', 1500, 2500, 0.12, 0.12, 0, 0.125); break;
      case 'sleep': [880, 740, 622].forEach((f, i) => T('sine', f, f, 0.25, 0.12, i * 0.12)); break;
      default: break;
    }
  }
}

export const Audio = new AudioEngine();
