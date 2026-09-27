window.BND = window.BND || {};

BND.debug = (function () {
  "use strict";

  let el = null;
  let els = {};
  let visible = false;
  let frames = 0;
  let fps = 0;
  let lastFpsTime = performance.now();

  function init() {
    el = document.getElementById("debug");
    els.progress = document.getElementById("dbg-progress");
    els.scene = document.getElementById("dbg-scene");
    els.label = document.getElementById("dbg-label");
    els.cam = document.getElementById("dbg-cam");
    els.fps = document.getElementById("dbg-fps");

    if (location.search.indexOf("debug=1") !== -1) {
      show();
    }

    document.addEventListener("keydown", function (e) {
      if (e.key === "`" || e.key === "~") {
        if (visible) hide();
        else show();
      }
    });

    countFps();
  }

  function show() {
    visible = true;
    if (el) el.hidden = false;
  }

  function hide() {
    visible = false;
    if (el) el.hidden = true;
  }

  function countFps() {
    frames++;
    const now = performance.now();
    if (now - lastFpsTime >= 1000) {
      fps = Math.round((frames * 1000) / (now - lastFpsTime));
      frames = 0;
      lastFpsTime = now;
      if (visible && els.fps) els.fps.textContent = fps;
    }
    requestAnimationFrame(countFps);
  }

  function updateProgress(scrollProgress, timelineUnits) {
    if (!visible) return;
    if (els.progress) els.progress.textContent = Math.round(scrollProgress * 100) + "%";
    const label = BND.timeline.tl ? BND.timeline.tl.currentLabel() : "intro";
    if (els.label) els.label.textContent = label || "intro";
    if (els.scene) els.scene.textContent = sceneFor(timelineUnits);
    const cam = BND.camera.cam;
    if (els.cam) {
      els.cam.textContent = cam.xf.toFixed(2) + " " + cam.yf.toFixed(2) + " " + cam.s.toFixed(2);
    }
  }

  function sceneFor(units) {
    const positions = BND.timeline.positions;
    let scene = "intro";
    BND.CONFIG.segments.forEach(function (seg) {
      if (units >= positions[seg.id]) scene = seg.id;
    });
    return scene;
  }

  return {
    init: init,
    show: show,
    hide: hide,
    updateProgress: updateProgress,
    get fps() { return fps; }
  };
})();
