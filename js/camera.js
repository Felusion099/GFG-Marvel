window.BND = window.BND || {};

BND.camera = (function () {
  "use strict";

  const cam = {
    xf: -0.02,
    yf: 0,
    s: 1.04,
    rot: 0,
    fx: 0.5,
    fy: 0.55,
    dof: 0.12,
    shake: 0
  };

  const OVER = 0;
  let layerEls = [];
  let shakeEl = null;
  let worldEl = null;
  let reduced = false;
  let lastSignature = "";

  function init() {
    reduced = BND.fx.reduced;
    worldEl = document.getElementById("world");
    shakeEl = document.getElementById("shake");
    layerEls = Array.prototype.slice.call(document.querySelectorAll(".layer"));
  }

  function damp(v) {
    return reduced ? v * 0.45 : v;
  }

  function apply() {
    const px = damp(cam.xf) * innerWidth;
    const py = damp(cam.yf) * innerHeight;
    const s = 1 + (damp(cam.s) - 1);
    const originX = ((damp(cam.fx) + OVER) / (1 + 2 * OVER)) * 100;
    const originY = ((damp(cam.fy) + OVER) / (1 + 2 * OVER)) * 100;
    const sx = cam.shake > 0 ? (Math.random() - 0.5) * cam.shake * 22 : 0;
    const sy = cam.shake > 0 ? (Math.random() - 0.5) * cam.shake * 22 : 0;

    const sig = [
      px.toFixed(1), py.toFixed(1), s.toFixed(3), originX.toFixed(1), originY.toFixed(1)
    ].join("|");

    const root = document.documentElement;
    root.style.setProperty("--fx", originX.toFixed(2) + "%");
    root.style.setProperty("--fy", originY.toFixed(2) + "%");

    if (sig !== lastSignature || cam.shake > 0) {
      for (let i = 0; i < layerEls.length; i++) {
        const el = layerEls[i];
        const d = parseFloat(el.dataset.depth || 0);
        const ls = 1 + (s - 1) * d;
        const tx = -px * d + sx;
        const ty = -py * d + sy;
        el.style.transform = "translate3d(" + tx.toFixed(1) + "px," + ty.toFixed(1) + "px,0) scale(" + ls.toFixed(4) + ")";
      }
      worldEl.style.transform = "rotate(" + damp(cam.rot).toFixed(2) + "deg)";
      lastSignature = sig;
    }

    if (Math.abs(cam.dof - BND.fx.state.dof) > 0.01) {
      BND.fx.setDof(cam.dof);
    }
  }

  return {
    cam: cam,
    init: init,
    apply: apply
  };
})();
