/* Protocol Aura - UI Loader (Direct DOM) */

(function() {
  if (window.auraUIInitialized) return;
  window.auraUIInitialized = true;
  
  let auraTabs = null;

    function createUIElements() {
    const root = document.getElementById('aura-ui-root');
    if (!root) return false;
    if (document.getElementById('aura-trigger')) return false;

    // Back button
    const backBtn = document.createElement('button');
    backBtn.id = 'aura-back';
    backBtn.className = 'aura-back';
    backBtn.setAttribute('aria-label', 'Go back');
    backBtn.textContent = '←';
    root.appendChild(backBtn);

    // Forward button
    const forwardBtn = document.createElement('button');
    forwardBtn.id = 'aura-forward';
    forwardBtn.className = 'aura-forward';
    forwardBtn.setAttribute('aria-label', 'Go forward');
    forwardBtn.textContent = '→';
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
    
    const refreshBtn = document.createElement('button');
    refreshBtn.id = 'aura-refresh';
    refreshBtn.className = 'aura-refresh';
    refreshBtn.setAttribute('aria-label', 'Refresh');
    refreshBtn.textContent = '↻';
    urlBar.appendChild(refreshBtn);

    const urlInput = document.createElement('input');
    urlInput.id = 'aura-url-input';
    urlInput.className = 'aura-url-input';
    urlInput.type = 'text';
    urlInput.placeholder = 'Enter URL or search...';
    urlInput.setAttribute('aria-label', 'Address bar');
    urlBar.appendChild(urlInput);

    const extensionsBtn = document.createElement('button');
    extensionsBtn.id = 'aura-extensions';
    extensionsBtn.className = 'aura-extensions';
    extensionsBtn.setAttribute('aria-label', 'Extensions');
    extensionsBtn.textContent = '⚙';
    urlBar.appendChild(extensionsBtn);

    root.appendChild(urlBar);

    // Settings button
    const settingsBtn = document.createElement('button');
    settingsBtn.id = 'aura-settings';
    settingsBtn.className = 'aura-settings';
    settingsBtn.setAttribute('aria-label', 'Settings');
    settingsBtn.textContent = '☰';
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
  }

  function init() {
    if (!createUIElements()) return;
    initTabs();
    
    window.addEventListener('aura-sync-tabs', (e) => {
      if (auraTabs && e.detail && e.detail.tabs) {
        auraTabs.setTabs(e.detail.tabs);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
