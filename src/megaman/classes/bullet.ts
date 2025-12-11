import Bounds from './bounds';
import MegaMan from './mega-man';

export default class Bullet {
  charge = 0;
  direction = 1;
  position = 0;
  megaManBounds: Bounds | undefined = undefined;
  element: HTMLDivElement | undefined = undefined;

  static list: Bullet[] = [];
  static maxBullets = 3;
  static lastBulletTime = 0;
  static shootDelay = 100;

  static movingSpeed = 10;

  static topOffset = 60;
  static rightOffset = 0;
  static leftOffset = -32;

  constructor(charge: number, direction: number, bounds: Bounds) {
    // If too many bullets or shooting too quickly, do nothing
    if (!Bullet.canSpawn()) return;

    // Update bullet spawn limiting values
    Bullet.lastBulletTime = Date.now();

    this.charge = charge;
    this.direction = direction;
    this.megaManBounds = bounds;

    this.createHtmlElement();

    this.setPosition();

    Bullet.list.push(this);
  }

  /**
   * Create a new HTMLDivElement bullet with different sprite set based on the charge held
   */
  createHtmlElement() {
    this.element = document.createElement('div');
    this.element.classList.add('bullet');

    // Add to the page
    document.body.appendChild(this.element);

    // Determine charge of bullet
    if (this.charge >= MegaMan.lowChargeValue && this.charge < MegaMan.maxChargeValue) {
      this.element.classList.add('low-charge');
    } else if (this.charge >= MegaMan.maxChargeValue) {
      this.element.classList.add('max-charge');
    }
  }

  /**
   * Flip and position the bullet based on Mega Man flippped state and position
   */
  setPosition() {
    if (!this.element || !this.megaManBounds) return;

    this.element.style.setProperty('--direction', this.direction.toString());

    // Get the spawn area's position
    const spawnArea = document.querySelector('.spawn');

    // if (!spawnArea) return;

    const spawnAreaRect = spawnArea?.getBoundingClientRect() ?? new Bounds();

    // Calculate position relative to the spawn area and offset from each side of Mega Man
    const relativeTop = this.megaManBounds.top - spawnAreaRect.top + Bullet.topOffset;
    const relativeLeft = this.megaManBounds.left - spawnAreaRect.left + Bullet.leftOffset;
    const relativeRight = this.megaManBounds.right - spawnAreaRect.left + Bullet.rightOffset;

    // Position bullet
    this.element.style.top = `${relativeTop}px`;
    this.element.style.left = this.direction === -1 ? `${relativeLeft}px` : `${relativeRight}px`;
  }

  /**
   * Main control function that runs every frame to handle all functionality
   */
  update() {
    this.move();
  }

  /**
   * Start animation to move the bullet across the screen
   */
  move() {
    if (!this.element) return;

    // Update position
    this.position += Bullet.movingSpeed * this.direction;
    this.element.style.setProperty('--position', `${this.position}px`);

    // Check if bullet hits the edge of the screen
    const bulletRect = this.element.getBoundingClientRect();
    if (
      (this.direction === 1 && bulletRect.right >= window.innerWidth - 20) ||
      (this.direction === -1 && bulletRect.left <= 20)
    ) {
      this.delete();
      return;
    }
  }

  /**
   * Remove bullet from HTML Doc and static list
   */
  delete() {
    if (!this.element) return;

    this.element.remove();
    Bullet.list.splice(Bullet.list.indexOf(this), 1);
  }

  /**
   * Check to ensure not too many bullets are spawned and bullets are spaced out
   *
   * @returns {boolean}
   */
  static canSpawn(): boolean {
    return (
      Bullet.list.length < Bullet.maxBullets &&
      Date.now() - Bullet.lastBulletTime >= Bullet.shootDelay
    );
  }
}
