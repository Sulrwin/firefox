/* Protocal Aura - Bubble Tabs UI */

(function() {
  const DEFAULT_TAB_SIZE = 56;

  class AuraBubbleTabsUI {
    constructor() {
      this.elements = {};
      this.isExpanded = false;
      this.tabs = [];
      this.init();
    }

    init() {
      this.createDOM();
      this.bindEvents();
      console.log('[AuraUI] Initialized');
    }

    createDOM() {
      const root = document.getElementById('aura-ui-root');
      if (!root) {
        console.error('[AuraUI] No root element');
        return;
      }
      root.style.pointerEvents = 'auto';

      const style = document.createElementNS('http://www.w3.org/1999/xhtml', 'style');
      style.textContent = `
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: sans-serif; background: transparent; min-height: 100vh; }
        .aura-back, .aura-forward, .aura-settings, .aura-trigger {
          position: fixed; width: 36px; height: 36px; border-radius: 50%;
          background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.2);
          color: white; cursor: pointer; display: flex; align-items: center;
          justify-content: center; opacity: 0; z-index: 1000; pointer-events: none;
          transition: opacity 0.3s, transform 0.3s;
        }
        .aura-back { left: 12px; top: 50%; transform: translateY(-50%); }
        .aura-forward { right: 12px; top: 50%; transform: translateY(-50%); }
        .aura-settings { right: 12px; bottom: 12px; }
        .aura-trigger { top: 12px; left: 50%; transform: translateX(-50%); }
        .aura-back:hover, .aura-forward:hover, .aura-settings:hover { opacity: 1 !important; }
        .aura-trigger.near { opacity: 0.5; pointer-events: auto; }
        .aura-back.near, .aura-forward.near { opacity: 0.5; pointer-events: auto; }
        .aura-trigger.active { opacity: 1; transform: translateX(-50%) rotate(45deg); }
        .aura-container {
          position: fixed; top: 60px; left: 50%; transform: translateX(-50%);
          display: flex; gap: 12px; padding: 20px; opacity: 0; pointer-events: none;
          transition: opacity 0.3s; z-index: 1000;
        }
        .aura-container.expanded { opacity: 1; pointer-events: auto; }
        .aura-bubble {
          width: 56px; height: 56px; border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3), rgba(255,255,255,0.1));
          backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2);
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          font-size: 18px; color: white;
        }
        .aura-bubble.active { background: radial-gradient(circle at 30% 30%, rgba(100,200,255,0.4), rgba(100,200,255,0.2)); }
        .aura-newtab-bar {
          position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
          opacity: 0; pointer-events: none; z-index: 1001; transition: opacity 0.2s;
        }
        .aura-newtab-bar.visible { opacity: 1; pointer-events: auto; }
        .aura-newtab-bar input {
          width: 400px; height: 44px; padding: 0 20px; border-radius: 22px;
          border: 1px solid rgba(255,255,255,0.2); background: rgba(0,0,0,0.5);
          color: white; font-size: 16px; outline: none;
        }
      `;
      document.head.appendChild(style);

      const createBtn = (id, cls, content, handler) => {
        const btn = document.createElementNS('http://www.w3.org/1999/xhtml', 'button');
        btn.id = id;
        btn.className = cls;
        btn.innerHTML = content;
        btn.style.pointerEvents = 'auto';
        if (handler) btn.addEventListener('click', handler);
        return btn;
      };

      this.elements.back = createBtn('aura-back', 'aura-back', '&#8592;', () => this.handleAction('back'));
      this.elements.forward = createBtn('aura-forward', 'aura-forward', '&#8594;', () => this.handleAction('forward'));
      this.elements.settings = createBtn('aura-settings', 'aura-settings', '&#9881;', () => this.handleAction('settings'));
      this.elements.trigger = createBtn('aura-trigger', 'aura-trigger', '+', () => this.toggleExpanded());

      this.elements.container = document.createElementNS('http://www.w3.org/1999/xhtml', 'div');
      this.elements.container.className = 'aura-container';
      this.elements.container.id = 'aura-container';

      this.elements.tabGroup = document.createElementNS('http://www.w3.org/1999/xhtml', 'div');
      this.elements.tabGroup.id = 'aura-tabs';
      this.elements.container.appendChild(this.elements.tabGroup);

      const addBtn = document.createElementNS('http://www.w3.org/1999/xhtml', 'div');
      addBtn.className = 'aura-bubble';
      addBtn.style.background = 'rgba(255,255,255,0.1)';
      addBtn.innerHTML = '+';
      addBtn.addEventListener('click', () => this.showNewTabBar());
      this.elements.container.appendChild(addBtn);

      this.elements.newTabBar = document.createElementNS('http://www.w3.org/1999/xhtml', 'div');
      this.elements.newTabBar.className = 'aura-newtab-bar';
      this.elements.newTabInput = document.createElementNS('http://www.w3.org/1999/xhtml', 'input');
      this.elements.newTabInput.type = 'text';
      this.elements.newTabInput.placeholder = 'Search or enter URL...';
      this.elements.newTabInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.target.value.trim()) {
          let url = e.target.value.trim();
          if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('about:')) {
            if (url.includes('.') && !url.includes(' ')) {
              url = 'https://' + url;
            } else {
              url = 'https://www.google.com/search?q=' + encodeURIComponent(url);
            }
          }
          this.handleAction('newTab', url);
          this.hideNewTabBar();
        }
      });
      this.elements.newTabBar.appendChild(this.elements.newTabInput);

      root.appendChild(this.elements.back);
      root.appendChild(this.elements.forward);
      root.appendChild(this.elements.settings);
      root.appendChild(this.elements.trigger);
      root.appendChild(this.elements.container);
      root.appendChild(this.elements.newTabBar);

      document.addEventListener('click', (e) => {
        if (this.isExpanded && !this.elements.container.contains(e.target) && e.target !== this.elements.trigger) {
          this.collapse();
        }
      });

      document.addEventListener('mousemove', (e) => this.handleProximity(e));
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isExpanded) this.collapse();
      });
    }

    handleProximity(e) {
      if (this.isExpanded) return;
      const w = window.innerWidth;
      const buttons = [
        { el: this.elements.back, check: () => e.clientX < 80 && e.clientY < 80 },
        { el: this.elements.forward, check: () => e.clientX > w - 80 && e.clientY < 80 },
        { el: this.elements.trigger, check: () => e.clientX > w/2 - 50 && e.clientX < w/2 + 50 && e.clientY < 60 }
      ];
      for (const { el, check } of buttons) {
        if (el) el.classList.toggle('near', check());
      }
    }

    handleAction(type, data) {
      console.log('[AuraUI] handleAction:', type, data);
      if (window.top.handleAuraAction) {
        window.top.handleAuraAction({ type, url: data });
      }
    }

    toggleExpanded() {
      this.isExpanded = !this.isExpanded;
      this.elements.container.classList.toggle('expanded', this.isExpanded);
      this.elements.trigger.classList.toggle('active', this.isExpanded);
    }

    collapse() {
      this.isExpanded = false;
      this.elements.container.classList.remove('expanded');
      this.elements.trigger.classList.remove('active');
      this.hideNewTabBar();
    }

    showNewTabBar() {
      this.elements.newTabBar.classList.add('visible');
      this.elements.newTabInput.value = '';
      this.elements.newTabInput.focus();
    }

    hideNewTabBar() {
      this.elements.newTabBar.classList.remove('visible');
      this.elements.newTabInput.blur();
    }

    bindEvents() {
      document.addEventListener('mousemove', (e) => this.handleProximity(e));
    }

    setTabs(tabs) {
      this.tabs = tabs;
      this.renderTabs();
    }

    renderTabs() {
      if (!this.elements.tabGroup) return;
      this.elements.tabGroup.innerHTML = '';
      tabs.forEach((tab, i) => {
        const el = document.createElementNS('http://www.w3.org/1999/xhtml', 'div');
        el.className = 'aura-bubble' + (tab.active ? ' active' : '');
        el.style.backgroundColor = `hsl(${this.hashCode(tab.title) % 360}, 60%, 50%)`;
        el.textContent = tab.title.charAt(0).toUpperCase();
        el.addEventListener('click', () => this.handleAction('selectTab', tab.id));
        el.style.animationDelay = `${i * 50}ms`;
        this.elements.tabGroup.appendChild(el);
      });
    }

    hashCode(str) {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
      }
      return Math.abs(hash);
    }
  }

  window.auraUI = new AuraBubbleTabsUI();
  window.updateTabs = (tabs) => {
    if (window.auraUI) window.auraUI.setTabs(tabs);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.auraUI.init());
  } else {
    window.auraUI.init();
  }
})();
