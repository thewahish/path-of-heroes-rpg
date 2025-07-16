// filename: js/systems/inventory.js

import { GameConfig } from '../core/config.js';

// Inventory System
export class InventorySystem {
    constructor(game) {
        this.game = game;
        this.tooltip = null;
    }

    init() {
        this.tooltip = document.getElementById('item-tooltip');
        if (this.tooltip) {
            this.setupEventListeners();
        }
    }

    setupEventListeners() {
        document.addEventListener('mousemove', e => this.updateTooltipPosition(e));
        document.addEventListener('click', () => this.hideTooltip());
    }

    generateItem(itemType, floor = 1, rarity = null) {
        const itemTemplate = GameConfig.ITEM_TYPES[itemType];
        if (!itemTemplate) {
            console.error('Unknown item type:', itemType);
            return null;
        }

        if (!rarity) {
            rarity = this.rollRarity();
        }

        const rarityData = GameConfig.RARITIES[rarity];
        const id = `${itemType}_${Date.now()}_${Math.random()}`;
        
        const prefix = Math.random() < 0.4 ? this.getRandomAffix('ITEM_PREFIXES') : null;
        const suffix = Math.random() < 0.3 ? this.getRandomAffix('ITEM_SUFFIXES') : null;
        
        const baseStats = { ...(itemTemplate.baseStats || {}) };
        const floorScaling = 1 + (floor - 1) * 0.1;
        
        let finalStats = {};
        Object.keys(baseStats).forEach(stat => {
            finalStats[stat] = Math.floor(baseStats[stat] * floorScaling * rarityData.statMult);
        });
        
        if (prefix && prefix.statMod) {
            Object.keys(prefix.statMod).forEach(stat => {
                finalStats[stat] = (finalStats[stat] || 0) + prefix.statMod[stat];
            });
        }
        if (suffix && suffix.statMod) {
            Object.keys(suffix.statMod).forEach(stat => {
                finalStats[stat] = (finalStats[stat] || 0) + suffix.statMod[stat];
            });
        }

        const localization = this.game.getSystem('localization'); // FIXED
        const lang = localization.getCurrentLanguage();
        let itemName = itemTemplate.name[lang] || itemTemplate.name.en;
        if (prefix) itemName = `${prefix.name[lang] || prefix.name.en} ${itemName}`;
        if (suffix) itemName = `${itemName} ${suffix.name[lang] || suffix.name.en}`;

        const basePrice = Math.floor((floor + 1) * rarityData.statMult * 5);
        
        return {
            id, type: itemType, name: itemName, rarity,
            slot: itemTemplate.slot,
            icon: itemTemplate.icon,
            stats: finalStats,
            level: floor,
            sellPrice: basePrice,
            description: itemTemplate.description ? (itemTemplate.description[lang] || itemTemplate.description.en) : '',
            consumable: itemTemplate.consumable || false,
            effect: itemTemplate.effect || null,
            value: itemTemplate.value || 0
        };
    }

    rollRarity() {
        const roll = Math.random() * 100;
        let cumulative = 0;
        
        for (const [rarity, data] of Object.entries(GameConfig.RARITIES)) {
            cumulative += data.chance;
            if (roll <= cumulative) {
                return rarity;
            }
        }
        return 'common';
    }

    getRandomAffix(affixType) {
        const affixes = GameConfig[affixType];
        return affixes[Math.floor(Math.random() * affixes.length)];
    }
    
    generateLootDrop(enemy, floor) {
        const itemTypes = Object.keys(GameConfig.ITEM_TYPES);
        const lootableItems = itemTypes.filter(type => GameConfig.ITEM_TYPES[type].slot !== null || GameConfig.ITEM_TYPES[type].consumable);
        const itemType = lootableItems[Math.floor(Math.random() * lootableItems.length)];
        
        return this.generateItem(itemType, floor);
    }

    useItem(item) {
        if (!item || !item.consumable) {
            console.log("Cannot use this item.");
            return false;
        }

        const gameState = this.game.getSystem('gameState');
        const player = gameState.current.player;
        let effectApplied = false;

        switch(item.effect) {
            case 'heal_hp':
                if (player.stats.hp < player.stats.maxHp) {
                    const healAmount = item.value || 25;
                    player.stats.hp = Math.min(player.stats.maxHp, player.stats.hp + healAmount);
                    this.game.updateElement('combat-log-text', `${player.name} uses a ${item.name} and recovers ${healAmount} HP.`);
                    effectApplied = true;
                } else {
                    alert("Health is already full!");
                }
                break;
            default:
                alert("This item has no effect in combat.");
                break;
        }

        if (effectApplied) {
            gameState.removeItemFromInventory(item);
            this.game.getSystem('battleUI').updateBattleDisplay();
        }
        
        return effectApplied;
    }

