// filename: js/systems/combat.js

import { GameConfig } from '../core/config.js';

// Combat System
export class CombatSystem {
    constructor(game) {
        this.game = game;
        this.currentBattle = null;
    }

    startBattle(enemies) {
        this.currentBattle = {
            player: this.game.state.current.player,
            enemies: enemies,
            turnOrder: [],
            currentTurnIndex: 0,
            round: 1
        };

        this.calculateTurnOrder();
        this.game.updateBattleDisplay(); // Tell the UI to render the initial state
        this.startNextTurn();
    }

    calculateTurnOrder() {
        const participants = [
            { entity: this.currentBattle.player, type: 'player' },
            ...this.currentBattle.enemies.map(enemy => ({ entity: enemy, type: 'enemy' }))
        ];

        participants.sort((a, b) => {
            const speedA = a.entity.stats.speed || 0;
            const speedB = b.entity.stats.speed || 0;
            const speedDiff = speedB - speedA;
            return speedDiff !== 0 ? speedDiff : Math.random() - 0.5;
        });

        this.currentBattle.turnOrder = participants;
        this.currentBattle.currentTurnIndex = 0;
    }

    getCurrentActor() {
        if (!this.currentBattle || !this.currentBattle.turnOrder.length) return null;
        return this.currentBattle.turnOrder[this.currentBattle.currentTurnIndex];
    }

    startNextTurn() {
        if (!this.currentBattle) return;

        const currentActor = this.getCurrentActor();
        if (!currentActor) {
            if (this.currentBattle.enemies.length === 0 && this.currentBattle.player.stats.hp > 0) {
                this.endBattle(true);
            }
            return;
        }

        this.game.updateBattleDisplay(); // Tell the UI to update for the new turn

        if (currentActor.type === 'player') {
            this.startPlayerTurn();
        } else {
            this.startEnemyTurn(currentActor.entity);
        }
    }

    startPlayerTurn() {
        // Delegate UI button enabling/disabling to the BattleScreen module
        if (this.game.activeScreenModule && typeof this.game.activeScreenModule.enablePlayerActions === 'function') {
            this.game.activeScreenModule.enablePlayerActions(true);
        } else {
            console.warn("CombatSystem: BattleScreen module not active or missing enablePlayerActions.");
        }
        this.regenerateResource(this.currentBattle.player);
        this.game.updateBattleDisplay(); // Re-render to show resource regen
        this.game.updateElement('combat-log-text', this.game.localization.getText('battle.your_turn'));
    }

    startEnemyTurn(enemy) {
        // Delegate UI button enabling/disabling to the BattleScreen module
        if (this.game.activeScreenModule && typeof this.game.activeScreenModule.enablePlayerActions === 'function') {
            this.game.activeScreenModule.enablePlayerActions(false);
        }
        this.game.updateElement('combat-log-text', `${this.game.localization.getText('battle.enemy_turn')}: ${this.game.localization.getCharacterName(enemy)}`);
        
        setTimeout(() => {
            this.executeEnemyAction(enemy);
            if (this.currentBattle) { 
                this.endEnemyTurn();
            }
        }, 1200);
    }

    playerAttack(targetIndex = 0) {
        const currentActor = this.getCurrentActor();
        if (!currentActor || currentActor.type !== 'player') return;

        const target = this.currentBattle.enemies[targetIndex];
        if (!target || target.stats.hp <= 0) return;
        
        this.executeAttack(this.currentBattle.player, target);
        this.endPlayerTurn();
    }

    playerUseSkill(skillIndex = 0) {
        const currentActor = this.getCurrentActor();
        if (!currentActor || currentActor.type !== 'player') return;

        const player = this.currentBattle.player;
        const abilityId = player.abilities[skillIndex];
        if (!abilityId) {
            this.game.updateElement('combat-log-text', "No ability available!");
            return;
        }

        const abilityData = GameConfig.ABILITIES[abilityId];
        if (!abilityData) return;

        if (player.resource.current < abilityData.cost) {
            this.game.updateElement('combat-log-text', `Not enough ${player.resource.name[this.game.localization.getCurrentLanguage()]}!`);
            return;
        }
        
        this.executeAbility(player, abilityData);
        this.endPlayerTurn();
    }
    
