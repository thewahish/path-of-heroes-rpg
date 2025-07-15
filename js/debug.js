// filename: js/debug.js

/**
 * @fileoverview Advanced Debugger system for Path of Heroes.
 * Provides real-time game state display, console log capture, and error handling.
 * Features include interactive collapsible logs and a "Copy All Logs" button.
 */

import { GameConfig } from './core/config.js';

/**
 * Debugger class for managing and displaying game debugging information.
 * @class
 */
export class Debugger {
    /**
     * @private
     * @type {HTMLElement}
     * Reference to the debugger panel element.
     */
    #debugPanel;

    /**
     * @private
     * @type {HTMLElement}
     * Reference to the game state content display area.
     */
    #debugContent;

    /**
     * @private
     * @type {HTMLElement}
     * Reference to the console log display area.
     */
    #debugLogContent;

    /**
     * @private
     * @type {Array<Object>}
     * Array to store captured console messages.
     */
    #capturedLogs = [];

    /**
     * @private
     * @type {Console}
     * Reference to the original console object before interception.
     */
    #originalConsole = {};

    /**
     * Creates an instance of Debugger.
     */
    constructor() {
        this.#debugPanel = document.getElementById('debug-panel');
        this.#debugContent = document.getElementById('debug-content');
        this.#debugLogContent = document.getElementById('debug-log-content');
        this.bindMethods();
    }

    /**
     * Binds 'this' context for methods that will be used as event listeners.
     * @private
     */
    bindMethods() {
        this.togglePanel = this.togglePanel.bind(this);
        this.copyAllLogs = this.copyAllLogs.bind(this);
        this.handleError = this.handleError.bind(this);
        this.handleUnhandledRejection = this.handleUnhandledRejection.bind(this);
    }

    /**
     * Initializes the debugger system.
     * Sets up event listeners and intercepts console methods if DEBUG_MODE is true.
     */
    init() {
        if (!GameConfig.DEBUG_MODE) {
            // Hide debugger button if debug mode is off
            const debugToggleBtn = document.getElementById('debug-toggle-btn');
            if (debugToggleBtn) {
                debugToggleBtn.classList.add('hidden');
            }
            return;
        }

        this.setupEventListeners();
        this.interceptConsole();
        this.setupErrorHandlers();
        console.log("Debugger initialized.");
    }

    /**
     * Sets up event listeners for the debugger toggle, close, and copy buttons.
     * @private
     */
    setupEventListeners() {
        const debugToggleBtn = document.getElementById('debug-toggle-btn');
        const debugCloseBtn = document.getElementById('debug-close-btn');
        const debugCopyBtn = document.getElementById('debug-copy-btn');

        if (debugToggleBtn) {
            debugToggleBtn.addEventListener('click', this.togglePanel);
        }
        if (debugCloseBtn) {
            debugCloseBtn.addEventListener('click', this.togglePanel);
        }
        if (debugCopyBtn) {
            debugCopyBtn.addEventListener('click', this.copyAllLogs);
        }
    }

