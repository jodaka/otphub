/**
 * @typedef {Object} Token
 * @property {string} label - Account name/identifier
 * @property {string} issuer - Service name (e.g., "GitHub", "Google")
 * @property {string} algorithm - Hash algorithm (e.g., "SHA1", "SHA256")
 * @property {number} digits - Number of digits in the OTP code
 * @property {number} period - Time period in seconds for TOTP
 * @property {string} secret - Base32 encoded secret key
 * @property {string} [id] - Unique identifier for the token (added at runtime)
 */

/**
 * Debug tokens used when no tokens are stored in localStorage.
 * @type {Token[]}
 */
const DEBUG_TOKENS = [
  {
    label: 'test acc1',
    issuer: 'akudris@ruform',
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
    secret: 'A3QNWHBGVD',
  },
  {
    label: 'test acc2',
    issuer: 'akudris',
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
    secret: 'MZIUO5DHGA',
  },
];

/**
 * Retrieves stored tokens from localStorage.
 * Returns DEBUG_TOKENS if no tokens are stored or if parsing fails.
 *
 * @returns {Promise<Token[]>} A promise that resolves to an array of tokens
 */
export const getStoredTokens = () => {
  return new Promise((resolve) => {
    const raw = window.localStorage.getItem('tokens');
    try {
      if (!raw) {
        resolve(DEBUG_TOKENS);
      } else {
        const parsed = JSON.parse(raw);
        resolve(parsed);
      }
    } catch (_err) {
      resolve(DEBUG_TOKENS);
    }
  });
};

/**
 * Saves tokens to localStorage.
 *
 * @param {Token[]} tokens - Array of token objects to save
 * @returns {void}
 */
export const saveTokens = (tokens) => {
  return window.localStorage.setItem('tokens', JSON.stringify(tokens));
};
