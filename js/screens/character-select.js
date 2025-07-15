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
    // Character Tile buttons
    document.querySelectorAll('.character-tile').forEach(tile => {
        tile.addEventListener('click', () => selectCharacter(tile.dataset.charId));
    });

    // Action buttons
    document.getElementById('details-btn').addEventListener('click', showDetailsModal);
    document.getElementById('select-btn').addEventListener('click', handleStartGame);
    document.getElementById('close-details-modal').addEventListener('click', closeDetailsModal);


    // Add listener for language change to update character details
    // Note: Localization class handles global updates, but specific dynamic content needs re-render
    document.getElementById('language-toggle').addEventListener('click', () => {
        // After localization updates, re-display the currently selected character
        displayCharacter(_selectedCharId);
    });

    // Setup swipe functionality for character tiles
    setupSwipeEvents();
}

/**
 * Handles the selection of a character tile.
 * Updates active tile styling and displays the selected character's details.
 * @param {string} charId - The ID of the character to select (e.g., 'warrior').
 * @private
 */
function selectCharacter(charId) {
    _selectedCharId = charId;

    // Update active tile styling
    document.querySelectorAll('.character-tile').forEach(tile => {
        tile.classList.remove('active');
    });
    document.querySelector(`.character-tile[data-char-id="${charId}"]`).classList.add('active');

    displayCharacter(charId);
}

/**
 * Generates an SVG string for a character portrait.
 * @param {string} charId - The ID of the character (e.g., 'warrior', 'sorceress', 'rogue').
 * @returns {string} The SVG string for the character's portrait.
 */
function getCharacterPortraitSVG(charId) {
    // These are simple placeholder SVGs. In a real game, you'd have more detailed art.
    switch (charId) {
        case 'warrior':
            return `
                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="50" r="40" fill="#5c4423" stroke="#d4a656" stroke-width="3"/>
                    <path d="M50 10 L65 40 L50 30 L35 40 Z" fill="#d4a656"/> <!-- Helmet crest -->
                    <rect x="45" y="45" width="10" height="20" fill="#f8e4c0"/> <!-- Body -->
                    <circle cx="50" cy="35" r="15" fill="#f8e4c0"/> <!-- Head -->
                    <path d="M40 55 H60 V70 H40 Z" fill="#d4a656"/> <!-- Armor -->
                    <path d="M40 70 L30 80 L70 80 L60 70 Z" fill="#5c4423"/> <!-- Legs -->
                    <path d="M50 10 V0" stroke="#d4a656" stroke-width="2"/> <!-- Helmet spike -->
                </svg>
            `;
        case 'sorceress':
            return `
                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="50" r="40" fill="#191970" stroke="#4169e1" stroke-width="3"/>
                    <path d="M50 15 L70 40 L50 50 L30 40 Z" fill="#87ceeb"/> <!-- Hat -->
                    <circle cx="50" cy="40" r="15" fill="#f8e4c0"/> <!-- Head -->
                    <rect x="45" y="50" width="10" height="20" fill="#4169e1"/> <!-- Robe -->
                    <circle cx="50" cy="75" r="5" fill="#f8e4c0"/> <!-- Magic orb -->
                    <path d="M50 15 L50 0" stroke="#87ceeb" stroke-width="2"/> <!-- Hat tip -->
                </svg>
            `;
        case 'rogue':
            return `
                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="50" r="40" fill="#27ae60" stroke="#9b59b6" stroke-width="3"/>
                    <path d="M30 40 L50 20 L70 40 L50 60 Z" fill="#9b59b6"/> <!-- Hood -->
                    <circle cx="50" cy="40" r="15" fill="#f8e4c0"/> <!-- Head -->
                    <rect x="45" y="50" width="10" height="20" fill="#9b59b6"/> <!-- Tunic -->
                    <path d="M30 60 L20 70 L80 70 L70 60 Z" fill="#27ae60"/> <!-- Cape -->
                    <path d="M40 55 L35 60 L40 65" stroke="#f8e4c0" stroke-width="2"/> <!-- Dagger hint -->
                </svg>
            `;
        default:
            return '';
    }
}

/**
 * Displays the details (name, title, traits, portrait) of the selected character in the hero showcase.
 * @param {string} charId - The ID of the character to display.
 * @private
 */
