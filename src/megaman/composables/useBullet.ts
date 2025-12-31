import { Bounds } from './useBounds';
import { lowChargeValue, maxChargeValue } from './useMegaMan';
import { useTime } from './useTime';

const { lastTime } = useTime();

const list: Bullet[] = [];
const maxBullets = 3;
let lastBulletTime = 0;
const shootDelay = 100;

const movingSpeed = 10;
const topOffset = 60;
const rightOffset = 0;
const leftOffset = -32;

export type Bullet = {
  element?: HTMLDivElement;
  position: number;
  charge: number;
  direction: number;
  bounds: Bounds;
};

export type Bullets = ReturnType<typeof useBullets>;

export const useBullets = (megaManBounds: Bounds) => {
  /**
   * Creates a new bullet, HTML element for the bullet to display, sets the position, and
   * adds it to the bullet list. Also updates the last bullet time to determine when another
   * bullet can be spawned.
   *
   * @param charge - Charge of the bullet to determine it's sprite / power.
   * @param direction - Left / right direction that the bullet is moving in.
   * @param bounds - Bounds to spawn the bullet with.
   */
  const createBullet = (charge: number, direction: number, bounds: Bounds) => {
    if (!canSpawn()) return;

    const newBullet: Bullet = {
      charge,
      direction,
      bounds,
      position: 0,
    };

    createHtmlElement(newBullet);
    setPosition(newBullet);

    list.push(newBullet);

    lastBulletTime = lastTime.value;
  };

  /**
   * Check to ensure not too many bullets are spawned and bullets are spaced out
   *
   * @returns {boolean}
   */
  const canSpawn = (): boolean => {
    const timeSinceCreation = lastTime.value - lastBulletTime;
    return list.length < maxBullets && timeSinceCreation >= shootDelay;
  };

  /**
   * Create a new HTMLDivElement bullet with different sprite set based on the charge held
   */
  const createHtmlElement = (bullet: Bullet) => {
    bullet.element = document.createElement('div');
    bullet.element.classList.add('bullet');

    document.body.appendChild(bullet.element);

    if (bullet.charge >= lowChargeValue && bullet.charge < maxChargeValue) {
      bullet.element.classList.add('low-charge');
    } else if (bullet.charge >= maxChargeValue) {
      bullet.element.classList.add('max-charge');
    }
  };

  /**
   * Flip and position the bullet based on Mega Man flipped state and position
   */
  const setPosition = (bullet: Bullet) => {
    if (!bullet.element || !megaManBounds) return;

    bullet.element.style.setProperty('--direction', bullet.direction.toString());

    const relativeTop = megaManBounds.top + topOffset;
    const relativeLeft = megaManBounds.left + leftOffset;
    const relativeRight = megaManBounds.right + rightOffset;

    bullet.element.style.top = `${relativeTop}px`;
    bullet.element.style.left =
      bullet.direction === -1 ? `${relativeLeft}px` : `${relativeRight}px`;
  };

  /**
   * Updates the bullet, moving it forward in it's direction
   */
  const update = (bullet: Bullet) => {
    move(bullet);
  };

  /**
   * Main control function that runs every frame to handle all functionality
   */
  const updateAll = () => {
    list.forEach((bullet: Bullet) => {
      update(bullet);
    });
  };

  /**
   * Start animation to move the bullet across the screen
   */
  const move = (bullet: Bullet) => {
    if (!bullet.element) return;

    bullet.position += movingSpeed * bullet.direction;
    bullet.element.style.setProperty('--position', `${bullet.position}px`);

    const bulletRect = bullet.element.getBoundingClientRect();
    if (
      (bullet.direction === 1 && bulletRect.right >= window.innerWidth - 20) ||
      (bullet.direction === -1 && bulletRect.left <= 20)
    ) {
      deleteBullet(bullet);
      return;
    }
  };

  /**
   * Remove bullet from HTML Doc and static list
   */
  const deleteBullet = (bullet: Bullet) => {
    if (!bullet.element) return;

    bullet.element.remove();
    const index = list.findIndex((b) => b.element === bullet.element);
    if (index !== -1) list.splice(index, 1);
  };

  /**
   * Deletes all bullets in the static list by first deleting the elements then clearing the list.
   *
   * NOTE: Does not use the delete function since the list is splicing too soon and leaves strand
   * bullets occasionally.
   */
  const deleteAll = () => {
    list.forEach((bullet) => bullet.element?.remove());
    list.splice(0, list.length);
  };

  return {
    list,
    canSpawn,
    createBullet,
    setPosition,
    update,
    updateAll,
    move,
    deleteBullet,
    deleteAll,
  };
};
