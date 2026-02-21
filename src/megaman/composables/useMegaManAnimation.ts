import { reactive, ref } from 'vue';

import { maxChargeValue, minChargeValue } from './useMegaMan';

export type MegaManAnimation = ReturnType<typeof useMegaManAnimation>;

export const useMegaManAnimation = (element: HTMLElement) => {
  type StateType = 'idle' | 'spawn' | 'walk' | 'jump' | 'attack' | 'climb' | 'slide' | 'charge';

  const style = element.style;

  const idle = ref(false);
  const activeStates = reactive({
    spawn: false,
    walk: false,
    jump: false,
    slide: false,
    attack: false,
  });

  const idleState = ref(0);
  const spawnState = ref(0);
  const walkState = ref(0);
  const slideFrames = ref(0);
  const chargeState = ref(0);

  const attackTimeout = ref<NodeJS.Timeout | null>();

  // Idle Constants
  const maxIdleState = 150;
  const maxIdleFrames = 10;

  // Spawn Constants
  const maxSpawnState = 20;
  const spawnFramePause = 10;

  // Walk Constants
  const maxWalkState = 30;
  const walkFramePause = 10;
  const kneeBendFrameLength = 5;
  const kneeBendFrame = 2;
  const startWalkFrame = kneeBendFrame + 1;

  // Attack Constants
  const attackAnimationTime = 250;
  const jumpAndAttackFrame = 1;
  const walkAndAttackFrame = 4;
  const idleAttackFrame = 6;

  // Slide Constants
  const slideFrame = 12;

  // Charge Constants
  const maxChargeState = 40;

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
   * Enable spawn animation state.
   */
  const enableSpawn = () => {
    if (activeStates.spawn) return;

    activeStates.spawn = true;
    spawnState.value = 0;
    element.classList.add('spawn-animation-state');
    element.classList.remove('base-animation-state');
  };

  /**
   * Update the spawn animation state. Handles the 2-frame spawn animation loop until complete
   *
   * @param {Function} onComplete - Callback function executed after the spawn animation completes
   */
  const updateSpawn = (onComplete: () => void) => {
    const adjustedSpawnState = Math.floor(spawnState.value / spawnFramePause) + 1;
    updateStateStyle('spawn', adjustedSpawnState); // 1 - 2

    if (++spawnState.value > maxSpawnState) {
      completeSpawn(onComplete);
      return;
    }

    requestAnimationFrame(() => updateSpawn(onComplete));
  };

  /**
   * Complete the spawn animation and transition to the base animation state
   *
   * @param {Function} onComplete - Callback function executed after the transition
   */
  const completeSpawn = (onComplete: () => void) => {
    activeStates.spawn = false;
    enableBase();
    onComplete();
  };

  /**
   * Enable the base animation state. Resets spawn-related properties and transitions
   * to the base state that handles walking, jumping, attacking, and charging
   */
  const enableBase = () => {
    spawnState.value = 0;
    updateStateStyle('spawn', 0);
    element.classList.remove('spawn-animation-state');
    element.classList.add('base-animation-state');
  };

  /**
   * Start the idle animation if no other states are active.
   */
  const triggerIdle = () => {
    if (checkNotIdle() || idle.value) return;
    idle.value = true;
    updateIdle();
  };

  /**
   * Update the idle animation state.
   */
  const updateIdle = () => {
    if (checkNotIdle()) {
      disableIdle();
      return;
    }

    ++idleState.value;

    if (idleState.value < maxIdleState) {
      requestAnimationFrame(() => updateIdle());
      return;
    }

    checkIdleTimeHasBeenReached();
    checkIdleTimeHasBeenPassed();

    requestAnimationFrame(() => updateIdle());
  };

  /**
   * Check if any animation states are currently active.
   *
   * @returns {boolean}
   */
  const checkNotIdle = (): boolean => {
    return Object.values(activeStates).some((state) => state);
  };

  /**
   * Disable the idle animation.
   */
  const disableIdle = () => {
    idle.value = false;
    updateStateStyle('idle', 0);
  };

  /**
   * Handle the initial idle animation (e.g., blinking) when idle time is reached.
   */
  const checkIdleTimeHasBeenReached = () => {
    if (idleState.value !== maxIdleState) return;

    updateStateStyle('idle', 1);
  };

  /**
   * Handle the completion of the idle animation cycle.
   */
  const checkIdleTimeHasBeenPassed = () => {
    if (idleState.value < maxIdleState + maxIdleFrames) return;

    idleState.value = 0;
    updateStateStyle('idle', 0);
  };

  /**
   * Update the walk state property.
   *
   * @param {boolean} disable
   */
  const updateWalk = (disable: boolean = false) => {
    activeStates.walk = !disable;

    if (activeStates.jump || activeStates.slide) {
      updateStateStyle('walk', 0);
      walkState.value = -kneeBendFrameLength;
      triggerIdle();
      return;
    }

    if (disable) {
      if (walkState.value > 0) {
        walkState.value = -kneeBendFrameLength;
      }

      if (walkState.value < 0) {
        updateStateStyle('walk', kneeBendFrame);
        ++walkState.value;
        updateWalk(true);
      } else {
        updateStateStyle('walk', 0);
        walkState.value = -kneeBendFrameLength;
        triggerIdle();
      }
      return;
    }

    if (walkState.value < 0) {
      updateStateStyle('walk', kneeBendFrame);
      ++walkState.value;
    } else {
      const currentWalkFrame = Math.floor(walkState.value / walkFramePause);

      if (attackTimeout.value) {
        updateStateStyle('attack', walkAndAttackFrame); // Walking + attacking
      }

      updateStateStyle('walk', currentWalkFrame + startWalkFrame);

      walkState.value = (walkState.value + 1) % maxWalkState;
    }
  };

  /**
   * Update the jump state property. Stop walking before displaying jump animation
   *
   * @param {boolean} disable - Forcibly sets property to 0 if true
   */
  const updateJump = (disable: boolean = false) => {
    activeStates.jump = !disable;

    if (disable) {
      updateJumpCollisionBox(true);
      triggerIdle();
      return;
    }

    updateWalk(true);
    updateJumpCollisionBox();
  };

  /**
   * Sets / removes the 'jumping' attribute to shift the collision box to the top of the
   * mega man element when jumping and to the bottom when not.
   *
   * @param disable - Forcibly sets property to 'end' if true.
   */
  const updateJumpCollisionBox = (disable: boolean = false) => {
    if (disable) {
      element.removeAttribute('jumping');
      return;
    }

    element.setAttribute('jumping', '1');
  };

  /**
   * Update the slide state property. Stop walking before displaying slide animation
   *
   * @param {boolean} disable - Forcibly sets property to 0 if true
   */
  const updateSlide = (disable: boolean = false) => {
    activeStates.slide = !disable;

    if (disable) {
      updateStateStyle('slide', 0);
      updateSlideCollisionBox(true);
      triggerIdle();
      return;
    }

    // Cancel attack cooldown timer
    if (attackTimeout.value) {
      clearTimeout(attackTimeout.value);
      updateAttack(true);
    }

    updateWalk(true);
    updateStateStyle('slide', slideFrame);
    updateSlideCollisionBox();
  };

  /**
   * Sets / removes the 'sliding' attribute to shrink the collision box to fit
   * under shorter obstacles when sliding.
   *
   * @param disable - Forcibly sets property to 'end' if true.
   */
  const updateSlideCollisionBox = (disable: boolean = false) => {
    if (disable) {
      element.removeAttribute('sliding');
      return;
    }

    element.setAttribute('sliding', '1');
  };

  /**
   * Update the attack state property. Shift walk frame by 4 and jump frame by 1.
   *
   * @param {boolean} disable - Forcibly sets property to 0 if true
   */
  const updateAttack = (disable: boolean = false) => {
    activeStates.attack = !disable;

    if (disable) {
      attackTimeout.value = null;
      updateStateStyle('attack', 0);
      updateCharge(0);
      triggerIdle();
      return;
    }

    if (activeStates.jump) {
      updateStateStyle('attack', jumpAndAttackFrame); // Jumping + attacking
    } else if (activeStates.walk) {
      updateStateStyle('attack', walkAndAttackFrame); // Walking + attacking
    } else {
      updateStateStyle('attack', idleAttackFrame); // Idle, skip over knee bend and idle frames
    }

    // Wait before disabling attack and charge animations
    attackTimeout.value = setTimeout(() => updateAttack(true), attackAnimationTime);
  };

  /**
   * Update the charge state property. Increment chargeState until maxChargeState reached,
   * then reset to 0. Display a 3 frame animation for both min and max charge states
   *
   * @param {number} charge - Value to determine correct charge state
   */
  const updateCharge = (charge: number = 0) => {
    if (charge === 0) {
      chargeState.value = 0;
      updateStateStyle('charge', 0);
      triggerIdle();
      return;
    }

    if (charge < minChargeValue) return;

    chargeState.value = (chargeState.value + 1) % maxChargeState;

    if (charge < maxChargeValue) {
      const nonMaxChargeState = (chargeState.value % 3) + 1;
      updateStateStyle('charge', nonMaxChargeState);
    } else {
      const maxChargeState = (chargeState.value % 3) + 4;
      updateStateStyle('charge', maxChargeState);
    }
  };

  /**
   * Updates the requested state style with the provided value.
   *
   * @param type - Type of state to update.
   * @param value - Number of frames to update the state.
   */
  const updateStateStyle = (type: StateType, value: number) => {
    style.setProperty(`--${type}-state`, value.toString());
  };

  // Initialize spawn state
  enableSpawn();

  return {
    style,
    idle,
    activeStates,
    idleState,
    spawnState,
    walkState,
    slideFrames,
    chargeState,
    updateX,
    updateY,
    updateDirection,
    updateVisibility,
    enableSpawn,
    updateSpawn,
    completeSpawn,
    enableBase,
    triggerIdle,
    updateIdle,
    checkNotIdle,
    disableIdle,
    checkIdleTimeHasBeenReached,
    checkIdleTimeHasBeenPassed,
    updateWalk,
    updateJump,
    updateSlide,
    updateAttack,
    updateCharge,
  };
};
