import { tinykeys } from '../../../js/tinykeys.module.js';

const appExit = () => {
  window.__TAURI__.process.exit();
};

const appMinimize = () => {
  window.__TAURI__.app.hide();
};

/**
 * Desktop custom menu bar with traffic-light buttons and keyboard shortcuts.
 */
export class Menu {
  wrapper = null;
  titleRef = null;

  constructor() {
    this.wrapper = document.getElementById('menu');
    this.wrapper.setAttribute('data-tauri-drag-region', true);

    tinykeys(document.body, {
      'Meta+Q': appExit,
      'Control+Q': appExit,
    });

    this.render();

    this.closeButtonRef.addEventListener('click', appExit, { once: true });
    this.minimizeButtonRef.addEventListener('click', appMinimize);
  }

  /**
   * Renders the menu bar HTML into the wrapper.
   */
  render() {
    this.wrapper.innerHTML = `
      <div class="menu__buttonsWrapper">
        <div class="menu__button menu__button--close"></div>
        <div class="menu__button menu__button--minimize"></div>
      </div>
      <div class="menu__title">
        <img src="img/otphub.svg" class="menu__logo" />
      </div>
      `;

    this.titleRef = this.wrapper.querySelector('.menu__title');
    this.closeButtonRef = this.wrapper.querySelector('.menu__button--close');
    this.minimizeButtonRef = this.wrapper.querySelector('.menu__button--minimize');
  }

  /**
   * Updates the menu title text.
   * @param {string} newTitle - The new title to display.
   */
  setTitle(newTitle) {
    this.titleRef.innerText = newTitle;
  }
}
