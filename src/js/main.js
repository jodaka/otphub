import { EditTokensTab } from '../components/common/editTokensTab/editTokensTab.js';
import { EmptyTokensTab } from '../components/common/emptyTokensTab/emptyTokensTab.js';
import { SettingsTab } from '../components/common/settingsTab/settingsTab.js';
import { Tabs } from '../components/common/tabs/tabs.js';
import { TokensTab } from '../components/common/tokensTab/tokensTab.js';
import { getStoredTokens, saveTokens } from './storage.js';
/* biome-ignore  lint/correctness/noUnusedImports: stub */
import * as stub from './stub.js';
import { injectCSS, isMobile } from './utils.js';

/** @type {'otp'|'edit'|'settings'} */
let activeTab = 'otp';

/** @type {Function|null} */
let tabCleanupFn = null;

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
const renderActiveTab = (wrapper, tokens, saveTokens, refreshTokensDisplay) => {
  switch (activeTab) {
    case 'otp':
      return tokens.length === 0
        ? EmptyTokensTab(wrapper, tokens, saveTokens, refreshTokensDisplay)
        : TokensTab(wrapper, tokens, saveTokens, refreshTokensDisplay);
    case 'edit':
      return EditTokensTab(wrapper, tokens, saveTokens, refreshTokensDisplay);
    case 'settings':
      return SettingsTab(wrapper, tokens, saveTokens, refreshTokensDisplay);
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
    wrapper.innerHTML = '';

    if (tabCleanupFn) {
      tabCleanupFn();
      tabCleanupFn = null;
    }

    const cleanupFn = renderActiveTab(wrapper, tokens, saveTokens, refreshTokensDisplay);
    if (typeof cleanupFn === 'function') {
      tabCleanupFn = cleanupFn;
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

const initMobile = () => {
  document.documentElement.classList.add('mobile');
};

const handleTabChange = (tab) => {
  activeTab = tab;
  refreshTokensDisplay();
};

const initApp = async () => {
  const tokens = await getStoredTokens();

  Tabs(activeTab, handleTabChange);

  if (isMobile) {
    initMobile();
  }

  await initDesktop(tokens);

  const renderResult = renderActiveTab(wrapper, tokens, saveTokens, refreshTokensDisplay);

  if (typeof renderResult === 'function') {
    tabCleanupFn = renderResult;
  }
};

initApp();