function displayCharacter(charId) {
    const character = Characters[charId.toUpperCase()];
    if (!character) {
        console.error(`Character data not found for ID: ${charId}`);
        return;
    }

    // Update hero showcase elements
    document.getElementById('hero-name').textContent = _localizationInstance.getCurrentLanguage() === 'ar' ? character.name_ar : character.name;
    document.getElementById('hero-title').textContent = _localizationInstance.getCurrentLanguage() === 'ar' ? character.role_ar || character.role : character.role; // Using role as title for now

    const portraitContainer = document.querySelector('.hero-portrait-container');
    if (portraitContainer) {
        portraitContainer.innerHTML = getCharacterPortraitSVG(charId);
    }

    // Update traits
    const traitsContainer = document.getElementById('hero-traits');
    traitsContainer.innerHTML = ''; // Clear previous traits

    // Map character specialization to localized traits
    const specializationKeys = {
        '🛡️ High DEF, ❤️ High HP': ['highDefenseTrait', 'resoluteTrait'], // Example mapping for Warrior
        '🔮 AoE, ❄️ Crowd Control': ['elementalMagicTrait', 'spellMasteryTrait'], // Example mapping for Sorceress
        '⚡ High SPD, 💥 High Crit': ['berserkerRageTrait', 'rawStrengthTrait'] // Example mapping for Rogue
    };

    const currentSpecialization = _localizationInstance.getCurrentLanguage() === 'ar' ? character.specialization_ar || character.specialization : character.specialization;
    const traitsToDisplay = specializationKeys[currentSpecialization] || [currentSpecialization]; // Fallback to raw specialization if no mapping

    traitsToDisplay.forEach(traitKey => {
        const traitItem = document.createElement('div');
        traitItem.classList.add('trait-item');
        // Use a simple icon or emoji for the trait, or the first character of the localized trait
        const icon = character.specialization.includes('DEF') ? '🛡️' :
                     character.specialization.includes('AoE') ? '🔮' :
                     character.specialization.includes('SPD') ? '⚡' : '✨'; // Fallback icon
        traitItem.innerHTML = `
            <span class="trait-icon">${icon}</span>
            <span>${_localizationInstance.get(traitKey)}</span>
        `;
        traitsContainer.appendChild(traitItem);
    });

    // Update tile icons in the roster
    document.querySelectorAll('.character-tile').forEach(tile => {
        const tileCharId = tile.dataset.charId;
        const tileIconContainer = tile.querySelector('.tile-icon');
        if (tileIconContainer) {
            // Use a simpler SVG or just the first letter of the localized name for tile icons
            const tileChar = Characters[tileCharId.toUpperCase()];
            if (tileChar) {
                // For tile icons, we can use a very simplified version or just text
                tileIconContainer.innerHTML = getCharacterPortraitSVG(tileCharId); // Reusing full portrait SVG for tile for consistency
            }
        }
    });

    // Update modal content (for details button)
    const modalDescription = document.getElementById('modal-description');
    if (modalDescription) {
        modalDescription.textContent = _localizationInstance.getCurrentLanguage() === 'ar' ? character.description_ar : character.description_en;
    }
    document.getElementById('modal-stat-hp').textContent = character.baseStats.hp;
    document.getElementById('modal-stat-resource').textContent = `${character.baseStats.resource} ${character.resourceIcon} ${_localizationInstance.get(`${character.resource.toLowerCase()}Resource`)}`;
    document.getElementById('modal-stat-atk').textContent = character.baseStats.atk;
    document.getElementById('modal-stat-def').textContent = character.baseStats.def;
    document.getElementById('modal-stat-spd').textContent = character.baseStats.spd;
    document.getElementById('modal-stat-crit').textContent = `${character.baseStats.crit}%`;
}

/**
 * Shows the character details modal.
 * @private
 */
function showDetailsModal() {
    document.getElementById('details-modal').classList.remove('hidden');
    console.log(`Showing details for selected character: ${_selectedCharId}`);
}

/**
 * Closes the character details modal.
 * @private
 */
function closeDetailsModal() {
    document.getElementById('details-modal').classList.add('hidden');
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


/**
 * Sets up swipe functionality for character tiles on mobile.
 * @private
 */
function setupSwipeEvents() {
    let startX = 0;
    let endX = 0;
    const characterTilesContainer = document.getElementById('character-tiles');

    characterTilesContainer.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });

    characterTilesContainer.addEventListener('touchmove', (e) => {
        endX = e.touches[0].clientX;
    });

    characterTilesContainer.addEventListener('touchend', () => {
        const diff = startX - endX;
        const threshold = 50; // Minimum swipe distance

        if (Math.abs(diff) > threshold) {
            const tiles = Array.from(document.querySelectorAll('.character-tile'));
            let currentIndex = tiles.findIndex(tile => tile.classList.contains('active'));

            if (diff > 0) { // Swiped left (show next character)
                currentIndex = (currentIndex + 1) % tiles.length;
            } else { // Swiped right (show previous character)
                currentIndex = (currentIndex - 1 + tiles.length) % tiles.length;
            }
            tiles[currentIndex].click(); // Simulate click on the new active tile
        }
        // Reset for next swipe
        startX = 0;
        endX = 0;
    });
}