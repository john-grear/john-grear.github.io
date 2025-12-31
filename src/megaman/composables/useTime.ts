import { ref } from 'vue';

/**
 * Composable for tracking frame delta time.
 */
const lastTime = ref(performance.now());
const deltaTime = ref(0);

export const useTime = () => {
  /**
   * Calculate deltaTime every frame.
   */
  const update = () => {
    const currentTime = performance.now();
    deltaTime.value = (currentTime - lastTime.value) / 1000;
    lastTime.value = currentTime;
  };

  return {
    lastTime,
    deltaTime,
    update,
  };
};
