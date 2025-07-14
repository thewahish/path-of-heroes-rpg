// filename: js/main.js

/**
 * @fileoverview Main entry point for the Path of Heroes game.
 * This script initializes the game when the DOM is fully loaded.
 */

import { PathOfHeroes } from './core/game.js';
import { Debugger } from './debug.js';
import { GameConfig } from './core/config.js';

// Global instance of the game
let game;
// Global instance of the debugger
let debuggerInstance;

/**
 * Initializes the game and debugger when the window loads.
 * This ensures all DOM elements are available before script execution.
 */
window.onload = () => {
    // Initialize the debugger first, so it can capture early logs
    if (GameConfig.DEBUG_MODE) {
        debuggerInstance = new Debugger();
        debuggerInstance.init();
    }

    // Initialize the main game instance
    game = new PathOfHeroes();
    game.init();

    // Make game and debugger instances globally accessible for debugging in console (optional)
    window.pathOfHeroesGame = game;
    window.pathOfHeroesDebugger = debuggerInstance;
};

// Prevent default touch behavior (e.g., pull-to-refresh) for a mobile-first game
document.addEventListener('touchstart', function(event) {
    // Check if the target is an interactive element (button, input, etc.)
    // If not, prevent default to avoid accidental scrolling/refreshing
    const tagName = event.target.tagName.toLowerCase();
    if (tagName !== 'button' && tagName !== 'input' && tagName !== 'textarea' && tagName !== 'select' && !event.target.closest('.scrollable-content')) {
        event.preventDefault();
    }
}, { passive: false }); // Use passive: false to allow preventDefault

document.addEventListener('touchmove', function(event) {
    // Allow scrolling within explicitly scrollable areas
    if (!event.target.closest('.scrollable-content')) {
        event.preventDefault();
    }
}, { passive: false });
