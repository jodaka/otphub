import { tinykeys } from './tinykeys.module.js';

/**
 * @typedef {import("./types.js").Token} Token
 */

/**
 * Exports the current tokens as a JSON file using Tauri dialog and fs.
 * @param {Token[]} tokens - The tokens to export.
 */
export const exportTokensJSON = async (tokens) => {
  const { save } = window.__TAURI__.dialog;
  const { writeTextFile } = window.__TAURI__.fs;

  const date = new Date().toISOString().split('T')[0];

  try {
    // Open the save dialog
    const path = await save({
      filters: [
        {
          name: 'JSON Files',
          extensions: ['json'],
        },
      ],
      defaultPath: `OTPHub_export_${date}.json`,
    });

    if (path) {
      const fileContents = {
        meta: {
          description: 'OTPHub export file',
          timestamp: new Date().toISOString(),
        },
        data: tokens,
      };

      // Write data to the selected path
      const jsonContent = JSON.stringify(fileContents, null, 2);
      await writeTextFile(path, jsonContent);
      console.log('Tokens exported to:', path);
    }
  } catch (err) {
    if (err.name !== 'AbortError') {
      console.error('Failed to export tokens:', err);
    }
  }
};

/**
 * Register global hotkey for exporting tokens.
 * @param {HTMLElement} wrapper - The element to attach the hotkey to.
 * @param {Token[]} tokens - The tokens to export.
 */
export const registerExportHotkey = (wrapper, tokens) => {
  const handleExport = () => exportTokensJSON(tokens);

  tinykeys(wrapper, {
    'Control+E': handleExport,
    'Command+E': handleExport,
  });
};
