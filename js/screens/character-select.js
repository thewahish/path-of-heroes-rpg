 // filename: js/screens/character-select.js

/**
 * @fileoverview JavaScript logic for the Character Selection screen.
 * This module handles character tab selection, displays character details,
 * and manages the "Start Game" button functionality.
 */

import { Characters } from '../core/characters.js';

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
 * @private
 * @type {string}
 * Stores the ID of the currently selected character.
 */
let _selectedCharId = Characters.WARRIOR.id; // Default to Warrior

/**
 * Initializes the Character Selection screen's functionality.
 * This function is called by game.js when the screen is loaded.
 * @param {import('../core/game.js').PathOfHeroes} gameInstance - The main game instance.
 * @param {import('../core/localization.js').Localization} localizationInstance - The localization system instance.
 */
export function init(gameInstance, localizationInstance) {
    _gameInstance = gameInstance;
    _localizationInstance = localizationInstance;
    console.log("Character Selection screen initialized.");

    setupEventListeners();
    displayCharacter(_selectedCharId); // Display default character on load
    _localizationInstance.updateLocalizedElements(); // Apply initial localization
}

/**
 * Sets up all event listeners for the character selection screen elements.
 * @private
 */
function setupEventListeners() {
    // Character Tab buttons
    document.getElementById('tab-warrior').addEventListener('click', () => selectCharacter(Characters.WARRIOR.id));
    document.getElementById('tab-sorceress').addEventListener('click', () => selectCharacter(Characters.SORCERESS.id));
    document.getElementById('tab-rogue').addEventListener('click', () => selectCharacter(Characters.ROGUE.id));

    // Start Game button
    document.getElementById('start-game-button').addEventListener('click', handleStartGame);

    // Add listener for language change to update character details
    // Note: Localization class handles global updates, but specific dynamic content needs re-render
    document.getElementById('language-toggle').addEventListener('click', () => {
        // After localization updates, re-display the currently selected character
        displayCharacter(_selectedCharId);
    });
}

/**
 * Handles the selection of a character tab.
 * Updates active tab styling and displays the selected character's details.
 * @param {string} charId - The ID of the character to select (e.g., 'warrior').
 * @private
 */
function selectCharacter(charId) {
    _selectedCharId = charId;

    // Update active tab styling
    document.querySelectorAll('.char-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(`tab-${charId}`).classList.add('active');

    displayCharacter(charId);
}

/**
 * Displays the details (name, description, stats, portrait) of the selected character.
 * @param {string} charId - The ID of the character to display.
 * @private
 */
function displayCharacter(charId) {
    const character = Characters[charId.toUpperCase()]; // Get character data from Characters module
    if (!character) {
        console.error(`Character data not found for ID: ${charId}`);
        return;
    }

    // Update character name
    document.getElementById('character-name').textContent = _localizationInstance.getCurrentLanguage() === 'ar' ? character.name_ar : character.name;

    // Update portrait (placeholder for now)
    const portraitImg = document.getElementById('char-portrait-img');
    if (portraitImg) {
        portraitImg.src = `assets/images/placeholder_${charId}.png`; // Example: assets/images/placeholder_warrior.png
        portraitImg.alt = `${character.name} Portrait`;
    }

    // Update character description, role, specialization
    document.getElementById('character-description').textContent = _localizationInstance.getCurrentLanguage() === 'ar' ? character.description_ar : character.description_en;
    document.getElementById('character-role').textContent = _localizationInstance.getCurrentLanguage() === 'ar' ? character.role_ar || character.role : character.role; // Assuming role might be localized directly in Characters or via localization.js
    document.getElementById('character-specialization').textContent = _localizationInstance.getCurrentLanguage() === 'ar' ? character.specialization_ar || character.specialization : character.specialization;


    // Update stats
    document.getElementById('stat-hp').textContent = character.baseStats.hp;
    document.getElementById('stat-resource').textContent = `${character.baseStats.resource} ${character.resourceIcon} ${character.resource}`; // e.g., "60 🟣 Vigor"
    document.getElementById('stat-atk').textContent = character.baseStats.atk;
    document.getElementById('stat-def').textContent = character.baseStats.def;
    document.getElementById('stat-spd').textContent = character.baseStats.spd;
    document.getElementById('stat-crit').textContent = `${character.baseStats.crit}%`;
}

/**
 * Handles the click event for the "Start Game" button.
 * (Placeholder - will initiate game start with selected character)
 * @private
 */
function handleStartGame() {
    console.log(`Starting game with selected character: ${_selectedCharId}`);
    alert(`Game starting with ${_selectedCharId}! (Dungeon generation coming soon)`);
    // Future: Initialize game state with selected character and transition to first dungeon floor
    // _gameInstance.startGame(_selectedCharId);
}
