import { computed, ref } from 'vue';

import { useBounds } from './useBounds';
import { useBullets } from './useBullet';
import { useDeathParticles } from './useDeathParticle';
import { useInput } from './useInput';
import { MegaManAnimation, useMegaManAnimation } from './useMegaManAnimation';
import { MegaManCollision, useMegaManCollision } from './useMegaManCollision';
import { MegaManTransform, useMegaManTransform } from './useMegaManTransform';
import { useTime } from './useTime';
import { useWindow } from './useWindow';

const { createBounds, updateBounds } = useBounds();
const { activeKeys, resetActiveKeys } = useInput();
const { deltaTime } = useTime();
const { isOffScreen, resizeWindow } = useWindow();

export type MegaMan = ReturnType<typeof useMegaMan>;

// constants
export const spawnSpeed = 12;
export const respawnTime = 5000;
export const walkingSpeed = 500;
export const slideSpeed = 650;
export const slideTimeLimit = 300;
export const jumpingSpeed = 650;
export const jumpTimeLimit = 300;
export const gravity = 900;
export const minChargeValue = 250;
export const lowChargeValue = 500;
export const maxChargeValue = 1000;
export const chargeIntervalRate = 20 / 1000;
export const chargeRate = 2250;
export const horizontalCollisionDistance = 5; // TODO: Trying to get this to be as small as possible so collisions are tighter
export const verticalCollisionDistance = 10;