    playerUseItem() {
        const currentActor = this.getCurrentActor();
        if (!currentActor || currentActor.type !== 'player') return;

        const inventory = this.game.state.current.inventory;
        const potion = inventory.find(item => item.consumable && item.effect === 'heal_hp');

        if (!potion) {
            this.game.updateElement('combat-log-text', "You don't have any healing items!");
            return; 
        }

        const wasUsed = this.game.inventory.useItem(potion);

        if (wasUsed) {
            this.endPlayerTurn();
        } else {
            this.game.updateElement('combat-log-text', "Item could not be used.");
        }
    }

    playerDefend() {
        const currentActor = this.getCurrentActor();
        if (!currentActor || currentActor.type !== 'player') return;

        const player = this.currentBattle.player;
        player.defendingThisTurn = true;
        this.game.updateElement('combat-log-text', `${this.game.localization.getCharacterName(player)} is defending.`);
        this.endPlayerTurn();
    }

    playerFlee() {
        const fleeChance = GameConfig.COMBAT.fleeChance;
        
        if (Math.random() < fleeChance) {
            this.game.updateElement('combat-log-text', 'Successfully fled from battle!');
            setTimeout(() => this.endBattle(false, true), 1000);
        } else {
            this.game.updateElement('combat-log-text', 'Failed to flee!');
            this.endPlayerTurn();
        }
    }

    executeAttack(attacker, target, damageMultiplier = 1.0) {
        if (!attacker || !target || target.stats.hp <= 0) return;

        const isCritical = this.calculateCritical(attacker);
        const damage = this.calculateDamage(attacker, target, damageMultiplier, isCritical);

        target.stats.hp = Math.max(0, target.stats.hp - damage);

        const attackerName = this.game.localization.getCharacterName(attacker);
        const targetName = this.game.localization.getCharacterName(target);
        
        let message = `${attackerName} attacks ${targetName} for ${damage} damage.`;
        if (isCritical) message += ' (Critical Hit!)';
        this.game.updateElement('combat-log-text', message);
        
        this.game.updateBattleDisplay(); // Tell the UI to update after damage calculation

        if (target.stats.hp <= 0) {
            this.handleActorDeath({ entity: target, type: attacker.id === 'player' ? 'enemy' : 'player' });
        }
    }

    executeAbility(caster, abilityData) {
        if (!caster || !abilityData) return;
        
        caster.resource.current = Math.max(0, caster.resource.current - abilityData.cost);
        this.game.updateBattleDisplay(); // Tell the UI to update to show resource cost

        const casterName = this.game.localization.getCharacterName(caster);
        const abilityName = abilityData.name[this.game.localization.getCurrentLanguage()];
        this.game.updateElement('combat-log-text', `${casterName} uses ${abilityName}!`);

        if (abilityData.type === 'attack') {
            const target = this.currentBattle.enemies[0];
            if (target && target.stats.hp > 0) {
                const damageMultiplier = abilityData.damage || 1.0;
                this.executeAttack(caster, target, damageMultiplier);
            }
        }
    }

    calculateDamage(attacker, defender, multiplier, isCritical) {
        const baseAttack = attacker.stats.attack;
        const defense = defender.stats.defense;
        
        let finalDamage = Math.max(1, baseAttack - (defense * 0.5)) * multiplier;
        
        if (isCritical) {
            finalDamage = Math.floor(finalDamage * GameConfig.COMBAT.baseCritMultiplier);
        }
        
        const difficulty = GameConfig.DIFFICULTIES[this.game.state.current.difficulty];
        const damageMultiplier = attacker.id === 'player' ? difficulty.playerDmgMult : difficulty.enemyDmgMult;
        finalDamage *= damageMultiplier;
            
        if (defender.defendingThisTurn) {
            finalDamage *= 0.5;
            defender.defendingThisTurn = false;
        }
        
        const variance = 0.9 + Math.random() * 0.2;
        finalDamage *= variance;
        
        return Math.floor(finalDamage);
    }

