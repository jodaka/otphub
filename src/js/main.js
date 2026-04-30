import { EmptyScreen } from '../components/common/emptyScreen/emptyScreen.js';
import { Tokens } from '../components/common/tokens/tokens.js';
import { getStoredTokens, saveTokens } from './storage.js';
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

/**
 * Initialize desktop-specific components.
 * @param {Token[]} tokens - The stored tokens.
 */
const initDesktop = async (tokens) => {
  const [
    { Dropzone },
    { Menu },
    { registerExportHotkey },
    { registerImportHotkey },
  ] = await Promise.all([
    import('../components/desktop/dropzone/dropzone.js'),
    import('../components/desktop/menu/menu.js'),
    import('./export.js'),
    import('./import.js'),
  ]);

  injectCSS('/components/desktop/desktop.css');
  new Menu();

  const bodyWrapper = document.body;
  new Dropzone(bodyWrapper, tokens, saveTokens);
  registerExportHotkey(bodyWrapper, tokens);
  registerImportHotkey(bodyWrapper, tokens, saveTokens);
};

/**
 * Initialize mobile-specific components.
 */
const initMobile = async () => {
  document.documentElement.classList.add('mobile');

  const { MobileMenu } = await import(
    '../components/mobile/mobileMenu/mobileMenu.js'
  );

  injectCSS('/components/mobile/mobile.css');
  new MobileMenu(mobileMenuContainer, refreshTokensDisplay);
};

// Initialize the application
const initApp = async () => {
  const tokens = await getStoredTokens();

  if (isMobile) {
    // Initialize mobile UI
    await initMobile();
  } else {
    // Initialize desktop UI
    await initDesktop(tokens);
  }

  // Render tokens or empty screen (common for both platforms)
  if (tokens.length === 0) {
    return EmptyScreen(wrapper);
  }

  Tokens(wrapper, tokens);
};

initApp();
