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
        this.startGame = this.startGame.bind(this);
    }

    /**
     * Initializes the core game systems, sets up event listeners, and starts the loading sequence.
     * This is the entry point for the game logic after the DOM is loaded.
     */
    async init() {
        try {
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
            console.log("System initialized: Localization");
            this.#systems.localization.updateLocalizedElements(); // Apply initial localization

            // Initialize GameState, which is an exported object, not a class
            this.#systems.gameState = GameState;
            console.log("System initialized: GameState");

            // Initialize CombatSystem, passing the main game instance to its constructor
            this.#systems.combatSystem = new CombatSystem(this);
            console.log("System initialized: CombatSystem");

            // Initialize InventorySystem, passing the main game instance to its constructor
            this.#systems.inventorySystem = new InventorySystem(this);
            console.log("System initialized: InventorySystem");

        } catch (error) {
            console.error("Error initializing system: " + error.message);
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
    }

    /**
     * Handles the click event for the language toggle button.
     * @private
     */
    handleLanguageToggle() {
        const currentLang = this.#systems.localization.getCurrentLanguage();
        const newLang = currentLang === 'en' ? 'ar' : 'en';
        this.#systems.localization.setLanguage(newLang);
    }

    /**
     * Handles the click event for the inventory button.
     * @private
     */
    handleInventoryButtonClick() {
        console.log("Inventory button clicked! (Functionality to be implemented)");
    }

    /**
     * Simulates a loading sequence with a progress bar.
     * @private
     * @returns {Promise<void>}
     */
    startLoadingSequence() {
        console.log("Game initialized.");
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
            const intervalTime = 50;
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
     * @param {string} screenId
     * @returns {Promise<void>}
     */
    async setScreen(screenId) {
        const screenInfo = GameConfig.SCREENS[screenId];
        if (!screenInfo) {
            console.error(`Screen configuration not found for ID: ${screenId}`);
            return;
        }

        try {
            const response = await fetch(screenInfo.html);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const htmlContent = await response.text();
            this.#screenContentArea.innerHTML = htmlContent;

            const module = await import(`../../${screenInfo.js}`);
            if (module.init) {
                module.init(this, this.#systems.localization);
            }

            this.updateGlobalHUDVisibility(screenId);
            this.#systems.localization.updateLocalizedElements();
            console.log(`Screen loaded: ${screenId}`);

        } catch (error) {
            console.error(`Error loading screen: ${screenId}`, error);
        }
    }
    
    /**
     * Starts a new game run.
     * @param {string} characterId - The ID of the selected character.
     */
    startGame(characterId) {
        console.log(`--- Starting new game with character: ${characterId} ---`);
        const gameState = this.getSystem('gameState');
        const inventorySystem = this.getSystem('inventorySystem');

        // 1. Initialize the game state for a new run
        console.log("DEBUG: Calling gameState.newGame...");
        gameState.newGame(characterId);
        console.log("DEBUG: gameState.newGame() completed. Player object:", gameState.current.player);
        
        // 2. Add starting items (logic moved from state.js)
        console.log("DEBUG: Generating starting weapon...");
        const startingWeapon = inventorySystem.generateItem('sword', 1, 'common');
        console.log("DEBUG: Generated weapon:", startingWeapon);

        if (startingWeapon) {
            console.log("DEBUG: Adding weapon to inventory...");
            gameState.addItemToInventory(startingWeapon);
            console.log("DEBUG: Equipping weapon...");
            gameState.equipItem(startingWeapon);
            console.log("DEBUG: Weapon equipped.");
        } else {
            console.warn("DEBUG: Starting weapon could not be generated.");
        }

        // 3. Transition to the first screen of the dungeon (Battle Screen for now)
        console.log("DEBUG: Preparing to set screen to 'battle'...");
        this.setScreen('battle');
    }

    /**
     * Updates the visibility of the global HUD based on the current screen.
     * @param {string} currentScreenId
     * @private
     */
    updateGlobalHUDVisibility(currentScreenId) {
        if (currentScreenId === 'intro' || currentScreenId === 'character-select') {
            this.#globalHud.classList.add('hidden');
        } else {
            this.#globalHud.classList.remove('hidden');
            this.updateElement('floor-number', '1');
            this.updateElement('gold-count', '0'); // This should be updated from gameState
        }
    }

    /**
     * Updates the visual fill percentage of a progress bar.
     * @param {string} barId
     * @param {number} current
     * @param {number} max
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
     * @param {string} id
     * @param {string|number} value
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
     * @param {string} systemName
     * @returns {any}
     */
    getSystem(systemName) {
        return this.#systems[systemName];
    }
}