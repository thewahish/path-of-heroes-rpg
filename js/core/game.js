// js/core/game.js
// Main Game Class
window.PathOfHeroes = class PathOfHeroes {
    constructor() {
        this.initialized = false;
        this.debugUpdateInterval = null;
        this.activeScreenModule = null; // Track the currently active screen module
        this.bindMethods();
    }

    bindMethods() {
        this.showMainMenu = this.showMainMenu.bind(this);
        this.showCharacterSelect = this.showCharacterSelect.bind(this);
        this.selectCharacter = this.selectCharacter.bind(this);
        this.startGameRun = this.startGameRun.bind(this);
        this.toggleLanguage = this.toggleLanguage.bind(this);
        this.showInventory = this.showInventory.bind(this);
        this.closeInventory = this.closeInventory.bind(this);
        this.setupCharacterScreen = this.setupCharacterScreen.bind(this);
        this.displayCharacterDetails = this.displayCharacterDetails.bind(this);
        this.updateLanguageDisplay = this.updateLanguageDisplay.bind(this);
        this.updateBattleDisplay = this.updateBattleDisplay.bind(this);
        this.updateBar = this.updateBar.bind(this);
        this.updateElement = this.updateElement.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.defeat = this.defeat.bind(this);
        this.victory = this.victory.bind(this);
        this.enterBattle = this.enterBattle.bind(this);
        this.showLoadGame = this.showLoadGame.bind(this);
        this.showOptions = this.showOptions.bind(this);
        this.showStatsModal = this.showStatsModal.bind(this);
        this.hideStatsModal = this.hideStatsModal.bind(this);
        this.updateGlobalHUD = this.updateGlobalHUD.bind(this);
    }

    async init() {
        try {
            this.initializeSystems();
            this.setupEventListeners();
            this.startLoadingSequence();
            this.initialized = true;
        } catch (error) {
            console.error('Failed to create or initialize game instance:', error);
            alert('A critical error occurred and the game cannot start. Please refresh the page.');
            throw error;
        }
    }

    initializeSystems() {
        this.localization = window.Localization;
        this.state = window.GameState;
        this.combat = new window.CombatSystem(this);
        this.inventory = new window.InventorySystem(this);
        if (this.localization) this.localization.init();
        if (this.inventory) this.inventory.init();
    }

    setupEventListeners() {
        document.addEventListener('keydown', this.handleKeyDown);
    }

    handleKeyDown(event) {
        // Inventory toggle for all non-battle game screens
        if (event.code === 'KeyI' && this.state.current.gameStarted) {
            if (this.state.current.currentScreen !== 'battle-screen') {
                 if (this.state.current.currentScreen === 'inventory-screen') {
                    this.closeInventory();
                } else {
                    this.showInventory();
                }
            }
        }
        // Battle actions only if battle screen is active AND it's player's turn
        if (this.state.current.currentScreen === 'battle-screen' && this.combat.getCurrentActor()?.type === 'player') {
            switch(event.code) {
                case 'KeyA': this.combat?.playerAttack(); break;
                case 'KeyS': this.combat?.playerUseSkill(0); break;
                case 'KeyD': this.combat?.playerDefend(); break;
                case 'KeyF': this.combat?.playerFlee(); break;
                case 'KeyI': this.combat?.playerUseItem(); break; // 'I' for item in battle also
            }
        }
    }

    startLoadingSequence() {
        let progress = 0;
        const progressBar = document.getElementById('loading-progress');
        const appContent = document.getElementById('app-content');
        
        const interval = setInterval(() => {
            progress += Math.random() * 20 + 5;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                setTimeout(() => {
                    // Remove loading screen HTML if present
                    const loadingScreen = document.getElementById('loading-screen');
                    if(loadingScreen && appContent) {
                        appContent.innerHTML = '';
                    }
                    this.showMainMenu();
                }, 500);
            }
            if (progressBar) progressBar.style.width = `${progress}%`;
        }, 200);
    }

    async setScreen(screenId) {
        const appContent = document.getElementById('app-content');
        if (!appContent) {
            console.error("App content div not found!");
            return;
        }

        // 1. Destroy previous screen's module if active
        if (this.activeScreenModule && typeof this.activeScreenModule.destroy === 'function') {
            this.activeScreenModule.destroy();
            this.activeScreenModule = null;
        }
        // Remove previous screen's CSS if dynamically loaded (more advanced for later)
        // For now, assume CSS is mostly global or specific to the new screen
        
        // 2. Load HTML for the new screen
        try {
            const htmlPath = `screens/${screenId}.html`;
            const response = await fetch(htmlPath);
            if (!response.ok) throw new Error(`Failed to load screen HTML: ${response.statusText}`);
            const htmlContent = await response.text();
            appContent.innerHTML = htmlContent;
            this.state.current.currentScreen = screenId; // Update game state immediately
        } catch (error) {
            console.error(`Error loading screen ${screenId}:`, error);
            // Fallback or error display
            appContent.innerHTML = `<div class="screen error-screen"><h1>Error loading screen!</h1><p>${error.message}</p></div>`;
            return;
        }

        // 3. Load/ensure CSS for the new screen
        // We'll manage CSS by removing/adding link tags for screen-specific styles
        // Remove all screen-specific CSS links first
        document.querySelectorAll('link[data-screen-css]').forEach(link => link.remove());
        
        const cssPath = `css/screens/${screenId}.css`;
        // Check if the CSS file exists before trying to load it (optional, but good for flexibility)
        // For simplicity, we'll assume it exists if it's supposed to.
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = cssPath;
        link.setAttribute('data-screen-css', screenId); // Mark it as screen-specific CSS
        document.head.appendChild(link);
        
        // 4. Load and initialize JavaScript module for the new screen
        const screenJsPath = `js/screens/${screenId}.js`;
        try {
            // Check if the script is already loaded (e.g., if re-entering a screen)
            if (!window[this.capitalizeFirstLetter(screenId) + 'Screen']) { // e.g. window.BattleScreen
                const script = document.createElement('script');
                script.src = screenJsPath;
                script.type = 'module'; // Use type="module" for independent modules if needed
                script.setAttribute('data-screen-js', screenId); // Mark it as screen-specific JS
                await new Promise((resolve, reject) => {
                    script.onload = resolve;
                    script.onerror = reject;
                    document.head.appendChild(script);
                });
            }

            // Initialize the screen module
            const ScreenClass = window[this.capitalizeFirstLetter(screenId) + 'Screen'];
            if (ScreenClass) {
                this.activeScreenModule = new ScreenClass(this);
                if (typeof this.activeScreenModule.init === 'function') {
                    this.activeScreenModule.init();
                }
            } else {
                console.warn(`No JavaScript module found for screen: ${screenId}`);
            }

        } catch (error) {
            console.error(`Error loading or initializing JS for screen ${screenId}:`, error);
        }

        // 5. Manage global HUD visibility
        const globalHud = document.getElementById('global-hud');
        if (globalHud) {
            if (['main-menu', 'character-selection', 'loading-screen'].includes(screenId)) {
                globalHud.classList.add('hidden');
            } else {
                globalHud.classList.remove('hidden');
                this.updateGlobalHUD();
            }
        }

        this.updateLanguageDisplay(); // Ensure language is applied to newly loaded content
    }

    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    showMainMenu() {
        this.setScreen('main_menu'); // Will load screens/main_menu.html etc.
    }

    showCharacterSelect() {
        this.setScreen('character_selection'); // Will load screens/character_selection.html etc.
        // Special setup for character selection as it relies on game config
        this.setupCharacterScreen();
    }
    
    showLoadGame() { 
        alert('Load game not implemented yet!'); 
    }
    
    showOptions() { 
        alert('Options not implemented yet!'); 
    }

    updateLanguageDisplay() {
        if (!this.localization) return;
        this.localization.updateAllText();
        
        // Specific UI updates for currently active screen handled by its module
        if (this.activeScreenModule && typeof this.activeScreenModule.updateBattleUI === 'function') {
             this.activeScreenModule.updateBattleUI(); // For battle screen
        }
        if (this.state.current.currentScreen === 'inventory-screen') {
            this.inventory.updateDisplay(); // Inventory still handled by system module for now
        }
        this.updateGlobalHUD(); // Ensure HUD updates on language change
    }

    toggleLanguage() {
        if (!this.localization) return;
        const newLang = this.localization.getCurrentLanguage() === 'en' ? 'ar' : 'en';
        this.localization.switchLanguage(newLang);
        this.updateLanguageDisplay();
    }
    
    // NOTE: setupCharacterScreen will need to be re-evaluated for its new home
    // It currently depends on direct DOM elements that will be loaded dynamically.
    // For now, keeping it here but its calls in showCharacterSelect might need adjustment.
    setupCharacterScreen() {
        // This function will need to move to js/screens/character_selection.js later
        // For now, it will run after character_selection.html is loaded.
        const tabsContainer = document.getElementById('character-tabs');
        if (!tabsContainer) {
            console.warn("setupCharacterScreen: Character tabs container not found.");
            return;
        }
        
        tabsContainer.innerHTML = '';
        const characters = Object.values(window.GameConfig.CHARACTERS);
        const currentlySelected = this.state.current.selectedCharacter || characters[0]?.id;

        characters.forEach(char => {
            const tab = document.createElement('button');
            tab.className = 'tab-btn';
            tab.dataset.characterId = char.id;
            tab.textContent = this.localization.getCharacterName(char);
            tab.addEventListener('click', () => this.selectCharacter(char.id));
            tabsContainer.appendChild(tab);
        });

        if (currentlySelected) {
            this.selectCharacter(currentlySelected);
        }
    }
    
    // NOTE: selectCharacter and displayCharacterDetails also need to move to character_selection.js
    // Temporarily keeping them here for current functionality.
    selectCharacter(characterId) {
        document.querySelectorAll('#character-tabs .tab-btn').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.characterId === characterId);
        });

        this.state.current.selectedCharacter = characterId;
        this.displayCharacterDetails(characterId);

        const startBtn = document.getElementById('start-game-btn');
        if (startBtn) {
            startBtn.disabled = false;
        }
    }

    displayCharacterDetails(characterId) {
        const characterData = window.GameConfig.CHARACTERS[characterId];
        if (!characterData) return;

        const lang = this.localization.getCurrentLanguage();

        // Update main info panel
        this.updateElement('hero-portrait', characterData.sprite);
        this.updateElement('hero-name', this.localization.getCharacterName(characterData));
        this.updateElement('hero-title', characterData.title[lang]);
        this.updateElement('hero-desc', characterData.description[lang]);

        // Setup stats modal button
        const statsBtn = document.getElementById('open-stats-modal');
        if (statsBtn) {
            statsBtn.onclick = () => this.showStatsModal(characterId);
        }

        // Update core strengths (Example implementation)
        const strengthsContainer = document.getElementById('core-strengths-list');
        if (strengthsContainer) {
            strengthsContainer.innerHTML = `
                <div class="strength">
                    <span class="strength-icon">🛡️</span>
                    <span class="strength-text">${characterData.strengths.s1[lang]}</span>
                </div>
                <div class="strength">
                    <span class="strength-icon">❤️</span>
                    <span class="strength-text">${characterData.strengths.s2[lang]}</span>
                </div>
            `;
        }
    }

    // NOTE: showStatsModal and hideStatsModal also need to move to character_selection.js
    // Temporarily keeping them here for current functionality.
    showStatsModal(characterId) {
        const modal = document.getElementById('stats-modal-overlay');
        const grid = document.getElementById('modal-stats-grid');
        const characterData = window.GameConfig.CHARACTERS[characterId];
        if (!modal || !grid || !characterData) return;

        const lang = this.localization.getCurrentLanguage();
        const stats = characterData.stats;

        const statsHtml = `
            <div class="stat-item"><span>${this.localization.getText('stat.hp')}</span><span>${stats.maxHp}</span></div>
            <div class="stat-item"><span>${this.localization.getText('stat.atk')}</span><span>${stats.attack}</span></div>
            <div class="stat-item"><span>${this.localization.getText('stat.def')}</span><span>${stats.defense}</span></div>
            <div class="stat-item"><span>${this.localization.getText('stat.spd')}</span><span>${stats.speed}</span></div>
            <div class="stat-item"><span>${this.localization.getText('stat.crit')}</span><span>${stats.crit}%</span></div>
            <div class="stat-item"><span>${characterData.resource.name[lang]}</span><span>${characterData.resource.max}</span></div>
        `;
        grid.innerHTML = statsHtml;
        modal.classList.add('visible');
    }

    hideStatsModal(event) {
        // Only hide if the overlay or close button itself is clicked
        if (event.target.id === 'stats-modal-overlay' || event.target.id === 'close-stats-modal') {
            const modal = document.getElementById('stats-modal-overlay');
            if(modal) modal.classList.remove('visible');
        }
    }

    startGameRun() {
        if (!this.state.current.selectedCharacter) return;
        try {
            this.state.newGame(this.state.current.selectedCharacter);
            this.updateGlobalHUD(); // Show HUD and update initial values
            this.enterBattle();
        } catch (error) {
            console.error('Failed to start game:', error);
            alert('Failed to start game. Please try again.');
        }
    }

    enterBattle() {
        const enemies = this.generateEnemiesForFloor();
        this.state.startBattle(enemies);
        this.setScreen('battle'); // Will load screens/battle.html and js/screens/battle.js
        // The activeScreenModule (BattleScreen instance) will handle its own updateBattleUI()
    }
    
    // This function is now responsible for telling the active screen's UI module to update
    // It's no longer generating HTML dynamically, but telling the BattleScreen to update its elements
    updateBattleDisplay() {
        if (this.activeScreenModule && typeof this.activeScreenModule.updateBattleUI === 'function') {
            this.activeScreenModule.updateBattleUI();
        } else {
            console.warn("No active screen module with updateBattleUI method found. Cannot update battle display.");
        }
    }

    updateBar(barId, current, max) {
        // This function remains a utility that screen modules can use
        const bar = document.getElementById(barId);
        if (bar) {
            const percentage = (max > 0) ? (current / max) * 100 : 0;
            bar.style.width = `${Math.max(0, Math.min(100, percentage))}%`;
        }
    }

    updateElement(id, value) {
        // This function remains a utility that screen modules can use
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }

    updateGlobalHUD() {
        const hudFloor = document.getElementById('hud-floor-value');
        const hudGold = document.getElementById('hud-gold-value');
        if (hudFloor) hudFloor.textContent = this.state.current.currentFloor;
        if (hudGold) hudGold.textContent = this.state.current.gold;
    }
    
    showInventory() {
        if (!this.state.current.gameStarted) {
            alert('Start a game first!');
            return;
        }
        this.setScreen('inventory'); // Will load screens/inventory.html and js/screens/inventory.js (once created)
        this.inventory.updateDisplay();
        this.updateElement('inventory-gold-value', this.state.current.gold); // Update gold in inventory
    }
    
    closeInventory() {
        if (this.state.current.battleInProgress) {
            this.setScreen('battle'); // Return to battle screen
        } else {
            // TODO: This should return to the previous non-inventory screen, not always main menu.
            this.showMainMenu(); // For now, return to Main Menu if not in battle.
        }
    }

    generateEnemiesForFloor() {
        const floor = this.state.current.currentFloor;
        const enemyTypes = Object.keys(window.GameConfig.ENEMIES);
        const enemyType = enemyTypes.length > 0 ? enemyTypes[Math.floor(Math.random() * enemyTypes.length)] : null;
        if (!enemyType) {
            console.error("No enemy types defined in GameConfig.ENEMIES!");
            return [];
        }
        return [this.createEnemyFromTemplate(enemyType, floor)];
    }

    createEnemyFromTemplate(enemyType, floor) {
        const template = window.GameConfig.ENEMIES[enemyType];
        if (!template) return null;
        const scaling = 1 + (floor - 1) * 0.15;
        return {
            id: `${enemyType}_${Date.now()}`,
            type: enemyType, name: template.name, sprite: template.sprite, level: floor,
            stats: {
                hp: Math.floor(template.baseStats.hp * scaling),
                maxHp: Math.floor(template.baseStats.hp * scaling),
                attack: Math.floor(template.baseStats.attack * scaling),
                defense: Math.floor(template.baseStats.defense * scaling),
                speed: Math.floor(template.baseStats.speed * scaling),
                crit: template.baseStats.crit
            },
            abilities: template.abilities || [], statusEffects: [],
            xpReward: Math.floor(template.xpReward * scaling),
            goldReward: Math.floor(template.goldReward * scaling),
        };
    }
    
    victory() {
        const enemies = this.state.current.enemies;
        let totalXP = 0;
        let totalGold = 0;
        
        enemies.forEach(enemy => {
            totalXP += enemy.xpReward || 0;
            totalGold += enemy.goldReward || 0;
        });
        
        const difficulty = window.GameConfig.DIFFICULTIES[this.state.current.difficulty];
        totalXP = Math.floor(totalXP * difficulty.xpMult);
        totalGold = Math.floor(totalGold * difficulty.goldMult);
        
        this.state.addExperience(totalXP);
        this.state.addGold(totalGold);
        this.state.endBattle(true);
        this.updateGlobalHUD(); // Update HUD after gaining gold/xp

        if (this.state.current.currentFloor >= window.GameConfig.MAX_FLOORS) {
            alert(`🎉 Congratulations! You've completed the demo!`);
            this.showMainMenu();
            return;
        }
        
        this.state.current.currentFloor++;
        const continueToNext = confirm(`Victory! Gained ${totalXP} XP and ${totalGold} gold!\n\nContinue to Floor ${this.state.current.currentFloor}?`);
        
        if (continueToNext) {
            this.enterBattle();
        } else {
            this.showMainMenu();
        }
    }

    defeat() {
        this.state.endBattle(false);
        alert('Game Over! You have been defeated!');
        // TODO: Implement proper Game Over screen and penalties per README
        this.showMainMenu();
    }
};