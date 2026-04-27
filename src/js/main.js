import { Dropzone } from '../components/dropzone/dropzone.js';
import { EmptyScreen } from '../components/emptyScreen/emptyScreen.js';
import { Menu } from '../components/menu/menu.js';
import { Tokens } from '../components/tokens/tokens.js';
import { ScannerButton } from '../components/scannerButton/scannerButton.js';
import { getStoredTokens, saveTokens } from './storage.js';

/**
 * Main content wrapper element.
 * @type {HTMLElement}
 */
const wrapper = document.querySelector('.main');

/**
 * Container element for the scanner button (mobile only).
 * @type {HTMLElement}
 */
const scannerButtonContainer = document.querySelector('.scannerButton');

/**
 * Current operating system type from Tauri OS plugin.
 * @type {string}
 */
const osType = window.__TAURI_PLUGIN_OS__.type();

/**
 * Flag indicating if the app is running on a mobile platform.
 * @type {boolean}
 */
const isMobile = osType === 'android' || osType === 'ios';

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

// Initialize platform-specific UI
if (isMobile) {
  document.documentElement.classList.add('mobile');
  new ScannerButton(scannerButtonContainer, refreshTokensDisplay);
} else {
  new Menu();
}

// Initialize the main application
getStoredTokens().then((tokens) => {
  if (!isMobile) {
    new Dropzone(document.body, tokens, saveTokens);
  }

  if (tokens.length === 0) {
    return EmptyScreen(wrapper);
  }

  Tokens(wrapper, tokens);
});
