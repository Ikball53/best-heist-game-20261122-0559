// world.js — collision, line-of-sight and floor loading helpers.
function rectHit(px, py, r, rect) {
  const cx = Math.max(rect.x, Math.min(px, rect.x + rect.w));
  const cy = Math.max(rect.y, Math.min(py, rect.y + rect.h));
  const dx = px - cx, dy = py - cy;
  return dx * dx + dy * dy < r * r;
}
function collideWalls(x, y, r, walls) {
  for (const w of walls) if (rectHit(x, y, r, w)) return true;
  return false;
}
function segRectHit(x1, y1, x2, y2, rect) {
  // sample the segment for wall blockage (simple, robust for this scale)
  const steps = 24;
  for (let i = 1; i < steps; i++) {
    const t = i / steps;
    const x = x1 + (x2 - x1) * t;
    const y = y1 + (y2 - y1) * t;
    if (x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h) return true;
  }
  return false;
}
function hasLineOfSight(x1, y1, x2, y2, walls, covers) {
  for (const w of walls) if (segRectHit(x1, y1, x2, y2, w)) return false;
  for (const c of covers) if (segRectHit(x1, y1, x2, y2, c)) return false;
  return true;
}
function dist(a, b) { const dx = a.x - b.x, dy = a.y - b.y; return Math.sqrt(dx * dx + dy * dy); }
function angleDiff(a, b) {
  let d = a - b;
  while (d > Math.PI) d -= Math.PI * 2;
  while (d < -Math.PI) d += Math.PI * 2;
  return d;
}
function inCone(observer, angle, range, fov, target) {
  const d = dist(observer, target);
  if (d > range) return false;
  const ta = Math.atan2(target.y - observer.y, target.x - observer.x);
  return Math.abs(angleDiff(ta, angle)) < fov;
}
function pointSegDist(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1, dy = y2 - y1;
  const len2 = dx * dx + dy * dy || 1;
  let t = ((px - x1) * dx + (py - y1) * dy) / len2;
  t = Math.max(0, Math.min(1, t));
  const cx = x1 + dx * t, cy = y1 + dy * t;
  return Math.sqrt((px - cx) * (px - cx) + (py - cy) * (py - cy));
}
// insideRect is a tiny helper for exit-door and creak-zone checks.
function insideRect(x, y, rect) {
  return x > rect.x && x < rect.x + rect.w && y > rect.y && y < rect.y + rect.h;
}
function loadFloor(index) {
  const f = FLOORS[index];
  return {
    name: f.name,
    walls: f.walls,
    covers: f.covers,
    creaks: f.creaks,
    tripwires: f.tripwires.map((t) => ({ ...t, cooldown: 0 })),
    loot: f.loot.map((l) => ({ ...l, taken: false, pulse: Math.random() * 6 })),
    start: f.start,
    exit: f.exit
  };
}
