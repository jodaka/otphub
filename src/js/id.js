import { Secret } from './otpauth.esm.js';

/**
 * Generates a unique identifier string for token instances.
 * Uses the OTPAuth Secret class to generate a random hex string.
 * @returns {string} A unique ID prefixed with "id".
 */
export const getId = () => `id${new Secret({ size: 10 }).hex}`;
