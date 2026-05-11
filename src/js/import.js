import { tinykeys } from './tinykeys.module.js';
import { mergeAndSaveTokens } from './utils.js';

/**
 * @typedef {import("./types.js").Token} Token
 */

/**
 * Imports tokens from a JSON file using Tauri dialog and fs.
 *
 * @param {Token[]} storedTokens - The existing stored tokens
 * @returns {Promise<number>} The number of tokens imported
 */
export const importTokensFromFile = async (storedTokens) => {
  const { open } = window.__TAURI__.dialog;
  const { readTextFile } = window.__TAURI__.fs;

  try {
    // Open the file picker
    const path = await open({
      filters: [
        {
          name: 'JSON Files',
          extensions: ['json'],
        },
      ],
    });

    if (!path) {
      return 0;
    }

    // Read the file content
    const content = await readTextFile(path);

    // Parse JSON
    const json = JSON.parse(content);

    // Handle both direct array and nested format (like 2FAS export)
    const importedTokens = Array.isArray(json) ? json : json.tokens || json.data || [];

    const importCount = mergeAndSaveTokens(importedTokens, storedTokens);
    return importCount;
  } catch (err) {
    if (err.name !== 'AbortError') {
      console.error('Failed to import tokens:', err);
    }
    return 0;
  }
};

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
