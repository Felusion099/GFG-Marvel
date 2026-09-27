window.BND = window.BND || {};

BND.fx = (function () {
  "use strict";

  const rainProxy = { intensity: 0.75, speed: 1, wind: 0.3 };
  const state = { dof: 0.12 };
  let rainCanvas = null;
  let rainCtx = null;
  let fgCanvas = null;
  let fgCtx = null;
  let drops = [];
  let fgDrops = [];
  let W = 0;
  let H = 0;
  let dpr = 1;
  let reduced = false;
  let frame = 0;
  let fpsSamples = [];
  let qualityLevel = 1;

  function init() {
    reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    rainCanvas = document.getElementById("rain");
    rainCtx = rainCanvas.getContext("2d");
    const cfg = BND.CONFIG.particles;
    fgCanvas = BND.art.makeCanvas(10, 10);
    if (innerWidth > 768 && cfg.fgDesktop > 0) {
      const layer = document.getElementById("ly-fgrain-rain");
      fgCanvas.style.width = "100%";
      fgCanvas.style.height = "100%";
      layer.appendChild(fgCanvas);
      fgCtx = fgCanvas.getContext("2d");
    }
    resize();
    seedDrops();
  }

  function resize() {
    dpr = Math.min(1.5, window.devicePixelRatio || 1);
    W = innerWidth;
    H = innerHeight;
    rainCanvas.width = W * dpr;
    rainCanvas.height = H * dpr;
    rainCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (fgCtx) {
      fgCanvas.width = W * dpr;
      fgCanvas.height = H * dpr;
      fgCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    seedDrops();
  }

  function seedDrops() {
    const cfg = BND.CONFIG.particles;
    const baseCount = innerWidth > 768 ? cfg.desktop : cfg.mobile;
    const fgCount = innerWidth > 768 ? cfg.fgDesktop : cfg.fgMobile;
    const count = Math.round(baseCount * qualityLevel);
    const fgCount2 = Math.round(fgCount * qualityLevel);
    drops = [];
    for (let i = 0; i < count; i++) {
      drops.push(newDrop(true));
    }
    fgDrops = [];
    for (let i = 0; i < fgCount2; i++) {
      fgDrops.push(newDrop(true, true));
    }
  }

  function newDrop(randomY, fg) {
    const sp = fg ? 1.5 : 1;
    return {
      x: Math.random() * (W + 200) - 100,
      y: randomY ? Math.random() * H : -40,
      len: (fg ? 26 : 12) + Math.random() * (fg ? 30 : 14),
      v: (fg ? 900 : 560) * sp * (0.7 + Math.random() * 0.6),
      a: (fg ? 0.14 : 0.22) + Math.random() * 0.14,
      w: fg ? 1.4 : 1
    };
  }

  function stepRain(dt) {
    const ctx2 = rainCtx;
    ctx2.clearRect(0, 0, W, H);
    if (rainProxy.intensity <= 0.005) {
      if (fgCtx) fgCtx.clearRect(0, 0, W, H);
      return;
    }
    const visCount = Math.round(drops.length * Math.min(1, rainProxy.intensity * 1.4));
    const windPx = rainProxy.wind * 160;
    ctx2.strokeStyle = "#a8c4d8";
    ctx2.lineCap = "round";
    for (let i = 0; i < visCount; i++) {
      const d = drops[i];
      d.y += d.v * rainProxy.speed * dt;
      d.x += windPx * dt * (d.v / 900);
      if (d.y > H + 40) {
        drops[i] = newDrop(false, false);
        continue;
      }
      if (d.x > W + 60) d.x = -60;
      const dx = (windPx / d.v) * d.len;
      ctx2.globalAlpha = d.a * Math.min(1, rainProxy.intensity * 1.6);
      ctx2.lineWidth = d.w;
      ctx2.beginPath();
      ctx2.moveTo(d.x, d.y);
      ctx2.lineTo(d.x + dx, d.y + d.len);
      ctx2.stroke();
    }
    ctx2.globalAlpha = 1;

    if (fgCtx && fgDrops.length) {
      const fgVis = Math.round(fgDrops.length * Math.min(1, rainProxy.intensity * 1.3));
      fgCtx.strokeStyle = "#9cb8cc";
      fgCtx.lineCap = "round";
      for (let i = 0; i < fgVis; i++) {
        const d = fgDrops[i];
        d.y += d.v * rainProxy.speed * dt;
        d.x += windPx * dt * (d.v / 900);
        if (d.y > H + 60) {
          fgDrops[i] = newDrop(false, true);
          continue;
        }
        const dx = (windPx / d.v) * d.len;
        fgCtx.globalAlpha = d.a * Math.min(1, rainProxy.intensity * 1.5);
        fgCtx.lineWidth = d.w;
        fgCtx.beginPath();
        fgCtx.moveTo(d.x, d.y);
        fgCtx.lineTo(d.x + dx, d.y + d.len);
        fgCtx.stroke();
      }
      fgCtx.globalAlpha = 1;
    }
  }

  let grainEl = null;

  function initGrain() {
    grainEl = document.createElement("div");
    const svg = "<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/><feColorMatrix type='saturate' values='0'/></filter><rect width='160' height='160' filter='url(%23n)' opacity='0.5'/></svg>";
    grainEl.style.cssText = "position:absolute;inset:0;z-index:10;pointer-events:none;opacity:0.05;background-image:url(\"data:image/svg+xml;utf8," + svg.replace(/"/g, "'") + "\");background-size:160px 160px;will-change:opacity;";
    document.getElementById("experience").appendChild(grainEl);
  }

  function tickGrain() {
    frame++;
    if (frame % 4 === 0 && grainEl && qualityLevel > 0.3) {
      grainEl.style.opacity = (0.045 + Math.random() * 0.02).toFixed(3);
    }
  }

  function watchAdaptive(dt) {
    if (!BND.debug || !BND.debug.fps) return;
    fpsSamples.push(BND.debug.fps);
    if (fpsSamples.length > 90) {
      const avg = fpsSamples.reduce(function (a, b) { return a + b; }, 0) / fpsSamples.length;
      fpsSamples = [];
      if (avg < 38 && qualityLevel > 0.4) {
        qualityLevel -= 0.3;
        seedDrops();
      }
    }
  }

  function setDof(v) {
    state.dof = v;
    const px = v * 14;
    const ids = ["ly-sky", "ly-skyline-far", "ly-bokeh", "ly-skyline-mid"];
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) el.style.filter = (id === "ly-skyline-far" ? "blur(" + (px + 2) + "px) brightness(0.8)" : "blur(" + px.toFixed(1) + "px)");
    }
  }

  function applyRain() {
    if (reduced) {
      rainProxy.intensity = Math.min(rainProxy.intensity, 0.25);
      rainProxy.wind = 0;
      rainProxy.speed = Math.min(rainProxy.speed, 0.6);
    }
  }

  return {
    init: init,
    resize: resize,
    stepRain: stepRain,
    initGrain: initGrain,
    tickGrain: tickGrain,
    watchAdaptive: watchAdaptive,
    setDof: setDof,
    applyRain: applyRain,
    rainProxy: rainProxy,
    state: state,
    get reduced() { return reduced; }
  };
})();
