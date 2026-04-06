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
    this.onTabReorder = options.onTabReorder || (() => {});
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
    this.elements.back = document.getElementById('aura-back');
    this.elements.forward = document.getElementById('aura-forward');
    this.elements.refresh = document.getElementById('aura-refresh');
    this.elements.extensions = document.getElementById('aura-extensions');
    this.elements.settings = document.getElementById('aura-settings');
    this.elements.trigger = document.getElementById('aura-trigger');
    this.elements.container = document.getElementById('aura-bubbles');
    this.elements.urlBar = document.getElementById('aura-url-bar');
    this.elements.urlInput = document.getElementById('aura-url-input');
    this.elements.pinnedGroup = document.getElementById('aura-pinned');
    this.elements.tabGroup = document.getElementById('aura-tabs');
    this.elements.addButton = document.getElementById('aura-add-tab');
    this.elements.newTabBar = document.getElementById('aura-new-tab-bar');
    this.elements.newTabInput = document.getElementById('aura-new-tab-input');
  }

  bindEvents() {
    if (!this.elements.trigger) return;
    this.elements.trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      this.expand();
    });

    if (this.elements.refresh) {
      this.elements.refresh.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this.onRefresh) this.onRefresh();
      });
    }

    if (this.elements.extensions) {
      this.elements.extensions.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this.onExtensions) this.onExtensions();
      });
    }

    if (this.elements.back) {
      this.elements.back.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this.onBack) this.onBack();
      });
    }

    if (this.elements.forward) {
      this.elements.forward.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this.onForward) this.onForward();
      });
    }
    
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
        let url = this.elements.urlInput.value.trim();
        if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('about:')) {
          if (url.includes('.') && !url.includes(' ')) {
            url = 'https://' + url;
          } else {
            url = 'https://www.google.com/search?q=' + encodeURIComponent(url);
          }
        }
        if (window.handleAuraAction) {
          window.handleAuraAction({ action: 'navigate', url });
        }
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
      
      if (this.elements.trigger) {
        const rect = this.elements.trigger.getBoundingClientRect();
        const centerX = window.innerWidth / 2;
        const triggerZone = 80;
        const isNearX = e.clientX > centerX - triggerZone && e.clientX < centerX + triggerZone;
        const isNearY = e.clientY < rect.bottom + 30;
        this.elements.trigger.classList.toggle('near', isNearX && isNearY);
      }

      if (this.elements.back) {
        const isNear = e.clientX < 60 && e.clientY > 100;
        this.elements.back.classList.toggle('near', isNear);
      }

      if (this.elements.forward) {
        const isNear = e.clientX > window.innerWidth - 60 && e.clientY > 100;
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
    console.log('[AuraTabs] setTabs called with:', tabs);
    // Preserve pinned state from localStorage using stable tab IDs
    tabs = tabs.map(tab => {
      const match = tab.id.match(/^tab-(\d+)$/);
      if (match) {
        const storageKey = 'aura-tab-pinned-' + match[1];
        const localPinned = localStorage.getItem(storageKey) === 'true';
        return { ...tab, pinned: tab.pinned || localPinned };
      }
      return tab;
    });
    this.tabs = tabs;
    console.log('[AuraTabs] rendering with tabs:', this.tabs);
    this.render();
  }

  updateUrlBar(url) {
    if (this.elements.urlInput && url !== this.elements.urlInput.value) {
      this.elements.urlInput.value = url;
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
    console.log('[AuraTabs] createBubbleElement:', tab.title, 'favicon:', tab.favicon, 'isPinned:', isPinned);
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
    // Remove old listeners to prevent duplicates
    if (this._boundDragMove) {
      document.removeEventListener('mousemove', this._boundDragMove);
      document.removeEventListener('mouseup', this._boundDragEnd);
      document.removeEventListener('touchmove', this._boundTouchMove);
      document.removeEventListener('touchend', this._boundDragEnd);
    }
    
    // Store bound functions for cleanup
    this._boundDragMove = (e) => this._onDragMove(e);
    this._boundDragEnd = (e) => this._onDragEnd(e);
    this._boundTouchMove = (e) => {
      const touch = e.touches[0];
      this._onDragMove(touch);
    };
    
    const bubbles = this.elements.container.querySelectorAll('.aura-bubble:not(.aura-bubble-add)');
    
    bubbles.forEach(bubble => {
      // Click only fires if NOT dragging
      bubble.addEventListener('click', (e) => {
        if (this._isDragging) {
          e.stopImmediatePropagation();
          return;
        }
        if (e.target.classList.contains('aura-bubble-close')) {
          e.stopPropagation();
          this.closeTab(bubble.dataset.tabId);
        } else {
          this.selectTab(bubble.dataset.tabId);
        }
      });

      bubble.addEventListener('mousedown', (e) => {
        if (e.target.classList.contains('aura-bubble-close')) return;
        if (e.button !== 0) return;
        e.preventDefault();
        this._startDrag(e, bubble);
      });

      bubble.addEventListener('touchstart', (e) => {
        if (e.target.classList.contains('aura-bubble-close')) return;
        const touch = e.touches[0];
        this._startDrag(touch, bubble);
      }, { passive: true });
    });

    // Add document-level drag listeners only once
    document.addEventListener('mousemove', this._boundDragMove);
    document.addEventListener('mouseup', this._boundDragEnd);
    document.addEventListener('touchmove', this._boundTouchMove, { passive: true });
    document.addEventListener('touchend', this._boundDragEnd);
  }

  _startDrag(e, bubble) {
    // Reset drag state
    this._isDragging = false;
    this._hasDragged = false;
    
    const rect = bubble.getBoundingClientRect();
    this._dragStartX = e.clientX;
    this._dragStartY = e.clientY;
    this._dragTabId = bubble.dataset.tabId;
    this._dragBubble = bubble;
    this._isPinned = bubble.classList.contains('pinned');
  }

  _onDragMove(e) {
    if (!this._dragTabId) return;

    const dx = e.clientX - this._dragStartX;
    const dy = e.clientY - this._dragStartY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > 5) {
      this._isDragging = true;
      this._hasDragged = true;
      
      // Create ghost if first drag move
      let ghost = document.getElementById('aura-drag-ghost');
      if (!ghost) {
        document.body.classList.add('dragging-tabs');
        this._dragBubble.classList.add('dragging');
        
        ghost = document.createElement('div');
        ghost.className = 'drag-ghost';
        ghost.id = 'aura-drag-ghost';
        const iconEl = this._dragBubble.querySelector('.aura-bubble-icon');
        if (iconEl) {
          ghost.innerHTML = iconEl.innerHTML;
        }
        document.body.appendChild(ghost);
      }
      
      // Position ghost centered on cursor
      ghost.style.left = (e.clientX - 28) + 'px';
      ghost.style.top = (e.clientY - 28) + 'px';
      
      this._updateDropPreview(e.clientX, e.clientY);
    }
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
    const didDrag = this._hasDragged && this._isDragging;

    // Clean up ghost and preview
    const ghost = document.getElementById('aura-drag-ghost');
    if (ghost) ghost.remove();

    const preview = document.getElementById('aura-drop-preview');
    if (preview) preview.remove();

    if (this._dragBubble) {
      this._dragBubble.classList.remove('dragging');
    }

    // Reset drag state
    this._dragTabId = null;
    this._dragBubble = null;
    this._dropInfo = null;
    this._hasDragged = false;
    this._isDragging = false;

    // Execute move if we dragged
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

    if (this.onTabReorder) {
      this.onTabReorder(this.tabs);
    }
    
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
    let finalUrl = url;
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://') && !finalUrl.startsWith('about:')) {
      if (finalUrl.includes('.') && !finalUrl.includes(' ')) {
        finalUrl = 'https://' + finalUrl;
      } else {
        finalUrl = 'https://www.google.com/search?q=' + encodeURIComponent(finalUrl);
      }
    }
    this.onNewTab(finalUrl);
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
