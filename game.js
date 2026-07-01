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
  const SHOOT_COOLDOWN = 2500;
  const QUIZ_TIME = 15000;

  /* ─────────────────────────────────────
     QUESTION BANK (General Knowledge)
     ───────────────────────────────────── */
  var QUESTIONS = [
    { q: 'Berapa hasil dari 7 x 8?', a: ['54', '56', '48', '63'], correct: 1 },
    { q: 'Ibukota Indonesia adalah...', a: ['Bandung', 'Surabaya', 'Jakarta', 'Semarang'], correct: 2 },
    { q: 'Planet mana yang paling dekat dengan Matahari?', a: ['Venus', 'Mars', 'Merkurius', 'Bumi'], correct: 2 },
    { q: 'Berapa jumlah huruf dalam alphabet?', a: ['24', '25', '26', '28'], correct: 2 },
    { q: 'Siapa presiden pertama Indonesia?', a: ['Soeharto', 'Soekarno', 'Habibie', 'Megawati'], correct: 1 },
    { q: 'Air membunuh ketika membeku. Apa artinya?', a: ['Es', 'Salju', 'Hujan', 'Kabut'], correct: 0 },
    { q: 'Binatang terbesar di dunia adalah...', a: ['Gajah', 'Paus Biru', 'Jerapah', 'Hiu Putih'], correct: 1 },
    { q: 'Lambang negara Indonesia adalah...', a: ['Harimau', 'Elang', 'Garuda', 'Singa'], correct: 2 },
    { q: 'Hari kemerdekaan Indonesia tanggal...', a: ['17 Agustus 1945', '1 Juni 1945', '28 Oktober 1928', '10 November 1945'], correct: 0 },
    { q: 'Sungai terpanjang di dunia adalah...', a: ['Amazon', 'Nil', 'Mississippi', 'Yangtze'], correct: 1 },
    { q: '1 jam berapa menit?', a: ['50', '55', '60', '100'], correct: 2 },
    { q: 'Laut terbesar di dunia adalah...', a: ['Laut Hindia', 'Laut China Selatan', 'Samudra Pasifik', 'Samudra Atlantik'], correct: 2 },
    { q: 'Benua terbesar di dunia adalah...', a: ['Afrika', 'Eropa', 'Asia', 'Amerika'], correct: 2 },
    { q: 'Mata uang Jepang adalah...', a: ['Yuan', 'Won', 'Yen', 'Baht'], correct: 2 },
    { q: 'Siapa penulis lagu Indonesia Raya?', a: ['Ismail Marzuki', 'W.R. Supratman', 'Ki Hajar Dewantara', 'Gatot Subroto'], correct: 1 },
    { q: 'Jika ada 12 apel dan kamu ambil 3, sisa berapa?', a: ['7', '8', '9', '10'], correct: 2 },
    { q: 'Gunung tertinggi di Indonesia adalah...', a: ['Gunung Merapi', 'Gunung Semeru', 'Gunung Kerinci', 'Puncak Jaya'], correct: 3 },
    { q: 'Lambang olimpiade terdiri dari berapa ring?', a: ['3', '4', '5', '6'], correct: 2 },
    { q: 'Pulau terbesar di Indonesia adalah...', a: ['Sumatera', 'Jawa', 'Kalimantan', 'Sulawesi'], correct: 2 },
    { q: 'Tahun berapa Indonesia merdeka?', a: ['1940', '1943', '1945', '1950'], correct: 2 },
    { q: 'Warna bendera Indonesia di bagian atas adalah...', a: ['Biru', 'Merah', 'Putih', 'Kuning'], correct: 1 },
    { q: 'Berapa hasil dari 144 : 12?', a: ['11', '12', '13', '14'], correct: 1 },
    { q: 'Negara tetangga Indonesia di sebelah utara adalah...', a: ['Australia', 'Timor Leste', 'Malaysia', 'Papua Nugini'], correct: 2 },
    { q: 'Alat untuk mengukur suhu adalah...', a: ['Barometer', 'Termometer', 'Higrometer', 'Anemometer'], correct: 1 },
    { q: 'Lambang sila pertama Pancasila adalah...', a: ['Bintang', 'Rantai', 'Pohon beringin', 'Kepala banteng'], correct: 0 },
  ];
  var usedQuestions = [];

  /* ─────────────────────────────────────
     SVG ICONS
     ───────────────────────────────────── */
  var SVG_DRONE = '<svg viewBox="0 0 40 40" width="28" height="28" xmlns="http://www.w3.org/2000/svg">' +
    '<circle cx="20" cy="20" r="12" fill="none" stroke="#E2A33B" stroke-width="2.5"/>' +
    '<circle cx="20" cy="20" r="5" fill="#E2A33B"/>' +
    '<line x1="20" y1="2" x2="20" y2="8" stroke="#E2A33B" stroke-width="2"/>' +
    '<line x1="20" y1="32" x2="20" y2="38" stroke="#E2A33B" stroke-width="2"/>' +
    '<line x1="2" y1="20" x2="8" y2="20" stroke="#E2A33B" stroke-width="2"/>' +
    '<line x1="32" y1="20" x2="38" y2="20" stroke="#E2A33B" stroke-width="2"/>' +
    '<circle cx="8" cy="8" r="3" fill="#E2A33B" opacity="0.5"/>' +
    '<circle cx="32" cy="8" r="3" fill="#E2A33B" opacity="0.5"/>' +
    '<circle cx="8" cy="32" r="3" fill="#E2A33B" opacity="0.5"/>' +
    '<circle cx="32" cy="32" r="3" fill="#E2A33B" opacity="0.5"/>' +
    '</svg>';

  var SVG_BOT = '<svg viewBox="0 0 40 40" width="30" height="30" xmlns="http://www.w3.org/2000/svg">' +
    '<rect x="6" y="6" width="28" height="28" rx="4" fill="#B6452C" opacity="0.8"/>' +
    '<rect x="10" y="10" width="8" height="8" rx="2" fill="#EDE3CF"/>' +
    '<rect x="22" y="10" width="8" height="8" rx="2" fill="#EDE3CF"/>' +
    '<circle cx="14" cy="14" r="3" fill="#B6452C"/>' +
    '<circle cx="26" cy="14" r="3" fill="#B6452C"/>' +
    '<line x1="12" y1="28" x2="28" y2="28" stroke="#EDE3CF" stroke-width="2"/>' +
    '<line x1="20" y1="34" x2="20" y2="38" stroke="#B6452C" stroke-width="2"/>' +
    '</svg>';

  var SVG_BOT_DEAD = '<svg viewBox="0 0 40 40" width="30" height="30" xmlns="http://www.w3.org/2000/svg">' +
    '<rect x="8" y="8" width="24" height="24" rx="4" fill="#B6452C" opacity="0.25"/>' +
    '<line x1="12" y1="12" x2="28" y2="28" stroke="#B6452C" stroke-width="2.5" opacity="0.5"/>' +
    '<line x1="28" y1="12" x2="12" y2="28" stroke="#B6452C" stroke-width="2.5" opacity="0.5"/>' +
    '</svg>';

  var SVG_BOLT = '<svg viewBox="0 0 40 40" width="24" height="24" xmlns="http://www.w3.org/2000/svg">' +
    '<rect x="8" y="10" width="24" height="20" rx="6" fill="#E2A33B"/>' +
    '<circle cx="15" cy="19" r="3" fill="#1E1A16"/>' +
    '<circle cx="25" cy="19" r="3" fill="#1E1A16"/>' +
    '<circle cx="15" cy="19" r="1.5" fill="#EDE3CF"/>' +
    '<circle cx="25" cy="19" r="1.5" fill="#EDE3CF"/>' +
    '<line x1="20" y1="4" x2="20" y2="10" stroke="#E2A33B" stroke-width="2.5"/>' +
    '<circle cx="20" cy="3" r="2" fill="#E2A33B"/>' +
    '<rect x="12" y="24" width="16" height="3" rx="1.5" fill="#1E1A16" opacity="0.3"/>' +
    '</svg>';

  var SVG_DOOR_CLOSED = '<svg viewBox="0 0 40 40" width="24" height="24" xmlns="http://www.w3.org/2000/svg">' +
    '<rect x="8" y="4" width="24" height="32" rx="1" fill="none" stroke="#E2A33B" stroke-width="2"/>' +
    '<circle cx="28" cy="20" r="2.5" fill="#E2A33B"/>' +
    '<line x1="8" y1="4" x2="8" y2="36" stroke="#E2A33B" stroke-width="3"/>' +
    '</svg>';

  var SVG_DOOR_OPEN = '<svg viewBox="0 0 40 40" width="24" height="24" xmlns="http://www.w3.org/2000/svg">' +
    '<rect x="8" y="4" width="24" height="32" rx="1" fill="none" stroke="#E2A33B" stroke-width="2" stroke-dasharray="4 2"/>' +
    '<line x1="8" y1="4" x2="8" y2="36" stroke="#E2A33B" stroke-width="3"/>' +
    '<line x1="14" y1="12" x2="26" y2="28" stroke="#E2A33B" stroke-width="1.5" opacity="0.4"/>' +
    '<line x1="26" y1="12" x2="14" y2="28" stroke="#E2A33B" stroke-width="1.5" opacity="0.4"/>' +
    '</svg>';

  /* ─────────────────────────────────────
     LEVEL DATA
     0=wall  1=floor  2=door  3=exit  4=bolt
     puzzle tiles stored separately
     ───────────────────────────────────── */
  var LEVELS = [
    {
      name: 'RUANGAN 1 \u2014 LOBI',
      stampText: 'RUANGAN 1',
      cols: 13,
      rows: 9,
      map: [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 3, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      ],
      droneStart: { x: 1, y: 1 },
      exitPos: { x: 11, y: 7 },
      bots: [
        { start: { x: 10, y: 3 }, speed: 1100 },
      ],
      switches: [
        { name: 'Buka Pintu', type: 'door', doorPos: { x: 5, y: 3 }, cooldown: 4000 },
      ],
      puzzle: {
        code: [2, 4, 1],
        tiles: [
          { x: 8, y: 2, val: 1 },
          { x: 10, y: 4, val: 2 },
          { x: 8, y: 4, val: 4 },
        ],
        rewardDoor: { x: 11, y: 7 },
      },
      hint: 'P2: Buka pintu saat bot menjauh. P1: Selesaikan kode Vault untuk buka jalan keluar!',
      hasBolt: false,
    },
    {
      name: 'RUANGAN 2 \u2014 AULA SERVER',
      stampText: 'RUANGAN 2',
      cols: 14,
      rows: 9,
      map: [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      ],
      droneStart: { x: 1, y: 1 },
      exitPos: { x: 12, y: 7 },
      bots: [
        { start: { x: 4, y: 2 }, speed: 800 },
        { start: { x: 10, y: 5 }, speed: 900 },
      ],
      switches: [
        { name: 'Decoy', type: 'decoy', cooldown: 5000, duration: 3000 },
        { name: 'Lampu Mati', type: 'lights', cooldown: 5000, duration: 4000 },
      ],
      puzzle: {
        code: [3, 1, 4],
        tiles: [
          { x: 3, y: 2, val: 1 },
          { x: 10, y: 2, val: 3 },
          { x: 3, y: 5, val: 4 },
          { x: 10, y: 5, val: 2 },
        ],
        rewardDoor: { x: 12, y: 7 },
      },
      hasBolt: false,
    },
    {
      name: 'RUANGAN 3 \u2014 INTI SERVER',
      stampText: 'RUANGAN 3',
      cols: 14,
      rows: 10,
      map: [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      ],
      droneStart: { x: 1, y: 1 },
      exitPos: { x: 12, y: 8 },
      boltPos: { x: 6, y: 3 },
      bots: [
        { start: { x: 4, y: 2 }, speed: 850 },
        { start: { x: 10, y: 5 }, speed: 950 },
        { start: { x: 7, y: 3 }, speed: 1050 },
      ],
      switches: [
        { name: 'Override Pintu', type: 'door', doorPos: { x: 10, y: 7 }, cooldown: 3000 },
      ],
      puzzle: {
        code: [1, 3, 2, 4],
        tiles: [
          { x: 2, y: 4, val: 1 },
          { x: 11, y: 4, val: 2 },
          { x: 2, y: 7, val: 3 },
          { x: 11, y: 7, val: 4 },
        ],
        rewardDoor: { x: 10, y: 7 },
      },
      hasBolt: true,
      alarmDuration: 22000,
    },
  ];

  /* ─────────────────────────────────────
     GAME STATE
     ───────────────────────────────────── */
  var state = {
    currentLevel: 0,
    phase: 'start',
    drone: { x: 0, y: 0 },
    droneDir: { x: 0, y: 1 },
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
    shootCooldown: 0,
    shootCooldownInterval: null,
    projectile: null,
    projectileInterval: null,
    deadBots: {},
    quizActive: false,
    quizCallback: null,
    quizTimer: null,
    quizTimeLeft: 0,
    currentMap: null,
    puzzleProgress: 0,
    puzzleComplete: false,
    puzzleTiles: [],
    puzzleActivated: {},
  };

  /* ─────────────────────────────────────
     DOM REFS
     ───────────────────────────────────── */
  var overlayStart   = document.getElementById('overlay-start');
  var overlayStamp   = document.getElementById('overlay-stamp');
  var overlayWin     = document.getElementById('overlay-win');
  var overlayCaught  = document.getElementById('overlay-caught');
  var stampTextEl    = document.getElementById('stamp-text');
  var gameContainer  = document.getElementById('game-container');
  var droneGrid      = document.getElementById('drone-grid');
  var groundGrid     = document.getElementById('ground-grid');
  var switchList     = document.getElementById('switch-list');
  var hudRoomName    = document.getElementById('hud-room-name');
  var hudStatusText  = document.getElementById('hud-status-text');
  var hudTimer       = document.getElementById('hud-timer');
  var hudTimerValue  = document.getElementById('hud-timer-value');
  var hudDronePos    = document.getElementById('hud-drone-pos');
  var hudBoltStatus  = document.getElementById('hud-bolt-status');
  var hudShootCool   = document.getElementById('hud-shoot-cool');
  var hudShootText   = document.getElementById('hud-shoot-text');
  var overlayQuiz    = document.getElementById('overlay-quiz');
  var quizQuestion   = document.getElementById('quiz-question');
  var quizChoices    = document.getElementById('quiz-choices');
  var quizFeedback   = document.getElementById('quiz-feedback');
  var quizTimerFill  = document.getElementById('quiz-timer-fill');
  var puzzlePanel    = document.getElementById('puzzle-panel');
  var puzzleCodeDisp = document.getElementById('puzzle-code-display');
  var puzzleHintEl   = document.getElementById('puzzle-hint');
  var mobilePuzzleHint = document.getElementById('mobile-puzzle-hint');

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
    initTouchControls();
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
    var level = LEVELS[index];
    var mapCopy = level.map.map(function (row) { return row.slice(); });

    state.drone = { x: level.droneStart.x, y: level.droneStart.y };
    state.droneDir = { x: 0, y: 1 };
    state.doorsOpen = {};
    state.boltCollected = false;
    state.exitOpen = true;
    state.alarmActive = false;
    state.selectedSwitch = 0;
    state.lightsOff = false;
    state.frozenBots = false;
    state.currentMap = mapCopy;
    state.shootCooldown = 0;
    state.projectile = null;
    state.deadBots = {};
    state.puzzleProgress = 0;
    state.puzzleComplete = false;
    state.puzzleActivated = {};

    if (level.puzzle) {
      state.puzzleTiles = level.puzzle.tiles.map(function (t) {
        return { x: t.x, y: t.y, val: t.val };
      });
    } else {
      state.puzzleTiles = [];
    }

    if (state.shootCooldownInterval) {
      clearInterval(state.shootCooldownInterval);
      state.shootCooldownInterval = null;
    }

    clearTimers();

    state.switches = level.switches.map(function (s, i) {
      return {
        name: s.name, type: s.type, doorPos: s.doorPos || null,
        cooldown: s.cooldown, duration: s.duration || 0,
        cooldownActive: false, cooldownEnd: 0, cooldownInterval: null, index: i,
      };
    });

    state.bots = level.bots.map(function (b, i) {
      var dirs = [
        { x: 0, y: -1 },
        { x: 0, y: 1 },
        { x: -1, y: 0 },
        { x: 1, y: 0 },
      ];
      var initDir = dirs[Math.floor(Math.random() * dirs.length)];
      return {
        id: 'bot_' + index + '_' + i,
        speed: b.speed,
        x: b.start.x, y: b.start.y,
        dir: initDir,
        frozen: false, dead: false, interval: null,
      };
    });

    hudRoomName.textContent = level.name;
    hudStatusText.textContent = 'SIAP';
    hudTimer.style.display = 'none';
    hudShootCool.style.display = 'flex';
    hudShootText.textContent = 'SIAP';
    hudShootText.className = 'hud-value';
    hudBoltStatus.textContent = level.hasBolt ? 'BOLT: TERKUNCI' : 'BOLT: --';

    buildGrid(level, droneGrid);
    buildGrid(level, groundGrid);
    buildSwitchList();

    if (level.puzzle) {
      puzzlePanel.style.display = 'block';
      buildPuzzleDisplay(level.puzzle.code);
    } else {
      puzzlePanel.style.display = 'none';
      if (mobilePuzzleHint) { mobilePuzzleHint.classList.remove('active'); mobilePuzzleHint.textContent = ''; }
    }

    if (level.hint && !state.hintShown && index === 0) {
      state.hintShown = true;
      showHint(level.hint);
    }

    startBots();
    renderAll();
  }

  function clearTimers() {
    if (state.alarmInterval) { clearInterval(state.alarmInterval); state.alarmInterval = null; }
    if (state.lightsOffTimer) { clearTimeout(state.lightsOffTimer); state.lightsOffTimer = null; }
    if (state.frozenTimer) { clearTimeout(state.frozenTimer); state.frozenTimer = null; }
    if (state.projectileInterval) { clearInterval(state.projectileInterval); state.projectileInterval = null; }
    if (state.shootCooldownInterval) { clearInterval(state.shootCooldownInterval); state.shootCooldownInterval = null; }
    if (state.quizTimer) { clearInterval(state.quizTimer); state.quizTimer = null; }
    state.quizActive = false;
    overlayQuiz.classList.remove('active');
    state.switches.forEach(function (sw) {
      if (sw.cooldownInterval) { clearInterval(sw.cooldownInterval); sw.cooldownInterval = null; }
    });
    state.bots.forEach(function (bot) {
      if (bot.interval) { clearInterval(bot.interval); bot.interval = null; }
    });
  }

  function showHint(text) {
    hudStatusText.textContent = text;
    setTimeout(function () {
      if (state.phase === 'playing') hudStatusText.textContent = 'SIAP';
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
     PUZZLE SYSTEM
     ───────────────────────────────────── */
  function buildPuzzleDisplay(code) {
    puzzleCodeDisp.innerHTML = '';
    for (var i = 0; i < code.length; i++) {
      var digit = document.createElement('div');
      digit.className = 'puzzle-digit';
      digit.textContent = code[i];
      digit.dataset.index = i;
      puzzleCodeDisp.appendChild(digit);
    }
    puzzleHintEl.textContent = 'Injak angka di map sesuai urutan kode!';
    if (mobilePuzzleHint) {
      mobilePuzzleHint.textContent = 'Injak angka di map sesuai urutan kode!';
      mobilePuzzleHint.classList.add('active');
    }
  }

  function checkPuzzleTile(x, y) {
    var level = LEVELS[state.currentLevel];
    if (!level.puzzle || state.puzzleComplete) return;

    var tile = null;
    for (var i = 0; i < state.puzzleTiles.length; i++) {
      var t = state.puzzleTiles[i];
      if (t.x === x && t.y === y) { tile = t; break; }
    }
    if (!tile) return;

    var key = x + ',' + y;
    if (state.puzzleActivated[key]) return;

    var code = level.puzzle.code;
    var expected = code[state.puzzleProgress];

    if (tile.val === expected) {
      state.puzzleActivated[key] = true;
      state.puzzleProgress++;

      updatePuzzleDisplay(state.puzzleProgress - 1, 'correct');

      if (state.puzzleProgress >= code.length) {
        state.puzzleComplete = true;
        puzzleHintEl.textContent = 'KODE BENAR! Pintu terbuka!';
        puzzleHintEl.style.color = 'var(--teal)';
        if (mobilePuzzleHint) { mobilePuzzleHint.textContent = 'KODE BENAR!'; mobilePuzzleHint.style.color = 'var(--teal)'; }
        unlockPuzzleDoor(level.puzzle);
      } else {
        puzzleHintEl.textContent = 'Benar! ' + state.puzzleProgress + '/' + code.length;
        puzzleHintEl.style.color = 'var(--teal)';
        if (mobilePuzzleHint) { mobilePuzzleHint.textContent = 'Benar! ' + state.puzzleProgress + '/' + code.length; mobilePuzzleHint.style.color = 'var(--teal)'; }
      }
    } else {
      state.puzzleProgress = 0;
      state.puzzleActivated = {};
      updatePuzzleDisplay(-1, 'wrong');
      puzzleHintEl.textContent = 'SALAH! Ulangi dari awal.';
      puzzleHintEl.style.color = 'var(--rust)';
      if (mobilePuzzleHint) { mobilePuzzleHint.textContent = 'SALAH! Ulangi.'; mobilePuzzleHint.style.color = 'var(--rust)'; }
      setTimeout(function () {
        puzzleHintEl.textContent = 'Injak angka di map sesuai urutan kode!';
        puzzleHintEl.style.color = '';
        if (mobilePuzzleHint) { mobilePuzzleHint.textContent = 'Injak angka di map sesuai urutan kode!'; mobilePuzzleHint.style.color = ''; }
      }, 2000);
    }
    renderAll();
  }

  function updatePuzzleDisplay(index, status) {
    var digits = puzzleCodeDisp.querySelectorAll('.puzzle-digit');
    if (status === 'correct' && index >= 0 && index < digits.length) {
      digits[index].classList.add('filled', 'correct');
    } else if (status === 'wrong') {
      for (var i = 0; i < digits.length; i++) {
        digits[i].classList.remove('filled', 'correct');
        digits[i].classList.add('wrong');
      }
      setTimeout(function () {
        for (var j = 0; j < digits.length; j++) {
          digits[j].classList.remove('wrong');
        }
      }, 400);
    }
  }

  function unlockPuzzleDoor(puzzle) {
    if (!puzzle.rewardDoor) return;
    var rd = puzzle.rewardDoor;
    var key = rd.x + ',' + rd.y;
    if (state.currentMap[rd.y][rd.x] === TILE_DOOR) {
      state.currentMap[rd.y][rd.x] = TILE_FLOOR;
      state.doorsOpen[key] = true;
      renderAll();
    }
  }

  /* ─────────────────────────────────────
     BOT MOVEMENT
     ───────────────────────────────────── */
  function startBots() {
    state.bots.forEach(function (bot) {
      bot.interval = setInterval(function () {
        if (state.phase !== 'playing') return;
        if (bot.frozen || bot.dead) return;

        var level = LEVELS[state.currentLevel];
        var dirs = [
          { x: 0, y: -1 },
          { x: 0, y: 1 },
          { x: -1, y: 0 },
          { x: 1, y: 0 },
        ];

        var validDirs = [];
        for (var i = 0; i < dirs.length; i++) {
          var nx = bot.x + dirs[i].x;
          var ny = bot.y + dirs[i].y;
          if (nx >= 0 && nx < level.cols && ny >= 0 && ny < level.rows && state.currentMap[ny][nx] !== TILE_WALL) {
            validDirs.push(dirs[i]);
          }
        }

        if (validDirs.length === 0) return;

        var preferForward = Math.random() < 0.5;
        var chosen = null;

        if (preferForward) {
          for (var j = 0; j < validDirs.length; j++) {
            if (validDirs[j].x === bot.dir.x && validDirs[j].y === bot.dir.y) {
              chosen = validDirs[j];
              break;
            }
          }
        }

        if (!chosen) {
          chosen = validDirs[Math.floor(Math.random() * validDirs.length)];
        }

        bot.x += chosen.x;
        bot.y += chosen.y;
        bot.dir = chosen;

        checkDetection();
        renderAll();
      }, bot.speed);
    });
  }

  function stopBots() {
    state.bots.forEach(function (bot) {
      if (bot.interval) { clearInterval(bot.interval); bot.interval = null; }
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
      if (bot.dead || bot.frozen) continue;
      for (var i = 1; i <= visionRange; i++) {
        var vx = bot.x + bot.dir.x * i;
        var vy = bot.y + bot.dir.y * i;
        if (vx < 0 || vx >= level.cols || vy < 0 || vy >= level.rows) break;
        var tile = state.currentMap[vy][vx];
        if (tile === TILE_WALL) break;
        if (tile === TILE_DOOR && !state.doorsOpen[vx + ',' + vy]) break;
        if (vx === state.drone.x && vy === state.drone.y) { onCaught(); return; }
      }
    }
  }

  function onCaught() {
    state.phase = 'caught';
    stopBots();
    hudStatusText.textContent = 'TERDETEKSI!';
    setTimeout(function () {
      if (state.phase === 'caught') overlayCaught.classList.add('active');
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
      item.innerHTML = '<div class="switch-indicator"></div><span>' + sw.name + '</span>';
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
    items.forEach(function (item, i) { item.classList.toggle('selected', i === state.selectedSwitch); });
  }

  function activateSwitch() {
    var sw = state.switches[state.selectedSwitch];
    if (!sw || sw.cooldownActive || state.quizActive) return;

    if (sw.type === 'door') {
      var key = sw.doorPos.x + ',' + sw.doorPos.y;
      var isOpen = !!state.doorsOpen[key];

      if (isOpen) {
        state.currentMap[sw.doorPos.y][sw.doorPos.x] = TILE_DOOR;
        delete state.doorsOpen[key];
        startSwitchCooldown(sw);
        renderAll();
        return;
      }

      var dx = Math.abs(state.drone.x - sw.doorPos.x);
      var dy = Math.abs(state.drone.y - sw.doorPos.y);
      if (dx > 2 || dy > 2) {
        hudStatusText.textContent = 'Harus di dekat pintu!';
        setTimeout(function () { if (state.phase === 'playing') hudStatusText.textContent = 'SIAP'; }, 2000);
        return;
      }

      showQuiz(function (correct) {
        if (correct) {
          state.currentMap[sw.doorPos.y][sw.doorPos.x] = TILE_FLOOR;
          state.doorsOpen[key] = true;
          startSwitchCooldown(sw);
          renderAll();
          hudStatusText.textContent = 'PINTU TERBUKA!';
          setTimeout(function () { if (state.phase === 'playing') hudStatusText.textContent = 'SIAP'; }, 2000);
        } else {
          hudStatusText.textContent = 'SALAH! Coba lagi...';
          setTimeout(function () { if (state.phase === 'playing') hudStatusText.textContent = 'SIAP'; }, 2000);
        }
      });
      return;
    }

    switch (sw.type) {
      case 'decoy':
        state.frozenBots = true;
        state.bots.forEach(function (bot) { if (!bot.dead) bot.frozen = true; });
        state.frozenTimer = setTimeout(function () {
          state.frozenBots = false;
          state.bots.forEach(function (bot) { bot.frozen = false; });
        }, sw.duration);
        break;
      case 'lights':
        state.lightsOff = true;
        state.lightsOffTimer = setTimeout(function () { state.lightsOff = false; renderAll(); }, sw.duration);
        break;
    }
    startSwitchCooldown(sw);
    renderAll();
  }

  function startSwitchCooldown(sw) {
    sw.cooldownActive = true;
    sw.cooldownEnd = Date.now() + sw.cooldown;
    sw.cooldownInterval = setInterval(function () {
      if (Date.now() >= sw.cooldownEnd) { sw.cooldownActive = false; clearInterval(sw.cooldownInterval); sw.cooldownInterval = null; }
      renderSwitches();
    }, 100);
  }

  /* ─────────────────────────────────────
     DRONE MOVEMENT
     ───────────────────────────────────── */
  function moveDrone(dx, dy) {
    if (state.phase !== 'playing') return;
    state.droneDir = { x: dx, y: dy };

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
      if (state.puzzleComplete) {
        winGame();
      } else {
        hudStatusText.textContent = 'PINTU TERKUNCI! Selesaikan kode Vault dulu!';
        setTimeout(function () { if (state.phase === 'playing') hudStatusText.textContent = 'SIAP'; }, 2500);
      }
      return;
    }

    checkPuzzleTile(newX, newY);
    checkDetection();
    renderAll();
  }

  /* ─────────────────────────────────────
     SHOOTING
     ───────────────────────────────────── */
  function shoot() {
    if (state.phase !== 'playing') return;
    if (state.shootCooldown > 0) return;
    if (state.projectile) return;

    var level = LEVELS[state.currentLevel];
    var dir = state.droneDir;
    var px = state.drone.x + dir.x;
    var py = state.drone.y + dir.y;

    if (px < 0 || px >= level.cols || py < 0 || py >= level.rows) return;
    var tile = state.currentMap[py][px];
    if (tile === TILE_WALL) return;
    if (tile === TILE_DOOR && !state.doorsOpen[px + ',' + py]) return;

    for (var b = 0; b < state.bots.length; b++) {
      var bot = state.bots[b];
      if (!bot.dead && bot.x === px && bot.y === py) {
        killBot(bot);
        startShootCooldown();
        renderAll();
        return;
      }
    }

    state.projectile = { x: px, y: py, dx: dir.x, dy: dir.y };
    startShootCooldown();
    state.projectileInterval = setInterval(function () { advanceProjectile(); }, 80);
    renderAll();
  }

  function advanceProjectile() {
    if (!state.projectile) { clearInterval(state.projectileInterval); state.projectileInterval = null; return; }
    var level = LEVELS[state.currentLevel];
    var p = state.projectile;
    var nx = p.x + p.dx;
    var ny = p.y + p.dy;

    if (nx < 0 || nx >= level.cols || ny < 0 || ny >= level.rows) { destroyProjectile(); return; }
    var tile = state.currentMap[ny][nx];
    if (tile === TILE_WALL) { destroyProjectile(); return; }
    if (tile === TILE_DOOR && !state.doorsOpen[nx + ',' + ny]) { destroyProjectile(); return; }

    for (var b = 0; b < state.bots.length; b++) {
      var bot = state.bots[b];
      if (!bot.dead && bot.x === nx && bot.y === ny) { killBot(bot); destroyProjectile(); return; }
    }
    p.x = nx; p.y = ny;
    renderAll();
  }

  function killBot(bot) {
    bot.dead = true;
    bot.frozen = false;
    if (bot.interval) { clearInterval(bot.interval); bot.interval = null; }
    state.deadBots[bot.id] = true;
    var aliveCount = 0;
    state.bots.forEach(function (b) { if (!b.dead) aliveCount++; });
    hudStatusText.textContent = aliveCount === 0 ? 'SEMUA BOT HANCUR!' : 'BOT HANCUR! ' + aliveCount + ' TERSISA';
    setTimeout(function () { if (state.phase === 'playing') hudStatusText.textContent = 'SIAP'; }, 2000);
  }

  function destroyProjectile() {
    state.projectile = null;
    if (state.projectileInterval) { clearInterval(state.projectileInterval); state.projectileInterval = null; }
    renderAll();
  }

  function startShootCooldown() {
    state.shootCooldown = SHOOT_COOLDOWN;
    if (state.shootCooldownInterval) clearInterval(state.shootCooldownInterval);
    state.shootCooldownInterval = setInterval(function () {
      state.shootCooldown -= 100;
      if (state.shootCooldown <= 0) { state.shootCooldown = 0; clearInterval(state.shootCooldownInterval); state.shootCooldownInterval = null; }
      updateShootHUD();
    }, 100);
  }

  function updateShootHUD() {
    if (state.shootCooldown > 0) {
      hudShootText.textContent = Math.ceil(state.shootCooldown / 1000) + 's';
      hudShootText.className = 'hud-value cooling';
    } else {
      hudShootText.textContent = 'SIAP';
      hudShootText.className = 'hud-value';
    }
  }

  /* ─────────────────────────────────────
     QUIZ SYSTEM
     ───────────────────────────────────── */
  function getRandomQuestion() {
    if (usedQuestions.length >= QUESTIONS.length) usedQuestions = [];
    var available = [];
    for (var i = 0; i < QUESTIONS.length; i++) { if (usedQuestions.indexOf(i) === -1) available.push(i); }
    var idx = available[Math.floor(Math.random() * available.length)];
    usedQuestions.push(idx);
    return QUESTIONS[idx];
  }

  function showQuiz(callback) {
    state.quizActive = true;
    state.quizCallback = callback;
    var question = getRandomQuestion();
    quizQuestion.textContent = question.q;
    quizFeedback.textContent = '';
    quizFeedback.className = 'quiz-feedback';
    quizTimerFill.style.width = '100%';
    quizTimerFill.className = 'quiz-timer-fill';

    quizChoices.innerHTML = '';
    for (var i = 0; i < question.a.length; i++) {
      var btn = document.createElement('button');
      btn.className = 'quiz-choice';
      btn.textContent = question.a[i];
      btn.dataset.index = i;
      btn.addEventListener('click', handleQuizAnswer);
      quizChoices.appendChild(btn);
    }
    overlayQuiz.classList.add('active');

    state.quizTimeLeft = QUIZ_TIME;
    state.quizTimer = setInterval(function () {
      state.quizTimeLeft -= 100;
      var pct = (state.quizTimeLeft / QUIZ_TIME) * 100;
      quizTimerFill.style.width = pct + '%';
      if (pct < 30) quizTimerFill.className = 'quiz-timer-fill urgent';
      if (state.quizTimeLeft <= 0) closeQuiz(false);
    }, 100);
  }

  function handleQuizAnswer(e) {
    if (!state.quizActive) return;
    var btn = e.currentTarget;
    var chosen = parseInt(btn.dataset.index);
    var question = null;
    for (var i = 0; i < QUESTIONS.length; i++) { if (QUESTIONS[i].q === quizQuestion.textContent) { question = QUESTIONS[i]; break; } }
    if (!question) return;

    var buttons = quizChoices.querySelectorAll('.quiz-choice');
    buttons.forEach(function (b) { b.classList.add('disabled'); });

    if (chosen === question.correct) {
      btn.classList.add('correct');
      quizFeedback.textContent = 'BENAR!';
      quizFeedback.className = 'quiz-feedback correct-fb';
      setTimeout(function () { closeQuiz(true); }, 800);
    } else {
      btn.classList.add('wrong');
      buttons[question.correct].classList.add('correct');
      quizFeedback.textContent = 'SALAH! Jawaban: ' + question.a[question.correct];
      quizFeedback.className = 'quiz-feedback wrong-fb';
      setTimeout(function () { closeQuiz(false); }, 1500);
    }
  }

  function closeQuiz(correct) {
    if (state.quizTimer) { clearInterval(state.quizTimer); state.quizTimer = null; }
    overlayQuiz.classList.remove('active');
    state.quizActive = false;
    if (state.quizCallback) { var cb = state.quizCallback; state.quizCallback = null; cb(correct); }
  }

  /* ─────────────────────────────────────
     ALARM
     ───────────────────────────────────── */
  function startAlarm(duration) {
    state.alarmTimer = duration;
    hudTimerValue.textContent = Math.ceil(state.alarmTimer / 1000) + 's';
    state.alarmInterval = setInterval(function () {
      state.alarmTimer -= 100;
      if (state.alarmTimer <= 0) { clearInterval(state.alarmInterval); state.alarmInterval = null; onCaught(); return; }
      hudTimerValue.textContent = Math.ceil(state.alarmTimer / 1000) + 's';
    }, 100);
  }

  /* ─────────────────────────────────────
     WIN / STAMP
     ───────────────────────────────────── */
  function winGame() {
    state.phase = 'win';
    stopBots();
    clearTimers();
    gameContainer.classList.remove('active');
    overlayWin.classList.add('active');
  }

  function showStamp(text, callback) {
    stampTextEl.textContent = text;
    overlayStamp.classList.add('active');
    setTimeout(function () { overlayStamp.classList.remove('active'); if (callback) callback(); }, 800);
  }

  /* ─────────────────────────────────────
     RENDERING
     ───────────────────────────────────── */
  function renderAll() {
    renderDroneView();
    renderGroundView();
    renderSwitches();
    renderProjectile();
    hudDronePos.textContent = 'DRONE: ' + state.drone.x + ',' + state.drone.y;
  }

  function getTileKey(x, y) { return x + ',' + y; }

  function renderDroneView() {
    var level = LEVELS[state.currentLevel];
    var cells = droneGrid.querySelectorAll('.cell');
    cells.forEach(function (cell) {
      var x = parseInt(cell.dataset.x);
      var y = parseInt(cell.dataset.y);
      var dist = Math.abs(x - state.drone.x) + Math.abs(y - state.drone.y);
      cell.className = 'cell';
      cell.innerHTML = '';
      if (dist > DRONE_SIGHT_RADIUS) { cell.classList.add('cell-redacted'); return; }

      var tile = state.currentMap[y][x];
      if (tile === TILE_WALL) { cell.classList.add('cell-wall'); return; }
      if (tile === TILE_DOOR) {
        var doorOpen = !!state.doorsOpen[getTileKey(x, y)];
        cell.classList.add(doorOpen ? 'cell-door-open' : 'cell-door');
        cell.innerHTML = doorOpen ? SVG_DOOR_OPEN : SVG_DOOR_CLOSED;
        return;
      }
      if (tile === TILE_EXIT) {
        cell.classList.add(state.puzzleComplete ? 'cell-exit-active' : 'cell-exit-locked');
        if (!state.puzzleComplete) cell.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16"><rect x="6" y="10" width="12" height="10" rx="1" fill="none" stroke="rgba(237,227,207,0.25)" stroke-width="1.5"/><circle cx="12" cy="15" r="2" fill="none" stroke="rgba(237,227,207,0.25)" stroke-width="1.5"/></svg>';
        return;
      }

      cell.classList.add('cell-floor');

      var pKey = getTileKey(x, y);
      var pTile = getPuzzleTileAt(x, y);
      if (pTile) {
        cell.classList.add('cell-keypad');
        if (state.puzzleActivated[pKey]) cell.classList.add('activated');
        cell.innerHTML = '<span class="keypad-num">' + pTile.val + '</span>';
      }

      renderBotVision(cell, x, y);
      renderBotMarkers(cell, x, y);
      if (x === state.drone.x && y === state.drone.y) cell.innerHTML = SVG_DRONE;
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
      if (tile === TILE_WALL) { cell.classList.add('cell-wall'); return; }
      if (tile === TILE_DOOR) {
        var doorOpen = !!state.doorsOpen[getTileKey(x, y)];
        cell.classList.add(doorOpen ? 'cell-door-open' : 'cell-door');
        cell.innerHTML = doorOpen ? SVG_DOOR_OPEN : SVG_DOOR_CLOSED;
        return;
      }
      if (tile === TILE_EXIT) {
        cell.classList.add(state.puzzleComplete ? 'cell-exit-active' : 'cell-exit-locked');
        if (!state.puzzleComplete) cell.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16"><rect x="6" y="10" width="12" height="10" rx="1" fill="none" stroke="rgba(237,227,207,0.25)" stroke-width="1.5"/><circle cx="12" cy="15" r="2" fill="none" stroke="rgba(237,227,207,0.25)" stroke-width="1.5"/></svg>';
        return;
      }
      if (tile === TILE_BOLT && !state.boltCollected) { cell.classList.add('cell-bolt'); cell.innerHTML = SVG_BOLT; return; }

      cell.classList.add('cell-floor');

      var pKey = getTileKey(x, y);
      var pTile = getPuzzleTileAt(x, y);
      if (pTile) {
        cell.classList.add('cell-keypad');
        if (state.puzzleActivated[pKey]) cell.classList.add('activated');
        cell.innerHTML = '<span class="keypad-num">' + pTile.val + '</span>';
      }

      renderBotVision(cell, x, y);
      renderBotMarkers(cell, x, y);
      if (x === state.drone.x && y === state.drone.y) cell.innerHTML = SVG_DRONE;
    });
  }

  function getPuzzleTileAt(x, y) {
    for (var i = 0; i < state.puzzleTiles.length; i++) {
      var t = state.puzzleTiles[i];
      if (t.x === x && t.y === y) return t;
    }
    return null;
  }

  function renderBotVision(cell, x, y) {
    var level = LEVELS[state.currentLevel];
    var visionRange = state.lightsOff ? 1 : BOT_VISION_RANGE;
    for (var b = 0; b < state.bots.length; b++) {
      var bot = state.bots[b];
      if (bot.dead || bot.frozen) continue;
      for (var i = 1; i <= visionRange; i++) {
        var vx = bot.x + bot.dir.x * i;
        var vy = bot.y + bot.dir.y * i;
        if (vx < 0 || vx >= level.cols || vy < 0 || vy >= level.rows) break;
        var t = state.currentMap[vy][vx];
        if (t === TILE_WALL) break;
        if (t === TILE_DOOR && !state.doorsOpen[getTileKey(vx, vy)]) break;
        if (vx === x && vy === y) cell.classList.add('cell-bot-vision');
      }
    }
  }

  function renderBotMarkers(cell, x, y) {
    for (var b = 0; b < state.bots.length; b++) {
      var bot = state.bots[b];
      if (bot.x === x && bot.y === y) {
        cell.innerHTML = bot.dead ? SVG_BOT_DEAD : SVG_BOT;
        return;
      }
    }
  }

  function renderProjectile() {
    if (!state.projectile) return;
    var px = state.projectile.x;
    var py = state.projectile.y;
    [droneGrid, groundGrid].forEach(function (grid) {
      grid.querySelectorAll('.cell').forEach(function (cell) {
        if (parseInt(cell.dataset.x) === px && parseInt(cell.dataset.y) === py) cell.classList.add('cell-projectile');
      });
    });
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
      case 'w': case 'W': e.preventDefault(); moveDrone(0, -1); break;
      case 's': case 'S': e.preventDefault(); moveDrone(0, 1); break;
      case 'a': case 'A': e.preventDefault(); moveDrone(-1, 0); break;
      case 'd': case 'D': e.preventDefault(); moveDrone(1, 0); break;
      case 'ArrowUp': e.preventDefault(); selectSwitch(-1); break;
      case 'ArrowDown': e.preventDefault(); selectSwitch(1); break;
      case 'Enter': e.preventDefault(); activateSwitch(); break;
      case ' ': e.preventDefault(); shoot(); break;
    }
  }

  /* ─────────────────────────────────────
     TOUCH CONTROLS
     ───────────────────────────────────── */
  function initTouchControls() {
    var dpadBtns = document.querySelectorAll('.dpad-btn');
    dpadBtns.forEach(function (btn) {
      var dir = btn.dataset.dir;
      var repeatTimer = null;
      function doMove() {
        if (state.phase !== 'playing') return;
        if (dir === 'shoot') { shoot(); return; }
        var dx = 0, dy = 0;
        if (dir === 'up') dy = -1;
        if (dir === 'down') dy = 1;
        if (dir === 'left') dx = -1;
        if (dir === 'right') dx = 1;
        moveDrone(dx, dy);
      }
      function onStart(e) {
        e.preventDefault();
        if (state.phase !== 'playing') return;
        doMove();
        if (dir !== 'shoot') repeatTimer = setInterval(doMove, 150);
      }
      function onEnd(e) {
        e.preventDefault();
        if (repeatTimer) { clearInterval(repeatTimer); repeatTimer = null; }
      }
      btn.addEventListener('touchstart', onStart, { passive: false });
      btn.addEventListener('touchend', onEnd, { passive: false });
      btn.addEventListener('touchcancel', onEnd, { passive: false });
      btn.addEventListener('mousedown', onStart);
      btn.addEventListener('mouseup', onEnd);
      btn.addEventListener('mouseleave', onEnd);
    });

    var groundBtns = document.querySelectorAll('.ground-btn');
    groundBtns.forEach(function (btn) {
      function doAction() {
        if (state.phase !== 'playing') return;
        var a = btn.dataset.dir || btn.dataset.action;
        if (a === 'activate') {
          var len = state.switches.length;
          if (len > 1) {
            var next = (state.selectedSwitch + 1) % len;
            state.selectedSwitch = next;
            updateSwitchUI();
          }
          activateSwitch();
        }
      }
      function onStart(e) {
        e.preventDefault();
        if (state.phase !== 'playing') return;
        doAction();
      }
      function onEnd(e) {
        e.preventDefault();
      }
      btn.addEventListener('touchstart', onStart, { passive: false });
      btn.addEventListener('touchend', onEnd, { passive: false });
      btn.addEventListener('touchcancel', onEnd, { passive: false });
      btn.addEventListener('mousedown', onStart);
      btn.addEventListener('mouseup', onEnd);
      btn.addEventListener('mouseleave', onEnd);
    });
  }

  /* ─────────────────────────────────────
     START
     ───────────────────────────────────── */
  init();
})();