    /**
     * Intercepts console methods (log, warn, error) to capture messages.
     * @private
     */
    interceptConsole() {
        const methods = ['log', 'warn', 'error'];
        methods.forEach(method => {
            this.#originalConsole[method] = console[method]; // Store original method
            console[method] = (...args) => {
                this.#originalConsole[method](...args); // Call original console method
                this.#capturedLogs.push({
                    type: method,
                    timestamp: new Date().toLocaleTimeString(),
                    message: args
                });
                this.renderLogs();
            };
        });
    }

    /**
     * Sets up global error and unhandled promise rejection handlers.
     * @private
     */
    setupErrorHandlers() {
        window.onerror = this.handleError;
        window.onunhandledrejection = this.handleUnhandledRejection;
    }

    /**
     * Handles global JavaScript errors.
     * @private
     * @param {string} message - Error message.
     * @param {string} source - URL of the script where the error occurred.
     * @param {number} lineno - Line number where the error occurred.
     * @param {number} colno - Column number where the error occurred.
     * @param {Error} error - The Error object.
     * @returns {boolean} True to prevent default error handling.
     */
    handleError(message, source, lineno, colno, error) {
        const errorLog = {
            type: 'error',
            timestamp: new Date().toLocaleTimeString(),
            message: [`Uncaught Error: ${message}`],
            details: { source, lineno, colno, stack: error ? error.stack : 'No stack trace available' }
        };
        this.#capturedLogs.push(errorLog);
        this.renderLogs();
        return true; // Prevent default browser error handling
    }

    /**
     * Handles unhandled promise rejections.
     * @private
     * @param {PromiseRejectionEvent} event - The promise rejection event.
     */
    handleUnhandledRejection(event) {
        const reason = event.reason;
        const errorLog = {
            type: 'error',
            timestamp: new Date().toLocaleTimeString(),
            message: [`Unhandled Promise Rejection: ${reason}`],
            details: { stack: reason instanceof Error ? reason.stack : 'No stack trace available' }
        };
        this.#capturedLogs.push(errorLog);
        this.renderLogs();
        event.preventDefault(); // Prevent default browser handling
    }

    /**
     * Toggles the visibility of the debugger panel.
     */
    togglePanel() {
        this.#debugPanel.classList.toggle('hidden');
        if (this.#debugPanel.classList.contains('hidden')) {
            console.log("Debugger panel closed."); // Use original console for this
        } else {
            console.log("Debugger panel opened."); // Use original console for this
            this.updateGameStateDisplay(); // Refresh game state when opening
            this.renderLogs(); // Re-render logs to ensure up-to-date
        }
    }

    /**
     * Updates the displayed game state in the debugger panel.
     * Currently, it displays the global `window.pathOfHeroesGame` object.
     * This can be extended to display specific game state properties.
     */
    updateGameStateDisplay() {
        if (this.#debugContent) {
            try {
                // Access the game instance from the global scope if it's there
                const gameState = window.pathOfHeroesGame ? window.pathOfHeroesGame.getSystem('gameState') : {}; // Future: get actual game state
                this.#debugContent.innerHTML = this.formatObjectAsCollapsible(gameState || {});
            } catch (e) {
                this.#debugContent.textContent = "Error displaying game state: " + e.message;
            }
        }
    }

    /**
     * Renders all captured logs into the debugger's console log display area.
     * Formats objects/arrays as interactive, collapsible trees.
     * @private
     */
    renderLogs() {
        if (this.#debugLogContent) {
            this.#debugLogContent.innerHTML = ''; // Clear previous logs
            this.#capturedLogs.forEach(log => {
                const logEntry = document.createElement('div');
                logEntry.classList.add('log-entry', `log-${log.type}`);
                logEntry.innerHTML = `
                    <span class="log-timestamp">[${log.timestamp}]</span>
                    <span class="log-type">${log.type.toUpperCase()}:</span>
                    <span class="log-message"></span>
                `;
                const messageSpan = logEntry.querySelector('.log-message');

                log.message.forEach(arg => {
                    const argElement = document.createElement('span');
                    if (typeof arg === 'object' && arg !== null) {
                        argElement.innerHTML = this.formatObjectAsCollapsible(arg);
                    } else {
                        argElement.textContent = String(arg) + ' '; // Add space for readability
                    }
                    messageSpan.appendChild(argElement);
                });

                if (log.details) {
                    const detailsSpan = document.createElement('span');
                    detailsSpan.classList.add('log-details');
                    detailsSpan.innerHTML = this.formatObjectAsCollapsible(log.details);
                    messageSpan.appendChild(detailsSpan);
                }

                this.#debugLogContent.appendChild(logEntry);
            });
            // Auto-scroll to the bottom
            this.#debugLogContent.scrollTop = this.#debugLogContent.scrollHeight;
        }
    }

    /**
     * Formats an object or array into an HTML string with collapsible sections.
     * @private
     * @param {any} obj - The object or array to format.
     * @param {number} [indent=0] - Current indentation level.
     * @returns {string} HTML string representing the collapsible object.
     */
    formatObjectAsCollapsible(obj, indent = 0) {
        const maxDepth = 3; // Limit recursion depth for display
        if (indent > maxDepth) {
            return `<span class="ellipsis">...</span>`;
        }

        let html = '';
        const isArray = Array.isArray(obj);
        const type = isArray ? 'array' : (obj === null ? 'null' : typeof obj);
        const prefix = isArray ? '[' : '{';
        const suffix = isArray ? ']' : '}';

        if (type === 'object' && obj !== null) {
            const keys = Object.keys(obj);
            if (keys.length === 0) {
                return `<span class="collapsible-toggle empty">${prefix}${suffix}</span>`;
            }

            html += `<span class="collapsible-toggle">${prefix}<span class="ellipsis">...</span>${suffix}</span>`;
            html += `<ul class="collapsible-content hidden">`;
            keys.forEach(key => {
                const value = obj[key];
                const keyDisplay = isArray ? '' : `<span class="key">${key}:</span> `;
                html += `<li>${keyDisplay}`;
                if (typeof value === 'object' && value !== null) {
                    html += this.formatObjectAsCollapsible(value, indent + 1);
                } else {
                    html += `<span class="value">${JSON.stringify(value)}</span>`;
                }
                html += `</li>`;
            });
            html += `</ul>`;
        } else {
            html = `<span class="value">${JSON.stringify(obj)}</span>`;
        }
        return html;
    }

    /**
     * Copies all captured logs to the clipboard.
     */
    copyAllLogs() {
        const logText = this.#capturedLogs.map(log => {
            let message = log.message.map(arg => {
                if (typeof arg === 'object' && arg !== null) {
                    return JSON.stringify(arg, null, 2); // Pretty print objects
                }
                return String(arg);
            }).join(' ');

            if (log.details) {
                message += '\n' + JSON.stringify(log.details, null, 2);
            }
            return `[${log.timestamp}] ${log.type.toUpperCase()}: ${message}`;
        }).join('\n\n');

        // Use document.execCommand('copy') as navigator.clipboard.writeText() may not work in iframes.
        const tempTextArea = document.createElement('textarea');
        tempTextArea.value = logText;
        document.body.appendChild(tempTextArea);
        tempTextArea.select();
        try {
            document.execCommand('copy');
            console.log("All logs copied to clipboard!"); // Use original console
        } catch (err) {
            console.error("Failed to copy logs:", err); // Use original console
        } finally {
            document.body.removeChild(tempTextArea);
        }
    }
}

