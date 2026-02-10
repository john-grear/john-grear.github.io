import { reactive } from 'vue';

/**
 * All supported keys for MegaMan controls.
 */
const allKeys = [
  'arrowup',
  'arrowdown',
  'arrowleft',
  'arrowright',
  'w',
  'a',
  's',
  'd',
  ' ',
  'z',
  'shift',
  'x',
];

/**
 * Reactive object maintaining keys being held down.
 */
const activeKeys = reactive({
  up: false,
  down: false,
  left: false,
  right: false,
  jump: false,
  attack: false,
  contextMenu: false,
});

/**
 * Reset all active keys to false.
 */
const resetActiveKeys = () => {
  Object.keys(activeKeys).forEach((key) => {
    (activeKeys as any)[key] = false;
  });
};

/**
 * Prevent spacebar from scrolling the page.
 */
const preventSpacebarScroll = (event: KeyboardEvent) => {
  if (event.target !== document.body) return;
  event.preventDefault();
};

// --- Event listeners (registered once globally) ---

document.addEventListener('keydown', (event) => {
  if (activeKeys.contextMenu) return;

  switch (event.key.toLowerCase()) {
    case 'arrowup':
    case 'w':
      activeKeys.up = true;
      break;
    case 'arrowdown':
    case 's':
      activeKeys.down = true;
      break;
    case 'arrowleft':
    case 'a':
      activeKeys.left = true;
      break;
    case 'arrowright':
    case 'd':
      activeKeys.right = true;
      break;
    case ' ':
      preventSpacebarScroll(event);
      activeKeys.jump = true;
      break;
    case 'z':
      activeKeys.jump = true;
      break;
    case 'shift':
    case 'x':
      activeKeys.attack = true;
      break;
  }
});

document.addEventListener('keyup', (event) => {
  if (activeKeys.contextMenu) return;

  switch (event.key.toLowerCase()) {
    case 'arrowup':
    case 'w':
      activeKeys.up = false;
      break;
    case 'arrowdown':
    case 's':
      activeKeys.down = false;
      break;
    case 'arrowleft':
    case 'a':
      activeKeys.left = false;
      break;
    case 'arrowright':
    case 'd':
      activeKeys.right = false;
      break;
    case ' ':
    case 'z':
      activeKeys.jump = false;
      break;
    case 'shift':
    case 'x':
      activeKeys.attack = false;
      break;
  }
});

document.addEventListener('mousedown', (event) => {
  if (event.button === 0) activeKeys.attack = true;
});

document.addEventListener('mouseup', (event) => {
  if (event.button === 0) activeKeys.attack = false;
});

document.addEventListener('contextmenu', () => {
  resetActiveKeys();
  activeKeys.contextMenu = true;
});

document.addEventListener('click', () => {
  activeKeys.contextMenu = false;
});

/**
 * Composable exposing activeKeys and reset function.
 */
export const useInput = () => {
  return {
    activeKeys,
    allKeys,
    resetActiveKeys,
  };
};