    equipItem(item) {
        if (!item || !item.slot) return false;
        
        const result = this.game.getSystem('gameState').equipItem(item);
        if (result) {
            this.updateDisplay();
            if (this.game.getSystem('gameState').current.battleInProgress) {
                this.game.getSystem('battleUI').updateBattleDisplay();
            }
        }
        return result;
    }

    unequipItem(slot) {
        const result = this.game.getSystem('gameState').unequipItem(slot);
        if (result) {
            this.updateDisplay();
            if (this.game.getSystem('gameState').current.battleInProgress) {
                this.game.getSystem('battleUI').updateBattleDisplay();
            }
        }
        return result;
    }

    sellItem(item) {
        if (!item || !item.sellPrice) return false;
        
        if (!confirm(`Sell ${item.name} for ${item.sellPrice} gold?`)) return false;
        
        const gameState = this.game.getSystem('gameState');
        const wasEquipped = Object.values(gameState.current.equipped).some(equipped => equipped && equipped.id === item.id);
        
        if (wasEquipped) {
            for (const [slot, equippedItem] of Object.entries(gameState.current.equipped)) {
                if (equippedItem && equippedItem.id === item.id) {
                    delete gameState.current.equipped[slot];
                    break;
                }
            }
        } else {
            gameState.removeItemFromInventory(item);
        }
        
        gameState.addGold(item.sellPrice);
        gameState.updatePlayerStats();
        this.updateDisplay();
        if (gameState.current.battleInProgress) {
            this.game.getSystem('battleUI').updateBattleDisplay();
        }
        return true;
    }

    sortItems() {
        this.game.getSystem('gameState').current.inventory.sort((a, b) => {
            const rarityOrder = ['legendary', 'mythic', 'epic', 'rare', 'uncommon', 'common'];
            const aRarityIndex = rarityOrder.indexOf(a.rarity);
            const bRarityIndex = rarityOrder.indexOf(b.rarity);
            
            if (aRarityIndex !== bRarityIndex) {
                return aRarityIndex - bRarityIndex;
            }
            
            return a.type.localeCompare(b.type);
        });
        
        this.updateDisplay();
    }

    sellAllCommon() {
        const gameState = this.game.getSystem('gameState');
        const commonItems = gameState.current.inventory.filter(item => item.rarity === 'common');
        if (commonItems.length === 0) {
            alert('No common items to sell!');
            return;
        }
        
        const totalValue = commonItems.reduce((sum, item) => sum + item.sellPrice, 0);
        if (confirm(`Sell ${commonItems.length} common items for ${totalValue} gold?`)) {
            commonItems.forEach(item => gameState.removeItemFromInventory(item));
            gameState.addGold(totalValue);
            this.updateDisplay();
        }
    }

    updateDisplay() {
        this.updateEquipmentGrid();
        this.updateInventoryGrid();
        this.updateCharacterStats();
    }

    updateEquipmentGrid() {
        const grid = document.getElementById('equipment-grid');
        if (!grid) return;
        
        grid.innerHTML = '';
        
        Object.entries(GameConfig.EQUIPMENT_SLOTS).forEach(([slot, slotData]) => {
            const slotElement = document.createElement('div');
            slotElement.className = 'equipment-slot';
            slotElement.dataset.slot = slot;
            
            const equippedItem = this.game.getSystem('gameState').current.equipped[slot];
            
            if (equippedItem) {
                slotElement.classList.add('occupied', `rarity-${equippedItem.rarity}`);
                slotElement.innerHTML = `<div class="item-icon">${equippedItem.icon}</div>`;
                this.addItemEventListeners(slotElement, equippedItem, true);
            } else {
                slotElement.innerHTML = `<div class="slot-icon-placeholder">${slotData.icon}</div>`;
            }
            
            grid.appendChild(slotElement);
        });
    }