// Add CSS for debugger panel and collapsible logs dynamically
// This is done here to ensure the debugger's specific styles are available
// even if main.css is not fully loaded or if debugger is used standalone.
const debugCss = `
.debug-panel .log-entry {
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    padding: 8px 0;
    font-size: 0.9em;
    line-height: 1.4;
}
.debug-panel .log-entry:last-child {
    border-bottom: none;
}
.debug-panel .log-timestamp {
    color: #888;
    margin-right: 8px;
}
.debug-panel .log-type {
    font-weight: bold;
    margin-right: 5px;
}
.debug-panel .log-log { color: #ccc; }
.debug-panel .log-warn { color: #ffc107; } /* Amber */
.debug-panel .log-error { color: #dc3545; } /* Red */
.debug-panel .log-message {
    color: #eee;
}
.debug-panel .collapsible-toggle {
    cursor: pointer;
    color: #87ceeb; /* Light blue for toggles */
    user-select: none;
}
.debug-panel .collapsible-toggle.empty {
    cursor: default;
    color: #ccc;
}
.debug-panel .collapsible-content {
    list-style: none;
    padding-left: 20px;
    margin: 0;
    border-left: 1px dashed rgba(255, 255, 255, 0.1);
}
.debug-panel .collapsible-content.hidden {
    display: none;
}
.debug-panel .collapsible-content li {
    margin: 2px 0;
}
.debug-panel .collapsible-content .key {
    color: #90ee90; /* Light green for keys */
}
.debug-panel .collapsible-content .value {
    color: #f8e4c0; /* Text color for values */
}
.debug-panel .ellipsis {
    color: #aaa;
    font-style: italic;
}
.debug-panel .log-details {
    display: block;
    margin-top: 5px;
    font-size: 0.8em;
    color: #ff6347; /* Error details color */
}
`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = debugCss;
document.head.appendChild(styleSheet);

// Add event listener for collapsible sections within the debugger
document.addEventListener('click', (event) => {
    if (event.target.classList.contains('collapsible-toggle')) {
        const toggle = event.target;
        const content = toggle.nextElementSibling;
        if (content && content.classList.contains('collapsible-content')) {
            content.classList.toggle('hidden');
            const ellipsis = toggle.querySelector('.ellipsis');
            if (ellipsis) {
                ellipsis.style.display = content.classList.contains('hidden') ? 'inline' : 'none';
            }
        }
    }
});