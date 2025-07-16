// filename: js/systems/combat.js

import { GameConfig } from '../core/config.js';

export class CombatSystem {
    constructor(game) {
        this.game = game;
        this.currentBattle = null;
    }

    startBattle(enemies) {
        this.currentBattle = {
            player: this.game.getSystem('gameState').current.player,
            enemies: enemies,
            turnOrder: [],
            currentTurnIndex: 0,
            round: 1
        };

        this.calculateTurnOrder();
        this.game.getActiveScreenModule()?.updateBattleUI();
        this.startNextTurn();
    }

    calculateTurnOrder() {
        const participants = [
            { entity: this.currentBattle.player, type: 'player' },
            ...this.currentBattle.enemies.map(enemy => ({ entity: enemy, type: 'enemy' }))
        ];
        participants.sort((a, b) => (b.entity.stats.spd || 0) - (a.entity.stats.spd || 0));
        this.currentBattle.turnOrder = participants;
        this.currentBattle.currentTurnIndex = 0;
    }

    startNextTurn() {
        if (!this.currentBattle) return;

        const actorInfo = this.currentBattle.turnOrder[this.currentBattle.currentTurnIndex];
        if (!actorInfo) {
            console.error("Could not determine current actor.");
            return;
        }
        
        this.game.getActiveScreenModule()?.updateBattleUI();

        if (actorInfo.type === 'player') {
            this.game.getActiveScreenModule()?.enablePlayerActions(true);
        } else {
            this.game.getActiveScreenModule()?.enablePlayerActions(false);
            setTimeout(() => this.executeEnemyAction(actorInfo.entity), 1000);
        }
    }
    
    endTurn() {
        // Remove defeated actors
        this.currentBattle.turnOrder = this.currentBattle.turnOrder.filter(actor => actor.entity.stats.hp > 0);
        
        // Check for victory/defeat
        const remainingEnemies = this.currentBattle.turnOrder.some(actor => actor.type === 'enemy');
        const remainingPlayers = this.currentBattle.turnOrder.some(actor => actor.type === 'player');

        if (!remainingEnemies) {
            console.log("VICTORY!");
            // TODO: Transition to victory screen
            return;
        }
        if (!remainingPlayers) {
            console.log("DEFEAT!");
            // TODO: Transition to game over screen
            return;
        }

        // Advance turn index
        this.currentBattle.currentTurnIndex = (this.currentBattle.currentTurnIndex + 1) % this.currentBattle.turnOrder.length;
        this.startNextTurn();
    }

    playerAttack() {
        this.game.getActiveScreenModule()?.enablePlayerActions(false);
        const player = this.currentBattle.player;
        const target = this.currentBattle.enemies[0]; // Simple targeting for now
        this.executeAttack(player, target);
        setTimeout(() => this.endTurn(), 1200);
    }
    
    playerSkill() {
        console.log("Player uses skill (not implemented)");
        this.endTurn();
    }

    playerDefend() {
        console.log("Player defends (not implemented)");
        this.endTurn();
    }

    playerFlee() {
        console.log("Player flees (not implemented)");
        this.endTurn();
    }

    executeEnemyAction(enemy) {
        const target = this.currentBattle.player;
        this.executeAttack(enemy, target);
        setTimeout(() => this.endTurn(), 1200);
    }
    
    executeAttack(attacker, target) {
        const isCrit = Math.random() < ((attacker.stats.crit || 0) / 100);
        const baseDamage = attacker.stats.atk - (target.stats.def / 2);
        const damage = Math.floor(isCrit ? baseDamage * 1.5 : baseDamage);
        
        target.stats.hp = Math.max(0, target.stats.hp - damage);
        
        console.log(`${attacker.name} attacks ${target.name} for ${damage} damage.`);
        
        const screen = this.game.getActiveScreenModule();
        if (screen) {
            screen.animateCharacter(target === this.currentBattle.player ? 'hero-box' : 'enemy-box', 'taking-damage');
            screen.showFloatingText(`-${damage}`, 'damage', isCrit);
        }
    }
}