import {
  parseTokensFromJson,
  executeTokenImport,
} from '../../js/importTokens.js';

/**
 * @typedef {import("../../js/types.js").Token} Token
 */

/**
 * Render the empty screen and attach a click handler to open a file dialog.
 *
 * @param {HTMLElement} wrapper - The wrapper element.
 * @param {Token[]} storedTokens - The existing stored tokens.
 * @param {Function} saveTokensCallback - Callback to save imported tokens.
 * @param {Function} onImportComplete - Callback after successful import.
 */
export const EmptyScreen = (
  wrapper,
  storedTokens,
  saveTokensCallback,
  onImportComplete,
) => {
  const renderEmpty = () => {
    const html = `
    <div class="emptyScreen">
      <p class="emptyScreen__hint">Drop backup here</p>
      <p class="emptyScreen__hint--small">Or click to open file</p>
    </div>`;

    wrapper.innerHTML = html;

    const emptyScreenEl = wrapper.querySelector('.emptyScreen');
    emptyScreenEl.addEventListener('click', handleClick);
  };

  const handleClick = async () => {
    const { open } = window.__TAURI__.dialog;
    const { readTextFile } = window.__TAURI__.fs;

    const path = await open({
      filters: [
        {
          name: 'JSON Files',
          extensions: ['json'],
        },
      ],
    });

    if (!path) {
      return;
    }

    const content = await readTextFile(path);
    const json = JSON.parse(content);
    const importedTokens = parseTokensFromJson(json);

    if (!importedTokens.length) {
      return;
    }

    const { ask } = window.__TAURI__.dialog;
    const confirmed = await ask(
      `Found ${importedTokens.length} accounts. Do you want to import them?`,
      { title: 'Import Tokens', type: 'info' },
    );

    if (confirmed) {
      executeTokenImport(
        importedTokens,
        storedTokens,
        saveTokensCallback,
        onImportComplete,
      );
    }
  };

  renderEmpty();
};
