import { Bounds } from './useBounds';

const list: DeathParticle[] = [];
const movingSpeed = 1;
const maxFrames = 2000;
const offsetParticleTimer = 50;
const secondParticleOffset = 300;

export type DeathParticle = {
  element?: HTMLElement;
  container?: HTMLElement | Element | null;
  vectorX: number;
  vectorY: number;
  angle: number;
  initialDistance: number;
  distance: number;
  framesMoved: number;
  time: number;
  disable: boolean;
};

export type DeathParticles = ReturnType<typeof useDeathParticles>;

export const useDeathParticles = (megaManBounds: Bounds) => {
  /**
   * Spawns a double ring of death particles around mega man when he dies.
   */
  const spawnDeathParticles = () => {
    for (let i = 0; i < 16; i++) {
      createDeathParticle(45 * (i % 8), Math.floor(i / 8));
    }
  };

  /**
   * Creates a new death particle, HTML element for the death particle to display, sets the position
   * and vector, and adds it to the death particle list.
   *
   * @param angle - Angle the particle will move.
   * @param initialDistance - Initial distance from mega man the particle starts at.
   */
  const createDeathParticle = (angle: number, initialDistance: number) => {
    const newDeathParticle = {
      vectorX: 0,
      vectorY: 0,
      angle,
      initialDistance,
      distance: initialDistance * secondParticleOffset,
      framesMoved: 0,
      time: 0,
      disable: false,
    };
    list.push(newDeathParticle);

    // initialization
    createHtmlElement(newDeathParticle);
    setPosition(newDeathParticle);
    setVector(newDeathParticle);
  };

  /**
   * Create a new HTMLDivElement death-particle
   */
  const createHtmlElement = (deathParticle: DeathParticle) => {
    deathParticle.element = document.createElement('div');
    deathParticle.element.classList.add('death-particle');
    deathParticle.element.classList.add('spread');

    deathParticle.container = document.querySelector('.particle-container');
    deathParticle.container = document.createElement('div');
    deathParticle.container.classList.add('particle-container');

    if (!deathParticle.container) throw Error('No container for death particles found.');

    document.body.appendChild(deathParticle.container);

    deathParticle.container.appendChild(deathParticle.element);
  };

  /**
   * Position the particles on Mega Man
   */
  const setPosition = (deathParticle: DeathParticle) => {
    if (!deathParticle.element) return;

    const relativeTop =
      (megaManBounds.top + megaManBounds.bottom) / 2 - deathParticle.element.offsetHeight / 2;
    const relativeLeft =
      (megaManBounds.left + megaManBounds.right) / 2 - deathParticle.element.offsetWidth / 2;

    deathParticle.element.style.left = `${relativeLeft}px`;
    deathParticle.element.style.top = `${relativeTop}px`;
  };

  /**
   * Calculate vectorX and vectorY using the angle
   */
  const setVector = (deathParticle: DeathParticle) => {
    const angleInRadians = deathParticle.angle * (Math.PI / 180);

    deathParticle.vectorX = Math.cos(angleInRadians);
    deathParticle.vectorY = Math.sin(angleInRadians);

    const magnitude = Math.sqrt(deathParticle.vectorX ** 2 + deathParticle.vectorY ** 2);
    deathParticle.vectorX /= magnitude;
    deathParticle.vectorY /= magnitude;
  };

  /**
   * Updates the particle, moving it forward at the angle it has set
   */
  const update = (deathParticle: DeathParticle) => {
    if (deathParticle.disable) {
      updateTimer(deathParticle);
      return;
    }

    move(deathParticle);
  };

  /**
   * Main control function that runs every frame to handle all functionality
   */
  const updateAll = () => {
    list.forEach((deathParticle: DeathParticle) => {
      update(deathParticle);
    });
  };

  /**
   * Wait until time has reached offsetParticleTimer to give an appropriate offset from the initial ring
   */
  const updateTimer = (deathParticle: DeathParticle) => {
    if (!deathParticle.disable) return;

    if (deathParticle.initialDistance <= 0) return;

    if (++deathParticle.time >= offsetParticleTimer) {
      deathParticle.disable = false;
    }
  };

  /**
   * Start animation to move the death particle linearly in a circle shape
   */
  const move = (deathParticle: DeathParticle) => {
    if (!deathParticle.element) return;

    deathParticle.distance += movingSpeed;
    deathParticle.element.style.setProperty(
      '--positionX',
      `${deathParticle.distance * deathParticle.vectorX}px`
    );
    deathParticle.element.style.setProperty(
      '--positionY',
      `${deathParticle.distance * deathParticle.vectorY}px`
    );

    if (++deathParticle.framesMoved >= maxFrames - deathParticle.time) {
      deleteParticle(deathParticle);
    }
  };

  /**
   * Remove death particle from HTML Doc and static list
   */
  const deleteParticle = (deathParticle: DeathParticle) => {
    if (!deathParticle.element) return;

    deathParticle.element.remove();
    const idx = list.findIndex((p) => p.element === deathParticle.element);
    if (idx !== -1) list.splice(idx, 1);
  };

  /**
   * Deletes all death particles in the static list by first deleting the elements then clearing the list.
   *
   * NOTE: Does not use the delete function since the list is splicing too soon and leaves strand
   * death particles occasionally.
   */
  const deleteAll = () => {
    list.forEach((particle) => particle.element?.remove());
    list.splice(0, list.length);
  };

  return {
    list,
    spawnDeathParticles,
    updateAll,
    deleteAll,
  };
};
