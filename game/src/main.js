// main.js — game loop, floor flow, loot, tripwires, smoke and coins.
const GameState = (() => {
  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d");
  const roomLine = document.getElementById("roomline");
  const lootLine = document.getElementById("lootline");
  const alarmFill = document.getElementById("alarmfill");
  const endBox = document.getElementById("end");
  const endText = document.getElementById("endtext");
  const againBtn = document.getElementById("again");
  let floorIndex = 0;
  let world = null;
  let guards = [];
  let cameras = [];
  let thief = { x: 60, y: 470, r: 11, crouch: false };
  let smokes = [];
  let coin = { active: false, x: 0, y: 0, ttl: 0 };
  let smokeLeft = 3;
  let coinsLeft = 3;
  let totalLoot = 0;
  let seen = false;
  let running = true;
  let stepTimer = 0;
  let creakCooldown = 0;
  let lastTime = performance.now();
  let elapsed = 0;
  const mouse = { x: 480, y: 270 };
  canvas.addEventListener("mousemove", (e) => {
    const r = canvas.getBoundingClientRect();
    mouse.x = (e.clientX - r.left) * (canvas.width / r.width);
    mouse.y = (e.clientY - r.top) * (canvas.height / r.height);
  });
  function startFloor(idx) {
    world = loadFloor(idx);
    guards = FLOORS[idx].guards.map(makeGuard);
    cameras = FLOORS[idx].cameras.map(makeCamera);
    thief.x = world.start.x; thief.y = world.start.y;
    smokes = [];
    coin = { active: false, x: 0, y: 0, ttl: 0 };
    AlarmMeter.reset();
    roomLine.textContent = "COPPER ORRERY — " + world.name + " " + (idx + 1) + "/" + floorCount();
  }
  function restart() {
    floorIndex = 0; totalLoot = 0; smokeLeft = 3; coinsLeft = 3;
    running = true; elapsed = 0;
    endBox.style.display = "none";
    startFloor(0);
  }
  againBtn.addEventListener("click", restart);
  function endGame(won) {
    running = false;
    if (won) { SoundBoard.win(); endText.textContent = "HEIST COMPLETE — " + totalLoot + " treasures lifted. The Orrery is yours."; }
    else { SoundBoard.caught(); endText.textContent = "CAUGHT — the alarm sealed the vault on floor " + (floorIndex + 1) + "."; }
    endBox.style.display = "block";
  }
  function nearCover() {
    for (const c of world.covers) {
      const cx = Math.max(c.x, Math.min(thief.x, c.x + c.w));
      const cy = Math.max(c.y, Math.min(thief.y, c.y + c.h));
      if (Math.hypot(thief.x - cx, thief.y - cy) < 26) return true;
    }
    return false;
  }
  function insideSmoke() {
    for (const s of smokes) if (Math.hypot(thief.x - s.x, thief.y - s.y) < s.r) return true;
    return false;
  }
  function update(dt) {
    elapsed += dt;
    if (Keys.takeMute()) SoundBoard.toggleMute();
    thief.crouch = Keys.crouching();
    const ax = Keys.axis();
    const speed = thief.crouch ? 85 : 165;
    const nx = thief.x + ax.x * speed * dt;
    const ny = thief.y + ax.y * speed * dt;
    if (!collideWalls(nx, thief.y, thief.r, world.walls) && !collideWalls(nx, thief.y, thief.r, world.covers)) thief.x = nx;
    if (!collideWalls(thief.x, ny, thief.r, world.walls) && !collideWalls(thief.x, ny, thief.r, world.covers)) thief.y = ny;
    if (ax.x !== 0 || ax.y !== 0) {
      stepTimer -= dt;
      if (stepTimer <= 0) { SoundBoard.step(); stepTimer = thief.crouch ? 0.42 : 0.26; }
    }
    if (Keys.takeSmoke() && smokeLeft > 0) {
      smokeLeft--;
      smokes.push({ x: thief.x, y: thief.y, r: 62, ttl: 3.2 });
      SoundBoard.smoke();
    }
    if (Keys.takeCoin() && coinsLeft > 0) {
      coinsLeft--;
      coin = { active: true, x: mouse.x, y: mouse.y, ttl: 2.6 };
      SoundBoard.coin();
    }
    if (coin.active) { coin.ttl -= dt; if (coin.ttl <= 0) coin.active = false; }
    smokes = smokes.filter((s) => (s.ttl -= dt) > 0);
    for (const g of guards) guardStep(g, dt, coin);
    for (const cam of cameras) cameraStep(cam, elapsed);
    const hiddenSmoke = insideSmoke();
    const hiddenCover = thief.crouch && nearCover();
    seen = false;
    for (const g of guards) if (guardSees(g, thief, world, hiddenSmoke, hiddenCover)) seen = true;
    for (const cam of cameras) if (cameraSees(cam, thief, world, hiddenSmoke, hiddenCover)) seen = true;
    let noisy = false;
    creakCooldown -= dt;
    if (!thief.crouch && (ax.x !== 0 || ax.y !== 0)) {
      for (const c of world.creaks) {
        if (thief.x > c.x && thief.x < c.x + c.w && thief.y > c.y && thief.y < c.y + c.h) {
          noisy = true;
          if (creakCooldown <= 0) {
            SoundBoard.creak(); creakCooldown = 0.7;
            for (const g of guards) guardHearsNoise(g, thief.x, thief.y);
          }
        }
      }
    }
    for (const tw of world.tripwires) {
      tw.cooldown -= dt;
      if (tw.cooldown <= 0 && pointSegDist(thief.x, thief.y, tw.x1, tw.y1, tw.x2, tw.y2) < 6) {
        AlarmMeter.bump(0.45);
        SoundBoard.wire();
        tw.cooldown = 1.5;
      }
    }
    const caught = AlarmMeter.update(dt, seen, noisy);
    for (const l of world.loot) {
      if (!l.taken && Math.hypot(thief.x - l.x, thief.y - l.y) < thief.r + l.r + 4) {
        l.taken = true; totalLoot++; SoundBoard.loot();
      }
    }
    const ex = world.exit;
    const allLoot = world.loot.every((l) => l.taken);
    if (allLoot && thief.x > ex.x && thief.x < ex.x + ex.w && thief.y > ex.y && thief.y < ex.y + ex.h) {
      if (floorIndex + 1 >= floorCount()) endGame(true);
      else { SoundBoard.door(); floorIndex++; startFloor(floorIndex); }
    }
    if (caught) endGame(false);
    lootLine.textContent = "LOOT " + totalLoot + " · SMOKE " + smokeLeft + " · COINS " + coinsLeft + (SoundBoard.isMuted() ? " · MUTED" : "");
    alarmFill.style.width = Math.round(AlarmMeter.get() * 100) + "%";
  }
  function frame(now) {
    const dt = Math.min(0.05, (now - lastTime) / 1000);
    lastTime = now;
    if (running) update(dt);
    renderFrame(ctx, { world, guards, cameras, thief, smokes, coin, seen }, elapsed);
    requestAnimationFrame(frame);
  }
  startFloor(0);
  requestAnimationFrame(frame);
  // screenshot hooks: window.__heist lets a headless run place the thief
  window.__heist = {
    place(x, y) { thief.x = x; thief.y = y; },
    floor(n) { floorIndex = n; startFloor(n); },
    alarm(v) { AlarmMeter.reset(); AlarmMeter.bump(v); },
    state() { return { floor: floorIndex, loot: totalLoot, alarm: AlarmMeter.get() }; }
  };
  return { restart };
})();