    calculateCritical(attacker) {
        const critChance = (attacker.stats.crit || 0) / 100;
        return Math.random() < critChance;
    }

    executeEnemyAction(enemy) {
        if (!enemy || enemy.stats.hp <= 0 || !this.currentBattle || !this.currentBattle.player) {
            this.endEnemyTurn();
            return;
        }
        
        if (this.currentBattle.player.stats.hp > 0) {
            this.executeAttack(enemy, this.currentBattle.player);
        } else {
            this.endBattle(false);
        }
    }

    regenerateResource(actor) {
        if (!actor.resource || !actor.resource.regen) return;
        actor.resource.current = Math.min(actor.resource.max, actor.resource.current + actor.resource.regen);
    }

    endPlayerTurn() {
        // Delegate UI button disabling to the BattleScreen module
        if (this.game.activeScreenModule && typeof this.game.activeScreenModule.enablePlayerActions === 'function') {
            this.game.activeScreenModule.enablePlayerActions(false);
        }
        setTimeout(() => {
            if (this.currentBattle) {
                this.advanceTurn();
            }
        }, 1200);
    }

    endEnemyTurn() {
        setTimeout(() => {
            if (this.currentBattle) {
                this.advanceTurn();
            }
        }, 1200);
    }

    advanceTurn() {
        if (!this.currentBattle) return;

        this.currentBattle.turnOrder = this.currentBattle.turnOrder.filter(actor => actor.entity.stats.hp > 0);
        
        const remainingPlayers = this.currentBattle.turnOrder.filter(actor => actor.type === 'player');
        const remainingEnemies = this.currentBattle.turnOrder.filter(actor => actor.type === 'enemy');

        if (remainingPlayers.length === 0) {
            this.endBattle(false);
            return;
        }
        if (remainingEnemies.length === 0) {
            this.endBattle(true);
            return;
        }

        this.currentBattle.currentTurnIndex++;
        if (this.currentBattle.currentTurnIndex >= this.currentBattle.turnOrder.length) {
            this.currentBattle.currentTurnIndex = 0;
            this.currentBattle.round++;
        }

        this.startNextTurn();
    }

    handleActorDeath(actor) {
        const actorName = this.game.localization.getCharacterName(actor.entity);
        this.game.updateElement('combat-log-text', `${actorName} has been defeated!`);

        setTimeout(() => {
            if (actor.type === 'player') {
                this.endBattle(false);
            } else {
                const loot = this.game.inventory.generateLootDrop(actor.entity, this.game.state.current.currentFloor);
                if (loot) {
                    if (!this.game.state.addItemToInventory(loot)) {
                        this.game.updateElement('combat-log-text', `Found: ${loot.name}!\nBut your inventory is full!`);
                    } else {
                        this.game.updateElement('combat-log-text', `Found: ${loot.name}!`);
                    }
                }
                
                this.currentBattle.enemies = this.currentBattle.enemies.filter(e => e.id !== actor.entity.id);
                this.game.state.current.enemiesDefeated++;
                
                if (this.currentBattle.enemies.length === 0) {
                    this.endBattle(true);
                } else {
                    this.advanceTurn(); 
                }
            }
        }, 1500);
    }

    endBattle(victory, fled = false) {
        // Delegate UI button disabling to the BattleScreen module
        if (this.game.activeScreenModule && typeof this.game.activeScreenModule.enablePlayerActions === 'function') {
            this.game.activeScreenModule.enablePlayerActions(false);
        }
        this.currentBattle = null;
        
        if (victory) {
            this.game.victory();
        } else if (!fled) {
            this.game.defeat();
        } else {
            this.game.showMainMenu();
        }
    }
};