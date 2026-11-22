// alarm.js — the vault alarm meter: fills while seen, cools while hidden.
const AlarmMeter = (() => {
  let value = 0;
  let beepTimer = 0;
  function update(dt, seen, noisy) {
    if (seen) value += dt * 0.55;
    else if (noisy) value += dt * 0.12;
    else value -= dt * 0.18;
    value = Math.max(0, Math.min(1, value));
    if (seen && value > 0.35) {
      beepTimer -= dt;
      if (beepTimer <= 0) { SoundBoard.alarm(); beepTimer = 0.4; }
    }
    return value >= 1;
  }
  function bump(amount) { value = Math.max(0, Math.min(1, value + amount)); }
  function reset() { value = 0; beepTimer = 0; }
  function get() { return value; }
  function level() { return value < 0.35 ? "calm" : value < 0.7 ? "noticed" : "hunted"; }
  return { update, bump, reset, get, level };
})();
