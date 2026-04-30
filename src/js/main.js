import { Dropzone } from '../components/desktop/dropzone/dropzone.js';
import { EmptyScreen } from '../components/common/emptyScreen/emptyScreen.js';
import { Menu } from '../components/desktop/menu/menu.js';
import { Tokens } from '../components/common/tokens/tokens.js';
import { MobileMenu } from '../components/mobile/mobileMenu/mobileMenu.js';
import { getStoredTokens, saveTokens } from './storage.js';
import { registerExportHotkey } from './export.js';
import { registerImportHotkey } from './import.js';

import { isMobile, injectCSS } from './utils.js';

/**
 * Main content wrapper element.
 * @type {HTMLElement}
 */
const wrapper = document.querySelector('.main');

/**
 * Container element for the mobile menu (mobile only).
 * @type {HTMLElement}
 */
const mobileMenuContainer = document.querySelector('.mobile-menu');

/**
 * Refreshes the tokens display by clearing the wrapper and re-rendering.
 * Fetches tokens from storage and renders either EmptyScreen or Tokens component.
 *
 * @returns {void}
 */
const refreshTokensDisplay = () => {
  getStoredTokens().then((tokens) => {
    // Clear current content
    wrapper.innerHTML = '';

    if (tokens.length === 0) {
      return EmptyScreen(wrapper);
    }

    Tokens(wrapper, tokens);
  });
};

// Initialize platform-specific UI and load platform-specific CSS
if (isMobile) {
  document.documentElement.classList.add('mobile');
  injectCSS('/components/mobile/mobileMenu/mobileMenu.css');
  injectCSS('/components/mobile/scannerButton/scannerButton.css');
  new MobileMenu(mobileMenuContainer, refreshTokensDisplay);
} else {
  injectCSS('/components/desktop/menu/menu.css');
  injectCSS('/components/desktop/dropzone/dropzone.css');
  new Menu();
}

// Initialize the main application
getStoredTokens().then((tokens) => {
  if (!isMobile) {
    const wrapper = document.body;
    new Dropzone(wrapper, tokens, saveTokens);
    registerExportHotkey(wrapper, tokens);
    registerImportHotkey(wrapper, tokens, saveTokens);
  }

  if (tokens.length === 0) {
    return EmptyScreen(wrapper);
  }

  Tokens(wrapper, tokens);
});
