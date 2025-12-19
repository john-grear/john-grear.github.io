export default class CollisionObject {
  element: HTMLElement;

  top = 0;
  bottom = 0;
  left = 0;
  right = 0;

  constructor(element: HTMLElement) {
    this.element = element;
    this.updateBounds();
  }

  /**
   * Update position in global context for use with collisions
   *
   * Only to be used during resize event and constructor to prevent constant refresh of the document
   */
  updateBounds() {
    const rect = this.element.getBoundingClientRect();
    this.top = rect.top;
    this.bottom = rect.bottom;
    this.left = rect.left;
    this.right = rect.right;
  }
}
