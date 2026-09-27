window.BND = window.BND || {};

BND.assets = (function () {
  "use strict";

  const dir = BND.CONFIG.assetsDir;

  const manifest = {
    generated: "2026-09-28",
    note: "All placeholder art is generated procedurally. Drop custom files with the same localPath to replace them (serve over http).",
    assets: [
      { name: "sky", localPath: "environment/sky.png", source: "procedural", license: "original placeholder", usage: "rooftop sky plate", attributionRequired: false },
      { name: "skyline-far", localPath: "environment/skyline-far.png", source: "procedural", license: "original placeholder", usage: "far skyline parallax", attributionRequired: false },
      { name: "skyline-mid", localPath: "environment/skyline-mid.png", source: "procedural", license: "original placeholder", usage: "mid skyline parallax", attributionRequired: false },
      { name: "bokeh", localPath: "environment/bokeh.png", source: "procedural", license: "original placeholder", usage: "city bokeh lights", attributionRequired: false },
      { name: "rooftop", localPath: "environment/rooftop.png", source: "procedural", license: "original placeholder", usage: "rooftop floor", attributionRequired: false },
      { name: "peter-conversation", localPath: "peter/peter-conversation.png", source: "procedural", license: "original placeholder", usage: "Peter standing two-shot", attributionRequired: false },
      { name: "peter-lunge", localPath: "peter/peter-lunge.png", source: "procedural", license: "original placeholder", usage: "Peter protecting Jean", attributionRequired: false },
      { name: "peter-stagger", localPath: "peter/peter-stagger.png", source: "procedural", license: "original placeholder", usage: "Peter wounded standing", attributionRequired: false },
      { name: "peter-kneel", localPath: "peter/peter-kneel.png", source: "procedural", license: "original placeholder", usage: "Peter collapsing", attributionRequired: false },
      { name: "peter-ground", localPath: "peter/peter-ground.png", source: "procedural", license: "original placeholder", usage: "Peter lying wounded", attributionRequired: false },
      { name: "jean-isolated", localPath: "jean/jean-isolated.png", source: "procedural", license: "original placeholder", usage: "Jean alone", attributionRequired: false },
      { name: "jean-conversation", localPath: "jean/jean-conversation.png", source: "procedural", license: "original placeholder", usage: "Jean two-shot", attributionRequired: false },
      { name: "jean-reach", localPath: "jean/jean-reach.png", source: "procedural", license: "original placeholder", usage: "Jean reaching", attributionRequired: false },
      { name: "jean-push", localPath: "jean/jean-push.png", source: "procedural", license: "original placeholder", usage: "Jean shoved aside", attributionRequired: false },
      { name: "jean-kneel", localPath: "jean/jean-kneel.png", source: "procedural", license: "original placeholder", usage: "Jean beside Peter", attributionRequired: false },
      { name: "hospital-room", localPath: "hospital/hospital-room.png", source: "procedural", license: "original placeholder", usage: "Bellevue room", attributionRequired: false },
      { name: "hospital-peter", localPath: "hospital/hospital-peter.png", source: "procedural", license: "original placeholder", usage: "Peter in bed", attributionRequired: false },
      { name: "blood-stain", localPath: "blood/blood-stain.png", source: "procedural", license: "original placeholder", usage: "impact stain", attributionRequired: false },
      { name: "blood-spread", localPath: "blood/blood-spread.png", source: "procedural", license: "original placeholder", usage: "blood spread", attributionRequired: false },
      { name: "blood-drip", localPath: "blood/blood-drip.png", source: "procedural", license: "original placeholder", usage: "blood drip layer", attributionRequired: false },
      { name: "blood-ground", localPath: "blood/blood-ground.png", source: "procedural", license: "original placeholder", usage: "ground blood pool", attributionRequired: false }
    ]
  };

  const store = {};

  function tryFetch(path) {
    return fetch(path)
      .then(function (r) {
        if (!r.ok) throw new Error("missing " + path);
        return r.blob();
      })
      .then(function (b) {
        return new Promise(function (resolve, reject) {
          const img = new Image();
          img.onload = function () { resolve(img); };
          img.onerror = reject;
          img.src = URL.createObjectURL(b);
        });
      });
  }

  function resolve(base) {
    if (store[base]) return Promise.resolve(store[base]);
    return tryFetch(dir + "/" + base + ".png")
      .catch(function () { return tryFetch(dir + "/" + base + ".svg"); })
      .then(function (img) {
        store[base] = img;
        return img;
      });
  }

  function toSrc(img) {
    if (!img) return null;
    return img.toDataURL ? img.toDataURL() : img.src;
  }

  function applyToLayer(el, img) {
    if (!el || !img) return;
    const src = toSrc(img);
    if (!src) return;
    el.style.backgroundImage = "url(" + src + ")";
    el.style.backgroundSize = "cover";
    el.style.backgroundPosition = "center";
  }

  function buildEnvironment(onProgress) {
    const env = BND.CONFIG.environment;
    const jobs = [];
    const map = {
      sky: function () { return BND.art.drawSky(innerWidth, innerHeight); },
      skylineFar: function () { return BND.art.drawSkyline(innerWidth, innerHeight, 0, 1234); },
      skylineMid: function () { return BND.art.drawSkyline(innerWidth, innerHeight, 1, 5678); },
      bokeh: function () { return BND.art.drawBokeh(innerWidth, innerHeight); },
      rooftop: function () { return BND.art.drawRooftop(innerWidth, innerHeight); },
      hospitalRoom: function () { return BND.art.drawHospitalRoom(innerWidth, innerHeight); },
      hospitalPeter: function () { return BND.art.drawHospitalPeter(innerWidth, innerHeight); }
    };
    let done = 0;
    const keys = Object.keys(env);
    return new Promise(function (resolveAll) {
      keys.forEach(function (key) {
        resolve(env[key]).catch(function () {}).then(function (img) {
          if (!img) img = map[key]();
          applyToLayer(document.getElementById("ly-" + key), img);
          done++;
          if (onProgress) onProgress(done / (keys.length * 2));
          if (done === keys.length) resolveAll();
        });
      });
    });
  }

  function buildActors(onProgress) {
    const actors = BND.CONFIG.actors;
    const actorW = Math.round(Math.max(220, innerWidth * 0.13));
    const actorH = Math.round(actorW * 2.2);
    const jobs = [];
    Object.keys(actors).forEach(function (actorName) {
      const actor = actors[actorName];
      const poses = actor.poses;
      poses.forEach(function (pose) {
        const base = actor.files[pose];
        jobs.push(
          resolve(base)
            .catch(function () {
              const draw = actorName === "peter" ? BND.art.drawPeter : BND.art.drawJean;
              const c = draw(actorW, actorH, pose);
              store[base] = c;
              return c;
            })
            .then(function (img) {
              const el = document.querySelector("#ly-" + actorName + " .pose[data-pose='" + pose + "']");
              if (!el) return;
              const src = toSrc(img);
              if (!src) return;
              el.style.backgroundImage = "url(" + src + ")";
              el.style.backgroundSize = "contain";
              el.style.backgroundPosition = "center bottom";
              if (onProgress) onProgress(1);
            })
        );
      });
    });
    return Promise.all(jobs);
  }

  function buildBlood(onProgress) {
    const jobs = [
      { id: "blood-stain", fn: function () { return BND.art.drawBloodStain(160); } },
      { id: "blood-spread", fn: function () { return BND.art.drawBloodSpread(180); } },
      { id: "blood-drip", fn: function () { return BND.art.drawBloodDrip(120, 180); } },
      { id: "blood-ground", fn: function () { return BND.art.drawBloodGround(220, 90); } }
    ];
    return Promise.all(
      jobs.map(function (j) {
        resolve(j.id.replace("blood-", "blood/"))
          .catch(function () {})
          .then(function (img) {
            if (!img) img = j.fn();
            const el = document.getElementById(j.id);
            if (el) {
              const src = toSrc(img);
              if (src) el.style.backgroundImage = "url(" + src + ")";
            }
            if (onProgress) onProgress(1);
          });
      })
    );
  }

  function loadManifest() {
    return fetch("assets.json")
      .then(function (r) { return r.ok ? r.json() : manifest; })
      .catch(function () { return manifest; });
  }

  function buildAll(onProgress) {
    return loadManifest().then(function (m) {
      manifest = m;
      return Promise.all([
        buildEnvironment(step(0, 0.4)),
        buildActors(step(0.4, 0.7)),
        buildBlood(step(0.7, 1))
      ]);
    });

    function step(from, to) {
      return function (p) {
        if (onProgress) onProgress(from + (p || 1) * (to - from));
      };
    }
  }

  return {
    resolve: resolve,
    buildAll: buildAll,
    buildEnvironment: buildEnvironment,
    buildActors: buildActors,
    buildBlood: buildBlood,
    getManifest: function () { return manifest; }
  };
})();
