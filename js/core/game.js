// js/core/game.js
// Main Game Class
window.PathOfHeroes = class PathOfHeroes {
    constructor() {
        this.initialized = false;
        this.debugUpdateInterval = null;
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
        if (this.state.current.currentScreen === 'battle-screen') {
            switch(event.code) {
                case 'KeyA': this.combat?.playerAttack(); break;
                case 'KeyS': this.combat?.playerUseSkill(0); break;
                case 'KeyD': this.combat?.playerDefend(); break;
                case 'KeyF': this.combat?.playerFlee(); break;
                case 'KeyI': this.combat?.playerUseItem(); break;
            }
        }
        if (event.code === 'KeyI' && this.state.current.gameStarted) {
            if (this.state.current.currentScreen !== 'battle-screen') {
                 if (this.state.current.currentScreen === 'inventory-screen') {
                    this.closeInventory();
                } else {
                    this.showInventory();
                }
            }
        }
    }

    startLoadingSequence() {
        let progress = 0;
        const progressBar = document.getElementById('loading-progress');
        
        const interval = setInterval(() => {
            progress += Math.random() * 20 + 5;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                setTimeout(() => this.showMainMenu(), 500);
            }
            if (progressBar) progressBar.style.width = `${progress}%`;
        }, 200);
    }

    showMainMenu() {
        this.state.setScreen('main-menu');
        this.updateLanguageDisplay();
    }

    showCharacterSelect() {
        this.state.setScreen('character-selection');
        this.updateLanguageDisplay();
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
        
        if (this.state.current.currentScreen === 'character-selection') {
            this.setupCharacterScreen();
        }
        if (this.state.current.currentScreen === 'inventory-screen') {
            this.inventory.updateDisplay();
        }
    }

    toggleLanguage() {
        if (!this.localization) return;
        const newLang = this.localization.getCurrentLanguage() === 'en' ? 'ar' : 'en';
        this.localization.switchLanguage(newLang);
        this.updateLanguageDisplay();
    }
    
    setupCharacterScreen() {
        const tabsContainer = document.getElementById('character-tabs');
        if (!tabsContainer) return;
        
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
            this.enterBattle();
        } catch (error) {
            console.error('Failed to start game:', error);
            alert('Failed to start game. Please try again.');
        }
    }

    enterBattle() {
        const enemies = this.generateEnemiesForFloor();
        this.state.startBattle(enemies);
        this.state.setScreen('battle-screen');
        this.combat.startBattle(enemies);
    }
    
    updateBattleDisplay() {
        const dynamicContent = document.getElementById('battle-dynamic-content');
        if (!dynamicContent) {
            console.error("Battle dynamic content area not found!");
            return;
        }

        const player = this.state.current.player;
        const enemy = this.state.current.enemies[0]; // Assuming one enemy for now
        if (!player || !enemy) {
            dynamicContent.innerHTML = ''; // Clear if no battle
            return;
        }

        const lang = this.localization.getCurrentLanguage();

        const createBar = (label, value, max, barClass) => {
            const percentage = max > 0 ? (Math.ceil(value) / max) * 100 : 0;
            return `
                <div class="bar-container">
                    <div class="bar-label">
                        <span>${label}</span>
                        <span>${Math.ceil(value)} / ${max}</span>
                    </div>
                    <div class="bar-bg">
                        <div class="bar-fill ${barClass}" style="width: ${percentage}%;"></div>
                    </div>
                </div>
            `;
        };
        
        const createInfoPanel = (character) => {
            if(!character) return '';
            const resourceName = character.resource ? character.resource.name[lang] : '';
            const resourceBarClass = character.resource ? `${character.resource.type}-bar` : '';
            
            return `
                <div class="info-panel">
                    <div class="character-header">${this.localization.getCharacterName(character)}</div>
                    ${createBar('HP', character.stats.hp, character.stats.maxHp, 'hp-bar')}
                    ${character.resource ? createBar(resourceName, character.resource.current, character.resource.max, resourceBarClass) : ''}
                </div>
            `;
        };
        
        const battleHTML = `
            <div class="battle-background"></div>
            <div class="battle-ui-grid">
                <div class="combat-log"><span id="combat-log-text">Battle Begins!</span></div>
                <div class="portraits-area">
                    <div class="portrait player-portrait">${player.sprite}</div>
                    <div class="vs-text">VS</div>
                    <div class="portrait enemy-portrait">${enemy.sprite}</div>
                </div>
                <div class="info-panels-area">
                    ${createInfoPanel(player)}
                    ${createInfoPanel(enemy)}
                </div>
            </div>
        `;

        dynamicContent.innerHTML = battleHTML;
        this.localization.updateAllText();
    }

    updateBar(barId, current, max) {
        const bar = document.getElementById(barId);
        if (bar) {
            const percentage = (max > 0) ? (current / max) * 100 : 0;
            bar.style.width = `${Math.max(0, Math.min(100, percentage))}%`;
        }
    }

    updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }
    
    showInventory() {
        if (!this.state.current.gameStarted) {
            alert('Start a game first!');
            return;
        }
        this.state.setScreen('inventory-screen');
        this.inventory.updateDisplay();
    }
    
    closeInventory() {
        if (this.state.current.battleInProgress) {
            this.state.setScreen('battle-screen');
        } else {
            // TODO: This should return to the previous non-inventory screen, not always main menu.
            this.showMainMenu();
        }
    }

    generateEnemiesForFloor() {
        const floor = this.state.current.currentFloor;
        const enemyTypes = Object.keys(window.GameConfig.ENEMIES);
        const enemyType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
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