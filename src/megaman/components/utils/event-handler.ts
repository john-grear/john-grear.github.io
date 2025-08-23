import MegaMan from '../classes/mega-man';
import { collisionObjects, megaMan } from '../index';
import Window from './window';

// Maintains keys being held down
export const activeKeys = {
  up: false,
  down: false,
  left: false,
  right: false,
  jump: false,
  attack: false,
  contextMenu: false,
};

function resetActiveKeys() {
  for (const key in activeKeys) {
    activeKeys[key as keyof typeof activeKeys] = false;
  }
}

document.addEventListener('keydown', (event) => {
  if (activeKeys.contextMenu) return;

  switch (event.key) {
    case 'ArrowUp':
    case 'w':
      activeKeys.up = true;
      break;
    case 'ArrowDown':
    case 's':
      activeKeys.down = true;
      break;
    case 'ArrowLeft':
    case 'a':
      activeKeys.left = true;
      break;
    case 'ArrowRight':
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
    case 'Shift':
    case 'x':
      activeKeys.attack = true;
      break;
  }
});

document.addEventListener('keyup', (event) => {
  if (activeKeys.contextMenu) return;

  switch (event.key) {
    case 'ArrowUp':
    case 'w':
      activeKeys.up = false;
      break;
    case 'ArrowDown':
    case 's':
      activeKeys.down = false;
      break;
    case 'ArrowLeft':
    case 'a':
      activeKeys.left = false;
      break;
    case 'ArrowRight':
    case 'd':
      activeKeys.right = false;
      break;
    case ' ':
    case 'z':
      activeKeys.jump = false;
      break;
    case 'Shift':
    case 'x':
      activeKeys.attack = false;
      break;
  }
});

window.addEventListener('resize', (_event) => {
  resetActiveKeys();
  Window.resize(MegaMan.collisionDistance, megaMan, collisionObjects);
  resetActiveKeys();
});

document.addEventListener('mousedown', (event) => {
  switch (event.button) {
    case 0:
      activeKeys.attack = true;
      break;
  }
});

document.addEventListener('mouseup', (event) => {
  switch (event.button) {
    case 0:
      activeKeys.attack = false;
      break;
  }
});

// Stop input when right clicking for context menu
document.addEventListener('contextmenu', (_event) => {
  resetActiveKeys();
  activeKeys.contextMenu = true;
});

document.addEventListener('click', (_event) => {
  activeKeys.contextMenu = false;
});

function preventSpacebarScroll(event: KeyboardEvent) {
  if (event.target !== document.body) return;

  event.preventDefault();
}
