window.BND = window.BND || {};

BND.art = (function () {
  "use strict";

  function seededRandom(seed) {
    let s = seed >>> 0;
    return function () {
      s = (s * 1664525 + 1013904223) >>> 0;
      return s / 4294967296;
    };
  }

  function makeCanvas(w, h) {
    const c = document.createElement("canvas");
    c.width = Math.max(2, Math.round(w));
    c.height = Math.max(2, Math.round(h));
    return c;
  }

  function drawSky(w, h) {
    const c = makeCanvas(w, h);
    const ctx = c.getContext("2d");
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, "#04060c");
    g.addColorStop(0.45, "#080f1a");
    g.addColorStop(0.78, "#0d1723");
    g.addColorStop(1, "#131f2c");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    const glow = ctx.createRadialGradient(w * 0.7, h * 0.72, 0, w * 0.7, h * 0.72, w * 0.5);
    glow.addColorStop(0, "rgba(90,110,120,0.14)");
    glow.addColorStop(1, "rgba(90,110,120,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);
    return c;
  }

  function drawSkyline(w, h, depth, seed) {
    const c = makeCanvas(w, h);
    const ctx = c.getContext("2d");
    const rnd = seededRandom(seed);
    const base = h * 0.98;
    const bodyCol = depth === 0 ? "#0a121c" : "#070c14";
    const winWarm = depth === 0 ? "rgba(217,164,65,0.75)" : "rgba(217,164,65,0.4)";
    const winCool = depth === 0 ? "rgba(127,176,201,0.6)" : "rgba(127,176,201,0.35)";
    ctx.fillStyle = bodyCol;
    let x = -20;
    while (x < w + 20) {
      const bw = 30 + rnd() * 90;
      const bh = h * (0.18 + rnd() * 0.4) * (depth === 0 ? 1 : 1.15);
      const top = base - bh;
      ctx.fillRect(x, top, bw, bh);
      if (rnd() > 0.6) {
        ctx.fillRect(x + bw * 0.3, top - 8 - rnd() * 20, 3, 10);
      }
      x += bw + 4 + rnd() * 26;
    }
    x = -20;
    while (x < w + 20) {
      const bw = 30 + rnd() * 90;
      const bh = h * (0.18 + rnd() * 0.4) * (depth === 0 ? 1 : 1.15);
      const top = base - bh;
      const cols = Math.floor(bw / 14);
      const rows = Math.floor(bh / 18);
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          if (rnd() > 0.82) {
            ctx.fillStyle = rnd() > 0.5 ? winWarm : winCool;
            ctx.fillRect(x + 6 + i * 14, top + 8 + j * 18, 3, 4);
          }
        }
      }
      x += bw + 4 + rnd() * 26;
    }
    ctx.fillStyle = bodyCol;
    ctx.fillRect(0, base - 4, w, h - base + 4);
    return c;
  }

  function drawBokeh(w, h) {
    const c = makeCanvas(w, h);
    const ctx = c.getContext("2d");
    const rnd = seededRandom(777);
    for (let i = 0; i < 46; i++) {
      const bx = rnd() * w;
      const by = h * 0.45 + rnd() * h * 0.5;
      const r = 2 + rnd() * 9;
      const col = rnd() > 0.5 ? "217,164,65" : "127,176,201";
      const a = 0.08 + rnd() * 0.16;
      const g = ctx.createRadialGradient(bx, by, 0, bx, by, r * 2.4);
      g.addColorStop(0, "rgba(" + col + "," + a + ")");
      g.addColorStop(1, "rgba(" + col + ",0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(bx, by, r * 2.4, 0, Math.PI * 2);
      ctx.fill();
    }
    return c;
  }

  function drawRooftop(w, h) {
    const c = makeCanvas(w, h);
    const ctx = c.getContext("2d");
    const g = ctx.createLinearGradient(0, h * 0.62, 0, h);
    g.addColorStop(0, "#0a1119");
    g.addColorStop(0.12, "#060a10");
    g.addColorStop(1, "#03050a");
    ctx.fillStyle = g;
    ctx.fillRect(0, h * 0.62, w, h * 0.38);

    ctx.fillStyle = "#04060a";
    ctx.fillRect(0, h * 0.6, w, h * 0.035);

    const parapet = h * 0.6;
    ctx.fillStyle = "#030509";
    for (let x = 0; x < w; x += 60) {
      ctx.fillRect(x, parapet - h * 0.028, 6, h * 0.028);
      ctx.fillRect(x + 18, parapet - h * 0.028, 6, h * 0.028);
    }
    ctx.fillRect(0, parapet - h * 0.028, w, 3);

    ctx.fillStyle = "#02040a";
    ctx.fillRect(w * 0.05, parapet - h * 0.16, w * 0.045, h * 0.16);
    ctx.fillRect(w * 0.045, parapet - h * 0.185, w * 0.055, h * 0.03);
    ctx.beginPath();
    ctx.moveTo(w * 0.042, parapet - h * 0.185);
    ctx.lineTo(w * 0.0725, parapet - h * 0.235);
    ctx.lineTo(w * 0.103, parapet - h * 0.185);
    ctx.fill();

    ctx.fillRect(w * 0.86, parapet - h * 0.075, w * 0.07, h * 0.075);
    ctx.fillRect(w * 0.85, parapet - h * 0.085, w * 0.09, h * 0.012);

    const wet = ctx.createLinearGradient(0, h * 0.72, 0, h);
    wet.addColorStop(0, "rgba(140,170,190,0.05)");
    wet.addColorStop(1, "rgba(140,170,190,0.015)");
    ctx.fillStyle = wet;
    ctx.fillRect(0, h * 0.72, w, h * 0.28);
    return c;
  }

  function capsule(ctx, ax, ay, bx, by, w1, w2) {
    const dx = bx - ax;
    const dy = by - ay;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    const nx = -dy / len;
    const ny = dx / len;
    ctx.beginPath();
    ctx.moveTo(ax + nx * w1, ay + ny * w1);
    ctx.lineTo(bx + nx * w2, by + ny * w2);
    ctx.lineTo(bx - nx * w2, by - ny * w2);
    ctx.lineTo(ax - nx * w1, ay - ny * w1);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.arc(ax, ay, w1, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(bx, by, w2, 0, Math.PI * 2);
    ctx.fill();
  }

  const PETER_POSES = {
    stand: { lean: 0.05, headTilt: 0.02, arms: [[0.12, 0.25], [-0.08, 0.15]], legs: [[0.06, 0.08], [-0.06, 0.04]], mirror: true },
    lunge: { lean: 0.5, headTilt: 0.08, arms: [[1.6, 0.6], [1.4, 0.8]], legs: [[0.7, 0.3], [-0.4, 0.5]], mirror: true },
    stagger: { lean: -0.12, headTilt: 0.35, arms: [[0.3, 0.5], [-0.2, 0.4]], legs: [[0.3, 0.2], [-0.2, 0.35]], mirror: true },
    kneel: { lean: 0.5, headTilt: 0.5, hipH: 0.38, arms: [[1.7, 0.2], [1.5, 0.3]], legs: [[1.0, 1.9], [0.9, 1.8]], mirror: true },
    lying: { lean: 0.05, headTilt: 0.1, lying: true, arms: [[0.9, 2.0], [0.2, 0.3]], legs: [[0.1, 0.15], [-0.05, 0.1]] }
  };

  const JEAN_POSES = {
    isolated: { lean: 0.06, headTilt: 0.15, arms: [[0.8, 2.2], [0.7, 1.7]], legs: [[0.04, 0.06], [-0.04, 0.04]], hair: true },
    facing: { lean: 0.05, headTilt: 0.05, arms: [[0.1, 0.2], [-0.05, 0.15]], legs: [[0.05, 0.06], [-0.05, 0.04]], hair: true },
    reach: { lean: 0.12, headTilt: 0.02, arms: [[1.35, 0.1], [0.15, 0.3]], legs: [[0.2, 0.15], [-0.1, 0.2]], hair: true },
    push: { lean: -0.18, headTilt: -0.05, arms: [[1.1, 0.4], [0.9, 0.5]], legs: [[0.25, 0.15], [-0.15, 0.3]], hair: true },
    kneel: { lean: 0.35, headTilt: 0.35, hipH: 0.34, arms: [[1.5, 0.3], [1.2, 0.5]], legs: [[1.2, 2.0], [0.5, 0.2]], hair: true }
  };

  function drawFigure(w, h, poseName, poseSet, tone) {
    const c = makeCanvas(w, h);
    const ctx = c.getContext("2d");
    const pose = poseSet[poseName];
    if (!pose) return c;
    const baseline = h * 0.97;
    const H = h * 0.86;
    const headR = H * 0.075;
    const hipH = (pose.hipH || 0.52) * H;
    const torsoLen = H * 0.27;
    const uaLen = H * 0.15;
    const faLen = H * 0.14;
    const thLen = H * 0.27;
    const shLen = H * 0.26;
    const bodyCol = tone || "#0a0d12";

    function skeleton(ox, oy, mirrorX, rot) {
      const m = mirrorX ? -1 : 1;
      const hipX = ox;
      const hipY = oy;
      const shX = hipX + Math.sin((pose.lean || 0) * rot * m) * torsoLen * 0 + m * Math.sin(pose.lean || 0) * torsoLen;
      const shY = hipY - Math.cos(pose.lean || 0) * torsoLen;
      const neckX = shX + m * Math.sin((pose.lean || 0) * 0.6) * H * 0.03;
      const neckY = shY - Math.cos((pose.lean || 0) * 0.6) * H * 0.03;
      const headX = neckX + m * Math.sin((pose.lean || 0) * 0.6 + (pose.headTilt || 0) * 0.3) * headR * 0.9;
      const headY = neckY - Math.cos((pose.lean || 0) * 0.6 + (pose.headTilt || 0) * 0.3) * headR * 0.9;
      return { hipX, hipY, shX, shY, neckX, neckY, headX, headY, m };
    }

    function limb(sx, sy, a1, a2, L1, L2, w1, w2, m, rot) {
      const ex = sx + m * Math.sin(a1) * L1;
      const ey = sy + Math.cos(a1) * L1;
      const hx = ex + m * Math.sin(a1 + a2) * L2;
      const hy = ey + Math.cos(a1 + a2) * L2;
      capsule(ctx, sx, sy, ex, ey, w1, w1 * 0.9);
      capsule(ctx, ex, ey, hx, hy, w1 * 0.9, w2);
      return { ex, ey, hx, hy };
    }

    function render(ox, oy, mirrorX, rot, scale) {
      const s = skeleton(ox, oy, mirrorX, rot);
      ctx.save();
      if (scale !== 1) {
        ctx.translate(ox, oy);
        ctx.scale(scale, scale);
        ctx.translate(-ox, -oy);
      }
      ctx.fillStyle = bodyCol;
      limb(s.hipX, s.hipY, pose.legs[0][0], pose.legs[0][1], thLen, shLen, H * 0.045, H * 0.034, s.m, rot);
      limb(s.hipX, s.hipY, pose.legs[1][0], pose.legs[1][1], thLen, shLen, H * 0.042, H * 0.031, s.m, rot);
      capsule(ctx, s.hipX, s.hipY, s.shX, s.shY, H * 0.055, H * 0.09);
      capsule(ctx, s.shX, s.shY, s.neckX, s.neckY, H * 0.028, H * 0.024);
      limb(s.shX, s.shY, pose.arms[0][0], pose.arms[0][1], uaLen, faLen, H * 0.026, H * 0.02, s.m, rot);
      limb(s.shX, s.shY, pose.arms[1][0], pose.arms[1][1], uaLen, faLen, H * 0.024, H * 0.019, s.m, rot);
      ctx.beginPath();
      ctx.arc(s.headX, s.headY, headR, 0, Math.PI * 2);
      ctx.fill();
      if (pose.hair) {
        ctx.beginPath();
        ctx.moveTo(s.headX - m * headR * 0.2, s.headY - headR * 0.95);
        ctx.quadraticCurveTo(s.headX + m * headR * 1.5, s.headY - headR * 0.4, s.headX + m * headR * 1.15, s.headY + headR * 2.6);
        ctx.quadraticCurveTo(s.headX + m * headR * 0.9, s.headY + headR * 3.4, s.headX + m * headR * 0.2, s.headY + headR * 3.0);
        ctx.quadraticCurveTo(s.headX - m * headR * 1.15, s.headY + headR * 1.6, s.headX - m * headR * 0.2, s.headY - headR * 0.95);
        ctx.fill();
      }
      ctx.fillStyle = "rgba(150,180,205,0.16)";
      ctx.beginPath();
      ctx.arc(s.headX - s.m * headR * 0.55, s.headY, headR * 0.32, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    ctx.save();
    ctx.shadowColor = "rgba(127,176,201,0.5)";
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = -3;
    ctx.fillStyle = "#131a24";
    render(baseline * 0, baseline, false, 1, 1);
    ctx.restore();
    ctx.save();
    ctx.shadowColor = "rgba(201,150,90,0.3)";
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 3;
    ctx.fillStyle = "#0c1017";
    render(0, baseline, false, 1, 1);
    ctx.restore();

    if (pose.lying) {
      const lc = makeCanvas(w, h);
      const lctx = lc.getContext("2d");
      lctx.drawImage(c, 0, 0);
      const fit = Math.min(1, (w * 0.9) / (H * 0.95));
      const cc = makeCanvas(w, h);
      const cctx = cc.getContext("2d");
      cctx.translate(w / 2, h * 0.68);
      cctx.rotate(-Math.PI / 2);
      cctx.scale(fit, fit);
      cctx.drawImage(lc, -w / 2, -baseline);
      return cc;
    }
    return c;
  }

  function drawPeter(w, h, poseName) {
    return drawFigure(w, h, poseName, PETER_POSES, "#0a0d12");
  }

  function drawJean(w, h, poseName) {
    return drawFigure(w, h, poseName, JEAN_POSES, "#0b0d13");
  }

  function drawBloodStain(size) {
    const c = makeCanvas(size, size);
    const ctx = c.getContext("2d");
    const g = ctx.createRadialGradient(size * 0.5, size * 0.5, 0, size * 0.5, size * 0.5, size * 0.5);
    g.addColorStop(0, "rgba(64,10,10,0.95)");
    g.addColorStop(0.55, "rgba(74,12,10,0.75)");
    g.addColorStop(1, "rgba(46,8,8,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
    const rnd = seededRandom(31);
    for (let i = 0; i < 7; i++) {
      ctx.fillStyle = "rgba(52,9,9,0.5)";
      ctx.beginPath();
      ctx.arc(size * (0.3 + rnd() * 0.4), size * (0.3 + rnd() * 0.4), size * (0.03 + rnd() * 0.06), 0, Math.PI * 2);
      ctx.fill();
    }
    return c;
  }

  function drawBloodSpread(size) {
    const c = makeCanvas(size, size);
    const ctx = c.getContext("2d");
    const g = ctx.createRadialGradient(size * 0.5, size * 0.45, 0, size * 0.5, size * 0.45, size * 0.52);
    g.addColorStop(0, "rgba(60,10,10,0.85)");
    g.addColorStop(0.6, "rgba(52,9,9,0.45)");
    g.addColorStop(1, "rgba(40,7,7,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(size * 0.5, size * 0.45, size * 0.5, size * 0.42, 0, 0, Math.PI * 2);
    ctx.fill();
    return c;
  }

  function drawBloodDrip(w, h) {
    const c = makeCanvas(w, h);
    const ctx = c.getContext("2d");
    const rnd = seededRandom(97);
    const drops = [0.22, 0.45, 0.62, 0.75];
    for (const dx of drops) {
      const top = h * 0.02;
      const len = h * (0.35 + rnd() * 0.6);
      const wid = w * (0.05 + rnd() * 0.04);
      ctx.fillStyle = "rgba(58,10,10,0.8)";
      ctx.beginPath();
      ctx.moveTo(dx * w - wid, top);
      ctx.quadraticCurveTo(dx * w - wid * 0.7, top + len * 0.6, dx * w, top + len);
      ctx.quadraticCurveTo(dx * w + wid * 0.7, top + len * 0.6, dx * w + wid, top);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(dx * w, top + len + wid * 0.4, wid * 0.5, 0, Math.PI * 2);
      ctx.fill();
    }
    return c;
  }

  function drawBloodGround(w, h) {
    const c = makeCanvas(w, h);
    const ctx = c.getContext("2d");
    const g = ctx.createRadialGradient(w * 0.5, h * 0.5, 0, w * 0.5, h * 0.5, w * 0.5);
    g.addColorStop(0, "rgba(52,9,9,0.8)");
    g.addColorStop(0.7, "rgba(42,8,8,0.35)");
    g.addColorStop(1, "rgba(36,7,7,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(w * 0.5, h * 0.5, w * 0.5, h * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();
    return c;
  }

  function drawHospitalRoom(w, h) {
    const c = makeCanvas(w, h);
    const ctx = c.getContext("2d");
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, "#e6ebf0");
    g.addColorStop(0.7, "#c9d3dd");
    g.addColorStop(1, "#b6c2d0");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#aebcc9";
    ctx.fillRect(0, h * 0.78, w, h * 0.22);
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.fillRect(w * 0.3, 0, w * 0.18, h * 0.016);
    ctx.fillRect(w * 0.54, 0, w * 0.18, h * 0.016);
    for (const lx of [0.3, 0.54]) {
      const gl = ctx.createRadialGradient(w * (lx + 0.09), h * 0.06, 0, w * (lx + 0.09), h * 0.06, w * 0.22);
      gl.addColorStop(0, "rgba(255,255,255,0.55)");
      gl.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = gl;
      ctx.fillRect(0, 0, w, h);
    }
    ctx.fillStyle = "rgba(210,225,235,0.7)";
    ctx.fillRect(w * 0.08, h * 0.2, w * 0.14, h * 0.42);
    ctx.strokeStyle = "rgba(140,155,160,0.8)";
    ctx.lineWidth = Math.max(2, w * 0.004);
    ctx.strokeRect(w * 0.08, h * 0.2, w * 0.14, h * 0.42);
    ctx.fillStyle = "#8a97a5";
    ctx.fillRect(w * 0.66, h * 0.58, w * 0.08, h * 0.012);
    ctx.fillRect(w * 0.68, h * 0.592, w * 0.012, h * 0.14);
    ctx.fillRect(w * 0.724, h * 0.592, w * 0.012, h * 0.14);
    ctx.fillStyle = "#1a2026";
    ctx.beginPath();
    ctx.ellipse(w * 0.7, h * 0.545, w * 0.018, h * 0.022, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(w * 0.7, h * 0.508, w * 0.014, h * 0.018, 0, 0, Math.PI * 2);
    ctx.fill();
    return c;
  }

  function drawHospitalPeter(w, h) {
    const c = makeCanvas(w, h);
    const ctx = c.getContext("2d");
    const bedX = w * 0.2;
    const bedW = w * 0.6;
    const bedY = h * 0.56;
    ctx.fillStyle = "#7d8894";
    ctx.fillRect(bedX, bedY + h * 0.1, bedW, h * 0.012);
    ctx.fillRect(bedX + w * 0.01, bedY + h * 0.112, w * 0.008, h * 0.1);
    ctx.fillRect(bedX + bedW - w * 0.018, bedY + h * 0.112, w * 0.008, h * 0.1);
    ctx.fillStyle = "#eef1f4";
    ctx.beginPath();
    ctx.roundRect(bedX, bedY, bedW, h * 0.1, w * 0.008);
    ctx.fill();
    ctx.fillStyle = "#f6f8f9";
    ctx.beginPath();
    ctx.roundRect(bedX + w * 0.02, bedY - h * 0.035, w * 0.09, h * 0.06, w * 0.012);
    ctx.fill();
    ctx.fillStyle = "#141a20";
    ctx.beginPath();
    ctx.arc(bedX + w * 0.08, bedY - h * 0.005, h * 0.024, 0, Math.PI * 2);
    ctx.fill();
    capsule(ctx, bedX + w * 0.09, bedY + h * 0.005, bedX + w * 0.16, bedY + h * 0.012, h * 0.018, h * 0.02);
    capsule(ctx, bedX + w * 0.16, bedY + h * 0.012, bedX + w * 0.38, bedY + h * 0.008, h * 0.022, h * 0.026);
    ctx.fillStyle = "#e8edf2";
    ctx.beginPath();
    ctx.moveTo(bedX + w * 0.2, bedY - h * 0.005);
    ctx.quadraticCurveTo(bedX + w * 0.28, bedY - h * 0.045, bedX + bedW - w * 0.015, bedY + h * 0.01);
    ctx.quadraticCurveTo(bedX + bedW - w * 0.01, bedY + h * 0.09, bedX + w * 0.2, bedY + h * 0.095);
    ctx.quadraticCurveTo(bedX + w * 0.17, bedY + h * 0.04, bedX + w * 0.2, bedY - h * 0.005);
    ctx.fill();
    ctx.fillStyle = "rgba(150,180,205,0.2)";
    ctx.beginPath();
    ctx.arc(bedX + w * 0.074, bedY - h * 0.008, h * 0.008, 0, Math.PI * 2);
    ctx.fill();
    return c;
  }

  return {
    drawSky: drawSky,
    drawSkyline: drawSkyline,
    drawBokeh: drawBokeh,
    drawRooftop: drawRooftop,
    drawPeter: drawPeter,
    drawJean: drawJean,
    drawBloodStain: drawBloodStain,
    drawBloodSpread: drawBloodSpread,
    drawBloodDrip: drawBloodDrip,
    drawBloodGround: drawBloodGround,
    drawHospitalRoom: drawHospitalRoom,
    drawHospitalPeter: drawHospitalPeter,
    makeCanvas: makeCanvas,
    seededRandom: seededRandom
  };
})();
