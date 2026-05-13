export const Tabs = (activeTab, onTabChange) => {
  const tabs = document.querySelector('.tabs');
  let clickHandlerInProcess = false;

  const updateActiveTab = (newActiveTab) => {
    const oldActiveTab = tabs.querySelector('.tab.active');
    if (oldActiveTab) {
      oldActiveTab.classList.remove('active');
    }
    const btn = tabs.querySelector(`.tab[data-action="${newActiveTab}"]`);
    if (btn) {
      btn.classList.add('active');
    }
    console.log(123, oldActiveTab, btn);
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
  updateActiveTab();
};
