// filename: js/core/game.js

import { GameConfig } from './config.js';
import { Localization } from './localization.js';
import { GameState } from './state.js';
import { CombatSystem } from '../systems/combat.js';
import { InventorySystem } from '../systems/inventory.js';

export class PathOfHeroes {
    #systems = {};
    #screenContentArea;
    
    constructor() {
        this.bindMethods();
        this.#screenContentArea = document.getElementById('screen-content');
    }

    bindMethods() {
        this.handleLanguageToggle = this.handleLanguageToggle.bind(this);
        this.startGame = this.startGame.bind(this);
        this.updateBar = this.updateBar.bind(this);
        this.updateElement = this.updateElement.bind(this);
    }

    async init() {
        try {
            console.log("Initializing Path of Heroes game...");
            await this.initializeSystems();
            this.setupEventListeners();
            await this.startLoadingSequence();
            await this.setScreen('intro');
            console.log("Game initialization complete!");
        } catch (error) {
            console.error("Critical game initialization error:", error);
            alert("A critical error occurred during game initialization. Please refresh the page.");
        }
    }

    async initializeSystems() {
        try {
            // Initialize Localization System
            this.#systems.localization = new Localization(GameConfig.DEFAULT_LANGUAGE);
            console.log("System initialized: Localization");

            // Initialize Game State System
            this.#systems.gameState = GameState;
            console.log("System initialized: GameState");

            // Initialize Combat System
            this.#systems.combatSystem = new CombatSystem(this);
            console.log("System initialized: CombatSystem");

            // Initialize Inventory System
            this.#systems.inventorySystem = new InventorySystem(this);
            console.log("System initialized: InventorySystem");
            
            // Initialize inventory system properly
            if (this.#systems.inventorySystem.init) {
                this.#systems.inventorySystem.init();
            }
            
            // Update initial localized elements
            this.#systems.localization.updateLocalizedElements();
            
            console.log("All systems initialized successfully");
        } catch (error) {
            console.error("Error during system initialization:", error);
            throw error;
        }
    }

    setupEventListeners() {
        // Language toggle button
        const languageToggle = document.getElementById('language-toggle');
        if (languageToggle) {
            languageToggle.addEventListener('click', this.handleLanguageToggle);
            console.log("Language toggle event listener attached");
        }

        // Global inventory button (when visible)
        const inventoryButton = document.getElementById('inventory-button');
        if (inventoryButton) {
            inventoryButton.addEventListener('click', () => {
                console.log("Global inventory button clicked");
                this.toggleInventory();
            });
        }
    }

    handleLanguageToggle() {
        const loc = this.getSystem('localization');
        const newLang = loc.getCurrentLanguage() === 'en' ? 'ar' : 'en';
        console.log(`Switching language to: ${newLang}`);
        loc.setLanguage(newLang);
        
        // Re-update any screen-specific content
        const activeModule = this.getActiveScreenModule();
        if (activeModule && activeModule.updateBattleUI) {
            activeModule.updateBattleUI();
        }
    }

    async startLoadingSequence() {
        console.log("Starting loading sequence...");
        
        const loadingScreen = document.getElementById('loading-screen');
        const gameContainer = document.getElementById('game-container');
        const loadingBar = document.getElementById('loading-bar');
        
        if (loadingBar) {
            // Simulate loading progress
            let progress = 0;
            const loadingInterval = setInterval(() => {
                progress += Math.random() * 30;
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(loadingInterval);
                    
                    // Hide loading screen and show game
                    setTimeout(() => {
                        if (loadingScreen) loadingScreen.classList.add('hidden');
                        if (gameContainer) gameContainer.classList.remove('hidden');
                    }, 200);
                }
                loadingBar.style.width = progress + '%';
            }, 100);
        } else {
            // Fallback if no loading bar
            setTimeout(() => {
                if (loadingScreen) loadingScreen.classList.add('hidden');
                if (gameContainer) gameContainer.classList.remove('hidden');
            }, GameConfig.LOADING_DURATION_MS || 1000);
        }
        
