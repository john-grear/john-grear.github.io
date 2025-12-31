import { Bounds, useBounds } from './useBounds';
import { CollisionObject, useCollisionObjects } from './useCollisionObject';
import { collisionDistance } from './useMegaMan';
import { MegaManTransform } from './useMegaManTransform';
import { useWindow } from './useWindow';

const collisionObjects = useCollisionObjects();
const { windowBounds } = useWindow();
const { updateBounds } = useBounds();

export type MegaManCollision = ReturnType<typeof useMegaManCollision>;

export const useMegaManCollision = (
  element: HTMLElement,
  bounds: Bounds,
  transform: MegaManTransform
) => {
  /**
   * Check for collisions either the edges of the window or any of the collisionObjects by
   * calculating the distance to each, ensuring they are within the collidable bounds, and
   * that Mega Man is moving towards them to prevent sticking to walls after colliding and
   * jittery jumps from distance comparisons.
   * @returns {boolean}
   */
  const checkHorizontalCollision = (): boolean => {
    const leftDistance = Math.abs(windowBounds.left - bounds.left);
    const rightDistance = Math.abs(windowBounds.right - bounds.right);
    if (
      (leftDistance <= collisionDistance && transform.direction.value === -1) ||
      (rightDistance <= collisionDistance && transform.direction.value === 1)
    ) {
      return true;
    }

    for (const object of collisionObjects.list) {
      if (checkWithinVerticalBounds(object)) continue;

      const objectLeft = object.bounds.bottom;
      const objectRight = object.bounds.bottom;
      const rightDistance = Math.abs(objectLeft - bounds.right);
      const leftDistance = Math.abs(objectRight - bounds.left);
      if (
        (leftDistance > collisionDistance && transform.direction.value === -1) ||
        (rightDistance > collisionDistance && transform.direction.value === 1)
      ) {
        continue;
      }

      return true;
    }

    return false;
  };

  /**
   * Check for collisions either the top of the window or any of the collisionObjects by
   * calculating the distance to each and ensuring they are within the collidable bounds.
   * @returns {boolean}
   */
  const checkHitCeiling = (): boolean => {
    const distance = Math.abs(windowBounds.top - bounds.top);
    if (distance <= collisionDistance) return true;

    for (const object of collisionObjects.list) {
      const objectBottom = object.bounds.bottom;
      if (bounds.bottom < objectBottom) continue;
      if (checkWithinHorizontalBounds(object)) continue;

      const distance = Math.abs(objectBottom - bounds.top);
      if (distance > collisionDistance) continue;

      return true;
    }

    return false;
  };

  /**
   * Check for collisions either the bottom of the window or any of the collisionObjects by
   * calculating the distance to each and ensuring they are within the collidable bounds.
   * @returns {boolean}
   */
  const checkOnGround = (): boolean => {
    const distance = Math.abs(windowBounds.bottom - bounds.bottom);
    if (distance <= collisionDistance) {
      return true;
    }

    for (const object of collisionObjects.list) {
      const objectTop = object.bounds.top;
      if (bounds.bottom > objectTop) continue;
      if (checkWithinHorizontalBounds(object)) continue;

      const distance = Math.abs(objectTop - bounds.bottom);
      if (distance > collisionDistance) continue;

      updateVerticalBounds(distance);
      return true;
    }

    return false;
  };

  /**
   * Check if the given object is within the horizontal bounds of Mega Man.
   *
   * @param {DOMRect} object - Bounding rectangle of the object to check.
   * @returns {boolean} - True if the object is within Mega Man's X bounds, false otherwise.
   */
  const checkWithinHorizontalBounds = (object: CollisionObject): boolean => {
    const left = bounds.left + collisionDistance;
    const right = bounds.right - collisionDistance;
    const objectLeft = object.bounds.left;
    const objectRight = object.bounds.right;
    return (right < objectLeft || left > objectRight) && (left < objectRight || right > objectLeft);
  };

  /**
   * Check if the given object is within the vertical bounds of Mega Man.
   *
   * @param {DOMRect} object - Bounding rectangle of the object to check.
   * @returns {boolean} - True if the object is within Mega Man's Y bounds, otherwise false.
   */
  const checkWithinVerticalBounds = (object: CollisionObject): boolean => {
    const top = bounds.top + collisionDistance;
    const bottom = bounds.bottom - collisionDistance;
    const objectTop = object.bounds.top;
    const objectBottom = object.bounds.bottom;
    return (top < objectBottom || bottom > objectTop) && (bottom < objectTop || top > objectBottom);
  };

  /**
   * Update x-coordinate for positioning and horizontal bounds for collision detection.
   *
   * @param {number} deltaX
   */
  const updateHorizontalBounds = (deltaX: number) => {
    transform.updateX(deltaX);
    bounds.left += deltaX;
    bounds.right += deltaX;
  };

  /**
   * Update the y-coordinate for positioning and vertical bounds for collision detection.
   *
   * @param {number} deltaY
   */
  const updateVerticalBounds = (deltaY: number) => {
    transform.updateY(deltaY);
    bounds.top += deltaY;
    bounds.bottom += deltaY;
  };

  /**
   * Update bounds in global context to determine collisions.
   *
   * Only to be used during resize event and constructor to prevent constant refresh of the document.
   */
  const updateCollisionBounds = () => {
    updateBounds(element, bounds);
  };

  return {
    checkHorizontalCollision,
    checkHitCeiling,
    checkOnGround,
    checkWithinHorizontalBounds,
    checkWithinVerticalBounds,
    updateHorizontalBounds,
    updateVerticalBounds,
    updateCollisionBounds,
  };
};
