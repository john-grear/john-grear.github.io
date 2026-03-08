import { Ref, computed, ref, watch } from 'vue';

export type MegaManAnimation = ReturnType<typeof useMegaManAnimation>;

export const useMegaManAnimation = (
  element: HTMLElement,
  spawning: Ref<boolean>,
  spawned: Ref<boolean>,
  walking: Ref<boolean>,
  sliding: Ref<boolean>,
  jumping: Ref<boolean>,
  attacking: Ref<boolean>
) => {
  // Spawn Constants
  const afterSpawnDelay = 300; // ms before spawning/spawned set to false

  // Idle Constants
  const maxIdleState = 150;
  const maxIdleFrames = 10;

  // Attack Constants
  const attackAnimationTime = 250;

  const style = element.style;

  const activeStates = computed(() => ({
    spawn: spawning.value,
    walk: walking.value,
    jump: jumping.value,
    slide: sliding.value,
    attack: attacking.value,
  }));

  const idleState = ref(0);
  watch(idleState, (value) => {
    if (value >= maxIdleState + maxIdleFrames) idleState.value = 0;
  });

  const attackTimeout = ref<NodeJS.Timeout | null>();

  const idle = computed(() => !Object.values(activeStates.value).some((state) => state));
  const blinking = computed(() => idle.value && idleState.value > maxIdleState);

  /**
   * Update horizontal position on screen
   *
   * @param {number} xCoordinate
   */
  const updateX = (xCoordinate: number) => {
    style.setProperty('--positionX', `${xCoordinate}px`);
  };

  /**
   * Update vertical position on screen
   *
   * @param {number} yCoordinate
   */
  const updateY = (yCoordinate: number) => {
    style.setProperty('--positionY', `${yCoordinate}px`);
  };

  /**
   * Update the direction property to flip Mega Man's sprite / animation
   *
   * @param {number} direction - 1 = right, -1 = left
   */
  const updateDirection = (direction: number = 1) => {
    style.setProperty('--direction', direction.toString());
  };

  /**
   * Update visibility value to hide Mega Man during spawn animation
   *
   * @param {boolean} disable - Set hidden if true, visible if false
   */
  const updateVisibility = (disable: boolean = false) => {
    style.visibility = disable ? 'hidden' : 'visible';
  };

  /**
   * Trigger the spawn animation by setting spawned true, then set a timer to set both spawning and spawned to false.
   */
  const triggerSpawnAnimation = () => {
    spawned.value = true;

    setTimeout(() => {
      spawning.value = false;
      spawned.value = false;
    }, afterSpawnDelay);
  };

  /**
   * Update the idle animation state.
   */
  const updateIdle = () => {
    if (!idle.value) return;

    ++idleState.value;
  };

  // Watchers for slide and attack states to cancel attack animation

  watch(
    () => activeStates.value.slide,
    (value) => {
      if (!value) return;

      attacking.value = false;
    }
  );

  watch(
    () => activeStates.value.attack,
    (value) => {
      if (attackTimeout.value) clearTimeout(attackTimeout.value);

      if (!value) return;

      // Wait before disabling attack animation
      attackTimeout.value = setTimeout(() => (attacking.value = false), attackAnimationTime);
    }
  );

  return {
    blinking,
    updateX,
    updateY,
    updateDirection,
    updateVisibility,
    triggerSpawnAnimation,
    updateIdle,
  };
};
