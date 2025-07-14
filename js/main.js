// js/main.js
document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize the main game
    try {
        window.game = new window.PathOfHeroes();
        window.game.init();
    } catch (error) {
        console.error('Failed to create or initialize game instance:', error);
        alert('A critical error occurred and the game cannot start. Please refresh the page.');
        return;
    }

    // 2. Initialize the debugger
    try {
        window.debugger = new window.Debugger(window.game);
        window.debugger.init();
    } catch (error) {
        console.error('Failed to initialize debugger:', error);
    }

    // Helper function to safely add event listeners using IDs.
    const safeAddListener = (id, event, callback) => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener(event, callback);
        } else {
            console.warn(`Element with ID '${id}' not found. Cannot add listener.`);
        }
    };
    
    // This function wraps the callback to ensure window.game exists before executing.
    const gameAction = (action) => {
        return (event) => { // Added event parameter for modal overlay click
            if (window.game) {
                action(window.game, event); // Pass event parameter
            } else {
                console.error('window.game is not available for this action.');
            }
        };
    };

    // --- Global Buttons ---
    safeAddListener('lang-toggle-btn', 'click', gameAction(game => game.toggleLanguage()));
    safeAddListener('debug-open-btn', 'click', gameAction(game => window.debugger.toggleDebugPanel())); // Explicitly calling debugger's method
    safeAddListener('hud-inventory-btn', 'click', gameAction(game => game.showInventory())); // Corrected ID

    // --- Main Menu ---
    safeAddListener('btn-new-game', 'click', gameAction(game => game.showCharacterSelect()));
    safeAddListener('btn-load-game', 'click', gameAction(game => game.showLoadGame()));
    safeAddListener('btn-options', 'click', gameAction(game => game.showOptions()));

    // --- Character Selection ---
    safeAddListener('btn-char-back', 'click', gameAction(game => game.showMainMenu()));
    safeAddListener('start-game-btn', 'click', gameAction(game => game.startGameRun()));
    
    // Stats Modal Listeners
    safeAddListener('close-stats-modal', 'click', gameAction((game, event) => game.hideStatsModal(event)));
    safeAddListener('stats-modal-overlay', 'click', gameAction((game, event) => game.hideStatsModal(event)));
    // Note: The 'open-stats-modal' button listener is attached dynamically in game.js.

    // --- Battle Screen ---
    safeAddListener('btn-attack', 'click', gameAction(game => game.combat.playerAttack()));
    safeAddListener('btn-skill', 'click', gameAction(game => game.combat.playerUseSkill(0)));
    safeAddListener('btn-item', 'click', gameAction(game => game.combat.playerUseItem()));
    safeAddListener('btn-defend', 'click', gameAction(game => game.combat.playerDefend()));
    safeAddListener('btn-flee', 'click', gameAction(game => game.combat.playerFlee()));

    // --- Inventory Screen ---
    safeAddListener('btn-inv-close', 'click', gameAction(game => game.closeInventory()));
    safeAddListener('btn-inv-sort', 'click', gameAction(game => game.inventory.sortItems()));
    safeAddListener('btn-inv-sell-common', 'click', gameAction(game => game.inventory.sellAllCommon()));
});