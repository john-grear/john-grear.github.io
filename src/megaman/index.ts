import Bullet from './classes/bullet';
import CollisionObject from './classes/collision-object';
import DeathParticle from './classes/death-particle';
import MegaMan from './classes/mega-man';
import './utils/event-handler';
import Time from './utils/time';
import Window from './utils/window';

export let megaMan: MegaMan;
export let collisionObjects: CollisionObject[];

let running = false;

/**
 * Starts the megaman game loop and all other necessary startup steps.
 */
export function start() {
  megaMan = new MegaMan();
  collisionObjects = [];

  markDivsAsGround();

  findCollisionObjects();

  Window.resize(MegaMan.collisionDistance, megaMan);

  running = true;

  gameLoop();
}

/**
 * Stops the megaman game loop and clears all cache lists.
 */
export function stop() {
  running = false;

  Bullet.deleteAll();

  DeathParticle.deleteAll();
}

/**
 * Run the whole interactive every frame
 */
function gameLoop() {
  if (!running) return;

  // Update delta time to be used in other classes
  Time.update();

  // Handle all functionality for Mega Man
  megaMan.update(collisionObjects);

  // Handle all bullet movement
  Bullet.list.forEach((bullet: Bullet) => {
    bullet.update();
  });

  // Handle all death particle movement
  DeathParticle.list.forEach((particle: DeathParticle) => {
    particle.update();
  });

  requestAnimationFrame(gameLoop);
}

/**
 * Finds all divs and adds the ground class to have them used as collision objects.
 */
function markDivsAsGround() {
  const allDivs = document.getElementsByTagName('div');

  for (const div of allDivs) {
    if (!checkValidGround(div)) continue;

    div.classList.add('ground');
  }
}

/**
 * Checks if the div element is considered valid ground or not.
 *
 * @param div - Div element to check.
 * @returns `true` if the div element is considered valid ground, otherwise `false`.
 */
function checkValidGround(div: HTMLDivElement) {
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
}

/**
 * Find all elements tagged as ground and adds them as CollisionObject's to an array
 *
 * TODO: Change this later to default to all divs in document unless config section toggled
 */
function findCollisionObjects() {
  var groundTagElements = Array.from(document.getElementsByClassName('ground')) as HTMLElement[];

  groundTagElements.forEach((element) => collisionObjects.push(new CollisionObject(element)));
}
