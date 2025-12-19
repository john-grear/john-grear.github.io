export default class Bounds {
  left = 0;
  right = 0;
  top = 0;
  bottom = 0;

  /**
   * Updates the bounds using the element's new bounds.
   *
   * NOTE: Should only be used on things like window resizing since this is does a refresh.
   *
   * @param element - `HTMLElement` to get the new bounds of.
   */
  update(element: HTMLElement | null) {
    if (!element) return;

    const rect = element.getBoundingClientRect();
    if (!rect) return;

    this.left = rect.left;
    this.right = rect.right;
    this.top = rect.top;
    this.bottom = rect.bottom;
  }
}
