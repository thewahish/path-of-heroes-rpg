// filename: js/core/state.js

import { GameConfig } from './config.js';
import { Characters } from './characters.js'; // Added import for Characters data

// This module manages the game state, including player data, inventory, and game progress.
export const GameState = {
    current: {
        gameStarted: false,
        currentScreen: 'loading',
        difficulty: 'normal',
        player: null,
        selectedCharacter: null,
        currentFloor: 1,
        gold: 0, // Will be set by newGame
        experience: 0,
        level: 1,
        inventory: [],
        equipped: {},
        battleInProgress: false,
        enemies: [],
        turnOrder: [],
        currentTurnIndex: 0,
        enemiesDefeated: 0,
        settings: { autoSave: true }
    },

    reset() {
        this.current = {
            gameStarted: false,
            currentScreen: 'main-menu',
            difficulty: 'normal',
            player: null,
            selectedCharacter: null,
            currentFloor: 1,
            gold: GameConfig.INVENTORY.startingGold,
            experience: 0,
            level: 1,
            inventory: [],
            equipped: {},
            battleInProgress: false,
            enemies: [],
            turnOrder: [],
            currentTurnIndex: 0,
            enemiesDefeated: 0,
            settings: { autoSave: true }
        };
    },

    newGame(characterId, difficulty = 'normal') {
        this.reset();
        
        this.current.gameStarted = true;
        this.current.selectedCharacter = characterId;
        this.current.difficulty = difficulty;
        
        // FIXED: Use imported Characters object, not GameConfig
        const characterData = Characters[characterId.toUpperCase()];
        if (!characterData) {
            throw new Error(`Invalid character: ${characterId}`);
        }
        
        this.current.player = this.createPlayerFromCharacter(characterData);
        // REMOVED: Starting gear is now handled by game.js to avoid circular dependencies
        return true;
    },

    createPlayerFromCharacter(characterData) {
        return {
            id: characterData.id,
            name: characterData.name,
            class: characterData.id,  // ← ADDED THIS LINE - needed by combat system
            title: characterData.role, // Using role as title
            sprite: '...', // Placeholder
            stats: { ...characterData.baseStats },
            maxStats: { ...characterData.baseStats },
            resource: { 
                name: characterData.resource,
                current: characterData.baseStats.resource,
                max: characterData.baseStats.resource,
             },
            abilities: ['power_strike'], // Placeholder
            level: 1,
            experience: 0,
            statusEffects: []
        };
    },

    equipItem(item) {
        const slot = item.slot;
        
        if (this.current.equipped[slot]) {
            this.unequipItem(slot);
        }
        
        this.current.equipped[slot] = item;
        
        const index = this.current.inventory.findIndex(invItem => invItem.id === item.id);
        if (index > -1) {
            this.current.inventory.splice(index, 1);
        }
        
        this.updatePlayerStats();
        return true;
    },

    unequipItem(slot) {
        const item = this.current.equipped[slot];
        if (!item) return false;
        
        if (this.current.inventory.length < GameConfig.INVENTORY.maxSlots) {
            this.current.inventory.push(item);
            delete this.current.equipped[slot];
            this.updatePlayerStats();
            return true;
        } else {
            alert('Inventory is full!');
            return false;
        }
    },

    updatePlayerStats() {
        if (!this.current.player) return;
        
        const characterData = Characters[this.current.selectedCharacter.toUpperCase()];
        const baseStats = { ...characterData.baseStats };
        
        const growth = characterData.growthRates;
        const levelBonus = this.current.level - 1;
        
        baseStats.hp = Math.floor(baseStats.hp + (growth.hp * levelBonus));
        baseStats.maxHp = baseStats.hp;
        baseStats.atk = Math.floor(baseStats.atk + (growth.atk * levelBonus));
        baseStats.def = Math.floor(baseStats.def + (growth.def * levelBonus));
        baseStats.spd = Math.floor(baseStats.spd + (growth.spd * levelBonus));
        baseStats.crit = parseFloat((baseStats.crit + (growth.crit * levelBonus)).toFixed(2));
        
        Object.values(this.current.equipped).forEach(item => {
            if (item && item.stats) {
                Object.keys(item.stats).forEach(stat => {
                    if (baseStats.hasOwnProperty(stat)) {
                        baseStats[stat] += item.stats[stat];
                    }
                });
            }
        });
        
        const oldMaxHp = this.current.player.stats.maxHp || baseStats.maxHp;
        const currentHpPercent = this.current.player.stats.hp / oldMaxHp;

        this.current.player.stats = { ...baseStats };
        this.current.player.maxStats = { ...baseStats };
        
        this.current.player.stats.hp = Math.round(baseStats.maxHp * currentHpPercent);
    },

    addExperience(amount) {
        if (!this.current.player) return false;
        
        this.current.experience += amount;
        this.current.player.experience += amount;
        
        const requiredXP = this.getRequiredExperience(this.current.level);
        if (this.current.experience >= requiredXP && this.current.level < (GameConfig.XP_CURVE?.maxLevel || 60)) {
            this.levelUp();
        }
        
        return true;
    },

    getRequiredExperience(level) {
        const config = GameConfig.XP_CURVE || { baseXP: 100, increment: 50 }; // Fallback
        if (level === 0) return 0;
        return config.baseXP + (level - 1) * config.increment;
    },

    levelUp() {
        this.current.level++;
        this.current.player.level++;
        
        this.updatePlayerStats();
        
        this.current.player.stats.hp = this.current.player.stats.maxHp;
        this.current.player.resource.current = this.current.player.resource.max;
        
        const character = Characters[this.current.selectedCharacter.toUpperCase()];
        const growth = character.growthRates;
        
        alert(`🎉 LEVEL UP! 🎉\n\nYou are now Level ${this.current.level}!\n\nStat increases:\n• Health: +${growth.hp}\n• Attack: +${growth.atk}\n• Defense: +${growth.def}\n• Speed: +${growth.spd}\n• Critical: +${growth.crit}%\n\nHealth and resources fully restored!`);
    },

    addGold(amount) {
        this.current.gold += amount;
        return this.current.gold;
    },

    spendGold(amount) {
        if (this.current.gold >= amount) {
            this.current.gold -= amount;
            return true;
        }
        return false;
    },

    addItemToInventory(item) {
        if (this.current.inventory.length < GameConfig.INVENTORY.maxSlots) {
            this.current.inventory.push(item);
            return true;
        } else {
            alert('Inventory is full!');
            return false;
        }
    },

    removeItemFromInventory(item) {
        const index = this.current.inventory.findIndex(i => i.id === item.id);
        if (index > -1) {
            this.current.inventory.splice(index, 1);
            return true;
        }
        return false;
    },

    setScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.add('hidden');
        });
        
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.remove('hidden');
            this.current.currentScreen = screenId;
        }
    },

    startBattle(enemies) {
        this.current.battleInProgress = true;
        this.current.enemies = enemies;
        this.current.turnOrder = [];
        this.current.currentTurnIndex = 0;
    },

    endBattle(victory = true) {
        this.current.battleInProgress = false;
        this.current.enemies = [];
        this.current.turnOrder = [];
        this.current.currentTurnIndex = 0;
    }
};