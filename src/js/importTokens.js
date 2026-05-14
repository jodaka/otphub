import { mergeAndSaveTokens } from './utils.js';

export const parser2fa = (json) => {
  if (json?.schemaVersion === 4 && json?.appVersionCode && json?.services?.length) {
    return json?.services.map((srv) => {
      return {
        label: srv.name,
        issuer: srv.otp.account || srv.otp.label || '',
        algorithm: srv.otp.algorithm || 'SHA1',
        digits: srv.otp.digits || 6,
        period: srv.otp.period || 30,
        secret: srv.secret,
        tokenType: srv.otp.tokenType || 'TOTP',
      };
    });
  }

  return [];
};

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
