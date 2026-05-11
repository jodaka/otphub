/**
 * @typedef {import("./types.js").Token} Token
 */

/**
 * Reads a dropped File object as text and parses it as JSON.
 *
 * @param {File} file - The file to parse
 * @returns {Promise<*>} The parsed JSON content
 */
export const parseFile = async (file) => {
  const text = await file.text();
  return JSON.parse(text);
};

/**
 * Validates that an object conforms to the Token type.
 * Checks for the presence and types of required properties.
 *
 * @param {*} token - The object to validate
 * @returns {boolean} True if the object is a valid Token, false otherwise
 */
export const isValidToken = (token) => {
  if (typeof token !== 'object' || token === null) {
    return false;
  }

  return (
    typeof token.label === 'string' &&
    typeof token.issuer === 'string' &&
    typeof token.algorithm === 'string' &&
    typeof token.digits === 'number' &&
    typeof token.period === 'number' &&
    typeof token.secret === 'string'
  );
};

/**
 * Merges imported tokens into stored tokens, skipping duplicates and invalid tokens.
 * Calls the save callback with the newly imported tokens.
 *
 * @param {Token[]} importedTokens - The tokens to import
 * @param {Token[]} storedTokens - The existing stored tokens
 * @returns {number} The number of tokens that were actually imported
 */
export const mergeAndSaveTokens = (importedTokens, storedTokens) => {
  let importCount = 0;

  importedTokens.forEach((token) => {
    if (!isValidToken(token)) {
      return;
    }
    if (storedTokens.findIndex((storedToken) => storedToken.secret === token.secret) === -1) {
      storedTokens.push(token);
      importCount++;
    }
  });
  return importCount;
};

/**
 * Current operating system type from Tauri OS plugin.
 * @type {string}
 */
export const osType = window.__TAURI_PLUGIN_OS__.type();

/**
 * Flag indicating if the app is running on a mobile platform.
 * @type {boolean}
 */
export const isMobile = osType === 'android' || osType === 'ios';

/**
 * Dynamically injects a CSS file into the document head.
 * @param {string} href - The path to the CSS file.
 */
export const injectCSS = (href) => {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  document.head.appendChild(link);
};
