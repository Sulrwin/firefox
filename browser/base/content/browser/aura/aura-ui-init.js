/* Protocol Aura - UI Loader (Direct DOM) */

(function() {
  if (window.auraUIInitialized) {
    console.log('[AuraUI] Already initialized');
    return;
  }
  window.auraUIInitialized = true;
  
  console.log('[AuraUI] Initializing direct DOM UI...');
  
  let auraTabs = null;

  function createUIElements() {
    const root = document.getElementById('aura-ui-root');
    if (!root) {
      console.error('[AuraUI] No root element found');
      return false;
    }
    
    if (document.getElementById('aura-trigger')) {
      console.log('[AuraUI] Elements already exist');
      return false;
    }

    // Ambient bubbles container
    const ambientContainer = document.createElement('div');
    ambientContainer.id = 'ambient-bubbles';
    ambientContainer.className = 'ambient-bubbles';
    root.appendChild(ambientContainer);

    // Create ambient bubbles
    for (let i = 0; i < 8; i++) {
      const bubble = document.createElement('div');
      bubble.className = 'ambient-bubble';
      const size = 80 + Math.random() * 180;
      bubble.style.width = size + 'px';
      bubble.style.height = size + 'px';
      bubble.style.left = Math.random() * 100 + '%';
      bubble.style.top = Math.random() * 100 + '%';
      bubble.style.animationDuration = (25 + Math.random() * 20) + 's';
      bubble.style.animationDelay = (-Math.random() * 25) + 's';
      bubble.style.opacity = 0.15 + Math.random() * 0.2;
      ambientContainer.appendChild(bubble);
    }

    // Back button
    const backBtn = document.createElement('button');
    backBtn.id = 'aura-back';
    backBtn.className = 'aura-back';
    backBtn.setAttribute('aria-label', 'Go back');
    backBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>';
    root.appendChild(backBtn);

    // Forward button
    const forwardBtn = document.createElement('button');
    forwardBtn.id = 'aura-forward';
    forwardBtn.className = 'aura-forward';
    forwardBtn.setAttribute('aria-label', 'Go forward');
    forwardBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
    root.appendChild(forwardBtn);

    // Trigger orb
    const trigger = document.createElement('button');
    trigger.id = 'aura-trigger';
    trigger.className = 'aura-trigger';
    trigger.setAttribute('aria-label', 'Open tabs');
    root.appendChild(trigger);

    // URL bar container
    const urlBar = document.createElement('div');
    urlBar.id = 'aura-url-bar';
    urlBar.className = 'aura-url-bar';
    
    const urlInput = document.createElement('input');
    urlInput.id = 'aura-url-input';
    urlInput.className = 'aura-url-input';
    urlInput.type = 'text';
    urlInput.placeholder = 'Enter URL or search...';
    urlInput.setAttribute('aria-label', 'Address bar');
    urlBar.appendChild(urlInput);

    const refreshBtn = document.createElement('button');
    refreshBtn.id = 'aura-refresh';
    refreshBtn.className = 'aura-refresh';
    refreshBtn.setAttribute('aria-label', 'Refresh');
    refreshBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>';
    urlBar.appendChild(refreshBtn);

    const extensionsBtn = document.createElement('button');
    extensionsBtn.id = 'aura-extensions';
    extensionsBtn.className = 'aura-extensions';
    extensionsBtn.setAttribute('aria-label', 'Extensions');
    extensionsBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>';
    urlBar.appendChild(extensionsBtn);

    root.appendChild(urlBar);

    // Settings button
    const settingsBtn = document.createElement('button');
    settingsBtn.id = 'aura-settings';
    settingsBtn.className = 'aura-settings';
    settingsBtn.setAttribute('aria-label', 'Settings');
    settingsBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>';
    root.appendChild(settingsBtn);

    // Bubble container
    const bubblesContainer = document.createElement('div');
    bubblesContainer.id = 'aura-bubbles';
    bubblesContainer.className = 'aura-bubble-container';

    // Pinned group
    const pinnedGroup = document.createElement('div');
    pinnedGroup.id = 'aura-pinned';
    pinnedGroup.className = 'aura-pinned-group';
    bubblesContainer.appendChild(pinnedGroup);

    // Separator
    const separator = document.createElement('div');
    separator.className = 'aura-separator';
    bubblesContainer.appendChild(separator);

    // Tab group
    const tabGroup = document.createElement('div');
    tabGroup.id = 'aura-tabs';
    tabGroup.className = 'aura-tab-group';
    bubblesContainer.appendChild(tabGroup);

    // Add button
    const addBtn = document.createElement('button');
    addBtn.id = 'aura-add-tab';
    addBtn.className = 'aura-bubble aura-bubble-add';
    addBtn.setAttribute('aria-label', 'New tab');
    addBtn.textContent = '+';
    bubblesContainer.appendChild(addBtn);

    root.appendChild(bubblesContainer);

    // New tab bar
    const newTabBar = document.createElement('div');
    newTabBar.id = 'aura-new-tab-bar';
    newTabBar.className = 'aura-new-tab-bar';

    const newTabInput = document.createElement('input');
    newTabInput.id = 'aura-new-tab-input';
    newTabInput.className = 'aura-new-tab-input';
    newTabInput.type = 'text';
    newTabInput.placeholder = 'Enter URL or search...';
    newTabInput.setAttribute('aria-label', 'New tab URL');
    newTabBar.appendChild(newTabInput);

    root.appendChild(newTabBar);

    console.log('[AuraUI] DOM elements created');
    return true;
  }

  function initTabs() {
    auraTabs = new AuraBubbleTabs({
      onTabSelect: (tabId) => {
        if (window.handleAuraAction) {
          window.handleAuraAction({ action: 'selectTab', tabId });
        }
      },
      onTabClose: (tabId) => {
        if (window.handleAuraAction) {
          window.handleAuraAction({ action: 'closeTab', tabId });
        }
      },
      onNewTab: (url) => {
        if (window.handleAuraAction) {
          window.handleAuraAction({ action: 'newTab', url });
        }
      },
      onTabPin: (tabId, pinned) => {
        if (window.handleAuraAction) {
          window.handleAuraAction({ action: 'pinTab', tabId, pinned });
        }
      },
      onBack: () => {
        if (window.handleAuraAction) {
          window.handleAuraAction({ action: 'goBack' });
        }
      },
      onForward: () => {
        if (window.handleAuraAction) {
          window.handleAuraAction({ action: 'goForward' });
        }
      },
      onRefresh: () => {
        if (window.handleAuraAction) {
          window.handleAuraAction({ action: 'refresh' });
        }
      },
      onExtensions: () => {
        if (window.handleAuraAction) {
          window.handleAuraAction({ action: 'openExtensions' });
        }
      },
      onSettings: () => {
        if (window.handleAuraAction) {
          window.handleAuraAction({ action: 'openSettings' });
        }
      }
    });

    window.auraBubbleTabs = auraTabs;
    console.log('[AuraUI] AuraBubbleTabs initialized');
  }

  function init() {
    if (!createUIElements()) return;
    initTabs();
    
    window.addEventListener('aura-sync-tabs', (e) => {
      if (auraTabs && e.detail && e.detail.tabs) {
        auraTabs.setTabs(e.detail.tabs);
      }
    });
    
    console.log('[AuraUI] Initialization complete');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