        return Promise.resolve();
    }

    async setScreen(screenId) {
        const screenInfo = GameConfig.SCREENS[screenId];
        if (!screenInfo) {
            console.error(`Screen configuration not found for ID: ${screenId}`);
            return;
        }

        try {
            console.log(`Loading screen: ${screenId}`);
            
            // Fetch the HTML content
            const response = await fetch(screenInfo.html);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            // Load HTML content
            this.#screenContentArea.innerHTML = await response.text();
            
            // Import and initialize the screen module
            const module = await import(`../../${screenInfo.js}`);
            this.#systems.activeScreenModule = module; // Store active module
            
            if (module.init && typeof module.init === 'function') {
                module.init(this);
            }

            // Update global HUD visibility
            this.updateGlobalHUDVisibility(screenId);
            
            // Update localized elements
            this.getSystem('localization').updateLocalizedElements();
            
            console.log(`Screen loaded successfully: ${screenId}`);
        } catch (error) {
            console.error(`Error loading screen: ${screenId}`, error);
            alert(`Failed to load screen: ${screenId}. Please try again.`);
        }
    }
    
    startGame(characterId) {
        console.log(`--- Starting new game with character: ${characterId} ---`);
        
        try {
            const gameState = this.getSystem('gameState');
            const inventorySystem = this.getSystem('inventorySystem');
            
            // Initialize new game
            gameState.newGame(characterId);
            console.log("Game state initialized for new game");
            
            // Give starting equipment
            const startingWeapon = inventorySystem.generateItem('sword', 1, 'common');
            if (startingWeapon) {
                gameState.addItemToInventory(startingWeapon);
                gameState.equipItem(startingWeapon);
                console.log("Starting weapon equipped:", startingWeapon.name);
            }

            // Add some starting potions
            const healthPotion = inventorySystem.generateItem('hp_potion', 1, 'common');
            if (healthPotion) {
                gameState.addItemToInventory(healthPotion);
                console.log("Starting health potion added");
            }

            // Create dummy enemy for battle
            const dummyEnemy = {
                id: 'skeleton_1',
                name: 'Skeleton Warrior',
                stats: { 
                    hp: 30, 
                    maxHp: 30, 
                    atk: 8, 
                    def: 3, 
                    spd: 6, 
                    crit: 5 
                },
                resource: {},
            };
            
            // Start the battle
            gameState.startBattle([dummyEnemy]);
            console.log("Battle initialized with enemy:", dummyEnemy.name);

            // Navigate to battle screen
            this.setScreen('battle');
            
        } catch (error) {
            console.error("Error starting new game:", error);
            alert("Failed to start new game. Please try again.");
        }
    }

    updateGlobalHUDVisibility(screenId) {
        const hud = document.getElementById('global-hud');
        if (!hud) return;
        
        // Hide global HUD on intro, character-select, and battle screens
        // (battle screen has its own integrated HUD)
        const hideHudScreens = ['intro', 'character-select', 'battle'];
        
        if (hideHudScreens.includes(screenId)) {
            hud.classList.add('hidden');
        } else {
            hud.classList.remove('hidden');
            this.updateGlobalHUD();
        }
    }

    updateGlobalHUD() {
        const gameState = this.getSystem('gameState');
        if (!gameState || !gameState.current.gameStarted) return;

        // Update floor number
        this.updateElement('floor-number', gameState.current.currentFloor);
        
        // Update gold count
        this.updateElement('gold-count', gameState.current.gold);
    }

    toggleInventory() {
        // Placeholder for inventory toggle functionality
        console.log("Inventory toggle requested");
        alert("Inventory system integration pending!");
    }
    
    // Utility method to update progress bars
    updateBar(barId, current, max) {
        const bar = document.getElementById(barId);
        if (bar && max > 0) {
            const percentage = Math.max(0, Math.min(100, (current / max) * 100));
            bar.style.width = percentage + '%';
        }
    }

    // Utility method to update text content
    updateElement(elementId, value) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = value;
        }
    }
    
    // System getter method
    getSystem(systemName) {
        const system = this.#systems[systemName];
        if (!system) {
            console.warn(`System '${systemName}' not found or not initialized`);
        }
        return system;
    }
    
    // Get the currently active screen module
    getActiveScreenModule() {
        return this.getSystem('activeScreenModule');
    }

    // Method to handle errors gracefully
    handleError(error, context = 'Unknown') {
        console.error(`Error in ${context}:`, error);
        
        // Log to debugger if available
        if (window.pathOfHeroesDebugger) {
            window.pathOfHeroesDebugger.handleError(error.message, 'game.js', 0, 0, error);
        }
    }
}