// js/debug.js
// jump-V.36.6-2
// --- Advanced Debugger System ---

window.Debugger = class Debugger {
    constructor(gameInstance) {
        this.game = gameInstance;
        this.panel = null;
        this.stateContent = null;
        this.logContainer = null;
        this.debugUpdateInterval = null;
        this.isVisible = false;
    }

    init() {
        if (!window.GameConfig.DEBUG_MODE) {
            const btn = document.getElementById('debug-open-btn');
            if (btn) btn.style.display = 'none';
            return;
        }

        this.panel = document.getElementById('debug-panel');
        this.stateContent = document.getElementById('debug-content');
        this.logContainer = document.getElementById('debug-log-content');
        
        const openBtn = document.getElementById('debug-open-btn');
        const closeBtn = document.getElementById('debug-close-btn');
        const copyBtn = document.getElementById('debug-copy-btn');

        if (openBtn) openBtn.addEventListener('click', () => this.toggleDebugPanel());
        if (closeBtn) closeBtn.addEventListener('click', () => this.toggleDebugPanel());
        if (copyBtn) copyBtn.addEventListener('click', () => this.copyLogsToClipboard());
        
        this.bindGlobalHandlers();
        this.overrideConsole();
        
        console.log("Advanced Debugger Initialized.");
    }

    bindGlobalHandlers() {
        // Catch unhandled exceptions
        window.onerror = (message, source, lineno, colno, error) => {
            this.log('exception', `Unhandled Exception: ${message}`, { 
                source: `${source}:${lineno}:${colno}`,
                stack: error ? error.stack : 'No stack available.'
            });
            return true; // Prevents the error from showing in the browser's console
        };

        // Catch unhandled promise rejections
        window.addEventListener('unhandledrejection', event => {
            this.log('rejection', 'Unhandled Promise Rejection:', event.reason);
        });
    }

    overrideConsole() {
        const originalConsole = {};
        const methodsToOverride = ['log', 'warn', 'error', 'info', 'debug'];

        methodsToOverride.forEach(method => {
            originalConsole[method] = console[method].bind(console);
            console[method] = (...args) => {
                originalConsole[method](...args);
                this.log(method, ...args);
            };
        });
    }

    log(level, ...args) {
        if (!this.logContainer) return;

        const entry = document.createElement('div');
        entry.classList.add('log-entry', `log-${level}`);

        const timestamp = new Date().toLocaleTimeString();
        const iconMap = {
            log: '⚪️', info: 'ℹ️', warn: '🟡', debug: '⚙️',
            error: '🔴', exception: '💥', rejection: '❗️'
        };

        entry.innerHTML = `<span class="log-meta">${iconMap[level] || '⚪️'} [${timestamp}]</span>`;
        
        const content = document.createElement('div');
        content.className = 'log-content';
        content.append(...this.formatArgs(args));
        entry.appendChild(content);

        this.logContainer.appendChild(entry);
        this.logContainer.scrollTop = this.logContainer.scrollHeight;
    }
    
    formatArgs(args) {
        return args.map(arg => {
            if (arg instanceof Error) {
                return this.createCollapsibleTree(arg, `Error: ${arg.message}`);
            }
            if (typeof arg === 'object' && arg !== null) {
                return this.createCollapsibleTree(arg);
            }
            const el = document.createElement('span');
            el.textContent = String(arg);
            el.className = `log-arg-${typeof arg}`;
            return el;
        });
    }
    
    createCollapsibleTree(data, customSummary = null) {
        const details = document.createElement('details');
        details.classList.add('log-arg-object');
        
        const summary = document.createElement('summary');
        if (customSummary) {
            summary.textContent = customSummary;
        } else if (Array.isArray(data)) {
            summary.textContent = `Array(${data.length}) [${data.slice(0, 3).map(String).join(', ')}${data.length > 3 ? ', ...' : ''}]`;
        } else {
            summary.textContent = `Object { ${Object.keys(data).slice(0, 2).join(', ')}${Object.keys(data).length > 2 ? ', ...' : ''} }`;
        }
        details.appendChild(summary);

        const content = document.createElement('div');
        content.className = 'collapsible-content';
        
        // Handle circular references
        const visited = new WeakSet();
        
        function buildTree(obj, container, depth = 0) {
            if (depth > 10) { 
                container.textContent = '[Max depth reached]';
                return;
            }
            if (typeof obj === 'object' && obj !== null) {
                if (visited.has(obj)) {
                    const el = document.createElement('div');
                    el.textContent = '[Circular Reference]';
                    el.className = 'log-circular';
                    container.appendChild(el);
                    return;
                }
                visited.add(obj);
            }
            
            for (const key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    const item = document.createElement('div');
                    item.className = 'collapsible-item';
                    item.style.paddingLeft = `${depth * 10}px`;
                    
                    const keySpan = document.createElement('span');
                    keySpan.className = 'collapsible-key';
                    keySpan.textContent = `${key}: `;
                    item.appendChild(keySpan);
                    
                    const value = obj[key];
                    if (typeof value === 'object' && value !== null) {
                        item.appendChild(this.createCollapsibleTree(value));
                    } else {
                        const valSpan = document.createElement('span');
                        valSpan.className = `log-arg-${typeof value}`;
                        valSpan.textContent = String(value);
                        item.appendChild(valSpan);
                    }
                    container.appendChild(item);
                }
            }
        }
        
        // Bind 'this' for the recursive calls within the helper
        buildTree.call(this, data, content);
        details.appendChild(content);

        return details;
    }


    toggleDebugPanel() {
        if (!this.panel) return;
        this.isVisible = !this.isVisible;
        this.panel.classList.toggle('hidden', !this.isVisible);

        if (this.isVisible) {
            this.updateDebugInfo();
            this.debugUpdateInterval = setInterval(() => this.updateDebugInfo(), 1000);
        } else {
            clearInterval(this.debugUpdateInterval);
            this.debugUpdateInterval = null;
        }
    }

    updateDebugInfo() {
        if (!this.stateContent || !this.game || !this.game.state) return;
        const stateString = JSON.stringify({
            Version: window.GameConfig.VERSION,
            Screen: this.game.state.current.currentScreen,
            Player: this.game.state.current.player?.id || 'None',
            Floor: this.game.state.current.currentFloor,
            Gold: this.game.state.current.gold,
            Inventory: `${this.game.state.current.inventory.length}/${window.GameConfig.INVENTORY.maxSlots}`,
            Battle: this.game.state.current.battleInProgress,
        }, null, 2);
        this.stateContent.textContent = stateString;
    }

    async copyLogsToClipboard() {
        const copyBtn = document.getElementById('debug-copy-btn');
        if (!this.logContainer || !copyBtn) return;
    
        const rawText = Array.from(this.logContainer.children)
            .map(entry => entry.textContent || '')
            .join('\n');
            
        try {
            await navigator.clipboard.writeText(rawText);
            copyBtn.textContent = 'Copied!';
            setTimeout(() => { copyBtn.textContent = 'Copy Logs'; }, 2000);
        } catch (err) {
            console.error('Failed to copy logs: ', err); // Use original console for this error
            copyBtn.textContent = 'Failed!';
            setTimeout(() => { copyBtn.textContent = 'Copy Logs'; }, 2000);
        }
    }
};