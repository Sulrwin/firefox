/* Protocol Aura - UI Loader */

(function() {
  let initialized = false;
  console.log('[AuraUI] Loading...');
  
  function init() {
    if (initialized) {
      console.log('[AuraUI] Already initialized');
      return;
    }
    initialized = true;
    
    const root = document.getElementById('aura-ui-root');
    if (!root) {
      console.error('[AuraUI] No root element');
      return;
    }

    const iframe = document.createElementNS('http://www.w3.org/1999/xhtml', 'iframe');
    iframe.id = 'aura-ui-frame';
    iframe.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; border: none; z-index: 2147483646; pointer-events: auto;';
    iframe.src = 'chrome://browser/content/aura/aura-ui.html';
    
    root.style.pointerEvents = 'none';
    root.appendChild(iframe);
    
    console.log('[AuraUI] Frame created');
  }

  window.addEventListener('message', function(e) {
    if (e.data && e.data.type === 'aura-action') {
      console.log('[AuraUI] Action:', e.data.action);
      if (window.handleAuraAction) {
        window.handleAuraAction(e.data);
      }
    }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
