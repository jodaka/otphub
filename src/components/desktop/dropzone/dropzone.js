import { parser2fa } from './parsers/2faa.js';
import { parseFile, mergeAndSaveTokens } from '../../js/utils.js';

/**
 * @typedef {import("../../js/types.js").Token} Token
 */

const POPOVER_CLASSNAME = 'dropzone__popover';
const HOVER_CLASSNAME = 'dropzone--hover';
const POPOVER_ACTIVE_CLASSNAME = 'dropzone__popover--active';

export class Dropzone {
  hoverClassAdded = false;
  importedTokens = [];
  storedTokens = [];
  wrapper = null;
  saveTokensCallback = () => {}; /**
   * Initialize the dropzone component.
   * @param {HTMLElement} wrapper - The wrapper element for the dropzone.
   * @param {Token[]} storedTokens - The stored tokens to compare against.
   * @param {Function} saveTokensCallback - Callback to save imported tokens.
   */
  constructor(wrapper, storedTokens, saveTokensCallback) {
    this.wrapper = wrapper;
    this.storedTokens = Array.from(storedTokens);
    this.saveTokensCallback = saveTokensCallback;

    wrapper.addEventListener('dragover', (event) => this.handleDragOver(event));
    wrapper.addEventListener('dragleave', (event) =>
      this.handleDragLeave(event),
    );
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

  handleCancelImport() {
    this.wrapper.classList.remove(HOVER_CLASSNAME);
    this.importedTokens = [];
  }

  handleImport() {
    const importsCount = mergeAndSaveTokens(
      this.importedTokens,
      this.storedTokens,
    );
    if (importsCount > 0) {
      this.saveTokensCallback();
      location.reload();
    }
  }

  renderImportDialog() {
    const holder = this.wrapper.querySelector(`.${POPOVER_CLASSNAME}`);
    holder.classList.add(POPOVER_ACTIVE_CLASSNAME);

    holder.innerHTML = `
      <div class="dropzone__info">Found ${this.importedTokens.length} accounts<br />
      Do you want to import them?</div>
      <div class="dropzone__buttons">
        <button class="dropzone__button dropzone__button--cancel">Cancel</button>
        <button class="dropzone__button dropzone__button--ok">Import</button>
      </div>
      `;

    const cancelButton = holder.querySelector('.dropzone__button--cancel');
    const importButton = holder.querySelector('.dropzone__button--ok');

    if (this.importedTokens.length === 0) {
      importButton.setAttribute('disabled', 'disabled');
    }

    cancelButton.addEventListener('click', this.handleCancelImport.bind(this), {
      once: true,
    });
    importButton.addEventListener('click', this.handleImport.bind(this), {
      once: true,
    });

    this.wrapper.classList.add(HOVER_CLASSNAME);
  }

  processFile(file) {
    parseFile(file).then((json) => {
      const tokens = parser2fa(json);

      if (tokens.length) {
        this.importedTokens = tokens;

        this.renderImportDialog();
      }
    });
  }
}
