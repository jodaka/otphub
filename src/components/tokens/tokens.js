import { Token } from "./token.js";
import { Secret } from "./otpauth.esm.js";
const { writeText } = window.__TAURI__.clipboardManager;
// import { writeText } from "@tauri-apps/plugin-clipboard-manager";

let windowIsVisible = true;

// full render
const rerenderAllTokens = (wrapper, tokens) => {
  const html = tokens.reduce((acc, instance) => {
    instance.updateToken();
    acc += instance.render();
    return acc;
  }, "");
  wrapper.innerHTML = `<div class="tokens">${html}</div>`;
};

const handleTokenClick = async (e, tokenInstances) => {
  const tokenWrapper = e.target.closest(".token");
  if (tokenWrapper) {
    const index = tokenWrapper.getAttribute("index");
    const token = tokenInstances[index];

    await writeText(token.token);
    token.tokenValueRef.innerText = "Copied";

    setTimeout(() => {
      token.tokenValueRef.innerHTML = token.getTokenHTML();
    }, 2500);
  }
};

export const Tokens = (wrapper, tokens = []) => {
  // generate uniq IDs
  const tokensWithId = tokens.map((origToken) => ({
    ...origToken,
    id: "id" + new Secret({ size: 10 }).hex,
  }));

  const tokenInstances = tokensWithId.map((config, index) => new Token(config, index, wrapper));

  // handle click on token
  wrapper.addEventListener("click", (e) => {
    handleTokenClick(e, tokenInstances);
  });

  let updateInterval;
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

  const toggleObserver = (method = "observe") => {
    if (!visibilityObserver) {
      console.warn("visibilityObserver not initialized");
      return;
    }

    console.log("toggleObserver", method);
    wrapper
      .querySelectorAll(".token")
      .forEach((instanceDomNode) => visibilityObserver[method](instanceDomNode));
  };

  const trackTokensVisibility = () => {
    // this is used to skip rerendering of elements that are not in viewport
    visibilityObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const tokenInstance = tokenInstances[Number(entry.target.getAttribute("index"))];
          tokenInstance.isInViewport = entry.isIntersecting;
        });
      },
      {
        root: wrapper,
        rootMargin: "0px 0px 0px 0px",
        threshold: 0,
      },
    );
  };
  let initComplete = false;

  document.addEventListener("visibilitychange", () => {
    if (!initComplete) {
      return;
    }
    if (document.hidden) {
      windowIsVisible = false;
    } else {
      windowIsVisible = true;

      tokenInstances.forEach((instance) => {
        instance.renderToken();
      });
    }
  });

  rerenderAllTokens(wrapper, tokenInstances);
  restartUpdateInterval();
  trackTokensVisibility();
  toggleObserver("observe");

  initComplete = true;
};
