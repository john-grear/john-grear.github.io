import { Bounds } from './useBounds';

const list: CollisionObject[] = [];

export type CollisionObject = {
  element: HTMLElement;
  bounds: Bounds;
};

export const useCollisionObjects = () => {
  /**
   * Creates a collision object for the element and adds it to the list.
   *
   * @param element - Element to use the bounding client rect.
   */
  const createCollisionObject = (element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    const newCollisionObject: CollisionObject = {
      element,
      bounds: {
        top: rect.top,
        bottom: rect.bottom,
        left: rect.left,
        right: rect.right,
      },
    };

    list.push(newCollisionObject);
  };

  /**
   * Update position in global context for use with collisions
   *
   * Only to be used during resize event and constructor to prevent constant refresh of the document
   */
  const update = (collisionObject: CollisionObject) => {
    const rect = collisionObject.element.getBoundingClientRect();
    collisionObject.bounds.top = rect.top;
    collisionObject.bounds.bottom = rect.bottom;
    collisionObject.bounds.left = rect.left;
    collisionObject.bounds.right = rect.right;
  };

  return { list, createCollisionObject, update };
};
