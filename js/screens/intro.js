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
    const setup = () => {
        console.log("Intro screen setup running.");
        document.getElementById('play-game-button')?.addEventListener('click', handlePlayGame);
        document.getElementById('options-button')?.addEventListener('click', handleOptions);
        document.getElementById('credits-button')?.addEventListener('click', handleCredits);
        _gameInstance.getSystem('localization').updateLocalizedElements();
    };
    requestAnimationFrame(setup);
}

function handlePlayGame() {
    console.log("Play Game button clicked! Transitioning to Character Selection...");
    _gameInstance.setScreen('character-select');
}

function handleOptions() {
    console.log("Options button clicked!");
    alert("Options functionality to be implemented.");
}

function handleCredits() {
    console.log("Credits button clicked!");
    alert("Credits functionality to be implemented.");
}