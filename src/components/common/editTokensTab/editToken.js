import { adjustHue } from '../../../js/colors.js';

const TOKEN_GRADIENT_START = '#7B8ACE';
const TOKEN_GRADIENT_END = '#515DB0';

export class EditToken {
  token;
  config;

  constructor(config, index, totalCount) {
    this.config = config;
    this.index = index;
    this.isFirst = index === 0;
    this.isLast = index === totalCount - 1;
  }

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
