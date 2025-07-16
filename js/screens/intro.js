// filename: js/screens/intro.js

/**
 * @fileoverview JavaScript logic for the Intro (Main Menu) screen.
 */

let _gameInstance;

/**
 * Initializes the Intro screen's functionality.
 * @param {import('../core/game.js').PathOfHeroes} gameInstance - The main game instance.
 */
export function init(gameInstance) {
    _gameInstance = gameInstance;
    console.log("Intro screen initialized.");

    document.getElementById('play-game-button').addEventListener('click', handlePlayGame);
    document.getElementById('options-button').addEventListener('click', handleOptions);
    document.getElementById('credits-button').addEventListener('click', handleCredits);

    // Apply localization using the provided game instance
    _gameInstance.getSystem('localization').updateLocalizedElements();
}

/**
 * Transitions to the Character Selection screen.
 */
function handlePlayGame() {
    console.log("Play Game button clicked! Transitioning to Character Selection...");
    _gameInstance.setScreen('character-select');
}

/**
 * Placeholder for options functionality.
 */
function handleOptions() {
    console.log("Options button clicked!");
    alert("Options clicked! Functionality to be implemented.");
}

/**
 * Placeholder for credits functionality.
 */
function handleCredits() {
    console.log("Credits button clicked!");
    alert("Credits clicked! Functionality to be implemented.");
}