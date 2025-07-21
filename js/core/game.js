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
        createBackgroundParticles();
        _game.getSystem('localization').updateLocalizedElements();
        
        // Start the battle if it hasn't been started yet
        if (_gameState.current.battleInProgress && _combatSystem.currentBattle) {
            _combatSystem.startNextTurn();
        }
    };
    requestAnimationFrame(setup);
}

function setupEventListeners() {
    document.getElementById('attack-btn')?.addEventListener('click', () => {
        console.log("Attack button clicked");
        _combatSystem.playerAttack();
    });
    
    document.getElementById('skill-btn')?.addEventListener('click', () => {
        console.log("Skill button clicked");
        _combatSystem.playerSkill();
    });
    
    document.getElementById('defend-btn')?.addEventListener('click', () => {
        console.log("Defend button clicked");
        _combatSystem.playerDefend();
    });
    
    document.getElementById('flee-btn')?.addEventListener('click', () => {
        console.log("Flee button clicked");
        _combatSystem.playerFlee();
    });
    
    document.getElementById('potion-btn')?.addEventListener('click', () => {
        console.log("Potion button clicked");
        handlePotionClick();
    });
    
    document.getElementById('inventory-btn')?.addEventListener('click', () => {
        console.log("Inventory button clicked");
        handleInventoryClick();
    });
}

export function updateBattleUI() {
    if (!_gameState?.current?.gameStarted) {
        console.warn("Game not started, cannot update battle UI");
        return;
    }
    
    const player = _gameState.current.player;
    const enemy = _gameState.current.enemies[0];
    
    if (!player) {
        console.error("Player data not found");
        return;
    }
    
    // Update Player UI
    const playerNameEl = document.getElementById('player-name');
    const playerHpTextEl = document.getElementById('player-hp-text');
    const playerHpBarEl = document.getElementById('player-hp-bar');
    const playerResourceTextEl = document.getElementById('player-resource-text');
    const playerResourceBarEl = document.getElementById('player-resource-bar');
    
    if (playerNameEl) playerNameEl.textContent = player.name;
    if (playerHpTextEl) playerHpTextEl.textContent = `${player.stats.hp}/${player.stats.maxHp}`;
    if (playerHpBarEl) {
        const hpPercent = (player.stats.hp / player.stats.maxHp) * 100;
        playerHpBarEl.style.width = `${hpPercent}%`;
    }
    
    if (playerResourceTextEl) playerResourceTextEl.textContent = `${player.resource.current}/${player.resource.max}`;
    if (playerResourceBarEl) {
        const resourcePercent = (player.resource.current / player.resource.max) * 100;
        playerResourceBarEl.style.width = `${resourcePercent}%`;
        playerResourceBarEl.className = `bar-fill ${player.resource.name.toLowerCase()}-bar`;
    }
    
    // Update Enemy UI
    if (enemy) {
        const enemyNameEl = document.getElementById('enemy-name');
        const enemyHpTextEl = document.getElementById('enemy-hp-text');
        const enemyHpBarEl = document.getElementById('enemy-hp-bar');
        
        if (enemyNameEl) enemyNameEl.textContent = enemy.name;
        if (enemyHpTextEl) enemyHpTextEl.textContent = `${enemy.stats.hp}/${enemy.stats.maxHp}`;
        if (enemyHpBarEl) {
            const enemyHpPercent = (enemy.stats.hp / enemy.stats.maxHp) * 100;
            enemyHpBarEl.style.width = `${enemyHpPercent}%`;
        }
    }
    
    // Update top bar
    const floorEl = document.getElementById('floor-number');
    const goldEl = document.getElementById('gold-count');
    if (floorEl) floorEl.textContent = _gameState.current.currentFloor;
    if (goldEl) goldEl.textContent = _gameState.current.gold;
}

export function enablePlayerActions(isEnabled) {
    const actionButtons = document.querySelectorAll('.action-button');
    actionButtons.forEach(button => {
        button.disabled = !isEnabled;
        if (isEnabled) {
            button.style.opacity = '1';
            button.style.cursor = 'pointer';
        } else {
            button.style.opacity = '0.6';
            button.style.cursor = 'not-allowed';
        }
    });
    
    console.log(`Player actions ${isEnabled ? 'enabled' : 'disabled'}`);
}

export function animateCharacter(characterBoxId, animationType) {
    const character = document.getElementById(characterBoxId);
    if (!character) {
        console.warn(`Character box with ID '${characterBoxId}' not found`);
        return;
    }
    
    character.classList.add(animationType);
    setTimeout(() => {
        character.classList.remove(animationType);
    }, 400);
}

export function showFloatingText(text, type, isCritical = false) {
    const zone = document.getElementById('floating-text-zone');
    if (!zone) {
        console.warn("Floating text zone not found");
        return;
    }
    
    const span = document.createElement('span');
    span.className = `floating-text ${type} ${isCritical ? 'critical' : ''}`;
    span.textContent = text;
    
    // Position based on type
    span.style.position = 'absolute';
    span.style.left = (type === 'heal') ? '25%' : '75%';
    span.style.top = '50%';
    span.style.color = isCritical ? '#ff6b6b' : (type === 'heal' ? '#4ecdc4' : '#f39c12');
    span.style.fontSize = isCritical ? '1.5em' : '1.2em';
    span.style.fontWeight = 'bold';
    span.style.textShadow = '2px 2px 4px rgba(0,0,0,0.8)';
    span.style.animation = 'floatUp 1.4s ease-out forwards';
    span.style.pointerEvents = 'none';
    span.style.zIndex = '1000';
    
    zone.appendChild(span);
    
    setTimeout(() => {
        if (span.parentNode) {
            span.remove();
        }
    }, 1400);
}

function handlePotionClick() {
    const inventory = _gameState.current.inventory;
    const potions = inventory.filter(item => item.consumable && item.effect === 'heal_hp');
    
    if (potions.length === 0) {
        alert("No health potions available!");
        return;
    }
    
    // Use the first available potion
    const potion = potions[0];
    const inventorySystem = _game.getSystem('inventorySystem');
    const success = inventorySystem.useItem(potion);
    
    if (success) {
        updateBattleUI();
        showFloatingText(`+${potion.value}`, 'heal');
        // End the player's turn after using a potion
        setTimeout(() => _combatSystem.endTurn(), 800);
    }
}

function handleInventoryClick() {
    // For now, just show a message - full inventory integration would be more complex
    alert("Inventory opened! (Full inventory system integration pending)");
    
    // Log current inventory for debugging
    console.log("Current inventory:", _gameState.current.inventory);
    console.log("Equipped items:", _gameState.current.equipped);
}

function createBackgroundParticles() {
    const particlesContainer = document.querySelector('.background-particles');
    if (!particlesContainer) return;
    
    // Clear existing particles
    particlesContainer.innerHTML = '';
    
    // Create floating particles for ambiance
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 8 + 's';
        particle.style.animationDuration = (6 + Math.random() * 4) + 's';
        particlesContainer.appendChild(particle);
    }
}