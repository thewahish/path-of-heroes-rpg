// filename: js/screens/character-select.js

import { Characters } from '../core/characters.js';

let _gameInstance;
let _selectedCharId = Characters.WARRIOR.id;

export function init(gameInstance) {
    _gameInstance = gameInstance;
    
    const setup = () => {
        console.log("Character Select setup running.");
        setupEventListeners();
        displayCharacter(_selectedCharId);
        _gameInstance.getSystem('localization').updateLocalizedElements();
    };

    // Use a classic setTimeout to ensure the DOM is fully interactive.
    setTimeout(setup, 0);
}

function setupEventListeners() {
    document.querySelectorAll('.character-tile').forEach(tile => {
        tile.addEventListener('click', () => {
            console.log(`Event: Click detected on tile with data-char-id: ${tile.dataset.charId}`);
            selectCharacter(tile.dataset.charId);
        });
    });

    document.getElementById('details-btn')?.addEventListener('click', () => {
        console.log("Event: Click detected on Details button.");
        showDetailsModal();
    });

    document.getElementById('select-btn')?.addEventListener('click', () => {
        console.log("Event: Click detected on Start button.");
        handleStartGame();
    });

    document.getElementById('close-details-modal')?.addEventListener('click', () => {
        console.log("Event: Click detected on Modal Close button.");
        closeDetailsModal();
    });

    document.getElementById('language-toggle')?.addEventListener('click', () => {
        // A brief timeout is still needed here because the language toggle is global
        // and needs to wait for the localization system to update all text first.
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
    const loc = _gameInstance.getSystem('localization');
    const lang = loc.getCurrentLanguage();

    document.getElementById('hero-name').textContent = lang === 'ar' ? character.name_ar : character.name;
    document.getElementById('hero-title').textContent = lang === 'ar' ? character.role_ar : character.role;
    document.getElementById('hero-portrait-container').innerHTML = getCharacterPortraitSVG(charId);
    
    const traitsContainer = document.getElementById('hero-traits');
    if(traitsContainer) {
        traitsContainer.innerHTML = '';
        character.traits.forEach(key => {
            const el = document.createElement('div');
            el.className = 'trait-item';
            let icon = '✨';
            if (key === 'highDefenseTrait') icon = '🛡️';
            el.innerHTML = `<span class="trait-icon">${icon}</span><span>${loc.get(key)}</span>`;
            traitsContainer.appendChild(el);
        });
    }

    const modal = document.getElementById('details-modal');
    if (modal) {
        modal.querySelector('#modal-hero-name').textContent = lang === 'ar' ? character.name_ar : character.name;
        modal.querySelector('#modal-description').textContent = lang === 'ar' ? character.description_ar : character.description_en;
        modal.querySelector('#modal-stat-hp').textContent = character.baseStats.hp;
        modal.querySelector('#modal-stat-resource').textContent = `${character.baseStats.resource} ${character.resourceIcon} ${loc.get(`${character.resource.toLowerCase()}Resource`)}`;
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
        case 'warrior': return `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="#5c4423" stroke="#d4a656" stroke-width="4"/><path d="M50 15 L70 45 L50 35 L30 45 Z" fill="#d4a656"/></svg>`;
        case 'sorceress': return `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="#191970" stroke="#4169e1" stroke-width="4"/><path d="M50 20 L75 50 L50 80 L25 50 Z" fill="#87ceeb"/></svg>`;
        case 'rogue': return `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="#27ae60" stroke="#9b59b6" stroke-width="4"/><path d="M50 25 L65 40 L50 75 L35 40 Z" fill="#9b59b6"/></svg>`;
        default: return '';
    }
}

function showDetailsModal() {
    document.getElementById('details-modal')?.classList.remove('hidden');
}

function closeDetailsModal() {
    document.getElementById('details-modal')?.classList.add('hidden');
}

function setupSwipeEvents() {
    let startX = 0;
    const container = document.getElementById('character-tiles');
    if (!container) return;
    container.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    container.addEventListener('touchend', e => {
        if (Math.abs(startX - e.changedTouches[0].clientX) > 50) {
            const tiles = Array.from(document.querySelectorAll('.character-tile'));
            let currentIndex = tiles.findIndex(tile => tile.classList.contains('active'));
            let direction = (startX - e.changedTouches[0].clientX > 0) ? 1 : -1;
            const lang = _gameInstance.getSystem('localization').getCurrentLanguage();
            if (lang === 'ar') direction *= -1;
            currentIndex = (currentIndex + direction + tiles.length) % tiles.length;
            tiles[currentIndex].click();
        }
    }, { passive: true });
}