export const useMegaMan = () => {
  // reactive state
  const spawned = ref(false);
  const walking = ref(false);
  const slideLocked = ref(false);
  const sliding = ref(false);
  const slideTime = ref(0);
  const jumpButtonReleased = ref(false);
  const jumping = ref(false);
  const jumpTime = ref(0);
  const grounded = ref(false);
  const chargeInterval = ref(0);
  const charge = ref(0);
  const charging = ref(false);

  const element = ref<HTMLElement | null>();
  const spawnElement = ref<HTMLElement | null>();

  const bounds = createBounds();

  const bullets = useBullets(bounds);
  const deathParticles = useDeathParticles(bounds);

  // DOM elements
  element.value = document.getElementById('mega-man') as HTMLElement | null;
  spawnElement.value = document.getElementById('spawn') as HTMLElement | null;

  if (!element.value) throw Error('Mega Man not created.');
  if (!spawnElement.value) throw Error('No spawn point to spawn Mega Man.');

  // controllers
  const animation: MegaManAnimation = useMegaManAnimation(element.value);
  const transform: MegaManTransform = useMegaManTransform(element.value, animation);
  const collision: MegaManCollision = useMegaManCollision(element.value, bounds, transform);

  animation.updateVisibility();
  collision.updateCollisionBounds();

  window.addEventListener('resize', () => {
    resetActiveKeys();

    resizeWindow(horizontalCollisionDistance, verticalCollisionDistance);

    if (!element.value) return;

    // Update bounds after window resize
    updateBounds(element.value, bounds);

    if (!spawned) return;

    // Kill mega man if off screen, otherwise set into fall state
    // TODO: Need to check if there is even possible ground below him to stop him from falling forever
    // or have some form of death plane
    if (isOffScreen(bounds)) {
      die();
    } else {
      grounded.value = false;
      applyGravity();
      enableFalling();
    }

    resetActiveKeys();
  });

  /**
   * Shortcut for coordinate access
   */
  const coords = computed(() => transform?.coords);

  /**
   * Shortcut for direction access
   */
  const direction = computed(() => transform?.direction.value);

  /**
   * Move Mega Man in spawn noodle animation down until they reach spawn area,
   * then update the spawn animation until time is up, and disable spawn animation
   */
  const spawn = () => {
    if (!spawnElement.value) throw Error('Cannot spawn Mega Man.');

    const rect = spawnElement.value.getBoundingClientRect();
    const screenX = -bounds.left + rect.x;
    const screenY = window.screenY + rect.bottom;

    collision.updateHorizontalBounds(screenX);
    collision.updateVerticalBounds(-bounds.bottom);

    animation.enableSpawn();
    animation.updateVisibility();

    const updatePosition = () => {
      if (bounds.bottom < screenY) {
        collision.updateVerticalBounds(spawnSpeed);
        requestAnimationFrame(updatePosition);
      } else {
        triggerSpawnAnimation();
      }
    };

    requestAnimationFrame(updatePosition);
  };

  /**
   * Triggers spawn animation and sets spawned property to true once the animation completes.
   * It should be called after Mega Man has reached the correct spawn position
   */
  const triggerSpawnAnimation = () => {
    animation.updateSpawn(() => {
      spawned.value = true;
    });
  };

  /**
   * Disable functionality and visibility, spawn death particles, and set a timer to respawn
   */
  const die = () => {
    spawned.value = false;
    animation.updateVisibility(true);

    deathParticles.spawnDeathParticles();

    setRespawnTimer();
  };

  /**
   * Set timer to respawn Mega Man, checking if Mega Man can fit on screen before spawning
   * If still off screen, reattempt every 0.5 second after that
   * TODO: Detect window resizing / moving and restart timer.
   *
   * @param {number} [newRespawnTime=respawnTime] - Respawn time to use.
   */
  const setRespawnTimer = (newRespawnTime: number = respawnTime) => {
    setTimeout(() => {
      if (isOffScreen(bounds)) {
        setRespawnTimer(500);
        return;
      }

      collision.updateCollisionBounds();
      animation.updateVisibility();
      spawn();
    }, newRespawnTime);
  };

  /**
   * Main control function that runs every frame to handle all functionality
   */
  const update = () => {
    if (!spawned.value) return;

    walk();
    slide();
    jump();
    applyGravity();
    buildUpCharge();
  };

  /**
   * Walk left or right, check for collisions, and update direction, horizontal position, and animation
   *
   * Variables update translate call in mega-man.css
   */
  const walk = () => {
    const leftPressed = activeKeys.left;
    const rightPressed = activeKeys.right;

    if ((!leftPressed && !rightPressed) || (leftPressed && rightPressed)) {
      if (walking.value) {
        animation.updateWalk(true);
        walking.value = false;
      }
      return;
    }

    if (sliding.value) return;

    walking.value = true;
    transform.updateDirection(leftPressed);
    animation.updateWalk();

    if (collision.checkHorizontalCollision()) return;

    if (direction.value === undefined) return;

    const velocity = walkingSpeed * direction.value * deltaTime.value;
    collision.updateHorizontalBounds(velocity);

    if (!jumping.value && !collision.checkOnGround()) {
      disableGravity();
      enableFalling();
    }
  };

  /**
   * Attempt to trigger a slide if not already sliding, otherwise continue sliding
   */
  const slide = () => {
    if (sliding.value) {
      updateSlide();
    } else {
      triggerSlide();
    }
  };

  /**
   * First attempt to unlock the slide if buttons are released, then attempt to initiate a slide if
   * the buttons were released before, and currently on the ground, pressing both down and jump
   */
  const triggerSlide = () => {
    unlockSlide();
    if (slideLocked.value) return;

    if (grounded.value && activeKeys.down && activeKeys.jump) {
      sliding.value = true;
      slideLocked.value = true;
      slideTime.value = 0;
      animation.updateSlide();
      updateSlide();
    }
  };

  /**
   * Slide in the direction facing at a slightly faster speed than walking, check for collisions,
   * and horizontal position and animation
   */
  const updateSlide = () => {
    unlockSlide();
    slideTime.value += slideSpeed * deltaTime.value;

    if (slideTime.value >= slideTimeLimit) {
      disableSlide();
      return;
    }

    if (collision.checkHorizontalCollision()) {
      disableSlide();
      return;
    }

    if (direction.value === undefined) return;

    const velocity = slideSpeed * direction.value * deltaTime.value;
    collision.updateHorizontalBounds(velocity);

    if (!collision.checkOnGround()) {
      disableGravity();
      disableSlide();
      enableFalling();
      return;
    }

    animation.updateSlide();
  };

  /**
   * Allows Mega Man to slide again only when both the down and jump buttons are released or
   * one button is released, but the time has been reset, meaning the slide was completed
   */
  const unlockSlide = () => {
    const downButtonPressed = activeKeys.down;
    const jumpButtonPressed = activeKeys.jump;
    const bothButtonsReleased = !downButtonPressed && !jumpButtonPressed;
    const timeWasReset = slideTime.value === 0;

    if (bothButtonsReleased || (!jumpButtonPressed && timeWasReset)) {
      slideLocked.value = false;
    }
  };

  /**
   * Reset slide conditions and animation
   */
  const disableSlide = () => {
    animation.updateSlide(true);
    sliding.value = false;
    slideTime.value = 0;
  };

  /**
   * Jump, check for collisions, and update vertical position and animation
   */
  const jump = () => {
    if (!activeKeys.jump) {
      if (jumping.value) jumping.value = false;
      jumpButtonReleased.value = true;
      return;
    }

    if (!jumping.value && jumpButtonReleased.value && grounded.value) enableJumping();
    if (!jumping.value && !grounded.value) return;

    if (collision.checkHitCeiling() || jumpTime.value >= jumpTimeLimit) {
      jumping.value = false;
      return;
    }

    const velocity = jumpingSpeed * deltaTime.value;
    jumpTime.value += velocity;
    collision.updateVerticalBounds(-velocity);
    grounded.value = false;
  };

  /**
   * Set jump conditions and animation
   */
  const enableJumping = () => {
    if (activeKeys.down || slideLocked.value) return;

    if (sliding.value) {
      animation.updateSlide(true);
      sliding.value = false;
      slideTime.value = 0;
    }

    enableFalling();
    jumping.value = true;
    jumpButtonReleased.value = false;
  };

  /**
   * Set fall conditions and animation
   */
  const enableFalling = () => {
    grounded.value = false;
    slideLocked.value = true;
    animation.updateJump();
    animation.updateWalk(true);
    animation.updateSlide(true);
    animation.updateAttack(true);
  };

  /**
   * Fall until ground is reached
   */
  const applyGravity = () => {
    if (jumping.value || grounded.value) return;

    if (collision.checkOnGround()) {
      disableGravity();
      return;
    }

    const velocity = gravity * deltaTime.value;
    collision.updateVerticalBounds(velocity);
  };

  /**
   * Reset grounded conditions and disable jump animation
   */
  const disableGravity = () => {
    jumping.value = false;
    grounded.value = true;
    jumpTime.value = 0;
    animation.updateJump(true);
  };

  /**
   * Update attack animation, shoot a bullet, and reset charge
   */
  const attack = (force = false) => {
    if (!element || sliding.value) return;

    charging.value = force;
    if (charge.value < minChargeValue && !force) return;

    if (direction.value === undefined) return;

    animation.updateAttack();
    bullets.createBullet(charge.value, direction.value, bounds);
    charge.value = 0;
  };

  /**
   * Increment charge for Mega Man based on attack button duration
   */
  const buildUpCharge = () => {
    if (!activeKeys.attack) {
      if (charging.value) attack();
      return;
    }

    if (!charging.value) attack(true);
    charging.value = true;

    const deltaTimeState = deltaTime.value;
    chargeInterval.value += deltaTimeState;

    if (chargeInterval.value < chargeIntervalRate) return;

    chargeInterval.value = 0;
    charge.value += chargeRate * deltaTimeState;
    animation.updateCharge(charge.value);
  };

  return {
    bounds,
    spawned,
    walking,
    sliding,
    jumping,
    grounded,
    charge,
    charging,
    coords,
    direction,
    lowChargeValue,
    minChargeValue,
    maxChargeValue,
    horizontalCollisionDistance,
    verticalCollisionDistance,
    spawn,
    triggerSpawnAnimation,
    die,
    setRespawnTimer,
    update,
    walk,
    slide,
    triggerSlide,
    updateSlide,
    unlockSlide,
    disableSlide,
    jump,
    enableJumping,
    enableFalling,
    applyGravity,
    disableGravity,
    attack,
    buildUpCharge,
  };
};
