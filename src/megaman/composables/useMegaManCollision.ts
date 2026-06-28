import { Ref, ref } from 'vue';

import { Bounds, useBounds } from './useBounds';
import { CollisionObject, useCollisionObjects } from './useCollisionObject';
import { MegaManTransform } from './useMegaManTransform';
import { useWindow } from './useWindow';

const collisionObjects = useCollisionObjects();
const { windowBounds } = useWindow();
const { createBounds, updateBounds } = useBounds();

export type MegaManCollision = ReturnType<typeof useMegaManCollision>;

export const useMegaManCollision = (
  element: HTMLElement,
  transform: MegaManTransform,
  grounded: Ref<boolean>
) => {
  const bounds = ref<Bounds>(createBounds(element));

  /**
   * Calculates distance to any collisions with either the window edges or any of the collisionObjects,
   * ensuring they are within the collidable bounds, and that mega man is moving towards them to
   * prevent sticking to walls after colliding and jittery jumps from distance comparisons.
   *
   * @param isAttemptingSlide - Whether mega man is attempting to slide and needs their
   *                            height lowered in the vertical calculation.
   * @param newLeft           - Left bound to check collision with.
   * @param newRight          - Right bound to check collision with.
   * @returns Distance to collision object (or window) if found, otherwise `NaN`.
   */
  const getHorizontalCollision = (
    isAttemptingSlide: boolean = false,
    newLeft: number = bounds.value.left,
    newRight: number = bounds.value.right
  ): number => {
    const getCollision = (objectLeft: number, objectRight: number, isWindow: boolean = false) => {
      const distToRight = newLeft - objectRight; // MegaMan left → object’s right
      const distToLeft = newRight - objectLeft; // MegaMan right → object’s left

      const currentDistToRight = bounds.value.left - objectRight;
      const currentDistToLeft = bounds.value.right - objectLeft;

      if (distToRight <= 0 && (isWindow || distToLeft > 0) && !transform.isWalkingRight.value) {
        // Current distance to right will be opposite direction of distance to right
        return -currentDistToRight;
      }

      if (distToLeft >= 0 && (isWindow || distToRight < 0) && transform.isWalkingRight.value) {
        // Current distance to left will be opposite direction of distance to left
        return -currentDistToLeft;
      }

      return NaN;
    };

    // Window edges
    const windowCollisionDistance = getCollision(windowBounds.right, windowBounds.left, true);
    if (!Number.isNaN(windowCollisionDistance)) return windowCollisionDistance;

    // Collidable objects
    for (const object of collisionObjects.list) {
      // Only consider objects that overlap vertically
      if (!checkWithinVerticalBounds(object, isAttemptingSlide)) continue;

      const collisionDistance = getCollision(object.bounds.left, object.bounds.right);
      if (!Number.isNaN(collisionDistance)) return collisionDistance;
    }

    return NaN;
  };

  /**
   * Checks if there is a collision by getting the distance to a horizontal collision and returning
   * whether the distance is NaN or not.
   *
   * @param isAttemptingSlide - Whether mega man is attempting to slide and needs their
   *                            height lowered in the vertical calculation.
   * @param newLeft           - Left bound to check collision with.
   * @param newRight          - Right bound to check collision with.
   * @returns True if there is a collision detected, otherwise false.
   */
  const checkHorizontalCollision = (
    isAttemptingSlide: boolean = false,
    newLeft: number = bounds.value.left,
    newRight: number = bounds.value.right
  ) => {
    const collisionDistance = getHorizontalCollision(isAttemptingSlide, newLeft, newRight);
    return !Number.isNaN(collisionDistance);
  };

  /**
   * Calculates distance to any collisions with either the window top or any of the collisionObjects
   * above mega man, ensuring they are within the horziontal bounds.
   *
   * @param newTop    - Top bound to check collision with.
   * @param newBottom - Bottom bound to check collision with.
   * @returns Distance to collision object (or window) if found, otherwise `NaN`.
   */
  const getTopCollision = (
    newTop: number = bounds.value.top,
    newBottom: number = bounds.value.bottom
  ) => {
    if (!grounded.value) {
      const height = newBottom - newTop;
      const jumpHeight = height / 0.75;
      const difference = height - jumpHeight;
      newTop = newTop + difference;
    }

    const distance = newTop - windowBounds.top;
    const currentDistance = bounds.value.top - windowBounds.top;

    if (distance <= 0) return currentDistance;

    for (const object of collisionObjects.list) {
      // Skip any objects below mega man
      if (bounds.value.bottom < object.bounds.bottom) continue;

      // Skip any objects where not in horizontal bounds
      if (!checkWithinHorizontalBounds(object)) continue;

      const objectBottom = object.bounds.bottom;
      const distance = newTop - objectBottom;

      if (distance > 0) continue;

      const currentDistance = bounds.value.top - objectBottom;
      return -currentDistance;
    }

    return NaN;
  };

  /**
   * Checks if there is a collision by getting the distance to a collision above mega man and returning
   * whether the distance is NaN or not.
   *
   * @param newTop    - Top bound to check collision with.
   * @param newBottom - Bottom bound to check collision with.
   * @returns True if there is a collision detected, otherwise false.
   */
  const checkHitCeiling = (
    newTop: number = bounds.value.top,
    newBottom: number = bounds.value.bottom
  ): boolean => {
    const collisionDistance = getTopCollision(newTop, newBottom);
    return !Number.isNaN(collisionDistance);
  };

  /**
   * Calculates distance to any collisions with either the window bottom or any of the collisionObjects
   * below mega man, ensuring they are within the horziontal bounds.
   *
   * @param newBottom - Bottom bound to check collision with.
   * @returns Distance to collision object (or window) if found, otherwise `NaN`.
   */
  const getGroundCollision = (newBottom: number = bounds.value.bottom): number => {
    const distance = newBottom - windowBounds.bottom;
    const currentDistance = bounds.value.bottom - windowBounds.bottom;

    if (distance >= 0) return -currentDistance;

    for (const object of collisionObjects.list) {
      // Skip any objects above mega man
      if (bounds.value.bottom > object.bounds.bottom) continue;

      // Skip any objects where not in horizontal bounds
      if (!checkWithinHorizontalBounds(object)) continue;

      const objectTop = object.bounds.top;
      const distance = newBottom - objectTop;

      if (distance < 0) continue;

      const currentDistance = bounds.value.bottom - objectTop;
      return -currentDistance;
    }

    return NaN;
  };

  /**
   * Checks if there is a collision by getting the distance to a collision below mega man and returning
   * whether the distance is NaN or not.
   *
   * @param newBottom - Bottom bound to check collision with.
   * @returns True if there is a collision detected, otherwise false.
   */
  const checkOnGround = (newBottom: number = bounds.value.bottom): boolean => {
    const collisionDistance = getGroundCollision(newBottom);
    return !Number.isNaN(collisionDistance);
  };

  /**
   * Check if the given object is within the horizontal bounds of mega man.
   *
   * @param object    - Bounding rectangle of the object to check.
   * @param inclusive - Whether the bounds should be inclusive or not.
   * @returns True if the object is within mega man's X bounds, false otherwise.
   */
  const checkWithinHorizontalBounds = (
    object: CollisionObject,
    inclusive: boolean = false
  ): boolean => {
    const isWithinBounds = (coord: number, bounds: Bounds) =>
      inclusive
        ? coord >= bounds.left && coord <= bounds.right
        : coord > bounds.left && coord < bounds.right;

    return (
      isWithinBounds(bounds.value.left, object.bounds) ||
      isWithinBounds(bounds.value.right, object.bounds) ||
      isWithinBounds(object.bounds.left, bounds.value) ||
      isWithinBounds(object.bounds.right, bounds.value)
    );
  };

  /**
   * Check if the given object is within the vertical bounds of mega man, adjusting for the
   * slide height if attempting to slide or is in the air.
   *
   * @param object - Bounding rectangle of the object to check.
   * @returns True if the object is within mega man's Y bounds, otherwise false.
   */
  const checkWithinVerticalBounds = (
    object: CollisionObject,
    isAttemptingSlide: boolean = false
  ): boolean => {
    let top = bounds.value.top;
    const bottom = bounds.value.bottom;

    const objectTop = object.bounds.top;
    const objectBottom = object.bounds.bottom;

    // Offset sliding / in air height
    if (isAttemptingSlide) {
      const height = bottom - top;
      const slideHeight = height * (0.65 / 0.75);
      const difference = height - slideHeight;
      top = top + difference;
    } else if (!grounded.value) {
      const height = bottom - top;
      const jumpHeight = height / 0.75;
      const difference = height - jumpHeight;
      top = top - difference;
    }

    const isWithinBounds = (coord: number, topBound: number, bottomBound: number) =>
      coord > topBound && coord < bottomBound;

    return (
      isWithinBounds(top, objectTop, objectBottom) ||
      isWithinBounds(bottom, objectTop, objectBottom) ||
      isWithinBounds(objectTop, top, bottom) ||
      isWithinBounds(objectBottom, top, bottom)
    );
  };

  /**
   * Update x-coordinate for positioning and horizontal bounds for collision detection.
   *
   * @param deltaX - Change in X position that mega man is moving.
   */
  const updateHorizontalBounds = (deltaX: number) => {
    transform.updateX(deltaX);
    bounds.value.left += deltaX;
    bounds.value.right += deltaX;
  };

  /**
   * Update the y-coordinate for positioning and vertical bounds for collision detection.
   *
   * @param deltaY - Change in Y position that mega man is moving.
   */
  const updateVerticalBounds = (deltaY: number) => {
    transform.updateY(deltaY);
    bounds.value.top += deltaY;
    bounds.value.bottom += deltaY;
  };

  /**
   * Update bounds in global context to determine collisions.
   *
   * Only to be used during resize event and constructor to prevent constant refresh of the document.
   */
  const updateCollisionBounds = () => {
    updateBounds(element, bounds.value);
  };

  /**
   * Checks if there is a collision, getting the distance to the object to collide with. If there is,
   * move to the object, otherwise move using `deltaX`.
   *
   * @param deltaX - Change in X position that mega man is attempting to move.
   */
  const attemptUpdateHorizontalBounds = (deltaX: number, isAttemptingSlide: boolean = false) => {
    const newLeft = bounds.value.left + deltaX;
    const newRight = bounds.value.right + deltaX;

    const collisionDistance = getHorizontalCollision(isAttemptingSlide, newLeft, newRight);

    updateHorizontalBounds(!Number.isNaN(collisionDistance) ? collisionDistance : deltaX);
  };

  /**
   * Checks if there is a collision, getting the distance to the object to collide with. If there is,
   * move to the object, otherwise move using `deltaY`.
   *
   * @param deltaY - Change in Y position that mega man is attempting to move.
   */
  const attemptUpdateVerticalBounds = (deltaY: number) => {
    const newTop = bounds.value.top + deltaY;
    const newBottom = bounds.value.bottom + deltaY;

    const collisionDistance =
      deltaY < 0
        ? getTopCollision(newTop, newBottom)
        : deltaY > 0
          ? getGroundCollision(newBottom)
          : 0;

    updateVerticalBounds(!Number.isNaN(collisionDistance) ? collisionDistance : deltaY);
  };

  return {
    bounds,
    checkHorizontalCollision,
    checkHitCeiling,
    checkOnGround,
    checkWithinHorizontalBounds,
    checkWithinVerticalBounds,
    updateHorizontalBounds,
    updateVerticalBounds,
    updateCollisionBounds,
    attemptUpdateHorizontalBounds,
    attemptUpdateVerticalBounds,
  };
};
