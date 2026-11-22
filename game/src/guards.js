// guards.js — patrolling wardens with vision cones and coin distraction.
function makeGuard(def) {
  return {
    x: def.path[0].x, y: def.path[0].y,
    path: def.path, speed: def.speed, range: def.range, fov: def.fov,
    wp: 1, angle: 0, state: "patrol", lookX: 0, lookY: 0, lookTimer: 0, pauseTimer: 0
  };
}
function guardStep(g, dt, distraction) {
  if (distraction && distraction.active) {
    const d = Math.hypot(distraction.x - g.x, distraction.y - g.y);
    if (d < 260 && g.state === "patrol") {
      g.state = "distracted";
      g.lookX = distraction.x; g.lookY = distraction.y; g.lookTimer = 2.2;
    }
  }
  if (g.state === "distracted") {
    g.angle = Math.atan2(g.lookY - g.y, g.lookX - g.x);
    g.lookTimer -= dt;
    if (g.lookTimer <= 0) g.state = "patrol";
    return;
  }
  if (g.pauseTimer > 0) { g.pauseTimer -= dt; return; }
  const target = g.path[g.wp % g.path.length];
  const dx = target.x - g.x, dy = target.y - g.y;
  const d = Math.hypot(dx, dy);
  if (d < 6) {
    g.wp = (g.wp + 1) % g.path.length;
    g.pauseTimer = 0.5 + Math.random() * 0.4;
    return;
  }
  g.angle = Math.atan2(dy, dx);
  g.x += (dx / d) * g.speed * dt;
  g.y += (dy / d) * g.speed * dt;
}
// guardHearsNoise lets creaky boards draw the nearest warden's gaze.
function guardHearsNoise(g, x, y) {
  if (g.state !== "patrol") return;
  if (Math.hypot(x - g.x, y - g.y) < 200) {
    g.state = "distracted";
    g.lookX = x; g.lookY = y; g.lookTimer = 1.2;
  }
}
function guardSees(g, thief, world, hiddenBySmoke, crouchedBehindCover) {
  if (hiddenBySmoke) return false;
  if (crouchedBehindCover) return false;
  if (!inCone(g, g.angle, g.range, g.fov, thief)) return false;
  return hasLineOfSight(g.x, g.y, thief.x, thief.y, world.walls, world.covers);
}
