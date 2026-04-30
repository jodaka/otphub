import { tinykeys } from '../../js/tinykeys.module.js';

const { process, app } = window.__TAURI__;

const appExit = () => {
  process.exit();
};

const appMinimize = () => {
  app.hide();
};

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
    this.minimizeButtonRef = this.wrapper.querySelector(
      '.menu__button--minimize',
    );
  }

  setTitle(newTitle) {
    this.titleRef.innerText = newTitle;
  }
}
