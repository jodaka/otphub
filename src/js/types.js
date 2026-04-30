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

export {};
