import { computed, reactive, ref } from 'vue';

import { MegaManAnimation } from './useMegaManAnimation';

export type MegaManTransform = ReturnType<typeof useMegaManTransform>;

export const useMegaManTransform = (element: HTMLElement, animation: MegaManAnimation) => {
  const direction = ref(1); // Left = -1, right = 1
  const spawnCoordinates = reactive({ x: 0, y: 0 });
  const coords = reactive({ x: 0, y: 0 });

  const LEFT = -1;
  const RIGHT = 1;

  const isWalkingRight = computed(() => direction.value === RIGHT);

  /**
   * Sets the default coordinates to the spawn area coordinates with a higher y value to allow
   * Mega Man to fall into place at the start of the spawn animation
   */
  const setSpawnCoords = () => {
    const rect = element.getBoundingClientRect();
    spawnCoordinates.x = window.scrollX + rect.left;
    spawnCoordinates.y = window.scrollY - rect.top;

    coords.x = spawnCoordinates.x;
    coords.y = spawnCoordinates.y * 2;

    animation.updateX(0);
    animation.updateY(coords.y);
  };

  /**
   * Defines the coordinates at spawn to track position in local context. Coordinates are not
   * used for collisions, but for visual position on screen only. Animation controller used
   * to update CSS position variables
   */
  const initSpawn = () => {
    setSpawnCoords();
  };

  /**
   * Update x-coordinate value and CSS property to update position on screen
   *
   * @param {number} deltaX
   */
  const updateX = (deltaX: number) => {
    coords.x += deltaX;
    animation.updateX(coords.x - spawnCoordinates.x);
  };

  /**
   * Update y-coordinate value and CSS property to update position on screen
   *
   * @param {number} deltaY
   */
  const updateY = (deltaY: number) => {
    coords.y += deltaY;
    animation.updateY(coords.y);
  };

  /**
   * Update direction value and CSS property to update direction Mega Man facing on screen
   *
   * @param {boolean} leftPressed
   */
  const updateDirection = (leftPressed: boolean) => {
    direction.value = leftPressed ? LEFT : RIGHT;
    animation.updateDirection(direction.value);
  };

  // initialize
  setSpawnCoords();

  return {
    direction,
    isWalkingRight,
    spawnCoordinates,
    coords,
    LEFT,
    RIGHT,
    setSpawnCoords,
    initSpawn,
    updateX,
    updateY,
    updateDirection,
  };
};
