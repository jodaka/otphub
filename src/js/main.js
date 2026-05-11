import { EditTokens } from '../components/common/editTokens/editTokens.js';
import { EmptyScreen } from '../components/common/emptyScreen/emptyScreen.js';
import { Tokens } from '../components/common/tokens/tokens.js';
import { getStoredTokens, saveTokens } from './storage.js';
/* biome-ignore  lint/correctness/noUnusedImports: stub */
import * as stub from './stub.js';
import { injectCSS, isMobile } from './utils.js';

let isEditMode = false;

/** @type {Function|null} */
let currentCleanup = null;

/**
 * @typedef {import("./types.js").Token} Token
 */

/**
 * Main content wrapper element.
 * @type {HTMLElement}
 */
const wrapper = document.querySelector('.main');

const getMainComponent = () => {
  return isEditMode ? EditTokens : Tokens;
};

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
    if (currentCleanup) {
      currentCleanup();
      currentCleanup = null;
    }

    if (tokens.length === 0) {
      EmptyScreen(wrapper, tokens, saveTokens, refreshTokensDisplay);
      return;
    }

    const result = getMainComponent()(wrapper, tokens, saveTokens, refreshTokensDisplay);
    if (typeof result === 'function') {
      currentCleanup = result;
    }
  });
};

/**
 * Initialize desktop-specific components.
 * @param {Token[]} tokens - The stored tokens.
 */
const initDesktop = async (tokens) => {
  const [{ Dropzone }, { Menu }, { registerExportHotkey }, { registerImportHotkey }] = await Promise.all([
    import('../components/desktop/dropzone/dropzone.js'),
    import('../components/desktop/menu/menu.js'),
    import('./export.js'),
    import('./import.js'),
  ]);

  injectCSS('/components/desktop/desktop.css');
  new Menu();

  const bodyWrapper = document.body;
  new Dropzone(bodyWrapper, tokens, saveTokens, refreshTokensDisplay);
  registerExportHotkey(bodyWrapper, tokens);
  registerImportHotkey(bodyWrapper, tokens, saveTokens);
};

/**
 * Initialize mobile-specific components.
 */
const initMobile = async () => {
  document.documentElement.classList.add('mobile');

  const { MobileMenu } = await import('../components/mobile/mobileMenu/mobileMenu.js');

  const mobileMenuContainer = document.querySelector('.mobile-menu');

  injectCSS('/components/mobile/mobile.css');
  new MobileMenu(mobileMenuContainer, refreshTokensDisplay);
};

const initModeSwitcher = () => {
  const editModeSwitch = document.getElementById('edit-mode-switch');
  editModeSwitch.addEventListener('change', () => {
    isEditMode = editModeSwitch.checked;
    if (currentCleanup) {
      currentCleanup();
      currentCleanup = null;
    }
    wrapper.innerHTML = '';
    refreshTokensDisplay();
  });
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

  initModeSwitcher();

  // Render tokens or empty screen (common for both platforms)
  if (tokens.length === 0) {
    EmptyScreen(wrapper, tokens, saveTokens, refreshTokensDisplay);
    return;
  }

  const result = getMainComponent()(wrapper, tokens, saveTokens, refreshTokensDisplay);
  if (typeof result === 'function') {
    currentCleanup = result;
  }
};

initApp();
