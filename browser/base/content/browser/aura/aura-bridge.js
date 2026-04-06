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
            } catch (e) {
              try {
                gBrowser.selectedBrowser.loadURI(url);
              } catch (e2) {
                gBrowser.loadURI(url, {
                  triggeringPrincipal: Services.scriptSecurityManager.getSystemPrincipal(),
                  targetBrowser: gBrowser.selectedBrowser
                });
              }
            }
            // Sync multiple times to catch favicon updates
            setTimeout(syncTabs, 100);
            setTimeout(syncTabs, 500);
            setTimeout(syncTabs, 1500);
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
          if (tab) {
            const pinned = data.pinned;
            const tabBrowserId = tab.linkedBrowser?.outerWindowID || tab._tPos;
            const storageKey = 'aura-tab-pinned-' + tabBrowserId;
            if (pinned) {
              localStorage.setItem(storageKey, 'true');
              gBrowser.pinTab(tab);
            } else {
              localStorage.removeItem(storageKey);
              gBrowser.unpinTab(tab);
            }
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
        case 'reorderTabs':
          try {
            const tabs = data.tabs;
            for (let i = 0; i < tabs.length; i++) {
              const tabId = tabs[i].id;
              const tabIndex = parseInt(tabId.replace('tab-', ''));
              if (tabIndex >= 0 && tabIndex < gBrowser.tabs.length) {
                const tab = gBrowser.tabs[tabIndex];
                if (tab._tPos !== i) {
                  gBrowser.moveTabTo(tab, i);
                }
              }
            }
          } catch (e) {
            console.error('[Aura] Reorder tabs error:', e);
          }
          break;
      }
    }

    window.handleAuraAction = handleAuraAction;

    function syncTabs() {
      try {
        const tabs = [];
        let currentUrl = '';
        let currentFavicon = null;
        for (let i = 0; i < gBrowser.tabs.length; i++) {
          const tab = gBrowser.tabs[i];
          let url = '';
          let title = tab.label || 'New Tab';
          
          if (tab.linkedBrowser) {
            url = tab.linkedBrowser.currentURI?.spec || '';
          }
          
          const favicon = tab.image || null;
          const tabBrowserId = tab.linkedBrowser?.outerWindowID;
          const tabId = 'tab-' + i;
          const storageKey = tabBrowserId ? 'aura-tab-pinned-' + tabBrowserId : 'aura-tab-pinned-' + i;
          const localPinned = localStorage.getItem(storageKey) === 'true';
          const isPinned = tab.pinned || localPinned;
          
          tabs.push({
            id: tabId,
            title: title,
            url: url,
            favicon: favicon,
            pinned: isPinned,
            loading: tab.getAttribute('busy') === 'true',
            active: tab.selected
          });
          if (tab.selected) {
            currentUrl = url;
            currentFavicon = favicon;
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

    // Use polling for tab sync - more frequent
    let lastTabCount = gBrowser.tabs.length;
    let lastSelectedIndex = -1;
    let lastSelectedUrl = '';
    let lastFavicon = '';
    setInterval(() => {
      const currentIndex = gBrowser.tabContainer.selectedIndex;
      const currentTab = gBrowser.selectedTab;
      const currentUrl = currentTab?.linkedBrowser?.currentURI?.spec || '';
      const currentFavicon = currentTab?.image || '';
      
      if (gBrowser.tabs.length !== lastTabCount || 
          currentIndex !== lastSelectedIndex || 
          currentUrl !== lastSelectedUrl ||
          currentFavicon !== lastFavicon) {
        lastTabCount = gBrowser.tabs.length;
        lastSelectedIndex = currentIndex;
        lastSelectedUrl = currentUrl;
        lastFavicon = currentFavicon;
        syncTabs();
      }
    }, 200);

    // Also listen to browser events
    gBrowser.addEventListener('TabOpen', () => syncTabs());
    gBrowser.addEventListener('TabClose', () => syncTabs());
    gBrowser.addEventListener('TabSelect', () => syncTabs());
    
    // Listen for page load events
    gBrowser.addEventListener('load', (e) => {
      if (e.target === gBrowser.selectedBrowser?.contentDocument) {
        syncTabs();
      }
    }, true);

    setTimeout(syncTabs, 500);
  }
})();
