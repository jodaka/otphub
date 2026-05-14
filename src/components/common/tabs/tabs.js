/**
 * Renders the bottom tab navigation and handles tab switching.
 *
 * @param {string} activeTab - The initially active tab name ('otp', 'edit', or 'settings').
 * @param {Function} onTabChange - Callback fired when a tab is clicked.
 */
export const Tabs = (activeTab, onTabChange) => {
  const tabs = document.querySelector('.tabs');
  let clickHandlerInProcess = false;

  /**
   * Updates the visual active state of the tabs.
   * @param {string} newActiveTab - The tab to mark as active.
   */
  const updateActiveTab = (newActiveTab) => {
    const oldActiveTab = tabs.querySelector('.tab.active');
    if (oldActiveTab) {
      oldActiveTab.classList.remove('active');
    }
    const btn = tabs.querySelector(`.tab[data-action="${newActiveTab}"]`);
    if (btn) {
      btn.classList.add('active');
    }
  };

  const handleTabsClick = (evt) => {
    if (clickHandlerInProcess) {
      return;
    }

    const btn = evt.target.closest('.tab');
    if (!btn) {
      return;
    }

    clickHandlerInProcess = true;

    try {
      const newActiveTab = btn.dataset.action;
      updateActiveTab(newActiveTab);
      if (typeof onTabChange === 'function') {
        onTabChange(newActiveTab);
      }
    } finally {
      clickHandlerInProcess = false;
    }
  };

  tabs.addEventListener('click', handleTabsClick);
  updateActiveTab(activeTab);
};
