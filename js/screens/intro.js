// filename: js/screens/intro.js

/**
 * @fileoverview JavaScript logic for the Intro (Main Menu) screen.
 * This module handles button clicks and initializes the screen's interactive elements.
 */

/**
 * @private
 * @type {import('../core/game.js').PathOfHeroes}
 * Reference to the main game instance.
 */
let _gameInstance;

/**
 * @private
 * @type {import('../core/localization.js').Localization}
 * Reference to the localization system.
 */
let _localizationInstance;

/**
 * Initializes the Intro screen's functionality.
 * This function is called by game.js when the intro screen is loaded.
 * @param {import('../core/game.js').PathOfHeroes} gameInstance - The main game instance.
 * @param {import('../core/localization.js').Localization} localizationInstance - The localization system instance.
 */
export function init(gameInstance, localizationInstance) {
    _gameInstance = gameInstance;
    _localizationInstance = localizationInstance;
    console.log("Intro screen initialized.");

    // Setup event listeners for the buttons on the intro screen
    document.getElementById('play-game-button').addEventListener('click', handlePlayGame);
    document.getElementById('options-button').addEventListener('click', handleOptions);
    document.getElementById('credits-button').addEventListener('click', handleCredits);

    // Apply localization to elements specific to this screen
    _localizationInstance.updateLocalizedElements();
}

/**
 * Handles the click event for the "Play Game" button.
 * (Placeholder - will transition to Character Selection screen)
 */
function handlePlayGame() {
    console.log("Play Game button clicked!");
    // Future: Transition to character selection screen
    // _gameInstance.setScreen('character-select');
    alert("Play Game clicked! Character selection coming soon."); // Using alert for temporary feedback
}

/**
 * Handles the click event for the "Options" button.
 * (Placeholder - will open options menu)
 */
function handleOptions() {
    console.log("Options button clicked!");
    // Future: Open options modal/screen
    alert("Options clicked! Functionality to be implemented."); // Using alert for temporary feedback
}

/**
 * Handles the click event for the "Credits" button.
 * (Placeholder - will open credits screen)
 */
function handleCredits() {
    console.log("Credits button clicked!");
    // Future: Open credits screen
    alert("Credits clicked! Functionality to be implemented."); // Using alert for temporary feedback
} 
