// Reuse SolariDisplay's text-display pattern, adapted to the packaged example DOM and audio.

const FLIP_URL = 'one_flip.mp3';
const POOL_SIZE = 6;
const MIN_INTERVAL_MS = 40;
const DEFAULT_MESSAGE = `USD$    1.0000
GBP£    0.7461
EUR€    0.8645
CNY¥    6.7817
JPY¥  160.2327
INR₹   95.2997
KRW₩ 1517.2530
AS OF 2026-06-14 UTC`;

let audioPool = [];
let soundEnabled = false;
let lastPlayAt = 0;
let lastSegmentUpdateAt = 0;
let flipWatchdogTimeout = null;

function initSoundPool() {
  if (audioPool.length) return;
  audioPool = Array.from({ length: POOL_SIZE }, () => {
    const audio = new Audio(FLIP_URL);
    audio.preload = 'auto';
    audio.volume = 0.25;
    return audio;
  });
}

function playFlipSound(intensity = 1) {
  if (!soundEnabled) return;

  const now = performance.now();
  if (now - lastPlayAt < MIN_INTERVAL_MS) return;
  lastPlayAt = now;

  const audio = audioPool.shift();
  if (!audio) return;

  const clamped = Math.max(0, Math.min(1, intensity));
  audio.volume = 0.15 + 0.15 * clamped;

  try {
    audio.currentTime = 0;
  } catch (error) {
    // Ignore browsers that disallow resetting currentTime in some states.
  }

  audio.play().catch(() => {});
  audioPool.push(audio);
}

