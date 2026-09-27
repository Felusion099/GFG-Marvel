window.BND = window.BND || {};

BND.loader = (function () {
  "use strict";

  let el = null;
  let fill = null;
  let pct = null;

  function init() {
    el = document.getElementById("loader");
    fill = document.getElementById("loader-fill");
    pct = document.getElementById("loader-pct");
    setProgress(0);
  }

  function setProgress(p) {
    if (fill) fill.style.width = Math.round(p * 100) + "%";
    if (pct) pct.textContent = Math.round(p * 100) + "%";
  }

  function finish() {
    setProgress(1);
    if (el) {
      gsap.to(el, {
        opacity: 0,
        duration: 0.9,
        ease: "sine.inOut",
        delay: 0.35,
        onComplete: function () {
          el.style.visibility = "hidden";
        }
      });
    }
  }

  return {
    init: init,
    setProgress: setProgress,
    finish: finish
  };
})();
