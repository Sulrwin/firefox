/**
 * Protocal Aura - Living Bubble Tab Controller
 */

class AuraBubbleTabs {
  constructor(options = {}) {
    this.tabs = [];
    this.isExpanded = false;
    this.onTabSelect = options.onTabSelect || (() => {});
    this.onTabClose = options.onTabClose || (() => {});
    this.onNewTab = options.onNewTab || (() => {});
    this.onTabPin = options.onTabPin || (() => {});
    this.onBack = options.onBack || (() => {});
    this.onForward = options.onForward || (() => {});
    this.onRefresh = options.onRefresh || (() => {});
    this.onExtensions = options.onExtensions || (() => {});
    this.onSettings = options.onSettings || (() => {});
    
    this._backDismissed = false;
    this._backLeftZone = false;
    this._forwardDismissed = false;
    this._forwardLeftZone = false;
    this._triggerDismissed = false;
    this._triggerLeftZone = false;
    
    this.elements = {};
    
    this.init();
  }

  init() {
    this.createDOM();
    this.bindEvents();
  }

  createDOM() {
    const root = document.getElementById('aura-ui-root') || document.body;
    
    root.innerHTML = `
      <div class="ambient-bubbles" id="ambient-bubbles"></div>
      
      <button class="aura-back" id="aura-back" aria-label="Go back">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
      </button>

      <button class="aura-forward" id="aura-forward" aria-label="Go forward">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 18l6-6-6-6"/>
        </svg>
      </button>

      <div class="aura-url-bar" id="aura-url-bar">
        <button class="aura-refresh" id="aura-refresh" aria-label="Refresh">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M23 4v6h-6M1 20v-6h6"/>
            <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
          </svg>
        </button>
        <input type="text" class="aura-url-input" id="aura-url-input" placeholder="Enter URL...">
        <button class="aura-extensions" id="aura-extensions" aria-label="Extensions">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
        </button>
      </div>

      <button class="aura-trigger" id="aura-trigger" aria-label="Open tabs">
        <span class="aura-trigger-icon">+</span>
      </button>

      <div class="aura-bubble-container" id="aura-bubbles">
        <div class="aura-pinned-group" id="aura-pinned"></div>
        <div class="aura-separator"></div>
        <div class="aura-tab-group" id="aura-tabs"></div>
        <button class="aura-bubble aura-bubble-add" id="aura-add-tab" aria-label="New tab"></button>
      </div>

      <div class="aura-new-tab-bar" id="aura-new-tab-bar">
        <input type="text" class="aura-new-tab-input" id="aura-new-tab-input" placeholder="Search or enter URL...">
      </div>

      <button class="aura-settings" id="aura-settings" aria-label="Settings">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/>
        </svg>
      </button>
    `;

    this.elements = {
      back: document.getElementById('aura-back'),
      forward: document.getElementById('aura-forward'),
      refresh: document.getElementById('aura-refresh'),
      extensions: document.getElementById('aura-extensions'),
      settings: document.getElementById('aura-settings'),
      trigger: document.getElementById('aura-trigger'),
      container: document.getElementById('aura-bubbles'),
      urlBar: document.getElementById('aura-url-bar'),
      urlInput: document.getElementById('aura-url-input'),
      pinnedGroup: document.getElementById('aura-pinned'),
      tabGroup: document.getElementById('aura-tabs'),
      addButton: document.getElementById('aura-add-tab'),
      newTabBar: document.getElementById('aura-new-tab-bar'),
      newTabInput: document.getElementById('aura-new-tab-input')
    };

    if (this.elements.back) {
      this.elements.back.addEventListener('click', () => {
        if (this.onBack) this.onBack();
      });
    }

    if (this.elements.forward) {
      this.elements.forward.addEventListener('click', () => {
        if (this.onForward) this.onForward();
      });
    }

    if (this.elements.refresh) {
      this.elements.refresh.addEventListener('click', () => {
        if (this.onRefresh) this.onRefresh();
      });
    }

    if (this.elements.extensions) {
      this.elements.extensions.addEventListener('click', () => {
        if (this.onExtensions) this.onExtensions();
      });
    }

    if (this.elements.settings) {
      this.elements.settings.addEventListener('click', () => {
        if (this.onSettings) this.onSettings();
      });
    }

    // Create ambient background
    this.createAmbientBubbles();
  }

