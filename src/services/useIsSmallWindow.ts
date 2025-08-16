import { useWindowSize } from '@vueuse/core';

import { computed } from 'vue';

/**
 * Compares the window width (px) to the threshold (px) to see if the width is smaller.
 * Useful for anything that tailwind can't handle changes in like v-if/else.
 *
 * @param threshold - Width in pixels before the screen is considered small.
 * @returns `true` if the window width is smaller than threshold, otherwise `false`.
 */
export function useIsSmallWindow(threshold = 1200) {
  const { width } = useWindowSize();
  const isSmallWindow = computed(() => width.value < threshold);

  return { isSmallWindow };
}
