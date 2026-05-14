import { EditTokens } from '../components/common/editTokens/editTokens.js';
import { EmptyScreen } from '../components/common/emptyScreen/emptyScreen.js';
import { Settings } from '../components/common/settings/settings.js';
import { Tabs } from '../components/common/tabs/tabs.js';
import { Tokens } from '../components/common/tokens/tokens.js';

import { getStoredTokens, saveTokens } from './storage.js';
/* biome-ignore  lint/correctness/noUnusedImports: stub */
import * as stub from './stub.js';
import { injectCSS, isMobile } from './utils.js';

/** @type {'otp'|'edit'|'settings'} */
let activeTab = 'otp';

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

/**
 * @returns {Function|null} cleanup function or nothing
 */
const getMainComponent = (wrapper, tokens, saveTokens, refreshTokensDisplay) => {
  switch (activeTab) {
    case 'otp':
      return tokens.length === 0
        ? EmptyScreen(wrapper, tokens, saveTokens, refreshTokensDisplay)
        : Tokens(wrapper, tokens, saveTokens, refreshTokensDisplay);
    case 'edit':
      return EditTokens(wrapper, tokens, saveTokens, refreshTokensDisplay);
    case 'settings':
      return Settings(wrapper, tokens, saveTokens, refreshTokensDisplay);
  }
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

    const cleanupFn = getMainComponent(wrapper, tokens, saveTokens, refreshTokensDisplay);
    if (typeof cleanupFn === 'function') {
      currentCleanup = cleanupFn;
    }
  });
};

/**
 * Initialize desktop-specific components.
 * @param {Token[]} tokens - The stored tokens.
 */
const initDesktop = async (tokens) => {
  const [{ Menu }, { registerExportHotkey }, { registerImportHotkey }] = await Promise.all([
    import('../components/desktop/menu/menu.js'),
    import('./export.js'),
    import('./import.js'),
  ]);

  injectCSS('/components/desktop/desktop.css');
  new Menu();

  const bodyWrapper = document.body;
  registerExportHotkey(bodyWrapper, tokens);
  registerImportHotkey(bodyWrapper, tokens, saveTokens);
};

/**
 * Initialize mobile-specific components.
 */
const initMobile = async () => {
  document.documentElement.classList.add('mobile');
};

const handleTabChange = (tab) => {
  console.log(123, 'new tab', tab);
  activeTab = tab;

  refreshTokensDisplay();
};

// Initialize the application
const initApp = async () => {
  const tokens = await getStoredTokens();
  Tabs(activeTab, handleTabChange);

  if (isMobile) {
    // Initialize mobile UI
    await initMobile();
  } else {
    // Initialize desktop UI
    await initDesktop(tokens);
  }

  // Render tokens or empty screen (common for both platforms)
  if (tokens.length === 0) {
    EmptyScreen(wrapper, tokens, saveTokens, refreshTokensDisplay);
    return;
  }

  const result = getMainComponent(wrapper, tokens, saveTokens, refreshTokensDisplay);
  if (typeof result === 'function') {
    currentCleanup = result;
  }
};

initApp();
