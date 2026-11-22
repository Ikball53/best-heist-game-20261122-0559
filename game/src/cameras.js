// cameras.js — brass ceiling cameras that sweep their cones.
function makeCamera(def) {
  return {
    x: def.x, y: def.y, base: def.base, sweep: def.sweep, speed: def.speed,
    range: def.range, fov: def.fov, phase: Math.random() * 6, angle: def.base
  };
}
function cameraStep(cam, t) {
  // smooth sinusoidal sweep; phase offsets keep cameras out of sync
  cam.angle = cam.base + Math.sin(t * cam.speed + cam.phase) * cam.sweep;
}
function cameraSees(cam, thief, world, hiddenBySmoke, crouchedBehindCover) {
  if (hiddenBySmoke) return false;
  if (crouchedBehindCover) return false;
  if (!inCone(cam, cam.angle, cam.range, cam.fov, thief)) return false;
  return hasLineOfSight(cam.x, cam.y, thief.x, thief.y, world.walls, world.covers);
}
