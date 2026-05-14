import { executeTokenImport, parseTokensFromJson } from './importTokens.js';
import { tinykeys } from './tinykeys.module.js';

/**
 * @typedef {import("./types.js").Token} Token
 */

/**
 * Register global hotkey for importing tokens.
 * Opens file picker when Control+I or Meta+I is pressed.
 * @param {HTMLElement} wrapper - The element to attach the hotkey to.
 * @param {Token[]} storedTokens - The existing stored tokens
 * @param {Function} saveTokensCallback - Callback to save tokens
 */
export const registerImportHotkey = (wrapper, storedTokens, saveTokensCallback) => {
  const handleImport = async () => {
    const importCount = await importTokensFromFile(storedTokens);
    if (importCount > 0) {
      saveTokensCallback(storedTokens);
      location.reload();
    }
  };

  tinykeys(wrapper, {
    'Control+I': handleImport,
    'Meta+I': handleImport,
  });
};

export const importTokensFromFile = async (tokens, saveTokensCallback, onImportComplete) => {
  const { open } = window.__TAURI__.dialog;
  const { readTextFile } = window.__TAURI__.fs;

  const path = await open({
    filters: [
      {
        name: 'JSON Files',
        extensions: ['json', '2fas'],
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
  const confirmed = await ask(`Found ${importedTokens.length} accounts. Do you want to import them?`, {
    title: 'Import Tokens',
    type: 'info',
  });

  if (confirmed) {
    executeTokenImport(importedTokens, tokens, saveTokensCallback, onImportComplete);
  }
};
