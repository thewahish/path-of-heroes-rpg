// filename: js/core/game.js

/**
 * @fileoverview The core Game class for Path of Heroes.
 * This class orchestrates the game, managing state, screen transitions,
 * system interactions, and global UI updates.
 */

import { GameConfig } from './config.js';
import { Localization } from './localization.js';
import { GameState } from './state.js';
import { CombatSystem } from '../systems/combat.js';
import { InventorySystem } from '../systems/inventory.js';

/**
 * The main game class for Path of Heroes.
 * Manages game flow, screen loading, and core systems.
 * @class
 */
export class PathOfHeroes {
    /**
     * @private
     * @type {Object.<string, any>}
     * Stores instances of core game systems (e.g., localization, state).
     */
    #systems = {};

    /**
     * @private
     * @type {HTMLElement}
     * Reference to the main screen content area in index.html.
     */
    #screenContentArea;

    /**
     * @private
     * @type {HTMLElement}
     * Reference to the global HUD container.
     */
    #globalHud;

    /**
     * Creates an instance of PathOfHeroes.
     */
    constructor() {
        // Bind methods to ensure 'this' context is correct for event listeners.
        this.bindMethods();
        this.#screenContentArea = document.getElementById('screen-content');
        this.#globalHud = document.getElementById('global-hud');
    }

    /**
     * Binds 'this' context for methods that will be used as event listeners or callbacks.
     * @private
     */
    bindMethods() {
        this.handleLanguageToggle = this.handleLanguageToggle.bind(this);
        this.handleInventoryButtonClick = this.handleInventoryButtonClick.bind(this);
        // Add other methods that need binding here
    }

