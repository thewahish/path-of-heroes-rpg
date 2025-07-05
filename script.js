updatePlayerHealth() {
        const healthFill = document.querySelector('.health-fill');
        const healthText = document.querySelector('.health-text');
        if (healthFill && healthText) {
            const percentage = (this.gameState.player.stats.hp / this.gameState.player.stats.maxHp) * 100;
            healthFill.style.width = `${percentage}%`;
            healthText.textContent = `${this.gameState.player.stats.hp}/${this.gameState.player.stats.maxHp}`;
        }
    }

    updateEnemyDisplay() {
        this.gameState.enemies.forEach(enemy => {
            const enemyCard = document.querySelector(`[data-enemy-id="${enemy.id}"]`);
            if (enemyCard) {
                const healthFill = enemyCard.querySelector('.health-fill');
                const healthText = enemyCard.querySelector('.health-text');
                if (healthFill && healthText) {
                    const percentage = (enemy.hp / enemy.maxHp) * 100;
                    healthFill.style.width = `${percentage}%`;
                    healthText.textContent = `${enemy.hp}/${enemy.maxHp}`;
                }
            }
        });
    }

    showSettings() {
        this.addToLog('Settings menu coming soon!');
    }

    hasSavedGame() {
        return localStorage.getItem('poh_save_data') !== null;
    }

    getSavedFloor() {
        const saveData = localStorage.getItem('poh_save_data');
        return saveData ? JSON.parse(saveData).currentFloor : 1;
    }

    saveGame() {
        const saveData = {
            player: this.gameState.player,
            currentFloor: this.gameState.currentFloor,
            gold: this.gameState.gold,
            gameTime: this.gameState.gameTime,
            enemiesDefeated: this.gameState.enemiesDefeated,
            floorsCompleted: this.gameState.floorsCompleted
        };
        localStorage.setItem('poh_save_data', JSON.stringify(saveData));
    }

    loadGame() {
        const saveData = localStorage.getItem('poh_save_data');
        if (saveData) {
            const data = JSON.parse(saveData);
            this.gameState.player = data.player;
            this.gameState.currentFloor = data.currentFloor;
            this.gameState.gold = data.gold;
            this.gameState.gameTime = data.gameTime;
            this.gameState.enemiesDefeated = data.enemiesDefeated;
            this.gameState.floorsCompleted = data.floorsCompleted;
            this.gameState.gameStarted = true;
            this.generateFloor();
            this.showGameScreen();
        }
    }

    addGameStyles() {
        if (document.querySelector('#poh-styles')) return;

        const style = document.createElement('style');
        style.id = 'poh-styles';
        style.textContent = `
            body { 
                margin: 0; padding: 0; 
                background: linear-gradient(135deg, #1a1a2e, #16213e, #0f3460);
                color: white; font-family: 'Arial', sans-serif;
                min-height: 100vh; overflow-x: hidden;
            }
            .main-menu, .character-selection, .game-screen, .demo-complete, .game-over { 
                min-height: 100vh; display: flex; flex-direction: column; 
                justify-content: center; align-items: center; text-align: center; 
                padding: 2rem; box-sizing: border-box;
            }
            .language-selector { position: absolute; top: 20px; right: 20px; }
            .lang-btn { 
                padding: 0.5rem 1rem; margin: 0 0.25rem; 
                background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.3);
                color: white; border-radius: 4px; cursor: pointer; transition: all 0.3s ease;
            }
            .lang-btn.active, .lang-btn:hover { 
                background: rgba(255,255,255,0.2); border-color: #ffd700; 
            }
            .game-title h1 { font-size: 3rem; margin: 0; text-shadow: 2px 2px 4px rgba(0,0,0,0.5); }
            .subtitle { opacity: 0.8; margin: 0.5rem 0 2rem; font-size: 1.2rem; }
            .menu-btn, .action-btn { 
                display: block; width: 100%; max-width: 400px; padding: 1rem 2rem; margin: 1rem auto;
                background: rgba(255,255,255,0.1); border: 2px solid rgba(255,255,255,0.3);
                color: white; border-radius: 8px; font-size: 1.1rem; cursor: pointer;
                transition: all 0.3s ease; text-decoration: none;
            }
            .menu-btn:hover, .action-btn:hover { 
                background: rgba(255,255,255,0.2); border-color: rgba(255,255,255,0.5);
                transform: translateY(-2px); 
            }
            .menu-btn.primary, .action-btn.primary { 
                background: rgba(255,215,0,0.2); border-color: #ffd700; 
            }
            .action-btn.disabled { opacity: 0.5; cursor: not-allowed; }
            .character-grid { 
                display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 2rem; margin: 2rem 0; max-width: 1200px;
            }
            .character-card { 
                background: rgba(255,255,255,0.1); border: 2px solid rgba(255,255,255,0.2);
                border-radius: 12px; padding: 2rem; cursor: pointer; transition: all 0.3s ease;
            }
            .character-card:hover, .character-card.selected { 
                border-color: #ffd700; background: rgba(255,215,0,0.1);
                transform: translateY(-5px); 
            }
            .character-sprite { font-size: 4rem; margin-bottom: 1rem; }
            .character-title { color: #ffd700; margin: 0.5rem 0; }
            .character-description { opacity: 0.8; font-size: 0.9rem; margin: 1rem 0; }
            .character-stats { margin-top: 1rem; }
            .stat-row { 
                display: flex; justify-content: space-between; padding: 0.5rem;
                background: rgba(0,0,0,0.3); margin: 0.25rem 0; border-radius: 4px;
            }
            .selection-actions { 
                display: flex; justify-content: space-between; gap: 2rem; 
                margin-top: 2rem; width: 100%; max-width: 600px;
            }
            .game-header { 
                background: rgba(0,0,0,0.8); padding: 1rem; width: 100%;
                display: flex; justify-content: space-between; align-items: center;
                box-sizing: border-box;
            }
            .player-info { display: flex; align-items: center; gap: 1rem; }
            .player-avatar { font-size: 3rem; }
            .health-bar, .enemy-health-bar { 
                width: 200px; height: 20px; background: rgba(255,0,0,0.3);
                border-radius: 10px; overflow: hidden; position: relative; margin: 0.5rem 0;
            }
            .health-fill { 
                height: 100%; background: linear-gradient(90deg, #ff0000, #ffff00, #00ff00);
                transition: width 0.3s ease; 
            }
            .health-text { 
                position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
                font-size: 0.8rem; font-weight: bold; text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
            }
            .game-stats { display: flex; gap: 1rem; }
            .stat-item { 
                padding: 0.5rem 1rem; background: rgba(255,255,255,0.1); 
                border-radius: 4px; font-weight: bold;
            }
            .game-area { flex: 1; padding: 2rem; width: 100%; box-sizing: border-box; }
            .battle-area { max-width: 1000px; margin: 0 auto; }
            .enemies-display { 
                display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 1rem; margin: 2rem 0;
            }
            .enemy-card { 
                background: rgba(255,255,255,0.1); border: 2px solid rgba(255,0,0,0.3);
                border-radius: 8px; padding: 1rem; text-align: center;
            }
            .enemy-sprite { font-size: 3rem; margin-bottom: 0.5rem; }
            .battle-actions { 
                display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap;
                margin-top: 2rem;
            }
            .battle-actions .action-btn { width: auto; min-width: 120px; }
            .game-log { 
                height: 150px; background: rgba(0,0,0,0.8); width: 100%;
                border-top: 2px solid rgba(255,255,255,0.2); overflow-y: auto;
            }
            .log-content { padding: 1rem; }
            .log-content p { margin: 0.5rem 0; opacity: 0.9; }
            .demo-complete, .game-over { text-align: center; }
            .final-stats { 
                background: rgba(255,255,255,0.1); padding: 2rem; border-radius: 12px;
                margin: 2rem 0; max-width: 400px;
            }
            .demo-actions { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
            @media (max-width: 768px) {
                .game-header { flex-direction: column; gap: 1rem; }
                .character-grid { grid-template-columns: 1fr; }
                .selection-actions { flex-direction: column; }
                .battle-actions { flex-direction: column; align-items: center; }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.game = new PathOfHeroes();
});
