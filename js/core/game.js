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
    }

    async init() {
        try {
            await this.initializeSystems();
            this.setupEventListeners();
            await this.startLoadingSequence();
            await this.setScreen('intro');
        } catch (error) {
            console.error("Critical game initialization error:", error);
            alert("A critical error occurred. Please refresh.");
        }
    }

    async initializeSystems() {
        this.#systems.localization = new Localization(GameConfig.DEFAULT_LANGUAGE);
        console.log("System initialized: Localization");

        this.#systems.gameState = GameState;
        console.log("System initialized: GameState");

        this.#systems.combatSystem = new CombatSystem(this);
        console.log("System initialized: CombatSystem");

        this.#systems.inventorySystem = new InventorySystem(this);
        console.log("System initialized: InventorySystem");
        
        this.#systems.localization.updateLocalizedElements();
    }

    setupEventListeners() {
        document.getElementById('language-toggle')?.addEventListener('click', this.handleLanguageToggle);
    }

    handleLanguageToggle() {
        const loc = this.getSystem('localization');
        const newLang = loc.getCurrentLanguage() === 'en' ? 'ar' : 'en';
        loc.setLanguage(newLang);
    }

    startLoadingSequence() {
        console.log("Game initialized.");
        const loadingScreen = document.getElementById('loading-screen');
        const gameContainer = document.getElementById('game-container');
        loadingScreen.classList.add('hidden');
        gameContainer.classList.remove('hidden');
        return Promise.resolve();
    }

    async setScreen(screenId) {
        const screenInfo = GameConfig.SCREENS[screenId];
        if (!screenInfo) {
            console.error(`Screen configuration not found for ID: ${screenId}`);
            return;
        }

        try {
            const response = await fetch(screenInfo.html);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            this.#screenContentArea.innerHTML = await response.text();
            
            const module = await import(`../../${screenInfo.js}`);
            this.#systems.activeScreenModule = module; // Store active module
            
            if (module.init) {
                module.init(this);
            }

            this.updateGlobalHUDVisibility(screenId);
            this.getSystem('localization').updateLocalizedElements();
            console.log(`Screen loaded: ${screenId}`);
        } catch (error) {
            console.error(`Error loading screen: ${screenId}`, error);
        }
    }
    
    startGame(characterId) {
        console.log(`--- Starting new game with character: ${characterId} ---`);
        const gameState = this.getSystem('gameState');
        const inventorySystem = this.getSystem('inventorySystem');
        
        gameState.newGame(characterId);
        
        const startingWeapon = inventorySystem.generateItem('sword', 1, 'common');
        if (startingWeapon) {
            gameState.addItemToInventory(startingWeapon);
            gameState.equipItem(startingWeapon);
        }

        const dummyEnemy = {
            id: 'skeleton_1',
            name: 'Skeleton',
            stats: { hp: 30, maxHp: 30, atk: 8, def: 5, spd: 7, crit: 5 },
            resource: {},
        };
        gameState.startBattle([dummyEnemy]);

        this.setScreen('battle');
    }

    updateGlobalHUDVisibility(screenId) {
        const hud = document.getElementById('global-hud');
        if (!hud) return;
        // The new battle screen design has its own integrated HUD.
        // The global HUD should be hidden on intro, char-select, and battle.
        if (['intro', 'character-select', 'battle'].includes(screenId)) {
            hud.classList.add('hidden');
        } else {
            hud.classList.remove('hidden');
        }
    }
    
    getSystem(systemName) {
        return this.#systems[systemName];
    }
    
    getActiveScreenModule() {
        return this.getSystem('activeScreenModule');
    }
}