    /**
     * Initializes the core game systems, sets up event listeners, and starts the loading sequence.
     * This is the entry point for the game logic after the DOM is loaded.
     */
    async init() {
        try {
            console.log(this.#systems.localization?.get('gameInitialized') || "Game initialized.");

            await this.initializeSystems();
            this.setupEventListeners();
            await this.startLoadingSequence();

            // After loading, transition to the Intro screen
            await this.setScreen('intro');

        } catch (error) {
            console.error("Critical game initialization error:", error);
            // In a real game, you might display a user-friendly error message here.
            alert("A critical error occurred during game startup. Please refresh.");
        }
    }

    /**
     * Initializes core game systems like Localization, GameState, CombatSystem, and InventorySystem.
     * @private
     * @returns {Promise<void>} A promise that resolves when all systems are initialized.
     */
    async initializeSystems() {
        try {
            // Initialize Localization first, as it's needed for other system messages
            this.#systems.localization = new Localization(GameConfig.DEFAULT_LANGUAGE);
            console.log(this.#systems.localization.get('systemInitialized') + "Localization");
            this.#systems.localization.updateLocalizedElements(); // Apply initial localization

            // Initialize GameState, which is an exported object, not a class
            this.#systems.gameState = GameState;
            console.log(this.#systems.localization.get('systemInitialized') + "GameState");

            // Initialize CombatSystem, passing the main game instance to its constructor
            this.#systems.combatSystem = new CombatSystem(this);
            console.log(this.#systems.localization.get('systemInitialized') + "CombatSystem");

            // Initialize InventorySystem, passing the main game instance to its constructor
            this.#systems.inventorySystem = new InventorySystem(this);
            console.log(this.#systems.localization.get('systemInitialized') + "InventorySystem");

        } catch (error) {
            console.error(this.#systems.localization?.get('errorInitializingSystem') + error.message);
            throw error; // Re-throw to halt init()
        }
    }

    /**
     * Sets up global event listeners for UI elements like language toggle, inventory button, and debugger.
     * @private
     */
    setupEventListeners() {
        // Language Toggle
        const languageToggleBtn = document.getElementById('language-toggle');
        if (languageToggleBtn) {
            languageToggleBtn.addEventListener('click', this.handleLanguageToggle);
        }

        // Inventory Button (part of Global HUD)
        const inventoryButton = document.getElementById('inventory-button');
        if (inventoryButton) {
            inventoryButton.addEventListener('click', this.handleInventoryButtonClick);
        }

        // Debugger toggle button listener is set up in debug.js
    }

    /**
     * Handles the click event for the language toggle button.
     * Switches between English and Arabic.
     * @private
     */
    handleLanguageToggle() {
        const currentLang = this.#systems.localization.getCurrentLanguage();
        const newLang = currentLang === 'en' ? 'ar' : 'en';
        this.#systems.localization.setLanguage(newLang);
    }

    /**
     * Handles the click event for the inventory button.
     * (Placeholder for future inventory screen logic)
     * @private
     */
    handleInventoryButtonClick() {
        console.log("Inventory button clicked! (Functionality to be implemented)");
        // Future: Open/close inventory screen
    }

    /**
     * Simulates a loading sequence with a progress bar.
     * @private
     * @returns {Promise<void>} A promise that resolves when the loading sequence is complete.
     */
    startLoadingSequence() {
        return new Promise(resolve => {
            const loadingScreen = document.getElementById('loading-screen');
            const loadingBar = document.getElementById('loading-bar');
            const gameContainer = document.getElementById('game-container');

            if (GameConfig.LOADING_DURATION_MS === 0) {
                loadingScreen.classList.add('hidden');
                gameContainer.classList.remove('hidden');
                resolve();
                return;
            }

            let width = 0;
            const intervalTime = 50; // Update every 50ms
            const totalSteps = GameConfig.LOADING_DURATION_MS / intervalTime;
            const increment = 100 / totalSteps;

            const loadingInterval = setInterval(() => {
                width += increment;
                if (width >= 100) {
                    width = 100;
                    clearInterval(loadingInterval);
                    loadingScreen.classList.add('hidden');
                    gameContainer.classList.remove('hidden');
                    resolve();
                }
                loadingBar.style.width = width + '%';
            }, intervalTime);
        });
    }

    /**
     * Loads and displays a specified game screen.
     * This involves fetching HTML, injecting it, and loading screen-specific JavaScript.
     * @param {string} screenId - The ID of the screen to load (e.g., 'intro', 'battle').
     * @returns {Promise<void>} A promise that resolves when the screen is loaded and initialized.
     */
    async setScreen(screenId) {
        const screenInfo = GameConfig.SCREENS[screenId];
        if (!screenInfo) {
            console.error(`Screen configuration not found for ID: ${screenId}`);
            return;
        }

        try {
            // Fetch HTML for the new screen
            const response = await fetch(screenInfo.html);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const htmlContent = await response.text();

            // Clear current screen content and inject new HTML
            this.#screenContentArea.innerHTML = htmlContent;

            // Load screen-specific JavaScript module
            const module = await import(`../../${screenInfo.js}`);
            if (module.init) {
                // Pass game instance and localization to the screen's init function
                module.init(this, this.#systems.localization);
            }

            // Update global HUD visibility based on screen
            this.updateGlobalHUDVisibility(screenId);

            // Re-apply localization after new screen content is loaded
            this.#systems.localization.updateLocalizedElements();

            console.log(this.#systems.localization.get('screenLoaded') + screenId);

        } catch (error) {
            console.error(this.#systems.localization.get('errorLoadingScreen') + screenId, error);
        }
    }

    /**
     * Updates the visibility of the global HUD based on the current screen.
     * @param {string} currentScreenId - The ID of the currently active screen.
     * @private
     */
    updateGlobalHUDVisibility(currentScreenId) {
        // Global elements appear only after Character Selection
        // and are hidden on Main Menu and Character Selection screens.
        if (currentScreenId === 'intro' || currentScreenId === 'character-select') {
            this.#globalHud.classList.add('hidden');
        } else {
            this.#globalHud.classList.remove('hidden');
            // Placeholder: update actual floor/gold numbers
            this.updateElement('floor-number', '1');
            this.updateElement('gold-count', '0');
        }
    }

    /**
     * Updates the visual fill percentage of a progress bar (e.g., HP, Mana).
     * @param {string} barId - The ID of the bar element (e.g., 'player-hp-bar', 'enemy-mana-bar').
     * @param {number} current - The current value of the bar.
     * @param {number} max - The maximum possible value of the bar.
     */
    updateBar(barId, current, max) {
        const barElement = document.getElementById(barId);
        if (barElement) {
            const percentage = max > 0 ? (current / max) * 100 : 0;
            barElement.style.width = `${percentage}%`;
        } else {
            console.warn(`Bar element with ID '${barId}' not found.`);
        }
    }

    /**
     * Updates the text content of a specific HTML element by ID.
     * @param {string} id - The ID of the HTML element to update.
     * @param {string|number} value - The new text content for the element.
     */
    updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        } else {
            console.warn(`Element with ID '${id}' not found.`);
        }
    }

    /**
     * Provides access to initialized game systems.
     * @param {string} systemName - The name of the system to retrieve (e.g., 'localization').
     * @returns {any} The requested system instance, or undefined if not found.
     */
    getSystem(systemName) {
        return this.#systems[systemName];
    }
}