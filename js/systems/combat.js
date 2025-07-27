// filename: js/systems/combat.js

import { GameConfig } from '../core/config.js';

export class CombatSystem {
    constructor(game) {
        this.game = game;
        this.currentBattle = null;
    }

    startBattle(enemies) {
        console.log("Starting battle with enemies:", enemies);
        
        this.currentBattle = {
            player: this.game.getSystem('gameState').current.player,
            enemies: enemies,
            turnOrder: [],
            currentTurnIndex: 0,
            round: 1
        };

        this.calculateTurnOrder();
        
        // Update UI immediately after battle setup
        const battleScreen = this.game.getActiveScreenModule();
        if (battleScreen && battleScreen.updateBattleUI) {
            battleScreen.updateBattleUI();
        }
        
        console.log("Battle initialized, starting first turn...");
        this.startNextTurn();
    }

    calculateTurnOrder() {
        const participants = [
            { entity: this.currentBattle.player, type: 'player' },
            ...this.currentBattle.enemies.map(enemy => ({ entity: enemy, type: 'enemy' }))
        ];
        
        // Sort by speed (highest first)
        participants.sort((a, b) => (b.entity.stats.spd || 0) - (a.entity.stats.spd || 0));
        
        this.currentBattle.turnOrder = participants;
        this.currentBattle.currentTurnIndex = 0;
        
        console.log("Turn order calculated:", this.currentBattle.turnOrder.map(p => `${p.entity.name} (${p.type})`));
    }

    startNextTurn() {
        if (!this.currentBattle) {
            console.error("No active battle to continue");
            return;
        }

        const actorInfo = this.currentBattle.turnOrder[this.currentBattle.currentTurnIndex];
        if (!actorInfo) {
            console.error("Could not determine current actor.");
            return;
        }
        
        console.log(`Starting turn for: ${actorInfo.entity.name} (${actorInfo.type})`);
        
        // Update UI
        const battleScreen = this.game.getActiveScreenModule();
        if (battleScreen && battleScreen.updateBattleUI) {
            battleScreen.updateBattleUI();
        }

        if (actorInfo.type === 'player') {
            console.log("Player's turn - enabling actions");
            if (battleScreen && battleScreen.enablePlayerActions) {
                battleScreen.enablePlayerActions(true);
            }
        } else {
            console.log("Enemy's turn - disabling player actions");
            if (battleScreen && battleScreen.enablePlayerActions) {
                battleScreen.enablePlayerActions(false);
            }
            // Execute enemy action after a short delay
            setTimeout(() => this.executeEnemyAction(actorInfo.entity), 1000);
        }
    }
    
    endTurn() {
        if (!this.currentBattle) return;
        
        // Remove defeated actors
        this.currentBattle.turnOrder = this.currentBattle.turnOrder.filter(actor => actor.entity.stats.hp > 0);
        
        // Check for victory/defeat
        const remainingEnemies = this.currentBattle.turnOrder.some(actor => actor.type === 'enemy');
        const remainingPlayers = this.currentBattle.turnOrder.some(actor => actor.type === 'player');

        if (!remainingEnemies) {
            console.log("VICTORY! All enemies defeated!");
            this.handleBattleEnd(true);
            return;
        }
        
        if (!remainingPlayers) {
            console.log("DEFEAT! Player has been defeated!");
            this.handleBattleEnd(false);
            return;
        }

        // Advance turn index
        this.currentBattle.currentTurnIndex = (this.currentBattle.currentTurnIndex + 1) % this.currentBattle.turnOrder.length;
        
        console.log("Turn ended, moving to next actor");
        this.startNextTurn();
    }

    handleBattleEnd(victory) {
        const gameState = this.game.getSystem('gameState');
        
        if (victory) {
            // Award XP and gold
            const xpGained = 25;
            const goldGained = 10;
            
            gameState.addExperience(xpGained);
            gameState.addGold(goldGained);
            
            // Generate loot
            const inventorySystem = this.game.getSystem('inventorySystem');
            if (inventorySystem) {
                const loot = inventorySystem.generateLootDrop(this.currentBattle.enemies[0], gameState.current.currentFloor);
                if (loot) {
                    gameState.addItemToInventory(loot);
                    console.log("Loot dropped:", loot.name);
                }
            }
            
            alert(`Victory!\n\nXP Gained: ${xpGained}\nGold Gained: ${goldGained}\nLoot: ${loot ? loot.name : 'None'}`);
            
            // Return to character select for now (will be replaced with dungeon progression)
            this.game.setScreen('character-select');
        } else {
            alert("Defeat!\n\nYou have been defeated. Try again!");
            this.game.setScreen('character-select');
        }
        
        // Clean up battle state
        gameState.endBattle(victory);
        this.currentBattle = null;
    }

