window.BND = window.BND || {};

BND.audio = (function () {
  "use strict";

  let ctx = null;
  let master = null;
  let layers = {};
  let enabled = false;
  let zones = null;
  let heartbeatTimer = null;
  let bpm = 55;

  function noiseBuffer(seconds) {
    const len = Math.floor(ctx.sampleRate * seconds);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    return buf;
  }

  function makeNoiseLayer(vol, freq, q) {
    const src = ctx.createBufferSource();
    src.buffer = noiseBuffer(2.5);
    src.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = freq;
    filter.Q.value = q || 0.7;
    const gain = ctx.createGain();
    gain.gain.value = 0;
    src.connect(filter);
    filter.connect(gain);
    gain.connect(master);
    src.start();
    return { gain: gain, filter: filter };
  }

  function makeTone(freq, vol, type) {
    const osc = ctx.createOscillator();
    osc.type = type || "sine";
    osc.frequency.value = freq;
    const gain = ctx.createGain();
    gain.gain.value = 0;
    osc.connect(gain);
    gain.connect(master);
    osc.start();
    return { gain: gain, osc: osc };
  }

  function makeMusicPad() {
    const gain = ctx.createGain();
    gain.gain.value = 0;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 900;
    filter.connect(gain);
    gain.connect(master);
    const freqs = [110, 130.81, 164.81, 220];
    const oscs = freqs.map(function (f, i) {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = f;
      osc.detune.value = (i - 1.5) * 4;
      const og = ctx.createGain();
      og.gain.value = 0.25 / (i + 1);
      osc.connect(og);
      og.connect(filter);
      osc.start();
      return osc;
    });
    return { gain: gain, oscs: oscs, filter: filter };
  }

  function init() {
    if (ctx) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);

    layers.rain = makeNoiseLayer(0.5, 2600, 0.4);
    layers.ambience = makeTone(52, 0.05, "sine");
    layers.ambience2 = makeTone(55.5, 0.04, "sine");
    layers.hospitalHum = makeNoiseLayer(0, 420, 1.2);
    layers.highTone = makeTone(7600, 0, "sine");
    layers.music = makeMusicPad();
  }

  function resume() {
    if (ctx && ctx.state === "suspended") ctx.resume();
  }

  function toggle() {
    init();
    resume();
    if (!ctx) return false;
    enabled = !enabled;
    const t = ctx.currentTime;
    master.gain.cancelScheduledValues(t);
    master.gain.linearRampToValueAtTime(enabled ? 0.9 : 0, t + 0.4);
    return enabled;
  }

  function ramp(node, value, seconds) {
    if (!ctx || !node) return;
    const t = ctx.currentTime;
    node.gain.cancelScheduledValues(t);
    node.gain.setValueAtTime(node.gain.value, t);
    node.gain.linearRampToValueAtTime(value, t + (seconds || 0.5));
  }

  function setZones(z) {
    zones = z;
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function band(p, a, b) {
    return Math.min(1, Math.max(0, (p - a) / (b - a)));
  }

  function setFromProgress(p) {
    if (!ctx || !zones) return;
    const y = zones.youHaveMe;
    const imp = zones.impact;
    const gr = zones.ground;
    const hs = zones.hospital;

    let rain;
    if (p < zones.alone) rain = lerp(0.55, 0.4, band(p, 0, zones.alone));
    else if (p < y) rain = lerp(0.4, 0.16, band(p, zones.alone, y));
    else if (p < zones.spiderSense) rain = 0.14;
    else if (p < imp) rain = lerp(0.14, 0.4, band(p, zones.spiderSense, imp));
    else if (p < gr) rain = lerp(0.4, 0.18, band(p, imp, gr));
    else if (p < hs) rain = lerp(0.18, 0.6, band(p, gr, hs));
    else rain = lerp(0.6, 0, band(p, hs, hs + 0.02));

    let music;
    if (p < zones.identity) music = lerp(0.05, 0.1, band(p, 0, zones.identity));
    else if (p < zones.sharedLoss) music = 0.13;
    else if (p < zones.alone) music = lerp(0.13, 0.04, band(p, zones.sharedLoss, zones.alone));
    else if (p < y) music = lerp(0.04, 0.06, band(p, zones.alone, y));
    else if (p < zones.hold) music = lerp(0.06, 0.24, band(p, y, zones.hold));
    else if (p < zones.spiderSense) music = 0.2;
    else if (p < imp) music = lerp(0.2, 0, band(p, zones.spiderSense, imp));
    else music = 0;

    let amb;
    if (p < imp) amb = 0.06;
    else if (p < hs) amb = lerp(0.06, 0.015, band(p, imp, gr));
    else amb = lerp(0.015, 0.05, band(p, hs, hs + 0.02));

    let hbVol = 0;
    let targetBpm = 55;
    if (p >= imp && p < gr) {
      hbVol = lerp(0.3, 0.22, band(p, imp, gr));
      targetBpm = lerp(78, 44, band(p, imp, gr));
    } else if (p >= gr && p < hs) {
      hbVol = 0.14;
      targetBpm = 40;
    }

    const hospitalVol = p >= hs ? lerp(0, 0.08, band(p, hs, hs + 0.015)) : 0;
    const toneVol = p >= zones.spiderSense && p < zones.bulletEnd ? 0.025 : 0;

    ramp(layers.rain.gain, rain, 0.35);
    ramp(layers.music.gain, music, 0.6);
    ramp(layers.ambience.gain, amb, 0.5);
    ramp(layers.ambience2.gain, amb * 0.8, 0.5);
    ramp(layers.hospitalHum.gain, hospitalVol, 0.5);
    ramp(layers.highTone.gain, toneVol, 0.2);

    if (Math.abs(targetBpm - bpm) > 2) {
      bpm = targetBpm;
      startHeartbeat(hbVol > 0);
    }
    heartbeatVol = hbVol;
  }

  let heartbeatVol = 0;

  function startHeartbeat(on) {
    if (heartbeatTimer) {
      clearInterval(heartbeatTimer);
      heartbeatTimer = null;
    }
    if (!on) return;
    const thump = function () {
      if (!ctx || heartbeatVol <= 0) return;
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(62, t);
      osc.frequency.exponentialRampToValueAtTime(30, t + 0.16);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(heartbeatVol, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.24);
      osc.connect(g);
      g.connect(master);
      osc.start(t);
      osc.stop(t + 0.3);
      const t2 = t + 0.28;
      const osc2 = ctx.createOscillator();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(55, t2);
      osc2.frequency.exponentialRampToValueAtTime(28, t2 + 0.14);
      const g2 = ctx.createGain();
      g2.gain.setValueAtTime(0, t2);
      g2.gain.linearRampToValueAtTime(heartbeatVol * 0.7, t2 + 0.02);
      g2.gain.exponentialRampToValueAtTime(0.001, t2 + 0.2);
      osc2.connect(g2);
      g2.connect(master);
      osc2.start(t2);
      osc2.stop(t2 + 0.26);
    };
    thump();
    heartbeatTimer = setInterval(thump, (60 / bpm) * 1000);
  }

  function gunshot() {
    if (!ctx) return;
    const t = ctx.currentTime;
    const src = ctx.createBufferSource();
    src.buffer = noiseBuffer(0.5);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.9, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(8000, t);
    filter.frequency.exponentialRampToValueAtTime(300, t + 0.35);
    src.connect(filter);
    filter.connect(g);
    g.connect(master);
    src.start(t);
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(110, t);
    osc.frequency.exponentialRampToValueAtTime(38, t + 0.22);
    const og = ctx.createGain();
    og.gain.setValueAtTime(0.7, t);
    og.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
    osc.connect(og);
    og.connect(master);
    osc.start(t);
    osc.stop(t + 0.4);
  }

  function senseTick() {
    if (!ctx) return;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = 5200;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.05, t + 0.05);
    g.gain.linearRampToValueAtTime(0, t + 0.5);
    osc.connect(g);
    g.connect(master);
    osc.start(t);
    osc.stop(t + 0.55);
  }

  function monitorBeep() {
    if (!ctx) return;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = 880;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.035, t + 0.03);
    g.gain.linearRampToValueAtTime(0, t + 0.35);
    osc.connect(g);
    g.connect(master);
    osc.start(t);
    osc.stop(t + 0.4);
  }

  function isEnabled() {
    return enabled;
  }

  return {
    init: init,
    toggle: toggle,
    setZones: setZones,
    setFromProgress: setFromProgress,
    gunshot: gunshot,
    senseTick: senseTick,
    monitorBeep: monitorBeep,
    isEnabled: isEnabled
  };
})();
