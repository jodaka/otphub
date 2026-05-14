import { getId } from '../../../../js/id.js';
import { Token } from './token.js';

const { writeText } = window.__TAURI__.clipboardManager;

let windowIsVisible = true;

/**
 * Renders all token instances into the wrapper element.
 *
 * @param {HTMLElement} wrapper - The container element.
 * @param {Token[]} tokens - Array of Token class instances.
 */
// full render
const rerenderAllTokens = (wrapper, tokens) => {
  const html = tokens.reduce((acc, instance) => {
    instance.updateToken();
    acc += instance.render();
    return acc;
  }, '');
  wrapper.innerHTML = `<div class="tokens">${html}</div>`;
};

/**
 * Handles click on a token card: copies the token to clipboard and shows a "Copied" feedback.
 *
 * @param {MouseEvent} e - The click event.
 * @param {Token[]} tokenInstances - Array of Token instances.
 */
const handleTokenClick = async (e, tokenInstances) => {
  const tokenWrapper = e.target.closest('.token');
  if (tokenWrapper) {
    const index = tokenWrapper.getAttribute('index');
    const token = tokenInstances[index];

    await writeText(token.token);
    token.tokenValueRef.innerText = 'Copied';

    setTimeout(() => {
      token.tokenValueRef.innerHTML = token.getTokenHTML();
    }, 2500);
  }
};

/**
 * Creates the Tokens tab with live countdown, visibility tracking, and clipboard copy.
 *
 * @param {HTMLElement} wrapper - The DOM element to render into.
 * @param {import('../../../../js/types.js').Token[]} tokens - The stored tokens.
 * @returns {Function} Cleanup function that removes listeners and intervals.
 */
export const TokensTab = (wrapper, tokens = []) => {
  const abortController = new AbortController();

  // generate uniq IDs
  const tokensWithId = tokens.map((origToken) => ({
    ...origToken,
    id: getId(),
  }));

  const tokenInstances = tokensWithId.map((config, index) => new Token(config, index, wrapper));

  // handle click on token
  wrapper.addEventListener(
    'click',
    (e) => {
      handleTokenClick(e, tokenInstances);
    },
    { signal: abortController.signal },
  );

  let updateInterval;

  /**
   * Restarts the interval that updates token countdowns every 80ms.
   */
  const restartUpdateInterval = () => {
    if (updateInterval) {
      clearInterval(updateInterval);
    }

    updateInterval = setInterval(() => {
      if (windowIsVisible) {
        tokenInstances.forEach((instance) => {
          instance.updateCounter();
        });
      }
    }, 80);
  };

  let visibilityObserver;

  const toggleObserver = (method = 'observe') => {
    if (!visibilityObserver) {
      console.warn('visibilityObserver not initialized');
      return;
    }

    // console.log('toggleObserver', method);
    wrapper.querySelectorAll('.token').forEach((instanceDomNode) => visibilityObserver[method](instanceDomNode));
  };

  const trackTokensVisibility = () => {
    // this is used to skip rerendering of elements that are not in viewport
    visibilityObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const tokenInstance = tokenInstances[Number(entry.target.getAttribute('index'))];
          tokenInstance.isInViewport = entry.isIntersecting;
        });
      },
      {
        root: wrapper,
        rootMargin: '0px 0px 0px 0px',
        threshold: 0,
      },
    );
  };
  let initComplete = false;

  document.addEventListener(
    'visibilitychange',
    () => {
      if (!initComplete) {
        return;
      }
      if (document.hidden) {
        windowIsVisible = false;
      } else {
        windowIsVisible = true;

        tokenInstances.forEach((instance) => {
          instance.renderToken();
          instance.updateCounter();
        });
      }
    },
    { signal: abortController.signal },
  );

  rerenderAllTokens(wrapper, tokenInstances);
  restartUpdateInterval();
  trackTokensVisibility();
  toggleObserver('observe');

  initComplete = true;

  return () => {
    abortController.abort();
    if (updateInterval) {
      clearInterval(updateInterval);
    }
    if (visibilityObserver) {
      visibilityObserver.disconnect();
    }
  };
};
