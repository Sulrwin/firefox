/* Protocal Aura - Browser Integration Bridge */

(function() {
  const AURA_ENABLED = true;

  console.log('[Aura] aura-bridge.js loaded');

  if (!AURA_ENABLED) return;

  window.addEventListener('load', initAuraBridge, { once: true });

  function initAuraBridge() {
    if (window.auraBridgeInitialized) return;
    window.auraBridgeInitialized = true;

    console.log('[Aura] Bridge init');

    if (!window.gBrowser) {
      console.error('[Aura] No gBrowser');
      return;
    }

    function handleAuraAction(data) {
      console.log('[Aura] Action:', data.type, data.url || '');
      const { type, url } = data;
      const tabId = data.tabId || data.id;
      const index = tabId ? parseInt(tabId.replace('tab-', '')) : -1;
      const tab = index >= 0 ? gBrowser.tabs[index] : null;

      switch (type) {
        case 'selectTab':
          if (tab) gBrowser.selectTabAtIndex(index);
          break;
        case 'closeTab':
          if (tab) gBrowser.removeTab(tab);
          break;
        case 'newTab':
          console.log('[Aura] Opening:', url);
          gBrowser.selectedTab = gBrowser.addTab(url || 'about:newtab');
          break;
        case 'back':
          if (window.history.length > 1) window.history.back();
          break;
        case 'forward':
          window.history.forward();
          break;
        case 'refresh':
          BrowserReload();
          break;
        case 'settings':
          openPreferences();
          break;
      }
    }

    window.handleAuraAction = handleAuraAction;

    function syncTabs() {
      const tabs = [];
      for (let i = 0; i < gBrowser.tabs.length; i++) {
        const browser = gBrowser.tabs[i];
        tabs.push({
          id: 'tab-' + i,
          title: browser.label || 'New Tab',
          url: browser.currentURI?.spec || '',
          favicon: browser.image || null,
          pinned: browser.pinned || false,
          loading: browser.getAttribute('busy') === 'true',
          active: browser.selected
        });
      }
      if (window.updateTabs) {
        window.updateTabs(tabs);
      }
    }

    gBrowser.addEventListener('TabOpen', syncTabs);
    gBrowser.addEventListener('TabClose', syncTabs);
    gBrowser.addEventListener('TabSelect', syncTabs);
    gBrowser.addEventListener('TabPinned', syncTabs);
    gBrowser.addEventListener('TabUnpinned', syncTabs);

    setTimeout(syncTabs, 100);

    console.log('[Aura] Ready');
  }
})();
