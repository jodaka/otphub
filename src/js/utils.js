/**
 * @typedef {import("./types.js").Token} Token
 */

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
 * Parses a JSON file and returns the parsed content.
 *
 * @param {File} file - The file to parse
 * @returns {Promise<any>} A promise that resolves to the parsed JSON
 */
export const parseFile = (file) => {
  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.onload = (evt) => {
      try {
        const json = JSON.parse(evt.target.result);
        resolve(json);
      } catch (error) {
        reject(error);
      }
    };
    reader.readAsText(file);
  });
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
    if (
      storedTokens.findIndex(
        (storedToken) => storedToken.secret === token.secret,
      ) === -1
    ) {
      storedTokens.push(token);
      importCount++;
    }
  });
  return importCount;
};
