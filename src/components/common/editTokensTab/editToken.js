import { adjustHue } from '../../../js/colors.js';

const TOKEN_GRADIENT_START = '#7B8ACE';
const TOKEN_GRADIENT_END = '#515DB0';

/**
 * Represents a single editable token card in the edit tab.
 */
export class EditToken {
  token;
  config;

  /**
   * @param {Object} config - The token configuration.
   * @param {string} config.id - Unique token identifier.
   * @param {string} config.label - Account label.
   * @param {string} config.issuer - Service issuer.
   * @param {number} config.hueOffset - Hue offset for gradient color.
   * @param {number} index - The token's index in the list.
   * @param {number} totalCount - Total number of tokens in the list.
   */
  constructor(config, index, totalCount) {
    this.config = config;
    this.index = index;
    this.isFirst = index === 0;
    this.isLast = index === totalCount - 1;
  }

  /**
   * Renders the editable token HTML.
   * @returns {string} The HTML string for the editable token card.
   */
  render() {
    const bgGradientStartColor = adjustHue(TOKEN_GRADIENT_START, this.config.hueOffset);
    const bgGradientEndColor = adjustHue(TOKEN_GRADIENT_END, this.config.hueOffset);

    const style = `--text-shadow: ${bgGradientEndColor}; --bg-gradient-start: ${bgGradientStartColor}; --bg-gradient-end: ${bgGradientEndColor}`;

    return `
    <div class="token editToken" id="${this.config.id}" index="${this.index}"
    style="${style}">
      <div class="token__header">
        <div class="token__label">${this.config.label}</div>
        <div class="token__issuer">${this.config.issuer || '&nbsp;'}</div>
      </div>
      <div class="token__controls">
        <button class="control control--pos" data-action="up" ${this.isFirst ? 'disabled' : ''}>
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" xml:space="preserve" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2" viewBox="0 0 64 64">
          <path d="M49.6 27H12.5a3.5 3.5 0 0 1 0-7h41q1.7 0 2.7 1.3 1.1 1.2 1 3L51 64.7a3.5 3.5 0 0 1-7-1z" style="currentcolor" transform="rotate(-49 35 43.5)"/>
        </svg>
 </button>
  <div class="control__spacer"></div>
        <button class="control control--delete" data-action="delete">
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 50 50" style="stroke-linejoin:round;stroke-width:3">
          <path d="M25 2C12.31 2 2 12.31 2 25s10.31 23 23 23 23-10.31 23-23S37.69 2 25 2m0 2c11.61 0 21 9.39 21 21s-9.39 21-21 21S4 36.61 4 25 13.39 4 25 4m7.99 11.99a1 1 0 0 0-.7.3L25 23.6l-7.3-7.3a1 1 0 0 0-.7-.3 1 1 0 0 0-.7 1.72L23.6 25l-7.3 7.3a1 1 0 1 0 1.42 1.4L25 26.42l7.3 7.3a1 1 0 1 0 1.4-1.42L26.42 25l7.3-7.3a1 1 0 0 0-.72-1.71" style="currentcolor"/>
        </svg>
        </button>
<div class="control__spacer"></div>
        <button class="control control--pos" data-action="down" ${this.isLast ? 'disabled' : ''}>
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" xml:space="preserve" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2" viewBox="0 0 64 64">
          <path d="M49.64 27H12.5a3.5 3.5 0 0 1 0-7h41c1.11 0 2.1.52 2.74 1.33a3.5 3.5 0 0 1 .9 2.9l-6.16 40.54a3.5 3.5 0 0 1-6.92-1.05z" style="currentcolor" transform="rotate(229 -5.3 15.93)scale(-1 1)"/>
        </svg>

        </button>
      </div>
    </div>`;
  }
}
