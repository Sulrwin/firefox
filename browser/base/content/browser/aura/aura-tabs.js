/**
 * Protocol Aura - Living Bubble Tab Controller
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
    requestAnimationFrame(() => {
      this.bindEvents();
    });
  }

  createDOM() {
    const root = document.getElementById('aura-ui-root') || document.body;
    
    const ambientBubbles = document.createElement('div');
    ambientBubbles.className = 'ambient-bubbles';
    ambientBubbles.id = 'ambient-bubbles';
    root.appendChild(ambientBubbles);

    this.elements.back = document.createElement('button');
    this.elements.back.className = 'aura-back';
    this.elements.back.id = 'aura-back';
    this.elements.back.setAttribute('aria-label', 'Go back');
    this.elements.back.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 18l-6-6 6-6"/></svg>';
    root.appendChild(this.elements.back);

    this.elements.forward = document.createElement('button');
    this.elements.forward.className = 'aura-forward';
    this.elements.forward.id = 'aura-forward';
    this.elements.forward.setAttribute('aria-label', 'Go forward');
    this.elements.forward.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 18l6-6 6-6"/></svg>';
    root.appendChild(this.elements.forward);

    this.elements.urlBar = document.createElement('div');
    this.elements.urlBar.className = 'aura-url-bar';
    this.elements.urlBar.id = 'aura-url-bar';

    this.elements.refresh = document.createElement('button');
    this.elements.refresh.className = 'aura-refresh';
    this.elements.refresh.setAttribute('aria-label', 'Refresh');
    this.elements.refresh.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>';
    this.elements.urlBar.appendChild(this.elements.refresh);

    this.elements.urlInput = document.createElement('input');
    this.elements.urlInput.type = 'text';
    this.elements.urlInput.className = 'aura-url-input';
    this.elements.urlInput.id = 'aura-url-input';
    this.elements.urlInput.placeholder = 'Enter URL...';
    this.elements.urlBar.appendChild(this.elements.urlInput);

    this.elements.extensions = document.createElement('button');
    this.elements.extensions.className = 'aura-extensions';
    this.elements.extensions.setAttribute('aria-label', 'Extensions');
    this.elements.extensions.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>';
    this.elements.urlBar.appendChild(this.elements.extensions);
    root.appendChild(this.elements.urlBar);

    this.elements.trigger = document.createElement('button');
    this.elements.trigger.className = 'aura-trigger';
    this.elements.trigger.id = 'aura-trigger';
    this.elements.trigger.setAttribute('aria-label', 'Open tabs');
    this.elements.trigger.innerHTML = '<span class="aura-trigger-icon">+</span>';
    root.appendChild(this.elements.trigger);

    this.elements.container = document.createElement('div');
    this.elements.container.className = 'aura-bubble-container';
    this.elements.container.id = 'aura-bubbles';

    this.elements.pinnedGroup = document.createElement('div');
    this.elements.pinnedGroup.className = 'aura-pinned-group';
    this.elements.pinnedGroup.id = 'aura-pinned';
    this.elements.container.appendChild(this.elements.pinnedGroup);

    const separator = document.createElement('div');
    separator.className = 'aura-separator';
    this.elements.container.appendChild(separator);

    this.elements.tabGroup = document.createElement('div');
    this.elements.tabGroup.className = 'aura-tab-group';
    this.elements.tabGroup.id = 'aura-tabs';
    this.elements.container.appendChild(this.elements.tabGroup);

    this.elements.addButton = document.createElement('button');
    this.elements.addButton.className = 'aura-bubble aura-bubble-add';
    this.elements.addButton.id = 'aura-add-tab';
    this.elements.addButton.setAttribute('aria-label', 'New tab');
    this.elements.addButton.innerHTML = '+';
    this.elements.container.appendChild(this.elements.addButton);
    root.appendChild(this.elements.container);

    this.elements.newTabBar = document.createElement('div');
    this.elements.newTabBar.className = 'aura-new-tab-bar';
    this.elements.newTabBar.id = 'aura-new-tab-bar';

    this.elements.newTabInput = document.createElement('input');
    this.elements.newTabInput.type = 'text';
    this.elements.newTabInput.className = 'aura-new-tab-input';
    this.elements.newTabInput.id = 'aura-new-tab-input';
    this.elements.newTabInput.placeholder = 'Search or enter URL...';
    this.elements.newTabBar.appendChild(this.elements.newTabInput);
    root.appendChild(this.elements.newTabBar);

    this.elements.settings = document.createElement('button');
    this.elements.settings.className = 'aura-settings';
    this.elements.settings.id = 'aura-settings';
    this.elements.settings.setAttribute('aria-label', 'Settings');
    this.elements.settings.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>';
    root.appendChild(this.elements.settings);

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
    if (!this.elements.trigger) return;
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

    this.elements.urlInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && this.elements.urlInput.value.trim()) {
        const url = this.elements.urlInput.value.trim();
        parent.postMessage({ type: 'aura-action', action: 'navigate', url }, '*');
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
      
      const triggerZone = 60;
      
      if (this.elements.trigger) {
        const rect = this.elements.trigger.getBoundingClientRect();
        const centerX = window.innerWidth / 2;
        const isNear = e.clientX > centerX - triggerZone && e.clientX < centerX + triggerZone && e.clientY < 40;
        this.elements.trigger.classList.toggle('near', isNear);
      }

      if (this.elements.back) {
        const isNear = e.clientX < 60;
        this.elements.back.classList.toggle('near', isNear);
      }

      if (this.elements.forward) {
        const isNear = e.clientX > window.innerWidth - 60;
        this.elements.forward.classList.toggle('near', isNear);
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
    
    this.elements.pinnedGroup.innerHTML = '';
    pinned.forEach((tab, i) => {
      this.elements.pinnedGroup.appendChild(this.createBubbleElement(tab, i, true, animate));
    });

    this.elements.tabGroup.innerHTML = '';
    active.forEach((tab, i) => {
      this.elements.tabGroup.appendChild(this.createBubbleElement(tab, i + pinned.length, false, animate));
    });

    this.bindBubbleEvents();
  }

  createBubbleElement(tab, index, isPinned, animate) {
    const bubble = document.createElement('div');
    bubble.className = 'aura-bubble';
    if (isPinned) bubble.classList.add('pinned');
    if (tab.active) bubble.classList.add('active');
    if (tab.loading) bubble.classList.add('loading');
    if (animate) bubble.classList.add('animate-in');
    
    bubble.dataset.tabId = tab.id;
    
    if (animate) {
      bubble.style.animationDelay = `${index * 50}ms`;
    }

    if (tab.favicon) {
      const img = document.createElement('img');
      img.src = tab.favicon;
      img.className = 'aura-bubble-icon';
      img.alt = '';
      bubble.appendChild(img);
    } else {
      const span = document.createElement('span');
      span.className = 'aura-bubble-icon';
      span.textContent = this.getInitials(tab.title);
      bubble.appendChild(span);
    }

    if (tab.loading) {
      const progress = document.createElement('div');
      progress.className = 'aura-bubble-progress';
      for (let i = 0; i < 3; i++) {
        progress.appendChild(document.createElement('span'));
      }
      bubble.appendChild(progress);
    }

    if (!isPinned) {
      const closeBtn = document.createElement('button');
      closeBtn.className = 'aura-bubble-close';
      closeBtn.dataset.tabId = tab.id;
      closeBtn.setAttribute('aria-label', 'Close tab');
      closeBtn.textContent = '×';
      bubble.appendChild(closeBtn);
    }

    return bubble;
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

      const ghost = document.createElement('div');
      ghost.className = 'drag-ghost';
      ghost.id = 'aura-drag-ghost';
      ghost.style.left = e.clientX + 'px';
      ghost.style.top = e.clientY + 'px';
      const iconEl = this._dragBubble.querySelector('.aura-bubble-icon');
      if (iconEl) {
        ghost.textContent = iconEl.textContent;
      }
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

      if (this._dragBubble) {
        this._dragBubble.classList.remove('dragging');
      }
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
