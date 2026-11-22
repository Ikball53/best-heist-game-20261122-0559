// levels.js — five hand-built vault floors for the Copper Orrery.
const FLOORS = [
  {
    name: "ENTRY ROTUNDA",
    walls: [
      {x:0,y:0,w:960,h:16},{x:0,y:524,w:960,h:16},{x:0,y:0,w:16,h:540},{x:944,y:0,w:16,h:540},
      {x:300,y:120,w:16,h:200},{x:640,y:220,w:16,h:200},{x:120,y:360,w:200,h:16}
    ],
    covers: [{x:180,y:180,w:64,h:40},{x:520,y:120,w:64,h:40},{x:760,y:400,w:64,h:40}],
    creaks: [{x:430,y:300,w:90,h:34}],
    tripwires: [{x1:316,y1:320,x2:640,y2:320}],
    loot: [{x:840,y:90,r:11,kind:"gem"},{x:480,y:470,r:11,kind:"chalice"}],
    guards: [{path:[{x:200,y:260},{x:760,y:260},{x:760,y:430},{x:200,y:430}], speed:55, range:150, fov:0.55}],
    cameras: [{x:480,y:26,base:Math.PI/2,sweep:0.7,speed:0.5,range:170,fov:0.4}],
    start: {x:60,y:470}, exit: {x:880,y:470,w:44,h:44}
  },
  {
    name: "GEAR GALLERY",
    walls: [
      {x:0,y:0,w:960,h:16},{x:0,y:524,w:960,h:16},{x:0,y:0,w:16,h:540},{x:944,y:0,w:16,h:540},
      {x:200,y:0,w:16,h:300},{x:480,y:240,w:16,h:300},{x:700,y:0,w:16,h:280},{x:380,y:180,w:180,h:16}
    ],
    covers: [{x:320,y:340,w:64,h:40},{x:600,y:120,w:64,h:40},{x:110,y:140,w:64,h:40}],
    creaks: [{x:250,y:400,w:90,h:34},{x:560,y:300,w:90,h:34}],
    tripwires: [{x1:216,y1:300,x2:480,y2:300},{x1:496,y1:240,x2:700,y2:240}],
    loot: [{x:120,y:70,r:11,kind:"crown"},{x:840,y:470,r:11,kind:"gem"},{x:480,y:90,r:11,kind:"chalice"}],
    guards: [
      {path:[{x:120,y:470},{x:840,y:470},{x:840,y:350},{x:120,y:350}], speed:60, range:150, fov:0.55},
      {path:[{x:350,y:80},{x:620,y:80},{x:620,y:200},{x:350,y:200}], speed:50, range:140, fov:0.55}
    ],
    cameras: [{x:120,y:26,base:Math.PI/2,sweep:0.8,speed:0.6,range:160,fov:0.4},{x:840,y:26,base:Math.PI/2,sweep:0.8,speed:0.45,range:160,fov:0.4}],
    start: {x:60,y:60}, exit: {x:880,y:60,w:44,h:44}
  },
  {
    name: "ASTROLABE HALL",
    walls: [
      {x:0,y:0,w:960,h:16},{x:0,y:524,w:960,h:16},{x:0,y:0,w:16,h:540},{x:944,y:0,w:16,h:540},
      {x:150,y:150,w:280,h:16},{x:530,y:150,w:280,h:16},{x:150,y:374,w:280,h:16},{x:530,y:374,w:280,h:16},
      {x:464,y:166,w:32,h:208}
    ],
    covers: [{x:250,y:250,w:64,h:40},{x:640,y:250,w:64,h:40},{x:448,y:60,w:64,h:40}],
    creaks: [{x:430,y:440,w:100,h:34}],
    tripwires: [{x1:430,y1:166,x2:530,y2:166},{x1:430,y1:374,x2:530,y2:374}],
    loot: [{x:480,y:270,r:12,kind:"orrery"},{x:90,y:270,r:11,kind:"gem"},{x:870,y:270,r:11,kind:"chalice"}],
    guards: [
      {path:[{x:100,y:90},{x:860,y:90},{x:860,y:450},{x:100,y:450}], speed:62, range:155, fov:0.55},
      {path:[{x:860,y:450},{x:100,y:450},{x:100,y:90},{x:860,y:90}], speed:55, range:150, fov:0.55}
    ],
    cameras: [{x:480,y:26,base:Math.PI/2,sweep:1.0,speed:0.55,range:180,fov:0.42}],
    start: {x:60,y:470}, exit: {x:880,y:470,w:44,h:44}
  },
  {
    name: "CLOCKWORK CRYPT",
    walls: [
      {x:0,y:0,w:960,h:16},{x:0,y:524,w:960,h:16},{x:0,y:0,w:16,h:540},{x:944,y:0,w:16,h:540},
      {x:240,y:100,w:16,h:240},{x:480,y:200,w:16,h:240},{x:720,y:100,w:16,h:240},
      {x:120,y:340,w:136,h:16},{x:496,y:100,w:240,h:16}
    ],
    covers: [{x:140,y:220,w:64,h:40},{x:560,y:300,w:64,h:40},{x:800,y:300,w:64,h:40},{x:340,y:440,w:64,h:40}],
    creaks: [{x:300,y:160,w:80,h:32},{x:600,y:180,w:80,h:32},{x:300,y:420,w:80,h:32}],
    tripwires: [{x1:256,y1:340,x2:480,y2:340},{x1:496,y1:200,x2:720,y2:200},{x1:736,y1:340,x2:944,y2:340}],
    loot: [{x:120,y:470,r:11,kind:"gem"},{x:840,y:70,r:11,kind:"crown"},{x:480,y:470,r:11,kind:"chalice"},{x:360,y:70,r:11,kind:"orrery"}],
    guards: [
      {path:[{x:120,y:120},{x:120,y:420},{x:360,y:420},{x:360,y:120}], speed:58, range:150, fov:0.55},
      {path:[{x:840,y:420},{x:840,y:120},{x:600,y:120},{x:600,y:420}], speed:58, range:150, fov:0.55}
    ],
    cameras: [{x:360,y:26,base:Math.PI/2,sweep:0.7,speed:0.6,range:165,fov:0.4},{x:600,y:26,base:Math.PI/2,sweep:0.7,speed:0.5,range:165,fov:0.4}],
    start: {x:480,y:60}, exit: {x:880,y:470,w:44,h:44}
  },
  {
    name: "THE ORRERY CORE",
    walls: [
      {x:0,y:0,w:960,h:16},{x:0,y:524,w:960,h:16},{x:0,y:0,w:16,h:540},{x:944,y:0,w:16,h:540},
      {x:200,y:130,w:200,h:16},{x:560,y:130,w:200,h:16},{x:200,y:394,w:200,h:16},{x:560,y:394,w:200,h:16},
      {x:464,y:220,w:32,h:100}
    ],
    covers: [{x:300,y:240,w:64,h:40},{x:600,y:240,w:64,h:40},{x:448,y:440,w:64,h:40}],
    creaks: [{x:430,y:60,w:100,h:32},{x:430,y:448,w:100,h:32}],
    tripwires: [{x1:400,y1:146,x2:560,y2:146},{x1:400,y1:394,x2:560,y2:394},{x1:480,y1:220,x2:480,y2:320}],
    loot: [{x:480,y:270,r:13,kind:"heart"},{x:100,y:100,r:11,kind:"gem"},{x:860,y:100,r:11,kind:"crown"},{x:100,y:440,r:11,kind:"chalice"},{x:860,y:440,r:11,kind:"orrery"}],
    guards: [
      {path:[{x:120,y:270},{x:840,y:270},{x:840,y:440},{x:120,y:440}], speed:65, range:160, fov:0.58},
      {path:[{x:840,y:100},{x:120,y:100},{x:120,y:270},{x:840,y:270}], speed:60, range:155, fov:0.58},
      {path:[{x:480,y:180},{x:480,y:360}], speed:45, range:140, fov:0.55}
    ],
    cameras: [{x:120,y:26,base:Math.PI/2,sweep:0.9,speed:0.65,range:170,fov:0.42},{x:840,y:26,base:Math.PI/2,sweep:0.9,speed:0.55,range:170,fov:0.42},{x:480,y:26,base:Math.PI/2,sweep:0.5,speed:0.7,range:175,fov:0.4}],
    start: {x:60,y:270}, exit: {x:884,y:248,w:44,h:44}
  }
];
function floorCount() { return FLOORS.length; }
// lootTotal counts every treasure across the vault (used for HUD hints).
function lootTotal() { return FLOORS.reduce((n, f) => n + f.loot.length, 0); }
