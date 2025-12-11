import MegaMan from './mega-man';

export default class MegaManAnimationController {
  element: HTMLElement;
  style: CSSStyleDeclaration;

  idle = false;
  activeStates = {
    spawn: false,
    walk: false,
    jump: false,
    slide: false,
    attack: false,
  };

  idleState: number;
  spawnState: number;
  walkState: number;
  slideFrames: number;
  chargeState: number;

  static maxIdleState = 150;
  static maxIdleFrames = 10; // max frames to be idle for

  static maxSpawnState = 20;
  static spawnFramePause = 10; // 30 / 10 = 3 frames over 30 update calls

  static maxWalkState = 30;
  static walkFramePause = 10; // 30 / 10 = 3 frames over 30 update calls
  static kneeBendFrameLength = 5;
  static kneeBendFrame = 2;

  static attackTimeout = 250; // Time (ms) before disabling attack animation

  static maxChargeState = 40;

  /**
   * Initialize the base animation state and default states to 0
   *
   * @param {HTMLElement} element
   */
  constructor(element: HTMLElement) {
    this.element = element;
    this.element.classList.add('spawn-animation-state');
    this.style = this.element.style;

    this.idleState = 0; // 0 - 1
    this.spawnState = 0; // 0 - (maxSpawnState - 1)
    this.walkState = 0; // 0 - (maxWalkState - 1)
    this.slideFrames = 0; // 0 - maxSlideFrames
    this.chargeState = 0; // 0 - (maxChargeState - 1)
  }

  /**
   * Update horizontal position on screen
   *
   * @param {number} xCoordinate
   */
  updateX(xCoordinate: number) {
    this.style.setProperty('--positionX', `${xCoordinate}px`);
  }

  /**
   * Update vertical position on screen
   *
   * @param {number} yCoordinate
   */
  updateY(yCoordinate: number) {
    this.style.setProperty('--positionY', `${yCoordinate}px`);
  }

  /**
   * Update the direction property to flip Mega Man's sprite / animation
   *
   * @param {number} direction - 1 = right, -1 = left
   */
  updateDirection(direction: number = 1) {
    this.style.setProperty('--direction', direction.toString());
  }

  /**
   * Update visibility value to hide Mega Man during spawn animation
   *
   * @param {boolean} disable - Set hidden if true, visible if false
   */
  updateVisibility(disable: boolean = false) {
    this.style.visibility = disable ? 'hidden' : 'visible';
  }

  /**
   * Enable spawn animation state and initiate the spawn sequence
   *
   * @param {Function} onComplete - Callback function executed after the spawn animation completes
   */
  enableSpawn(onComplete: () => void) {
    if (this.activeStates.spawn) return;

    this.activeStates.spawn = true;
    this.spawnState = 0;
    this.element.classList.add('spawn-animation-state');
    this.element.classList.remove('base-animation-state');

    this.updateSpawn(onComplete);
  }

  /**
   * Update the spawn animation state. Handles the 2-frame spawn animation loop until complete
   *
   * @param {Function} onComplete - Callback function executed after the spawn animation completes
   */
  updateSpawn(onComplete: () => void) {
    const adjustedSpawnState =
      Math.floor(this.spawnState / MegaManAnimationController.spawnFramePause) + 1;
    this.style.setProperty('--spawn-state', adjustedSpawnState.toString()); // 1 - 2

    if (++this.spawnState > MegaManAnimationController.maxSpawnState) {
      this.completeSpawn(onComplete);
      return;
    }

    requestAnimationFrame(() => this.updateSpawn(onComplete));
  }

  /**
   * Complete the spawn animation and transition to the base animation state
   *
   * @param {Function} onComplete - Callback function executed after the transition
   */
  completeSpawn(onComplete: () => void) {
    this.activeStates.spawn = false;
    this.enableBase();

    onComplete();
  }

  /**
   * Enable the base animation state. Resets spawn-related properties and transitions
   * to the base state that handles walking, jumping, attacking, and charging
   */
  enableBase() {
    this.spawnState = 0;
    this.style.setProperty('--spawn-state', '0');
    this.element.classList.remove('spawn-animation-state');
    this.element.classList.add('base-animation-state');
  }

  /**
   * Start the idle animation if no other states are active.
   *
   * Checks if any other states in `activeStates` are currently active.
   * If no states are active, the idle animation is triggered by setting
   * `idle` to true and calling `updateIdle`.
   */
  triggerIdle() {
    if (this.checkNotIdle()) return;

    this.idle = true;

    requestAnimationFrame(() => this.updateIdle());
  }

  /**
   * Update the idle animation state.
   *
   * Increments `idleState` every frame until `maxIdleState` is reached.
   * Displays the idle blinking animation when `idleState` reaches or exceeds
   * `maxIdleState`. The function disables idle state if another state becomes active.
   *
   * Recursively call this function at the end if idle was not being disabled.
   * When other animations are disabled, they will disable their variable in the
   * activeStates map and call updateIdle to trigger idle timer again.
   */
  updateIdle() {
    if (this.checkNotIdle()) {
      this.disableIdle();
      return;
    }

    ++this.idleState;

    if (this.idleState < MegaManAnimationController.maxIdleState) {
      requestAnimationFrame(() => this.updateIdle());
      return;
    }

    this.checkIdleTimeHasBeenReached();

    this.checkIdleTimeHasBeenPassed();

    requestAnimationFrame(() => this.updateIdle());
  }

  /**
   * Check if any animation states are currently active.
   *
   * Iterates through `activeStates` to determine if any states are set to true.
   *
   * @returns {boolean} - True if some state in activeStates is active, false otherwise
   */
  checkNotIdle(): boolean {
    return Object.values(this.activeStates).some((state) => state);
  }

