import { exportTokensJSON } from '../../../js/export.js';
import { importTokensFromFile } from '../../../js/import.js';
import { isMobile } from '../../../js/utils.js';

/**
 * @typedef {import("../../../js/types.js").Token} Token
 */

/**
 * Renders the Settings tab with import, export, and mobile QR scan buttons.
 *
 * @param {HTMLElement} wrapper - The DOM element to render into.
 * @param {Token[]} tokens - The current stored tokens.
 * @param {Function} saveTokensCb - Callback to save tokens after import.
 * @param {Function} refreshTokensDisplay - Callback to refresh the main display.
 * @returns {Function} Cleanup function that aborts event listeners.
 */
export const SettingsTab = (wrapper, tokens = [], saveTokensCb, refreshTokensDisplay) => {
  const abortController = new AbortController();

  const initScanButton = () => {
    import('../scanQRcode/scanQRcode.js').then(({ ScanQRcode }) => {
      const scannerContainer = wrapper.querySelector('.scannerButton');
      const scanFn = ScanQRcode(refreshTokensDisplay, tokens, saveTokensCb);
      scannerContainer.addEventListener('click', () => scanFn(), { signal: abortController.signal });
    });
  };

  const initImportButton = () => {
    const btn = wrapper.querySelector('.importButton');
    btn.addEventListener('click', () => importTokensFromFile(tokens, saveTokensCb, refreshTokensDisplay), {
      signal: abortController.signal,
    });
  };

  const initExportButton = () => {
    const btn = wrapper.querySelector('.exportButton');
    btn.addEventListener('click', () => exportTokensJSON(tokens), { signal: abortController.signal });
  };

  const render = () => {
    wrapper.innerHTML = `
    <div class="settings__list">
      <button class="settings__button scannerButton mobileOnly">
        <svg class="settings__buttonIcon" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24">
          <path d="M8 21H4a1 1 0 0 1-1-1v-4a1 1 0 0 0-2 0v4a3 3 0 0 0 3 3h4a1 1 0 0 0 0-2m14-6a1 1 0 0 0-1 1v4a1 1 0 0 1-1 1h-4a1 1 0 0 0 0 2h4a3 3 0 0 0 3-3v-4a1 1 0 0 0-1-1M20 1h-4a1 1 0 0 0 0 2h4a1 1 0 0 1 1 1v4a1 1 0 0 0 2 0V4a3 3 0 0 0-3-3M2 9a1 1 0 0 0 1-1V4a1 1 0 0 1 1-1h4a1 1 0 0 0 0-2H4a3 3 0 0 0-3 3v4a1 1 0 0 0 1 1m8-4H6a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1M9 9H7V7h2Zm5 2h4a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1m1-4h2v2h-2Zm-5 6H6a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1m-1 4H7v-2h2Zm5-1a1 1 0 0 0 1-1 1 1 0 0 0 0-2h-1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1m4-3a1 1 0 0 0-1 1v3a1 1 0 0 0 0 2h1a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1m-4 4a1 1 0 1 0 1 1 1 1 0 0 0-1-1"/>
        </svg>
        Add QR Code
      </button>

      <button class="settings__button importButton">
        <svg class="settings__buttonIcon" xmlns="http://www.w3.org/2000/svg" xml:space="preserve" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5" width="100%" height="100" viewBox="0 0 61 54">
          <path d="M125 119.5c0 6.9-5.6 12.5-12.5 12.5h-25c-6.9 0-12.5-5.6-12.5-12.5v-25C75 87.6 80.6 82 87.5 82h25c6.9 0 12.5 4.6 12.5 11.5" style="fill:none;stroke:#000;stroke-width:3.75px" transform="translate(-73.13 -80.13)"/>
          <path d="m144.12 105.94-46.53.04" style="fill:none;stroke:#000;stroke-width:4.59px" transform="matrix(-.72 0 0 1.06 128.34 -86.6)"/>
          <path d="m134.7 97.18 7.27 7.07" style="fill:none;stroke:#000;stroke-width:4.17px" transform="matrix(-1 0 0 1 166.59 -78.84)"/>
          <path d="m134.7 97.18 7.27 7.07" style="fill:none;stroke:#000;stroke-width:4.17px" transform="matrix(-1 0 0 -1 166.59 130.59)"/>
        </svg>
        Import
      </button>

      <button class="settings__button exportButton">
        <svg class="settings__buttonIcon" xmlns="http://www.w3.org/2000/svg" xml:space="preserve" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5" viewBox="0 0 67 54" width="100%" height="100">
          <path d="M125 119.5c0 6.9-5.6 12.5-12.5 12.5h-25c-6.9 0-12.5-5.6-12.5-12.5v-25C75 87.6 80.6 82 87.5 82h25c6.9 0 12.5 4.6 12.5 11.5" style="fill:none;stroke:#000;stroke-width:3.75px" transform="translate(-73.13 -80.13)"/>
          <path d="m144.12 105.94-46.53.04" style="fill:none;stroke:#000;stroke-width:4.59px" transform="matrix(.72 0 0 1.06 -39.88 -85.6)"/>
          <path d="m134.7 97.18 7.27 7.07" style="fill:none;stroke:#000;stroke-width:4.17px" transform="translate(-78.13 -77.84)"/>
          <path d="m134.7 97.18 7.27 7.07" style="fill:none;stroke:#000;stroke-width:4.17px" transform="matrix(1 0 0 -1 -78.13 131.59)"/>
        </svg>
        Export
      </button>

    </div>
    `;
  };

  const attachEvents = () => {
    if (isMobile) {
      initScanButton();
    }
    initImportButton();
    initExportButton();
  };

  render();
  attachEvents();

  return () => {
    abortController.abort();
  };
};
