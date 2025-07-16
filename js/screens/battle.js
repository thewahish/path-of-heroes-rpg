// filename: js/screens/battle.js

/**
 * @fileoverview JavaScript logic for the Battle screen.
 * This module handles UI updates, player input, and communication with the CombatSystem.
 */

/** @type {import('../core/game.js').PathOfHeroes} */
let _gameInstance;
/** @type {import('../core/localization.js').Localization} */
let _localizationInstance;

/**
 * Initializes the Battle screen's functionality.
 * @param {import('../core/game.js').PathOfHeroes} gameInstance - The main game instance.
 * @param {import('../core/localization.js').Localization} localizationInstance - The localization system instance.
 */
export function init(gameInstance, localizationInstance) {
    _gameInstance = gameInstance;
    _localizationInstance = localizationInstance;
    console.log("Battle screen initialized.");

    setupEventListeners();
    updateBattleUI(); // Initial population of UI with placeholder data
    enablePlayerActions(true); // Ensure buttons are enabled at the start

    // Re-apply localization after new screen content is loaded
    _localizationInstance.updateLocalizedElements();
}

/**
 * Sets up event listeners for the action buttons.
 * @private
 */
function setupEventListeners() {
    document.getElementById('attack-btn')?.addEventListener('click', () => {
        console.log("Attack button clicked!");
        // Future: _gameInstance.getSystem('combatSystem').playerAttack(0);
    });

    document.getElementById('skill-btn')?.addEventListener('click', () => {
        console.log("Skill button clicked!");
        // Future: _gameInstance.getSystem('combatSystem').playerUseSkill(0);
    });

    document.getElementById('defend-btn')?.addEventListener('click', () => {
        console.log("Defend button clicked!");
        // Future: _gameInstance.getSystem('combatSystem').playerDefend();
    });

    document.getElementById('flee-btn')?.addEventListener('click', () => {
        console.log("Flee button clicked!");
        // Future: _gameInstance.getSystem('combatSystem').playerFlee();
    });
}

/**
 * Updates all battle UI elements with current data.
 * For now, uses placeholder data.
 * @private
 */
function updateBattleUI() {
    // Placeholder data for demonstration
    const player = { name: "Taha", hp: 85, maxHp: 120, resource: 40, maxResource: 60, resourceName: "Vigor", resourceClass: "vigor-bar", atk: 15, def: 12, spd: 8 };
    const enemy = { name: "Skeleton", hp: 30, maxHp: 30, atk: 10, def: 5, spd: 7 };

    // Update Player Panel
    _gameInstance.updateElement('player-name', player.name);
    _gameInstance.updateElement('player-hp-value', `${player.hp}/${player.maxHp}`);
    _gameInstance.updateBar('player-hp-bar', player.hp, player.maxHp);

    const playerResourceBar = document.getElementById('player-resource-bar');
    if (playerResourceBar) {
        playerResourceBar.className = `bar-fill ${player.resourceClass}`; // Set resource bar color
    }
    _gameInstance.updateElement('player-resource-name', player.resourceName);
    _gameInstance.updateElement('player-resource-value', `${player.resource}/${player.maxResource}`);
    _gameInstance.updateBar('player-resource-bar', player.resource, player.maxResource);

    _gameInstance.updateElement('player-stat-atk', player.atk);
    _gameInstance.updateElement('player-stat-def', player.def);
    _gameInstance.updateElement('player-stat-spd', player.spd);

    // Update Enemy Panel
    _gameInstance.updateElement('enemy-name', enemy.name);
    _gameInstance.updateElement('enemy-hp-value', `${enemy.hp}/${enemy.maxHp}`);
    _gameInstance.updateBar('enemy-hp-bar', enemy.hp, enemy.maxHp);

    _gameInstance.updateElement('enemy-stat-atk', enemy.atk);
    _gameInstance.updateElement('enemy-stat-def', enemy.def);
    _gameInstance.updateElement('enemy-stat-spd', enemy.spd);
}

/**
 * Enables or disables the player action buttons.
 * @param {boolean} isEnabled - True to enable, false to disable.
 */
export function enablePlayerActions(isEnabled) {
    const actionButtons = document.querySelectorAll('.b-action-btn');
    actionButtons.forEach(button => {
        if (isEnabled) {
            button.classList.remove('disabled');
            button.disabled = false;
        } else {
            button.classList.add('disabled');
            button.disabled = true;
        }
    });
}