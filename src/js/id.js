import { Secret } from './otpauth.esm.js';

export const getId = () => `id${new Secret({ size: 10 }).hex}`;
