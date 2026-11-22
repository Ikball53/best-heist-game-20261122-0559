// render.js — all canvas drawing: floors, cones, thief, loot, effects.
function drawCone(ctx, x, y, angle, range, fov, color) {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.arc(x, y, range, angle - fov, angle + fov);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();
}
function drawLootShape(ctx, l, t) {
  const pulse = 0.75 + 0.25 * Math.sin(t * 3 + l.pulse);
  ctx.save();
  ctx.translate(l.x, l.y);
  ctx.shadowColor = "#ffd977";
  ctx.shadowBlur = 14 * pulse;
  ctx.fillStyle = "#ffd977";
  ctx.strokeStyle = "#8a6d3b";
  ctx.lineWidth = 1.5;
  if (l.kind === "gem") {
    ctx.beginPath(); ctx.moveTo(0, -l.r); ctx.lineTo(l.r * 0.8, 0); ctx.lineTo(0, l.r); ctx.lineTo(-l.r * 0.8, 0); ctx.closePath(); ctx.fill(); ctx.stroke();
  } else if (l.kind === "crown") {
    ctx.beginPath(); ctx.moveTo(-l.r, l.r * 0.6); ctx.lineTo(-l.r, -l.r * 0.3); ctx.lineTo(-l.r * 0.4, l.r * 0.1); ctx.lineTo(0, -l.r * 0.8); ctx.lineTo(l.r * 0.4, l.r * 0.1); ctx.lineTo(l.r, -l.r * 0.3); ctx.lineTo(l.r, l.r * 0.6); ctx.closePath(); ctx.fill(); ctx.stroke();
  } else if (l.kind === "heart") {
    ctx.beginPath(); ctx.arc(0, 0, l.r * 0.75, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(0, 0, l.r * 0.4, 0, Math.PI * 2); ctx.strokeStyle = "#6b5436"; ctx.stroke();
  } else if (l.kind === "orrery") {
    ctx.beginPath(); ctx.arc(0, 0, l.r * 0.55, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(0, 0, l.r, l.r * 0.35, 0.6, 0, Math.PI * 2); ctx.stroke();
  } else {
    ctx.beginPath(); ctx.moveTo(-l.r * 0.7, -l.r * 0.5); ctx.lineTo(l.r * 0.7, -l.r * 0.5); ctx.lineTo(l.r * 0.3, l.r * 0.3); ctx.lineTo(0, l.r * 0.8); ctx.lineTo(-l.r * 0.3, l.r * 0.3); ctx.closePath(); ctx.fill(); ctx.stroke();
  }
  ctx.restore();
}
function drawThief(ctx, thief, t) {
  ctx.save();
  ctx.translate(thief.x, thief.y);
  if (thief.crouch) ctx.scale(1, 0.78);
  ctx.fillStyle = "#2b2b33";
  ctx.strokeStyle = "#c9a45c";
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(0, 0, thief.r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = "#e8d5a3";
  ctx.beginPath(); ctx.arc(0, -2, thief.r * 0.45, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#17130e";
  ctx.fillRect(-thief.r * 0.5, -thief.r * 0.55, thief.r, 3);
  ctx.restore();
}
function drawGuard(ctx, g, alert) {
  ctx.save();
  ctx.translate(g.x, g.y);
  ctx.fillStyle = alert ? "#7a2e22" : "#4a3b28";
  ctx.strokeStyle = alert ? "#ff7a5c" : "#c9a45c";
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(0, 0, 12, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = "#e8d5a3";
  ctx.beginPath(); ctx.arc(0, -1, 5, 0, Math.PI * 2); ctx.fill();
  ctx.rotate(g.angle);
  ctx.fillStyle = "#c9a45c";
  ctx.beginPath(); ctx.moveTo(10, 0); ctx.lineTo(4, -3.5); ctx.lineTo(4, 3.5); ctx.closePath(); ctx.fill();
  ctx.restore();
}
function drawCamera(ctx, cam) {
  ctx.save();
  ctx.translate(cam.x, cam.y);
  ctx.fillStyle = "#6b5436";
  ctx.strokeStyle = "#c9a45c";
  ctx.beginPath(); ctx.arc(0, 0, 9, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.rotate(cam.angle);
  ctx.fillStyle = "#ffd977";
  ctx.beginPath(); ctx.moveTo(11, 0); ctx.lineTo(5, -4); ctx.lineTo(5, 4); ctx.closePath(); ctx.fill();
  ctx.restore();
}
function renderFrame(ctx, state, t) {
  const W = 960, H = 540;
  ctx.fillStyle = "#17130e";
  ctx.fillRect(0, 0, W, H);
  // floor tiles
  ctx.strokeStyle = "rgba(201,164,92,0.07)";
  ctx.lineWidth = 1;
  for (let x = 0; x <= W; x += 48) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
  for (let y = 0; y <= H; y += 48) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  // creaky boards
  for (const c of state.world.creaks) {
    ctx.fillStyle = "rgba(122,84,40,0.55)";
    ctx.fillRect(c.x, c.y, c.w, c.h);
    ctx.strokeStyle = "rgba(201,164,92,0.5)";
    ctx.strokeRect(c.x, c.y, c.w, c.h);
    ctx.fillStyle = "rgba(232,213,163,0.7)";
    ctx.font = "8px monospace";
    ctx.fillText("CREAK", c.x + 4, c.y + 11);
  }
  // exit door
  const ex = state.world.exit;
  ctx.fillStyle = "#2e5a3a";
  ctx.fillRect(ex.x, ex.y, ex.w, ex.h);
  ctx.strokeStyle = "#7fd08a";
  ctx.lineWidth = 2;
  ctx.strokeRect(ex.x, ex.y, ex.w, ex.h);
  ctx.fillStyle = "#c8f0cd";
  ctx.font = "9px monospace";
  ctx.fillText("EXIT", ex.x + 8, ex.y + 26);
  // vision cones (under everything else)
  for (const g of state.guards) drawCone(ctx, g.x, g.y, g.angle, g.range, g.fov, state.seen ? "rgba(224,60,46,0.20)" : "rgba(255,217,119,0.13)");
  for (const cam of state.cameras) drawCone(ctx, cam.x, cam.y, cam.angle, cam.range, cam.fov, "rgba(120,200,255,0.11)");
  // tripwires
  for (const tw of state.world.tripwires) {
    ctx.save();
    ctx.strokeStyle = tw.cooldown > 0 ? "rgba(255,255,255,0.15)" : "rgba(255,60,60,0.85)";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([5, 4]);
    ctx.beginPath(); ctx.moveTo(tw.x1, tw.y1); ctx.lineTo(tw.x2, tw.y2); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "#ff3c3c";
    ctx.beginPath(); ctx.arc(tw.x1, tw.y1, 3, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(tw.x2, tw.y2, 3, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
  // walls
  for (const w of state.world.walls) {
    ctx.fillStyle = "#3a2e1e";
    ctx.fillRect(w.x, w.y, w.w, w.h);
    ctx.strokeStyle = "#6b5436";
    ctx.strokeRect(w.x, w.y, w.w, w.h);
  }
  // cover crates
  for (const c of state.world.covers) {
    ctx.fillStyle = "#5a4326";
    ctx.fillRect(c.x, c.y, c.w, c.h);
    ctx.strokeStyle = "#c9a45c";
    ctx.strokeRect(c.x, c.y, c.w, c.h);
    ctx.beginPath(); ctx.moveTo(c.x, c.y); ctx.lineTo(c.x + c.w, c.y + c.h); ctx.moveTo(c.x + c.w, c.y); ctx.lineTo(c.x, c.y + c.h); ctx.strokeStyle = "rgba(201,164,92,0.35)"; ctx.stroke();
  }
  // distraction coin
  if (state.coin.active) {
    ctx.save();
    ctx.fillStyle = "#ffd977";
    ctx.shadowColor = "#ffd977"; ctx.shadowBlur = 10;
    ctx.beginPath(); ctx.arc(state.coin.x, state.coin.y, 6, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
  // smoke clouds
  for (const s of state.smokes) {
    ctx.save();
    ctx.globalAlpha = Math.min(0.55, s.ttl * 0.25);
    ctx.fillStyle = "#cfc8b8";
    ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
  // loot
  for (const l of state.world.loot) if (!l.taken) drawLootShape(ctx, l, t);
  // actors
  for (const cam of state.cameras) drawCamera(ctx, cam);
  for (const g of state.guards) drawGuard(ctx, g, state.seen);
  drawThief(ctx, state.thief, t);
  // brass corner gears (pure decoration, sells the clockwork theme)
  ctx.save();
  ctx.strokeStyle = "rgba(201,164,92,0.18)";
  ctx.lineWidth = 3;
  for (const [gx, gy, gr] of [[46, 46, 26], [914, 46, 26], [46, 494, 26], [914, 494, 26]]) {
    ctx.beginPath(); ctx.arc(gx, gy, gr, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(gx, gy, gr * 0.55, 0, Math.PI * 2); ctx.stroke();
  }
  ctx.restore();
  // vignette
  const grad = ctx.createRadialGradient(W / 2, H / 2, H * 0.45, W / 2, H / 2, H * 0.85);
  grad.addColorStop(0, "rgba(0,0,0,0)");
  grad.addColorStop(1, "rgba(0,0,0,0.35)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);
}
