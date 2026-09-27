window.BND = window.BND || {};

BND.timeline = (function () {
  "use strict";

  let tl = null;
  let positions = {};
  let previousProgress = 0;

  function computePositions() {
    const cfg = BND.CONFIG;
    let acc = 0;
    cfg.segments.forEach(function (seg) {
      positions[seg.id] = acc;
      acc += seg.weight;
    });
    positions.total = acc;
    Object.keys(cfg.subLabels).forEach(function (id) {
      const def = cfg.subLabels[id];
      positions[id] = positions[def.after] + def.offset;
    });
    return positions;
  }

  function at(id) {
    return positions[id];
  }

  function t(labelStr) {
    const plus = labelStr.indexOf("+");
    if (plus === -1) return at(labelStr);
    return at(labelStr.slice(0, plus)) + parseFloat(labelStr.slice(plus + 1));
  }

  function gap(fromStr, toStr) {
    return t(toStr) - t(fromStr);
  }

  function addLabel(id) {
    tl.addLabel(id, at(id));
  }

  function build() {
    computePositions();
    const cam = BND.camera.cam;
    const rain = BND.fx.rainProxy;

    tl = gsap.timeline({
      paused: true,
      defaults: { ease: "power1.inOut" },
      scrollTrigger: {
        trigger: "#scroll-track",
        start: "top top",
        end: "bottom bottom",
        scrub: 1.2,
        onUpdate: onUpdate
      }
    });

    const labels = ["intro", "jeanIsolation", "peterIntroduction", "identityConversation", "imBoth", "sharedLoss", "alone", "youHaveMe", "hold", "spiderSense", "bullet", "protectJean", "impact", "blood", "stagger", "fall", "jeanReaction", "injuryDialogue", "justGo", "ground", "aftermath", "hospitalNews", "hospital", "peterWake", "jeanOkay", "final", "black"];
    labels.forEach(addLabel);

    buildCamera();
    buildCharacters();
    buildEffectsAndGrade();
    buildDialogue();
    buildHospital();
    buildAudioZones();

    return tl;
  }

  function buildCamera() {
    const cam = BND.camera.cam;

    const keys = [
      { t: "intro", state: { xf: -0.02, yf: 0, s: 1.04, fx: 0.5, fy: 0.55, dof: 0.12 }, ease: "sine.inOut" },
      { t: "jeanIsolation", state: { xf: 0.1, s: 1.14, fx: 0.36, fy: 0.6, dof: 0.35 }, ease: "sine.inOut" },
      { t: "peterIntroduction", state: { xf: 0.03, s: 1.08, fx: 0.52, fy: 0.58, dof: 0.28 }, ease: "sine.inOut" },
      { t: "identityConversation", state: { xf: 0, s: 1.26, fx: 0.5, fy: 0.62, dof: 0.4 }, ease: "sine.inOut" },
      { t: "imBoth", state: { s: 1.5, fx: 0.58, fy: 0.55, dof: 0.25 }, ease: "sine.out" },
      { t: "sharedLoss", state: { s: 1.36, fx: 0.52, fy: 0.6, dof: 0.42 }, ease: "sine.inOut" },
      { t: "alone", state: { s: 1.46, fx: 0.4, fy: 0.6, dof: 0.6 }, ease: "sine.inOut" },
      { t: "youHaveMe", state: { s: 1.6, fx: 0.5, fy: 0.58, dof: 0.3 }, ease: "sine.out" },
      { t: "hold", state: { s: 1.61, dof: 0.28 }, ease: "sine.inOut" },
      { t: "spiderSense", state: { s: 1.66, fx: 0.62, fy: 0.56, dof: 0, rot: 0.4 }, ease: "power2.in" },
      { t: "bullet", state: { s: 1.7, rot: -0.3 }, ease: "power4.in" },
      { t: "impact", state: { s: 1.74, rot: 0.5 }, ease: "power2.out" },
      { t: "blood", state: { s: 1.7, rot: 0 }, ease: "power1.out" },
      { t: "stagger", state: { s: 1.6, yf: 0.04, fx: 0.55, rot: 0 }, ease: "sine.inOut" },
      { t: "fall", state: { s: 1.5, yf: 0.1, fy: 0.5, dof: 0.2 }, ease: "sine.in" },
      { t: "jeanReaction", state: { s: 1.42, yf: 0.12, fx: 0.5, fy: 0.45, dof: 0.3 }, ease: "sine.inOut" },
      { t: "injuryDialogue", state: { s: 1.45, yf: 0.13, fy: 0.42, dof: 0.3 }, ease: "sine.inOut" },
      { t: "justGo", state: { s: 1.4, yf: 0.14, fy: 0.4 }, ease: "sine.inOut" },
      { t: "ground", state: { s: 1.52, yf: 0.15, fx: 0.48, fy: 0.38, dof: 0.25 }, ease: "sine.out" },
      { t: "aftermath", state: { s: 1.5, yf: 0.15, dof: 0.3 }, ease: "sine.inOut" },
      { t: "hospitalNews", state: { s: 1.48 }, ease: "sine.inOut" },
      { t: "hospital", state: { s: 1.08, yf: 0, fx: 0.5, fy: 0.55, dof: 0.15 }, ease: "sine.inOut" },
      { t: "peterWake", state: { s: 1.12, fx: 0.55 }, ease: "sine.inOut" },
      { t: "jeanOkay", state: { s: 1.12 }, ease: "sine.inOut" },
      { t: "final", state: { s: 1.0, dof: 0.1 }, ease: "sine.inOut" },
      { t: "black", state: { s: 1.0 }, ease: "sine.inOut" }
    ];

    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      const start = at(k.t);
      const nextT = i + 1 < keys.length ? at(keys[i + 1].t) : positions.total;
      tl.to(cam, Object.assign({ duration: nextT - start, ease: k.ease }, k.state), start);
    }

    tl.to(cam, { shake: 0.35, duration: 0.05, ease: "power2.in" }, "bullet");
    tl.to(cam, { shake: 0, duration: 0.5, ease: "power2.out" }, "bullet+0.05");
    tl.to(cam, { shake: 1, duration: 0.1, ease: "power2.in" }, "impact");
    tl.to(cam, { shake: 0, duration: 2.6, ease: "power2.out" }, "impact+0.1");
  }

  function buildCharacters() {
    const peter = "#peter-actor";
    const jean = "#jean-actor";

    gsap.set(peter, { xPercent: 26, opacity: 0 });

    tl.to(peter, { xPercent: 0, opacity: 1, duration: gap("peterIntroduction", "identityConversation"), ease: "power2.out" }, "peterIntroduction");

    tl.to(jean, { xPercent: 5, duration: gap("identityConversation", "alone"), ease: "sine.inOut" }, "identityConversation");
    tl.to(peter, { xPercent: -5, duration: gap("identityConversation", "alone"), ease: "sine.inOut" }, "identityConversation");

    poseFade("#ly-jean .pose[data-pose='isolated']", 0, "jeanIsolation", gap("jeanIsolation", "peterIntroduction") * 0.5);
    poseFade("#ly-jean .pose[data-pose='facing']", 1, "jeanIsolation", gap("jeanIsolation", "peterIntroduction") * 0.5);

    tl.to(jean, { xPercent: 8, duration: gap("reaction", "ground"), ease: "sine.inOut" }, "reaction");

    poseFade("#ly-jean .pose[data-pose='push']", 0, "protectJean", 0.5);
    poseFade("#ly-jean .pose[data-pose='facing']", 1, "protectJean", 0.5);
    poseFade("#ly-jean .pose[data-pose='facing']", 0, "impact+0.5", 1.2);
    poseFade("#ly-jean .pose[data-pose='reach']", 1, "impact+0.5", 1.2);
    poseFade("#ly-jean .pose[data-pose='reach']", 0, "ground+0.2", 1.5);
    poseFade("#ly-jean .pose[data-pose='kneel']", 1, "ground+0.2", 1.5);

    poseFade(peter + " .pose[data-pose='stand']", 0, "protectJean", 0.45);
    poseFade(peter + " .pose[data-pose='lunge']", 1, "protectJean", 0.45);
    tl.to(peter, { xPercent: -11, duration: 0.55, ease: "power3.out" }, "protectJean");
    poseFade(peter + " .pose[data-pose='lunge']", 0, "impact+0.2", 1.3);
    poseFade(peter + " .pose[data-pose='stagger']", 1, "impact+0.2", 1.3);
    tl.to(peter, { xPercent: -7, duration: gap("impact+0.2", "stagger"), ease: "power1.out" }, "impact+0.2");

    poseFade(peter + " .pose[data-pose='stagger']", 0, "fall+3.2", 4.2);
    poseFade(peter + " .pose[data-pose='kneel']", 1, "fall+3.2", 4.2);
    poseFade(peter + " .pose[data-pose='kneel']", 0, "ground+0.4", 1.8);
    poseFade(peter + " .pose[data-pose='lying']", 1, "ground+0.4", 1.8);
    tl.to(peter, { xPercent: -3, duration: gap("ground+0.4", "ground+2.2"), ease: "power1.in" }, "ground+0.4");

    buildBlood();
  }

  function poseFade(selector, opacity, atLabel, dur) {
    tl.to(selector, { opacity: opacity, duration: dur || 1, ease: "sine.inOut" }, atLabel);
  }

  function buildBlood() {
    const stain = "#blood-stain";
    const spread = "#blood-spread";
    const drip = "#blood-drip";
    const ground = "#blood-ground";

    gsap.set(stain, { scale: 0.5 });
    gsap.set(spread, { scale: 0.7 });
    gsap.set(drip, { scaleY: 0.15 });

    tl.to(stain, { opacity: 0.95, scale: 1, duration: 0.7, ease: "power2.out" }, "impact+0.15");
    tl.to(spread, { opacity: 0.85, scale: 1.18, duration: 2.1, ease: "sine.inOut" }, "blood+0.3");
    tl.to(drip, { opacity: 0.75, scaleY: 1, duration: 2.2, ease: "sine.in" }, "blood+1.2");
    tl.to(stain, { opacity: 0, duration: 1.2, ease: "sine.inOut" }, "ground+0.5");
    tl.to(spread, { opacity: 0, duration: 1.2, ease: "sine.inOut" }, "ground+0.5");
    tl.to(drip, { opacity: 0, duration: 1.2, ease: "sine.inOut" }, "ground+0.5");
    tl.to(ground, { opacity: 0.9, duration: 1.6, ease: "sine.inOut" }, "ground+0.6");
    tl.to(ground, { opacity: 0.55, duration: gap("ground+2.2", "aftermath"), ease: "sine.inOut" }, "ground+2.2");
  }

  function buildEffectsAndGrade() {
    const rain = BND.fx.rainProxy;

    const rainKeys = [
      { t: "intro", state: { intensity: 0.75, speed: 1, wind: 0.3 } },
      { t: "jeanIsolation", state: { intensity: 0.5, speed: 0.9, wind: 0.2 } },
      { t: "peterIntroduction", state: { intensity: 0.45 } },
      { t: "identityConversation", state: { intensity: 0.35 } },
      { t: "alone", state: { intensity: 0.18, speed: 0.7, wind: 0.1 } },
      { t: "youHaveMe", state: { intensity: 0.1 } },
      { t: "hold", state: { intensity: 0.08 } },
      { t: "spiderSense", state: { intensity: 0.3, speed: 1.1, wind: 0.4 } },
      { t: "bullet", state: { intensity: 0.5 } },
      { t: "impact", state: { intensity: 0.55 } },
      { t: "ground", state: { intensity: 0.8, speed: 1.1 } },
      { t: "aftermath", state: { intensity: 0.9 } },
      { t: "hospital", state: { intensity: 0 } }
    ];

    for (let i = 0; i < rainKeys.length; i++) {
      const k = rainKeys[i];
      const start = at(k.t);
      const nextT = i + 1 < rainKeys.length ? at(rainKeys[i + 1].t) : positions.total;
      tl.to(rain, Object.assign({ duration: nextT - start, ease: "sine.inOut" }, k.state), start);
    }

    const warm = "#grade-warm";
    const cold = "#grade-cold";
    const vig = "#vignette";

    tl.to(warm, { opacity: 0.55, duration: 2.6, ease: "sine.out" }, "youHaveMe");
    tl.to(warm, { opacity: 0.5, duration: gap("hold", "spiderSense"), ease: "sine.inOut" }, "hold");
    tl.to(warm, { opacity: 0.12, duration: 0.6, ease: "power2.in" }, "spiderSense");
    tl.to(warm, { opacity: 0, duration: 0.5 }, "impact");

    gsap.set(cold, { opacity: 0.35 });
    tl.to(cold, { opacity: 0.28, duration: gap("intro", "jeanIsolation"), ease: "sine.inOut" }, "intro");
    tl.to(cold, { opacity: 0.24, duration: gap("jeanIsolation", "identityConversation"), ease: "sine.inOut" }, "jeanIsolation");
    tl.to(cold, { opacity: 0.32, duration: gap("sharedLoss", "alone"), ease: "sine.inOut" }, "sharedLoss");
    tl.to(cold, { opacity: 0.1, duration: 2.4, ease: "sine.out" }, "youHaveMe");
    tl.to(cold, { opacity: 0.5, duration: 0.5, ease: "power2.in" }, "spiderSense");
    tl.to(cold, { opacity: 0.32, duration: 0.5 }, "impact");
    tl.to(cold, { opacity: 0.38, duration: gap("ground", "aftermath"), ease: "sine.inOut" }, "ground");
    tl.to(cold, { opacity: 0, duration: 1.4, ease: "sine.inOut" }, "hospital");

    gsap.set(vig, { opacity: 0.55 });
    tl.to(vig, { opacity: 0.68, duration: gap("alone", "youHaveMe"), ease: "sine.inOut" }, "alone");
    tl.to(vig, { opacity: 0.6, duration: 2.4, ease: "sine.out" }, "youHaveMe");
    tl.to(vig, { opacity: 0.8, duration: 0.4, ease: "power2.in" }, "impact");
    tl.to(vig, { opacity: 0.72, duration: gap("blood", "ground"), ease: "sine.out" }, "blood");

    tl.fromTo("#sense-pulse", { opacity: 0 }, { opacity: 0.85, duration: 0.3, ease: "power2.in" }, "spiderSense");
    tl.to("#sense-pulse", { opacity: 0, duration: 1.3, ease: "power2.out" }, "spiderSense+0.3");

    tl.to("#flash", { opacity: 0.95, duration: 0.12, ease: "power4.in" }, "impact");
    tl.to("#flash", { opacity: 0, duration: 0.9, ease: "power2.out" }, "impact+0.12");

    tl.fromTo("#bullet-streak",
      { xPercent: 0, opacity: 0 },
      { opacity: 1, duration: 0.1, ease: "power1.in" }, "bullet");
    tl.to("#bullet-streak", { xPercent: -160, duration: 0.3, ease: "power4.in" }, "bullet+0.1");
    tl.to("#bullet-streak", { opacity: 0, duration: 0.2 }, "impact");

    tl.fromTo("#title-card", { opacity: 0, scale: 0.97 }, { opacity: 1, duration: 0.9, ease: "sine.out" }, "youHaveMe+4.3");
    tl.to("#title-card", { scale: 1.03, duration: gap("youHaveMe+4.3", "hold"), ease: "sine.inOut" }, "youHaveMe+5.2");
    tl.to("#title-card", { opacity: 0, duration: 0.9, ease: "sine.inOut" }, "hold+1.2");
  }

  function buildDialogue() {
    const container = document.getElementById("subtitles");
    BND.CONFIG.dialogue.forEach(function (beat) {
      const el = document.createElement("div");
      el.className = "sub" + (beat.text ? "" : " placeholder");
      el.textContent = beat.text ? beat.text : "[ " + beat.id + " ]";
      container.appendChild(el);
      const start = t(beat.seg + "+" + beat.offset);
      tl.to(el, { autoAlpha: 1, duration: 0.45, ease: "sine.out" }, start);
      tl.to(el, { autoAlpha: 0, duration: 0.4, ease: "sine.in" }, start + beat.dur);
    });
  }

  function buildHospital() {
    tl.to("#stage-hospital", { autoAlpha: 1, duration: 1.4, ease: "sine.inOut" }, "hospital+0.2");
    tl.to("#blackout", { opacity: 1, duration: 1, ease: "sine.inOut" }, "aftermath+0.8");
    tl.to("#blackout", { opacity: 0, duration: 1.4, ease: "sine.inOut" }, "hospital+0.3");
    tl.to("#flash", { opacity: 0.5, duration: 0.5, ease: "sine.out" }, "hospital+0.4");
    tl.to("#flash", { opacity: 0, duration: 1.6, ease: "sine.inOut" }, "hospital+0.9");

    tl.to("#news-lower", { autoAlpha: 1, duration: 0.6, ease: "sine.out" }, "hospitalNews");
    tl.to("#news-lower", { autoAlpha: 0, duration: 0.5, ease: "sine.in" }, "hospitalNews+1.8");

    tl.to("#final-text", { opacity: 1, duration: 0.5, ease: "sine.out" }, "black+0.1");
    tl.to("#final-text", { opacity: 0, duration: 0.15, ease: "sine.in" }, "black+0.8");
    tl.to("#blackout", { opacity: 1, duration: 0.7, ease: "sine.inOut" }, "final");
  }

  function buildAudioZones() {
    BND.audio.setZones({
      youHaveMe: at("youHaveMe"),
      hold: at("hold"),
      spiderSense: at("spiderSense"),
      bulletEnd: at("bullet") + BND.CONFIG.segments[9].weight,
      impact: at("impact"),
      ground: at("ground"),
      hospital: at("hospital"),
      identity: at("identityConversation"),
      sharedLoss: at("sharedLoss"),
      alone: at("alone")
    });
  }

  return {
    build: build,
    positions: positions,
    get tl() { return tl; },
    onUpdate: onUpdate
  };

  function onUpdate(self) {
    const p = self.progress * positions.total;
    BND.audio.setFromProgress(p);
    BND.debug.updateProgress(self.progress, p);
    handleOneShots(p);
    handleBreathing(p);
    previousProgress = p;
  }

  function handleOneShots(p) {
    if (previousProgress < at("impact") && p >= at("impact")) BND.audio.gunshot();
    if (previousProgress < at("spiderSense") && p >= at("spiderSense")) BND.audio.senseTick();
    if (previousProgress < at("hospital") && p >= at("hospital")) BND.audio.monitorBeep();
  }

  function handleBreathing(p) {
    const breath = document.getElementById("peter-breath");
    if (!breath || !BND.breathTween) return;
    const inGround = p >= at("ground") - 1 && p < at("hospital");
    if (inGround && BND.breathTween.paused()) {
      gsap.to(breath, { opacity: 0.8, duration: 1 });
      BND.breathTween.play();
    } else if (!inGround && !BND.breathTween.paused()) {
      gsap.to(breath, { opacity: 0, duration: 0.6 });
      BND.breathTween.pause();
    }
  }
})();
