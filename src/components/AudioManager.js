import { useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { useIsTouchDevice } from '../hooks/useIsTouchDevice';

// Simple synthesized audio engine using WebAudio. No external assets required.
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.musicGain = null;
    this.ambientGain = null;
    this.sfxGain = null;
    this.currentAmbient = null;
    this.ambientNodes = [];
    this.enabled = true;
    this.masterVolume = 0.9;
    this.musicVolume = 0.7;
    this.ambientVolume = 0.6;
    this.sfxVolume = 0.8;
    this._initPending = false;
    this.lastHoverAt = 0;
    this.hoverCooldownMs = 140;
    this.sceneFadeMs = 0.35;
    this.lowComplexity = false;
  }

  ensureContext() {
    if (this.ctx) return;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    this.ctx = new AudioCtx();
    this.master = this.ctx.createGain();
    this.master.gain.value = this.masterVolume;
    this.compressor = this.ctx.createDynamicsCompressor();
    this.compressor.threshold.setValueAtTime(-28, this.ctx.currentTime);
    this.compressor.knee.setValueAtTime(24, this.ctx.currentTime);
    this.compressor.ratio.setValueAtTime(12, this.ctx.currentTime);
    this.compressor.attack.setValueAtTime(0.003, this.ctx.currentTime);
    this.compressor.release.setValueAtTime(0.24, this.ctx.currentTime);
    this.master.connect(this.compressor).connect(this.ctx.destination);

    this.musicGain = this.ctx.createGain();
    this.musicGain.gain.value = this.musicVolume;
    this.musicGain.connect(this.master);

    this.ambientGain = this.ctx.createGain();
    this.ambientGain.gain.value = this.ambientVolume;
    this.ambientGain.connect(this.master);

    this.sfxGain = this.ctx.createGain();
    this.sfxGain.gain.value = this.sfxVolume;
    this.sfxGain.connect(this.master);

    // Resume on first gesture (autoplay policies)
    const resume = () => {
      if (this.ctx && this.ctx.state !== 'running') this.ctx.resume();
      window.removeEventListener('pointerdown', resume);
      window.removeEventListener('keydown', resume);
    };
    window.addEventListener('pointerdown', resume);
    window.addEventListener('keydown', resume);
  }

  setVolumes({ master, music, ambient, sfx, enabled }) {
    this.ensureContext();
    if (typeof enabled === 'boolean') this.enabled = enabled;
    if (this.master && typeof master === 'number') this.master.gain.setTargetAtTime(Math.max(0, Math.min(1, master)), this.ctx.currentTime, 0.05);
    if (this.musicGain && typeof music === 'number') this.musicGain.gain.setTargetAtTime(Math.max(0, Math.min(1, music)), this.ctx.currentTime, 0.05);
    if (this.ambientGain && typeof ambient === 'number') this.ambientGain.gain.setTargetAtTime(Math.max(0, Math.min(1, ambient)), this.ctx.currentTime, 0.05);
    if (this.sfxGain && typeof sfx === 'number') this.sfxGain.gain.setTargetAtTime(Math.max(0, Math.min(1, sfx)), this.ctx.currentTime, 0.02);
    if (!this.enabled) this.stopAmbient();
  }

  stopAmbient(fade = false) {
    if (fade && this.musicGain && this.ctx) {
      const t = this.ctx.currentTime;
      this.musicGain.gain.setTargetAtTime(0.0001, t, this.sceneFadeMs);
      setTimeout(() => this.stopAmbient(false), this.sceneFadeMs * 1000 + 60);
      return;
    }
    this.ambientNodes.forEach(n => { try { n.stop?.(); n.disconnect?.(); } catch (_) {} });
    this.ambientNodes = [];
    this.currentAmbient = null;
  }

  startAmbient(kind) {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;
    if (this.currentAmbient === kind) return;
    if (this.currentAmbient) this.stopAmbient(true);
    this.currentAmbient = kind;

    const t = this.ctx.currentTime;
    const target = Math.max(0, Math.min(1, this.ambientVolume));
    this.ambientGain.gain.setValueAtTime(0.0001, t);

    // Use small building blocks per scene
    if (this.lowComplexity) {
      if (kind === 'title') {
        this._padChord([220, 277.18, 329.63], 0.5);
      } else if (kind === 'DASHASHWAMEDH_GHAT') {
        this._riverNoise();
      } else if (kind === 'LABYRINTH_GHATS') {
        this._lowDrone();
      } else if (kind === 'NYAYA_TRIAL') {
        this._resonantHum();
      } else if (kind === 'VAISESIKA_TRIAL') {
        this._lowDrone();
      } else if (kind === 'THE_WARDEN') {
        this._ominousPulse();
      } else {
        this._padChord([196, 246.94, 293.66], 0.5);
      }
    } else {
      if (kind === 'title') {
        this._padChord([220, 277.18, 329.63], 0.6);
      } else if (kind === 'DASHASHWAMEDH_GHAT') {
        this._riverNoise();
        this._randomBell(8);
        this._crowdMurmur();
      } else if (kind === 'LABYRINTH_GHATS') {
        this._lowDrone();
        this._drip(7);
        this._windGusts();
      } else if (kind === 'NYAYA_TRIAL') {
        this._resonantHum();
        this._subtleAir();
        this._echoPulse(10);
      } else if (kind === 'VAISESIKA_TRIAL') {
        this._lowDrone();
        this._sparkleGlisten();
        this._echoPulse(12);
      } else if (kind === 'THE_WARDEN') {
        this._ominousPulse();
        this._windGusts();
      } else {
        this._padChord([196, 246.94, 293.66], 0.5);
      }
    }

    this.ambientGain.gain.setTargetAtTime(target, t + 0.02, this.sceneFadeMs);
  }

  _makeOsc(freq, type = 'sine', gain = 0.1) {
    const osc = this.ctx.createOscillator();
    osc.type = type;
    osc.frequency.value = freq;
    const g = this.ctx.createGain();
    g.gain.value = 0.0001;
    osc.connect(g).connect(this.ambientGain);
    osc.start();
    this.ambientNodes.push(osc, g);
    return { osc, g };
  }

  _env(g, a = 0.5, s = 0.2) {
    const t = this.ctx.currentTime;
    g.gain.cancelScheduledValues(t);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(s, t + a);
    g.gain.linearRampToValueAtTime(0, t + a + 8);
  }

  _padChord(freqs, speed = 0.6) {
    freqs.forEach((f, i) => {
      const { g } = this._makeOsc(f, 'sine');
      const loop = () => {
        this._env(g, 1.2, 0.12);
        if (this.currentAmbient) setTimeout(loop, (2000 + i * 400) / speed);
      };
      loop();
    });
  }

  _riverNoise() {
    const bufSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = (Math.random() * 2 - 1) * 0.4;
    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;
    const lpf = this.ctx.createBiquadFilter();
    lpf.type = 'lowpass';
    lpf.frequency.value = 800;
    const g = this.ctx.createGain();
    g.gain.value = 0.08;
    noise.connect(lpf).connect(g).connect(this.ambientGain);
    noise.start();
    this.ambientNodes.push(noise, lpf, g);

    // Slow swell
    const swell = () => {
      const t = this.ctx.currentTime;
      g.gain.setTargetAtTime(0.05 + Math.random() * 0.05, t, 1.5);
    };
    const id = setInterval(swell, 3000);
    this.ambientNodes.push({ stop: () => clearInterval(id) });
  }

  _randomBell(avg = 3) {
    const ring = () => {
      if (!this.currentAmbient) return;
      const { osc, g } = this._makeOsc(880, 'triangle');
      const t = this.ctx.currentTime;
      g.gain.cancelScheduledValues(t);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(0.08, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 2.2);
      osc.frequency.setValueAtTime(880, t);
      osc.frequency.exponentialRampToValueAtTime(660, t + 1.8);
      setTimeout(() => { try { osc.stop(); } catch (_) {} }, 2500);
    };
    const id = setInterval(ring, avg * 1000 + Math.random() * 1500);
    this.ambientNodes.push({ stop: () => clearInterval(id) });
  }

  _crowdMurmur() {
    // Pink-ish noise with slow bandpass sweep to emulate distant crowd
    const src = this.ctx.createBufferSource();
    const len = 2 * this.ctx.sampleRate;
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const ch = buf.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0; // pink filter
    for (let i = 0; i < len; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99765 * b0 + white * 0.0990460;
      b1 = 0.96300 * b1 + white * 0.2965164;
      b2 = 0.57000 * b2 + white * 1.0526913;
      ch[i] = (b0 + b1 + b2 + white * 0.1848) * 0.08;
    }
    src.buffer = buf; src.loop = true;
    const bp = this.ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 400;
    const g = this.ctx.createGain();
    g.gain.value = 0.06;
    src.connect(bp).connect(g).connect(this.ambientGain);
    src.start();
    this.ambientNodes.push(src, bp, g);
    // slow sweep
    const sweep = () => { if (!this.currentAmbient) return; bp.frequency.linearRampToValueAtTime(300 + Math.random()*300, this.ctx.currentTime + 3); };
    const id = setInterval(sweep, 3000);
    this.ambientNodes.push({ stop: () => clearInterval(id) });
  }

  _lowDrone() {
    const { g } = this._makeOsc(98, 'sawtooth');
    const lpf = this.ctx.createBiquadFilter();
    lpf.type = 'lowpass';
    lpf.frequency.value = 300;
    g.disconnect();
    g.connect(lpf).connect(this.ambientGain);
    this._env(g, 1.5, 0.06);
    this.ambientNodes.push(lpf);
  }

  _drip(avg = 5) {
    const tick = () => {
      if (!this.currentAmbient) return;
      const o = this.ctx.createOscillator();
      o.type = 'sine';
      const g = this.ctx.createGain();
      g.gain.value = 0;
      o.connect(g).connect(this.ambientGain);
      const base = 520 + Math.random() * 120;
      const t = this.ctx.currentTime;
      o.frequency.setValueAtTime(base, t);
      o.frequency.exponentialRampToValueAtTime(base / 2, t + 0.2);
      g.gain.linearRampToValueAtTime(0.12, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);
      o.start();
      setTimeout(() => { try { o.stop(); } catch (_) {} }, 700);
    };
    const id = setInterval(tick, avg * 1000 + Math.random() * 1500);
    this.ambientNodes.push({ stop: () => clearInterval(id) });
  }

  _windGusts() {
    const src = this.ctx.createBufferSource();
    const len = 2 * this.ctx.sampleRate;
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const ch = buf.getChannelData(0);
    for (let i = 0; i < len; i++) ch[i] = (Math.random() * 2 - 1) * 0.3;
    src.buffer = buf; src.loop = true;
    const hp = this.ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 500;
    const g = this.ctx.createGain(); g.gain.value = 0.02;
    src.connect(hp).connect(g).connect(this.ambientGain);
    src.start();
    this.ambientNodes.push(src, hp, g);
    const mod = () => {
      const t = this.ctx.currentTime;
      g.gain.cancelScheduledValues(t);
      g.gain.setTargetAtTime(0.01 + Math.random() * 0.05, t, 0.6);
      hp.frequency.setTargetAtTime(300 + Math.random() * 700, t, 1.0);
    };
    const id = setInterval(mod, 4000);
    this.ambientNodes.push({ stop: () => clearInterval(id) });
  }

  _resonantHum() {
    // Two close oscillators with slow beating, filtered for a cold chamber hum
    const { g: g1 } = this._makeOsc(110, 'sine');
    const { g: g2 } = this._makeOsc(110.8, 'sine');
    const lpf = this.ctx.createBiquadFilter();
    lpf.type = 'lowpass';
    lpf.frequency.value = 240;
    g1.disconnect();
    g2.disconnect();
    const mix = this.ctx.createGain();
    mix.gain.value = 0.08;
    g1.connect(mix);
    g2.connect(mix);
    mix.connect(lpf).connect(this.ambientGain);
    this.ambientNodes.push(lpf, mix);

    const wobble = () => {
      if (!this.currentAmbient) return;
      const t = this.ctx.currentTime;
      lpf.frequency.setTargetAtTime(200 + Math.random() * 80, t, 2.0);
    };
    const id = setInterval(wobble, 3000);
    this.ambientNodes.push({ stop: () => clearInterval(id) });
  }

  _subtleAir() {
    // Very gentle filtered noise with slow amplitude modulation
    const src = this.ctx.createBufferSource();
    const len = 2 * this.ctx.sampleRate;
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const ch = buf.getChannelData(0);
    for (let i = 0; i < len; i++) ch[i] = (Math.random() * 2 - 1) * 0.25;
    src.buffer = buf; src.loop = true;
    const hp = this.ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 200;
    const bp = this.ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 900; bp.Q.value = 0.7;
    const g = this.ctx.createGain(); g.gain.value = 0.012;
    src.connect(hp).connect(bp).connect(g).connect(this.ambientGain);
    src.start();
    this.ambientNodes.push(src, hp, bp, g);
    const mod = () => {
      const t = this.ctx.currentTime;
      g.gain.setTargetAtTime(0.008 + Math.random() * 0.012, t, 1.2);
      bp.frequency.setTargetAtTime(700 + Math.random() * 500, t, 2.0);
    };
    const id = setInterval(mod, 3500);
    this.ambientNodes.push({ stop: () => clearInterval(id) });
  }

  _echoPulse(avg = 9) {
    // Sparse, high, glassy pings feeding a gentle feedback delay to emulate chamber echoes
    const ping = () => {
      if (!this.currentAmbient) return;
      const o = this.ctx.createOscillator();
      o.type = 'triangle';
      const g = this.ctx.createGain(); g.gain.value = 0;
      const delay = this.ctx.createDelay(); delay.delayTime.value = 0.28 + Math.random() * 0.12;
      const fb = this.ctx.createGain(); fb.gain.value = 0.25;
      const hpf = this.ctx.createBiquadFilter(); hpf.type = 'highpass'; hpf.frequency.value = 600;
      g.connect(delay).connect(fb).connect(delay); // feedback loop
      delay.connect(hpf).connect(this.ambientGain);
      o.connect(g);
      const base = 1200 + Math.random() * 500;
      const t = this.ctx.currentTime;
      o.frequency.setValueAtTime(base, t);
      o.frequency.exponentialRampToValueAtTime(base * 0.6, t + 0.25);
      g.gain.linearRampToValueAtTime(0.06, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.8);
      o.start();
      setTimeout(() => { try { o.stop(); } catch (_) {} }, 900);
      this.ambientNodes.push(o, g, delay, fb, hpf);
    };
    const id = setInterval(ping, avg * 1000 + Math.random() * 2000);
    this.ambientNodes.push({ stop: () => clearInterval(id) });
  }

  _sparkleGlisten() {
    // Tiny high chimes that glisten randomly
    const tick = () => {
      if (!this.currentAmbient) return;
      const o = this.ctx.createOscillator();
      o.type = 'sine';
      const g = this.ctx.createGain(); g.gain.value = 0;
      const t = this.ctx.currentTime;
      const f = 1500 + Math.random() * 1200;
      o.frequency.setValueAtTime(f, t);
      g.gain.linearRampToValueAtTime(0.03, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
      o.connect(g).connect(this.ambientGain);
      o.start();
      setTimeout(() => { try { o.stop(); } catch (_) {} }, 600);
      this.ambientNodes.push(o, g);
    };
    const id = setInterval(tick, 1800 + Math.random() * 1200);
    this.ambientNodes.push({ stop: () => clearInterval(id) });
  }

  _ominousPulse() {
    // Low percussive pulse for looming presence
    const kick = () => {
      if (!this.currentAmbient) return;
      const o = this.ctx.createOscillator();
      o.type = 'sine';
      const g = this.ctx.createGain(); g.gain.value = 0;
      const t = this.ctx.currentTime;
      o.frequency.setValueAtTime(110, t);
      o.frequency.exponentialRampToValueAtTime(55, t + 0.2);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(0.12, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
      o.connect(g).connect(this.ambientGain);
      o.start();
      setTimeout(() => { try { o.stop(); } catch (_) {} }, 600);
      this.ambientNodes.push(o, g);
    };
    const id = setInterval(kick, 2200 + Math.random() * 1200);
    this.ambientNodes.push({ stop: () => clearInterval(id) });
  }

  playSfx(type = 'click') {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.connect(g).connect(this.sfxGain);

    if (type === 'hover') {
      o.type = 'triangle';
      const now = Date.now();
      if (now - this.lastHoverAt < this.hoverCooldownMs) return;
      this.lastHoverAt = now;
      o.frequency.setValueAtTime(660, t);
      o.frequency.exponentialRampToValueAtTime(880, t + 0.08);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(0.08, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
    } else if (type === 'journal') {
      o.type = 'sine';
      o.frequency.setValueAtTime(520, t);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(0.12, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
    } else if (type === 'objective') {
      o.type = 'sine';
      o.frequency.setValueAtTime(440, t);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(0.14, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.45);
    } else { // click
      o.type = 'sine';
      o.frequency.setValueAtTime(360, t);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(0.12, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
    }

    o.start();
    setTimeout(() => { try { o.stop(); } catch (_) {} }, 500);
  }
}

export const engine = new SoundEngine();

export default function AudioManager() {
  const { state } = useGame();
  const prevScene = useRef(null);

  useEffect(() => {
    engine.setVolumes({ master: state.settings.masterVolume, music: state.settings.musicVolume, ambient: state.settings.ambientVolume, sfx: state.settings.sfxVolume, enabled: state.settings.soundEnabled });
  }, [state.settings.masterVolume, state.settings.musicVolume, state.settings.ambientVolume, state.settings.sfxVolume, state.settings.soundEnabled]);

  useEffect(() => {
    let scene = null;
    if (state.gameState === 'TITLE_SCREEN') scene = 'title';
    else if (state.gameState === 'GAMEPLAY') scene = state.currentScene;
    else scene = null; // silence on profile creation/results and other menus

    if (prevScene.current !== scene) {
      prevScene.current = scene;
      if (scene) engine.startAmbient(scene);
      else engine.stopAmbient(true);
    }
  }, [state.gameState, state.currentScene]);

  useEffect(() => {
    const onOver = (e) => {
      const t = e.target;
      if (t && t.classList && t.classList.contains('is-interactive')) engine.playSfx('hover');
    };
    const onClick = (e) => {
      const t = e.target;
      if (t && t.classList && t.classList.contains('is-interactive')) engine.playSfx('click');
    };
    document.addEventListener('mouseover', onOver, { passive: true });
    document.addEventListener('click', onClick, { passive: true });
    return () => {
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('click', onClick);
    };
  }, []);

  return null;
}