  /**
   * Disable the idle animation.
   *
   * Resets `idle` to false and clears the `--idle-state` CSS variable.
   */
  disableIdle() {
    this.idle = false;
    this.style.setProperty('--idle-state', '0');
  }

  /**
   * Handle the initial idle animation (e.g., blinking) when idle time is reached.
   *
   * Sets the `--idle-state` CSS property to 1 when `idleState` equals `maxIdleState`.
   */
  checkIdleTimeHasBeenReached() {
    if (this.idleState === MegaManAnimationController.maxIdleState) {
      this.style.setProperty('--idle-state', '1');
    }
  }

  /**
   * Handle the completion of the idle animation cycle.
   *
   * Resets the idle animation by setting `idleState` back to 0 and clearing
   * the `--idle-state` CSS variable once `idleState` exceeds the sum of
   * `maxIdleState` and `maxIdleFrames`.
   */
  checkIdleTimeHasBeenPassed() {
    if (
      this.idleState >=
      MegaManAnimationController.maxIdleState + MegaManAnimationController.maxIdleFrames
    ) {
      this.idleState = 0;
      this.style.setProperty('--idle-state', '0');
    }
  }

  /**
   * Update the walk state property. Start walkState at the knee bend frame length * -1,
   * incrementing until 0 is reached, which then starts the 3 frame walking animation.
   * Increment walkState until maxWalkState reached, then reset to 0
   *
   * @param {boolean} disable - Forcibly sets property to 0 if true after displaying the knee bend frame
   * after some delay. If jumping, skip knee bend frame
   */
  updateWalk(disable: boolean = false) {
    this.activeStates.walk = !disable;

    // Don't walk if jumping or sliding
    if (this.activeStates.jump || this.activeStates.slide) {
      this.style.setProperty('--walk-state', '0');
      this.walkState = -MegaManAnimationController.kneeBendFrameLength;
      if (!this.idle) this.updateIdle();
      return;
    }

    // Display knee bend frame before disabling
    if (disable) {
      if (this.walkState > 0) {
        this.walkState = -MegaManAnimationController.kneeBendFrameLength;
      }

      if (this.walkState < 0) {
        this.style.setProperty('--walk-state', MegaManAnimationController.kneeBendFrame.toString());
        ++this.walkState;
        requestAnimationFrame(() => this.updateWalk(true));
      } else {
        this.style.setProperty('--walk-state', '0');
        this.walkState = -MegaManAnimationController.kneeBendFrameLength;
        this.updateIdle();
      }
      return;
    }

    if (this.walkState < 0) {
      this.style.setProperty('--walk-state', MegaManAnimationController.kneeBendFrame.toString());
      ++this.walkState;
    } else {
      const currentWalkFrame = Math.floor(
        this.walkState / MegaManAnimationController.walkFramePause
      );
      this.style.setProperty('--walk-state', (currentWalkFrame + 3).toString()); // Skip idle and knee bend frame
      this.walkState = (this.walkState + 1) % MegaManAnimationController.maxWalkState;
    }
  }

  /**
   * Update the jump state property. Stop walking before displaying jump animation
   *
   * @param {boolean} disable - Forcibly sets property to 0 if true
   */
  updateJump(disable: boolean = false) {
    this.activeStates.jump = !disable;

    if (disable) {
      this.style.setProperty('--jump-state', '0');
      if (!this.idle) this.updateIdle();
      return;
    }

    this.updateWalk(true);
    this.style.setProperty('--jump-state', '1');
  }

  /**
   * Update the slide state property. Stop walking before displaying slide animation
   *
   * @param {boolean} disable - Forcibly sets property to 0 if true
   */
  updateSlide(disable: boolean = false) {
    this.activeStates.slide = !disable;

    if (disable) {
      this.style.setProperty('--slide-state', '0');
      if (!this.idle) this.updateIdle();
      return;
    }

    this.updateWalk(true);
    this.style.setProperty('--slide-state', '1');
  }

  /**
   * Update the attack state property. Shift walk frame by 4 and jump frame by 1.
   *
   * @param {boolean} disable - Forcibly sets property to 0 if true
   */
  updateAttack(disable: boolean = false) {
    this.activeStates.attack = !disable;

    if (disable) {
      this.style.setProperty('--attack-state', '0');
      this.updateCharge(0);
      if (!this.idle) this.updateIdle();
      return;
    }

    if (this.activeStates.jump) {
      this.style.setProperty('--attack-state', '1'); // Jumping + attacking
    } else if (this.activeStates.walk) {
      this.style.setProperty('--attack-state', '4'); // Walking + attacking
    } else {
      this.style.setProperty('--attack-state', '6'); // Idle, skip over knee bend and idle frames
    }

    // Wait before disabling attack and charge animations
    setTimeout(() => this.updateAttack(true), MegaManAnimationController.attackTimeout);
  }

  /**
   * Update the charge state property. Increment chargeState until maxChargeState reached,
   * then reset to 0. Display a 3 frame animation for both min and max charge states
   *
   * @param {number} charge - Value to determine correct charge state
   */
  updateCharge(charge: number = 0) {
    if (charge === 0) {
      this.chargeState = 0;
      this.element.style.setProperty('--charge-state', '0');
      if (!this.idle) this.updateIdle();
      return;
    }

    if (charge < MegaMan.minChargeValue) return;

    this.chargeState = (this.chargeState + 1) % MegaManAnimationController.maxChargeState;

    if (charge < MegaMan.maxChargeValue) {
      this.style.setProperty('--charge-state', ((this.chargeState % 3) + 1).toString());
    } else {
      this.style.setProperty('--charge-state', ((this.chargeState % 3) + 4).toString());
    }
  }
}
