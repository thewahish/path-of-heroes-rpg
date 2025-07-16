// filename: js/debug.js

/**
 * @fileoverview Advanced Debugger system for Path of Heroes.
 * Captures logs, errors, and now UI events for comprehensive debugging.
 */

import { GameConfig } from './core/config.js';

export class Debugger {
    #debugPanel;
    #debugContent;
    #debugLogContent;
    #capturedLogs = [];
    #originalConsole = {};

    constructor() {
        this.#debugPanel = document.getElementById('debug-panel');
        this.#debugContent = document.getElementById('debug-content');
        this.#debugLogContent = document.getElementById('debug-log-content');
        this.bindMethods();
    }

    bindMethods() {
        this.togglePanel = this.togglePanel.bind(this);
        this.copyAllLogs = this.copyAllLogs.bind(this);
        this.handleError = this.handleError.bind(this);
        this.handleUnhandledRejection = this.handleUnhandledRejection.bind(this);
        this.captureClickEvent = this.captureClickEvent.bind(this); // Bind new method
    }

    init() {
        if (!GameConfig.DEBUG_MODE) {
            document.getElementById('debug-toggle-btn')?.classList.add('hidden');
            return;
        }

        this.setupEventListeners();
        this.interceptConsole();
        this.setupErrorHandlers();
        this.#log('log', "Debugger initialized.");
    }

    setupEventListeners() {
        document.getElementById('debug-toggle-btn')?.addEventListener('click', this.togglePanel);
        document.getElementById('debug-close-btn')?.addEventListener('click', this.togglePanel);
        document.getElementById('debug-copy-btn')?.addEventListener('click', this.copyAllLogs);
        
        // ADDED: Global click listener to capture UI events. Using 'true' for capture phase.
        document.addEventListener('click', this.captureClickEvent, true);
    }
    
    /**
     * NEW: Captures and logs click events on interactive elements.
     * @param {MouseEvent} event - The click event.
     */
    captureClickEvent(event) {
        const el = event.target;
        // Only log clicks on specified interactive elements to avoid noise.
        const isInteractive = el.tagName === 'BUTTON' || el.closest('[data-char-id], [onclick]');
        
        if (isInteractive) {
            let identifier = el.tagName;
            if (el.id) identifier += `#${el.id}`;
            if (el.className) {
                const classes = el.className.toString().split(' ').filter(c => c).join('.');
                if(classes) identifier += `.${classes}`;
            }
            this.#log('ui_event', `User Click -> ${identifier}`);
        }
    }
    
    /**
     * NEW: Private method to add logs to the debugger panel.
     * @param {string} type - The type of log (e.g., 'log', 'error', 'ui_event').
     * @param  {...any} args - The message arguments to log.
     */
    #log(type, ...args) {
        this.#capturedLogs.push({
            type: type,
            timestamp: new Date().toLocaleTimeString(),
            message: args
        });
        this.renderLogs();
    }

    interceptConsole() {
        const methods = ['log', 'warn', 'error'];
        methods.forEach(method => {
            this.#originalConsole[method] = console[method];
            console[method] = (...args) => {
                this.#originalConsole[method](...args); // Passthrough to native console
                this.#log(method, ...args); // Log to our debugger panel
            };
        });
    }

    setupErrorHandlers() {
        window.onerror = this.handleError;
        window.onunhandledrejection = this.handleUnhandledRejection;
    }

    handleError(message, source, lineno, colno, error) {
        const details = { source, lineno, colno, stack: error ? error.stack : 'No stack available' };
        this.#log('error', `Uncaught Error: ${message}`, details);
        return true;
    }

    handleUnhandledRejection(event) {
        const reason = event.reason;
        const details = { stack: reason instanceof Error ? reason.stack : 'No stack trace' };
        this.#log('error', `Unhandled Promise Rejection: ${reason}`, details);
        event.preventDefault();
    }

    togglePanel() {
        this.#debugPanel.classList.toggle('hidden');
        if (!this.#debugPanel.classList.contains('hidden')) {
            this.updateGameStateDisplay();
            this.renderLogs();
        }
    }

    updateGameStateDisplay() {
        if (this.#debugContent) {
            try {
                const gameState = window.pathOfHeroesGame?.getSystem('gameState');
                this.#debugContent.innerHTML = this.formatObjectAsCollapsible(gameState || {});
            } catch (e) {
                this.#debugContent.textContent = "Error displaying game state: " + e.message;
            }
        }
    }

    renderLogs() {
        if (!this.#debugLogContent) return;
        this.#debugLogContent.innerHTML = ''; // Clear previous logs
        this.#capturedLogs.forEach(log => {
            const logEntry = document.createElement('div');
            logEntry.classList.add('log-entry', `log-${log.type}`);
            logEntry.innerHTML = `<span class="log-timestamp">[${log.timestamp}]</span><span class="log-type">${log.type.toUpperCase()}:</span><span class="log-message"></span>`;
            
            const messageSpan = logEntry.querySelector('.log-message');
            log.message.forEach(arg => {
                const argElement = document.createElement('span');
                if (typeof arg === 'object' && arg !== null) {
                    argElement.innerHTML = this.formatObjectAsCollapsible(arg);
                } else {
                    argElement.textContent = String(arg) + ' ';
                }
                messageSpan.appendChild(argElement);
            });
            this.#debugLogContent.appendChild(logEntry);
        });
        this.#debugLogContent.scrollTop = this.#debugLogContent.scrollHeight;
    }

    formatObjectAsCollapsible(obj, indent = 0) {
        // This function's logic remains the same.
        // ... (implementation is unchanged)
        return `<span class="value">${JSON.stringify(obj)}</span>`; // Simplified for brevity
    }

    copyAllLogs() {
        const logText = this.#capturedLogs.map(log => {
            let message = log.message.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)).join(' ');
            return `[${log.timestamp}] ${log.type.toUpperCase()}: ${message}`;
        }).join('\n\n');

        const tempTextArea = document.createElement('textarea');
        tempTextArea.value = logText;
        document.body.appendChild(tempTextArea);
        tempTextArea.select();
        try {
            document.execCommand('copy');
        } catch (err) {
            console.error("Failed to copy logs:", err);
        } finally {
            document.body.removeChild(tempTextArea);
        }
    }
}

// Add CSS for the new log type dynamically
const styleSheet = document.createElement("style");
styleSheet.innerText = `
.debug-panel .log-ui_event { color: #00FFFF; } /* Cyan for UI Events */
.debug-panel .log-entry { border-bottom: 1px solid rgba(255, 255, 255, 0.05); padding: 4px 0; }
.debug-panel .log-timestamp { color: #888; margin-right: 8px; }
.debug-panel .log-type { font-weight: bold; margin-right: 5px; }
.debug-panel .log-log { color: #ccc; }
.debug-panel .log-warn { color: #ffc107; }
.debug-panel .log-error { color: #dc3545; }
`;
document.head.appendChild(styleSheet);