/* Protocol Aura - Browser Integration Bridge */

(function() {
  const AURA_ENABLED = true;

  if (!AURA_ENABLED) return;

  window.addEventListener('load', initAuraBridge, { once: true });

  function initAuraBridge() {
    if (window.auraBridgeInitialized) return;
    window.auraBridgeInitialized = true;

    if (!window.gBrowser) return;

    window.addEventListener('message', function(e) {
      if (e.data && e.data.type === 'aura-action') {
        handleAuraAction(e.data);
      }
    });

    function handleAuraAction(data) {
      const action = data.action;
      const url = data.url;
      const tabId = data.tabId;
      const pinned = data.pinned;
      const index = tabId ? parseInt(tabId.replace('tab-', '')) : -1;
      const tab = index >= 0 && index < gBrowser.tabs.length ? gBrowser.tabs[index] : null;

      switch (action) {
        case 'selectTab':
          if (tab) {
            gBrowser.selectedTab = tab;
          }
          break;
        case 'closeTab':
          if (tab) {
            gBrowser.removeTab(tab);
          }
          break;
        case 'newTab':
          gBrowser.selectedTab = gBrowser.addTrustedTab(url || 'about:newtab');
          break;
        case 'navigate':
          if (url && gBrowser.selectedBrowser) {
            try {
              openWebLinkIn(url, 'current', {
                triggerBrowser: gBrowser.selectedBrowser,
                initiatingWindow: window
              });
              setTimeout(syncTabs, 500);
            } catch (e) {
              gBrowser.selectedBrowser.loadURI(url);
              setTimeout(syncTabs, 500);
            }
          }
          break;
        case 'goBack':
          if (gBrowser.selectedBrowser?.canGoBack) {
            gBrowser.selectedBrowser.goBack();
          }
          break;
        case 'goForward':
          if (gBrowser.selectedBrowser?.canGoForward) {
            gBrowser.selectedBrowser.goForward();
          }
          break;
        case 'refresh':
          if (gBrowser.selectedBrowser) {
            gBrowser.selectedBrowser.reload();
          }
          break;
        case 'pinTab':
          if (tab && tab.togglePinned) {
            tab.togglePinned();
          }
          break;
        case 'openExtensions':
          if (window.openExtensionsPanel) {
            openExtensionsPanel();
          }
          break;
        case 'openSettings':
          openPreferences();
          break;
      }
    }

    window.handleAuraAction = handleAuraAction;

    function syncTabs() {
      try {
        const tabs = [];
        let currentUrl = '';
        for (let i = 0; i < gBrowser.tabs.length; i++) {
          const tab = gBrowser.tabs[i];
          let url = '';
          let title = tab.label || 'New Tab';
          
          if (tab.linkedBrowser) {
            url = tab.linkedBrowser.currentURI?.spec || '';
          }
          
          tabs.push({
            id: 'tab-' + i,
            title: title,
            url: url,
            favicon: tab.image || null,
            pinned: tab.pinned || false,
            loading: tab.getAttribute('busy') === 'true',
            active: tab.selected
          });
          if (tab.selected) {
            currentUrl = url;
          }
        }
        
        if (window.auraBubbleTabs) {
          window.auraBubbleTabs.setTabs(tabs);
          if (currentUrl) {
            window.auraBubbleTabs.updateUrlBar(currentUrl);
          }
        }
        
        window.dispatchEvent(new CustomEvent('aura-sync-tabs', { detail: { tabs } }));
      } catch (e) {
        console.error('[Aura] Sync tabs error:', e);
      }
    }

    // Use polling for tab sync since events may not fire reliably
    let lastTabCount = gBrowser.tabs.length;
    setInterval(() => {
      if (gBrowser.tabs.length !== lastTabCount || gBrowser.selectedTab !== window._lastSelectedTab) {
        lastTabCount = gBrowser.tabs.length;
        window._lastSelectedTab = gBrowser.selectedTab;
        syncTabs('poll');
      }
    }, 500);

    // Also try events as backup
    gBrowser.addEventListener('TabOpen', () => syncTabs('TabOpen'));
    gBrowser.addEventListener('TabClose', () => syncTabs('TabClose'));
    gBrowser.addEventListener('TabSelect', () => syncTabs('TabSelect'));

    setTimeout(syncTabs, 500);
  }
})();
