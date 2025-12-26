export default class DeathParticle {
  element: HTMLElement | undefined = undefined;
  boundingClientRect: DOMRect | undefined = undefined;

  vectorX = 0;
  vectorY = 0;

  angle = 0;
  initialDistance = 0;
  distance = 0;

  framesMoved = 0;
  time = 0;

  disable = false;

  static list: DeathParticle[] = [];
  static movingSpeed = 1;
  static maxFrames = 2000;
  static offsetParticleTimer = 50;
  static secondParticleOffset = 300;
  static updateBoundsFrame = 5;

  static container: HTMLElement | Element | null | undefined = undefined;

  /**
   * Constructs a new DeathParticle
   *
   * @param {DOMRect} boundingClientRect - To position correctly in setPosition
   * @param {number} angle - Multiple of 45 degrees
   * @param {number} initialDistance - Half are to be offset from the initial ring of particles
   */
  constructor(boundingClientRect: DOMRect, angle: number, initialDistance: number) {
    this.boundingClientRect = boundingClientRect;
    this.angle = angle;
    this.initialDistance = initialDistance;
    this.distance = initialDistance * DeathParticle.secondParticleOffset;

    // Disable movement and start timer for secondary ring of particles
    this.disable = initialDistance > 0;

    this.createHtmlElement();
    this.setPosition();
    this.setVector();
  }

  /**
   * Create a new HTMLDivElement death-particle
   */
  createHtmlElement() {
    this.element = document.createElement('div');
    this.element.classList.add('death-particle');
    this.element.classList.add('spread');

    // If the container doesn't exist, create it and add it to the body
    if (!DeathParticle.container) {
      // Creates container to stop scroll bar from appearing when particles move off screen
      DeathParticle.container = document.querySelector('.particle-container');
      DeathParticle.container = document.createElement('div');
      DeathParticle.container.classList.add('particle-container');
      document.body.appendChild(DeathParticle.container);
    }

    // Append the particle to the container
    DeathParticle.container.appendChild(this.element);

    DeathParticle.list.push(this);
  }

  /**
   * Position the particles on Mega Man
   */
  setPosition() {
    if (!this.element || !this.boundingClientRect) return;

    // Calculate position relative to Mega Man
    const relativeTop =
      (this.boundingClientRect.top + this.boundingClientRect.bottom) / 2 -
      this.element.offsetHeight / 2;
    const relativeLeft =
      (this.boundingClientRect.left + this.boundingClientRect.right) / 2 -
      this.element.offsetWidth / 2;

    // Position particle
    this.element.style.left = `${relativeLeft}px`;
    this.element.style.top = `${relativeTop}px`;
  }

  /**
   * Calculate vectorX and vectorY using the angle
   */
  setVector() {
    const angleInRadians = this.angle * (Math.PI / 180);

    // Set the x and y components based on the angle
    this.vectorX = Math.cos(angleInRadians);
    this.vectorY = Math.sin(angleInRadians);

    // Normalize the vector to ensure consistent speed in all directions
    const magnitude = Math.sqrt(this.vectorX ** 2 + this.vectorY ** 2);
    this.vectorX /= magnitude;
    this.vectorY /= magnitude;
  }

  /**
   * Main control function that runs every frame to handle all functionality
   */
  update() {
    if (this.disable) {
      this.updateTimer();
      return;
    }

    this.move();
  }

  /**
   * Wait until time has reached offsetParticleTimer to give an appropriate offset from the initial ring
   */
  updateTimer() {
    if (!this.disable) return;

    if (this.initialDistance > 0) {
      if (++this.time >= DeathParticle.offsetParticleTimer) {
        this.disable = false;
      }
    }
  }

  /**
   * Start animation to move the death particle linearly in a circle shape
   */
  move() {
    if (!this.element) return;

    // Update position
    this.distance += DeathParticle.movingSpeed;
    this.element.style.setProperty('--positionX', `${this.distance * this.vectorX}px`);
    this.element.style.setProperty('--positionY', `${this.distance * this.vectorY}px`);

    // Check if bullet hits the edge of the screen or moves more than maxFrames
    if (++this.framesMoved >= DeathParticle.maxFrames - this.time) {
      this.delete();
    }
  }

  /**
   * Remove death particle from HTML Doc and static list
   */
  delete() {
    if (!this.element) return;

    this.element.remove();
    DeathParticle.list.splice(DeathParticle.list.indexOf(this), 1);
  }

  /**
   * Deletes all death particles in the static list by first deleting the elements then clearing the list.
   *
   * NOTE: Does not use the delete function since the list is splicing too soon and leaves strand
   * death particles occasionally.
   */
  static deleteAll() {
    DeathParticle.list.forEach((particle: DeathParticle) => particle.element?.remove());
    DeathParticle.list = [];
  }
}
