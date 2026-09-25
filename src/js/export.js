import { tinykeys } from './tinykeys.module.js';
import { isAndroid } from './utils.js';

/**
 * @typedef {import("./types.js").Token} Token
 */

/**
 * Writes the export file to the path chosen by the user.
 *
 * On Android the save dialog returns a `content://` URI which the fs plugin
 * cannot write to without producing a zero-length file, so the native
 * content-resolver plugin is used instead.
 *
 * @param {string} path - The destination path or URI.
 * @param {string} jsonContent - The serialized export contents.
 * @returns {Promise<void>}
 */
const writeExportFile = async (path, jsonContent) => {
  if (isAndroid) {
    await window.__TAURI__.core.invoke('plugin:content-resolver|write_text_to_uri', {
      uri: path,
      contents: jsonContent,
    });
    return;
  }

  const { writeTextFile } = window.__TAURI__.fs;
  await writeTextFile(path, jsonContent);
};

/**
 * Exports the current tokens as a JSON file using Tauri dialog and fs.
 * @param {Token[]} tokens - The tokens to export.
 */
export const exportTokensJSON = async (tokens) => {
  const { save } = window.__TAURI__.dialog;

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
      await writeExportFile(path, jsonContent);
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
