import { useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';

// Simple synthesized audio engine using WebAudio. No external assets required.
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.musicGain = null;
    this.sfxGain = null;
    this.currentAmbient = null;
    this.ambientNodes = [];
    this.enabled = true;
    this.musicVolume = 0.7;
    this.sfxVolume = 0.8;
    this._initPending = false;
    this.lastHoverAt = 0;
    this.hoverCooldownMs = 140;
    this.sceneFadeMs = 0.35;
  }

  ensureContext() {
    if (this.ctx) return;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    this.ctx = new AudioCtx();
    this.master = this.ctx.createGain();
    this.master.gain.value = 1;
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

  setVolumes({ music, sfx, enabled }) {
    this.ensureContext();
    if (typeof enabled === 'boolean') this.enabled = enabled;
    if (this.musicGain && typeof music === 'number') this.musicGain.gain.setTargetAtTime(Math.max(0, Math.min(1, music)), this.ctx.currentTime, 0.05);
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
    const target = Math.max(0, Math.min(1, this.musicVolume));
    this.musicGain.gain.setValueAtTime(0.0001, t);

    // Use small building blocks per scene
    if (kind === 'title') {
      this._padChord([220, 277.18, 329.63], 0.6);
    } else if (kind === 'DASHASHWAMEDH_GHAT') {
      this._riverNoise();
      this._randomBell(5);
    } else if (kind === 'LABYRINTH_GHATS') {
      this._lowDrone();
      this._drip(7);
    } else {
      this._padChord([196, 246.94, 293.66], 0.5);
    }

    this.musicGain.gain.setTargetAtTime(target, t + 0.02, this.sceneFadeMs);
  }

  _makeOsc(freq, type = 'sine', gain = 0.1) {
    const osc = this.ctx.createOscillator();
    osc.type = type;
    osc.frequency.value = freq;
    const g = this.ctx.createGain();
    g.gain.value = 0.0001;
    osc.connect(g).connect(this.musicGain);
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
    noise.connect(lpf).connect(g).connect(this.musicGain);
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

  _lowDrone() {
    const { g } = this._makeOsc(98, 'sawtooth');
    const lpf = this.ctx.createBiquadFilter();
    lpf.type = 'lowpass';
    lpf.frequency.value = 300;
    g.disconnect();
    g.connect(lpf).connect(this.musicGain);
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
      o.connect(g).connect(this.musicGain);
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
      o.frequency.setValueAtTime(660, t);
      o.frequency.exponentialRampToValueAtTime(880, t + 0.08);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.18, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);
    } else if (type === 'journal') {
      o.type = 'sine';
      o.frequency.setValueAtTime(520, t);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.2, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.4);
    } else if (type === 'objective') {
      o.type = 'sine';
      o.frequency.setValueAtTime(440, t);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.22, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
    } else { // click
      o.type = 'square';
      o.frequency.setValueAtTime(320, t);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.25, t + 0.005);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);
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
    engine.setVolumes({ music: state.settings.musicVolume, sfx: state.settings.sfxVolume, enabled: state.settings.soundEnabled });
  }, [state.settings.musicVolume, state.settings.sfxVolume, state.settings.soundEnabled]);

  useEffect(() => {
    const scene = state.gameState === 'TITLE_SCREEN' ? 'title' : state.currentScene;
    if (prevScene.current !== scene) {
      prevScene.current = scene;
      engine.startAmbient(scene);
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
    document.addEventListener('mouseover', onOver);
    document.addEventListener('click', onClick);
    return () => {
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('click', onClick);
    };
  }, []);

  return null;
}
