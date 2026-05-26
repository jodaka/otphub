import { mergeAndSaveTokens } from './utils.js';

/** @typedef {import("./types.js").Token} Token */

/**
 * Parse 2FAS export format into tokens.
 *
 * @param {*} json
 * @returns {Token[]}
 */
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
 * Parse Yandex ID export format into tokens.
 * Yandex format: [{ name, secret, techInfo? }]
 *
 * @param {*} json
 * @returns {Token[]}
 */
const parserYandexID = (json) => {
  if (!Array.isArray(json) || json.length === 0) {
    return [];
  }

  const hasYandexFormat = json.every(
    (item) =>
      typeof item === 'object' &&
      item !== null &&
      typeof item.name === 'string' &&
      typeof item.secret === 'string' &&
      typeof item.techInfo === 'string',
  );

  if (!hasYandexFormat) {
    return [];
  }

  return json
    .map((item) => {
      try {
        let issuer = '';
        let algorithm = 'SHA1';
        let digits = 6;
        let period = 30;

        const url = new URL(item.techInfo);
        if (url.protocol === 'otpauth:') {
          if (url.searchParams.get('issuer')) {
            issuer = url.searchParams.get('issuer');
          }
          if (url.searchParams.get('algorithm')) {
            algorithm = url.searchParams.get('algorithm');
          }
          if (url.searchParams.get('digits')) {
            digits = Number.parseInt(url.searchParams.get('digits'), 10);
          }
          if (url.searchParams.get('period')) {
            period = Number.parseInt(url.searchParams.get('period'), 10);
          }
        }

        return { label: item.name, issuer, algorithm, digits, period, secret: item.secret };
      } catch {
        return null;
      }
    })
    .filter(Boolean);
};

/**
 * Parse raw JSON into tokens. Supports 2FAS export format,
 * Yandex ID export format, plain arrays, and nested objects
 * with `tokens` or `data` keys.
 *
 * @param {*} json
 * @returns {Token[]}
 */
export const parseTokensFromJson = (json) => {
  const from2fa = parser2fa(json);
  if (from2fa.length > 0) {
    return from2fa;
  }

  const fromYandex = parserYandexID(json);
  if (fromYandex.length > 0) {
    return fromYandex;
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
    if (typeof onComplete === 'function') {
      onComplete();
    }
  }
};