  createAmbientBubbles() {
    const container = document.getElementById('ambient-bubbles');
    const count = 8;
    
    for (let i = 0; i < count; i++) {
      const bubble = document.createElement('div');
      bubble.className = 'ambient-bubble';
      
      const size = 80 + Math.random() * 180;
      bubble.style.width = `${size}px`;
      bubble.style.height = `${size}px`;
      bubble.style.left = `${Math.random() * 100}%`;
      bubble.style.top = `${Math.random() * 100}%`;
      bubble.style.animationDuration = `${25 + Math.random() * 20}s`;
      bubble.style.animationDelay = `${-Math.random() * 25}s`;
      bubble.style.opacity = 0.15 + Math.random() * 0.2;
      
      container.appendChild(bubble);
    }
  }

  bindEvents() {
    this.elements.trigger.addEventListener('click', () => this.expand());
    
    this.elements.addButton.addEventListener('click', (e) => {
      e.stopPropagation();
      this.showNewTabBar();
    });

    this.elements.newTabInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && this.elements.newTabInput.value.trim()) {
        this.createNewTab(this.elements.newTabInput.value.trim());
      }
    });

    document.addEventListener('click', (e) => {
      if (this.isExpanded && 
          !this.elements.container.contains(e.target) && 
          e.target !== this.elements.trigger &&
          e.target !== this.elements.urlBar &&
          !this.elements.urlBar.contains(e.target) &&
          e.target !== this.elements.newTabBar &&
          !this.elements.newTabBar.contains(e.target)) {
        this.collapse();
      }

      if (!this.isExpanded) {
        const nearButtons = [
          { btn: this.elements.back, key: '_backDismissed', leftKey: '_backLeftZone' },
          { btn: this.elements.forward, key: '_forwardDismissed', leftKey: '_forwardLeftZone' },
          { btn: this.elements.trigger, key: '_triggerDismissed', leftKey: '_triggerLeftZone' }
        ];
        
        for (const { btn, key, leftKey } of nearButtons) {
          if (btn && btn.classList.contains('near')) {
            if (!btn.contains(e.target) && e.target !== btn) {
              btn.classList.remove('near');
              this[key] = true;
              // DO NOT set leftKey = false here
            }
          }
        }
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isExpanded) {
        this.collapse();
      }
    });

    this._handleMouseMove = (e) => {
      if (this.isExpanded) return;
      
      const proximityZone = 50;
      
      if (this.elements.trigger) {
        const rect = this.elements.trigger.getBoundingClientRect();
        const triggerZone = 30;
        const isNear = e.clientY < rect.bottom + triggerZone && 
                       e.clientX > rect.left - triggerZone && 
                       e.clientX < rect.right + triggerZone;
        
        if (!this._triggerDismissed) {
          this.elements.trigger.classList.toggle('near', isNear);
          if (isNear) this._triggerLeftZone = false;
        } else if (isNear && this._triggerLeftZone) {
          this._triggerDismissed = false;
          this._triggerLeftZone = false;
          this.elements.trigger.classList.add('near');
        } else if (!isNear && !this._triggerLeftZone) {
          this._triggerLeftZone = true;
        }
      }

      if (this.elements.back) {
        const rect = this.elements.back.getBoundingClientRect();
        const isNear = e.clientX < rect.right + proximityZone && 
                       e.clientY > rect.top - proximityZone && 
                       e.clientY < rect.bottom + proximityZone;
        if (!this._backDismissed) {
          this.elements.back.classList.toggle('near', isNear);
          if (isNear) this._backLeftZone = false;
        } else if (!isNear && !this._backLeftZone) {
          this._backLeftZone = true;
          this._backDismissed = false;
        }
      }

      if (this.elements.forward) {
        const rect = this.elements.forward.getBoundingClientRect();
        const isNear = e.clientX > rect.left - proximityZone && 
                       e.clientY > rect.top - proximityZone && 
                       e.clientY < rect.bottom + proximityZone;
        if (!this._forwardDismissed) {
          this.elements.forward.classList.toggle('near', isNear);
          if (isNear) this._forwardLeftZone = false;
        } else if (!isNear && !this._forwardLeftZone) {
          this._forwardLeftZone = true;
          this._forwardDismissed = false;
        }
      }
    };
    document.addEventListener('mousemove', this._handleMouseMove);
  }

  expand() {
    this.isExpanded = true;
    this.elements.trigger.classList.add('hidden');
    this.elements.back?.classList.remove('near');
    this.elements.forward?.classList.remove('near');
    this.elements.urlBar.classList.add('visible');
    this.elements.settings?.classList.add('visible');
    this.elements.container.classList.add('visible');
    this.elements.newTabBar.classList.remove('visible');
    this.render(true);
  }

  collapse() {
    this.isExpanded = false;
    this.elements.trigger.classList.remove('hidden');
    this.elements.urlBar.classList.remove('visible');
    this.elements.settings?.classList.remove('visible');
    this.elements.container.classList.remove('visible');
    this.elements.newTabBar.classList.remove('visible');
    this.elements.urlBar.style.animation = 'none';
    this.elements.container.style.animation = 'none';
    this.elements.newTabBar.style.animation = 'none';
    setTimeout(() => {
      this.elements.urlBar.style.animation = '';
      this.elements.container.style.animation = '';
      this.elements.newTabBar.style.animation = '';
    }, 10);
  }

  setTabs(tabs) {
    this.tabs = tabs;
    if (this.isExpanded) {
      this.render();
    }
  }

  render(animate = false) {
    const pinned = this.tabs.filter(t => t.pinned);
    const active = this.tabs.filter(t => !t.pinned);
    const currentTab = this.tabs.find(t => t.active);

    this.elements.urlInput.value = currentTab?.url || '';
    this.elements.pinnedGroup.innerHTML = pinned.map((tab, i) => 
      this.createBubble(tab, i, true, animate)
    ).join('');

    this.elements.tabGroup.innerHTML = active.map((tab, i) => 
      this.createBubble(tab, i + pinned.length, false, animate)
    ).join('');

    this.bindBubbleEvents();
  }

  createBubble(tab, index, isPinned, animate) {
    const initials = this.getInitials(tab.title);
    const liveDelay = (index * 0.3) % 4;
    const dropDelay = index * 60;
    
    const bounce = ((index % 3) === 0 ? -1 : 1) * (1 + (index % 3) * 0.5);
    const duration = 2.5 + (index % 3) * 0.3;
    
    const iconContent = tab.favicon 
      ? `<img src="${tab.favicon}" alt="" class="aura-bubble-icon">`
      : `<span class="aura-bubble-icon">${initials}</span>`;

    const loadingIndicator = tab.loading 
      ? `<div class="aura-bubble-progress"><span></span><span></span><span></span></div>`
      : '';

    const closeButton = isPinned ? '' 
      : `<button class="aura-bubble-close" data-tab-id="${tab.id}" aria-label="Close tab">×</button>`;

    return `
      <div class="aura-bubble ${isPinned ? 'pinned' : ''} ${tab.active ? 'active' : ''} ${tab.loading ? 'loading' : ''} ${animate ? 'animate-in' : ''}" 
           data-tab-id="${tab.id}"
           style="--live-delay: ${liveDelay}s; --drop-delay: ${dropDelay}ms; --bounce: ${bounce}px; animation-duration: ${duration}s;">
        ${iconContent}
        ${loadingIndicator}
        ${closeButton}
      </div>
    `;
  }

  bindBubbleEvents() {
    const bubbles = this.elements.container.querySelectorAll('.aura-bubble:not(.aura-bubble-add)');
    
    bubbles.forEach(bubble => {
      bubble.addEventListener('click', (e) => {
        if (this._wasDragActivated) {
          this._wasDragActivated = false;
          return;
        }
        if (e.target.classList.contains('aura-bubble-close')) {
          e.stopPropagation();
          this.closeTab(bubble.dataset.tabId);
        } else if (!bubble.classList.contains('dragging')) {
          this.selectTab(bubble.dataset.tabId);
        }
      });

      bubble.addEventListener('mousedown', (e) => {
        if (e.target.classList.contains('aura-bubble-close')) return;
        if (e.button !== 0) return;
        this._startDrag(e, bubble);
      });

      bubble.addEventListener('touchstart', (e) => {
        if (e.target.classList.contains('aura-bubble-close')) return;
        const touch = e.touches[0];
        this._startDrag(touch, bubble);
      }, { passive: true });
    });

    document.addEventListener('mousemove', (e) => this._onDragMove(e));
    document.addEventListener('mouseup', (e) => this._onDragEnd(e));
    document.addEventListener('touchmove', (e) => {
      const touch = e.touches[0];
      this._onDragMove(touch);
    }, { passive: true });
    document.addEventListener('touchend', (e) => this._onDragEnd(e));
  }

  _startDrag(e, bubble) {
    const rect = bubble.getBoundingClientRect();
    this._dragStartX = e.clientX;
    this._dragStartY = e.clientY;
    this._dragBubbleRect = rect;
    this._dragBubbleBounds = {
      left: rect.left,
      right: rect.right,
      top: rect.top,
      bottom: rect.bottom
    };
    this._dragTabId = bubble.dataset.tabId;
    this._dragBubble = bubble;
    this._isPinned = bubble.classList.contains('pinned');
    this._hasDragged = false;
    this._isDragActive = false;
    this._lastX = e.clientX;
    this._lastY = e.clientY;
  }

  _onDragMove(e) {
    if (!this._dragTabId) return;

    const dx = e.clientX - this._dragStartX;
    const dy = e.clientY - this._dragStartY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (!this._isDragActive && dist > 10) {
      this._isDragActive = true;
      this._wasDragActivated = true;
      document.body.classList.add('dragging-tabs');
      this._dragBubble.classList.add('dragging');

      const placeholder = document.createElement('div');
      placeholder.className = `aura-bubble ${this._isPinned ? 'pinned' : ''} dragging-placeholder`;
      placeholder.style.width = this._isPinned ? '42px' : '56px';
      placeholder.style.height = this._isPinned ? '42px' : '56px';
      this._dragBubble.parentNode.insertBefore(placeholder, this._dragBubble);
      this._placeholder = placeholder;

      const ghost = document.createElement('div');
      ghost.className = 'drag-ghost';
      ghost.id = 'aura-drag-ghost';
      ghost.style.left = e.clientX + 'px';
      ghost.style.top = e.clientY + 'px';
      document.body.appendChild(ghost);
    }

    if (!this._isDragActive) return;

    this._hasDragged = true;
    this._lastX = e.clientX;
    this._lastY = e.clientY;

    const ghost = document.getElementById('aura-drag-ghost');
    if (ghost) {
      ghost.style.left = e.clientX + 'px';
      ghost.style.top = e.clientY + 'px';
    }

    this._updateDropPreview(e.clientX, e.clientY);
  }

  _updateDropPreview(x, y) {
    const existing = document.getElementById('aura-drop-preview');
    if (existing) existing.remove();

    const pinnedRect = this.elements.pinnedGroup.getBoundingClientRect();
    
    const inPinned = x > pinnedRect.left - 30 && x < pinnedRect.right + 30;
    const shouldPin = inPinned && y < 150;

    const container = shouldPin ? this.elements.pinnedGroup : this.elements.tabGroup;
    const bubbles = [...container.querySelectorAll('.aura-bubble:not(.dragging):not(.aura-bubble-add)')];

    let insertBeforeEl = null;
    for (let i = 0; i < bubbles.length; i++) {
      const rect = bubbles[i].getBoundingClientRect();
      if (x < rect.left + rect.width / 2) {
        insertBeforeEl = bubbles[i];
        break;
      }
    }

    const preview = document.createElement('div');
    preview.className = `drop-preview ${shouldPin ? 'pinned' : ''}`;
    preview.id = 'aura-drop-preview';

    if (insertBeforeEl) {
      container.insertBefore(preview, insertBeforeEl);
    } else {
      container.appendChild(preview);
    }

    this._dropInfo = {
      container: shouldPin ? 'pinned' : 'tab',
      insertBeforeTabId: insertBeforeEl?.dataset.tabId || null
    };
  }

  _onDragEnd(e) {
    document.body.classList.remove('dragging-tabs');

    const tabId = this._dragTabId;
    const dropInfo = this._dropInfo;
    const didDrag = this._hasDragged && this._isDragActive;

    if (this._isDragActive) {
      const ghost = document.getElementById('aura-drag-ghost');
      if (ghost) ghost.remove();

      const preview = document.getElementById('aura-drop-preview');
      if (preview) preview.remove();

      if (this._placeholder && this._placeholder.parentNode) {
        this._placeholder.parentNode.removeChild(this._placeholder);
      }
      this._dragBubble?.classList.remove('dragging');
    }

    this._dragTabId = null;
    this._dragBubble = null;
    this._placeholder = null;
    this._dropInfo = null;
    this._hasDragged = false;
    this._isDragActive = false;

    if (didDrag && tabId && dropInfo) {
      this._moveTabAt(tabId, dropInfo.container, dropInfo.insertBeforeTabId);
    }
  }

  _moveTabAt(tabId, targetGroup, insertBeforeTabId) {
    const tabIndex = this.tabs.findIndex(t => t.id === tabId);
    if (tabIndex === -1) return;

    const tab = this.tabs[tabIndex];
    const shouldPin = targetGroup === 'pinned';

    if (tab.pinned !== shouldPin) {
      tab.pinned = shouldPin;
      if (this.onTabPin) {
        this.onTabPin(tabId, shouldPin);
      }
      this.render();
      return;
    }

    const sameGroupTabs = this.tabs.filter(t => t.pinned === shouldPin);
    const currentPos = sameGroupTabs.findIndex(t => t.id === tabId);

    if (currentPos === -1) return;

    let insertPos;
    if (insertBeforeTabId) {
      insertPos = sameGroupTabs.findIndex(t => t.id === insertBeforeTabId);
      if (insertPos === -1) insertPos = sameGroupTabs.length;
    } else {
      insertPos = sameGroupTabs.length;
    }

    if (currentPos === insertPos || currentPos === insertPos - 1) {
      this.render();
      return;
    }

    const [movedTab] = sameGroupTabs.splice(currentPos, 1);
    const adjustedIndex = currentPos < insertPos ? insertPos - 1 : insertPos;
    sameGroupTabs.splice(adjustedIndex, 0, movedTab);

    const otherTabs = this.tabs.filter(t => t.pinned !== shouldPin);
    this.tabs = shouldPin 
      ? [...sameGroupTabs, ...otherTabs]
      : [...otherTabs, ...sameGroupTabs];

    this.render();
  }

  selectTab(tabId) {
    this.onTabSelect(tabId);
    this.collapse();
  }

  closeTab(tabId) {
    const bubble = this.elements.container.querySelector(`[data-tab-id="${tabId}"]`);
    if (bubble) {
      bubble.classList.remove('animate-in');
      bubble.classList.add('animate-out');
      
      setTimeout(() => {
        this.onTabClose(tabId);
        this.tabs = this.tabs.filter(t => t.id !== tabId);
        this.render();
      }, 200);
    }
  }

  showNewTabBar() {
    this.elements.newTabBar.classList.add('visible');
    this.elements.newTabInput.focus();
  }

  createNewTab(url) {
    this.onNewTab(url);
    this.hideNewTabBar();
  }

  hideNewTabBar() {
    this.elements.newTabBar.classList.remove('visible');
    this.elements.newTabInput.value = '';
  }

  getInitials(title) {
    if (!title) return '?';
    return title.charAt(0).toUpperCase();
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = AuraBubbleTabs;
}
