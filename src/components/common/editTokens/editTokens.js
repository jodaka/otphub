import { getId } from '../../../../js/id.js';
import { EditToken } from './editToken.js';

const HUE_STEP = 45;

export const EditTokens = (wrapper, tokens = [], saveTokensCallback, onChangeCallback) => {
  const abortController = new AbortController();
  let clickHandlerInProcess = false;

  const currentTokens = tokens.map((origToken, index) => ({
    ...origToken,
    id: getId(),
    hueOffset: index * HUE_STEP,
  }));

  const rerender = () => {
    const tokenInstances = currentTokens.map((config, index) => new EditToken(config, index, currentTokens.length));
    const html = tokenInstances.reduce((acc, instance) => {
      acc += instance.render();
      return acc;
    }, '');
    wrapper.innerHTML = `<div class="tokens tokensEdit">${html}</div>`;

    const container = wrapper.querySelector('.tokens.tokensEdit');
    container.addEventListener('click', handleControlClick, { signal: abortController.signal });
  };

  const moveUp = (index) => {
    [currentTokens[index], currentTokens[index - 1]] = [currentTokens[index - 1], currentTokens[index]];
  };

  const moveDown = (index) => {
    [currentTokens[index], currentTokens[index + 1]] = [currentTokens[index + 1], currentTokens[index]];
  };

  const confirmAndDelete = async (index) => {
    const confirmed = await window.__TAURI__.dialog.ask(`Delete "${currentTokens[index].label}"?`, {
      title: 'Delete Token',
      type: 'warning',
    });
    if (!confirmed) {
      return;
    }
    currentTokens.splice(index, 1);
  };

  const handleControlClick = async (e) => {
    if (clickHandlerInProcess) {
      return;
    }

    const btn = e.target.closest('.control');
    if (!btn) return;

    clickHandlerInProcess = true;

    try {
      const action = btn.dataset.action;
      const tokenEl = btn.closest('.token');
      const index = Number(tokenEl.getAttribute('index'));

      if (action === 'up' && index > 0) {
        moveUp(index);
      } else if (action === 'down' && index < currentTokens.length - 1) {
        moveDown(index);
      } else if (action === 'delete') {
        await confirmAndDelete(index);
      } else {
        return;
      }

      const tokensToSave = currentTokens.map(({ id, ...rest }) => rest);
      await saveTokensCallback(tokensToSave);
      onChangeCallback();
    } finally {
      clickHandlerInProcess = false;
    }
  };

  rerender();

  return () => {
    abortController.abort();
  };
};
