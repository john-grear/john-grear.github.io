import { ref } from 'vue';

import { useMenuStore } from '../stores/menu';
import { Bullets, useBullets } from './useBullet';
import { useCollisionObjects } from './useCollisionObject';
import { DeathParticles, useDeathParticles } from './useDeathParticle';
import { useInput } from './useInput';
import { MegaMan } from './useMegaMan';
import { useTime } from './useTime';
import { useWindow } from './useWindow';

let running = false;

const menu = useMenuStore();

const megaMan = ref<MegaMan>();
const bullets = ref<Bullets>();
const deathParticles = ref<DeathParticles>();
const collisionObjects = useCollisionObjects();

const { resizeWindow } = useWindow();
const Time = useTime();
useInput();

/**
 * Starts the megaman game loop and all other necessary startup steps.
 */
const start = () => {
  if (!megaMan || !bullets || !deathParticles) return;

  markDivsAsGround();

  findCollisionObjects();

  resizeWindow(megaMan.value!.collisionDistance);

  running = true;

  gameLoop();
};

/**
 * Stops the megaman game loop and clears all cache lists.
 */
const stop = () => {
  running = false;

  bullets.value?.deleteAll();

  deathParticles.value?.deleteAll();
};

/**
 * Run the whole interactive every frame
 */
const gameLoop = () => {
  // Update delta time to be used in other classes
  Time.update();

  // Skip game loop if not running or menu is open
  if (!running || menu.isOpen) {
    requestAnimationFrame(gameLoop);
    return;
  }

  // Handle all functionality for Mega Man
  megaMan.value!.update();

  // Handle all bullet movement
  bullets.value!.updateAll();

  // Handle all death particle movement
  deathParticles.value!.updateAll();

  requestAnimationFrame(gameLoop);
};

/**
 * Finds all divs and adds the ground class to have them used as collision objects.
 */
const markDivsAsGround = () => {
  const allDivs = document.getElementsByTagName('div');

  for (const div of allDivs) {
    if (!checkValidGround(div)) continue;

    div.classList.add('ground');
  }
};

/**
 * Checks if the div element is considered valid ground or not.
 *
 * @param div - Div element to check.
 * @returns `true` if the div element is considered valid ground, otherwise `false`.
 */
const checkValidGround = (div: HTMLDivElement) => {
  const style = window.getComputedStyle(div);
  const rect = div.getBoundingClientRect();

  // Explicit opt-outs always win
  if (div.classList.contains('passable')) return false;

  // Not visually present
  if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0')
    return false;

  // Has no physical presence
  if (rect.width === 0 || rect.height === 0) return false;

  return true;
};

/**
 * Find all elements tagged as ground and adds them as CollisionObject's to an array
 *
 * TODO: Change this later to default to all divs in document unless config section toggled
 */
const findCollisionObjects = () => {
  var groundTagElements = Array.from(document.getElementsByClassName('ground')) as HTMLElement[];

  groundTagElements.forEach((element) => collisionObjects.createCollisionObject(element));
};

export const useGame = (player: MegaMan) => {
  megaMan.value = player;
  bullets.value = useBullets(megaMan.value.bounds);
  deathParticles.value = useDeathParticles(megaMan.value.bounds);

  return { start, stop };
};
