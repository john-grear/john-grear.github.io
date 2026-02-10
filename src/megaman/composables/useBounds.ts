import { reactive } from 'vue';

export type Bounds = {
  top: number;
  bottom: number;
  left: number;
  right: number;
};

export const useBounds = () => {
  /**
   * Creates a new bounds object to store the bound coordinates.
   *
   * @param {HTMLElement} element - Element to get the bounding client rect from.
   */
  const createBounds = (element?: HTMLElement): Bounds => {
    const newBounds = reactive({
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    });

    if (element) {
      updateBounds(element, newBounds);
    }

    return newBounds;
  };

  /**
   * Updates the bounds using the element's new bounds.
   *
   * NOTE: Should only be used on things like window resizing since this does a refresh.
   *
   * @param {HTMLElement} element - Element to get the bounding client rect from.
   * @param {Bounds} bounds - Bounds to update.
   */
  const updateBounds = (element: HTMLElement | null, bounds: Bounds) => {
    if (!element) return;

    const rect = element.getBoundingClientRect();
    if (!rect) return;

    bounds.top = rect.top;
    bounds.bottom = rect.bottom;
    bounds.left = rect.left;
    bounds.right = rect.right;
  };

  return {
    createBounds,
    updateBounds,
  };
};
