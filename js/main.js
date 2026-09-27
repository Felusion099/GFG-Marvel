window.BND = window.BND || {};

(function () {
  "use strict";

  BND.loader.init();

  const bootPromise = new Promise(function (resolve) {
    setTimeout(resolve, 900);
  });

  BND.assets.buildAll(function (p) {
    BND.loader.setProgress(p);
  })
    .then(function () {
      return bootPromise;
    })
    .then(function () {
      start();
    });

  function start() {
    BND.fx.init();
    BND.fx.initGrain();
    BND.camera.init();
    BND.debug.init();

    gsap.registerPlugin(ScrollTrigger);

    BND.timeline.build();

    if (!BND.fx.reduced) {
      BND.breathTween = gsap.to("#peter-breath", {
        scaleY: 1.06,
        opacity: 0.8,
        duration: 2.4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        paused: true
      });
    }

    BND.loader.finish();

    gsap.ticker.add(function (time, deltaTime) {
      const dt = Math.min(0.05, deltaTime / 1000);
      BND.fx.applyRain();
      BND.fx.stepRain(dt);
      BND.fx.tickGrain();
      BND.fx.watchAdaptive(dt);
      BND.camera.apply();
    });

    window.addEventListener("resize", function () {
      BND.fx.resize();
      if (ScrollTrigger) ScrollTrigger.refresh();
    });

    document.getElementById("sound-toggle").addEventListener("click", function () {
      const on = BND.audio.toggle();
      this.textContent = on ? "SOUND ON" : "SOUND OFF";
    });

    window.addEventListener("keydown", function (e) {
      if (e.key === " " && document.activeElement === document.body) {
        e.preventDefault();
        window.scrollBy({ top: innerHeight * 0.9, behavior: "smooth" });
      }
    });
  }
})();
