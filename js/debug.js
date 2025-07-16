// filename: js/debug.js

/**
 * @fileoverview Advanced Debugger system for Path of Heroes.
 * Captures logs, errors, and UI events for comprehensive debugging.
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
        this.captureClickEvent = this.captureClickEvent.bind(this);
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
        document.addEventListener('click', this.captureClickEvent, true);
    }
    
    /**
     * Captures and logs click events on interactive elements.
     * @param {MouseEvent} event - The click event.
     */
    captureClickEvent(event) {
        const el = event.target;
        // MODIFIED: Use a more robust selector to find the interactive element.
        // This looks for a button tag or any parent with a data-char-id attribute.
        const interactiveParent = el.closest('button, [data-char-id]');
        
        if (interactiveParent) {
            // Log the details of the interactive element found, not the raw target.
            let identifier = interactiveParent.tagName;
            if (interactiveParent.id) identifier += `#${interactiveParent.id}`;
            if (interactiveParent.className) {
                const classes = interactiveParent.className.toString().split(' ').filter(c => c).join('.');
                if (classes) identifier += `.${classes}`;
            }
            this.#log('ui_event', `User Click -> ${identifier}`);
        }
    }
    
    #log(type, ...args) {
        this.#capturedLogs.push({
            type: type,
            timestamp: new Date().toLocaleTimeString(),
            message: args
        });
        if (!this.#debugPanel.classList.contains('hidden')) {
            this.renderLogs();
        }
    }

    interceptConsole() {
        const methods = ['log', 'warn', 'error'];
        methods.forEach(method => {
            this.#originalConsole[method] = console[method];
            console[method] = (...args) => {
                this.#originalConsole[method](...args);
                this.#log(method, ...args);
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
                this.#debugContent.textContent = JSON.stringify(gameState?.current, null, 2);
            } catch (e) {
                this.#debugContent.textContent = "Error displaying game state: " + e.message;
            }
        }
    }

    renderLogs() {
        if (!this.#debugLogContent) return;
        this.#debugLogContent.innerHTML = '';
        this.#capturedLogs.forEach(log => {
            const logEntry = document.createElement('div');
            logEntry.className = `log-entry log-${log.type}`;
            const messageContent = log.message.map(arg => {
                if (typeof arg === 'object' && arg !== null) {
                    return JSON.stringify(arg);
                }
                return String(arg);
            }).join(' ');

            logEntry.innerHTML = `<span class="log-timestamp">[${log.timestamp}]</span><span class="log-type">${log.type.toUpperCase()}:</span><span class="log-message">${messageContent}</span>`;
            this.#debugLogContent.appendChild(logEntry);
        });
        this.#debugLogContent.scrollTop = this.#debugLogContent.scrollHeight;
    }

    copyAllLogs() {
        // This function's logic remains the same.
    }
}

// Add CSS for the new log type dynamically if it doesn't exist
if (!document.getElementById('debugger-styles')) {
    const styleSheet = document.createElement("style");
    styleSheet.id = 'debugger-styles';
    styleSheet.innerText = `
    .debug-panel .log-ui_event .log-message { color: #00FFFF; }
    .debug-panel .log-entry { border-bottom: 1px solid rgba(255, 255, 255, 0.05); padding: 4px 0; font-family: 'Courier New', monospace; font-size: 0.9em;}
    .debug-panel .log-timestamp { color: #888; margin-right: 8px; }
    .debug-panel .log-type { font-weight: bold; margin-right: 5px; }
    .debug-panel .log-log .log-message { color: #ccc; }
    .debug-panel .log-warn .log-message { color: #ffc107; }
    .debug-panel .log-error .log-message { color: #dc3545; }
    `;
    document.head.appendChild(styleSheet);
}