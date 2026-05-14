import { exportTokensJSON } from '../../../js/export.js';
import { importTokensFromFile } from '../../../js/import.js';
import { isMobile } from '../../../js/utils.js';

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
        <span class="settings__buttonIcon">
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24"><path d="M8 21H4a1 1 0 0 1-1-1v-4a1 1 0 0 0-2 0v4a3 3 0 0 0 3 3h4a1 1 0 0 0 0-2m14-6a1 1 0 0 0-1 1v4a1 1 0 0 1-1 1h-4a1 1 0 0 0 0 2h4a3 3 0 0 0 3-3v-4a1 1 0 0 0-1-1M20 1h-4a1 1 0 0 0 0 2h4a1 1 0 0 1 1 1v4a1 1 0 0 0 2 0V4a3 3 0 0 0-3-3M2 9a1 1 0 0 0 1-1V4a1 1 0 0 1 1-1h4a1 1 0 0 0 0-2H4a3 3 0 0 0-3 3v4a1 1 0 0 0 1 1m8-4H6a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1M9 9H7V7h2Zm5 2h4a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1m1-4h2v2h-2Zm-5 6H6a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1m-1 4H7v-2h2Zm5-1a1 1 0 0 0 1-1 1 1 0 0 0 0-2h-1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1m4-3a1 1 0 0 0-1 1v3a1 1 0 0 0 0 2h1a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1m-4 4a1 1 0 1 0 1 1 1 1 0 0 0-1-1"/></svg>
        </span>Add QR Code
      </button>
      <button class="settings__button exportButton">
<span class="settings__buttonIcon">
<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24"><path stroke="#000" stroke-linecap="round" d="M12 7.5H7A1.5 1.5 0 0 0 5.5 9v8A1.5 1.5 0 0 0 7 18.5h8a1.5 1.5 0 0 0 1.5-1.5v-5"/><path stroke="#000" stroke-linecap="round" stroke-linejoin="round" d="m12.5 11.5 6.364-6.364M14.5 4.5h5v5"/></svg>
      </span>Export data</button>
      <button class="settings__button importButton">
        <span class="settings__buttonIcon">
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24">
          <path d="M15 13h-4V9" stroke-linecap="round" style="fill:none;stroke:#000;stroke-linejoin:round;stroke-width:2"/><path d="M21 3 11 13M19 13.89V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h6.11" stroke-width="2" style="stroke-linecap:round;stroke-linejoin:round;"/></svg>
        </span>Import data</button>
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
