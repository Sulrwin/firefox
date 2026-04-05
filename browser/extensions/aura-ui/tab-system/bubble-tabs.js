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
      
      <div class="aura-url-bar" id="aura-url-bar">
        <input type="text" class="aura-url-input" id="aura-url-input" placeholder="Enter URL...">
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
    `;

    this.elements = {
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
          e.target !== this.elements.newTabBar &&
          !this.elements.newTabBar.contains(e.target)) {
        this.collapse();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isExpanded) {
        this.collapse();
      }
    });
  }

  expand() {
    this.isExpanded = true;
    this.elements.trigger.classList.add('hidden');
    this.elements.urlBar.classList.add('visible');
    this.elements.container.classList.add('visible');
    this.elements.newTabBar.classList.remove('visible');
    this.render();
  }

  collapse() {
    this.isExpanded = false;
    this.elements.trigger.classList.remove('hidden');
    this.elements.urlBar.classList.remove('visible');
    this.elements.container.classList.remove('visible');
    this.elements.newTabBar.classList.remove('visible');
  }

  setTabs(tabs) {
    this.tabs = tabs;
    if (this.isExpanded) {
      this.render();
    }
  }

  render() {
    const pinned = this.tabs.filter(t => t.pinned);
    const active = this.tabs.filter(t => !t.pinned);
    const currentTab = this.tabs.find(t => t.active);

    this.elements.urlInput.value = currentTab?.url || '';
    this.elements.pinnedGroup.innerHTML = pinned.map((tab, i) => 
      this.createBubble(tab, i, true)
    ).join('');

    this.elements.tabGroup.innerHTML = active.map((tab, i) => 
      this.createBubble(tab, i + pinned.length, false)
    ).join('');

    this.bindBubbleEvents();
  }

  createBubble(tab, index, isPinned) {
    const initials = this.getInitials(tab.title);
    const liveDelay = (index * 0.5) % 5;
    const dropDelay = index * 60;
    
    const iconContent = tab.favicon 
      ? `<img src="${tab.favicon}" alt="" class="aura-bubble-icon">`
      : `<span class="aura-bubble-icon">${initials}</span>`;

    const loadingIndicator = tab.loading 
      ? `<div class="aura-bubble-progress"><span></span><span></span><span></span></div>`
      : '';

    const closeButton = isPinned ? '' 
      : `<button class="aura-bubble-close" data-tab-id="${tab.id}" aria-label="Close tab">×</button>`;

    return `
      <div class="aura-bubble ${isPinned ? 'pinned' : ''} ${tab.active ? 'active' : ''} ${tab.loading ? 'loading' : ''} animate-in" 
           data-tab-id="${tab.id}"
           style="--live-delay: ${liveDelay}s; --drop-delay: ${dropDelay}ms">
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
        if (e.target.classList.contains('aura-bubble-close')) {
          e.stopPropagation();
          this.closeTab(bubble.dataset.tabId);
        } else {
          this.selectTab(bubble.dataset.tabId);
        }
      });
    });
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
