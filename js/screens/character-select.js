// filename: js/screens/character-select.js

/**
 * @fileoverview JavaScript logic for the Character Selection screen.
 */

import { Characters } from '../core/characters.js';

let _gameInstance;
let _selectedCharId = Characters.WARRIOR.id;

/**
 * Initializes the Character Selection screen's functionality.
 * @param {import('../core/game.js').PathOfHeroes} gameInstance - The main game instance.
 */
export function init(gameInstance) {
    _gameInstance = gameInstance;
    console.log("Character Selection screen initialized.");

    setupEventListeners();
    displayCharacter(_selectedCharId);
    _gameInstance.getSystem('localization').updateLocalizedElements();
}

/**
 * Sets up all event listeners for the screen.
 * @private
 */
function setupEventListeners() {
    document.querySelectorAll('.character-tile').forEach(tile => {
        tile.addEventListener('click', () => selectCharacter(tile.dataset.charId));
    });

    document.getElementById('details-btn').addEventListener('click', showDetailsModal);
    document.getElementById('select-btn').addEventListener('click', handleStartGame);
    document.getElementById('close-details-modal')?.addEventListener('click', closeDetailsModal);

    // Add listener for language change to update character details
    document.getElementById('language-toggle')?.addEventListener('click', () => {
        setTimeout(() => displayCharacter(_selectedCharId), 0);
    });

    setupSwipeEvents();
}

/**
 * Handles the selection of a character tile.
 * @param {string} charId
 * @private
 */
function selectCharacter(charId) {
    _selectedCharId = charId;
    document.querySelectorAll('.character-tile').forEach(tile => {
        tile.classList.remove('active');
    });
    document.querySelector(`.character-tile[data-char-id="${charId}"]`).classList.add('active');
    displayCharacter(charId);
}

/**
 * Displays the details of the selected character.
 * @param {string} charId
 * @private
 */
function displayCharacter(charId) {
    const character = Characters[charId.toUpperCase()];
    if (!character) return;

    const localization = _gameInstance.getSystem('localization');
    const lang = localization.getCurrentLanguage();

    document.getElementById('hero-name').textContent = lang === 'ar' ? character.name_ar : character.name;
    document.getElementById('hero-title').textContent = lang === 'ar' ? character.role_ar : character.role;
    
    document.getElementById('hero-portrait-container').innerHTML = getCharacterPortraitSVG(charId);

    const traitsContainer = document.getElementById('hero-traits');
    traitsContainer.innerHTML = '';
    character.traits.forEach(traitKey => {
        const traitItem = document.createElement('div');
        traitItem.classList.add('trait-item');
        let icon = '✨';
        if (traitKey === 'highDefenseTrait') icon = '🛡️';
        traitItem.innerHTML = `<span class="trait-icon">${icon}</span><span>${localization.get(traitKey)}</span>`;
        traitsContainer.appendChild(traitItem);
    });

    // Update modal content
    const modal = document.getElementById('details-modal');
    if (modal) {
        modal.querySelector('#modal-hero-name').textContent = lang === 'ar' ? character.name_ar : character.name;
        modal.querySelector('#modal-description').textContent = lang === 'ar' ? character.description_ar : character.description_en;
        modal.querySelector('#modal-stat-hp').textContent = character.baseStats.hp;
        modal.querySelector('#modal-stat-resource').textContent = `${character.baseStats.resource} ${character.resourceIcon} ${localization.get(`${character.resource.toLowerCase()}Resource`)}`;
        modal.querySelector('#modal-stat-atk').textContent = character.baseStats.atk;
        modal.querySelector('#modal-stat-def').textContent = character.baseStats.def;
        modal.querySelector('#modal-stat-spd').textContent = character.baseStats.spd;
        modal.querySelector('#modal-stat-crit').textContent = `${character.baseStats.crit}%`;
    }
}

/**
 * Handles the "Start Game" button click.
 * @private
 */
function handleStartGame() {
    console.log(`Starting game with selected character: ${_selectedCharId}`);
    _gameInstance.startGame(_selectedCharId);
}

// --- Helper Functions for UI ---

function getCharacterPortraitSVG(charId) {
    // SVGs remain the same as previous versions...
    return ''; // Placeholder for brevity
}

function showDetailsModal() {
    document.getElementById('details-modal')?.classList.remove('hidden');
}

function closeDetailsModal() {
    document.getElementById('details-modal')?.classList.add('hidden');
}

function setupSwipeEvents() {
    // Swipe logic remains the same...
}