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
    
    const extensionsHeader = document.createElement('div');
    extensionsHeader.className = 'aura-extensions-header';
    
    const extensionsTitle = document.createElement('span');
    extensionsTitle.className = 'aura-extensions-title';
    extensionsTitle.textContent = 'Extensions';
    extensionsHeader.appendChild(extensionsTitle);
    
    const builtInBtn = document.createElement('button');
    builtInBtn.id = 'aura-extensions-builtin';
    builtInBtn.className = 'aura-extensions-builtin';
    builtInBtn.setAttribute('aria-label', 'Toggle built-in extensions');
    builtInBtn.textContent = 'Built In';
    extensionsHeader.appendChild(builtInBtn);
    
    const extensionsClose = document.createElement('button');
    extensionsClose.className = 'aura-extensions-close';
    extensionsClose.setAttribute('aria-label', 'Close');
    extensionsClose.textContent = '×';
    extensionsHeader.appendChild(extensionsClose);
    
    const extensionsList = document.createElement('div');
    extensionsList.id = 'aura-extensions-list';
    extensionsList.className = 'aura-extensions-list';
    
    extensionsPopup.appendChild(extensionsHeader);
    extensionsPopup.appendChild(extensionsList);
    root.appendChild(extensionsPopup);

    // Downloads button
    const downloadsBtn = document.createElement('button');
    downloadsBtn.id = 'aura-downloads';
    downloadsBtn.className = 'aura-downloads';
    downloadsBtn.setAttribute('aria-label', 'Downloads');
    downloadsBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>`;
    root.appendChild(downloadsBtn);

    // Downloads panel
    const downloadsPanel = document.createElement('div');
    downloadsPanel.id = 'aura-downloads-panel';
    downloadsPanel.className = 'aura-downloads-panel';
    downloadsPanel.innerHTML = `
      <div class="aura-downloads-header">
        <span>Downloads</span>
        <button class="aura-downloads-close" id="aura-downloads-close" aria-label="Close">×</button>
      </div>
      <div class="aura-downloads-list" id="aura-downloads-list"></div>
    `;
    root.appendChild(downloadsPanel);

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

    // Popup window
    const popup = document.createElement('div');
    popup.id = 'aura-popup';
    popup.className = 'aura-popup';
    
    const popupControls = document.createElement('div');
    popupControls.className = 'aura-popup-controls';
    
    const popupClose = document.createElement('button');
    popupClose.id = 'aura-popup-close';
    popupClose.className = 'aura-popup-btn';
    popupClose.setAttribute('aria-label', 'Close popup');
    popupClose.textContent = '×';
    popupControls.appendChild(popupClose);
    
    const popupMaximize = document.createElement('button');
    popupMaximize.id = 'aura-popup-maximize';
    popupMaximize.className = 'aura-popup-btn';
    popupMaximize.setAttribute('aria-label', 'Open in new tab');
    popupMaximize.textContent = '↗';
    popupControls.appendChild(popupMaximize);
    
    popup.appendChild(popupControls);
    
    const popupIframe = document.createElement('iframe');
    popupIframe.id = 'aura-popup-iframe';
    popupIframe.className = 'aura-popup-iframe';
    popup.appendChild(popupIframe);
    
    root.appendChild(popup);

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
      onTabReorder: (tabs) => {
        if (window.handleAuraAction) {
          window.handleAuraAction({ action: 'reorderTabs', tabs });
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
    
    // Popup event handlers
    const popup = document.getElementById('aura-popup');
    const popupIframe = document.getElementById('aura-popup-iframe');
    const popupClose = document.getElementById('aura-popup-close');
    const popupMaximize = document.getElementById('aura-popup-maximize');
    
    window.addEventListener('aura-show-popup', (e) => {
      if (popup && popupIframe && e.detail?.url) {
        popupIframe.src = e.detail.url;
        popup.classList.add('visible');
      }
    });
    
    window.addEventListener('aura-close-popup', () => {
      if (popup) {
        popup.classList.remove('visible');
        if (popupIframe) {
          popupIframe.src = 'about:blank';
        }
      }
    });
    
    window.addEventListener('aura-maximize-popup', () => {
      if (popupIframe && popupIframe.src && popupIframe.src !== 'about:blank') {
        const url = popupIframe.src;
        window.handleAuraAction({ action: 'newTab', url });
        window.dispatchEvent(new CustomEvent('aura-close-popup'));
      }
    });
    
    if (popupClose) {
      popupClose.addEventListener('click', () => {
        window.dispatchEvent(new CustomEvent('aura-close-popup'));
      });
    }
    
    if (popupMaximize) {
      popupMaximize.addEventListener('click', () => {
        window.dispatchEvent(new CustomEvent('aura-maximize-popup'));
      });
    }
    
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
    const builtInBtn = document.getElementById('aura-extensions-builtin');
    const extensionsList = document.getElementById('aura-extensions-list');
    let showBuiltin = false;
    
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
    
    if (builtInBtn) {
      builtInBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showBuiltin = !showBuiltin;
        builtInBtn.classList.toggle('active', showBuiltin);
        loadExtensions();
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
            
            const filteredAddons = showBuiltin ? addons : addons.filter(addon => {
              return !addon.isBuiltin && addon.type !== 'theme' && !addon.sYSTEMADDON;
            });
            
            if (filteredAddons.length === 0) {
              const msg = showBuiltin ? 'No extensions found' : 'No user extensions installed';
              extensionsList.innerHTML = '<div class="aura-extensions-empty">' + msg + '</div>';
              return;
            }
            
            filteredAddons.forEach(addon => {
              try {
                const item = document.createElement('div');
                item.className = 'aura-extension-item';
                item.dataset.id = addon.id;
                
                const name = addon.name ? String(addon.name) : 'Unknown';
                const icon = addon.iconURL || addon.icon64URL || '';
                
                const iconEl = document.createElement('div');
                iconEl.className = 'aura-extension-icon';
                if (icon) {
                  const img = document.createElement('img');
                  img.src = icon;
                  img.alt = '';
                  iconEl.appendChild(img);
                } else {
                  iconEl.textContent = name.charAt(0).toUpperCase();
                }
                
                const description = addon.description ? String(addon.description) : (addon.version || 'Enabled');
                
                const infoEl = document.createElement('div');
                infoEl.className = 'aura-extension-info';
                
                const nameEl = document.createElement('div');
                nameEl.className = 'aura-extension-name';
                nameEl.textContent = name;
                
                const descEl = document.createElement('div');
                descEl.className = 'aura-extension-desc';
                descEl.textContent = description;
                
                infoEl.appendChild(nameEl);
                infoEl.appendChild(descEl);
                
                item.appendChild(iconEl);
                item.appendChild(infoEl);
                
                const toggle = document.createElement('button');
                toggle.className = 'aura-extension-toggle' + (addon.isActive ? ' enabled' : '');
                toggle.setAttribute('aria-label', 'Toggle extension');
                toggle.dataset.id = addon.id;
                item.appendChild(toggle);
                
                const remove = document.createElement('button');
                remove.className = 'aura-extension-remove';
                remove.setAttribute('aria-label', 'Remove extension');
                remove.dataset.id = addon.id;
                remove.textContent = '×';
                item.appendChild(remove);
                
                extensionsList.appendChild(item);
              } catch (err) {
                console.error('[AuraExtensions] Error rendering addon:', err);
              }
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
