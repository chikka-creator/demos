/* =============================================
   WIRE HEIST — GAME ENGINE
   Vanilla JS, no dependencies
   ============================================= */

(function () {
  'use strict';

  const TILE_WALL = 0;
  const TILE_FLOOR = 1;
  const TILE_DOOR = 2;
  const TILE_EXIT = 3;
  const TILE_BOLT = 4;

  const DRONE_SIGHT_RADIUS = 2;
  const BOT_VISION_RANGE = 3;

  const SVG_DRONE = `<svg viewBox="0 0 40 40" width="28" height="28" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="20" r="12" fill="none" stroke="#E2A33B" stroke-width="2.5"/>
    <circle cx="20" cy="20" r="5" fill="#E2A33B"/>
    <line x1="20" y1="2" x2="20" y2="8" stroke="#E2A33B" stroke-width="2"/>
    <line x1="20" y1="32" x2="20" y2="38" stroke="#E2A33B" stroke-width="2"/>
    <line x1="2" y1="20" x2="8" y2="20" stroke="#E2A33B" stroke-width="2"/>
    <line x1="32" y1="20" x2="38" y2="20" stroke="#E2A33B" stroke-width="2"/>
    <circle cx="8" cy="8" r="3" fill="#E2A33B" opacity="0.5"/>
    <circle cx="32" cy="8" r="3" fill="#E2A33B" opacity="0.5"/>
    <circle cx="8" cy="32" r="3" fill="#E2A33B" opacity="0.5"/>
    <circle cx="32" cy="32" r="3" fill="#E2A33B" opacity="0.5"/>
  </svg>`;

  const SVG_BOT = `<svg viewBox="0 0 40 40" width="30" height="30" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="6" width="28" height="28" rx="4" fill="#B6452C" opacity="0.8"/>
    <rect x="10" y="10" width="8" height="8" rx="2" fill="#EDE3CF"/>
    <rect x="22" y="10" width="8" height="8" rx="2" fill="#EDE3CF"/>
    <circle cx="14" cy="14" r="3" fill="#B6452C"/>
    <circle cx="26" cy="14" r="3" fill="#B6452C"/>
    <line x1="12" y1="28" x2="28" y2="28" stroke="#EDE3CF" stroke-width="2"/>
    <line x1="20" y1="34" x2="20" y2="38" stroke="#B6452C" stroke-width="2"/>
  </svg>`;

  const SVG_BOLT = `<svg viewBox="0 0 40 40" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="10" width="24" height="20" rx="6" fill="#E2A33B"/>
    <circle cx="15" cy="19" r="3" fill="#1E1A16"/>
    <circle cx="25" cy="19" r="3" fill="#1E1A16"/>
    <circle cx="15" cy="19" r="1.5" fill="#EDE3CF"/>
    <circle cx="25" cy="19" r="1.5" fill="#EDE3CF"/>
    <line x1="20" y1="4" x2="20" y2="10" stroke="#E2A33B" stroke-width="2.5"/>
    <circle cx="20" cy="3" r="2" fill="#E2A33B"/>
    <rect x="12" y="24" width="16" height="3" rx="1.5" fill="#1E1A16" opacity="0.3"/>
  </svg>`;

  const SVG_DOOR_CLOSED = `<svg viewBox="0 0 40 40" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="4" width="24" height="32" rx="1" fill="none" stroke="#E2A33B" stroke-width="2"/>
    <circle cx="28" cy="20" r="2.5" fill="#E2A33B"/>
    <line x1="8" y1="4" x2="8" y2="36" stroke="#E2A33B" stroke-width="3"/>
  </svg>`;

  const SVG_DOOR_OPEN = `<svg viewBox="0 0 40 40" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="4" width="24" height="32" rx="1" fill="none" stroke="#E2A33B" stroke-width="2" stroke-dasharray="4 2"/>
    <line x1="8" y1="4" x2="8" y2="36" stroke="#E2A33B" stroke-width="3"/>
    <line x1="14" y1="12" x2="26" y2="28" stroke="#E2A33B" stroke-width="1.5" opacity="0.4"/>
    <line x1="26" y1="12" x2="14" y2="28" stroke="#E2A33B" stroke-width="1.5" opacity="0.4"/>
  </svg>`;

  /* ─────────────────────────────────────
     LEVEL DATA
     0=wall  1=floor  2=door(closed)  3=exit  4=bolt
     ───────────────────────────────────── */
  const LEVELS = [
    {
      name: 'RUANGAN 1 \u2014 LOBI',
      stampText: 'RUANGAN 1',
      cols: 9,
      rows: 7,
      map: [
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 0, 1, 1, 1, 0],
        [0, 1, 1, 1, 2, 1, 1, 1, 0],
        [0, 1, 1, 1, 0, 1, 1, 1, 0],
        [0, 0, 0, 0, 0, 1, 1, 1, 0],
        [0, 0, 0, 0, 0, 1, 1, 3, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
      ],
      droneStart: { x: 1, y: 1 },
      exitPos: { x: 7, y: 5 },
      bots: [
        {
          route: [{ x: 6, y: 1 }, { x: 6, y: 5 }],
          speed: 1200,
          startDir: { x: 0, y: 1 },
        },
      ],
      switches: [
        {
          name: 'Buka Pintu',
          type: 'door',
          doorPos: { x: 4, y: 2 },
          cooldown: 4000,
        },
      ],
      hint: 'P2: Tunggu bot menjauh, tekan ENTER buka pintu. P1: Selinap lewat pintu!',
      hasBolt: false,
    },
    {
      name: 'RUANGAN 2 \u2014 AULA SERVER',
      stampText: 'RUANGAN 2',
      cols: 10,
      rows: 7,
      map: [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 3, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      ],
      droneStart: { x: 1, y: 1 },
      exitPos: { x: 8, y: 5 },
      bots: [
        {
          route: [
            { x: 2, y: 1 },
            { x: 7, y: 1 },
            { x: 7, y: 4 },
            { x: 2, y: 4 },
          ],
          speed: 1000,
          startDir: { x: 1, y: 0 },
        },
        {
          route: [
            { x: 7, y: 4 },
            { x: 2, y: 4 },
            { x: 2, y: 1 },
            { x: 7, y: 1 },
          ],
          speed: 1000,
          startDir: { x: -1, y: 0 },
        },
      ],
      switches: [
        {
          name: 'Decoy',
          type: 'decoy',
          cooldown: 5000,
          duration: 3000,
        },
        {
          name: 'Lampu Mati',
          type: 'lights',
          cooldown: 5000,
          duration: 4000,
        },
      ],
      hasBolt: false,
    },
    {
      name: 'RUANGAN 3 \u2014 INTI SERVER',
      stampText: 'RUANGAN 3',
      cols: 10,
      rows: 8,
      map: [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 2, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 3, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      ],
      droneStart: { x: 1, y: 1 },
      exitPos: { x: 8, y: 6 },
      boltPos: { x: 4, y: 3 },
      bots: [
        {
          route: [{ x: 2, y: 1 }, { x: 7, y: 1 }],
          speed: 1000,
          startDir: { x: 1, y: 0 },
        },
        {
          route: [{ x: 7, y: 5 }, { x: 2, y: 5 }],
          speed: 1100,
          startDir: { x: -1, y: 0 },
        },
        {
          route: [{ x: 4, y: 1 }, { x: 4, y: 4 }],
          speed: 1200,
          startDir: { x: 0, y: 1 },
        },
      ],
      switches: [
        {
          name: 'Override Pintu',
          type: 'door',
          doorPos: { x: 8, y: 5 },
          cooldown: 3000,
        },
      ],
      hasBolt: true,
      alarmDuration: 18000,
    },
  ];

  /* ─────────────────────────────────────
     GAME STATE
     ───────────────────────────────────── */
  const state = {
    currentLevel: 0,
    phase: 'start',
    drone: { x: 0, y: 0 },
    bots: [],
    switches: [],
    selectedSwitch: 0,
    doorsOpen: {},
    boltCollected: false,
    exitOpen: false,
    alarmActive: false,
    alarmTimer: 0,
    alarmInterval: null,
    hintShown: false,
    lightsOff: false,
    lightsOffTimer: null,
    frozenBots: false,
    frozenTimer: null,
  };

  /* ─────────────────────────────────────
     DOM REFS
     ───────────────────────────────────── */
  const overlayStart   = document.getElementById('overlay-start');
  const overlayStamp   = document.getElementById('overlay-stamp');
  const overlayWin     = document.getElementById('overlay-win');
  const overlayCaught  = document.getElementById('overlay-caught');
  const stampTextEl    = document.getElementById('stamp-text');
  const gameContainer  = document.getElementById('game-container');
  const droneGrid      = document.getElementById('drone-grid');
  const groundGrid     = document.getElementById('ground-grid');
  const switchList     = document.getElementById('switch-list');
  const hudRoomName    = document.getElementById('hud-room-name');
  const hudStatusText  = document.getElementById('hud-status-text');
  const hudTimer       = document.getElementById('hud-timer');
  const hudTimerValue  = document.getElementById('hud-timer-value');
  const hudDronePos    = document.getElementById('hud-drone-pos');
  const hudBoltStatus  = document.getElementById('hud-bolt-status');

  /* ─────────────────────────────────────
     INIT
     ───────────────────────────────────── */
  function init() {
    overlayStart.classList.add('active');
    overlayWin.classList.remove('active');
    overlayCaught.classList.remove('active');
    overlayStamp.classList.remove('active');
    gameContainer.classList.remove('active');

    overlayStart.addEventListener('click', startGame);
    overlayWin.addEventListener('click', startGame);
    overlayCaught.addEventListener('click', retryLevel);

    document.addEventListener('keydown', handleKeyDown);
  }

  function startGame() {
    overlayStart.classList.remove('active');
    overlayWin.classList.remove('active');
    overlayCaught.classList.remove('active');
    gameContainer.classList.add('active');
    state.currentLevel = 0;
    state.phase = 'playing';
    loadLevel(state.currentLevel);
  }

  function retryLevel() {
    overlayCaught.classList.remove('active');
    gameContainer.classList.add('active');
    state.phase = 'playing';
    loadLevel(state.currentLevel);
  }

  /* ─────────────────────────────────────
     LEVEL LOADING
     ───────────────────────────────────── */
  function loadLevel(index) {
    const level = LEVELS[index];
    const mapCopy = level.map.map(function (row) { return row.slice(); });

    state.drone = { x: level.droneStart.x, y: level.droneStart.y };
    state.doorsOpen = {};
    state.boltCollected = false;
    state.exitOpen = true;
    state.alarmActive = false;
    state.selectedSwitch = 0;
    state.lightsOff = false;
    state.frozenBots = false;
    state.currentMap = mapCopy;

    clearTimers();

    state.switches = level.switches.map(function (s, i) {
      return {
        name: s.name,
        type: s.type,
        doorPos: s.doorPos || null,
        cooldown: s.cooldown,
        duration: s.duration || 0,
        cooldownActive: false,
        cooldownEnd: 0,
        cooldownInterval: null,
        index: i,
      };
    });

    state.bots = level.bots.map(function (b) {
      return {
        route: b.route.map(function (r) { return { x: r.x, y: r.y }; }),
        speed: b.speed,
        routeIndex: 0,
        routeDir: 1,
        x: b.route[0].x,
        y: b.route[0].y,
        dir: { x: b.startDir.x, y: b.startDir.y },
        frozen: false,
        interval: null,
      };
    });

    hudRoomName.textContent = level.name;
    hudStatusText.textContent = 'SIAP';
    hudTimer.style.display = 'none';
    hudBoltStatus.textContent = level.hasBolt ? 'BOLT: TERKUNCI' : 'BOLT: --';

    buildGrid(level, droneGrid);
    buildGrid(level, groundGrid);
    buildSwitchList();

    if (level.hint && !state.hintShown && index === 0) {
      state.hintShown = true;
      showHint(level.hint);
    }

    startBots();
    renderAll();
  }

  function clearTimers() {
    if (state.alarmInterval) {
      clearInterval(state.alarmInterval);
      state.alarmInterval = null;
    }
    if (state.lightsOffTimer) {
      clearTimeout(state.lightsOffTimer);
      state.lightsOffTimer = null;
    }
    if (state.frozenTimer) {
      clearTimeout(state.frozenTimer);
      state.frozenTimer = null;
    }
    state.switches.forEach(function (sw) {
      if (sw.cooldownInterval) {
        clearInterval(sw.cooldownInterval);
        sw.cooldownInterval = null;
      }
    });
    state.bots.forEach(function (bot) {
      if (bot.interval) {
        clearInterval(bot.interval);
        bot.interval = null;
      }
    });
  }

  function showHint(text) {
    hudStatusText.textContent = text;
    setTimeout(function () {
      if (state.phase === 'playing') {
        hudStatusText.textContent = 'SIAP';
      }
    }, 6000);
  }

  /* ─────────────────────────────────────
     GRID BUILDING
     ───────────────────────────────────── */
  function buildGrid(level, container) {
    container.innerHTML = '';
    container.style.gridTemplateColumns = 'repeat(' + level.cols + ', var(--cell-size))';
    container.style.gridTemplateRows = 'repeat(' + level.rows + ', var(--cell-size))';

    for (var y = 0; y < level.rows; y++) {
      for (var x = 0; x < level.cols; x++) {
        var cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.x = x;
        cell.dataset.y = y;
        container.appendChild(cell);
      }
    }
  }

  /* ─────────────────────────────────────
     BOT MOVEMENT
     ───────────────────────────────────── */
  function startBots() {
    state.bots.forEach(function (bot) {
      bot.interval = setInterval(function () {
        if (state.phase !== 'playing') return;
        if (bot.frozen) return;

        var level = LEVELS[state.currentLevel];
        var route = bot.route;
        var target = route[bot.routeIndex];

        var atTarget = (bot.x === target.x && bot.y === target.y);

        if (atTarget) {
          var nextIdx = bot.routeIndex + bot.routeDir;
          if (nextIdx >= route.length || nextIdx < 0) {
            bot.routeDir *= -1;
            nextIdx = bot.routeIndex + bot.routeDir;
          }
          bot.routeIndex = nextIdx;
          target = route[bot.routeIndex];
        }

        var dx = Math.sign(target.x - bot.x);
        var dy = Math.sign(target.y - bot.y);

        if (dx !== 0 || dy !== 0) {
          var newX = bot.x + dx;
          var newY = bot.y + dy;

          if (
            newX >= 0 && newX < level.cols &&
            newY >= 0 && newY < level.rows &&
            state.currentMap[newY][newX] !== TILE_WALL
          ) {
            bot.x = newX;
            bot.y = newY;
            bot.dir = { x: dx, y: dy };
          } else {
            var skipIdx = bot.routeIndex + bot.routeDir;
            if (skipIdx >= route.length || skipIdx < 0) {
              bot.routeDir *= -1;
              skipIdx = bot.routeIndex + bot.routeDir;
            }
            bot.routeIndex = skipIdx;
          }
        }

        checkDetection();
        renderAll();
      }, bot.speed);
    });
  }

  function stopBots() {
    state.bots.forEach(function (bot) {
      if (bot.interval) {
        clearInterval(bot.interval);
        bot.interval = null;
      }
    });
  }

  /* ─────────────────────────────────────
     DETECTION
     ───────────────────────────────────── */
  function checkDetection() {
    var level = LEVELS[state.currentLevel];
    var visionRange = state.lightsOff ? 1 : BOT_VISION_RANGE;

    for (var b = 0; b < state.bots.length; b++) {
      var bot = state.bots[b];
      for (var i = 1; i <= visionRange; i++) {
        var vx = bot.x + bot.dir.x * i;
        var vy = bot.y + bot.dir.y * i;

        if (vx < 0 || vx >= level.cols || vy < 0 || vy >= level.rows) break;
        var tile = state.currentMap[vy][vx];
        if (tile === TILE_WALL) break;
        if (tile === TILE_DOOR && !state.doorsOpen[vx + ',' + vy]) break;

        if (vx === state.drone.x && vy === state.drone.y) {
          onCaught();
          return;
        }
      }
    }
  }

  function onCaught() {
    state.phase = 'caught';
    stopBots();
    hudStatusText.textContent = 'TERDETEKSI!';
    setTimeout(function () {
      if (state.phase === 'caught') {
        overlayCaught.classList.add('active');
      }
    }, 400);
  }

  /* ─────────────────────────────────────
     SWITCH LOGIC
     ───────────────────────────────────── */
  function buildSwitchList() {
    switchList.innerHTML = '';
    state.switches.forEach(function (sw, i) {
      var item = document.createElement('div');
      item.className = 'switch-item' + (i === state.selectedSwitch ? ' selected' : '');
      item.innerHTML =
        '<div class="switch-indicator"></div><span>' + sw.name + '</span>';
      switchList.appendChild(item);
    });
  }

  function selectSwitch(dir) {
    var len = state.switches.length;
    if (len === 0) return;
    state.selectedSwitch = (state.selectedSwitch + dir + len) % len;
    updateSwitchUI();
  }

  function updateSwitchUI() {
    var items = switchList.querySelectorAll('.switch-item');
    items.forEach(function (item, i) {
      item.classList.toggle('selected', i === state.selectedSwitch);
    });
  }

  function activateSwitch() {
    var sw = state.switches[state.selectedSwitch];
    if (!sw || sw.cooldownActive) return;

    var level = LEVELS[state.currentLevel];

    switch (sw.type) {
      case 'door':
        var key = sw.doorPos.x + ',' + sw.doorPos.y;
        if (state.currentMap[sw.doorPos.y][sw.doorPos.x] === TILE_DOOR) {
          state.currentMap[sw.doorPos.y][sw.doorPos.x] = TILE_FLOOR;
          state.doorsOpen[key] = true;
        } else if (state.currentMap[sw.doorPos.y][sw.doorPos.x] === TILE_FLOOR) {
          state.currentMap[sw.doorPos.y][sw.doorPos.x] = TILE_DOOR;
          delete state.doorsOpen[key];
        }
        break;

      case 'decoy':
        state.frozenBots = true;
        state.bots.forEach(function (bot) { bot.frozen = true; });
        state.frozenTimer = setTimeout(function () {
          state.frozenBots = false;
          state.bots.forEach(function (bot) { bot.frozen = false; });
        }, sw.duration);
        break;

      case 'lights':
        state.lightsOff = true;
        state.lightsOffTimer = setTimeout(function () {
          state.lightsOff = false;
          renderAll();
        }, sw.duration);
        break;
    }

    sw.cooldownActive = true;
    sw.cooldownEnd = Date.now() + sw.cooldown;

    sw.cooldownInterval = setInterval(function () {
      if (Date.now() >= sw.cooldownEnd) {
        sw.cooldownActive = false;
        clearInterval(sw.cooldownInterval);
        sw.cooldownInterval = null;
      }
      renderSwitches();
    }, 100);

    renderAll();
  }

  /* ─────────────────────────────────────
     DRONE MOVEMENT
     ───────────────────────────────────── */
  function moveDrone(dx, dy) {
    if (state.phase !== 'playing') return;

    var level = LEVELS[state.currentLevel];
    var newX = state.drone.x + dx;
    var newY = state.drone.y + dy;

    if (newX < 0 || newX >= level.cols || newY < 0 || newY >= level.rows) return;

    var tile = state.currentMap[newY][newX];

    if (tile === TILE_WALL) return;
    if (tile === TILE_DOOR && !state.doorsOpen[newX + ',' + newY]) return;

    state.drone.x = newX;
    state.drone.y = newY;

    if (tile === TILE_BOLT && !state.boltCollected) {
      state.boltCollected = true;
      state.alarmActive = true;
      hudBoltStatus.textContent = 'BOLT: DIAMBIL!';
      hudTimer.style.display = 'flex';
      hudStatusText.textContent = 'ALARM! KABUR!';
      startAlarm(LEVELS[state.currentLevel].alarmDuration);
    }

    if (tile === TILE_EXIT) {
      winGame();
      return;
    }

    checkDetection();
    renderAll();
  }

  /* ─────────────────────────────────────
     ALARM
     ───────────────────────────────────── */
  function startAlarm(duration) {
    state.alarmTimer = duration;
    hudTimerValue.textContent = Math.ceil(state.alarmTimer / 1000) + 's';

    state.alarmInterval = setInterval(function () {
      state.alarmTimer -= 100;
      if (state.alarmTimer <= 0) {
        clearInterval(state.alarmInterval);
        state.alarmInterval = null;
        onCaught();
        return;
      }
      hudTimerValue.textContent = Math.ceil(state.alarmTimer / 1000) + 's';
    }, 100);
  }

  /* ─────────────────────────────────────
     WIN
     ───────────────────────────────────── */
  function winGame() {
    state.phase = 'win';
    stopBots();
    clearTimers();
    gameContainer.classList.remove('active');
    overlayWin.classList.add('active');
  }

  /* ─────────────────────────────────────
     STAMP TRANSITION
     ───────────────────────────────────── */
  function showStamp(text, callback) {
    stampTextEl.textContent = text;
    overlayStamp.classList.add('active');

    setTimeout(function () {
      overlayStamp.classList.remove('active');
      if (callback) callback();
    }, 800);
  }

  /* ─────────────────────────────────────
     RENDERING
     ───────────────────────────────────── */
  function renderAll() {
    renderDroneView();
    renderGroundView();
    renderSwitches();
    hudDronePos.textContent = 'DRONE: ' + state.drone.x + ',' + state.drone.y;
  }

  function getTileKey(x, y) {
    return x + ',' + y;
  }

  function renderDroneView() {
    var level = LEVELS[state.currentLevel];
    var cells = droneGrid.querySelectorAll('.cell');

    cells.forEach(function (cell) {
      var x = parseInt(cell.dataset.x);
      var y = parseInt(cell.dataset.y);
      var dist = Math.abs(x - state.drone.x) + Math.abs(y - state.drone.y);

      cell.className = 'cell';
      cell.innerHTML = '';

      if (dist > DRONE_SIGHT_RADIUS) {
        cell.classList.add('cell-redacted');
        return;
      }

      var tile = state.currentMap[y][x];

      if (tile === TILE_WALL) {
        cell.classList.add('cell-wall');
        return;
      }

      if (tile === TILE_DOOR) {
        var doorOpen = !!state.doorsOpen[getTileKey(x, y)];
        cell.classList.add(doorOpen ? 'cell-door-open' : 'cell-door');
        cell.innerHTML = doorOpen ? SVG_DOOR_OPEN : SVG_DOOR_CLOSED;
        return;
      }

      if (tile === TILE_EXIT) {
        cell.classList.add('cell-exit-active');
        return;
      }

      if (tile === TILE_BOLT && !state.boltCollected) {
        cell.classList.add('cell-bolt');
        cell.innerHTML = SVG_BOLT;
        return;
      }

      cell.classList.add('cell-floor');

      renderBotVision(cell, x, y);
      renderBotMarkers(cell, x, y);

      if (x === state.drone.x && y === state.drone.y) {
        cell.innerHTML = SVG_DRONE;
      }
    });
  }

  function renderGroundView() {
    var cells = groundGrid.querySelectorAll('.cell');

    cells.forEach(function (cell) {
      var x = parseInt(cell.dataset.x);
      var y = parseInt(cell.dataset.y);

      cell.className = 'cell';
      cell.innerHTML = '';

      var tile = state.currentMap[y][x];

      if (tile === TILE_WALL) {
        cell.classList.add('cell-wall');
        return;
      }

      if (tile === TILE_DOOR) {
        var doorOpen = !!state.doorsOpen[getTileKey(x, y)];
        cell.classList.add(doorOpen ? 'cell-door-open' : 'cell-door');
        cell.innerHTML = doorOpen ? SVG_DOOR_OPEN : SVG_DOOR_CLOSED;
        return;
      }

      if (tile === TILE_EXIT) {
        cell.classList.add('cell-exit-active');
        return;
      }

      if (tile === TILE_BOLT && !state.boltCollected) {
        cell.classList.add('cell-bolt');
        cell.innerHTML = SVG_BOLT;
        return;
      }

      cell.classList.add('cell-floor');

      renderBotVision(cell, x, y);
      renderBotMarkers(cell, x, y);

      if (x === state.drone.x && y === state.drone.y) {
        cell.innerHTML = SVG_DRONE;
      }
    });
  }

  function renderBotVision(cell, x, y) {
    var level = LEVELS[state.currentLevel];
    var visionRange = state.lightsOff ? 1 : BOT_VISION_RANGE;

    for (var b = 0; b < state.bots.length; b++) {
      var bot = state.bots[b];
      for (var i = 1; i <= visionRange; i++) {
        var vx = bot.x + bot.dir.x * i;
        var vy = bot.y + bot.dir.y * i;

        if (vx < 0 || vx >= level.cols || vy < 0 || vy >= level.rows) break;
        var t = state.currentMap[vy][vx];
        if (t === TILE_WALL) break;
        if (t === TILE_DOOR && !state.doorsOpen[getTileKey(vx, vy)]) break;

        if (vx === x && vy === y) {
          cell.classList.add('cell-bot-vision');
        }
      }
    }
  }

  function renderBotMarkers(cell, x, y) {
    for (var b = 0; b < state.bots.length; b++) {
      if (state.bots[b].x === x && state.bots[b].y === y) {
        cell.innerHTML = SVG_BOT;
        return;
      }
    }
  }

  function renderSwitches() {
    var items = switchList.querySelectorAll('.switch-item');
    items.forEach(function (item, i) {
      var sw = state.switches[i];
      if (!sw) return;
      item.className = 'switch-item';
      if (i === state.selectedSwitch) item.classList.add('selected');
      if (sw.cooldownActive) item.classList.add('cooldown');
    });
  }

  /* ─────────────────────────────────────
     INPUT
     ───────────────────────────────────── */
  function handleKeyDown(e) {
    if (state.phase !== 'playing') return;

    switch (e.key) {
      case 'w': case 'W':
        e.preventDefault();
        moveDrone(0, -1);
        break;
      case 's': case 'S':
        e.preventDefault();
        moveDrone(0, 1);
        break;
      case 'a': case 'A':
        e.preventDefault();
        moveDrone(-1, 0);
        break;
      case 'd': case 'D':
        e.preventDefault();
        moveDrone(1, 0);
        break;
      case 'ArrowUp':
        e.preventDefault();
        selectSwitch(-1);
        break;
      case 'ArrowDown':
        e.preventDefault();
        selectSwitch(1);
        break;
      case 'Enter':
        e.preventDefault();
        activateSwitch();
        break;
    }
  }

  /* ─────────────────────────────────────
     START
     ───────────────────────────────────── */
  init();
})();
