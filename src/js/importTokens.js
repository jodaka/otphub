import { parser2fa } from '../components/desktop/dropzone/parsers/2faa.js';
import { mergeAndSaveTokens } from './utils.js';

/**
 * @typedef {import("./types.js").Token} Token
 */

/**
 * Parse raw JSON into tokens. Supports 2FAS export format,
 * plain arrays, and nested objects with `tokens` or `data` keys.
 *
 * @param {*} json
 * @returns {Token[]}
 */
export const parseTokensFromJson = (json) => {
  const from2fa = parser2fa(json);
  if (from2fa.length > 0) {
    return from2fa;
  }

  if (Array.isArray(json)) {
    return json;
  }

  return json?.tokens || json?.data || [];
};

/**
 * Merges imported tokens into stored tokens, saves them, and triggers completion.
 *
 * @param {Token[]} importedTokens
 * @param {Token[]} storedTokens
 * @param {Function} saveTokensCallback
 * @param {Function} onComplete
 */
export const executeTokenImport = (importedTokens, storedTokens, saveTokensCallback, onComplete) => {
  const importsCount = mergeAndSaveTokens(importedTokens, storedTokens);
  if (importsCount > 0) {
    saveTokensCallback(storedTokens);
    onComplete();
  }
};
