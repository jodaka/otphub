import { importTokensFromFile } from '../../../js/import.js';

/**
 * @typedef {import("../../../js/types.js").Token} Token
 */

/**
 * Render the empty screen and attach a click handler to open a file dialog.
 *
 * @param {HTMLElement} wrapper - The wrapper element.
 * @param {Token[]} storedTokens - The existing stored tokens.
 * @param {Function} saveTokensCallback - Callback to save imported tokens.
 * @param {Function} onImportComplete - Callback after successful import.
 */
export const EmptyTokensTab = (wrapper, storedTokens, saveTokensCallback, onImportComplete) => {
  const abortController = new AbortController();

  const handleClick = () => {
    importTokensFromFile(storedTokens, saveTokensCallback, onImportComplete);
  };

  const renderEmpty = () => {
    const html = `
    <div class="emptyScreen">
      <p class="emptyScreen__hint">Drop backup here</p>
      <p class="emptyScreen__hint--small">Or click to open file</p>
    </div>`;

    wrapper.innerHTML = html;

    const emptyScreenEl = wrapper.querySelector('.emptyScreen');
    emptyScreenEl.addEventListener('click', handleClick, { signal: abortController.signal });
  };

  renderEmpty();

  return () => {
    abortController.abort();
  };
};