window.addEventListener('load', () => {
  const boardContainer = document.getElementById('board');
  const form = document.getElementById('message-form');
  const input = document.getElementById('message-input');
  const speedInput = document.getElementById('speed-input');
  const speedDecrease = document.getElementById('speed-decrease');
  const speedIncrease = document.getElementById('speed-increase');
  const heightInput = document.getElementById('height-input');
  const heightDecrease = document.getElementById('height-decrease');
  const heightIncrease = document.getElementById('height-increase');
  const themeInput = document.getElementById('theme-input');
  const soundToggle = document.getElementById('sound-toggle');

  const themeMap = {
    original: 'theme-original',
    amber: 'theme-amber',
    modern: 'theme-modern',
    vintage: 'theme-vintage'
  };

  if (!window.CTR || typeof window.CTR.SolariBoard !== 'function') {
    console.warn('CTR.SolariBoard library not loaded yet.');
    boardContainer.textContent = 'Solari board library not yet wired.';
    return;
  }

  let currentSpeed = parseFloat(speedInput?.value || '4') || 4;
  let currentLetterHeight = parseInt(heightInput?.value || '50', 10) || 50;
  let currentTheme = themeInput?.value || 'original';
  let currentPlaybackMode = 'all-at-once';
  let multiBoard = null;
  let boardConfigKey = '';
  let lastRenderedRowCount = 1;
  let lastMessageText = DEFAULT_MESSAGE;

  const BASE_SEGMENT_WIDTH = 70;
  const BASE_SEGMENT_HEIGHT = 120;
  const SEGMENT_GAP = 4;
  const FRAME_PADDING = 10;
  const EDGE_BLEED = 14;

  function getSegmentWidth(height) {
    const ratio = BASE_SEGMENT_WIDTH / BASE_SEGMENT_HEIGHT;
    return Math.max(36, Math.round(height * ratio));
  }

  function applyTheme(theme) {
    const nextTheme = themeMap[theme] ? theme : 'original';
    currentTheme = nextTheme;
    boardContainer.dataset.theme = nextTheme;
    document.body.dataset.theme = nextTheme;
  }

  function wordWrap(text, cols) {
    const words = text.split(' ');
    const lines = [];
    let line = '';

    for (const word of words) {
      const candidate = line ? `${line} ${word}` : word;
      if (candidate.length <= cols) {
        line = candidate;
      } else {
        if (line) lines.push(line);
        line = word.slice(0, cols);
      }
    }

    if (line) lines.push(line);
    return lines;
  }

  function ensureMultiBoard(rows, cols) {
    const rowCount = Math.max(1, rows);
    const colCount = Math.max(1, cols);
    const configKey = `${rowCount}|${colCount}|${currentLetterHeight}|${currentSpeed}`;

    if (multiBoard && configKey === boardConfigKey) {
      return multiBoard;
    }

    boardContainer.innerHTML = '';
    multiBoard = new window.CTR.MultiRowSolariBoard({
      container: boardContainer,
      rows: rowCount,
      cols: colCount,
      segmentWidth: getSegmentWidth(currentLetterHeight),
      segmentHeight: currentLetterHeight,
      fontSize: Math.round(currentLetterHeight * 0.83),
      rowGap: 3,
      speedMultiplier: currentSpeed,
      onSegmentUpdate() {
        lastSegmentUpdateAt = performance.now();
      }
    });
    boardConfigKey = configKey;
    return multiBoard;
  }

  const applySpeedFromInput = () => {
    if (!speedInput) return;
    const min = parseFloat(speedInput.min) || 0.25;
    const max = parseFloat(speedInput.max) || 8;
    let value = parseFloat(speedInput.value || '4');
    if (Number.isNaN(value)) value = 4;
    value = Math.max(min, Math.min(max, value));
    speedInput.value = String(value);
    currentSpeed = value;
  };

  const applyHeightFromInput = () => {
    if (!heightInput) return;
    const min = parseInt(heightInput.min || '15', 10) || 15;
    const max = parseInt(heightInput.max || '180', 10) || 180;
    let value = parseInt(heightInput.value || '50', 10);
    if (Number.isNaN(value)) value = 50;
    value = Math.max(min, Math.min(max, value));
    heightInput.value = String(value);
    currentLetterHeight = value;
    setMessage(lastMessageText);
  };

  const setMessage = (text) => {
    const upper = (text || DEFAULT_MESSAGE).toString().toUpperCase();
    lastMessageText = upper;
    const segmentCell = getSegmentWidth(currentLetterHeight) + SEGMENT_GAP;
    const boardPad = parseFloat(getComputedStyle(boardContainer).paddingLeft) + parseFloat(getComputedStyle(boardContainer).paddingRight);
    const usableWidth = boardContainer.clientWidth - boardPad - FRAME_PADDING - EDGE_BLEED;
    const cols = Math.max(8, Math.floor(usableWidth / segmentCell));
    const explicitLines = upper.split(/\r?\n/);
    const lines = explicitLines.flatMap((line) => {
      if (!line.trim()) return [' '];
      return wordWrap(line, cols);
    });
    lastRenderedRowCount = Math.max(1, lines.length);
    const sequential = currentPlaybackMode === 'sequential';
    const board = ensureMultiBoard(lines.length, cols);
    board.setAllRowsDiff(lines, {
      sequential,
      rowDelayMs: 1500
    });
    applyTheme(currentTheme);
  };

  const stopSoundWatchdog = () => {
    if (flipWatchdogTimeout) {
      clearTimeout(flipWatchdogTimeout);
      flipWatchdogTimeout = null;
    }
  };

  const startSoundWatchdog = () => {
    if (!soundEnabled) return;

    stopSoundWatchdog();

    const startAt = performance.now();
    lastSegmentUpdateAt = startAt;
    const sequentialLeadMs = currentPlaybackMode === 'sequential'
      ? Math.max(0, lastRenderedRowCount - 1) * 1500
      : 0;
    const hardStopMs = sequentialLeadMs + 9000;

    const checkFlips = () => {
      const now = performance.now();
      const elapsed = now - startAt;
      const afterLastRowStart = elapsed >= sequentialLeadMs;
      const inactivityThresholdMs = afterLastRowStart
        ? 260
        : (currentPlaybackMode === 'sequential' ? 1700 : 260);

      if (elapsed > hardStopMs || (now - lastSegmentUpdateAt) > inactivityThresholdMs) {
        flipWatchdogTimeout = null;
        return;
      }

      playFlipSound();
      flipWatchdogTimeout = setTimeout(checkFlips, 85);
    };

    playFlipSound();
    flipWatchdogTimeout = setTimeout(checkFlips, 85);
  };

  speedInput?.addEventListener('change', applySpeedFromInput);
  speedDecrease?.addEventListener('click', () => {
    if (!speedInput) return;
    speedInput.value = String((parseFloat(speedInput.value || '4') || 4) - (parseFloat(speedInput.step) || 0.25));
    applySpeedFromInput();
  });
  speedIncrease?.addEventListener('click', () => {
    if (!speedInput) return;
    speedInput.value = String((parseFloat(speedInput.value || '4') || 4) + (parseFloat(speedInput.step) || 0.25));
    applySpeedFromInput();
  });

  heightInput?.addEventListener('change', applyHeightFromInput);
  heightDecrease?.addEventListener('click', () => {
    if (!heightInput) return;
    heightInput.value = String((parseInt(heightInput.value || '50', 10) || 50) - (parseInt(heightInput.step || '5', 10) || 5));
    applyHeightFromInput();
  });
  heightIncrease?.addEventListener('click', () => {
    if (!heightInput) return;
    heightInput.value = String((parseInt(heightInput.value || '50', 10) || 50) + (parseInt(heightInput.step || '5', 10) || 5));
    applyHeightFromInput();
  });

  document.querySelectorAll('input[name="playback-mode"]').forEach(radio => {
    radio.addEventListener('change', event => {
      currentPlaybackMode = event.target.value;
    });
  });

  themeInput?.addEventListener('change', () => {
    applyTheme(themeInput.value);
  });

  soundToggle?.addEventListener('change', event => {
    soundEnabled = event.target.checked;
    if (!soundEnabled) stopSoundWatchdog();
  });

  form.addEventListener('submit', event => {
    event.preventDefault();
    const text = input.value || DEFAULT_MESSAGE;

    if (!soundEnabled) {
      initSoundPool();
      soundEnabled = true;
    }

    if (multiBoard && typeof multiBoard.clearPendingUpdates === 'function') {
      multiBoard.clearPendingUpdates();
    }
    setMessage(text);
    startSoundWatchdog();
  });

  applyTheme(currentTheme);
  if (input) input.value = DEFAULT_MESSAGE;
  setMessage(DEFAULT_MESSAGE);
});
