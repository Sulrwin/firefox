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
    
    // Project button
    const projectBtn = document.createElement('button');
    projectBtn.id = 'aura-project';
    projectBtn.className = 'aura-project';
    projectBtn.setAttribute('aria-label', 'Project Aura');
    projectBtn.textContent = 'A';
    urlBar.appendChild(projectBtn);

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
    extensionsBtn.textContent = '🧩';
    urlBar.appendChild(extensionsBtn);

    const settingsBtn = document.createElement('button');
    settingsBtn.id = 'aura-settings';
    settingsBtn.className = 'aura-settings';
    settingsBtn.setAttribute('aria-label', 'Settings');
    settingsBtn.textContent = '⚙';
    urlBar.appendChild(settingsBtn);

    root.appendChild(urlBar);

    // Extensions popup
    const extensionsPopup = document.createElement('div');
    extensionsPopup.id = 'aura-extensions-popup';
    extensionsPopup.className = 'aura-extensions-popup';
    extensionsPopup.innerHTML = `
      <div class="aura-extensions-header">
        <span class="aura-extensions-title">Extensions</span>
        <button class="aura-extensions-close" aria-label="Close">×</button>
      </div>
      <div class="aura-extensions-list" id="aura-extensions-list"></div>
    `;
    root.appendChild(extensionsPopup);

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
    
    const settingsStandalone = document.getElementById('aura-settings-standalone');
    if (settingsStandalone) {
      settingsStandalone.addEventListener('click', () => {
        if (window.handleAuraAction) {
          window.handleAuraAction({ action: 'openSettings' });
        }
      });
    }
    
    // Extensions popup handlers
    const extensionsBtn = document.getElementById('aura-extensions');
    const extensionsPopup = document.getElementById('aura-extensions-popup');
    const extensionsClose = extensionsPopup?.querySelector('.aura-extensions-close');
    const extensionsList = document.getElementById('aura-extensions-list');
    
    if (extensionsBtn && extensionsPopup) {
      extensionsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isVisible = extensionsPopup.classList.contains('visible');
        extensionsPopup.classList.toggle('visible');
        if (!isVisible) {
          loadExtensions();
        }
      });
    }
    
    if (extensionsClose) {
      extensionsClose.addEventListener('click', (e) => {
        e.stopPropagation();
        extensionsPopup.classList.remove('visible');
      });
    }
    
    document.addEventListener('click', (e) => {
      if (extensionsPopup?.classList.contains('visible') && 
          !extensionsPopup.contains(e.target)) {
        extensionsPopup.classList.remove('visible');
      }
    });
    
    function loadExtensions() {
      if (!extensionsList) return;
      
      try {
        if (typeof AddonManager !== 'undefined') {
          AddonManager.getAddonsByTypes(['extension']).then(addons => {
            extensionsList.innerHTML = '';
            
            if (addons.length === 0) {
              extensionsList.innerHTML = '<div class="aura-extensions-empty">No extensions installed</div>';
              return;
            }
            
            addons.forEach(addon => {
              const item = document.createElement('div');
              item.className = 'aura-extension-item';
              item.dataset.id = addon.id;
              
              const icon = addon.iconURL || addon.icon64URL || '';
              const iconContent = icon ? 
                `<img src="${icon}" alt="">` : 
                addon.name.charAt(0).toUpperCase();
              
              const isBuiltin = addon.isBuiltin || addon.type === 'theme' || addon.sYSTEMADDON;
              const description = addon.description || addon.version || 'Enabled';
              const builtinBadge = isBuiltin ? '<span class="aura-extension-builtin">Built-in</span>' : '';
              
              item.innerHTML = `
                <div class="aura-extension-icon">${iconContent}</div>
                <div class="aura-extension-info">
                  <div class="aura-extension-name">${addon.name}${builtinBadge}</div>
                  <div class="aura-extension-desc">${description}</div>
                </div>
                ${isBuiltin ? '' : `
                  <button class="aura-extension-toggle ${addon.isActive ? 'enabled' : ''}" 
                          aria-label="Toggle extension" 
                          data-id="${addon.id}"></button>
                  <button class="aura-extension-remove" aria-label="Remove extension" data-id="${addon.id}">×</button>
                `}
              `;
              
              extensionsList.appendChild(item);
            });
            
            // Toggle handler
            extensionsList.querySelectorAll('.aura-extension-toggle').forEach(toggle => {
              toggle.addEventListener('click', async (e) => {
                e.stopPropagation();
                const id = toggle.dataset.id;
                try {
                  const addon = await AddonManager.getAddonByID(id);
                  if (addon.isActive) {
                    await addon.disable();
                  } else {
                    await addon.enable();
                  }
                  toggle.classList.toggle('enabled');
                } catch (err) {
                  console.error('[AuraExtensions] Toggle error:', err);
                }
              });
            });
            
            // Remove handler
            extensionsList.querySelectorAll('.aura-extension-remove').forEach(btn => {
              btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const id = btn.dataset.id;
                try {
                  const addon = await AddonManager.getAddonByID(id);
                  if (confirm(`Remove "${addon.name}"?`)) {
                    await addon.uninstall();
                    loadExtensions();
                  }
                } catch (err) {
                  console.error('[AuraExtensions] Remove error:', err);
                }
              });
            });
          }).catch(err => {
            console.error('[AuraExtensions] Load error:', err);
            extensionsList.innerHTML = '<div class="aura-extensions-empty">Could not load extensions</div>';
          });
        } else {
          extensionsList.innerHTML = '<div class="aura-extensions-empty">AddonManager not available</div>';
        }
      } catch (err) {
        console.error('[AuraExtensions] Error:', err);
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
