import { ScannerButton } from '../scannerButton/scannerButton.js';

/**
 * Mobile menu component that houses scanner and future buttons.
 * Toggles visibility with a hamburger button.
 */
export class MobileMenu {
  constructor(container, refreshTokensCallback) {
    this.container = container;
    this.refreshTokensCallback = refreshTokensCallback;
    this.isOpen = false;
    this.render();
    this.attachEvents();
  }

  render() {
    this.container.innerHTML = `
      <button class="mobile-menu__toggle" aria-label="Open menu" aria-expanded="false">
        <span class="mobile-menu__hamburger">
          <span></span>
          <span></span>
          <span></span>
        </span>
      </button>
      <div class="mobile-menu__panel">
        <div class="mobile-menu__content">
          <div class="scannerButton"></div>
        </div>
      </div>
    `;

    this.toggleButton = this.container.querySelector('.mobile-menu__toggle');
    this.panel = this.container.querySelector('.mobile-menu__panel');
    this.scannerContainer = this.container.querySelector('.scannerButton');

    // Initialize scanner button inside the menu
    this.scannerButton = new ScannerButton(
      this.scannerContainer,
      this.refreshTokensCallback,
    );
  }

  attachEvents() {
    this.toggleButton.addEventListener('click', () => this.toggle());
  }

  toggle() {
    this.isOpen = !this.isOpen;
    this.updateState();
  }

  open() {
    this.isOpen = true;
    this.updateState();
  }

  close() {
    this.isOpen = false;
    this.updateState();
  }

  updateState() {
    this.container.classList.toggle('mobile-menu--open', this.isOpen);
    this.toggleButton.setAttribute('aria-expanded', this.isOpen.toString());
  }
}
