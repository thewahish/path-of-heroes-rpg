// js/debug.js
// --- Debugger System ---
window.Debugger = class Debugger {
    constructor(gameInstance) {
        this.game = gameInstance;
        this.panel = null;
        this.content = null;
        this.logContainer = null;
        this.debugUpdateInterval = null;
        this.bindMethods();
    }

    bindMethods() {
        this.toggleDebugPanel = this.toggleDebugPanel.bind(this);
        this.updateDebugInfo = this.updateDebugInfo.bind(this);
        this.captureConsole = this.captureConsole.bind(this);
    }

    init() {
        if (!window.GameConfig.DEBUG_MODE) return;

        this.panel = document.getElementById('debug-panel');
        this.content = document.getElementById('debug-content');
        this.logContainer = document.getElementById('debug-log-content');
        
        const openBtn = document.getElementById('debug-open-btn');
        const closeBtn = document.getElementById('debug-toggle-btn');

        if (openBtn) openBtn.addEventListener('click', this.toggleDebugPanel);
        if (closeBtn) closeBtn.addEventListener('click', this.toggleDebugPanel);
        
        this.captureConsole();
    }
    
    captureConsole() {
        if (!this.logContainer) return;

        const originalConsole = {
            log: console.log.bind(console),
            warn: console.warn.bind(console),
            error: console.error.bind(console),
        };

        const logToPanel = (args, type) => {
            if (!this.logContainer) return;
            const message = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' ');
            
            const entry = document.createElement('div');
            entry.className = `log-entry log-${type}`;
            entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
            
            this.logContainer.appendChild(entry);
            // Auto-scroll to the bottom
            this.logContainer.scrollTop = this.logContainer.scrollHeight;
        };

        console.log = (...args) => {
            originalConsole.log(...args);
            logToPanel(args, 'log');
        };
        console.warn = (...args) => {
            originalConsole.warn(...args);
            logToPanel(args, 'warn');
        };
        console.error = (...args) => {
            originalConsole.error(...args);
            logToPanel(args, 'error');
        };
    }

    toggleDebugPanel() {
        if (!this.panel) return;
        const isHidden = this.panel.classList.toggle('hidden');

        if (!isHidden) {
            this.updateDebugInfo();
            this.debugUpdateInterval = setInterval(this.updateDebugInfo, 1000);
        } else {
            clearInterval(this.debugUpdateInterval);
            this.debugUpdateInterval = null;
        }
    }

    updateDebugInfo() {
        if (!this.content || !this.game || !this.game.state) return;
        const state = this.game.state.current;
        
        // Use <pre> for better formatting of the state object
        const stateString = JSON.stringify({
            Version: window.GameConfig.VERSION,
            Screen: state.currentScreen,
            Player: state.player?.id || 'None',
            Floor: state.currentFloor,
            Gold: state.gold,
            Inventory: `${state.inventory.length}/${window.GameConfig.INVENTORY.maxSlots}`,
            Battle: state.battleInProgress,
        }, null, 2);
        
        this.content.textContent = stateString;
    }
};