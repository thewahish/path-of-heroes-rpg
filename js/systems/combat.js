// Combat System
window.CombatSystem = class CombatSystem {
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
        this.game.updateBattleDisplay();
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
            // Check if all enemies are defeated and player is alive
            if (this.currentBattle.enemies.length === 0 && this.currentBattle.player.stats.hp > 0) {
                this.endBattle(true); // All enemies defeated, victory
            }
            return;
        }

        this.game.updateBattleDisplay(); // Update UI at the start of each turn

        if (currentActor.type === 'player') {
            this.startPlayerTurn();
        } else {
            this.startEnemyTurn(currentActor.entity);
        }
    }

    startPlayerTurn() {
        this.enablePlayerActions(true);
        this.regenerateResource(this.currentBattle.player);
        this.game.updateBattleDisplay(); // Re-render to show resource regen
        this.game.updateElement('combat-log-text', this.game.localization.getText('battle.your_turn'));
    }

    startEnemyTurn(enemy) {
        this.enablePlayerActions(false);
        this.game.updateElement('combat-log-text', `${this.game.localization.getText('battle.enemy_turn')}: ${this.game.localization.getCharacterName(enemy)}`);
        
        setTimeout(() => {
            this.executeEnemyAction(enemy);
            // After enemy action, if battle still active, advance turn
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

        const abilityData = window.GameConfig.ABILITIES[abilityId];
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
        const potion = inventory.find(item => item.consumable && item.effect === 'heal_hp'); // Find any heal potion

        if (!potion) {
            this.game.updateElement('combat-log-text', "You don't have any healing items!");
            return; 
        }

        // Pass the actual potion object to useItem
        const wasUsed = this.game.inventory.useItem(potion);

        if (wasUsed) {
            // Item usage counts as a turn
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
        const fleeChance = window.GameConfig.COMBAT.fleeChance;
        
        if (Math.random() < fleeChance) {
            this.game.updateElement('combat-log-text', 'Successfully fled from battle!');
            setTimeout(() => this.endBattle(false, true), 1000); // Small delay for message
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
        
        this.game.updateBattleDisplay(); // Update UI after damage calculation

        if (target.stats.hp <= 0) {
            this.handleActorDeath({ entity: target, type: attacker.id === 'player' ? 'enemy' : 'player' });
        }
    }

    executeAbility(caster, abilityData) {
        if (!caster || !abilityData) return;
        
        caster.resource.current = Math.max(0, caster.resource.current - abilityData.cost);
        this.game.updateBattleDisplay(); // Update UI to show resource cost

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
            finalDamage = Math.floor(finalDamage * window.GameConfig.COMBAT.baseCritMultiplier);
        }
        
        const difficulty = window.GameConfig.DIFFICULTIES[this.game.state.current.difficulty];
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
        
        // Ensure player is alive before attacking
        if (this.currentBattle.player.stats.hp > 0) {
            this.executeAttack(enemy, this.currentBattle.player);
        } else {
            // Player is already defeated, end battle
            this.endBattle(false);
        }
    }

    regenerateResource(actor) {
        if (!actor.resource || !actor.resource.regen) return;
        actor.resource.current = Math.min(actor.resource.max, actor.resource.current + actor.resource.regen);
    }

    endPlayerTurn() {
        this.enablePlayerActions(false);
        setTimeout(() => {
            if (this.currentBattle) { // Ensure battle is still active
                this.advanceTurn();
            }
        }, 1200);
    }

    endEnemyTurn() {
        setTimeout(() => {
            if (this.currentBattle) { // Ensure battle is still active
                this.advanceTurn();
            }
        }, 1200);
    }

    advanceTurn() {
        if (!this.currentBattle) return;

        // Filter out defeated actors
        this.currentBattle.turnOrder = this.currentBattle.turnOrder.filter(actor => actor.entity.stats.hp > 0);
        
        // Check battle end conditions
        const remainingPlayers = this.currentBattle.turnOrder.filter(actor => actor.type === 'player');
        const remainingEnemies = this.currentBattle.turnOrder.filter(actor => actor.type === 'enemy');

        if (remainingPlayers.length === 0) {
            this.endBattle(false); // Player defeated
            return;
        }
        if (remainingEnemies.length === 0) {
            this.endBattle(true); // All enemies defeated
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
                this.endBattle(false); // Player died
            } else {
                const loot = this.game.inventory.generateLootDrop(actor.entity, this.game.state.current.currentFloor);
                if (loot) {
                    if (!this.game.state.addItemToInventory(loot)) {
                        this.game.updateElement('combat-log-text', `Found: ${loot.name}!\nBut your inventory is full!`);
                    } else {
                        this.game.updateElement('combat-log-text', `Found: ${loot.name}!`);
                    }
                }
                
                // Remove defeated enemy from current battle enemies list
                this.currentBattle.enemies = this.currentBattle.enemies.filter(e => e.id !== actor.entity.id);
                this.game.state.current.enemiesDefeated++;
                
                // If all enemies are defeated in this battle
                if (this.currentBattle.enemies.length === 0) {
                    this.endBattle(true); // Victory
                } else {
                    // If more enemies remain, continue the battle
                    this.advanceTurn(); 
                }
            }
        }, 1500);
    }

    endBattle(victory, fled = false) {
        this.enablePlayerActions(false);
        this.currentBattle = null; // Clear current battle state
        
        if (victory) {
            this.game.victory();
        } else if (!fled) {
            this.game.defeat();
        } else {
            this.game.showMainMenu();
        }
    }

    enablePlayerActions(enabled) {
        // Target elements by ID since we added them in index.html
        const attackBtn = document.getElementById('btn-attack');
        const skillBtn = document.getElementById('btn-skill');
        const itemBtn = document.getElementById('btn-item');
        const defendBtn = document.getElementById('btn-defend');
        const fleeBtn = document.getElementById('btn-flee');

        [attackBtn, skillBtn, itemBtn, defendBtn, fleeBtn].forEach(btn => {
            if (btn) {
                btn.disabled = !enabled;
                btn.classList.toggle('disabled', !enabled);
            }
        });
    }
};