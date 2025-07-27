// filename: js/screens/battle.js
let _game;
let _gameState;
let _combatSystem;
const ui = {}; // Cache for DOM elements

export function init(gameInstance) {
    _game = gameInstance;
    _gameState = _game.getSystem('gameState');
    _combatSystem = _game.getSystem('combatSystem');
    
    const setup = () => {
        cacheDOMElements();
        setupEventListeners();
        updateBattleUI();
        
        // Initialize the battle in combat system if not already done
        if (_gameState.current.enemies.length > 0 && !_combatSystem.currentBattle) {
            _combatSystem.startBattle(_gameState.current.enemies);
        }
        
        // Start the first turn
        if (_combatSystem.currentBattle) {
            _combatSystem.startNextTurn();
        }
    };
    requestAnimationFrame(setup);
}

function cacheDOMElements() {
    ui.playerName = document.getElementById('player-name');
    ui.playerHpText = document.getElementById('player-hp-text');
    ui.playerHpBar = document.getElementById('player-hp-bar');
    ui.playerResourceText = document.getElementById('player-resource-text');
    ui.playerResourceBar = document.getElementById('player-resource-bar');
    
    ui.enemyName = document.getElementById('enemy-name');
    ui.enemyHpText = document.getElementById('enemy-hp-text');
    ui.enemyHpBar = document.getElementById('enemy-hp-bar');
    
    ui.floorNumber = document.getElementById('floor-number');
    ui.goldCount = document.getElementById('gold-count');
    
    ui.actionButtons = document.querySelectorAll('.action-button');
    ui.floatingTextZone = document.getElementById('floating-text-zone');
    ui.combatLog = document.getElementById('combat-log');
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
    if (!ui.playerName) return; // UI not ready

    // Get the authoritative state from the CombatSystem if a battle is active.
    const battle = _combatSystem.currentBattle;
    const player = battle ? battle.player : _gameState.current.player;
    const enemy = battle ? (battle.enemies.length > 0 ? battle.enemies[0] : null) : null;

    if (!player) return; // Cannot update UI without a player

    // Update Player UI
    ui.playerName.textContent = player.name;
    ui.playerHpText.textContent = `${Math.round(player.stats.hp)}/${player.stats.maxHp}`;
    ui.playerHpBar.style.width = `${(player.stats.hp / player.stats.maxHp) * 100}%`;
    ui.playerResourceText.textContent = `${Math.round(player.resource.current)}/${player.resource.max}`;
    ui.playerResourceBar.style.width = `${(player.resource.current / player.resource.max) * 100}%`;
    ui.playerResourceBar.className = `bar-fill ${player.resource.name.toLowerCase()}-bar`;

    // Update Enemy UI
    if (enemy) {
        ui.enemyName.textContent = enemy.name;
        ui.enemyHpText.textContent = `${Math.round(enemy.stats.hp)}/${enemy.stats.maxHp}`;
        ui.enemyHpBar.style.width = `${(enemy.stats.hp / enemy.stats.maxHp) * 100}%`;
    } else {
        // Clear enemy UI if no enemy
        ui.enemyName.textContent = '-';
        ui.enemyHpText.textContent = '-/-';
        ui.enemyHpBar.style.width = '0%';
    }
    
    ui.floorNumber.textContent = _gameState.current.currentFloor;
    ui.goldCount.textContent = _gameState.current.gold;
}

export function enablePlayerActions(isEnabled) {
    if (!ui.actionButtons) return;
    ui.actionButtons.forEach(button => button.disabled = !isEnabled);
}

export function animateCharacter(characterBoxId, animationType) {
    const character = document.getElementById(characterBoxId);
    if (!character) return;
    character.classList.add(animationType);
    character.addEventListener('animationend', () => character.classList.remove(animationType), { once: true });
}

export function showFloatingText(text, type, isCritical = false) {
    if (!ui.floatingTextZone) return;
    const span = document.createElement('span');
    span.className = `floating-text ${type} ${isCritical ? 'critical' : ''}`;
    span.innerText = text;
    span.style.left = (type === 'heal') ? '25%' : '75%';
    
    ui.floatingTextZone.appendChild(span);
    span.addEventListener('animationend', () => span.remove(), { once: true });
}

export function addCombatLog(text, type = '') {
    if (!ui.combatLog) return;
    
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    entry.textContent = text;
    ui.combatLog.appendChild(entry);
    
    // Keep only last 8 entries and auto-scroll
    while (ui.combatLog.children.length > 8) {
        ui.combatLog.removeChild(ui.combatLog.firstChild);
    }
    
    // Smooth scroll to bottom
    ui.combatLog.scrollTop = ui.combatLog.scrollHeight;
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