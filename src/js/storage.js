/**
 * @typedef {import("@tauri-apps/plugin-store").Store} Store
 * @typedef {import("./types.js").Token} Token
 */

// biome-ignore lint/correctness/noUnusedVariables: debug only
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
 * Singleton store instance for token persistence.
 * @type {Store|null}
 */
let store = null;

/**
 * Initializes and returns the store instance.
 * @returns {Promise<Store>}
 */
const getStore = async () => {
  if (store) {
    return store;
  }

  const { Store } = window.__TAURI_PLUGIN_STORE__;
  store = await Store.load('tokens.json');
  return store;
};

/**
 * Retrieves stored tokens from the Tauri store.
 * Returns an empty array if no tokens are stored.
 *
 * @returns {Promise<Token[]>} A promise that resolves to an array of tokens
 */
export const getStoredTokens = async () => {
  const s = await getStore();
  const tokens = await s.get('tokens');
  return tokens ?? [];
  // return tokens ?? DEBUG_TOKENS;
};

/**
 * Saves tokens to the Tauri store.
 *
 * @param {Token[]} tokens - Array of token objects to save
 * @returns {Promise<void>}
 */
export const saveTokens = async (tokens) => {
  const s = await getStore();
  await s.set('tokens', tokens);
  await s.save();
};
