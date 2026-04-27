import { adjustHue } from './color.utils.js';
import { TOTP } from './otpauth.esm.js';

const TOKEN_GRADIENT_START = '#7B8ACE';
const TOKEN_GRADIENT_END = '#515DB0';
const HUE_STEP = 45;

export class Token {
  token;
  config;
  remaining;
  isInViewport = false;
  needTokenUpdate = false;

  constructor(config, index) {
    this.config = config;
    this.index = index;
    this.totp = new TOTP(config);
  }

  updateToken() {
    this.token = this.totp.generate();
    this.updateRemaining();
  }

  updateRemaining() {
    const remaining =
      this.totp.period - ((Date.now() / 1000) % this.totp.period);
    this.remaining = Math.ceil(remaining);
    return remaining;
  }

  renderToken() {
    const newToken = this.totp.generate();
    if (this.token !== newToken) {
      this.token = newToken;
      this.tokenValueRef.innerHTML = this.getTokenHTML();
    }
    this.needTokenUpdate = false;
  }

  getTokenHTML() {
    return `${this.token.slice(0, 3)}<span class="token__spacer"></span>${this.token.slice(3)}`;
  }

  updateCounter() {
    if (!this.counterRef || !this.tokenValueRef || !this.counterValueRef) {
      this.counterRef = document.querySelector(
        `#${this.config.id} .token__remaining`,
      );
      this.counterValueRef = document.querySelector(
        `#${this.config.id} .token__remaining-value`,
      );
      this.tokenValueRef = document.querySelector(
        `#${this.config.id} .token__value`,
      );
    }

    const remaining = this.updateRemaining();

    // skip rendering of element is not visible
    if (!this.isInViewport) {
      this.needTokenUpdate = true;
      return;
    } else if (this.needTokenUpdate) {
      this.renderToken();
    }

    this.counterRef.style = `--value: ${this.totp.period - remaining};`;
    this.counterValueRef.innerText = this.remaining;

    // schedule token rerender when countdown reaches end
    // remaining is ceil(), so when it hits 1, we're in the last second
    if (this.remaining <= 1) {
      setTimeout(() => {
        this.renderToken();
      }, 150); // small delay to ensure we've crossed the period boundary
    }
  }

  render() {
    const hueOffset = this.index * HUE_STEP;
    const bgGradientStartColor = adjustHue(TOKEN_GRADIENT_START, hueOffset);
    const bgGradientEndColor = adjustHue(TOKEN_GRADIENT_END, hueOffset);

    const style = `--period: ${this.totp.period}; --text-shadow: ${bgGradientEndColor}; --bg-gradient-start: ${bgGradientStartColor}; --bg-gradient-end: ${bgGradientEndColor}`;

    return `
    <div class="token" id="${this.config.id}" index="${this.index}"
    style="${style}">
      <div class="token__header">
        <div class="token__label">${this.config.label}</div>
        <div class="token__issuer">${this.config.issuer || '&nbsp;'}</div>
      </div>
      <div class="token__value">${this.getTokenHTML()}</div>
      <div class="token__remaining" style="--value: ${this.totp.period - this.remaining};">
        <div class="token__remaining-value">${this.remaining}</div>
      </div>
    </div>`;
  }
}
