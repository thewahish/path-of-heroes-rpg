// filename: js/screens/battle.js
let _game;
let _gameState;
let _combatSystem;

export function init(gameInstance) {
    _game = gameInstance;
    _gameState = _game.getSystem('gameState');
    _combatSystem = _game.getSystem('combatSystem');
    
    const setup = () => {
        setupEventListeners();
        updateBattleUI();
        _combatSystem.startNextTurn();
    };
    requestAnimationFrame(setup);
}

function setupEventListeners() {
    document.getElementById('attack-btn')?.addEventListener('click', () => _combatSystem.playerAttack());
    document.getElementById('skill-btn')?.addEventListener('click', () => _combatSystem.playerSkill());
    document.getElementById('defend-btn')?.addEventListener('click', () => _combatSystem.playerDefend());
    document.getElementById('flee-btn')?.addEventListener('click', () => _combatSystem.playerFlee());
    document.getElementById('potion-btn')?.addEventListener('click', () => console.log("Potion button clicked"));
    document.getElementById('inventory-btn')?.addEventListener('click', () => console.log("Inventory button clicked"));
}

export function updateBattleUI() {
    if (!_gameState?.current.gameStarted) return;
    const player = _gameState.current.player;
    const enemy = _gameState.current.enemies[0];

    // Update Player UI
    document.getElementById('player-name').textContent = player.name;
    document.getElementById('player-hp-text').textContent = `${player.stats.hp}/${player.stats.maxHp}`;
    document.getElementById('player-hp-bar').style.width = `${(player.stats.hp / player.stats.maxHp) * 100}%`;
    document.getElementById('player-resource-text').textContent = `${player.resource.current}/${player.resource.max}`;
    const resourceBar = document.getElementById('player-resource-bar');
    resourceBar.style.width = `${(player.resource.current / player.resource.max) * 100}%`;
    resourceBar.className = `bar-fill ${player.resource.name.toLowerCase()}-bar`;

    // Update Enemy UI
    if (enemy) {
        document.getElementById('enemy-name').textContent = enemy.name;
        document.getElementById('enemy-hp-text').textContent = `${enemy.stats.hp}/${enemy.stats.maxHp}`;
        document.getElementById('enemy-hp-bar').style.width = `${(enemy.stats.hp / enemy.stats.maxHp) * 100}%`;
    }
    
    document.getElementById('floor-number').textContent = _gameState.current.currentFloor;
    document.getElementById('gold-count').textContent = _gameState.current.gold;
}

export function enablePlayerActions(isEnabled) {
    document.querySelectorAll('.action-button').forEach(button => button.disabled = !isEnabled);
}

export function animateCharacter(characterBoxId, animationType) {
    const character = document.getElementById(characterBoxId);
    if (!character) return;
    character.classList.add(animationType);
    setTimeout(() => character.classList.remove(animationType), 400);
}

export function showFloatingText(text, type, isCritical = false) {
    const zone = document.getElementById('floating-text-zone');
    if (!zone) return;
    const span = document.createElement('span');
    span.className = `floating-text ${type} ${isCritical ? 'critical' : ''}`;
    span.innerText = text;
    span.style.left = (type === 'heal') ? '25%' : '75%';
    
    zone.appendChild(span);
    setTimeout(() => span.remove(), 1400);
}

// NEW FUNCTIONS ADDED BELOW - These are the missing functions that combat.js needs

export function addCombatLog(text, type = '') {
    const log = document.getElementById('combat-log');
    if (!log) return;
    
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    entry.textContent = text;
    log.appendChild(entry);
    
    // Keep only last 8 entries and auto-scroll
    while (log.children.length > 8) {
        log.removeChild(log.firstChild);
    }
    
    // Smooth scroll to bottom
    log.scrollTop = log.scrollHeight;
}

export function showBossWarning(text) {
    const warning = document.createElement('div');
    warning.className = 'boss-ability-warning';
    warning.textContent = text;
    document.body.appendChild(warning);
    setTimeout(() => warning.remove(), 2000);
}

export function setBossCharging(isCharging) {
    const enemyBox = document.getElementById('enemy-box');
    if (isCharging) {
        enemyBox.classList.add('charging');
    } else {
        enemyBox.classList.remove('charging');
    }
}