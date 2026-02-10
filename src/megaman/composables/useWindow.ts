import { Bounds, useBounds } from '../composables/useBounds';
import { useCollisionObjects } from '../composables/useCollisionObject';

const collisionObjects = useCollisionObjects();

const { createBounds } = useBounds();
const windowBounds = createBounds();

/**
 * Composable for managing global window bounds and collision updates.
 */
export const useWindow = () => {
  /**
   * Update the bounds for the Window as well as all objects in it to ensure collisions function correctly.
   *
   * @param {number} horizontalCollisionDistance - Distance to shrink horizontal bounds for collision detection.
   * @param {number} verticalCollisionDistance - Distance to shrink vertical bounds for collision detection.
   */
  const resizeWindow = (horizontalCollisionDistance: number, verticalCollisionDistance: number) => {
    windowBounds.top = 0;
    windowBounds.bottom = window.innerHeight + scrollY - verticalCollisionDistance;
    windowBounds.left = 0;
    windowBounds.right = window.innerWidth + scrollX - horizontalCollisionDistance;

    collisionObjects.list.forEach((object) => collisionObjects.update(object));
  };

  /**
   * Check if bounds are past any of the Window's bounds.
   *
   * @param {Bounds} bounds - Bounds to check.
   * @returns {boolean} True if off screen.
   */
  const isOffScreen = (bounds: Bounds): boolean => {
    return (
      bounds.left < windowBounds.left ||
      bounds.right > windowBounds.right ||
      bounds.top < windowBounds.top ||
      bounds.bottom > windowBounds.bottom
    );
  };

  return {
    windowBounds,
    resizeWindow,
    isOffScreen,
  };
};
