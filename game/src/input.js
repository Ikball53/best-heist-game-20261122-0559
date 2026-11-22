// input.js — keyboard state and one-shot action flags.
const Keys = (() => {
  const down = {};
  let smokeQueued = false;
  let coinQueued = false;
  let muteQueued = false;
  window.addEventListener("keydown", (e) => {
    const k = e.key.toLowerCase();
    down[k] = true;
    if (k === "q") smokeQueued = true;
    if (k === "e") coinQueued = true;
    if (k === "m") muteQueued = true;
    if (["arrowup", "arrowdown", "arrowleft", "arrowright", " "].includes(k)) e.preventDefault();
  });
  window.addEventListener("keyup", (e) => { down[e.key.toLowerCase()] = false; });
  function axis() {
    let x = 0, y = 0;
    if (down["a"] || down["arrowleft"]) x -= 1;
    if (down["d"] || down["arrowright"]) x += 1;
    if (down["w"] || down["arrowup"]) y -= 1;
    if (down["s"] || down["arrowdown"]) y += 1;
    if (x !== 0 && y !== 0) { x *= 0.7071; y *= 0.7071; }
    return { x, y };
  }
  function crouching() { return !!down["shift"] || !!down["c"]; }
  function takeSmoke() { const v = smokeQueued; smokeQueued = false; return v; }
  function takeCoin() { const v = coinQueued; coinQueued = false; return v; }
  function takeMute() { const v = muteQueued; muteQueued = false; return v; }
  return { axis, crouching, takeSmoke, takeCoin, takeMute };
})();
