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

    const setup = () => {
        console.log("Character Select setup running.");
        setupEventListeners();
        displayCharacter(_selectedCharId);
        _gameInstance.getSystem('localization').updateLocalizedElements();
    };
    
    requestAnimationFrame(setup);
}

function setupEventListeners() {
    document.querySelectorAll('.character-tile').forEach(tile => {
        tile.addEventListener('click', () => selectCharacter(tile.dataset.charId));
    });

    document.getElementById('details-btn')?.addEventListener('click', showDetailsModal);
    document.getElementById('select-btn')?.addEventListener('click', handleStartGame);
    document.getElementById('close-details-modal')?.addEventListener('click', closeDetailsModal);

    document.getElementById('language-toggle')?.addEventListener('click', () => {
        setTimeout(() => displayCharacter(_selectedCharId), 0);
    });

    setupSwipeEvents();
}

function selectCharacter(charId) {
    if (!charId) return;
    console.log(`selectCharacter called with ID: ${charId}`);
    
    _selectedCharId = charId;
    document.querySelectorAll('.character-tile').forEach(tile => {
        tile.classList.remove('active');
    });
    document.querySelector(`.character-tile[data-char-id="${charId}"]`)?.classList.add('active');
    displayCharacter(charId);
}

function displayCharacter(charId) {
    const character = Characters[charId.toUpperCase()];
    if (!character) return;
    const localization = _gameInstance.getSystem('localization');
    const lang = localization.getCurrentLanguage();

    document.getElementById('hero-name').textContent = lang === 'ar' ? character.name_ar : character.name;
    document.getElementById('hero-title').textContent = lang === 'ar' ? character.role_ar : character.role;
    document.getElementById('hero-portrait-container').innerHTML = getCharacterPortraitSVG(charId);
    
    const traitsContainer = document.getElementById('hero-traits');
    if(traitsContainer) {
        traitsContainer.innerHTML = '';
        character.traits.forEach(traitKey => {
            const traitItem = document.createElement('div');
            traitItem.classList.add('trait-item');
            let icon = '✨';
            if (traitKey === 'highDefenseTrait') icon = '🛡️';
            traitItem.innerHTML = `<span class="trait-icon">${icon}</span><span>${localization.get(traitKey)}</span>`;
            traitsContainer.appendChild(traitItem);
        });
    }

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

function handleStartGame() {
    _gameInstance.startGame(_selectedCharId);
}

function getCharacterPortraitSVG(charId) {
    switch (charId) {
        case 'warrior':
            return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="40" fill="#5c4423" stroke="#d4a656" stroke-width="3"/><path d="M50 10 L65 40 L50 30 L35 40 Z" fill="#d4a656"/><rect x="45" y="45" width="10" height="20" fill="#f8e4c0"/><circle cx="50" cy="35" r="15" fill="#f8e4c0"/><path d="M40 55 H60 V70 H40 Z" fill="#d4a656"/><path d="M40 70 L30 80 L70 80 L60 70 Z" fill="#5c4423"/><path d="M50 10 V0" stroke="#d4a656" stroke-width="2"/></svg>`;
        case 'sorceress':
            return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="40" fill="#191970" stroke="#4169e1" stroke-width="3"/><path d="M50 15 L70 40 L50 50 L30 40 Z" fill="#87ceeb"/><circle cx="50" cy="40" r="15" fill="#f8e4c0"/><rect x="45" y="50" width="10" height="20" fill="#4169e1"/><circle cx="50" cy="75" r="5" fill="#f8e4c0"/><path d="M50 15 L50 0" stroke="#87ceeb" stroke-width="2"/></svg>`;
        case 'rogue':
            return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="40" fill="#27ae60" stroke="#9b59b6" stroke-width="3"/><path d="M30 40 L50 20 L70 40 L50 60 Z" fill="#9b59b6"/><circle cx="50" cy="40" r="15" fill="#f8e4c0"/><rect x="45" y="50" width="10" height="20" fill="#9b59b6"/><path d="M30 60 L20 70 L80 70 L70 60 Z" fill="#27ae60"/><path d="M40 55 L35 60 L40 65" stroke="#f8e4c0" stroke-width="2"/></svg>`;
        default: return '';
    }
}

// RESTORED: Shows the character details modal.
function showDetailsModal() {
    const modal = document.getElementById('details-modal');
    if (modal) modal.classList.remove('hidden');
}

// RESTORED: Closes the character details modal.
function closeDetailsModal() {
    const modal = document.getElementById('details-modal');
    if (modal) modal.classList.add('hidden');
}

// RESTORED: Sets up swipe functionality.
function setupSwipeEvents() {
    let startX = 0;
    const characterTilesContainer = document.getElementById('character-tiles');
    if (!characterTilesContainer) return;

    characterTilesContainer.addEventListener('touchstart', e => {
        startX = e.touches[0].clientX;
    }, { passive: true });

    characterTilesContainer.addEventListener('touchend', e => {
        const endX = e.changedTouches[0].clientX;
        const diff = startX - endX;
        if (Math.abs(diff) > 50) {
            const tiles = Array.from(document.querySelectorAll('.character-tile'));
            let currentIndex = tiles.findIndex(tile => tile.classList.contains('active'));
            const lang = _gameInstance.getSystem('localization').getCurrentLanguage();
            if ((lang === 'ar' && diff < 0) || (lang !== 'ar' && diff > 0)) {
                currentIndex = (currentIndex + 1) % tiles.length;
            } else {
                currentIndex = (currentIndex - 1 + tiles.length) % tiles.length;
            }
            tiles[currentIndex].click();
        }
    }, { passive: true });
}