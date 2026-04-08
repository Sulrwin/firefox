/* Protocol Aura - Browser Integration Bridge */

(function() {
  const AURA_ENABLED = true;

  if (!AURA_ENABLED) return;

  window.addEventListener('load', initAuraBridge, { once: true });

  const pinnedUrls = new Map();

  function savePinnedUrls() {
    try {
      const data = JSON.stringify([...pinnedUrls.entries()]);
      if (typeof SessionStore !== 'undefined') {
        SessionStore.setGlobalValue('auraPinnedUrls', data);
      }
    } catch (e) {}
  }

  function loadPinnedUrls() {
    try {
      if (typeof SessionStore !== 'undefined') {
        const data = SessionStore.getGlobalValue('auraPinnedUrls');
        if (data) {
          const entries = JSON.parse(data);
          entries.forEach(([key, value]) => {
            pinnedUrls.set(parseInt(key), value);
          });
        }
      }
    } catch (e) {}
  }

  function initAuraBridge() {
    if (window.auraBridgeInitialized) return;
    window.auraBridgeInitialized = true;

    if (!window.gBrowser) return;

    loadPinnedUrls();

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
        case 'navigateInPopup':
          if (url) {
            window.dispatchEvent(new CustomEvent('aura-show-popup', { detail: { url } }));
          }
          break;
        case 'closePopup':
          window.dispatchEvent(new CustomEvent('aura-close-popup'));
          break;
        case 'maximizePopup':
          window.dispatchEvent(new CustomEvent('aura-maximize-popup'));
          break;
        case 'newTab':
          gBrowser.selectedTab = gBrowser.addTrustedTab(url || 'about:newtab');
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
          try {
            if (tab) {
              const pinned = data.pinned;
              const tabIndex = index;
              console.log('[Aura] pinTab called:', { tabIndex, pinned, tabId: data.tabId });
              if (pinned) {
                if (gBrowser.pinTab) {
                  gBrowser.pinTab(tab);
                } else if (tab.pinned !== undefined) {
                  tab.pinned = true;
                }
                const currentUrl = tab.linkedBrowser?.currentURI?.spec || '';
                console.log('[Aura] Storing pinned URL:', currentUrl, 'at index:', tabIndex);
                if (currentUrl && currentUrl !== 'about:blank') {
                  pinnedUrls.set(tabIndex, currentUrl);
                }
              } else {
                if (gBrowser.unpinTab) {
                  gBrowser.unpinTab(tab);
                } else if (tab.pinned !== undefined) {
                  tab.pinned = false;
                }
                pinnedUrls.delete(tabIndex);
              }
            }
          } catch (e) {
            console.error('[Aura] Pin tab error:', e);
          }
          break;
        case 'restorePinnedUrl':
        case 'repinUrl':
          try {
            const idx = parseInt(tabId?.replace('tab-', ''));
            if (idx >= 0 && idx < gBrowser.tabs.length) {
              const actualTab = gBrowser.tabs[idx];
              if (actualTab?.pinned) {
                if (action === 'restorePinnedUrl') {
                  const pinnedUrl = pinnedUrls.get(idx);
                  console.log('[Aura] Restore URL:', { idx, pinnedUrl, currentUrl: actualTab.linkedBrowser?.currentURI?.spec });
                  if (pinnedUrl && actualTab.linkedBrowser) {
                    gBrowser.selectedTab = actualTab;
                    try {
                      const principal = Services.scriptSecurityManager.getSystemPrincipal();
                      actualTab.linkedBrowser.loadURI(pinnedUrl, { triggeringPrincipal: principal });
                    } catch (e) {
                      actualTab.linkedBrowser.loadURI(pinnedUrl);
                    }
                  } else {
                    console.log('[Aura] No pinned URL found for idx:', idx, 'pinnedUrls:', [...pinnedUrls.entries()]);
                  }
                } else {
                  const currentUrl = actualTab.linkedBrowser?.currentURI?.spec || '';
                  if (currentUrl) {
                    pinnedUrls.set(idx, currentUrl);
                    savePinnedUrls();
                    syncTabs();
                  }
                }
              }
            }
          } catch (e) {
            console.error('[Aura] ' + action + ' error:', e);
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
          if (!title || title === 'about:blank') {
            title = 'New Tab';
          }
          
          if (tab.linkedBrowser) {
            url = tab.linkedBrowser.currentURI?.spec || '';
          }
          
          const favicon = tab.image || null;
          const tabId = 'tab-' + i;
          const isPinned = tab.pinned || false;
          
          if (isPinned && url && url !== 'about:blank') {
            if (!pinnedUrls.has(i)) {
              pinnedUrls.set(i, url);
              savePinnedUrls();
              console.log('[Aura] Stored pinned URL:', { i, url });
            }
          }
          
          const pinnedUrl = pinnedUrls.get(i) || null;
          const urlChanged = isPinned && pinnedUrl && url !== pinnedUrl && !url.startsWith(pinnedUrl);
          
          tabs.push({
            id: tabId,
            title: title,
            url: url,
            favicon: favicon,
            pinned: isPinned,
            pinnedUrl: pinnedUrl,
            urlChanged: urlChanged,
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

    // Intercept new tab creation and redirect to popup
    gBrowser.addEventListener('TabOpen', (e) => {
      const tab = e.target;
      let url = null;
      
      if (tab?.linkedBrowser?.currentURI?.spec) {
        url = tab.linkedBrowser.currentURI.spec;
      }
      
      if (url && !url.startsWith('about:') && !url.startsWith('chrome:')) {
        setTimeout(() => {
          if (tab && tab.parentNode) {
            gBrowser.removeTab(tab);
          }
        }, 10);
        window.dispatchEvent(new CustomEvent('aura-show-popup', { detail: { url } }));
      }
      syncTabs();
    });
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
