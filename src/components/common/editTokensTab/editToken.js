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
        <button class="control control--pos" data-action="up" ${this.isFirst ? 'disabled' : ''}>Up</button>
        <button class="control control--delete" data-action="delete">Delete</button>
        <button class="control control--pos" data-action="down" ${this.isLast ? 'disabled' : ''}>Down</button>
      </div>
    </div>`;
  }
}
