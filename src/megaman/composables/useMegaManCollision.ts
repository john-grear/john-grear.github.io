import { Bounds, useBounds } from './useBounds';
import { CollisionObject, useCollisionObjects } from './useCollisionObject';
import { horizontalCollisionDistance, verticalCollisionDistance } from './useMegaMan';
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
  const checkHorizontalCollision = (isAttemptingSlide?: boolean): boolean => {
    // Window edges
    const leftDistance = bounds.left - windowBounds.left;
    const rightDistance = windowBounds.right - bounds.right;

    if (
      (leftDistance <= horizontalCollisionDistance && !transform.isWalkingRight.value) ||
      (rightDistance <= horizontalCollisionDistance && transform.isWalkingRight.value)
    ) {
      return true;
    }

    // Collidable objects
    for (const object of collisionObjects.list) {
      // Only consider objects that overlap vertically
      if (checkWithinVerticalBounds(object, isAttemptingSlide)) continue;

      const objectLeft = object.bounds.left;
      const objectRight = object.bounds.right;

      const distToLeft = Math.abs(bounds.right - objectLeft); // MegaMan → object’s left
      const distToRight = Math.abs(objectRight - bounds.left); // MegaMan → object’s right

      if (
        (distToRight <= horizontalCollisionDistance && !transform.isWalkingRight.value) ||
        (distToLeft <= horizontalCollisionDistance && transform.isWalkingRight.value)
      ) {
        return true;
      }
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
    if (distance <= verticalCollisionDistance) return true;

    for (const object of collisionObjects.list) {
      const objectBottom = object.bounds.bottom;
      if (bounds.bottom < objectBottom) continue;
      if (checkWithinHorizontalBounds(object)) continue;

      const distance = Math.abs(objectBottom - bounds.top);
      if (distance > verticalCollisionDistance) continue;

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

    if (distance <= verticalCollisionDistance) {
      updateVerticalBounds(distance);
      return true;
    }

    for (const object of collisionObjects.list) {
      const objectTop = object.bounds.top;
      if (bounds.bottom > objectTop) continue;
      if (checkWithinHorizontalBounds(object)) continue;

      const distance = Math.abs(objectTop - bounds.bottom);
      if (distance > verticalCollisionDistance) continue;

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
    const left = bounds.left + horizontalCollisionDistance;
    const right = bounds.right - horizontalCollisionDistance;

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
  const checkWithinVerticalBounds = (
    object: CollisionObject,
    isAttemptingSlide?: boolean
  ): boolean => {
    let top = bounds.top + verticalCollisionDistance;
    const bottom = bounds.bottom - verticalCollisionDistance;

    const objectTop = object.bounds.top;
    const objectBottom = object.bounds.bottom;

    if (isAttemptingSlide) {
      // TODO: Subtract some from top
      top = top - verticalCollisionDistance;
    }

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
