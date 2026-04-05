/* Protocol Aura - Browser Integration Bridge */

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

    window.addEventListener('message', function(e) {
      if (e.data && e.data.type === 'aura-action') {
        console.log('[Aura] Message action:', e.data.action);
        handleAuraAction(e.data);
      }
    });

    function handleAuraAction(data) {
      console.log('[Aura] Action:', data.action, data.url || '');
      const action = data.action;
      const url = data.url;
      const tabId = data.tabId;
      const index = tabId ? parseInt(tabId.replace('tab-', '')) : -1;
      const tab = index >= 0 ? gBrowser.tabs[index] : null;

      switch (action) {
        case 'selectTab':
          if (tab) gBrowser.selectedTab = tab;
          break;
        case 'closeTab':
          if (tab) gBrowser.removeTab(tab);
          break;
        case 'newTab':
          console.log('[Aura] Opening:', url);
          openTrustedLinkIn(url || 'about:newtab', 'tab');
          break;
        case 'navigate':
          if (url) {
            console.log('[Aura] Navigating to:', url);
            openTrustedLinkIn(url, 'current');
          }
          break;
        case 'back':
          gBrowser.goBack();
          break;
        case 'forward':
          gBrowser.goForward();
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
      try {
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
        const iframe = document.getElementById('aura-ui-frame');
        if (iframe && iframe.contentWindow && iframe.contentWindow.auraTabs) {
          iframe.contentWindow.auraTabs.setTabs(tabs);
        }
      } catch (e) {
        console.error('[Aura] Sync tabs error:', e);
      }
    }

    gBrowser.addEventListener('TabOpen', syncTabs);
    gBrowser.addEventListener('TabClose', syncTabs);
    gBrowser.addEventListener('TabSelect', syncTabs);
    gBrowser.addEventListener('TabPinned', syncTabs);
    gBrowser.addEventListener('TabUnpinned', syncTabs);

    setTimeout(syncTabs, 500);

    console.log('[Aura] Ready');
  }
})();
