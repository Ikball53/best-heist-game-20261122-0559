// audio.js — tiny WebAudio soundboard for footsteps, loot, alarms.
const SoundBoard = (() => {
  let ctx = null;
  let muted = false;
  function ensure() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }
  function blip(freq, dur, type, gain) {
    if (muted) return;
    const c = ensure();
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = type || "sine";
    o.frequency.value = freq;
    g.gain.setValueAtTime(gain || 0.08, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + dur);
    o.connect(g); g.connect(c.destination);
    o.start(); o.stop(c.currentTime + dur);
  }
  function step() { blip(120, 0.05, "triangle", 0.02); }
  function coin() { blip(880, 0.09, "square", 0.05); setTimeout(() => blip(1320, 0.12, "square", 0.05), 60); }
  function loot() { blip(660, 0.08, "sine", 0.07); setTimeout(() => blip(990, 0.14, "sine", 0.07), 70); }
  function alarm() { blip(520, 0.16, "sawtooth", 0.06); }
  function creak() { blip(90, 0.2, "sawtooth", 0.05); }
  function wire() { blip(1400, 0.1, "square", 0.06); }
  function smoke() { blip(220, 0.25, "sine", 0.05); }
  function caught() { blip(160, 0.5, "sawtooth", 0.1); }
  function win() { [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => blip(f, 0.2, "sine", 0.08), i * 110)); }
  function door() { blip(392, 0.12, "triangle", 0.06); setTimeout(() => blip(523, 0.16, "triangle", 0.06), 90); }
  function toggleMute() { muted = !muted; return muted; }
  function isMuted() { return muted; }
  return { step, coin, loot, alarm, creak, wire, smoke, caught, win, door, toggleMute, isMuted };
})();
