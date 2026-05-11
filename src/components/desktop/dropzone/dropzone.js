import { parseFile } from '../../../js/utils.js';
import { parseTokensFromJson, executeTokenImport } from '../../../js/importTokens.js';

/**
 * @typedef {import("../../js/types.js").Token} Token
 */

const POPOVER_CLASSNAME = 'dropzone__popover';
const HOVER_CLASSNAME = 'dropzone--hover';

export class Dropzone {
  hoverClassAdded = false;
  storedTokens = [];
  wrapper = null;
  saveTokensCallback = () => {};
  onComplete = () => {};

  /**
   * Initialize the dropzone component.
   * @param {HTMLElement} wrapper - The wrapper element for the dropzone.
   * @param {Token[]} storedTokens - The stored tokens to compare against.
   * @param {Function} saveTokensCallback - Callback to save imported tokens.
   * @param {Function} onComplete - Callback after successful import.
   */
  constructor(wrapper, storedTokens, saveTokensCallback, onComplete) {
    this.wrapper = wrapper;
    this.storedTokens = Array.from(storedTokens);
    this.saveTokensCallback = saveTokensCallback;
    this.onComplete = onComplete;

    wrapper.addEventListener('dragover', (event) => this.handleDragOver(event));
    wrapper.addEventListener('dragleave', (event) => this.handleDragLeave(event));
    wrapper.addEventListener('drop', (event) => this.handleDragDrop(event));

    this.insertPopover();
    wrapper.classList.add('dropzone');
  }

  insertPopover() {
    const html = `<div class="${POPOVER_CLASSNAME}"><div class="dropzone__info">Drop 2FAS export file here</div></div>`;
    this.wrapper.insertAdjacentHTML('beforeend', html);
  }

  handleDragOver(event) {
    event.preventDefault();
    event.stopPropagation();
    if (!this.hoverClassAdded) {
      this.wrapper.classList.add(HOVER_CLASSNAME);
      this.hoverClassAdded = true;
    }
  }

  handleDragLeave(event) {
    event.preventDefault();
    event.stopPropagation();

    if (this.hoverClassAdded) {
      this.wrapper.classList.remove(HOVER_CLASSNAME);
      this.hoverClassAdded = false;
    }
  }

  handleDragDrop(event) {
    event.preventDefault();
    event.stopPropagation();

    const files = event.dataTransfer.files;
    if (files.length) {
      this.processFile(files[0]);
    }

    if (this.hoverClassAdded) {
      this.wrapper.classList.remove(HOVER_CLASSNAME);
      this.hoverClassAdded = false;
    }
  }

  async confirmImport(importedTokens) {
    const { ask } = window.__TAURI__.dialog;
    const confirmed = await ask(`Found ${importedTokens.length} accounts. Do you want to import them?`, {
      title: 'Import Tokens',
      type: 'info',
    });

    if (confirmed) {
      executeTokenImport(importedTokens, this.storedTokens, this.saveTokensCallback, this.onComplete);
    }
  }

  processFile(file) {
    parseFile(file).then(async (json) => {
      const tokens = parseTokensFromJson(json);

      if (tokens.length) {
        await this.confirmImport(tokens);
      }
    });
  }
}