    playerAttack() {
        console.log("🗡️ Player Attack clicked!"); // ← ADD this debug line
        
        if (!this.currentBattle) {
            console.log("❌ No active battle for attack");
            return;
        }
        
        const battleScreen = this.game.getActiveScreenModule();
        if (battleScreen && battleScreen.enablePlayerActions) {
            battleScreen.enablePlayerActions(false);
        }
        
        const player = this.currentBattle.player;
        const target = this.currentBattle.enemies[0];
        
        if (!target || target.stats.hp <= 0) {
            console.warn("⚠️ No valid target for attack");
            this.endTurn();
            return;
        }
        
        console.log(`⚔️ ${player.name} attacks ${target.name}`);
        this.executeAttack(player, target);
        
        setTimeout(() => this.endTurn(), 1200);
    }

    playerDefend() {
        console.log("🛡️ Player Defend clicked!"); // ← ADD this debug line
        
        if (!this.currentBattle) {
            console.log("❌ No active battle for defend");
            return;
        }
        
        console.log("🛡️ Player defends (reducing incoming damage for this turn)");
        
        // Add a temporary defense boost
        const player = this.currentBattle.player;
        player.defendingThisTurn = true;
        
        const battleScreen = this.game.getActiveScreenModule();
        if (battleScreen && battleScreen.enablePlayerActions) {
            battleScreen.enablePlayerActions(false);
        }
        
        // Add combat log entry
        if (battleScreen && battleScreen.addCombatLog) {
            battleScreen.addCombatLog("🛡️ You take a defensive stance", "log-player");
        }
        
        setTimeout(() => this.endTurn(), 800);
    }

    playerFlee() {
        console.log("🏃 Player Flee clicked!"); // ← ADD this debug line
        
        if (!this.currentBattle) {
            console.log("❌ No active battle for flee");
            return;
        }
        
        console.log("🏃 Player attempts to flee...");
        
        const fleeChance = 0.7; // 70% success rate
        const success = Math.random() < fleeChance;
        
        const battleScreen = this.game.getActiveScreenModule();
        
        if (success) {
            console.log("✅ Flee successful!");
            if (battleScreen && battleScreen.addCombatLog) {
                battleScreen.addCombatLog("🏃 You successfully escaped!", "log-player");
            }
            
            setTimeout(() => {
                alert("You successfully escaped from battle!");
                this.game.setScreen('character-select');
                
                const gameState = this.game.getSystem('gameState');
                gameState.endBattle(false);
                this.currentBattle = null;
            }, 1000);
        } else {
            console.log("❌ Flee failed!");
            if (battleScreen && battleScreen.addCombatLog) {
                battleScreen.addCombatLog("🏃 Failed to escape!", "log-enemy");
            }
            
            if (battleScreen && battleScreen.enablePlayerActions) {
                battleScreen.enablePlayerActions(false);
            }
            
            setTimeout(() => this.endTurn(), 800);
        }
    }

    playerSkill() {
        console.log("✨ Player Skill clicked!"); // ← ADD this debug line
        
        if (!this.currentBattle) {
            console.log("❌ No active battle for skill");
            return;
        }
        
        console.log("✨ Player uses skill (implementation in progress)");
        
        const battleScreen = this.game.getActiveScreenModule();
        if (battleScreen && battleScreen.addCombatLog) {
            battleScreen.addCombatLog("✨ Skill system in development", "log-player");
        }
        
        // For now, just end the turn
        if (battleScreen && battleScreen.enablePlayerActions) {
            battleScreen.enablePlayerActions(false);
        }
        
        setTimeout(() => this.endTurn(), 800);
    }

    executeEnemyAction(enemy) {
        if (!this.currentBattle) return;
        
        const target = this.currentBattle.player;
        console.log(`${enemy.name} attacks ${target.name}`);
        this.executeAttack(enemy, target);
        
        setTimeout(() => this.endTurn(), 1200);
    }
    
    executeAttack(attacker, target) {
        if (!attacker || !target || target.stats.hp <= 0) {
            console.warn("Invalid attack parameters");
            return;
        }
        
        // Calculate damage
        const isCrit = Math.random() < ((attacker.stats.crit || 0) / 100);
        const baseAttack = attacker.stats.atk || 10;
        const targetDefense = target.stats.def || 0;
        
        let baseDamage = Math.max(1, baseAttack - Math.floor(targetDefense / 2));
        
        // Apply defending bonus if target is defending
        if (target.defendingThisTurn) {
            baseDamage = Math.floor(baseDamage * 0.5);
            target.defendingThisTurn = false; // Reset defending status
        }
        
        const finalDamage = Math.floor(isCrit ? baseDamage * (GameConfig.COMBAT.baseCritMultiplier || 1.5) : baseDamage);
        
        // Apply damage
        target.stats.hp = Math.max(0, target.stats.hp - finalDamage);
        
        console.log(`${attacker.name} attacks ${target.name} for ${finalDamage} damage${isCrit ? ' (CRITICAL!)' : ''}`);
        
        // Visual feedback
        const battleScreen = this.game.getActiveScreenModule();
        if (battleScreen) {
            const targetBoxId = target === this.currentBattle.player ? 'hero-box' : 'enemy-box';
            
            if (battleScreen.animateCharacter) {
                battleScreen.animateCharacter(targetBoxId, 'taking-damage');
            }
            
            if (battleScreen.showFloatingText) {
                battleScreen.showFloatingText(`-${finalDamage}`, 'damage', isCrit);
            }
        }
    }
}