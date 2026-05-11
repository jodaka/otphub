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
        <button class="mobile-menu__toggle">
          <svg class="mobile-menu__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10">
            <path class="icon__line-top" />
            <path class="icon__line-mid" />
            <path class="icon__line-bot" />
          </svg>
        </button>
        <img src="img/otphub.svg" class="mobile-menu__logo" />
      <div class="mobile-menu__panel">
        <div class="mobile-menu__list">
          <button class="mobile-menu__button scannerButton">
            <span class="mobile-menu__buttonIcon">
              <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24"><path d="M8 21H4a1 1 0 0 1-1-1v-4a1 1 0 0 0-2 0v4a3 3 0 0 0 3 3h4a1 1 0 0 0 0-2m14-6a1 1 0 0 0-1 1v4a1 1 0 0 1-1 1h-4a1 1 0 0 0 0 2h4a3 3 0 0 0 3-3v-4a1 1 0 0 0-1-1M20 1h-4a1 1 0 0 0 0 2h4a1 1 0 0 1 1 1v4a1 1 0 0 0 2 0V4a3 3 0 0 0-3-3M2 9a1 1 0 0 0 1-1V4a1 1 0 0 1 1-1h4a1 1 0 0 0 0-2H4a3 3 0 0 0-3 3v4a1 1 0 0 0 1 1m8-4H6a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1M9 9H7V7h2Zm5 2h4a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1m1-4h2v2h-2Zm-5 6H6a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1m-1 4H7v-2h2Zm5-1a1 1 0 0 0 1-1 1 1 0 0 0 0-2h-1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1m4-3a1 1 0 0 0-1 1v3a1 1 0 0 0 0 2h1a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1m-4 4a1 1 0 1 0 1 1 1 1 0 0 0-1-1"/></svg>
            </span>Add QR Code
          </button>
          <button class="mobile-menu__button backupButton">
<span class="mobile-menu__buttonIcon">
<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24"><path stroke="#000" stroke-linecap="round" d="M12 7.5H7A1.5 1.5 0 0 0 5.5 9v8A1.5 1.5 0 0 0 7 18.5h8a1.5 1.5 0 0 0 1.5-1.5v-5"/><path stroke="#000" stroke-linecap="round" stroke-linejoin="round" d="m12.5 11.5 6.364-6.364M14.5 4.5h5v5"/></svg>
          </span>Backup data</button>
          <button class="mobile-menu__button importButton">
            <span class="mobile-menu__buttonIcon">
              <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24">
              <path d="M15 13h-4V9" stroke-linecap="round" style="fill:none;stroke:#000;stroke-linejoin:round;stroke-width:2"/><path d="M21 3 11 13M19 13.89V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h6.11" stroke-width="2" style="stroke-linecap:round;stroke-linejoin:round;"/></svg>
            </span>Import data</button>
        </div>
      </div>
    `;

    this.toggleButton = this.container.querySelector('.mobile-menu__toggle');
    this.panel = this.container.querySelector('.mobile-menu__panel');
    this.scannerContainer = this.container.querySelector('.scannerButton');

    this.scannerButton = new ScannerButton(this.scannerContainer, this.refreshTokensCallback);
  }

  attachEvents() {
    this.toggleButton.addEventListener('click', () => {
      this.toggle();
    });
    this.handleBackButton();
  }

  handleBackButton() {
    window.__TAURI__.app.onBackButtonPress(() => {
      if (this.isOpen) {
        this.close();
        return;
      }
    });
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
    this.toggleButton.classList.toggle('pressed', this.isOpen);
  }
}