    updateInventoryGrid() {
        const grid = document.getElementById('inventory-grid');
        if (!grid) return;
        
        grid.innerHTML = '';
        
        const maxSlots = GameConfig.INVENTORY.maxSlots;
        const inventory = this.game.getSystem('gameState').current.inventory;
        
        for (let i = 0; i < maxSlots; i++) {
            const slotElement = document.createElement('div');
            slotElement.className = 'inventory-slot';
            slotElement.dataset.index = i;
            
            if (i < inventory.length && inventory[i]) {
                const item = inventory[i];
                slotElement.classList.add(`rarity-${item.rarity}`);
                slotElement.innerHTML = `<div class="item-icon">${item.icon}</div>`;
                this.addItemEventListeners(slotElement, item, false);
            }
            
            grid.appendChild(slotElement);
        }
    }

    updateCharacterStats() {
        const statsTable = document.getElementById('inventory-stats-table');
        if (!statsTable) return;
        
        const player = this.game.getSystem('gameState').current.player;
        if (!player) return;
        
        const localization = this.game.getSystem('localization'); // FIXED
        const lang = localization.getCurrentLanguage();
        const stats = [
            { key: 'hp', value: `${player.stats.hp}/${player.stats.maxHp}` },
            { key: 'attack', value: player.stats.atk },
            { key: 'defense', value: player.stats.def },
            { key: 'speed', value: player.stats.spd },
            { key: 'crit', value: `${player.stats.crit}%` },
            { key: 'resource', label: player.resource.name, value: `${player.resource.current}/${player.resource.max}` }
        ];
        
        statsTable.innerHTML = stats.map(statInfo => {
            const locKeyMap = { 'attack': 'atk', 'defense': 'def', 'speed': 'spd' };
            const locKey = `stat.${locKeyMap[statInfo.key] || statInfo.key}`;
            const label = statInfo.label || localization.get(locKey); // FIXED
            return `<tr><td>${label}</td><td>${statInfo.value}</td></tr>`;
        }).join('');

        const title = document.getElementById('inventory-stats-title');
        if(title) {
            title.textContent = localization.get('inventory.stats'); // FIXED
        }
    }

    addItemEventListeners(element, item, isEquipped) {
        element.addEventListener('mouseenter', (e) => this.showTooltip(e, item));
        element.addEventListener('mouseleave', () => this.hideTooltip());
        element.addEventListener('click', (e) => {
            e.stopPropagation();
            this.handleItemClick(item, isEquipped);
        });
    }

    showTooltip(event, item) {
        if (!this.tooltip || !item) return;
        
        const lang = this.game.getSystem('localization').getCurrentLanguage(); // FIXED
        const rarityData = GameConfig.RARITIES[item.rarity];
        const slotData = GameConfig.EQUIPMENT_SLOTS[item.slot];
        
        this.tooltip.innerHTML = `
            <div class="tooltip-content">
                <div class="tooltip-header">
                    <div class="tooltip-name" style="color: ${rarityData.color};">${item.name}</div>
                    <div class="tooltip-type">${(slotData ? slotData.name[lang] : '') || ''} • ${rarityData.name[lang]}</div>
                </div>
                <hr class="divider">
                <div class="tooltip-stats">
                    ${Object.entries(item.stats).map(([stat, value]) => value !== 0 ? `<div class="tooltip-stat"><span>${stat.toUpperCase()}:</span><span>${value > 0 ? '+' : ''}${value}</span></div>` : '').join('')}
                </div>
                <div class="tooltip-description">${item.description}</div>
            </div>
        `;
        
        this.tooltip.classList.remove('hidden');
        this.updateTooltipPosition(event);
    }

    hideTooltip() {
        if (this.tooltip) {
            this.tooltip.classList.add('hidden');
        }
    }

    updateTooltipPosition(event) {
        if (!this.tooltip || this.tooltip.classList.contains('hidden')) return;
        
        const rect = this.tooltip.getBoundingClientRect();
        let x = event.clientX + 15;
        let y = event.clientY + 15;
        
        if (x + rect.width > window.innerWidth) x = event.clientX - rect.width - 15;
        if (y + rect.height > window.innerHeight) y = event.clientY - rect.height - 15;
        
        this.tooltip.style.left = `${x}px`;
        this.tooltip.style.top = `${y}px`;
    }

    handleItemClick(item, isEquipped) {
        if (isEquipped) {
            this.unequipItem(item.slot);
        } else {
            this.equipItem(item);
        }
        this.hideTooltip();
    }
};